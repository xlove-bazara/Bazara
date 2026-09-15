import React from 'react';
import { X, Star, CheckCircle, ArrowRight, Zap, FolderDown } from 'lucide-react';

export default function QuickViewModal({ product, onClose, onViewDetails, onInstantBuy }) {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full sm:max-w-md bg-[var(--bg-card)] rounded-t-3xl sm:rounded-3xl border border-[var(--border-card)] p-5 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar with close */}
        <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              {product.badge || 'Instant Access'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Thumbnail & Title */}
        <div className="flex space-x-3.5 items-start">
          <img
            src={product.cover_image}
            alt={product.title}
            className="w-28 aspect-video object-cover rounded-xl border border-[var(--border-subtle)] shrink-0 shadow-md"
          />
          <div className="space-y-1.5">
            <h3 className="text-sm font-bold text-primary-theme leading-snug font-heading">
              {product.title}
            </h3>
            <div className="flex items-center space-x-1.5 text-xs text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span className="font-bold">{product.rating}</span>
              <span className="text-muted-theme">({product.reviews_count} reviews)</span>
            </div>
            <div className="flex items-baseline space-x-2 pt-1">
              <span className="text-lg font-black text-emerald-400">₹{product.price}</span>
              {product.original_price && (
                <span className="text-xs text-muted-theme line-through">₹{product.original_price}</span>
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
        <div className="p-3 rounded-xl bg-[var(--bg-card-secondary)] border border-[var(--border-subtle)] space-y-1.5 text-xs text-secondary-theme">
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
            className="w-full py-3 rounded-full text-xs font-black uppercase tracking-wider btn-cta-premium flex items-center justify-center space-x-1.5 active:scale-[0.98] transition-all cursor-pointer"
          >
            <span>BUY NOW - ₹{product.price} (INSTANT G-DRIVE)</span>
            <Zap className="w-4 h-4 fill-slate-950" />
          </button>

          <button
            onClick={() => {
              onClose();
              onViewDetails(product);
            }}
            className="w-full py-2.5 rounded-full text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-white/5 hover:bg-white/10 border border-[var(--border-subtle)] flex items-center justify-center space-x-1 transition-all cursor-pointer"
          >
            <span>View Full Details & Video Samples</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
