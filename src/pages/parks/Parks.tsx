import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import SEOHead from '../../components/SEOHead';

export default function Parks() {
  const [formData, setFormData] = useState({
    applicantName: '',
    organizationName: '',
    email: '',
    phone: '',
    parkId: 'memorial-pavilion', // 'memorial-pavilion' | 'riverview-gazebo' | 'boyden-baseball' | 'orchard-courts'
    reservationDate: '2026-07-25',
    timeBlock: 'afternoon', // 'morning' | 'afternoon' | 'evening' | 'full-day'
    guestCount: 60,
    hasAmplifiedSound: false,
    hasCateringOrFoodTruck: false,
    hasInflatableBounce: false,
    notes: '',
    agreeToParkBylaws: false,
  });

  const [submitted, setSubmitted] = useState(false);
  const [reservationRef, setReservationRef] = useState('');
  const [submittedAt, setSubmittedAt] = useState('');
  const [copiedEndpoint, setCopiedEndpoint] = useState(false);

  const parkAmenities = [
    {
      id: 'memorial-pavilion',
      name: 'Memorial Park Covered Pavilion (Shelter A)',
      park: 'Memorial Park & Arboretum (50 Park Road)',
      capacity: 'Up to 100 Guests',
      baseFee: 60,
      features: 'Heavy timber picnic shelter, 10 accessible picnic tables, 2 charcoal barbecue pits, hydro electrical outlets, adjacent children splash pad & washrooms.',
    },
    {
      id: 'riverview-gazebo',
      name: 'Riverview Riverside Gazebo & Picnic Lawn',
      park: 'Riverview Park (120 River Road)',
      capacity: 'Up to 50 Guests',
      baseFee: 40,
      features: 'Scenic waterfront wooden gazebo overlooking the Maplewood River, manicured lawn for lawn games, fishing access dock, nearby walking trails.',
    },
    {
      id: 'boyden-baseball',
      name: 'Boyden Athletic Complex (Baseball Diamond & Soccer)',
      park: 'Boyden Sports Park (359 Boyden Ave)',
      capacity: 'League & Tournament Use',
      baseFee: 50,
      features: 'Lighted tournament baseball diamond with dugouts and clay infield, full regulation soccer pitch, spectator bleachers, concession stand access.',
    },
    {
      id: 'orchard-courts',
      name: 'Orchard Park Tennis & Pickleball Court Block',
      park: 'Orchard Park (85 Orchard Crescent)',
      capacity: 'Up to 32 Players',
      baseFee: 35,
      features: '4 dedicated pickleball courts and 2 regulation tennis courts, tournament lighting until 10:00 PM, shaded player benches.',
    },
  ];

  const timeBlocks = [
    { id: 'morning', label: 'Morning Slot (9:00 AM – 1:00 PM)', multiplier: 1 },
    { id: 'afternoon', label: 'Afternoon Slot (1:30 PM – 5:30 PM)', multiplier: 1 },
    { id: 'evening', label: 'Evening Sunset Slot (6:00 PM – 9:30 PM)', multiplier: 1 },
    { id: 'full-day', label: 'All-Day Park Reservation (9:00 AM – 9:30 PM)', multiplier: 2.2 },
  ];

  const selectedAmenity = parkAmenities.find((a) => a.id === formData.parkId) || parkAmenities[0];
  const selectedTime = timeBlocks.find((t) => t.id === formData.timeBlock) || timeBlocks[1];
  const amenityCost = Math.round(selectedAmenity.baseFee * selectedTime.multiplier);
  const soundFee = formData.hasAmplifiedSound ? 35 : 0;
  const inflatableFee = formData.hasInflatableBounce ? 50 : 0; // Inspection fee
  const totalCost = amenityCost + soundFee + inflatableFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const ref = `PARK-RES-2026-${randomCode}`;
    setReservationRef(ref);
    setSubmittedAt(new Date().toLocaleString());
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyEndpoint = () => {
    navigator.clipboard.writeText('https://mapplewood-fictional-town.onrender.com/parks');
    setCopiedEndpoint(true);
    setTimeout(() => setCopiedEndpoint(false), 2000);
  };

  return (
    <article
      className="space-y-8 max-w-4xl mx-auto bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-sm"
      itemScope
      itemType="https://schema.org/GovernmentService"
      data-endpoint-url="https://mapplewood-fictional-town.onrender.com/parks"
      data-service-name="Parks, Pavilions & Sports Field Reservations"
    >
      <SEOHead
        title="Park Facility, Pavilion & Sports Field Reservation Form"
        description="Official online permit application for reserving Maplewood park picnic pavilions, gazebos, baseball diamonds, and pickleball courts."
        category="Parks & Forestry"
      />

      {/* ── Scraper & API Direct Endpoint Header ── */}
      <div className="bg-slate-900 text-slate-100 p-4 rounded-xl text-xs space-y-2 border border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-mono font-bold uppercase text-slate-300">
              Direct Park Reservation Endpoint &middot; AI Scraper &amp; Chatbot Ready
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
          Permanent URI: <span className="text-emerald-400">https://mapplewood-fictional-town.onrender.com/parks</span> &bull; Action: <span className="text-amber-300">Municipal Park Pavilion &amp; Field Permit Intake</span>
        </p>
      </div>

      <header className="border-b border-slate-200 pb-6 space-y-3">
        <div className="inline-block bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded">
          Parks, Forestry &amp; Recreation Division
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-serif text-slate-900" itemProp="name">
          Park Pavilion &amp; Sports Field Reservations
        </h1>
        <p className="text-base text-slate-600 leading-relaxed" itemProp="description">
          Reserve a shaded picnic pavilion, riverfront gazebo, baseball diamond, or sports pitch for your family reunion, company picnic, or sports league event in the Town of Maplewood.
        </p>
      </header>

      {/* ── Confirmation Receipt ── */}
      {submitted && (
        <section
          className="p-6 bg-emerald-50 border-2 border-emerald-500 rounded-2xl space-y-4 animate-in fade-in duration-300"
          id="park-receipt"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-900 text-xs font-bold uppercase font-mono tracking-wider">
                Park Permit Reserved &middot; Application Received
              </span>
              <h2 className="text-2xl font-bold text-emerald-950 font-serif">
                Park Facility Reservation Submitted!
              </h2>
              <p className="text-xs text-emerald-800">
                Official municipal permit issued at {submittedAt}.
              </p>
            </div>
            <span className="text-3xl">🌳</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-emerald-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-500 block uppercase font-mono text-[10px]">Reservation Permit #</span>
              <span className="font-bold font-mono text-base text-emerald-900">{reservationRef}</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase font-mono text-[10px]">Amenity Booked</span>
              <span className="font-bold text-slate-900">{selectedAmenity.name}</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase font-mono text-[10px]">Date &amp; Time Slot</span>
              <span className="font-bold text-slate-900">{formData.reservationDate} &middot; {selectedTime.label}</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase font-mono text-[10px]">Permit Fee</span>
              <span className="font-bold text-slate-900">${totalCost}.00 CAD (Includes cleanup deposit)</span>
            </div>
          </div>

          <p className="text-xs text-emerald-900 leading-relaxed">
            Your official park permit certificate has been emailed to <strong>{formData.email}</strong>. Please print your permit or save it to your phone to present to municipal park enforcement officers upon request during your event.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => window.print()}
              className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors"
            >
              🖨️ Print Park Permit
            </button>
            <button
              onClick={() => setSubmitted(false)}
              className="bg-white border border-emerald-300 hover:bg-emerald-50 text-emerald-900 font-bold text-xs px-4 py-2 rounded-lg transition-colors"
            >
              Book Another Park Date &rarr;
            </button>
          </div>
        </section>
      )}

      {/* ── Reservation Form ── */}
      <form onSubmit={handleSubmit} className="space-y-8" id="park-reservation-form">
        
        {/* Step 1: Amenity Selection */}
        <fieldset className="space-y-4">
          <legend className="text-lg font-bold text-slate-900 font-serif border-b border-slate-200 pb-2 w-full">
            1. Select Park Amenity
          </legend>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {parkAmenities.map((amenity) => {
              const isSelected = formData.parkId === amenity.id;
              return (
                <label
                  key={amenity.id}
                  className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="parkId"
                      value={amenity.id}
                      checked={isSelected}
                      onChange={(e) => setFormData({ ...formData, parkId: e.target.value })}
                      className="mt-1 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300"
                    />
                    <div className="space-y-1">
                      <div className="font-bold text-slate-900 text-sm">{amenity.name}</div>
                      <div className="text-[11px] font-mono text-emerald-800 font-semibold">
                        📍 {amenity.park} &bull; 💵 ${amenity.baseFee}/slot
                      </div>
                      <p className="text-xs text-slate-600">{amenity.features}</p>
                      <div className="text-[10px] text-slate-500 font-mono pt-1">Capacity: {amenity.capacity}</div>
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        </fieldset>

        {/* Step 2: Date & Event Info */}
        <fieldset className="space-y-4">
          <legend className="text-lg font-bold text-slate-900 font-serif border-b border-slate-200 pb-2 w-full">
            2. Date, Time &amp; Attendance
          </legend>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Reservation Date *</label>
              <input
                type="date"
                required
                value={formData.reservationDate}
                onChange={(e) => setFormData({ ...formData, reservationDate: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Time Slot *</label>
              <select
                value={formData.timeBlock}
                onChange={(e) => setFormData({ ...formData, timeBlock: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
              >
                {timeBlocks.map((t) => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Estimated Number of Guests *</label>
              <input
                type="number"
                min="5"
                max="250"
                required
                value={formData.guestCount}
                onChange={(e) => setFormData({ ...formData, guestCount: Number(e.target.value) })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Special Park Permits */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
              Optional Special Permits &amp; Amenities
            </div>
            <div className="flex flex-wrap gap-4 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.hasAmplifiedSound}
                  onChange={(e) => setFormData({ ...formData, hasAmplifiedSound: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                />
                Amplified Sound / Speaker Permit (+$35 &middot; By-law 2024-12)
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.hasInflatableBounce}
                  onChange={(e) => setFormData({ ...formData, hasInflatableBounce: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                />
                Inflatable Bouncy Castle Inspection (+$50 flat)
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.hasCateringOrFoodTruck}
                  onChange={(e) => setFormData({ ...formData, hasCateringOrFoodTruck: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                />
                Commercial Catering / Food Truck Setup
              </label>
            </div>
          </div>
        </fieldset>

        {/* Step 3: Applicant Contact */}
        <fieldset className="space-y-4">
          <legend className="text-lg font-bold text-slate-900 font-serif border-b border-slate-200 pb-2 w-full">
            3. Applicant Details
          </legend>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Applicant Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. David Miller"
                value={formData.applicantName}
                onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Email Address *</label>
              <input
                type="email"
                required
                placeholder="d.miller@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Mobile Phone *</label>
              <input
                type="tel"
                required
                placeholder="(555) 456-7890"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        </fieldset>

        {/* Fee Quote Preview */}
        <div className="p-4 bg-slate-900 text-white rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 uppercase font-mono tracking-wider block">
              Calculated Park Permit Fee
            </span>
            <div className="text-sm font-semibold text-slate-200">
              {selectedAmenity.name} &bull; {selectedTime.label}
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold font-mono text-emerald-400">${totalCost}.00 CAD</span>
            <span className="text-[10px] text-slate-400 block font-mono">No tax on municipal park permits</span>
          </div>
        </div>

        {/* Declarations */}
        <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer pt-2">
          <input
            type="checkbox"
            required
            checked={formData.agreeToParkBylaws}
            onChange={(e) => setFormData({ ...formData, agreeToParkBylaws: e.target.checked })}
            className="mt-0.5 h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
          />
          <span>
            I agree to abide by all Town of Maplewood Park By-laws: no glass containers, strict pack-it-in/pack-it-out litter rules, all dogs must remain on a 2.0m leash (By-law 2020-04), and no open ground fires.
          </span>
        </label>

        {/* Submit */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <NavLink to="/" className="text-xs text-slate-500 hover:text-slate-800 font-semibold">
            &larr; Back to Municipal Home
          </NavLink>
          <button
            type="submit"
            className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-sm px-8 py-3 rounded-xl shadow-md transition-all hover:shadow-lg"
          >
            🌳 Submit Park Reservation Permit &rarr;
          </button>
        </div>
      </form>
    </article>
  );
}

