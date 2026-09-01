import React from 'react';
import { X, Star, CheckCircle, ArrowRight, Zap, FolderDown } from 'lucide-react';

export default function QuickViewModal({ product, onClose, onViewDetails, onInstantBuy }) {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full sm:max-w-md bg-[#0e111d] rounded-t-3xl sm:rounded-3xl border border-white/10 p-5 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar with close */}
        <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              {product.badge || 'Instant Access'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 text-slate-300 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Thumbnail & Title */}
        <div className="flex space-x-3.5 items-start">
          <img
            src={product.cover_image}
            alt={product.title}
            className="w-28 aspect-video object-cover rounded-xl border border-white/10 shrink-0 shadow-md"
          />
          <div className="space-y-1.5">
            <h3 className="text-sm font-bold text-white leading-snug">
              {product.title}
            </h3>
            <div className="flex items-center space-x-1.5 text-xs text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span className="font-bold">{product.rating}</span>
              <span className="text-slate-400">({product.reviews_count} reviews)</span>
            </div>
            <div className="flex items-baseline space-x-2 pt-1">
              <span className="text-lg font-black text-emerald-400">₹{product.price}</span>
              {product.original_price && (
                <span className="text-xs text-slate-400 line-through">₹{product.original_price}</span>
              )}
              {product.discount_percentage && (
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  {product.discount_percentage}% OFF
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Short bullet features */}
        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-1.5 text-xs text-slate-300">
          {product.features?.slice(0, 3).map((feat, i) => (
            <div key={i} className="flex items-start space-x-2">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>{feat}</span>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <button
            onClick={() => {
              onClose();
              onInstantBuy(product);
            }}
            className="w-full py-3 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/30 flex items-center justify-center space-x-1.5 active:scale-[0.98] transition-all"
          >
            <span>BUY NOW - ₹{product.price} (INSTANT G-DRIVE)</span>
            <Zap className="w-4 h-4 fill-slate-950" />
          </button>

          <button
            onClick={() => {
              onClose();
              onViewDetails(product);
            }}
            className="w-full py-2.5 rounded-full text-xs font-bold text-slate-200 bg-white/10 hover:bg-white/15 border border-white/10 flex items-center justify-center space-x-1 transition-all"
          >
            <span>View Full Details & Video Samples</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
