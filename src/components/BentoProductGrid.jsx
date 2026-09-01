import React from 'react';
import { ArrowRight, FolderDown, Star, Eye } from 'lucide-react';

export default function BentoProductGrid({ 
  products, 
  title = "Trending Bundles", 
  onProductClick, 
  onQuickViewClick 
}) {
  return (
    <section className="px-4 py-4 space-y-3">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold tracking-tight text-white flex items-center space-x-2">
          <span>{title}</span>
        </h2>
        <span className="text-xs font-semibold text-emerald-400 flex items-center hover:underline cursor-pointer">
          View All <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
        </span>
      </div>

      {/* 2-Column Grid with 4:3 Image Ratio & Full Product Information */}
      <div className="grid grid-cols-2 gap-3">
        {products.map((product) => {
          const rating = product.rating || 4.9;
          const reviews = product.reviews_count ? product.reviews_count.toLocaleString() : '1.2k';
          const bought = product.downloads_count 
            ? `${(product.downloads_count / 1000).toFixed(1)}k+ bought`
            : '2.5k+ bought';

          return (
            <div
              key={product.id}
              onClick={() => onProductClick(product)}
              className="group relative rounded-3xl glass-card-luxury p-3 flex flex-col justify-between cursor-pointer space-y-2.5 transition-all"
            >
              <div className="space-y-2">
                {/* 1. Media Container with 4:3 Aspect Ratio */}
                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-black/40 border border-white/[0.08] shadow-inner">
                  <img
                    src={product.cover_image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />

                  {/* G-Drive Badge */}
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/65 backdrop-blur-xl border border-white/20 text-[10px] font-bold text-slate-200 flex items-center space-x-1 shadow-md">
                    <FolderDown className="w-3 h-3 text-emerald-400" />
                    <span>G-Drive</span>
                  </div>

                  {/* Discount Badge */}
                  {product.discount_percentage && (
                    <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-lg bg-emerald-500 text-[10px] font-black text-slate-950 shadow-md">
                      -{product.discount_percentage}%
                    </div>
                  )}
                </div>

                {/* 2. Full Product Title (2 lines clearly visible, no awkward cutoff) */}
                <h3 className="text-xs sm:text-sm font-extrabold text-white line-clamp-2 leading-snug group-hover:text-emerald-400 transition-colors min-h-[2.4rem]">
                  {product.title}
                </h3>

                {/* 3. Ratings & How Many Creators Bought */}
                <div className="flex items-center justify-between text-[11px] pt-0.5">
                  <div className="flex items-center space-x-1 text-amber-400">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
                    <span className="font-extrabold text-white text-xs">{rating}</span>
                    <span className="text-slate-400 text-[10px]">({reviews})</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 truncate ml-1">
                    {bought}
                  </span>
                </div>

                {/* 4. Pricing Row */}
                <div className="flex items-baseline space-x-2 pt-0.5">
                  <span className="text-base font-black text-emerald-400">
                    ₹{product.price}
                  </span>
                  {product.original_price && (
                    <span className="text-xs text-slate-400 line-through">
                      ₹{product.original_price}
                    </span>
                  )}
                </div>
              </div>

              {/* 5. Clean "View Details" Button (No Emoji) */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onProductClick(product);
                  }}
                  className="w-full py-2 px-2.5 rounded-xl text-xs font-bold text-slate-200 glass-btn hover:text-white flex items-center justify-center space-x-1.5 shadow-sm active:scale-95 transition-all"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
