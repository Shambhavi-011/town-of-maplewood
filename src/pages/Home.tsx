import { NavLink } from 'react-router-dom';
import townData from '../data/townData.json';
import SEOHead from '../components/SEOHead';

export default function Home() {
  const { townInfo, services, taxes, documents } = townData;
  const forms = townData.directFormsDirectory || [];

  const getFormIcon = (id: string) => {
    switch (id) {
      case 'deck-permit-apply': return '📐';
      case 'pool-permit-apply': return '🏊';
      case 'burn-permit-apply': return '🔥';
      case 'building-permit-apply': return '📐';
      case 'recreation-camp-apply': return '🏕️';
      case 'community-booking-apply': return '🏛️';
      case 'parks-reservation-apply': return '🌳';
      case 'services-waste-form': return '🚛';
      case 'taxes-services-hub': return '📑';
      case 'permits-portal-hub': return '🏛️';
      case '311-service-request-portal': return '🛠️';
      case '311-pothole-request': return '🚧';
      case '311-missed-waste-request': return '🚛';
      case '311-streetlight-request': return '💡';
      case '311-park-tree-request': return '🌳';
      case '311-water-request': return '💧';
      case '311-case-tracker': return '🔍';
      case 'taxes-calculator': return '🧮';
      case 'taxes-pap-enrollment': return '📑';
      case 'taxes-payment-methods': return '💳';
      default: return '📋';
    }
  };

  const quickActions = [
    {
      title: 'Waste & Recycling',
      desc: 'Bins out by 7 AM. Missed collection reports after 5 PM.',
      to: '/services/waste',
      icon: '🚛',
      badge: 'Public Works',
      color: 'border-l-blue-600',
    },
    {
      title: 'Report a Pothole or Road Issue',
      desc: 'Submit exact location, size & lane. 24h repair for severe hazards.',
      to: '/services/request?type=pothole',
      icon: '🚧',
      badge: 'High Priority',
      color: 'border-l-amber-500',
    },
    {
      title: 'Property Taxes & Payments',
      desc: '2026 tax rates, instalment due dates (Feb, Apr, Jun, Sep) & PAP.',
      to: '/taxes/info',
      icon: '💳',
      badge: 'Finance',
      color: 'border-l-emerald-600',
    },
    {
      title: 'Deck & Pool Permits',
      desc: 'Building by-laws, 1.5m pool enclosure rules, and online applications.',
      to: '/permits/decks',
      icon: '📐',
      badge: 'Building Dept',
      color: 'border-l-indigo-600',
    },
    {
      title: 'Open-Air Burn Permits',
      desc: 'Rural zone burning, instant permits, clearances & fire ban rules.',
      to: '/permits/burn',
      icon: '🔥',
      badge: 'Fire & Rescue',
      color: 'border-l-orange-500',
    },
    {
      title: 'By-laws & Fee Schedule',
      desc: 'Noise, property standards, 2026 master fees & official regulations.',
      to: '/documents/by-laws',
      icon: '⚖️',
      badge: 'Legislative',
      color: 'border-l-purple-600',
    },
    {
      title: 'Winter Maintenance & Snow',
      desc: 'Overnight street parking ban (2 AM – 6 AM), priority plow routes.',
      to: '/services/snow',
      icon: '❄️',
      badge: 'Seasonal By-law',
      color: 'border-l-sky-500',
    },
    {
      title: 'Dog Licensing & Animal Control',
      desc: 'Annual dog tags ($30 spayed/neutered), 2m leash by-law & shelter.',
      to: '/services/animals',
      icon: '🐕',
      badge: 'Clerk Services',
      color: 'border-l-teal-600',
    },
  ];

  return (
    <article className="space-y-10" itemScope itemType="https://schema.org/GovernmentOrganization">
      <SEOHead
        title="Official Municipal Knowledge Portal"
        description="Official Town of Maplewood municipal portal. Access curbside waste rules, road repairs, property tax due dates, deck and pool permits, and town council records."
        category="Civic Portal"
      />
      {/* ── Hero Municipal Banner ── */}
      <header className="relative bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white rounded-2xl p-8 md:p-12 shadow-xl overflow-hidden border border-blue-800">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-blue-800/80 text-blue-200 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-sm border border-blue-700">
            <span>🍁 Municipal Knowledge &amp; Citizen Portal</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold font-serif tracking-tight leading-tight">
            Welcome to the Town of Maplewood
          </h1>
          <p className="text-base md:text-lg text-blue-100/90 leading-relaxed">
            {townInfo.motto}. Access municipal services, view official by-laws, apply for building and burn permits, calculate property taxes, and report community infrastructure issues.
          </p>

          <div className="pt-2 flex flex-wrap gap-3 text-xs md:text-sm">
            <a
              href="#municipal-forms-directory"
              className="bg-emerald-400 hover:bg-emerald-300 text-blue-950 font-bold px-5 py-2.5 rounded-lg shadow transition-all hover:shadow-lg flex items-center gap-2"
            >
              <span>📋 All Online Forms &amp; Permits</span>
              <span>&darr;</span>
            </a>
            <NavLink
              to="/services/request"
              className="bg-amber-400 hover:bg-amber-300 text-blue-950 font-bold px-5 py-2.5 rounded-lg shadow transition-all hover:shadow-lg flex items-center gap-2"
            >
              <span>🛠️ 311 Service Requests</span>
              <span>&rarr;</span>
            </NavLink>
            <NavLink
              to="/about"
              className="bg-blue-700 hover:bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-lg shadow transition-all flex items-center gap-2 border border-blue-600"
            >
              <span>🏛️ Town Info &amp; Council</span>
            </NavLink>
            <NavLink
              to="/services/waste"
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-5 py-2.5 rounded-lg border border-white/20 backdrop-blur-sm transition-all flex items-center gap-2"
            >
              <span>Municipal Services</span>
            </NavLink>
            <NavLink
              to="/taxes/calculator"
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-5 py-2.5 rounded-lg border border-white/20 backdrop-blur-sm transition-all flex items-center gap-2"
            >
              <span>Tax Calculator</span>
            </NavLink>
          </div>

          {/* Direct 311 Citizen Municipal Service Request Quick Links Strip */}
          <div className="pt-3 border-t border-white/15 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-blue-200">
              <span className="font-bold flex items-center gap-1.5 text-amber-300">
                <span>⚡ Direct 311 Citizen Service Requests:</span>
              </span>
              <NavLink to="/services/track" className="hover:underline text-blue-300 flex items-center gap-1">
                <span>🔍 Track 311 Case Status</span>
                <span>&rarr;</span>
              </NavLink>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-xs">
              <NavLink
                to="/services/request?type=pothole"
                className="bg-white/10 hover:bg-amber-400 hover:text-blue-950 p-2 rounded-lg border border-white/15 transition-all text-center font-medium truncate"
                title="Direct Form: Report Pothole or Road Hazard (24h SLA)"
              >
                🚧 Potholes
              </NavLink>
              <NavLink
                to="/services/request?type=waste"
                className="bg-white/10 hover:bg-amber-400 hover:text-blue-950 p-2 rounded-lg border border-white/15 transition-all text-center font-medium truncate"
                title="Direct Form: Report Missed Curbside Waste / Broken Bin"
              >
                🚛 Missed Waste
              </NavLink>
              <NavLink
                to="/services/request?type=light"
                className="bg-white/10 hover:bg-amber-400 hover:text-blue-950 p-2 rounded-lg border border-white/15 transition-all text-center font-medium truncate"
                title="Direct Form: Report Streetlight Outage (Pole ML-XXXX)"
              >
                💡 Streetlights
              </NavLink>
              <NavLink
                to="/services/request?type=tree"
                className="bg-white/10 hover:bg-amber-400 hover:text-blue-950 p-2 rounded-lg border border-white/15 transition-all text-center font-medium truncate"
                title="Direct Form: Report Park Hazard, Broken Bin or Boulevard Tree"
              >
                🌳 Parks &amp; Bins
              </NavLink>
              <NavLink
                to="/services/request?type=water"
                className="bg-white/10 hover:bg-amber-400 hover:text-blue-950 p-2 rounded-lg border border-white/15 transition-all text-center font-medium truncate"
                title="Direct Form: Report Water Pressure or Meter Issue"
              >
                💧 Water Pressure
              </NavLink>
              <NavLink
                to="/services/track"
                className="bg-emerald-500/20 hover:bg-emerald-400 hover:text-blue-950 p-2 rounded-lg border border-emerald-400/30 transition-all text-center font-medium text-emerald-200 truncate"
                title="Live 311 Case & Work Order Status Tracker"
              >
                🔍 Live Tracker
              </NavLink>
            </div>
          </div>
        </div>

        {/* Decorative background watermark */}
        <div className="absolute right-[-20px] bottom-[-40px] text-blue-800/20 text-[220px] select-none pointer-events-none font-serif">
          🍁
        </div>
      </header>

      {/* ── Urgent Advisories & Municipal Alerts Strip ── */}
      <section className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl shadow-sm text-amber-950 space-y-1">
        <div className="flex items-center gap-2 font-bold text-sm text-amber-900">
          <span className="text-base">⚠️</span> Active Municipal Alerts &amp; Timelines
        </div>
        <p className="text-xs md:text-sm text-amber-900/90 leading-relaxed">
          <strong>Curbside Rule:</strong> {services.wasteRecycling.curbsidePlacementRule} ·{' '}
          <strong>Winter Parking:</strong> {services.snowRemoval.overnightParkingBan.split('.')[0]}.
        </p>
      </section>

      {/* ── Key Citizen Action Cards Grid ── */}
      <section aria-labelledby="quick-services-heading">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 id="quick-services-heading" className="text-2xl font-bold font-serif text-slate-900">
              Resident Services &amp; Citizen Portals
            </h2>
            <p className="text-sm text-slate-600">
              Direct access to departments, online submissions, and municipal guidelines.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {quickActions.map((action) => (
            <NavLink
              key={action.title}
              to={action.to}
              className={`bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all border-l-4 ${action.color} group flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl p-2 bg-slate-50 rounded-lg group-hover:scale-110 transition-transform">
                    {action.icon}
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {action.badge}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-900 transition-colors mb-1.5">
                  {action.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {action.desc}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-900 group-hover:text-blue-700">
                <span>View Guidelines &amp; Rules</span>
                <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
              </div>
            </NavLink>
          ))}
        </div>
      </section>

      {/* ── Featured Direct Permit Forms & 311 Service Request Directory (Scraper Ready) ── */}
      <section
        id="municipal-forms-directory"
        className="scroll-mt-20 space-y-10"
        itemScope
        itemType="https://schema.org/GovernmentService"
        data-scraper-role="official-forms-index"
      >
        {/* ── 1. Dedicated 311 Citizen Municipal Service Requests Section ── */}
        <div
          id="service-requests-directory"
          className="scroll-mt-24 bg-gradient-to-r from-amber-950/90 via-slate-900 to-blue-950 text-white p-6 sm:p-8 rounded-2xl shadow-lg space-y-6 border border-amber-500/30"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
                  🚨 Direct 311 Municipal Service Request Forms
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white tracking-tight">
                Citizen 311 Service Request Forms &amp; Work Orders
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
                Submit non-emergency municipal work orders directly to Public Works, Roads, Sanitation, and Parks crews. Each request automatically receives a tracked <strong>CASE-2026-XXXX</strong> reference number with guaranteed service level agreements (SLAs).
              </p>
            </div>
            <div className="flex flex-wrap gap-2 self-start md:self-auto">
              <NavLink
                to="/services/track"
                className="bg-emerald-500 hover:bg-emerald-400 text-blue-950 text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow whitespace-nowrap flex items-center gap-1.5"
              >
                <span>🔍 Track 311 Status</span>
                <span>&rarr;</span>
              </NavLink>
              <NavLink
                to="/services/request"
                className="bg-amber-400 hover:bg-amber-300 text-blue-950 text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow whitespace-nowrap"
              >
                Central 311 Portal &rarr;
              </NavLink>
            </div>
          </div>

          {/* All 7 Service Request Form Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {forms
              .filter((f) => f.category.includes('311'))
              .map((form) => {
                const icon = getFormIcon(form.id);
                return (
                  <article
                    key={form.id}
                    id={form.id}
                    className="bg-white/10 hover:bg-white/15 rounded-xl p-5 border border-white/15 backdrop-blur-xs transition-all flex flex-col justify-between space-y-4 group"
                    data-form-endpoint={form.url}
                    data-form-category="311 Service Request"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl p-1.5 bg-white/10 rounded-lg">{icon}</span>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded font-mono bg-amber-500/30 text-amber-200 border border-amber-400/30">
                            311 Service Request
                          </span>
                        </div>
                        <span className="text-[11px] font-bold font-mono text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30 whitespace-nowrap">
                          {form.fee}
                        </span>
                      </div>

                      <div>
                        <h3 className="font-bold text-base text-white group-hover:text-amber-300 transition-colors">
                          <NavLink to={form.relativeUrl} className="hover:underline">
                            {form.title}
                          </NavLink>
                        </h3>
                        <div className="text-[11px] text-amber-200 font-mono mt-0.5">
                          Resolution SLA: <span className="font-semibold text-white">{form.sla}</span>
                        </div>
                      </div>

                      <div className="bg-black/30 p-3 rounded-lg border border-white/10 space-y-1.5">
                        <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1">
                          <span>📌 When to Use This Service Request Form:</span>
                        </div>
                        <p className="text-xs text-slate-200 leading-relaxed">
                          {form.exactUse}
                        </p>
                      </div>

                      {form.requiredDetails && form.requiredDetails.length > 0 && (
                        <div className="space-y-1 text-xs">
                          <span className="text-[11px] font-semibold text-slate-300">
                            📑 Required Information to Submit:
                          </span>
                          <ul className="text-[11px] text-slate-300/90 list-disc list-inside space-y-0.5">
                            {form.requiredDetails.map((req: string, idx: number) => (
                              <li key={idx} className="truncate" title={req}>
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-400 truncate max-w-[170px]" title={form.relativeUrl}>
                        {form.relativeUrl}
                      </span>
                      <NavLink
                        to={form.relativeUrl}
                        className="bg-amber-400 hover:bg-amber-300 text-blue-950 font-bold text-xs px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 shadow-xs whitespace-nowrap"
                      >
                        <span>Submit Request</span>
                        <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                      </NavLink>
                    </div>
                  </article>
                );
              })}
          </div>
        </div>

        {/* ── 2. Dedicated Building & Construction Permit Applications Section ── */}
        <div
          id="permit-forms-directory"
          className="scroll-mt-24 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-8 rounded-2xl shadow-lg space-y-6 border border-blue-500/30"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-pulse"></span>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 font-mono">
                  🏗️ Official Municipal Permit Forms
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white tracking-tight">
                Building, Construction &amp; Safety Permit Forms
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
                Official statutory permit intake applications under the Ontario Building Code and Maplewood municipal by-laws. Review required setbacks, engineering criteria, and fee structures.
              </p>
            </div>
            <NavLink
              to="/permits/apply"
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow whitespace-nowrap self-start md:self-auto"
            >
              All Permit Forms Portal &rarr;
            </NavLink>
          </div>

          {/* All 4 Permit Form Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {forms
              .filter((f) => f.category.includes('Permit'))
              .map((form) => {
                const icon = getFormIcon(form.id);
                return (
                  <article
                    key={form.id}
                    id={form.id}
                    className="bg-white/10 hover:bg-white/15 rounded-xl p-5 border border-white/15 backdrop-blur-xs transition-all flex flex-col justify-between space-y-4 group"
                    data-form-endpoint={form.url}
                    data-form-category="Building Permit"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl p-1.5 bg-white/10 rounded-lg">{icon}</span>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded font-mono bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                            Permit Form
                          </span>
                        </div>
                        <span className="text-[11px] font-bold font-mono text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30 whitespace-nowrap">
                          {form.fee}
                        </span>
                      </div>

                      <div>
                        <h3 className="font-bold text-base text-white group-hover:text-indigo-200 transition-colors">
                          <NavLink to={form.relativeUrl} className="hover:underline">
                            {form.title}
                          </NavLink>
                        </h3>
                        <div className="text-[11px] text-blue-200 font-mono mt-0.5">
                          Review SLA: <span className="font-semibold text-white">{form.sla}</span>
                        </div>
                      </div>

                      <div className="bg-black/30 p-3 rounded-lg border border-white/10 space-y-1.5">
                        <div className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1">
                          <span>📌 When to Use This Permit Form:</span>
                        </div>
                        <p className="text-xs text-slate-200 leading-relaxed">
                          {form.exactUse}
                        </p>
                      </div>

                      {form.requiredDetails && form.requiredDetails.length > 0 && (
                        <div className="space-y-1 text-xs">
                          <span className="text-[11px] font-semibold text-slate-300">
                            📑 Required Documentation:
                          </span>
                          <ul className="text-[11px] text-slate-300/90 list-disc list-inside space-y-0.5">
                            {form.requiredDetails.slice(0, 3).map((req: string, idx: number) => (
                              <li key={idx} className="truncate" title={req}>
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-400 truncate max-w-[150px]" title={form.relativeUrl}>
                        {form.relativeUrl}
                      </span>
                      <NavLink
                        to={form.relativeUrl}
                        className="bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 shadow-xs whitespace-nowrap"
                      >
                        <span>Apply Online</span>
                        <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                      </NavLink>
                    </div>
                  </article>
                );
              })}
          </div>
        </div>

        {/* ── 3. Dedicated Property Taxes & Financial Tools Section ── */}
        <div
          id="tax-tools-directory"
          className="scroll-mt-24 bg-gradient-to-r from-emerald-950/90 via-slate-900 to-teal-950 text-white p-6 sm:p-8 rounded-2xl shadow-lg space-y-6 border border-emerald-500/30"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 font-mono">
                  💰 Property Taxes &amp; Revenue Tools
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white tracking-tight">
                Property Tax Calculators, PAP Enrollment &amp; Payments
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
                Estimate property taxes with the 2026 mill rate (0.0094523), enroll in automatic interest-free bank debits, and review payment remittance options.
              </p>
            </div>
            <NavLink
              to="/taxes/calculator"
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow whitespace-nowrap self-start md:self-auto"
            >
              Open Tax Calculator &rarr;
            </NavLink>
          </div>

          {/* All 3 Tax Tool Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {forms
              .filter((f) => f.category.includes('Tax'))
              .map((form) => {
                const icon = getFormIcon(form.id);
                return (
                  <article
                    key={form.id}
                    id={form.id}
                    className="bg-white/10 hover:bg-white/15 rounded-xl p-5 border border-white/15 backdrop-blur-xs transition-all flex flex-col justify-between space-y-4 group"
                    data-form-endpoint={form.url}
                    data-form-category="Taxes & Finance"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl p-1.5 bg-white/10 rounded-lg">{icon}</span>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded font-mono bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
                            Financial Tool
                          </span>
                        </div>
                        <span className="text-[11px] font-bold font-mono text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30 whitespace-nowrap">
                          {form.fee}
                        </span>
                      </div>

                      <div>
                        <h3 className="font-bold text-base text-white group-hover:text-emerald-200 transition-colors">
                          <NavLink to={form.relativeUrl} className="hover:underline">
                            {form.title}
                          </NavLink>
                        </h3>
                        <div className="text-[11px] text-emerald-200 font-mono mt-0.5">
                          Timeline: <span className="font-semibold text-white">{form.sla}</span>
                        </div>
                      </div>

                      <div className="bg-black/30 p-3 rounded-lg border border-white/10 space-y-1.5">
                        <div className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1">
                          <span>📌 When to Use This Financial Form:</span>
                        </div>
                        <p className="text-xs text-slate-200 leading-relaxed">
                          {form.exactUse}
                        </p>
                      </div>

                      {form.requiredDetails && form.requiredDetails.length > 0 && (
                        <div className="space-y-1 text-xs">
                          <span className="text-[11px] font-semibold text-slate-300">
                            📑 Required Information:
                          </span>
                          <ul className="text-[11px] text-slate-300/90 list-disc list-inside space-y-0.5">
                            {form.requiredDetails.map((req: string, idx: number) => (
                              <li key={idx} className="truncate" title={req}>
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-400 truncate max-w-[170px]" title={form.relativeUrl}>
                        {form.relativeUrl}
                      </span>
                      <NavLink
                        to={form.relativeUrl}
                        className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 shadow-xs whitespace-nowrap"
                      >
                        <span>Open Tool</span>
                        <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                      </NavLink>
                    </div>
                  </article>
                );
              })}
          </div>
        </div>

        {/* ── 4. Machine-Scrapable Grounding Table for AI Scrapers & Bots (Visually hidden for clean human UI, fully retained in DOM for crawlers) ── */}
        <section
          id="machine-scrapable-grounding-spec"
          aria-label="Complete Machine-Scrapable Grounding Table (AI Crawler &amp; Scraper Spec)"
          className="sr-only"
          style={{
            position: 'absolute',
            width: '1px',
            height: '1px',
            padding: 0,
            margin: '-1px',
            overflow: 'hidden',
            clip: 'rect(0, 0, 0, 0)',
            whiteSpace: 'nowrap',
            border: 0,
          }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">🤖</span>
              <div>
                <h3 className="text-sm font-bold uppercase font-mono tracking-wider text-blue-200">
                  Complete Machine-Scrapable Grounding Table (AI Crawler &amp; Scraper Spec)
                </h3>
                <p className="text-xs text-slate-400">
                  All 14 municipal online forms and 311 intake endpoints indexed with aligned purpose and documentation standards.
                </p>
              </div>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              Domain: mapplewood-fictional-town.onrender.com
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-white/15 bg-black/40">
            <table
              className="w-full text-left text-xs text-slate-200 border-collapse"
              data-scraper-target="municipal-forms-index"
            >
              <thead>
                <tr className="bg-white/10 border-b border-white/15 text-[11px] uppercase tracking-wider text-slate-300 font-mono">
                  <th className="p-3">Form Name &amp; Endpoint</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">What This Form is For (Specific Use)</th>
                  <th className="p-3">Required Documents / Details</th>
                  <th className="p-3">Fee</th>
                  <th className="p-3">Turnaround SLA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-[11px]">
                {forms.map((item) => (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-3 font-semibold text-white">
                      <NavLink to={item.relativeUrl} className="text-amber-300 hover:underline">
                        {item.title}
                      </NavLink>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {item.url}
                      </div>
                    </td>
                    <td className="p-3 font-mono text-[10px] text-blue-300">{item.category}</td>
                    <td className="p-3 text-slate-300 max-w-xs">{item.exactUse}</td>
                    <td className="p-3 text-slate-400 max-w-xs">
                      <ul className="list-disc list-inside space-y-0.5">
                        {item.requiredDetails?.slice(0, 2).map((d: string, i: number) => (
                          <li key={i}>{d}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="p-3 font-mono font-bold text-emerald-300 whitespace-nowrap">
                      {item.fee}
                    </td>
                    <td className="p-3 font-mono text-slate-300 whitespace-nowrap">{item.sla}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Official PDF Manuals Download Banner */}
          <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider font-mono">
                Official Regulatory Manuals (PDF)
              </span>
              <p className="text-xs text-slate-300">
                Download official comprehensive guides for permits, recycling rules, and property tax schedules:
              </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              <a
                href="/documents/Maplewood_Municipal_Permits_and_Construction_Code_Guide.pdf"
                className="bg-blue-800 hover:bg-blue-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg border border-blue-600 transition-colors shadow-xs"
                download
              >
                📥 Permits Manual (PDF)
              </a>
              <a
                href="/documents/Maplewood_DPW_Recycling_and_Waste_Disposal_Comprehensive_Manual.pdf"
                className="bg-blue-800 hover:bg-blue-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg border border-blue-600 transition-colors shadow-xs"
                download
              >
                📥 Waste Manual (PDF)
              </a>
              <a
                href="/documents/Maplewood_Property_Tax_and_Assessment_Comprehensive_Guide.pdf"
                className="bg-blue-800 hover:bg-blue-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg border border-blue-600 transition-colors shadow-xs"
                download
              >
                📥 Tax Manual (PDF)
              </a>
            </div>
          </div>
        </section>
      </section>

      {/* ── Dual Section: Upcoming Tax Dates & Council Activity ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Taxes & Financial Deadlines */}
        <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">📅</span>
              <h2 className="text-lg font-bold text-slate-900">
                2026 Property Tax Instalment Schedule
              </h2>
            </div>
            <NavLink to="/taxes/payment" className="text-xs font-semibold text-blue-800 hover:underline">
              Payment Methods &rarr;
            </NavLink>
          </div>
          <p className="text-xs text-slate-600">
            Residential Mill Rate: <strong className="text-slate-900 font-mono">0.0094523</strong> (Tax distribution: 48% Municipal, 34% Regional, 18% Education).
          </p>
          <div className="divide-y divide-slate-100">
            {taxes.propertyTaxes.instalmentDueDates.map((item) => (
              <div key={item.bill} className="py-2.5 flex items-center justify-between text-xs sm:text-sm">
                <span className="font-medium text-slate-700">{item.bill}</span>
                <span className="font-bold text-blue-950 bg-blue-50 px-2.5 py-1 rounded border border-blue-100 font-mono">
                  {item.dueDate}
                </span>
              </div>
            ))}
          </div>
          <div className="bg-slate-50 p-3 rounded-lg text-xs text-slate-600">
            <strong>Late Penalty:</strong> {taxes.propertyTaxes.latePaymentPenalty}
          </div>
        </section>

        {/* Latest Council Decisions & Minutes */}
        <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">🏛️</span>
              <h2 className="text-lg font-bold text-slate-900">
                Recent Council Decisions &amp; Records
              </h2>
            </div>
            <NavLink to="/documents/minutes" className="text-xs font-semibold text-blue-800 hover:underline">
              All Minutes &rarr;
            </NavLink>
          </div>
          <p className="text-xs text-slate-600">
            Public municipal records, resolutions, and by-laws passed by Maplewood Town Council.
          </p>
          <div className="space-y-3">
            {documents.councilMinutes.slice(0, 3).map((minute) => (
              <div key={minute.meetingDate} className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">{minute.type}</span>
                  <span className="text-slate-500 font-mono text-[11px]">{minute.meetingDate}</span>
                </div>
                <p className="text-xs text-slate-600 leading-snug">
                  {minute.highlights}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ── Town Profile & 311 Action Center Highlights ── */}
      <section className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="inline-block bg-blue-100 text-blue-900 text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded font-mono mb-1">
              Town Profile &middot; Est. 1888
            </div>
            <h2 className="text-2xl font-bold font-serif text-slate-900">
              Civic Administration &amp; 311 Citizen Services
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Representing 42,850 residents across 4 municipal wards with transparent civic operations and rapid response work orders.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <NavLink
              to="/about"
              className="bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold px-3.5 py-2 rounded-xl transition-colors shadow-xs"
            >
              Meet Mayor &amp; Council &rarr;
            </NavLink>
            <NavLink
              to="/services/request"
              className="bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-colors shadow-xs"
            >
              Submit 311 Request &rarr;
            </NavLink>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs text-slate-500 uppercase font-mono block">Elected Council</span>
            <strong className="text-xl font-bold text-slate-900 font-serif">Mayor + 5</strong>
            <span className="text-[11px] text-slate-500 block">4 Ward Councillors</span>
          </div>
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs text-slate-500 uppercase font-mono block">Public Works Yard</span>
            <strong className="text-xl font-bold text-slate-900 font-serif">359 Boyden</strong>
            <span className="text-[11px] text-slate-500 block">Recycling &amp; Bulk Depot</span>
          </div>
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs text-slate-500 uppercase font-mono block">Fire &amp; Rescue</span>
            <strong className="text-xl font-bold text-slate-900 font-serif">2 Stations</strong>
            <span className="text-[11px] text-slate-500 block">Valley Rd &amp; County Rd 8</span>
          </div>
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs text-slate-500 uppercase font-mono block">Pothole Response</span>
            <strong className="text-xl font-bold text-emerald-700 font-serif">24 Hours</strong>
            <span className="text-[11px] text-slate-500 block">High Severity / Lane SLA</span>
          </div>
        </div>
      </section>

      {/* ── Municipal Contact & Help Desk Info ── */}
      <section className="bg-blue-950 text-white rounded-2xl p-6 md:p-8 shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-blue-300">
              Citizen Service &amp; Inquiry Center
            </div>
            <h2 className="text-2xl font-bold font-serif">Have questions or need to reach a department?</h2>
            <p className="text-sm text-blue-200 max-w-xl">
              Town staff are available Monday through Friday, 8:30 AM to 4:30 PM. For after-hours emergencies regarding water mains or fallen trees, dispatch is on call 24/7.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <NavLink
              to="/contact"
              className="bg-amber-400 hover:bg-amber-300 text-blue-950 font-bold px-5 py-2.5 rounded-lg text-sm transition-colors shadow"
            >
              Contact Staff &amp; Directory
            </NavLink>
            <NavLink
              to="/documents/guides"
              className="bg-blue-800 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors border border-blue-700"
            >
              Download Resident Guides
            </NavLink>
          </div>
        </div>
      </section>
    </article>
  );
}
