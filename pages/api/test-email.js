export default async function handler(req, res) {
  var apiKey = process.env.INTAKEQ_API_KEY;
  var results = {};

  try {
    var r1 = await fetch('https://intakeq.com/api/v1/clients', {
      method: 'POST',
      headers: { 'X-Auth-Key': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        FirstName: 'FullTest',
        LastName: 'Booking',
        Email: 'fulltest@healingsoulutions.care',
        Phone: '5551234567',
        Notes: 'Test booking with consents and signatures',
      }),
    });
    var t1 = await r1.text();
    results.client = { status: r1.status, ok: r1.ok, body: t1.substring(0, 300) };

    var clientData = t1 ? JSON.parse(t1) : {};
    var clientId = clientData.ClientId || clientData.Id;

    var r2 = await fetch('https://intakeq.com/api/v1/intakes', {
      method: 'POST',
      headers: { 'X-Auth-Key': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ClientId: clientId,
        ClientName: 'FullTest Booking',
        ClientEmail: 'fulltest@healingsoulutions.care',
        Status: 'Submitted',
        DateCreated: new Date().toISOString(),
        Questions: [
          { Text: 'First Name', Answer: 'FullTest', Category: 'Personal Information' },
          { Text: 'Treatment Consent', Answer: 'Agreed', Category: 'Consents' },
          { Text: 'Electronic Signature', Answer: 'FullTest Booking', Category: 'Signatures' },
        ],
      }),
    });
    var t2 = await r2.text();
    results.intake = { status: r2.status, ok: r2.ok, body: t2.substring(0, 300) };
  } catch (e) {
    results.error = e.message;
  }

  return res.status(200).json(results);
}
