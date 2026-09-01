import React, { useMemo, useState } from 'react';
import { addDays, format } from 'date-fns';
import { FiArrowLeft, FiArrowRight, FiCalendar, FiCheck, FiClock, FiShield } from 'react-icons/fi';

const SETMORE_FALLBACK = 'https://chefknifeworks.setmore.com/';

const windows = [
  { id: 'morning', label: 'Morning', time: '8:00 AM – 12:00 PM' },
  { id: 'midday', label: 'Mid-Day', time: '12:00 PM – 4:00 PM' },
  { id: 'evening', label: 'Evening', time: '4:00 PM – 7:00 PM' },
];

const makeId = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [confirmation, setConfirmation] = useState(null);
  const [form, setForm] = useState({ date: '', window: '', name: '', phone: '', email: '', quantity: '', notes: '' });

  const dates = useMemo(() => Array.from({ length: 14 }, (_, i) => {
    const date = addDays(new Date(), i);
    return { value: format(date, 'yyyy-MM-dd'), label: format(date, i === 0 ? "'Today,' EEEE MMM d" : i === 1 ? "'Tomorrow,' EEEE MMM d" : 'EEEE, MMM d') };
  }), []);

  const selectedWindow = windows.find(w => w.id === form.window);
  const selectedDateLabel = dates.find(d => d.value === form.date)?.label;
  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const submit = async (e) => {
    e.preventDefault();
    setStatus('saving');
    setError('');
    const id = makeId();
    const pickup = format(addDays(new Date(`${form.date}T12:00:00`), 2), 'EEEE, MMMM d');
    const reservation = {
      id,
      selectedDate: form.date,
      dropOffDate: format(new Date(`${form.date}T12:00:00`), 'EEEE, MMMM d'),
      selectedSlot: `${selectedWindow.label} · ${selectedWindow.time}`,
      arrivalWindow: form.window,
      estimatedItemCount: Number(form.quantity),
      pickupDate: pickup,
      notes: form.notes,
      status: 'booked',
      createdAt: new Date().toISOString(),
      source: 'ckw-website'
    };

    try {
      const response = await fetch('/api/reservations/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ customer: { name: form.name, phone: form.phone, email: form.email }, reservation })
      });
      const contentType = response.headers.get('content-type') || '';
      if (!response.ok || !contentType.includes('application/json')) throw new Error('Booking service is not connected yet.');
      const data = await response.json();
      if (!data?.success) throw new Error('Booking service did not confirm the reservation.');
      setConfirmation({ id: data.reservationId || id, date: selectedDateLabel, window: selectedWindow.label, pickup });
      setStatus('saved');
      setStep(4);
    } catch (err) {
      setStatus('error');
      setError(err.message || 'We could not save your reservation.');
    }
  };

  return (
    <div className="bg-carbon-black text-whetstone-cream min-h-[78vh]">
      <div className="max-w-4xl mx-auto px-5 sm:px-8 py-12 md:py-20">
        <div className="mb-10">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-honed-sage mb-3">Book Your Arrival</p>
          <h1 className="font-serif text-4xl md:text-6xl leading-[1.1] mb-4">Reserve your sharpening drop-off.</h1>
          <p className="text-white/65 text-lg leading-8 max-w-2xl">You are reserving an arrival window, not waiting around for an appointment. Drop off the items you need sharpened, and we’ll take it from there.</p>
        </div>

        {step < 4 && <div className="grid grid-cols-3 gap-3 mb-8 text-xs uppercase tracking-wider">{['Day', 'Arrival', 'Details'].map((label, i) => <div key={label} className={`rounded-full px-4 py-2 text-center border ${step === i + 1 ? 'border-honed-sage bg-honed-sage/15 text-whetstone-cream' : step > i + 1 ? 'border-honed-sage/40 text-honed-sage' : 'border-white/10 text-white/35'}`}>{label}</div>)}</div>}

        {step === 1 && <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 md:p-9"><div className="flex items-center gap-3 mb-7"><FiCalendar className="text-honed-sage"/><h2 className="font-serif text-2xl">Choose a drop-off day</h2></div><div className="grid sm:grid-cols-2 gap-3">{dates.map(d => <button key={d.value} onClick={() => { update('date', d.value); setStep(2); }} className="text-left rounded-2xl border border-white/10 bg-carbon-black px-5 py-4 hover:border-honed-sage hover:bg-honed-sage/5 transition-colors"><span className="font-semibold">{d.label}</span></button>)}</div></section>}

        {step === 2 && <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 md:p-9"><button onClick={() => setStep(1)} className="flex items-center gap-2 text-sm text-white/55 hover:text-white mb-6"><FiArrowLeft/> Change day</button><div className="flex items-center gap-3 mb-2"><FiClock className="text-honed-sage"/><h2 className="font-serif text-2xl">Choose your arrival window</h2></div><p className="text-white/50 mb-7">{selectedDateLabel}</p><div className="grid md:grid-cols-3 gap-4">{windows.map(w => <button key={w.id} onClick={() => { update('window', w.id); setStep(3); }} className="rounded-2xl border border-white/10 bg-carbon-black p-6 text-left hover:border-honed-sage hover:bg-honed-sage/5 transition-colors"><div className="font-serif text-2xl mb-2">{w.label}</div><div className="text-white/50">{w.time}</div></button>)}</div></section>}

        {step === 3 && <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 md:p-9"><button onClick={() => setStep(2)} className="flex items-center gap-2 text-sm text-white/55 hover:text-white mb-6"><FiArrowLeft/> Change arrival</button><h2 className="font-serif text-2xl mb-2">Tell us where to send your confirmation</h2><p className="text-white/50 mb-7">{selectedDateLabel} · {selectedWindow?.label}</p><form onSubmit={submit} className="space-y-5"><div className="grid md:grid-cols-2 gap-5"><label className="text-sm">Name *<input required value={form.name} onChange={e => update('name', e.target.value)} className="mt-2 w-full px-4 py-3" placeholder="Your name" /></label><label className="text-sm">Mobile phone *<input required type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} className="mt-2 w-full px-4 py-3" placeholder="(612) 555-1234" /></label></div><div className="grid md:grid-cols-2 gap-5"><label className="text-sm">Email *<input required type="email" value={form.email} onChange={e => update('email', e.target.value)} className="mt-2 w-full px-4 py-3" placeholder="you@example.com" /></label><label className="text-sm">About how many items need sharpening? *<input required type="number" min="1" max="100" value={form.quantity} onChange={e => update('quantity', e.target.value)} className="mt-2 w-full px-4 py-3" placeholder="Example: 6" /></label></div><label className="text-sm block">Anything we should know?<textarea rows="3" value={form.notes} onChange={e => update('notes', e.target.value)} className="mt-2 w-full px-4 py-3" placeholder="Knives, scissors, chips, broken tips, Japanese knives, special requests…" /></label><p className="text-xs leading-5 text-white/40">By reserving, you agree to receive service-related messages about this order. Marketing messages are not enabled by this reservation.</p>{error && <div className="rounded-2xl border border-damascus-bronze/40 bg-damascus-bronze/10 p-4 text-sm"><strong>We couldn’t save this reservation yet.</strong><div className="text-white/65 mt-1">{error}</div><a href={SETMORE_FALLBACK} className="inline-block mt-3 underline text-whetstone-cream">Use our current booking page instead</a></div>}<button disabled={status === 'saving'} type="submit" className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-full bg-honed-sage px-7 py-4 font-bold text-white hover:bg-damascus-bronze disabled:opacity-60 transition-colors">{status === 'saving' ? 'Saving your arrival…' : <>Reserve My Arrival <FiArrowRight/></>}</button></form></section>}

        {step === 4 && confirmation && <section className="rounded-3xl border border-honed-sage/30 bg-honed-sage/10 p-7 md:p-10 text-center"><div className="w-14 h-14 rounded-full bg-honed-sage text-white flex items-center justify-center mx-auto mb-5"><FiCheck size={26}/></div><p className="text-xs uppercase tracking-[0.24em] text-honed-sage font-bold mb-3">Arrival Reserved</p><h2 className="font-serif text-3xl md:text-4xl mb-4">You’re on the schedule.</h2><p className="text-white/70 leading-7 mb-6">{confirmation.date} · {confirmation.window}<br/>Reservation <strong className="text-white">{confirmation.id}</strong></p><div className="inline-flex items-center gap-2 text-sm text-white/55"><FiShield/> Keep this confirmation handy for drop-off.</div></section>}
      </div>
    </div>
  );
}
