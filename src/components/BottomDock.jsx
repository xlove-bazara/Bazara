import React from 'react';
import { Home, Flame, FolderDown, ShieldCheck } from 'lucide-react';

export default function BottomDock({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'home', label: 'Store', icon: Home },
    { id: 'deals', label: 'Flash Deals', icon: Flame },
    { id: 'library', label: 'My Downloads', icon: FolderDown },
    { id: 'admin', label: 'Admin Panel', icon: ShieldCheck }
  ];

  return (
    <nav className="fixed bottom-3 left-0 right-0 z-40 px-4 pointer-events-none">
      <div className="max-w-sm mx-auto glass-dock rounded-2xl px-3 py-2 flex items-center justify-around pointer-events-auto border border-white/10 shadow-2xl backdrop-blur-2xl bg-[#0c0f1a]/95">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'text-emerald-400 bg-white/[0.05]' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]'
              }`}
            >
              <Icon className={`w-4 h-4 mb-0.5 ${isActive ? 'text-emerald-400 stroke-[2.5]' : 'text-slate-400'}`} />
              <span className={`text-[10px] font-bold tracking-tight ${isActive ? 'text-emerald-400' : 'text-slate-400'}`}>
                {tab.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-emerald-400 mt-0.5 shadow-sm shadow-emerald-400/80" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
