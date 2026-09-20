import React, { useState } from 'react';
import { 
  Wrench, 
  ShieldCheck, 
  MessageCircle, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  X, 
  Sparkles, 
  Clock 
} from 'lucide-react';

export default function MaintenanceModePage({ 
  settings, 
  onUnlockPreview, 
  onAdminLogin 
}) {
  const [isPasscodeModalOpen, setIsPasscodeModalOpen] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [passcodeError, setPasscodeError] = useState('');
  const [isUnlocking, setIsUnlocking] = useState(false);

  const headline = settings?.maintenance_headline || "We're Upgrading Bazara!";
  const message = settings?.maintenance_message || "We are currently making exciting upgrades & adding new practical AI e-books & masterclasses. We'll be back online shortly!";
  const notice = settings?.maintenance_notice || "Back online within 2 hours";
  const whatsappNumber = settings?.maintenance_whatsapp || settings?.support_whatsapp || "+91 98373 71137";
  const phoneNumber = settings?.maintenance_phone || "+91 98373 71137";
  const cleanPhone = whatsappNumber.replace(/\D/g, '');
  const secretPasscode = (settings?.maintenance_passcode || 'bazara2026').trim();

  const handleVerifyPasscode = (e) => {
    e.preventDefault();
    setPasscodeError('');
    setIsUnlocking(true);

    setTimeout(() => {
      const input = passcodeInput.trim();
      // Verify against configured passcode or master admin passcodes
      if (input === secretPasscode || input === 'bazara2026' || input === 'admin2026' || input === 'tripgod2030') {
        localStorage.setItem('bazara_admin_preview_active', 'true');
        setIsUnlocking(false);
        setIsPasscodeModalOpen(false);
        if (onUnlockPreview) {
          onUnlockPreview();
        }
      } else {
        setIsUnlocking(false);
        setPasscodeError('Invalid Admin Passcode. Please try again or login with 2FA.');
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col justify-between relative overflow-hidden select-none">
      
      {/* Ambient Lighting Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-[150px] left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-amber-500/[0.08] rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -right-[100px] w-[500px] h-[500px] bg-emerald-500/[0.06] rounded-full blur-[150px]" />
        <div className="absolute -bottom-[150px] -left-[100px] w-[550px] h-[450px] bg-indigo-600/[0.08] rounded-full blur-[160px]" />
      </div>

      {/* Top Header */}
      <header className="relative z-20 px-4 sm:px-8 py-4 backdrop-blur-xl bg-[#091017]/70 border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center space-x-2.5">
            <img
              src="/logo.png?v=2"
              alt="bazara.in"
              className="w-8 h-8 rounded-xl object-contain shadow-lg shadow-amber-500/20"
            />
            <div className="flex items-baseline space-x-1">
              <span className="font-extrabold text-xl tracking-tight text-white uppercase">
                bazara
              </span>
              <span className="text-xs font-bold text-emerald-400">.in</span>
            </div>
          </div>

          {/* Admin Login Quick Link */}
          <button
            onClick={() => setIsPasscodeModalOpen(true)}
            className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 hover:text-white border border-white/10 transition-all flex items-center space-x-1.5 cursor-pointer active:scale-95"
          >
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Admin Login</span>
          </button>
        </div>
      </header>

      {/* Center Maintenance Message Card */}
      <main className="relative z-10 max-w-2xl mx-auto px-4 py-12 text-center space-y-7 my-auto">
        
        {/* Status Pill */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-extrabold shadow-sm animate-pulse">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping mr-0.5" />
          <Wrench className="w-3.5 h-3.5" />
          <span className="tracking-wider uppercase">STORE MAINTENANCE UNDERWAY</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          {headline}
        </h1>

        {/* Visitor Description */}
        <p className="text-sm sm:text-base text-slate-300 max-w-lg mx-auto leading-relaxed">
          {message}
        </p>

        {/* Estimated Completion Notice Pill */}
        <div className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-white/[0.04] border border-white/10 text-xs font-bold text-slate-200 shadow-inner">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>{notice}</span>
        </div>

        {/* Support Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <a
            href={`https://wa.me/${cleanPhone}?text=Hi%20bazara.in%20Team%2C%20I%20have%20a%20question%20regarding%20store%20upgrades.`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider text-slate-950 bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-400 hover:opacity-95 shadow-xl shadow-emerald-500/25 active:scale-95 transition-all flex items-center justify-center space-x-2 cursor-pointer btn-shine-effect"
          >
            <MessageCircle className="w-4 h-4 fill-slate-950" />
            <span>WhatsApp Support</span>
          </a>

          <a
            href={`tel:${phoneNumber.replace(/\s+/g, '')}`}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider text-white bg-white/[0.08] hover:bg-white/[0.15] border border-white/10 active:scale-95 transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Phone className="w-4 h-4 text-slate-300" />
            <span>Call Support</span>
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-4 py-6 text-center text-xs text-slate-500 border-t border-white/[0.05] flex flex-col sm:flex-row items-center justify-between max-w-6xl mx-auto w-full gap-3">
        <span>© 2026 bazara.in. All rights reserved.</span>
        
        {/* Passcode Modal Trigger */}
        <button
          onClick={() => setIsPasscodeModalOpen(true)}
          className="text-slate-400 hover:text-amber-400 transition-colors flex items-center space-x-1.5 cursor-pointer font-medium"
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Store Owner Login & Live Preview</span>
        </button>
      </footer>

      {/* Passcode Unlock Modal */}
      {isPasscodeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-[#101422] border border-white/15 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 animate-scale-in">
            
            {/* Close Button */}
            <button
              onClick={() => {
                setIsPasscodeModalOpen(false);
                setPasscodeError('');
                setPasscodeInput('');
              }}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="space-y-1.5 text-center">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white tracking-tight">
                Store Owner Live Preview
              </h3>
              <p className="text-xs text-slate-300">
                Enter your secret admin passcode to test & preview the store while maintenance mode is active for visitors.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleVerifyPasscode} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Secret Admin Passcode
                </label>
                <div className="relative">
                  <input
                    type={showPasscode ? "text" : "password"}
                    value={passcodeInput}
                    onChange={(e) => setPasscodeInput(e.target.value)}
                    placeholder="Enter admin passcode"
                    autoFocus
                    required
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white text-sm focus:outline-none focus:border-amber-400 transition-colors pr-10 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasscode(!showPasscode)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                  >
                    {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {passcodeError && (
                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold text-center animate-scale-in">
                  {passcodeError}
                </div>
              )}

              <button
                type="submit"
                disabled={isUnlocking || !passcodeInput.trim()}
                className="w-full py-3.5 rounded-xl font-black text-xs uppercase tracking-wider bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-slate-950 shadow-xl shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                {isUnlocking ? (
                  <span>Verifying Passcode...</span>
                ) : (
                  <>
                    <span>Unlock & Preview Store</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-2 text-center border-t border-white/[0.08]">
              <button
                onClick={() => {
                  setIsPasscodeModalOpen(false);
                  if (onAdminLogin) onAdminLogin();
                }}
                className="text-xs text-slate-400 hover:text-emerald-400 transition-colors font-semibold cursor-pointer"
              >
                Need to access full Admin Panel with 2FA? Click here &rarr;
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
