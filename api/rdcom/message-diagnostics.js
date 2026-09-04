const API_BASE = (process.env.RDCOM_API_BASE || 'https://platform.rdcom.com').replace(/\/$/, '');

async function rdcomGet(path, token) {
  const response = await fetch(`${API_BASE}${path}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json'
    }
  });

  const text = await response.text();
  let body;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = { raw: text.slice(0, 1000) };
  }

  if (!response.ok) {
    const error = new Error(`RDcom diagnostic request failed with HTTP ${response.status}.`);
    error.status = response.status;
    error.body = body;
    throw error;
  }

  return body;
}

function sanitizeMessages(payload) {
  const results = Array.isArray(payload?.results) ? payload.results : [];
  return results.slice(0, 20).map(message => ({
    recipient: message.recipient || null,
    status: message.status ?? null,
    sent: message.sent || null,
    clicked: message.clicked ?? null,
    uuid: message.uuid || null,
    type: message.type ?? null,
    source: message.source ?? message.job?.source ?? null
  }));
}

function sanitizeEvents(payload) {
  const results = Array.isArray(payload?.results) ? payload.results : [];
  return results.slice(0, 50).map(event => ({
    performed: event.performed || null,
    type: event.type || null,
    type_raw: event.type_raw || null,
    uuid: event.message?.uuid || null,
    recipient: event.message?.recipient || null,
    data: event.data || null
  }));
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const accountCode = process.env.RDCOM_ACCOUNT_CODE;
  const apiToken = process.env.RDCOM_API_TOKEN;

  if (!accountCode || !apiToken) {
    return res.status(503).json({ error: 'RDcom is not configured.' });
  }

  try {
    const encodedAccount = encodeURIComponent(accountCode);
    const [messages, events] = await Promise.all([
      rdcomGet(`/api/v2/${encodedAccount}/email/messages/`, apiToken),
      rdcomGet(`/api/v2/${encodedAccount}/email/messages/events/`, apiToken)
    ]);

    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({
      ok: true,
      messages: sanitizeMessages(messages),
      events: sanitizeEvents(events)
    });
  } catch (error) {
    console.error('RDcom diagnostics failed:', {
      message: error.message,
      status: error.status || null
    });
    return res.status(error.status || 502).json({
      error: 'Unable to retrieve RDcom diagnostics.',
      status: error.status || null,
      details: error.body || null
    });
  }
}
