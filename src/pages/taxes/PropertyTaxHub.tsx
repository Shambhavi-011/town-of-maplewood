import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import SEOHead from '../../components/SEOHead';
import townData from '../../data/townData.json';

export default function PropertyTaxHub() {
  const { propertyTaxes } = townData.taxes;

  const [formData, setFormData] = useState({
    ownerName: '',
    email: '',
    phone: '',
    propertyAddress: '',
    rollNumber: '',
    inquiryType: 'balance-inquiry', // 'balance-inquiry' | 'tax-certificate' | 'senior-rebate' | 'mpac-appeal'
    assessedValue: 450000,
    inquiryNotes: '',
    agreeToTerms: false,
  });

  const [submitted, setSubmitted] = useState(false);
  const [inquiryRef, setInquiryRef] = useState('');
  const [submittedAt, setSubmittedAt] = useState('');
  const [copiedEndpoint, setCopiedEndpoint] = useState(false);

  // Mill rate calculation: 0.0094523
  const calculatedTax = Math.round(Number(formData.assessedValue || 0) * 0.0094523 * 100) / 100;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const ref = `TAX-INQ-2026-${randomCode}`;
    setInquiryRef(ref);
    setSubmittedAt(new Date().toLocaleString());
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyEndpoint = () => {
    navigator.clipboard.writeText('https://mapplewood-fictional-town.onrender.com/taxes');
    setCopiedEndpoint(true);
    setTimeout(() => setCopiedEndpoint(false), 2000);
  };

  return (
    <article
      className="space-y-8 max-w-4xl mx-auto bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-sm"
      itemScope
      itemType="https://schema.org/GovernmentService"
      data-endpoint-url="https://mapplewood-fictional-town.onrender.com/taxes"
      data-service-name="Property Taxes & Assessment Services"
    >
      <SEOHead
        title="Property Taxes, Assessment & Online Account Inquiry Portal"
        description="Town of Maplewood Property Taxes Portal: 2026 residential mill rate (0.0094523), instalment due dates, tax relief grants, and official statement requests."
        category="Finance & Taxation"
      />

      {/* ── Scraper & API Direct Endpoint Header ── */}
      <div className="bg-slate-900 text-slate-100 p-4 rounded-xl text-xs space-y-2 border border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-mono font-bold uppercase text-slate-300">
              Direct Property Tax Portal Endpoint &middot; AI Scraper &amp; Chatbot Ready
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
          Permanent URI: <span className="text-emerald-400">https://mapplewood-fictional-town.onrender.com/taxes</span> &bull; Action: <span className="text-amber-300">Property Tax Assessment Inquiry &amp; Services Portal</span>
        </p>
      </div>

      <header className="border-b border-slate-200 pb-6 space-y-3">
        <div className="inline-block bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded">
          Finance &amp; Revenue Services
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-serif text-slate-900" itemProp="name">
          Property Taxes &amp; Assessment Portal
        </h1>
        <p className="text-base text-slate-600 leading-relaxed" itemProp="description">
          Review the Town of Maplewood {propertyTaxes.taxYear} residential mill rate, verify statutory payment deadlines, estimate your annual bill, and submit tax inquiries, certificate requests, or senior relief applications.
        </p>
      </header>

      {/* ── Key Tax Metrics Card ── */}
      <section className="bg-emerald-50 border-l-4 border-emerald-600 p-5 rounded-r-xl space-y-3">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-emerald-950 font-serif">
              {propertyTaxes.taxYear} Residential Mill Rate
            </h2>
            <p className="text-xs text-emerald-900">
              $945.23 per $100,000 of MPAC current value assessment.
            </p>
          </div>
          <span className="text-2xl font-bold font-mono text-emerald-950 bg-white px-3 py-1 rounded border border-emerald-200 shadow-sm">
            {propertyTaxes.residentialTaxRate}
          </span>
        </div>

        <div className="pt-2 border-t border-emerald-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-emerald-950">
          <div><strong>Interim 1:</strong> Feb 27, 2026</div>
          <div><strong>Interim 2:</strong> Apr 30, 2026</div>
          <div><strong>Final 1:</strong> Jun 30, 2026</div>
          <div><strong>Final 2:</strong> Sep 30, 2026</div>
        </div>
      </section>

      {/* ── Direct Quick Action Links ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <NavLink
          to="/taxes/payment"
          className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 transition-all text-xs space-y-1 block"
        >
          <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
            <span>💳</span> Online Tax Payment &rarr;
          </div>
          <p className="text-slate-600">Pay your property tax bills online via Interac or Credit Card.</p>
        </NavLink>

        <NavLink
          to="/taxes/pre-authorized"
          className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 transition-all text-xs space-y-1 block"
        >
          <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
            <span>📑</span> Pre-Authorized Debit (PAP) &rarr;
          </div>
          <p className="text-slate-600">Enroll in automatic 10-month or 4-instalment bank withdrawals.</p>
        </NavLink>

        <NavLink
          to="/taxes/calculator"
          className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 transition-all text-xs space-y-1 block"
        >
          <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
            <span>🧮</span> Property Tax Estimator &rarr;
          </div>
          <p className="text-slate-600">Calculate municipal, regional, and education tax breakdowns.</p>
        </NavLink>
      </div>

      {/* ── Confirmation Receipt ── */}
      {submitted && (
        <section
          className="p-6 bg-emerald-50 border-2 border-emerald-500 rounded-2xl space-y-4 animate-in fade-in duration-300"
          id="tax-inquiry-receipt"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-900 text-xs font-bold uppercase font-mono tracking-wider">
                Inquiry Logged &middot; Treasury Docket Active
              </span>
              <h2 className="text-2xl font-bold text-emerald-950 font-serif">
                Tax Account Inquiry Received!
              </h2>
              <p className="text-xs text-emerald-800">
                Official municipal case file logged at {submittedAt}.
              </p>
            </div>
            <span className="text-3xl">📑</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-emerald-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-500 block uppercase font-mono text-[10px]">Inquiry Tracking Ref</span>
              <span className="font-bold font-mono text-base text-emerald-900">{inquiryRef}</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase font-mono text-[10px]">Assessment Roll Number</span>
              <span className="font-bold font-mono text-slate-900">{formData.rollNumber}</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase font-mono text-[10px]">Inquiry Type</span>
              <span className="font-bold text-slate-900">{formData.inquiryType.replace(/-/g, ' ').toUpperCase()}</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase font-mono text-[10px]">Estimated Annual Tax</span>
              <span className="font-bold text-slate-900">${calculatedTax.toFixed(2)} CAD</span>
            </div>
          </div>

          <p className="text-xs text-emerald-900 leading-relaxed">
            The Revenue &amp; Taxation Division will process your inquiry within 2 business days. Official records or requested statements will be delivered to <strong>{formData.email}</strong>.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => window.print()}
              className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors"
            >
              🖨️ Print Inquiry Summary
            </button>
            <button
              onClick={() => setSubmitted(false)}
              className="bg-white border border-emerald-300 hover:bg-emerald-50 text-emerald-900 font-bold text-xs px-4 py-2 rounded-lg transition-colors"
            >
              Submit Another Inquiry &rarr;
            </button>
          </div>
        </section>
      )}

      {/* ── Tax Services & Inquiry Form ── */}
      <form onSubmit={handleSubmit} className="space-y-8" id="tax-inquiry-form">
        
        {/* Step 1: Select Inquiry Type */}
        <fieldset className="space-y-4">
          <legend className="text-lg font-bold text-slate-900 font-serif border-b border-slate-200 pb-2 w-full">
            1. Select Property Tax Service or Inquiry
          </legend>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.inquiryType === 'balance-inquiry' ? 'border-emerald-600 bg-emerald-50/50' : 'border-slate-200 bg-slate-50/50'}`}>
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="inquiryType"
                  value="balance-inquiry"
                  checked={formData.inquiryType === 'balance-inquiry'}
                  onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                  className="mt-1 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300"
                />
                <div className="space-y-1">
                  <div className="font-bold text-slate-900 text-sm">Account Balance &amp; Due Date Inquiry</div>
                  <div className="text-[11px] text-slate-600">Verify current balance, outstanding arrears, or payments processed.</div>
                </div>
              </div>
            </label>

            <label className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.inquiryType === 'tax-certificate' ? 'border-emerald-600 bg-emerald-50/50' : 'border-slate-200 bg-slate-50/50'}`}>
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="inquiryType"
                  value="tax-certificate"
                  checked={formData.inquiryType === 'tax-certificate'}
                  onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                  className="mt-1 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300"
                />
                <div className="space-y-1">
                  <div className="font-bold text-slate-900 text-sm">Official Tax Certificate ($45.00 CAD)</div>
                  <div className="text-[11px] text-slate-600">Certified legal statement required for real estate closings &amp; mortgages.</div>
                </div>
              </div>
            </label>

            <label className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.inquiryType === 'senior-rebate' ? 'border-emerald-600 bg-emerald-50/50' : 'border-slate-200 bg-slate-50/50'}`}>
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="inquiryType"
                  value="senior-rebate"
                  checked={formData.inquiryType === 'senior-rebate'}
                  onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                  className="mt-1 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300"
                />
                <div className="space-y-1">
                  <div className="font-bold text-slate-900 text-sm">Senior / Low-Income Tax Relief Grant ($450)</div>
                  <div className="text-[11px] text-slate-600">Annual municipal property tax rebate for qualifying low-income seniors.</div>
                </div>
              </div>
            </label>

            <label className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.inquiryType === 'mpac-appeal' ? 'border-emerald-600 bg-emerald-50/50' : 'border-slate-200 bg-slate-50/50'}`}>
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="inquiryType"
                  value="mpac-appeal"
                  checked={formData.inquiryType === 'mpac-appeal'}
                  onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                  className="mt-1 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300"
                />
                <div className="space-y-1">
                  <div className="font-bold text-slate-900 text-sm">Assessment Appeal &amp; Classification Review</div>
                  <div className="text-[11px] text-slate-600">Request review of MPAC assessment value or tax property class code.</div>
                </div>
              </div>
            </label>
          </div>
        </fieldset>

        {/* Step 2: Property & Owner Details */}
        <fieldset className="space-y-4">
          <legend className="text-lg font-bold text-slate-900 font-serif border-b border-slate-200 pb-2 w-full">
            2. Property Assessment &amp; Contact Details
          </legend>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">19-Digit Assessment Roll Number *</label>
              <input
                type="text"
                required
                placeholder="19-12-000-012-34500-0000"
                value={formData.rollNumber}
                onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Property Street Address (Maplewood) *</label>
              <input
                type="text"
                required
                placeholder="e.g. 123 Main St, Maplewood"
                value={formData.propertyAddress}
                onChange={(e) => setFormData({ ...formData, propertyAddress: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Property Owner Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Eleanor Vance"
                value={formData.ownerName}
                onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Email Address *</label>
              <input
                type="email"
                required
                placeholder="e.vance@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Phone *</label>
              <input
                type="tel"
                required
                placeholder="(555) 123-4567"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Current MPAC Assessed Value ($ CAD)</label>
              <input
                type="number"
                min="50000"
                step="5000"
                value={formData.assessedValue}
                onChange={(e) => setFormData({ ...formData, assessedValue: Number(e.target.value) })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
              />
              <span className="text-[10px] text-slate-500 block">Estimated 2026 Annual Tax: ${calculatedTax.toFixed(2)}</span>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Inquiry / Request Details</label>
              <input
                type="text"
                placeholder="e.g. Please send statement of account for 2025-2026 tax years"
                value={formData.inquiryNotes}
                onChange={(e) => setFormData({ ...formData, inquiryNotes: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        </fieldset>

        {/* Declarations */}
        <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer pt-2">
          <input
            type="checkbox"
            required
            checked={formData.agreeToTerms}
            onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
            className="mt-0.5 h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
          />
          <span>
            I certify that I am the registered property owner or authorized legal agent for the parcel indicated above.
          </span>
        </label>

        {/* Submit */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <NavLink to="/taxes/info" className="text-xs text-slate-500 hover:text-slate-800 font-semibold">
            &larr; View Mill Rates &amp; Distribution Breakdown
          </NavLink>
          <button
            type="submit"
            className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-sm px-8 py-3 rounded-xl shadow-md transition-all hover:shadow-lg"
          >
            📑 Submit Tax Inquiry or Certificate Request &rarr;
          </button>
        </div>
      </form>
    </article>
  );
}

