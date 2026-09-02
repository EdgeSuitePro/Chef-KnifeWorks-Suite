const escapeHtml = (value) => String(value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const slotLabels = {
  '08:00-09:00': '8–9 AM',
  '09:00-10:00': '9–10 AM',
  '10:00-11:00': '10–11 AM',
  '11:00-12:00': '11 AM–12 PM',
  '12:00-13:00': '12–1 PM',
  '13:00-14:00': '1–2 PM',
  '14:00-15:00': '2–3 PM',
  '15:00-16:00': '3–4 PM',
  '16:00-17:00': '4–5 PM',
  '17:00-18:00': '5–6 PM',
  '18:00-19:00': '6–7 PM',
  '19:00-20:00': '7–8 PM'
};

const parseLocalDate = (value) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value || ''));
  if (!match) return null;
  const [, year, month, day] = match;
  return new Date(Number(year), Number(month) - 1, Number(day), 12, 0, 0);
};

const formatDate = (value) => {
  const date = parseLocalDate(value);
  if (!date) return String(value || '');
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

export const buildBookingConfirmation = ({
  customerName,
  scheduledDate,
  arrivalSlot,
  estimatedItemCount,
  reference
}) => {
  const firstName = String(customerName || '').trim().split(/\s+/)[0] || 'there';
  const dateLabel = formatDate(scheduledDate);
  const slotLabel = slotLabels[arrivalSlot] || arrivalSlot;
  const itemLabel = `${estimatedItemCount} ${Number(estimatedItemCount) === 1 ? 'item' : 'items'}`;
  const subject = `Arrival reserved — ${dateLabel}, ${slotLabel}`;

  const text = [
    `Hi ${firstName},`,
    '',
    'Your Chef KnifeWorks arrival is reserved.',
    '',
    `${dateLabel}`,
    `${slotLabel}`,
    `${itemLabel}`,
    reference ? `Reference: ${reference}` : null,
    '',
    'Drop off during your expected arrival window. If you are a little early or late, that is okay.',
    '',
    'Chef KnifeWorks will inspect each knife and make it Chef-Grade Sharp. If significant repair or specialty work could change the price, we will contact you before proceeding.',
    '',
    'Most standard orders are completed in about 36–48 hours. We will contact you when your items are ready.',
    '',
    'Feel the Difference Sharp Can Make.',
    'Chef KnifeWorks'
  ].filter((line) => line !== null).join('\n');

  const html = `<!doctype html>
<html>
  <body style="margin:0;background:#111310;color:#f3eee3;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:600px;margin:0 auto;padding:32px 20px;">
      <div style="font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:#9aaa8b;font-weight:700;">Arrival Reserved</div>
      <h1 style="margin:10px 0 18px;font-size:30px;line-height:1.2;color:#f3eee3;">You’re on the schedule.</h1>
      <p style="font-size:16px;line-height:1.6;color:#d9d4ca;">Hi ${escapeHtml(firstName)},</p>
      <div style="border:1px solid #343832;border-radius:18px;padding:22px;margin:20px 0;background:#191c18;">
        <div style="font-size:13px;color:#989e94;text-transform:uppercase;letter-spacing:.12em;">Expected Arrival</div>
        <div style="font-size:24px;margin-top:10px;color:#f3eee3;font-weight:700;">${escapeHtml(dateLabel)}</div>
        <div style="font-size:34px;margin-top:4px;color:#a8b79a;font-weight:700;">${escapeHtml(slotLabel)}</div>
        <div style="font-size:16px;margin-top:12px;color:#d9d4ca;">${escapeHtml(itemLabel)}</div>
        ${reference ? `<div style="font-size:12px;margin-top:5px;color:#7f857c;text-transform:uppercase;letter-spacing:.12em;">Reference ${escapeHtml(reference)}</div>` : ''}
      </div>
      <p style="font-size:15px;line-height:1.7;color:#c7c2b8;">Drop off during your expected arrival window. If you’re a little early or late, that’s okay.</p>
      <p style="font-size:15px;line-height:1.7;color:#c7c2b8;">Chef KnifeWorks will inspect each knife and make it <strong style="color:#f3eee3;">Chef-Grade Sharp</strong>. If significant repair or specialty work could change the price, we’ll contact you before proceeding.</p>
      <p style="font-size:15px;line-height:1.7;color:#c7c2b8;">Most standard orders are completed in about 36–48 hours. We’ll contact you when your items are ready.</p>
      <div style="margin-top:28px;padding-top:18px;border-top:1px solid #343832;font-size:13px;color:#8e9489;">Feel the Difference Sharp Can Make.<br>Chef KnifeWorks</div>
    </div>
  </body>
</html>`;

  return { subject, text, html };
};
