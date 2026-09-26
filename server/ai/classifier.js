/**
 * VOXENTRA Classifier
 * Classifies Complaint Category, Computes Dynamic Priority, and Routes to Municipal Department.
 */

const CATEGORIES = {
  DAMAGED_ROAD: 'Damaged Road',
  WATER_LEAKAGE: 'Water Leakage',
  ELECTRICITY: 'Electricity Issue',
  GARBAGE: 'Garbage/Sanitation',
  ACCIDENT: 'Accident',
  THEFT: 'Theft',
  FIRE: 'Fire',
  OTHER: 'Other Civic Issue'
};

const CATEGORY_KEYWORDS = {
  [CATEGORIES.DAMAGED_ROAD]: [
    'road', 'damage', 'pothole', 'potholes', 'kuzhi', 'tar', 'salai', 'crater', 'asphalt',
    'pit', 'mudiyala', 'patch', 'broken road', 'speedbreaker', 'gutter',
    'ரோடு', 'சாலை', 'மோசம்', 'மோசமா', 'குழி', 'பள்ளம்', 'சேதம்', 'உடைப்பு'
  ],
  [CATEGORIES.WATER_LEAKAGE]: [
    'water', 'leak', 'leakage', 'pipe', 'pipeline', 'thanni', 'thanneer', 'udanju',
    'drinking water', 'siruvani', 'drainage', 'sewage', 'culvert', 'flood', 'overflow',
    'தண்ணீர்', 'தண்ணி', 'குடிநீர்', 'குழாய்', 'கசிவு', 'சாக்கடை', 'வடிகால்'
  ],
  [CATEGORIES.ELECTRICITY]: [
    'electric', 'electricity', 'current', 'power', 'wire', 'pole', 'transformer',
    'spark', 'sparking', 'shock', 'light', 'street light', 'fuse', 'blackout', 'short circuit',
    'மின்சாரம்', 'மின்தடை', 'கரண்ட்', 'ஒயர்', 'தீப்பொறி', 'மின் கம்பம்'
  ],
  [CATEGORIES.GARBAGE]: [
    'garbage', 'waste', 'kuppai', 'trash', 'dustbin', 'smell', 'bad smell', 'stray dog',
    'drain', 'sanitation', 'debris', 'litter', 'dump', 'clog',
    'குப்பை', 'கழிவு', 'துப்புரவு', 'நாற்றம்', 'தொட்டி'
  ],
  [CATEGORIES.ACCIDENT]: [
    'accident', 'crash', 'collision', 'hit', 'fell', 'injury', 'injured', 'bleeding',
    'hospital', 'ambulance', 'car', 'bike', 'bus', 'two wheeler', 'blood', 'casualty',
    'விபத்து', 'அடிபட்டது', 'இரத்தம்', 'ஆம்புலன்ஸ்'
  ],
  [CATEGORIES.THEFT]: [
    'theft', 'stolen', 'thief', 'robbery', 'snatch', 'chain', 'burglary', 'thirudan',
    'thiruttu', 'break in',
    'திருட்டு', 'திருடன்', 'பறிப்பு'
  ],
  [CATEGORIES.FIRE]: [
    'fire', 'flame', 'smoke', 'burning', 'theepori', 'theepidithu', 'cylinder', 'burn',
    'blaze', 'fire engine', 'thee',
    'தீ', 'நெருப்பு', 'புகை', 'தீ விபத்து'
  ]
};

// Emergency triggers
const EMERGENCY_TRIGGERS = [
  /bleed/i, /blood/i, /injury/i, /injured/i, /casualt/i, /unconscious/i, /serious/i,
  /fire\b/i, /theepidithu/i, /blaze\b/i, /cylinder\s*burst/i, /smoke\s*and\s*spark/i,
  /live\s*wire/i, /current\s*shock/i, /sparking/i, /emergency\b/i, /urgent\b/i,
  /highway\s*block/i, /ambulance/i, /life\s*danger/i, /drowning/i,
  /தீ\b/, /நெருப்பு/, /விபத்து/, /இரத்தம்/, /ஆபத்து/
];

const HIGH_PRIORITY_TRIGGERS = [
  /completely\s*blocked/i, /blocked/i, /cannot\s*move/i, /pipe\s*burst/i,
  /road\s*full/i, /huge\s*water/i, /transformer/i, /blackout/i, /heavy\s*traffic/i,
  /periya\s*kuzhi/i, /dangerous/i, /deep\s*hole/i, /skid/i,
  /முழுமையாக/, /தடைபட்டு/
];

function classifyComplaint(text = '') {
  const lower = text.toLowerCase();

  // 1. Determine Category
  const categoryScores = {};
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    categoryScores[cat] = 0;
    keywords.forEach((kw) => {
      if (lower.includes(kw)) {
        categoryScores[cat] += kw.length > 5 ? 2 : 1;
      }
    });
  }

  // Find category with highest score
  let detectedCategory = CATEGORIES.OTHER;
  let maxScore = 0;

  for (const [cat, score] of Object.entries(categoryScores)) {
    if (score > maxScore) {
      maxScore = score;
      detectedCategory = cat;
    }
  }

  // Fallback heuristic if zero score but obvious patterns
  if (maxScore === 0) {
    if (lower.includes('road')) detectedCategory = CATEGORIES.DAMAGED_ROAD;
    else if (lower.includes('water') || lower.includes('thanni')) detectedCategory = CATEGORIES.WATER_LEAKAGE;
    else if (lower.includes('light') || lower.includes('power')) detectedCategory = CATEGORIES.ELECTRICITY;
  }

  // 2. Determine Priority
  let priority = 'normal';
  let isEmergency = false;

  // Immediate emergency check
  for (const trigger of EMERGENCY_TRIGGERS) {
    if (trigger.test(lower)) {
      priority = 'emergency';
      isEmergency = true;
      break;
    }
  }

  // Fire and severe accidents are always emergency
  if (detectedCategory === CATEGORIES.FIRE) {
    priority = 'emergency';
    isEmergency = true;
  }

  if (!isEmergency) {
    for (const trigger of HIGH_PRIORITY_TRIGGERS) {
      if (trigger.test(lower)) {
        priority = 'high';
        break;
      }
    }
    if (priority === 'normal') {
      if (detectedCategory === CATEGORIES.DAMAGED_ROAD && (lower.includes('damage') || lower.includes('kuzhi'))) {
        priority = 'medium';
      } else if (detectedCategory === CATEGORIES.WATER_LEAKAGE) {
        priority = 'medium';
      } else if (detectedCategory === CATEGORIES.ELECTRICITY) {
        priority = 'medium';
      }
    }
  }

  // 3. Department Routing
  let departmentId = 1; // Default Roads
  let departmentName = 'Roads & Infrastructure';

  switch (detectedCategory) {
    case CATEGORIES.DAMAGED_ROAD:
      departmentId = 1;
      departmentName = 'Roads & Infrastructure';
      break;
    case CATEGORIES.WATER_LEAKAGE:
      departmentId = 2;
      departmentName = 'Water Supply & Drainage';
      break;
    case CATEGORIES.GARBAGE:
      departmentId = 3;
      departmentName = 'Sanitation & Solid Waste';
      break;
    case CATEGORIES.ELECTRICITY:
      departmentId = 4;
      departmentName = 'Electricity & Street Lighting (TNEB)';
      break;
    case CATEGORIES.ACCIDENT:
      departmentId = 5; // Police
      departmentName = 'Police & Public Safety';
      break;
    case CATEGORIES.THEFT:
      departmentId = 5;
      departmentName = 'Police & Public Safety';
      break;
    case CATEGORIES.FIRE:
      departmentId = 6; // Fire
      departmentName = 'Fire & Rescue Services';
      break;
    default:
      departmentId = 7;
      departmentName = 'Public Health & Pollution';
  }

  return {
    category: detectedCategory,
    confidence: maxScore > 0 ? Math.min(0.99, 0.75 + maxScore * 0.05) : 0.6,
    priority,
    isEmergency,
    departmentId,
    departmentName
  };
}

module.exports = {
  classifyComplaint,
  CATEGORIES
};
