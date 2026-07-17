'use client';

import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Search,
  Bookmark,
  Briefcase,
  KanbanSquare,
  Mail,
  BarChart3,
  CreditCard,
  Play,
  MapPin,
  Lock,
  Plus,
  Menu,
  X,
  ChevronDown,
  Building2,
  Filter,
  Download,
  Send,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

const NAVY = "#0B1F3A";
const NAVY_DEEP = "#071427";
const GOLD = "#D4AF37";
const GOLD_SOFT = "#E8CD7A";
const IVORY = "#FBF8F0";
const GRAY_BG = "#F5F6F8";

const FONTS = (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');
    .font-display { font-family: 'Fraunces', serif; }
    .font-mono { font-family: 'IBM Plex Mono', monospace; }
    .font-body { font-family: 'Inter', sans-serif; }
  `}</style>
);

// ---------------------------------------------------------------------------
// Mock data — stands in for GET /companies/me, /jobs, /candidates/search,
// /applications, /saved-candidates, /messages, /companies/me/analytics
// ---------------------------------------------------------------------------

const COMPANY = { name: "Northbridge Capital", plan: "FREE" };

const STATS = [
  { label: "Open roles", value: 6, icon: Briefcase },
  { label: "New applications", value: 23, icon: KanbanSquare },
  { label: "Saved candidates", value: 14, icon: Bookmark },
  { label: "Unread messages", value: 5, icon: Mail },
];

const CANDIDATES = [
  { id: 1, name: "Amaka O.", role: "Financial Analyst", years: 5, skills: ["Excel", "Power BI", "FP&A"], location: "Lagos, Nigeria", duration: "0:58", saved: false },
  { id: 2, name: "Tunde E.", role: "Product Designer", years: 3, skills: ["Figma", "UX Research"], location: "Remote", duration: "0:52", saved: true },
  { id: 3, name: "Chidinma N.", role: "Backend Engineer", years: 6, skills: ["Node.js", "PostgreSQL", "AWS"], location: "Abuja, Nigeria", duration: "1:00", saved: false },
  { id: 4, name: "Bassey I.", role: "Treasury Analyst", years: 4, skills: ["Cash Flow", "Reconciliation"], location: "Lagos, Nigeria", duration: "0:45", saved: false },
  { id: 5, name: "Grace M.", role: "Operations Lead", years: 7, skills: ["Logistics", "Vendor Mgmt"], location: "Port Harcourt, Nigeria", duration: "0:56", saved: true },
  { id: 6, name: "Femi A.", role: "Data Analyst", years: 2, skills: ["SQL", "Python", "Tableau"], location: "Remote", duration: "0:50", saved: false },
];

const JOB_POSTINGS = [
  { id: 1, title: "Commercial Analyst", type: "Full-time", location: "Lagos, Nigeria", status: "PUBLISHED", applicants: 14, deadline: "Jul 20" },
  { id: 2, title: "Backend Engineer (Node.js)", type: "Full-time", location: "Abuja, Nigeria", status: "PUBLISHED", applicants: 9, deadline: "Jul 25" },
  { id: 3, title: "FP&A Intern", type: "Internship", location: "Lagos, Nigeria", status: "DRAFT", applicants: 0, deadline: "—" },
  { id: 4, title: "Treasury Analyst", type: "Full-time", location: "Lagos, Nigeria", status: "CLOSED", applicants: 31, deadline: "Jun 30" },
];

const JOB_STATUS_STYLE = {
  PUBLISHED: { bg: "#E7F6EC", fg: "#15803D", label: "Published" },
  DRAFT: { bg: "#EEF0F3", fg: NAVY, label: "Draft" },
  CLOSED: { bg: "#FBEAEA", fg: "#B42318", label: "Closed" },
};

const PIPELINE_STAGES = [
  { key: "SUBMITTED", label: "Submitted", candidates: ["Femi A.", "Bassey I."] },
  { key: "VIEWED", label: "Viewed", candidates: ["Amaka O."] },
  { key: "SHORTLISTED", label: "Shortlisted", candidates: ["Chidinma N.", "Grace M."] },
  { key: "INTERVIEW", label: "Interview invited", candidates: ["Tunde E."] },
  { key: "HIRED", label: "Hired", candidates: [] },
];

const MESSAGES = [
  { id: 1, name: "Amaka O.", preview: "Thank you, Tuesday at 10am works well.", time: "1h ago", unread: true },
  { id: 2, name: "Tunde E.", preview: "Happy to share more of my portfolio.", time: "5h ago", unread: true },
  { id: 3, name: "Chidinma N.", preview: "Looking forward to the call.", time: "1d ago", unread: false },
];

const APPLICATIONS_OVER_TIME = [
  { day: "Jun 8", count: 3 }, { day: "Jun 15", count: 6 }, { day: "Jun 22", count: 5 }, { day: "Jun 29", count: 9 }, { day: "Jul 5", count: 12 },
];

const SEARCHES_BY_ROLE = [
  { role: "Analyst", count: 42 }, { role: "Engineer", count: 31 }, { role: "Designer", count: 18 }, { role: "Ops", count: 12 },
];

const NAV_ITEMS = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "search", label: "Search Candidates", icon: Search },
  { key: "saved", label: "Saved Candidates", icon: Bookmark },
  { key: "jobs", label: "Job Postings", icon: Briefcase },
  { key: "pipeline", label: "Pipeline", icon: KanbanSquare },
  { key: "messages", label: "Messages", icon: Mail, badge: 2 },
  { key: "analytics", label: "Analytics", icon: BarChart3 },
  { key: "subscription", label: "Subscription", icon: CreditCard },
];

// ---------------------------------------------------------------------------

function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="rounded-2xl p-5 bg-white border border-gray-100 shadow-sm flex items-center gap-4">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: IVORY }}>
        <Icon size={20} style={{ color: GOLD }} />
      </div>
      <div>
        <div className="font-display text-2xl font-semibold" style={{ color: NAVY }}>{value}</div>
        <div className="text-xs text-gray-500 mt-0.5">{label}</div>
      </div>
    </div>
  );
}

function SectionHeader({ kicker, title, action }) {
  return (
    <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
      <div>
        <div className="font-mono text-xs uppercase tracking-wider mb-1" style={{ color: GOLD }}>{kicker}</div>
        <h2 className="font-display text-2xl font-semibold" style={{ color: NAVY }}>{title}</h2>
      </div>
      {action}
    </div>
  );
}

// ---------------------------------------------------------------------------

function OverviewView() {
  return (
    <div className="space-y-8">
      <div className="rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6" style={{ background: NAVY }}>
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 font-display font-semibold text-xl" style={{ background: GOLD, color: NAVY_DEEP }}>
          NB
        </div>
        <div className="flex-1 text-center md:text-left">
          <div className="font-mono text-xs uppercase tracking-wider mb-1" style={{ color: GOLD_SOFT }}>Verified employer</div>
          <h2 className="font-display text-xl font-semibold text-white">Welcome back, {COMPANY.name}</h2>
          <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.65)" }}>
            You have 23 new applications and 2 unread candidate replies this week.
          </p>
        </div>
        <button className="px-5 py-2.5 rounded-full font-semibold text-sm flex items-center gap-2 flex-shrink-0" style={{ background: GOLD, color: NAVY_DEEP }}>
          <Plus size={16} /> Post a job
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h3 className="font-semibold text-sm mb-4" style={{ color: NAVY }}>Applications received — last 5 weeks</h3>
        <div style={{ width: "100%", height: 200 }}>
          <ResponsiveContainer>
            <AreaChart data={APPLICATIONS_OVER_TIME} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="appGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={GOLD} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={GOLD} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEF0F3" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9AA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9AA3AF" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #EEF0F3", fontSize: 12 }} />
              <Area type="monotone" dataKey="count" stroke={GOLD} strokeWidth={2} fill="url(#appGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function CandidateCard({ candidate, onToggleSave, onInvite, isPremium }) {
  return (
    <div className="rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm flex flex-col">
      <div className="relative aspect-[4/3] flex items-center justify-center" style={{ background: `linear-gradient(135deg, #12294d, ${NAVY})` }}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center font-display font-semibold text-lg" style={{ background: "rgba(255,255,255,0.12)", color: GOLD_SOFT, border: "1px solid rgba(212,175,55,0.3)" }}>
          {candidate.name.split(" ").map((n) => n[0]).join("")}
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity" style={{ background: "rgba(7,20,39,0.35)" }}>
          <div className="w-11 h-11 rounded-full bg-white/90 flex items-center justify-center">
            <Play size={16} style={{ color: NAVY, marginLeft: 2 }} />
          </div>
        </div>
        <span className="absolute bottom-2 right-3 font-mono text-xs text-white/80">{candidate.duration}</span>
        <button
          onClick={() => onToggleSave(candidate.id)}
          className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: "rgba(7,20,39,0.55)" }}
        >
          <Bookmark size={15} fill={candidate.saved ? GOLD : "none"} color={candidate.saved ? GOLD : "white"} />
        </button>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="font-display font-semibold text-base" style={{ color: NAVY }}>{candidate.name}</div>
        <div className="text-xs text-gray-500 mt-0.5">{candidate.role} · {candidate.years} yrs experience</div>
        <div className="flex gap-1.5 flex-wrap mt-3">
          {candidate.skills.map((s) => (
            <span key={s} className="text-xs px-2.5 py-1 rounded-full" style={{ background: GRAY_BG, color: "#5b6572" }}>{s}</span>
          ))}
        </div>
        <div className="text-xs text-gray-400 flex items-center gap-1 mt-3"><MapPin size={12} /> {candidate.location}</div>

        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={() => onInvite(candidate.id)}
            className="flex-1 py-2 rounded-full text-sm font-semibold flex items-center justify-center gap-1.5"
            style={{ background: GOLD, color: NAVY_DEEP }}
          >
            <Send size={14} /> Invite to interview
          </button>
          <button
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 border border-gray-200"
            title={isPremium ? "Download CV" : "Upgrade to download CVs"}
          >
            {isPremium ? <Download size={15} style={{ color: NAVY }} /> : <Lock size={13} style={{ color: "#9AA3AF" }} />}
          </button>
        </div>
      </div>
    </div>
  );
}

function SearchCandidatesView() {
  const [candidates, setCandidates] = useState(CANDIDATES);
  const [invited, setInvited] = useState({});
  const [query, setQuery] = useState("");

  const toggleSave = (id) => setCandidates((prev) => prev.map((c) => (c.id === id ? { ...c, saved: !c.saved } : c)));
  const invite = (id) => setInvited((prev) => ({ ...prev, [id]: true }));

  const filtered = candidates.filter(
    (c) => c.name.toLowerCase().includes(query.toLowerCase()) || c.role.toLowerCase().includes(query.toLowerCase()) || c.skills.some((s) => s.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div>
      <SectionHeader kicker="Watch before you reach out" title="Search candidates" />

      <div className="rounded-2xl border border-gray-100 bg-white p-4 mb-6 flex items-center gap-3 flex-wrap shadow-sm">
        <div className="flex items-center gap-2 flex-1 min-w-[220px] px-3 py-2 rounded-full" style={{ background: GRAY_BG }}>
          <Search size={16} style={{ color: "#9AA3AF" }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, role, or skill"
            className="bg-transparent outline-none text-sm flex-1"
          />
        </div>
        {["Industry", "Location", "Experience", "Salary"].map((f) => (
          <button key={f} className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm border border-gray-200 text-gray-600">
            {f} <ChevronDown size={14} />
          </button>
        ))}
        <button className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold" style={{ background: IVORY, color: GOLD }}>
          <Filter size={14} /> More filters
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((c) => (
          <div key={c.id} className="relative">
            <CandidateCard candidate={c} onToggleSave={toggleSave} onInvite={invite} isPremium={false} />
            {invited[c.id] && (
              <div className="absolute top-3 left-3 text-xs font-semibold px-3 py-1 rounded-full" style={{ background: "#E7F6EC", color: "#15803D" }}>
                Invitation sent
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function SavedCandidatesView() {
  const saved = CANDIDATES.filter((c) => c.saved);
  return (
    <div>
      <SectionHeader kicker="Shortlisted by you" title="Saved candidates" />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {saved.map((c) => (
          <CandidateCard key={c.id} candidate={c} onToggleSave={() => {}} onInvite={() => {}} isPremium={false} />
        ))}
      </div>
    </div>
  );
}

function JobPostingsView() {
  return (
    <div>
      <SectionHeader
        kicker="Your vacancies"
        title="Job postings"
        action={
          <button className="px-5 py-2.5 rounded-full font-semibold text-sm flex items-center gap-2" style={{ background: GOLD, color: NAVY_DEEP }}>
            <Plus size={16} /> Post a job
          </button>
        }
      />
      <div className="space-y-3">
        {JOB_POSTINGS.map((j) => {
          const s = JOB_STATUS_STYLE[j.status];
          return (
            <div key={j.id} className="rounded-xl border border-gray-100 bg-white p-5 flex items-center justify-between gap-4 flex-wrap shadow-sm">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center font-display font-semibold flex-shrink-0" style={{ background: IVORY, color: GOLD }}>
                  <Briefcase size={18} />
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-sm" style={{ color: NAVY }}>{j.title}</div>
                  <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                    {j.type} <span className="mx-1">·</span> <MapPin size={12} /> {j.location} <span className="mx-1">·</span> Deadline {j.deadline}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 flex-shrink-0">
                <span className="text-xs text-gray-500 font-mono">{j.applicants} applicants</span>
                <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: s.bg, color: s.fg }}>{s.label}</span>
                <button className="text-sm font-semibold" style={{ color: GOLD }}>Manage</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PipelineView() {
  return (
    <div>
      <SectionHeader kicker="Where every candidate stands" title="Recruitment pipeline" />
      <div className="flex gap-4 overflow-x-auto pb-2">
        {PIPELINE_STAGES.map((stage) => (
          <div key={stage.key} className="rounded-2xl bg-white border border-gray-100 shadow-sm p-4 w-64 flex-shrink-0">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold" style={{ color: NAVY }}>{stage.label}</h3>
              <span className="text-xs font-mono text-gray-400">{stage.candidates.length}</span>
            </div>
            <div className="space-y-2">
              {stage.candidates.length === 0 && (
                <div className="text-xs text-gray-400 italic py-6 text-center">No candidates yet</div>
              )}
              {stage.candidates.map((name) => (
                <div key={name} className="rounded-lg p-3 flex items-center gap-2" style={{ background: GRAY_BG }}>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center font-display font-semibold text-xs flex-shrink-0" style={{ background: IVORY, color: GOLD }}>
                    {name[0]}
                  </div>
                  <span className="text-sm" style={{ color: NAVY }}>{name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MessagesView() {
  return (
    <div>
      <SectionHeader kicker="Conversations" title="Messages" />
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm divide-y divide-gray-50">
        {MESSAGES.map((m) => (
          <div key={m.id} className="p-5 flex items-center gap-4 hover:bg-gray-50 cursor-pointer">
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-display font-semibold flex-shrink-0" style={{ background: IVORY, color: GOLD }}>
              {m.name[0]}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold truncate" style={{ color: NAVY }}>{m.name}</span>
                <span className="text-xs text-gray-400 flex-shrink-0 font-mono">{m.time}</span>
              </div>
              <p className="text-sm text-gray-500 truncate mt-0.5">{m.preview}</p>
            </div>
            {m.unread && <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: GOLD }} />}
          </div>
        ))}
      </div>
    </div>
  );
}

function AnalyticsView() {
  return (
    <div className="space-y-6">
      <SectionHeader kicker="Recruitment performance" title="Analytics" />
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h3 className="font-semibold text-sm mb-4" style={{ color: NAVY }}>Applications received — last 5 weeks</h3>
        <div style={{ width: "100%", height: 220 }}>
          <ResponsiveContainer>
            <AreaChart data={APPLICATIONS_OVER_TIME} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="appGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={GOLD} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={GOLD} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEF0F3" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9AA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9AA3AF" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #EEF0F3", fontSize: 12 }} />
              <Area type="monotone" dataKey="count" stroke={GOLD} strokeWidth={2} fill="url(#appGrad2)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h3 className="font-semibold text-sm mb-4" style={{ color: NAVY }}>Candidate searches by role</h3>
        <div style={{ width: "100%", height: 200 }}>
          <ResponsiveContainer>
            <BarChart data={SEARCHES_BY_ROLE} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEF0F3" />
              <XAxis dataKey="role" tick={{ fontSize: 11, fill: "#9AA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9AA3AF" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #EEF0F3", fontSize: 12 }} />
              <Bar dataKey="count" fill={NAVY} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function SubscriptionView() {
  return (
    <div>
      <SectionHeader kicker="Your plan" title="Subscription" />
      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl border-2 p-6" style={{ borderColor: GOLD, background: IVORY }}>
          <div className="font-mono text-xs uppercase tracking-wider mb-2" style={{ color: GOLD }}>Current plan</div>
          <div className="font-display text-xl font-semibold mb-4" style={{ color: NAVY }}>Free</div>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>Limited candidate searches per month</li>
            <li>Limited CV downloads</li>
            <li>Standard support</li>
          </ul>
        </div>
        <div className="rounded-2xl p-6 text-white" style={{ background: NAVY }}>
          <div className="font-mono text-xs uppercase tracking-wider mb-2" style={{ color: GOLD_SOFT }}>Recommended</div>
          <div className="font-display text-xl font-semibold mb-1">Employer Premium</div>
          <div className="font-mono text-2xl font-semibold mb-4">₦45,000<span className="text-sm font-normal opacity-60"> /mo</span></div>
          <ul className="space-y-2 text-sm mb-6" style={{ color: "rgba(255,255,255,0.75)" }}>
            <li>Unlimited candidate searches</li>
            <li>Unlimited CV downloads</li>
            <li>Advanced search filters</li>
            <li>Featured company placement</li>
            <li>Priority support</li>
          </ul>
          <button className="w-full py-2.5 rounded-full font-semibold text-sm" style={{ background: GOLD, color: NAVY_DEEP }}>
            Upgrade to Premium
          </button>
        </div>
      </div>
    </div>
  );
}

const VIEWS = {
  overview: OverviewView,
  search: SearchCandidatesView,
  saved: SavedCandidatesView,
  jobs: JobPostingsView,
  pipeline: PipelineView,
  messages: MessagesView,
  analytics: AnalyticsView,
  subscription: SubscriptionView,
};

export default function EmployerDashboard() {
  const [active, setActive] = useState("overview");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const ActiveView = VIEWS[active];

  useEffect(() => {
    setMobileNavOpen(false);
  }, [active]);

  return (
    <div className="min-h-screen font-body" style={{ background: GRAY_BG }}>
      {FONTS}

      <div className="md:hidden flex items-center justify-between px-4 py-3 sticky top-0 z-30" style={{ background: NAVY }}>
        <div className="flex items-center gap-2 text-white font-display font-semibold">
          <Building2 size={20} style={{ color: GOLD }} />
          {COMPANY.name}
        </div>
        <button onClick={() => setMobileNavOpen((v) => !v)} className="text-white">
          {mobileNavOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <div className="flex">
        <aside
          className={`
            fixed md:static top-[52px] md:top-0 left-0 h-[calc(100vh-52px)] md:h-screen w-64 flex-shrink-0
            flex flex-col z-20 transition-transform duration-200
            ${mobileNavOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
          `}
          style={{ background: NAVY }}
        >
          <div className="hidden md:flex items-center gap-2 px-6 py-6 text-white font-display font-semibold text-lg">
            <Building2 size={20} style={{ color: GOLD }} />
            {COMPANY.name}
          </div>

          <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = active === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => setActive(item.key)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
                  style={{
                    background: isActive ? "rgba(212,175,55,0.14)" : "transparent",
                    color: isActive ? GOLD_SOFT : "rgba(255,255,255,0.65)",
                  }}
                >
                  <Icon size={17} />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge ? (
                    <span className="text-xs font-semibold w-5 h-5 rounded-full flex items-center justify-center" style={{ background: GOLD, color: NAVY_DEEP }}>
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>

          <div className="px-4 py-5 mx-3 mb-4 rounded-xl flex items-center gap-3" style={{ background: "rgba(255,255,255,0.06)" }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center font-display font-semibold flex-shrink-0" style={{ background: GOLD, color: NAVY_DEEP }}>
              NB
            </div>
            <div className="min-w-0">
              <div className="text-white text-sm font-medium truncate">{COMPANY.name}</div>
              <div className="text-xs truncate" style={{ color: "rgba(255,255,255,0.5)" }}>Free plan</div>
            </div>
          </div>
        </aside>

        {mobileNavOpen && <div className="fixed inset-0 bg-black/30 z-10 md:hidden" onClick={() => setMobileNavOpen(false)} />}

        <main className="flex-1 min-w-0 p-5 md:p-10">
          <ActiveView />
        </main>
      </div>
    </div>
  );
}
