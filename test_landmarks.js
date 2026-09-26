const locationService = require('./server/services/locationService');
const landmarkService = require('./server/services/landmarkService');
const { processConversationTurn, clearSessionState } = require('./server/ai/conversationEngine');

async function runLandmarkTests() {
  console.log('=== VOXENTRA COIMBATORE LANDMARK INTELLIGENCE TEST SUITE ===\n');

  let passedCount = 0;
  let totalCount = 0;

  function assert(condition, message) {
    totalCount++;
    if (condition) {
      console.log(`[PASS] ${message}`);
      passedCount++;
    } else {
      console.error(`[FAIL] ${message}`);
    }
  }

  // --- PART 1: MASTER LANDMARK DATABASE VERIFICATION ---
  console.log('--- PART 1: Master Landmark Database ---');
  const allLandmarks = await landmarkService.getAllLandmarks();
  assert(allLandmarks.length >= 70, `Master database contains ${allLandmarks.length} Coimbatore landmarks (expected >= 70)`);

  const prozone = landmarkService.findLandmark("Prozone Mall");
  assert(prozone && prozone.landmark_name === 'Prozone Mall', `Prozone Mall found in master dataset`);
  assert(prozone && prozone.area === 'Saravanampatti', `Prozone Mall mapped to Saravanampatti`);
  assert(prozone && prozone.taluk === 'Coimbatore North', `Prozone Mall mapped to Coimbatore North taluk`);

  const cbeJn = landmarkService.findLandmark("Coimbatore Railway Station");
  assert(cbeJn && cbeJn.landmark_name === 'Coimbatore Junction Railway Station', `Coimbatore Railway Station alias resolves to Coimbatore Junction`);

  // --- PART 2: THE 10 SPECIFIED USER PROMPT TEST CASES ---
  console.log('\n--- PART 2: The 10 User Prompt Test Cases ---');

  // Test 1: "Saravanampatti-la Prozone Mall pakkathula road damage."
  console.log('\n[Case 1] "Saravanampatti-la Prozone Mall pakkathula road damage."');
  const c1 = locationService.resolveLocation("Saravanampatti-la Prozone Mall pakkathula road damage.", "TANGLISH");
  assert(c1.matched === true, 'Case 1 matched is true');
  assert(c1.district === 'Coimbatore', `Case 1 district is Coimbatore`);
  assert(c1.canonicalLocationName === 'Saravanampatti', `Case 1 area is Saravanampatti (got: ${c1.canonicalLocationName})`);
  assert(c1.landmark === 'Prozone Mall', `Case 1 landmark is Prozone Mall (got: ${c1.landmark})`);
  assert(c1.locationPrecision === 'NEAR_LANDMARK', `Case 1 precision is NEAR_LANDMARK (got: ${c1.locationPrecision})`);
  assert(c1.latitude !== null && c1.longitude !== null, `Case 1 coordinates resolved: ${c1.latitude}, ${c1.longitude}`);

  // Test 2: "Prozone mall near road is damaged."
  console.log('\n[Case 2] "Prozone mall near road is damaged."');
  const c2 = locationService.resolveLocation("Prozone mall near road is damaged.", "ENGLISH");
  assert(c2.matched === true, 'Case 2 matched is true');
  assert(c2.canonicalLocationName === 'Saravanampatti', `Case 2 area inferred as Saravanampatti (got: ${c2.canonicalLocationName})`);
  assert(c2.landmark === 'Prozone Mall', `Case 2 landmark is Prozone Mall (got: ${c2.landmark})`);
  assert(c2.locationPrecision === 'STREET' || c2.locationPrecision === 'NEAR_LANDMARK', `Case 2 precision is ${c2.locationPrecision}`);

  // Test 3: "ப்ரோசோன் மால் அருகில் சாலை சேதமடைந்துள்ளது."
  console.log('\n[Case 3] "ப்ரோசோன் மால் அருகில் சாலை சேதமடைந்துள்ளது."');
  const c3 = locationService.resolveLocation("ப்ரோசோன் மால் அருகில் சாலை சேதமடைந்துள்ளது.", "TAMIL");
  assert(c3.matched === true, 'Case 3 matched is true');
  assert(c3.canonicalLocationName === 'Saravanampatti', `Case 3 area is Saravanampatti (got: ${c3.canonicalLocationName})`);
  assert(c3.landmark === 'Prozone Mall', `Case 3 landmark is Prozone Mall (got: ${c3.landmark})`);
  assert(c3.locationPrecision === 'NEAR_LANDMARK' || c3.locationPrecision === 'STREET', `Case 3 precision is ${c3.locationPrecision}`);

  // Test 4: "Gandhipuram bus stand pakkathula water leakage."
  console.log('\n[Case 4] "Gandhipuram bus stand pakkathula water leakage."');
  const c4 = locationService.resolveLocation("Gandhipuram bus stand pakkathula water leakage.", "TANGLISH");
  assert(c4.matched === true, 'Case 4 matched is true');
  assert(c4.canonicalLocationName === 'Gandhipuram', `Case 4 area is Gandhipuram (got: ${c4.canonicalLocationName})`);
  assert(c4.landmark === 'Gandhipuram Bus Stand', `Case 4 landmark is Gandhipuram Bus Stand (got: ${c4.landmark})`);
  assert(c4.locationPrecision === 'NEAR_LANDMARK', `Case 4 precision is NEAR_LANDMARK (got: ${c4.locationPrecision})`);

  // Test 5: "Coimbatore railway station near garbage problem."
  console.log('\n[Case 5] "Coimbatore railway station near garbage problem."');
  const c5 = locationService.resolveLocation("Coimbatore railway station near garbage problem.", "ENGLISH");
  assert(c5.matched === true, 'Case 5 matched is true');
  assert(c5.canonicalLocationName === 'Town Hall', `Case 5 area is Town Hall / Central (got: ${c5.canonicalLocationName})`);
  assert(c5.landmark === 'Coimbatore Junction Railway Station', `Case 5 landmark is Coimbatore Junction Railway Station (got: ${c5.landmark})`);
  assert(c5.locationPrecision === 'NEAR_LANDMARK', `Case 5 precision is NEAR_LANDMARK (got: ${c5.locationPrecision})`);

  // Test 6: "Peelamedu TIDEL Park pakkam road problem."
  console.log('\n[Case 6] "Peelamedu TIDEL Park pakkam road problem."');
  const c6 = locationService.resolveLocation("Peelamedu TIDEL Park pakkam road problem.", "TANGLISH");
  assert(c6.matched === true, 'Case 6 matched is true');
  assert(c6.canonicalLocationName === 'Peelamedu', `Case 6 area is Peelamedu (got: ${c6.canonicalLocationName})`);
  assert(c6.landmark === 'TIDEL Park', `Case 6 landmark is TIDEL Park (got: ${c6.landmark})`);
  assert(c6.locationPrecision === 'STREET' || c6.locationPrecision === 'NEAR_LANDMARK', `Case 6 precision is ${c6.locationPrecision}`);

  // Test 7: "Marudhamalai temple pogura road-la problem."
  console.log('\n[Case 7] "Marudhamalai temple pogura road-la problem."');
  const c7 = locationService.resolveLocation("Marudhamalai temple pogura road-la problem.", "TANGLISH");
  assert(c7.matched === true, 'Case 7 matched is true');
  assert(c7.landmark === 'Marudhamalai Murugan Temple', `Case 7 landmark is Marudhamalai Murugan Temple (got: ${c7.landmark})`);
  assert(c7.street !== null || c7.locationPrecision === 'STREET', `Case 7 street or road detected`);

  // Test 8: "Ukkadam bus stand pakkathula water leakage."
  console.log('\n[Case 8] "Ukkadam bus stand pakkathula water leakage."');
  const c8 = locationService.resolveLocation("Ukkadam bus stand pakkathula water leakage.", "TANGLISH");
  assert(c8.matched === true, 'Case 8 matched is true');
  assert(c8.canonicalLocationName === 'Ukkadam', `Case 8 area is Ukkadam (got: ${c8.canonicalLocationName})`);
  assert(c8.landmark === 'Ukkadam Bus Stand', `Case 8 landmark is Ukkadam Bus Stand (got: ${c8.landmark})`);
  assert(c8.locationPrecision === 'NEAR_LANDMARK', `Case 8 precision is NEAR_LANDMARK (got: ${c8.locationPrecision})`);

  // Test 9: "RS Puram DB Road-la pothole irukku."
  console.log('\n[Case 9] "RS Puram DB Road-la pothole irukku."');
  const c9 = locationService.resolveLocation("RS Puram DB Road-la pothole irukku.", "TANGLISH");
  assert(c9.matched === true, 'Case 9 matched is true');
  assert(c9.canonicalLocationName === 'RS Puram', `Case 9 area is RS Puram (got: ${c9.canonicalLocationName})`);
  assert(c9.street === 'DB Road', `Case 9 street is DB Road (got: ${c9.street})`);
  assert(c9.locationPrecision === 'STREET', `Case 9 precision is STREET (got: ${c9.locationPrecision})`);

  // Test 10: "Sarava patty Prozon mall pakathula."
  console.log('\n[Case 10] "Sarava patty Prozon mall pakathula."');
  const c10 = locationService.resolveLocation("Sarava patty Prozon mall pakathula.", "TANGLISH");
  assert(c10.matched === true, 'Case 10 matched is true');
  assert(c10.canonicalLocationName === 'Saravanampatti', `Case 10 fuzzy area matches Saravanampatti (got: ${c10.canonicalLocationName})`);
  assert(c10.landmark === 'Prozone Mall', `Case 10 fuzzy landmark matches Prozone Mall (got: ${c10.landmark})`);
  assert(c10.locationPrecision === 'NEAR_LANDMARK', `Case 10 precision is NEAR_LANDMARK (got: ${c10.locationPrecision})`);

  // --- PART 3: AMBIGUITY HANDLING ---
  console.log('\n--- PART 3: Ambiguity Handling ---');
  const ambig1 = locationService.resolveLocation("Railway station pakkathula problem.", "TANGLISH");
  assert(ambig1.clarificationRequired === true, `Generic railway station triggers clarification`);
  assert(ambig1.clarificationType === 'AMBIGUOUS_LANDMARK', `Clarification type is AMBIGUOUS_LANDMARK`);
  assert(ambig1.clarificationPrompt.includes("railway station"), `Clarification asks which railway station: "${ambig1.clarificationPrompt}"`);

  const ambig2 = locationService.resolveLocation("Bus stand pakkathula water leakage.", "ENGLISH");
  assert(ambig2.clarificationRequired === true, `Generic bus stand triggers clarification`);
  assert(ambig2.clarificationPrompt.includes("bus stand"), `Clarification asks which bus stand: "${ambig2.clarificationPrompt}"`);

  // When citizen clarifies
  const clarified = locationService.resolveLocation("Coimbatore Junction pakkathula.", "TANGLISH");
  assert(clarified.matched === true, `Clarified Coimbatore Junction resolves immediately`);
  assert(clarified.landmark === 'Coimbatore Junction Railway Station', `Landmark is Coimbatore Junction Railway Station`);

  // --- PART 4: CONVERSATION TURN BEHAVIOR WITH LANDMARK ---
  console.log('\n--- PART 4: Conversational Follow-up with Landmark ---');
  const sId = 'test-landmark-' + Date.now();
  clearSessionState(sId);

  // Turn 1: Citizen says landmark without street
  const turn1 = await processConversationTurn(sId, "Saravanampatti-la Prozone Mall pakkathula road damage irukku.");
  assert(turn1.slots.area === 'Saravanampatti', `Turn 1 area extracted: ${turn1.slots.area}`);
  assert(turn1.slots.landmark === 'Prozone Mall', `Turn 1 landmark extracted: ${turn1.slots.landmark}`);
  assert(turn1.slots.category === 'Damaged Road', `Turn 1 category extracted: ${turn1.slots.category}`);
  assert(turn1.slots.locationPrecision === 'NEAR_LANDMARK', `Turn 1 precision is NEAR_LANDMARK`);
  assert(turn1.reply.includes("Prozone Mall pakkathula entha road or street-la problem irukku?"), `AI asks specifically which road near Prozone Mall: "${turn1.reply}"`);

  // Turn 2: Citizen specifies street
  const turn2 = await processConversationTurn(sId, "Sathy Road near Reliance Trends.");
  assert(turn2.slots.street === 'Sathy Road', `Turn 2 street extracted: ${turn2.slots.street}`);
  assert(turn2.slots.locationPrecision === 'STREET', `Turn 2 precision updated to STREET`);

  console.log(`\n=== RESULTS: ${passedCount} / ${totalCount} PASSED ===`);
  if (passedCount === totalCount) {
    console.log('ALL COIMBATORE LANDMARK TESTS PASSED PERFECTLY!');
  } else {
    process.exit(1);
  }
}

runLandmarkTests().catch(err => {
  console.error(err);
  process.exit(1);
});
