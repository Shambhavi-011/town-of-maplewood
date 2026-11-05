import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import SEOHead from '../../components/SEOHead';
import townData from '../../data/townData.json';

export default function BuildingPermits() {
  const { buildingPermits } = townData.permits;

  const [formData, setFormData] = useState({
    applicantName: '',
    email: '',
    phone: '',
    propertyAddress: '',
    rollNumber: '',
    projectType: 'residential-addition', // 'residential-addition' | 'basement-apartment' | 'structural-renovation' | 'commercial-fitout' | 'accessory-structure'
    estimatedValue: 45000,
    floorAreaSqFt: 350,
    designerName: '',
    designerBcin: '',
    contractorName: '',
    contractorPhone: '',
    hasSitePlan: true,
    hasStructuralDrawings: true,
    notes: '',
    agreeToBylaw: false,
  });

  const [submitted, setSubmitted] = useState(false);
  const [permitRef, setPermitRef] = useState('');
  const [submittedAt, setSubmittedAt] = useState('');
  const [copiedEndpoint, setCopiedEndpoint] = useState(false);

  // Fee calculation: Base fee $150 + $2.25 per sq ft
  const baseFee = 150;
  const areaFee = Math.round(Number(formData.floorAreaSqFt || 0) * 2.25);
  const totalPermitFee = baseFee + areaFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const ref = `PERM-BLDG-2026-${randomCode}`;
    setPermitRef(ref);
    setSubmittedAt(new Date().toLocaleString());
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyEndpoint = () => {
    navigator.clipboard.writeText('https://mapplewood-fictional-town.onrender.com/permits/building');
    setCopiedEndpoint(true);
    setTimeout(() => setCopiedEndpoint(false), 2000);
  };

  return (
    <article
      className="space-y-8 max-w-4xl mx-auto bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-sm"
      itemScope
      itemType="https://schema.org/ApplyAction"
      data-endpoint-url="https://mapplewood-fictional-town.onrender.com/permits/building"
      data-permit-type="Ontario Building Code & Municipal Construction Permit"
    >
      <SEOHead
        title="Building Permit Application & Construction Code Intake Form"
        description="Official online application form for Town of Maplewood building permits, structural additions, basement apartments, and commercial alterations."
        category="Building Permits"
      />

      {/* ── Scraper & API Direct Endpoint Header ── */}
      <div className="bg-slate-900 text-slate-100 p-4 rounded-xl text-xs space-y-2 border border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-mono font-bold uppercase text-slate-300">
              Direct Permit Endpoint &middot; AI Scraper &amp; Chatbot Ready
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
          Permanent URI: <span className="text-emerald-400">https://mapplewood-fictional-town.onrender.com/permits/building</span> &bull; Action: <span className="text-amber-300">Online Building Permit Intake Form</span>
        </p>
      </div>

      <header className="border-b border-slate-200 pb-6 space-y-3">
        <div className="inline-block bg-indigo-100 text-indigo-800 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded">
          Building &amp; Planning Department
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-serif text-slate-900" itemProp="name">
          Building Permit Application Form
        </h1>
        <p className="text-base text-slate-600 leading-relaxed" itemProp="description">
          Submit your official building permit application for residential structural additions, secondary basement dwelling units, renovations, and commercial construction. Subject to the Ontario Building Code and Maplewood Building By-law.
        </p>
      </header>

      {/* ── Statutory Timelines & Scope Banner ── */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl space-y-1">
          <div className="text-xs font-bold uppercase tracking-wider text-indigo-900 font-mono">
            ⏱️ Statutory Review Timeline
          </div>
          <p className="text-xs text-indigo-950 leading-relaxed">
            {buildingPermits.reviewTimelines} Complete submissions reviewed within 10 business days for residential houses and 15 business days for small commercial.
          </p>
        </div>
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">
            📋 When Is a Permit Required?
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {buildingPermits.scope} Required for additions, structural changes, plumbing rough-ins, and accessory structures over 108 sq ft.
          </p>
        </div>
      </section>

      {/* ── Submission Confirmation Receipt ── */}
      {submitted && (
        <section
          className="p-6 bg-emerald-50 border-2 border-emerald-500 rounded-2xl space-y-4 animate-in fade-in duration-300"
          id="permit-receipt"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-900 text-xs font-bold uppercase font-mono tracking-wider">
                Application Received &middot; Under Plan Review
              </span>
              <h2 className="text-2xl font-bold text-emerald-950 font-serif">
                Building Permit File Opened!
              </h2>
              <p className="text-xs text-emerald-800">
                Official permit docket generated at {submittedAt}.
              </p>
            </div>
            <span className="text-3xl">📐</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-emerald-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-500 block uppercase font-mono text-[10px]">Permit Application Ref</span>
              <span className="font-bold font-mono text-base text-blue-900">{permitRef}</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase font-mono text-[10px]">Property Civic Address</span>
              <span className="font-bold text-slate-900">{formData.propertyAddress}</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase font-mono text-[10px]">Project Scope</span>
              <span className="font-bold text-slate-900">{formData.projectType.replace(/-/g, ' ').toUpperCase()} ({formData.floorAreaSqFt} sq ft)</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase font-mono text-[10px]">Permit Fee Total</span>
              <span className="font-bold text-slate-900">${totalPermitFee}.00 CAD ($150 base + $2.25/sq ft)</span>
            </div>
          </div>

          <p className="text-xs text-emerald-900 leading-relaxed">
            Your file has been assigned to the Chief Building Official for plans examination. An official intake confirmation and plan review checklist have been emailed to <strong>{formData.email}</strong>. Mandatory site inspections must be booked 48 hours in advance via (555) 123-4567 ext. 250.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => window.print()}
              className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors"
            >
              🖨️ Print Application Confirmation
            </button>
            <button
              onClick={() => setSubmitted(false)}
              className="bg-white border border-emerald-300 hover:bg-emerald-50 text-emerald-900 font-bold text-xs px-4 py-2 rounded-lg transition-colors"
            >
              Submit Another Building Application &rarr;
            </button>
          </div>
        </section>
      )}

      {/* ── Building Permit Application Form ── */}
      <form onSubmit={handleSubmit} className="space-y-8" id="building-permit-form">
        
        {/* Step 1: Project Classification */}
        <fieldset className="space-y-4">
          <legend className="text-lg font-bold text-slate-900 font-serif border-b border-slate-200 pb-2 w-full">
            1. Project Type &amp; Scope of Work
          </legend>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Project Classification *</label>
              <select
                value={formData.projectType}
                onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
              >
                <option value="residential-addition">Residential Addition (Sunroom, 2nd Storey)</option>
                <option value="basement-apartment">Second Unit / Legal Basement Apartment</option>
                <option value="structural-renovation">Interior Structural Wall Removal / Alteration</option>
                <option value="accessory-structure">Detached Garage / Workshop (&gt; 15 m² / 160 sq ft)</option>
                <option value="commercial-fitout">Commercial Storefront / Interior Fit-Out</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Proposed Gross Floor Area (sq ft) *</label>
              <input
                type="number"
                min="50"
                max="10000"
                required
                value={formData.floorAreaSqFt}
                onChange={(e) => setFormData({ ...formData, floorAreaSqFt: Number(e.target.value) })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Estimated Construction Value ($ CAD) *</label>
              <input
                type="number"
                min="1000"
                required
                placeholder="45000"
                value={formData.estimatedValue}
                onChange={(e) => setFormData({ ...formData, estimatedValue: Number(e.target.value) })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <span className="text-[10px] text-slate-500 block">Includes materials and labor value.</span>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Brief Construction Narrative</label>
              <input
                type="text"
                placeholder="e.g. Constructing 350 sq ft rear kitchen addition with frost footings"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        </fieldset>

        {/* Step 2: Property & Applicant Details */}
        <fieldset className="space-y-4">
          <legend className="text-lg font-bold text-slate-900 font-serif border-b border-slate-200 pb-2 w-full">
            2. Property &amp; Owner Information
          </legend>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Property Street Address (Maplewood) *</label>
              <input
                type="text"
                required
                placeholder="e.g. 74 Birchwood Crescent, Maplewood"
                value={formData.propertyAddress}
                onChange={(e) => setFormData({ ...formData, propertyAddress: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">19-Digit Assessment Roll Number (If known)</label>
              <input
                type="text"
                placeholder="19-12-000-012-34500-0000"
                value={formData.rollNumber}
                onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Property Owner Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Robert Kowalski"
                value={formData.applicantName}
                onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Email Address *</label>
              <input
                type="email"
                required
                placeholder="r.kowalski@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Phone Number *</label>
              <input
                type="tel"
                required
                placeholder="(555) 678-9012"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        </fieldset>

        {/* Step 3: Designer / Contractor & Plans Checklist */}
        <fieldset className="space-y-4">
          <legend className="text-lg font-bold text-slate-900 font-serif border-b border-slate-200 pb-2 w-full">
            3. Designer BCIN &amp; Plans Checklist
          </legend>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Qualified Designer / Architect Name</label>
              <input
                type="text"
                placeholder="e.g. Apex Architectural Drafting Ltd."
                value={formData.designerName}
                onChange={(e) => setFormData({ ...formData, designerName: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Building Code Identification # (BCIN)</label>
              <input
                type="text"
                placeholder="e.g. BCIN 48291 (or Homeowner Exemption)"
                value={formData.designerBcin}
                onChange={(e) => setFormData({ ...formData, designerBcin: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
              Required Submission Documents
            </div>
            <div className="flex flex-wrap gap-5 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.hasSitePlan}
                  onChange={(e) => setFormData({ ...formData, hasSitePlan: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                />
                Site Survey with Property Line Setbacks
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.hasStructuralDrawings}
                  onChange={(e) => setFormData({ ...formData, hasStructuralDrawings: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                />
                Structural Framing &amp; Foundation Drawings
              </label>
            </div>
          </div>
        </fieldset>

        {/* Fee Quote Preview */}
        <div className="p-4 bg-slate-900 text-white rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 uppercase font-mono tracking-wider block">
              Official Building Permit Fee Calculation
            </span>
            <div className="text-sm font-semibold text-slate-200">
              $150.00 Base Intake Fee + ({formData.floorAreaSqFt} sq ft &times; $2.25/sq ft)
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold font-mono text-indigo-300">${totalPermitFee}.00 CAD</span>
            <span className="text-[10px] text-slate-400 block font-mono">Payable upon plan review signoff</span>
          </div>
        </div>

        {/* Declarations */}
        <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer pt-2">
          <input
            type="checkbox"
            required
            checked={formData.agreeToBylaw}
            onChange={(e) => setFormData({ ...formData, agreeToBylaw: e.target.checked })}
            className="mt-0.5 h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
          />
          <span>
            I certify that the information provided is accurate and that construction will strictly adhere to the approved plans and the Ontario Building Code. I understand no construction may commence until the permit is officially issued.
          </span>
        </label>

        {/* Submit */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <NavLink to="/permits/apply" className="text-xs text-slate-500 hover:text-slate-800 font-semibold">
            &larr; View All Municipal Permit Forms
          </NavLink>
          <button
            type="submit"
            className="w-full sm:w-auto bg-indigo-700 hover:bg-indigo-600 text-white font-bold text-sm px-8 py-3 rounded-xl shadow-md transition-all hover:shadow-lg"
          >
            📐 Submit Building Permit Application &rarr;
          </button>
        </div>
      </form>
    </article>
  );
}
