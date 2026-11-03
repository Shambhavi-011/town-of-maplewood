import { useState, useEffect } from 'react';
import { NavLink, useSearchParams } from 'react-router-dom';
import townData from '../../data/townData.json';
import SEOHead from '../../components/SEOHead';

interface CaseRecord {
  caseId: string;
  category: string;
  title: string;
  address: string;
  submittedAt: string;
  status: 'Received' | 'Assigned' | 'InProgress' | 'Completed';
  severity: 'Standard' | 'Medium' | 'High';
  sla: string;
  department: string;
  staffNotes: string;
  history: Array<{ status: string; timestamp: string; note: string }>;
}

export default function ServiceRequestPortal() {
  const { serviceRequests, townInfo } = townData;
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('type') || 'pothole';
  const initialTab = searchParams.get('tab') === 'track' ? 'track' : 'submit';

  const [activeTab, setActiveTab] = useState<'submit' | 'track'>(initialTab);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);

  useEffect(() => {
    const typeParam = searchParams.get('type');
    const tabParam = searchParams.get('tab');
    if (typeParam) {
      if (typeParam === 'waste') setSelectedCategory('missedWaste');
      else if (typeParam === 'light') setSelectedCategory('streetlight');
      else if (typeParam === 'tree') setSelectedCategory('parkTree');
      else if (typeParam === 'water') setSelectedCategory('waterIssue');
      else setSelectedCategory(typeParam);
      setActiveTab('submit');
    }
    if (tabParam === 'track') {
      setActiveTab('track');
    } else if (tabParam === 'submit') {
      setActiveTab('submit');
    }
  }, [searchParams]);

  // Form State
  const [applicantName, setApplicantName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [crossStreet, setCrossStreet] = useState('');
  const [description, setDescription] = useState('');

  // Category specific fields
  const [potholeSize, setPotholeSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [laneDirection, setLaneDirection] = useState('Northbound');
  const [isTravelLane, setIsTravelLane] = useState(false);
  const [isNearSchool, setIsNearSchool] = useState(false);

  const [binStream, setBinStream] = useState('blueBox');
  const [placedBefore7Am, setPlacedBefore7Am] = useState(true);
  const [isAfter5Pm, setIsAfter5Pm] = useState(true);

  const [poleTag, setPoleTag] = useState('');
  const [lightIssue, setLightIssue] = useState('dark');

  const [parkName, setParkName] = useState('');
  const [isBoulevardTree, setIsBoulevardTree] = useState(true);
  const [treeHazard, setTreeHazard] = useState('fallenBranch');

  // Submission State
  const [submittedCase, setSubmittedCase] = useState<CaseRecord | null>(null);

  // Tracking State
  const [trackingQuery, setTrackingQuery] = useState('');
  const [trackedRecord, setTrackedRecord] = useState<CaseRecord | null>(null);
  const [trackingError, setTrackingError] = useState<string | null>(null);

  // Sample Demo Database for Tracking
  const demoCases: Record<string, CaseRecord> = {
    'CASE-2026-ROAD-4102': {
      caseId: 'CASE-2026-ROAD-4102',
      category: 'Pothole & Road Hazard',
      title: 'Large Pothole in Active Travel Lane',
      address: '45 Main Street & Oak Avenue (Westbound)',
      submittedAt: 'October 30, 2026, 09:15 AM',
      status: 'InProgress',
      severity: 'High',
      sla: 'Inspected & repaired within 24 hours',
      department: 'Roads & Fleet Maintenance',
      staffNotes: 'Crew 4 dispatched with asphalt hot-mix patcher. Traffic cones in place.',
      history: [
        { status: 'Received', timestamp: 'Oct 30, 09:15 AM', note: 'Logged via 311 Citizen Portal. Flagged High Severity (active travel lane).' },
        { status: 'Assigned', timestamp: 'Oct 30, 10:30 AM', note: 'Assigned to Roads District West supervisor Greg Shaw.' },
        { status: 'InProgress', timestamp: 'Oct 31, 08:00 AM', note: 'Work order #RD-8841 generated; road repair crew on site.' },
      ],
    },
    'CASE-2026-WASTE-8819': {
      caseId: 'CASE-2026-WASTE-8819',
      category: 'Missed Waste Collection',
      title: 'Missed Blue Box Recycling (Commingled)',
      address: '112 Valley Road (Section 2)',
      submittedAt: 'October 29, 2026, 05:45 PM',
      status: 'Assigned',
      severity: 'Standard',
      sla: 'Resolved within 2 business days',
      department: 'Public Works & Waste Management',
      staffNotes: 'Confirmed setout occurred before 7 AM. Route driver supervisor notified for Thursday morning sweep.',
      history: [
        { status: 'Received', timestamp: 'Oct 29, 05:45 PM', note: 'Verified submission time is after 5:00 PM cutoff.' },
        { status: 'Assigned', timestamp: 'Oct 30, 08:30 AM', note: 'Work order sent to recycling collection contractor for scheduled resolution.' },
      ],
    },
    'CASE-2026-LIGHT-1204': {
      caseId: 'CASE-2026-LIGHT-1204',
      category: 'Streetlight Outage',
      title: 'Completely Dark LED Luminaire',
      address: '359 Boyden Ave (Pole Tag: ML-0412)',
      submittedAt: 'October 25, 2026, 07:20 PM',
      status: 'Completed',
      severity: 'Standard',
      sla: 'Resolved within 5 business days',
      department: 'Traffic & Street Lighting Operations',
      staffNotes: 'Defective LED driver and photocell sensor replaced. Tested functional and illuminated at 100%.',
      history: [
        { status: 'Received', timestamp: 'Oct 25, 07:20 PM', note: 'Citizen report logged for pole ML-0412.' },
        { status: 'Assigned', timestamp: 'Oct 26, 09:00 AM', note: 'Assigned to municipal bucket truck utility electrician.' },
        { status: 'InProgress', timestamp: 'Oct 27, 01:15 PM', note: 'Utility electrician on site performing circuit diagnostics.' },
        { status: 'Completed', timestamp: 'Oct 27, 03:30 PM', note: 'Work completed. Luminaire operational.' },
      ],
    },
  };

  const calculatePotholeSeverity = () => {
    if (potholeSize === 'large' || isTravelLane || isNearSchool) return 'High';
    if (potholeSize === 'medium') return 'Medium';
    return 'Standard';
  };

  const getPotholeSla = () => {
    const sev = calculatePotholeSeverity();
    if (sev === 'High') return 'Inspected within 24 hours (High Priority)';
    if (sev === 'Medium') return 'Inspected within 3 business days';
    return 'Inspected within 5 business days';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    let categoryPrefix = 'GEN';
    let deptName = 'Citizen Experience & By-law';
    let slaDesc = '3 business days';
    let sev: 'Standard' | 'Medium' | 'High' = 'Standard';

    if (selectedCategory === 'pothole') {
      categoryPrefix = 'ROAD';
      deptName = 'Roads & Fleet Maintenance';
      sev = calculatePotholeSeverity();
      slaDesc = getPotholeSla();
    } else if (selectedCategory === 'missedWaste') {
      categoryPrefix = 'WASTE';
      deptName = 'Public Works & Waste Management';
      slaDesc = 'Resolved within 2 business days';
    } else if (selectedCategory === 'streetlight') {
      categoryPrefix = 'LIGHT';
      deptName = 'Traffic & Street Lighting Operations';
      slaDesc = '5 to 7 business days';
    } else if (selectedCategory === 'parkTree') {
      categoryPrefix = 'PARK';
      deptName = 'Parks, Trails & Urban Forestry';
      slaDesc = '48 hours for hazards; 10 days for pruning';
      sev = treeHazard === 'fallenBranch' ? 'High' : 'Standard';
    }

    const newCaseId = `CASE-2026-${categoryPrefix}-${randomDigits}`;
    const newRecord: CaseRecord = {
      caseId: newCaseId,
      category: selectedCategory,
      title: `${selectedCategory.toUpperCase()} Report at ${streetAddress}`,
      address: streetAddress + (crossStreet ? ` (near ${crossStreet})` : ''),
      submittedAt: new Date().toLocaleString(),
      status: 'Received',
      severity: sev,
      sla: slaDesc,
      department: deptName,
      staffNotes: 'Request queued in 311 municipal database. Assigned to dispatch supervisor for automated assessment.',
      history: [
        {
          status: 'Received',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          note: `Request received from ${applicantName}. Validated and assigned to ${deptName}.`,
        },
      ],
    };

    setSubmittedCase(newRecord);
    demoCases[newCaseId] = newRecord;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTrackSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = trackingQuery.trim().toUpperCase();
    if (!query) return;

    if (demoCases[query]) {
      setTrackedRecord(demoCases[query]);
      setTrackingError(null);
    } else if (submittedCase && submittedCase.caseId === query) {
      setTrackedRecord(submittedCase);
      setTrackingError(null);
    } else {
      setTrackedRecord(null);
      setTrackingError(`No municipal case or permit found matching "${query}". Please verify your reference number format (e.g., CASE-2026-ROAD-4102 or PERM-DECK-2026-XXXX).`);
    }
  };

  return (
    <article
      id="service-request-portal-container"
      className="space-y-8 max-w-5xl mx-auto bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-sm scroll-mt-20"
      itemScope
      itemType="https://schema.org/GovernmentService"
      data-kb-topic="service-request-portal-311"
    >
      <SEOHead
        title="311 Citizen Service Requests & Case Tracking"
        description="Official Town of Maplewood 311 Citizen Service Portal. Report potholes, missed garbage collection, dark streetlights, or park hazards, and track work orders online."
        category="Service Request Portal"
      />

      {/* ── Top 311 Intake Header ── */}
      <header className="border-b border-slate-200 pb-6 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="inline-block bg-blue-100 text-blue-900 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded">
            Citizen Services &middot; 311 Action Center
          </div>
          <div className="text-xs font-mono text-slate-500">
            Emergency Hotlines: Roads {townInfo.emergencyHotlines.roadsEmergency} | Water {townInfo.emergencyHotlines.waterSewerEmergency}
          </div>
        </div>

        <div className="flex items-start gap-4">
          <span className="text-4xl p-3 bg-blue-50 border border-blue-200 rounded-2xl shadow-inner">
            🛠️
          </span>
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-bold font-serif text-slate-900" itemProp="name">
              {serviceRequests.portalTitle}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed" itemProp="description">
              {serviceRequests.portalDescription}
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={() => {
              setActiveTab('submit');
              setSubmittedCase(null);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'submit'
                ? 'bg-blue-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>📝</span> Submit New Request
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('track')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'track'
                ? 'bg-blue-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>🔍</span> Track Request Status
          </button>
          <NavLink
            to="/about"
            className="ml-auto text-xs text-blue-800 hover:underline font-semibold"
          >
            View Town Departments &rarr;
          </NavLink>
        </div>
      </header>

      {/* ── Urgent Danger Warning Banner ── */}
      <div className="p-4 bg-red-50 border-l-4 border-red-600 rounded-r-xl text-xs text-red-950 space-y-1">
        <strong className="font-bold flex items-center gap-1.5 text-sm text-red-900">
          <span>⚠️</span> For Life-Threatening Emergencies Call 911 Immediately
        </strong>
        <p className="leading-relaxed">
          Do not use this form for downed power wires (call <strong>1-800-434-1235</strong>), major water main breaks flooding roadways (call <strong>(555) 123-9287</strong> 24/7), or active gas leaks.
        </p>
      </div>

      {/* ── TAB 1: SUBMIT NEW REQUEST ── */}
      {activeTab === 'submit' && (
        <section className="space-y-8">
          {/* Success Screen after submission */}
          {submittedCase ? (
            <div className="p-6 sm:p-8 bg-emerald-50 border-2 border-emerald-500 rounded-2xl space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow">
                  ✓
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                    Request Successfully Created
                  </span>
                  <h2 className="text-2xl font-bold text-emerald-950 font-serif">
                    311 Case Logged with Town Dispatch
                  </h2>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-emerald-200 text-xs space-y-3 font-mono">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-slate-500 block">Case Tracking Number:</span>
                    <strong className="text-base text-blue-950 font-bold">{submittedCase.caseId}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Assigned Department:</span>
                    <strong className="text-slate-900">{submittedCase.department}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Location:</span>
                    <strong>{submittedCase.address}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Resolution SLA:</span>
                    <strong className="text-emerald-700">{submittedCase.sla}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1 font-sans">
                  <span className="text-slate-500">Current Status:</span>
                  <span className="bg-blue-100 text-blue-900 font-bold px-2 py-0.5 rounded text-[11px]">
                    {submittedCase.status} &middot; Received
                  </span>
                  <span className="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded text-[11px]">
                    Severity: {submittedCase.severity}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('track');
                    setTrackingQuery(submittedCase.caseId);
                    setTrackedRecord(submittedCase);
                  }}
                  className="bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs px-4 py-2.5 rounded-lg transition-colors"
                >
                  Track This Case Now &rarr;
                </button>
                <button
                  type="button"
                  onClick={() => setSubmittedCase(null)}
                  className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold text-xs px-4 py-2.5 rounded-lg transition-colors"
                >
                  Submit Another Request
                </button>
              </div>
            </div>
          ) : (
            /* Submission Form */
            <form id="service-request-form" onSubmit={handleSubmit} className="space-y-6 scroll-mt-24">
              {/* Category Selection Cards */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Select Issue Category *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'pothole', icon: '🚧', label: 'Pothole & Road Hazard' },
                    { id: 'missedWaste', icon: '🚛', label: 'Missed Waste / Bins' },
                    { id: 'streetlight', icon: '💡', label: 'Streetlight Outage' },
                    { id: 'parkTree', icon: '🌳', label: 'Park / Boulevard Tree' },
                    { id: 'waterIssue', icon: '💧', label: 'Water Pressure / Meter' },
                    { id: 'general311', icon: '🏛️', label: 'General 311 Inquiry' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                        selectedCategory === cat.id
                          ? 'border-blue-900 bg-blue-50 text-blue-950 font-bold shadow-xs'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className="text-2xl">{cat.icon}</span>
                      <span className="text-xs leading-snug">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Category-Specific Guidance & Rules */}
              {selectedCategory === 'pothole' && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-3 text-xs text-amber-950">
                  <div className="flex items-center gap-2 font-bold text-amber-900">
                    <span>🚧</span> Pothole Service Level Agreement &amp; Travel Lane Rule
                  </div>
                  <p className="leading-relaxed">
                    Under municipal maintenance standards, large potholes (&gt;60 cm diameter) situated in active travel lanes or school zones are classified as <strong>High Severity</strong> for repair within <strong>24 hours</strong>. Duplicate reports within 50 meters submitted within the last 30 days are automatically unified.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div>
                      <label className="block font-semibold mb-1">Estimated Pothole Size</label>
                      <select
                        value={potholeSize}
                        onChange={(e) => setPotholeSize(e.target.value as any)}
                        className="w-full p-2 text-xs border border-amber-300 rounded bg-white text-slate-800"
                      >
                        <option value="small">Small (&lt;25 cm / 10 in) - 5 Day SLA</option>
                        <option value="medium">Medium (25–60 cm / 10–24 in) - 3 Day SLA</option>
                        <option value="large">Large (&gt;60 cm / 24 in) - 24 Hour SLA</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Lane Direction</label>
                      <select
                        value={laneDirection}
                        onChange={(e) => setLaneDirection(e.target.value)}
                        className="w-full p-2 text-xs border border-amber-300 rounded bg-white text-slate-800"
                      >
                        <option value="Northbound">Northbound Lane</option>
                        <option value="Southbound">Southbound Lane</option>
                        <option value="Eastbound">Eastbound Lane</option>
                        <option value="Westbound">Westbound Lane</option>
                      </select>
                    </div>
                    <div className="space-y-1.5 pt-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isTravelLane}
                          onChange={(e) => setIsTravelLane(e.target.checked)}
                          className="h-4 w-4 text-amber-600 rounded"
                        />
                        <span className="font-semibold text-slate-800">Located in active travel lane</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isNearSchool}
                          onChange={(e) => setIsNearSchool(e.target.checked)}
                          className="h-4 w-4 text-amber-600 rounded"
                        />
                        <span className="font-semibold text-slate-800">Within designated School Zone</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {selectedCategory === 'missedWaste' && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-3 text-xs text-blue-950">
                  <div className="flex items-center gap-2 font-bold text-blue-900">
                    <span>🚛</span> Mandatory Curbside Waste Collection Policy
                  </div>
                  <p className="leading-relaxed">
                    Municipal trucks collect curbside materials between 7:00 AM and 5:00 PM. <strong>Reports filed before 5:00 PM are rejected</strong> as crews may still be completing their rounds. Verified missed collections are addressed within 2 business days.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block font-semibold mb-1">Missed Collection Stream</label>
                      <select
                        value={binStream}
                        onChange={(e) => setBinStream(e.target.value)}
                        className="w-full p-2 text-xs border border-blue-300 rounded bg-white text-slate-800"
                      >
                        <option value="blueBox">Blue Box Recycling (Fibers or Commingled Containers)</option>
                        <option value="greenBin">Green Organics Bin (Weekly Compost)</option>
                        <option value="garbage">Garbage / Household Waste (Bi-weekly)</option>
                        <option value="bulk">Monthly Bulk Furniture / Appliance Item</option>
                      </select>
                    </div>
                    <div className="space-y-2 pt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={placedBefore7Am}
                          onChange={(e) => setPlacedBefore7Am(e.target.checked)}
                          className="h-4 w-4 text-blue-600 rounded"
                        />
                        <span className="font-semibold text-slate-800">I confirm bins were curbside before 7:00 AM *</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isAfter5Pm}
                          onChange={(e) => setIsAfter5Pm(e.target.checked)}
                          className="h-4 w-4 text-blue-600 rounded"
                        />
                        <span className="font-semibold text-slate-800">It is currently after 5:00 PM on my collection day *</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {selectedCategory === 'streetlight' && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs text-slate-700">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <span>💡</span> Streetlight Identification &amp; Dark Corridor Protocol
                  </div>
                  <p className="leading-relaxed">
                    Every municipal utility pole in Maplewood carries an engraved 6-digit metallic pole tag (e.g., <strong>ML-0412</strong>) located approximately 2 meters up the pole facing the roadway.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-1">6-Digit Pole Tag (Optional but Recommended)</label>
                      <input
                        type="text"
                        placeholder="e.g., ML-0412"
                        value={poleTag}
                        onChange={(e) => setPoleTag(e.target.value)}
                        className="w-full p-2 text-xs border border-slate-300 rounded bg-white uppercase font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Observed Fixture Condition</label>
                      <select
                        value={lightIssue}
                        onChange={(e) => setLightIssue(e.target.value)}
                        className="w-full p-2 text-xs border border-slate-300 rounded bg-white"
                      >
                        <option value="dark">Completely Dark all night</option>
                        <option value="flickering">Flickering or cycling on/off</option>
                        <option value="dayburn">Dayburning (illuminated during daylight hours)</option>
                        <option value="damaged">Physical pole impact / hanging fixture</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {selectedCategory === 'parkTree' && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-3 text-xs text-emerald-950">
                  <div className="flex items-center gap-2 font-bold text-emerald-900">
                    <span>🌳</span> Boulevard vs. Private Tree Responsibility (By-law 2023-45)
                  </div>
                  <p className="leading-relaxed">
                    Municipal forestry crews maintain trees located on Town road allowances (within 4.5 meters of the street curb) and within municipal parks. Trees on private property are the property owner's responsibility.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-1">Park Name (if located inside a park)</label>
                      <input
                        type="text"
                        placeholder="e.g., Memorial Park, River Valley Park"
                        value={parkName}
                        onChange={(e) => setParkName(e.target.value)}
                        className="w-full p-2 text-xs border border-emerald-300 rounded bg-white text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Hazard Classification</label>
                      <select
                        value={treeHazard}
                        onChange={(e) => setTreeHazard(e.target.value)}
                        className="w-full p-2 text-xs border border-emerald-300 rounded bg-white"
                      >
                        <option value="fallenBranch">Hanging / Fallen Tree Branch (Immediate Hazard)</option>
                        <option value="damagedBench">Damaged Park Bench / Bleachers</option>
                        <option value="playground">Playground Structure Safety Issue</option>
                        <option value="overgrown">Overgrown Brush Obstructing Sidewalk</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2 pt-1">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isBoulevardTree}
                          onChange={(e) => setIsBoulevardTree(e.target.checked)}
                          className="h-4 w-4 text-emerald-600 rounded"
                        />
                        <span className="font-semibold text-slate-800">
                          I confirm the tree or hazard is located within 4.5 meters of the street curb (municipal boulevard) or within a public park.
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Location & Contact Form Fields */}
              <div className="p-5 border border-slate-200 rounded-xl space-y-4 bg-slate-50/50">
                <h3 className="font-bold text-slate-800 text-sm font-serif">
                  Location &amp; Resident Contact Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Street Address of Issue / Hazard *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., 45 Elm Street or Valley Rd"
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Closest Cross-Street / Intersection (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Corner of Main St & Oak Ave"
                      value={crossStreet}
                      onChange={(e) => setCrossStreet(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Maria Sanchez"
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Contact Email (for automated status updates) *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Contact Phone (for crew follow-up) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="(555) 123-4567"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Attach Photo / Documentation (Mock upload)
                    </label>
                    <div className="border border-dashed border-slate-300 rounded-lg p-2.5 text-center text-xs text-slate-500 bg-white hover:border-blue-400 cursor-pointer">
                      📷 Click to upload photo of pothole, bin, or pole
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Additional Description or Landmark Details
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g., Pothole is directly in front of the municipal library entrance; deep edges causing tire impacts."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-200">
                <span className="text-xs text-slate-500">
                  Dispatched to Maplewood 311 Operations Queue
                </span>
                <button
                  type="submit"
                  className="bg-blue-900 hover:bg-blue-800 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  <span>🚀</span> Submit 311 Service Request
                </button>
              </div>
            </form>
          )}
        </section>
      )}

      {/* ── TAB 2: TRACK AN EXISTING REQUEST ── */}
      {activeTab === 'track' && (
        <section className="space-y-6">
          <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
            <h2 className="text-lg font-bold text-slate-900 font-serif">
              Track Municipal Work Order or Case
            </h2>
            <p className="text-xs text-slate-600">
              Enter your 311 Tracking Number below (e.g., <code>CASE-2026-ROAD-4102</code>) to check crew assignment, inspection logs, and estimated completion.
            </p>

            <form onSubmit={handleTrackSearch} className="flex gap-2">
              <input
                type="text"
                placeholder="e.g., CASE-2026-ROAD-4102"
                value={trackingQuery}
                onChange={(e) => setTrackingQuery(e.target.value)}
                className="flex-1 px-4 py-2.5 text-sm border border-slate-300 rounded-xl bg-white font-mono uppercase focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-colors shadow-xs"
              >
                Track Case
              </button>
            </form>

            {/* Quick Demo Pre-fill Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="text-slate-400 font-medium">Quick Demo Lookups:</span>
              <button
                type="button"
                onClick={() => {
                  setTrackingQuery('CASE-2026-ROAD-4102');
                  setTrackedRecord(demoCases['CASE-2026-ROAD-4102']);
                  setTrackingError(null);
                }}
                className="bg-white hover:bg-blue-50 border border-slate-300 text-blue-900 font-mono px-2.5 py-1 rounded-lg text-[11px]"
              >
                🚧 Pothole (In Progress)
              </button>
              <button
                type="button"
                onClick={() => {
                  setTrackingQuery('CASE-2026-WASTE-8819');
                  setTrackedRecord(demoCases['CASE-2026-WASTE-8819']);
                  setTrackingError(null);
                }}
                className="bg-white hover:bg-blue-50 border border-slate-300 text-blue-900 font-mono px-2.5 py-1 rounded-lg text-[11px]"
              >
                🚛 Missed Blue Box (Assigned)
              </button>
              <button
                type="button"
                onClick={() => {
                  setTrackingQuery('CASE-2026-LIGHT-1204');
                  setTrackedRecord(demoCases['CASE-2026-LIGHT-1204']);
                  setTrackingError(null);
                }}
                className="bg-white hover:bg-blue-50 border border-slate-300 text-blue-900 font-mono px-2.5 py-1 rounded-lg text-[11px]"
              >
                💡 Streetlight ML-0412 (Resolved)
              </button>
            </div>
          </div>

          {trackingError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-900 font-semibold">
              ⚠️ {trackingError}
            </div>
          )}

          {/* Tracked Case Details Card */}
          {trackedRecord && (
            <div className="bg-white border-2 border-blue-900 rounded-2xl p-6 shadow-md space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-4 gap-2">
                <div>
                  <span className="text-xs font-mono text-slate-500 uppercase block">Municipal Work Order</span>
                  <h3 className="text-xl font-bold font-serif text-slate-900">{trackedRecord.caseId}</h3>
                  <div className="text-xs text-slate-600 font-medium">{trackedRecord.title}</div>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                      trackedRecord.status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-900'
                        : trackedRecord.status === 'InProgress'
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-blue-100 text-blue-900'
                    }`}
                  >
                    Status: {trackedRecord.status}
                  </span>
                  <div className="text-[11px] text-slate-400 mt-0.5">SLA: {trackedRecord.sla}</div>
                </div>
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block">Department</span>
                  <strong className="text-slate-900 font-sans">{trackedRecord.department}</strong>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block">Location</span>
                  <strong className="text-slate-900 font-sans">{trackedRecord.address}</strong>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block">Submitted At</span>
                  <strong className="text-slate-900 font-sans">{trackedRecord.submittedAt}</strong>
                </div>
              </div>

              {/* Progress Flow Visualization */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Workflow Timeline
                </span>
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  {['Received', 'Assigned', 'InProgress', 'Completed'].map((st, idx) => {
                    const statusOrder = ['Received', 'Assigned', 'InProgress', 'Completed'];
                    const currentIdx = statusOrder.indexOf(trackedRecord.status);
                    const isDone = idx <= currentIdx;
                    return (
                      <div
                        key={st}
                        className={`p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                          isDone
                            ? 'bg-blue-900 text-white border-blue-900 shadow-xs'
                            : 'bg-slate-50 text-slate-400 border-slate-200'
                        }`}
                      >
                        <span className="text-sm block mb-0.5">{isDone ? '✓' : '○'}</span>
                        {st === 'InProgress' ? 'In Progress' : st}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Crew Notes */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                <strong className="text-slate-900 block font-bold">Field Crew &amp; Dispatch Updates</strong>
                <p className="text-slate-700 leading-relaxed font-sans">{trackedRecord.staffNotes}</p>
                <div className="pt-2 border-t border-slate-200 space-y-1">
                  {trackedRecord.history.map((h, i) => (
                    <div key={i} className="flex items-start gap-2 text-[11px] text-slate-600 font-mono">
                      <span className="text-slate-400 whitespace-nowrap">[{h.timestamp}]</span>
                      <span className="font-semibold text-slate-800">{h.status}:</span>
                      <span>{h.note}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>
      )}
    </article>
  );
}
