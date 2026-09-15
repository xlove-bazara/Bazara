import React, { useState } from 'react';
import { Search, User, Sparkles, X, Shield, ArrowRight, Home, Flame, FolderDown, GraduationCap, Sun, Moon } from 'lucide-react';

export default function Header({ 
  onSearch, 
  onNavigate, 
  onOpenLogin, 
  user, 
  activeTab = 'home',
  theme = 'dark',
  toggleTheme 
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const navLinks = [
    { id: 'home', label: 'Store', icon: Home },
    { id: 'deals', label: 'Deals', icon: Flame },
    { id: 'library', label: 'Downloads', icon: FolderDown },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <header className="sticky top-0 z-30 px-4 md:px-8 pt-3 pb-2.5 backdrop-blur-2xl bg-[var(--bg-header)] border-b border-[var(--border-subtle)] transition-colors duration-200">
      <div className="max-w-md md:max-w-7xl mx-auto">

        {/* Desktop Header Layout (>= 768px) */}
        <div className="hidden md:flex items-center justify-between gap-6">
          {/* Brand Logo */}
          <div 
            onClick={() => onNavigate('home')}
            className="flex items-center space-x-2.5 cursor-pointer group shrink-0"
          >
            <img
              src="/logo.png?v=2"
              alt="bazara.in Logo"
              className="w-8 h-8 rounded-xl object-contain shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform"
            />
            <div className="flex items-baseline space-x-1">
              <span className="font-extrabold text-xl tracking-tight text-primary-theme uppercase group-hover:text-emerald-500 transition-colors">
                bazara
              </span>
              <span className="text-xs font-bold text-emerald-500 dark:text-emerald-400">.in</span>
            </div>
          </div>

          {/* Desktop Search Bar */}
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-lg relative">
            <Search className="absolute left-4 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (onSearch) onSearch(e.target.value);
              }}
              placeholder="Search 5,000+ reels, video courses, tools..."
              className="w-full pl-11 pr-10 py-2 rounded-full glass-panel bg-white/[0.03] dark:bg-white/[0.03] text-sm text-primary-theme placeholder:text-slate-400 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  if (onSearch) onSearch('');
                }}
                className="absolute right-3 top-2.5 p-0.5 rounded-full text-slate-400 hover:text-primary-theme"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>

          {/* Desktop Navigation Links */}
          <nav className="flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => onNavigate(link.id)}
                  className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    isActive 
                      ? 'text-emerald-500 dark:text-emerald-400 bg-emerald-500/10 shadow-sm' 
                      : 'text-secondary-theme hover:text-primary-theme hover:bg-black/[0.04] dark:hover:bg-white/[0.04]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" strokeWidth={1.75} />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Desktop Auth / User Button & Theme Toggle */}
          <div className="flex items-center space-x-3 shrink-0">
            {/* Theme Toggle Button */}
            {toggleTheme && (
              <button
                onClick={toggleTheme}
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                className="w-9 h-9 rounded-full flex items-center justify-center border border-[var(--border-subtle)] bg-[var(--bg-card)] hover:border-emerald-500/40 text-secondary-theme hover:text-primary-theme shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" strokeWidth={2} />
                ) : (
                  <Moon className="w-4 h-4 text-indigo-500" strokeWidth={2} />
                )}
              </button>
            )}

            {user ? (
              <button 
                onClick={() => onNavigate('dashboard')}
                className="flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-bold glass-btn text-primary-theme transition-all cursor-pointer hover:scale-105"
              >
                <User className="w-4 h-4 text-emerald-500 dark:text-emerald-400" strokeWidth={1.75} />
                <span>My Vault</span>
              </button>
            ) : (
              <button 
                onClick={onOpenLogin}
                className="px-5 py-2 rounded-full text-xs font-extrabold uppercase tracking-wider bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 shadow-[0_0_18px_rgba(16,185,129,0.3)] hover:shadow-[0_0_24px_rgba(16,185,129,0.45)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                LOGIN
              </button>
            )}
          </div>
        </div>

        {/* Mobile Header Layout (< 768px) */}
        <div className="block md:hidden space-y-2.5">
          <div className="flex items-center justify-between px-3.5 py-2 rounded-2xl glass-panel shadow-lg">
            <div 
              onClick={() => onNavigate('home')}
              className="flex items-center space-x-2 cursor-pointer group"
            >
              <img
                src="/logo.png?v=2"
                alt="bazara.in Logo"
                className="w-7 h-7 rounded-lg object-contain shadow-sm shadow-emerald-500/20"
              />
              <div className="flex items-baseline space-x-1">
                <span className="font-extrabold text-base tracking-tight text-primary-theme uppercase group-hover:text-emerald-500 transition-colors">
                  bazara
                </span>
                <span className="text-[10px] font-bold text-emerald-500 dark:text-emerald-400">.in</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* Theme Toggle Button Mobile */}
              {toggleTheme && (
                <button
                  onClick={toggleTheme}
                  aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                  className="w-8 h-8 rounded-full flex items-center justify-center border border-[var(--border-subtle)] bg-[var(--bg-card)] text-secondary-theme hover:text-primary-theme shadow-sm transition-all active:scale-90 cursor-pointer"
                >
                  {theme === 'dark' ? (
                    <Sun className="w-3.5 h-3.5 text-amber-400" strokeWidth={2} />
                  ) : (
                    <Moon className="w-3.5 h-3.5 text-indigo-500" strokeWidth={2} />
                  )}
                </button>
              )}

              {user ? (
                <button 
                  onClick={() => onNavigate('dashboard')}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold glass-btn text-primary-theme transition-all"
                >
                  <User className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" strokeWidth={1.75} />
                  <span>My Vault</span>
                </button>
              ) : (
                <button 
                  onClick={onOpenLogin}
                  className="px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 shadow-[0_0_16px_rgba(16,185,129,0.3)] active:scale-95 transition-all cursor-pointer"
                >
                  LOGIN
                </button>
              )}
            </div>
          </div>

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
                className="w-full pl-11 pr-10 py-2 rounded-full glass-panel bg-white/[0.03] dark:bg-white/[0.03] text-sm text-primary-theme placeholder:text-slate-400 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    if (onSearch) onSearch('');
                  }}
                  className="absolute right-3 p-1 rounded-full text-slate-400 hover:text-primary-theme"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </header>
  );
}

