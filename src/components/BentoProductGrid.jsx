import React from 'react';
import { ArrowRight, Zap, FolderDown, Star } from 'lucide-react';

export default function BentoProductGrid({ 
  products, 
  title = "Trending Bundles", 
  onProductClick, 
  onQuickViewClick 
}) {
  return (
    <section className="px-4 py-4 space-y-3">
      {/* Section Header matching reference */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold tracking-tight text-white flex items-center space-x-2">
          <span>{title}</span>
        </h2>
        <span className="text-xs font-semibold text-emerald-400 flex items-center hover:underline cursor-pointer">
          View All <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
        </span>
      </div>

      {/* 2-Column Grid matching reference screenshot */}
      <div className="grid grid-cols-2 gap-3">
        {products.map((product) => {
          return (
            <div
              key={product.id}
              onClick={() => onProductClick(product)}
              className="group relative rounded-2xl glass-panel glass-panel-hover p-2 flex flex-col justify-between cursor-pointer border border-white/[0.08] transition-all duration-200"
            >
              <div className="space-y-2">
                {/* Media Container with G-Drive Badge matching screenshot */}
                <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-slate-900">
                  <img
                    src={product.cover_image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />

                  {/* G-Drive Badge matching reference */}
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/20 text-[10px] font-bold text-slate-200 flex items-center space-x-1 shadow-sm">
                    <FolderDown className="w-3 h-3 text-emerald-400" />
                    <span>G-Drive</span>
                  </div>

                  {product.discount_percentage && (
                    <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-emerald-500 text-[10px] font-black text-slate-950 shadow-md">
                      -{product.discount_percentage}%
                    </div>
                  )}
                </div>

                {/* Product Title */}
                <h3 className="text-xs font-bold text-slate-100 line-clamp-1 group-hover:text-emerald-400 transition-colors">
                  {product.title}
                </h3>

                {/* Pricing Row matching screenshot: ₹299 ₹1,999 */}
                <div className="flex items-baseline space-x-1.5">
                  <span className="text-sm font-extrabold text-emerald-400">
                    ₹{product.price}
                  </span>
                  {product.original_price && (
                    <span className="text-[11px] text-slate-400 line-through">
                      ₹{product.original_price}
                    </span>
                  )}
                </div>
              </div>

              {/* Quick View Button matching screenshot */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onQuickViewClick(product);
                  }}
                  className="w-full py-1.5 px-2 rounded-xl text-xs font-bold text-slate-200 bg-[#161a28] hover:bg-[#1e2336] border border-white/[0.08] flex items-center justify-center space-x-1 shadow-sm active:scale-95 transition-all"
                >
                  <span>Quick View</span>
                  <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
