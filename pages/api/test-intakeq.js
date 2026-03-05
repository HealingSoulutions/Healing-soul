import https from 'https';

function iq(path) {
  return new Promise(function(resolve) {
    var opts = {
      hostname: 'intakeq.com',
      path: '/api/v1' + path,
      method: 'GET',
      headers: { 'X-Auth-Key': process.env.INTAKEQ_API_KEY, 'Content-Type': 'application/json' }
    };
    var req = https.request(opts, function(resp) {
      var data = '';
      resp.on('data', function(chunk) { data += chunk; });
      resp.on('end', function() {
        var json = null;
        try { json = JSON.parse(data); } catch (e) {}
        resolve({ s: resp.statusCode, ok: resp.statusCode >= 200 && resp.statusCode < 300, d: json || data });
      });
    });
    req.on('error', function(e) { resolve({ s: 0, ok: false, d: e.message }); });
    req.end();
  });
}

export default async function handler(req, res) {
  try {
    var out = {};

    // List all clients
    var clients = await iq('/clients');
    if (clients.ok && Array.isArray(clients.d)) {
      out.totalClients = clients.d.length;
      out.recentClients = clients.d.slice(0, 10).map(function(c) {
        return {
          id: c.ClientId || c.Id,
          name: (c.FirstName || '') + ' ' + (c.LastName || ''),
          email: c.Email,
          created: c.DateCreated,
          lastActivity: c.LastActivityName
        };
      });

      // Check files for the most recent client
      if (out.recentClients.length > 0) {
        var topId = out.recentClients[0].id;
        var files = await iq('/files/' + topId);
        out.mostRecentClientFiles = { clientId: topId, status: files.s, data: files.d };
      }
    } else {
      out.clientsError = clients;
    }

    return res.status(200).json(out);
  } catch (err) {
    return res.status(200).json({ CRASHED: true, error: err.message });
  }
}
