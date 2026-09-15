import React from 'react';
import { Layers, Video, GraduationCap, Sparkles, Cpu, BookOpen } from 'lucide-react';

const categories = [
  { id: 'all', label: 'All Packs', icon: Layers },
  { id: 'reels', label: 'Reel Bundle', icon: Video },
  { id: 'course', label: 'Video Course', icon: GraduationCap },
  { id: 'subscription', label: 'VIP Pass', icon: Sparkles },
  { id: 'software', label: 'Software', icon: Cpu },
  { id: 'ebook', label: 'E-Books', icon: BookOpen }
];

export default function StoryCategories({ selectedCategory, onSelectCategory }) {
  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2 px-1">
      <div className="flex items-center space-x-3 sm:space-x-5 min-w-max md:min-w-0 md:justify-center">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="flex flex-col items-center space-y-1.5 focus:outline-none group active:scale-95 transition-all cursor-pointer"
            >
              {/* Refined outline circular container */}
              <div
                className={`relative w-13 h-13 sm:w-14 sm:h-14 rounded-2xl p-[1px] flex items-center justify-center transition-all duration-200 ${
                  isSelected
                    ? 'bg-gradient-to-b from-emerald-400 to-teal-500 shadow-[0_0_16px_rgba(16,185,129,0.35)] scale-105'
                    : 'bg-[var(--border-subtle)] hover:bg-emerald-500/30'
                }`}
              >
                <div
                  className={`w-full h-full rounded-[15px] flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'bg-[var(--bg-card)] text-emerald-500 dark:text-emerald-400'
                      : 'bg-[var(--bg-card)] text-secondary-theme group-hover:text-primary-theme group-hover:bg-[var(--bg-card-hover)]'
                  }`}
                >
                  <Icon className="w-5 h-5" strokeWidth={1.75} />
                </div>
              </div>

              {/* Label */}
              <span
                className={`text-[11px] font-bold tracking-tight whitespace-nowrap transition-colors ${
                  isSelected 
                    ? 'text-emerald-500 dark:text-emerald-400 font-extrabold' 
                    : 'text-secondary-theme group-hover:text-primary-theme'
                }`}
              >
                {cat.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

