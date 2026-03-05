import https from 'https';

function intakeqRequest(endpoint, method, body) {
  return new Promise(function(resolve, reject) {
    var apiKey = process.env.INTAKEQ_API_KEY;
    if (!apiKey) { reject(new Error('No API key')); return; }
    var opts = {
      hostname: 'intakeq.com',
      path: '/api/v1' + endpoint,
      method: method || 'GET',
      headers: { 'X-Auth-Key': apiKey, 'Content-Type': 'application/json' }
    };
    var req = https.request(opts, function(resp) {
      var data = '';
      resp.on('data', function(chunk) { data += chunk; });
      resp.on('end', function() {
        var json = null;
        try { json = JSON.parse(data); } catch (e) {}
        if (resp.statusCode < 200 || resp.statusCode >= 300) {
          reject(new Error('Status ' + resp.statusCode + ': ' + (typeof json === 'object' ? JSON.stringify(json) : data.substring(0, 200))));
          return;
        }
        resolve(json || {});
      });
    });
    req.on('error', function(e) { reject(e); });
    if (body) { req.write(JSON.stringify(body)); }
    req.end();
  });
}

function uploadFileToIntakeQ(clientId, fileName, contentBuffer, contentType) {
  return new Promise(function(resolve, reject) {
    var apiKey = process.env.INTAKEQ_API_KEY;
    if (!apiKey || !clientId) { reject(new Error('Missing apiKey or clientId')); return; }
    var boundary = '----FormBoundary' + Date.now();
    var header = '--' + boundary + '\r\nContent-Disposition: form-data; name="file"; filename="' + fileName + '"\r\nContent-Type: ' + contentType + '\r\n\r\n';
    var footer = '\r\n--' + boundary + '--\r\n';
    var fullBody = Buffer.concat([Buffer.from(header, 'utf-8'), contentBuffer, Buffer.from(footer, 'utf-8')]);
    var opts = {
      hostname: 'intakeq.com',
      path: '/api/v1/files/' + clientId,
      method: 'POST',
      headers: {
        'X-Auth-Key': apiKey,
        'Content-Type': 'multipart/form-data; boundary=' + boundary,
        'Content-Length': fullBody.length
      }
    };
    var req = https.request(opts, function(resp) {
      var data = '';
      resp.on('data', function(chunk) { data += chunk; });
      resp.on('end', function() {
        resolve({ status: resp.statusCode, ok: resp.statusCode >= 200 && resp.statusCode < 300, body: data });
      });
    });
    req.on('error', function(e) { reject(e); });
    req.write(fullBody);
    req.end();
  });
}

export default async function handler(req, res) {
  var out = {};
  var uid = Date.now();

  // Step 1: Create client (EXACTLY like submit-intake does)
  try {
    var email = 'simtest-' + uid + '@healingsoulutions.care';
    out.step1_search = 'Searching for ' + email;
    var existing = await intakeqRequest('/clients?search=' + encodeURIComponent(email) + '&IncludeProfile=true', 'GET');
    out.step1_searchResult = { found: Array.isArray(existing) ? existing.length : 'not array', raw: existing };

    var clientPayload = {
      FirstName: 'SimTest',
      LastName: 'Booking' + uid,
      Email: email,
      Phone: '+15857472215',
      DateOfBirth: '1990-01-01',
      Address: '123 Test St',
      City: 'Rochester',
      State: 'NY',
      ZipCode: '14620',
      Country: 'US',
      PractitionerId: '699328a73f048c95babc42b6',
    };

    out.step1_creating = 'Creating client with payload';
    var newClient = await intakeqRequest('/clients', 'POST', clientPayload);
    var clientId = newClient.ClientId || newClient.Id || null;
    out.step1_result = { clientId: clientId, response: newClient };
  } catch (e) {
    out.step1_ERROR = e.message;
  }

  // Step 2: Upload intake document (EXACTLY like submit-intake does)
  var clientId = out.step1_result ? out.step1_result.clientId : null;
  if (clientId) {
    try {
      var doc = 'TEST INTAKE DOCUMENT\nName: SimTest Booking\nDate: ' + new Date().toISOString() + '\nThis is a simulated intake.';
      var fileName = 'Intake_SimTest_Booking_' + new Date().toISOString().slice(0, 10) + '.txt';
      out.step2_uploading = 'Uploading ' + fileName + ' to client ' + clientId;
      var uploadResult = await uploadFileToIntakeQ(clientId, fileName, Buffer.from(doc, 'utf-8'), 'text/plain');
      out.step2_result = uploadResult;
    } catch (e) {
      out.step2_ERROR = e.message;
    }
  } else {
    out.step2_SKIPPED = 'No clientId from step 1';
  }

  out.SUMMARY = {
    clientCreated: !!clientId,
    clientId: clientId,
    fileUploaded: out.step2_result ? out.step2_result.ok : false,
    CHECK: 'Is clientId a number > 26? If yes, check IntakeQ Clients for SimTest Booking'
  };

  return res.status(200).json(out);
}
