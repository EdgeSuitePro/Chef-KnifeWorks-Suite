export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const apiToken = process.env.HELCIM_API_TOKEN;

  if (!apiToken) {
    return res.status(503).json({
      success: false,
      error: 'HELCIM_API_TOKEN is not configured on the server.'
    });
  }

  try {
    const response = await fetch('https://api.helcim.com/v2/connection-test', {
      method: 'GET',
      headers: {
        'api-token': apiToken,
        Accept: 'application/json'
      }
    });

    const rawBody = await response.text();
    let helcim;

    try {
      helcim = rawBody ? JSON.parse(rawBody) : null;
    } catch {
      helcim = rawBody || null;
    }

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        helcimStatus: response.status,
        error: 'Helcim connection test failed.',
        helcim
      });
    }

    return res.status(200).json({
      success: true,
      message: 'EdgeSuite Pro is authenticated with Helcim.',
      helcimStatus: response.status,
      helcim
    });
  } catch (error) {
    console.error('Helcim connection test error:', error);
    return res.status(502).json({
      success: false,
      error: 'Unable to reach Helcim.'
    });
  }
}
