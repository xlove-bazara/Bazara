import React from 'react';
import { Flame, Film, GraduationCap, Laptop, BookOpen, Crown } from 'lucide-react';

const categories = [
  { id: 'all', label: 'All Assets', icon: Flame, color: 'from-amber-500 to-rose-600' },
  { id: 'reels', label: 'Reel Bundle', icon: Film, color: 'from-emerald-400 to-cyan-500' },
  { id: 'course', label: 'Video Course', icon: GraduationCap, color: 'from-indigo-500 to-purple-600' },
  { id: 'subscription', label: 'Subscription', icon: Crown, color: 'from-amber-400 to-yellow-600' },
  { id: 'software', label: 'Software', icon: Laptop, color: 'from-blue-500 to-indigo-500' },
  { id: 'ebook', label: 'E-Book', icon: BookOpen, color: 'from-purple-500 to-pink-500' }
];


export default function StoryCategories({ selectedCategory, onSelectCategory }) {
  return (
    <div className="w-full overflow-x-auto no-scrollbar py-3 px-4">
      <div className="flex items-center space-x-4 md:space-x-6 min-w-max md:min-w-0 md:justify-center">
        {categories.map((cat) => {

          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="flex flex-col items-center space-y-1.5 focus:outline-none group active:scale-95 transition-transform"
            >
              {/* Glowing circular container */}
              <div
                className={`relative w-14 h-14 rounded-full p-[2px] transition-all duration-300 ${
                  isSelected
                    ? 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-[#08090E] scale-105'
                    : 'group-hover:scale-105'
                }`}
              >
                <div
                  className={`w-full h-full rounded-full flex items-center justify-center bg-[#111420] border ${
                    isSelected ? 'border-emerald-400' : 'border-white/10'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-tr ${cat.color} text-white shadow-inner`}
                  >
                    <Icon className="w-5 h-5 drop-shadow-sm" />
                  </div>
                </div>

                {cat.isHot && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                  </span>
                )}
              </div>

              {/* Label */}
              <span
                className={`text-[11px] font-medium tracking-tight whitespace-nowrap transition-colors ${
                  isSelected ? 'text-emerald-400 font-bold' : 'text-slate-400 group-hover:text-slate-200'
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
