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
  Sparkles,
  Package,
  Cpu,
  Check
} from 'lucide-react';
import VideoModal from '../components/VideoModal';
import Header from '../components/Header';

export default function ProductDetailPage({ 
  product, 
  user,
  onNavigate,
  onOpenLogin,
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

  const getYouTubeThumbnail = (url) => {
    if (!url) return null;
    const regExp = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/;
    const match = url.match(regExp);
    return match && match[1] ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null;
  };

  // Only use actual sample reels configured for this product (with video_url or title)
  const rawReels = Array.isArray(product.sample_reels) ? product.sample_reels : [];
  const reels = rawReels
    .filter(r => (r.video_url && r.video_url.trim()) || (r.title && r.title.trim()))
    .map((r, idx) => ({
      ...r,
      id: r.id || `reel-${idx}`,
      thumbnail: (r.video_url && getYouTubeThumbnail(r.video_url)) || r.thumbnail || product.cover_image,
      type: r.type || 'Sample Reel'
    }));

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
    <div className="min-h-screen pb-32 bg-[#08090E] text-slate-100 selection:bg-emerald-500/30 relative overflow-hidden">
      {/* Luxury Ambient Orbs & Cyber Texture Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-10 left-1/4 w-[450px] h-[450px] bg-emerald-500/[0.08] rounded-full blur-[150px]" />
        <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-indigo-600/[0.08] rounded-full blur-[170px]" />
        <div className="absolute bottom-20 left-10 w-[400px] h-[400px] bg-violet-600/[0.06] rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:28px_28px] opacity-60" />
      </div>

      {/* Top Primary Header (Same as bazara.in/home) */}
      <Header 
        user={user} 
        onNavigate={onNavigate || onBack} 
        onOpenLogin={onOpenLogin} 
        activeTab="home" 
      />

      {/* Secondary Navigation & Breadcrumb Strip */}
      <div className="sticky top-[60px] md:top-[68px] z-20 px-4 md:px-8 py-2.5 backdrop-blur-xl bg-[#08090E]/85 border-b border-white/[0.06]">
        <div className="max-w-md md:max-w-4xl lg:max-w-5xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 flex items-center space-x-1.5 text-xs font-bold active:scale-95 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Store</span>
          </button>

          <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            {product.category} details
          </span>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 active:scale-95 transition-all cursor-pointer"
              title="Share Product"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/10 text-slate-300 hover:text-rose-500 border border-white/10 active:scale-95 transition-all cursor-pointer"
              title="Save to Wishlist"
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      <main className="relative z-10 max-w-md md:max-w-4xl lg:max-w-5xl mx-auto px-4 md:px-8 pt-4 space-y-6">
        {/* 1. Main Media Showcase + Thumbnail Slider Below It */}
        <section className="space-y-2.5">
          {/* Main Big Image Preview (4:3 Ratio) */}
          <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden glass-panel border border-white/15 bg-slate-950 shadow-2xl">
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

          {/* Horizontal Thumbnail Slider (4:3 Mini Previews) */}
          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
            {gallery.map((imgUrl, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative w-20 aspect-[4/3] rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
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

        {/* 3. Sample Video / Reels Showcase Grid (Dynamic: 1, 2, 3, 4, etc.) */}
        {reels.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <h2 className="text-sm font-black uppercase tracking-wider text-white">
                  Live Video Samples & Proof ({reels.length})
                </h2>
              </div>
              <span className="text-[11px] text-slate-400">Tap to play</span>
            </div>

            {/* Dynamic Grid: 1 column if 1 video, 2 columns if 2 or more videos */}
            <div className={`grid gap-2.5 ${reels.length === 1 ? 'grid-cols-1 max-w-xs mx-auto' : 'grid-cols-2'}`}>
              {reels.map((reel, index) => (
                <div
                  key={reel.id || index}
                  onClick={() => setActiveReelModal(reel)}
                  className="group relative aspect-reel rounded-2xl overflow-hidden glass-panel border border-white/15 bg-slate-950 cursor-pointer shadow-lg active:scale-95 transition-all"
                >
                  {/* 9:16 Vertical Thumbnail */}
                  <img
                    src={reel.thumbnail}
                    alt={reel.title || `Sample Video ${index + 1}`}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = product.cover_image;
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                  {/* Play Button in Center */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-11 h-11 rounded-full bg-white/25 backdrop-blur-md border border-white/30 flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all shadow-xl">
                      <Play className="w-5 h-5 fill-current translate-x-0.5" />
                    </div>
                  </div>

                  {/* Top Badge */}
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[9px] font-bold text-slate-200 border border-white/10">
                    {reel.type || 'Preview'}
                  </div>

                  {/* Bottom Overlay Label */}
                  <div className="absolute bottom-2 left-2 right-2 space-y-0.5 pointer-events-none">
                    <p className="text-[11px] font-bold text-white leading-tight line-clamp-1">
                      {reel.title || `Sample Video ${index + 1}`}
                    </p>
                    <p className="text-[10px] font-semibold text-emerald-400">
                      {reel.views || 'Tap to play'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 4. Specifications Card (Now on Top) */}
        <section className="p-5 rounded-3xl bg-[#131724] border border-white/[0.08] space-y-4 shadow-2xl shadow-black/50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Cpu className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-extrabold text-white tracking-tight">Specifications</h3>
          </div>

          <div className="border-b border-white/[0.08]" />

          {/* Clean 2x2 Grid matching reference */}
          <div className="grid grid-cols-2 gap-y-4 gap-x-4">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                {product.product_type === 'course' ? 'DURATION' : product.product_type === 'ebook' ? 'LENGTH' : 'RESOLUTION'}
              </span>
              <span className="text-sm font-extrabold text-white block">
                {product.course_details?.duration || 
                 product.ebook_details?.pages_count || 
                 product.reels_details?.resolution || 
                 '3840 × 2160 (4K UHD)'}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                FORMAT
              </span>
              <span className="text-sm font-extrabold text-white block">
                {product.product_type === 'course' 
                  ? 'HD Video Stream, MP4'
                  : product.ebook_details?.format || 
                    product.software_details?.platforms || 
                    product.reels_details?.software_support || 
                    '.MP4, .PRPROJ'}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                {product.product_type === 'software' ? 'PLATFORM' : 'FILE SIZE'}
              </span>
              <span className="text-sm font-extrabold text-white block">
                {product.product_type === 'software'
                  ? (product.software_details?.platforms || 'Windows & macOS')
                  : (product.reels_details?.total_count || '~42 GB Total')}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                LICENSE
              </span>
              <span className="text-sm font-extrabold text-white block">
                {product.product_type === 'software'
                  ? (product.software_details?.license_type || 'Lifetime License')
                  : (product.reels_details?.rights || 'Commercial Use')}
              </span>
            </div>
          </div>

          {/* Dynamic Google Drive Vault Folders breakdown */}
          {product.reels_details?.folder_categories && product.reels_details.folder_categories.length > 0 && (
            <div className="pt-3 border-t border-white/[0.06] space-y-2">
              <span className="text-[11px] font-bold text-slate-300">📁 Google Drive Vault Folders:</span>
              <div className="space-y-1.5 text-xs text-slate-400">
                {product.reels_details.folder_categories.map((folder, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                    <span>{folder}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Optional Course Curriculum for Courses */}
          {product.product_type === 'course' && product.course_details?.curriculum && (
            <div className="pt-3 border-t border-white/[0.06] space-y-2">
              <span className="text-[11px] font-bold text-slate-300">🎓 Modules Breakdown:</span>
              <div className="space-y-1.5 text-xs text-slate-400">
                {product.course_details.curriculum.map((m, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02]">
                    <span className="font-semibold text-slate-200">{m.title}</span>
                    <span className="text-[10px] text-indigo-300">{m.duration}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* 5. What's Included Card (Now below Specifications) */}
        <section className="p-5 rounded-3xl bg-[#131724] border border-white/[0.08] space-y-4 shadow-2xl shadow-black/50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Package className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-extrabold text-white tracking-tight">What's Included</h3>
          </div>

          <div className="border-b border-white/[0.08]" />

          <div className="space-y-3.5">
            {product.features && product.features.length > 0 ? (
              product.features.map((item, idx) => (
                <div key={idx} className="flex items-start space-x-3 text-sm font-semibold text-slate-200">
                  <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 mt-0.5 shadow-sm shadow-emerald-500/30">
                    <Check className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />
                  </div>
                  <span className="leading-snug">{item}</span>
                </div>
              ))
            ) : (
              <>
                <div className="flex items-start space-x-3 text-sm font-semibold text-slate-200">
                  <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 mt-0.5 shadow-sm shadow-emerald-500/30">
                    <Check className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />
                  </div>
                  <span className="leading-snug">2000+ Luxury Lifestyle B-Roll Clips (4K, 60fps)</span>
                </div>
                <div className="flex items-start space-x-3 text-sm font-semibold text-slate-200">
                  <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 mt-0.5 shadow-sm shadow-emerald-500/30">
                    <Check className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />
                  </div>
                  <span className="leading-snug">1500+ Motivation & Success Templates</span>
                </div>
                <div className="flex items-start space-x-3 text-sm font-semibold text-slate-200">
                  <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 mt-0.5 shadow-sm shadow-emerald-500/30">
                    <Check className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />
                  </div>
                  <span className="leading-snug">500+ Seamless Transitions & Effects</span>
                </div>
                <div className="flex items-start space-x-3 text-sm font-semibold text-slate-200">
                  <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 mt-0.5 shadow-sm shadow-emerald-500/30">
                    <Check className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />
                  </div>
                  <span className="leading-snug">Curated Trending Audio Library</span>
                </div>
                <div className="flex items-start space-x-3 text-sm font-semibold text-slate-200">
                  <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 mt-0.5 shadow-sm shadow-emerald-500/30">
                    <Check className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />
                  </div>
                  <span className="leading-snug">CapCut & Premiere Pro Project Files</span>
                </div>
              </>
            )}
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
      <div className="fixed bottom-0 left-0 right-0 w-full z-50 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-2xl bg-[#090b12]/95 border-t border-white/10 shadow-2xl">
        <div className="max-w-md md:max-w-4xl lg:max-w-5xl mx-auto flex items-center justify-between space-x-4">
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

      {/* Sample Video Preview Modal */}
      <VideoModal
        reel={activeReelModal}
        onClose={() => setActiveReelModal(null)}
      />
    </div>
  );
}
