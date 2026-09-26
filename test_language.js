const { detectLanguage, LANGUAGES } = require('./server/ai/languageDetector');
const { normalizeText } = require('./server/ai/normalizer');
const { processConversationTurn, clearSessionState } = require('./server/ai/conversationEngine');

async function runTests() {
  console.log('=== VOXENTRA LANGUAGE HANDLING VERIFICATION TEST ===\n');

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

  // --- TEST 1: Language Detection ---
  console.log('--- TEST 1: Language Detection ---');
  const d1 = detectLanguage("There is a damaged road in Saravanampatti.");
  assert(d1.language === 'ENGLISH', `English sentence detected as ENGLISH (got: ${d1.language})`);

  const d2 = detectLanguage("There is a water leakage near Gandhipuram.");
  assert(d2.language === 'ENGLISH', `English water leakage detected as ENGLISH (got: ${d2.language})`);

  const d3 = detectLanguage("காந்திபுரம் அருகில் தண்ணீர் கசிவு உள்ளது.");
  assert(d3.language === 'TAMIL', `Tamil script detected as TAMIL (got: ${d3.language})`);

  const d4 = detectLanguage("சரவணம்பட்டியில் சாலை சேதமடைந்துள்ளது.");
  assert(d4.language === 'TAMIL', `Tamil road damage detected as TAMIL (got: ${d4.language})`);

  const d5 = detectLanguage("Saravanampatti-la road damage aayirukku.");
  assert(d5.language === 'TANGLISH', `Tanglish road damage detected as TANGLISH (got: ${d5.language})`);

  const d6 = detectLanguage("Gandhipuram pakkathula water leakage irukku.");
  assert(d6.language === 'TANGLISH', `Tanglish water leakage detected as TANGLISH (got: ${d6.language})`);

  // --- TEST 2: Normalization Preserves Language ---
  console.log('\n--- TEST 2: Normalization Preserves Language ---');
  const n1 = normalizeText("There is a roaad damage in Sarava patty.", "ENGLISH");
  assert(n1.normalized === "There is road damage in Saravanampatti.", `English normalized stays English: "${n1.normalized}"`);

  const n2 = normalizeText("Sarava patty la road damage irukku", "TANGLISH");
  assert(n2.normalized === "Saravanampatti-la road damage irukku", `Tanglish normalized stays Tanglish: "${n2.normalized}"`);

  const n3 = normalizeText("சரவணம்பட்டியில் சாலை சேதமடைந்துள்ளது.", "TAMIL");
  assert(n3.normalized === "சரவணம்பட்டியில் சாலை சேதமடைந்துள்ளது.", `Tamil normalized stays Tamil: "${n3.normalized}"`);

  // --- TEST 3: English Multi-turn Conversation & AI Response ---
  console.log('\n--- TEST 3: English Conversation Flow ---');
  const sEnglish = 'test-en-' + Date.now();
  clearSessionState(sEnglish);

  // Turn 1
  const enTurn1 = await processConversationTurn(sEnglish, "There is a damaged road in Saravanampatti.");
  assert(enTurn1.detectedLanguage === 'ENGLISH', `Turn 1 detectedLanguage is ENGLISH`);
  assert(enTurn1.currentConversationLanguage === 'ENGLISH', `Turn 1 currentConversationLanguage is ENGLISH`);
  assert(enTurn1.responseLanguage === 'ENGLISH', `Turn 1 responseLanguage is ENGLISH`);
  assert(enTurn1.reply.includes("Which street or road in Saravanampatti is affected?"), `English AI question asks which street/road: "${enTurn1.reply}"`);
  assert(!/[\u0B80-\u0BFF]/.test(enTurn1.reply), `English reply contains NO Tamil characters`);

  // Turn 2
  const enTurn2 = await processConversationTurn(sEnglish, "It is on Sathy Road.");
  assert(enTurn2.currentConversationLanguage === 'ENGLISH', `Turn 2 remains ENGLISH`);
  assert(enTurn2.reply.includes("nearby landmark"), `Turn 2 asks for landmark: "${enTurn2.reply}"`);
  assert(!/[\u0B80-\u0BFF]/.test(enTurn2.reply), `Turn 2 reply contains NO Tamil characters`);

  // Turn 3
  const enTurn3 = await processConversationTurn(sEnglish, "Near Reliance Mall.");
  assert(enTurn3.currentConversationLanguage === 'ENGLISH', `Turn 3 remains ENGLISH`);
  assert(enTurn3.reply.includes("How long has this problem existed?"), `Turn 3 asks for duration: "${enTurn3.reply}"`);

  // Turn 4
  const enTurn4 = await processConversationTurn(sEnglish, "For 3 days, vehicles moving slowly.");
  assert(enTurn4.stage === 'FINAL_CONFIRMATION', `Turn 4 stage is FINAL_CONFIRMATION`);
  assert(enTurn4.currentConversationLanguage === 'ENGLISH', `Turn 4 remains ENGLISH`);
  assert(enTurn4.reply.includes("Let me confirm"), `Turn 4 English confirmation message: "${enTurn4.reply}"`);
  assert(!/[\u0B80-\u0BFF]/.test(enTurn4.reply), `Turn 4 reply contains NO Tamil characters`);

  // Turn 5: Confirm
  const enTurn5 = await processConversationTurn(sEnglish, "Yes, please register.");
  assert(enTurn5.stage === 'REGISTERED', `Turn 5 registered successfully`);
  assert(enTurn5.currentConversationLanguage === 'ENGLISH', `Turn 5 reply is in ENGLISH: "${enTurn5.reply}"`);
  assert(!/[\u0B80-\u0BFF]/.test(enTurn5.reply), `Turn 5 reply contains NO Tamil characters`);
  assert(enTurn5.complaintPayload.detectedLanguage === 'ENGLISH', `Complaint payload detectedLanguage is ENGLISH`);
  assert(enTurn5.complaintPayload.originalTranscript.includes("There is a damaged road in Saravanampatti."), `Complaint originalTranscript preserved in English`);

  // --- TEST 4: Tamil Conversation Flow ---
  console.log('\n--- TEST 4: Tamil Conversation Flow ---');
  const sTamil = 'test-ta-' + Date.now();
  clearSessionState(sTamil);

  const taTurn1 = await processConversationTurn(sTamil, "சரவணம்பட்டியில் சாலை சேதமடைந்துள்ளது.");
  assert(taTurn1.detectedLanguage === 'TAMIL', `Tamil Turn 1 detectedLanguage is TAMIL`);
  assert(taTurn1.currentConversationLanguage === 'TAMIL', `Tamil Turn 1 currentConversationLanguage is TAMIL`);
  assert(taTurn1.responseLanguage === 'TAMIL', `Tamil Turn 1 responseLanguage is TAMIL`);
  assert(taTurn1.reply.includes("சரவணம்பட்டியில் எந்த தெரு அல்லது சாலை பாதிக்கப்பட்டுள்ளது?"), `Tamil AI question is in Tamil: "${taTurn1.reply}"`);
  assert(/[\u0B80-\u0BFF]/.test(taTurn1.reply), `Tamil reply contains Tamil characters`);

  // --- TEST 5: Tanglish Conversation Flow ---
  console.log('\n--- TEST 5: Tanglish Conversation Flow ---');
  const sTanglish = 'test-tang-' + Date.now();
  clearSessionState(sTanglish);

  const tangTurn1 = await processConversationTurn(sTanglish, "Saravanampatti-la road damage aayirukku.");
  assert(tangTurn1.detectedLanguage === 'TANGLISH', `Tanglish Turn 1 detectedLanguage is TANGLISH`);
  assert(tangTurn1.currentConversationLanguage === 'TANGLISH', `Tanglish Turn 1 currentConversationLanguage is TANGLISH`);
  assert(tangTurn1.responseLanguage === 'TANGLISH', `Tanglish Turn 1 responseLanguage is TANGLISH`);
  assert(tangTurn1.reply.includes("Saravanampatti-la entha street illa road damage aayirukku?"), `Tanglish AI question is in Tanglish: "${tangTurn1.reply}"`);

  // --- TEST 6: Language Switching Mid-Conversation ---
  console.log('\n--- TEST 6: Dynamic Language Switching Mid-Conversation ---');
  const sSwitch = 'test-switch-' + Date.now();
  clearSessionState(sSwitch);

  // Turn 1 in Tanglish
  const swTurn1 = await processConversationTurn(sSwitch, "Saravanampatti-la road damage aayirukku.");
  assert(swTurn1.currentConversationLanguage === 'TANGLISH', `Initial session language is TANGLISH`);

  // Turn 2 switches to English
  const swTurn2 = await processConversationTurn(sSwitch, "It is on Sathy Road near the bus stand.");
  assert(swTurn2.detectedLanguage === 'ENGLISH', `Turn 2 detectedLanguage updated to ENGLISH`);
  assert(swTurn2.currentConversationLanguage === 'ENGLISH', `Turn 2 currentConversationLanguage switched to ENGLISH`);
  assert(swTurn2.responseLanguage === 'ENGLISH', `Turn 2 responseLanguage switched to ENGLISH`);
  assert(!/[\u0B80-\u0BFF]/.test(swTurn2.reply), `Switched AI reply is now in English`);

  // Turn 3 switches to Tamil script
  const swTurn3 = await processConversationTurn(sSwitch, "3 நாட்களாக இந்த பிரச்சனை உள்ளது.");
  assert(swTurn3.detectedLanguage === 'TAMIL', `Turn 3 detectedLanguage updated to TAMIL`);
  assert(swTurn3.currentConversationLanguage === 'TAMIL', `Turn 3 currentConversationLanguage switched to TAMIL`);
  assert(swTurn3.responseLanguage === 'TAMIL', `Turn 3 responseLanguage switched to TAMIL`);
  assert(/[\u0B80-\u0BFF]/.test(swTurn3.reply), `Switched AI reply is now in Tamil`);

  // --- TEST 7: Prompt Example 4 (English -> Tamil Switch) ---
  console.log('\n--- TEST 7: Prompt Example 4 (English -> Tamil Switch) ---');
  const sEx4 = 'test-ex4-' + Date.now();
  clearSessionState(sEx4);

  const ex4Turn1 = await processConversationTurn(sEx4, "There is a road problem in Saravanampatti.");
  assert(ex4Turn1.detectedLanguage === 'ENGLISH', `Ex4 Turn 1 detectedLanguage is ENGLISH`);
  assert(ex4Turn1.currentConversationLanguage === 'ENGLISH', `Ex4 Turn 1 currentConversationLanguage is ENGLISH`);
  assert(!/[\u0B80-\u0BFF]/.test(ex4Turn1.reply), `Ex4 Turn 1 AI reply is in English: "${ex4Turn1.reply}"`);

  const ex4Turn2 = await processConversationTurn(sEx4, "அது ரொம்ப மோசமா இருக்கு.");
  assert(ex4Turn2.detectedLanguage === 'TAMIL', `Ex4 Turn 2 detectedLanguage is TAMIL`);
  assert(ex4Turn2.currentConversationLanguage === 'TAMIL', `Ex4 Turn 2 currentConversationLanguage switched to TAMIL`);
  assert(ex4Turn2.responseLanguage === 'TAMIL', `Ex4 Turn 2 responseLanguage switched to TAMIL`);
  assert(/[\u0B80-\u0BFF]/.test(ex4Turn2.reply), `Ex4 Turn 2 AI reply is in Tamil: "${ex4Turn2.reply}"`);

  console.log(`\n=== RESULTS: ${passedCount} / ${totalCount} PASSED ===`);
  if (passedCount === totalCount) {
    console.log('ALL TESTS PASSED PERFECTLY!');
  } else {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error(err);
  process.exit(1);
});
