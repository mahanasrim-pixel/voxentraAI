/**
 * Master Coimbatore Landmark Intelligence Dataset
 * 
 * Hierarchy:
 * Tamil Nadu -> Coimbatore District -> Taluk -> Area / Locality -> Street / Road -> Landmark -> Coordinates
 * 
 * Separate master data entity from places/areas table.
 */

const LANDMARK_TYPES = {
  TRANSPORT: 'TRANSPORT',
  HOSPITAL: 'HOSPITAL',
  POLICE: 'POLICE',
  FIRE_STATION: 'FIRE_STATION',
  GOVERNMENT_OFFICE: 'GOVERNMENT_OFFICE',
  EDUCATION: 'EDUCATION',
  MALL: 'MALL',
  TEMPLE: 'TEMPLE',
  CHURCH: 'CHURCH',
  MOSQUE: 'MOSQUE',
  PARK: 'PARK',
  TOURIST_PLACE: 'TOURIST_PLACE',
  BUS_STAND: 'BUS_STAND',
  RAILWAY_STATION: 'RAILWAY_STATION',
  AIRPORT: 'AIRPORT',
  JUNCTION: 'JUNCTION',
  MARKET: 'MARKET',
  SHOPPING_AREA: 'SHOPPING_AREA',
  COLLEGE: 'COLLEGE',
  UNIVERSITY: 'UNIVERSITY',
  LANDMARK_BUILDING: 'LANDMARK_BUILDING',
  DAM: 'DAM',
  WATERFALL: 'WATERFALL',
  OTHER: 'OTHER'
};

const COIMBATORE_LANDMARKS = [
  // ==========================================
  // CENTRAL COIMBATORE
  // ==========================================
  {
    landmark_id: 'LM-CBE-JN',
    landmark_name: 'Coimbatore Junction Railway Station',
    tamil_name: 'கோயம்புத்தூர் ரயில் நிலையம்',
    aliases: [
      'Coimbatore Railway Station', 'CBE Railway Station', 'Coimbatore station', 'Coimbatore junction',
      'cbe junction', 'coimbatore railway station near', 'coimbatore jn', 'கோவை ரயில் நிலையம்',
      'கோயம்புத்தூர் சந்திப்பு', 'coimbatore station pakkam'
    ],
    landmark_type: LANDMARK_TYPES.RAILWAY_STATION,
    district: 'Coimbatore',
    taluk: 'Coimbatore South',
    area: 'Town Hall',
    street: 'Goods Shed Road',
    road: 'State Bank Road',
    latitude: 11.0003,
    longitude: 76.9665,
    address: 'Goods Shed Rd, Gopalapuram, Coimbatore, Tamil Nadu 641018',
    search_keywords: 'railway train station coimbatore cbe junction travel central'
  },
  {
    landmark_id: 'LM-GANDHIPURAM-BS',
    landmark_name: 'Gandhipuram Bus Stand',
    tamil_name: 'காந்திபுரம் பஸ் ஸ்டாண்ட்',
    aliases: [
      'Gandhipuram Central Bus Stand', 'Gandhipuram bus stop', 'Gandhipuram stand',
      'Gandhipuram bus stand pakkathula', 'Gandhipuram bus stop pakkam',
      'காந்திபுரம் பேருந்து நிலையம்', 'காந்திபுரம் பஸ் நிலையம்', 'காந்திபுரம் பஸ் ஸ்டாண்ட்'
    ],
    landmark_type: LANDMARK_TYPES.BUS_STAND,
    district: 'Coimbatore',
    taluk: 'Coimbatore North',
    area: 'Gandhipuram',
    street: 'Cross Cut Road',
    road: 'Dr Nanjappa Road',
    latitude: 11.0168,
    longitude: 76.9678,
    address: 'Cross Cut Rd, Gandhipuram, Coimbatore, Tamil Nadu 641012',
    search_keywords: 'gandhipuram bus stand mofussil central travel transit'
  },
  {
    landmark_id: 'LM-UKKADAM-BS',
    landmark_name: 'Ukkadam Bus Stand',
    tamil_name: 'உக்கடம் பஸ் ஸ்டாண்ட்',
    aliases: [
      'Ukkadam bus stop', 'Ukkadam stand', 'Ukkadam bus stand pakkathula', 'Ukkadam bus stand pakkam',
      'Ukkadam central bus stand', 'உக்கடம் பேருந்து நிலையம்', 'உக்கடம் பஸ் நிலையம்', 'உக்கடம் பஸ் ஸ்டாண்ட்'
    ],
    landmark_type: LANDMARK_TYPES.BUS_STAND,
    district: 'Coimbatore',
    taluk: 'Coimbatore South',
    area: 'Ukkadam',
    street: 'Palakkad Road',
    road: 'Pollachi Road',
    latitude: 10.9892,
    longitude: 76.9602,
    address: 'Palakkad Main Rd, Ukkadam, Coimbatore, Tamil Nadu 641001',
    search_keywords: 'ukkadam bus stand south transit pollachi palakkad'
  },
  {
    landmark_id: 'LM-TOWN-HALL',
    landmark_name: 'Town Hall',
    tamil_name: 'டவுன் ஹால்',
    aliases: [
      'Townhall', 'Town hall area', 'Town hall junction', 'டவுன்ஹால்', 'டவுன் ஹால்'
    ],
    landmark_type: LANDMARK_TYPES.GOVERNMENT_OFFICE,
    district: 'Coimbatore',
    taluk: 'Coimbatore South',
    area: 'Town Hall',
    street: 'Raja Street',
    road: 'Big Bazaar Street',
    latitude: 10.9972,
    longitude: 76.9615,
    address: 'Raja St, Town Hall, Coimbatore, Tamil Nadu 641001',
    search_keywords: 'town hall corporation heritage municipal central'
  },
  {
    landmark_id: 'LM-CLOCK-TOWER',
    landmark_name: 'Manikoondu / Clock Tower',
    tamil_name: 'மணிக்கூண்டு',
    aliases: [
      'Clock Tower', 'Town Hall Manikoondu', 'Manikundu', 'Manikoondu', 'மணிக்கூண்டு'
    ],
    landmark_type: LANDMARK_TYPES.LANDMARK_BUILDING,
    district: 'Coimbatore',
    taluk: 'Coimbatore South',
    area: 'Town Hall',
    street: 'Raja Street',
    road: 'Big Bazaar Street',
    latitude: 10.9968,
    longitude: 76.9620,
    address: 'Near Town Hall, Raja St, Coimbatore, Tamil Nadu 641001',
    search_keywords: 'manikoondu clock tower town hall junction historical'
  },
  {
    landmark_id: 'LM-COLLECTORATE',
    landmark_name: 'District Collectorate',
    tamil_name: 'மாவட்ட ஆட்சியர் அலுவலகம்',
    aliases: [
      'Coimbatore Collectorate', 'Collector Office', 'Coimbatore Collector Office',
      'ஆட்சியர் அலுவலகம்', 'கலெக்டர் ஆபீஸ்'
    ],
    landmark_type: LANDMARK_TYPES.GOVERNMENT_OFFICE,
    district: 'Coimbatore',
    taluk: 'Coimbatore South',
    area: 'Gopalapuram',
    street: 'State Bank Road',
    road: 'State Bank Road',
    latitude: 11.0028,
    longitude: 76.9696,
    address: 'State Bank Rd, Gopalapuram, Coimbatore, Tamil Nadu 641018',
    search_keywords: 'district collector collectorate revenue administration government'
  },
  {
    landmark_id: 'LM-POLICE-COMMISSIONERATE',
    landmark_name: 'Coimbatore Police Commissionerate',
    tamil_name: 'காவல் ஆணையர் அலுவலகம்',
    aliases: [
      'Police Commissioner Office', 'Commissioner of Police', 'CBE City Police Office',
      'காவல் ஆணையரகம்', 'போலீஸ் கமிஷனர் ஆபீஸ்'
    ],
    landmark_type: LANDMARK_TYPES.POLICE,
    district: 'Coimbatore',
    taluk: 'Coimbatore South',
    area: 'Gopalapuram',
    street: 'Huzur Road',
    road: 'Huzur Road',
    latitude: 11.0045,
    longitude: 76.9720,
    address: 'Huzur Rd, Gopalapuram, Coimbatore, Tamil Nadu 641018',
    search_keywords: 'police commissioner security law enforcement commissionerate'
  },
  {
    landmark_id: 'LM-COIMBATORE-GH',
    landmark_name: 'Coimbatore Government Hospital',
    tamil_name: 'கோவை அரசு மருத்துவமனை',
    aliases: [
      'CMCH', 'Government Medical College Hospital', 'Coimbatore Medical College Hospital',
      'GH Coimbatore', 'Coimbatore GH', 'அரசு பொது மருத்துவமனை', 'அரசு ஆஸ்பத்திரி'
    ],
    landmark_type: LANDMARK_TYPES.HOSPITAL,
    district: 'Coimbatore',
    taluk: 'Coimbatore South',
    area: 'Gopalapuram',
    street: 'Trichy Road',
    road: 'Trichy Road',
    latitude: 10.9995,
    longitude: 76.9685,
    address: 'Trichy Rd, Gopalapuram, Coimbatore, Tamil Nadu 641018',
    search_keywords: 'cmch government hospital medical health emergency'
  },
  {
    landmark_id: 'LM-VOC-PARK',
    landmark_name: 'VOC Park',
    tamil_name: 'வ.உ.சி பூங்கா',
    aliases: [
      'V.O.C Park', 'VOC Park and Zoo', 'VOC grounds', 'VOC stadium', 'வ உ சி பூங்கா', 'வி ஓ சி பார்க்'
    ],
    landmark_type: LANDMARK_TYPES.PARK,
    district: 'Coimbatore',
    taluk: 'Coimbatore South',
    area: 'Gopalapuram',
    street: 'Jail Road',
    road: 'Park Gate Road',
    latitude: 11.0075,
    longitude: 76.9725,
    address: 'Jail Rd, Gopalapuram, Coimbatore, Tamil Nadu 641018',
    search_keywords: 'voc park zoo recreation stadium garden central'
  },
  {
    landmark_id: 'LM-VALANKULAM',
    landmark_name: 'Valankulam',
    tamil_name: 'வாலாங்குளம்',
    aliases: [
      'Valankulam Lake', 'Valankulam boathouse', 'Valankulam promenade', 'வாலாங்குளம் ஏரி'
    ],
    landmark_type: LANDMARK_TYPES.TOURIST_PLACE,
    district: 'Coimbatore',
    taluk: 'Coimbatore South',
    area: 'Sungam',
    street: 'Sungam Bypass Road',
    road: 'Trichy Road',
    latitude: 10.9920,
    longitude: 76.9760,
    address: 'Sungam Bypass, Ramanathapuram, Coimbatore, Tamil Nadu 641045',
    search_keywords: 'valankulam lake smart city sungam bypass water body tourist'
  },
  {
    landmark_id: 'LM-KONIAMMAN-TEMPLE',
    landmark_name: 'Koniamman Temple',
    tamil_name: 'கோனியம்மன் கோவில்',
    aliases: [
      'Arulmigu Koniamman Temple', 'Koni Amman Kovil', 'Town Hall Kovil', 'கோனியம்மன் திருக்கோவில்'
    ],
    landmark_type: LANDMARK_TYPES.TEMPLE,
    district: 'Coimbatore',
    taluk: 'Coimbatore South',
    area: 'Town Hall',
    street: 'Big Bazaar Street',
    road: 'Big Bazaar Street',
    latitude: 10.9965,
    longitude: 76.9605,
    address: 'Big Bazaar St, Town Hall, Coimbatore, Tamil Nadu 641001',
    search_keywords: 'koniamman temple god goddess town hall historic big bazaar'
  },
  {
    landmark_id: 'LM-BROOKFIELDS',
    landmark_name: 'Brookefields Mall',
    tamil_name: 'புரூக்ஃபீல்ட்ஸ் மால்',
    aliases: [
      'Brookfields', 'Brookefields', 'Brookfield mall', 'Brookfields mall',
      'Brookfields pakkam', 'Brookefields-la', 'ப்ரூக்ஃபீல்ட்ஸ்', 'புரூக்ஃபீல்ட்ஸ் மால்'
    ],
    landmark_type: LANDMARK_TYPES.MALL,
    district: 'Coimbatore',
    taluk: 'Coimbatore South',
    area: 'RS Puram',
    street: 'Dr Krishnasamy Road',
    road: 'Sukrawarpettai Main Road',
    latitude: 11.0084,
    longitude: 76.9572,
    address: '67-71, Dr Krishnasamy Rd, Brookefields, Coimbatore, Tamil Nadu 641001',
    search_keywords: 'brookefields brookfields mall shopping cinema multiplex'
  },
  {
    landmark_id: 'LM-RACE-COURSE',
    landmark_name: 'Race Course',
    tamil_name: 'ரேஸ் கோர்ஸ்',
    aliases: [
      'Race Course Road', 'Racecourse', 'Race Course walking track', 'ரேஸ்கோர்ஸ்', 'ரேஸ் கோர்ஸ்'
    ],
    landmark_type: LANDMARK_TYPES.PARK,
    district: 'Coimbatore',
    taluk: 'Coimbatore South',
    area: 'Race Course',
    street: 'Race Course Road',
    road: 'Race Course Road',
    latitude: 11.0010,
    longitude: 76.9790,
    address: 'Race Course Rd, Gopalapuram, Coimbatore, Tamil Nadu 641018',
    search_keywords: 'race course walking promenade walking track posh residential central'
  },

  // ==========================================
  // GANDHIPURAM
  // ==========================================
  {
    landmark_id: 'LM-SEMMOZHI-POONGA',
    landmark_name: 'Semmozhi Poonga',
    tamil_name: 'செம்மொழிப் பூங்கா',
    aliases: [
      'Semmozhi park', 'Central Prison Park', 'Coimbatore Central Prison site park', 'செம்மொழி பூங்கா'
    ],
    landmark_type: LANDMARK_TYPES.PARK,
    district: 'Coimbatore',
    taluk: 'Coimbatore North',
    area: 'Gandhipuram',
    street: 'Dr Nanjappa Road',
    road: 'Cross Cut Road',
    latitude: 11.0110,
    longitude: 76.9690,
    address: 'Dr Nanjappa Rd, Gandhipuram, Coimbatore, Tamil Nadu 641018',
    search_keywords: 'semmozhi poonga botanical garden prison site gandhipuram nature'
  },
  {
    landmark_id: 'LM-CROSS-CUT-ROAD',
    landmark_name: 'Cross Cut Road',
    tamil_name: 'கிராஸ் கட் ரோடு',
    aliases: [
      'Crosscut Road', 'Cross Cut Rd', 'Cross Cut', 'கிராஸ்கட் ரோடு', 'கிராஸ் கட் சாலை'
    ],
    landmark_type: LANDMARK_TYPES.SHOPPING_AREA,
    district: 'Coimbatore',
    taluk: 'Coimbatore North',
    area: 'Gandhipuram',
    street: 'Cross Cut Road',
    road: 'Cross Cut Road',
    latitude: 11.0175,
    longitude: 76.9650,
    address: 'Cross Cut Rd, Gandhipuram, Coimbatore, Tamil Nadu 641012',
    search_keywords: 'cross cut shopping textiles commercial jewelry gandhipuram'
  },
  {
    landmark_id: 'LM-100-FEET-ROAD',
    landmark_name: '100 Feet Road',
    tamil_name: '100 அடி ரோடு',
    aliases: [
      'Hundred Feet Road', '100 ft road', '100 feet road gandhipuram', '100 அடி சாலை'
    ],
    landmark_type: LANDMARK_TYPES.SHOPPING_AREA,
    district: 'Coimbatore',
    taluk: 'Coimbatore North',
    area: 'Gandhipuram',
    street: '100 Feet Road',
    road: '100 Feet Road',
    latitude: 11.0205,
    longitude: 76.9680,
    address: '100 Feet Rd, Gandhipuram, Coimbatore, Tamil Nadu 641012',
    search_keywords: '100 feet hundred feet road commercial hub gandhipuram'
  },
  {
    landmark_id: 'LM-GANDHIPURAM-SIGNAL',
    landmark_name: 'Gandhipuram Signal / Junction',
    tamil_name: 'காந்திபுரம் சிக்னல் / சந்திப்பு',
    aliases: [
      'Gandhipuram flyover', 'Gandhipuram junction', 'Gandhipuram signal', 'காந்திபுரம் சந்திப்பு'
    ],
    landmark_type: LANDMARK_TYPES.JUNCTION,
    district: 'Coimbatore',
    taluk: 'Coimbatore North',
    area: 'Gandhipuram',
    street: 'Sathy Road',
    road: 'Bharathiar Road',
    latitude: 11.0160,
    longitude: 76.9675,
    address: 'Gandhipuram Flyover Junction, Coimbatore, Tamil Nadu 641012',
    search_keywords: 'gandhipuram signal flyover junction traffic crossroads'
  },

  // ==========================================
  // RS PURAM
  // ==========================================
  {
    landmark_id: 'LM-DB-ROAD',
    landmark_name: 'DB Road',
    tamil_name: 'டி.பி. ரோடு',
    aliases: [
      'Diwan Bahadur Road', 'D.B. Road', 'DB road rs puram', 'டிபி ரோடு', 'திவான் பகதூர் ரோடு'
    ],
    landmark_type: LANDMARK_TYPES.SHOPPING_AREA,
    district: 'Coimbatore',
    taluk: 'Coimbatore South',
    area: 'RS Puram',
    street: 'DB Road',
    road: 'DB Road',
    latitude: 11.0105,
    longitude: 76.9490,
    address: 'Diwan Bahadur Rd, R.S. Puram, Coimbatore, Tamil Nadu 641002',
    search_keywords: 'db road diwan bahadur commercial shopping restaurants cafes rs puram'
  },
  {
    landmark_id: 'LM-SRI-MURUGAN-TEMPLE-RSP',
    landmark_name: 'Sri Murugan Temple',
    tamil_name: 'ஸ்ரீ முருகன் கோவில் ஆர்.எஸ்.புரம்',
    aliases: [
      'RS Puram Murugan Temple', 'West Club Road Murugan Temple', 'ஆர்.எஸ்.புரம் முருகன் கோவில்'
    ],
    landmark_type: LANDMARK_TYPES.TEMPLE,
    district: 'Coimbatore',
    taluk: 'Coimbatore South',
    area: 'RS Puram',
    street: 'West Club Road',
    road: 'DB Road',
    latitude: 11.0112,
    longitude: 76.9478,
    address: 'West Club Rd, R.S. Puram, Coimbatore, Tamil Nadu 641002',
    search_keywords: 'murugan temple rs puram spirituality prayer worship'
  },
  {
    landmark_id: 'LM-GASS-FOREST-MUSEUM',
    landmark_name: 'Gass Forest Museum',
    tamil_name: 'காஸ் வன அருங்காட்சியகம்',
    aliases: [
      'Forest Museum', 'Gass Museum', 'Forest College Museum', 'காஸ் மியூசியம்'
    ],
    landmark_type: LANDMARK_TYPES.TOURIST_PLACE,
    district: 'Coimbatore',
    taluk: 'Coimbatore South',
    area: 'RS Puram',
    street: 'Cowley Brown Road',
    road: 'Forest College Campus',
    latitude: 11.0165,
    longitude: 76.9430,
    address: 'Cowley Brown Rd, R.S. Puram, Coimbatore, Tamil Nadu 641002',
    search_keywords: 'gass forest museum nature forestry wildlife education rs puram'
  },
  {
    landmark_id: 'LM-BHARATHI-PARK',
    landmark_name: 'Bharathi Park',
    tamil_name: 'பாரதி பூங்கா',
    aliases: [
      'Bharathi Park RS Puram', 'RS Puram Park', 'பாரதி பார்க்'
    ],
    landmark_type: LANDMARK_TYPES.PARK,
    district: 'Coimbatore',
    taluk: 'Coimbatore South',
    area: 'RS Puram',
    street: 'DB Road',
    road: 'DB Road',
    latitude: 11.0090,
    longitude: 76.9495,
    address: 'DB Rd, R.S. Puram, Coimbatore, Tamil Nadu 641002',
    search_keywords: 'bharathi park walking children garden rs puram green'
  },
  {
    landmark_id: 'LM-COWLEY-BROWN-ROAD',
    landmark_name: 'Cowley Brown Road',
    tamil_name: 'கௌலி பிரவுன் ரோடு',
    aliases: [
      'Cowley Brown Rd', 'Cowley Brown Road RS Puram', 'கௌலி பிரவுன் சாலை'
    ],
    landmark_type: LANDMARK_TYPES.JUNCTION,
    district: 'Coimbatore',
    taluk: 'Coimbatore South',
    area: 'RS Puram',
    street: 'Cowley Brown Road',
    road: 'Lawley Road',
    latitude: 11.0150,
    longitude: 76.9440,
    address: 'Cowley Brown Rd, R.S. Puram, Coimbatore, Tamil Nadu 641002',
    search_keywords: 'cowley brown road forest college rs puram junction'
  },

  // ==========================================
  // PEELAMEDU
  // ==========================================
  {
    landmark_id: 'LM-CBE-AIRPORT',
    landmark_name: 'Coimbatore International Airport',
    tamil_name: 'கோயம்புத்தூர் பன்னாட்டு விமான நிலையம்',
    aliases: [
      'Coimbatore Airport', 'CJB Airport', 'Peelamedu Airport', 'Airport',
      'flight station', 'விமான நிலையம்', 'கோவை ஏர்போர்ட்', 'கோவை விமான நிலையம்'
    ],
    landmark_type: LANDMARK_TYPES.AIRPORT,
    district: 'Coimbatore',
    taluk: 'Coimbatore South',
    area: 'Peelamedu',
    street: 'Airport Road',
    road: 'Avinashi Road',
    latitude: 11.0298,
    longitude: 77.0434,
    address: 'Airport Rd, Peelamedu, Coimbatore, Tamil Nadu 641014',
    search_keywords: 'airport cjb flights travel international domestic peelamedu avinashi'
  },
  {
    landmark_id: 'LM-PSG-TECH',
    landmark_name: 'PSG College of Technology',
    tamil_name: 'பி.எஸ்.ஜி தொழில்நுட்பக் கல்லூரி',
    aliases: [
      'PSG Tech', 'PSG College', 'PSG Engineering College', 'PSG Tech Peelamedu',
      'பிஎஸ்ஜி டெக்', 'பி.எஸ்.ஜி காலேஜ்'
    ],
    landmark_type: LANDMARK_TYPES.COLLEGE,
    district: 'Coimbatore',
    taluk: 'Coimbatore South',
    area: 'Peelamedu',
    street: 'Avinashi Road',
    road: 'Avinashi Road',
    latitude: 11.0245,
    longitude: 77.0030,
    address: 'Avinashi Rd, Peelamedu, Coimbatore, Tamil Nadu 641004',
    search_keywords: 'psg tech college engineering education peelamedu avinashi'
  },
  {
    landmark_id: 'LM-PSG-HOSPITALS',
    landmark_name: 'PSG Hospitals',
    tamil_name: 'பி.எஸ்.ஜி மருத்துவமனை',
    aliases: [
      'PSG Hospital', 'PSG IMS', 'PSG Institute of Medical Sciences', 'பிஎஸ்ஜி ஆஸ்பத்திரி'
    ],
    landmark_type: LANDMARK_TYPES.HOSPITAL,
    district: 'Coimbatore',
    taluk: 'Coimbatore South',
    area: 'Peelamedu',
    street: 'Avinashi Road',
    road: 'Avinashi Road',
    latitude: 11.0255,
    longitude: 77.0065,
    address: 'Avinashi Rd, Peelamedu, Coimbatore, Tamil Nadu 641004',
    search_keywords: 'psg hospital medical healthcare super specialty peelamedu emergency'
  },
  {
    landmark_id: 'LM-TIDEL-PARK',
    landmark_name: 'TIDEL Park',
    tamil_name: 'டைடல் பார்க்',
    aliases: [
      'TIDEL Park Coimbatore', 'Tidel Park', 'Tidel', 'TIDEL Park Peelamedu',
      'Tidel Park pakkam', 'Tidel Park pakkathula', 'டைடல் பார்க் கோவை', 'டைடல் பார்க்'
    ],
    landmark_type: LANDMARK_TYPES.LANDMARK_BUILDING,
    district: 'Coimbatore',
    taluk: 'Coimbatore South',
    area: 'Peelamedu',
    street: 'Civil Aerodrome Post',
    road: 'Avinashi Road',
    latitude: 11.0267,
    longitude: 77.0272,
    address: 'Avinashi Rd, ELCOSEZ, Civil Aerodrome Post, Peelamedu, Coimbatore, Tamil Nadu 641014',
    search_keywords: 'tidel park it park technology software elcot peelamedu sez'
  },
  {
    landmark_id: 'LM-CODISSIA',
    landmark_name: 'CODISSIA Trade Fair Complex',
    tamil_name: 'கொடிசியா வர்த்தக வளாகம்',
    aliases: [
      'CODISSIA', 'Codissia ground', 'Codissia Fair Grounds', 'கொடிசியா'
    ],
    landmark_type: LANDMARK_TYPES.LANDMARK_BUILDING,
    district: 'Coimbatore',
    taluk: 'Coimbatore South',
    area: 'Peelamedu',
    street: 'G.V. Fair Grounds Road',
    road: 'Avinashi Road',
    latitude: 11.0370,
    longitude: 77.0345,
    address: 'G.V. Fair Grounds Rd, Civil Aerodrome Post, Peelamedu, Coimbatore, Tamil Nadu 641014',
    search_keywords: 'codissia exhibition fair trade industry peelamedu'
  },
  {
    landmark_id: 'LM-PEELAMEDU-JN',
    landmark_name: 'Peelamedu Junction',
    tamil_name: 'பீளமேடு சந்திப்பு',
    aliases: [
      'Peelamedu signal', 'Peelamedu bus stop', 'Peelamedu junction avinashi road', 'பீளமேடு சிக்னல்'
    ],
    landmark_type: LANDMARK_TYPES.JUNCTION,
    district: 'Coimbatore',
    taluk: 'Coimbatore South',
    area: 'Peelamedu',
    street: 'Avinashi Road',
    road: 'Avinashi Road',
    latitude: 11.0238,
    longitude: 77.0018,
    address: 'Avinashi Rd, Peelamedu, Coimbatore, Tamil Nadu 641004',
    search_keywords: 'peelamedu junction signal traffic avinashi road'
  },

  // ==========================================
  // SARAVANAMPATTI
  // ==========================================
  {
    landmark_id: 'LM-PROZONE-MALL',
    landmark_name: 'Prozone Mall',
    tamil_name: 'புரோசான் மால்',
    aliases: [
      'Prozone', 'Prozone mall', 'Prozone Mall Saravanampatti', 'Prozone-la', 'Prozone pakkam',
      'Prozone mall pakkathula', 'Prozone mall near', 'Prozon mall', 'Prozon',
      'ப்ரோசோன்', 'ப்ரோசோன் மால்', 'புரோசான் மால்', 'புரோசோன்'
    ],
    landmark_type: LANDMARK_TYPES.MALL,
    district: 'Coimbatore',
    taluk: 'Coimbatore North',
    area: 'Saravanampatti',
    street: 'Sathy Road',
    road: 'Sathy Road',
    latitude: 11.0558,
    longitude: 76.9942,
    address: 'Sathy Rd, Sivanandhapuram, Saravanampatti, Coimbatore, Tamil Nadu 641035',
    search_keywords: 'prozone mall shopping multiplex cinema saravanampatti sathy road retail'
  },
  {
    landmark_id: 'LM-KCT',
    landmark_name: 'Kumaraguru College of Technology',
    tamil_name: 'குமரகுரு தொழில்நுட்பக் கல்லூரி',
    aliases: [
      'KCT', 'KCT college', 'Kumaraguru College', 'KCT area', 'KCT Saravanampatti',
      'குமரகுரு காலேஜ்', 'கேசிடி'
    ],
    landmark_type: LANDMARK_TYPES.COLLEGE,
    district: 'Coimbatore',
    taluk: 'Coimbatore North',
    area: 'Saravanampatti',
    street: 'Chinnavedampatti Road',
    road: 'Sathy Road',
    latitude: 11.0792,
    longitude: 76.9897,
    address: 'Athipalayam Rd, Chinnavedampatti, Saravanampatti, Coimbatore, Tamil Nadu 641049',
    search_keywords: 'kct kumaraguru college engineering technology saravanampatti education'
  },
  {
    landmark_id: 'LM-SARAVANAMPATTI-JN',
    landmark_name: 'Saravanampatti Junction',
    tamil_name: 'சரவணம்பட்டி சந்திப்பு',
    aliases: [
      'Saravanampatti signal', 'Saravanampatti bus stop', 'Saravanampatti 4 roads',
      'சரவணம்பட்டி சிக்னல்', 'சரவணம்பட்டி நான்கு ரோடு'
    ],
    landmark_type: LANDMARK_TYPES.JUNCTION,
    district: 'Coimbatore',
    taluk: 'Coimbatore North',
    area: 'Saravanampatti',
    street: 'Sathy Road',
    road: 'Thudiyalur Road',
    latitude: 11.0795,
    longitude: 76.9995,
    address: 'Sathy Rd & Thudiyalur Rd, Saravanampatti, Coimbatore, Tamil Nadu 641035',
    search_keywords: 'saravanampatti junction signal crossroads traffic sathy road'
  },
  {
    landmark_id: 'LM-KGISL-CAMPUS',
    landmark_name: 'KGISL Tech Park',
    tamil_name: 'கே.ஜி.ஐ.எஸ்.எல் தொழில்நுட்ப பூங்கா',
    aliases: [
      'KGISL Campus', 'KGISL', 'CHIL SEZ', 'Keeranatham KGISL', 'கேஜிஐஎஸ்எல்'
    ],
    landmark_type: LANDMARK_TYPES.LANDMARK_BUILDING,
    district: 'Coimbatore',
    taluk: 'Coimbatore North',
    area: 'Saravanampatti',
    street: 'CHIL SEZ Road',
    road: 'Keeranatham Road',
    latitude: 11.0835,
    longitude: 76.9980,
    address: 'CHIL SEZ, Keeranatham Rd, Saravanampatti, Coimbatore, Tamil Nadu 641035',
    search_keywords: 'kgisl chil sez it park technology software saravanampatti'
  },

  // ==========================================
  // KALAPATTI
  // ==========================================
  {
    landmark_id: 'LM-KALAPATTI-JN',
    landmark_name: 'Kalapatti Main Road Junction',
    tamil_name: 'காளப்பட்டி மெயின் ரோடு சந்திப்பு',
    aliases: [
      'Kalapatti Junction', 'Kalapatti bus stop', 'Kalapatti 4 road', 'காளப்பட்டி சந்திப்பு'
    ],
    landmark_type: LANDMARK_TYPES.JUNCTION,
    district: 'Coimbatore',
    taluk: 'Coimbatore North',
    area: 'Kalapatti',
    street: 'Kalapatti Main Road',
    road: 'Kalapatti Main Road',
    latitude: 11.0725,
    longitude: 77.0350,
    address: 'Kalapatti Main Rd, Kalapatti, Coimbatore, Tamil Nadu 641048',
    search_keywords: 'kalapatti main road junction bus stop crossroads north'
  },
  {
    landmark_id: 'LM-NGP-COLLEGE',
    landmark_name: 'Dr. N.G.P. / Nehru Arts and Science College area',
    tamil_name: 'என்.ஜி.பி / நேரு கலை அறிவியல் கல்லூரி பகுதி',
    aliases: [
      'NGP College', 'Dr NGP Arts and Science', 'Nehru Arts and Science College area',
      'NGP Hospital Kalapatti', 'என்ஜிபி காலேஜ்'
    ],
    landmark_type: LANDMARK_TYPES.COLLEGE,
    district: 'Coimbatore',
    taluk: 'Coimbatore North',
    area: 'Kalapatti',
    street: 'Kalapatti Road',
    road: 'Kalapatti Road',
    latitude: 11.0605,
    longitude: 77.0420,
    address: 'Dr N.G.P. Nagar, Kalapatti Rd, Coimbatore, Tamil Nadu 641048',
    search_keywords: 'ngp nehru arts science college education hospital kalapatti'
  },

  // ==========================================
  // GANAPATHY
  // ==========================================
  {
    landmark_id: 'LM-GANAPATHY-BS',
    landmark_name: 'Ganapathy Bus Stop / Junction',
    tamil_name: 'கணபதி பஸ் நிறுத்தம் / சந்திப்பு',
    aliases: [
      'Ganapathy Bus Stop', 'Ganapathy Junction', 'Ganapathy signal', 'கணபதி பஸ் ஸ்டாப்', 'கணபதி சந்திப்பு'
    ],
    landmark_type: LANDMARK_TYPES.BUS_STAND,
    district: 'Coimbatore',
    taluk: 'Coimbatore North',
    area: 'Ganapathy',
    street: 'Sathy Road',
    road: 'Sathy Road',
    latitude: 11.0375,
    longitude: 76.9835,
    address: 'Sathy Rd, Ganapathy, Coimbatore, Tamil Nadu 641006',
    search_keywords: 'ganapathy bus stop junction sathy road traffic commercial'
  },
  {
    landmark_id: 'LM-GANAPATHY-MARKET',
    landmark_name: 'Ganapathy Market',
    tamil_name: 'கணபதி உழவர் சந்தை / மார்க்கெட்',
    aliases: [
      'Ganapathy uzhavar sandhai', 'Ganapathy vegetable market', 'கணபதி சந்தை'
    ],
    landmark_type: LANDMARK_TYPES.MARKET,
    district: 'Coimbatore',
    taluk: 'Coimbatore North',
    area: 'Ganapathy',
    street: 'Sathy Road',
    road: 'Athipalayam Road',
    latitude: 11.0390,
    longitude: 76.9840,
    address: 'Ganapathy Market, Sathy Rd, Coimbatore, Tamil Nadu 641006',
    search_keywords: 'ganapathy market sandhai shopping vegetables groceries'
  },

  // ==========================================
  // SAIBABA COLONY
  // ==========================================
  {
    landmark_id: 'LM-SAIBABA-COLONY-BS',
    landmark_name: 'Saibaba Colony Bus Stop / Junction',
    tamil_name: 'சாய்பாபா காலனி பஸ் நிறுத்தம் / சந்திப்பு',
    aliases: [
      'Saibaba Colony Bus Stop', 'Saibaba Colony Junction', 'Saibaba Colony signal',
      'Saibaba kovil bus stop', 'சாய்பாபா காலனி பஸ் ஸ்டாப்'
    ],
    landmark_type: LANDMARK_TYPES.BUS_STAND,
    district: 'Coimbatore',
    taluk: 'Coimbatore North',
    area: 'Saibaba Colony',
    street: 'NSR Road',
    road: 'Mettupalayam Road',
    latitude: 11.0290,
    longitude: 76.9450,
    address: 'Mettupalayam Rd & NSR Rd, Saibaba Colony, Coimbatore, Tamil Nadu 641011',
    search_keywords: 'saibaba colony bus stop junction nsr road mtp road'
  },
  {
    landmark_id: 'LM-NSR-ROAD-COMMERCIAL',
    landmark_name: 'NSR Road',
    tamil_name: 'என்.எஸ்.ஆர். ரோடு',
    aliases: [
      'N.S.R. Road', 'NSR Road Saibaba Colony', 'என்எஸ்ஆர் ரோடு'
    ],
    landmark_type: LANDMARK_TYPES.SHOPPING_AREA,
    district: 'Coimbatore',
    taluk: 'Coimbatore North',
    area: 'Saibaba Colony',
    street: 'NSR Road',
    road: 'NSR Road',
    latitude: 11.0305,
    longitude: 76.9420,
    address: 'NSR Rd, Saibaba Colony, Coimbatore, Tamil Nadu 641011',
    search_keywords: 'nsr road commercial shopping restaurants saibaba colony'
  },

  // ==========================================
  // SINGANALLUR
  // ==========================================
  {
    landmark_id: 'LM-SINGANALLUR-BS',
    landmark_name: 'Singanallur Bus Stand',
    tamil_name: 'சிங்கநல்லூர் பஸ் ஸ்டாண்ட்',
    aliases: [
      'Singanallur bus stop', 'Singanallur stand', 'Singanallur bus stand pakkathula',
      'சிங்கநல்லூர் பேருந்து நிலையம்', 'சிங்கநல்லூர் பஸ் ஸ்டாண்ட்'
    ],
    landmark_type: LANDMARK_TYPES.BUS_STAND,
    district: 'Coimbatore',
    taluk: 'Coimbatore South',
    area: 'Singanallur',
    street: 'Trichy Road',
    road: 'Kamarajar Road',
    latitude: 10.9990,
    longitude: 77.0260,
    address: 'Trichy Rd, Singanallur, Coimbatore, Tamil Nadu 641005',
    search_keywords: 'singanallur bus stand mofussil transit trichy road'
  },
  {
    landmark_id: 'LM-SINGANALLUR-LAKE',
    landmark_name: 'Singanallur Lake',
    tamil_name: 'சிங்கநல்லூர் ஏரி',
    aliases: [
      'Singanallur Lake bioreserve', 'Singanallur wetland', 'சிங்கநல்லூர் குளம்'
    ],
    landmark_type: LANDMARK_TYPES.PARK,
    district: 'Coimbatore',
    taluk: 'Coimbatore South',
    area: 'Singanallur',
    street: 'Trichy Road',
    road: 'Trichy Road',
    latitude: 10.9925,
    longitude: 77.0230,
    address: 'Trichy Rd, Singanallur, Coimbatore, Tamil Nadu 641005',
    search_keywords: 'singanallur lake birds biodiversity water lake conservation'
  },
  {
    landmark_id: 'LM-SINGANALLUR-JN',
    landmark_name: 'Singanallur Junction',
    tamil_name: 'சிங்கநல்லூர் சந்திப்பு',
    aliases: [
      'Singanallur signal', 'Singanallur junction trichy road', 'சிங்கநல்லூர் சிக்னல்'
    ],
    landmark_type: LANDMARK_TYPES.JUNCTION,
    district: 'Coimbatore',
    taluk: 'Coimbatore South',
    area: 'Singanallur',
    street: 'Trichy Road',
    road: 'Vellalore Road',
    latitude: 10.9995,
    longitude: 77.0270,
    address: 'Trichy Rd & Vellalore Rd, Singanallur, Coimbatore, Tamil Nadu 641005',
    search_keywords: 'singanallur junction signal traffic trichy road'
  },

  // ==========================================
  // VADAVALLI / MARUDHAMALAI
  // ==========================================
  {
    landmark_id: 'LM-MARUDHAMALAI-TEMPLE',
    landmark_name: 'Marudhamalai Murugan Temple',
    tamil_name: 'மருதமலை முருகன் கோவில்',
    aliases: [
      'Marudhamalai temple', 'Marudhamalai', 'Maruthamalai kovil', 'Marudhamalai Murugan',
      'மருதமலை கோவில்', 'மருதமலை முருகன் திருக்கோவில்', 'மருதமலை'
    ],
    landmark_type: LANDMARK_TYPES.TEMPLE,
    district: 'Coimbatore',
    taluk: 'Perur',
    area: 'Vadavalli',
    street: 'Marudhamalai Road',
    road: 'Marudhamalai Road',
    latitude: 11.0450,
    longitude: 76.8520,
    address: 'Marudhamalai Hill Rd, Vadavalli, Coimbatore, Tamil Nadu 641046',
    search_keywords: 'marudhamalai temple murugan hill temple spiritual vadavalli'
  },
  {
    landmark_id: 'LM-BHARATHIAR-UNIVERSITY',
    landmark_name: 'Bharathiar University',
    tamil_name: 'பாரதியார் பல்கலைக்கழகம்',
    aliases: [
      'Bharathiyar University', 'BU Coimbatore', 'Bharathiar University campus', 'பாரதியார் யூனிவர்சிட்டி'
    ],
    landmark_type: LANDMARK_TYPES.UNIVERSITY,
    district: 'Coimbatore',
    taluk: 'Perur',
    area: 'Vadavalli',
    street: 'Marudhamalai Road',
    road: 'Marudhamalai Road',
    latitude: 11.0385,
    longitude: 76.8790,
    address: 'Marudhamalai Rd, Somayampalayam, Coimbatore, Tamil Nadu 641046',
    search_keywords: 'bharathiar university higher education research vadavalli marudhamalai'
  },
  {
    landmark_id: 'LM-VADAVALLI-BS',
    landmark_name: 'Vadavalli Bus Stand / Junction',
    tamil_name: 'வடவள்ளி பஸ் ஸ்டாண்ட் / சந்திப்பு',
    aliases: [
      'Vadavalli bus stop', 'Vadavalli junction', 'Vadavalli signal', 'வடவள்ளி பஸ் ஸ்டாண்ட்'
    ],
    landmark_type: LANDMARK_TYPES.BUS_STAND,
    district: 'Coimbatore',
    taluk: 'Perur',
    area: 'Vadavalli',
    street: 'Marudhamalai Road',
    road: 'Thondamuthur Road',
    latitude: 11.0270,
    longitude: 76.9030,
    address: 'Marudhamalai Rd, Vadavalli, Coimbatore, Tamil Nadu 641041',
    search_keywords: 'vadavalli bus stand junction marudhamalai road west transit'
  },

  // ==========================================
  // PERUR
  // ==========================================
  {
    landmark_id: 'LM-PERUR-TEMPLE',
    landmark_name: 'Perur Pateeswarar Temple',
    tamil_name: 'பேரூர் பட்டீஸ்வரர் கோவில்',
    aliases: [
      'Perur temple', 'Pateeswarar Kovil', 'Perur Shiva Temple', 'Perur kovil',
      'பேரூர் கோவில்', 'பேரூர் பட்டீஸ்வரர் திருக்கோவில்'
    ],
    landmark_type: LANDMARK_TYPES.TEMPLE,
    district: 'Coimbatore',
    taluk: 'Perur',
    area: 'Perur',
    street: 'Siruvani Main Road',
    road: 'Perur Main Road',
    latitude: 10.9715,
    longitude: 76.9240,
    address: 'Siruvani Main Rd, Perur, Coimbatore, Tamil Nadu 641010',
    search_keywords: 'perur pateeswarar temple ancient shiva chola noyyal siruvani'
  },
  {
    landmark_id: 'LM-PERUR-BS',
    landmark_name: 'Perur Bus Stop',
    tamil_name: 'பேரூர் பஸ் நிறுத்தம்',
    aliases: [
      'Perur bus stand', 'Perur junction', 'பேரூர் பஸ் ஸ்டாப்'
    ],
    landmark_type: LANDMARK_TYPES.BUS_STAND,
    district: 'Coimbatore',
    taluk: 'Perur',
    area: 'Perur',
    street: 'Siruvani Main Road',
    road: 'Siruvani Main Road',
    latitude: 10.9705,
    longitude: 76.9255,
    address: 'Siruvani Main Rd, Perur, Coimbatore, Tamil Nadu 641010',
    search_keywords: 'perur bus stop transit siruvani road temple'
  },

  // ==========================================
  // PODANUR
  // ==========================================
  {
    landmark_id: 'LM-PODANUR-JN',
    landmark_name: 'Podanur Railway Station',
    tamil_name: 'போத்தனூர் ரயில் நிலையம்',
    aliases: [
      'Podanur Junction', 'Podanur station', 'Podanur train station', 'போத்தனூர் சந்திப்பு'
    ],
    landmark_type: LANDMARK_TYPES.RAILWAY_STATION,
    district: 'Coimbatore',
    taluk: 'Coimbatore South',
    area: 'Podanur',
    street: 'Podanur Main Road',
    road: 'Railway Station Road',
    latitude: 10.9635,
    longitude: 76.9940,
    address: 'Podanur Main Rd, Podanur, Coimbatore, Tamil Nadu 641023',
    search_keywords: 'podanur railway station train junction south railway history'
  },
  {
    landmark_id: 'LM-PODANUR-GANDHI-MEMORIAL',
    landmark_name: 'Mahatma Gandhi Memorial Podanur',
    tamil_name: 'மகாத்மா காந்தி நினைவு இல்லம் போத்தனூர்',
    aliases: [
      'Gandhi Memorial Podanur', 'Gandhi Ashram Podanur', 'காந்தி நினைவு மண்டபம் போத்தனூர்'
    ],
    landmark_type: LANDMARK_TYPES.LANDMARK_BUILDING,
    district: 'Coimbatore',
    taluk: 'Coimbatore South',
    area: 'Podanur',
    street: 'Railway Station Road',
    road: 'Podanur Main Road',
    latitude: 10.9645,
    longitude: 76.9935,
    address: 'Railway Station Rd, Podanur, Coimbatore, Tamil Nadu 641023',
    search_keywords: 'mahatma gandhi memorial podanur heritage historical'
  },

  // ==========================================
  // THUDIYALUR
  // ==========================================
  {
    landmark_id: 'LM-THUDIYALUR-BS',
    landmark_name: 'Thudiyalur Bus Stand',
    tamil_name: 'துடியலூர் பஸ் ஸ்டாண்ட்',
    aliases: [
      'Thudiyalur bus stop', 'Thudiyalur stand', 'துடியலூர் பேருந்து நிலையம்'
    ],
    landmark_type: LANDMARK_TYPES.BUS_STAND,
    district: 'Coimbatore',
    taluk: 'Coimbatore North',
    area: 'Thudiyalur',
    street: 'Mettupalayam Road',
    road: 'Mettupalayam Road',
    latitude: 11.0770,
    longitude: 76.9380,
    address: 'Mettupalayam Rd, Thudiyalur, Coimbatore, Tamil Nadu 641034',
    search_keywords: 'thudiyalur bus stand mtp road north coimbatore transit'
  },
  {
    landmark_id: 'LM-THUDIYALUR-JN',
    landmark_name: 'Thudiyalur Junction',
    tamil_name: 'துடியலூர் சந்திப்பு',
    aliases: [
      'Thudiyalur signal', 'Thudiyalur 4 roads', 'துடியலூர் சிக்னல்'
    ],
    landmark_type: LANDMARK_TYPES.JUNCTION,
    district: 'Coimbatore',
    taluk: 'Coimbatore North',
    area: 'Thudiyalur',
    street: 'Mettupalayam Road',
    road: 'Saravanampatti Road',
    latitude: 11.0785,
    longitude: 76.9395,
    address: 'Mettupalayam Rd & Saravanampatti Rd, Thudiyalur, Coimbatore, Tamil Nadu 641034',
    search_keywords: 'thudiyalur junction signal crossroads mtp road'
  },

  // ==========================================
  // METTUPALAYAM
  // ==========================================
  {
    landmark_id: 'LM-METTUPALAYAM-STATION',
    landmark_name: 'Mettupalayam Railway Station',
    tamil_name: 'மேட்டுப்பாளையம் ரயில் நிலையம்',
    aliases: [
      'Mettupalayam station', 'NMR Station Mettupalayam', 'Toy train station mettupalayam',
      'மேட்டுப்பாளையம் ரயில் நிலையம்'
    ],
    landmark_type: LANDMARK_TYPES.RAILWAY_STATION,
    district: 'Coimbatore',
    taluk: 'Mettupalayam',
    area: 'Mettupalayam',
    street: 'Station Road',
    road: 'Kotagiri Road',
    latitude: 11.3005,
    longitude: 76.9490,
    address: 'Station Rd, Mettupalayam, Tamil Nadu 641301',
    search_keywords: 'mettupalayam railway station nmr toy train nilgiri unesco'
  },
  {
    landmark_id: 'LM-BLACK-THUNDER',
    landmark_name: 'Black Thunder Theme Park',
    tamil_name: 'பிளாக் தண்டர் கேளிக்கை பூங்கா',
    aliases: [
      'Black Thunder', 'Black Thunder water park', 'பிளாக் தண்டர்'
    ],
    landmark_type: LANDMARK_TYPES.TOURIST_PLACE,
    district: 'Coimbatore',
    taluk: 'Mettupalayam',
    area: 'Mettupalayam',
    street: 'Ooty Main Road',
    road: 'Nagapattinam - Coimbatore - Gundlupet Hwy',
    latitude: 11.3265,
    longitude: 76.9385,
    address: 'Ooty Main Rd, Mettupalayam, Tamil Nadu 641305',
    search_keywords: 'black thunder theme water park tourist mettupalayam fun rides'
  },
  {
    landmark_id: 'LM-METTUPALAYAM-BS',
    landmark_name: 'Mettupalayam Bus Stand',
    tamil_name: 'மேட்டுப்பாளையம் பஸ் ஸ்டாண்ட்',
    aliases: [
      'MTP bus stand', 'Mettupalayam bus stop', 'மேட்டுப்பாளையம் பேருந்து நிலையம்'
    ],
    landmark_type: LANDMARK_TYPES.BUS_STAND,
    district: 'Coimbatore',
    taluk: 'Mettupalayam',
    area: 'Mettupalayam',
    street: 'Main Bazaar Road',
    road: 'Main Road',
    latitude: 11.2980,
    longitude: 76.9450,
    address: 'Main Rd, Mettupalayam, Tamil Nadu 641301',
    search_keywords: 'mettupalayam bus stand ooty transit bus terminus mtp'
  },

  // ==========================================
  // POLLACHI
  // ==========================================
  {
    landmark_id: 'LM-POLLACHI-JN',
    landmark_name: 'Pollachi Junction Railway Station',
    tamil_name: 'பொள்ளாச்சி சந்திப்பு ரயில் நிலையம்',
    aliases: [
      'Pollachi Railway Station', 'Pollachi station', 'பொள்ளாச்சி ரயில் நிலையம்'
    ],
    landmark_type: LANDMARK_TYPES.RAILWAY_STATION,
    district: 'Coimbatore',
    taluk: 'Pollachi',
    area: 'Pollachi',
    street: 'Railway Station Road',
    road: 'Palakkad Road',
    latitude: 10.6625,
    longitude: 77.0090,
    address: 'Railway Station Rd, Pollachi, Tamil Nadu 642001',
    search_keywords: 'pollachi junction railway station train south'
  },
  {
    landmark_id: 'LM-POLLACHI-BS',
    landmark_name: 'Pollachi Central Bus Stand',
    tamil_name: 'பொள்ளாச்சி மத்திய பேருந்து நிலையம்',
    aliases: [
      'Pollachi Bus Stand', 'Pollachi bus stop', 'பொள்ளாச்சி பஸ் ஸ்டாண்ட்'
    ],
    landmark_type: LANDMARK_TYPES.BUS_STAND,
    district: 'Coimbatore',
    taluk: 'Pollachi',
    area: 'Pollachi',
    street: 'Palakkad Road',
    road: 'New Scheme Road',
    latitude: 10.6580,
    longitude: 77.0075,
    address: 'Palakkad Rd, Pollachi, Tamil Nadu 642001',
    search_keywords: 'pollachi central bus stand transit south'
  },
  {
    landmark_id: 'LM-ALIYAR-DAM',
    landmark_name: 'Aliyar Dam',
    tamil_name: 'ஆழியாறு அணை',
    aliases: [
      'Aliyar Dam and Park', 'Aliyar Reservoir', 'ஆழியாறு அணைக்கட்டு', 'ஆழியார் டாம்'
    ],
    landmark_type: LANDMARK_TYPES.DAM,
    district: 'Coimbatore',
    taluk: 'Anaimalai',
    area: 'Aliyar',
    street: 'Pollachi-Valparai Road',
    road: 'Valparai Ghat Road',
    latitude: 10.4855,
    longitude: 76.9730,
    address: 'Pollachi-Valparai Rd, Aliyar, Tamil Nadu 642101',
    search_keywords: 'aliyar dam reservoir park tourist pollachi valparai foothills'
  },
  {
    landmark_id: 'LM-MONKEY-FALLS',
    landmark_name: 'Monkey Falls',
    tamil_name: 'குரங்கு அருவி',
    aliases: [
      'Monkey Waterfalls', 'Monkey Falls Aliyar', 'குரங்கு நீர்வீழ்ச்சி'
    ],
    landmark_type: LANDMARK_TYPES.WATERFALL,
    district: 'Coimbatore',
    taluk: 'Anaimalai',
    area: 'Aliyar',
    street: 'Pollachi-Valparai Ghat Road',
    road: 'Valparai Main Road',
    latitude: 10.4570,
    longitude: 76.9855,
    address: 'Valparai Ghat Rd, Anaimalai Hills, Tamil Nadu 642101',
    search_keywords: 'monkey falls waterfall tourist nature valparai ghat aliyar'
  },

  // ==========================================
  // VALPARAI
  // ==========================================
  {
    landmark_id: 'LM-VALPARAI-BS',
    landmark_name: 'Valparai Bus Stand',
    tamil_name: 'வால்பாறை பேருந்து நிலையம்',
    aliases: [
      'Valparai bus stop', 'Valparai stand', 'வால்பாறை பஸ் ஸ்டாண்ட்'
    ],
    landmark_type: LANDMARK_TYPES.BUS_STAND,
    district: 'Coimbatore',
    taluk: 'Valparai',
    area: 'Valparai',
    street: 'Main Bazaar Road',
    road: 'Sholayar Dam Road',
    latitude: 10.3245,
    longitude: 76.9555,
    address: 'Main Bazaar Rd, Valparai, Tamil Nadu 642127',
    search_keywords: 'valparai bus stand hill station transit tea estate'
  },
  {
    landmark_id: 'LM-VALPARAI-TOWN',
    landmark_name: 'Valparai Town Centre',
    tamil_name: 'வால்பாறை நகரம்',
    aliases: [
      'Valparai town', 'Valparai tea estates', 'வால்பாறை'
    ],
    landmark_type: LANDMARK_TYPES.TOURIST_PLACE,
    district: 'Coimbatore',
    taluk: 'Valparai',
    area: 'Valparai',
    street: 'Sholayar Dam Road',
    road: 'Valparai Main Road',
    latitude: 10.3290,
    longitude: 76.9530,
    address: 'Valparai Town, Tamil Nadu 642127',
    search_keywords: 'valparai hill station tea estates nature western ghats tourist'
  },

  // ==========================================
  // WESTERN COIMBATORE & SIRUVANI / ANAIKATTI
  // ==========================================
  {
    landmark_id: 'LM-SACON',
    landmark_name: 'Salim Ali Centre (SACON)',
    tamil_name: 'சலீம் அலி பறவையியல் மையம்',
    aliases: [
      'SACON', 'Salim Ali Centre for Ornithology', 'SACON Anaikatti', 'சலீம் அலி மையம்'
    ],
    landmark_type: LANDMARK_TYPES.EDUCATION,
    district: 'Coimbatore',
    taluk: 'Coimbatore North',
    area: 'Anaikatti',
    street: 'Anaikatti Main Road',
    road: 'Anaikatti Road',
    latitude: 11.0970,
    longitude: 76.7780,
    address: 'Anaikatti, Coimbatore, Tamil Nadu 641108',
    search_keywords: 'sacon salim ali ornithology nature birds anaikatti forest'
  },
  {
    landmark_id: 'LM-NILGIRI-BIOSPHERE-PARK',
    landmark_name: 'Nilgiri Biosphere Nature Park',
    tamil_name: 'நீலகிரி பையோஸ்பியர் இயற்கை பூங்கா',
    aliases: [
      'NBNP', 'Nilgiri Biosphere Park Anaikatti', 'நீலகிரி இயற்கை பூங்கா'
    ],
    landmark_type: LANDMARK_TYPES.PARK,
    district: 'Coimbatore',
    taluk: 'Coimbatore North',
    area: 'Anaikatti',
    street: 'Thuvaipathy Road',
    road: 'Anaikatti Road',
    latitude: 11.1030,
    longitude: 76.7710,
    address: 'Thuvaipathy Rd, Anaikatti, Coimbatore, Tamil Nadu 641108',
    search_keywords: 'nilgiri biosphere park nature conservation anaikatti biodiversity'
  },
  {
    landmark_id: 'LM-KOVAI-KUTRALAM',
    landmark_name: 'Kovai Kutralam',
    tamil_name: 'கோவை குற்றாலம்',
    aliases: [
      'Kovai Kutralam Waterfalls', 'Kovai Courtallam', 'Siruvani Waterfalls', 'கோவை குற்றாலம் அருவி'
    ],
    landmark_type: LANDMARK_TYPES.WATERFALL,
    district: 'Coimbatore',
    taluk: 'Perur',
    area: 'Siruvani',
    street: 'Siruvani Hills Road',
    road: 'Chadivayal Road',
    latitude: 10.9380,
    longitude: 76.7320,
    address: 'Chadivayal, Siruvani, Coimbatore, Tamil Nadu 641114',
    search_keywords: 'kovai kutralam courtallam waterfalls nature tourist siruvani forest'
  },
  {
    landmark_id: 'LM-SIRUVANI-DAM',
    landmark_name: 'Siruvani Dam',
    tamil_name: 'சிறுவாணி அணை',
    aliases: [
      'Siruvani Reservoir', 'Siruvani Water Dam', 'சிறுவாணி அணைக்கட்டு'
    ],
    landmark_type: LANDMARK_TYPES.DAM,
    district: 'Coimbatore',
    taluk: 'Perur',
    area: 'Siruvani',
    street: 'Siruvani Dam Road',
    road: 'Siruvani Road',
    latitude: 10.9675,
    longitude: 76.6890,
    address: 'Siruvani Hills, Coimbatore District, Tamil Nadu',
    search_keywords: 'siruvani dam sweetest drinking water reservoir western ghats'
  },

  // ==========================================
  // OTHER MAJOR ATTRACTIONS & INSTITUTIONS
  // ==========================================
  {
    landmark_id: 'LM-TNAU',
    landmark_name: 'Tamil Nadu Agricultural University (TNAU) & Botanical Garden',
    tamil_name: 'தமிழ்நாடு வேளாண்மைப் பல்கலைக்கழகம் & தாவரவியல் பூங்கா',
    aliases: [
      'TNAU', 'Agricultural University', 'Botanical Garden', 'TNAU Botanical Garden',
      'வேளாண்மை பல்கலைக்கழகம்', 'தாவரவியல் பூங்கா', 'டிஎன்ஏயு'
    ],
    landmark_type: LANDMARK_TYPES.UNIVERSITY,
    district: 'Coimbatore',
    taluk: 'Coimbatore South',
    area: 'RS Puram',
    street: 'Lawley Road',
    road: 'Marudhamalai Road',
    latitude: 11.0135,
    longitude: 76.9360,
    address: 'Lawley Rd, Agricultural University, Coimbatore, Tamil Nadu 641003',
    search_keywords: 'tnau agricultural university botanical garden research lawley road'
  },
  {
    landmark_id: 'LM-REGIONAL-SCIENCE-CENTRE',
    landmark_name: 'Regional Science Centre',
    tamil_name: 'மண்டல அறிவியல் மையம்',
    aliases: [
      'Science Centre', 'Regional Science Park', 'Coimbatore Science Centre', 'அறிவியல் மையம்'
    ],
    landmark_type: LANDMARK_TYPES.EDUCATION,
    district: 'Coimbatore',
    taluk: 'Coimbatore South',
    area: 'Peelamedu',
    street: 'CODISSIA Road',
    road: 'Avinashi Road',
    latitude: 11.0345,
    longitude: 77.0315,
    address: 'CODISSIA Rd, Civil Aerodrome Post, Peelamedu, Coimbatore, Tamil Nadu 641014',
    search_keywords: 'regional science centre planetarium science park education peelamedu'
  },
  {
    landmark_id: 'LM-GEDEE-CAR-MUSEUM',
    landmark_name: 'Gedee Car Museum',
    tamil_name: 'ஜிடி கார் அருங்காட்சியகம்',
    aliases: [
      'GD Car Museum', 'GeDee Museum', 'Vintage Car Museum Coimbatore', 'ஜிடி கார் மியூசியம்'
    ],
    landmark_type: LANDMARK_TYPES.TOURIST_PLACE,
    district: 'Coimbatore',
    taluk: 'Coimbatore South',
    area: 'Race Course',
    street: 'Avinashi Road',
    road: 'President Hall Building',
    latitude: 11.0068,
    longitude: 76.9780,
    address: '734, Avinashi Rd, President Hall, Race Course, Coimbatore, Tamil Nadu 641018',
    search_keywords: 'gedee car museum vintage automobiles gd naidu tourist race course'
  },
  {
    landmark_id: 'LM-POLICE-MUSEUM',
    landmark_name: 'Tamil Nadu Police Museum',
    tamil_name: 'தமிழ்நாடு காவல் அருங்காட்சியகம்',
    aliases: [
      'Police Museum Coimbatore', 'TN Police Museum', 'காவல் அருங்காட்சியகம்'
    ],
    landmark_type: LANDMARK_TYPES.TOURIST_PLACE,
    district: 'Coimbatore',
    taluk: 'Coimbatore South',
    area: 'Gopalapuram',
    street: 'State Bank Road',
    road: 'State Bank Road',
    latitude: 11.0040,
    longitude: 76.9680,
    address: 'State Bank Rd, Gopalapuram, Coimbatore, Tamil Nadu 641018',
    search_keywords: 'tamil nadu police museum heritage collectorate railway station central'
  },
  {
    landmark_id: 'LM-ADIYOGI',
    landmark_name: 'Isha Yoga Centre / Adiyogi',
    tamil_name: 'ஈஷா யோகா மையம் / ஆதியோகி',
    aliases: [
      'Adiyogi', 'Adiyogi Shiva', 'Isha', 'Isha Yoga Centre', 'Isha Foundation',
      'Isha ashram', 'ஆதியோகி', 'ஈஷா யோகா மையம்', 'ஈஷா ஆசிரமம்'
    ],
    landmark_type: LANDMARK_TYPES.TOURIST_PLACE,
    district: 'Coimbatore',
    taluk: 'Perur',
    area: 'Ikkarai Boluvampatti',
    street: 'Isha Life Road',
    road: 'Velliangiri Foothills',
    latitude: 10.9730,
    longitude: 76.7380,
    address: 'Velliangiri Foothills, Ishana Vihar Post, Coimbatore, Tamil Nadu 641114',
    search_keywords: 'adiyogi isha yoga centre shiva statue velliangiri hills meditation tourist'
  },
  {
    landmark_id: 'LM-KOVAI-KONDATTAM',
    landmark_name: 'Kovai Kondattam',
    tamil_name: 'கோவை கொண்டாட்டம் கேளிக்கை பூங்கா',
    aliases: [
      'Kovai Kondattam amusement park', 'Kondattam theme park', 'கோவை கொண்டாட்டம்'
    ],
    landmark_type: LANDMARK_TYPES.TOURIST_PLACE,
    district: 'Coimbatore',
    taluk: 'Perur',
    area: 'Perur',
    street: 'Siruvani Main Road',
    road: 'Kovaipudur Road',
    latitude: 10.9590,
    longitude: 76.9150,
    address: '2/347, Siruvani Main Rd, Kalampalayam, Coimbatore, Tamil Nadu 641010',
    search_keywords: 'kovai kondattam amusement theme park water rides perur kovaipudur'
  },
  {
    landmark_id: 'LM-MAHARAJA-THEME-PARK',
    landmark_name: 'Maharaja Theme Park',
    tamil_name: 'மகாராஜா தீம் பார்க்',
    aliases: [
      'Maharaja World', 'Maharaja Theme Park Neelambur', 'மகாராஜா தீம் பார்க்'
    ],
    landmark_type: LANDMARK_TYPES.TOURIST_PLACE,
    district: 'Coimbatore',
    taluk: 'Sulur',
    area: 'Neelambur',
    street: 'Avinashi Road',
    road: 'NH 544',
    latitude: 11.0680,
    longitude: 77.0860,
    address: 'Avinashi Rd, Neelambur, Tamil Nadu 641062',
    search_keywords: 'maharaja theme park multiplex amusement rides neelambur sulur'
  },
  {
    landmark_id: 'LM-PILLUR-DAM',
    landmark_name: 'Pillur Dam',
    tamil_name: 'பிள்ளூர் அணை',
    aliases: [
      'Pilloor Dam', 'Pillur Dam Baralikkadu', 'Pillur Reservoir', 'பிள்ளூர் அணைக்கட்டு'
    ],
    landmark_type: LANDMARK_TYPES.DAM,
    district: 'Coimbatore',
    taluk: 'Mettupalayam',
    area: 'Karamadai',
    street: 'Baralikkadu Road',
    road: 'Pillur Dam Road',
    latitude: 11.2380,
    longitude: 76.8120,
    address: 'Baralikkadu, Karamadai, Coimbatore District, Tamil Nadu 641104',
    search_keywords: 'pillur dam bhavani river eco tourism baralikkadu karamadai mtp'
  }
];

module.exports = {
  LANDMARK_TYPES,
  COIMBATORE_LANDMARKS
};
