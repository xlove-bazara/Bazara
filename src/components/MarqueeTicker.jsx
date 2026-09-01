import React, { useState, useEffect } from 'react';
import { Zap } from 'lucide-react';

export default function MarqueeTicker({ announcements }) {
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 48, seconds: 11 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 2, minutes: 48, seconds: 11 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const items = announcements && announcements.length > 0
    ? announcements
    : [
        "⚡ SPECIAL ADMISSIONS OPEN: FLAT 88% OFF ON ALL MASTERCLASSES",
        "📁 1-SECOND INSTANT GOOGLE DRIVE VAULT ACCESS",
        "⭐ 25,000+ CREATORS & LEARNERS ENROLLED ON BAZARA.IN",
        "♾️ 100% COMMERCIAL RIGHTS & LIFETIME FREE UPDATES"
      ];

  const displayItems = [...items, ...items, ...items];
  const timerString = `${String(timeLeft.hours).padStart(2, '0')}:${String(timeLeft.minutes).padStart(2, '0')}:${String(timeLeft.seconds).padStart(2, '0')}`;

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 shadow-md py-1.5 sm:py-2 z-40 border-b border-white/10">
      <div className="animate-marquee flex items-center space-x-8 text-[11px] sm:text-xs font-black uppercase tracking-wider text-white select-none">
        {displayItems.map((text, idx) => (
          <div key={idx} className="flex items-center space-x-2.5 whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-amber-300 animate-ping inline-block" />
            <span className="text-white drop-shadow-sm">{text}</span>
            <span className="text-emerald-200 text-[10px] font-bold">• Offer ends in</span>
            <span className="px-1.5 py-0.5 rounded bg-black/40 text-amber-200 font-mono text-[11px] font-black border border-black/20 shadow-sm">
              {timerString}
            </span>
            <span className="text-white/40 ml-2">•</span>
          </div>
        ))}
      </div>
    </div>
  );
}
