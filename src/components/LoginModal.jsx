import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, ArrowRight, Smartphone, Mail, Sparkles, CheckCircle } from 'lucide-react';
import { signInWithGoogle, sendOtp, verifyOtp } from '../supabase';

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [authMode, setAuthMode] = useState('phone'); // 'phone' | 'email'
  const [step, setStep] = useState('input'); // 'input' | 'otp'
  const [identifier, setIdentifier] = useState(''); // phone number or email
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown(c => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      await signInWithGoogle();
      // Browser will automatically redirect to accounts.google.com!
    } catch (err) {
      setLoading(false);
      setErrorMsg(err.message || 'Google login failed. Make sure Google provider is enabled in Supabase.');
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    const cleanId = identifier.trim();

    if (authMode === 'phone' && (!cleanId || cleanId.replace(/\D/g, '').length < 10)) {
      setErrorMsg('Please enter a valid 10-digit mobile number');
      return;
    }
    if (authMode === 'email' && (!cleanId || !cleanId.includes('@'))) {
      setErrorMsg('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      await sendOtp(cleanId);
      setLoading(false);
      setStep('otp');
      setCountdown(30);
    } catch (err) {
      setLoading(false);
      setErrorMsg(err.message || 'Failed to send OTP. Please check provider settings.');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!otp || otp.length < 6) {
      setErrorMsg('Please enter the 6-digit OTP sent to your email');
      return;
    }


    setLoading(true);
    try {
      const res = await verifyOtp(identifier.trim(), otp);
      setLoading(false);
      const user = res?.user || {
        name: identifier.split('@')[0] || identifier,
        email: identifier.includes('@') ? identifier : null,
        phone: !identifier.includes('@') ? identifier : null
      };
      localStorage.setItem('bazara_current_user', JSON.stringify(user));
      onLoginSuccess(user);
      onClose();
    } catch (err) {
      setLoading(false);
      setErrorMsg(err.message || 'Invalid OTP code. Please try again.');
    }
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-sm rounded-3xl p-6 glass-panel border border-white/15 shadow-2xl bg-[#0e111d] space-y-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title with Brand Logo */}
        <div className="text-center space-y-1.5">
          <img src="/logo.png" alt="bazara.in" className="w-11 h-11 mx-auto rounded-xl object-contain shadow-lg shadow-indigo-500/25" />
          <h3 className="text-lg font-black text-white">Login to bazara.in</h3>
          <p className="text-xs text-slate-400">Access your purchased courses, videos & instant drive links</p>
        </div>

        {/* 1-Tap Google Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-white text-slate-900 hover:bg-slate-100 flex items-center justify-center space-x-2.5 shadow-md transition-all active:scale-[0.98] cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          <span>Continue with Google (1-Tap)</span>
        </button>

        <div className="relative flex items-center justify-center">
          <div className="w-full border-t border-white/10" />
          <span className="absolute bg-[#0e111d] px-2.5 text-[10px] uppercase font-bold text-slate-500">
            OR LOGIN WITH OTP
          </span>
        </div>

        {/* Mode Switcher: Phone OTP or Email OTP */}
        {step === 'input' && (
          <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.08] text-center text-xs font-semibold">
            <button
              type="button"
              onClick={() => { setAuthMode('phone'); setIdentifier(''); setErrorMsg(''); }}
              className={`py-1.5 rounded-lg transition-all cursor-pointer ${authMode === 'phone' ? 'bg-emerald-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              📱 Mobile OTP
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode('email'); setIdentifier(''); setErrorMsg(''); }}
              className={`py-1.5 rounded-lg transition-all cursor-pointer ${authMode === 'email' ? 'bg-emerald-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              ✉️ Email OTP
            </button>
          </div>
        )}

        {/* Error Notification */}
        {errorMsg && (
          <div className="p-2 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs text-center">
            {errorMsg}
          </div>
        )}

        {/* OTP Input Form */}
        {step === 'input' ? (
          <form onSubmit={handleSendOtp} className="space-y-3">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-300">
                {authMode === 'phone' ? 'Mobile / WhatsApp Number' : 'Email Address'}
              </label>
              
              {authMode === 'phone' ? (
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-xs font-bold text-slate-300">
                    +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 10-digit number"
                    className="w-full px-3 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              ) : (
                <input
                  type="email"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  required
                />
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/25 active:scale-95 transition-all cursor-pointer btn-shine-effect"
            >
              {loading ? 'Sending OTP...' : `Send ${authMode === 'phone' ? 'Mobile' : 'Email'} OTP →`}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-3">
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <label className="text-[11px] font-semibold text-slate-300">Enter 6-Digit OTP Code</label>
                <span className="text-[10px] text-emerald-400 font-mono">
                  Sent to {authMode === 'phone' ? `+91 ${identifier}` : identifier}
                </span>
              </div>
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 6-digit OTP"
                className="w-full text-center tracking-widest text-lg font-mono font-bold py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                required
                autoFocus
              />


              <div className="flex items-center justify-between text-[10px] pt-1">
                <button
                  type="button"
                  onClick={() => { setStep('input'); setOtp(''); setErrorMsg(''); }}
                  className="text-slate-400 hover:text-slate-200 underline cursor-pointer"
                >
                  Change {authMode === 'phone' ? 'number' : 'email'}
                </button>
                {countdown > 0 ? (
                  <span className="text-slate-400">Resend in {countdown}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="text-emerald-400 hover:underline font-semibold cursor-pointer"
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/25 active:scale-95 transition-all cursor-pointer btn-shine-effect"
            >
              {loading ? 'Verifying...' : 'Verify & Access Vault 🚀'}
            </button>
          </form>
        )}

        <div className="flex items-center justify-center space-x-1.5 text-[10px] text-slate-400 pt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Instant Login • 100% Encrypted & Safe</span>
        </div>
      </div>
    </div>
  );
}
