export default async function handler(req, res) {
  var apiKey = process.env.INTAKEQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'No INTAKEQ_API_KEY' });
  }

  try {
    var response = await fetch('https://intakeq.com/api/v1/clients?search=test@test.com', {
      method: 'GET',
      headers: {
        'X-Auth-Key': apiKey,
        'Content-Type': 'application/json',
      },
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
