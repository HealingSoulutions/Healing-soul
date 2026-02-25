export default async function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({ message: 'Visit /api/submit-intake to test bookings. Last error shown here after a booking attempt.' });
  }
  return res.status(200).json({ message: 'ok' });
}
```

Actually — simpler approach. Let's verify the current `submit-intake.js` is deployed correctly. Visit:
```
https://healingsoulutions.care/api/submit-intake
