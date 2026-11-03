import townData from '../../data/townData.json';
import SEOHead from '../../components/SEOHead';

export default function Guides() {
  const { guides } = townData.documents;

  return (
    <article className="space-y-8 max-w-4xl mx-auto bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-sm">
      <SEOHead
        title="Official Municipal Publications & Resident Handbooks"
        description="Download official Town of Maplewood PDF manuals: Comprehensive DPW Recycling & Waste Disposal Manual, Curbside Calendar, Deck Construction Manual, and Welcome Kit."
        category="Public Information"
      />

      <header className="border-b border-slate-200 pb-6 space-y-3">
        <div className="inline-block bg-purple-100 text-purple-800 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded">
          Public Information &amp; Publications
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-serif text-slate-900">
          Resident Guides &amp; Handbooks
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          Official printable manuals, illustrated construction guides, waste calendars, and new resident resources published by the Corporation of the Town of Maplewood.
        </p>

        {/* Featured Publication Banners: DPW & Permits */}
        <div className="grid grid-cols-1 gap-4 pt-2">
          {/* Permits Guide */}
          <div className="p-5 bg-gradient-to-r from-slate-900 to-blue-950 text-white rounded-xl shadow-md border border-slate-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="bg-amber-400 text-blue-950 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded tracking-wider">
                  New Official Manual
                </span>
                <span className="text-xs text-amber-200 font-mono">Document MW-PERMITS-311-GUIDE-2026-REV3</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold font-serif text-white">
                Comprehensive Municipal Permit, Required Documents &amp; 311 Service Request Manual
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Official municipal operational standard covering NJ UCC building permits, mandatory required documents by permit classification, and the citizen 311 municipal service request intake standards (pothole triage, data requirements, SLAs &amp; case tracking).
              </p>
            </div>
            <a
              href="/documents/Maplewood_Municipal_Permits_and_Construction_Code_Guide.pdf"
              download="Maplewood_Municipal_Permits_and_Construction_Code_Guide.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-blue-950 font-bold text-xs px-4 py-2.5 rounded-lg shadow transition-colors whitespace-nowrap self-start md:self-auto"
            >
              <span>📥</span> Download Permits Guide (PDF)
            </a>
          </div>

          {/* DPW Comprehensive Manual */}
          <div className="p-5 bg-gradient-to-r from-blue-950 to-indigo-900 text-white rounded-xl shadow-md border border-blue-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="bg-emerald-400 text-blue-950 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded tracking-wider">
                  DPW Operations Manual
                </span>
                <span className="text-xs text-blue-200 font-mono">Document MW-DPW-RECYCLE-2026-REV5</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold font-serif text-white">
                Comprehensive Municipal Manual on Recycling, Solid Waste Disposal &amp; Resource Recovery
              </h2>
              <p className="text-xs text-blue-100 leading-relaxed">
                Authoritative 8-chapter municipal manual covering dual-stream sorting, 359 Boyden Ave recycling yard rules, bulk drop-off criteria, public sanitation enforcement (§ 209-14 illegal dumping), broken park bin reporting SLAs, neighborhood refuse accumulation complaints, and odor sanitization sweeps.
              </p>
            </div>
            <a
              href="/documents/Maplewood_DPW_Recycling_and_Waste_Disposal_Comprehensive_Manual.pdf"
              download="Maplewood_DPW_Recycling_and_Waste_Disposal_Comprehensive_Manual.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-400 hover:bg-emerald-300 text-blue-950 font-bold text-xs px-4 py-2.5 rounded-lg shadow transition-colors whitespace-nowrap self-start md:self-auto"
            >
              <span>📥</span> Download DPW Manual (PDF)
            </a>
          </div>
        </div>
      </header>

      {/* ── Guides List ── */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 font-serif">
          Official Publications
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {guides.map((guide) => (
            <div
              key={guide.title}
              className="p-5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded">
                    {guide.format} Document
                  </span>
                  <span className="text-slate-500 font-mono">{guide.size}</span>
                </div>
                <h3 className="font-bold text-slate-900 text-base">{guide.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {guide.description}
                </p>
              </div>

              <a
                href={'fileUrl' in guide && typeof guide.fileUrl === 'string' ? guide.fileUrl : '/documents/Maplewood_DPW_Recycling_and_Waste_Disposal_Comprehensive_Manual.pdf'}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs font-semibold text-blue-900 hover:text-blue-700"
              >
                <span>View / Download Document</span>
                <span>📥</span>
              </a>
            </div>
          ))}
        </div>
      </section>

      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-600">
        Alternative accessible formats (braille, large-print, and audio) are available upon request to the Communications &amp; Accessibility Coordinator at accessibility@maplewood.fictionaltown.com.
      </div>
    </article>
  );
}
