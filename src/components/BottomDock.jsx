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
    <nav className="fixed bottom-0 left-0 right-0 z-40 block md:hidden glass-dock bg-[#090b14]/75 backdrop-blur-2xl border-t border-white/10 pb-2 pt-2">
      <div className="max-w-md mx-auto flex items-center justify-around px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'text-emerald-400 bg-white/[0.05]' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-emerald-400 stroke-[2.5]' : 'text-slate-400'}`} />
              <span className={`text-[10px] font-bold tracking-tight ${isActive ? 'text-emerald-400' : 'text-slate-400'}`}>
                {tab.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-0.5 shadow-sm shadow-emerald-400" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
