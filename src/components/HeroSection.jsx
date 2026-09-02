import React from 'react';
import { Star, ArrowRight, ShieldCheck, Zap, Video, CheckCircle, GraduationCap, Play } from 'lucide-react';

export default function HeroSection({ featuredCourse, onEnroll, onViewCourse }) {
  const course = featuredCourse || {
    id: 'prod-course-ai',
    title: 'Website Development with AI Masterclass',
    price: 499,
    original_price: 3999,
    discount_percentage: 88,
    cover_image: '/course-banner.jpg'
  };

  return (
    <section className="px-1 py-1">
      <div className="relative overflow-hidden rounded-3xl p-3.5 sm:p-6 md:p-8 glass-card-luxury border border-emerald-500/30 shadow-2xl bg-gradient-to-br from-[#0e1424] via-[#0b0f1a] to-[#08090e]">
        {/* Ambient background glows */}
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-6 lg:gap-8 items-center">
          
          {/* ================= 1. VIDEO / COVER IMAGE (Compact on mobile, Full on desktop) ================= */}
          <div className="order-1 lg:order-2 lg:col-span-5 lg:h-full flex flex-col justify-center">
            <div 
              onClick={onViewCourse}
              className="group relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/20 shadow-2xl bg-slate-950 cursor-pointer aspect-[2.2/1] sm:aspect-video lg:aspect-[4/3] lg:min-h-[340px] transition-all hover:border-emerald-500/50 hover:shadow-emerald-500/20"
            >
              <img
                src={course.cover_image || '/course-banner.jpg'}
                alt={course.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/20 flex flex-col justify-between p-2.5 sm:p-5">
                {/* Top Badges over image */}
                <div className="flex justify-between items-center">
                  <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg text-[9px] sm:text-[10px] font-black bg-rose-600 text-white uppercase tracking-wider flex items-center space-x-1 shadow-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                    <span>TRAILER</span>
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-emerald-300 font-mono font-bold bg-black/70 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg backdrop-blur-md border border-white/10 shadow-md">
                    {course.course_details?.duration || '8.5 Hours HD Video'}
                  </span>
                </div>

                {/* Big Centered Play Pulse Button */}
                <div className="flex items-center justify-center">
                  <div className="w-10 h-10 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full bg-emerald-500/90 text-slate-950 flex items-center justify-center shadow-xl shadow-emerald-500/50 group-hover:scale-110 transition-transform">
                    <Play className="w-4 h-4 sm:w-6 sm:h-6 lg:w-7 lg:h-7 fill-slate-950 ml-0.5" />
                  </div>
                </div>

                {/* Bottom Bar: Quick Label */}
                <div className="flex items-center justify-between bg-black/60 backdrop-blur-md px-2.5 py-1.5 sm:p-2.5 rounded-xl sm:rounded-2xl border border-white/10 text-[10px] sm:text-xs">
                  <span className="font-bold text-white truncate">Click to Watch Preview Video</span>
                  <span className="text-emerald-400 font-semibold hidden sm:inline">Drive Vault Included</span>
                </div>
              </div>
            </div>
          </div>


          {/* ================= 2. TITLE, PRICING & DETAILS ================= */}
          <div className="order-2 lg:order-1 lg:col-span-7 space-y-2.5 sm:space-y-4">
            {/* Top Verification Badges */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-extrabold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping mr-0.5" />
                <span>ROOT MASTERCLASS</span>
              </div>
              <div className="inline-flex items-center space-x-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold bg-white/[0.05] border border-white/10 text-slate-300">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>4.9/5 (25K+ Enrolled)</span>
              </div>
            </div>

            {/* Main Course Title & Compact Description */}
            <div>
              <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
                {course.title}
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-slate-300 mt-1 sm:mt-2 leading-relaxed line-clamp-2 sm:line-clamp-none max-w-2xl">
                Zero coding headache se live production website banana seekhein using AI Tools (Cursor, ChatGPT & Vercel). Instant 1-Second Drive Access.
              </p>
            </div>

            {/* Pricing Strip (Compact on Mobile) */}
            <div className="flex items-center space-x-2.5 sm:space-x-3.5 p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/[0.06] w-fit">
              <span className="text-xl sm:text-3xl lg:text-4xl font-black text-emerald-400 tracking-tight">
                ₹{course.price || 499}
              </span>
              {course.original_price && (
                <span className="text-xs sm:text-base text-slate-500 line-through font-semibold">
                  ₹{course.original_price}
                </span>
              )}
              <span className="px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-black bg-rose-500/20 text-rose-300 border border-rose-500/30">
                FLAT {course.discount_percentage || 88}% OFF
              </span>
            </div>

            {/* Key Curriculum Bullets (Compact 2-col Grid on Mobile) */}
            <div className="grid grid-cols-2 gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-slate-300 font-medium">
              <div className="flex items-center space-x-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">18 Full HD Lessons</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">Pre-built Templates</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">Lifetime Drive Access</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">Verified Certificate</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-1 sm:pt-2 flex items-center gap-2 sm:gap-3">
              <button
                onClick={onEnroll}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center space-x-1.5 px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-xl shadow-emerald-500/30 active:scale-[0.98] transition-all cursor-pointer btn-shine-effect"
              >
                <span>ENROLL NOW ₹{course.price || 499}</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              <button
                onClick={onViewCourse}
                className="inline-flex items-center justify-center space-x-1 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-[11px] sm:text-xs font-bold bg-white/[0.06] hover:bg-white/10 text-white border border-white/10 transition-all cursor-pointer shrink-0"
              >
                <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
                <span className="hidden sm:inline">View Full Curriculum ↗</span>
                <span className="sm:hidden">Curriculum ↗</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Trust Strip */}
        <div className="mt-3 sm:mt-5 pt-2 sm:pt-3 border-t border-white/[0.08] flex items-center justify-between text-[10px] sm:text-[11px] text-slate-400 font-medium flex-wrap gap-2">
          <span className="flex items-center">
            <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 text-emerald-400" /> Instant Access via Google Drive
          </span>
          <span className="hidden sm:flex items-center">
            <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-400" /> 100% Encrypted & Safe Checkout
          </span>
          <span className="hidden sm:inline">♾️ Lifetime Access & Updates</span>
        </div>
      </div>
    </section>
  );
}
