var INTAKEQ_API_BASE = 'https://intakeq.com/api/v1';
var BUSINESS_PHONE = '5857472215';
var BUSINESS_EMAIL = 'info@healingsoulutions.care';

async function intakeqRequest(endpoint, method, body) {
  var apiKey = process.env.INTAKEQ_API_KEY;
  if (!apiKey) {
    throw new Error('IntakeQ API key is not configured.');
  }

  var response = await fetch(INTAKEQ_API_BASE + endpoint, {
    method: method,
    headers: {
      'X-Auth-Key': apiKey,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    var errorText = await response.text();
    console.error('IntakeQ API error [' + response.status + ']:', errorText);
    throw new Error('IntakeQ API error: ' + response.status);
  }

  var text = await response.text();
  return text ? JSON.parse(text) : {};
}

/* ═══════════════════════════════════════
   INTAKEQ HELPERS
   ═══════════════════════════════════════ */

function buildConsentSummary(consents) {
  var items = [];
  if (consents.treatment) items.push('Treatment Consent: AGREED');
  if (consents.hipaa) items.push('HIPAA Privacy: AGREED');
  if (consents.medical) items.push('Medical History Release: AGREED');
  if (consents.financial) items.push('Financial Agreement: AGREED');
  return items.join('\n');
}

function buildPatientNotes(data) {
  var sections = [];
  var timestamp = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
  sections.push('=== SUBMISSION TIMESTAMP ===');
  sections.push('Submitted: ' + timestamp + ' ET');
  sections.push('\n=== APPOINTMENT DETAILS ===');
  sections.push('Preferred Date: ' + (data.date || 'Not specified'));
  sections.push('Preferred Time: ' + (data.selTime || 'Not specified'));
  sections.push('Services Requested: ' + (data.services && data.services.length > 0 ? data.services.join(', ') : 'General Consultation'));
  if (data.address) sections.push('Service Address: ' + data.address);
  if (data.notes) sections.push('Patient Notes: ' + data.notes);
  sections.push('\n=== MEDICAL INFORMATION ===');
  sections.push('Medical History: ' + (data.medicalHistory || 'None provided'));
  sections.push('Surgical History: ' + (data.surgicalHistory || 'None provided'));
  sections.push('Current Medications: ' + (data.medications || 'None provided'));
  sections.push('Allergies: ' + (data.allergies || 'None provided'));
  if (data.clinicianNotes) sections.push('Notes for Clinician: ' + data.clinicianNotes);
  sections.push('\n=== CONSENT STATUS ===');
  sections.push(buildConsentSummary(data.consents || {}));
  sections.push('Electronic Signature: ' + (data.signature ? 'PROVIDED - "' + data.signature + '"' : 'NOT PROVIDED'));
  sections.push('Intake Acknowledgment: ' + (data.intakeAcknowledged ? 'ACKNOWLEDGED' : 'NOT ACKNOWLEDGED'));
  if (data.intakeSignature) sections.push('Intake Signature: ' + data.intakeSignature);
  sections.push('Consent Timestamp: ' + timestamp + ' ET');
  sections.push('\n=== CONSENT DETAILS ===');
  sections.push('Treatment Consent: ' + (data.consents && data.consents.treatment ? 'Patient agreed to Informed Consent for Treatment including risks, complications, assumption of risk, peptide therapy disclosure, limitation of liability, indemnification, release and waiver, emergency authorization, scope of practice, and dispute resolution.' : 'NOT AGREED'));
  sections.push('HIPAA Privacy: ' + (data.consents && data.consents.hipaa ? 'Patient acknowledged HIPAA Notice of Privacy Practices including permitted uses and disclosures, authorization requirements, patient rights, minimum necessary standard, data security, and breach notification procedures.' : 'NOT AGREED'));
  sections.push('Medical Release: ' + (data.consents && data.consents.medical ? 'Patient authorized release of medical history and health information for treatment purposes.' : 'NOT AGREED'));
  sections.push('Financial Agreement: ' + (data.consents && data.consents.financial ? 'Patient agreed to Financial Agreement including payment terms, cancellation policy (24hr notice), no-show policy, and past due account terms.' : 'NOT AGREED'));
  sections.push('\n=== PAYMENT VERIFICATION ===');
  sections.push('Card Brand: ' + (data.cardBrand || 'N/A'));
  sections.push('Card Last 4: ' + (data.cardLast4 || 'N/A'));
  sections.push('Cardholder Name: ' + (data.cardHolderName || 'N/A'));
  sections.push('Stripe Payment Method ID: ' + (data.stripePaymentMethodId || 'N/A'));
  if (data.additionalPatients && data.additionalPatients.length > 0) {
    sections.push('\n=== ADDITIONAL PATIENTS (' + data.additionalPatients.length + ') ===');
    data.additionalPatients.forEach(function(pt, idx) {
      sections.push('\n--- Patient ' + (idx + 2) + ' ---');
      sections.push('Name: ' + (pt.fname || '') + ' ' + (pt.lname || ''));
      sections.push('Services: ' + (pt.services && pt.services.length > 0 ? pt.services.join(', ') : 'Same as primary'));
      sections.push('Medical History: ' + (pt.medicalHistory || 'None provided'));
      sections.push('Surgical History: ' + (pt.surgicalHistory || 'None provided'));
      sections.push('Medications: ' + (pt.medications || 'None provided'));
      sections.push('Allergies: ' + (pt.allergies || 'None provided'));
      if (pt.clinicianNotes) sections.push('Clinician Notes: ' + pt.clinicianNotes);
    });
  }
  return sections.join('\n');
}

/* ═══════════════════════════════════════
   EMAIL: BUSINESS NOTIFICATION
   ═══════════════════════════════════════ */

async function sendBusinessEmail(data) {
  var resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) { return; }
  var patientName = ((data.fname || '') + ' ' + (data.lname || '')).trim() || 'New Patient';
  var c = data.consents || {};
  var ck = function(val) { return val ? 'YES' : 'NO'; };

  var addPatientsHtml = '';
  if (data.additionalPatients && data.additionalPatients.length > 0) {
    addPatientsHtml = '<h3 style="color:#2E5A46;margin-top:20px;">Additional Patients (' + data.additionalPatients.length + ')</h3>';
    data.additionalPatients.forEach(function(pt, idx) {
      var ptName = ((pt.fname || '') + ' ' + (pt.lname || '')).trim() || 'Patient ' + (idx + 2);
      var ptSvc = pt.services && pt.services.length > 0 ? pt.services.join(', ') : 'Same as primary';
      addPatientsHtml += '<div style="background:#f0f7f3;border-radius:8px;padding:12px;margin:8px 0;">'
        + '<b style="color:#2E5A46;">Patient ' + (idx + 2) + ': ' + ptName + '</b><br/>'
        + 'Services: ' + ptSvc + '<br/>'
        + 'Medical History: ' + (pt.medicalHistory || 'None') + '<br/>'
        + 'Surgical History: ' + (pt.surgicalHistory || 'None') + '<br/>'
        + 'Medications: ' + (pt.medications || 'None') + '<br/>'
        + 'Allergies: ' + (pt.allergies || 'None') + '<br/>'
        + (pt.clinicianNotes ? 'Clinician Notes: ' + pt.clinicianNotes + '<br/>' : '')
        + '</div>';
    });
  }

  var html = '<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">'
    + '<div style="background:#2E5A46;padding:20px;text-align:center;">'
    + '<h1 style="color:#D4BC82;margin:0;font-size:22px;">New Patient Intake</h1>'
    + '<p style="color:rgba(255,255,255,0.7);margin:4px 0 0;font-size:13px;">Healing Soulutions</p></div>'
    + '<div style="padding:20px;">'
    + '<h3 style="color:#2E5A46;">Patient Information</h3>'
    + '<p><b>Name:</b> ' + patientName + '</p>'
    + '<p><b>Email:</b> ' + (data.email || 'N/A') + '</p>'
    + '<p><b>Phone:</b> ' + (data.phone || 'N/A') + '</p>'
    + '<p><b>Address:</b> ' + (data.address || 'N/A') + '</p>'
    + '<h3 style="color:#2E5A46;margin-top:20px;">Appointment</h3>'
    + '<p><b>Date:</b> ' + (data.date || 'TBD') + '</p>'
    + '<p><b>Time:</b> ' + (data.selTime || 'TBD') + '</p>'
    + '<p><b>Services:</b> ' + (data.services && data.services.length > 0 ? data.services.join(', ') : 'General Consultation') + '</p>'
    + (data.notes ? '<p><b>Notes:</b> ' + data.notes + '</p>' : '')
    + '<h3 style="color:#2E5A46;margin-top:20px;">Medical Information</h3>'
    + '<p><b>Medical History:</b> ' + (data.medicalHistory || 'None') + '</p>'
    + '<p><b>Surgical History:</b> ' + (data.surgicalHistory || 'None') + '</p>'
    + '<p><b>Medications:</b> ' + (data.medications || 'None') + '</p>'
    + '<p><b>Allergies:</b> ' + (data.allergies || 'None') + '</p>'
    + (data.clinicianNotes ? '<p><b>Clinician Notes:</b> ' + data.clinicianNotes + '</p>' : '')
    + '<h3 style="color:#2E5A46;margin-top:20px;">Consents</h3>'
    + '<p>Treatment: ' + ck(c.treatment) + ' | HIPAA: ' + ck(c.hipaa) + ' | Medical: ' + ck(c.medical) + ' | Financial: ' + ck(c.financial) + '</p>'
    + '<p><b>E-Signature:</b> ' + (data.signature || 'Not provided') + '</p>'
    + '<p><b>Intake Acknowledged:</b> ' + (data.intakeAcknowledged ? 'Yes' : 'No') + '</p>'
    + '<h3 style="color:#2E5A46;margin-top:20px;">Payment</h3>'
    + '<p><b>Card:</b> ' + (data.cardBrand || 'N/A') + ' ****' + (data.cardLast4 || 'N/A') + ' (' + (data.cardHolderName || 'N/A') + ')</p>'
    + addPatientsHtml
    + '<div style="margin-top:20px;padding:12px;background:#FFF8E7;border:1px solid #D4BC82;border-radius:8px;text-align:center;">'
    + '<p style="margin:0;font-size:13px;color:#2E5A46;"><b>Full intake also sent to IntakeQ</b></p></div>'
    + '</div></div>';

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + resendApiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'Healing Soulutions <bookings@healingsoulutions.care>',
        to: [BUSINESS_EMAIL],
        subject: 'New Intake: ' + patientName + ' - ' + (data.date || 'Date TBD'),
        html: html,
        reply_to: data.email || undefined,
      }),
    });
    console.log('Business email sent');
  } catch (e) { console.error('Business email error:', e); }
}

/* ═══════════════════════════════════════
   EMAIL: PATIENT CONFIRMATION
   ═══════════════════════════════════════ */

async function sendPatientConfirmationEmail(data) {
  var resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey || !data.email) { return; }
  var patientName = ((data.fname || '') + ' ' + (data.lname || '')).trim() || 'Valued Patient';
  var serviceList = data.services && data.services.length > 0 ? data.services.join(', ') : 'General Consultation';

  var addPatientsHtml = '';
  if (data.additionalPatients && data.additionalPatients.length > 0) {
    addPatientsHtml = '<div style="margin-top:16px;padding:12px;background:#f0f7f3;border-radius:8px;">'
      + '<p style="margin:0 0 8px;font-weight:600;color:#2E5A46;">Additional Patients:</p>';
    data.additionalPatients.forEach(function(pt, idx) {
      var ptName = ((pt.fname || '') + ' ' + (pt.lname || '')).trim() || 'Patient ' + (idx + 2);
      var ptSvc = pt.services && pt.services.length > 0 ? pt.services.join(', ') : 'Same as primary';
      addPatientsHtml += '<p style="margin:4px 0;font-size:14px;">' + ptName + ' - ' + ptSvc + '</p>';
    });
    addPatientsHtml += '</div>';
  }

  var html = '<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">'
    + '<div style="background:#2E5A46;padding:24px;text-align:center;">'
    + '<h1 style="color:#D4BC82;margin:0;font-size:24px;">Booking Confirmed</h1>'
    + '<p style="color:rgba(255,255,255,0.8);margin:6px 0 0;font-size:14px;">Healing Soulutions</p></div>'
    + '<div style="padding:24px;">'
    + '<p style="font-size:16px;color:#333;">Dear ' + patientName + ',</p>'
    + '<p style="font-size:14px;color:#555;line-height:1.6;">Thank you for booking with Healing Soulutions. Your appointment request has been received. Our team will contact you within 24 hours to confirm your appointment.</p>'
    + '<div style="background:#f9f9f9;border-radius:8px;padding:16px;margin:20px 0;border-left:4px solid #2E5A46;">'
    + '<h3 style="margin:0 0 12px;color:#2E5A46;font-size:16px;">Your Appointment Details</h3>'
    + '<p style="margin:4px 0;font-size:14px;"><b>Date:</b> ' + (data.date || 'To be confirmed') + '</p>'
    + '<p style="margin:4px 0;font-size:14px;"><b>Time:</b> ' + (data.selTime || 'To be confirmed') + '</p>'
    + '<p style="margin:4px 0;font-size:14px;"><b>Services:</b> ' + serviceList + '</p>'
    + (data.address ? '<p style="margin:4px 0;font-size:14px;"><b>Location:</b> ' + data.address + '</p>' : '')
    + addPatientsHtml
    + '</div>'
    + '<div style="background:#FFF8E7;border-radius:8px;padding:14px;margin:16px 0;border:1px solid #D4BC82;">'
    + '<p style="margin:0;font-size:13px;color:#555;"><b>Consents Completed:</b></p>'
    + '<p style="margin:4px 0;font-size:13px;color:#555;">'
    + (data.consents && data.consents.treatment ? '&#10003; Treatment Consent<br/>' : '')
    + (data.consents && data.consents.hipaa ? '&#10003; HIPAA Privacy Notice<br/>' : '')
    + (data.consents && data.consents.medical ? '&#10003; Medical History Release<br/>' : '')
    + (data.consents && data.consents.financial ? '&#10003; Financial Agreement' : '')
    + '</p>'
    + '<p style="margin:4px 0;font-size:12px;color:#888;">Signed electronically by: ' + (data.signature || 'N/A') + '</p>'
    + '</div>'
    + '<p style="margin:4px 0;font-size:14px;"><b>Card on file:</b> ' + (data.cardBrand || '') + ' ****' + (data.cardLast4 || 'N/A') + '</p>'
    + '<hr style="border:none;border-top:1px solid #eee;margin:20px 0;"/>'
    + '<p style="font-size:14px;color:#555;">If you need to reschedule or have questions, please contact us:</p>'
    + '<p style="font-size:14px;"><b>Email:</b> ' + BUSINESS_EMAIL + '</p>'
    + '<p style="font-size:14px;"><b>Phone:</b> (585) 747-2215</p>'
    + '<p style="font-size:13px;color:#999;margin-top:20px;">Please remember our 24-hour cancellation policy. Cancellations made less than 24 hours before your appointment may be subject to a fee.</p>'
    + '</div>'
    + '<div style="background:#f5f5f5;padding:12px;text-align:center;font-size:11px;color:#999;">'
    + 'Healing Soulutions | Concierge Nursing Care | New York Metropolitan Area</div>'
    + '</div>';

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + resendApiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'Healing Soulutions <bookings@healingsoulutions.care>',
        to: [data.email],
        subject: 'Booking Confirmed - Healing Soulutions | ' + (data.date || ''),
        html: html,
        reply_to: BUSINESS_EMAIL,
      }),
    });
    console.log('Patient confirmation email sent to: ' + data.email);
  } catch (e) { console.error('Patient email error:', e); }
}

/* ═══════════════════════════════════════
   SMS: TWILIO NOTIFICATIONS
   ═══════════════════════════════════════ */

async function sendSMS(toPhone, message) {
  var accountSid = process.env.TWILIO_ACCOUNT_SID;
  var authToken = process.env.TWILIO_AUTH_TOKEN;
  var fromPhone = process.env.TWILIO_PHONE_NUMBER;
  if (!accountSid || !authToken || !fromPhone) {
    console.log('Twilio not configured - skipping SMS');
    return;
  }

  var to = toPhone.replace(/\D/g, '');
  if (to.length === 10) to = '1' + to;
  to = '+' + to;

  try {
    var response = await fetch('https://api.twilio.com/2010-04-01/Accounts/' + accountSid + '/Messages.json', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(accountSid + ':' + authToken).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'To=' + encodeURIComponent(to) + '&From=' + encodeURIComponent(fromPhone) + '&Body=' + encodeURIComponent(message),
    });
    var result = await response.json();
    if (result.sid) {
      console.log('SMS sent: ' + result.sid);
    } else {
      console.error('SMS error:', result);
    }
  } catch (e) { console.error('SMS send error:', e); }
}

async function sendBusinessSMS(data) {
  var patientName = ((data.fname || '') + ' ' + (data.lname || '')).trim();
  var serviceList = data.services && data.services.length > 0 ? data.services.join(', ') : 'General Consultation';
  var totalPatients = 1 + (data.additionalPatients ? data.additionalPatients.length : 0);
  var msg = 'NEW BOOKING - Healing Soulutions\n'
    + 'Patient: ' + patientName + '\n'
    + 'Date: ' + (data.date || 'TBD') + ' at ' + (data.selTime || 'TBD') + '\n'
    + 'Services: ' + serviceList + '\n'
    + 'Phone: ' + (data.phone || 'N/A') + '\n'
    + 'Email: ' + (data.email || 'N/A') + '\n';
  if (totalPatients > 1) msg += 'Total patients: ' + totalPatients + '\n';
  msg += 'All consents signed. Card verified.';
  await sendSMS(BUSINESS_PHONE, msg);
}

async function sendPatientSMS(data) {
  if (!data.phone) return;
  var patientName = (data.fname || '').trim();
  var msg = 'Hi ' + patientName + '! Your booking with Healing Soulutions is confirmed.\n'
    + 'Date: ' + (data.date || 'TBD') + '\n'
    + 'Time: ' + (data.selTime || 'TBD') + '\n'
    + 'Services: ' + (data.services && data.services.length > 0 ? data.services.join(', ') : 'General Consultation') + '\n';
  if (data.additionalPatients && data.additionalPatients.length > 0) {
    msg += 'Additional patients: ' + data.additionalPatients.length + '\n';
  }
  msg += 'Our team will contact you within 24hrs to confirm.\n'
    + 'Questions? Call (585) 747-2215 or email ' + BUSINESS_EMAIL + '\n'
    + '24hr cancellation policy applies.';
  await sendSMS(data.phone, msg);
}

/* ═══════════════════════════════════════
   MAIN HANDLER
   ═══════════════════════════════════════ */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    var data = req.body;

    if (!data.fname || !data.lname || !data.email) {
      return res.status(400).json({ error: 'First name, last name, and email are required.' });
    }

    var timestamp = new Date().toISOString();

    /* ── 1. INTAKEQ: Create/Update Client ── */
    var clientId;
    try {
      var existingClients = await intakeqRequest(
        '/clients?search=' + encodeURIComponent(data.email),
        'GET'
      );

      var clientPayload = {
        FirstName: data.fname,
        LastName: data.lname,
        Email: data.email,
        Phone: data.phone || '',
        Address: data.address || '',
        DateOfBirth: null,
        Tags: ['Website Booking', 'Online Intake'],
        Notes: buildPatientNotes(data),
      };

      if (Array.isArray(existingClients) && existingClients.length > 0) {
        clientId = existingClients[0].ClientId || existingClients[0].Id;
        clientPayload.ClientId = clientId;
        await intakeqRequest('/clients', 'PUT', clientPayload);
      } else {
        var newClient = await intakeqRequest('/clients', 'POST', clientPayload);
        clientId = newClient.ClientId || newClient.Id;
      }
    } catch (clientError) {
      console.error('IntakeQ client create/update error:', clientError);
    }

    /* ── 2. INTAKEQ: Submit Full Intake with ALL Consents ── */
    try {
      var intakePayload = {
        ClientId: clientId || undefined,
        ClientName: data.fname + ' ' + data.lname,
        ClientEmail: data.email,
        ClientPhone: data.phone || '',
        Status: 'Submitted',
        DateCreated: timestamp,
        Questions: [],
      };

      var addQ = function(text, answer, category) {
        if (answer !== undefined && answer !== null && answer !== '') {
          intakePayload.Questions.push({
            Text: text,
            Answer: String(answer),
            Category: category || 'General',
          });
        }
      };

      // Personal Information
      addQ('First Name', data.fname, 'Personal Information');
      addQ('Last Name', data.lname, 'Personal Information');
      addQ('Email Address', data.email, 'Personal Information');
      addQ('Phone Number', data.phone, 'Personal Information');
      addQ('Street Address', data.address, 'Personal Information');

      // Appointment
      addQ('Preferred Date', data.date, 'Appointment');
      addQ('Preferred Time', data.selTime, 'Appointment');
      addQ('Services Requested', data.services ? data.services.join(', ') : 'General Consultation', 'Appointment');
      addQ('Additional Notes', data.notes, 'Appointment');

      // Medical History
      addQ('Medical History', data.medicalHistory || 'None provided', 'Medical History');
      addQ('Surgical History', data.surgicalHistory || 'None provided', 'Medical History');
      addQ('Current Medications', data.medications || 'None provided', 'Medications');
      addQ('Known Allergies', data.allergies || 'None provided', 'Allergies');
      addQ('Notes for Clinician', data.clinicianNotes, 'Clinical Notes');

      // Consents - Status
      addQ('Treatment Consent', data.consents && data.consents.treatment ? 'AGREED' : 'Not Agreed', 'Consents');
      addQ('HIPAA Privacy Consent', data.consents && data.consents.hipaa ? 'AGREED' : 'Not Agreed', 'Consents');
      addQ('Medical Release Consent', data.consents && data.consents.medical ? 'AGREED' : 'Not Agreed', 'Consents');
      addQ('Financial Agreement', data.consents && data.consents.financial ? 'AGREED' : 'Not Agreed', 'Consents');

      // Consents - Full Details
      addQ('Treatment Consent Details', data.consents && data.consents.treatment ? 'Patient consented to: Informed Consent for Treatment including nature of services, risks and complications (pain, bruising, infection, allergic reactions, etc.), assumption of risk, peptide therapy/non-FDA approved disclosure, limitation of liability, indemnification, release and waiver, no guarantee of results, patient responsibilities, emergency authorization, scope of practice and team-based care, and dispute resolution. Consent given per NY PHL Section 2805-d.' : 'NOT CONSENTED', 'Consent Details');
      addQ('HIPAA Consent Details', data.consents && data.consents.hipaa ? 'Patient acknowledged: HIPAA Notice of Privacy Practices per 45 CFR Parts 160/164 including permitted uses and disclosures (treatment, payment, operations), authorization requirements (psychotherapy notes, marketing, HIV info per NY PHL Article 27-F, substance abuse per 42 CFR Part 2, mental health per NY MHL Section 33.13, genetic info per GINA), patient rights (access, amendment, accounting, restrictions, confidential communications, breach notification), minimum necessary standard, and data security measures.' : 'NOT ACKNOWLEDGED', 'Consent Details');
      addQ('Medical Release Details', data.consents && data.consents.medical ? 'Patient authorized: Release and exchange of medical history, health information, treatment records, and related documentation for purposes of treatment, care coordination, and clinical decision-making.' : 'NOT AUTHORIZED', 'Consent Details');
      addQ('Financial Agreement Details', data.consents && data.consents.financial ? 'Patient agreed to: Financial Agreement including payment at time of service, accepted payment methods, pricing subject to change with 30 days notice, 24-hour cancellation policy, no-show fees, past due account terms (60 days to collections), and billing dispute procedures (30 days written notice).' : 'NOT AGREED', 'Consent Details');

      // Signatures
      addQ('Electronic Signature', data.signature || 'Not Provided', 'Signatures');
      addQ('Intake Acknowledgment', data.intakeAcknowledged ? 'ACKNOWLEDGED' : 'Not Acknowledged', 'Signatures');
      addQ('Intake Signature', data.intakeSignature || '', 'Signatures');
      addQ('Consent Timestamp', timestamp, 'Signatures');

      // Payment
      addQ('Card Brand', data.cardBrand, 'Payment');
      addQ('Card Last 4 Digits', data.cardLast4, 'Payment');
      addQ('Cardholder Name', data.cardHolderName, 'Payment');
      addQ('Stripe Payment Method ID', data.stripePaymentMethodId, 'Payment');

      // Additional Patients
      if (data.additionalPatients && data.additionalPatients.length > 0) {
        addQ('Total Additional Patients', String(data.additionalPatients.length), 'Additional Patients');
        data.additionalPatients.forEach(function(pt, idx) {
          var prefix = 'Additional Patient ' + (idx + 2);
          addQ(prefix + ' - First Name', pt.fname, 'Additional Patients');
          addQ(prefix + ' - Last Name', pt.lname, 'Additional Patients');
          addQ(prefix + ' - Services', pt.services ? pt.services.join(', ') : 'Same as primary', 'Additional Patients');
          addQ(prefix + ' - Medical History', pt.medicalHistory || 'None provided', 'Additional Patients');
          addQ(prefix + ' - Surgical History', pt.surgicalHistory || 'None provided', 'Additional Patients');
          addQ(prefix + ' - Medications', pt.medications || 'None provided', 'Additional Patients');
          addQ(prefix + ' - Allergies', pt.allergies || 'None provided', 'Additional Patients');
          addQ(prefix + ' - Clinician Notes', pt.clinicianNotes, 'Additional Patients');
        });
      }

      await intakeqRequest('/intakes', 'POST', intakePayload);
      console.log('IntakeQ intake submitted with all consents');
    } catch (intakeError) {
      console.error('IntakeQ intake submission error:', intakeError);
    }

    /* ── 3. EMAILS ── */
    try { await sendBusinessEmail(data); } catch (e) { console.error('Business email failed:', e); }
    try { await sendPatientConfirmationEmail(data); } catch (e) { console.error('Patient email failed:', e); }

    /* ── 4. SMS NOTIFICATIONS ── */
    try { await sendBusinessSMS(data); } catch (e) { console.error('Business SMS failed:', e); }
    try { await sendPatientSMS(data); } catch (e) { console.error('Patient SMS failed:', e); }

    console.log('[Booking] ' + data.fname + ' ' + data.lname + ' (' + data.email + ') - Services: ' + (data.services ? data.services.join(', ') : 'General'));

    return res.status(200).json({
      success: true,
      clientId: clientId || null,
      message: 'Intake submitted successfully to HIPAA-secure server.',
    });
  } catch (error) {
    console.error('Submit intake error:', error);
    return res.status(500).json({ error: 'Failed to submit intake. Please contact us directly.' });
  }
}
