import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import SEOHead from '../../components/SEOHead';
import townData from '../../data/townData.json';

export default function PreAuthorized() {
  const { preAuthorizedPlans } = townData.taxes;

  const [formData, setFormData] = useState({
    ownerName: '',
    coOwnerName: '',
    email: '',
    phone: '',
    propertyAddress: '',
    rollNumber: '',
    planType: '10-month', // '10-month' | 'instalment'
    bankName: 'Royal Bank of Canada (RBC)',
    institutionNumber: '003',
    transitNumber: '12345',
    accountNumber: '',
    confirmVoidCheque: true,
    startDate: '2026-06-01',
    authorizedSignature: '',
    agreeToTerms: false,
  });

  const [submitted, setSubmitted] = useState(false);
  const [enrollmentRef, setEnrollmentRef] = useState('');
  const [submittedAt, setSubmittedAt] = useState('');
  const [copiedEndpoint, setCopiedEndpoint] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const ref = `PAP-TAX-2026-${randomCode}`;
    setEnrollmentRef(ref);
    setSubmittedAt(new Date().toLocaleString());
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyEndpoint = () => {
    navigator.clipboard.writeText('https://mapplewood-fictional-town.onrender.com/taxes/pre-authorized');
    setCopiedEndpoint(true);
    setTimeout(() => setCopiedEndpoint(false), 2000);
  };

  return (
    <article
      className="space-y-8 max-w-4xl mx-auto bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-sm"
      itemScope
      itemType="https://schema.org/GovernmentService"
      data-endpoint-url="https://mapplewood-fictional-town.onrender.com/taxes/pre-authorized"
      data-service-name="Pre-Authorized Property Tax Payment Plan Enrollment"
    >
      <SEOHead
        title="Pre-Authorized Property Tax Payment (PAP) Plan Enrollment Form"
        description="Official online enrollment form for Maplewood Pre-Authorized Debit tax plans. Automate your property tax payments with 10-month or instalment withdrawal plans."
        category="Property Taxes & Finance"
      />

      {/* ── Scraper & API Direct Endpoint Header ── */}
      <div className="bg-slate-900 text-slate-100 p-4 rounded-xl text-xs space-y-2 border border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-mono font-bold uppercase text-slate-300">
              Direct PAP Tax Enrollment Endpoint &middot; AI Scraper &amp; Chatbot Ready
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
          Permanent URI: <span className="text-emerald-400">https://mapplewood-fictional-town.onrender.com/taxes/pre-authorized</span> &bull; Action: <span className="text-amber-300">Pre-Authorized Tax Debit Application</span>
        </p>
      </div>

      <header className="border-b border-slate-200 pb-6 space-y-3">
        <div className="inline-block bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded">
          Finance &amp; Revenue Services
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-serif text-slate-900" itemProp="name">
          Pre-Authorized Payment (PAP) Plan Enrollment
        </h1>
        <p className="text-base text-slate-600 leading-relaxed" itemProp="description">
          Enroll in Maplewood's automated Pre-Authorized Debit plans to ensure your property taxes are paid on time without interest, late penalties, or manual bank remittances.
        </p>
      </header>

      {/* ── Plan Options Comparison ── */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`p-5 rounded-xl border-2 transition-all ${formData.planType === '10-month' ? 'border-emerald-600 bg-emerald-50/50' : 'border-slate-200 bg-slate-50'}`}>
          <div className="text-xs font-bold uppercase tracking-wider text-blue-800">Option 1</div>
          <h3 className="font-bold text-slate-900 text-base">10-Month Monthly Plan</h3>
          <p className="text-xs text-slate-700 leading-relaxed mt-1">
            {preAuthorizedPlans.plan10Month} Equal withdrawals on the 15th of each month from January through October.
          </p>
        </div>

        <div className={`p-5 rounded-xl border-2 transition-all ${formData.planType === 'instalment' ? 'border-emerald-600 bg-emerald-50/50' : 'border-slate-200 bg-slate-50'}`}>
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-800">Option 2</div>
          <h3 className="font-bold text-slate-900 text-base">Instalment Due Date Plan</h3>
          <p className="text-xs text-slate-700 leading-relaxed mt-1">
            {preAuthorizedPlans.planInstalment} Exact instalment amounts debited automatically on the 4 statutory due dates (Feb 27, Apr 30, Jun 30, Sep 30).
          </p>
        </div>
      </section>

      {/* ── Confirmation Receipt ── */}
      {submitted && (
        <section
          className="p-6 bg-emerald-50 border-2 border-emerald-500 rounded-2xl space-y-4 animate-in fade-in duration-300"
          id="pap-receipt"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-900 text-xs font-bold uppercase font-mono tracking-wider">
                Enrollment Confirmed &middot; Pre-Authorized Debit Active
              </span>
              <h2 className="text-2xl font-bold text-emerald-950 font-serif">
                Pre-Authorized Tax Plan Enrolled!
              </h2>
              <p className="text-xs text-emerald-800">
                Official PAD agreement registered at {submittedAt}.
              </p>
            </div>
            <span className="text-3xl">🏦</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-emerald-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-500 block uppercase font-mono text-[10px]">Enrollment Confirmation #</span>
              <span className="font-bold font-mono text-base text-emerald-900">{enrollmentRef}</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase font-mono text-[10px]">Assessment Roll Number</span>
              <span className="font-bold font-mono text-slate-900">{formData.rollNumber}</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase font-mono text-[10px]">Enrolled Plan</span>
              <span className="font-bold text-slate-900">{formData.planType === '10-month' ? '10-Month Monthly Plan' : '4-Instalment Due Date Plan'}</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase font-mono text-[10px]">Financial Institution</span>
              <span className="font-bold text-slate-900">{formData.bankName} (Transit: {formData.transitNumber})</span>
            </div>
          </div>

          <p className="text-xs text-emerald-900 leading-relaxed">
            Your pre-authorized debit agreement has been lodged with the Maplewood Treasury department. A formal confirmation letter and monthly deduction schedule have been sent to <strong>{formData.email}</strong>. Written notice of 30 days is required for bank changes or plan cancellation.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => window.print()}
              className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors"
            >
              🖨️ Print PAD Agreement
            </button>
            <button
              onClick={() => setSubmitted(false)}
              className="bg-white border border-emerald-300 hover:bg-emerald-50 text-emerald-900 font-bold text-xs px-4 py-2 rounded-lg transition-colors"
            >
              Enroll Another Property &rarr;
            </button>
          </div>
        </section>
      )}

      {/* ── PAP Enrollment Form ── */}
      <form onSubmit={handleSubmit} className="space-y-8" id="pap-enrollment-form">
        
        {/* Step 1: Select Plan */}
        <fieldset className="space-y-4">
          <legend className="text-lg font-bold text-slate-900 font-serif border-b border-slate-200 pb-2 w-full">
            1. Select Pre-Authorized Debit Option
          </legend>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${formData.planType === '10-month' ? 'border-emerald-600 bg-emerald-50/50' : 'border-slate-200 bg-slate-50/50'}`}>
              <input
                type="radio"
                name="planType"
                value="10-month"
                checked={formData.planType === '10-month'}
                onChange={(e) => setFormData({ ...formData, planType: e.target.value })}
                className="mt-1 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300"
              />
              <div className="space-y-1">
                <div className="font-bold text-slate-900 text-sm">10-Month Monthly Plan</div>
                <div className="text-xs text-slate-600">Withdrawn on the 15th of each month (Jan &ndash; Oct). Annual tax divided into 10 instalments.</div>
              </div>
            </label>

            <label className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${formData.planType === 'instalment' ? 'border-emerald-600 bg-emerald-50/50' : 'border-slate-200 bg-slate-50/50'}`}>
              <input
                type="radio"
                name="planType"
                value="instalment"
                checked={formData.planType === 'instalment'}
                onChange={(e) => setFormData({ ...formData, planType: e.target.value })}
                className="mt-1 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300"
              />
              <div className="space-y-1">
                <div className="font-bold text-slate-900 text-sm">4-Instalment Due Date Plan</div>
                <div className="text-xs text-slate-600">Withdrawn only on the 4 statutory tax due dates (Feb 27, Apr 30, Jun 30, Sep 30).</div>
              </div>
            </label>
          </div>
        </fieldset>

        {/* Step 2: Property & Owner Details */}
        <fieldset className="space-y-4">
          <legend className="text-lg font-bold text-slate-900 font-serif border-b border-slate-200 pb-2 w-full">
            2. Property Assessment &amp; Owner Details
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
              <span className="text-[10px] text-slate-500 block">Found in the upper-right corner of your municipal tax bill.</span>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Property Street Address (Maplewood) *</label>
              <input
                type="text"
                required
                placeholder="e.g. 158 Oakridge Drive, Maplewood"
                value={formData.propertyAddress}
                onChange={(e) => setFormData({ ...formData, propertyAddress: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Registered Owner Full Name *</label>
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
              <label className="text-xs font-bold text-slate-700 block">Daytime Phone *</label>
              <input
                type="tel"
                required
                placeholder="(555) 789-0123"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        </fieldset>

        {/* Step 3: Direct Debit Banking Information */}
        <fieldset className="space-y-4">
          <legend className="text-lg font-bold text-slate-900 font-serif border-b border-slate-200 pb-2 w-full">
            3. Banking &amp; Direct Debit Details
          </legend>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Financial Institution Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Royal Bank of Canada (RBC), TD, Scotiabank"
                value={formData.bankName}
                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Institution Number (3 Digits) *</label>
              <input
                type="text"
                required
                maxLength={3}
                placeholder="003"
                value={formData.institutionNumber}
                onChange={(e) => setFormData({ ...formData, institutionNumber: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Branch / Transit Number (5 Digits) *</label>
              <input
                type="text"
                required
                maxLength={5}
                placeholder="12345"
                value={formData.transitNumber}
                onChange={(e) => setFormData({ ...formData, transitNumber: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Account Number (7–12 Digits) *</label>
              <input
                type="text"
                required
                placeholder="1234567"
                value={formData.accountNumber}
                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
            <div className="text-xs font-bold text-emerald-950">Bank Account Cheque Verification Specimen:</div>
            <div className="bg-white p-3 rounded border border-emerald-300 font-mono text-xs text-slate-700 flex flex-wrap justify-between gap-2">
              <span>Branch/Transit: <strong>{formData.transitNumber || 'XXXXX'}</strong> (5 digits)</span>
              <span>Institution: <strong>{formData.institutionNumber || 'XXX'}</strong> (3 digits)</span>
              <span>Account: <strong>{formData.accountNumber || 'XXXXXXX'}</strong> (7-12 digits)</span>
            </div>
          </div>
        </fieldset>

        {/* Step 4: Electronic Signature & Terms */}
        <div className="space-y-3 pt-2">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 block">Type Full Legal Name as Electronic Signature *</label>
            <input
              type="text"
              required
              placeholder="e.g. Eleanor Vance"
              value={formData.authorizedSignature}
              onChange={(e) => setFormData({ ...formData, authorizedSignature: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none font-serif italic text-base"
            />
          </div>

          <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer pt-2">
            <input
              type="checkbox"
              required
              checked={formData.agreeToTerms}
              onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
              className="mt-0.5 h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
            />
            <span>
              I authorize the Town of Maplewood to debit the bank account indicated above for property tax instalments. I have the authority under the bank account agreement to authorize debits. I understand that a minimum of 30 days written notice is required to cancel or modify this PAD agreement.
            </span>
          </label>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <NavLink to="/taxes/payment" className="text-xs text-slate-500 hover:text-slate-800 font-semibold">
            &larr; View Other Tax Payment Options
          </NavLink>
          <button
            type="submit"
            className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-sm px-8 py-3 rounded-xl shadow-md transition-all hover:shadow-lg"
          >
            📑 Submit Pre-Authorized Debit Enrollment &rarr;
          </button>
        </div>
      </form>
    </article>
  );
}
