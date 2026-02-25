export default async function handler(req, res) {
  var intakeqKey = process.env.INTAKEQ_API_KEY;
  var resendKey = process.env.RESEND_API_KEY;

  return res.status(200).json({
    intakeq: intakeqKey ? 'Found (' + intakeqKey.substring(0, 6) + '...)' : 'NOT FOUND',
    resend: resendKey ? 'Found (starts with re_: ' + resendKey.startsWith('re_') + ')' : 'NOT FOUND',
  });
}
