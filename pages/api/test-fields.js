/*
 * pages/api/test-fields.js
 *
 * Creates a client with AdditionalInformation, then reads it back
 * to verify what actually saved. Visit /api/test-fields in browser.
 * DELETE after debugging.
 */
export default async function handler(req, res) {
  var apiKey = process.env.INTAKEQ_API_KEY;
  if (!apiKey) return res.status(200).json({ error: 'No API key' });

  var results = {};

  // STEP 1: Create client with AdditionalInformation
  var testEmail = 'fieldtest-' + Date.now() + '@test.healingsoulutions.care';
  var testNotes = 'TEST NOTES — ' + new Date().toISOString() + '\nMedical History: Asthma\nAllergies: Penicillin\nConsent: Treatment AGREED';

  var createPayload = {
    FirstName: 'FieldTest',
    LastName: 'Verify',
    Name: 'FieldTest Verify',
    Email: testEmail,
    Phone: '5550001234',
    AdditionalInformation: testNotes,
  };

  results.step1_payload = createPayload;

  var cRes = await fetch('https://intakeq.com/api/v1/clients', {
    method: 'POST',
    headers: { 'X-Auth-Key': apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify(createPayload),
  });
  var cBody = await cRes.text();
  var cData = {};
  try { cData = JSON.parse(cBody); } catch (e) {}

  results.step1_create = {
    httpStatus: cRes.status,
    response: cData,
    hasAdditionalInfo: !!cData.AdditionalInformation,
    additionalInfoValue: cData.AdditionalInformation || 'NOT IN RESPONSE',
  };

  var clientId = cData.ClientId;

  // STEP 2: Read it back with IncludeProfile=true
  if (clientId) {
    var sRes = await fetch('https://intakeq.com/api/v1/clients?search=' + encodeURIComponent(testEmail) + '&IncludeProfile=true', {
      method: 'GET',
      headers: { 'X-Auth-Key': apiKey },
    });
    var sBody = await sRes.text();
    var sData = [];
    try { sData = JSON.parse(sBody); } catch (e) {}

    var client = sData[0] || {};
    results.step2_readback = {
      httpStatus: sRes.status,
      clientId: client.ClientId,
      hasAdditionalInfo: !!client.AdditionalInformation,
      additionalInfoValue: client.AdditionalInformation || 'EMPTY — NOT SAVED',
      allFieldNames: Object.keys(client),
      fullClient: client,
    };
  }

  // STEP 3: Try updating with AdditionalInformation
  if (clientId) {
    var updateNotes = 'UPDATED NOTES — ' + new Date().toISOString() + '\nThis is an update test.';
    var uRes = await fetch('https://intakeq.com/api/v1/clients', {
      method: 'POST',
      headers: { 'X-Auth-Key': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ClientId: clientId,
        FirstName: 'FieldTest',
        LastName: 'Verify',
        Email: testEmail,
        AdditionalInformation: updateNotes,
      }),
    });
    var uBody = await uRes.text();
    var uData = {};
    try { uData = JSON.parse(uBody); } catch (e) {}

    results.step3_update = {
      httpStatus: uRes.status,
      additionalInfoInResponse: uData.AdditionalInformation || 'NOT IN RESPONSE',
    };

    // Read back after update
    var s2Res = await fetch('https://intakeq.com/api/v1/clients?search=' + encodeURIComponent(testEmail) + '&IncludeProfile=true', {
      method: 'GET',
      headers: { 'X-Auth-Key': apiKey },
    });
    var s2Body = await s2Res.text();
    var s2Data = [];
    try { s2Data = JSON.parse(s2Body); } catch (e) {}

    var client2 = s2Data[0] || {};
    results.step3_readback = {
      additionalInfoSaved: client2.AdditionalInformation || 'STILL EMPTY — FIELD NOT SAVING',
    };
  }

  // STEP 4: Try Notes field instead (some IntakeQ versions use this)
  if (clientId) {
    var nRes = await fetch('https://intakeq.com/api/v1/clients', {
      method: 'POST',
      headers: { 'X-Auth-Key': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ClientId: clientId,
        FirstName: 'FieldTest',
        LastName: 'Verify',
        Email: testEmail,
        Notes: 'NOTES FIELD TEST — ' + new Date().toISOString(),
      }),
    });
    var nBody = await nRes.text();
    var nData = {};
    try { nData = JSON.parse(nBody); } catch (e) {}

    // Read back
    var s3Res = await fetch('https://intakeq.com/api/v1/clients?search=' + encodeURIComponent(testEmail) + '&IncludeProfile=true', {
      method: 'GET',
      headers: { 'X-Auth-Key': apiKey },
    });
    var s3Body = await s3Res.text();
    var s3Data = [];
    try { s3Data = JSON.parse(s3Body); } catch (e) {}

    var client3 = s3Data[0] || {};
    results.step4_notes_field = {
      notesInResponse: nData.Notes || 'NOT IN RESPONSE',
      notesAfterReadback: client3.Notes || 'EMPTY',
      additionalInfoAfterReadback: client3.AdditionalInformation || 'EMPTY',
    };
  }

  results.summary = 'Check step2_readback.additionalInfoValue and step3_readback.additionalInfoSaved — if both say EMPTY, IntakeQ is ignoring AdditionalInformation field.';

  return res.status(200).json(results);
}
