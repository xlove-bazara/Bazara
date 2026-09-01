import React, { useState } from 'react';
import { Search, User, Sparkles, X, Shield, ArrowRight } from 'lucide-react';

export default function Header({ onSearch, onNavigate, onOpenLogin, user }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  return (
    <header className="sticky top-0 z-30 px-4 pt-3 pb-2 backdrop-blur-xl bg-[#08090E]/85 border-b border-white/[0.05]">
      <div className="max-w-md mx-auto space-y-2.5">
        {/* Top Floating Pill: Brand & Login */}
        <div className="flex items-center justify-between px-4 py-2 rounded-full glass-panel border border-white/10 shadow-lg shadow-black/40">
          <div 
            onClick={() => onNavigate('home')}
            className="flex items-center space-x-2 cursor-pointer group"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center font-black text-white text-xs shadow-md shadow-emerald-500/20">
              b
            </div>
            <div className="flex items-baseline space-x-1">
              <span className="font-extrabold text-base tracking-tight text-white uppercase group-hover:text-emerald-400 transition-colors">
                bazara
              </span>
              <span className="text-[10px] font-bold text-emerald-400">.in</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {user ? (
              <button 
                onClick={() => onNavigate('dashboard')}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-white/10 text-white hover:bg-white/20 border border-white/10 transition-all"
              >
                <User className="w-3.5 h-3.5 text-emerald-400" />
                <span>My Vault</span>
              </button>
            ) : (
              <button 
                onClick={onOpenLogin}
                className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/25 transition-all active:scale-95"
              >
                LOGIN
              </button>
            )}
          </div>
        </div>

        {/* Compact Search Bar matching reference image */}
        <form onSubmit={handleSearchSubmit} className="relative">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (onSearch) onSearch(e.target.value);
              }}
              placeholder="Search 5,000+ reels, courses, tools..."
              className="w-full pl-11 pr-10 py-2.5 rounded-full bg-[#121622] text-sm text-slate-200 placeholder-slate-400 border border-white/[0.08] focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  if (onSearch) onSearch('');
                }}
                className="absolute right-3 p-1 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>
      </div>
    </header>
  );
}
