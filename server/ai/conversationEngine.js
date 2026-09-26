/**
 * VOXENTRA Intelligent Civic Conversational Engine
 *
 * Strictly supports ONLY 3 Languages:
 * 1. Tamil (தமிழ்)
 * 2. English
 * 3. Tanglish (Tamil in Latin script)
 *
 * Core Principles:
 * - Automatically detect Tamil, English, or Tanglish.
 * - Store detectedLanguage, currentConversationLanguage, responseLanguage.
 * - Maintain conversation language throughout turns unless citizen clearly switches.
 * - AI must NOT switch to English by default.
 * - Natural multi-turn dialogue with progressive slot collection (one question at a time).
 * - Anti-premature registration (never register on first turn).
 * - Emergency branch fast-tracking.
 * - Final confirmation before database persistence.
 */

const { detectLanguage, LANGUAGES } = require('./languageDetector');
const { normalizeText } = require('./normalizer');
const { classifyComplaint, CATEGORIES } = require('./classifier');
const { extractLocation } = require('./geocoder');

// In-memory conversation state keyed by sessionId
const sessionStateStore = new Map();

function getSessionState(sessionId) {
  if (!sessionStateStore.has(sessionId)) {
    sessionStateStore.set(sessionId, {
      sessionId,
      stage: 'COLLECTING_INFORMATION', // 'COLLECTING_INFORMATION' | 'FINAL_CONFIRMATION' | 'REGISTERED'
      turns: [],
      slots: {
        category: null,
        district: 'Coimbatore',
        area: null,
        canonicalLocationName: null,
        locationId: null,
        taluk: null,
        revenueDivision: null,
        locationPrecision: 'APPROXIMATE',
        rawLocationText: null,
        street: null,
        landmark: null,
        landmarkId: null,
        landmarkType: null,
        duration: null,
        severity: null,
        immediateDanger: null,
        isEmergency: false,
        confirmedByCitizen: false
      },
      pendingLocationClarification: null,
      detectedLanguage: null,
      currentConversationLanguage: null,
      responseLanguage: null,
      lastQuestionAsked: null
    });
  }
  return sessionStateStore.get(sessionId);
}

function clearSessionState(sessionId) {
  sessionStateStore.delete(sessionId);
}

// Extract duration mentions across Tamil, Tanglish, and English
function extractDuration(text = '') {
  const clean = text.trim();
  const lower = clean.toLowerCase();

  // Tamil script patterns
  const tamilPatterns = [
    /(\d+|ஒன்று|இரண்டு|மூன்று|நான்கு|ஐந்து)\s*(?:நாட்கள்|நாட்களாக|மணிநேரம்|வாரங்கள்|மாதங்கள்)/,
    /(?:நேற்றிலிருந்து|நேற்று|இன்று|காலை\s*முதல்|இப்போதுதான்)/
  ];
  for (const p of tamilPatterns) {
    const m = clean.match(p);
    if (m) return m[0].trim();
  }

  // Tanglish / English patterns
  const patterns = [
    /(\d+|one|two|three|four|five|six|seven|a few|several)\s*(?:days?|naala?|hours?|mani|weeks?|vaaram|months?|masam)\b/i,
    /(?:since\s+yesterday|nethulerndhu|nethu|today|innaikku|kalaila|just\s*now|ippo\s*thaan)/i,
    /(\d+)\s*days?/i,
    /(\d+)\s*naala/i
  ];

  for (const p of patterns) {
    const m = lower.match(p);
    if (m) return m[0].trim();
  }
  return null;
}

// Extract severity and blockage mentions across Tamil, Tanglish, and English
function extractSeverity(text = '', category = '') {
  const clean = text.trim();
  const lower = clean.toLowerCase();

  // Tamil script checks
  if (clean.includes('முழுமையாக அடைக்க') || clean.includes('போக்குவரத்து தடை') || clean.includes('செல்ல முடியாது') || clean.includes('போக முடியவில்லை')) {
    return 'முழுமையாக அடைக்கப்பட்டுள்ளது (Completely blocked)';
  }
  if (clean.includes('மெதுவாக') || clean.includes('செல்ல முடிகிறது') || clean.includes('போகலாம்')) {
    return 'வாகனங்கள் மெதுவாக செல்கின்றன (Vehicles moving slowly)';
  }
  if (clean.includes('குடிநீர்') || clean.includes('சிறுவாணி')) {
    return 'குடிநீர் குழாய் உடைப்பு (Drinking water main leak)';
  }
  if (clean.includes('கழிவுநீர்') || clean.includes('சாக்கடை') || clean.includes('வடிகால்')) {
    return 'கழிவுநீர் வடிகால் அடைப்பு (Drainage / Sewage overflow)';
  }
  if (clean.includes('தீப்பொறி') || clean.includes('ஒயர்') || clean.includes('ஆபத்து')) {
    return 'மின்கம்பி தீப்பொறி ஆபத்து (Live sparking wire / hazard)';
  }
  if (clean.includes('மின்தடை') || clean.includes('கரண்ட் இல்லை')) {
    return 'மின்தடை (Power outage)';
  }

  // Damaged road blockage (Tanglish & English)
  if (lower.includes('completely blocked') || lower.includes('traffic blocked') || lower.includes('poga mudiyala') || lower.includes('blocked-ah') || lower.includes('fully blocked')) {
    return 'Completely blocked';
  }
  if (lower.includes('slow') || lower.includes('usable') || lower.includes('slowly moving') || lower.includes('slow-ah') || lower.includes('poga mudiyuthu') || lower.includes('poga mudiyum')) {
    return 'Vehicles moving slowly';
  }

  // Water leakage type
  if (lower.includes('drinking water') || lower.includes('siruvani') || lower.includes('clean water') || lower.includes('pipe burst') || lower.includes('kudineer')) {
    return 'Drinking water main leak';
  }
  if (lower.includes('drainage') || lower.includes('sewage') || lower.includes('overflow') || lower.includes('culvert') || lower.includes('dirty water') || lower.includes('saakadai')) {
    return 'Drainage / Sewage overflow';
  }

  // Electricity
  if (lower.includes('spark') || lower.includes('sparking') || lower.includes('theepori') || lower.includes('smoke') || lower.includes('wire')) {
    return 'Live sparking wire / hazard';
  }
  if (lower.includes('power cut') || lower.includes('blackout') || lower.includes('current cut') || lower.includes('current illa')) {
    return 'Power outage';
  }

  // General high severity
  if (lower.includes('severe') || lower.includes('heavy') || lower.includes('periya') || lower.includes('danger') || lower.includes('emergency')) {
    return 'High severity';
  }

  return null;
}

// Affirmation detector across Tamil, Tanglish, and English
function isAffirmation(text = '') {
  const clean = text.trim().toLowerCase().replace(/[.,!?-]/g, '');

  // Tamil script affirmation
  if (/^(ஆம்|ஆமா|ஆமாம்|சரி|சரிதான்|உண்மை|பதிவு\s*செய்யவும்|பதிவு\s*செய்)$/.test(clean) ||
      clean.includes('ஆம்') || clean.includes('ஆமாம்') || clean.includes('பதிவு செய்யவும்')) {
    return true;
  }

  // English & Tanglish affirmation
  const affirmWords = [
    'yes', 'yeah', 'yep', 'correct', 'correct-ah', 'right', 'sari', 'seri',
    'aama', 'aamaa', 'aamam', 'register', 'register pannunga', 'confirm',
    'confirm pannunga', 'proceed', 'sure', 'yes please', 'yes correct'
  ];
  return affirmWords.some(w => clean === w || clean.startsWith(w + ' ') || clean.endsWith(' ' + w));
}

// Negation detector across Tamil, Tanglish, and English
function isNegation(text = '') {
  const clean = text.trim().toLowerCase().replace(/[.,!?-]/g, '');

  // Tamil script negation
  if (/^(இல்லை|வேண்டாம்|தவறு|மாற்ற\s*வேண்டும்)$/.test(clean) || clean.includes('இல்லை') || clean.includes('தவறு')) {
    return true;
  }

  // English & Tanglish negation
  const negWords = ['no', 'nope', 'illa', 'illai', 'wrong', 'thappu', 'change', 'change pannanum', 'not correct'];
  return negWords.some(w => clean === w || clean.startsWith(w + ' '));
}

// Unclear speech input detection
function isUnclearInput(text = '') {
  const clean = text.trim();
  if (!clean || clean.length < 3) return true;

  const words = clean.split(/\s+/).filter(w => w.length > 0);
  if (words.length === 1 && ['hi', 'hello', 'hmmm', 'er', 'ah', 'test', 'something', 'ஹலோ', 'வணக்கம்'].includes(words[0].toLowerCase())) {
    return true;
  }

  if (/(something\s*problem|what\s*to\s*say|unclear)/i.test(clean) && words.length < 5) {
    return true;
  }

  return false;
}

// Multi-turn processing engine
async function processConversationTurn(sessionId, userUtterance, citizenPhone = '+91 98421 55678') {
  const cleanInput = (userUtterance || '').trim();
  const session = getSessionState(sessionId);

  // 1. Language Detection & Dynamic Session Maintenance
  // Only 3 supported languages: 'ENGLISH', 'TAMIL', 'TANGLISH'
  const currentTurnLangResult = detectLanguage(cleanInput);
  const detectedLang = currentTurnLangResult.language; // 'ENGLISH' | 'TAMIL' | 'TANGLISH'

  session.detectedLanguage = detectedLang;

  if (!session.currentConversationLanguage) {
    session.currentConversationLanguage = detectedLang;
    session.responseLanguage = detectedLang;
  } else {
    // Check if citizen switched language
    if (detectedLang === LANGUAGES.TAMIL) {
      session.currentConversationLanguage = LANGUAGES.TAMIL;
      session.responseLanguage = LANGUAGES.TAMIL;
    } else if (detectedLang === LANGUAGES.TANGLISH) {
      session.currentConversationLanguage = LANGUAGES.TANGLISH;
      session.responseLanguage = LANGUAGES.TANGLISH;
    } else if (detectedLang === LANGUAGES.ENGLISH) {
      // If citizen speaks in English, switch conversation language to ENGLISH
      // Don't switch on single generic confirmation words like "yes" if the active conversation was Tanglish
      const isShortGeneric = /^(yes|yeah|yep|sure|ok|okay|no|nope|correct)$/i.test(cleanInput);
      if (!isShortGeneric || session.currentConversationLanguage === LANGUAGES.ENGLISH) {
        session.currentConversationLanguage = LANGUAGES.ENGLISH;
        session.responseLanguage = LANGUAGES.ENGLISH;
      }
    }
  }

  const activeLang = session.currentConversationLanguage || LANGUAGES.ENGLISH;
  const isTamil = activeLang === LANGUAGES.TAMIL;
  const isEnglish = activeLang === LANGUAGES.ENGLISH;
  const isTanglish = activeLang === LANGUAGES.TANGLISH;

  // 2. Normalization (preserves original intent and language)
  const normResult = normalizeText(cleanInput, activeLang);
  const normalizedText = normResult.normalized;

  // Append to turn history
  session.turns.push({
    role: 'citizen',
    original: cleanInput,
    normalized: normalizedText,
    lang: activeLang,
    timestamp: new Date().toISOString()
  });

  const cumulativeText = session.turns.map(t => t.normalized).join('. ');

  // 3. Unclear Speech Handling
  if (isUnclearInput(cleanInput) && session.turns.length === 1) {
    let reply = "Sorry, unga complaint clear-ah puriyala. Please once again sollunga.";
    if (isTamil) {
      reply = "மன்னிக்கவும், உங்களது புகார் தெளிவாக புரியவில்லை. தயவுசெய்து மீண்டும் கூறவும்.";
    } else if (isEnglish) {
      reply = "Sorry, I couldn't understand your complaint clearly. Could you please say that again?";
    }

    session.turns.push({ role: 'assistant', text: reply, lang: activeLang });
    return {
      reply,
      stage: 'COLLECTING_INFORMATION',
      detectedLanguage: session.detectedLanguage,
      currentConversationLanguage: activeLang,
      responseLanguage: activeLang,
      originalText: cleanInput,
      normalizedText,
      corrections: normResult.corrections,
      slots: session.slots,
      shouldRegister: false
    };
  }

  // Check if citizen is answering a pending partial location confirmation (e.g. "Neenga Kurumbapalayam-a sollreengala?")
  if (session.pendingLocationClarification) {
    if (isAffirmation(cleanInput)) {
      const confirmed = session.pendingLocationClarification;
      session.slots.area = confirmed.canonicalLocationName;
      session.slots.canonicalLocationName = confirmed.canonicalLocationName;
      session.slots.locationId = confirmed.locationId;
      session.slots.taluk = confirmed.taluk;
      session.slots.revenueDivision = confirmed.revenueDivision;
      session.slots.latitude = confirmed.latitude;
      session.slots.longitude = confirmed.longitude;
      session.slots.locationPrecision = confirmed.locationPrecision || 'AREA';
      session.pendingLocationClarification = null;
    } else if (isNegation(cleanInput)) {
      session.pendingLocationClarification = null;
    }
  }

  // 4. Extract Complaint Information
  const classification = classifyComplaint(cumulativeText);
  const locationExtraction = extractLocation(cumulativeText, activeLang);

  // Category & Priority
  if (classification.category !== CATEGORIES.OTHER && !session.slots.category) {
    session.slots.category = classification.category;
    session.slots.priority = classification.priority;
    session.slots.departmentId = classification.departmentId;
    session.slots.departmentName = classification.departmentName;
  }

  // Check emergency triggers
  if (classification.isEmergency) {
    session.slots.isEmergency = true;
    session.slots.priority = 'emergency';
  }

  // Location fields & Landmark Intelligence
  if (locationExtraction.landmark && !session.slots.landmark) {
    session.slots.landmark = locationExtraction.landmark;
    session.slots.landmarkId = locationExtraction.landmarkId || null;
    session.slots.landmarkType = locationExtraction.landmarkType || null;
  }

  if (locationExtraction.areaName && !session.slots.area && !locationExtraction.clarificationRequired) {
    session.slots.area = locationExtraction.areaName;
    session.slots.canonicalLocationName = locationExtraction.canonicalLocationName;
    session.slots.tamilName = locationExtraction.tamilName || null;
    session.slots.locationId = locationExtraction.locationId;
    session.slots.taluk = locationExtraction.taluk;
    session.slots.district = locationExtraction.district || 'Coimbatore';
    session.slots.revenueDivision = locationExtraction.revenueDivision;
    session.slots.locationPrecision = locationExtraction.locationPrecision || 'AREA';
    session.slots.latitude = locationExtraction.latitude;
    session.slots.longitude = locationExtraction.longitude;
  } else if (!session.slots.area && locationExtraction.landmark && locationExtraction.matched) {
    // Inferred from landmark
    session.slots.area = locationExtraction.canonicalLocationName;
    session.slots.canonicalLocationName = locationExtraction.canonicalLocationName;
    session.slots.tamilName = locationExtraction.tamilName || null;
    session.slots.taluk = locationExtraction.taluk;
    session.slots.district = locationExtraction.district || 'Coimbatore';
    session.slots.locationPrecision = locationExtraction.locationPrecision;
    session.slots.latitude = locationExtraction.latitude;
    session.slots.longitude = locationExtraction.longitude;
  }

  if (locationExtraction.streetName && !session.slots.street) {
    session.slots.street = locationExtraction.streetName;
  }

  // Dynamic precision calculation:
  if (session.slots.street && session.slots.landmark) {
    session.slots.locationPrecision = 'STREET';
  } else if (session.slots.landmark) {
    session.slots.locationPrecision = 'NEAR_LANDMARK';
  } else if (session.slots.street) {
    session.slots.locationPrecision = 'STREET';
  } else if (session.slots.area) {
    session.slots.locationPrecision = 'AREA';
  }

  if (locationExtraction.latitude && !session.slots.latitude) {
    session.slots.latitude = locationExtraction.latitude;
    session.slots.longitude = locationExtraction.longitude;
  }
  if (!session.slots.rawLocationText && (locationExtraction.rawLocationText || cleanInput)) {
    session.slots.rawLocationText = locationExtraction.rawLocationText || cleanInput;
  }

  // Duration
  const foundDuration = extractDuration(normalizedText) || extractDuration(cumulativeText);
  if (foundDuration && !session.slots.duration) {
    session.slots.duration = foundDuration;
  }

  // Severity / Blockage
  const foundSeverity = extractSeverity(normalizedText, session.slots.category) || extractSeverity(cumulativeText, session.slots.category);
  if (foundSeverity && !session.slots.severity) {
    session.slots.severity = foundSeverity;
  }

  // Category labels in each language
  const categoryTamilMap = {
    [CATEGORIES.DAMAGED_ROAD]: 'சாலை சேதம் (Damaged Road)',
    [CATEGORIES.WATER_LEAKAGE]: 'குடிநீர் குழாய் கசிவு (Water Leakage)',
    [CATEGORIES.ELECTRICITY]: 'மின்சார பிரச்சனை (Electricity Issue)',
    [CATEGORIES.GARBAGE]: 'குப்பை மற்றும் துப்புரவு (Garbage/Sanitation)',
    [CATEGORIES.ACCIDENT]: 'விபத்து (Accident)',
    [CATEGORIES.FIRE]: 'தீ விபத்து (Fire)',
    [CATEGORIES.THEFT]: 'திருட்டு (Theft)',
    [CATEGORIES.OTHER]: 'குடிமை பிரச்சனை (Civic Issue)'
  };

  // 5. FINAL_CONFIRMATION Stage Citizen Response Handling
  if (session.stage === 'FINAL_CONFIRMATION') {
    if (isAffirmation(cleanInput)) {
      // Citizen Confirmed!
      session.stage = 'REGISTERED';
      session.slots.confirmedByCitizen = true;

      const finalArea = session.slots.canonicalLocationName || session.slots.area || 'Coimbatore Area';
      const finalStreet = session.slots.street ? `${session.slots.street}, ` : '';
      const finalCategory = session.slots.category || 'Civic Issue';

      let reply = "Okay, ungaloda complaint register panren. Department-ku immediate-ah route panni, verification SMS anupuvom.";
      if (isTamil) {
        reply = "சரி, உங்கள் புகார் பதிவு செய்யப்பட்டு துறைக்கு அனுப்பப்படுகிறது. உறுதிப்படுத்தல் குறுஞ்செய்தி அனுப்பப்பட்டுள்ளது.";
      } else if (isEnglish) {
        reply = "Thank you. Your complaint has been registered and routed to the municipal department. A confirmation SMS has been sent.";
      }

      session.turns.push({ role: 'assistant', text: reply, lang: activeLang });

      const complaintPayload = {
        citizenPhone,
        citizenName: 'Citizen',
        originalTranscript: session.turns.filter(t => t.role === 'citizen').map(t => t.original).join(' | '),
        normalizedText: session.turns.filter(t => t.role === 'citizen').map(t => t.normalized).join(' | '),
        detectedLanguage: activeLang,
        category: finalCategory,
        description: isTamil
          ? `குடிமக்கள் பதிவு செய்த புகார்: ${categoryTamilMap[session.slots.category] || session.slots.category} - ${finalStreet}${finalArea}. வட்டம்: ${session.slots.taluk || 'கோயம்புத்தூர்'}. அடையாளம்: ${session.slots.landmark || 'இல்லை'}. காலம்: ${session.slots.duration || 'சமீபத்தில்'}. விவரம்: ${session.slots.severity || 'வழக்கமான'}.`
          : `Citizen reported: ${session.slots.category} at ${finalStreet}${finalArea}. Taluk: ${session.slots.taluk || 'Coimbatore'}. Landmark: ${session.slots.landmark || 'N/A'}. Duration: ${session.slots.duration || 'Recently'}. Details: ${session.slots.severity || 'Normal'}.`,
        spokenLocation: `${finalStreet}${finalArea}`,
        rawLocationText: session.slots.rawLocationText || `${finalStreet}${finalArea}`,
        canonicalLocationName: finalArea,
        locationId: session.slots.locationId || null,
        district: session.slots.district || 'Coimbatore',
        taluk: session.slots.taluk || null,
        street: session.slots.street || null,
        landmark: session.slots.landmark || null,
        landmarkId: session.slots.landmarkId || null,
        landmarkType: session.slots.landmarkType || null,
        areaName: finalArea,
        locationPrecision: session.slots.locationPrecision || 'AREA',
        latitude: session.slots.latitude,
        longitude: session.slots.longitude,
        priority: session.slots.priority || (session.slots.isEmergency ? 'emergency' : 'medium'),
        departmentId: session.slots.departmentId || classification.departmentId || 1,
        confidenceScore: classification.confidence,
        clarificationNeeded: false
      };

      // Clear session after successful registration
      clearSessionState(sessionId);

      return {
        reply,
        stage: 'REGISTERED',
        detectedLanguage: session.detectedLanguage,
        currentConversationLanguage: activeLang,
        responseLanguage: activeLang,
        originalText: cleanInput,
        normalizedText,
        corrections: normResult.corrections,
        slots: session.slots,
        shouldRegister: true,
        complaintPayload
      };
    } else if (isNegation(cleanInput)) {
      session.stage = 'COLLECTING_INFORMATION';
      let reply = "Enna details change pannanum? Please sollunga.";
      if (isTamil) {
        reply = "எந்த விவரத்தை மாற்ற வேண்டும்? தயவுசெய்து கூறவும்.";
      } else if (isEnglish) {
        reply = "Which detail would you like to change? Please tell me.";
      }

      session.turns.push({ role: 'assistant', text: reply, lang: activeLang });
      return {
        reply,
        stage: 'COLLECTING_INFORMATION',
        detectedLanguage: session.detectedLanguage,
        currentConversationLanguage: activeLang,
        responseLanguage: activeLang,
        originalText: cleanInput,
        normalizedText,
        corrections: normResult.corrections,
        slots: session.slots,
        shouldRegister: false
      };
    }
  }

  // 6. Progressive Single-Question Follow-up Logic

  // Emergency Priority Branch
  if (session.slots.isEmergency) {
    if (!session.slots.area) {
      let reply = "Emergency alert noted! Entha area-la indha issue irukku?";
      if (isTamil) reply = "அவசர நிலை உணரப்பட்டது! இந்த பிரச்சனை எந்த பகுதியில் உள்ளது?";
      else if (isEnglish) reply = "Emergency alert noted! Which area is this happening in?";

      session.turns.push({ role: 'assistant', text: reply, lang: activeLang });
      return {
        reply,
        stage: 'COLLECTING_INFORMATION',
        detectedLanguage: session.detectedLanguage,
        currentConversationLanguage: activeLang,
        responseLanguage: activeLang,
        originalText: cleanInput,
        normalizedText,
        corrections: normResult.corrections,
        slots: session.slots,
        shouldRegister: false
      };
    }

    if (!session.slots.landmark && !session.slots.street) {
      let reply = `Okay, ${session.slots.area}-la emergency. Exact-ah entha side or nearby landmark sollunga?`;
      if (isTamil) reply = `சரி, ${session.slots.area}-ல் அவசர பிரச்சனை. அருகில் உள்ள இடம் அல்லது அடையாளம் என்ன?`;
      else if (isEnglish) reply = `Noted in ${session.slots.area}. What is the exact side or nearby landmark?`;

      session.turns.push({ role: 'assistant', text: reply, lang: activeLang });
      return {
        reply,
        stage: 'COLLECTING_INFORMATION',
        detectedLanguage: session.detectedLanguage,
        currentConversationLanguage: activeLang,
        responseLanguage: activeLang,
        originalText: cleanInput,
        normalizedText,
        corrections: normResult.corrections,
        slots: session.slots,
        shouldRegister: false
      };
    }

    // Emergency Summary Confirmation
    session.stage = 'FINAL_CONFIRMATION';
    let summary = `Emergency: ${session.slots.category} at ${session.slots.area} ${session.slots.landmark ? `near ${session.slots.landmark}` : ''}.`;
    let confirmPrompt = `Let me confirm: ${summary} Immediate emergency team route panna confirm pannunga (Yes nu sollunga)?`;
    if (isTamil) {
      confirmPrompt = `உறுதிப்படுத்தவும்: ${summary} உடனடியாக மீட்புக்குழுவை அனுப்பவா (ஆம் என கூறவும்)?`;
    } else if (isEnglish) {
      confirmPrompt = `Let me confirm: ${summary} Should I dispatch the emergency team immediately? (Please say Yes).`;
    }

    session.turns.push({ role: 'assistant', text: confirmPrompt, lang: activeLang });
    return {
      reply: confirmPrompt,
      stage: 'FINAL_CONFIRMATION',
      detectedLanguage: session.detectedLanguage,
      currentConversationLanguage: activeLang,
      responseLanguage: activeLang,
      originalText: cleanInput,
      normalizedText,
      corrections: normResult.corrections,
      slots: session.slots,
      shouldRegister: false
    };
  }

  // Normal Civic Flow: Progressive Slot Checks (One Question at a Time)

  // Slot A: Missing Category
  if (!session.slots.category) {
    let reply = "Sure. Enna civic problem irukku nu sollunga (e.g. road damage, water leak, garbage)?";
    if (isTamil) reply = "சரி. என்ன பிரச்சனை என்று கூறவும் (எ.கா. சாலை சேதம், குடிநீர் கசிவு, குப்பை)?";
    else if (isEnglish) reply = "Sure. Could you please specify the civic issue (e.g. damaged road, water leak, garbage)?";

    session.turns.push({ role: 'assistant', text: reply, lang: activeLang });
    return {
      reply,
      stage: 'COLLECTING_INFORMATION',
      detectedLanguage: session.detectedLanguage,
      currentConversationLanguage: activeLang,
      responseLanguage: activeLang,
      originalText: cleanInput,
      normalizedText,
      corrections: normResult.corrections,
      slots: session.slots,
      shouldRegister: false
    };
  }

  // Slot B: Location Questions & Clarifications (Ambiguity / Generic)
  if (locationExtraction.clarificationType === 'AMBIGUOUS_LANDMARK') {
    const reply = locationExtraction.clarificationPrompt;
    session.turns.push({ role: 'assistant', text: reply, lang: activeLang });
    return {
      reply,
      stage: 'COLLECTING_INFORMATION',
      detectedLanguage: session.detectedLanguage,
      currentConversationLanguage: activeLang,
      responseLanguage: activeLang,
      originalText: cleanInput,
      normalizedText,
      corrections: normResult.corrections,
      slots: session.slots,
      shouldRegister: false
    };
  }

  if (!session.slots.area && !session.slots.landmark) {
    // 1. If citizen said only "Road damage in Coimbatore" / "Coimbatore-la problem"
    if (locationExtraction.clarificationType === 'VAGUE_COIMBATORE' ||
        (cleanInput.toLowerCase().includes('coimbatore') && !locationExtraction.matched)) {
      let reply = "Coimbatore-la entha area-la indha problem irukku?";
      if (isTamil) reply = "கோயம்புத்தூரில் எந்த பகுதியில் இந்த பிரச்சனை உள்ளது?";
      else if (isEnglish) reply = "Which area in Coimbatore is this problem located in?";

      session.turns.push({ role: 'assistant', text: reply, lang: activeLang });
      return {
        reply,
        stage: 'COLLECTING_INFORMATION',
        detectedLanguage: session.detectedLanguage,
        currentConversationLanguage: activeLang,
        responseLanguage: activeLang,
        originalText: cleanInput,
        normalizedText,
        corrections: normResult.corrections,
        slots: session.slots,
        shouldRegister: false
      };
    }

    // 2. If citizen gave a partial place name (e.g. "Kurumba...")
    if (locationExtraction.clarificationType === 'PARTIAL_MATCH') {
      session.pendingLocationClarification = locationExtraction;
      let reply = locationExtraction.clarificationPrompt || `Neenga ${locationExtraction.canonicalLocationName}-a sollreengala?`;

      session.turns.push({ role: 'assistant', text: reply, lang: activeLang });
      return {
        reply,
        stage: 'COLLECTING_INFORMATION',
        detectedLanguage: session.detectedLanguage,
        currentConversationLanguage: activeLang,
        responseLanguage: activeLang,
        originalText: cleanInput,
        normalizedText,
        corrections: normResult.corrections,
        slots: session.slots,
        shouldRegister: false
      };
    }
  }

  // Slot C: Missing Area / Locality (if category provided but no area and no landmark)
  if (!session.slots.area && !session.slots.landmark) {
    let reply = `Coimbatore-la entha area-la indha problem irukku?`;
    if (isTamil) reply = `கோயம்புத்தூரில் எந்த பகுதியில் இந்த பிரச்சனை உள்ளது?`;
    else if (isEnglish) reply = `Which area or locality in Coimbatore is this problem located in?`;

    session.turns.push({ role: 'assistant', text: reply, lang: activeLang });
    return {
      reply,
      stage: 'COLLECTING_INFORMATION',
      detectedLanguage: session.detectedLanguage,
      currentConversationLanguage: activeLang,
      responseLanguage: activeLang,
      originalText: cleanInput,
      normalizedText,
      corrections: normResult.corrections,
      slots: session.slots,
      shouldRegister: false
    };
  }

  // Slot D: Missing Street / Exact Road (when Area or Landmark is known)
  if (!session.slots.street) {
    let reply;
    if (session.slots.landmark) {
      if (isTamil) {
        reply = `${session.slots.landmark} அருகில் எந்த சாலை அல்லது தெரு பாதிக்கப்பட்டுள்ளது?`;
      } else if (isEnglish) {
        reply = `Which road or street near ${session.slots.landmark} is affected?`;
      } else {
        reply = `${session.slots.landmark} pakkathula entha road or street-la problem irukku?`;
      }
    } else {
      if (isTamil) {
        const areaTamil = session.slots.tamilName || session.slots.area;
        reply = `${areaTamil}யில் எந்த தெரு அல்லது சாலை பாதிக்கப்பட்டுள்ளது?`;
      } else if (isEnglish) {
        reply = `Okay. Which street or road in ${session.slots.area} is affected?`;
      } else {
        reply = session.slots.category === CATEGORIES.DAMAGED_ROAD
          ? `Okay. ${session.slots.area}-la entha street illa road damage aayirukku?`
          : `Okay. ${session.slots.area}-la entha street-la indha problem irukku?`;
      }
    }

    session.turns.push({ role: 'assistant', text: reply, lang: activeLang });
    return {
      reply,
      stage: 'COLLECTING_INFORMATION',
      detectedLanguage: session.detectedLanguage,
      currentConversationLanguage: activeLang,
      responseLanguage: activeLang,
      originalText: cleanInput,
      normalizedText,
      corrections: normResult.corrections,
      slots: session.slots,
      shouldRegister: false
    };
  }

  // Slot E: Missing Nearby Landmark
  if (!session.slots.landmark) {
    let reply = `Nearby landmark enna?`;
    if (isTamil) {
      reply = `அருகில் உள்ள முக்கியமான அடையாளம் என்ன?`;
    } else if (isEnglish) {
      reply = `What is a nearby landmark or junction?`;
    }

    session.turns.push({ role: 'assistant', text: reply, lang: activeLang });
    return {
      reply,
      stage: 'COLLECTING_INFORMATION',
      detectedLanguage: session.detectedLanguage,
      currentConversationLanguage: activeLang,
      responseLanguage: activeLang,
      originalText: cleanInput,
      normalizedText,
      corrections: normResult.corrections,
      slots: session.slots,
      shouldRegister: false
    };
  }

  // Slot E: Missing Duration
  if (!session.slots.duration) {
    let reply = "Indha problem evlo naala irukku?";
    if (isTamil) reply = "இந்த பிரச்சனை எத்தனை நாட்களாக உள்ளது?";
    else if (isEnglish) reply = "How long has this problem existed?";

    session.turns.push({ role: 'assistant', text: reply, lang: activeLang });
    return {
      reply,
      stage: 'COLLECTING_INFORMATION',
      detectedLanguage: session.detectedLanguage,
      currentConversationLanguage: activeLang,
      responseLanguage: activeLang,
      originalText: cleanInput,
      normalizedText,
      corrections: normResult.corrections,
      slots: session.slots,
      shouldRegister: false
    };
  }

  // Slot F: Missing Category-Specific Severity / Blockage
  if (!session.slots.severity) {
    let reply = "";
    if (session.slots.category === CATEGORIES.DAMAGED_ROAD) {
      if (isTamil) reply = "சாலை முழுமையாக அடைக்கப்பட்டுள்ளதா அல்லது வாகனங்கள் மெதுவாக செல்ல முடிகிறதா?";
      else if (isEnglish) reply = "Is the road completely blocked, or are vehicles able to move slowly?";
      else reply = "Road completely blocked-ah irukka, illa vehicles slow-ah poga mudiyudha?";
    } else if (session.slots.category === CATEGORIES.WATER_LEAKAGE) {
      if (isTamil) reply = "இது குடிநீர் குழாய் உடைப்பா அல்லது கழிவுநீர் வடிகால் அடைப்பா?";
      else if (isEnglish) reply = "Is this a drinking water pipe leak or sewage overflow?";
      else reply = "Indha water leak drinking water pipe-ah, illa drainage sewage overflow-ah?";
    } else if (session.slots.category === CATEGORIES.ELECTRICITY) {
      if (isTamil) reply = "மின்தடை மட்டுமா அல்லது ஒயர் தீப்பொறி போன்ற ஆபத்து உள்ளதா?";
      else if (isEnglish) reply = "Is this a regular power outage or is there a live wire sparking hazard?";
      else reply = "Power cut mattuma, illa live wire sparking aagi danger irukka?";
    } else if (session.slots.category === CATEGORIES.GARBAGE) {
      if (isTamil) reply = "குப்பை தொட்டி நிரம்பியுள்ளதா அல்லது சாலை முழுவதும் கொட்டப்பட்டுள்ளதா?";
      else if (isEnglish) reply = "Is it an overflowing dustbin or garbage dumped across the road?";
      else reply = "Kuppai bin overflow mattuma, illa road full-ah waste dump aagi irukka?";
    } else {
      if (isTamil) reply = "இந்த பிரச்சனையின் தீவிரம் எவ்வளவு? பொதுமக்கள் அல்லது போக்குவரத்து பாதிக்கப்பட்டுள்ளதா?";
      else if (isEnglish) reply = "What is the severity of this issue? Is traffic or public access affected?";
      else reply = "Indha issue-oda severity evlo irukku? Traffic or public access affect aagutha?";
    }

    session.turns.push({ role: 'assistant', text: reply, lang: activeLang });
    return {
      reply,
      stage: 'COLLECTING_INFORMATION',
      detectedLanguage: session.detectedLanguage,
      currentConversationLanguage: activeLang,
      responseLanguage: activeLang,
      originalText: cleanInput,
      normalizedText,
      corrections: normResult.corrections,
      slots: session.slots,
      shouldRegister: false
    };
  }

  // 7. ALL REQUIRED FIELDS COMPLETE! Transition to FINAL_CONFIRMATION
  session.stage = 'FINAL_CONFIRMATION';

  const catStr = session.slots.category;
  const streetStr = session.slots.street || 'Main Road';
  const areaStr = session.slots.area;
  const landStr = session.slots.landmark || 'locality center';
  const durStr = session.slots.duration || 'recently';
  const sevStr = session.slots.severity || 'identified issue';

  let confirmMsg = `Let me confirm:\n${catStr} at ${streetStr}, ${areaStr}, near ${landStr}, problem for ${durStr}, ${sevStr}.\nCorrect-ah?`;
  if (isTamil) {
    const catTamil = categoryTamilMap[session.slots.category] || session.slots.category;
    confirmMsg = `சரி, நான் உறுதிப்படுத்துகிறேன்:\n${catTamil} - ${streetStr}, ${areaStr}, ${landStr} அருகில், ${durStr} காலமாக உள்ளது, நிலைமை: ${sevStr}.\nபுகாரை பதிவு செய்யலாமா (ஆம் என கூறவும்)?`;
  } else if (isEnglish) {
    confirmMsg = `Let me confirm:\n${catStr} at ${streetStr}, ${areaStr}, near ${landStr}, problem for ${durStr}, ${sevStr}.\nIs this correct?`;
  }

  session.turns.push({ role: 'assistant', text: confirmMsg, lang: activeLang });

  return {
    reply: confirmMsg,
    stage: 'FINAL_CONFIRMATION',
    detectedLanguage: session.detectedLanguage,
    currentConversationLanguage: activeLang,
    responseLanguage: activeLang,
    originalText: cleanInput,
    normalizedText,
    corrections: normResult.corrections,
    slots: session.slots,
    shouldRegister: false
  };
}

module.exports = {
  processConversationTurn,
  getSessionState,
  clearSessionState
};
