import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Share2, 
  Heart, 
  Star, 
  Zap, 
  FolderDown, 
  ShieldCheck, 
  Play, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Download, 
  Clock, 
  Layers, 
  BookOpen, 
  Monitor, 
  Award,
  Sparkles
} from 'lucide-react';
import VideoModal from '../components/VideoModal';

export default function ProductDetailPage({ 
  product, 
  onBack, 
  onBuyNow 
}) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeReelModal, setActiveReelModal] = useState(null);
  const [openAccordion, setOpenAccordion] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  if (!product) return null;

  const gallery = product.gallery_images && product.gallery_images.length > 0 
    ? product.gallery_images 
    : [product.cover_image];

  // 4 sample reels for the 2x2 grid
  const reels = product.sample_reels && product.sample_reels.length >= 4 
    ? product.sample_reels 
    : [
        { id: "r1", title: "4K Viral Sample", views: "1.2M Views", type: "Sample Reel", thumbnail: product.cover_image },
        { id: "r2", title: "Luxury Aesthetic", views: "850K Views", type: "Sample Reel", thumbnail: product.cover_image },
        { id: "r3", title: "Customer Video Review", views: "★ 5.0 Verified", type: "Customer Proof", thumbnail: product.cover_image },
        { id: "r4", title: "High Retention Hook", views: "2.1M Views", type: "Sample Reel", thumbnail: product.cover_image }
      ];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: `Check out ${product.title} on bazara.in!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Product link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen pb-32 bg-[#08090E] text-slate-100 selection:bg-emerald-500/30">
      {/* Top Floating Glass Navigation */}
      <header className="sticky top-0 z-30 px-4 py-3 backdrop-blur-xl bg-[#08090E]/80 border-b border-white/[0.06]">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="p-2 rounded-full glass-panel text-slate-300 hover:text-white border border-white/10 active:scale-95 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">
            {product.category} details
          </span>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-full glass-panel text-slate-300 hover:text-white border border-white/10 active:scale-95 transition-all"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              className="p-2 rounded-full glass-panel text-slate-300 hover:text-rose-500 border border-white/10 active:scale-95 transition-all"
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pt-3 space-y-5">
        {/* 1. Main Media Showcase + Thumbnail Slider Below It */}
        <section className="space-y-2.5">
          {/* Main Big Image Preview */}
          <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden glass-panel border border-white/15 bg-slate-950 shadow-2xl">
            <img
              src={gallery[activeImageIndex]}
              alt={product.title}
              className="w-full h-full object-cover transition-all duration-300"
            />
            {/* G-Drive Badge */}
            <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-xs font-bold text-slate-200 flex items-center space-x-1.5 shadow-md">
              <FolderDown className="w-3.5 h-3.5 text-emerald-400" />
              <span>Instant Google Drive</span>
            </div>

            {/* Discount Badge */}
            {product.discount_percentage && (
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-emerald-500 text-xs font-black text-slate-950 shadow-lg">
                SAVE {product.discount_percentage}%
              </div>
            )}
          </div>

          {/* Horizontal Thumbnail Slider (Swipe / Click to change main image) */}
          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
            {gallery.map((imgUrl, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                  activeImageIndex === idx
                    ? 'border-emerald-400 ring-2 ring-emerald-400/40 scale-105'
                    : 'border-white/10 opacity-70 hover:opacity-100'
                }`}
              >
                <img src={imgUrl} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </section>

        {/* 2. Product Title & Pricing Box */}
        <section className="p-4 rounded-3xl glass-panel border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent space-y-3">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              {product.tag || 'VERIFIED ASSET'}
            </span>
            <div className="flex items-center space-x-1 text-xs text-amber-400 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{product.rating}</span>
              <span className="text-slate-400 font-normal">({product.reviews_count} reviews)</span>
            </div>
          </div>

          <h1 className="text-lg font-black text-white leading-snug">
            {product.title}
          </h1>

          {/* Pricing Row */}
          <div className="flex items-baseline space-x-3 pt-1">
            <span className="text-2xl font-black text-emerald-400">
              ₹{product.price}
            </span>
            {product.original_price && (
              <span className="text-sm text-slate-400 line-through">
                ₹{product.original_price}
              </span>
            )}
            <span className="text-xs font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20">
              Limited Time Price
            </span>
          </div>

          {/* Quick Trust Chips */}
          <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-[11px] text-slate-300 font-medium">
            <span className="flex items-center">
              <Zap className="w-3.5 h-3.5 mr-1 text-emerald-400" /> 1-Tap G-Drive
            </span>
            <span className="flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-400" /> Lifetime Updates
            </span>
            <span className="flex items-center">
              <Award className="w-3.5 h-3.5 mr-1 text-emerald-400" /> 100% Commercial PLR
            </span>
          </div>
        </section>

        {/* 3. ⭐ KHAAS FEATURE: 2x2 Reels Showcase Grid (4 Vertical 9:16 Cards in 2 Rows x 2 Columns) */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <h2 className="text-sm font-black uppercase tracking-wider text-white">
                Live Video Samples & Proof
              </h2>
            </div>
            <span className="text-[11px] text-slate-400">Tap to play</span>
          </div>

          {/* 2x2 Grid (Exact 2 columns and 2 rows) */}
          <div className="grid grid-cols-2 gap-2.5">
            {reels.slice(0, 4).map((reel, index) => (
              <div
                key={reel.id || index}
                onClick={() => setActiveReelModal(reel)}
                className="group relative aspect-reel rounded-2xl overflow-hidden glass-panel border border-white/15 bg-slate-950 cursor-pointer shadow-lg active:scale-95 transition-all"
              >
                {/* 9:16 Vertical Thumbnail */}
                <img
                  src={reel.thumbnail}
                  alt={reel.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                {/* Play Button in Center */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all shadow-md">
                    <Play className="w-5 h-5 fill-current translate-x-0.5" />
                  </div>
                </div>

                {/* Top Badge */}
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[9px] font-bold text-slate-200 border border-white/10">
                  {reel.type || 'Preview'}
                </div>

                {/* Bottom Overlay Label */}
                <div className="absolute bottom-2 left-2 right-2 space-y-0.5 pointer-events-none">
                  <p className="text-[11px] font-bold text-white leading-tight line-clamp-1">
                    {reel.title}
                  </p>
                  <p className="text-[10px] font-semibold text-emerald-400">
                    {reel.views}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Dynamic Content Section (Adapts based on Product Type) */}

        {/* A. If Reels Bundle */}
        {product.product_type === 'reels' && product.reels_details && (
          <section className="p-4 rounded-3xl glass-panel border border-white/10 space-y-3 bg-[#0d101d]">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Reels Pack Specifications</span>
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                <span className="text-[10px] text-slate-400 block">Total Reels</span>
                <span className="font-bold text-slate-200">{product.reels_details.total_count}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                <span className="text-[10px] text-slate-400 block">Quality</span>
                <span className="font-bold text-emerald-400">{product.reels_details.resolution}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                <span className="text-[10px] text-slate-400 block">Watermark</span>
                <span className="font-bold text-slate-200">{product.reels_details.watermark}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                <span className="text-[10px] text-slate-400 block">Commercial License</span>
                <span className="font-bold text-emerald-400">{product.reels_details.rights}</span>
              </div>
            </div>

            {product.reels_details.folder_categories && (
              <div className="pt-2 space-y-1.5">
                <span className="text-[11px] font-bold text-slate-300">📁 Google Drive Folders Included:</span>
                <div className="space-y-1 text-xs text-slate-400">
                  {product.reels_details.folder_categories.map((folder, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{folder}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* B. If Course */}
        {product.product_type === 'course' && product.course_details && (
          <section className="p-4 rounded-3xl glass-panel border border-white/10 space-y-3 bg-[#0d101d]">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>Course Curriculum & Lessons</span>
            </h3>

            <div className="p-2.5 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-xs text-slate-300 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">Instructor: {product.course_details.instructor}</span>
                <span className="text-[11px] text-indigo-300">{product.course_details.duration} • {product.course_details.modules_count}</span>
              </div>
              <Award className="w-6 h-6 text-indigo-400 shrink-0" />
            </div>

            {/* Curriculum Accordion */}
            <div className="space-y-2 pt-1">
              {product.course_details.curriculum?.map((module, idx) => {
                const isOpen = openAccordion === idx;
                return (
                  <div key={idx} className="rounded-2xl border border-white/[0.08] overflow-hidden bg-white/[0.02]">
                    <button
                      onClick={() => setOpenAccordion(isOpen ? -1 : idx)}
                      className="w-full p-3 text-left flex items-center justify-between text-xs font-bold text-slate-200"
                    >
                      <span>{module.title}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] text-slate-400 font-normal">{module.duration}</span>
                        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </button>
                    {isOpen && (
                      <div className="px-3 pb-3 pt-1 space-y-1.5 border-t border-white/[0.05] text-[11px] text-slate-400">
                        {module.lessons?.map((lesson, lIdx) => (
                          <div key={lIdx} className="flex items-center space-x-2">
                            <Play className="w-3 h-3 text-emerald-400 shrink-0" />
                            <span>{lesson}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* C. If E-Book */}
        {product.product_type === 'ebook' && product.ebook_details && (
          <section className="p-4 rounded-3xl glass-panel border border-white/10 space-y-3 bg-[#0d101d]">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>E-Book Blueprint Overview</span>
            </h3>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                <span className="text-[10px] text-slate-400 block">Length</span>
                <span className="font-bold text-slate-200">{product.ebook_details.pages_count}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                <span className="text-[10px] text-slate-400 block">Format</span>
                <span className="font-bold text-emerald-400">{product.ebook_details.format}</span>
              </div>
            </div>

            <div className="pt-2 space-y-1.5">
              <span className="text-[11px] font-bold text-slate-300">📑 Chapters Included:</span>
              <div className="space-y-1 text-xs text-slate-400">
                {product.ebook_details.chapters?.map((chap, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{chap}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* D. If Software */}
        {product.product_type === 'software' && product.software_details && (
          <section className="p-4 rounded-3xl glass-panel border border-white/10 space-y-3 bg-[#0d101d]">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Monitor className="w-4 h-4 text-emerald-400" />
              <span>Software License Details</span>
            </h3>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                <span className="text-[10px] text-slate-400 block">Platforms</span>
                <span className="font-bold text-slate-200">{product.software_details.platforms}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                <span className="text-[10px] text-slate-400 block">License Validity</span>
                <span className="font-bold text-emerald-400">{product.software_details.license_type}</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-300">
              ⚡ {product.software_details.activation}
            </div>
          </section>
        )}

        {/* 5. Features Checklist */}
        <section className="p-4 rounded-3xl glass-panel border border-white/10 space-y-2.5">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-300">
            What's Included in This Bundle
          </h3>
          <div className="space-y-2 text-xs text-slate-300">
            {product.features?.map((feat, idx) => (
              <div key={idx} className="flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 6. FAQ Accordion */}
        <section className="p-4 rounded-3xl glass-panel border border-white/10 space-y-2.5">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-300">
            Frequently Asked Questions
          </h3>
          <div className="space-y-2 text-xs text-slate-400">
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-1">
              <p className="font-bold text-white">Q: Payment ke baad link kahan milegi?</p>
              <p>A: Payment hote hi agle page par 1-tap Google Drive button aayega, aur tumhare WhatsApp & Email par bhi link instantly deliver hogi.</p>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-1">
              <p className="font-bold text-white">Q: Kya phone me reels save kar sakte hain?</p>
              <p>A: Haan! Chahe iPhone ho ya Android, direct download karke bina watermark ke Instagram/YouTube par upload kar sakte ho.</p>
            </div>
          </div>
        </section>
      </main>

      {/* 7. ⭐ BOTTOM FLOATING STICKY BAR WITH ANIMATED SHINING BUY BUTTON */}
      <div className="fixed bottom-0 left-0 right-0 z-40 p-3 backdrop-blur-2xl bg-[#090b12]/90 border-t border-white/10 shadow-2xl">
        <div className="max-w-md mx-auto flex items-center justify-between space-x-3">
          {/* Left Price Info */}
          <div className="pl-1">
            <div className="flex items-baseline space-x-1.5">
              <span className="text-lg font-black text-emerald-400">₹{product.price}</span>
              {product.original_price && (
                <span className="text-xs text-slate-400 line-through">₹{product.original_price}</span>
              )}
            </div>
            <span className="text-[10px] text-slate-400 flex items-center">
              <FolderDown className="w-3 h-3 mr-1 text-emerald-400" /> Instant G-Drive
            </span>
          </div>

          {/* Right Shining Animated Button */}
          <button
            onClick={() => onBuyNow(product)}
            className="relative flex-1 overflow-hidden py-3.5 px-4 rounded-full font-black text-xs uppercase tracking-wider text-slate-950 bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-400 shadow-xl shadow-emerald-500/30 active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
          >
            {/* CONTINUOUS SHINING / SHIMMER LIGHT-SWEEP ANIMATION */}
            <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/80 to-transparent animate-shimmer-sweep pointer-events-none" />

            <span className="relative z-10 font-black">BUY NOW - INSTANT ACCESS 🚀</span>
            <Zap className="relative z-10 w-4 h-4 fill-slate-950" />
          </button>
        </div>
      </div>

      {/* Fullscreen Video Modal for 2x2 Reels */}
      <VideoModal
        reel={activeReelModal}
        onClose={() => setActiveReelModal(null)}
        onBuyClick={() => {
          setActiveReelModal(null);
          onBuyNow(product);
        }}
      />
    </div>
  );
}
