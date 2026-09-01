import React from 'react';
import { Star, ArrowRight, ShieldCheck, Zap, Video, CheckCircle, ExternalLink, GraduationCap } from 'lucide-react';

export default function HeroSection({ featuredCourse, onEnroll, onViewCourse }) {
  const course = featuredCourse || {
    id: 'prod-course-ai',
    title: 'Website Development with AI Masterclass',
    price: 499,
    original_price: 3999,
    discount_percentage: 88,
    cover_image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop&q=80'
  };

  return (
    <section className="px-1 py-1">
      <div className="relative overflow-hidden rounded-3xl p-5 sm:p-7 glass-card-luxury border border-emerald-500/30 shadow-2xl bg-gradient-to-br from-[#0e1424] via-[#0b0f1a] to-[#08090e]">
        {/* Ambient background glows */}
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Text & Pitch Column */}
          <div className="lg:col-span-7 space-y-4">
            {/* Top Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping mr-0.5" />
                <span>OFFICIAL ROOT MASTERCLASS</span>
              </div>
              <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/[0.05] border border-white/10 text-slate-300">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>4.9/5 (25,000+ Enrolled)</span>
              </div>
            </div>

            {/* Course Title */}
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white leading-tight">
                {course.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                Zero coding headache se live production website banana seekhein in just 7 days using AI Tools (Cursor, ChatGPT & Vercel). Instant 1-Second Google Drive Access.
              </p>
            </div>

            {/* Pricing Strip */}
            <div className="flex items-baseline space-x-3 py-1">
              <span className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight">
                ₹{course.price || 499}
              </span>
              {course.original_price && (
                <span className="text-sm text-slate-500 line-through font-semibold">
                  ₹{course.original_price}
                </span>
              )}
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-rose-500/20 text-rose-300 border border-rose-500/30">
                FLAT {course.discount_percentage || 88}% OFF
              </span>
            </div>

            {/* Key Curriculum Bullet Points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300 font-medium pt-1">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>5 Modules • 18 Full HD Lessons</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Pre-built Source Code & Templates</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Lifetime Google Drive Access</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Verified bazara.in Certificate</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={onEnroll}
                className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-xl shadow-emerald-500/30 active:scale-[0.98] transition-all cursor-pointer btn-shine-effect"
              >
                <span>ENROLL IN COURSE NOW ₹{course.price || 499}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onViewCourse}
                className="inline-flex items-center justify-center space-x-1.5 px-4 py-3 rounded-2xl text-xs font-bold bg-white/[0.06] hover:bg-white/10 text-white border border-white/10 transition-all cursor-pointer"
              >
                <GraduationCap className="w-4 h-4 text-emerald-400" />
                <span>View Full Curriculum ↗</span>
              </button>
            </div>
          </div>

          {/* Right Visual Image & Video Preview Column */}
          <div className="lg:col-span-5">
            <div 
              onClick={onViewCourse}
              className="group relative rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-slate-900 cursor-pointer aspect-video sm:aspect-[4/3] lg:aspect-video"
            >
              <img
                src={course.cover_image || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop&q=80'}
                alt={course.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-between p-4">
                <div className="flex justify-between items-center">
                  <span className="px-2 py-0.5 rounded text-[10px] font-black bg-rose-600 text-white uppercase tracking-wider flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                    <span>Watch Trailer</span>
                  </span>
                  <span className="text-[10px] text-white/80 font-mono font-bold bg-black/50 px-2 py-0.5 rounded backdrop-blur-sm">
                    {course.course_details?.duration || '4.5 Hours'}
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Video className="w-5 h-5 fill-slate-950 ml-0.5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Click to Explore Course</span>
                    <span className="text-[10px] text-emerald-400 font-semibold">Includes Video Modules & Drive Vault</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Trust Strip */}
        <div className="mt-5 pt-3 border-t border-white/[0.08] flex items-center justify-between text-[11px] text-slate-400 font-medium flex-wrap gap-2">
          <span className="flex items-center">
            <Zap className="w-3.5 h-3.5 mr-1 text-emerald-400" /> Instant Access to Google Drive
          </span>
          <span className="flex items-center">
            <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-400" /> 100% Encrypted & Safe Razorpay Checkout
          </span>
          <span className="hidden sm:inline">♾️ Lifetime Video Access & Updates</span>
        </div>
      </div>
    </section>
  );
}
