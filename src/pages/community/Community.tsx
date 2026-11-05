import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import SEOHead from '../../components/SEOHead';

export default function Community() {
  const [formData, setFormData] = useState({
    applicantName: '',
    organizationName: '',
    email: '',
    phone: '',
    address: '',
    facilityId: 'auditorium', // 'auditorium' | 'heritage' | 'activity-room' | 'gym'
    rentalDate: '2026-07-18',
    timeSlot: 'afternoon', // 'morning' | 'afternoon' | 'evening' | 'full-day'
    estimatedAttendees: 45,
    eventType: 'celebration', // 'celebration' | 'meeting' | 'workshop' | 'sports' | 'fundraiser'
    eventDescription: '',
    needsKitchen: false,
    needsProjectorAV: true,
    alcoholService: 'no', // 'no' | 'yes'
    insuranceCarrier: '',
    agreeToRules: false,
  });

  const [submitted, setSubmitted] = useState(false);
  const [bookingRef, setBookingRef] = useState('');
  const [submittedAt, setSubmittedAt] = useState('');
  const [copiedEndpoint, setCopiedEndpoint] = useState(false);

  const facilities = [
    {
      id: 'auditorium',
      name: 'Maplewood Community Center & Main Auditorium',
      capacity: 'Up to 250 Guests',
      hourlyRate: 85,
      features: 'Full performance stage, hardwood floor, theatrical lighting, PA sound system, motorized projection screen.',
      address: '123 Main Street (Level 2)',
    },
    {
      id: 'heritage',
      name: 'Heritage Community Hall & Meeting Suite',
      capacity: 'Up to 75 Guests',
      hourlyRate: 45,
      features: 'Round banquet tables, padded chairs, high-speed Wi-Fi, 75" presentation display monitor, whiteboard.',
      address: '123 Main Street (Ground Wing)',
    },
    {
      id: 'activity-room',
      name: 'Youth & Senior Multi-Purpose Activity Room',
      capacity: 'Up to 45 Guests',
      hourlyRate: 35,
      features: 'Wipeable linoleum flooring, craft sinks, flexible table configurations, direct patio access.',
      address: 'Memorial Park Recreation Building',
    },
    {
      id: 'gym',
      name: 'Community Gymnasium & Athletic Court',
      capacity: 'Up to 150 Guests',
      hourlyRate: 65,
      features: 'Regulation basketball court, 2 volleyball courts, 4 pickleball courts, electronic scoreboard, locker rooms.',
      address: 'Boyden Community Center',
    },
  ];

  const timeSlots = [
    { id: 'morning', label: 'Morning Block (8:00 AM – 12:00 PM · 4 hrs)', multiplier: 4 },
    { id: 'afternoon', label: 'Afternoon Block (1:00 PM – 5:00 PM · 4 hrs)', multiplier: 4 },
    { id: 'evening', label: 'Evening Gala Block (6:00 PM – 11:00 PM · 5 hrs)', multiplier: 5 },
    { id: 'full-day', label: 'Full Day Event (8:00 AM – 11:00 PM · 15 hrs)', multiplier: 12 }, // Discounted
  ];

  const selectedFacility = facilities.find((f) => f.id === formData.facilityId) || facilities[0];
  const selectedSlot = timeSlots.find((s) => s.id === formData.timeSlot) || timeSlots[1];
  const facilityCost = selectedFacility.hourlyRate * selectedSlot.multiplier;
  const kitchenFee = formData.needsKitchen ? 50 : 0;
  const avFee = formData.needsProjectorAV ? 25 : 0;
  const totalCost = facilityCost + kitchenFee + avFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const ref = `COMM-FAC-2026-${randomCode}`;
    setBookingRef(ref);
    setSubmittedAt(new Date().toLocaleString());
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyEndpoint = () => {
    navigator.clipboard.writeText('https://mapplewood-fictional-town.onrender.com/community');
    setCopiedEndpoint(true);
    setTimeout(() => setCopiedEndpoint(false), 2000);
  };

  return (
    <article
      className="space-y-8 max-w-4xl mx-auto bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-sm"
      itemScope
      itemType="https://schema.org/GovernmentService"
      data-endpoint-url="https://mapplewood-fictional-town.onrender.com/community"
      data-service-name="Community Center & Facility Booking"
    >
      <SEOHead
        title="Community Center Facility & Hall Booking Application Form"
        description="Official online booking form for Maplewood Community Hall, Auditorium, and Activity Rooms. Reserve event spaces, banquet halls, and meeting rooms."
        category="Community Services"
      />

      {/* ── Scraper & API Direct Endpoint Header ── */}
      <div className="bg-slate-900 text-slate-100 p-4 rounded-xl text-xs space-y-2 border border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-mono font-bold uppercase text-slate-300">
              Direct Booking Endpoint &middot; AI Scraper &amp; Chatbot Ready
            </span>
          </div>
          <button
            onClick={handleCopyEndpoint}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 font-mono text-[11px] transition-colors"
          >
            {copiedEndpoint ? '✓ URL Copied' : 'Copy Direct Link'}
          </button>
        </div>
        <p className="text-slate-400 font-mono text-[11px] leading-relaxed">
          Permanent URI: <span className="text-emerald-400">https://mapplewood-fictional-town.onrender.com/community</span> &bull; Action: <span className="text-amber-300">Municipal Hall, Room &amp; Facility Rental Application</span>
        </p>
      </div>

      <header className="border-b border-slate-200 pb-6 space-y-3">
        <div className="inline-block bg-indigo-100 text-indigo-800 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded">
          Community Services &amp; Facilities
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-serif text-slate-900" itemProp="name">
          Community Hall &amp; Facility Booking Portal
        </h1>
        <p className="text-base text-slate-600 leading-relaxed" itemProp="description">
          Host your private celebration, non-profit AGM, workshop, or athletic tournament in the Town of Maplewood's municipal facilities. Submit your booking request online with instant fee estimates and statutory municipal approval tracking.
        </p>
      </header>

      {/* ── Confirmation Receipt ── */}
      {submitted && (
        <section
          className="p-6 bg-indigo-50 border-2 border-indigo-500 rounded-2xl space-y-4 animate-in fade-in duration-300"
          id="booking-receipt"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-indigo-200 text-indigo-900 text-xs font-bold uppercase font-mono tracking-wider">
                Booking Request Submitted &middot; Tentatively Held
              </span>
              <h2 className="text-2xl font-bold text-indigo-950 font-serif">
                Community Space Request Received!
              </h2>
              <p className="text-xs text-indigo-800">
                Official permit file created at {submittedAt}.
              </p>
            </div>
            <span className="text-3xl">🏛️</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-indigo-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-500 block uppercase font-mono text-[10px]">Permit / Booking Ref</span>
              <span className="font-bold font-mono text-base text-indigo-900">{bookingRef}</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase font-mono text-[10px]">Reserved Facility</span>
              <span className="font-bold text-slate-900">{selectedFacility.name}</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase font-mono text-[10px]">Rental Date &amp; Slot</span>
              <span className="font-bold text-slate-900">{formData.rentalDate} &middot; {selectedSlot.label.split('(')[0]}</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase font-mono text-[10px]">Estimated Rental Fee</span>
              <span className="font-bold text-slate-900">${totalCost}.00 CAD (Deposit: ${Math.round(totalCost * 0.25)}.00)</span>
            </div>
          </div>

          <p className="text-xs text-indigo-900 leading-relaxed">
            The Community Services Clerk will review your application within 2 business days. A tentative hold is placed on your date. Confirmation details and rental agreement documents have been forwarded to <strong>{formData.email}</strong>.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => window.print()}
              className="bg-indigo-800 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors"
            >
              🖨️ Print Booking Summary
            </button>
            <button
              onClick={() => setSubmitted(false)}
              className="bg-white border border-indigo-300 hover:bg-indigo-50 text-indigo-900 font-bold text-xs px-4 py-2 rounded-lg transition-colors"
            >
              Submit Another Reservation &rarr;
            </button>
          </div>
        </section>
      )}

      {/* ── Booking Form ── */}
      <form onSubmit={handleSubmit} className="space-y-8" id="community-booking-form">
        
        {/* Step 1: Select Facility */}
        <fieldset className="space-y-4">
          <legend className="text-lg font-bold text-slate-900 font-serif border-b border-slate-200 pb-2 w-full">
            1. Select Municipal Facility
          </legend>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {facilities.map((fac) => {
              const isSelected = formData.facilityId === fac.id;
              return (
                <label
                  key={fac.id}
                  className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="facilityId"
                      value={fac.id}
                      checked={isSelected}
                      onChange={(e) => setFormData({ ...formData, facilityId: e.target.value })}
                      className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300"
                    />
                    <div className="space-y-1">
                      <div className="font-bold text-slate-900 text-sm">{fac.name}</div>
                      <div className="flex gap-2 text-[11px] font-mono text-indigo-800 font-semibold">
                        <span>👥 {fac.capacity}</span>
                        <span>&bull;</span>
                        <span>💵 ${fac.hourlyRate}/hr</span>
                      </div>
                      <p className="text-xs text-slate-600">{fac.features}</p>
                      <div className="text-[10px] text-slate-400 font-mono pt-1">📍 {fac.address}</div>
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        </fieldset>

        {/* Step 2: Date & Time Schedule */}
        <fieldset className="space-y-4">
          <legend className="text-lg font-bold text-slate-900 font-serif border-b border-slate-200 pb-2 w-full">
            2. Date, Time &amp; Event Scope
          </legend>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Requested Date *</label>
              <input
                type="date"
                required
                value={formData.rentalDate}
                onChange={(e) => setFormData({ ...formData, rentalDate: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Time Slot *</label>
              <select
                value={formData.timeSlot}
                onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
              >
                {timeSlots.map((s) => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Expected Attendance *</label>
              <input
                type="number"
                min="1"
                max="300"
                required
                value={formData.estimatedAttendees}
                onChange={(e) => setFormData({ ...formData, estimatedAttendees: Number(e.target.value) })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Event Type *</label>
              <select
                value={formData.eventType}
                onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
              >
                <option value="celebration">Private Celebration / Birthday / Anniversary</option>
                <option value="meeting">Non-Profit / Civic Group Meeting</option>
                <option value="workshop">Educational Workshop / Training Session</option>
                <option value="sports">Athletic League / Tournament</option>
                <option value="fundraiser">Charity / Community Fundraiser</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Brief Event Description *</label>
              <input
                type="text"
                required
                placeholder="e.g. Maplewood Youth Chess Club Annual Championship"
                value={formData.eventDescription}
                onChange={(e) => setFormData({ ...formData, eventDescription: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Add-on Amenities */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
              Facility Equipment &amp; Amenities
            </div>
            <div className="flex flex-wrap gap-4 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.needsKitchen}
                  onChange={(e) => setFormData({ ...formData, needsKitchen: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                />
                Commercial Warming Kitchen (+$50 flat)
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.needsProjectorAV}
                  onChange={(e) => setFormData({ ...formData, needsProjectorAV: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                />
                Audio/Visual Projector &amp; Wireless Mic (+$25 flat)
              </label>
            </div>
          </div>
        </fieldset>

        {/* Step 3: Applicant Contact */}
        <fieldset className="space-y-4">
          <legend className="text-lg font-bold text-slate-900 font-serif border-b border-slate-200 pb-2 w-full">
            3. Applicant / Organization Contact
          </legend>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Applicant Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Marcus Vance"
                value={formData.applicantName}
                onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Organization (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Maplewood Horticultural Society"
                value={formData.organizationName}
                onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Email Address *</label>
              <input
                type="email"
                required
                placeholder="m.vance@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Phone Number *</label>
              <input
                type="tel"
                required
                placeholder="(555) 345-6789"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Mailing Address (Maplewood) *</label>
              <input
                type="text"
                required
                placeholder="210 Maple Ave, Maplewood, ON"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        </fieldset>

        {/* Fee Quote Preview */}
        <div className="p-4 bg-slate-900 text-white rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 uppercase font-mono tracking-wider block">
              Estimated Facility Rental Cost
            </span>
            <div className="text-sm font-semibold text-slate-200">
              {selectedFacility.name} &bull; {selectedSlot.label.split('(')[0]}
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold font-mono text-indigo-300">${totalCost}.00 CAD</span>
            <span className="text-[10px] text-slate-400 block font-mono">25% Security deposit required upon contract</span>
          </div>
        </div>

        {/* Declarations */}
        <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer pt-2">
          <input
            type="checkbox"
            required
            checked={formData.agreeToRules}
            onChange={(e) => setFormData({ ...formData, agreeToRules: e.target.checked })}
            className="mt-0.5 h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
          />
          <span>
            I acknowledge that this reservation is tentative until confirmed by the Town Clerk. I agree to comply with Town Facility Rental By-laws, noise curfews (music off by 11:00 PM), and to return the hall in clean condition.
          </span>
        </label>

        {/* Submit */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <NavLink to="/" className="text-xs text-slate-500 hover:text-slate-800 font-semibold">
            &larr; Back to Municipal Home
          </NavLink>
          <button
            type="submit"
            className="w-full sm:w-auto bg-indigo-700 hover:bg-indigo-600 text-white font-bold text-sm px-8 py-3 rounded-xl shadow-md transition-all hover:shadow-lg"
          >
            🏛️ Submit Facility Booking Request &rarr;
          </button>
        </div>
      </form>
    </article>
  );
}

