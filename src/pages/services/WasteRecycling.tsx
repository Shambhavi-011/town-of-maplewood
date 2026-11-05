import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import townData from '../../data/townData.json';
import SEOHead from '../../components/SEOHead';

export default function WasteRecycling() {
  const { wasteRecycling } = townData.services;

  // Form State
  const [formData, setFormData] = useState({
    requestType: 'missed-waste', // 'missed-waste' | 'bulk-pickup' | 'bin-replacement'
    residentName: '',
    email: '',
    phone: '',
    serviceAddress: '',
    wasteStream: 'all-streams', // 'all-streams' | 'recycling' | 'organics' | 'garbage' | 'yard-waste'
    placedBefore7am: true,
    bulkItemsDescription: '',
    binTypeNeeded: 'green-bin', // 'green-bin' | 'blue-box' | 'both'
    additionalNotes: '',
    agreeToTerms: false,
  });

  const [submitted, setSubmitted] = useState(false);
  const [ticketRef, setTicketRef] = useState('');
  const [submittedAt, setSubmittedAt] = useState('');
  const [copiedEndpoint, setCopiedEndpoint] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const ref = `SR-WST-2026-${randomCode}`;
    setTicketRef(ref);
    setSubmittedAt(new Date().toLocaleString());
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyEndpoint = () => {
    navigator.clipboard.writeText('https://mapplewood-fictional-town.onrender.com/services/waste');
    setCopiedEndpoint(true);
    setTimeout(() => setCopiedEndpoint(false), 2000);
  };

  return (
    <article
      className="space-y-8 max-w-4xl mx-auto bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-sm"
      itemScope
      itemType="https://schema.org/GovernmentService"
      data-kb-topic="waste-recycling"
      data-endpoint-url="https://mapplewood-fictional-town.onrender.com/services/waste"
      data-service-name="Curbside Waste, Recycling & Missed Collection Intake"
    >
      <SEOHead
        title="Waste, Recycling & Curbside Service Request Form"
        description="Curbside waste rules and official online request form for Town of Maplewood: Report missed collection after 5 PM, request bulk pickup, or order replacement bins."
        category="Public Works"
      />

      {/* ── Scraper & API Direct Endpoint Header ── */}
      <div className="bg-slate-900 text-slate-100 p-4 rounded-xl text-xs space-y-2 border border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-mono font-bold uppercase text-slate-300">
              Direct Waste Service Request Endpoint &middot; AI Scraper &amp; Chatbot Ready
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
          Permanent URI: <span className="text-emerald-400">https://mapplewood-fictional-town.onrender.com/services/waste</span> &bull; Action: <span className="text-amber-300">Curbside Missed Collection, Bulk &amp; Bin Replacement Intake</span>
        </p>
      </div>

      {/* ── Title & Intro Header ── */}
      <header className="border-b border-slate-200 pb-6 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="inline-block bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded">
            Public Works &amp; Environmental Services
          </div>
          <time dateTime="2026-10-30" className="text-xs text-slate-500 font-mono">
            Updated: October 30, 2026
          </time>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-serif text-slate-900" itemProp="name">
          Waste, Recycling &amp; Collection Intake Form
        </h1>
        <p className="text-base text-slate-600 leading-relaxed" itemProp="description">
          Comprehensive guide and online service request portal for Town of Maplewood residential waste collection, organic green bins, dual-stream recycling, bulk item pickup, and missed collection resolution.
        </p>
      </header>

      {/* ── Curbside Placement Rules ── */}
      <section
        id="curbside-rules"
        className="bg-blue-50 border-l-4 border-blue-700 p-5 rounded-r-xl space-y-2"
        data-rule="curbside-placement"
        data-cutoff-time="07:00"
      >
        <h2 className="text-lg font-bold text-blue-950 flex items-center gap-2">
          <span>⏰</span> Mandatory Curbside Placement Rule (7:00 AM)
        </h2>
        <p className="text-sm text-blue-900 leading-relaxed font-medium">
          {wasteRecycling.curbsidePlacementRule}
        </p>
      </section>

      {/* ── Submission Confirmation Receipt ── */}
      {submitted && (
        <section
          className="p-6 bg-emerald-50 border-2 border-emerald-500 rounded-2xl space-y-4 animate-in fade-in duration-300"
          id="waste-receipt"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-900 text-xs font-bold uppercase font-mono tracking-wider">
                Service Request Dispatched &middot; Public Works 311 Ticket
              </span>
              <h2 className="text-2xl font-bold text-emerald-950 font-serif">
                Waste Service Request Submitted!
              </h2>
              <p className="text-xs text-emerald-800">
                Official ticket logged at {submittedAt}. SLA Resolution: 2 Business Days.
              </p>
            </div>
            <span className="text-3xl">🚛</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-emerald-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-500 block uppercase font-mono text-[10px]">311 Tracking Ticket #</span>
              <span className="font-bold font-mono text-base text-blue-900">{ticketRef}</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase font-mono text-[10px]">Service Street Address</span>
              <span className="font-bold text-slate-900">{formData.serviceAddress}</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase font-mono text-[10px]">Request Category</span>
              <span className="font-bold text-slate-900">{formData.requestType.replace(/-/g, ' ').toUpperCase()}</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase font-mono text-[10px]">Guaranteed Resolution</span>
              <span className="font-bold text-slate-900">Within 48 Hours (2 Business Days)</span>
            </div>
          </div>

          <p className="text-xs text-emerald-900 leading-relaxed">
            Dispatch has routed your request to Maplewood Environmental Waste Services. If reporting a missed collection, please ensure bins remain safely at the curb until the recovery truck completes retrieval. Confirmation sent to <strong>{formData.email}</strong>.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => window.print()}
              className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors"
            >
              🖨️ Print Service Ticket
            </button>
            <button
              onClick={() => setSubmitted(false)}
              className="bg-white border border-emerald-300 hover:bg-emerald-50 text-emerald-900 font-bold text-xs px-4 py-2 rounded-lg transition-colors"
            >
              Submit Another Waste Request &rarr;
            </button>
          </div>
        </section>
      )}

      {/* ── Interactive Waste Service Form ── */}
      <form onSubmit={handleSubmit} className="p-6 bg-slate-50 rounded-2xl border-2 border-slate-300 space-y-6" id="waste-service-form">
        <div className="border-b border-slate-200 pb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-serif">
              Online Waste &amp; Recycling Request Form
            </h2>
            <p className="text-xs text-slate-600">
              Submit missed collections, schedule bulk item pickups, or request green/blue replacement bins.
            </p>
          </div>
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-900">
            2-Day SLA Response
          </span>
        </div>

        {/* Request Type Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <label className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-2.5 text-xs ${formData.requestType === 'missed-waste' ? 'border-blue-600 bg-blue-50/50 font-bold text-blue-950' : 'border-slate-200 bg-white text-slate-700'}`}>
            <input
              type="radio"
              name="requestType"
              value="missed-waste"
              checked={formData.requestType === 'missed-waste'}
              onChange={(e) => setFormData({ ...formData, requestType: e.target.value })}
              className="mt-0.5 text-blue-600 focus:ring-blue-500"
            />
            <div>
              <div>🚛 Missed Collection</div>
              <div className="text-[11px] font-normal text-slate-500">File after 5:00 PM cutoff</div>
            </div>
          </label>

          <label className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-2.5 text-xs ${formData.requestType === 'bulk-pickup' ? 'border-blue-600 bg-blue-50/50 font-bold text-blue-950' : 'border-slate-200 bg-white text-slate-700'}`}>
            <input
              type="radio"
              name="requestType"
              value="bulk-pickup"
              checked={formData.requestType === 'bulk-pickup'}
              onChange={(e) => setFormData({ ...formData, requestType: e.target.value })}
              className="mt-0.5 text-blue-600 focus:ring-blue-500"
            />
            <div>
              <div>🛋️ Bulk Item Pickup</div>
              <div className="text-[11px] font-normal text-slate-500">Furniture, appliances, mattresses</div>
            </div>
          </label>

          <label className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-2.5 text-xs ${formData.requestType === 'bin-replacement' ? 'border-blue-600 bg-blue-50/50 font-bold text-blue-950' : 'border-slate-200 bg-white text-slate-700'}`}>
            <input
              type="radio"
              name="requestType"
              value="bin-replacement"
              checked={formData.requestType === 'bin-replacement'}
              onChange={(e) => setFormData({ ...formData, requestType: e.target.value })}
              className="mt-0.5 text-blue-600 focus:ring-blue-500"
            />
            <div>
              <div>♻️ Bin Replacement</div>
              <div className="text-[11px] font-normal text-slate-500">Broken latches, damaged bins</div>
            </div>
          </label>
        </div>

        {/* Address & Resident Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 block">Civic Service Address (Maplewood) *</label>
            <input
              type="text"
              required
              placeholder="e.g. 84 Maple Crest Court, Maplewood"
              value={formData.serviceAddress}
              onChange={(e) => setFormData({ ...formData, serviceAddress: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 block">Resident Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Jennifer Miller"
              value={formData.residentName}
              onChange={(e) => setFormData({ ...formData, residentName: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 block">Email Address *</label>
            <input
              type="email"
              required
              placeholder="j.miller@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 block">Contact Phone *</label>
            <input
              type="tel"
              required
              placeholder="(555) 987-6543"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
            />
          </div>
        </div>

        {/* Conditional Field: Missed Collection Waste Stream */}
        {formData.requestType === 'missed-waste' && (
          <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Which waste stream was missed? *</label>
              <select
                value={formData.wasteStream}
                onChange={(e) => setFormData({ ...formData, wasteStream: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
              >
                <option value="all-streams">All Streams (Nothing was collected)</option>
                <option value="recycling">Dual-Stream Recycling (Blue Box / Grey Box)</option>
                <option value="organics">Organics (Green Bin)</option>
                <option value="garbage">Household Garbage (Clear/Black Bags)</option>
                <option value="yard-waste">Seasonal Yard Waste / Brush Bundles</option>
              </select>
            </div>

            <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer pt-1">
              <input
                type="checkbox"
                required
                checked={formData.placedBefore7am}
                onChange={(e) => setFormData({ ...formData, placedBefore7am: e.target.checked })}
                className="mt-0.5 h-4 w-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
              />
              <span>
                I certify that bins were placed at the curbside prior to the mandatory <strong>7:00 AM deadline</strong> on collection day.
              </span>
            </label>
          </div>
        )}

        {/* Conditional Field: Bulk Pickup Items */}
        {formData.requestType === 'bulk-pickup' && (
          <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
            <label className="text-xs font-bold text-slate-700 block">List Bulk Items to be Collected *</label>
            <textarea
              required
              rows={2}
              placeholder="e.g. 1 Queen Mattress, 1 Wooden Dining Table, 1 Refrigerator (certified Freon-free sticker attached)"
              value={formData.bulkItemsDescription}
              onChange={(e) => setFormData({ ...formData, bulkItemsDescription: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
            />
            <span className="text-[11px] text-slate-500 block">Maximum 3 large items per collection. Appliances require Freon-removal certificate.</span>
          </div>
        )}

        {/* Conditional Field: Bin Replacement Type */}
        {formData.requestType === 'bin-replacement' && (
          <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
            <label className="text-xs font-bold text-slate-700 block">Select Replacement Bin Needed *</label>
            <select
              value={formData.binTypeNeeded}
              onChange={(e) => setFormData({ ...formData, binTypeNeeded: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
            >
              <option value="green-bin">Organic Green Bin (Latching Raccoon-Resistant 45L)</option>
              <option value="blue-box">Recycling Blue Box (Containers - 85L)</option>
              <option value="both">Both Green Bin &amp; Blue Box (New Homeowner Kit)</option>
            </select>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <NavLink to="/services/track" className="text-xs text-blue-900 font-semibold hover:underline">
            🔍 Check Existing 311 Ticket Status
          </NavLink>
          <button
            type="submit"
            className="w-full sm:w-auto bg-blue-900 hover:bg-blue-800 text-white font-bold text-sm px-8 py-3 rounded-xl shadow-md transition-all hover:shadow-lg"
          >
            🚛 Submit Waste Service Request &rarr;
          </button>
        </div>
      </form>

      {/* ── Missed Collection Policy (Crucial for Scraper & Chatbot) ── */}
      <section
        id="missed-collection"
        className="space-y-4"
        data-sla="2-business-days"
        data-reporting-window="after-17:00"
      >
        <h2 className="text-2xl font-bold text-slate-900 font-serif">
          Missed Collection Reporting &amp; Service Level Agreement (SLA)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2" data-fact="reporting-cutoff">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-700">Reporting Cutoff</div>
            <h3 className="font-bold text-slate-900 text-sm">Wait Until 5:00 PM</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {wasteRecycling.missedCollectionPolicy.cutoffTime}
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2" data-fact="late-setout-rule">
            <div className="text-xs font-bold uppercase tracking-wider text-rose-700">Late Setout Notice</div>
            <h3 className="font-bold text-slate-900 text-sm">7:00 AM Deadline</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {wasteRecycling.missedCollectionPolicy.lateSetoutNotice}
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2" data-fact="town-sla">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-700">Town SLA Timeline</div>
            <h3 className="font-bold text-slate-900 text-sm">2-Business-Day Resolution</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {wasteRecycling.missedCollectionPolicy.serviceLevelAgreement}
            </p>
          </div>
        </div>
      </section>

      {/* ── Collection Streams & Schedules ── */}
      <section id="collection-schedules" className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 font-serif">
          Curbside Waste Streams &amp; Standards
        </h2>
        <div className="space-y-3">
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-1" data-stream="organics-green-bin">
            <div className="flex items-center gap-2">
              <span className="text-lg">🍏</span>
              <h3 className="font-bold text-emerald-950 text-base">Green Bin (Organic Food &amp; Yard Waste)</h3>
            </div>
            <p className="text-sm text-emerald-900 leading-relaxed">
              {wasteRecycling.schedules.organicsGreenBin}
            </p>
          </div>

          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-1" data-stream="recycling-blue-box">
            <div className="flex items-center gap-2">
              <span className="text-lg">♻️</span>
              <h3 className="font-bold text-blue-950 text-base">Blue Box (Recycling Program)</h3>
            </div>
            <p className="text-sm text-blue-900 leading-relaxed">
              {wasteRecycling.schedules.recyclingBlueBox}
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1" data-stream="garbage-residual">
            <div className="flex items-center gap-2">
              <span className="text-lg">🗑️</span>
              <h3 className="font-bold text-slate-900 text-base">Garbage (Non-Recyclable Residual Waste)</h3>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              {wasteRecycling.schedules.garbage}
            </p>
          </div>
        </div>
      </section>

      {/* ── Bulk Items & Household Hazardous Waste ── */}
      <div id="bulk-items" className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200">
        <section className="space-y-2" data-stream="bulk-pickup">
          <h2 className="text-lg font-bold text-slate-900 font-serif">Bulk Item Collection</h2>
          <p className="text-xs font-semibold text-blue-800">
            Schedule: {wasteRecycling.bulkPickup.schedule}
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            {wasteRecycling.bulkPickup.rules}
          </p>
        </section>

        <section className="space-y-2" data-stream="hazardous-waste">
          <h2 className="text-lg font-bold text-slate-900 font-serif">Household Hazardous Waste (HHW)</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            {wasteRecycling.hazardousWaste}
          </p>
        </section>
      </div>
    </article>
  );
}
