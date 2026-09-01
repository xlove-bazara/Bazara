import React, { useState, useEffect } from 'react';
import { 
  User, 
  ArrowLeft, 
  FolderDown, 
  ExternalLink, 
  MessageCircle, 
  ShieldCheck, 
  LogOut, 
  Check, 
  CheckCircle2, 
  Edit3, 
  Sparkles, 
  Award,
  Zap,
  Mail,
  Phone,
  LogIn
} from 'lucide-react';
import BottomDock from '../components/BottomDock';
import { supabase } from '../supabase';

// 5 Fun & Ultra-Cool Cartoon / Anime Style Creator Avatars (Dicebear Vector Illustrated)
const CARTOON_AVATARS = [
  { id: '1', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Jack&backgroundColor=10b981', label: 'Cartoon Boy' },
  { id: '2', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Willow&backgroundColor=6366f1', label: 'Cartoon Girl' },
  { id: '3', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Leo&backgroundColor=0ea5e9', label: 'Cool Bot' },
  { id: '4', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zack&backgroundColor=f59e0b', label: 'Creative Pro' },
  { id: '5', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maya&backgroundColor=ec4899', label: 'Anime Star' }
];

export default function ProfilePage({ 
  user, 
  setUser,
  completedOrder, 
  onBackToHome, 
  onLoginClick,
  onLogout 
}) {
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(user?.name || '');
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || CARTOON_AVATARS[0].url);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Sync state only when incoming user name/avatar changes (No infinite loops!)
  useEffect(() => {
    if (user?.name) setNameInput(user.name);
    if (user?.avatar) setSelectedAvatar(user.avatar);
  }, [user?.name, user?.avatar]);

  // Handle Save Name
  const handleSaveName = (e) => {
    if (e) e.preventDefault();
    const cleanName = nameInput.trim() || user?.name || 'Creator';
    const updated = {
      ...(user || {}),
      name: cleanName,
      avatar: selectedAvatar
    };
    localStorage.setItem('bazara_current_user', JSON.stringify(updated));
    if (setUser) setUser(updated);
    setEditingName(false);
    setSaveSuccessMsg('✓ Name updated successfully!');
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  // Handle Select Cartoon Avatar
  const handleSelectCartoonAvatar = (avatarUrl) => {
    setSelectedAvatar(avatarUrl);
    const updated = {
      ...(user || {}),
      avatar: avatarUrl
    };
    localStorage.setItem('bazara_current_user', JSON.stringify(updated));
    if (setUser) setUser(updated);
    setSaveSuccessMsg('✓ Cartoon avatar updated!');
    setTimeout(() => setSaveSuccessMsg(''), 2500);
  };

  const displayEmail = user?.email && user.email !== 'creator@bazara.in' ? user.email : null;
  const displayName = user?.name || nameInput || (displayEmail ? displayEmail.split('@')[0] : 'Guest Creator');


  return (
    <div className="min-h-screen pb-28 md:pb-16 bg-[#08090E] text-slate-100 selection:bg-emerald-500/30">
      {/* Top Header */}
      <header className="sticky top-0 z-30 px-4 md:px-8 py-3.5 backdrop-blur-2xl bg-[#08090E]/85 border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={onBackToHome}
            className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full glass-panel text-slate-300 hover:text-white border border-white/10 hover:border-white/20 active:scale-95 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-xs font-bold hidden sm:inline">Back to Store</span>
          </button>

          <div className="flex items-center space-x-2">
            <img src="/logo.png" alt="bazara.in" className="w-7 h-7 rounded-xl object-contain shadow-md" />
            <div className="flex items-baseline space-x-1">
              <span className="font-black text-base text-white">bazara</span>
              <span className="text-xs font-bold text-emerald-400">.in</span>
              <span className="ml-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white/[0.05] px-2 py-0.5 rounded-full border border-white/10">
                Account & Vault
              </span>
            </div>
          </div>

          <div className="w-16" />
        </div>
      </header>

      {/* Main Desktop Dashboard Container (2-Column Grid) */}
      <main className="max-w-6xl mx-auto px-4 md:px-8 pt-6 md:pt-8 space-y-6">
        
        {saveSuccessMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold text-center animate-fade-in shadow-lg">
            {saveSuccessMsg}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ================= LEFT COLUMN: User Profile & Cartoon Avatar Selector (5 Cols) ================= */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Primary Profile Card */}
            <div className="p-6 rounded-3xl bg-[#121624] border border-white/[0.08] space-y-5 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center space-x-4">
                {/* Active Cartoon Avatar */}
                <div className="relative group shrink-0">
                  <img
                    src={selectedAvatar}
                    alt={displayName}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover bg-[#1c2237] border-2 border-emerald-400 shadow-xl shadow-emerald-500/25 p-1"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#121624] flex items-center justify-center">
                    <Check className="w-3 h-3 text-slate-950 stroke-[3]" />
                  </div>
                </div>

                {/* Name & Contact Info */}
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-black text-white truncate">
                      {displayName}
                    </h3>
                    <button
                      onClick={() => setEditingName(!editingName)}
                      className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                      title="Edit Display Name"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Real Verified Email / Phone */}
                  {displayEmail ? (
                    <p className="text-xs text-emerald-400 font-mono truncate flex items-center space-x-1 font-semibold">
                      <Mail className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span className="truncate">{displayEmail}</span>
                    </p>
                  ) : (
                    <p className="text-xs text-amber-400/90 font-medium flex items-center space-x-1">
                      <span>Guest User (Login to sync)</span>
                    </p>
                  )}

                  {user?.phone && (
                    <p className="text-xs text-slate-400 font-mono flex items-center space-x-1">
                      <Phone className="w-3 h-3 text-slate-500 shrink-0" />
                      <span>+91 {user.phone}</span>
                    </p>
                  )}


                  <div className="pt-1 flex items-center space-x-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1" />
                      {displayEmail ? 'VERIFIED CREATOR' : 'GUEST PASS'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Editable Name Form */}
              {editingName && (
                <form onSubmit={handleSaveName} className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2.5">
                  <label className="text-xs font-bold text-slate-300 block">
                    Change Display Name:
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      placeholder="Apna name daalein..."
                      className="flex-1 px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-400"
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs cursor-pointer active:scale-95 transition-all"
                    >
                      Save
                    </button>
                  </div>
                </form>
              )}

              {/* 5 Cartoon / Anime Style Avatars */}
              <div className="pt-2 border-t border-white/[0.08] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Choose Cartoon Avatar</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">1-Tap to set</span>
                </div>

                <div className="grid grid-cols-5 gap-2.5">
                  {CARTOON_AVATARS.map((av) => {
                    const isCurrent = selectedAvatar === av.url;
                    return (
                      <button
                        key={av.id}
                        type="button"
                        onClick={() => handleSelectCartoonAvatar(av.url)}
                        title={av.label}
                        className={`group relative rounded-2xl overflow-hidden aspect-square border-2 transition-all cursor-pointer p-1 bg-[#181d2e] ${
                          isCurrent 
                            ? 'border-emerald-400 ring-2 ring-emerald-400/40 scale-105 shadow-lg shadow-emerald-500/30' 
                            : 'border-white/10 hover:border-white/30 hover:scale-105'
                        }`}
                      >
                        <img
                          src={av.url}
                          alt={av.label}
                          className="w-full h-full object-contain"
                        />
                        {isCurrent && (
                          <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {!displayEmail && (
                <div className="pt-2">
                  <button
                    onClick={onLoginClick}
                    className="w-full py-3 rounded-2xl text-xs font-black uppercase tracking-wider bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-xl shadow-emerald-500/25 active:scale-95 transition-all cursor-pointer flex items-center justify-center space-x-2 btn-shine-effect"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Login with Google / WhatsApp OTP</span>
                  </button>
                </div>
              )}
            </div>

            {/* Membership Benefits */}
            <div className="p-5 rounded-3xl bg-[#121624] border border-white/[0.08] space-y-3 shadow-xl">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                Creator Membership Privileges
              </h4>
              <div className="space-y-2.5 text-xs text-slate-300 font-medium">
                <div className="flex items-center space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Instant 1-Click Google Drive Vault Access</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>100% Commercial Monetization & Resell Rights</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Lifetime Free Cloud Storage & Course Updates</span>
                </div>
              </div>
            </div>

          </div>

          {/* ================= RIGHT COLUMN: My Purchased Assets & Support (7 Cols) ================= */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* My Purchased Assets / Google Drive Vault */}
            <div className="p-6 rounded-3xl bg-[#121624] border border-white/[0.08] space-y-4 shadow-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-md">
                    <FolderDown className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-white">My Purchased Assets</h4>
                    <span className="text-xs text-slate-400 font-medium">Direct Google Drive cloud downloads</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                  G-Drive Active
                </span>
              </div>

              <div className="border-b border-white/[0.08]" />

              {completedOrder ? (
                <div className="p-5 rounded-2xl bg-[#090c15] border border-emerald-500/25 space-y-4 shadow-inner">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                    <div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-400 uppercase tracking-wider">
                        Active Order
                      </span>
                      <h5 className="text-sm sm:text-base font-extrabold text-white mt-1">
                        {completedOrder.productTitle}
                      </h5>
                      <span className="text-xs text-slate-400 font-mono">
                        Order ID: {completedOrder.id}
                      </span>
                    </div>
                    <span className="text-sm font-black text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 self-start sm:self-auto">
                      Paid ₹{completedOrder.amount}
                    </span>
                  </div>

                  <a
                    href={completedOrder.driveUrl || "https://drive.google.com"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-lg shadow-emerald-500/25 active:scale-[0.98] cursor-pointer btn-shine-effect"
                  >
                    <FolderDown className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                    <span>Open in Google Drive 📁</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-950" />
                  </a>
                </div>
              ) : (
                <div className="p-8 rounded-2xl bg-[#090c15] border border-white/5 text-center space-y-3">
                  <FolderDown className="w-10 h-10 text-slate-600 mx-auto" />
                  <p className="text-xs font-semibold text-slate-400">
                    Aapke account me abhi koi active purchase nahi hai.
                  </p>
                  <button
                    onClick={onBackToHome}
                    className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md transition-all cursor-pointer"
                  >
                    <span>Browse Bundles & Masterclass →</span>
                  </button>
                </div>
              )}
            </div>

            {/* Support & Community Mastermind */}
            <div className="p-6 rounded-3xl bg-[#121624] border border-white/[0.08] space-y-4 shadow-2xl">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                Direct VIP Support & Community
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-2xl bg-[#090c15] border border-white/10 hover:border-emerald-500/40 flex items-center justify-between group transition-all"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block group-hover:text-emerald-400 transition-colors">
                        WhatsApp Support
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">Instant 24/7 Response</span>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                </a>

                <a
                  href="https://t.me/bazara_creators"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-2xl bg-[#090c15] border border-white/10 hover:border-indigo-500/40 flex items-center justify-between group transition-all"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block group-hover:text-indigo-400 transition-colors">
                        Telegram Mastermind
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">12K+ Creators Community</span>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                </a>
              </div>
            </div>

            {/* Trust & Safe Delivery Guarantee */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between text-[11px] text-slate-400 font-medium flex-wrap gap-2">
              <span className="flex items-center">
                <Zap className="w-3.5 h-3.5 mr-1 text-emerald-400" /> Instant Access via Google Drive
              </span>
              <span className="flex items-center">
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-400" /> 100% Encrypted Payments
              </span>
              <span>♾️ Lifetime Vault Access</span>
            </div>

          </div>

        </div>

        {/* ================= SABSE NICHE: LOGOUT BUTTON ================= */}
        {displayEmail && (
          <div className="pt-6 pb-2 border-t border-white/[0.08] flex justify-center">
            <button
              onClick={onLogout}
              className="w-full max-w-sm py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 hover:border-rose-500/50 flex items-center justify-center space-x-2 shadow-lg transition-all cursor-pointer active:scale-95"
            >
              <LogOut className="w-4 h-4 text-rose-400" />
              <span>Logout From Account</span>
            </button>
          </div>
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
