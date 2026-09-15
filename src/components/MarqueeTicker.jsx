import React, { useState, useEffect } from 'react';

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
        "LIMITED ADMISSIONS: FLAT 88% OFF ON ALL MASTERCLASSES",
        "INSTANT 1-SECOND GOOGLE DRIVE VAULT ACCESS",
        "25,000+ ACTIVE CREATORS & DEVELOPERS ACROSS INDIA",
        "100% COMMERCIAL PLR RIGHTS & LIFETIME UPDATES"
      ];

  const displayItems = [...items, ...items, ...items];
  const timerString = `${String(timeLeft.hours).padStart(2, '0')}:${String(timeLeft.minutes).padStart(2, '0')}:${String(timeLeft.seconds).padStart(2, '0')}`;

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-r from-[#07130F] via-[#0A1813] to-[#070D11] py-1.5 sm:py-2 z-40 border-b border-emerald-500/15">
      <div className="animate-marquee flex items-center space-x-10 text-[11px] font-bold uppercase tracking-wider text-slate-200 select-none">
        {displayItems.map((text, idx) => (
          <div key={idx} className="flex items-center space-x-3 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)] inline-block" />
            <span className="text-slate-100 font-extrabold tracking-wide">{text}</span>
            <span className="text-slate-400 text-[10px] font-medium">• Offer closes in</span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-950/60 text-emerald-300 font-mono text-[11px] font-black border border-emerald-500/25 shadow-sm">
              {timerString}
            </span>
            <span className="text-slate-600 ml-2">•</span>
          </div>
        ))}
      </div>
    </div>
  );
}

