/**
 * VOXENTRA Language Detector
 * Strictly supports ONLY 3 Languages:
 * 1. ENGLISH (English Latin script)
 * 2. TAMIL (தமிழ் script)
 * 3. TANGLISH (Tamil phonetically transcribed in Latin script / Tamil-English mixed)
 */

const LANGUAGES = {
  ENGLISH: 'ENGLISH',
  TAMIL: 'TAMIL',
  TANGLISH: 'TANGLISH'
};

const TAMIL_SCRIPT_REGEX = /[\u0B80-\u0BFF]/;

// Tanglish lexical and phonetic markers (Tamil words in Latin script)
const TANGLISH_PATTERNS = [
  /\b(?:inga|enga|anga|ippo|eppo|appo)\b/i,
  /\b(?:aayirukku|aayiruku|aachu|aachi|aaguthu|aagudhu|aagum|aayiduchu)\b/i,
  /\b(?:romba|rombha|periya|chinna|kuzhi|pallam)\b/i,
  /\b(?:irukku|iruku|irukkum|irukkudhu|irunthathu)\b/i,
  /\b(?:illa|illai|illadha)\b/i,
  /\b(?:thanni|thannir|kudineer|saakadai|kuzhai)\b/i,
  /\b(?:udanju|odanju|udanjurukku|pochu|odanjiduchu)\b/i,
  /\b(?:panna|pannunga|panren|pannidunga|pannanum)\b/i,
  /\b(?:mudiyala|mudiyudha|mudiyum|mudiyuma)\b/i,
  /\b(?:varala|varuthu|varudhu)\b/i,
  /\b(?:pakkathula|pakkam|kitta|aduthu)\b/i,
  /\b(?:veetula|roadula|therula|idathula|kadavula)\b/i,
  /\b(?:seri|sari|aama|aamam|aamaa)\b/i,
  /\b(?:theepori|currentu|thee|anal|theepidithu)\b/i,
  /\b(?:sollunga|solren|parunga|parkalaam|solunga)\b/i,
  /\b(?:evlo|enna|ethu|eppadi|enge|yaaru)\b/i,
  /\b(?:naala|naal|mani|neram|vaaram|masam)\b/i,
  /\b(?:poga|vara|nikka|oda)\b/i,
  /\b(?:kuppai|kuppa|kandippa|purinjukitten|puriyala)\b/i,
  /\b(?:nethu|nethulerndhu|innaikku|inniku|kalaila)\b/i
];

// English grammatical and functional stop words
const ENGLISH_PATTERNS = [
  /\b(?:there|here|this|that|these|those)\b/i,
  /\b(?:is|are|was|were|have|has|had|will|would|can|could|should)\b/i,
  /\b(?:the|a|an)\b/i,
  /\b(?:in|at|near|on|of|to|for|from|with|by|about|under|over|behind|opposite|front|across)\b/i,
  /\b(?:my|our|your|his|her|their|its)\b/i,
  /\b(?:what|which|where|when|who|how|why)\b/i,
  /\b(?:please|thank|thanks|sorry|excuse)\b/i,
  /\b(?:damaged?|broken|blocked|blocking|leak|leakage|burst|overflow|overflowing)\b/i,
  /\b(?:complaint|issue|problem|danger|hazard|hazardly|accident|theft|fire)\b/i,
  /\b(?:completely|slowly|heavy|severe|facing|affecting|located)\b/i,
  /\b(?:days?|hours?|weeks?|yesterday|today|morning|night)\b/i
];

function detectLanguage(text = '') {
  const clean = text.trim();
  if (!clean) {
    return {
      language: LANGUAGES.ENGLISH,
      code: 'en',
      script: 'Latin',
      confidence: 0.5
    };
  }

  // 1. Strict Tamil Script Detection
  if (TAMIL_SCRIPT_REGEX.test(clean)) {
    return {
      language: LANGUAGES.TAMIL,
      code: 'ta',
      script: 'Tamil',
      confidence: 0.99
    };
  }

  const lower = clean.toLowerCase();

  // 2. Tanglish Scoring
  let tanglishScore = 0;
  for (const regex of TANGLISH_PATTERNS) {
    if (regex.test(lower)) {
      tanglishScore += 2.0;
    }
  }

  // Check Tanglish suffix markers (e.g. -la, -kitta, -pakkathula, -ku, -oda, -ah, -aayirukku)
  const words = lower.replace(/[.,!?:;"]/g, '').split(/\s+/).filter(Boolean);
  const englishExceptionsEndingInLa = ['umbrella', 'gorilla', 'vanilla', 'koala', 'villa', 'formula', 'nebula', 'spatula', 'mandala'];

  words.forEach(w => {
    // Suffixes attached with hyphen or suffix at end
    if (w.includes('-la') || w.includes('-le') || w.includes('-kitta') || w.includes('-pakkathula') || w.includes('-ku') || w.includes('-oda') || w.includes('-ah') || w.includes('-dhaan')) {
      tanglishScore += 2.0;
    } else if (w.endsWith('la') && w.length >= 4 && !englishExceptionsEndingInLa.includes(w)) {
      // e.g. "roadla", "veetla", "kalaila"
      tanglishScore += 1.5;
    }
    if (['enna', 'enga', 'anga', 'inga', 'ippo', 'eppo', 'appo', 'pakkam', 'sari', 'seri', 'aama', 'romba', 'kitta', 'theru'].includes(w)) {
      tanglishScore += 1.5;
    }
  });

  // 3. English Scoring
  let englishScore = 0;
  for (const regex of ENGLISH_PATTERNS) {
    if (regex.test(lower)) {
      englishScore += 1.0;
    }
  }

  // Strict decision rule:
  // If there are clear Tanglish markers, it's TANGLISH
  if (tanglishScore >= 1.5) {
    return {
      language: LANGUAGES.TANGLISH,
      code: 'ta-Latn',
      script: 'Latin',
      confidence: Math.min(0.99, 0.70 + tanglishScore * 0.08)
    };
  }

  // If there are English markers or zero Tanglish markers in Latin text, it's ENGLISH
  return {
    language: LANGUAGES.ENGLISH,
    code: 'en',
    script: 'Latin',
    confidence: Math.min(0.99, 0.80 + englishScore * 0.05)
  };
}

module.exports = {
  detectLanguage,
  LANGUAGES
};
