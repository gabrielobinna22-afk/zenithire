'use client';

import React, { useState } from "react";
import {
  Mail,
  Lock,
  User,
  Building2,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";

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

function Field({ icon: Icon, label, type = "text", value, onChange, placeholder, rightSlot, error }) {
  return (
    <label className="block">
      <span className="text-sm font-medium mb-1.5 block" style={{ color: NAVY }}>{label}</span>
      <div
        className="flex items-center gap-2.5 rounded-xl border px-4 py-3 transition-colors"
        style={{ borderColor: error ? "#D92D20" : "rgba(11,31,58,0.14)", background: "white" }}
      >
        <Icon size={16} className="text-gray-400 flex-shrink-0" />
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="flex-1 outline-none text-sm bg-transparent"
          style={{ color: NAVY }}
        />
        {rightSlot}
      </div>
      {error && <span className="text-xs mt-1 block" style={{ color: "#D92D20" }}>{error}</span>}
    </label>
  );
}

function RoleToggle({ role, setRole }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {[
        { key: "CANDIDATE", label: "I'm looking for work", icon: User },
        { key: "EMPLOYER", label: "I'm hiring", icon: Building2 },
      ].map((opt) => {
        const Icon = opt.icon;
        const active = role === opt.key;
        return (
          <button
            key={opt.key}
            type="button"
            onClick={() => setRole(opt.key)}
            className="flex flex-col items-center gap-2 rounded-xl border-2 px-4 py-4 text-center transition-colors"
            style={{
              borderColor: active ? GOLD : "rgba(11,31,58,0.12)",
              background: active ? IVORY : "white",
            }}
          >
            <Icon size={20} style={{ color: active ? GOLD : "#9AA3AF" }} />
            <span className="text-sm font-semibold" style={{ color: active ? NAVY : "#6B7280" }}>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function Brand({ tagline }) {
  return (
    <div className="hidden lg:flex flex-col justify-between p-12 text-white relative overflow-hidden" style={{ background: NAVY, minHeight: "100%" }}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(600px 400px at 85% -10%, rgba(212,175,55,0.16), transparent 60%), radial-gradient(500px 500px at -10% 110%, rgba(212,175,55,0.10), transparent 60%)",
        }}
      />
      <div className="relative flex items-center gap-2 font-display font-semibold text-lg">
        <span className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: GOLD }}>
          <span className="w-4 h-4 rounded-full" style={{ background: NAVY }} />
        </span>
        Zenithire
      </div>
      <div className="relative">
        <h1 className="font-display text-4xl font-semibold leading-tight max-w-sm">
          Your career begins with <em className="italic" style={{ color: GOLD_SOFT }}>one minute.</em>
        </h1>
        <p className="mt-4 text-sm max-w-sm" style={{ color: "rgba(255,255,255,0.65)" }}>{tagline}</p>
      </div>
      <div className="relative flex gap-8 text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
        <span className="font-mono">42,600+ videos</span>
        <span className="font-mono">3,150 employers</span>
      </div>
    </div>
  );
}

function LoginView({ goTo }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full max-w-sm mx-auto">
      <h2 className="font-display text-2xl font-semibold" style={{ color: NAVY }}>Welcome back</h2>
      <p className="text-sm text-gray-500 mt-1.5 mb-8">Log in to continue to your dashboard.</p>

      <div className="space-y-4">
        <Field icon={Mail} label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        <Field
          icon={Lock}
          label="Password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          rightSlot={
            <button type="button" onClick={() => setShowPassword((v) => !v)} className="text-gray-400 flex-shrink-0">
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
        />
        <div className="flex justify-end">
          <button onClick={() => goTo("forgot")} className="text-xs font-semibold" style={{ color: GOLD }}>
            Forgot password?
          </button>
        </div>
        <button
          className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 mt-2"
          style={{ background: GOLD, color: NAVY_DEEP }}
        >
          Log in <ArrowRight size={16} />
        </button>
      </div>

      <p className="text-sm text-gray-500 text-center mt-8">
        New to Zenithire?{" "}
        <button onClick={() => goTo("register")} className="font-semibold" style={{ color: NAVY }}>
          Create an account
        </button>
      </p>
    </div>
  );
}

function RegisterView({ goTo }) {
  const [role, setRole] = useState("CANDIDATE");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const passwordTooShort = password.length > 0 && password.length < 8;

  return (
    <div className="w-full max-w-sm mx-auto">
      <h2 className="font-display text-2xl font-semibold" style={{ color: NAVY }}>Create your account</h2>
      <p className="text-sm text-gray-500 mt-1.5 mb-6">Takes about a minute. Fitting, really.</p>

      <div className="mb-5">
        <RoleToggle role={role} setRole={setRole} />
      </div>

      <div className="space-y-4">
        <Field icon={User} label="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Amaka Obi" />
        <Field icon={Mail} label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        <Field
          icon={Lock}
          label="Password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 8 characters"
          error={passwordTooShort ? "Password must be at least 8 characters" : undefined}
          rightSlot={
            <button type="button" onClick={() => setShowPassword((v) => !v)} className="text-gray-400 flex-shrink-0">
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
        />
        <button
          className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 mt-2"
          style={{ background: GOLD, color: NAVY_DEEP }}
        >
          {role === "CANDIDATE" ? "Get Hired" : "Find Talent"} <ArrowRight size={16} />
        </button>
      </div>

      <p className="text-xs text-gray-400 text-center mt-5">
        By continuing you agree to our Terms of Service and Privacy Policy.
      </p>

      <p className="text-sm text-gray-500 text-center mt-6">
        Already have an account?{" "}
        <button onClick={() => goTo("login")} className="font-semibold" style={{ color: NAVY }}>
          Log in
        </button>
      </p>
    </div>
  );
}

function ForgotPasswordView({ goTo }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="w-full max-w-sm mx-auto text-center">
        <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: IVORY }}>
          <CheckCircle2 size={26} style={{ color: GOLD }} />
        </div>
        <h2 className="font-display text-2xl font-semibold" style={{ color: NAVY }}>Check your email</h2>
        <p className="text-sm text-gray-500 mt-2">
          If an account exists for <span className="font-medium" style={{ color: NAVY }}>{email}</span>, a reset link is on its way.
        </p>
        <button onClick={() => goTo("login")} className="mt-8 text-sm font-semibold flex items-center gap-1.5 mx-auto" style={{ color: NAVY }}>
          <ArrowLeft size={14} /> Back to login
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <button onClick={() => goTo("login")} className="flex items-center gap-1.5 text-sm text-gray-500 mb-6">
        <ArrowLeft size={14} /> Back
      </button>
      <h2 className="font-display text-2xl font-semibold" style={{ color: NAVY }}>Reset your password</h2>
      <p className="text-sm text-gray-500 mt-1.5 mb-8">We'll send a reset link to your email.</p>

      <div className="space-y-4">
        <Field icon={Mail} label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        <button
          onClick={() => email && setSent(true)}
          className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 mt-2"
          style={{ background: GOLD, color: NAVY_DEEP }}
        >
          Send reset link
        </button>
      </div>
    </div>
  );
}

const TAGLINES = {
  login: "Employers are watching videos and sending invitations while you're away. Log back in.",
  register: "Job seekers create a profile, upload a CV, and record a 60-second introduction. Employers browse candidates by watching before they reach out.",
  forgot: "We'll get you back in — no drama, just a link in your inbox.",
};

export default function AuthScreens() {
  const [view, setView] = useState("login"); // 'login' | 'register' | 'forgot'

  const Views = { login: LoginView, register: RegisterView, forgot: ForgotPasswordView };
  const ActiveView = Views[view];

  return (
    <div className="min-h-screen font-body grid lg:grid-cols-2" style={{ background: GRAY_BG }}>
      {FONTS}
      <Brand tagline={TAGLINES[view]} />
      <div className="flex items-center justify-center p-8 lg:p-12">
        <ActiveView goTo={setView} />
      </div>
    </div>
  );
}
