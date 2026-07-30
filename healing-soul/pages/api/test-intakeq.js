import https from 'https';

export default async function handler(req, res) {
  var out = {};
  var uid = Date.now();

  // Build fake booking data that looks exactly like what the frontend sends
  var bookingData = {
    fname: 'LiveTest',
    lname: 'Booking' + uid,
    email: 'livetest-' + uid + '@healingsoulutions.care',
    phone: '+15857472215',
    dob: '1990-01-15',
    address1: '789 Live Test Blvd',
    address2: '',
    city: 'Rochester',
    stateProvince: 'NY',
    country: 'US',
    postalCode: '14620',
    date: '2026-03-10',
    selTime: '2:00 PM',
    services: ['IV Hydration Therapy'],
    notes: 'LIVE ENDPOINT TEST - please ignore',
    medicalSurgicalHistory: 'TEST: Appendectomy 2010',
    medications: 'TEST: Lisinopril 10mg',
    allergies: 'TEST: Penicillin',
    ivReactions: 'TEST: None',
    clinicianNotes: 'Automated live test',
    consents: { treatment: true, hipaa: true, medical: true, financial: true },
    consentFormSignature: { type: 'typed', text: 'LiveTest Booking' },
    intakeSignatureImage: { type: 'typed', text: 'LiveTest Booking' },
    signature: 'LiveTest Booking',
    intakeAcknowledged: true,
    cardBrand: 'Visa',
    cardLast4: '4242',
    cardHolderName: 'LiveTest Booking',
    stripePaymentMethodId: 'pm_test_live',
    additionalPatients: []
  };

  out.testData = { fname: bookingData.fname, lname: bookingData.lname, email: bookingData.email };

  // POST to the live submit-intake endpoint
  try {
    var postBody = JSON.stringify(bookingData);
    var result = await new Promise(function(resolve, reject) {
      var opts = {
        hostname: 'healingsoulutions.care',
        path: '/api/submit-intake',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postBody)
        }
      };

      var req2 = https.request(opts, function(resp) {
        var data = '';
        resp.on('data', function(chunk) { data += chunk; });
        resp.on('end', function() {
          var json = null;
          try { json = JSON.parse(data); } catch (e) {}
          resolve({ status: resp.statusCode, headers: resp.headers, body: json || data });
        });
      });

      req2.on('error', function(e) { reject(e); });
      req2.write(postBody);
      req2.end();
    });

    out.submitIntakeResponse = result;
  } catch (e) {
    out.submitIntakeError = e.message;
  }

  // Now check IntakeQ directly to see if client was created
  try {
    var checkResult = await new Promise(function(resolve, reject) {
      var opts = {
        hostname: 'intakeq.com',
        path: '/api/v1/clients?search=' + encodeURIComponent(bookingData.email) + '&IncludeProfile=true',
        method: 'GET',
        headers: { 'X-Auth-Key': process.env.INTAKEQ_API_KEY, 'Content-Type': 'application/json' }
      };
      var req3 = https.request(opts, function(resp) {
        var data = '';
        resp.on('data', function(chunk) { data += chunk; });
        resp.on('end', function() {
          var json = null;
          try { json = JSON.parse(data); } catch (e) {}
          resolve({ status: resp.statusCode, data: json || data });
        });
      });
      req3.on('error', function(e) { reject(e); });
      req3.end();
    });

    out.intakeqVerification = {
      clientFoundInIntakeQ: Array.isArray(checkResult.data) && checkResult.data.length > 0,
      searchResult: checkResult
    };
  } catch (e) {
    out.intakeqVerificationError = e.message;
  }

  // Count total clients
  try {
    var countResult = await new Promise(function(resolve, reject) {
      var opts = {
        hostname: 'intakeq.com',
        path: '/api/v1/clients',
        method: 'GET',
        headers: { 'X-Auth-Key': process.env.INTAKEQ_API_KEY, 'Content-Type': 'application/json' }
      };
      var req4 = https.request(opts, function(resp) {
        var data = '';
        resp.on('data', function(chunk) { data += chunk; });
        resp.on('end', function() {
          var json = null;
          try { json = JSON.parse(data); } catch (e) {}
          resolve(Array.isArray(json) ? json.length : 'unknown');
        });
      });
      req4.on('error', function(e) { reject(e); });
      req4.end();
    });
    out.totalClientsNow = countResult;
  } catch (e) {}

  out.SUMMARY = {
    submitStatus: out.submitIntakeResponse ? out.submitIntakeResponse.status : 'FAILED',
    version: out.submitIntakeResponse && out.submitIntakeResponse.body ? out.submitIntakeResponse.body.version : 'unknown',
    clientId: out.submitIntakeResponse && out.submitIntakeResponse.body ? out.submitIntakeResponse.body.clientId : null,
    errors: out.submitIntakeResponse && out.submitIntakeResponse.body ? out.submitIntakeResponse.body.errors : 'unknown',
    clientFoundInIntakeQ: out.intakeqVerification ? out.intakeqVerification.clientFoundInIntakeQ : false,
    totalClients: out.totalClientsNow
  };

  return res.status(200).json(out);
}
