const INTAKEQ_API_BASE = 'https://intakeq.com/api/v1';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({ lastPost: global._lastPost || 'no posts yet' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.INTAKEQ_API_KEY;
  const data = req.body;

  global._lastPost = {
    time: new Date().toISOString(),
    hasData: !!data,
    hasKey: !!apiKey,
    fname: data ? data.fname : 'no data',
    lname: data ? data.lname : 'no data',
    email: data ? data.email : 'no data',
  };

  let clientId = null;
  let error = null;
  try {
    const r = await fetch(INTAKEQ_API_BASE + '/clients', {
      method: 'POST',
      headers: { 'X-Auth-Key': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        FirstName: data.fname || 'Unknown',
        LastName: data.lname || 'Unknown',
        Email: data.email || 'none@none.com',
        Phone: data.phone || '',
        Notes: 'Booking test',
      }),
    });
    const t = await r.text();
    if (r.ok) {
      const parsed = JSON.parse(t);
      clientId = parsed.ClientId || parsed.Id;
    } else {
      error = 'IntakeQ ' + r.status + ': ' + t.substring(0, 100);
    }
  } catch (e) {
    error = e.message;
  }

  return res.status(200).json({ success: true, clientId: clientId, error: error });
}
