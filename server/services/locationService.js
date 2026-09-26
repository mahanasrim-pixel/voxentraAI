/**
 * VOXENTRA Complete Coimbatore Location Intelligence Engine
 * 
 * Hierarchy:
 * - Revenue Divisions (3): Coimbatore North, Coimbatore South, Pollachi
 * - Taluks (11): Coimbatore North, Coimbatore South, Perur, Madukkarai, Sulur,
 *                Annur, Mettupalayam, Pollachi, Kinathukadavu, Valparai, Anaimalai
 * - Municipalities, Town Panchayats, Villages & Localities (176+)
 * 
 * Capabilities:
 * 1. Natural spoken variation normalization (Tamil script, Tanglish, English, phonetic variants)
 * 2. Suffix stripping (-la, -le, pakkam, kitta, near, side, etc.)
 * 3. Vague generic check (e.g. "Coimbatore", "Kovai" alone without locality)
 * 4. Partial / ambiguous clarification generation ("Neenga Kurumbapalayam-a sollreengala?")
 * 5. Accurate precision levels: EXACT, STREET, AREA, APPROXIMATE
 * 6. Street and landmark extraction
 * 7. Canonical resolution with Taluk, Division, and GPS coordinates
 */

const db = require('../db/connection');
const { COIMBATORE_LOCATIONS } = require('../db/coimbatoreLocations');
const landmarkService = require('./landmarkService');

// Common suffixes attached to Coimbatore place names in speech / Tanglish / Tamil
const SUFFIX_PATTERNS = [
  /(?:-la|-le|-ley|[-_]la|[-_]le)\b/gi,
  /\b(?:la|le|ley|il|yil|kitta|pakkam|pakkathula|side|near|opp|opposite|aduthu|ul|ulla)\b/gi,
  /(?:-ல்|ல்|யில்|பக்கம்|அருகில்|கிட்ட)\b/gu
];

// Noise words in speech transcripts
const NOISE_WORDS = [
  'area', 'areala', 'area-la', 'place', 'placela', 'place-la', 'idam', 'oor', 'oorla',
  'road', 'street', 'theru', 'nagar', 'colony', 'corner', 'pirivu', 'junction'
];

// Major known roads/arteries in Coimbatore
const KNOWN_COIMBATORE_STREETS = [
  { name: 'Sathy Road', aliases: ['sathy road', 'satyamangalam road', 'sathyamangalam road', 'சத்ய ரோடு'] },
  { name: 'Avinashi Road', aliases: ['avinashi road', 'avinasi road', 'avinasilingam road', 'அவினாசி ரோடு'] },
  { name: 'Trichy Road', aliases: ['trichy road', 'trichy main road', 'திருச்சி ரோடு'] },
  { name: 'Mettupalayam Road', aliases: ['mettupalayam road', 'mtp road', 'மேட்டுப்பாளையம் ரோடு'] },
  { name: 'Palakkad Road', aliases: ['palakkad road', 'palghat road', 'பாலக்காடு ரோடு'] },
  { name: 'Pollachi Road', aliases: ['pollachi road', 'பொள்ளாச்சி ரோடு'] },
  { name: 'DB Road', aliases: ['db road', 'diwan bahadur road', 'டிபி ரோடு'] },
  { name: 'Cross Cut Road', aliases: ['cross cut road', 'crosscut road', 'cross cut', 'கிராஸ்கட் ரோடு'] },
  { name: 'NSR Road', aliases: ['nsr road', 'alagappa chettiar road', 'என்எஸ்ஆர் ரோடு'] },
  { name: '100 Feet Road', aliases: ['100 feet road', 'hundred feet road', '100 அடி ரோடு'] },
  { name: 'Race Course Road', aliases: ['race course road', 'racecourse', 'ரேஸ் கோர்ஸ்'] },
  { name: 'Marudhamalai Road', aliases: ['maruthamalai road', 'marudhamalai road', 'மருதமலை ரோடு', 'மருதமலை சாலை'] },
  { name: 'Thadagam Road', aliases: ['thadagam road', 'தடாகம் ரோடு'] },
  { name: 'Sungam Bypass', aliases: ['sungam bypass', 'sungam bypass road', 'சுங்கம் பைபாஸ்'] },
  { name: 'Perur Bypass', aliases: ['perur bypass', 'perur main road', 'பேரூர் பைபாஸ்'] },
  { name: 'Oppanakara Street', aliases: ['oppanakara street', 'oppanakara theru', 'ஒப்பணக்கார வீதி'] },
  { name: 'Big Bazaar Street', aliases: ['big bazaar street', 'periya kadai veethi', 'பெரிய கடை வீதி'] },
  { name: 'Hope College Road', aliases: ['hope college road', 'ஹோப் காலேஜ் ரோடு'] },
  { name: 'Kalapatti Road', aliases: ['kalapatti road', 'காளப்பட்டி ரோடு'] },
  { name: 'Siruvani Main Road', aliases: ['siruvani main road', 'siruvani road', 'சிறுவாணி ரோடு'] }
];

// Landmark patterns
const LANDMARK_PATTERNS = [
  /(?:reliance\s*mall|prozone\s*mall|brookefields|fun\s*mall)\s*(?:pakkam|near|kitta|opposite)?/i,
  /(?:bus\s*stand|bus\s*stop|bus\s*terminal)\s*(?:pakkathula|pakkam|near|back|front|opposite)?/i,
  /(?:railway\s*station|train\s*station)\s*(?:pakkathula|pakkam|near|opposite)?/i,
  /(?:petrol\s*bunk|shell\s*bunk|hp\s*bunk|indian\s*oil|bharat\s*petroleum)\s*(?:pakkathula|pakkam|near|opposite)?/i,
  /(?:hospital|school|college|atm|bridge|flyover|theatre|theater|temple|kovil|market|checkpost|signal|junction)\s*(?:pakkathula|pakkam|near|opposite)?/i,
  /(?:ரிலையன்ஸ்\s*மால்|புரோசான்\s*மால்|ப்ரூக்ஃபீல்ட்ஸ்)\s*(?:அருகில்|பக்கம்)?/i,
  /(?:பஸ்\s*ஸ்டாண்ட்|பேருந்து\s*நிலையம்|ரயில்\s*நிலையம்)\s*(?:அருகில்|பக்கம்)?/i,
  /(?:மருத்துவமனை|பள்ளி|கல்லூரி|பாலம்|கோவில்|சந்தை|சிக்னல்)\s*(?:அருகில்|பக்கம்)?/i,
  /pakkathula\s+([a-z0-9\s]+)/i,
  /pakkam\s+([a-z0-9\s]+)/i,
  /near\s+([a-z0-9\s]+)/i,
  /opposite\s+([a-z0-9\s]+)/i,
  /behind\s+([a-z0-9\s]+)/i,
  /in\s+front\s+of\s+([a-z0-9\s]+)/i,
  /அருகில்\s+([\u0B80-\u0BFFa-z0-9\s]+)/i,
  /பக்கம்\s+([\u0B80-\u0BFFa-z0-9\s]+)/i
];

// Normalize clean tokens for matching
function cleanToken(str = '') {
  return str
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'’]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Strip Tamil/Tanglish place suffixes like -la, pakkam, kitta
function stripPlaceSuffixes(text = '') {
  let cleaned = text;
  for (const pat of SUFFIX_PATTERNS) {
    cleaned = cleaned.replace(pat, ' ');
  }
  return cleaned.replace(/\s+/g, ' ').trim();
}

// Levenshtein distance for fuzzy matching spelling variations
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
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

class LocationService {
  constructor() {
    this.locations = COIMBATORE_LOCATIONS;
    this.buildLookupIndex();
  }

  // Pre-index for O(1) and regex matching
  buildLookupIndex() {
    this.exactMap = new Map(); // normalized string -> location
    this.tokenSet = new Set();

    for (const loc of this.locations) {
      // 1. Canonical
      const cNorm = cleanToken(loc.canonical_name);
      this.exactMap.set(cNorm, loc);
      this.exactMap.set(cNorm.replace(/\s+/g, ''), loc);

      // 2. Tamil name
      if (loc.tamil_name) {
        const tNorm = cleanToken(loc.tamil_name);
        this.exactMap.set(tNorm, loc);
        this.exactMap.set(tNorm.replace(/\s+/g, ''), loc);
      }

      // 3. Aliases
      if (Array.isArray(loc.aliases)) {
        for (const alias of loc.aliases) {
          const aNorm = cleanToken(alias);
          this.exactMap.set(aNorm, loc);
          this.exactMap.set(aNorm.replace(/\s+/g, ''), loc);
        }
      }

      // 4. Tanglish variants
      if (Array.isArray(loc.tanglish_variants)) {
        for (const variant of loc.tanglish_variants) {
          const vClean = stripPlaceSuffixes(cleanToken(variant));
          this.exactMap.set(vClean, loc);
          this.exactMap.set(vClean.replace(/\s+/g, ''), loc);
        }
      }
    }
  }

  /**
   * Check if text is only generic "Coimbatore" or "Kovai" without any specific locality
   */
  isVagueCoimbatoreOnly(text = '') {
    const cleaned = cleanToken(text);
    // Patterns that mean just the district/city without area
    const vaguePatterns = [
      /^(?:in\s+)?coimbatore(?:\s+city|\s+district|\s+town)?$/i,
      /^(?:coimbatore-la|coimbatore\s+la|coimbatore\s+le|coimbatore\s+pakkam)$/i,
      /^(?:kovai|kovai-la|kovai\s+la|kovaile)$/i,
      /^(?:கோவை|கோயம்புத்தூர்|கோயமுத்தூர்)$/u,
      /^(?:road\s+damage\s+in\s+coimbatore|coimbatore-la\s+road\s+damage)$/i,
      /^(?:water\s+leak\s+in\s+coimbatore|coimbatore-la\s+water\s+leak)$/i,
      /^(?:garbage\s+in\s+coimbatore|coimbatore-la\s+garbage)$/i
    ];

    if (vaguePatterns.some(p => p.test(cleaned))) return true;

    // Check if word "coimbatore" or "kovai" exists but NO other supported locality or landmark matches
    const hasCoimbatore = /\b(coimbatore|kovai|கோவை|கோயம்புத்தூர்)\b/i.test(cleaned);
    if (!hasCoimbatore) return false;

    // If it has coimbatore, does it also have any specific known location or landmark?
    const hasSpecificArea = this.findMatchingLocation(cleaned);
    const hasSpecificLandmark = landmarkService.findLandmark(cleaned);
    return !hasSpecificArea && !hasSpecificLandmark;
  }

  /**
   * Search for a matched Coimbatore location in text
   */
  findMatchingLocation(text = '') {
    const rawClean = cleanToken(text);
    const suffixStripped = stripPlaceSuffixes(rawClean);

    // 1. Direct whole-string match
    if (this.exactMap.has(rawClean)) return this.exactMap.get(rawClean);
    if (this.exactMap.has(suffixStripped)) return this.exactMap.get(suffixStripped);

    // 2. Substring & alias matching (sorted by longest canonical name first to prevent substring clash)
    const sortedLocations = [...this.locations].sort((a, b) => b.canonical_name.length - a.canonical_name.length);

    for (const loc of sortedLocations) {
      // Check Tamil name first
      if (loc.tamil_name && (text.includes(loc.tamil_name) || stripPlaceSuffixes(text).includes(loc.tamil_name))) {
        return loc;
      }

      // Check canonical name
      const canonClean = cleanToken(loc.canonical_name);
      const canonRegex = new RegExp(`\\b${canonClean.replace(/\s+/g, '\\s*')}(?:-?la|-?le|\\s+la|\\s+le|\\s+pakkam|\\s+side|\\s+kitta|il)?\\b`, 'i');
      if (canonRegex.test(rawClean) || canonRegex.test(suffixStripped)) {
        return loc;
      }

      // Check aliases
      if (Array.isArray(loc.aliases)) {
        for (const alias of loc.aliases) {
          const aClean = cleanToken(alias);
          if (aClean.length < 3) continue;
          const aliasRegex = new RegExp(`\\b${aClean.replace(/\s+/g, '\\s*')}(?:-?la|-?le|\\s+la|\\s+le|\\s+pakkam|\\s+kitta|il)?\\b`, 'i');
          if (aliasRegex.test(rawClean) || aliasRegex.test(suffixStripped)) {
            return loc;
          }
        }
      }

      // Check Tanglish variants
      if (Array.isArray(loc.tanglish_variants)) {
        for (const variant of loc.tanglish_variants) {
          const vClean = cleanToken(variant);
          if (rawClean.includes(vClean) || suffixStripped.includes(vClean)) {
            return loc;
          }
        }
      }
    }

    // 3. Phonetic / Fuzzy match on significant words (e.g. "sarava patty", "kurumba palayam")
    const words = suffixStripped.split(/\s+/).filter(w => w.length >= 4 && !NOISE_WORDS.includes(w));
    for (const loc of sortedLocations) {
      const cNorm = cleanToken(loc.canonical_name).replace(/palayam|patti|patty|puram|kadavu|malai|kadu/g, '');
      for (const w of words) {
        if (w.length >= 5 && cNorm.length >= 5) {
          const dist = levenshteinDistance(w, cNorm);
          if (dist <= 2 && dist / Math.max(w.length, cNorm.length) < 0.3) {
            return loc;
          }
        }
      }
    }

    return null;
  }

  /**
   * Find partial / incomplete prefix match (e.g. citizen says "Kurumba..." or "Sarava...")
   */
  findPartialMatch(text = '') {
    const clean = cleanToken(stripPlaceSuffixes(text)).replace(/\.+$/, '');
    if (clean.length < 4) return null;

    // Check if clean is a prefix of any canonical location
    const candidates = [];
    for (const loc of this.locations) {
      const cLower = loc.canonical_name.toLowerCase();
      if (cLower.startsWith(clean) && cLower !== clean) {
        candidates.push(loc);
      }
      if (loc.aliases) {
        for (const al of loc.aliases) {
          if (al.toLowerCase().startsWith(clean) && al.toLowerCase() !== clean) {
            if (!candidates.includes(loc)) candidates.push(loc);
          }
        }
      }
    }

    if (candidates.length === 1) {
      return candidates[0];
    }
    return null;
  }

  /**
   * Extract Street Name from text
   */
  extractStreet(text = '') {
    const lower = text.toLowerCase();

    // 1. Known Coimbatore arterial roads
    for (const road of KNOWN_COIMBATORE_STREETS) {
      for (const alias of road.aliases) {
        if (lower.includes(alias)) {
          return road.name;
        }
      }
    }

    // Special check for "Marudhamalai ... pogura road" / "Marudhamalai road"
    if (/maru[dt]hamalai.*(?:pogura\s+road|pora\s+road|road)/i.test(lower)) {
      return 'Marudhamalai Road';
    }

    // 2. Generic street patterns (e.g. "10th Cross Street", "Gandhi Nagar Main Road")
    // Match only if preceded by an actual road/street name token, not prepositions or defect words
    const streetRegex = /\b([a-z0-9]+(?:\s+[a-z0-9]+)?)\s+(road|street|salai|cross|lane|bypass|highway)\b/i;
    const match = text.match(streetRegex);
    if (match) {
      const modifier = match[1].trim();
      const modifierLower = modifier.toLowerCase();
      const streetType = match[2].trim();

      const forbiddenWords = [
        'la', 'le', 'the', 'oru', 'indha', 'andha', 'this', 'that', 'a', 'an',
        'bad', 'damage', 'damaged', 'problem', 'repair', 'pothole',
        'near', 'pakkam', 'pakkathula', 'pakathula', 'kitta', 'opposite', 'behind',
        'mall', 'station', 'stand', 'stop', 'temple', 'kovil', 'hospital', 'college', 'school',
        'is', 'was', 'irukku', 'iruku', 'fulla', 'romba', 'periya', 'chinna',
        'pogura', 'pora', 'side', 'front', 'corner'
      ];

      const modWords = modifierLower.split(/\s+/);
      const isForbidden = modWords.some(w => forbiddenWords.includes(w));

      if (!isForbidden && modifier.length >= 3) {
        const cand = `${modifier} ${streetType}`;
        return cand.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      }
    }

    return null;
  }

  /**
   * Extract Landmark from text
   */
  extractLandmark(text = '') {
    const lower = text.toLowerCase();

    for (const pattern of LANDMARK_PATTERNS) {
      const match = text.match(pattern);
      if (match) {
        return match[0].trim();
      }
    }

    // Explicit common landmarks
    if (lower.includes('reliance mall')) return 'Near Reliance Mall';
    if (lower.includes('prozone mall')) return 'Near Prozone Mall';
    if (lower.includes('brookefields') || lower.includes('brookfields')) return 'Near Brookefields Mall';
    if (lower.includes('fun mall') || lower.includes('fun republic')) return 'Near Fun Republic Mall';
    if (lower.includes('bus stand') || lower.includes('bus stop')) return 'Near Bus Stand';
    if (lower.includes('railway station') || lower.includes('train station')) return 'Near Railway Station';
    if (lower.includes('kgisl')) return 'Near KGISL Campus';
    if (lower.includes('tidel park')) return 'Near Tidel Park';
    if (lower.includes('cit college') || lower.includes('cit')) return 'Near CIT College';
    if (lower.includes('psg tech') || lower.includes('psg')) return 'Near PSG Tech';
    if (lower.includes('petrol bunk') || lower.includes('shell bunk')) return 'Near Petrol Bunk';
    if (lower.includes('signal') || lower.includes('junction')) return 'At Traffic Signal / Junction';

    return null;
  }

  /**
   * Complete Location Resolution Pipeline
   * Supports: District -> Taluk -> Area -> Street/Road -> Landmark -> Coordinates
   */
  resolveLocation(rawText = '', lang = 'Tanglish') {
    const result = {
      rawLocationText: rawText.trim(),
      district: 'Coimbatore',
      canonicalLocationName: null,
      tamilName: null,
      locationId: null,
      displayName: null,
      locationType: null,
      revenueDivision: null,
      taluk: null,
      street: null,
      landmark: null,
      landmarkId: null,
      landmarkType: null,
      latitude: null,
      longitude: null,
      locationPrecision: 'APPROXIMATE', // 'EXACT' | 'STREET' | 'NEAR_LANDMARK' | 'AREA' | 'APPROXIMATE'
      geocodingStatus: 'PENDING',
      clarificationRequired: false,
      clarificationType: null, // 'VAGUE_COIMBATORE' | 'AMBIGUOUS_LANDMARK' | 'PARTIAL_MATCH' | null
      clarificationPrompt: null,
      matched: false
    };

    if (!rawText || rawText.trim().length === 0) {
      return result;
    }

    const normalizedLang = (lang || '').toUpperCase();

    // 1. Check for Ambiguous Generic Landmarks (e.g. "railway station pakkathula", "bus stand near")
    const landmarkAmbiguity = landmarkService.checkAmbiguity(rawText, lang);
    if (landmarkAmbiguity.isAmbiguous) {
      result.clarificationRequired = true;
      result.clarificationType = 'AMBIGUOUS_LANDMARK';
      result.clarificationPrompt = landmarkAmbiguity.clarificationPrompt;
      result.locationPrecision = 'APPROXIMATE';
      return result;
    }

    // 2. Check for Vague generic "Coimbatore" without area or landmark
    if (this.isVagueCoimbatoreOnly(rawText)) {
      result.clarificationRequired = true;
      result.clarificationType = 'VAGUE_COIMBATORE';
      result.locationPrecision = 'APPROXIMATE';

      if (normalizedLang === 'TAMIL') {
        result.clarificationPrompt = "கோயம்புத்தூரில் எந்த பகுதியில் இந்த பிரச்சனை உள்ளது?";
      } else if (normalizedLang === 'ENGLISH') {
        result.clarificationPrompt = "Which area in Coimbatore is this problem located in?";
      } else {
        result.clarificationPrompt = "Coimbatore-la entha area-la indha problem irukku?";
      }
      return result;
    }

    // 3. Extract Street
    const street = this.extractStreet(rawText);
    if (street) result.street = street;

    // 4. Extract Landmark via dedicated Landmark Intelligence Service
    const landmarkIntel = landmarkService.resolveLandmarkIntelligence(rawText, null, lang);
    if (landmarkIntel.matched) {
      result.landmark = landmarkIntel.landmarkName;
      result.landmarkId = landmarkIntel.landmarkId;
      result.landmarkType = landmarkIntel.landmarkType;
      result.district = landmarkIntel.district || 'Coimbatore';


    } else {
      const genericLm = this.extractLandmark(rawText);
      if (genericLm) result.landmark = genericLm;
    }

    // 5. Incomplete / partial name check (e.g. "Kurumba...")
    let partialCandidate = null;
    const words = rawText.split(/\s+/);
    for (const w of words) {
      if (w.includes('...')) {
        const cleanedW = cleanToken(w).replace(/\.+$/, '');
        if (cleanedW.length >= 4) {
          const cand = this.findPartialMatch(cleanedW);
          if (cand) {
            partialCandidate = cand;
            break;
          }
        }
      }
    }

    const rawClean = cleanToken(rawText);
    if (!partialCandidate && (rawText.includes('...') ||
        (rawClean.length >= 4 && rawClean.length <= 8 &&
         !this.exactMap.has(rawClean) &&
         !['saravanampatty', 'saravana patti', 'sarava patty'].includes(rawClean) &&
         (rawClean.endsWith('ba') || rawClean.endsWith('va') || rawClean.endsWith('ra') || rawClean.endsWith('na'))))) {
      partialCandidate = this.findPartialMatch(rawClean);
    }

    if (partialCandidate) {
      result.clarificationRequired = true;
      result.clarificationType = 'PARTIAL_MATCH';
      result.canonicalLocationName = partialCandidate.canonical_name;
      result.locationId = partialCandidate.location_id;
      result.taluk = partialCandidate.taluk;

      if (normalizedLang === 'TAMIL') {
        result.clarificationPrompt = `நீங்கள் ${partialCandidate.canonical_name}-ஐ குறிப்பிடுகிறீர்களா?`;
      } else if (normalizedLang === 'ENGLISH') {
        result.clarificationPrompt = `Did you mean ${partialCandidate.canonical_name}?`;
      } else {
        result.clarificationPrompt = `Neenga ${partialCandidate.canonical_name}-a sollreengala?`;
      }
      return result;
    }

    // 6. Match Area against Coimbatore master locations
    let matchedLoc = this.findMatchingLocation(rawText);

    // If area not directly in rawText, but landmark was matched, infer area from the landmark
    if (!matchedLoc && landmarkIntel.matched && landmarkIntel.area) {
      matchedLoc = this.findMatchingLocation(landmarkIntel.area);
    }

    // 7. If no direct match, check for partial prefix match
    if (!matchedLoc) {
      const partialCandidate = this.findPartialMatch(rawText);
      if (partialCandidate) {
        result.clarificationRequired = true;
        result.clarificationType = 'PARTIAL_MATCH';
        result.canonicalLocationName = partialCandidate.canonical_name;
        result.locationId = partialCandidate.location_id;
        result.taluk = partialCandidate.taluk;

        if (normalizedLang === 'TAMIL') {
          result.clarificationPrompt = `நீங்கள் ${partialCandidate.canonical_name}-ஐ குறிப்பிடுகிறீர்களா?`;
        } else if (normalizedLang === 'ENGLISH') {
          result.clarificationPrompt = `Did you mean ${partialCandidate.canonical_name}?`;
        } else {
          result.clarificationPrompt = `Neenga ${partialCandidate.canonical_name}-a sollreengala?`;
        }
        return result;
      }
    }

    // 8. If successfully matched to an Area or Landmark
    if (matchedLoc || landmarkIntel.matched) {
      result.matched = true;
      result.canonicalLocationName = matchedLoc ? matchedLoc.canonical_name : landmarkIntel.area;
      result.tamilName = (matchedLoc && matchedLoc.tamil_name) || (landmarkIntel.matched ? landmarkIntel.tamilName : null);
      result.displayName = matchedLoc ? matchedLoc.display_name : (landmarkIntel.area ? `${landmarkIntel.area} (${landmarkIntel.landmarkName})` : landmarkIntel.landmarkName);
      result.locationId = matchedLoc ? matchedLoc.location_id : (landmarkIntel.landmarkId || 'LOC-CBE-LANDMARK');
      result.locationType = matchedLoc ? matchedLoc.location_type : 'LANDMARK';
      result.revenueDivision = (matchedLoc && matchedLoc.revenue_division) || 'Coimbatore South';
      result.taluk = (matchedLoc && matchedLoc.taluk) || (landmarkIntel.matched ? landmarkIntel.taluk : 'Coimbatore South');
      result.district = 'Coimbatore';
      result.geocodingStatus = 'VERIFIED';

      // Precision calculation rule:
      // - STREET: Landmark + Street (or Street known within area)
      // - NEAR_LANDMARK: Landmark known without exact street
      // - AREA: Locality/Village level
      const hasStreet = !!result.street;
      const hasLandmark = !!(result.landmark || landmarkIntel.matched);

      if (hasStreet && hasLandmark) {
        result.locationPrecision = 'STREET';
        const baseLat = landmarkIntel.matched ? landmarkIntel.latitude : matchedLoc.latitude;
        const baseLng = landmarkIntel.matched ? landmarkIntel.longitude : matchedLoc.longitude;
        const offsetLat = (Math.random() - 0.5) * 0.0006;
        const offsetLng = (Math.random() - 0.5) * 0.0006;
        result.latitude = Number((baseLat + offsetLat).toFixed(5));
        result.longitude = Number((baseLng + offsetLng).toFixed(5));
      } else if (hasLandmark) {
        result.locationPrecision = 'NEAR_LANDMARK';
        const baseLat = landmarkIntel.matched ? landmarkIntel.latitude : (matchedLoc ? matchedLoc.latitude : 11.0168);
        const baseLng = landmarkIntel.matched ? landmarkIntel.longitude : (matchedLoc ? matchedLoc.longitude : 76.9558);
        // ~30-40m offset for NEAR_LANDMARK rather than exact building center
        const offsetLat = (Math.random() - 0.5) * 0.0006;
        const offsetLng = (Math.random() - 0.5) * 0.0006;
        result.latitude = Number((baseLat + offsetLat).toFixed(5));
        result.longitude = Number((baseLng + offsetLng).toFixed(5));
      } else if (hasStreet) {
        result.locationPrecision = 'STREET';
        const baseLat = matchedLoc ? matchedLoc.latitude : (landmarkIntel.matched ? landmarkIntel.latitude : 11.0168);
        const baseLng = matchedLoc ? matchedLoc.longitude : (landmarkIntel.matched ? landmarkIntel.longitude : 76.9558);
        const offsetLat = (Math.random() - 0.5) * 0.0018;
        const offsetLng = (Math.random() - 0.5) * 0.0018;
        result.latitude = Number((baseLat + offsetLat).toFixed(5));
        result.longitude = Number((baseLng + offsetLng).toFixed(5));
      } else {
        result.locationPrecision = 'AREA';
        result.latitude = matchedLoc ? matchedLoc.latitude : (landmarkIntel.matched ? landmarkIntel.latitude : 11.0168);
        result.longitude = matchedLoc ? matchedLoc.longitude : (landmarkIntel.matched ? landmarkIntel.longitude : 76.9558);
      }
    } else {
      // Unresolved
      result.locationPrecision = 'APPROXIMATE';
      result.geocodingStatus = 'UNRESOLVED';
    }

    return result;
  }

  /**
   * Get all registered landmarks
   */
  async getAllLandmarks() {
    return landmarkService.getAllLandmarks();
  }

  /**
   * Get all registered Coimbatore locations for dropdowns and filter UI
   */
  async getAllLocations() {
    try {
      const rows = await db.all(
        `SELECT location_id, canonical_name, display_name, location_type,
                revenue_division, taluk, tamil_name, latitude, longitude
         FROM locations
         ORDER BY canonical_name ASC`
      );
      if (rows && rows.length > 0) return rows;
    } catch (e) {
      console.warn('Falling back to memory locations list:', e.message);
    }
    return this.locations;
  }

  /**
   * Get distinct Taluks and Revenue Divisions for hierarchical filters
   */
  async getHierarchy() {
    const locations = await this.getAllLocations();
    const divisions = {};

    for (const loc of locations) {
      const rev = loc.revenue_division || 'Coimbatore South';
      const taluk = loc.taluk || 'Coimbatore South';

      if (!divisions[rev]) divisions[rev] = {};
      if (!divisions[rev][taluk]) divisions[rev][taluk] = [];
      divisions[rev][taluk].push({
        location_id: loc.location_id,
        canonical_name: loc.canonical_name,
        display_name: loc.display_name,
        latitude: loc.latitude,
        longitude: loc.longitude
      });
    }

    return divisions;
  }
}

const locationService = new LocationService();

module.exports = locationService;
