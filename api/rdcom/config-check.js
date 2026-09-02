const json = (res, status, body) => {
  res.status(status).setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return json(res, 405, { ok: false });
  }

  return json(res, 200, {
    ok: true,
    rdcomAccountCodePresent: Boolean(process.env.RDCOM_ACCOUNT_CODE),
    rdcomApiTokenPresent: Boolean(process.env.RDCOM_API_TOKEN)
  });
}
