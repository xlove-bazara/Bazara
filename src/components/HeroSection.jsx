import React from 'react';
import { Star, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export default function HeroSection({ onExploreClick }) {
  return (
    <section className="px-4 py-2">
      <div className="relative overflow-hidden rounded-3xl p-6 glass-card-luxury shadow-2xl">
        {/* Ambient background glow */}
        <div className="absolute -top-16 -right-16 w-52 h-52 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-52 h-52 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative space-y-4">
          {/* Top Trust Badge matching reference photo */}
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-950/70 border border-indigo-500/30 text-indigo-300">
            <Star className="w-3.5 h-3.5 fill-indigo-400 text-indigo-400" />
            <span>4.9/5 from 25,000+ Creators</span>
          </div>

          {/* Main Title matching reference photo */}
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
            Viral Content & Skills <br />
            <span className="italic font-black text-emerald-400">on Autopilot.</span>
          </h1>

          {/* Subtext matching reference photo */}
          <p className="text-sm text-slate-300 leading-relaxed max-w-sm">
            Access premium templates, hooks, and AI tools used by top creators. Instantly delivered to your Google Drive.
          </p>

          {/* Primary CTA Button matching reference photo */}
          <div className="pt-2">
            <button
              onClick={onExploreClick}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-full text-sm font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/30 active:scale-[0.98] transition-all"
            >
              <span>Get Full Access</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-[11px] text-slate-400 font-medium">
            <span className="flex items-center">
              <Zap className="w-3 h-3 mr-1 text-emerald-400" /> Instant Access
            </span>
            <span className="flex items-center">
              <ShieldCheck className="w-3 h-3 mr-1 text-emerald-400" /> 100% Commercial PLR
            </span>
            <span>♾️ Lifetime Updates</span>
          </div>
        </div>
      </div>
    </section>
  );
}
