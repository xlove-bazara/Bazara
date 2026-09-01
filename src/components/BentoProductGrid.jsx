import React, { useState, useRef } from 'react';
import { ArrowRight, Star, ChevronLeft, ChevronRight } from 'lucide-react';

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
    <section className="py-2 space-y-3">
      {/* Section Header with Left/Right Arrows */}
      <div className="px-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold tracking-tight text-white flex items-center space-x-2">
            <span>{title}</span>
          </h2>
          <span className="text-[11px] font-semibold text-slate-400">
            Swipe sideways to explore all packs
          </span>
        </div>

        <div className="flex items-center space-x-1.5">
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

      {/* 1-Card-Per-View Horizontal Touch Slider */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex space-x-3.5 overflow-x-auto snap-x snap-mandatory no-scrollbar px-4 pb-2"
        style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}
      >
        {products.map((product, idx) => {
          const rating = product.rating || 4.9;
          const reviews = product.reviews_count ? product.reviews_count.toLocaleString() : '1,250';

          return (
            <div
              key={product.id}
              onClick={() => onProductClick(product)}
              className="w-[86%] max-w-[340px] shrink-0 snap-center rounded-3xl glass-card-luxury p-3.5 flex flex-col justify-between cursor-pointer space-y-3 select-none"
            >
              <div className="space-y-3">
                {/* 1. Clean 4:3 Image (NO G-Drive Badge, NO Percentage Badge) */}
                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-black/40 border border-white/[0.08] shadow-inner">
                  <img
                    src={product.cover_image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>

                {/* 2. Full Product Title (100% Visible, No Cutoff) */}
                <h3 className="text-sm sm:text-base font-extrabold text-white leading-snug group-hover:text-emerald-400 transition-colors">
                  {product.title}
                </h3>

                {/* 3. Star Rating & Reviews (NO 'bought' text) */}
                <div className="flex items-center space-x-1.5 text-xs text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
                  <span className="font-extrabold text-white">{rating}</span>
                  <span className="text-slate-400">({reviews} reviews)</span>
                </div>

                {/* 4. Pricing Row */}
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

              {/* 5. Clean "View Details" Button (No Emoji) */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onProductClick(product);
                  }}
                  className="w-full py-2.5 px-4 rounded-2xl text-xs font-extrabold uppercase tracking-wider text-slate-200 glass-btn hover:text-white hover:border-emerald-500/50 flex items-center justify-center space-x-2 shadow-sm active:scale-95 transition-all"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Pagination Dots Indicator */}
      <div className="flex items-center justify-center space-x-1.5 pt-1">
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
    </section>
  );
}
