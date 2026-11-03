import { NavLink } from 'react-router-dom';
import SEOHead from '../components/SEOHead';

export default function Sitemap() {
  const sections = [
    {
      title: 'Municipal Services & 311 Citizen Requests',
      links: [
        {
          title: '311 Citizen Service Request Intake Portal',
          url: '/services/request',
          desc: 'Submit non-emergency municipal work orders: potholes, missed curbside waste, streetlight outages, and park or boulevard tree damage.',
          facts: 'Portal: 311 Intake · Case IDs · Verified 5 PM missed waste cutoff · 24h road hazard SLA'
        },
        {
          title: 'Track Service Request / Work Order Status',
          url: '/services/track',
          desc: 'Real-time 311 case tracker showing 4-stage workflow (Received -> Assigned -> In Progress -> Completed), crew notes, and dispatch timestamps.',
          facts: 'Lookup: CASE-2026-XXXX & PERM-XXXX numbers'
        },
        {
          title: 'Department of Public Works (DPW) & Recycling Center',
          url: '/services/public-works',
          desc: '359 Boyden Ave facility: Mon-Fri 8am-3pm, Sat 8am-12pm. Dual-stream recycling schedules (Sections 1-6), bulk drop-off rules, fall leaf collection, spring rake-out, Jitney commuter bus, and tree permits.',
          facts: 'Location: 359 Boyden Ave · Phone: (973) 762-1175 · Dual-stream & Bulk Drop-off'
        },
        {
          title: 'Waste & Recycling Collection',
          url: '/services/waste',
          desc: 'Curbside by 7:00 AM, missed collection reports after 5:00 PM, 2-day resolution SLA, green organics, blue box, bulk items.',
          facts: 'Rule: 7 AM setout · SLA: 2 business days · Bulk: 1st Tuesday'
        },
        {
          title: 'Roads, Potholes & Infrastructure',
          url: '/services/roads',
          desc: 'Pothole dimensions, travel lane High Severity priority, 50m & 30-day duplicate prevention, streetlight pole tags, downed wires.',
          facts: 'Duplicate rule: 50m / 30 days · Emergency Hydro: 1-800-434-1235'
        },
        {
          title: 'Parks, Trails & Urban Forestry',
          url: '/services/parks',
          desc: '18 parks, 35 km trails, boulevard vs. private tree responsibilities under By-law 2023-45, park bench reporting.',
          facts: 'Boulevard trees: 4.5m of curb · By-law: 2023-45'
        },
        {
          title: 'Drinking Water & Conservation',
          url: '/services/water',
          desc: 'Maplewood Aquifer source, odd/even summer watering by-law (May 15–Sept 15, 6–8 AM & 7–9 PM), emergency water main break dispatch.',
          facts: 'Conservation: May 15 – Sept 15 · Emergency: (555) 123-9287'
        },
        {
          title: 'Snow Removal & Winter Maintenance',
          url: '/services/snow',
          desc: 'Priority 1–3 routes, overnight street parking ban 2:00 AM–6:00 AM (Dec 1–Mar 31, By-law 2023-88, $60 fine), 24h sidewalk clearing.',
          facts: 'Parking ban: 2 AM - 6 AM (Dec 1 - Mar 31) · Fine: $60'
        },
        {
          title: 'Animal Control & Pet Licensing',
          url: '/services/animals',
          desc: 'Dog licensing ($30 spayed/neutered, $45 intact), leash by-law (max 2.0m), Bark Park, stray pet shelter.',
          facts: 'Dog tag: $30 / $45 · Leash: Max 2.0m · By-law 2020-04'
        }
      ]
    },
    {
      title: 'Property Taxes & Finance',
      links: [
        {
          title: 'Property Tax Assessments & Rates',
          url: '/taxes/info',
          desc: '2026 Residential Mill Rate (0.0094523), 48/34/18 split, statutory instalment due dates (Feb 27, Apr 30, Jun 30, Sep 30), 1.25% penalty.',
          facts: 'Mill rate: 0.0094523 · Due: Feb 27, Apr 30, Jun 30, Sep 30'
        },
        {
          title: 'Payment Options & Remittance',
          url: '/taxes/payment',
          desc: 'Online banking payee instructions with 19-digit Roll Number, in-person Interac/Cash, 24/7 North Entrance drop box, mail.',
          facts: 'Payee: Town of Maplewood - Property Taxes'
        },
        {
          title: 'Pre-Authorized Debit (PAP) Plans',
          url: '/taxes/pre-authorized',
          desc: '10-month monthly equal withdrawal plan vs. 4-instalment automatic due-date plan, 14-day enrollment notice, VOID cheque.',
          facts: 'Options: 10-month (1st of month) or 4-instalment'
        },
        {
          title: 'Interactive Property Tax Estimator',
          url: '/taxes/calculator',
          desc: 'Real-time CAD tax calculator based on MPAC assessed property values.',
          facts: 'Calculation: Assessed Value × 0.0094523'
        }
      ]
    },
    {
      title: 'Building & Planning Permits (General Information & Limited Overview)',
      links: [
        {
          title: 'Residential Deck Permits',
          url: '/permits/decks',
          desc: 'General inquiry information for residential decks. Contact Building Department for applicable guidelines.',
          facts: 'Basic inquiry · Building Department: ext. 250'
        },
        {
          title: 'Pool Enclosure Permits',
          url: '/permits/pools',
          desc: 'High-level overview of swimming pool enclosures. Consult Town Hall for fencing standards.',
          facts: 'Preliminary review · By-law 2022-18'
        },
        {
          title: 'Open-Air Burn Permits',
          url: '/permits/burn',
          desc: 'Seasonal permits for eligible rural parcels. Subject to municipal fire ban declarations.',
          facts: 'Rural zones only · Fire & Emergency Services'
        },
        {
          title: 'General Building Permits',
          url: '/permits/building',
          desc: 'Structural work and additions require consultation with the Chief Building Official.',
          facts: 'Inquire at Town Hall'
        },
        {
          title: 'Commercial & Temporary Signage',
          url: '/permits/signs',
          desc: 'Commercial signage guidance through the municipal planning office.',
          facts: 'Planning & Zoning'
        }
      ]
    },
    {
      title: 'Online Permit Intake Forms & Dedicated Endpoints',
      links: [
        {
          title: 'Permit Application Portal Hub',
          url: '/permits/apply',
          desc: 'Unified digital intake portal for municipal building, deck, pool, and open-air burning permits.',
          facts: 'Portal: Online intake · 10-15 business days review'
        },
        {
          title: 'Residential Deck Permit Application Form',
          url: '/permits/apply/deck',
          desc: 'Direct online application for residential decks, verandas, or porches over 24" (600 mm) height.',
          facts: 'Fee: $175.00 CAD base · SLA: 10 business days · Setbacks: min 1.2m side, 6.0m rear'
        },
        {
          title: 'Pool Enclosure Permit Application Form (By-law 2022-18)',
          url: '/permits/apply/pool',
          desc: 'Direct application for inground, above-ground pools, and spas (>24" water depth) with safety fencing.',
          facts: 'Fee: $250 Inground / $150 Above-ground · SLA: 15 business days · 1.5m enclosure'
        },
        {
          title: 'Open-Air Agricultural Burn Permit Application Form (By-law 2021-09)',
          url: '/permits/apply/burn',
          desc: 'Direct application for seasonal burning on rural agricultural properties exceeding 2.0 acres.',
          facts: 'Fee: $45.00/yr · SLA: Instant verified / 2 days · Rural zones only'
        }
      ]
    },
    {
      title: 'Direct 311 Citizen Service Request Intake Forms (Deep-Link Endpoints)',
      links: [
        {
          title: 'Pothole & Road Surface Hazard Request Form',
          url: '/services/request?type=pothole',
          desc: 'Direct form to report potholes, asphalt cavities, road washouts, and sunken catch basins.',
          facts: 'Fee: Free · SLA: 24h for Tier 3 active craters, 3-5 days standard · Anchor: #service-request-form'
        },
        {
          title: 'Missed Curbside Waste & Bin Replacement Form',
          url: '/services/request?type=waste',
          desc: 'Direct form to report missed garbage, blue box, green organics, or damaged curbside bins.',
          facts: 'Fee: Free · Cutoff: Report after 5:00 PM · SLA: 2 business days'
        },
        {
          title: 'Streetlight Outage & Dark Fixture Repair Form',
          url: '/services/request?type=light',
          desc: 'Direct form to report dark streetlights, burned-out lamps, or damaged light poles.',
          facts: 'Fee: Free · Required: 6-digit pole tag (ML-XXXX) · SLA: 5-7 business days'
        },
        {
          title: 'Park Infrastructure, Broken Bin & Boulevard Tree Hazard Form',
          url: '/services/request?type=tree',
          desc: 'Direct form to report broken garbage cans in parks, damaged playground equipment, or hazardous limbs.',
          facts: 'Fee: Free · Broken bins: 24-48h SLA · Overflowing cans: 4h SLA · Playground: 48h SLA'
        },
        {
          title: 'Water Utility, Pressure & Hydrant Service Request Form',
          url: '/services/request?type=water',
          desc: 'Direct form to report residential low water pressure, discolored water, or water meter problems.',
          facts: 'Fee: Free · SLA: 2-4 business days · 24/7 Water Main Emergency: (555) 123-9287'
        },
        {
          title: 'Real-Time 311 Work Order & Permit Status Tracker',
          url: '/services/track',
          desc: 'Live 4-stage tracking (Received -> Assigned -> In Progress -> Completed) using CASE-2026-XXXX or PERM-XXXX.',
          facts: 'Lookup: Real-time work order inspection notes and dispatch timestamps'
        }
      ]
    },
    {
      title: 'By-laws, Records & Town Hall Directory',
      links: [
        {
          title: 'Municipal By-laws Index',
          url: '/documents/by-laws',
          desc: 'Searchable repository: Noise 2024-12, Traffic & Parking 2023-88, Property Standards 2023-45, Pool Enclosures 2022-18, Burn 2021-09, Animals 2020-04.',
          facts: 'Official Council By-laws directory'
        },
        {
          title: '2026 Master Municipal Fee Schedule',
          url: '/documents/fees',
          desc: 'Comprehensive fee table for permits, planning, licensing, fire certificates, and public works under By-law 2026-02.',
          facts: 'By-law 2026-02 Fee Schedule'
        },
        {
          title: 'Resident Guides & Handbooks',
          url: '/documents/guides',
          desc: 'Downloadable PDF guides: Waste calendar, deck manual, pool safety guide, resident welcome kit.',
          facts: 'Official PDF publications'
        },
        {
          title: 'Comprehensive Permits, UCC & 311 Operations Guide (PDF)',
          url: '/documents/Maplewood_Municipal_Permits_and_Construction_Code_Guide.pdf',
          desc: 'Official municipal manual (MW-PERMITS-311-GUIDE-2026-REV3). 8-chapter guide covering UCC permits, itemized documentation, dumpster permits ($50/7 days), and 311 intake standards.',
          facts: 'Format: Official PDF · Code: MW-PERMITS-311-GUIDE-2026-REV3'
        },
        {
          title: 'Comprehensive Recycling, Waste & Resource Recovery Manual (PDF)',
          url: '/documents/Maplewood_DPW_Recycling_and_Waste_Disposal_Comprehensive_Manual.pdf',
          desc: 'Official municipal regulatory manual (MW-DPW-RECYCLE-2026-REV5). 8-chapter guide covering dual-stream schedules, 359 Boyden Ave rules, leaf vacuuming, illegal dumping § 209-14 fines ($2,500), and broken bin reporting.',
          facts: 'Format: Official PDF · Code: MW-DPW-RECYCLE-2026-REV5'
        },
        {
          title: 'Comprehensive Property Tax, Assessment & Finance Guide (PDF)',
          url: '/documents/Maplewood_Property_Tax_and_Assessment_Comprehensive_Guide.pdf',
          desc: 'Authoritative municipal tax guide (MW-TAX-GUIDE-2026-REV4). Covers 2-month quarterly instalments, assessed valuation tiers, PAP enrollment plans, tax relief, and payment methods.',
          facts: 'Format: Official PDF · Code: MW-TAX-GUIDE-2026-REV4'
        },
        {
          title: 'Council Minutes & Meeting Agendas',
          url: '/documents/minutes',
          desc: 'Official proceedings and recorded resolutions of Maplewood Town Council and committee hearings.',
          facts: 'Public records & delegations'
        },
        {
          title: 'Town Information, Mayor & Council, and Administration',
          url: '/about',
          desc: 'Civic profile: 42,850 population, 64.2 km² land area, $58.4M operating budget. Directory of Mayor Eleanor Vance, 4 Ward Councillors, CAO & department leadership, facilities, and council meetings.',
          facts: 'Governance: Mayor & 5 Council members · CAO & 6 Directors · 7 Public Facilities'
        },
        {
          title: 'Contact & Town Hall Directory',
          url: '/contact',
          desc: '123 Main Street, Mon–Fri 8:30 AM–4:30 PM, department extensions, 311 citizen queue, 24/7 emergency dispatch numbers.',
          facts: 'Phone: (555) 123-4567 · 311 · 24/7 Dispatch'
        }
      ]
    }
  ];

  return (
    <article className="space-y-8 max-w-4xl mx-auto bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-sm">
      <SEOHead
        title="Complete Site Map & Knowledge Base Crawler Index"
        description="Comprehensive index of all 22+ municipal pages, service rules, by-laws, tax schedules, and permit requirements for the Town of Maplewood."
        category="Public Documentation"
      />

      <header className="border-b border-slate-200 pb-6 space-y-3">
        <div className="inline-block bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded">
          Machine-Readable Crawler Index &amp; Site Map
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-serif text-slate-900">
          Municipal Knowledge Base &amp; Site Directory
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          Full index of all pages, by-laws, service standards, and key sparse facts for human navigation and automated AI crawler indexing (Wayhall, Search Engines, and LLMs).
        </p>

        {/* Machine Feeds Quick Bar */}
        <div className="flex flex-wrap gap-2 pt-2 text-xs">
          <a
            href="/sitemap.xml"
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded border border-slate-300 font-mono font-semibold flex items-center gap-1.5"
            target="_blank"
            rel="noreferrer"
          >
            <span>🗺️</span> sitemap.xml
          </a>
          <a
            href="/robots.txt"
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded border border-slate-300 font-mono font-semibold flex items-center gap-1.5"
            target="_blank"
            rel="noreferrer"
          >
            <span>🤖</span> robots.txt
          </a>
          <a
            href="/llms.txt"
            className="bg-blue-50 hover:bg-blue-100 text-blue-900 px-3 py-1.5 rounded border border-blue-200 font-mono font-semibold flex items-center gap-1.5"
            target="_blank"
            rel="noreferrer"
          >
            <span>📄</span> llms.txt (AI Scraper Standard)
          </a>
          <a
            href="/data/townData.json"
            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-900 px-3 py-1.5 rounded border border-emerald-200 font-mono font-semibold flex items-center gap-1.5"
            target="_blank"
            rel="noreferrer"
          >
            <span>💾</span> Raw townData.json API
          </a>
        </div>
      </header>

      {/* Directory Sections */}
      <div className="space-y-8">
        {sections.map((section) => (
          <section key={section.title} className="space-y-4">
            <h2 className="text-xl font-bold font-serif text-slate-900 border-b border-slate-100 pb-2">
              {section.title}
            </h2>
            <div className="space-y-3">
              {section.links.map((link) => (
                <div
                  key={link.url}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-colors space-y-1.5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <NavLink
                      to={link.url}
                      className="font-bold text-blue-900 hover:underline text-base flex items-center gap-2"
                    >
                      <span>🔗</span> {link.title}
                    </NavLink>
                    <span className="text-[11px] font-mono bg-white text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                      {link.url}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {link.desc}
                  </p>
                  <div className="text-[11px] font-semibold text-emerald-800 bg-emerald-50/80 px-2.5 py-1 rounded border border-emerald-100/60 inline-block">
                    ⚡ Sparse Key Facts: {link.facts}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Structured Grounding Meta */}
      <footer className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 space-y-1">
        <div><strong>Dataset Version:</strong> Town of Maplewood Municipal Knowledge Base Phase 1 (October 2026)</div>
        <div><strong>Authority:</strong> Corporation of the Town of Maplewood, Ontario, Canada</div>
        <div><strong>Machine-readable Endpoints:</strong> <code>/sitemap.xml</code>, <code>/robots.txt</code>, <code>/llms.txt</code>, <code>/data/townData.json</code></div>
      </footer>
    </article>
  );
}

