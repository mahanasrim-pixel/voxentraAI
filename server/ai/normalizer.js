/**
 * VOXENTRA Smart Speech & Text Normalizer
 * Corrects typical speech-to-text phonetic anomalies without distorting citizen intent.
 */

// Geographic dictionary with regex patterns
const LOCATION_REPLACEMENTS = [
  { pattern: /\b(sarava\s*patty|saravanampaty|saravana\s*patti|saravampatty|saravampatti)\b/gi, replacement: 'Saravanampatti' },
  { pattern: /\b(gandhi\s*puram|kandhipuram|kandhi\s*puram)\b/gi, replacement: 'Gandhipuram' },
  { pattern: /\b(r\s*s\s*puram|ares\s*puram|rs\s*puram)\b/gi, replacement: 'RS Puram' },
  { pattern: /\b(peela\s*medu|pilamedu|peelamedu)\b/gi, replacement: 'Peelamedu' },
  { pattern: /\b(ukadam|ukkadam)\b/gi, replacement: 'Ukkadam' },
  { pattern: /\b(singa\s*nallur|singanallur)\b/gi, replacement: 'Singanallur' },
  { pattern: /\b(sai\s*baba\s*colony|saibaba\s*colony)\b/gi, replacement: 'Saibaba Colony' },
  { pattern: /\b(gana\s*pathy|ganapathi|ganapathy)\b/gi, replacement: 'Ganapathy' },
  { pattern: /\b(hope\s*colledge|hope\s*college)\b/gi, replacement: 'Hope College' },
  { pattern: /\b(town\s*hall|townhall)\b/gi, replacement: 'Town Hall' },
  { pattern: /\b(kovai\s*pudur|kovaipudur)\b/gi, replacement: 'Kovaipudur' },
  { pattern: /\b(ramanaatha\s*puram|ramnathapuram|ramanathapuram)\b/gi, replacement: 'Ramanathapuram' },
  { pattern: /\b(thudiyaalur|thudiyalur)\b/gi, replacement: 'Thudiyalur' },
  { pattern: /\b(vaadavalli|vadavalli)\b/gi, replacement: 'Vadavalli' },
  { pattern: /\b(avinashi\s*road|avinaasi\s*road)\b/gi, replacement: 'Avinashi Road' },
  { pattern: /\b(sathy\s*road|satyamangalam\s*road)\b/gi, replacement: 'Sathy Road' },
  { pattern: /\b(trichy\s*road|tiruchy\s*road)\b/gi, replacement: 'Trichy Road' }
];

// Common phonetic and transcription distortions in Tanglish / Indian English civic reporting
const PHONETIC_CORRECTIONS = [
  { pattern: /\b(roaad|roadd|raod)\b/gi, replacement: 'road' },
  { pattern: /\b(damaj|damej|damaage|dhamage)\b/gi, replacement: 'damage' },
  { pattern: /\b(aayiruku|ayirukku|aairukku|aayirukuu)\b/gi, replacement: 'aayirukku' },
  { pattern: /\b(rombha|rombaa)\b/gi, replacement: 'romba' },
  { pattern: /\b(kuzhi|kolli|kuli)\b/gi, replacement: 'kuzhi' },
  { pattern: /\b(currend|karand|currentu|karant)\b/gi, replacement: 'current' },
  { pattern: /\b(trasformer|tranceformer|tranzformer)\b/gi, replacement: 'transformer' },
  { pattern: /\b(drenage|drinage|dranege)\b/gi, replacement: 'drainage' },
  { pattern: /\b(axident|aksident|accidant)\b/gi, replacement: 'accident' },
  { pattern: /\b(theepaduthu|theepidithu|theepori)\b/gi, replacement: 'theepidithu' },
  { pattern: /\b(udanju|odanju|odanjiduchu)\b/gi, replacement: 'udanju' },
  { pattern: /\b(kuppa|kuppai)\b/gi, replacement: 'kuppai' },
  { pattern: /\b(theftu|thiruttu|thirudan)\b/gi, replacement: 'theft' },
  { pattern: /\b(bleed\s*aaguthu|ratham\s*varuthu)\b/gi, replacement: 'bleeding' },
  { pattern: /\b(siginal|signel)\b/gi, replacement: 'signal' },
  { pattern: /\b(pothole|potholes|pothol)\b/gi, replacement: 'pothole' },
  { pattern: /\b(leek|leakaj|leakij)\b/gi, replacement: 'leakage' }
];

// Tamil script normalizations
const TAMIL_SCRIPT_CORRECTIONS = [
  { pattern: /சரவணப்பட்டில/g, replacement: 'சரவணம்பட்டியில்' },
  { pattern: /சரவணபட்டி/g, replacement: 'சரவணம்பட்டி' },
  { pattern: /காந்திபுரத்தில/g, replacement: 'காந்திபுரத்தில்' }
];

function normalizeText(transcript = '', lang = null) {
  const original = transcript.trim();
  if (!original) {
    return {
      original: '',
      normalized: '',
      corrections: []
    };
  }

  let text = original;
  const corrections = [];

  // 1. Apply location normalizations
  LOCATION_REPLACEMENTS.forEach(({ pattern, replacement }) => {
    if (pattern.test(text)) {
      const match = text.match(pattern);
      if (match && match[0] !== replacement) {
        corrections.push({ original: match[0], corrected: replacement, type: 'location' });
      }
      text = text.replace(pattern, replacement);
    }
  });

  // 2. Apply Tamil script corrections if applicable
  TAMIL_SCRIPT_CORRECTIONS.forEach(({ pattern, replacement }) => {
    if (pattern.test(text)) {
      const match = text.match(pattern);
      if (match && match[0] !== replacement) {
        corrections.push({ original: match[0], corrected: replacement, type: 'tamil_script' });
      }
      text = text.replace(pattern, replacement);
    }
  });

  // 3. Handle hyphenated Tamil locative case for Tanglish (e.g. "Saravanampatti la" -> "Saravanampatti-la")
  // Do NOT apply to English (preserves English prepositions and phrasing)
  if (lang !== 'ENGLISH') {
    text = text.replace(/(Saravanampatti|Gandhipuram|RS Puram|Peelamedu|Ukkadam|Singanallur|Saibaba Colony|Ganapathy|Hope College|Town Hall|Kovaipudur|Ramanathapuram|Thudiyalur|Vadavalli)\s+(la|le|kitta|pakkathula)\b/gi, '$1-$2');
  }

  // 4. Apply civic phonetic and typo corrections
  PHONETIC_CORRECTIONS.forEach(({ pattern, replacement }) => {
    if (pattern.test(text)) {
      const match = text.match(pattern);
      if (match && match[0].toLowerCase() !== replacement.toLowerCase()) {
        corrections.push({ original: match[0], corrected: replacement, type: 'phonetic' });
      }
      text = text.replace(pattern, replacement);
    }
  });

  // 5. Clean extra spaces & standardize casing for English grammatical structure
  text = text.replace(/\ba\s+road\s+damage\b/gi, 'road damage');
  text = text.replace(/\s{2,}/g, ' ').trim();

  return {
    original,
    normalized: text,
    corrections
  };
}

module.exports = { normalizeText };
