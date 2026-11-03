import townData from '../../data/townData.json';
import SEOHead from '../../components/SEOHead';
import { NavLink } from 'react-router-dom';

export default function PublicWorks() {
  const { publicWorks } = townData.services;
  const { facility, dualStreamRecycling, bulkDropOffProgram, seasonalLeafCollection, springRakeOutProgram, streetSweeping, urbanForestryAndTreePermits, jitneyCommuterService, specialDisposalServices } = publicWorks;

  return (
    <article
      className="space-y-10 max-w-5xl mx-auto bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-sm"
      itemScope
      itemType="https://schema.org/GovernmentOffice"
      data-kb-topic="department-of-public-works"
    >
      <SEOHead
        title="Department of Public Works (DPW) & Recycling Center"
        description="Official Maplewood DPW facility at 359 Boyden Ave: Dual-stream recycling schedules, bulk drop-off rules, leaf collection, spring rake-out, Jitney commuter bus, and tree permits."
        category="Public Works"
      />

      {/* ── Header ── */}
      <header className="border-b border-slate-200 pb-6 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="inline-block bg-blue-100 text-blue-900 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded">
            Municipal Infrastructure &amp; Environmental Services
          </div>
          <time dateTime="2026-10-31" className="text-xs text-slate-500 font-mono">
            Updated: October 31, 2026
          </time>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-serif text-slate-900" itemProp="name">
          {publicWorks.title}
        </h1>
        <p className="text-base text-slate-600 leading-relaxed" itemProp="description">
          The Maplewood Department of Public Works (DPW) oversees township infrastructure, curbside recycling collections, municipal roadway repairs, urban forestry, seasonal cleanups, and the local commuter Jitney transit system.
        </p>

        {/* ── Official Comprehensive PDF Manual Download Banner ── */}
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 block">
                Official Municipal Manual (PDF)
              </span>
              <span className="text-[10px] bg-emerald-200 text-emerald-950 font-mono px-1.5 py-0.5 rounded">
                MW-DPW-RECYCLE-2026-REV4
              </span>
            </div>
            <p className="text-xs text-emerald-800">
              Download the complete 6-chapter comprehensive manual covering dual-stream sorting, Boyden Ave yard rules, bulk drop-off, leaf vacuuming, and forestry permits.
            </p>
          </div>
          <a
            href="/documents/Maplewood_DPW_Recycling_and_Waste_Disposal_Comprehensive_Manual.pdf"
            download="Maplewood_DPW_Recycling_and_Waste_Disposal_Comprehensive_Manual.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-emerald-900 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2.5 rounded-lg shadow-sm transition-colors whitespace-nowrap self-start sm:self-auto"
          >
            <span>📥</span> Download PDF Manual (2.0 MB)
          </a>
        </div>
      </header>

      {/* ── Facility Location & Hours Card ── */}
      <section
        id="facility"
        className="bg-blue-950 text-white rounded-xl p-6 shadow-md space-y-4"
        data-facility="dpw-depot"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-blue-900 pb-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-blue-300 font-bold">DPW Headquarters &amp; Drop-off Yard</div>
            <h2 className="text-2xl font-bold font-serif">{facility.name}</h2>
            <p className="text-sm text-blue-100 mt-1" itemProp="address">📍 {facility.address}</p>
          </div>
          <div className="text-left md:text-right">
            <div className="text-xs text-blue-300">Department Phone</div>
            <div className="text-xl font-mono font-bold text-amber-300" itemProp="telephone">{facility.phone}</div>
            <div className="text-xs text-blue-200">24/7 Dispatch: {facility.dispatchPhone}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm">
          <div className="bg-blue-900/60 p-3 rounded-lg border border-blue-800">
            <span className="text-blue-300 block font-semibold">Weekday Hours:</span>
            <span className="font-bold text-white">{facility.hours.weekdays}</span>
          </div>
          <div className="bg-blue-900/60 p-3 rounded-lg border border-blue-800">
            <span className="text-blue-300 block font-semibold">Saturday Hours:</span>
            <span className="font-bold text-white">{facility.hours.saturdays}</span>
          </div>
          <div className="bg-blue-900/60 p-3 rounded-lg border border-blue-800">
            <span className="text-blue-300 block font-semibold">Sunday &amp; Holidays:</span>
            <span className="font-bold text-rose-300">{facility.hours.sundays}</span>
          </div>
        </div>
      </section>

      {/* ── Dual-Stream Recycling Section ── */}
      <section id="dual-stream" className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <h2 className="text-2xl font-bold font-serif text-slate-900">
            Dual-Stream Recycling Program &amp; Section Schedules
          </h2>
          <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded">
            Township-Managed
          </span>
        </div>
        <p className="text-sm text-slate-700 leading-relaxed">
          {dualStreamRecycling.system}. Recycling must be placed curbside by <strong>7:00 AM</strong> on your designated collection morning. Plastic bags of any kind are strictly prohibited.
        </p>

        {/* Schedule Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-slate-700 text-left font-semibold">
              <tr>
                <th className="py-3 px-4">Township Sections</th>
                <th className="py-3 px-4">Collection Day</th>
                <th className="py-3 px-4">Rotation Cycle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {dualStreamRecycling.zoneSchedule.map((zone) => (
                <tr key={zone.sections} className="hover:bg-slate-50/80">
                  <td className="py-3 px-4 font-bold text-slate-900">{zone.sections}</td>
                  <td className="py-3 px-4 font-semibold text-blue-900">{zone.day}</td>
                  <td className="py-3 px-4 text-xs text-slate-600">{zone.frequency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200 space-y-1.5" data-stream="fibers">
            <h3 className="font-bold text-amber-950 text-sm flex items-center gap-1.5">
              <span>📦</span> Fibers Stream (Paper &amp; Cardboard)
            </h3>
            <p className="text-xs text-amber-900 leading-relaxed">
              {dualStreamRecycling.fibersStream}
            </p>
          </div>
          <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200 space-y-1.5" data-stream="commingled">
            <h3 className="font-bold text-blue-950 text-sm flex items-center gap-1.5">
              <span>🍾</span> Commingled Containers Stream
            </h3>
            <p className="text-xs text-blue-900 leading-relaxed">
              {dualStreamRecycling.commingledStream}
            </p>
          </div>
        </div>

        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600">
          <strong>Container Requirement:</strong> {dualStreamRecycling.containerRequirements}
        </div>
      </section>

      {/* ── Bulk Drop-Off Program ── */}
      <section id="bulk-dropoff" className="space-y-4" data-kb-section="bulk-drop-off">
        <h2 className="text-2xl font-bold font-serif text-slate-900">
          Biannual Bulk Drop-Off Program (359 Boyden Ave)
        </h2>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm text-slate-700 space-y-2">
          <p><strong>Program Schedule:</strong> {bulkDropOffProgram.overview}</p>
          <p><strong>Proof of Residency:</strong> {bulkDropOffProgram.eligibility}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-2">
            <h3 className="font-bold text-emerald-950 text-sm flex items-center gap-1.5">
              <span>✅</span> Accepted Bulk Household Items
            </h3>
            <ul className="text-xs text-emerald-900 space-y-1 list-disc list-inside">
              {bulkDropOffProgram.acceptedMaterials.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="p-4 bg-rose-50 rounded-xl border border-rose-200 space-y-2">
            <h3 className="font-bold text-rose-950 text-sm flex items-center gap-1.5">
              <span>🚫</span> Strictly Prohibited Materials
            </h3>
            <ul className="text-xs text-rose-900 space-y-1 list-disc list-inside">
              {bulkDropOffProgram.prohibitedMaterials.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Seasonal Leaf Collection & Spring Rake-Out ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* Autumn Leaf Collection */}
        <section id="leaf-collection" className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-3" data-kb-section="fall-leaf-collection">
          <h2 className="text-lg font-bold font-serif text-slate-900 flex items-center gap-2">
            <span>🍂</span> Fall Curbside Leaf Collection
          </h2>
          <p className="text-xs text-slate-600">{seasonalLeafCollection.schedule}</p>
          <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
            {seasonalLeafCollection.guidelines.map((g, idx) => (
              <li key={idx} className="leading-relaxed">{g}</li>
            ))}
          </ul>
          <div className="text-[11px] text-blue-900 font-semibold bg-blue-50 p-2 rounded">
            Alternative: {seasonalLeafCollection.dropOffAlternative}
          </div>
        </section>

        {/* Spring Rake-Out */}
        <section id="spring-rakeout" className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-3" data-kb-section="spring-rake-out">
          <h2 className="text-lg font-bold font-serif text-slate-900 flex items-center gap-2">
            <span>🌱</span> Spring Rake-Out &amp; Garden Cleanups
          </h2>
          <p className="text-xs text-slate-600">{springRakeOutProgram.schedule}</p>
          <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
            {springRakeOutProgram.rules.map((r, idx) => (
              <li key={idx} className="leading-relaxed">{r}</li>
            ))}
          </ul>
          <div className="text-[11px] text-amber-900 font-semibold bg-amber-50 p-2 rounded">
            Important: Bundles must not exceed 4 feet in length or 50 lbs in weight.
          </div>
        </section>
      </div>

      {/* ── Street Sweeping & Urban Forestry ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        <section id="street-sweeping" className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
          <h2 className="text-lg font-bold font-serif text-slate-900 flex items-center gap-2">
            <span>🧹</span> Street Sweeping Operations
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed">{streetSweeping.schedule}</p>
          <p className="text-xs text-slate-500">{streetSweeping.parkingRestrictions}</p>
        </section>

        <section id="tree-permits" className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
          <h2 className="text-lg font-bold font-serif text-slate-900 flex items-center gap-2">
            <span>🌳</span> Tree Removal Permits &amp; Forestry
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed">{urbanForestryAndTreePermits.treeRemovalPermit}</p>
          <p className="text-xs text-slate-500">{urbanForestryAndTreePermits.municipalTreeCare}</p>
          <div className="text-[11px] text-emerald-800 bg-emerald-50 p-2 rounded font-medium">
            {urbanForestryAndTreePermits.freeArborDaySaplings}
          </div>
        </section>
      </div>

      {/* ── Jitney Commuter Transit Service ── */}
      <section id="jitney-shuttle" className="space-y-4 pt-4 border-t border-slate-200" data-kb-section="jitney-bus">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold font-serif text-slate-900">
            Maplewood Jitney Commuter Shuttle Service
          </h2>
          <span className="text-xs font-mono font-bold bg-blue-100 text-blue-900 px-2.5 py-1 rounded">
            NJ Transit Train Connector
          </span>
        </div>
        <p className="text-sm text-slate-700 leading-relaxed">
          {jitneyCommuterService.overview}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {jitneyCommuterService.routes.map((rt) => (
            <div key={rt.name} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
              <span className="text-xs font-bold text-blue-950 block">{rt.name}</span>
              <span className="text-[11px] text-slate-600 block">{rt.corridor}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-700 gap-2">
          <div><strong>Fares &amp; Passes:</strong> {jitneyCommuterService.passCost}</div>
          <div className="text-emerald-800 font-semibold">⚡ {jitneyCommuterService.fleetSustainability}</div>
        </div>
      </section>

      {/* ── Special Drop-Off Programs (Mulch, E-Waste, Shred-It) ── */}
      <section id="free-mulch" className="space-y-4 pt-4 border-t border-slate-200">
        <h2 className="text-xl font-bold font-serif text-slate-900">
          Special Resident Recycling &amp; Drop-off Programs
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
            <h3 className="font-bold text-slate-900 text-sm">🪵 Free Mulch &amp; Compost</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {specialDisposalServices.freeMulchAndCompost}
            </p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
            <h3 className="font-bold text-slate-900 text-sm">💻 Electronics / E-Waste</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {specialDisposalServices.electronicsEwaste}
            </p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
            <h3 className="font-bold text-slate-900 text-sm">📄 Shred-It Paper Events</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {specialDisposalServices.shredItEvents}
            </p>
          </div>
        </div>
      </section>

      {/* Navigation Quick Links */}
      <footer className="pt-4 border-t border-slate-200 flex flex-wrap justify-between items-center text-xs text-blue-900 gap-3">
        <NavLink to="/services/waste" className="font-semibold hover:underline">
          &larr; View Curbside Waste &amp; Recycling Details
        </NavLink>
        <NavLink to="/services/roads" className="font-semibold hover:underline">
          Roads, Potholes &amp; Downed Wires &rarr;
        </NavLink>
      </footer>
    </article>
  );
}

