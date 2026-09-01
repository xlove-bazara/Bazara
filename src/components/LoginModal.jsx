import React, { useState } from 'react';
import { X, ShieldCheck, ArrowRight, Smartphone, Mail } from 'lucide-react';

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [step, setStep] = useState('phone'); // 'phone' | 'otp'
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      alert('Please enter a valid 10-digit mobile number');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
    }, 600);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const user = {
        name: 'Creator ' + phone.slice(-4),
        phone: phone,
        email: `creator_${phone.slice(-4)}@bazara.in`
      };
      onLoginSuccess(user);
      onClose();
    }, 600);
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const user = {
        name: 'Alex Creator',
        email: 'alex.creator@gmail.com',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
      };
      onLoginSuccess(user);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-sm rounded-3xl p-6 glass-panel border border-white/15 shadow-2xl bg-[#0d101a] space-y-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 text-slate-300 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title */}
        <div className="text-center space-y-1">
          <div className="w-10 h-10 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black text-base shadow-md">
            b
          </div>
          <h3 className="text-lg font-black text-white">Login to bazara.in</h3>
          <p className="text-xs text-slate-400">Access your purchased reels, courses & drive links</p>
        </div>

        {/* 1-Tap Google Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-white text-slate-900 hover:bg-slate-100 flex items-center justify-center space-x-2 shadow-md transition-all active:scale-[0.98]"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          <span>Continue with Google</span>
        </button>

        <div className="relative flex items-center justify-center">
          <div className="w-full border-t border-white/10" />
          <span className="absolute bg-[#0d101a] px-3 text-[10px] uppercase font-bold text-slate-500">
            OR OTP LOGIN
          </span>
        </div>

        {/* OTP Flow */}
        {step === 'phone' ? (
          <form onSubmit={handleSendOtp} className="space-y-3">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-300">WhatsApp / Phone Number</label>
              <div className="flex items-center space-x-2">
                <span className="px-3 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-xs font-bold text-slate-300">
                  +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 10-digit number"
                  className="w-full px-3 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/25 active:scale-95 transition-all"
            >
              {loading ? 'Sending OTP...' : 'Send WhatsApp / SMS OTP →'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-3">
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-semibold text-slate-300">Enter 4-Digit OTP</label>
                <span className="text-[10px] text-emerald-400">Sent to +91 {phone}</span>
              </div>
              <input
                type="text"
                maxLength={4}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="1234"
                className="w-full text-center tracking-widest text-lg font-mono font-bold py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                required
              />
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="text-[10px] text-slate-400 hover:underline"
                >
                  Change number
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/25 active:scale-95 transition-all"
            >
              {loading ? 'Verifying...' : 'Verify & Access Vault 🚀'}
            </button>
          </form>
        )}

        <div className="flex items-center justify-center space-x-1 text-[10px] text-slate-400 pt-1">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span>No password required • 100% Secure Instant Access</span>
        </div>
      </div>
    </div>
  );
}
