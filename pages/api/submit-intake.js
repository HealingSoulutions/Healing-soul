/*
 * pages/api/submit-intake.js
 *
 * Complete rewrite. Uses EXACT same direct fetch pattern as test-email.js.
 * Zero empty catch blocks. Every error is logged and returned.
 */

export default async function handler(req, res) {
  /* ── GET = debug endpoint ── */
  if (req.method === 'GET') {
    return res.status(200).json({ lastResult: global._lastIQ || null });
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  var apiKey = process.env.INTAKEQ_API_KEY;
  var resendKey = process.env.RESEND_API_KEY;
  var log = [];
  function L(m) { log.push(m); console.log('[IQ] ' + m); }

  var data = req.body || {};
  if (!data.fname || !data.lname || !data.email) {
    return res.status(400).json({ error: 'Name and email required.', log: log });
  }

  var clientId = null;
  var iqOk = false;
  var bizOk = false;
  var patOk = false;

  var now = new Date();
  var eastern = now.toLocaleString('en-US', { timeZone: 'America/New_York' });
  var con = data.consents || {};
  var cts = data.consentTimestamps || {};

  L('START: ' + data.fname + ' ' + data.lname + ' <' + data.email + '>');

  /* ════════════════════════════════════════════════
     BUILD TEXT RECORD for IntakeQ AdditionalInformation
     ════════════════════════════════════════════════ */
  var R = [];
  R.push('============================================');
  R.push('INTAKE FORM — ' + eastern + ' ET');
  R.push('============================================');
  R.push('');
  R.push('PATIENT INFORMATION');
  R.push('Name: ' + data.fname + ' ' + data.lname);
  R.push('Email: ' + data.email);
  R.push('Phone: ' + (data.phone || 'N/A'));
  R.push('Address: ' + (data.address || 'N/A'));
  R.push('');
  R.push('APPOINTMENT');
  R.push('Date: ' + (data.date || 'TBD'));
  R.push('Time: ' + (data.selTime || 'TBD'));
  R.push('Services: ' + (data.services && data.services.length ? data.services.join(', ') : 'General'));
  if (data.notes) R.push('Notes: ' + data.notes);
  R.push('');
  R.push('MEDICAL HISTORY');
  R.push('Medical History: ' + (data.medicalHistory || 'None reported'));
  R.push('Surgical History: ' + (data.surgicalHistory || 'None reported'));
  R.push('Current Medications: ' + (data.medications || 'None reported'));
  R.push('Known Allergies: ' + (data.allergies || 'None reported'));
  if (data.clinicianNotes) R.push('Clinician Notes: ' + data.clinicianNotes);
  R.push('');
  R.push('CONSENTS');
  R.push('Treatment Consent: ' + (con.treatment ? 'AGREED' : 'NOT AGREED') + (cts.treatment ? ' [' + cts.treatment + ']' : ''));
  R.push('  Informed Consent for Treatment: risks, complications, assumption of risk, peptide therapy, limitation of liability, indemnification, release/waiver, emergency authorization, scope of practice, dispute resolution');
  R.push('HIPAA Privacy: ' + (con.hipaa ? 'AGREED' : 'NOT AGREED') + (cts.hipaa ? ' [' + cts.hipaa + ']' : ''));
  R.push('  HIPAA Notice per 45 CFR Parts 160/164: uses/disclosures, authorization, patient rights, minimum necessary standard, data security, breach notification');
  R.push('Medical Release: ' + (con.medical ? 'AGREED' : 'NOT AGREED') + (cts.medical ? ' [' + cts.medical + ']' : ''));
  R.push('  Authorization to collect, review, maintain, request, obtain, disclose medical information');
  R.push('Financial Agreement: ' + (con.financial ? 'AGREED' : 'NOT AGREED') + (cts.financial ? ' [' + cts.financial + ']' : ''));
  R.push('  Payment terms, 24-hour cancellation, no-show fees, past due terms');
  R.push('');
  R.push('SIGNATURES');
  var sigTxt = data.signature || 'NOT PROVIDED';
  if (sigTxt === 'drawn-signature') sigTxt = 'DRAWN (image file attached)';
  R.push('Consent Signature: ' + sigTxt + ' (type: ' + (data.signatureType || 'N/A') + ')');
  R.push('Intake Acknowledged: ' + (data.intakeAcknowledged ? 'YES' : 'NO'));
  var iSigTxt = data.intakeSignature || 'NOT PROVIDED';
  if (iSigTxt === 'drawn_intake_sig') iSigTxt = 'DRAWN (image file attached)';
  R.push('Intake Signature: ' + iSigTxt + ' (type: ' + (data.intakeSignatureType || 'N/A') + ')');
  R.push('');
  R.push('PAYMENT');
  R.push('Card: ' + (data.cardBrand || 'N/A') + ' ****' + (data.cardLast4 || 'N/A'));
  R.push('Cardholder: ' + (data.cardHolderName || 'N/A'));

  if (data.additionalPatients && data.additionalPatients.length) {
    R.push('');
    R.push('ADDITIONAL PATIENTS (' + data.additionalPatients.length + ')');
    data.additionalPatients.forEach(function (pt, i) {
      R.push('');
      R.push('-- Patient ' + (i + 2) + ': ' + (pt.fname || '') + ' ' + (pt.lname || '') + ' --');
      R.push('Services: ' + (pt.services && pt.services.length ? pt.services.join(', ') : 'Same'));
      R.push('Medical: ' + (pt.medicalHistory || 'None'));
      R.push('Surgical: ' + (pt.surgicalHistory || 'None'));
      R.push('Medications: ' + (pt.medications || 'None'));
      R.push('Allergies: ' + (pt.allergies || 'None'));
      if (pt.clinicianNotes) R.push('Clinician Notes: ' + pt.clinicianNotes);
    });
  }

  R.push('');
  R.push('UTC: ' + now.toISOString());
  R.push('============================================');
  var fullRecord = R.join('\n');

  /* ════════════════════════════════════════════════
     INTAKEQ: Search → Create/Update client
     ════════════════════════════════════════════════ */
  if (!apiKey) {
    L('ERROR: INTAKEQ_API_KEY not set!');
  } else {
    L('API key: ' + apiKey.substring(0, 6) + '...');

    // STEP 1: SEARCH with IncludeProfile=true (required to get ClientId)
    try {
      var searchUrl = 'https://intakeq.com/api/v1/clients?search=' + encodeURIComponent(data.email) + '&IncludeProfile=true';
      L('SEARCH: GET ' + searchUrl);
      var sRes = await fetch(searchUrl, {
        method: 'GET',
        headers: { 'X-Auth-Key': apiKey },
      });
      var sBody = await sRes.text();
      L('SEARCH HTTP ' + sRes.status + ': ' + sBody.substring(0, 200));

      var clients = [];
      try { clients = sBody ? JSON.parse(sBody) : []; } catch (pe) { L('Parse error: ' + pe.message); }

      // STEP 2: CREATE OR UPDATE — same direct fetch as test-email.js
      if (Array.isArray(clients) && clients.length > 0) {
        // EXISTING → POST with ClientId to update
        clientId = clients[0].ClientId || clients[0].ClientNumber;
        L('EXISTING client: ' + clientId);

        var prevNotes = clients[0].AdditionalInformation || '';
        var merged = prevNotes ? prevNotes + '\n\n' + fullRecord : fullRecord;

        L('UPDATE: POST /clients with ClientId=' + clientId);
        var uRes = await fetch('https://intakeq.com/api/v1/clients', {
          method: 'POST',
          headers: { 'X-Auth-Key': apiKey, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ClientId: clientId,
            FirstName: data.fname,
            LastName: data.lname,
            Email: data.email,
            Phone: data.phone || '',
            Address: data.address || '',
            AdditionalInformation: merged,
          }),
        });
        var uBody = await uRes.text();
        L('UPDATE HTTP ' + uRes.status + ': ' + uBody.substring(0, 200));
        iqOk = uRes.ok;
      } else {
        // NEW → POST
        L('CREATE: POST /clients (new)');
        var cRes = await fetch('https://intakeq.com/api/v1/clients', {
          method: 'POST',
          headers: { 'X-Auth-Key': apiKey, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            FirstName: data.fname,
            LastName: data.lname,
            Name: data.fname + ' ' + data.lname,
            Email: data.email,
            Phone: data.phone || '',
            Address: data.address || '',
            AdditionalInformation: fullRecord,
          }),
        });
        var cBody = await cRes.text();
        L('POST HTTP ' + cRes.status + ': ' + cBody.substring(0, 200));
        iqOk = cRes.ok;
        if (cRes.ok && cBody) {
          try {
            var cd = JSON.parse(cBody);
            clientId = cd.ClientId || cd.ClientNumber || cd.Id;
            L('Created ID=' + clientId);
          } catch (pe2) { L('Parse new client: ' + pe2.message); }
        }
      }

      // STEP 3: UPLOAD SIGNATURE FILES
      if (clientId && data.signatureImageData) {
        try {
          var raw1 = data.signatureImageData;
          if (raw1.indexOf(',') > -1) raw1 = raw1.split(',')[1];
          var buf1 = Buffer.from(raw1, 'base64');
          var b1 = '---SIG' + Date.now();
          var payload1 = Buffer.concat([
            Buffer.from('--' + b1 + '\r\nContent-Disposition: form-data; name="file"; filename="consent-signature.png"\r\nContent-Type: image/png\r\n\r\n'),
            buf1,
            Buffer.from('\r\n--' + b1 + '--\r\n'),
          ]);
          var f1 = await fetch('https://intakeq.com/api/v1/files/' + clientId, {
            method: 'POST',
            headers: { 'X-Auth-Key': apiKey, 'Content-Type': 'multipart/form-data; boundary=' + b1 },
            body: payload1,
          });
          L('Consent sig file: HTTP ' + f1.status);
        } catch (se1) { L('Sig upload err: ' + se1.message); }
      }

      if (clientId && data.intakeSignatureImageData) {
        try {
          var raw2 = data.intakeSignatureImageData;
          if (raw2.indexOf(',') > -1) raw2 = raw2.split(',')[1];
          var buf2 = Buffer.from(raw2, 'base64');
          var b2 = '---ISIG' + Date.now();
          var payload2 = Buffer.concat([
            Buffer.from('--' + b2 + '\r\nContent-Disposition: form-data; name="file"; filename="intake-signature.png"\r\nContent-Type: image/png\r\n\r\n'),
            buf2,
            Buffer.from('\r\n--' + b2 + '--\r\n'),
          ]);
          var f2 = await fetch('https://intakeq.com/api/v1/files/' + clientId, {
            method: 'POST',
            headers: { 'X-Auth-Key': apiKey, 'Content-Type': 'multipart/form-data; boundary=' + b2 },
            body: payload2,
          });
          L('Intake sig file: HTTP ' + f2.status);
        } catch (se2) { L('ISig upload err: ' + se2.message); }
      }

      // STEP 4: TAGS
      if (clientId) {
        try {
          await fetch('https://intakeq.com/api/v1/clientTags', {
            method: 'POST',
            headers: { 'X-Auth-Key': apiKey, 'Content-Type': 'application/json' },
            body: JSON.stringify({ ClientId: clientId, Tag: 'Website Booking' }),
          });
          await fetch('https://intakeq.com/api/v1/clientTags', {
            method: 'POST',
            headers: { 'X-Auth-Key': apiKey, 'Content-Type': 'application/json' },
            body: JSON.stringify({ ClientId: clientId, Tag: 'Online Intake' }),
          });
          L('Tags applied');
        } catch (te) { L('Tag err: ' + te.message); }
      }
    } catch (iqErr) {
      L('INTAKEQ ERROR: ' + iqErr.message);
    }
  }

  /* ════════════════════════════════════════════════
     BUSINESS EMAIL — FULL patient info, medical,
     consents with descriptions, signatures
     ════════════════════════════════════════════════ */
  if (!resendKey) {
    L('RESEND_API_KEY not set — no emails');
  } else {
    // Helper for consent status
    var chk = function (v) {
      return v
        ? '<span style="color:#2E5A46;font-weight:bold">&#10003; AGREED</span>'
        : '<span style="color:#cc3333;font-weight:bold">&#10007; Not agreed</span>';
    };

    try {
      L('Sending business email...');

      var bh = '<div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:0 auto;border:1px solid #ddd;border-radius:8px;overflow:hidden">';

      // Header
      bh += '<div style="background:#2E5A46;padding:24px;text-align:center">';
      bh += '<h1 style="color:#D4BC82;margin:0;font-size:22px">New Patient Intake</h1>';
      bh += '<p style="color:rgba(255,255,255,0.6);margin:6px 0 0;font-size:12px">' + eastern + ' ET</p>';
      bh += '</div>';

      bh += '<div style="padding:20px">';

      // Patient Info
      bh += '<h2 style="color:#2E5A46;font-size:16px;border-bottom:2px solid #D4BC82;padding-bottom:6px">Patient Information</h2>';
      bh += '<table style="width:100%;font-size:14px;border-collapse:collapse">';
      bh += '<tr><td style="padding:5px 8px;font-weight:bold;width:140px">Name:</td><td style="padding:5px 8px">' + data.fname + ' ' + data.lname + '</td></tr>';
      bh += '<tr><td style="padding:5px 8px;font-weight:bold">Email:</td><td style="padding:5px 8px"><a href="mailto:' + data.email + '">' + data.email + '</a></td></tr>';
      bh += '<tr><td style="padding:5px 8px;font-weight:bold">Phone:</td><td style="padding:5px 8px">' + (data.phone || 'N/A') + '</td></tr>';
      bh += '<tr><td style="padding:5px 8px;font-weight:bold">Address:</td><td style="padding:5px 8px">' + (data.address || 'N/A') + '</td></tr>';
      bh += '</table>';

      // Appointment
      bh += '<h2 style="color:#2E5A46;font-size:16px;border-bottom:2px solid #D4BC82;padding-bottom:6px;margin-top:20px">Appointment</h2>';
      bh += '<table style="width:100%;font-size:14px;border-collapse:collapse">';
      bh += '<tr><td style="padding:5px 8px;font-weight:bold;width:140px">Date:</td><td style="padding:5px 8px">' + (data.date || 'TBD') + '</td></tr>';
      bh += '<tr><td style="padding:5px 8px;font-weight:bold">Time:</td><td style="padding:5px 8px">' + (data.selTime || 'TBD') + '</td></tr>';
      bh += '<tr><td style="padding:5px 8px;font-weight:bold">Services:</td><td style="padding:5px 8px">' + (data.services && data.services.length ? data.services.join(', ') : 'General Consultation') + '</td></tr>';
      if (data.notes) bh += '<tr><td style="padding:5px 8px;font-weight:bold">Notes:</td><td style="padding:5px 8px">' + data.notes + '</td></tr>';
      bh += '</table>';

      // Medical History
      bh += '<h2 style="color:#2E5A46;font-size:16px;border-bottom:2px solid #D4BC82;padding-bottom:6px;margin-top:20px">Medical History</h2>';
      bh += '<table style="width:100%;font-size:14px;border-collapse:collapse">';
      bh += '<tr><td style="padding:5px 8px;font-weight:bold;width:140px">Medical:</td><td style="padding:5px 8px">' + (data.medicalHistory || 'None reported') + '</td></tr>';
      bh += '<tr><td style="padding:5px 8px;font-weight:bold">Surgical:</td><td style="padding:5px 8px">' + (data.surgicalHistory || 'None reported') + '</td></tr>';
      bh += '<tr><td style="padding:5px 8px;font-weight:bold">Medications:</td><td style="padding:5px 8px">' + (data.medications || 'None reported') + '</td></tr>';
      bh += '<tr><td style="padding:5px 8px;font-weight:bold">Allergies:</td><td style="padding:5px 8px">' + (data.allergies || 'None reported') + '</td></tr>';
      if (data.clinicianNotes) bh += '<tr><td style="padding:5px 8px;font-weight:bold">Clinician Notes:</td><td style="padding:5px 8px">' + data.clinicianNotes + '</td></tr>';
      bh += '</table>';

      // Consents — full detail
      bh += '<h2 style="color:#2E5A46;font-size:16px;border-bottom:2px solid #D4BC82;padding-bottom:6px;margin-top:20px">Consent Forms</h2>';
      bh += '<table style="width:100%;font-size:14px;border-collapse:collapse">';
      bh += '<tr style="border-bottom:1px solid #eee"><td style="padding:8px"><b>Treatment Consent</b><br><span style="font-size:11px;color:#777">Informed Consent: risks, complications, indemnification, emergency authorization, scope of practice, dispute resolution</span></td><td style="padding:8px;text-align:center;width:90px">' + chk(con.treatment) + '</td></tr>';
      bh += '<tr style="border-bottom:1px solid #eee"><td style="padding:8px"><b>HIPAA Privacy</b><br><span style="font-size:11px;color:#777">Notice per 45 CFR Parts 160/164: uses/disclosures, patient rights, data security, breach notification</span></td><td style="padding:8px;text-align:center">' + chk(con.hipaa) + '</td></tr>';
      bh += '<tr style="border-bottom:1px solid #eee"><td style="padding:8px"><b>Medical History Release</b><br><span style="font-size:11px;color:#777">Authorization to collect, review, obtain, disclose medical records for treatment</span></td><td style="padding:8px;text-align:center">' + chk(con.medical) + '</td></tr>';
      bh += '<tr style="border-bottom:1px solid #eee"><td style="padding:8px"><b>Financial Agreement</b><br><span style="font-size:11px;color:#777">Payment terms, 24-hour cancellation, no-show fees, past due terms</span></td><td style="padding:8px;text-align:center">' + chk(con.financial) + '</td></tr>';
      bh += '</table>';

      // Signatures
      bh += '<h2 style="color:#2E5A46;font-size:16px;border-bottom:2px solid #D4BC82;padding-bottom:6px;margin-top:20px">Signatures</h2>';
      bh += '<table style="width:100%;font-size:14px;border-collapse:collapse">';
      var conSigDisplay = data.signature || 'Not provided';
      if (conSigDisplay === 'drawn-signature') conSigDisplay = '<em>Drawn signature (image on file)</em>';
      bh += '<tr><td style="padding:5px 8px;font-weight:bold;width:180px">Consent E-Signature:</td><td style="padding:5px 8px">' + conSigDisplay + '</td></tr>';
      bh += '<tr><td style="padding:5px 8px;font-weight:bold">Signature Type:</td><td style="padding:5px 8px">' + (data.signatureType || 'N/A') + '</td></tr>';
      bh += '<tr><td style="padding:5px 8px;font-weight:bold">Intake Acknowledged:</td><td style="padding:5px 8px">' + (data.intakeAcknowledged ? 'Yes' : 'No') + '</td></tr>';
      var iSigDisplay = data.intakeSignature || 'Not provided';
      if (iSigDisplay === 'drawn_intake_sig') iSigDisplay = '<em>Drawn signature (image on file)</em>';
      bh += '<tr><td style="padding:5px 8px;font-weight:bold">Intake Signature:</td><td style="padding:5px 8px">' + iSigDisplay + '</td></tr>';
      bh += '<tr><td style="padding:5px 8px;font-weight:bold">Intake Sig Type:</td><td style="padding:5px 8px">' + (data.intakeSignatureType || 'N/A') + '</td></tr>';
      bh += '</table>';

      // Payment
      bh += '<h2 style="color:#2E5A46;font-size:16px;border-bottom:2px solid #D4BC82;padding-bottom:6px;margin-top:20px">Payment</h2>';
      bh += '<p style="font-size:14px">Card: ' + (data.cardBrand || 'N/A') + ' ****' + (data.cardLast4 || 'N/A') + ' &nbsp;|&nbsp; Cardholder: ' + (data.cardHolderName || 'N/A') + '</p>';

      // Additional patients
      if (data.additionalPatients && data.additionalPatients.length) {
        bh += '<h2 style="color:#2E5A46;font-size:16px;border-bottom:2px solid #D4BC82;padding-bottom:6px;margin-top:20px">Additional Patients (' + data.additionalPatients.length + ')</h2>';
        data.additionalPatients.forEach(function (pt, i) {
          bh += '<div style="background:#f7f7f7;padding:12px;margin:8px 0;border-radius:6px">';
          bh += '<p style="font-weight:bold;margin:0 0 4px">Patient ' + (i + 2) + ': ' + (pt.fname || '') + ' ' + (pt.lname || '') + '</p>';
          bh += '<p style="margin:2px 0;font-size:13px">Services: ' + (pt.services && pt.services.length ? pt.services.join(', ') : 'Same') + '</p>';
          bh += '<p style="margin:2px 0;font-size:13px">Medical: ' + (pt.medicalHistory || 'None') + ' | Surgical: ' + (pt.surgicalHistory || 'None') + '</p>';
          bh += '<p style="margin:2px 0;font-size:13px">Medications: ' + (pt.medications || 'None') + ' | Allergies: ' + (pt.allergies || 'None') + '</p>';
          bh += '</div>';
        });
      }

      // Footer
      bh += '<div style="margin-top:16px;padding:10px;background:#f5f5f5;border-radius:6px;font-size:11px;color:#999">';
      bh += 'IntakeQ ID: ' + (clientId || 'N/A') + ' | Saved: ' + (iqOk ? 'YES' : 'FAILED') + ' | ' + now.toISOString();
      bh += '</div>';
      bh += '</div></div>';

      var bRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + resendKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'Healing Soulutions <bookings@healingsoulutions.care>',
          to: ['info@healingsoulutions.care'],
          subject: 'New Intake: ' + data.fname + ' ' + data.lname + ' — ' + (data.date || 'TBD'),
          html: bh,
          reply_to: data.email,
        }),
      });
      var bResBody = await bRes.text();
      L('BIZ EMAIL: HTTP ' + bRes.status + ' — ' + bResBody.substring(0, 200));
      bizOk = bRes.ok;
      if (!bRes.ok) L('BIZ EMAIL FAILED: ' + bResBody);
    } catch (be) {
      L('BIZ EMAIL ERROR: ' + be.message);
    }

    /* ════════════════════════════════════════════════
       PATIENT CONFIRMATION EMAIL — includes medical,
       consents, signatures
       ════════════════════════════════════════════════ */
    if (data.email) {
      try {
        L('Sending patient email to ' + data.email + '...');
        var ckp = function (v) { return v ? '&#10003;' : '&#10007;'; };

        var ph = '<div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;border:1px solid #ddd;border-radius:8px;overflow:hidden">';

        // Header
        ph += '<div style="background:#2E5A46;padding:24px;text-align:center">';
        ph += '<h1 style="color:#D4BC82;margin:0;font-size:22px">Booking Confirmed</h1>';
        ph += '<p style="color:rgba(255,255,255,0.7);margin:6px 0 0;font-size:13px">Healing Soulutions</p>';
        ph += '</div>';

        ph += '<div style="padding:20px">';
        ph += '<p style="font-size:16px;color:#333">Dear ' + data.fname + ',</p>';
        ph += '<p style="color:#555;line-height:1.6">Thank you for completing your intake. Our team will contact you within 24 hours to confirm your appointment.</p>';

        // Appointment
        ph += '<div style="background:#f9f9f9;border-left:4px solid #2E5A46;padding:16px;margin:16px 0;border-radius:8px">';
        ph += '<h3 style="color:#2E5A46;margin:0 0 10px;font-size:15px">Appointment Details</h3>';
        ph += '<p style="margin:4px 0"><b>Date:</b> ' + (data.date || 'TBD') + '</p>';
        ph += '<p style="margin:4px 0"><b>Time:</b> ' + (data.selTime || 'TBD') + '</p>';
        ph += '<p style="margin:4px 0"><b>Services:</b> ' + (data.services && data.services.length ? data.services.join(', ') : 'General Consultation') + '</p>';
        ph += '</div>';

        // Medical info on file
        ph += '<div style="background:#f9f9f9;padding:16px;margin:16px 0;border-radius:8px">';
        ph += '<h3 style="color:#2E5A46;margin:0 0 10px;font-size:15px">Your Medical Information on File</h3>';
        ph += '<p style="margin:4px 0"><b>Medical History:</b> ' + (data.medicalHistory || 'None reported') + '</p>';
        ph += '<p style="margin:4px 0"><b>Surgical History:</b> ' + (data.surgicalHistory || 'None reported') + '</p>';
        ph += '<p style="margin:4px 0"><b>Medications:</b> ' + (data.medications || 'None reported') + '</p>';
        ph += '<p style="margin:4px 0"><b>Allergies:</b> ' + (data.allergies || 'None reported') + '</p>';
        ph += '</div>';

        // Consents signed
        ph += '<div style="background:#f9f9f9;padding:16px;margin:16px 0;border-radius:8px">';
        ph += '<h3 style="color:#2E5A46;margin:0 0 10px;font-size:15px">Consent Forms Signed</h3>';
        ph += '<p style="margin:4px 0">' + ckp(con.treatment) + ' Informed Consent for Treatment</p>';
        ph += '<p style="margin:4px 0">' + ckp(con.hipaa) + ' HIPAA Notice of Privacy Practices</p>';
        ph += '<p style="margin:4px 0">' + ckp(con.medical) + ' Medical History Authorization &amp; Release</p>';
        ph += '<p style="margin:4px 0">' + ckp(con.financial) + ' Financial Agreement</p>';
        ph += '</div>';

        // Signature summary
        ph += '<div style="background:#f9f9f9;padding:16px;margin:16px 0;border-radius:8px">';
        ph += '<h3 style="color:#2E5A46;margin:0 0 10px;font-size:15px">Signatures</h3>';
        var pSigDisplay = data.signature || 'Not provided';
        if (pSigDisplay === 'drawn-signature') pSigDisplay = 'Drawn signature on file';
        ph += '<p style="margin:4px 0"><b>Consent E-Signature:</b> ' + pSigDisplay + '</p>';
        ph += '<p style="margin:4px 0"><b>Intake Acknowledgment:</b> ' + (data.intakeAcknowledged ? 'Acknowledged and signed' : 'Not acknowledged') + '</p>';
        ph += '</div>';

        // HIPAA secure box
        ph += '<div style="background:#FFF8E7;border:1px solid #D4BC82;padding:14px;margin:16px 0;border-radius:8px">';
        ph += '<p style="margin:0;color:#555;font-size:14px">&#10003; All consent forms signed and securely stored</p>';
        ph += '<p style="margin:4px 0 0;color:#999;font-size:12px">Records stored on HIPAA-compliant server</p>';
        ph += '</div>';

        // Payment
        ph += '<p style="font-size:13px;color:#999;margin:16px 0">Card on file: ' + (data.cardBrand || '') + ' ****' + (data.cardLast4 || 'N/A') + '</p>';

        // Contact
        ph += '<hr style="border:none;border-top:1px solid #eee;margin:20px 0">';
        ph += '<p style="color:#555;font-size:14px">Questions? Email <a href="mailto:info@healingsoulutions.care" style="color:#2E5A46">info@healingsoulutions.care</a> or call <a href="tel:5857472215" style="color:#2E5A46">(585) 747-2215</a></p>';
        ph += '</div>';

        // Footer
        ph += '<div style="background:#2E5A46;padding:12px;text-align:center;font-size:11px;color:rgba(255,255,255,0.5)">Healing Soulutions | Concierge Nursing Care</div>';
        ph += '</div>';

        var pRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Authorization': 'Bearer ' + resendKey, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: 'Healing Soulutions <bookings@healingsoulutions.care>',
            to: [data.email],
            subject: 'Booking Confirmed — Healing Soulutions',
            html: ph,
            reply_to: 'info@healingsoulutions.care',
          }),
        });
        var pResBody = await pRes.text();
        L('PATIENT EMAIL: HTTP ' + pRes.status + ' — ' + pResBody.substring(0, 200));
        patOk = pRes.ok;
        if (!pRes.ok) L('PATIENT EMAIL FAILED: ' + pResBody);
      } catch (pe) {
        L('PATIENT EMAIL ERROR: ' + pe.message);
      }
    }
  }

  /* ════════════════════════════════════════════════
     RESPONSE
     ════════════════════════════════════════════════ */
  L('DONE — IQ:' + iqOk + ' BizEmail:' + bizOk + ' PatientEmail:' + patOk);
  global._lastIQ = { ts: now.toISOString(), clientId: clientId, iqOk: iqOk, bizOk: bizOk, patOk: patOk, log: log };

  // Return 500 if IntakeQ save failed (when API key was set)
  if (apiKey && !iqOk) {
    return res.status(500).json({
      error: 'IntakeQ save failed.',
      iqOk: false, bizOk: bizOk, patOk: patOk,
      clientId: clientId,
      log: log,
    });
  }

  return res.status(200).json({
    success: true,
    iqOk: iqOk, bizOk: bizOk, patOk: patOk,
    clientId: clientId,
    log: log,
  });
}
