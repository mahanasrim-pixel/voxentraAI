/**
 * VOXENTRA Coimbatore Landmark Intelligence Service
 * 
 * Hierarchy:
 * Coimbatore -> Taluk -> Area / Locality -> Street / Road -> Landmark -> Coordinates
 * 
 * Features:
 * - Exact, Tamil, Tanglish, and Alias matching
 * - Fuzzy and phonetic matching (e.g. "Prozon mall" -> "Prozone Mall")
 * - Suffix stripping (-la, pakkam, pakkathula, kitta, near, etc.)
 * - Ambiguity handling (e.g. generic "railway station", "bus stand")
 * - Area inference from landmarks (e.g. Prozone Mall -> Saravanampatti)
 * - Precision attribution: NEAR_LANDMARK vs STREET vs EXACT
 */

const db = require('../db/connection');
const { COIMBATORE_LANDMARKS, LANDMARK_TYPES } = require('../db/coimbatoreLandmarks');

// Suffixes and markers attached to landmark names in speech
const LANDMARK_SUFFIX_PATTERNS = [
  /(?:-la|-le|-ley|[-_]la|[-_]le)\b/gi,
  /\b(?:la|le|ley|il|yil|kitta|pakkam|pakkathula|pakathula|side|near|opp|opposite|aduthu|munnadi|pinnadi|back|front|area)\b/gi,
  /(?:-ல்|ல்|யில்|பக்கம்|அருகில்|கிட்ட|முன்பு|பின்பு)\b/gu
];

function cleanToken(str = '') {
  return str
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'’]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function stripLandmarkSuffixes(text = '') {
  let cleaned = text;
  for (const pat of LANDMARK_SUFFIX_PATTERNS) {
    cleaned = cleaned.replace(pat, ' ');
  }
  return cleaned.replace(/\s+/g, ' ').trim();
}

function levenshteinDistance(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

class LandmarkService {
  constructor() {
    this.landmarks = COIMBATORE_LANDMARKS;
    this.buildLookupIndex();
  }

  buildLookupIndex() {
    this.exactMap = new Map();
    this.aliasList = [];

    for (const lm of this.landmarks) {
      // 1. Canonical Name
      const cNorm = cleanToken(lm.landmark_name);
      this.exactMap.set(cNorm, lm);
      this.exactMap.set(cNorm.replace(/\s+/g, ''), lm);

      // 2. Tamil Name
      if (lm.tamil_name) {
        const tNorm = cleanToken(lm.tamil_name);
        this.exactMap.set(tNorm, lm);
        this.exactMap.set(tNorm.replace(/\s+/g, ''), lm);
      }

      // 3. Aliases
      if (Array.isArray(lm.aliases)) {
        for (const alias of lm.aliases) {
          const aNorm = cleanToken(alias);
          this.exactMap.set(aNorm, lm);
          this.exactMap.set(aNorm.replace(/\s+/g, ''), lm);

          const stripped = stripLandmarkSuffixes(aNorm);
          if (stripped.length >= 3) {
            this.exactMap.set(stripped, lm);
            this.exactMap.set(stripped.replace(/\s+/g, ''), lm);
          }

          this.aliasList.push({
            alias: aNorm,
            stripped,
            landmark: lm
          });
        }
      }
    }

    // Sort alias list by longest token length first to avoid partial substring collisions
    this.aliasList.sort((a, b) => b.alias.length - a.alias.length);
  }

  /**
   * Check for ambiguous generic landmarks where citizen gave no area or qualifier
   * e.g. "railway station pakkathula" or "bus stand near"
   */
  checkAmbiguity(text = '', lang = 'Tanglish') {
    const rawClean = cleanToken(text);
    const stripped = stripLandmarkSuffixes(rawClean);
    const normLang = (lang || '').toUpperCase();

    // 1. Generic Railway Station without specific name
    const isGenericTrainStation = /\b(railway station|train station|ரயில் நிலையம்)\b/i.test(rawClean);
    const hasSpecificStation = /\b(coimbatore|cbe|podanur|mettupalayam|mtp|pollachi|junction|jn)\b/i.test(rawClean);

    if (isGenericTrainStation && !hasSpecificStation) {
      return {
        isAmbiguous: true,
        ambiguityType: 'RAILWAY_STATION',
        candidates: ['Coimbatore Junction', 'Podanur Junction', 'Mettupalayam Railway Station', 'Pollachi Junction'],
        clarificationPrompt: normLang === 'TAMIL'
          ? 'எந்த ரயில் நிலையத்தை குறிப்பிடுகிறீர்கள் (கோயம்புத்தூர் சந்திப்பு, போத்தனூர், அல்லது மேட்டுப்பாளையம்)?'
          : normLang === 'ENGLISH'
          ? 'Which railway station are you referring to (Coimbatore Junction, Podanur, or Mettupalayam)?'
          : 'Entha railway station-ah sollreenga (Coimbatore Junction, Podanur, illa Mettupalayam)?'
      };
    }

    // 2. Generic Bus Stand without specific area
    const isGenericBusStand = /\b(bus stand|bus stop|பேருந்து நிலையம்|பஸ் ஸ்டாண்ட்)\b/i.test(rawClean);
    const hasSpecificBusArea = /\b(gandhipuram|ukkadam|singanallur|mettupalayam|pollachi|thudiyalur|vadavalli|perur|central)\b/i.test(rawClean);

    if (isGenericBusStand && !hasSpecificBusArea) {
      // Check if text already contains a recognized area name
      const hasAreaName = this.landmarks.some(lm => rawClean.includes(cleanToken(lm.area)));
      if (!hasAreaName) {
        return {
          isAmbiguous: true,
          ambiguityType: 'BUS_STAND',
          candidates: ['Gandhipuram Bus Stand', 'Ukkadam Bus Stand', 'Singanallur Bus Stand', 'Mettupalayam Bus Stand'],
          clarificationPrompt: normLang === 'TAMIL'
            ? 'எந்த பேருந்து நிலையத்தை குறிப்பிடுகிறீர்கள் (காந்திபுரம், உக்கடம், அல்லது சிங்கநல்லூர்)?'
            : normLang === 'ENGLISH'
            ? 'Which bus stand are you referring to (Gandhipuram, Ukkadam, or Singanallur)?'
            : 'Entha bus stand-ah sollreenga (Gandhipuram, Ukkadam, illa Singanallur)?'
        };
      }
    }

    return { isAmbiguous: false };
  }

  /**
   * Find matching landmark from text using exact, alias, and fuzzy algorithms
   */
  findLandmark(text = '', targetArea = null) {
    if (!text || text.trim().length === 0) return null;

    const rawClean = cleanToken(text);
    const stripped = stripLandmarkSuffixes(rawClean);

    // 1. Direct Map Lookup
    if (this.exactMap.has(rawClean)) return this.exactMap.get(rawClean);
    if (this.exactMap.has(stripped)) return this.exactMap.get(stripped);

    // 2. Alias / Substring Matching (longest first)
    for (const item of this.aliasList) {
      if (item.alias.length < 3) continue;

      // Exact token boundary regex
      const aliasRegex = new RegExp(`\\b${item.alias.replace(/\s+/g, '\\s*')}(?:-?la|-?le|\\s+la|\\s+pakkam|\\s+pakkathula|\\s+pakathula|\\s+kitta|\\s+near|\\s+side|\\s+அருகில்)?\\b`, 'i');
      if (aliasRegex.test(rawClean) || aliasRegex.test(stripped)) {
        return item.landmark;
      }

      if (item.stripped && item.stripped.length >= 4) {
        const strippedRegex = new RegExp(`\\b${item.stripped.replace(/\s+/g, '\\s*')}\\b`, 'i');
        if (strippedRegex.test(stripped)) {
          return item.landmark;
        }
      }
    }

    // 3. Tamil Script Matching
    for (const lm of this.landmarks) {
      if (lm.tamil_name && (text.includes(lm.tamil_name) || stripped.includes(lm.tamil_name))) {
        return lm;
      }
    }

    // 4. Area-Constrained Landmark Match (if area is already known)
    if (targetArea) {
      const areaClean = cleanToken(targetArea);
      const areaLandmarks = this.landmarks.filter(lm => cleanToken(lm.area) === areaClean);

      for (const lm of areaLandmarks) {
        const cNorm = cleanToken(lm.landmark_name);
        if (rawClean.includes(cNorm) || stripped.includes(cNorm)) {
          return lm;
        }
      }
    }

    // 5. Fuzzy Spelling / Phonetic matching (e.g. "Prozon mall" -> "Prozone Mall")
    const words = stripped.split(/\s+/).filter(w => w.length >= 4);
    for (const lm of this.landmarks) {
      const cNorm = cleanToken(lm.landmark_name);
      // Check full string distance against normalized words
      for (let i = 0; i < words.length; i++) {
        // Single word or two-word chunk
        const chunk1 = words[i];
        const chunk2 = words[i + 1] ? `${words[i]} ${words[i + 1]}` : null;

        for (const alias of (lm.aliases || [])) {
          const aClean = cleanToken(alias);
          if (aClean.length < 4) continue;

          if (chunk2 && Math.abs(chunk2.length - aClean.length) <= 3) {
            const dist = levenshteinDistance(chunk2, aClean);
            if (dist <= 2 && dist / Math.max(chunk2.length, aClean.length) <= 0.25) {
              return lm;
            }
          }

          if (Math.abs(chunk1.length - aClean.length) <= 2) {
            const dist = levenshteinDistance(chunk1, aClean);
            if (dist <= 2 && dist / Math.max(chunk1.length, aClean.length) <= 0.25) {
              return lm;
            }
          }
        }
      }
    }

    return null;
  }

  /**
   * Resolve Landmark Intelligence Payload for a conversation turn
   */
  resolveLandmarkIntelligence(text = '', activeArea = null, lang = 'Tanglish') {
    const ambiguity = this.checkAmbiguity(text, lang);
    if (ambiguity.isAmbiguous) {
      return {
        matched: false,
        isAmbiguous: true,
        ambiguityType: ambiguity.ambiguityType,
        clarificationPrompt: ambiguity.clarificationPrompt,
        landmark: null
      };
    }

    const matchedLandmark = this.findLandmark(text, activeArea);
    if (!matchedLandmark) {
      return {
        matched: false,
        isAmbiguous: false,
        landmark: null
      };
    }

    return {
      matched: true,
      isAmbiguous: false,
      landmarkId: matchedLandmark.landmark_id,
      landmarkName: matchedLandmark.landmark_name,
      tamilName: matchedLandmark.tamil_name,
      landmarkType: matchedLandmark.landmark_type,
      district: matchedLandmark.district,
      taluk: matchedLandmark.taluk,
      area: matchedLandmark.area,
      street: matchedLandmark.street,
      road: matchedLandmark.road,
      latitude: matchedLandmark.latitude,
      longitude: matchedLandmark.longitude,
      address: matchedLandmark.address
    };
  }

  /**
   * Seed SQLite database with master landmarks
   */
  async seedLandmarksDatabase() {
    try {
      const existing = await db.get(`SELECT COUNT(*) as count FROM landmarks`);
      if (existing && existing.count >= this.landmarks.length) {
        return;
      }

      console.log(`[LANDMARKS] Seeding ${this.landmarks.length} Coimbatore landmarks into SQLite...`);
      for (const lm of this.landmarks) {
        await db.run(
          `INSERT OR REPLACE INTO landmarks (
            landmark_id, landmark_name, tamil_name, aliases, landmark_type,
            district, taluk, area, street, road, latitude, longitude, address, search_keywords
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            lm.landmark_id,
            lm.landmark_name,
            lm.tamil_name || null,
            JSON.stringify(lm.aliases || []),
            lm.landmark_type,
            lm.district || 'Coimbatore',
            lm.taluk || null,
            lm.area,
            lm.street || null,
            lm.road || null,
            lm.latitude,
            lm.longitude,
            lm.address || null,
            lm.search_keywords || null
          ]
        );
      }
      console.log(`[LANDMARKS] Coimbatore landmarks seeded successfully.`);
    } catch (err) {
      console.warn('[LANDMARKS] Database seed warning:', err.message);
    }
  }

  /**
   * Get all registered landmarks from SQLite or in-memory
   */
  async getAllLandmarks() {
    try {
      const rows = await db.all(`SELECT * FROM landmarks ORDER BY landmark_name ASC`);
      if (rows && rows.length > 0) return rows;
    } catch (e) {
      console.warn('Falling back to memory landmarks:', e.message);
    }
    return this.landmarks;
  }
}

const landmarkService = new LandmarkService();

module.exports = landmarkService;
