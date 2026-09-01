import React, { useState, useRef } from 'react';
import { ArrowRight, Star, ChevronLeft, ChevronRight, ShieldCheck, Zap } from 'lucide-react';

export default function BentoProductGrid({ 
  products, 
  title = "Trending Bundles", 
  onProductClick 
}) {
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollPosition = scrollRef.current.scrollLeft;
      const cardWidth = scrollRef.current.offsetWidth * 0.86;
      const index = Math.round(scrollPosition / cardWidth);
      setActiveIndex(Math.min(products.length - 1, Math.max(0, index)));
    }
  };

  const scrollTo = (direction) => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.offsetWidth * 0.86;
      scrollRef.current.scrollBy({
        left: direction === 'next' ? cardWidth : -cardWidth,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-2 space-y-4">
      {/* Section Header */}
      <div className="px-4 md:px-0 flex items-center justify-between">
        <div>
          <h2 className="text-xl md:text-2xl font-black tracking-tight text-white flex items-center space-x-2">
            <span>{title}</span>
          </h2>
          <span className="text-xs font-semibold text-slate-400 block md:hidden">
            Swipe sideways to explore all packs
          </span>
          <span className="text-xs font-semibold text-slate-400 hidden md:block">
            Instant Google Drive delivery on all items • 100% Commercial PLR Rights
          </span>
        </div>

        {/* Mobile Left/Right Arrows */}
        <div className="flex md:hidden items-center space-x-1.5">
          <button
            onClick={() => scrollTo('prev')}
            className="w-8 h-8 rounded-full glass-btn text-slate-300 hover:text-white flex items-center justify-center active:scale-95 transition-all"
            aria-label="Previous pack"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scrollTo('next')}
            className="w-8 h-8 rounded-full glass-btn text-slate-300 hover:text-white flex items-center justify-center active:scale-95 transition-all"
            aria-label="Next pack"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ================= 1. MOBILE ONLY (< 768px): Touch Slider ================= */}
      <div className="block md:hidden">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex space-x-3.5 overflow-x-auto snap-x snap-mandatory no-scrollbar px-4 pb-2"
          style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}
        >
          {products.map((product) => {
            const rating = product.rating || 4.9;
            const reviews = product.reviews_count ? product.reviews_count.toLocaleString() : '1,250';

            return (
              <div
                key={`mob-${product.id}`}
                onClick={() => onProductClick(product)}
                className="w-[86%] max-w-[340px] shrink-0 snap-center rounded-3xl glass-card-luxury p-3.5 flex flex-col justify-between cursor-pointer space-y-3 select-none"
              >
                <div className="space-y-3">
                  {/* Clean 4:3 Image */}
                  <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-black/40 border border-white/[0.08] shadow-inner">
                    <img
                      src={product.cover_image}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>

                  {/* Full Product Title */}
                  <h3 className="text-sm font-extrabold text-white leading-snug group-hover:text-emerald-400 transition-colors">
                    {product.title}
                  </h3>

                  {/* Star Rating & Reviews */}
                  <div className="flex items-center space-x-1.5 text-xs text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
                    <span className="font-extrabold text-white">{rating}</span>
                    <span className="text-slate-400">({reviews} reviews)</span>
                  </div>

                  {/* Pricing Row */}
                  <div className="flex items-baseline space-x-2 pt-0.5">
                    <span className="text-lg font-black text-emerald-400">
                      ₹{product.price}
                    </span>
                    {product.original_price && (
                      <span className="text-xs text-slate-400 line-through">
                        ₹{product.original_price}
                      </span>
                    )}
                    {product.discount_percentage && (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/20">
                        SAVE {product.discount_percentage}%
                      </span>
                    )}
                  </div>
                </div>

                {/* Vibrant Gradient "View Details" Button with Shimmer Reflection */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onProductClick(product);
                    }}
                    className="relative overflow-hidden w-full py-3 px-4 rounded-2xl text-xs font-black uppercase tracking-wider text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
                  >
                    <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/85 to-transparent animate-shimmer-sweep pointer-events-none" />
                    <span className="relative z-10">View Details</span>
                    <ArrowRight className="relative z-10 w-4 h-4 text-slate-950 stroke-[3]" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Pagination Dots */}
        <div className="flex items-center justify-center space-x-1.5 pt-2">
          {products.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeIndex === idx
                  ? 'w-6 bg-emerald-400'
                  : 'w-1.5 bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>

      {/* ================= 2. DESKTOP ONLY (>= 768px): Spacious 3-Column Glass Grid ================= */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => {
          const rating = product.rating || 4.9;
          const reviews = product.reviews_count ? product.reviews_count.toLocaleString() : '1,250';

          return (
            <div
              key={`desk-${product.id}`}
              onClick={() => onProductClick(product)}
              className="group relative rounded-3xl glass-card-luxury p-5 flex flex-col justify-between cursor-pointer space-y-4 transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-500/40 hover:shadow-emerald-500/20"
            >
              <div className="space-y-3.5">
                {/* 4:3 Clean Cover Image */}
                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-black/40 border border-white/[0.08] shadow-md">
                  <img
                    src={product.cover_image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {product.discount_percentage && (
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded-lg bg-emerald-500 text-[11px] font-black text-slate-950 shadow-md">
                      SAVE {product.discount_percentage}%
                    </div>
                  )}
                </div>

                {/* Full Title (Large and clear on Desktop) */}
                <h3 className="text-base font-extrabold text-white leading-snug group-hover:text-emerald-400 transition-colors min-h-[3rem]">
                  {product.title}
                </h3>

                {/* Star Rating & Reviews */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1.5 text-amber-400">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400 shrink-0" />
                    <span className="font-extrabold text-white">{rating}</span>
                    <span className="text-slate-400">({reviews} reviews)</span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-400">
                    Verified Drive Access
                  </span>
                </div>

                {/* Price Row */}
                <div className="flex items-baseline space-x-2 pt-1 border-t border-white/[0.06]">
                  <span className="text-2xl font-black text-emerald-400">
                    ₹{product.price}
                  </span>
                  {product.original_price && (
                    <span className="text-sm text-slate-400 line-through">
                      ₹{product.original_price}
                    </span>
                  )}
                </div>
              </div>

              {/* Glowing CTA Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onProductClick(product);
                  }}
                  className="relative overflow-hidden w-full py-3.5 px-5 rounded-2xl text-xs font-black uppercase tracking-wider text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
                >
                  <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/85 to-transparent animate-shimmer-sweep pointer-events-none" />
                  <span className="relative z-10">View Details</span>
                  <ArrowRight className="relative z-10 w-4 h-4 text-slate-950 stroke-[3]" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
