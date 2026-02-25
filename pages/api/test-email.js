export default async function handler(req, res) {
  var apiKey = process.env.INTAKEQ_API_KEY;

  try {
    var clientPayload = {
      FirstName: 'TestClaude',
      LastName: 'DebugPatient',
      Email: 'testdebug@healingsoulutions.care',
      Phone: '0000000000',
      Tags: ['Test', 'Debug'],
      Notes: 'This is a test client created for debugging.',
    };

    var response = await fetch('https://intakeq.com/api/v1/clients', {
      method: 'POST',
      headers: {
        'X-Auth-Key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(clientPayload),
    });

    var text = await response.text();

    return res.status(200).json({
      status: response.status,
      ok: response.ok,
      body: text.substring(0, 500),
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
