import React, { useState } from 'react';
import {
  Shield,
  ShieldCheck,
  Cpu,
  Lock,
  ArrowRight,
  User,
  Phone,
  Mail,
  Zap,
  Battery,
  Play,
  Sun,
  Moon,
  CheckCircle2,
} from 'lucide-react';
import { OperatorRole } from '../hooks/useFirebaseAuth';

interface LoginScreenProps {
  onOperatorLogin: (name: string, mobileNumber: string, gmail: string, role: OperatorRole) => Promise<any>;
  onSignInWithGoogle?: (role: OperatorRole) => Promise<any>;
  firestoreConnected?: boolean;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onOperatorLogin,
  onSignInWithGoogle,
  firestoreConnected = true,
  theme = 'light',
  onToggleTheme,
}) => {
  const [fullName, setFullName] = useState('Stan Hristov');
  const [mobileNumber, setMobileNumber] = useState('+1 (555) 382-9014');
  const [gmail, setGmail] = useState('stan.hristov@gmail.com');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [localTheme, setLocalTheme] = useState<'light' | 'dark'>(theme);

  const activeTheme = onToggleTheme ? theme : localTheme;
  const toggleTheme = () => {
    if (onToggleTheme) {
      onToggleTheme();
    } else {
      setLocalTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    }
  };

  const isDark = activeTheme === 'dark';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMessage('Please enter your operator full name.');
      return;
    }
    if (!mobileNumber.trim()) {
      setErrorMessage('Please enter your mobile phone number.');
      return;
    }
    if (!gmail.trim() || !gmail.includes('@')) {
      setErrorMessage('Please enter a valid Gmail / Google email address.');
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      await onOperatorLogin(fullName, mobileNumber, gmail, 'ADMIN');
    } catch (err: any) {
      setErrorMessage(err?.message || 'Authorization encountered an error.');
      setIsSubmitting(false);
    }
  };

  const handleQuickFill = (name: string, phone: string, email: string) => {
    setFullName(name);
    setMobileNumber(phone);
    setGmail(email);
  };

  return (
    <div
      className={`min-h-screen font-sans relative overflow-hidden transition-colors duration-300 ${
        isDark
          ? 'bg-gradient-to-b from-[#030805] via-[#05140b] to-[#020503] text-slate-100 selection:bg-[#10b981] selection:text-[#041c11]'
          : 'bg-gradient-to-b from-[#ffffff] via-[#f1faf4] to-[#dbf3e4] text-slate-800 selection:bg-[#052e16] selection:text-white'
      }`}
    >
      {/* Silky Emerald Radiant Aura from image.png */}
      <div
        className={`absolute top-[200px] left-1/2 -translate-x-1/2 w-[1300px] h-[800px] rounded-full filter blur-[140px] pointer-events-none -z-10 transition-opacity duration-300 ${
          isDark
            ? 'bg-gradient-to-b from-[#10b981]/20 via-[#052e16]/35 to-transparent'
            : 'bg-gradient-to-b from-[#4ade80]/35 via-[#22c55e]/30 to-transparent'
        }`}
      />
      <div
        className={`absolute top-[440px] left-1/2 -translate-x-1/2 w-[850px] h-[550px] rounded-full filter blur-[100px] pointer-events-none -z-10 transition-opacity duration-300 ${
          isDark ? 'bg-[#22c55e]/15' : 'bg-[#10b981]/25'
        }`}
      />

      {/* TOP MASTHEAD (Exact structure from image.png: "Meet TrustGate.") */}
      <header className="max-w-7xl mx-auto px-6 lg:px-12 pt-10 pb-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
          {/* Left Title: "Meet TrustGate." */}
          <div>
            <span
              className={`text-3xl lg:text-4xl font-light block tracking-tight ${
                isDark ? 'text-emerald-400/80' : 'text-slate-400'
              }`}
            >
              Meet
            </span>
            <h1
              className={`text-6xl sm:text-7xl lg:text-8xl font-black tracking-tighter -mt-1 ${
                isDark ? 'text-white' : 'text-[#021a0f]'
              }`}
            >
              TrustGate<span className="text-[#10b981]">.</span>
            </h1>
          </div>

          {/* Right: Meta Information Table & Device Silhouette (from image.png) + Theme Toggle */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 self-start lg:self-center">
            {/* Metadata Table */}
            <div
              className={`grid grid-cols-4 gap-6 text-left border-r pr-6 ${
                isDark ? 'border-slate-800' : 'border-slate-200'
              }`}
            >
              <div>
                <span className="text-[11px] text-slate-400 block uppercase font-medium">Brand</span>
                <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-[#052014]'}`}>TrustGate</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block uppercase font-medium">Year</span>
                <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-[#052014]'}`}>2026</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block uppercase font-medium">Type</span>
                <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-[#052014]'}`}>Zero-Trust AI</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block uppercase font-medium">Designed by</span>
                <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-[#052014]'}`}>TrustGate Labs</span>
              </div>
            </div>

            {/* Black Hardware Device Mockup with Green Glowing LED Array (from image.png) */}
            <div className="w-52 h-15 rounded-2xl bg-gradient-to-b from-[#181d24] via-[#0f1318] to-[#080a0c] border border-slate-800 shadow-2xl p-2.5 flex items-center justify-between px-4">
              <div className="flex items-center space-x-2 text-slate-600 font-mono text-xs">
                <span>&lt;</span>
                <span>&gt;</span>
              </div>
              {/* Green Glowing LED Status Array */}
              <div className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] shadow-[0_0_8px_#22c55e]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] shadow-[0_0_8px_#22c55e]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] shadow-[0_0_8px_#22c55e]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] shadow-[0_0_8px_#22c55e]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] shadow-[0_0_8px_#22c55e]" />
              </div>
            </div>

            {/* Light / Dark Mode Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`px-3.5 py-2.5 rounded-2xl border shadow-xs transition-all cursor-pointer flex items-center space-x-2 ${
                isDark
                  ? 'bg-[#0e2017] hover:bg-[#142c20] text-emerald-300 border-emerald-800/60'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
              }`}
              title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            >
              {isDark ? (
                <>
                  <Sun className="w-4 h-4 text-amber-300" />
                  <span className="text-xs font-bold">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-slate-700" />
                  <span className="text-xs font-bold">Dark</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Pull Quote & Tag Pills (from image.png) */}
        <div
          className={`mt-8 pt-6 border-t flex flex-col lg:flex-row lg:items-center justify-between gap-6 ${
            isDark ? 'border-slate-800/80' : 'border-slate-200/80'
          }`}
        >
          <div className="max-w-xl">
            <p className={`text-xl sm:text-2xl leading-snug font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              &ldquo;<strong className={isDark ? 'text-white' : 'text-[#021a0f]'}>Most forensic security apps</strong> are built for cryptographers. <strong className={isDark ? 'text-white' : 'text-[#021a0f]'}>This one</strong> had to work for frontline enterprise and banking officers.&rdquo;
            </p>
            <div className="flex items-center space-x-3 mt-4">
              <div className="w-10 h-10 rounded-full bg-[#052e16] text-[#22c55e] flex items-center justify-center font-bold text-sm border-2 border-emerald-400/40 shadow-sm">
                SH
              </div>
              <div>
                <span className={`font-bold text-xs block ${isDark ? 'text-white' : 'text-[#052014]'}`}>
                  Stan Hristov
                </span>
                <span className="text-[11px] text-slate-400 block font-medium">
                  Creative & Security Director
                </span>
              </div>
            </div>
          </div>

          {/* Pill Tags (from image.png) */}
          <div className="flex flex-wrap items-center gap-2 max-w-md lg:justify-end">
            {['ZERO-TRUST', 'PIXEL ELA', 'ARITHMETIC AUDIT', 'FIPS 140-3', 'DCT DEEPFAKE', 'KYBER-1024'].map((tag) => (
              <span
                key={tag}
                className={`px-4 py-1.5 rounded-full border text-xs font-semibold shadow-xs transition-colors ${
                  isDark
                    ? 'bg-[#0a1b12]/80 border-emerald-900/60 text-emerald-300 hover:border-emerald-500'
                    : 'bg-white/90 border-slate-200 text-slate-600 hover:border-[#10b981]'
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* CENTERPIECE: Floating Hardware Squircle with Glowing Green Emblem (from image.png) */}
      <section className="relative max-w-7xl mx-auto px-6 lg:px-12 py-6 flex flex-col items-center">
        {/* Device Label Pill */}
        <div
          className={`inline-flex items-center space-x-2 px-4 py-1.5 rounded-full text-xs shadow-sm backdrop-blur-md mb-6 border ${
            isDark
              ? 'bg-[#0d1f15]/80 border-emerald-800/60 text-emerald-300'
              : 'bg-white/80 border-slate-200 text-slate-700'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-[#10b981] animate-ping" />
          <span>Main Enclave Hardware — <strong>TrustGate One</strong></span>
        </div>

        {/* Center Black Squircle with Glowing Green Geometric Emblem (Exact Match to image.png) */}
        <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-[44px] bg-gradient-to-b from-[#1b221d] via-[#0c120e] to-[#040806] border-2 border-emerald-500/30 shadow-[0_32px_80px_rgba(4,46,22,0.45)] flex items-center justify-center relative group">
          {/* Glowing Green Geometric Logo from image.png */}
          <div className="w-18 h-18 relative flex items-center justify-center">
            <div className="w-14 h-14 bg-[#22c55e] rounded-2xl rotate-45 shadow-[0_0_40px_#22c55e] flex items-center justify-center relative overflow-hidden transition-transform duration-500 group-hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#15803d] to-[#86efac] opacity-90" />
              {/* Inner geometric cutout */}
              <div className="w-7 h-7 bg-[#0c120e] rounded-md rotate-45 z-10 -ml-2 -mt-2" />
            </div>
          </div>
          {/* Ambient rim glow */}
          <div className="absolute -inset-1 rounded-[48px] bg-gradient-to-r from-emerald-500/10 via-emerald-400/20 to-transparent blur-md -z-10 pointer-events-none" />
        </div>
      </section>

      {/* MINIMALISTIC OPERATOR IDENTITY WEB LOGIN FORM (Name, Mobile, Gmail) */}
      <main className="max-w-2xl mx-auto px-6 py-4 pb-16 relative z-10">
        <div
          className={`backdrop-blur-2xl rounded-[36px] shadow-2xl p-8 sm:p-10 space-y-7 border transition-all ${
            isDark
              ? 'bg-[#09160e]/95 border-emerald-900/60 shadow-[0_24px_70px_rgba(0,0,0,0.6)]'
              : 'bg-white/95 border-slate-200/90 shadow-[0_24px_70px_rgba(5,32,20,0.08)]'
          }`}
        >
          {/* Form Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5 border-slate-200/50">
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#10b981] mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Zero-Trust Operator Authentication</span>
              </div>
              <h2 className={`text-2xl sm:text-3xl font-black tracking-tight ${isDark ? 'text-white' : 'text-[#021a0f]'}`}>
                Sign In to TrustGate
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Authenticate your operator identity to access the document verification engine.
              </p>
            </div>

            {/* Quick Fill Demo Pills */}
            <div className="flex items-center space-x-1.5 self-start sm:self-auto">
              <span className="text-[11px] font-semibold text-slate-400 mr-1">Demo:</span>
              <button
                type="button"
                onClick={() => handleQuickFill('Stan Hristov', '+1 (555) 382-9014', 'stan.hristov@gmail.com')}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-full border transition-all cursor-pointer ${
                  fullName === 'Stan Hristov'
                    ? isDark
                      ? 'bg-[#10b981] text-[#041c11] border-[#10b981] font-bold'
                      : 'bg-[#052e16] text-white border-[#052e16] font-bold'
                    : isDark
                    ? 'bg-[#0e2217] text-slate-300 border-emerald-800'
                    : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                Stan
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('Alice Chen', '+1 (555) 491-8203', 'alice.chen@gmail.com')}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-full border transition-all cursor-pointer ${
                  fullName === 'Alice Chen'
                    ? isDark
                      ? 'bg-[#10b981] text-[#041c11] border-[#10b981] font-bold'
                      : 'bg-[#052e16] text-white border-[#052e16] font-bold'
                    : isDark
                    ? 'bg-[#0e2217] text-slate-300 border-emerald-800'
                    : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                Alice
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('David Park', '+1 (555) 723-9081', 'david.park@gmail.com')}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-full border transition-all cursor-pointer ${
                  fullName === 'David Park'
                    ? isDark
                      ? 'bg-[#10b981] text-[#041c11] border-[#10b981] font-bold'
                      : 'bg-[#052e16] text-white border-[#052e16] font-bold'
                    : isDark
                    ? 'bg-[#0e2217] text-slate-300 border-emerald-800'
                    : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                David
              </button>
            </div>
          </div>

          {/* Form Inputs: Name, Mobile Number, Gmail */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Input 1: Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 text-slate-400">
                <User className="w-3.5 h-3.5 text-[#10b981]" />
                <span>Operator Full Name</span>
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Stan Hristov"
                className={`w-full px-4 py-3 rounded-2xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#10b981] transition-all border ${
                  isDark
                    ? 'bg-[#07130c] border-emerald-900/60 text-white placeholder-slate-600 focus:bg-[#091a10]'
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white'
                }`}
              />
            </div>

            {/* Input 2: Mobile Number */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 text-slate-400">
                <Phone className="w-3.5 h-3.5 text-[#10b981]" />
                <span>Mobile Phone Number</span>
              </label>
              <input
                type="tel"
                required
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="+1 (555) 382-9014"
                className={`w-full px-4 py-3 rounded-2xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#10b981] transition-all border ${
                  isDark
                    ? 'bg-[#07130c] border-emerald-900/60 text-white placeholder-slate-600 focus:bg-[#091a10]'
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white'
                }`}
              />
            </div>

            {/* Input 3: Gmail */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 text-slate-400">
                <Mail className="w-3.5 h-3.5 text-[#10b981]" />
                <span>Gmail / Google Account</span>
              </label>
              <input
                type="email"
                required
                value={gmail}
                onChange={(e) => setGmail(e.target.value)}
                placeholder="stan.hristov@gmail.com"
                className={`w-full px-4 py-3 rounded-2xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#10b981] transition-all border ${
                  isDark
                    ? 'bg-[#07130c] border-emerald-900/60 text-white placeholder-slate-600 focus:bg-[#091a10]'
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white'
                }`}
              />
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
                {errorMessage}
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3.5">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full sm:w-auto flex-1 px-8 py-3.5 rounded-full font-bold text-sm tracking-tight shadow-xl transition-all flex items-center justify-center space-x-2.5 cursor-pointer disabled:opacity-60 active:scale-98 ${
                  isDark
                    ? 'bg-[#10b981] hover:bg-[#22c55e] text-[#041c11] shadow-[#10b981]/25'
                    : 'bg-[#052e16] hover:bg-[#07401f] text-white shadow-[#052e16]/25'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center ${
                    isDark ? 'bg-[#041c11] text-[#10b981]' : 'bg-[#22c55e] text-[#052e16]'
                  }`}
                >
                  <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                </div>
                <span>
                  {isSubmitting ? 'Verifying Identity...' : 'Authorize Operator & Enter TrustGate'}
                </span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              {onSignInWithGoogle && (
                <button
                  type="button"
                  onClick={() => onSignInWithGoogle('ADMIN')}
                  className={`w-full sm:w-auto px-5 py-3.5 rounded-full border text-xs font-bold shadow-xs transition-colors flex items-center justify-center space-x-2 cursor-pointer ${
                    isDark
                      ? 'bg-[#0a1910] hover:bg-[#0f2418] border-emerald-900/60 text-slate-200'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <img
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                    alt="Google"
                    className="w-4 h-4"
                  />
                  <span>Sign In with Google</span>
                </button>
              )}
            </div>
          </form>
        </div>
      </main>

      {/* 3 SIGNATURE COLUMNS AT BOTTOM (Exact Match to image.png with Day/Dusk/Night Theme) */}
      <section
        className={`border-t py-14 transition-colors duration-300 relative overflow-hidden ${
          isDark
            ? 'border-slate-800/80 bg-gradient-to-b from-[#040b07] via-[#06120b] to-[#020503]'
            : 'border-slate-200/80 bg-gradient-to-b from-[#f7fcf9] via-[#eaf7f0] to-[#def5e7]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Column 1: Daylight Mint (10 kWh) */}
            <div
              className={`p-7 rounded-[32px] border backdrop-blur-xl shadow-lg flex flex-col justify-between space-y-6 ${
                isDark
                  ? 'bg-[#0b1710]/80 border-emerald-900/50 text-white'
                  : 'bg-white/80 border-emerald-200/60 text-slate-800 shadow-emerald-950/5'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-[#10b981] flex items-center justify-center border border-emerald-500/30">
                    <Zap className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-[#10b981] uppercase tracking-wider">
                    10 kWh · ELA ENGINE
                  </span>
                </div>
                <h3 className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-[#021a0f]'}`}>
                  Catching tampering is easy.
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Discrete cosine transform noise residuals isolate altered currency amounts, modified stamps, and font raster discrepancies without manual tuning.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-700/30 flex items-center justify-between text-xs text-slate-400">
                <span>Precision: 99.8%</span>
                <span className="font-bold text-[#10b981]">Real-time ELA</span>
              </div>
            </div>

            {/* Column 2: Twilight Dusk Blue-Green (5 kWh) */}
            <div className="p-7 rounded-[32px] bg-gradient-to-b from-[#142938] via-[#10202e] to-[#0c1822] text-white border border-slate-700/80 shadow-xl flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-cyan-300 flex items-center justify-center border border-blue-400/30">
                    <Battery className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider">
                    5 kWh · ARITHMETIC
                  </span>
                </div>
                <h3 className="text-2xl font-black text-white tracking-tight">
                  Using it smartly?
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Autonomous cross-audits verify gross pay minus deductions against stated net sums. Any variance delta triggers immediate automated review.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
                <span>Zero Variance Tolerance</span>
                <span className="font-bold text-cyan-400">SOX 404 Audit</span>
              </div>
            </div>

            {/* Column 3: Deep Night Obsidian (0 kWh) */}
            <div className="p-7 rounded-[32px] bg-gradient-to-b from-[#09110d] via-[#050a07] to-[#020403] text-white border border-slate-800 shadow-xl flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                    <Lock className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                    0 kWh · QUARANTINE
                  </span>
                </div>
                <h3 className="text-2xl font-black text-white tracking-tight">
                  Autonomous quarantine.
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  TrustGate stays awake. It isolates tampered payloads with cryptographic signatures and issues FIPS 140-3 certs before releasing to core banking.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
                <span>Hardware Isolation</span>
                <span className="font-bold text-emerald-400">FIPS Level 3</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
