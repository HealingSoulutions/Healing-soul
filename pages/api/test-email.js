export default async function handler(req, res) {
  var apiKey = process.env.INTAKEQ_API_KEY;
  var results = {};

  try {
    var searchRes = await fetch('https://intakeq.com/api/v1/clients?search=' + encodeURIComponent('newtest@test.com'), {
      method: 'GET',
      headers: { 'X-Auth-Key': apiKey, 'Content-Type': 'application/json' },
    });
    var searchText = await searchRes.text();
    results.search = { status: searchRes.status, body: searchText.substring(0, 200) };

    var clientPayload = {
      FirstName: 'RealFlow',
      LastName: 'Test',
      Email: 'newtest@test.com',
      Phone: '5551234567',
      Address: '123 Test St',
      DateOfBirth: null,
      Tags: ['Website Booking', 'Online Intake'],
      Notes: 'Test notes - short version',
    };

    var createRes = await fetch('https://intakeq.com/api/v1/clients', {
      method: 'POST',
      headers: { 'X-Auth-Key': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify(clientPayload),
    });
    var createText = await createRes.text();
    results.create = { status: createRes.status, ok: createRes.ok, body: createText.substring(0, 300) };
  } catch (e) {
    results.error = e.message;
  }

  return res.status(200).json(results);
}
