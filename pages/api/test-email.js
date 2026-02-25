export default async function handler(req, res) {
  var apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'RESEND_API_KEY not found' });
  }

  try {
    var response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Healing Soulutions <bookings@healingsoulutions.care>',
        to: ['info@healingsoulutions.care'],
        subject: 'Test Email - Healing Soulutions',
        html: '<h1>This is a test!</h1><p>If you see this, email notifications are working.</p>',
      }),
    });

    var result = await response.json();

    if (!response.ok) {
      return res.status(400).json({ error: 'Resend error', status: response.status, details: result });
    }

    return res.status(200).json({ success: true, message: 'Email sent!', emailId: result.id });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
