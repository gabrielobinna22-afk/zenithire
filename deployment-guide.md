'use client';

import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Briefcase,
  Bookmark,
  Mail,
  Bell,
  CreditCard,
  BarChart3,
  Video,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight,
  Play,
  Menu,
  X,
  MapPin,
  Eye,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
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
// Mock data — stands in for the real API responses this dashboard consumes:
// GET /candidates/me, /applications, /saved-jobs, /invitations, /messages,
// /notifications, /subscriptions/me, /candidates/me/analytics
// ---------------------------------------------------------------------------

const PROFILE = {
  name: "Amaka Obi",
  headline: "Financial Analyst · 5 yrs experience",
  completion: 82,
  video: { status: "APPROVED", duration: "0:58" },
  plan: "FREE",
};

const STATS = [
  { label: "Applications", value: 14, icon: Briefcase },
  { label: "Saved jobs", value: 9, icon: Bookmark },
  { label: "Profile views", value: 238, icon: Eye },
  { label: "Unread messages", value: 3, icon: Mail },
];

const APPLICATIONS = [
  { id: 1, title: "Commercial Analyst", company: "Northbridge Capital", location: "Lagos, Nigeria", status: "SHORTLISTED", date: "Jul 2" },
  { id: 2, title: "Backend Engineer (Node.js)", company: "Northbridge Capital", location: "Abuja, Nigeria", status: "VIEWED", date: "Jun 29" },
  { id: 3, title: "Senior Product Designer", company: "Arclight Studio", location: "Remote", status: "SUBMITTED", date: "Jun 27" },
  { id: 4, title: "Operations Associate", company: "Pivot Logistics", location: "Port Harcourt, Nigeria", status: "REJECTED", date: "Jun 20" },
  { id: 5, title: "FP&A Lead", company: "Northbridge Capital", location: "Lagos, Nigeria", status: "HIRED", date: "Jun 10" },
];

const STATUS_STYLE = {
  SUBMITTED: { bg: "#EEF0F3", fg: NAVY, label: "Submitted" },
  VIEWED: { bg: "#EAF2FE", fg: "#1D4ED8", label: "Viewed" },
  SHORTLISTED: { bg: "#FBF3DC", fg: "#92720C", label: "Shortlisted" },
  REJECTED: { bg: "#FBEAEA", fg: "#B42318", label: "Not selected" },
  HIRED: { bg: "#E7F6EC", fg: "#15803D", label: "Hired" },
};

const SAVED_JOBS = [
  { id: 1, title: "Treasury Analyst", company: "Northbridge Capital", location: "Lagos, Nigeria", salary: "₦500k–₦700k /mo", type: "Full-time" },
  { id: 2, title: "Supply Chain Planner", company: "Pivot Logistics", location: "Port Harcourt, Nigeria", salary: "₦400k–₦550k /mo", type: "Full-time" },
  { id: 3, title: "Product Analyst", company: "Arclight Studio", location: "Remote", salary: "$1,800–$2,400 /mo", type: "Contract" },
];

const INVITATIONS = [
  { id: 1, employer: "Northbridge Capital", role: "Commercial Analyst", message: "We'd love to talk through your FP&A background — are you free this week?", proposed: "Jul 8, 10:00 AM", status: "PENDING" },
  { id: 2, employer: "Arclight Studio", role: "Senior Product Designer", message: "Loved your intro video. Could we set up a first call?", proposed: "Jul 9, 2:00 PM", status: "PENDING" },
];

const MESSAGES = [
  { id: 1, name: "Sade K. — Northbridge Capital", preview: "Great, see you at 10am on Tuesday then.", time: "2h ago", unread: true },
  { id: 2, name: "Ifeoma A. — Arclight Studio", preview: "Thanks for sending your portfolio over!", time: "1d ago", unread: true },
  { id: 3, name: "Northbridge Capital — Recruiting", preview: "We've moved your application to the next stage.", time: "3d ago", unread: false },
];

const NOTIFICATIONS = [
  { id: 1, type: "INTERVIEW_INVITE", text: "Arclight Studio invited you to interview for Senior Product Designer", time: "1h ago" },
  { id: 2, type: "PROFILE_VIEW", text: "Your profile was viewed 12 times this week", time: "6h ago" },
  { id: 3, type: "APPLICATION_UPDATE", text: "Northbridge Capital moved you to Shortlisted", time: "1d ago" },
  { id: 4, type: "VIDEO_APPROVED", text: "Your introduction video was approved", time: "4d ago" },
];

const VIEWS_OVER_TIME = [
  { day: "Jun 8", views: 4 }, { day: "Jun 12", views: 7 }, { day: "Jun 16", views: 5 },
  { day: "Jun 20", views: 11 }, { day: "Jun 24", views: 9 }, { day: "Jun 28", views: 16 },
  { day: "Jul 2", views: 22 }, { day: "Jul 5", views: 18 },
];

const APPLICATIONS_PER_WEEK = [
  { week: "Wk 1", count: 2 }, { week: "Wk 2", count: 4 }, { week: "Wk 3", count: 3 }, { week: "Wk 4", count: 5 },
];

const NAV_ITEMS = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "applications", label: "Applications", icon: Briefcase },
  { key: "saved", label: "Saved Jobs", icon: Bookmark },
  { key: "invitations", label: "Invitations", icon: Video, badge: 2 },
  { key: "messages", label: "Messages", icon: Mail, badge: 2 },
  { key: "analytics", label: "Analytics", icon: BarChart3 },
  { key: "subscription", label: "Subscription", icon: CreditCard },
  { key: "notifications", label: "Notifications", icon: Bell },
];

// ---------------------------------------------------------------------------

function CompletionRing({ percent }) {
  const angle = Math.round((percent / 100) * 360);
  return (
    <div
      className="relative w-24 h-24 rounded-full flex items-center justify-center flex-shrink-0"
      style={{ background: `conic-gradient(${GOLD} ${angle}deg, rgba(212,175,55,0.15) 0deg)` }}
    >
      <div
        className="absolute rounded-full flex flex-col items-center justify-center"
        style={{ inset: 8, background: NAVY }}
      >
        <span className="font-mono text-lg font-semibold" style={{ color: GOLD_SOFT }}>{percent}%</span>
      </div>
    </div>
  );
}

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

function StatusBadge({ status }) {
  const s = STATUS_STYLE[status];
  return (
    <span
      className="text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap"
      style={{ background: s.bg, color: s.fg }}
    >
      {s.label}
    </span>
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
        <CompletionRing percent={PROFILE.completion} />
        <div className="flex-1 text-center md:text-left">
          <div className="font-mono text-xs uppercase tracking-wider mb-1" style={{ color: GOLD_SOFT }}>Profile strength</div>
          <h2 className="font-display text-xl font-semibold text-white">Your profile is {PROFILE.completion}% complete</h2>
          <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.65)" }}>
            Add a certification and your preferred locations to reach 100% and improve your search ranking.
          </p>
        </div>
        <button
          className="px-5 py-2.5 rounded-full font-semibold text-sm flex items-center gap-2 flex-shrink-0"
          style={{ background: GOLD, color: NAVY_DEEP }}
        >
          Complete profile <ChevronRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl p-6 bg-white border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-lg" style={{ color: NAVY }}>Introduction video</h3>
            <CheckCircle2 size={18} style={{ color: "#15803D" }} />
          </div>
          <div className="rounded-xl aspect-video flex items-center justify-center relative overflow-hidden" style={{ background: `linear-gradient(135deg, #12294d, ${NAVY})` }}>
            <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: GOLD }}>
              <Play size={20} style={{ color: NAVY_DEEP, marginLeft: 2 }} />
            </div>
            <span className="absolute bottom-2 right-3 font-mono text-xs text-white/80">{PROFILE.video.duration}</span>
          </div>
          <p className="text-xs text-gray-500 mt-3">Approved and visible to employers. You can replace it anytime.</p>
          <button className="mt-3 text-sm font-semibold" style={{ color: GOLD }}>Replace video</button>
        </div>

        <div className="rounded-2xl p-6 bg-white border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-lg" style={{ color: NAVY }}>Pending invitations</h3>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: IVORY, color: GOLD }}>
              {INVITATIONS.length} new
            </span>
          </div>
          <div className="space-y-3">
            {INVITATIONS.map((i) => (
              <div key={i.id} className="flex items-start gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                <div className="w-9 h-9 rounded-full flex items-center justify-center font-display font-semibold text-sm flex-shrink-0" style={{ background: IVORY, color: GOLD }}>
                  {i.employer[0]}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold truncate" style={{ color: NAVY }}>{i.role}</div>
                  <div className="text-xs text-gray-500">{i.employer} · proposed {i.proposed}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ApplicationsView() {
  return (
    <div>
      <SectionHeader kicker="Track your pipeline" title="Applications" />
      <div className="space-y-3">
        {APPLICATIONS.map((a) => (
          <div key={a.id} className="rounded-xl border border-gray-100 bg-white p-5 flex items-center justify-between gap-4 flex-wrap shadow-sm">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center font-display font-semibold flex-shrink-0" style={{ background: IVORY, color: GOLD }}>
                {a.company[0]}
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-sm" style={{ color: NAVY }}>{a.title}</div>
                <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                  {a.company} <span className="mx-1">·</span> <MapPin size={12} /> {a.location}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 flex-shrink-0">
              <span className="text-xs text-gray-400 font-mono">{a.date}</span>
              <StatusBadge status={a.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SavedJobsView() {
  return (
    <div>
      <SectionHeader kicker="For later" title="Saved jobs" />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {SAVED_JOBS.map((j) => (
          <div key={j.id} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center font-display font-semibold flex-shrink-0" style={{ background: NAVY, color: GOLD_SOFT }}>
                {j.company[0]}
              </div>
              <div>
                <div className="font-semibold text-sm" style={{ color: NAVY }}>{j.title}</div>
                <div className="text-xs text-gray-500">{j.company}</div>
              </div>
            </div>
            <div className="text-xs text-gray-500 flex items-center gap-1 mb-1"><MapPin size={12} /> {j.location}</div>
            <div className="font-mono text-xs mb-4" style={{ color: NAVY }}>{j.salary}</div>
            <div className="mt-auto flex items-center justify-between">
              <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: GRAY_BG, color: "#5b6572" }}>{j.type}</span>
              <button className="text-sm font-semibold" style={{ color: GOLD }}>Apply</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function InvitationsView() {
  const [items, setItems] = useState(INVITATIONS);

  const respond = (id, status) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
  };

  return (
    <div>
      <SectionHeader
        kicker="Employer contact stays private until you say yes"
        title="Interview invitations"
      />
      <div className="space-y-4">
        {items.map((i) => (
          <div key={i.id} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-full flex items-center justify-center font-display font-semibold flex-shrink-0" style={{ background: IVORY, color: GOLD }}>
                  {i.employer[0]}
                </div>
                <div>
                  <div className="font-semibold text-sm" style={{ color: NAVY }}>{i.role}</div>
                  <div className="text-xs text-gray-500 mb-2">{i.employer}</div>
                  <p className="text-sm text-gray-600 max-w-md">{i.message}</p>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-2 font-mono">
                    <Clock size={12} /> Proposed: {i.proposed}
                  </div>
                </div>
              </div>

              {i.status === "PENDING" ? (
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => respond(i.id, "DECLINED")}
                    className="px-4 py-2 rounded-full text-sm font-semibold border border-gray-200 text-gray-500 hover:bg-gray-50"
                  >
                    Decline
                  </button>
                  <button
                    onClick={() => respond(i.id, "ACCEPTED")}
                    className="px-4 py-2 rounded-full text-sm font-semibold"
                    style={{ background: GOLD, color: NAVY_DEEP }}
                  >
                    Accept
                  </button>
                </div>
              ) : (
                <span
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full flex-shrink-0"
                  style={
                    i.status === "ACCEPTED"
                      ? { background: "#E7F6EC", color: "#15803D" }
                      : { background: "#FBEAEA", color: "#B42318" }
                  }
                >
                  {i.status === "ACCEPTED" ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                  {i.status === "ACCEPTED" ? "Accepted — contact details shared" : "Declined"}
                </span>
              )}
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
      <SectionHeader kicker="Premium feature" title="Profile analytics" />
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={16} style={{ color: GOLD }} />
          <h3 className="font-semibold text-sm" style={{ color: NAVY }}>Profile views — last 30 days</h3>
        </div>
        <div style={{ width: "100%", height: 220 }}>
          <ResponsiveContainer>
            <AreaChart data={VIEWS_OVER_TIME} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={GOLD} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={GOLD} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEF0F3" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9AA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9AA3AF" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #EEF0F3", fontSize: 12 }} />
              <Area type="monotone" dataKey="views" stroke={GOLD} strokeWidth={2} fill="url(#viewsGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h3 className="font-semibold text-sm mb-4" style={{ color: NAVY }}>Applications per week</h3>
        <div style={{ width: "100%", height: 200 }}>
          <ResponsiveContainer>
            <BarChart data={APPLICATIONS_PER_WEEK} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEF0F3" />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#9AA3AF" }} axisLine={false} tickLine={false} />
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
            <li>Full profile with CV and video</li>
            <li>Apply to unlimited jobs</li>
            <li>Standard search ranking</li>
          </ul>
        </div>
        <div className="rounded-2xl p-6 text-white" style={{ background: NAVY }}>
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider mb-2" style={{ color: GOLD_SOFT }}>
            <Sparkles size={14} /> Recommended
          </div>
          <div className="font-display text-xl font-semibold mb-1">Candidate Premium</div>
          <div className="font-mono text-2xl font-semibold mb-4">₦3,500<span className="text-sm font-normal opacity-60"> /mo</span></div>
          <ul className="space-y-2 text-sm mb-6" style={{ color: "rgba(255,255,255,0.75)" }}>
            <li>Featured profile placement</li>
            <li>Priority search ranking</li>
            <li>Full profile view analytics</li>
            <li>Featured badge on your card</li>
          </ul>
          <button className="w-full py-2.5 rounded-full font-semibold text-sm" style={{ background: GOLD, color: NAVY_DEEP }}>
            Upgrade to Premium
          </button>
        </div>
      </div>
    </div>
  );
}

function NotificationsView() {
  return (
    <div>
      <SectionHeader kicker="Stay in the loop" title="Notifications" />
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm divide-y divide-gray-50">
        {NOTIFICATIONS.map((n) => (
          <div key={n.id} className="p-5 flex items-start gap-4">
            <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: IVORY }}>
              <Bell size={15} style={{ color: GOLD }} />
            </div>
            <div className="min-w-0">
              <p className="text-sm" style={{ color: NAVY }}>{n.text}</p>
              <span className="text-xs text-gray-400 font-mono">{n.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const VIEWS = {
  overview: OverviewView,
  applications: ApplicationsView,
  saved: SavedJobsView,
  invitations: InvitationsView,
  messages: MessagesView,
  analytics: AnalyticsView,
  subscription: SubscriptionView,
  notifications: NotificationsView,
};

export default function CandidateDashboard() {
  const [active, setActive] = useState("overview");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const ActiveView = VIEWS[active];

  useEffect(() => {
    setMobileNavOpen(false);
  }, [active]);

  return (
    <div className="min-h-screen font-body" style={{ background: GRAY_BG }}>
      {FONTS}

      {/* Mobile top bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 sticky top-0 z-30" style={{ background: NAVY }}>
        <div className="flex items-center gap-2 text-white font-display font-semibold">
          <span className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: GOLD }}>
            <span className="w-3.5 h-3.5 rounded-full" style={{ background: NAVY }} />
          </span>
          Zenithire
        </div>
        <button onClick={() => setMobileNavOpen((v) => !v)} className="text-white">
          {mobileNavOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
            fixed md:static top-[52px] md:top-0 left-0 h-[calc(100vh-52px)] md:h-screen w-64 flex-shrink-0
            flex flex-col z-20 transition-transform duration-200
            ${mobileNavOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
          `}
          style={{ background: NAVY }}
        >
          <div className="hidden md:flex items-center gap-2 px-6 py-6 text-white font-display font-semibold text-lg">
            <span className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: GOLD }}>
              <span className="w-4 h-4 rounded-full" style={{ background: NAVY }} />
            </span>
            Zenithire
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
                    <span
                      className="text-xs font-semibold w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ background: GOLD, color: NAVY_DEEP }}
                    >
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>

          <div className="px-4 py-5 mx-3 mb-4 rounded-xl flex items-center gap-3" style={{ background: "rgba(255,255,255,0.06)" }}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center font-display font-semibold flex-shrink-0" style={{ background: GOLD, color: NAVY_DEEP }}>
              A
            </div>
            <div className="min-w-0">
              <div className="text-white text-sm font-medium truncate">{PROFILE.name}</div>
              <div className="text-xs truncate" style={{ color: "rgba(255,255,255,0.5)" }}>{PROFILE.headline}</div>
            </div>
          </div>
        </aside>

        {mobileNavOpen && (
          <div className="fixed inset-0 bg-black/30 z-10 md:hidden" onClick={() => setMobileNavOpen(false)} />
        )}

        {/* Main content */}
        <main className="flex-1 min-w-0 p-5 md:p-10">
          <ActiveView />
        </main>
      </div>
    </div>
  );
}
