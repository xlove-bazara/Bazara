import React from 'react';
import { Star, ArrowRight, ShieldCheck, Zap, CheckCircle, GraduationCap, Play } from 'lucide-react';

export default function HeroSection({ featuredCourse, onEnroll, onViewCourse }) {
  const course = featuredCourse || {
    id: 'prod-course-ai',
    title: 'Full-Stack App & Website Development with AI Masterclass',
    price: 499,
    original_price: 3999,
    discount_percentage: 88,
    cover_image: '/course-banner.jpg'
  };

  return (
    <section className="px-0 py-1">
      <div className="relative overflow-hidden rounded-3xl p-4 sm:p-7 md:p-9 bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-2xl transition-colors">
        {/* Subtle ambient lighting */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-7 lg:gap-10 items-center">
          
          {/* ================= 1. VIDEO / COVER IMAGE ================= */}
          <div className="order-1 lg:order-2 lg:col-span-5 lg:h-full flex flex-col justify-center">
            <div 
              onClick={onViewCourse}
              className="group relative rounded-2xl sm:rounded-3xl overflow-hidden border border-[var(--border-subtle)] shadow-2xl bg-black/40 cursor-pointer aspect-[2.1/1] sm:aspect-video lg:aspect-[4/3] lg:min-h-[340px] transition-all hover:border-emerald-500/40 hover:shadow-[0_0_25px_rgba(16,185,129,0.2)]"
            >
              <img
                src={course.cover_image || '/course-banner.jpg'}
                alt={course.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/20 flex flex-col justify-between p-3 sm:p-5">
                {/* Top Badges over image */}
                <div className="flex justify-between items-center">
                  <span className="px-2.5 py-1 rounded-lg text-[9px] sm:text-[10px] font-black bg-rose-600 text-white uppercase tracking-wider flex items-center space-x-1 shadow-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                    <span>TRAILER</span>
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-emerald-300 font-mono font-bold bg-black/75 px-2.5 py-1 rounded-lg backdrop-blur-md border border-white/10 shadow-md">
                    {course.course_details?.duration || '8.5 Hours HD Video'}
                  </span>
                </div>

                {/* Big Centered Play Pulse Button */}
                <div className="flex items-center justify-center">
                  <div className="w-11 h-11 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 flex items-center justify-center shadow-xl shadow-emerald-500/50 group-hover:scale-110 transition-transform">
                    <Play className="w-4 h-4 sm:w-6 sm:h-6 lg:w-7 lg:h-7 fill-slate-950 ml-0.5" />
                  </div>
                </div>

                {/* Bottom Bar: Quick Label */}
                <div className="flex items-center justify-between bg-black/65 backdrop-blur-md px-3 py-1.5 sm:p-2.5 rounded-xl sm:rounded-2xl border border-white/10 text-[10px] sm:text-xs">
                  <span className="font-bold text-white truncate">Click to Watch Preview Video</span>
                  <span className="text-emerald-400 font-semibold hidden sm:inline">Drive Vault Included</span>
                </div>
              </div>
            </div>
          </div>

          {/* ================= 2. TITLE, PRICING & DETAILS ================= */}
          <div className="order-2 lg:order-1 lg:col-span-7 space-y-3.5 sm:space-y-5">
            {/* Top Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-[10px] sm:text-xs font-black bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 dark:text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping mr-1" />
                <span>ROOT MASTERCLASS</span>
              </div>
              <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold bg-[var(--bg-card-secondary)] border border-[var(--border-subtle)] text-secondary-theme">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>4.9/5 (25K+ Enrolled)</span>
              </div>
            </div>

            {/* Main Course Title with Satoshi Font & Clean Body with Inter */}
            <div>
              <h1 className="font-heading text-xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-primary-theme leading-tight">
                {course.title}
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-secondary-theme mt-2 leading-relaxed line-clamp-2 sm:line-clamp-none max-w-2xl font-normal">
                Zero coding headache se live production mobile apps & websites banana seekhein using AI Tools (Cursor, ChatGPT & Vercel). Instant 1-Second Drive Access.
              </p>
            </div>

            {/* Pricing Row */}
            <div className="flex items-center space-x-3 p-2.5 sm:p-3 rounded-2xl bg-[var(--bg-card-secondary)] border border-[var(--border-subtle)] w-fit">
              <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-emerald-500 dark:text-emerald-400 tracking-tight font-heading">
                ₹{course.price || 499}
              </span>
              {course.original_price && (
                <span className="text-xs sm:text-base text-muted-theme line-through font-semibold">
                  ₹{course.original_price}
                </span>
              )}
              <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-black bg-rose-500/15 text-rose-500 dark:text-rose-400 border border-rose-500/25">
                FLAT {course.discount_percentage || 88}% OFF
              </span>
            </div>

            {/* Key Curriculum Bullets */}
            <div className="grid grid-cols-2 gap-2 text-[11px] sm:text-xs text-secondary-theme font-medium">
              <div className="flex items-center space-x-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" strokeWidth={2} />
                <span className="truncate">18 Full HD Lessons</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" strokeWidth={2} />
                <span className="truncate">Pre-built Templates</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" strokeWidth={2} />
                <span className="truncate">Lifetime Drive Access</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" strokeWidth={2} />
                <span className="truncate">Verified Certificate</span>
              </div>
            </div>

            {/* Action Buttons: Green-to-Teal Gradient + Soft Glow + Scale Animation */}
            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={onEnroll}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center space-x-2 px-5 sm:px-7 py-3 sm:py-3.5 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.35)] hover:shadow-[0_0_26px_rgba(16,185,129,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer btn-shine-effect"
              >
                <span>ENROLL NOW ₹{course.price || 499}</span>
                <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
              </button>

              <button
                onClick={onViewCourse}
                className="inline-flex items-center justify-center space-x-1.5 px-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl text-xs font-bold bg-[var(--bg-card-secondary)] hover:bg-[var(--bg-card-hover)] text-primary-theme border border-[var(--border-subtle)] hover:border-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shrink-0"
              >
                <GraduationCap className="w-4 h-4 text-emerald-500 dark:text-emerald-400" strokeWidth={1.75} />
                <span className="hidden sm:inline">View Full Curriculum ↗</span>
                <span className="sm:hidden">Curriculum ↗</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Trust Strip */}
        <div className="mt-5 pt-3.5 border-t border-[var(--border-subtle)] flex items-center justify-between text-[10px] sm:text-[11px] text-muted-theme font-medium flex-wrap gap-2">
          <span className="flex items-center text-secondary-theme">
            <Zap className="w-3.5 h-3.5 mr-1.5 text-emerald-500 dark:text-emerald-400" strokeWidth={2} /> Instant Access via Google Drive
          </span>
          <span className="hidden sm:flex items-center text-secondary-theme">
            <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-emerald-500 dark:text-emerald-400" strokeWidth={2} /> 100% Encrypted & Safe Checkout
          </span>
          <span className="hidden sm:inline text-secondary-theme">♾️ Lifetime Access & Free Updates</span>
        </div>
      </div>
    </section>
  );
}

