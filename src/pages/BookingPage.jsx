import React, { useMemo, useState } from 'react';
import { addDays, format, isSameDay } from 'date-fns';
import { FiArrowLeft, FiArrowRight, FiCheck, FiMinus, FiPlus, FiShield } from 'react-icons/fi';

const SETMORE_FALLBACK = 'https://chefknifeworks.setmore.com/';
const dayparts = [
  { id: 'morning', label: 'Morning', time: '8 AM – 12 PM', slots: ['8–9 AM', '9–10 AM', '10–11 AM', '11 AM–12 PM'] },
  { id: 'midday', label: 'Mid-Day', time: '12 PM – 4 PM', slots: ['12–1 PM', '1–2 PM', '2–3 PM', '3–4 PM'] },
  { id: 'evening', label: 'Evening', time: '4 PM – 8 PM', slots: ['4–5 PM', '5–6 PM', '6–7 PM', '7–8 PM'] },
];
const instructionOptions = ['Broken tip', 'Chips / edge damage', 'Repair needed', 'Japanese / high-end knife', 'Whetstone sharpening only'];
const slotEndHour = { '8–9 AM': 9, '9–10 AM': 10, '10–11 AM': 11, '11 AM–12 PM': 12, '12–1 PM': 13, '1–2 PM': 14, '2–3 PM': 15, '3–4 PM': 16, '4–5 PM': 17, '5–6 PM': 18, '6–7 PM': 19, '7–8 PM': 20 };
const makeId = () => { const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join(''); };
const dateFromValue = value => new Date(`${value}T12:00:00`);
const initialsFrom = name => {
  const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return 'CK';
  return `${parts[0]?.[0] || ''}${parts.length > 1 ? parts[parts.length - 1]?.[0] || '' : ''}`.toUpperCase();
};
const friendlyReference = (name, dateValue) => {
  const date = dateValue ? dateFromValue(dateValue) : new Date();
  return `${initialsFrom(name)}-${format(date, 'EEE').toUpperCase()}${format(date, 'dd')}`;
};

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [confirmation, setConfirmation] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [selectedInstructions, setSelectedInstructions] = useState([]);
  const [otherInstruction, setOtherInstruction] = useState('');
  const [instructionStatus, setInstructionStatus] = useState('idle');
  const [instructionError, setInstructionError] = useState('');
  const [form, setForm] = useState({ date: '', window: '', slot: '', quantity: 6, name: '', phone: '', email: '' });
  const now = new Date();
  const dates = useMemo(() => Array.from({ length: 14 }, (_, i) => { const date = addDays(new Date(), i); return { value: format(date, 'yyyy-MM-dd'), label: format(date, i === 0 ? "'Today,' EEEE MMM d" : i === 1 ? "'Tomorrow,' EEEE MMM d" : 'EEEE, MMM d'), available: i !== 0 || new Date().getHours() < 20 }; }), []);
  const selectedDaypart = dayparts.find(d => d.id === form.window);
  const selectedDateLabel = dates.find(d => d.value === form.date)?.label;
  const selectedDate = form.date ? dateFromValue(form.date) : null;
  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }));
  const slotAvailable = slot => !selectedDate || !isSameDay(selectedDate, now) || now.getHours() < slotEndHour[slot];
  const choose = (key, value, next) => { update(key, value); setTimeout(() => setStep(next), 120); };
  const back = target => { setError(''); setStep(target); };
  const toggleInstruction = value => setSelectedInstructions(prev => prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]);

  const submit = async e => {
    e.preventDefault(); setStatus('saving'); setError('');
    const id = makeId();
    const reservation = { id, selectedDate: form.date, dropOffDate: format(dateFromValue(form.date), 'EEEE, MMMM d'), selectedSlot: form.slot, arrivalWindow: form.window, estimatedItemCount: Number(form.quantity), notes: '', status: 'booked', createdAt: new Date().toISOString(), source: 'ckw-website' };
    try {
      const response = await fetch('/api/reservations/book', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ customer: { name: form.name, phone: form.phone, email: form.email }, reservation }) });
      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) throw new Error('Booking API did not return JSON.');
      const data = await response.json();
      if (!response.ok || !data?.success) throw new Error(data?.error || `Booking request failed (${response.status}).`);
      setConfirmation({ id: data.reservationId || id, orderPass: data.orderPass, dateValue: form.date, date: format(dateFromValue(form.date), 'EEEE, MMMM d'), slot: form.slot, quantity: form.quantity, reference: friendlyReference(form.name, form.date) });
      setStatus('saved'); setStep(7);
    } catch (err) { setStatus('error'); setError(err.message || 'We could not save your reservation.'); }
  };

  const saveInstructions = async () => {
    if (!confirmation?.id || !confirmation?.orderPass) return;
    if (!selectedInstructions.length && !otherInstruction.trim()) {
      setInstructionError('Choose an instruction or add a note.');
      return;
    }
    setInstructionStatus('saving'); setInstructionError('');
    try {
      const response = await fetch('/api/reservations/instructions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ reservationId: confirmation.id, orderPass: confirmation.orderPass, instructions: selectedInstructions, other: otherInstruction })
      });
      const data = await response.json();
      if (!response.ok || !data?.success) throw new Error(data?.error || 'We could not save your instructions.');
      setInstructionStatus('saved');
    } catch (err) {
      setInstructionStatus('error');
      setInstructionError(err.message || 'We could not save your instructions.');
    }
  };

  const card = children => <section className="w-full max-w-xl rounded-3xl border border-white/10 bg-white/[0.035] p-5 sm:p-8 shadow-2xl">{children}</section>;
  const title = (eyebrow, heading, copy) => <div className="text-center mb-6"><p className="text-[11px] font-bold uppercase tracking-[0.24em] text-honed-sage mb-2">{eyebrow}</p><h2 className="font-serif text-3xl sm:text-4xl leading-tight mb-2">{heading}</h2>{copy && <p className="text-white/55 text-sm sm:text-base leading-6">{copy}</p>}</div>;
  const option = (label, sub, onClick, disabled = false) => <button disabled={disabled} onClick={onClick} className="w-full rounded-2xl border border-white/10 bg-carbon-black px-5 py-4 text-left hover:border-honed-sage hover:bg-honed-sage/5 active:scale-[.99] transition disabled:opacity-30 disabled:cursor-not-allowed"><span className="font-semibold text-base">{label}</span>{sub && <span className="block text-xs text-white/45 mt-1">{sub}</span>}</button>;

  return <div className="bg-carbon-black text-whetstone-cream min-h-[calc(100dvh-72px)]">
    <div className="mx-auto max-w-3xl px-4 sm:px-6 min-h-[calc(100dvh-72px)] flex flex-col">
      {step < 7 && <div className="pt-4 sm:pt-6"><div className="h-1 rounded-full bg-white/10 overflow-hidden"><div className="h-full bg-honed-sage transition-all duration-300" style={{ width: `${(step / 6) * 100}%` }} /></div><div className="mt-2 text-center text-[10px] uppercase tracking-[0.2em] text-white/35">Book Your Arrival · Step {step} of 6</div></div>}
      <main className="flex-1 flex items-center justify-center py-4 sm:py-8">
        {step === 1 && card(<>{title('Book Your Arrival', 'What day works best?', 'The drop box is available daily from 8 AM to 8 PM.')}<div className="max-h-[55dvh] overflow-y-auto space-y-2 pr-1">{dates.map(d => option(d.label, d.available ? null : 'Today’s arrival windows have ended', () => choose('date', d.value, 2), !d.available))}</div></>)}
        {step === 2 && card(<><button onClick={() => back(1)} className="text-white/45 hover:text-white text-sm inline-flex items-center gap-2 mb-4"><FiArrowLeft/> Change day</button>{title(selectedDateLabel, 'What part of the day works best?', 'Choose a general time first. We’ll narrow it down next.')}<div className="space-y-3">{dayparts.map(d => { const anyAvailable = d.slots.some(slotAvailable); return option(d.label, d.time, () => choose('window', d.id, 3), !anyAvailable); })}</div></>)}
        {step === 3 && card(<><button onClick={() => back(2)} className="text-white/45 hover:text-white text-sm inline-flex items-center gap-2 mb-4"><FiArrowLeft/> Change time of day</button>{title(selectedDaypart?.label, 'About what time will you arrive?', 'No need to arrive at an exact time. Pick the one-hour window that best matches your plans.')}<div className="grid grid-cols-2 gap-3">{selectedDaypart?.slots.map(slot => option(slot, slotAvailable(slot) ? null : 'This window has passed', () => choose('slot', slot, 4), !slotAvailable(slot)))}</div></>)}
        {step === 4 && card(<><button onClick={() => back(3)} className="text-white/45 hover:text-white text-sm inline-flex items-center gap-2 mb-4"><FiArrowLeft/> Change arrival time</button>{title('Your Bundle', 'About how many items?', 'An estimate is perfect. We’ll confirm everything after drop-off.')}<div className="flex items-center justify-center gap-7 my-8"><button aria-label="Remove one item" onClick={() => update('quantity', Math.max(1, Number(form.quantity) - 1))} className="w-14 h-14 rounded-full border border-white/15 flex items-center justify-center hover:border-honed-sage"><FiMinus/></button><div className="font-serif text-6xl min-w-20 text-center">{form.quantity}</div><button aria-label="Add one item" onClick={() => update('quantity', Math.min(100, Number(form.quantity) + 1))} className="w-14 h-14 rounded-full border border-white/15 flex items-center justify-center hover:border-honed-sage"><FiPlus/></button></div><div className="rounded-2xl border border-white/10 bg-carbon-black/60 p-4 mb-5 text-sm text-white/55 leading-6"><strong className="text-white/80">One professional standard: Chef-Grade Sharp.</strong><br/>You don’t need to choose a sharpening level. We’ll inspect your knives and use the right process for each one. If significant repair or specialty work could change the price, we’ll contact you before proceeding.</div><button onClick={() => setStep(5)} className="w-full rounded-full bg-honed-sage px-6 py-4 font-bold hover:bg-damascus-bronze transition">Continue <FiArrowRight className="inline ml-2"/></button></>)}
        {step === 5 && card(<><button onClick={() => back(4)} className="text-white/45 hover:text-white text-sm inline-flex items-center gap-2 mb-4"><FiArrowLeft/> Change item count</button>{title('Almost There', 'Who are we sharpening for?', 'We’ll use this information only to manage your order and keep you updated.')}<div className="space-y-3"><input autoComplete="name" value={form.name} onChange={e => update('name', e.target.value)} className="w-full px-4 py-3.5 rounded-xl" placeholder="Your name"/><input type="tel" inputMode="tel" autoComplete="tel" value={form.phone} onChange={e => update('phone', e.target.value)} className="w-full px-4 py-3.5 rounded-xl" placeholder="Mobile phone"/><input type="email" inputMode="email" autoComplete="email" value={form.email} onChange={e => update('email', e.target.value)} className="w-full px-4 py-3.5 rounded-xl" placeholder="Email address"/><button disabled={!form.name.trim() || !form.phone.trim() || !form.email.trim()} onClick={() => setStep(6)} className="w-full rounded-full bg-honed-sage px-6 py-4 font-bold disabled:opacity-40">Review My Arrival <FiArrowRight className="inline ml-2"/></button></div></>)}
        {step === 6 && card(<><button onClick={() => back(5)} className="text-white/45 hover:text-white text-sm inline-flex items-center gap-2 mb-4"><FiArrowLeft/> Edit details</button>{title('Ready to Go', 'Confirm your arrival', 'One quick look, then you’re on the schedule.')}<div className="rounded-2xl bg-carbon-black border border-white/10 divide-y divide-white/10 mb-5"><div className="p-5 text-center"><span className="text-white/40 text-xs uppercase tracking-wider">Expected Arrival</span><div className="font-serif text-3xl sm:text-4xl mt-3 text-white">{form.date && format(dateFromValue(form.date), 'EEEE, MMMM d')}</div><div className="font-serif text-5xl sm:text-6xl text-honed-sage mt-2">{form.slot}</div></div><div className="p-4 flex justify-between"><span className="text-white/50">Items</span><strong>{form.quantity}</strong></div></div><div className="rounded-2xl border border-white/10 p-4 mb-5 text-sm text-white/55 leading-6">You don’t need to choose a sharpening tier. Chef KnifeWorks will inspect each knife and make it <strong className="text-white/80">Chef-Grade Sharp</strong>. If significant repair or specialty work could change the price, we’ll contact you before proceeding.</div><form onSubmit={submit}><p className="text-xs leading-5 text-white/40 mb-4">By reserving, you agree to receive service-related messages about this order. Marketing messages are not enabled by this reservation.</p>{error && <div className="rounded-2xl border border-damascus-bronze/40 bg-damascus-bronze/10 p-4 text-sm mb-4"><strong>We couldn’t save this reservation yet.</strong><div className="text-white/65 mt-1">{error}</div><a href={SETMORE_FALLBACK} className="inline-block mt-3 underline">Use our current booking page instead</a></div>}<button disabled={status === 'saving'} type="submit" className="w-full rounded-full bg-honed-sage px-6 py-4 font-bold hover:bg-damascus-bronze disabled:opacity-60 transition">{status === 'saving' ? 'Saving your arrival…' : <>Reserve My Arrival <FiArrowRight className="inline ml-2"/></>}</button></form></>)}
        {step === 7 && confirmation && card(<div className="text-center"><div className="w-14 h-14 rounded-full bg-honed-sage flex items-center justify-center mx-auto mb-5"><FiCheck size={26}/></div><p className="text-xs uppercase tracking-[0.24em] text-honed-sage font-bold mb-2">Arrival Reserved</p><h2 className="font-serif text-3xl sm:text-4xl mb-5">You’re on the schedule.</h2><div className="font-serif text-4xl sm:text-5xl text-white leading-tight">{confirmation.date}</div><div className="font-serif text-6xl sm:text-7xl text-honed-sage mt-3 mb-2 leading-none">{confirmation.slot}</div><p className="text-white/60 mb-6">{confirmation.quantity} items</p><div className="rounded-2xl border border-white/10 bg-carbon-black p-5 text-left"><p className="text-sm text-white/60 leading-6">Drop off during your expected arrival window. If you’re a little early or late, that’s okay. We’ll contact you when your items are ready; most standard orders take about 36–48 hours.</p><div className="mt-4 flex items-start gap-2 text-xs text-white/45"><FiShield className="mt-0.5 shrink-0"/> Your phone and email are your primary reservation identifiers. No code to memorize.</div></div><div className="mt-4 text-[10px] uppercase tracking-[0.18em] text-white/30">Reference {confirmation.reference}</div><div className="mt-6 rounded-2xl border border-honed-sage/25 bg-honed-sage/5 p-4 text-left"><button onClick={() => setShowInstructions(v => !v)} className="w-full text-left"><span className="block text-base font-semibold text-white">Any instructions for the sharpener?</span><span className="block text-xs text-white/45 mt-1">Optional — add anything important about your knives.</span></button>{showInstructions && <div className="mt-4"><button onClick={() => { setSelectedInstructions([]); setOtherInstruction(''); setShowInstructions(false); }} className="w-full rounded-xl border border-white/10 px-4 py-3 text-left text-sm hover:border-honed-sage"><strong>No special instructions — Chef-Grade Sharp, please.</strong></button><div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">{instructionOptions.map(item => <button key={item} onClick={() => toggleInstruction(item)} className={`rounded-xl border px-4 py-3 text-left text-sm transition ${selectedInstructions.includes(item) ? 'border-honed-sage bg-honed-sage/10 text-white' : 'border-white/10 text-white/70 hover:border-honed-sage'}`}>{selectedInstructions.includes(item) ? '✓ ' : ''}{item}</button>)}</div><textarea rows="3" value={otherInstruction} onChange={e => setOtherInstruction(e.target.value)} className="w-full px-4 py-3 rounded-xl mt-3" placeholder="Other instructions…"/>{instructionError && <p className="text-xs text-damascus-bronze mt-2">{instructionError}</p>}{instructionStatus === 'saved' ? <div className="mt-3 rounded-xl border border-honed-sage/30 bg-honed-sage/10 px-4 py-3 text-sm text-white">✓ Instructions saved to your reservation.</div> : <button onClick={saveInstructions} disabled={instructionStatus === 'saving'} className="mt-3 w-full rounded-full bg-honed-sage px-5 py-3 font-bold disabled:opacity-50">{instructionStatus === 'saving' ? 'Saving…' : 'Save Instructions'}</button>}</div>}</div></div>)}
      </main>
    </div>
  </div>;
}
