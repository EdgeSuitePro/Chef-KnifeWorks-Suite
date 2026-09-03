const RDCOM_API_BASE = 'https://api.rdcom.com';

const required = (value, name) => {
  const normalized = String(value || '').trim();
  if (!normalized) throw new Error(`${name} is required.`);
  return normalized;
};

export const sendTransactionalEmail = async ({
  to,
  subject,
  html,
  text,
  senderEmail,
  senderName = 'Chef KnifeWorks'
}) => {
  const accountCode = required(process.env.RDCOM_ACCOUNT_CODE, 'RDCOM_ACCOUNT_CODE');
  const apiToken = required(process.env.RDCOM_API_TOKEN, 'RDCOM_API_TOKEN');
  const recipient = required(to, 'Recipient email');
  const from = required(senderEmail || process.env.RDCOM_SENDER_EMAIL, 'RDCOM_SENDER_EMAIL');

  const endpoint = `${RDCOM_API_BASE}/api/v2/${encodeURIComponent(accountCode)}/email/messages/transactional/`;
  const payload = {
    default: {
      from,
      from_name: senderName,
      subject,
      content: html,
      content_type: 'text/html'
    },
    specific: [
      {
        address: recipient
      }
    ]
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const raw = await response.text();
  let body = null;
  try {
    body = raw ? JSON.parse(raw) : null;
  } catch {
    body = raw || null;
  }

  if (!response.ok) {
    const error = new Error(`RDcom transactional email failed with HTTP ${response.status}.`);
    error.status = response.status;
    error.responseBody = body;
    throw error;
  }

  return { ok: true, status: response.status, body, textFallback: text };
};
