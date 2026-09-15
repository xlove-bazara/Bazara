import React from 'react';
import { Home, Flame, FolderDown, User } from 'lucide-react';

export default function BottomDock({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'home', label: 'Store', icon: Home },
    { id: 'deals', label: 'Deals', icon: Flame },
    { id: 'library', label: 'Downloads', icon: FolderDown },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full z-50 block md:hidden glass-dock bg-[var(--bg-dock)] backdrop-blur-2xl border-t border-[var(--border-subtle)] pb-[max(0.6rem,env(safe-area-inset-bottom))] pt-2 transition-colors">
      <div className="max-w-md mx-auto flex items-center justify-around px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 active:scale-90 cursor-pointer ${
                isActive 
                  ? 'text-emerald-500 dark:text-emerald-400 bg-emerald-500/10 shadow-sm scale-105' 
                  : 'text-secondary-theme hover:text-primary-theme'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 transition-transform duration-200 ${isActive ? 'text-emerald-500 dark:text-emerald-400 stroke-[2.2] scale-110' : 'text-secondary-theme'}`} strokeWidth={1.75} />
              <span className={`text-[10px] font-bold tracking-tight transition-colors duration-200 ${isActive ? 'text-emerald-500 dark:text-emerald-400 font-extrabold' : 'text-secondary-theme'}`}>
                {tab.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 mt-0.5 shadow-sm shadow-emerald-400 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

