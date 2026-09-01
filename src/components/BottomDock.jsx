import React from 'react';
import { Home, Compass, Tag, FolderDown, ShieldAlert } from 'lucide-react';

export default function BottomDock({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'deals', label: 'Deals', icon: Tag },
    { id: 'library', label: 'Vault', icon: FolderDown },
    { id: 'admin', label: 'Admin', icon: ShieldAlert }
  ];

  return (
    <nav className="fixed bottom-3 left-0 right-0 z-40 px-4 pointer-events-none">
      <div className="max-w-xs mx-auto glass-dock rounded-full px-4 py-2.5 flex items-center justify-around pointer-events-auto border border-white/10 shadow-2xl backdrop-blur-2xl">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center justify-center p-1 rounded-full transition-all duration-200 ${
                isActive ? 'text-emerald-400 scale-110' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-5 h-5" />
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-0.5 shadow-sm shadow-emerald-400/80" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
