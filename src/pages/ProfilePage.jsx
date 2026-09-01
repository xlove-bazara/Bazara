import React from 'react';
import { 
  User, 
  ArrowLeft, 
  FolderDown, 
  ExternalLink, 
  MessageCircle, 
  ShieldCheck, 
  Lock, 
  LogOut, 
  HelpCircle,
  Sparkles,
  Award
} from 'lucide-react';
import BottomDock from '../components/BottomDock';

export default function ProfilePage({ 
  user, 
  completedOrder, 
  onBackToHome, 
  onOpenAdmin, 
  onLoginClick,
  onLogout 
}) {
  return (
    <div className="min-h-screen pb-24 bg-[#08090E] text-slate-100 selection:bg-emerald-500/30">
      {/* Top Header */}
      <header className="sticky top-0 z-30 px-4 py-3 backdrop-blur-xl bg-[#08090E]/85 border-b border-white/[0.06]">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button
            onClick={onBackToHome}
            className="p-2 rounded-full glass-panel text-slate-300 hover:text-white border border-white/10 active:scale-95 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
            Account & Profile
          </span>
          <div className="w-8" />
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pt-4 space-y-4">
        {/* User Card */}
        <div className="p-5 rounded-3xl bg-[#131724] border border-white/[0.08] space-y-3 shadow-2xl shadow-black/50">
          <div className="flex items-center space-x-3.5">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center font-black text-xl text-white shadow-lg shadow-emerald-500/25">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="space-y-0.5 flex-1">
              <h3 className="text-base font-extrabold text-white">
                {user?.name || 'Guest Creator'}
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                {user?.phone ? `+91 ${user.phone}` : (user?.email || 'Login to sync your purchases')}
              </p>
              <div className="inline-flex items-center space-x-1 text-[10px] font-bold text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Verified Creator Pass</span>
              </div>
            </div>
          </div>

          {!user && (
            <div className="pt-2">
              <button
                onClick={onLoginClick}
                className="w-full py-2.5 rounded-2xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md active:scale-95 transition-all"
              >
                Login with Google / WhatsApp OTP
              </button>
            </div>
          )}
        </div>

        {/* My Purchases / Instant Downloads */}
        <div className="p-5 rounded-3xl bg-[#131724] border border-white/[0.08] space-y-3 shadow-2xl shadow-black/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <FolderDown className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-extrabold text-white">My Purchased Assets</h4>
            </div>
            <span className="text-[10px] font-bold text-emerald-400">G-Drive Active</span>
          </div>

          <div className="border-b border-white/[0.08]" />

          {completedOrder ? (
            <div className="p-3.5 rounded-2xl bg-[#0a0d16] border border-white/10 space-y-2.5">
              <div className="flex justify-between items-start">
                <div>
                  <h5 className="text-xs font-bold text-white">{completedOrder.productTitle}</h5>
                  <span className="text-[10px] text-slate-400 font-mono">Order: {completedOrder.id}</span>
                </div>
                <span className="text-[10px] font-extrabold text-emerald-400">Paid ₹{completedOrder.amount}</span>
              </div>

              <a
                href={completedOrder.driveUrl || "https://drive.google.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center space-x-1.5 transition-all"
              >
                <FolderDown className="w-3.5 h-3.5" />
                <span>Open in Google Drive 📁</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-[#0a0d16] border border-white/5 text-center space-y-2">
              <p className="text-xs text-slate-400">No active orders yet.</p>
              <button
                onClick={onBackToHome}
                className="text-xs font-bold text-emerald-400 hover:underline"
              >
                Browse Viral Bundles & Courses →
              </button>
            </div>
          )}
        </div>

        {/* Quick Links & Community */}
        <div className="p-5 rounded-3xl bg-[#131724] border border-white/[0.08] space-y-3 shadow-2xl shadow-black/50">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
            Support & Community
          </h4>

          <div className="space-y-2">
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-2xl bg-[#0a0d16] border border-white/10 flex items-center justify-between hover:bg-[#0e1220] transition-colors"
            >
              <div className="flex items-center space-x-3">
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-slate-200">24/7 WhatsApp Support</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            </a>

            <a
              href="https://t.me/bazara_creators"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-2xl bg-[#0a0d16] border border-white/10 flex items-center justify-between hover:bg-[#0e1220] transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Award className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold text-slate-200">Join VIP Telegram Mastermind</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            </a>
          </div>
        </div>

        {/* Owner / Store Admin Section (Discreet & Private) */}
        <div className="p-4 rounded-3xl bg-gradient-to-r from-emerald-950/20 via-[#131724] to-indigo-950/20 border border-emerald-500/20 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-bold text-white">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Store Owner Controls</span>
            </div>
            <span className="text-[10px] font-bold text-slate-400">Admin Only</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Manage your store: add new reels packs, courses, edit prices, drive links and marquee ticker.
          </p>
          <button
            onClick={onOpenAdmin}
            className="w-full py-2.5 rounded-2xl text-xs font-bold bg-white/10 hover:bg-white/15 text-white border border-white/10 flex items-center justify-center space-x-1.5 transition-all"
          >
            <span>Open bazara.in Admin Panel ⚙️</span>
          </button>
        </div>

        {user && (
          <button
            onClick={onLogout}
            className="w-full py-3 rounded-2xl text-xs font-bold text-rose-400 bg-rose-500/10 hover:bg-rose-500/15 border border-rose-500/20 flex items-center justify-center space-x-2 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout Account</span>
          </button>
        )}
      </main>

      <BottomDock 
        activeTab="profile" 
        onTabChange={(tab) => {
          if (tab === 'home' || tab === 'deals' || tab === 'library') {
            onBackToHome();
          }
        }} 
      />
    </div>
  );
}
