export default async function handler(req, res) {
  var apiKey = process.env.INTAKEQ_API_KEY;
  try {
    var r = await fetch('https://intakeq.com/api/v1/clients', {
      method: 'POST',
      headers: { 'X-Auth-Key': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        FirstName: 'FieldTest',
        LastName: 'Feb26',
        Email: 'fieldtest226@test.com',
        Phone: '0000000000',
        Notes: 'NOTES TEST',
        AdditionalInformation: 'ADDINFO TEST',
        Comment: 'COMMENT TEST',
        ClientNotes: 'CLIENTNOTES TEST',
      }),
    });
    var t = await r.text();
    var r2 = await fetch('https://intakeq.com/api/v1/clients?search=fieldtest226@test.com', {
      method: 'GET',
      headers: { 'X-Auth-Key': apiKey },
    });
    var t2 = await r2.text();
    return res.status(200).json({ createStatus: r.status, created: t.substring(0, 500), fetched: t2.substring(0, 500) });
  } catch (e) {
    return res.status(200).json({ error: e.message });
  }
}
