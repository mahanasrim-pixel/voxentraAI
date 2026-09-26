/**
 * VOXENTRA Server-Sent Events (SSE) Service
 * Real-time event broadcasting for Midnight Civic Command Center & City Pulse
 */

const clients = new Set();

function addClient(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*'
  });

  res.write(`data: ${JSON.stringify({ type: 'connected', time: new Date().toISOString() })}\n\n`);

  clients.add(res);

  req.on('close', () => {
    clients.delete(res);
  });
}

function broadcast(eventType, data) {
  const payload = JSON.stringify({ type: eventType, data, timestamp: new Date().toISOString() });
  for (const client of clients) {
    try {
      client.write(`data: ${payload}\n\n`);
    } catch {
      clients.delete(client);
    }
  }
}

module.exports = {
  addClient,
  broadcast,
  getClientCount: () => clients.size
};
