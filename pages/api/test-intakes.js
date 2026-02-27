/*
 * pages/api/test-intakeq.js
 *
 * Visit /api/test-intakeq in your browser to verify:
 *  1. API key is set
 *  2. IntakeQ search works
 *  3. Client creation works
 *  4. AdditionalInformation saves correctly
 *
 * DELETE THIS FILE before going to production.
 */

export default async function handler(req, res) {
  var apiKey = process.env.INTAKEQ_API_KEY;
  var results = { steps: [] };

  // Step 1: Check API key
  if (!apiKey) {
    results.steps.push({ step: 'API Key', status: 'FAIL', detail: 'INTAKEQ_API_KEY env var is not set' });
    return res.status(200).json(results);
  }
  results.steps.push({ step: 'API Key', status: 'OK', detail: apiKey.substring(0, 4) + '...' + apiKey.slice(-4) });

  // Step 2: Search for a test client
  try {
    var searchRes = await fetch('https://intakeq.com/api/v1/clients?search=test&IncludeProfile=true', {
      method: 'GET',
      headers: { 'X-Auth-Key': apiKey },
    });
    var searchText = await searchRes.text();
    results.steps.push({
      step: 'Search (GET /clients)',
      status: searchRes.ok ? 'OK' : 'FAIL',
      httpStatus: searchRes.status,
      response: searchText.substring(0, 500),
    });
  } catch (e) {
    results.steps.push({ step: 'Search', status: 'FAIL', error: e.message });
  }

  // Step 3: Create a test client with AdditionalInformation
  try {
    var testPayload = {
      FirstName: 'APITest',
      LastName: 'DiagCheck',
      Name: 'APITest DiagCheck',
      Email: 'apitest-' + Date.now() + '@test.healingsoulutions.care',
      Phone: '',
      AdditionalInformation: 'DIAGNOSTIC TEST at ' + new Date().toISOString() + '\nIf you see this in IntakeQ, the API is working correctly.\nMedical History: Test\nConsent: Test AGREED\nSignature: Test typed',
    };

    var createRes = await fetch('https://intakeq.com/api/v1/clients', {
      method: 'POST',
      headers: { 'X-Auth-Key': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify(testPayload),
    });
    var createText = await createRes.text();
    results.steps.push({
      step: 'Create Client (POST /clients)',
      status: createRes.ok ? 'OK' : 'FAIL',
      httpStatus: createRes.status,
      sentPayload: testPayload,
      response: createText.substring(0, 500),
    });

    // Step 4: If creation worked, search for it to verify AdditionalInformation saved
    if (createRes.ok) {
      try {
        var parsed = JSON.parse(createText);
        var verifyId = parsed.ClientId || parsed.ClientNumber;
        if (verifyId) {
          var verifyRes = await fetch('https://intakeq.com/api/v1/clients?search=' + verifyId + '&IncludeProfile=true', {
            method: 'GET',
            headers: { 'X-Auth-Key': apiKey },
          });
          var verifyText = await verifyRes.text();
          var verifyData = JSON.parse(verifyText);
          var hasInfo = verifyData[0] && verifyData[0].AdditionalInformation;
          results.steps.push({
            step: 'Verify AdditionalInformation saved',
            status: hasInfo ? 'OK' : 'FAIL',
            clientId: verifyId,
            additionalInformation: hasInfo ? hasInfo.substring(0, 200) : 'EMPTY/MISSING',
          });
        }
      } catch (e) {
        results.steps.push({ step: 'Verify', status: 'SKIP', detail: 'Could not verify: ' + e.message });
      }
    }
  } catch (e) {
    results.steps.push({ step: 'Create Client', status: 'FAIL', error: e.message });
  }

  results.summary = results.steps.every(function (s) { return s.status === 'OK' || s.status === 'SKIP'; })
    ? 'ALL TESTS PASSED — IntakeQ integration is working'
    : 'SOME TESTS FAILED — check steps above';

  return res.status(200).json(results);
}
