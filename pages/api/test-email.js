export default async function handler(req, res) {
  var apiKey = process.env.INTAKEQ_API_KEY;

  try {
    var intakePayload = {
      ClientName: 'Test Patient',
      ClientEmail: 'test@healingsoulutions.care',
      ClientPhone: '0000000000',
      Status: 'Submitted',
      DateCreated: new Date().toISOString(),
      Questions: [
        { Text: 'First Name', Answer: 'Test', Category: 'Personal Information' },
        { Text: 'Last Name', Answer: 'Patient', Category: 'Personal Information' },
      ],
    };

    var response = await fetch('https://intakeq.com/api/v1/intakes', {
      method: 'POST',
      headers: {
        'X-Auth-Key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(intakePayload),
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
