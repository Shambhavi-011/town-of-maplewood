import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import SEOHead from '../../components/SEOHead';

export default function Recreation() {
  const [formData, setFormData] = useState({
    parentName: '',
    parentEmail: '',
    parentPhone: '',
    homeAddress: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    childName: '',
    childAge: '8', // Defaults to 8 years old as requested
    childDob: '2018-05-14',
    campProgram: 'junior-explorers-8yo', // 8-year-old summer camp default
    selectedWeeks: ['week-1', 'week-2'],
    extendedCare: 'both', // 'none' | 'am' | 'pm' | 'both'
    hasAllergies: 'no',
    allergyDetails: '',
    swimmingSkill: 'intermediate',
    tshirtSize: 'Youth-M',
    notes: '',
    agreeToWaiver: false,
    agreeToCodeOfConduct: false,
  });

  const [submitted, setSubmitted] = useState(false);
  const [registrationRef, setRegistrationRef] = useState('');
  const [submittedAt, setSubmittedAt] = useState('');
  const [copiedEndpoint, setCopiedEndpoint] = useState(false);

  // Available Summer Camp Programs (Featuring specialized 8-Year-Old offerings)
  const campPrograms = [
    {
      id: 'junior-explorers-8yo',
      title: 'Junior Explorers Day Camp (Ages 7–9 · Prime for 8-Year-Olds)',
      badge: 'Recommended for 8-Year-Olds',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      description:
        'Designed specifically for growing 8-year-olds! Features daily instructional swim lessons at Memorial Pool, hands-on STEM & robotics challenges, nature trail excursions in Maplewood Forest, outdoor sports, and visual arts.',
      feeWeekly: 235,
      location: 'Maplewood Recreation Complex & Memorial Park',
      dailySchedule: '9:00 AM – 4:00 PM (Extended Care Available)',
      ratio: '1:8 Counselor to Camper Ratio',
    },
    {
      id: 'eco-adventure-camp',
      title: 'Eco-Adventure & Forest Survival Camp (Ages 8–12)',
      badge: 'Outdoor Ecology',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
      description:
        'River ecology along Maplewood Creek, orienteering, tree identification, shelter building, outdoor conservation projects, and beginner canoe safety.',
      feeWeekly: 255,
      location: 'Riverview Nature Center & Conservation Pavilion',
      dailySchedule: '9:00 AM – 4:00 PM',
      ratio: '1:8 Counselor to Camper Ratio',
    },
    {
      id: 'creative-arts-theater',
      title: 'Youth Creative Arts & Drama Camp (Ages 7–10)',
      badge: 'Visual & Performing Arts',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
      description:
        'Pottery, acrylic painting, musical theater, improvisation, and a weekly Friday afternoon resident showcase on the Town Hall auditorium stage.',
      feeWeekly: 240,
      location: 'Town Community Center Arts Wing (123 Main St)',
      dailySchedule: '9:00 AM – 4:00 PM',
      ratio: '1:7 Counselor to Camper Ratio',
    },
    {
      id: 'multi-sport-active',
      title: 'Maplewood Active Multi-Sport Camp (Ages 8–13)',
      badge: 'Athletics & Fitness',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
      description:
        'Daily rotations through soccer, basketball, pickleball, dodgeball, track-and-field fundamentals, and recreational afternoon pool cooling sessions.',
      feeWeekly: 225,
      location: 'Boyden Athletic Complex',
      dailySchedule: '9:00 AM – 4:00 PM',
      ratio: '1:10 Counselor to Camper Ratio',
    },
  ];

  // 2026 Camp Sessions (July & August)
  const campWeeks = [
    { id: 'week-1', dates: 'Week 1: July 6 – July 10, 2026', theme: 'Nature Sleuths & Splash Kickoff' },
    { id: 'week-2', dates: 'Week 2: July 13 – July 17, 2026', theme: 'Junior STEM & Inventors Workshop' },
    { id: 'week-3', dates: 'Week 3: July 20 – July 24, 2026', theme: 'Wilderness & Survival Skills' },
    { id: 'week-4', dates: 'Week 4: July 27 – July 31, 2026', theme: 'Olympic Champions & Relay Week' },
    { id: 'week-5', dates: 'Week 5: August 4 – August 7, 2026 (4 Days)', theme: 'Eco-Art & Drama Showcase ($190)' },
    { id: 'week-6', dates: 'Week 6: August 10 – August 14, 2026', theme: 'Water Wonderland & Swim Carnival' },
    { id: 'week-7', dates: 'Week 7: August 17 – August 21, 2026', theme: 'Science Magic & Maker Lab' },
    { id: 'week-8', dates: 'Week 8: August 24 – August 28, 2026', theme: 'Grand Finale & Talent Festival' },
  ];

  const handleWeekToggle = (weekId: string) => {
    setFormData((prev) => {
      const exists = prev.selectedWeeks.includes(weekId);
      if (exists) {
        return { ...prev, selectedWeeks: prev.selectedWeeks.filter((w) => w !== weekId) };
      } else {
        return { ...prev, selectedWeeks: [...prev.selectedWeeks, weekId] };
      }
    });
  };

  // Calculate fees
  const selectedProgramObj = campPrograms.find((p) => p.id === formData.campProgram) || campPrograms[0];
  const numWeeks = formData.selectedWeeks.length;
  const baseCampCost = numWeeks * selectedProgramObj.feeWeekly;
  const extendedCareWeekly = formData.extendedCare === 'both' ? 45 : formData.extendedCare === 'none' ? 0 : 25;
  const totalExtendedCare = numWeeks * extendedCareWeekly;
  const totalCost = baseCampCost + totalExtendedCare;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const ref = `REC-CAMP-2026-${randomCode}`;
    setRegistrationRef(ref);
    setSubmittedAt(new Date().toLocaleString());
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyEndpoint = () => {
    navigator.clipboard.writeText('https://mapplewood-fictional-town.onrender.com/recreation');
    setCopiedEndpoint(true);
    setTimeout(() => setCopiedEndpoint(false), 2000);
  };

  return (
    <article
      className="space-y-8 max-w-4xl mx-auto bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-sm"
      itemScope
      itemType="https://schema.org/GovernmentService"
      data-endpoint-url="https://mapplewood-fictional-town.onrender.com/recreation"
      data-service-name="Town of Maplewood Recreation & Summer Camp Intake"
      data-target-age="8 years old (Ages 7-12)"
    >
      <SEOHead
        title="Recreation & Summer Camp Registration Form (Ages 7–12 · 8-Year-Old Offers)"
        description="Official Town of Maplewood 2026 summer camp registration form for 8-year-old children and youth. Junior Explorers Day Camp, daily swim lessons, STEM, and sports."
        category="Recreation & Camps"
      />

      {/* ── Scraper & API Direct Endpoint Header ── */}
      <div className="bg-slate-900 text-slate-100 p-4 rounded-xl text-xs space-y-2 border border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-mono font-bold uppercase text-slate-300">
              Direct Registration Endpoint &middot; AI Scraper &amp; Chatbot Ready
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
          Permanent URI: <span className="text-emerald-400">https://mapplewood-fictional-town.onrender.com/recreation</span> &bull; Action: <span className="text-amber-300">Online Intake for 8-Year-Old Campers &amp; Youth Programs</span>
        </p>
      </div>

      {/* ── Page Header ── */}
      <header className="border-b border-slate-200 pb-6 space-y-3">
        <div className="inline-block bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded">
          Parks, Recreation &amp; Culture Division
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-serif text-slate-900" itemProp="name">
          2026 Recreation &amp; Summer Camp Registration
        </h1>
        <p className="text-base text-slate-600 leading-relaxed" itemProp="description">
          Welcome to the official Town of Maplewood summer camp registration portal. Browse our specialized summer day camp programs tailored for <strong>8-year-old children</strong> (Junior Explorers, Eco-Adventure, Creative Arts), choose your weekly summer sessions, and submit your registration directly online.
        </p>
      </header>

      {/* ── Highlight Banner for 8-Year-Old Summer Camp Offers ── */}
      <section className="p-5 bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-300 rounded-xl space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🏕️</span>
          <h2 className="text-lg font-bold text-emerald-950">
            Featured 2026 Offering: Junior Explorers Day Camp (Perfect for 8-Year-Olds!)
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed">
          Children aged <strong>8 years old</strong> thrive in our flagship <em>Junior Explorers Program</em>! Each week offers certified Red Cross swimming lessons at Memorial Park Pool, robotics and science maker labs, sports leagues, nature conservation hikes, and safe supervision by certified counselors trained in Standard First Aid and CPR-C.
        </p>
        <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-emerald-800">
          <span>📅 July 6 &ndash; August 28, 2026</span>
          <span>⏰ 9:00 AM &ndash; 4:00 PM</span>
          <span>💵 $235 / Week</span>
          <span>🏊 Daily Swim Included</span>
        </div>
      </section>

      {/* ── Submission Confirmation Banner ── */}
      {submitted && (
        <section
          className="p-6 bg-emerald-50 border-2 border-emerald-500 rounded-2xl space-y-4 animate-in fade-in duration-300"
          id="registration-receipt"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-900 text-xs font-bold uppercase font-mono tracking-wider">
                Registration Confirmed &middot; Spot Reserved
              </span>
              <h2 className="text-2xl font-bold text-emerald-950 font-serif">
                Summer Camp Application Received!
              </h2>
              <p className="text-xs text-emerald-800">
                Official municipal confirmation generated at {submittedAt}.
              </p>
            </div>
            <span className="text-3xl">🎉</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-emerald-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-500 block uppercase font-mono text-[10px]">Reference Number</span>
              <span className="font-bold font-mono text-base text-blue-900">{registrationRef}</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase font-mono text-[10px]">Registered Camper</span>
              <span className="font-bold text-slate-900">{formData.childName} (Age: {formData.childAge})</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase font-mono text-[10px]">Program Chosen</span>
              <span className="font-bold text-slate-900">{selectedProgramObj.title}</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase font-mono text-[10px]">Total Weeks &amp; Fee</span>
              <span className="font-bold text-slate-900">{numWeeks} Week(s) &middot; ${totalCost}.00 CAD</span>
            </div>
          </div>

          <p className="text-xs text-emerald-900 leading-relaxed">
            A registration package with camp guidelines, emergency contact authorizations, and what-to-bring checklists has been dispatched to <strong>{formData.parentEmail || 'your email'}</strong>. Camp fees are payable online or at Town Hall prior to June 15, 2026.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => window.print()}
              className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors"
            >
              🖨️ Print Registration Confirmation
            </button>
            <button
              onClick={() => setSubmitted(false)}
              className="bg-white border border-emerald-300 hover:bg-emerald-50 text-emerald-900 font-bold text-xs px-4 py-2 rounded-lg transition-colors"
            >
              Register Another Child &rarr;
            </button>
          </div>
        </section>
      )}

      {/* ── Interactive Registration Form ── */}
      <form onSubmit={handleSubmit} className="space-y-8" id="camp-registration-form">
        
        {/* Step 1: Program Selection */}
        <fieldset className="space-y-4">
          <legend className="text-lg font-bold text-slate-900 font-serif border-b border-slate-200 pb-2 w-full">
            1. Select Summer Camp Program
          </legend>
          
          <div className="grid grid-cols-1 gap-3">
            {campPrograms.map((prog) => {
              const isSelected = formData.campProgram === prog.id;
              return (
                <label
                  key={prog.id}
                  className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="campProgram"
                      value={prog.id}
                      checked={isSelected}
                      onChange={(e) => setFormData({ ...formData, campProgram: e.target.value })}
                      className="mt-1 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300"
                    />
                    <div className="space-y-1 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-bold text-slate-900 text-sm">{prog.title}</span>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${prog.badgeColor}`}>
                          {prog.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{prog.description}</p>
                      <div className="pt-2 flex flex-wrap gap-4 text-[11px] text-slate-500 font-mono">
                        <span>📍 {prog.location}</span>
                        <span>💵 ${prog.feeWeekly}/wk</span>
                        <span>👥 {prog.ratio}</span>
                      </div>
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        </fieldset>

        {/* Step 2: Camper Information */}
        <fieldset className="space-y-4">
          <legend className="text-lg font-bold text-slate-900 font-serif border-b border-slate-200 pb-2 w-full">
            2. Camper Details (Target: 8-Year-Olds &amp; Youth)
          </legend>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Camper Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Leo Henderson"
                value={formData.childName}
                onChange={(e) => setFormData({ ...formData, childName: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Camper Age *</label>
              <select
                value={formData.childAge}
                onChange={(e) => setFormData({ ...formData, childAge: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
              >
                <option value="7">7 Years Old</option>
                <option value="8">8 Years Old (Recommended)</option>
                <option value="9">9 Years Old</option>
                <option value="10">10 Years Old</option>
                <option value="11">11 Years Old</option>
                <option value="12">12 Years Old</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Date of Birth *</label>
              <input
                type="date"
                required
                value={formData.childDob}
                onChange={(e) => setFormData({ ...formData, childDob: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Swimming Skill Level</label>
              <select
                value={formData.swimmingSkill}
                onChange={(e) => setFormData({ ...formData, swimmingSkill: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
              >
                <option value="beginner">Beginner (Lifejacket required)</option>
                <option value="intermediate">Intermediate (Comfortable in shallow water)</option>
                <option value="advanced">Advanced (Deep end swim test qualified)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Camp T-Shirt Size</label>
              <select
                value={formData.tshirtSize}
                onChange={(e) => setFormData({ ...formData, tshirtSize: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
              >
                <option value="Youth-S">Youth Small (Ages 6-7)</option>
                <option value="Youth-M">Youth Medium (Ages 8-9)</option>
                <option value="Youth-L">Youth Large (Ages 10-12)</option>
                <option value="Adult-S">Adult Small</option>
              </select>
            </div>
          </div>

          {/* Medical & Allergies */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-bold text-slate-700 block">Does the camper have allergies, dietary restrictions, or medical considerations?</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="hasAllergies"
                  value="no"
                  checked={formData.hasAllergies === 'no'}
                  onChange={() => setFormData({ ...formData, hasAllergies: 'no', allergyDetails: '' })}
                />
                No known allergies
              </label>
              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="hasAllergies"
                  value="yes"
                  checked={formData.hasAllergies === 'yes'}
                  onChange={() => setFormData({ ...formData, hasAllergies: 'yes' })}
                />
                Yes (Specify below)
              </label>
            </div>
            {formData.hasAllergies === 'yes' && (
              <textarea
                placeholder="Please describe allergy details, EpiPen requirements, asthma inhalers, or dietary restrictions..."
                value={formData.allergyDetails}
                onChange={(e) => setFormData({ ...formData, allergyDetails: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            )}
          </div>
        </fieldset>

        {/* Step 3: Session Weeks Selection */}
        <fieldset className="space-y-4">
          <legend className="text-lg font-bold text-slate-900 font-serif border-b border-slate-200 pb-2 w-full">
            3. Choose Camp Weeks (Summer 2026)
          </legend>
          <p className="text-xs text-slate-600">Select one or more weekly sessions. Multi-week enrollment is welcome.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {campWeeks.map((wk) => {
              const isChecked = formData.selectedWeeks.includes(wk.id);
              return (
                <label
                  key={wk.id}
                  className={`flex items-start gap-2.5 p-3 rounded-lg border cursor-pointer transition-colors text-xs ${
                    isChecked
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-semibold'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleWeekToggle(wk.id)}
                    className="mt-0.5 h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                  />
                  <div>
                    <div className="font-bold">{wk.dates}</div>
                    <div className="text-[11px] text-slate-500 font-normal">{wk.theme}</div>
                  </div>
                </label>
              );
            })}
          </div>

          {/* Extended Care Option */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <label className="text-xs font-bold text-slate-900 block">Extended Supervision Care</label>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
              <label className="flex items-center gap-2 p-2 bg-white rounded border border-slate-200 cursor-pointer">
                <input
                  type="radio"
                  name="extendedCare"
                  value="none"
                  checked={formData.extendedCare === 'none'}
                  onChange={(e) => setFormData({ ...formData, extendedCare: e.target.value })}
                />
                None (9am - 4pm)
              </label>
              <label className="flex items-center gap-2 p-2 bg-white rounded border border-slate-200 cursor-pointer">
                <input
                  type="radio"
                  name="extendedCare"
                  value="am"
                  checked={formData.extendedCare === 'am'}
                  onChange={(e) => setFormData({ ...formData, extendedCare: e.target.value })}
                />
                Morning (7:30 - 9am) (+$25/wk)
              </label>
              <label className="flex items-center gap-2 p-2 bg-white rounded border border-slate-200 cursor-pointer">
                <input
                  type="radio"
                  name="extendedCare"
                  value="pm"
                  checked={formData.extendedCare === 'pm'}
                  onChange={(e) => setFormData({ ...formData, extendedCare: e.target.value })}
                />
                Afternoon (4 - 6pm) (+$25/wk)
              </label>
              <label className="flex items-center gap-2 p-2 bg-white rounded border border-slate-200 cursor-pointer">
                <input
                  type="radio"
                  name="extendedCare"
                  value="both"
                  checked={formData.extendedCare === 'both'}
                  onChange={(e) => setFormData({ ...formData, extendedCare: e.target.value })}
                />
                Full AM + PM (+$45/wk)
              </label>
            </div>
          </div>
        </fieldset>

        {/* Step 4: Parent / Guardian Information */}
        <fieldset className="space-y-4">
          <legend className="text-lg font-bold text-slate-900 font-serif border-b border-slate-200 pb-2 w-full">
            4. Parent / Guardian Contact Details
          </legend>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Parent / Guardian Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Sarah Henderson"
                value={formData.parentName}
                onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Email Address *</label>
              <input
                type="email"
                required
                placeholder="sarah.henderson@example.com"
                value={formData.parentEmail}
                onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Primary Phone *</label>
              <input
                type="tel"
                required
                placeholder="(555) 234-5678"
                value={formData.parentPhone}
                onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Residential Address (Maplewood) *</label>
              <input
                type="text"
                required
                placeholder="142 Elmwood Ave, Maplewood"
                value={formData.homeAddress}
                onChange={(e) => setFormData({ ...formData, homeAddress: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Secondary Emergency Contact &amp; Phone *</label>
              <input
                type="text"
                required
                placeholder="Grandparent or relative: Mark Henderson (555) 876-5432"
                value={formData.emergencyContactName}
                onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        </fieldset>

        {/* Fee Estimate Summary */}
        <div className="p-4 bg-slate-900 text-white rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 uppercase font-mono tracking-wider block">
              Calculated Registration Estimate
            </span>
            <div className="text-sm font-semibold text-slate-200">
              {numWeeks} week(s) &times; ${selectedProgramObj.feeWeekly} base {totalExtendedCare > 0 && `+ $${totalExtendedCare} extended care`}
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold font-mono text-emerald-400">${totalCost}.00 CAD</span>
            <span className="text-[10px] text-slate-400 block font-mono">Tax-exempt municipal youth camp</span>
          </div>
        </div>

        {/* Declarations & Waiver */}
        <div className="space-y-3 pt-2">
          <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              required
              checked={formData.agreeToWaiver}
              onChange={(e) => setFormData({ ...formData, agreeToWaiver: e.target.checked })}
              className="mt-0.5 h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
            />
            <span>
              I certify that I am the legal parent/guardian of the child listed above. I authorize certified camp staff to administer emergency first aid and grant permission for my child to participate in recreational swim and field trips.
            </span>
          </label>

          <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              required
              checked={formData.agreeToCodeOfConduct}
              onChange={(e) => setFormData({ ...formData, agreeToCodeOfConduct: e.target.checked })}
              className="mt-0.5 h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
            />
            <span>
              I agree to the Town of Maplewood Recreation Code of Conduct, including prompt pickup times and mutual respect guidelines.
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <NavLink to="/" className="text-xs text-slate-500 hover:text-slate-800 font-semibold">
            &larr; Back to Municipal Home
          </NavLink>
          <button
            type="submit"
            disabled={numWeeks === 0}
            className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-sm px-8 py-3 rounded-xl shadow-md transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🏕️ Submit Summer Camp Registration &rarr;
          </button>
        </div>
      </form>
    </article>
  );
}

