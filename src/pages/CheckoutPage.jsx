import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Lock, 
  Zap, 
  Sparkles, 
  FolderDown, 
  CheckCircle,
  Tag
} from 'lucide-react';

export default function CheckoutPage({ 
  product, 
  user, 
  onBack, 
  onPaymentComplete 
}) {
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [addUpsell, setAddUpsell] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'card'
  const [isProcessing, setIsProcessing] = useState(false);

  if (!product) return null;

  const upsellPrice = 99;
  const basePrice = product.price;
  const subtotal = basePrice + (addUpsell ? upsellPrice : 0);
  const total = Math.max(0, subtotal - discountAmount);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === 'BAZARA10' || couponCode.toUpperCase() === 'VIRAL50') {
      const disc = Math.round(subtotal * 0.1);
      setDiscountAmount(disc);
      setCouponApplied(true);
    } else {
      alert('Invalid coupon! Try "BAZARA10" for 10% instant discount.');
    }
  };

  const handlePayNow = (e) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      alert('Please enter your 10-digit WhatsApp number to receive your Drive link!');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const orderData = {
        productId: product.id,
        productTitle: product.title,
        amount: total,
        customerPhone: phone,
        customerEmail: email || `user_${phone.slice(-4)}@bazara.in`,
        upsellIncluded: addUpsell,
        driveUrl: product.drive_download_url
      };
      onPaymentComplete(orderData);
    }, 1500);
  };

  return (
    <div className="min-h-screen pb-20 bg-[#08090E] text-slate-100 selection:bg-emerald-500/30">
      {/* Top Header */}
      <header className="sticky top-0 z-30 px-4 py-3 backdrop-blur-xl bg-[#08090E]/85 border-b border-white/[0.06]">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="p-2 rounded-full glass-panel text-slate-300 hover:text-white border border-white/10 active:scale-95 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-1 text-xs font-bold text-slate-300">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>256-Bit Encrypted Checkout</span>
          </div>
          <div className="w-8" />
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pt-3 space-y-4">
        {/* Step 1: Customer Contact Details */}
        <div className="p-4 rounded-3xl glass-panel border border-white/10 space-y-3 bg-[#0c0f1a]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
              Step 1: Digital Delivery Info
            </span>
            <span className="text-[10px] text-slate-400">Instant Drive Link</span>
          </div>

          <div className="space-y-2.5">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                WhatsApp Number <span className="text-rose-400">*</span>
              </label>
              <div className="flex items-center space-x-2">
                <span className="px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-bold text-slate-300">
                  +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 10-digit number"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                  required
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Google Drive link will be sent to this WhatsApp.</p>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Email Address (Optional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yourname@gmail.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
              />
            </div>
          </div>
        </div>

        {/* Step 2: Order Summary Card */}
        <div className="p-4 rounded-3xl glass-panel border border-white/10 space-y-3 bg-[#0c0f1a]">
          <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
            Step 2: Order Summary
          </span>

          <div className="flex space-x-3 items-center">
            <img
              src={product.cover_image}
              alt={product.title}
              className="w-16 h-16 rounded-xl object-cover border border-white/10 shrink-0"
            />
            <div className="space-y-0.5 flex-1">
              <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug">
                {product.title}
              </h4>
              <div className="flex items-center space-x-2 text-xs">
                <span className="font-bold text-emerald-400">₹{product.price}</span>
                {product.original_price && (
                  <span className="text-slate-400 line-through text-[11px]">₹{product.original_price}</span>
                )}
              </div>
            </div>
          </div>

          {/* Promo Code Input */}
          <form onSubmit={handleApplyCoupon} className="flex items-center space-x-2 pt-2">
            <div className="relative flex-1">
              <Tag className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder='Coupon code (try "BAZARA10")'
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white uppercase placeholder:normal-case placeholder-slate-500 focus:outline-none focus:border-emerald-400"
              />
            </div>
            <button
              type="submit"
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/10 active:scale-95 transition-all"
            >
              Apply
            </button>
          </form>
          {couponApplied && (
            <p className="text-[10px] text-emerald-400 font-bold">✓ Coupon applied! You saved ₹{discountAmount}</p>
          )}
        </div>

        {/* Step 3: ⭐ ORDER BUMP / UPSELL CHECKBOX (High-Converting Urgency Trigger) */}
        <div 
          onClick={() => setAddUpsell(!addUpsell)}
          className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
            addUpsell 
              ? 'border-emerald-500/60 bg-emerald-950/20' 
              : 'border-dashed border-white/20 bg-white/[0.02]'
          }`}
        >
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={addUpsell}
              onChange={() => {}}
              className="w-4 h-4 mt-0.5 rounded text-emerald-500 focus:ring-0 cursor-pointer accent-emerald-500"
            />
            <div className="space-y-1">
              <div className="flex items-center space-x-1.5">
                <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-amber-500 text-slate-950">
                  ONE TIME OFFER
                </span>
                <span className="text-xs font-black text-white">
                  Add 500+ CapCut XML Presets & SFX Audio Library
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                One-click import into CapCut & Premiere Pro. Normally ₹499, get it for just <span className="font-bold text-emerald-400">₹99</span>!
              </p>
            </div>
          </div>
        </div>

        {/* Step 4: Payment Methods */}
        <div className="p-4 rounded-3xl glass-panel border border-white/10 space-y-3 bg-[#0c0f1a]">
          <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
            Step 4: Instant 1-Tap Payment
          </span>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setPaymentMethod('upi')}
              className={`p-3 rounded-2xl border text-center space-y-1 transition-all ${
                paymentMethod === 'upi'
                  ? 'border-emerald-400 bg-emerald-950/30'
                  : 'border-white/10 bg-white/[0.02]'
              }`}
            >
              <span className="text-xs font-bold text-white block">UPI Apps</span>
              <span className="text-[10px] text-slate-400">GPay, PhonePe, Paytm</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              className={`p-3 rounded-2xl border text-center space-y-1 transition-all ${
                paymentMethod === 'card'
                  ? 'border-emerald-400 bg-emerald-950/30'
                  : 'border-white/10 bg-white/[0.02]'
              }`}
            >
              <span className="text-xs font-bold text-white block">Cards & NetBanking</span>
              <span className="text-[10px] text-slate-400">All Indian Banks</span>
            </button>
          </div>
        </div>

        {/* Final Price Breakdown */}
        <div className="p-3.5 rounded-2xl glass-panel border border-white/10 space-y-1.5 text-xs text-slate-300">
          <div className="flex justify-between">
            <span>Main Bundle</span>
            <span>₹{basePrice}</span>
          </div>
          {addUpsell && (
            <div className="flex justify-between text-emerald-400">
              <span>CapCut XML Presets Pack</span>
              <span>+₹{upsellPrice}</span>
            </div>
          )}
          {discountAmount > 0 && (
            <div className="flex justify-between text-rose-400">
              <span>Discount Coupon</span>
              <span>-₹{discountAmount}</span>
            </div>
          )}
          <div className="pt-2 border-t border-white/10 flex justify-between text-sm font-black text-white">
            <span>Total Payable:</span>
            <span className="text-emerald-400 text-base">₹{total}</span>
          </div>
        </div>

        {/* Big Action Pay Button */}
        <button
          onClick={handlePayNow}
          disabled={isProcessing}
          className="relative w-full overflow-hidden py-4 rounded-full font-black text-sm uppercase tracking-wider text-slate-950 bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-400 shadow-2xl shadow-emerald-500/40 active:scale-[0.98] transition-all flex items-center justify-center space-x-2 disabled:opacity-70"
        >
          <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/80 to-transparent animate-shimmer-sweep pointer-events-none" />
          <span className="relative z-10">
            {isProcessing ? 'Processing Secure Payment...' : `PAY ₹${total} & GET INSTANT G-DRIVE 🚀`}
          </span>
        </button>

        <div className="flex items-center justify-center space-x-1.5 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Instant Download Link & WhatsApp Confirmation Guaranteed</span>
        </div>
      </main>
    </div>
  );
}
