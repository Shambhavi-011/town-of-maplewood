import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import SEOHead from '../../components/SEOHead';
import townData from '../../data/townData.json';

export default function TaxPaymentMethods() {
  const { paymentMethods } = townData.taxes;

  const [formData, setFormData] = useState({
    payerName: '',
    email: '',
    phone: '',
    propertyAddress: '',
    rollNumber: '',
    instalmentType: 'interim-1', // 'interim-1' | 'interim-2' | 'final-1' | 'final-2' | 'full-year' | 'custom'
    paymentAmount: 850,
    paymentChannel: 'interac', // 'interac' | 'online-banking' | 'credit-card'
    transactionRef: '',
    notes: '',
    agreeToTerms: false,
  });

  const [submitted, setSubmitted] = useState(false);
  const [receiptNumber, setReceiptNumber] = useState('');
  const [submittedAt, setSubmittedAt] = useState('');
  const [copiedEndpoint, setCopiedEndpoint] = useState(false);

  // Surcharge for credit card: 1.75%
  const surcharge = formData.paymentChannel === 'credit-card' ? Math.round(Number(formData.paymentAmount || 0) * 0.0175 * 100) / 100 : 0;
  const totalBilled = Number(formData.paymentAmount || 0) + surcharge;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const ref = `TAX-PAY-2026-${randomCode}`;
    setReceiptNumber(ref);
    setSubmittedAt(new Date().toLocaleString());
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyEndpoint = () => {
    navigator.clipboard.writeText('https://mapplewood-fictional-town.onrender.com/taxes/payment');
    setCopiedEndpoint(true);
    setTimeout(() => setCopiedEndpoint(false), 2000);
  };

  return (
    <article
      className="space-y-8 max-w-4xl mx-auto bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-sm"
      itemScope
      itemType="https://schema.org/GovernmentService"
      data-endpoint-url="https://mapplewood-fictional-town.onrender.com/taxes/payment"
      data-service-name="Online Property Tax Payment & Remittance Portal"
    >
      <SEOHead
        title="Online Property Tax Payment & Remittance Form"
        description="Official online tax remittance and payment submission portal for the Town of Maplewood. Pay interim and final property tax instalments with instant receipt generation."
        category="Finance & Taxation"
      />

      {/* ── Scraper & API Direct Endpoint Header ── */}
      <div className="bg-slate-900 text-slate-100 p-4 rounded-xl text-xs space-y-2 border border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-mono font-bold uppercase text-slate-300">
              Direct Tax Payment Endpoint &middot; AI Scraper &amp; Chatbot Ready
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
          Permanent URI: <span className="text-emerald-400">https://mapplewood-fictional-town.onrender.com/taxes/payment</span> &bull; Action: <span className="text-amber-300">Online Property Tax Remittance Intake</span>
        </p>
      </div>

      <header className="border-b border-slate-200 pb-6 space-y-3">
        <div className="inline-block bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded">
          Finance &amp; Revenue Services
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-serif text-slate-900" itemProp="name">
          Property Tax Payment &amp; Remittance Form
        </h1>
        <p className="text-base text-slate-600 leading-relaxed" itemProp="description">
          Submit online property tax payments, remit interim/final instalments, log banking transactions, and receive an instant official municipal tax payment receipt.
        </p>
      </header>

      {/* ── Payment Channels Overview ── */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900 font-serif">Accepted Payment Methods</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {paymentMethods.map((m, idx) => (
            <div key={m.method} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-blue-900 text-white flex items-center justify-center text-[10px] font-mono">
                  {idx + 1}
                </span>
                {m.method}
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">{m.instructions}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Confirmation Receipt ── */}
      {submitted && (
        <section
          className="p-6 bg-emerald-50 border-2 border-emerald-500 rounded-2xl space-y-4 animate-in fade-in duration-300"
          id="tax-payment-receipt"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-900 text-xs font-bold uppercase font-mono tracking-wider">
                Payment Remittance Logged &middot; Receipt Generated
              </span>
              <h2 className="text-2xl font-bold text-emerald-950 font-serif">
                Property Tax Payment Confirmed!
              </h2>
              <p className="text-xs text-emerald-800">
                Official municipal receipt issued at {submittedAt}.
              </p>
            </div>
            <span className="text-3xl">🧾</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-emerald-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-500 block uppercase font-mono text-[10px]">Tax Receipt Number</span>
              <span className="font-bold font-mono text-base text-emerald-900">{receiptNumber}</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase font-mono text-[10px]">Assessment Roll Number</span>
              <span className="font-bold font-mono text-slate-900">{formData.rollNumber}</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase font-mono text-[10px]">Total Remittance</span>
              <span className="font-bold text-slate-900">${totalBilled.toFixed(2)} CAD</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase font-mono text-[10px]">Channel Used</span>
              <span className="font-bold text-slate-900">{formData.paymentChannel.toUpperCase()}</span>
            </div>
          </div>

          <p className="text-xs text-emerald-900 leading-relaxed">
            Your payment receipt has been delivered to <strong>{formData.email}</strong>. Payments submitted electronically post to your tax roll within 2 to 3 business days, retaining the date of transmission as the statutory effective payment date.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => window.print()}
              className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors"
            >
              🖨️ Print Official Tax Receipt
            </button>
            <button
              onClick={() => setSubmitted(false)}
              className="bg-white border border-emerald-300 hover:bg-emerald-50 text-emerald-900 font-bold text-xs px-4 py-2 rounded-lg transition-colors"
            >
              Make Another Tax Payment &rarr;
            </button>
          </div>
        </section>
      )}

      {/* ── Tax Payment Form ── */}
      <form onSubmit={handleSubmit} className="space-y-8" id="tax-payment-form">
        
        {/* Step 1: Property Assessment Roll Info */}
        <fieldset className="space-y-4">
          <legend className="text-lg font-bold text-slate-900 font-serif border-b border-slate-200 pb-2 w-full">
            1. Property Assessment Roll &amp; Instalment
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
              <span className="text-[10px] text-slate-500 block">Must match 19-digit number on tax statement.</span>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Property Civic Address (Maplewood) *</label>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Instalment Due Date *</label>
              <select
                value={formData.instalmentType}
                onChange={(e) => setFormData({ ...formData, instalmentType: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
              >
                <option value="interim-1">2026 Interim Instalment 1 (Due Feb 27, 2026)</option>
                <option value="interim-2">2026 Interim Instalment 2 (Due Apr 30, 2026)</option>
                <option value="final-1">2026 Final Instalment 1 (Due Jun 30, 2026)</option>
                <option value="final-2">2026 Final Instalment 2 (Due Sep 30, 2026)</option>
                <option value="full-year">Full Annual Tax Balance (Discounted / Advance)</option>
                <option value="custom">Partial / Overdue Arrears Payment</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Payment Remittance Amount ($ CAD) *</label>
              <input
                type="number"
                min="10"
                max="50000"
                step="0.01"
                required
                value={formData.paymentAmount}
                onChange={(e) => setFormData({ ...formData, paymentAmount: Number(e.target.value) })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
              />
            </div>
          </div>
        </fieldset>

        {/* Step 2: Payment Method */}
        <fieldset className="space-y-4">
          <legend className="text-lg font-bold text-slate-900 font-serif border-b border-slate-200 pb-2 w-full">
            2. Payment Method
          </legend>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.paymentChannel === 'interac' ? 'border-emerald-600 bg-emerald-50/50' : 'border-slate-200 bg-slate-50/50'}`}>
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="paymentChannel"
                  value="interac"
                  checked={formData.paymentChannel === 'interac'}
                  onChange={(e) => setFormData({ ...formData, paymentChannel: e.target.value })}
                  className="mt-1 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300"
                />
                <div className="space-y-1">
                  <div className="font-bold text-slate-900 text-sm">Interac e-Transfer</div>
                  <div className="text-[11px] text-slate-600">No municipal fee. Remit to taxes@maplewood.fictionaltown.com</div>
                </div>
              </div>
            </label>

            <label className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.paymentChannel === 'online-banking' ? 'border-emerald-600 bg-emerald-50/50' : 'border-slate-200 bg-slate-50/50'}`}>
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="paymentChannel"
                  value="online-banking"
                  checked={formData.paymentChannel === 'online-banking'}
                  onChange={(e) => setFormData({ ...formData, paymentChannel: e.target.value })}
                  className="mt-1 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300"
                />
                <div className="space-y-1">
                  <div className="font-bold text-slate-900 text-sm">Online Banking Log</div>
                  <div className="text-[11px] text-slate-600">Payee: 'Town of Maplewood - Property Taxes'</div>
                </div>
              </div>
            </label>

            <label className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.paymentChannel === 'credit-card' ? 'border-emerald-600 bg-emerald-50/50' : 'border-slate-200 bg-slate-50/50'}`}>
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="paymentChannel"
                  value="credit-card"
                  checked={formData.paymentChannel === 'credit-card'}
                  onChange={(e) => setFormData({ ...formData, paymentChannel: e.target.value })}
                  className="mt-1 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300"
                />
                <div className="space-y-1">
                  <div className="font-bold text-slate-900 text-sm">Credit Card (Moneris)</div>
                  <div className="text-[11px] text-slate-600">Visa / Mastercard (1.75% fee applies)</div>
                </div>
              </div>
            </label>
          </div>
        </fieldset>

        {/* Step 3: Payer Details */}
        <fieldset className="space-y-4">
          <legend className="text-lg font-bold text-slate-900 font-serif border-b border-slate-200 pb-2 w-full">
            3. Payer &amp; Receipt Destination
          </legend>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Payer Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. John Doe"
                value={formData.payerName}
                onChange={(e) => setFormData({ ...formData, payerName: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Receipt Email Address *</label>
              <input
                type="email"
                required
                placeholder="john.doe@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Contact Phone *</label>
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
        </fieldset>

        {/* Total Cost Banner */}
        <div className="p-4 bg-slate-900 text-white rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 uppercase font-mono tracking-wider block">
              Remittance Amount Due
            </span>
            <div className="text-sm font-semibold text-slate-200">
              Tax Amount: ${Number(formData.paymentAmount || 0).toFixed(2)} {surcharge > 0 && `+ $${surcharge.toFixed(2)} convenience surcharge`}
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold font-mono text-emerald-400">${totalBilled.toFixed(2)} CAD</span>
            <span className="text-[10px] text-slate-400 block font-mono">Official Municipal Revenue Department</span>
          </div>
        </div>

        {/* Terms */}
        <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer pt-2">
          <input
            type="checkbox"
            required
            checked={formData.agreeToTerms}
            onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
            className="mt-0.5 h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
          />
          <span>
            I understand that payments submitted via this portal are transmitted directly to the Town of Maplewood tax revenue division. I verify that the 19-digit Assessment Roll Number entered above is correct.
          </span>
        </label>

        {/* Submit */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <NavLink to="/taxes/pre-authorized" className="text-xs text-slate-500 hover:text-slate-800 font-semibold">
            &larr; Prefer Automatic Debit? Enroll in PAP
          </NavLink>
          <button
            type="submit"
            className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-sm px-8 py-3 rounded-xl shadow-md transition-all hover:shadow-lg"
          >
            💳 Submit Property Tax Payment &rarr;
          </button>
        </div>
      </form>
    </article>
  );
}
