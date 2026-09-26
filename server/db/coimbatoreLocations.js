/**
 * Master Coimbatore Location Catalog
 * Covers Revenue Divisions, Taluks, Municipalities, Town Panchayats, and all Villages/Localities.
 */

const COIMBATORE_LOCATIONS = [
  {
    "canonical_name": "Saravanampatti",
    "display_name": "Saravanampatti (North Zone)",
    "location_type": "Corporation Zone",
    "revenue_division": "Coimbatore North",
    "taluk": "Coimbatore North",
    "tamil_name": "சரவணம்பட்டி",
    "latitude": 11.0827,
    "longitude": 76.9958,
    "aliases": [
      "saravanampatty",
      "saravana patti",
      "sarava patty",
      "chil sez",
      "kgisl",
      "sathy road saravanampatti"
    ],
    "tanglish_variants": [
      "saravanampatti-la",
      "saravanampatty-la",
      "sarava patty la",
      "saravanampatti pakkam"
    ],
    "location_id": "LOC-CBE-001",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Gandhipuram",
    "display_name": "Gandhipuram (Central Zone)",
    "location_type": "Corporation Zone",
    "revenue_division": "Coimbatore South",
    "taluk": "Coimbatore South",
    "tamil_name": "காந்திபுரம்",
    "latitude": 11.0183,
    "longitude": 76.9684,
    "aliases": [
      "gandhi puram",
      "cross cut",
      "crosscut",
      "central bus stand",
      "omnibus stand",
      "100 feet road",
      "cross cut road"
    ],
    "tanglish_variants": [
      "gandhipuram-la",
      "gandhipuram pakkam",
      "cross cut road-la"
    ],
    "location_id": "LOC-CBE-002",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "RS Puram",
    "display_name": "RS Puram (West Zone)",
    "location_type": "Corporation Zone",
    "revenue_division": "Coimbatore South",
    "taluk": "Coimbatore South",
    "tamil_name": "ஆர் எஸ் புரம்",
    "latitude": 11.0112,
    "longitude": 76.9515,
    "aliases": [
      "r s puram",
      "db road",
      "diwan bahadur road",
      "cowley brown road",
      "rs puram post office"
    ],
    "tanglish_variants": [
      "rs puram-la",
      "r s puram-la",
      "db road-la"
    ],
    "location_id": "LOC-CBE-003",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Peelamedu",
    "display_name": "Peelamedu (East Zone)",
    "location_type": "Corporation Zone",
    "revenue_division": "Coimbatore South",
    "taluk": "Coimbatore South",
    "tamil_name": "பீளமேடு",
    "latitude": 11.0261,
    "longitude": 77.0028,
    "aliases": [
      "peela medu",
      "cit",
      "psg tech",
      "fun mall",
      "hope college",
      "tidel park cbe",
      "avinashi road peelamedu"
    ],
    "tanglish_variants": [
      "peelamedu-la",
      "peelamedu pakkam",
      "hope college pakkam"
    ],
    "location_id": "LOC-CBE-004",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Ukkadam",
    "display_name": "Ukkadam (South Zone)",
    "location_type": "Corporation Zone",
    "revenue_division": "Coimbatore South",
    "taluk": "Coimbatore South",
    "tamil_name": "உக்கடம்",
    "latitude": 10.9882,
    "longitude": 76.9602,
    "aliases": [
      "ukadam",
      "perur bypass ukkadam",
      "ukkadam bus stand",
      "ukkadam lake",
      "fish market ukkadam",
      "sungam"
    ],
    "tanglish_variants": [
      "ukkadam-la",
      "ukadam-la",
      "ukkadam bus stand pakkam"
    ],
    "location_id": "LOC-CBE-005",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Singanallur",
    "display_name": "Singanallur (East Zone)",
    "location_type": "Corporation Zone",
    "revenue_division": "Coimbatore South",
    "taluk": "Coimbatore South",
    "tamil_name": "சிங்கநல்லூர்",
    "latitude": 11.0004,
    "longitude": 77.0256,
    "aliases": [
      "singa nallur",
      "trichy road singanallur",
      "singanallur bus stand",
      "singanallur lake",
      "boat house"
    ],
    "tanglish_variants": [
      "singanallur-la",
      "singanallur pakkam"
    ],
    "location_id": "LOC-CBE-006",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Saibaba Colony",
    "display_name": "Saibaba Colony (West Zone)",
    "location_type": "Corporation Zone",
    "revenue_division": "Coimbatore North",
    "taluk": "Coimbatore North",
    "tamil_name": "சாயிபாபா காலனி",
    "latitude": 11.0321,
    "longitude": 76.9458,
    "aliases": [
      "sai baba colony",
      "nsr road",
      "alagappa chettiar road"
    ],
    "tanglish_variants": [
      "saibaba colony-la",
      "nsr road-la"
    ],
    "location_id": "LOC-CBE-007",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Ganapathy",
    "display_name": "Ganapathy (North Zone)",
    "location_type": "Corporation Zone",
    "revenue_division": "Coimbatore North",
    "taluk": "Coimbatore North",
    "tamil_name": "கணபதி",
    "latitude": 11.0392,
    "longitude": 76.9782,
    "aliases": [
      "ganapathi",
      "sanganoor",
      "athipalayam pirivu",
      "ganapathy bus stop"
    ],
    "tanglish_variants": [
      "ganapathy-la",
      "ganapathi-la"
    ],
    "location_id": "LOC-CBE-008",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Town Hall",
    "display_name": "Town Hall (Central Zone)",
    "location_type": "Corporation Zone",
    "revenue_division": "Coimbatore South",
    "taluk": "Coimbatore South",
    "tamil_name": "டவுன் ஹால்",
    "latitude": 10.9965,
    "longitude": 76.9619,
    "aliases": [
      "townhall",
      "railway station junction",
      "oppanakara street",
      "clock tower",
      "big bazaar street"
    ],
    "tanglish_variants": [
      "town hall-la",
      "townhall-la",
      "oppanakara street-la"
    ],
    "location_id": "LOC-CBE-009",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Ramanathapuram",
    "display_name": "Ramanathapuram (East Zone)",
    "location_type": "Corporation Zone",
    "revenue_division": "Coimbatore South",
    "taluk": "Coimbatore South",
    "tamil_name": "ராமநாதபுரம்",
    "latitude": 11.0019,
    "longitude": 76.9886,
    "aliases": [
      "ramnathapuram",
      "trichy road junction",
      "sungam bypass",
      "puliakulam"
    ],
    "tanglish_variants": [
      "ramanathapuram-la",
      "ramnathapuram-la"
    ],
    "location_id": "LOC-CBE-010",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Race Course",
    "display_name": "Race Course (Central Zone)",
    "location_type": "Corporation Zone",
    "revenue_division": "Coimbatore South",
    "taluk": "Coimbatore South",
    "tamil_name": "ரேஸ் கோர்ஸ்",
    "latitude": 11.0062,
    "longitude": 76.9744,
    "aliases": [
      "racecourse",
      "race course road",
      "thomas park"
    ],
    "tanglish_variants": [
      "race course-la",
      "racecourse-la"
    ],
    "location_id": "LOC-CBE-011",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Kalapatti",
    "display_name": "Kalapatti",
    "location_type": "Town Panchayat",
    "revenue_division": "Coimbatore North",
    "taluk": "Coimbatore North",
    "tamil_name": "காளப்பட்டி",
    "latitude": 11.0768,
    "longitude": 77.0372,
    "aliases": [
      "kalapatty",
      "kaalapatti",
      "kalapatti road"
    ],
    "tanglish_variants": [
      "kalapatti-la",
      "kalapatty-la"
    ],
    "location_id": "LOC-CBE-012",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Vilankurichi",
    "display_name": "Vilankurichi",
    "location_type": "Village / Locality",
    "revenue_division": "Coimbatore North",
    "taluk": "Coimbatore North",
    "tamil_name": "விளாங்குறிச்சி",
    "latitude": 11.0624,
    "longitude": 77.0142,
    "aliases": [
      "vilankurichi road",
      "vilankurichi pirivu"
    ],
    "tanglish_variants": [
      "vilankurichi-la"
    ],
    "location_id": "LOC-CBE-013",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Vellakinar",
    "display_name": "Vellakinar",
    "location_type": "Village / Locality",
    "revenue_division": "Coimbatore North",
    "taluk": "Coimbatore North",
    "tamil_name": "வெள்ளக்கிணறு",
    "latitude": 11.0921,
    "longitude": 76.9642,
    "aliases": [
      "vellakinaru",
      "vellakinar pirivu"
    ],
    "tanglish_variants": [
      "vellakinar-la"
    ],
    "location_id": "LOC-CBE-014",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Chinnavedampatti",
    "display_name": "Chinnavedampatti",
    "location_type": "Village / Locality",
    "revenue_division": "Coimbatore North",
    "taluk": "Coimbatore North",
    "tamil_name": "சின்னவேடம்பட்டி",
    "latitude": 11.0652,
    "longitude": 76.9856,
    "aliases": [
      "chinnavedampatty",
      "chinna vedampatti"
    ],
    "tanglish_variants": [
      "chinnavedampatti-la",
      "chinnavedampatty-la"
    ],
    "location_id": "LOC-CBE-015",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Sanganur",
    "display_name": "Sanganur",
    "location_type": "Village / Locality",
    "revenue_division": "Coimbatore North",
    "taluk": "Coimbatore North",
    "tamil_name": "சங்கனூர்",
    "latitude": 11.0315,
    "longitude": 76.9678,
    "aliases": [
      "sanganoor",
      "sanganur canal",
      "sanganur road"
    ],
    "tanglish_variants": [
      "sanganur-la",
      "sanganoor-la"
    ],
    "location_id": "LOC-CBE-016",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Krishnarayapuram",
    "display_name": "Krishnarayapuram",
    "location_type": "Village / Locality",
    "revenue_division": "Coimbatore North",
    "taluk": "Coimbatore North",
    "tamil_name": "கிருஷ்ணராயபுரம்",
    "latitude": 11.0421,
    "longitude": 76.9912,
    "aliases": [
      "krishnaraya puram"
    ],
    "tanglish_variants": [
      "krishnarayapuram-la"
    ],
    "location_id": "LOC-CBE-017",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Thelungupalayam",
    "display_name": "Thelungupalayam",
    "location_type": "Village / Locality",
    "revenue_division": "Coimbatore North",
    "taluk": "Coimbatore North",
    "tamil_name": "தெலுங்குபாளையம்",
    "latitude": 11.0084,
    "longitude": 76.9321,
    "aliases": [
      "telungupalayam",
      "thelungu palayam"
    ],
    "tanglish_variants": [
      "thelungupalayam-la"
    ],
    "location_id": "LOC-CBE-018",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Puliyakulam",
    "display_name": "Puliyakulam",
    "location_type": "Village / Locality",
    "revenue_division": "Coimbatore North",
    "taluk": "Coimbatore North",
    "tamil_name": "புலியகுளம்",
    "latitude": 11.0042,
    "longitude": 76.9924,
    "aliases": [
      "puliakulam",
      "puliyakulam vinayagar temple"
    ],
    "tanglish_variants": [
      "puliyakulam-la",
      "puliakulam-la"
    ],
    "location_id": "LOC-CBE-019",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Anupperpalayam",
    "display_name": "Anupperpalayam",
    "location_type": "Village / Locality",
    "revenue_division": "Coimbatore North",
    "taluk": "Coimbatore North",
    "tamil_name": "அனுப்பர்பாளையம்",
    "latitude": 11.0489,
    "longitude": 76.9851,
    "aliases": [
      "anupparpalayam",
      "anuppar palayam"
    ],
    "tanglish_variants": [
      "anupperpalayam-la"
    ],
    "location_id": "LOC-CBE-020",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Naickenpalayam",
    "display_name": "Naickenpalayam",
    "location_type": "Village / Locality",
    "revenue_division": "Coimbatore North",
    "taluk": "Coimbatore North",
    "tamil_name": "நாயக்கன்பாளையம்",
    "latitude": 11.1342,
    "longitude": 76.9312,
    "aliases": [
      "naicken palayam"
    ],
    "tanglish_variants": [
      "naickenpalayam-la"
    ],
    "location_id": "LOC-CBE-021",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Gudalur",
    "display_name": "Gudalur Municipality",
    "location_type": "Municipality",
    "revenue_division": "Coimbatore North",
    "taluk": "Coimbatore North",
    "tamil_name": "கூடலூர்",
    "latitude": 11.1482,
    "longitude": 76.9324,
    "aliases": [
      "gudalur cbe",
      "gudalur municipality"
    ],
    "tanglish_variants": [
      "gudalur-la"
    ],
    "location_id": "LOC-CBE-022",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Periyanaickenpalayam",
    "display_name": "Periyanaickenpalayam",
    "location_type": "Town Panchayat",
    "revenue_division": "Coimbatore North",
    "taluk": "Coimbatore North",
    "tamil_name": "பெரியநாயக்கன்பாளையம்",
    "latitude": 11.1441,
    "longitude": 76.9382,
    "aliases": [
      "perianaicken palayam",
      "perianaickenpalayam",
      "pnp",
      "ramakrishna mission periyanaickenpalayam"
    ],
    "tanglish_variants": [
      "periyanaickenpalayam-la",
      "perianaicken palayam la"
    ],
    "location_id": "LOC-CBE-023",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Veerapandi",
    "display_name": "No.4 Veerapandi",
    "location_type": "Town Panchayat",
    "revenue_division": "Coimbatore North",
    "taluk": "Coimbatore North",
    "tamil_name": "வீரபாண்டி",
    "latitude": 11.1562,
    "longitude": 76.9348,
    "aliases": [
      "no.4 veerapandi",
      "veerapandi no 4"
    ],
    "tanglish_variants": [
      "veerapandi-la"
    ],
    "location_id": "LOC-CBE-024",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Bilichi",
    "display_name": "Bilichi",
    "location_type": "Village / Locality",
    "revenue_division": "Coimbatore North",
    "taluk": "Coimbatore North",
    "tamil_name": "பிலிச்சி",
    "latitude": 11.1824,
    "longitude": 76.9412,
    "aliases": [
      "bilichi village"
    ],
    "tanglish_variants": [
      "bilichi-la"
    ],
    "location_id": "LOC-CBE-025",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Narasimhanaickenpalayam",
    "display_name": "Narasimhanaickenpalayam",
    "location_type": "Town Panchayat",
    "revenue_division": "Coimbatore North",
    "taluk": "Coimbatore North",
    "tamil_name": "நரசிம்மநாயக்கன்பாளையம்",
    "latitude": 11.1215,
    "longitude": 76.9388,
    "aliases": [
      "ns palayam",
      "n.s. palayam",
      "narasimhanaicken palayam"
    ],
    "tanglish_variants": [
      "narasimhanaickenpalayam-la",
      "ns palayam-la"
    ],
    "location_id": "LOC-CBE-026",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Kurudampalayam",
    "display_name": "Kurudampalayam",
    "location_type": "Village / Locality",
    "revenue_division": "Coimbatore North",
    "taluk": "Coimbatore North",
    "tamil_name": "குருடம்பாளையம்",
    "latitude": 11.0962,
    "longitude": 76.9382,
    "aliases": [
      "kurudam palayam",
      "vadamadurai kurudampalayam"
    ],
    "tanglish_variants": [
      "kurudampalayam-la"
    ],
    "location_id": "LOC-CBE-027",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Thudiyalur",
    "display_name": "Thudiyalur",
    "location_type": "Town Panchayat",
    "revenue_division": "Coimbatore North",
    "taluk": "Coimbatore North",
    "tamil_name": "துடியலூர்",
    "latitude": 11.0745,
    "longitude": 76.9412,
    "aliases": [
      "thudiyaalur",
      "thudiyalur junction",
      "mettupalayam road thudiyalur"
    ],
    "tanglish_variants": [
      "thudiyalur-la",
      "thudiyaalur-la"
    ],
    "location_id": "LOC-CBE-028",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Pannimadai",
    "display_name": "Pannimadai",
    "location_type": "Village / Locality",
    "revenue_division": "Coimbatore North",
    "taluk": "Coimbatore North",
    "tamil_name": "பன்னிமடை",
    "latitude": 11.0912,
    "longitude": 76.8924,
    "aliases": [
      "panni madai"
    ],
    "tanglish_variants": [
      "pannimadai-la"
    ],
    "location_id": "LOC-CBE-029",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Nanjundapuram",
    "display_name": "Nanjundapuram",
    "location_type": "Village / Locality",
    "revenue_division": "Coimbatore North",
    "taluk": "Coimbatore North",
    "tamil_name": "நஞ்சுண்டாபுரம்",
    "latitude": 10.9854,
    "longitude": 76.9942,
    "aliases": [
      "nanjunda puram",
      "nanjundapuram road"
    ],
    "tanglish_variants": [
      "nanjundapuram-la"
    ],
    "location_id": "LOC-CBE-030",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Chinnathadagam",
    "display_name": "Chinnathadagam",
    "location_type": "Village / Locality",
    "revenue_division": "Coimbatore North",
    "taluk": "Coimbatore North",
    "tamil_name": "சின்னத்தடாகம்",
    "latitude": 11.0821,
    "longitude": 76.8642,
    "aliases": [
      "chinna thadagam",
      "thadagam",
      "thadagam valley"
    ],
    "tanglish_variants": [
      "chinnathadagam-la",
      "thadagam-la"
    ],
    "location_id": "LOC-CBE-031",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Somayampalayam",
    "display_name": "Somayampalayam",
    "location_type": "Village / Locality",
    "revenue_division": "Coimbatore North",
    "taluk": "Coimbatore North",
    "tamil_name": "சோமையம்பாளையம்",
    "latitude": 11.0421,
    "longitude": 76.8912,
    "aliases": [
      "somayam palayam",
      "bharathiar university area"
    ],
    "tanglish_variants": [
      "somayampalayam-la"
    ],
    "location_id": "LOC-CBE-032",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Goundenpalayam",
    "display_name": "Goundenpalayam",
    "location_type": "Town Panchayat",
    "revenue_division": "Coimbatore North",
    "taluk": "Coimbatore North",
    "tamil_name": "கவுண்டம்பாளையம்",
    "latitude": 11.0428,
    "longitude": 76.9421,
    "aliases": [
      "goundampalayam",
      "koundampalayam",
      "gounder palayam"
    ],
    "tanglish_variants": [
      "goundenpalayam-la",
      "goundampalayam-la"
    ],
    "location_id": "LOC-CBE-033",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Madukkarai",
    "display_name": "Madukkarai Municipality",
    "location_type": "Municipality",
    "revenue_division": "Coimbatore South",
    "taluk": "Madukkarai",
    "tamil_name": "மதுக்கரை",
    "latitude": 10.9024,
    "longitude": 76.9621,
    "aliases": [
      "madukari",
      "madukkarai market",
      "acc cement madukkarai"
    ],
    "tanglish_variants": [
      "madukkarai-la"
    ],
    "location_id": "LOC-CBE-034",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Ettimadai",
    "display_name": "Ettimadai",
    "location_type": "Town Panchayat",
    "revenue_division": "Coimbatore South",
    "taluk": "Madukkarai",
    "tamil_name": "எட்டிமடை",
    "latitude": 10.9012,
    "longitude": 76.8984,
    "aliases": [
      "etti madai",
      "amrita university ettimadai",
      "ettimadai railway station"
    ],
    "tanglish_variants": [
      "ettimadai-la"
    ],
    "location_id": "LOC-CBE-035",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Malumichampatti",
    "display_name": "Malumichampatti",
    "location_type": "Village / Locality",
    "revenue_division": "Coimbatore South",
    "taluk": "Madukkarai",
    "tamil_name": "மலுமிச்சம்பட்டி",
    "latitude": 10.9214,
    "longitude": 77.0124,
    "aliases": [
      "malumichampatty",
      "malumachanpatti"
    ],
    "tanglish_variants": [
      "malumichampatti-la"
    ],
    "location_id": "LOC-CBE-036",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Othakkalmandapam",
    "display_name": "Othakkalmandapam",
    "location_type": "Town Panchayat",
    "revenue_division": "Coimbatore South",
    "taluk": "Madukkarai",
    "tamil_name": "ஒத்தக்கால்மண்டபம்",
    "latitude": 10.8924,
    "longitude": 77.0182,
    "aliases": [
      "othakkal mandapam",
      "othakkalmandabam"
    ],
    "tanglish_variants": [
      "othakkalmandapam-la"
    ],
    "location_id": "LOC-CBE-037",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Chettipalayam",
    "display_name": "Chettipalayam",
    "location_type": "Town Panchayat",
    "revenue_division": "Coimbatore South",
    "taluk": "Madukkarai",
    "tamil_name": "செட்டிபாளையம்",
    "latitude": 10.9124,
    "longitude": 77.0542,
    "aliases": [
      "chettypalayam",
      "kari motor speedway area"
    ],
    "tanglish_variants": [
      "chettipalayam-la",
      "chettypalayam-la"
    ],
    "location_id": "LOC-CBE-038",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Kurichi",
    "display_name": "Kurichi",
    "location_type": "Town Panchayat",
    "revenue_division": "Coimbatore South",
    "taluk": "Madukkarai",
    "tamil_name": "குறிச்சி",
    "latitude": 10.9521,
    "longitude": 76.9642,
    "aliases": [
      "kurichy",
      "sidco kurichi",
      "kurichi industrial estate",
      "eachanari kurichi"
    ],
    "tanglish_variants": [
      "kurichi-la",
      "kurichy-la"
    ],
    "location_id": "LOC-CBE-039",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Vellalur",
    "display_name": "Vellalur",
    "location_type": "Town Panchayat",
    "revenue_division": "Coimbatore South",
    "taluk": "Madukkarai",
    "tamil_name": "வெள்ளலூர்",
    "latitude": 10.9742,
    "longitude": 77.0142,
    "aliases": [
      "vellalore",
      "vellalur integrated bus stand area"
    ],
    "tanglish_variants": [
      "vellalur-la",
      "vellalore-la"
    ],
    "location_id": "LOC-CBE-040",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Thirumalayampalayam",
    "display_name": "Thirumalayampalayam",
    "location_type": "Town Panchayat",
    "revenue_division": "Coimbatore South",
    "taluk": "Madukkarai",
    "tamil_name": "திருமலையம்பாளையம்",
    "latitude": 10.8812,
    "longitude": 76.9241,
    "aliases": [
      "thirumalaiyampalayam",
      "thirumalayampalayam pirivu"
    ],
    "tanglish_variants": [
      "thirumalayampalayam-la"
    ],
    "location_id": "LOC-CBE-041",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Seerapalayam",
    "display_name": "Seerapalayam",
    "location_type": "Village / Locality",
    "revenue_division": "Coimbatore South",
    "taluk": "Madukkarai",
    "tamil_name": "சீரபாளையம்",
    "latitude": 10.9121,
    "longitude": 76.9741,
    "aliases": [
      "seera palayam"
    ],
    "tanglish_variants": [
      "seerapalayam-la"
    ],
    "location_id": "LOC-CBE-042",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Mavuthampathy",
    "display_name": "Mavuthampathy",
    "location_type": "Village / Locality",
    "revenue_division": "Coimbatore South",
    "taluk": "Madukkarai",
    "tamil_name": "மாவூத்தம்பதி",
    "latitude": 10.8621,
    "longitude": 76.8842,
    "aliases": [
      "mavuthampathi",
      "navakkarai"
    ],
    "tanglish_variants": [
      "mavuthampathy-la"
    ],
    "location_id": "LOC-CBE-043",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Pichanur",
    "display_name": "Pichanur",
    "location_type": "Village / Locality",
    "revenue_division": "Coimbatore South",
    "taluk": "Madukkarai",
    "tamil_name": "பிச்சனூர்",
    "latitude": 10.8712,
    "longitude": 76.9014,
    "aliases": [
      "pichanoor"
    ],
    "tanglish_variants": [
      "pichanur-la"
    ],
    "location_id": "LOC-CBE-044",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Vazhukuparai",
    "display_name": "Vazhukuparai",
    "location_type": "Village / Locality",
    "revenue_division": "Coimbatore South",
    "taluk": "Madukkarai",
    "tamil_name": "வழுக்குப்பாறை",
    "latitude": 10.8741,
    "longitude": 76.9521,
    "aliases": [
      "vazhuku parai"
    ],
    "tanglish_variants": [
      "vazhukuparai-la"
    ],
    "location_id": "LOC-CBE-045",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Palathurai",
    "display_name": "Palathurai",
    "location_type": "Village / Locality",
    "revenue_division": "Coimbatore South",
    "taluk": "Madukkarai",
    "tamil_name": "பாலத்துறை",
    "latitude": 10.9124,
    "longitude": 76.9482,
    "aliases": [
      "pala thurai"
    ],
    "tanglish_variants": [
      "palathurai-la"
    ],
    "location_id": "LOC-CBE-046",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Nachipalayam",
    "display_name": "Nachipalayam",
    "location_type": "Village / Locality",
    "revenue_division": "Coimbatore South",
    "taluk": "Madukkarai",
    "tamil_name": "நாச்சிபாளையம்",
    "latitude": 10.9241,
    "longitude": 77.0341,
    "aliases": [
      "nachi palayam"
    ],
    "tanglish_variants": [
      "nachipalayam-la"
    ],
    "location_id": "LOC-CBE-047",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Arisipalayam",
    "display_name": "Arisipalayam",
    "location_type": "Village / Locality",
    "revenue_division": "Coimbatore South",
    "taluk": "Madukkarai",
    "tamil_name": "அரிசிபாளையம்",
    "latitude": 10.8952,
    "longitude": 76.9812,
    "aliases": [
      "arisi palayam"
    ],
    "tanglish_variants": [
      "arisipalayam-la"
    ],
    "location_id": "LOC-CBE-048",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Myleripalayam",
    "display_name": "Myleripalayam",
    "location_type": "Village / Locality",
    "revenue_division": "Coimbatore South",
    "taluk": "Madukkarai",
    "tamil_name": "மயிலேறிபாளையம்",
    "latitude": 10.8912,
    "longitude": 77.0421,
    "aliases": [
      "mileri palayam",
      "myleripalayam village"
    ],
    "tanglish_variants": [
      "myleripalayam-la"
    ],
    "location_id": "LOC-CBE-049",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Oorattukuppai",
    "display_name": "Oorattukuppai",
    "location_type": "Village / Locality",
    "revenue_division": "Coimbatore South",
    "taluk": "Madukkarai",
    "tamil_name": "ஊரட்டுகுப்பை",
    "latitude": 10.8624,
    "longitude": 77.0612,
    "aliases": [
      "orattukuppai"
    ],
    "tanglish_variants": [
      "oorattukuppai-la"
    ],
    "location_id": "LOC-CBE-050",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Perur",
    "display_name": "Perur",
    "location_type": "Town Panchayat",
    "revenue_division": "Coimbatore South",
    "taluk": "Perur",
    "tamil_name": "பேரூர்",
    "latitude": 10.9712,
    "longitude": 76.9242,
    "aliases": [
      "perur pateeswarar temple",
      "perur temple",
      "perur road"
    ],
    "tanglish_variants": [
      "perur-la",
      "perur temple pakkam"
    ],
    "location_id": "LOC-CBE-051",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Vadavalli",
    "display_name": "Vadavalli",
    "location_type": "Town Panchayat",
    "revenue_division": "Coimbatore South",
    "taluk": "Perur",
    "tamil_name": "வடவள்ளி",
    "latitude": 11.0284,
    "longitude": 76.9015,
    "aliases": [
      "vaadavalli",
      "maruthamalai road vadavalli",
      "onapalayam vadavalli"
    ],
    "tanglish_variants": [
      "vadavalli-la",
      "vaadavalli-la"
    ],
    "location_id": "LOC-CBE-052",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Thondamuthur",
    "display_name": "Thondamuthur",
    "location_type": "Town Panchayat",
    "revenue_division": "Coimbatore South",
    "taluk": "Perur",
    "tamil_name": "தொண்டாமுத்தூர்",
    "latitude": 10.9984,
    "longitude": 76.8342,
    "aliases": [
      "thondamuthur junction",
      "thondamuthur block"
    ],
    "tanglish_variants": [
      "thondamuthur-la"
    ],
    "location_id": "LOC-CBE-053",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Alandurai",
    "display_name": "Alandurai",
    "location_type": "Town Panchayat",
    "revenue_division": "Coimbatore South",
    "taluk": "Perur",
    "tamil_name": "ஆலாந்துறை",
    "latitude": 10.9614,
    "longitude": 76.7824,
    "aliases": [
      "alanthurai",
      "alandurai road"
    ],
    "tanglish_variants": [
      "alandurai-la"
    ],
    "location_id": "LOC-CBE-054",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Pooluvapatti",
    "display_name": "Pooluvapatti",
    "location_type": "Town Panchayat",
    "revenue_division": "Coimbatore South",
    "taluk": "Perur",
    "tamil_name": "பூளுவபட்டி",
    "latitude": 10.9782,
    "longitude": 76.7912,
    "aliases": [
      "pooluvampatti",
      "pooluvampatty"
    ],
    "tanglish_variants": [
      "pooluvapatti-la",
      "pooluvampatti-la"
    ],
    "location_id": "LOC-CBE-055",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Thenkarai",
    "display_name": "Thenkarai",
    "location_type": "Town Panchayat",
    "revenue_division": "Coimbatore South",
    "taluk": "Perur",
    "tamil_name": "தென்கரை",
    "latitude": 10.9842,
    "longitude": 76.8124,
    "aliases": [
      "then karai"
    ],
    "tanglish_variants": [
      "thenkarai-la"
    ],
    "location_id": "LOC-CBE-056",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Madampatti",
    "display_name": "Madampatti",
    "location_type": "Village / Locality",
    "revenue_division": "Coimbatore South",
    "taluk": "Perur",
    "tamil_name": "மாதம்பட்டி",
    "latitude": 10.9821,
    "longitude": 76.8712,
    "aliases": [
      "madampatty",
      "siruvani road madampatti"
    ],
    "tanglish_variants": [
      "madampatti-la",
      "madampatty-la"
    ],
    "location_id": "LOC-CBE-057",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Theethipalayam",
    "display_name": "Theethipalayam",
    "location_type": "Village / Locality",
    "revenue_division": "Coimbatore South",
    "taluk": "Perur",
    "tamil_name": "தீத்திபாளையம்",
    "latitude": 10.9642,
    "longitude": 76.8912,
    "aliases": [
      "theethi palayam"
    ],
    "tanglish_variants": [
      "theethipalayam-la"
    ],
    "location_id": "LOC-CBE-058",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Perur Chettipalayam",
    "display_name": "Perur Chettipalayam",
    "location_type": "Village / Locality",
    "revenue_division": "Coimbatore South",
    "taluk": "Perur",
    "tamil_name": "பேரூர் செட்டிபாளையம்",
    "latitude": 10.9741,
    "longitude": 76.9124,
    "aliases": [
      "perur chettipalayam village"
    ],
    "tanglish_variants": [
      "perur chettipalayam-la"
    ],
    "location_id": "LOC-CBE-059",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Narasipuram",
    "display_name": "Narasipuram",
    "location_type": "Village / Locality",
    "revenue_division": "Coimbatore South",
    "taluk": "Perur",
    "tamil_name": "நரசிபுரம்",
    "latitude": 10.9892,
    "longitude": 76.7641,
    "aliases": [
      "narasi puram",
      "vaidehi falls road"
    ],
    "tanglish_variants": [
      "narasipuram-la"
    ],
    "location_id": "LOC-CBE-060",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Vellimalaipattinam",
    "display_name": "Vellimalaipattinam",
    "location_type": "Village / Locality",
    "revenue_division": "Coimbatore South",
    "taluk": "Perur",
    "tamil_name": "வெள்ளிமலைப்பட்டினம்",
    "latitude": 10.9621,
    "longitude": 76.7712,
    "aliases": [
      "velli malai pattinam"
    ],
    "tanglish_variants": [
      "vellimalaipattinam-la"
    ],
    "location_id": "LOC-CBE-061",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Semmedu",
    "display_name": "Semmedu",
    "location_type": "Village / Locality",
    "revenue_division": "Coimbatore South",
    "taluk": "Perur",
    "tamil_name": "செம்மேடு",
    "latitude": 10.9542,
    "longitude": 76.7512,
    "aliases": [
      "semmedu isha road",
      "dhyanalinga road"
    ],
    "tanglish_variants": [
      "semmedu-la"
    ],
    "location_id": "LOC-CBE-062",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Vedapatti",
    "display_name": "Vedapatti",
    "location_type": "Town Panchayat",
    "revenue_division": "Coimbatore South",
    "taluk": "Perur",
    "tamil_name": "வேடபட்டி",
    "latitude": 10.9982,
    "longitude": 76.9124,
    "aliases": [
      "veda patti",
      "vedapatti lake"
    ],
    "tanglish_variants": [
      "vedapatti-la"
    ],
    "location_id": "LOC-CBE-063",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Kuniyamuthur",
    "display_name": "Kuniyamuthur",
    "location_type": "Town Panchayat",
    "revenue_division": "Coimbatore South",
    "taluk": "Perur",
    "tamil_name": "குனியமுத்தூர்",
    "latitude": 10.9624,
    "longitude": 76.9542,
    "aliases": [
      "kuniymuthur",
      "kuniyamuthur market",
      "palakkad road kuniyamuthur"
    ],
    "tanglish_variants": [
      "kuniyamuthur-la"
    ],
    "location_id": "LOC-CBE-064",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Sundakamuthur",
    "display_name": "Sundakamuthur",
    "location_type": "Village / Locality",
    "revenue_division": "Coimbatore South",
    "taluk": "Perur",
    "tamil_name": "சுண்டக்காமுத்தூர்",
    "latitude": 10.9682,
    "longitude": 76.9382,
    "aliases": [
      "sundakkamuthur"
    ],
    "tanglish_variants": [
      "sundakamuthur-la"
    ],
    "location_id": "LOC-CBE-065",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Veerakeralam",
    "display_name": "Veerakeralam",
    "location_type": "Town Panchayat",
    "revenue_division": "Coimbatore South",
    "taluk": "Perur",
    "tamil_name": "வீரகேரளம்",
    "latitude": 11.0142,
    "longitude": 76.9142,
    "aliases": [
      "veera keralam"
    ],
    "tanglish_variants": [
      "veerakeralam-la"
    ],
    "location_id": "LOC-CBE-066",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Dhaliyur",
    "display_name": "Dhaliyur",
    "location_type": "Town Panchayat",
    "revenue_division": "Coimbatore South",
    "taluk": "Perur",
    "tamil_name": "தாளியூர்",
    "latitude": 11.0182,
    "longitude": 76.8712,
    "aliases": [
      "thaliyur"
    ],
    "tanglish_variants": [
      "dhaliyur-la",
      "thaliyur-la"
    ],
    "location_id": "LOC-CBE-067",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Sulur",
    "display_name": "Sulur Town Panchayat",
    "location_type": "Town Panchayat",
    "revenue_division": "Coimbatore South",
    "taluk": "Sulur",
    "tamil_name": "சூலூர்",
    "latitude": 11.0264,
    "longitude": 77.1264,
    "aliases": [
      "soolur",
      "sulur air force base",
      "sulur lake",
      "trichy road sulur"
    ],
    "tanglish_variants": [
      "sulur-la",
      "soolur-la"
    ],
    "location_id": "LOC-CBE-068",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Karumathampatti",
    "display_name": "Karumathampatti Municipality",
    "location_type": "Municipality",
    "revenue_division": "Coimbatore South",
    "taluk": "Sulur",
    "tamil_name": "கருத்தம்பட்டி",
    "latitude": 11.1082,
    "longitude": 77.1824,
    "aliases": [
      "karumathampatty",
      "karumathampatti toll plaza",
      "nh 544 karumathampatti"
    ],
    "tanglish_variants": [
      "karumathampatti-la",
      "karumathampatty-la"
    ],
    "location_id": "LOC-CBE-069",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Irugur",
    "display_name": "Irugur",
    "location_type": "Town Panchayat",
    "revenue_division": "Coimbatore South",
    "taluk": "Sulur",
    "tamil_name": "இருவூர்",
    "latitude": 11.0241,
    "longitude": 77.0642,
    "aliases": [
      "irugur railway junction",
      "irugur shanthi social services"
    ],
    "tanglish_variants": [
      "irugur-la"
    ],
    "location_id": "LOC-CBE-070",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Kannampalayam",
    "display_name": "Kannampalayam",
    "location_type": "Town Panchayat",
    "revenue_division": "Coimbatore South",
    "taluk": "Sulur",
    "tamil_name": "கண்ணம்பாளையம்",
    "latitude": 11.0112,
    "longitude": 77.0942,
    "aliases": [
      "kannampalayam pirivu"
    ],
    "tanglish_variants": [
      "kannampalayam-la"
    ],
    "location_id": "LOC-CBE-071",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Pallapalayam",
    "display_name": "Pallapalayam",
    "location_type": "Town Panchayat",
    "revenue_division": "Coimbatore South",
    "taluk": "Sulur",
    "tamil_name": "பள்ளபாளையம்",
    "latitude": 11.0342,
    "longitude": 77.0812,
    "aliases": [
      "palla palayam"
    ],
    "tanglish_variants": [
      "pallapalayam-la"
    ],
    "location_id": "LOC-CBE-072",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Mopperipalayam",
    "display_name": "Mopperipalayam",
    "location_type": "Town Panchayat",
    "revenue_division": "Coimbatore South",
    "taluk": "Sulur",
    "tamil_name": "மோப்பிரிபாளையம்",
    "latitude": 11.1214,
    "longitude": 77.1642,
    "aliases": [
      "mopperi palayam"
    ],
    "tanglish_variants": [
      "mopperipalayam-la"
    ],
    "location_id": "LOC-CBE-073",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Neelambur",
    "display_name": "Neelambur",
    "location_type": "Village / Locality",
    "revenue_division": "Coimbatore South",
    "taluk": "Sulur",
    "tamil_name": "நீலாம்பூர்",
    "latitude": 11.0612,
    "longitude": 77.0782,
    "aliases": [
      "neelambur bypass",
      "le meridien cbe area",
      "psg hospital neelambur"
    ],
    "tanglish_variants": [
      "neelambur-la"
    ],
    "location_id": "LOC-CBE-074",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Arasur",
    "display_name": "Arasur",
    "location_type": "Village / Locality",
    "revenue_division": "Coimbatore South",
    "taluk": "Sulur",
    "tamil_name": "அரசூர்",
    "latitude": 11.0742,
    "longitude": 77.1124,
    "aliases": [
      "arasur pirivu",
      "nh arasur"
    ],
    "tanglish_variants": [
      "arasur-la"
    ],
    "location_id": "LOC-CBE-075",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Kaniyur",
    "display_name": "Kaniyur",
    "location_type": "Village / Locality",
    "revenue_division": "Coimbatore South",
    "taluk": "Sulur",
    "tamil_name": "கணியூர்",
    "latitude": 11.0912,
    "longitude": 77.1421,
    "aliases": [
      "kaniyur toll plaza",
      "kaniyur village"
    ],
    "tanglish_variants": [
      "kaniyur-la"
    ],
    "location_id": "LOC-CBE-076",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Mylampatti",
    "display_name": "Mylampatti",
    "location_type": "Village / Locality",
    "revenue_division": "Coimbatore South",
    "taluk": "Sulur",
    "tamil_name": "மயிலம்பட்டி",
    "latitude": 11.0642,
    "longitude": 77.0542,
    "aliases": [
      "mylampatty"
    ],
    "tanglish_variants": [
      "mylampatti-la",
      "mylampatty-la"
    ],
    "location_id": "LOC-CBE-077",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Kangayampalayam",
    "display_name": "Kangayampalayam",
    "location_type": "Village / Locality",
    "revenue_division": "Coimbatore South",
    "taluk": "Sulur",
    "tamil_name": "காங்கயம்பாளையம்",
    "latitude": 11.0182,
    "longitude": 77.1124,
    "aliases": [
      "kangayam palayam"
    ],
    "tanglish_variants": [
      "kangayampalayam-la"
    ],
    "location_id": "LOC-CBE-078",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Pattanam",
    "display_name": "Pattanam",
    "location_type": "Village / Locality",
    "revenue_division": "Coimbatore South",
    "taluk": "Sulur",
    "tamil_name": "பட்டணம்",
    "latitude": 10.9782,
    "longitude": 77.0742,
    "aliases": [
      "pattanam ittarai",
      "pattanam village"
    ],
    "tanglish_variants": [
      "pattanam-la"
    ],
    "location_id": "LOC-CBE-079",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Peedampalli",
    "display_name": "Peedampalli",
    "location_type": "Village / Locality",
    "revenue_division": "Coimbatore South",
    "taluk": "Sulur",
    "tamil_name": "பீடம்பள்ளி",
    "latitude": 10.9842,
    "longitude": 77.1012,
    "aliases": [
      "peedampally"
    ],
    "tanglish_variants": [
      "peedampalli-la"
    ],
    "location_id": "LOC-CBE-080",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Pappampatti",
    "display_name": "Pappampatti",
    "location_type": "Village / Locality",
    "revenue_division": "Coimbatore South",
    "taluk": "Sulur",
    "tamil_name": "பாப்பம்பட்டி",
    "latitude": 10.9942,
    "longitude": 77.1342,
    "aliases": [
      "pappampatty",
      "pappampatti pirivu"
    ],
    "tanglish_variants": [
      "pappampatti-la"
    ],
    "location_id": "LOC-CBE-081",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Kaduvettipalayam",
    "display_name": "Kaduvettipalayam",
    "location_type": "Village / Locality",
    "revenue_division": "Coimbatore South",
    "taluk": "Sulur",
    "tamil_name": "காடுவெட்டிபாளையம்",
    "latitude": 11.1342,
    "longitude": 77.1742,
    "aliases": [
      "kaduvetti palayam"
    ],
    "tanglish_variants": [
      "kaduvettipalayam-la"
    ],
    "location_id": "LOC-CBE-082",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Paduvampalli",
    "display_name": "Paduvampalli",
    "location_type": "Village / Locality",
    "revenue_division": "Coimbatore South",
    "taluk": "Sulur",
    "tamil_name": "படுவாம்பள்ளி",
    "latitude": 11.1482,
    "longitude": 77.1421,
    "aliases": [
      "paduvampally"
    ],
    "tanglish_variants": [
      "paduvampalli-la"
    ],
    "location_id": "LOC-CBE-083",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Kittampalayam",
    "display_name": "Kittampalayam",
    "location_type": "Village / Locality",
    "revenue_division": "Coimbatore South",
    "taluk": "Sulur",
    "tamil_name": "கிட்டாம்பாளையம்",
    "latitude": 11.1142,
    "longitude": 77.1612,
    "aliases": [
      "kittam palayam"
    ],
    "tanglish_variants": [
      "kittampalayam-la"
    ],
    "location_id": "LOC-CBE-084",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Kallapalayam",
    "display_name": "Kallapalayam",
    "location_type": "Village / Locality",
    "revenue_division": "Coimbatore South",
    "taluk": "Sulur",
    "tamil_name": "கல்லாபாளையம்",
    "latitude": 10.9612,
    "longitude": 77.1242,
    "aliases": [
      "kalla palayam"
    ],
    "tanglish_variants": [
      "kallapalayam-la"
    ],
    "location_id": "LOC-CBE-085",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Sencheripudur",
    "display_name": "Sencheripudur",
    "location_type": "Village / Locality",
    "revenue_division": "Coimbatore South",
    "taluk": "Sulur",
    "tamil_name": "செஞ்சேரிபுதூர்",
    "latitude": 10.8712,
    "longitude": 77.2142,
    "aliases": [
      "senjeri pudur"
    ],
    "tanglish_variants": [
      "sencheripudur-la"
    ],
    "location_id": "LOC-CBE-086",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Mettupalayam",
    "display_name": "Mettupalayam Municipality",
    "location_type": "Municipality",
    "revenue_division": "Coimbatore North",
    "taluk": "Mettupalayam",
    "tamil_name": "மேட்டுப்பாளையம்",
    "latitude": 11.2982,
    "longitude": 76.9421,
    "aliases": [
      "mtp",
      "mettupalayam railway station",
      "bhavani river mtp",
      "ooty road mettupalayam"
    ],
    "tanglish_variants": [
      "mettupalayam-la",
      "mtp-la"
    ],
    "location_id": "LOC-CBE-087",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Karamadai",
    "display_name": "Karamadai Municipality",
    "location_type": "Municipality",
    "revenue_division": "Coimbatore North",
    "taluk": "Mettupalayam",
    "tamil_name": "காரமடை",
    "latitude": 11.2412,
    "longitude": 76.9582,
    "aliases": [
      "karamadai ranganathar temple",
      "karamadai junction"
    ],
    "tanglish_variants": [
      "karamadai-la"
    ],
    "location_id": "LOC-CBE-088",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Sirumugai",
    "display_name": "Sirumugai",
    "location_type": "Town Panchayat",
    "revenue_division": "Coimbatore North",
    "taluk": "Mettupalayam",
    "tamil_name": "சிறுமுகை",
    "latitude": 11.3342,
    "longitude": 77.0124,
    "aliases": [
      "sirumugai silk saree area",
      "bhavani sagar road"
    ],
    "tanglish_variants": [
      "sirumugai-la"
    ],
    "location_id": "LOC-CBE-089",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Nellithurai",
    "display_name": "Nellithurai",
    "location_type": "Village / Locality",
    "revenue_division": "Coimbatore North",
    "taluk": "Mettupalayam",
    "tamil_name": "நெல்லித்துறை",
    "latitude": 11.3124,
    "longitude": 76.9124,
    "aliases": [
      "nelli thurai"
    ],
    "tanglish_variants": [
      "nellithurai-la"
    ],
    "location_id": "LOC-CBE-090",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Odanthurai",
    "display_name": "Odanthurai",
    "location_type": "Village / Locality",
    "revenue_division": "Coimbatore North",
    "taluk": "Mettupalayam",
    "tamil_name": "ஓடந்துறை",
    "latitude": 11.3042,
    "longitude": 76.9282,
    "aliases": [
      "odan thurai"
    ],
    "tanglish_variants": [
      "odanthurai-la"
    ],
    "location_id": "LOC-CBE-091",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Thekkampatti",
    "display_name": "Thekkampatti",
    "location_type": "Village / Locality",
    "revenue_division": "Coimbatore North",
    "taluk": "Mettupalayam",
    "tamil_name": "தேக்கம்பட்டி",
    "latitude": 11.3214,
    "longitude": 76.9182,
    "aliases": [
      "thekkampatty",
      "elephant camp thekkampatti",
      "vanabhadrakali amman temple"
    ],
    "tanglish_variants": [
      "thekkampatti-la"
    ],
    "location_id": "LOC-CBE-092",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Sikkadasampalayam",
    "display_name": "Sikkadasampalayam",
    "location_type": "Village / Locality",
    "revenue_division": "Coimbatore North",
    "taluk": "Mettupalayam",
    "tamil_name": "சிக்கதாசம்பாளையம்",
    "latitude": 11.2812,
    "longitude": 76.9642,
    "aliases": [
      "sikkadasam palayam"
    ],
    "tanglish_variants": [
      "sikkadasampalayam-la"
    ],
    "location_id": "LOC-CBE-093",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Bellepalayam",
    "display_name": "Bellepalayam",
    "location_type": "Village / Locality",
    "revenue_division": "Coimbatore North",
    "taluk": "Mettupalayam",
    "tamil_name": "பெள்ளேபாளையம்",
    "latitude": 11.3412,
    "longitude": 76.9812,
    "aliases": [
      "belle palayam"
    ],
    "tanglish_variants": [
      "bellepalayam-la"
    ],
    "location_id": "LOC-CBE-094",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Jadayampalayam",
    "display_name": "Jadayampalayam",
    "location_type": "Village / Locality",
    "revenue_division": "Coimbatore North",
    "taluk": "Mettupalayam",
    "tamil_name": "ஜடையம்பாளையம்",
    "latitude": 11.3142,
    "longitude": 77.0421,
    "aliases": [
      "jadhayampalayam"
    ],
    "tanglish_variants": [
      "jadayampalayam-la"
    ],
    "location_id": "LOC-CBE-095",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Velliyankadu",
    "display_name": "Velliyankadu",
    "location_type": "Village / Locality",
    "revenue_division": "Coimbatore North",
    "taluk": "Mettupalayam",
    "tamil_name": "வெள்ளியங்காடு",
    "latitude": 11.2214,
    "longitude": 76.8421,
    "aliases": [
      "velliangadu"
    ],
    "tanglish_variants": [
      "velliyankadu-la"
    ],
    "location_id": "LOC-CBE-096",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Annur",
    "display_name": "Annur Town Panchayat",
    "location_type": "Town Panchayat",
    "revenue_division": "Coimbatore North",
    "taluk": "Annur",
    "tamil_name": "அன்னூர்",
    "latitude": 11.2324,
    "longitude": 77.1342,
    "aliases": [
      "annoor",
      "annur bus stand",
      "sathy road annur",
      "avinasilingam annur"
    ],
    "tanglish_variants": [
      "annur-la",
      "annoor-la"
    ],
    "location_id": "LOC-CBE-097",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Kurumbapalayam",
    "display_name": "Kurumbapalayam",
    "location_type": "Village / Locality",
    "revenue_division": "Coimbatore North",
    "taluk": "Annur",
    "tamil_name": "குரும்பபாளையம்",
    "latitude": 11.1242,
    "longitude": 77.0342,
    "aliases": [
      "kurumba palayam",
      "sathy road kurumbapalayam"
    ],
    "tanglish_variants": [
      "kurumbapalayam-la",
      "kurumba palayam la",
      "kurumbapalayam pakkam"
    ],
    "location_id": "LOC-CBE-098",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Sarkarsamakulam",
    "display_name": "Sarkarsamakulam",
    "location_type": "Town Panchayat",
    "revenue_division": "Coimbatore North",
    "taluk": "Annur",
    "tamil_name": "சர்க்கார்சாமக்குளம்",
    "latitude": 11.1182,
    "longitude": 77.0142,
    "aliases": [
      "s s kulam",
      "ss kulam",
      "sarkarsamakulam block"
    ],
    "tanglish_variants": [
      "sarkarsamakulam-la",
      "ss kulam-la"
    ],
    "location_id": "LOC-CBE-099",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Idigarai",
    "display_name": "Idigarai",
    "location_type": "Town Panchayat",
    "revenue_division": "Coimbatore North",
    "taluk": "Annur",
    "tamil_name": "இடிகரை",
    "latitude": 11.1214,
    "longitude": 76.9742,
    "aliases": [
      "idikarai",
      "idigarai village"
    ],
    "tanglish_variants": [
      "idigarai-la",
      "idikarai-la"
    ],
    "location_id": "LOC-CBE-100",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Keeranatham",
    "display_name": "Keeranatham",
    "location_type": "Village / Locality",
    "revenue_division": "Coimbatore North",
    "taluk": "Annur",
    "tamil_name": "கீரநத்தம்",
    "latitude": 11.1012,
    "longitude": 77.0142,
    "aliases": [
      "keera natham",
      "chil sez keeranatham",
      "keeranatham it park"
    ],
    "tanglish_variants": [
      "keeranatham-la"
    ],
    "location_id": "LOC-CBE-101",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Kallipalayam",
    "display_name": "Kallipalayam",
    "location_type": "Village / Locality",
    "revenue_division": "Coimbatore North",
    "taluk": "Annur",
    "tamil_name": "கள்ளிப்பாளையம்",
    "latitude": 11.1524,
    "longitude": 77.0421,
    "aliases": [
      "kalli palayam"
    ],
    "tanglish_variants": [
      "kallipalayam-la"
    ],
    "location_id": "LOC-CBE-102",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Vellanaipatti",
    "display_name": "Vellanaipatti",
    "location_type": "Village / Locality",
    "revenue_division": "Coimbatore North",
    "taluk": "Annur",
    "tamil_name": "வெள்ளனைப்பட்டி",
    "latitude": 11.1042,
    "longitude": 77.0542,
    "aliases": [
      "vellanaipatty",
      "vellanaipatti village"
    ],
    "tanglish_variants": [
      "vellanaipatti-la"
    ],
    "location_id": "LOC-CBE-103",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Kariyampalayam",
    "display_name": "Kariyampalayam",
    "location_type": "Village / Locality",
    "revenue_division": "Coimbatore North",
    "taluk": "Annur",
    "tamil_name": "கரியாம்பாளையம்",
    "latitude": 11.2482,
    "longitude": 77.1142,
    "aliases": [
      "kariya palayam"
    ],
    "tanglish_variants": [
      "kariyampalayam-la"
    ],
    "location_id": "LOC-CBE-104",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Kattampatti",
    "display_name": "Kattampatti",
    "location_type": "Village / Locality",
    "revenue_division": "Coimbatore North",
    "taluk": "Annur",
    "tamil_name": "காட்டம்பட்டி",
    "latitude": 11.2042,
    "longitude": 77.0812,
    "aliases": [
      "kattampatty"
    ],
    "tanglish_variants": [
      "kattampatti-la"
    ],
    "location_id": "LOC-CBE-105",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Pillayampalayam",
    "display_name": "Pillayampalayam",
    "location_type": "Village / Locality",
    "revenue_division": "Coimbatore North",
    "taluk": "Annur",
    "tamil_name": "பிள்ளையம்பாளையம்",
    "latitude": 11.2542,
    "longitude": 77.1542,
    "aliases": [
      "pillayam palayam"
    ],
    "tanglish_variants": [
      "pillayampalayam-la"
    ],
    "location_id": "LOC-CBE-106",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Vellamadai",
    "display_name": "Vellamadai",
    "location_type": "Village / Locality",
    "revenue_division": "Coimbatore North",
    "taluk": "Annur",
    "tamil_name": "வெள்ளமடை",
    "latitude": 11.1642,
    "longitude": 77.0124,
    "aliases": [
      "vella madai"
    ],
    "tanglish_variants": [
      "vellamadai-la"
    ],
    "location_id": "LOC-CBE-107",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Pollachi",
    "display_name": "Pollachi Municipality",
    "location_type": "Municipality",
    "revenue_division": "Pollachi",
    "taluk": "Pollachi",
    "tamil_name": "பொள்ளாச்சி",
    "latitude": 10.6612,
    "longitude": 77.0084,
    "aliases": [
      "pollachi town",
      "pollachi bus stand",
      "pollachi market"
    ],
    "tanglish_variants": [
      "pollachi-la",
      "pollachi pakkam"
    ],
    "location_id": "LOC-CBE-108",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Suleswaranpatti",
    "display_name": "Suleswaranpatti",
    "location_type": "Town Panchayat",
    "revenue_division": "Pollachi",
    "taluk": "Pollachi",
    "tamil_name": "சூலேஸ்வரன்பட்டி",
    "latitude": 10.6482,
    "longitude": 77.0182,
    "aliases": [
      "suleswaran patti"
    ],
    "tanglish_variants": [
      "suleswaranpatti-la"
    ],
    "location_id": "LOC-CBE-109",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Zamin Uthukuli",
    "display_name": "Zamin Uthukuli",
    "location_type": "Town Panchayat",
    "revenue_division": "Pollachi",
    "taluk": "Pollachi",
    "tamil_name": "ஜமீன் ஊத்துக்குளி",
    "latitude": 10.6812,
    "longitude": 76.9842,
    "aliases": [
      "zamin uthukuli village"
    ],
    "tanglish_variants": [
      "zamin uthukuli-la"
    ],
    "location_id": "LOC-CBE-110",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Samathur",
    "display_name": "Samathur",
    "location_type": "Town Panchayat",
    "revenue_division": "Pollachi",
    "taluk": "Pollachi",
    "tamil_name": "சமத்தூர்",
    "latitude": 10.6012,
    "longitude": 76.9942,
    "aliases": [
      "samathur vanavarayar area"
    ],
    "tanglish_variants": [
      "samathur-la"
    ],
    "location_id": "LOC-CBE-111",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Perianegamam",
    "display_name": "Perianegamam",
    "location_type": "Town Panchayat",
    "revenue_division": "Pollachi",
    "taluk": "Pollachi",
    "tamil_name": "பெரியநெகமம்",
    "latitude": 10.7412,
    "longitude": 77.0842,
    "aliases": [
      "negamam",
      "periya negamam"
    ],
    "tanglish_variants": [
      "perianegamam-la",
      "negamam-la"
    ],
    "location_id": "LOC-CBE-112",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Kinathukadavu",
    "display_name": "Kinathukadavu Town Panchayat",
    "location_type": "Town Panchayat",
    "revenue_division": "Pollachi",
    "taluk": "Kinathukadavu",
    "tamil_name": "கிணத்துக்கடவு",
    "latitude": 10.8214,
    "longitude": 77.0182,
    "aliases": [
      "kinathukadavu junction",
      "pollachi road kinathukadavu"
    ],
    "tanglish_variants": [
      "kinathukadavu-la"
    ],
    "location_id": "LOC-CBE-113",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Valparai",
    "display_name": "Valparai Municipality",
    "location_type": "Municipality",
    "revenue_division": "Pollachi",
    "taluk": "Valparai",
    "tamil_name": "வால்பாறை",
    "latitude": 10.3242,
    "longitude": 76.9542,
    "aliases": [
      "vaalparai",
      "sholayar dam area",
      "valparai tea estates"
    ],
    "tanglish_variants": [
      "valparai-la",
      "vaalparai-la"
    ],
    "location_id": "LOC-CBE-114",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Anaimalai",
    "display_name": "Anaimalai Town Panchayat",
    "location_type": "Town Panchayat",
    "revenue_division": "Pollachi",
    "taluk": "Anaimalai",
    "tamil_name": "ஆனைமலை",
    "latitude": 10.5842,
    "longitude": 76.9342,
    "aliases": [
      "aanaimalai",
      "masani amman temple anaimalai",
      "topslip foothills"
    ],
    "tanglish_variants": [
      "anaimalai-la",
      "aanaimalai-la"
    ],
    "location_id": "LOC-CBE-115",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Vettaikaranpudur",
    "display_name": "Vettaikaranpudur",
    "location_type": "Town Panchayat",
    "revenue_division": "Pollachi",
    "taluk": "Anaimalai",
    "tamil_name": "வேட்டைக்காரன்புதூர்",
    "latitude": 10.5642,
    "longitude": 76.9124,
    "aliases": [
      "vettaikaran pudur"
    ],
    "tanglish_variants": [
      "vettaikaranpudur-la"
    ],
    "location_id": "LOC-CBE-116",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Odayakulam",
    "display_name": "Odayakulam",
    "location_type": "Town Panchayat",
    "revenue_division": "Pollachi",
    "taluk": "Anaimalai",
    "tamil_name": "ஒடைகுளம்",
    "latitude": 10.5512,
    "longitude": 76.9542,
    "aliases": [
      "odaiyakulam"
    ],
    "tanglish_variants": [
      "odayakulam-la"
    ],
    "location_id": "LOC-CBE-117",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Kottur",
    "display_name": "Kottur",
    "location_type": "Town Panchayat",
    "revenue_division": "Pollachi",
    "taluk": "Anaimalai",
    "tamil_name": "கோட்டூர்",
    "latitude": 10.5342,
    "longitude": 76.9842,
    "aliases": [
      "kottur cbe",
      "aliyar road kottur"
    ],
    "tanglish_variants": [
      "kottur-la"
    ],
    "location_id": "LOC-CBE-118",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Coimbatore Municipal Corporation",
    "display_name": "Coimbatore Municipal Corporation (HQ / Town Hall)",
    "location_type": "Municipal Corporation",
    "revenue_division": "Coimbatore South",
    "taluk": "Coimbatore South",
    "tamil_name": "கோயம்புத்தூர் மாநகராட்சி",
    "latitude": 11.0018,
    "longitude": 76.9628,
    "aliases": [
      "cbe corporation",
      "coimbatore corporation",
      "corporation office",
      "kovai corporation"
    ],
    "tanglish_variants": [
      "coimbatore corporation-la",
      "corporation office-la"
    ],
    "location_id": "LOC-CBE-119",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Karunchamigoundenpalayam",
    "display_name": "Karunchamigoundenpalayam",
    "location_type": "Village",
    "revenue_division": "Coimbatore South",
    "taluk": "Madukkarai",
    "tamil_name": "கருஞ்சாமிகவுண்டன்பாளையம்",
    "latitude": 10.9021,
    "longitude": 76.9582,
    "aliases": [
      "karunchamigounden palayam",
      "karunchami gounden palayam"
    ],
    "tanglish_variants": [
      "karunchamigoundenpalayam-la",
      "karunchamigoundenpalayam pakkam"
    ],
    "location_id": "LOC-CBE-120",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Thammagoundanpalayam",
    "display_name": "Thammagoundanpalayam",
    "location_type": "Village",
    "revenue_division": "Coimbatore South",
    "taluk": "Madukkarai",
    "tamil_name": "தம்மகவுண்டன்பாளையம்",
    "latitude": 10.8912,
    "longitude": 76.9452,
    "aliases": [
      "thamma goundan palayam",
      "thammagoundenpalayam"
    ],
    "tanglish_variants": [
      "thammagoundanpalayam-la"
    ],
    "location_id": "LOC-CBE-121",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Ikkaraipoluvampatty",
    "display_name": "Ikkaraipoluvampatty",
    "location_type": "Village",
    "revenue_division": "Coimbatore South",
    "taluk": "Perur",
    "tamil_name": "இக்கரforegroundய்போளுவாம்பட்டி",
    "latitude": 10.9782,
    "longitude": 76.8124,
    "aliases": [
      "ikkaraipoluvampatti",
      "ikkaraipoluvam patti",
      "ikkarai boluvampatti"
    ],
    "tanglish_variants": [
      "ikkaraipoluvampatty-la",
      "ikkarai boluvampatty-la"
    ],
    "location_id": "LOC-CBE-122",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Madavarayapuram",
    "display_name": "Madavarayapuram",
    "location_type": "Village",
    "revenue_division": "Coimbatore South",
    "taluk": "Perur",
    "tamil_name": "மாதவராயபுரம்",
    "latitude": 10.9542,
    "longitude": 76.8291,
    "aliases": [
      "madhavarayapuram",
      "mathavarayapuram"
    ],
    "tanglish_variants": [
      "madavarayapuram-la"
    ],
    "location_id": "LOC-CBE-123",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Jakirnaickenpalayam",
    "display_name": "Jakirnaickenpalayam",
    "location_type": "Village",
    "revenue_division": "Coimbatore South",
    "taluk": "Perur",
    "tamil_name": "ஜாகீர்நாயக்கன்பாளையம்",
    "latitude": 10.9912,
    "longitude": 76.8834,
    "aliases": [
      "jakir naicken palayam",
      "zahir naicken palayam"
    ],
    "tanglish_variants": [
      "jakirnaickenpalayam-la"
    ],
    "location_id": "LOC-CBE-124",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Devarayanpuram",
    "display_name": "Devarayanpuram",
    "location_type": "Village",
    "revenue_division": "Coimbatore South",
    "taluk": "Perur",
    "tamil_name": "தேவராயன்புரம்",
    "latitude": 10.9854,
    "longitude": 76.8432,
    "aliases": [
      "thevarayanpuram"
    ],
    "tanglish_variants": [
      "devarayanpuram-la"
    ],
    "location_id": "LOC-CBE-125",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Thenamanallur",
    "display_name": "Thenamanallur",
    "location_type": "Village",
    "revenue_division": "Coimbatore South",
    "taluk": "Perur",
    "tamil_name": "தெனமநல்லூர்",
    "latitude": 10.9621,
    "longitude": 76.8378,
    "aliases": [
      "thenamanaallur"
    ],
    "tanglish_variants": [
      "thenamanallur-la"
    ],
    "location_id": "LOC-CBE-126",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Kalikanaickenpalayam",
    "display_name": "Kalikanaickenpalayam",
    "location_type": "Village",
    "revenue_division": "Coimbatore South",
    "taluk": "Perur",
    "tamil_name": "காளிகநாயக்கன்பாளையம்",
    "latitude": 11.0152,
    "longitude": 76.8791,
    "aliases": [
      "kalika naicken palayam",
      "kalikanaikenpalayam"
    ],
    "tanglish_variants": [
      "kalikanaickenpalayam-la"
    ],
    "location_id": "LOC-CBE-127",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Chithirai Chavadi",
    "display_name": "Chithirai Chavadi",
    "location_type": "Village",
    "revenue_division": "Coimbatore South",
    "taluk": "Perur",
    "tamil_name": "சித்திரைச் சாவடி",
    "latitude": 10.9812,
    "longitude": 76.8924,
    "aliases": [
      "chithirai chavadi",
      "chithiraichavadi anicut"
    ],
    "tanglish_variants": [
      "chithirai chavadi-la",
      "chithiraichavadi-la"
    ],
    "location_id": "LOC-CBE-128",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Komarapalayam",
    "display_name": "Komarapalayam (Perur)",
    "location_type": "Village",
    "revenue_division": "Coimbatore South",
    "taluk": "Perur",
    "tamil_name": "குமாரபாளையம்",
    "latitude": 10.9541,
    "longitude": 76.9242,
    "aliases": [
      "kumarapalayam perur",
      "komarapalayam cbe"
    ],
    "tanglish_variants": [
      "komarapalayam-la"
    ],
    "location_id": "LOC-CBE-129",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Semmandampalayam",
    "display_name": "Semmandampalayam",
    "location_type": "Village",
    "revenue_division": "Coimbatore South",
    "taluk": "Sulur",
    "tamil_name": "செம்மண்டம்பாளையம்",
    "latitude": 11.0742,
    "longitude": 77.1421,
    "aliases": [
      "semmandam palayam"
    ],
    "tanglish_variants": [
      "semmandampalayam-la"
    ],
    "location_id": "LOC-CBE-130",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Rasipalayam",
    "display_name": "Rasipalayam",
    "location_type": "Village",
    "revenue_division": "Coimbatore South",
    "taluk": "Sulur",
    "tamil_name": "ராசிபாளையம்",
    "latitude": 11.0421,
    "longitude": 77.1024,
    "aliases": [
      "rasi palayam"
    ],
    "tanglish_variants": [
      "rasipalayam-la"
    ],
    "location_id": "LOC-CBE-131",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Kadampadi",
    "display_name": "Kadampadi",
    "location_type": "Village",
    "revenue_division": "Coimbatore South",
    "taluk": "Sulur",
    "tamil_name": "கடம்பாடி",
    "latitude": 11.0254,
    "longitude": 77.1142,
    "aliases": [
      "kadambadi"
    ],
    "tanglish_variants": [
      "kadampadi-la",
      "kadambadi-la"
    ],
    "location_id": "LOC-CBE-132",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Otterpalayam",
    "display_name": "Otterpalayam",
    "location_type": "Village",
    "revenue_division": "Coimbatore South",
    "taluk": "Sulur",
    "tamil_name": "ஒட்டர் பாளையம்",
    "latitude": 11.0112,
    "longitude": 77.1524,
    "aliases": [
      "otter palayam",
      "odderpalayam sulur"
    ],
    "tanglish_variants": [
      "otterpalayam-la"
    ],
    "location_id": "LOC-CBE-133",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Kallengal",
    "display_name": "Kallengal",
    "location_type": "Village",
    "revenue_division": "Coimbatore South",
    "taluk": "Sulur",
    "tamil_name": "கல்லெங்கல்",
    "latitude": 10.9754,
    "longitude": 77.1432,
    "aliases": [
      "kalangal",
      "kallangal"
    ],
    "tanglish_variants": [
      "kallengal-la",
      "kalangal-la"
    ],
    "location_id": "LOC-CBE-134",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Pachapalayam (Sulur)",
    "display_name": "Pachapalayam (Sulur Taluk)",
    "location_type": "Village",
    "revenue_division": "Coimbatore South",
    "taluk": "Sulur",
    "tamil_name": "பச்சபாளையம்",
    "latitude": 10.9621,
    "longitude": 77.1245,
    "aliases": [
      "pacha palayam sulur",
      "pachapalayam sulur",
      "pachapalayam",
      "pacha palayam"
    ],
    "tanglish_variants": [
      "pachapalayam-la"
    ],
    "location_id": "LOC-CBE-135",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Bogampatty",
    "display_name": "Bogampatty",
    "location_type": "Village",
    "revenue_division": "Coimbatore South",
    "taluk": "Sulur",
    "tamil_name": "போகம்பட்டி",
    "latitude": 10.9512,
    "longitude": 77.1624,
    "aliases": [
      "bogampatti",
      "bogam patti"
    ],
    "tanglish_variants": [
      "bogampatty-la",
      "bogampatti-la"
    ],
    "location_id": "LOC-CBE-136",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Idayapalayam",
    "display_name": "Idayapalayam (Sulur)",
    "location_type": "Village",
    "revenue_division": "Coimbatore South",
    "taluk": "Sulur",
    "tamil_name": "இடையர்பாளையம் (சூலூர்)",
    "latitude": 10.9421,
    "longitude": 77.1824,
    "aliases": [
      "idaiyapalayam",
      "edaiyarpalayam sulur"
    ],
    "tanglish_variants": [
      "idayapalayam-la"
    ],
    "location_id": "LOC-CBE-137",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Selakkarichel",
    "display_name": "Selakkarichel",
    "location_type": "Village",
    "revenue_division": "Coimbatore South",
    "taluk": "Sulur",
    "tamil_name": "செலக்கரிச்சல்",
    "latitude": 10.9312,
    "longitude": 77.1942,
    "aliases": [
      "selakarichal",
      "selakarichel"
    ],
    "tanglish_variants": [
      "selakkarichel-la"
    ],
    "location_id": "LOC-CBE-138",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Varapatty",
    "display_name": "Varapatty",
    "location_type": "Village",
    "revenue_division": "Coimbatore South",
    "taluk": "Sulur",
    "tamil_name": "வாரப்பட்டி",
    "latitude": 10.9124,
    "longitude": 77.1724,
    "aliases": [
      "varapatti",
      "vara patti"
    ],
    "tanglish_variants": [
      "varapatty-la",
      "varapatti-la"
    ],
    "location_id": "LOC-CBE-139",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Vadambacheri",
    "display_name": "Vadambacheri",
    "location_type": "Village",
    "revenue_division": "Coimbatore South",
    "taluk": "Sulur",
    "tamil_name": "வாதம்பச்சேரி",
    "latitude": 10.9012,
    "longitude": 77.1584,
    "aliases": [
      "vadambacherry",
      "vadambaseri"
    ],
    "tanglish_variants": [
      "vadambacheri-la"
    ],
    "location_id": "LOC-CBE-140",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Vadavedampatty",
    "display_name": "Vadavedampatty",
    "location_type": "Village",
    "revenue_division": "Coimbatore South",
    "taluk": "Sulur",
    "tamil_name": "வடவேடம்பட்டி",
    "latitude": 10.8842,
    "longitude": 77.1742,
    "aliases": [
      "vadavedampatti",
      "vadavedam patti"
    ],
    "tanglish_variants": [
      "vadavedampatty-la",
      "vadavedampatti-la"
    ],
    "location_id": "LOC-CBE-141",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Kumarapalayam (Sulur)",
    "display_name": "Kumarapalayam (Sulur Taluk)",
    "location_type": "Village",
    "revenue_division": "Coimbatore South",
    "taluk": "Sulur",
    "tamil_name": "குமாரபாளையம் (சூலூர்)",
    "latitude": 10.8712,
    "longitude": 77.1924,
    "aliases": [
      "kumarapalayam sulur",
      "kumara palayam sulur",
      "kumarapalayam",
      "kumara palayam"
    ],
    "tanglish_variants": [
      "kumarapalayam-la"
    ],
    "location_id": "LOC-CBE-142",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Malaipalayam",
    "display_name": "Malaipalayam",
    "location_type": "Village",
    "revenue_division": "Coimbatore South",
    "taluk": "Sulur",
    "tamil_name": "மலைப்பாளையம்",
    "latitude": 10.8624,
    "longitude": 77.1812,
    "aliases": [
      "malai palayam"
    ],
    "tanglish_variants": [
      "malaipalayam-la"
    ],
    "location_id": "LOC-CBE-143",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "S. Ayyampalayam",
    "display_name": "S. Ayyampalayam",
    "location_type": "Village",
    "revenue_division": "Coimbatore South",
    "taluk": "Sulur",
    "tamil_name": "எஸ். அய்யம்பாளையம்",
    "latitude": 10.8512,
    "longitude": 77.1691,
    "aliases": [
      "s ayyampalayam",
      "ayyampalayam sulur",
      "s.ayyampalayam"
    ],
    "tanglish_variants": [
      "s ayyampalayam-la"
    ],
    "location_id": "LOC-CBE-144",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Kammalapatty",
    "display_name": "Kammalapatty",
    "location_type": "Village",
    "revenue_division": "Coimbatore South",
    "taluk": "Sulur",
    "tamil_name": "கம்மாலப்பட்டி",
    "latitude": 10.8412,
    "longitude": 77.1542,
    "aliases": [
      "kammalapatti",
      "kammala patti"
    ],
    "tanglish_variants": [
      "kammalapatty-la",
      "kammalapatti-la"
    ],
    "location_id": "LOC-CBE-145",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Jallipatty",
    "display_name": "Jallipatty",
    "location_type": "Village",
    "revenue_division": "Coimbatore South",
    "taluk": "Sulur",
    "tamil_name": "ஜல்லிபட்டி",
    "latitude": 10.8321,
    "longitude": 77.1482,
    "aliases": [
      "jallipatti",
      "jalli patti"
    ],
    "tanglish_variants": [
      "jallipatty-la",
      "jallipatti-la"
    ],
    "location_id": "LOC-CBE-146",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Thalakari",
    "display_name": "Thalakari",
    "location_type": "Village",
    "revenue_division": "Coimbatore South",
    "taluk": "Sulur",
    "tamil_name": "தலக்கரை",
    "latitude": 10.8124,
    "longitude": 77.1352,
    "aliases": [
      "thalakarai"
    ],
    "tanglish_variants": [
      "thalakari-la",
      "thalakarai-la"
    ],
    "location_id": "LOC-CBE-147",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "J. Krisnapuram",
    "display_name": "J. Krishnapuram",
    "location_type": "Village",
    "revenue_division": "Coimbatore South",
    "taluk": "Sulur",
    "tamil_name": "ஜே. கிருஷ்ணாபுரம்",
    "latitude": 10.8012,
    "longitude": 77.1242,
    "aliases": [
      "j krishnapuram",
      "j.krishnapuram",
      "j krisnapuram"
    ],
    "tanglish_variants": [
      "j krishnapuram-la"
    ],
    "location_id": "LOC-CBE-148",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Irumburai",
    "display_name": "Irumburai",
    "location_type": "Village",
    "revenue_division": "Coimbatore North",
    "taluk": "Mettupalayam",
    "tamil_name": "இரும்பறை",
    "latitude": 11.2642,
    "longitude": 77.0124,
    "aliases": [
      "irumborai"
    ],
    "tanglish_variants": [
      "irumburai-la"
    ],
    "location_id": "LOC-CBE-149",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Chinnakallipatty",
    "display_name": "Chinnakallipatty",
    "location_type": "Village",
    "revenue_division": "Coimbatore North",
    "taluk": "Mettupalayam",
    "tamil_name": "சின்னக்கள்ளிப்பட்டி",
    "latitude": 11.2782,
    "longitude": 77.0342,
    "aliases": [
      "chinnakallipatti",
      "chinna kallipatti"
    ],
    "tanglish_variants": [
      "chinnakallipatty-la",
      "chinnakallipatti-la"
    ],
    "location_id": "LOC-CBE-150",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Mooduthurai",
    "display_name": "Mooduthurai",
    "location_type": "Village",
    "revenue_division": "Coimbatore North",
    "taluk": "Mettupalayam",
    "tamil_name": "மூடுதுறை",
    "latitude": 11.2912,
    "longitude": 76.9942,
    "aliases": [
      "muduthurai"
    ],
    "tanglish_variants": [
      "mooduthurai-la"
    ],
    "location_id": "LOC-CBE-151",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Iluppanatham",
    "display_name": "Iluppanatham",
    "location_type": "Village",
    "revenue_division": "Coimbatore North",
    "taluk": "Mettupalayam",
    "tamil_name": "இலுப்பநத்தம்",
    "latitude": 11.3124,
    "longitude": 76.9812,
    "aliases": [
      "iluppanatham village"
    ],
    "tanglish_variants": [
      "iluppanatham-la"
    ],
    "location_id": "LOC-CBE-152",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Kemmarampalayam",
    "display_name": "Kemmarampalayam",
    "location_type": "Village",
    "revenue_division": "Coimbatore North",
    "taluk": "Mettupalayam",
    "tamil_name": "கெம்மரம்பாளையம்",
    "latitude": 11.2842,
    "longitude": 76.9542,
    "aliases": [
      "kemmaram palayam"
    ],
    "tanglish_variants": [
      "kemmarampalayam-la"
    ],
    "location_id": "LOC-CBE-153",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Tholampalayam",
    "display_name": "Tholampalayam",
    "location_type": "Village",
    "revenue_division": "Coimbatore North",
    "taluk": "Mettupalayam",
    "tamil_name": "தோலம்பாளையம்",
    "latitude": 11.2512,
    "longitude": 76.9124,
    "aliases": [
      "tholam palayam"
    ],
    "tanglish_variants": [
      "tholampalayam-la"
    ],
    "location_id": "LOC-CBE-154",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Kalampalayam",
    "display_name": "Kalampalayam (Mettupalayam)",
    "location_type": "Village",
    "revenue_division": "Coimbatore North",
    "taluk": "Mettupalayam",
    "tamil_name": "காளம்பாளையம்",
    "latitude": 11.2342,
    "longitude": 76.9242,
    "aliases": [
      "kalam palayam mtp"
    ],
    "tanglish_variants": [
      "kalampalayam-la"
    ],
    "location_id": "LOC-CBE-155",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Marudur",
    "display_name": "Marudur",
    "location_type": "Village",
    "revenue_division": "Coimbatore North",
    "taluk": "Mettupalayam",
    "tamil_name": "மருதூர்",
    "latitude": 11.2712,
    "longitude": 76.9452,
    "aliases": [
      "marudhur mtp"
    ],
    "tanglish_variants": [
      "marudur-la"
    ],
    "location_id": "LOC-CBE-156",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Bellathi",
    "display_name": "Bellathi",
    "location_type": "Village",
    "revenue_division": "Coimbatore North",
    "taluk": "Mettupalayam",
    "tamil_name": "பெள்ளாதி",
    "latitude": 11.2942,
    "longitude": 76.9284,
    "aliases": [
      "bellathy"
    ],
    "tanglish_variants": [
      "bellathi-la"
    ],
    "location_id": "LOC-CBE-157",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Sikkarampalayam",
    "display_name": "Sikkarampalayam",
    "location_type": "Village",
    "revenue_division": "Coimbatore North",
    "taluk": "Mettupalayam",
    "tamil_name": "சிக்காரம்பாளையம்",
    "latitude": 11.3112,
    "longitude": 76.9642,
    "aliases": [
      "sikkaram palayam"
    ],
    "tanglish_variants": [
      "sikkarampalayam-la"
    ],
    "location_id": "LOC-CBE-158",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Kuppepalayam",
    "display_name": "Kuppepalayam",
    "location_type": "Village",
    "revenue_division": "Coimbatore North",
    "taluk": "Annur",
    "tamil_name": "குப்பம்பாளையம்",
    "latitude": 11.2142,
    "longitude": 77.0942,
    "aliases": [
      "kuppepalayam annur",
      "kuppe palayam"
    ],
    "tanglish_variants": [
      "kuppepalayam-la"
    ],
    "location_id": "LOC-CBE-159",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Kunnathur",
    "display_name": "Kunnathur (Annur)",
    "location_type": "Village",
    "revenue_division": "Coimbatore North",
    "taluk": "Annur",
    "tamil_name": "குன்னத்தூர்",
    "latitude": 11.2312,
    "longitude": 77.1124,
    "aliases": [
      "kunnathur annur"
    ],
    "tanglish_variants": [
      "kunnathur-la"
    ],
    "location_id": "LOC-CBE-160",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Masagoundenpalayam",
    "display_name": "Masagoundenpalayam",
    "location_type": "Village",
    "revenue_division": "Coimbatore North",
    "taluk": "Annur",
    "tamil_name": "மாசகவுண்டன்பாளையம்",
    "latitude": 11.2452,
    "longitude": 77.1284,
    "aliases": [
      "masagoundanpalayam",
      "masa gounden palayam"
    ],
    "tanglish_variants": [
      "masagoundenpalayam-la"
    ],
    "location_id": "LOC-CBE-161",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Naranapuram",
    "display_name": "Naranapuram",
    "location_type": "Village",
    "revenue_division": "Coimbatore North",
    "taluk": "Annur",
    "tamil_name": "நாரணாபுரம்",
    "latitude": 11.2582,
    "longitude": 77.1452,
    "aliases": [
      "naranapuram annur"
    ],
    "tanglish_variants": [
      "naranapuram-la"
    ],
    "location_id": "LOC-CBE-162",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Karegoundenpalayam",
    "display_name": "Karegoundenpalayam",
    "location_type": "Village",
    "revenue_division": "Coimbatore North",
    "taluk": "Annur",
    "tamil_name": "காரேகவுண்டன்பாளையம்",
    "latitude": 11.2712,
    "longitude": 77.1584,
    "aliases": [
      "karegoundanpalayam",
      "kare gounden palayam"
    ],
    "tanglish_variants": [
      "karegoundenpalayam-la"
    ],
    "location_id": "LOC-CBE-163",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Bogalur",
    "display_name": "Bogalur",
    "location_type": "Village",
    "revenue_division": "Coimbatore North",
    "taluk": "Annur",
    "tamil_name": "போகளூர்",
    "latitude": 11.2412,
    "longitude": 77.0542,
    "aliases": [
      "pogalur"
    ],
    "tanglish_variants": [
      "bogalur-la"
    ],
    "location_id": "LOC-CBE-164",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Odderpalayam",
    "display_name": "Odderpalayam (Annur)",
    "location_type": "Village",
    "revenue_division": "Coimbatore North",
    "taluk": "Annur",
    "tamil_name": "ஒட்டர் பாளையம் (அன்னூர்)",
    "latitude": 11.2342,
    "longitude": 77.0712,
    "aliases": [
      "odderpalayam annur",
      "odder palayam"
    ],
    "tanglish_variants": [
      "odderpalayam-la"
    ],
    "location_id": "LOC-CBE-165",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Kuppanur",
    "display_name": "Kuppanur",
    "location_type": "Village",
    "revenue_division": "Coimbatore North",
    "taluk": "Annur",
    "tamil_name": "குப்பனூர்",
    "latitude": 11.2212,
    "longitude": 77.0421,
    "aliases": [
      "kuppanur annur"
    ],
    "tanglish_variants": [
      "kuppanur-la"
    ],
    "location_id": "LOC-CBE-166",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Akkari Sengapally",
    "display_name": "Akkari Sengapally",
    "location_type": "Village",
    "revenue_division": "Coimbatore North",
    "taluk": "Annur",
    "tamil_name": "அக்கரை செங்கப்பள்ளி",
    "latitude": 11.2612,
    "longitude": 77.0842,
    "aliases": [
      "akkarai sengapalli",
      "akkari sengapalli"
    ],
    "tanglish_variants": [
      "akkari sengapally-la"
    ],
    "location_id": "LOC-CBE-167",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Kanuvakarai",
    "display_name": "Kanuvakarai",
    "location_type": "Village",
    "revenue_division": "Coimbatore North",
    "taluk": "Annur",
    "tamil_name": "கணுவக்கரை",
    "latitude": 11.2482,
    "longitude": 77.0954,
    "aliases": [
      "kanuvakkarai"
    ],
    "tanglish_variants": [
      "kanuvakarai-la"
    ],
    "location_id": "LOC-CBE-168",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Aambothi",
    "display_name": "Aambothi",
    "location_type": "Village",
    "revenue_division": "Coimbatore North",
    "taluk": "Annur",
    "tamil_name": "ஆம்போதி",
    "latitude": 11.2584,
    "longitude": 77.1142,
    "aliases": [
      "ambothi"
    ],
    "tanglish_variants": [
      "aambothi-la"
    ],
    "location_id": "LOC-CBE-169",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Vadakkalur",
    "display_name": "Vadakkalur",
    "location_type": "Village",
    "revenue_division": "Coimbatore North",
    "taluk": "Annur",
    "tamil_name": "வடfactorக்கலூர்",
    "latitude": 11.2742,
    "longitude": 77.1284,
    "aliases": [
      "vadakalur"
    ],
    "tanglish_variants": [
      "vadakkalur-la"
    ],
    "location_id": "LOC-CBE-170",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Annur Mettupalayam",
    "display_name": "Annur Mettupalayam Road",
    "location_type": "Locality",
    "revenue_division": "Coimbatore North",
    "taluk": "Annur",
    "tamil_name": "அன்னூர் மேட்டுப்பாளையம்",
    "latitude": 11.2654,
    "longitude": 77.0421,
    "aliases": [
      "annur mtp road",
      "annur mettupalayam pirivu"
    ],
    "tanglish_variants": [
      "annur mettupalayam-la"
    ],
    "location_id": "LOC-CBE-171",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Pasoor",
    "display_name": "Pasoor",
    "location_type": "Village",
    "revenue_division": "Coimbatore North",
    "taluk": "Annur",
    "tamil_name": "பாசூர்",
    "latitude": 11.2842,
    "longitude": 77.0612,
    "aliases": [
      "pasur annur"
    ],
    "tanglish_variants": [
      "pasoor-la"
    ],
    "location_id": "LOC-CBE-172",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Allapalayam",
    "display_name": "Allapalayam",
    "location_type": "Village",
    "revenue_division": "Coimbatore North",
    "taluk": "Annur",
    "tamil_name": "அல்லப்பாளையம்",
    "latitude": 11.2942,
    "longitude": 77.0812,
    "aliases": [
      "allapalayam annur"
    ],
    "tanglish_variants": [
      "allapalayam-la"
    ],
    "location_id": "LOC-CBE-173",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Kanjampally",
    "display_name": "Kanjampally",
    "location_type": "Village",
    "revenue_division": "Coimbatore North",
    "taluk": "Annur",
    "tamil_name": "கஞ்சம்பள்ளி",
    "latitude": 11.3042,
    "longitude": 77.0954,
    "aliases": [
      "kanjampalli"
    ],
    "tanglish_variants": [
      "kanjampally-la"
    ],
    "location_id": "LOC-CBE-174",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Agraharasamakulam",
    "display_name": "Agraharasamakulam",
    "location_type": "Village",
    "revenue_division": "Coimbatore North",
    "taluk": "Annur",
    "tamil_name": "அக்ரஹாரசாமக்குளம்",
    "latitude": 11.1342,
    "longitude": 77.0212,
    "aliases": [
      "agrahara samakulam"
    ],
    "tanglish_variants": [
      "agraharasamakulam-la"
    ],
    "location_id": "LOC-CBE-175",
    "geocoding_status": "VERIFIED"
  },
  {
    "canonical_name": "Kondayampalayam",
    "display_name": "Kondayampalayam",
    "location_type": "Village",
    "revenue_division": "Coimbatore North",
    "taluk": "Annur",
    "tamil_name": "கொண்டையம்பாளையம்",
    "latitude": 11.1214,
    "longitude": 77.0112,
    "aliases": [
      "kondayam palayam"
    ],
    "tanglish_variants": [
      "kondayampalayam-la"
    ],
    "location_id": "LOC-CBE-176",
    "geocoding_status": "VERIFIED"
  }
];

module.exports = { COIMBATORE_LOCATIONS };
