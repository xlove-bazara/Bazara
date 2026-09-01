import React from 'react';
import { Sparkles, Zap, ShieldCheck, Download } from 'lucide-react';

export default function MarqueeTicker({ announcements }) {
  const items = announcements && announcements.length > 0
    ? announcements
    : [
        "⚡ FLASH SALE: UP TO 90% OFF ON VIRAL REELS & COURSES",
        "📁 1-SECOND INSTANT GOOGLE DRIVE ACCESS",
        "⭐ 25,000+ CREATORS TRUST BAZARA.IN",
        "♾️ LIFETIME COMMERCIAL RESELL RIGHTS (PLR)"
      ];

  // Duplicate list to create a seamless infinite loop
  const displayItems = [...items, ...items, ...items];

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-r from-[#0d101a] via-[#121626] to-[#0d101a] border-b border-white/[0.08] py-2 z-40">
      <div className="animate-marquee flex items-center space-x-8 text-xs font-semibold uppercase tracking-wider text-slate-300 select-none">
        {displayItems.map((text, idx) => (
          <div key={idx} className="flex items-center space-x-3 whitespace-nowrap">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Zap className="w-3 h-3 mr-1 fill-emerald-400" /> LIVE
            </span>
            <span className="text-slate-200">{text}</span>
            <span className="text-slate-600">•</span>
          </div>
        ))}
      </div>
    </div>
  );
}
