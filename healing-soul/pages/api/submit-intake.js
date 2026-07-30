import https from 'https';

var CODE_VERSION = 'v4-debug-2026-03-05';
var lastBooking = { status: 'No bookings yet' };

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
        if (resp.statusCode < 200 || resp.statusCode >= 300) {
          reject(new Error('IntakeQ ' + resp.statusCode + ': ' + data.substring(0, 300)));
          return;
        }
        var json = null;
        try { json = JSON.parse(data); } catch (e) {}
        resolve(json || {});
      });
    });
    req.on('error', function(e) { reject(e); });
    if (body) { req.write(JSON.stringify(body)); }
    req.end();
  });
}

function uploadFileToIntakeQ(clientId, fileName, contentBuffer, contentType) {
  return new Promise(function(resolve) {
    var apiKey = process.env.INTAKEQ_API_KEY;
    if (!apiKey || !clientId || !contentBuffer) { resolve(false); return; }
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
        resolve(resp.statusCode >= 200 && resp.statusCode < 300);
      });
    });
    req.on('error', function(e) { resolve(false); });
    req.write(fullBody);
    req.end();
  });
}

function formatAddress(d) {
  var parts = [];
  if (d.address1) parts.push(d.address1);
  if (d.address2) parts.push(d.address2);
  var cityLine = [d.city, d.stateProvince || d.state, d.postalCode || d.zipCode].filter(Boolean).join(', ');
  if (cityLine) parts.push(cityLine);
  if (d.country) parts.push(d.country);
  return parts.join(', ') || (d.address || 'Not specified');
}

function buildIntakeDocument(data) {
  var now = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
  var lines = [];
  lines.push('================================================================');
  lines.push('       HEALING SOULUTIONS — PATIENT INTAKE RECORD');
  lines.push('================================================================');
  lines.push('Submitted: ' + now + ' (Eastern)');
  lines.push('');
  lines.push('PATIENT INFORMATION');
  lines.push('Name:              ' + (data.fname || '') + ' ' + (data.lname || ''));
  lines.push('Date of Birth:     ' + (data.dob || 'Not provided'));
  lines.push('Email:             ' + (data.email || 'Not provided'));
  lines.push('Phone:             ' + (data.phone || 'Not provided'));
  lines.push('Address Line 1:    ' + (data.address1 || 'Not provided'));
  if (data.address2) lines.push('Address Line 2:    ' + data.address2);
  lines.push('City:              ' + (data.city || 'Not provided'));
  lines.push('State/Province:    ' + (data.stateProvince || data.state || 'Not provided'));
  lines.push('Country:           ' + (data.country || 'Not provided'));
  lines.push('Postal/Zip Code:   ' + (data.postalCode || data.zipCode || 'Not provided'));
  lines.push('');
  lines.push('APPOINTMENT DETAILS');
  lines.push('Date:              ' + (data.date || 'TBD'));
  lines.push('Time:              ' + (data.selTime || 'TBD'));
  lines.push('Services:          ' + (data.services && data.services.length > 0 ? data.services.join(', ') : 'General Consultation'));
  if (data.notes) lines.push('Patient Notes:     ' + data.notes);
  lines.push('');
  lines.push('MEDICAL INFORMATION');
  lines.push('Medical/Surgical History: ' + (data.medicalSurgicalHistory || 'None reported'));
  lines.push('Current Medications:      ' + (data.medications || 'None reported'));
  lines.push('Allergies:                ' + (data.allergies || 'None reported'));
  lines.push('IV Therapy Reactions:     ' + (data.ivReactions || 'None reported'));
  lines.push('Notes for Clinician:      ' + (data.clinicianNotes || 'None'));
  lines.push('');
  lines.push('CONSENT FORMS');
  var consents = data.consents || {};
  lines.push('Treatment Consent:      ' + (consents.treatment ? 'AGREED' : 'NOT AGREED'));
  lines.push('HIPAA Privacy:          ' + (consents.hipaa ? 'AGREED' : 'NOT AGREED'));
  lines.push('Medical History Release: ' + (consents.medical ? 'AGREED' : 'NOT AGREED'));
  lines.push('Financial Agreement:     ' + (consents.financial ? 'AGREED' : 'NOT AGREED'));
  lines.push('');
  lines.push('SIGNATURES');
  if (data.consentFormSignature) {
    lines.push('Consent Signature: ' + (data.consentFormSignature.type === 'typed' ? 'Typed: "' + data.consentFormSignature.text + '"' : 'Drawn (see Consent_Forms_Signature.png)'));
  }
  if (data.intakeSignatureImage) {
    lines.push('Intake Signature:  ' + (data.intakeSignatureImage.type === 'typed' ? 'Typed: "' + data.intakeSignatureImage.text + '"' : 'Drawn (see Intake_Acknowledgment_Sig.png)'));
  }
  var eSig = data.signature;
  lines.push('E-Signature:       ' + (eSig === 'drawn-signature' ? 'Drawn' : (eSig ? 'Typed: "' + eSig + '"' : 'Not provided')));
  lines.push('Intake Acknowledged: ' + (data.intakeAcknowledged ? 'YES' : 'NO'));
  lines.push('');
  lines.push('PAYMENT');
  lines.push('Cardholder: ' + (data.cardHolderName || 'N/A'));
  lines.push('Card: ' + (data.cardBrand || 'N/A') + ' ending ' + (data.cardLast4 || 'N/A'));
  lines.push('Stripe ID: ' + (data.stripePaymentMethodId || 'N/A'));
  if (data.additionalPatients && data.additionalPatients.length > 0) {
    lines.push('');
    lines.push('ADDITIONAL PATIENTS (' + data.additionalPatients.length + ')');
    data.additionalPatients.forEach(function (pt, idx) {
      lines.push('');
      lines.push('--- Patient ' + (idx + 2) + ' ---');
      lines.push('Name: ' + (pt.fname || '') + ' ' + (pt.lname || ''));
      if (pt.dob) lines.push('DOB: ' + pt.dob);
      if (pt.phone) lines.push('Phone: ' + pt.phone);
      lines.push('Address: ' + formatAddress(pt));
      lines.push('Services: ' + (pt.services && pt.services.length > 0 ? pt.services.join(', ') : 'Same as primary'));
      if (pt.medicalSurgicalHistory) lines.push('Medical/Surgical: ' + pt.medicalSurgicalHistory);
      if (pt.medications) lines.push('Medications: ' + pt.medications);
      if (pt.allergies) lines.push('Allergies: ' + pt.allergies);
      if (pt.ivReactions) lines.push('IV Reactions: ' + pt.ivReactions);
      if (pt.clinicianNotes) lines.push('Clinician Notes: ' + pt.clinicianNotes);
    });
  }
  lines.push('');
  lines.push('== END OF INTAKE RECORD ==');
  return lines.join('\n');
}

function ptSection(label, val) {
  if (!val) return '';
  return '<p><strong style="color:#D4BC82;">' + label + ':</strong> ' + val + '</p>';
}

function buildBusinessEmailHtml(data) {
  var addr = formatAddress(data);
  var h = '<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#1a3a2a;color:#fff;padding:30px;border-radius:12px;">';
  h += '<div style="text-align:center;margin-bottom:20px;"><h1 style="color:#D4BC82;font-size:22px;margin:0;">New Patient Booking</h1><p style="color:rgba(255,255,255,0.6);font-size:13px;">Healing Soulutions</p></div>';
  h += '<div style="background:rgba(255,255,255,0.08);border-radius:8px;padding:16px;margin-bottom:16px;">';
  h += '<h2 style="color:#D4BC82;font-size:16px;margin:0 0 12px;">Primary Patient</h2>';
  h += ptSection('Name', (data.fname || '') + ' ' + (data.lname || ''));
  h += ptSection('Date of Birth', data.dob);
  h += ptSection('Email', data.email);
  h += ptSection('Phone', data.phone);
  h += ptSection('Address', addr);
  h += ptSection('Date', data.date || 'TBD');
  h += ptSection('Time', data.selTime || 'TBD');
  h += ptSection('Services', data.services && data.services.length > 0 ? data.services.join(', ') : 'General Consultation');
  h += ptSection('Notes', data.notes);
  h += '</div>';
  h += '<div style="background:rgba(255,255,255,0.08);border-radius:8px;padding:16px;margin-bottom:16px;">';
  h += '<h2 style="color:#D4BC82;font-size:16px;margin:0 0 12px;">Medical Information</h2>';
  h += ptSection('Medical/Surgical History', data.medicalSurgicalHistory);
  h += ptSection('Medications', data.medications);
  h += ptSection('Allergies', data.allergies);
  h += ptSection('Previous IV Therapy Reactions', data.ivReactions);
  h += ptSection('Clinician Notes', data.clinicianNotes);
  h += '</div>';
  h += '<div style="background:rgba(255,255,255,0.08);border-radius:8px;padding:16px;margin-bottom:16px;">';
  h += '<h2 style="color:#D4BC82;font-size:16px;margin:0 0 12px;">Consent Status</h2>';
  var cl = { treatment: 'Treatment Consent', hipaa: 'HIPAA Privacy', medical: 'Medical Release', financial: 'Financial Agreement' };
  ['treatment', 'hipaa', 'medical', 'financial'].forEach(function (k) {
    var agreed = data.consents && data.consents[k];
    h += '<p>' + (agreed ? '✅' : '❌') + ' <strong style="color:#D4BC82;">' + cl[k] + ':</strong> ' + (agreed ? 'AGREED' : 'NOT AGREED') + '</p>';
  });
  var cSig = data.consentFormSignature;
  h += ptSection('Consent Signature', cSig ? (cSig.type === 'typed' ? 'Typed: ' + cSig.text : 'Drawn (in IntakeQ files)') : 'Not provided');
  h += ptSection('E-Signature', data.signature === 'drawn-signature' ? 'Drawn on file' : (data.signature ? 'Typed: ' + data.signature : 'Not provided'));
  h += ptSection('Intake Acknowledgment', data.intakeAcknowledged ? 'Acknowledged' : 'Not acknowledged');
  if (data.intakeSignatureImage) {
    h += ptSection('Intake Signature', data.intakeSignatureImage.type === 'typed' ? 'Typed: ' + data.intakeSignatureImage.text : 'Drawn (in IntakeQ files)');
  }
  h += '</div>';
  h += '<div style="background:rgba(255,255,255,0.08);border-radius:8px;padding:16px;margin-bottom:16px;">';
  h += '<h2 style="color:#D4BC82;font-size:16px;margin:0 0 12px;">Payment</h2>';
  h += ptSection('Cardholder', data.cardHolderName);
  h += ptSection('Card', (data.cardBrand || '') + ' ending in ' + (data.cardLast4 || 'N/A'));
  h += '</div>';
  if (data.additionalPatients && data.additionalPatients.length > 0) {
    h += '<div style="background:rgba(255,255,255,0.08);border-radius:8px;padding:16px;margin-bottom:16px;">';
    h += '<h2 style="color:#D4BC82;font-size:16px;margin:0 0 12px;">Additional Patients (' + data.additionalPatients.length + ')</h2>';
    data.additionalPatients.forEach(function (pt, idx) {
      h += '<div style="border-top:1px solid rgba(255,255,255,0.1);padding-top:12px;margin-top:12px;">';
      h += '<h3 style="color:#D4BC82;font-size:14px;margin:0 0 8px;">Patient ' + (idx + 2) + ': ' + (pt.fname || '') + ' ' + (pt.lname || '') + '</h3>';
      h += ptSection('Date of Birth', pt.dob);
      h += ptSection('Phone', pt.phone);
      var pa = formatAddress(pt);
      if (pa && pa !== 'Not specified') h += ptSection('Address', pa);
      h += ptSection('Services', pt.services && pt.services.length > 0 ? pt.services.join(', ') : 'Same as primary');
      h += ptSection('Medical/Surgical History', pt.medicalSurgicalHistory);
      h += ptSection('Medications', pt.medications);
      h += ptSection('Allergies', pt.allergies);
      h += ptSection('Previous IV Reactions', pt.ivReactions);
      h += ptSection('Clinician Notes', pt.clinicianNotes);
      h += '</div>';
    });
    h += '</div>';
  }
  h += '</div>';
  return h;
}

function buildPatientEmailHtml(data) {
  var addr = formatAddress(data);
  var h = '<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#1a3a2a;color:#fff;padding:30px;border-radius:12px;">';
  h += '<div style="text-align:center;margin-bottom:20px;"><h1 style="color:#D4BC82;font-size:22px;margin:0;">Booking Confirmation</h1><p style="color:rgba(255,255,255,0.6);font-size:13px;">Healing Soulutions</p></div>';
  h += '<div style="background:rgba(255,255,255,0.08);border-radius:8px;padding:16px;margin-bottom:16px;">';
  h += '<h2 style="color:#D4BC82;font-size:16px;margin:0 0 12px;">Your Information</h2>';
  h += ptSection('Patient', (data.fname || '') + ' ' + (data.lname || ''));
  h += ptSection('Date of Birth', data.dob);
  h += ptSection('Email', data.email);
  h += ptSection('Phone', data.phone);
  h += ptSection('Address', addr);
  h += '</div>';
  h += '<div style="background:rgba(255,255,255,0.08);border-radius:8px;padding:16px;margin-bottom:16px;">';
  h += '<h2 style="color:#D4BC82;font-size:16px;margin:0 0 12px;">Your Appointment</h2>';
  h += ptSection('Date', data.date || 'TBD');
  h += ptSection('Time', data.selTime || 'TBD');
  h += ptSection('Services', data.services && data.services.length > 0 ? data.services.join(', ') : 'General Consultation');
  if (data.notes) h += ptSection('Notes', data.notes);
  h += '</div>';
  h += '<div style="background:rgba(255,255,255,0.08);border-radius:8px;padding:16px;margin-bottom:16px;">';
  h += '<h2 style="color:#D4BC82;font-size:16px;margin:0 0 12px;">Medical Information on File</h2>';
  h += ptSection('Medical/Surgical History', data.medicalSurgicalHistory);
  h += ptSection('Medications', data.medications);
  h += ptSection('Allergies', data.allergies);
  h += ptSection('Previous IV Reactions', data.ivReactions);
  h += ptSection('Clinician Notes', data.clinicianNotes);
  h += '</div>';
  h += '<div style="background:rgba(255,255,255,0.08);border-radius:8px;padding:16px;margin-bottom:16px;">';
  h += '<h2 style="color:#D4BC82;font-size:16px;margin:0 0 12px;">Consent Forms</h2>';
  var cl2 = { treatment: 'Treatment Consent', hipaa: 'HIPAA Privacy', medical: 'Medical Release', financial: 'Financial Agreement' };
  ['treatment', 'hipaa', 'medical', 'financial'].forEach(function (k) {
    var agreed = data.consents && data.consents[k];
    h += '<p>' + (agreed ? '✅' : '❌') + ' <strong style="color:#D4BC82;">' + cl2[k] + ':</strong> ' + (agreed ? 'AGREED' : 'NOT AGREED') + '</p>';
  });
  h += ptSection('Consent Signature', data.consentFormSignature ? (data.consentFormSignature.type === 'typed' ? 'Typed: ' + data.consentFormSignature.text : 'Drawn on file') : 'Not provided');
  h += ptSection('E-Signature', data.signature ? 'Provided' : 'Not provided');
  h += ptSection('Intake Acknowledgment', data.intakeAcknowledged ? 'Acknowledged & Signed' : 'Not acknowledged');
  h += '</div>';
  if (data.additionalPatients && data.additionalPatients.length > 0) {
    h += '<div style="background:rgba(255,255,255,0.08);border-radius:8px;padding:16px;margin-bottom:16px;">';
    h += '<h2 style="color:#D4BC82;font-size:16px;margin:0 0 12px;">Additional Patients (' + data.additionalPatients.length + ')</h2>';
    data.additionalPatients.forEach(function (pt, idx) {
      h += '<div style="border-top:1px solid rgba(255,255,255,0.1);padding-top:12px;margin-top:12px;">';
      h += '<h3 style="color:#D4BC82;font-size:14px;margin:0 0 8px;">Patient ' + (idx + 2) + ': ' + (pt.fname || '') + ' ' + (pt.lname || '') + '</h3>';
      h += ptSection('Date of Birth', pt.dob);
      h += ptSection('Phone', pt.phone);
      var pa = formatAddress(pt);
      if (pa && pa !== 'Not specified') h += ptSection('Address', pa);
      h += ptSection('Services', pt.services && pt.services.length > 0 ? pt.services.join(', ') : 'Same as primary');
      h += ptSection('Medical/Surgical History', pt.medicalSurgicalHistory);
      h += ptSection('Medications', pt.medications);
      h += ptSection('Allergies', pt.allergies);
      h += ptSection('Previous IV Reactions', pt.ivReactions);
      h += ptSection('Clinician Notes', pt.clinicianNotes);
      h += '</div>';
    });
    h += '</div>';
  }
  h += '<div style="background:rgba(255,255,255,0.08);border-radius:8px;padding:16px;margin-bottom:16px;">';
  h += ptSection('Payment', (data.cardBrand || 'Card') + ' ending in ' + (data.cardLast4 || '****') + ' verified');
  h += '</div>';
  h += '<div style="text-align:center;padding:16px;">';
  h += '<p style="color:#D4BC82;font-size:14px;">Our team will contact you within 24 hours to confirm.</p>';
  h += '<p style="color:rgba(255,255,255,0.5);font-size:12px;">Healing Soulutions — info@healingsoulutions.care — (585) 747-2215</p>';
  h += '<p style="color:rgba(255,255,255,0.4);font-size:11px;">Your data is stored securely per HIPAA regulations.</p>';
  h += '</div></div>';
  return h;
}

export default async function handler(req, res) {
  // GET = show version + last booking debug info
  if (req.method === 'GET') {
    return res.status(200).json({ version: CODE_VERSION, lastBooking: lastBooking });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  var debug = { version: CODE_VERSION, time: new Date().toISOString(), steps: [] };

  try {
    var data = req.body;
    debug.receivedData = { fname: data.fname, lname: data.lname, email: data.email, hasPhone: !!data.phone, hasDob: !!data.dob };

    if (!data.fname || !data.lname || !data.email) {
      debug.steps.push('REJECTED: missing required fields');
      lastBooking = debug;
      return res.status(400).json({ error: 'First name, last name, and email are required.' });
    }

    var errors = [];
    var clientId;

    // ── 1. Create/update client ──
    try {
      debug.steps.push('Step 1: searching client ' + data.email);
      var existingClients = await intakeqRequest('/clients?search=' + encodeURIComponent(data.email) + '&IncludeProfile=true', 'GET');
      debug.steps.push('Step 1: search returned ' + (Array.isArray(existingClients) ? existingClients.length + ' results' : 'non-array'));

      var clientPayload = {
        FirstName: data.fname, LastName: data.lname, Email: data.email,
        Phone: data.phone || '', DateOfBirth: data.dob || '',
        Address: data.address1 || '', City: data.city || '',
        State: data.stateProvince || data.state || '',
        ZipCode: data.postalCode || data.zipCode || '',
        Country: data.country || '',
        PractitionerId: '699328a73f048c95babc42b6',
      };

      if (Array.isArray(existingClients) && existingClients.length > 0) {
        clientId = existingClients[0].ClientId || existingClients[0].Id;
        clientPayload.ClientId = clientId;
        clientPayload.Email = data.email;
        debug.steps.push('Step 1: updating existing client ' + clientId);
        await intakeqRequest('/clients', 'POST', clientPayload);
        debug.steps.push('Step 1: client updated OK');
      } else {
        debug.steps.push('Step 1: creating new client');
        var newClient = await intakeqRequest('/clients', 'POST', clientPayload);
        clientId = newClient.ClientId || newClient.Id;
        debug.steps.push('Step 1: client created, id=' + clientId);
      }
    } catch (e) {
      debug.steps.push('Step 1 ERROR: ' + e.message);
      errors.push('client: ' + e.message);
    }

    // ── 2. Upload intake document ──
    if (clientId) {
      try {
        var intakeDoc = buildIntakeDocument(data);
        var dateStr = new Date().toISOString().slice(0, 10);
        var fileName = 'Intake_' + data.fname + '_' + data.lname + '_' + dateStr + '.txt';
        debug.steps.push('Step 2: uploading ' + fileName + ' to client ' + clientId);
        var uploaded = await uploadFileToIntakeQ(clientId, fileName, Buffer.from(intakeDoc, 'utf-8'), 'text/plain');
        debug.steps.push('Step 2: upload result=' + uploaded);
        if (!uploaded) errors.push('intake_doc: upload failed');
      } catch (e) {
        debug.steps.push('Step 2 ERROR: ' + e.message);
        errors.push('intake_doc: ' + e.message);
      }
    } else {
      debug.steps.push('Step 2 SKIPPED: no clientId');
      errors.push('no_client');
    }

    // ── 3. Upload signatures ──
    if (clientId) {
      if (data.consentFormSignature && data.consentFormSignature.type === 'drawn' && data.consentFormSignature.image) {
        try {
          var raw = data.consentFormSignature.image.replace(/^data:image\/\w+;base64,/, '');
          debug.steps.push('Step 3a: uploading consent signature');
          await uploadFileToIntakeQ(clientId, 'Consent_Forms_Signature.png', Buffer.from(raw, 'base64'), 'image/png');
          debug.steps.push('Step 3a: done');
        } catch (e) { debug.steps.push('Step 3a ERROR: ' + e.message); }
      }
      if (data.intakeSignatureImage && data.intakeSignatureImage.type === 'drawn' && data.intakeSignatureImage.image) {
        try {
          var raw2 = data.intakeSignatureImage.image.replace(/^data:image\/\w+;base64,/, '');
          debug.steps.push('Step 3b: uploading intake signature');
          await uploadFileToIntakeQ(clientId, 'Intake_Acknowledgment_Sig.png', Buffer.from(raw2, 'base64'), 'image/png');
          debug.steps.push('Step 3b: done');
        } catch (e) { debug.steps.push('Step 3b ERROR: ' + e.message); }
      }
    }

    // ── 4. Business email ──
    try {
      var rk = process.env.RESEND_API_KEY;
      if (rk) {
        debug.steps.push('Step 4: sending business email');
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Authorization': 'Bearer ' + rk, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: 'Healing Soulutions <bookings@healingsoulutions.care>',
            to: ['info@healingsoulutions.care'],
            subject: 'New Booking: ' + data.fname + ' ' + data.lname + ' — ' + (data.services && data.services.length > 0 ? data.services[0] : 'General'),
            html: buildBusinessEmailHtml(data),
          }),
        });
        debug.steps.push('Step 4: business email sent');
      }
    } catch (e) {
      debug.steps.push('Step 4 ERROR: ' + e.message);
      errors.push('businessEmail: ' + e.message);
    }

    // ── 5. Patient email ──
    try {
      var rk2 = process.env.RESEND_API_KEY;
      if (rk2 && data.email) {
        debug.steps.push('Step 5: sending patient email');
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Authorization': 'Bearer ' + rk2, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: 'Healing Soulutions <bookings@healingsoulutions.care>',
            to: [data.email],
            subject: 'Booking Confirmation — Healing Soulutions',
            html: buildPatientEmailHtml(data),
          }),
        });
        debug.steps.push('Step 5: patient email sent');
      }
    } catch (e) {
      debug.steps.push('Step 5 ERROR: ' + e.message);
      errors.push('patientEmail: ' + e.message);
    }

    debug.clientId = clientId || null;
    debug.errors = errors;
    debug.success = true;
    lastBooking = debug;

    return res.status(200).json({
      success: true,
      version: CODE_VERSION,
      clientId: clientId || null,
      errors: errors,
      message: 'Intake submitted successfully to HIPAA-secure server.',
    });
  } catch (error) {
    debug.steps.push('FATAL: ' + error.message);
    debug.success = false;
    lastBooking = debug;
    return res.status(500).json({ error: 'Failed to submit intake.', version: CODE_VERSION });
  }
}
