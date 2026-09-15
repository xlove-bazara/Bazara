import React from 'react';
import { 
  CheckCircle, 
  FolderDown, 
  ExternalLink, 
  Download, 
  MessageCircle, 
  ArrowLeft, 
  Play, 
  ShieldCheck,
  Award
} from 'lucide-react';

export default function AccessDashboardPage({ 
  order, 
  onBackToHome 
}) {
  if (!order) return null;

  const driveUrl = order.driveUrl || "https://drive.google.com";

  return (
    <div className="min-h-screen pb-20 bg-base text-primary-theme selection:bg-emerald-500/30 transition-colors duration-200">
      {/* Top Header */}
      <header className="sticky top-0 z-30 px-4 sm:px-8 py-3.5 backdrop-blur-xl bg-[var(--bg-header)] border-b border-[var(--border-subtle)] transition-colors">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            onClick={onBackToHome}
            className="p-2 rounded-full glass-panel text-secondary-theme hover:text-primary-theme border border-[var(--border-subtle)] active:scale-95 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-500 dark:text-emerald-400 font-heading">
            Instant Access Vault
          </span>
          <img src="/logo.png?v=2" alt="bazara.in" className="w-7 h-7 rounded-lg object-contain shadow-sm" />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-5">

        {/* Celebration Card */}
        <div className="text-center p-6 rounded-3xl glass-panel border border-emerald-500/30 bg-gradient-to-b from-emerald-950/30 via-[#0e121d] to-[#0a0c16] space-y-2">
          <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/25">
            <CheckCircle className="w-8 h-8 text-emerald-400" />
          </div>
          <h1 className="text-xl font-black text-white">Payment Successful! 🎉</h1>
          <p className="text-xs text-slate-300">
            Order ID: <span className="font-mono text-emerald-400">{order.id}</span>
          </p>
          <p className="text-[11px] text-slate-400">
            Your Google Drive access is unlocked & WhatsApp confirmation has been sent to +91 {order.customerPhone}.
          </p>
        </div>

        {/* PRIMARY ACTION 1: Direct Google Drive Link */}
        <div className="p-5 rounded-3xl glass-panel border border-[var(--border-subtle)] space-y-3 bg-[var(--bg-card)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-500 dark:text-emerald-400 font-heading">
              Your Digital Product Access
            </span>
            <span className="text-[10px] text-emerald-500 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full bg-emerald-500/10">Lifetime Active</span>
          </div>

          <h3 className="text-sm font-bold text-primary-theme leading-snug font-heading">
            {order.productTitle}
          </h3>

          <a
            href={driveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider text-slate-950 bg-gradient-to-r from-emerald-500 to-teal-600 shadow-[0_0_20px_rgba(16,185,129,0.35)] hover:shadow-[0_0_28px_rgba(16,185,129,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2.5 btn-shine-effect cursor-pointer"
          >
            <FolderDown className="w-5 h-5 fill-slate-950" />
            <span>OPEN IN GOOGLE DRIVE</span>
            <ExternalLink className="w-4 h-4 text-slate-950" />
          </a>


          {order.upsellIncluded && (
            <div className="pt-2.5 border-t border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300 flex items-center space-x-1">
                  <span>⚡ Special Add-on Access:</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-bold">Unlocked</span>
              </div>
              <h4 className="text-xs font-semibold text-white">
                {order.upsellTitle || 'Bonus Vault & Presets'}
              </h4>
              <a
                href={order.upsellDriveUrl || driveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-2xl font-black text-xs uppercase tracking-wider text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <FolderDown className="w-4 h-4 fill-slate-950" />
                <span>OPEN ADD-ON IN GOOGLE DRIVE 📁</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-950" />
              </a>
            </div>
          )}
        </div>

        {/* VIP Community Card */}
        <div className="p-4 rounded-3xl glass-panel border border-indigo-500/20 bg-indigo-950/20 space-y-2">
          <div className="flex items-center space-x-2 text-indigo-400">
            <Award className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Creator Community</span>
          </div>
          <p className="text-xs text-slate-300">
            Join 12,000+ creators in our private Telegram/WhatsApp VIP channel for daily viral hooks and updates.
          </p>
          <a
            href="https://t.me/bazaraofficial"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center space-x-2 transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Join Exclusive Telegram Community</span>
          </a>
        </div>

        {/* Action to Return Home */}
        <button
          onClick={onBackToHome}
          className="w-full py-3 rounded-full text-xs font-bold text-slate-400 hover:text-white border border-white/10 active:scale-95 transition-all"
        >
          Return to Store & Browse More Assets
        </button>
      </main>
    </div>
  );
}
