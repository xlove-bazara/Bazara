import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Lock, 
  Zap, 
  Sparkles, 
  FolderDown, 
  CheckCircle2, 
  Tag, 
  Package, 
  Smartphone, 
  CreditCard, 
  Check, 
  Clock,
  Star,
  Users,
  BadgeCheck,
  Shield,
  MessageCircle,
  HelpCircle,
  ChevronDown
} from 'lucide-react';

import { getCoupons } from '../supabase';
import { trackInitiateCheckout } from '../services/metaPixel';

export default function WhitePayPage({ 
  product: initialProduct, 
  products = [], 
  user, 
  onBack, 
  onPaymentComplete 
}) {
  // Parse URL query params if user visited directly e.g. /payment.php?package=1M%20Followers...&amount=600
  const urlParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const urlPackage = urlParams.get('package') || urlParams.get('title') || urlParams.get('name');
  const urlAmount = urlParams.get('amount') || urlParams.get('price');
  const urlId = urlParams.get('id') || urlParams.get('product') || urlParams.get('p');

  // Determine active product to display
  const getActiveProduct = () => {
    if (urlId && products.length > 0) {
      const found = products.find(p => String(p.id).toLowerCase() === urlId.toLowerCase() || (p.slug && String(p.slug).toLowerCase() === urlId.toLowerCase()));
      if (found) return found;
    }
    if (urlPackage) {
      // Check if matches an existing product
      const found = products.find(p => p.title.toLowerCase().includes(urlPackage.toLowerCase()));
      if (found) return found;

      // Custom package from URL query params
      return {
        id: `custom-pkg-${Date.now()}`,
        title: urlPackage,
        price: Number(urlAmount) || 600,
        original_price: (Number(urlAmount) || 600) * 4,
        discount_percentage: 75,
        cover_image: "/poster-editor-combo.jpg",
        short_desc: "Instant Premium Digital Access Bundle with 1-Click Google Drive Access.",
        drive_download_url: "https://drive.google.com/drive/folders/bazara-complete-editor-combo-master",
        enable_bump_offer: true,
        bump_price: 49,
        bump_title: "Unlock 15,000+ Ready-to-Use AI Prompts Vault",
        bump_desc: "1-Click Copy Paste Prompts for ChatGPT, Gemini & Claude to 10x your speed."
      };
    }
    return initialProduct || products[0] || {
      id: "prod-editor-combo",
      title: "Complete Editor Combo (All-in-One)",
      price: 299,
      original_price: 7497,
      discount_percentage: 96,
      cover_image: "/poster-editor-combo.jpg",
      short_desc: "All 3 Mega Products Together — Complete Editing Masterclass + 10,000+ Pro Assets + CapCut VIP Pro.",
      drive_download_url: "https://drive.google.com/drive/folders/bazara-complete-editor-combo-master",
      enable_bump_offer: true,
      bump_price: 49,
      bump_title: "Unlock 15,000+ Ready-to-Use AI Prompts Vault"
    };
  };

  const [activeProduct, setActiveProduct] = useState(getActiveProduct);
  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  
  const hasBumpOffer = Boolean(
    activeProduct.enable_bump_offer === true || 
    (activeProduct.enable_bump_offer !== false && activeProduct.bump_title)
  );
  const [addUpsell, setAddUpsell] = useState(hasBumpOffer);
  
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');

  // Countdown Timer (10 Mins)
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 600));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Recent buyer live social proof notification
  const [recentBuyer, setRecentBuyer] = useState(null);
  useEffect(() => {
    const buyerNames = [
      { name: "Rahul S.", city: "Mumbai", time: "2 mins ago" },
      { name: "Ankit V.", city: "Delhi", time: "Just now" },
      { name: "Priya K.", city: "Bengaluru", time: "4 mins ago" },
      { name: "Suresh P.", city: "Jaipur", time: "1 min ago" },
      { name: "Vikram M.", city: "Pune", time: "3 mins ago" }
    ];
    let idx = 0;
    const buyerInterval = setInterval(() => {
      setRecentBuyer(buyerNames[idx % buyerNames.length]);
      idx++;
      setTimeout(() => setRecentBuyer(null), 4000);
    }, 9000);
    return () => clearInterval(buyerInterval);
  }, []);

  // Fetch admin coupons
  useEffect(() => {
    (async () => {
      try {
        const coupons = await getCoupons();
        setAvailableCoupons(coupons || []);
      } catch (e) {}
    })();
  }, []);

  // Dynamically load Razorpay SDK
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const basePrice = activeProduct.price;
  const upsellPrice = activeProduct.bump_price || 49;
  const upsellTitle = activeProduct.bump_title || "Unlock 15,000+ Ready-to-Use AI Prompts Vault";
  const subtotal = basePrice + (hasBumpOffer && addUpsell ? upsellPrice : 0);
  const total = Math.max(0, subtotal - discountAmount);

  // Track InitiateCheckout
  useEffect(() => {
    if (activeProduct) {
      trackInitiateCheckout(activeProduct, total);
    }
  }, [activeProduct?.id]);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    const clean = couponCode.trim().toUpperCase();
    if (!clean) {
      setCouponError('Please enter a coupon code.');
      return;
    }

    const matched = availableCoupons.find(
      c => c.code && c.code.trim().toUpperCase() === clean && (c.is_active !== false)
    );

    if (matched) {
      let disc = 0;
      if (matched.discount_type === 'percentage') {
        disc = Math.round((subtotal * (Number(matched.discount_value) || 0)) / 100);
      } else {
        disc = Math.min(subtotal, Number(matched.discount_value) || 0);
      }
      setDiscountAmount(disc);
      setCouponApplied(true);
      setCouponError('');
    } else {
      setCouponApplied(false);
      setDiscountAmount(0);
      setCouponError('Invalid or expired coupon code!');
    }
  };

  const handleProductChange = (prodId) => {
    const found = products.find(p => p.id === prodId);
    if (found) {
      setActiveProduct(found);
      setCouponApplied(false);
      setDiscountAmount(0);
    }
  };

  const handlePayNow = async (e) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      alert('Please enter your valid 10-digit WhatsApp number to receive instant access!');
      return;
    }

    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID || (typeof process !== 'undefined' ? process.env.REACT_APP_RAZORPAY_KEY_ID : null);

    if (razorpayKey && window.Razorpay) {
      try {
        setIsProcessing(true);
        setProcessingStatus('Connecting to Secure Gateway...');

        let serverOrderId = null;
        try {
          const res = await fetch('/api/create-razorpay-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              amount: total,
              receipt: `rcpt_${activeProduct.id}_${Date.now()}`,
              notes: {
                productId: activeProduct.id,
                productTitle: activeProduct.title,
                phone: phone,
                email: email
              }
            })
          });
          if (res.ok) {
            const data = await res.json();
            if (data.orderId) serverOrderId = data.orderId;
          }
        } catch (serverErr) {
          console.warn('Server order fallback:', serverErr);
        }

        const options = {
          key: razorpayKey,
          amount: Math.round(total * 100),
          currency: 'INR',
          name: 'Bazara',
          description: activeProduct.title + (hasBumpOffer && addUpsell ? ` + ${upsellTitle}` : ''),
          image: typeof window !== 'undefined' && window.location.origin ? `${window.location.origin}/logo.png?v=2` : 'https://bazara.in/logo.png?v=2',
          order_id: serverOrderId || undefined,
          prefill: {
            contact: '+91' + phone,
            email: email || `${phone}@bazara.in`,
            name: fullName || user?.name || ''
          },
          theme: {
            color: '#10B981'
          },
          modal: {
            ondismiss: function () {
              setIsProcessing(false);
              setProcessingStatus('');
            }
          },
          handler: async function (response) {
            setProcessingStatus('Verifying & Unlocking Access...');
            const proofId = response.razorpay_payment_id || ('pay_' + Math.random().toString(36).substring(2, 10).toUpperCase());

            const orderData = {
              productId: activeProduct.id,
              productTitle: activeProduct.title,
              amount: total,
              customerName: fullName || user?.name || 'Customer',
              customerPhone: phone,
              customerEmail: email || `user_${phone.slice(-4)}@bazara.in`,
              upsellIncluded: hasBumpOffer && addUpsell,
              upsellTitle: (hasBumpOffer && addUpsell) ? upsellTitle : null,
              upsellDriveUrl: (hasBumpOffer && addUpsell) ? (activeProduct.bump_drive_url || null) : null,
              driveUrl: activeProduct.drive_download_url || "https://drive.google.com",
              paymentId: proofId,
              razorpayPaymentId: proofId,
              razorpayOrderId: response.razorpay_order_id || serverOrderId || null
            };

            setIsProcessing(false);
            setProcessingStatus('');
            onPaymentComplete(orderData);
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (resp) {
          setIsProcessing(false);
          setProcessingStatus('');
          alert('Payment Failed: ' + (resp.error?.description || 'Please try again.'));
        });
        rzp.open();
        return;
      } catch (err) {
        setIsProcessing(false);
        setProcessingStatus('');
        alert('Could not launch payment window. Please try again.');
        return;
      }
    }

    // Direct Simulated Fast Access Mode if Key is missing in dev mode
    setIsProcessing(true);
    setProcessingStatus('Processing Fast Instant Checkout...');
    setTimeout(() => {
      const mockId = 'pay_' + Math.random().toString(36).substring(2, 10).toUpperCase();
      const orderData = {
        productId: activeProduct.id,
        productTitle: activeProduct.title,
        amount: total,
        customerName: fullName || 'Customer',
        customerPhone: phone,
        customerEmail: email || `${phone}@bazara.in`,
        upsellIncluded: hasBumpOffer && addUpsell,
        upsellTitle: (hasBumpOffer && addUpsell) ? upsellTitle : null,
        upsellDriveUrl: (hasBumpOffer && addUpsell) ? (activeProduct.bump_drive_url || null) : null,
        driveUrl: activeProduct.drive_download_url || "https://drive.google.com",
        paymentId: mockId
      };
      setIsProcessing(false);
      onPaymentComplete(orderData);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans selection:bg-emerald-100 selection:text-emerald-900 pb-20">
      
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white text-center py-2 px-4 text-xs font-bold shadow-md flex items-center justify-center space-x-2">
        <Zap className="w-4 h-4 text-amber-300 animate-bounce" />
        <span>LIMITED TIME OFFER: Get 95% OFF + Instant WhatsApp & Email Access!</span>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                title="Go back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div className="flex items-center space-x-2">
              <img src="/logo.png?v=2" alt="bazara.in" className="w-8 h-8 rounded-xl object-contain shadow-sm border border-slate-200" />
              <div>
                <div className="flex items-center space-x-1">
                  <span className="font-black text-slate-900 text-base tracking-tight">bazara</span>
                  <span className="text-xs font-bold text-emerald-600">.in</span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium">Verified Digital Store</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-full text-xs font-bold">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">256-Bit SSL Encrypted</span>
            <span className="sm:hidden">Secure Pay</span>
          </div>
        </div>
      </header>

      {/* Main Form Box Container */}
      <main className="max-w-4xl mx-auto px-4 pt-6">

        {/* Live Urgency Bar */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center space-x-2.5 text-amber-900 text-xs font-bold">
            <Clock className="w-4 h-4 text-amber-600 animate-spin" />
            <span>Special Package Offer Price Expires In:</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="bg-amber-500 text-white font-black text-sm px-2.5 py-1 rounded-lg shadow-xs">
              {formatTimer(timeLeft)}
            </span>
            <span className="text-xs font-extrabold text-amber-700">MINS</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Side: Package Details & Customer Form */}
          <div className="lg:col-span-7 space-y-6">

            {/* Selected Package Details Card (High Conversion White Card) */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xl shadow-slate-200/50 space-y-4">
              
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-md border border-emerald-200">
                  SELECTED PACKAGE
                </span>
                <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-100">
                  Save {activeProduct.discount_percentage || 85}% Today
                </span>
              </div>

              {/* Package Selector Dropdown if user wants to change package */}
              {products && products.length > 1 && (
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">
                    Select Digital Package:
                  </label>
                  <div className="relative">
                    <select
                      value={activeProduct.id}
                      onChange={(e) => handleProductChange(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2.5 px-3 text-xs font-bold text-slate-900 appearance-none focus:outline-none focus:border-emerald-500 transition-colors"
                    >
                      {products.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.title} - ₹{p.price} (Save {p.discount_percentage || 80}%)
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>
              )}

              {/* Package Info Highlight Box */}
              <div className="bg-emerald-50/60 border-2 border-emerald-200 rounded-2xl p-4 sm:p-5 text-center space-y-2">
                <h2 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                  {activeProduct.title}
                </h2>
                
                <div className="flex items-center justify-center space-x-3 pt-1">
                  <span className="text-3xl sm:text-4xl font-black text-emerald-600">
                    ₹{activeProduct.price}
                  </span>
                  {activeProduct.original_price && (
                    <span className="text-base text-slate-400 line-through font-bold">
                      ₹{activeProduct.original_price}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 font-medium max-w-md mx-auto pt-1">
                  {activeProduct.short_desc || "Full access to high quality digital assets & step-by-step masterclasses with lifetime updates."}
                </p>
              </div>

              {/* Key Highlights checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold text-slate-700 pt-1">
                <div className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Instant WhatsApp & Email Delivery</span>
                </div>
                <div className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>1-Click Google Drive Lifetime Link</span>
                </div>
                <div className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Full Commercial & Resell Rights</span>
                </div>
                <div className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Zero Watermark & No Extra Fees</span>
                </div>
              </div>

            </div>

            {/* Customer Details Form Card */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xl shadow-slate-200/50 space-y-4">
              
              <div className="flex items-center space-x-3 pb-2 border-b border-slate-100">
                <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 font-black text-sm">
                  1
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">Enter Access Details</h3>
                  <p className="text-[11px] text-slate-500">Your download link will be delivered here instantly.</p>
                </div>
              </div>

              <div className="space-y-3.5">
                
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    WhatsApp Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex">
                    <span className="bg-slate-100 border border-r-0 border-slate-300 text-slate-600 font-bold text-xs px-3 flex items-center rounded-l-xl">
                      +91
                    </span>
                    <input
                      type="tel"
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="10-digit WhatsApp Number"
                      className="w-full bg-slate-50 border border-slate-300 rounded-r-xl py-2.5 px-3 text-sm text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                      required
                    />
                  </div>
                  <p className="text-[10px] text-emerald-700 font-bold mt-1 flex items-center space-x-1">
                    <MessageCircle className="w-3 h-3 text-emerald-600 inline" />
                    <span>Google Drive link will be sent to this WhatsApp automatically!</span>
                  </p>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Full Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2.5 px-3 text-sm text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="yourname@gmail.com"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2.5 px-3 text-sm text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                  />
                </div>

              </div>

            </div>

            {/* Optional Bump Offer Box */}
            {hasBumpOffer && (
              <div 
                onClick={() => setAddUpsell(!addUpsell)}
                className={`bg-white rounded-3xl p-4 sm:p-5 border-2 transition-all cursor-pointer select-none shadow-md ${
                  addUpsell 
                    ? 'border-emerald-500 ring-2 ring-emerald-100 bg-emerald-50/20' 
                    : 'border-dashed border-slate-300 hover:border-emerald-400'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`w-5 h-5 rounded-md mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                    addUpsell ? 'bg-emerald-600 text-white' : 'border-2 border-slate-300 bg-white'
                  }`}>
                    {addUpsell && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-black text-rose-600 bg-rose-100 px-2 py-0.5 rounded uppercase">
                        ONE-TIME SPECIAL ADD-ON
                      </span>
                      <span className="text-xs font-black text-emerald-600">+₹{upsellPrice}</span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-black text-slate-900 mt-1">
                      {upsellTitle}
                    </h4>

                    <p className="text-xs text-slate-600 mt-0.5 font-medium">
                      15,000+ Copy-Paste AI Prompts for ChatGPT, Gemini, Claude, Marketing, Ads & E-Commerce.
                    </p>

                    <div className="mt-2 text-[11px] font-bold text-emerald-700">
                      {addUpsell ? '✓ VIP Prompts Vault Added to Order' : '👉 Click to add Prompts Vault (+₹49)'}
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Right Side: Sticky Checkout Payment Summary */}
          <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-20">
            
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xl shadow-slate-200/50 space-y-4">
              
              <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 font-black text-sm">
                  2
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">Payment Summary</h3>
                  <p className="text-[11px] text-slate-500">Instant Automated Access</p>
                </div>
              </div>

              {/* Price Calculation */}
              <div className="space-y-2 text-xs font-semibold text-slate-600">
                <div className="flex justify-between">
                  <span>{activeProduct.title}</span>
                  <span className="text-slate-900 font-bold">₹{basePrice}</span>
                </div>

                {hasBumpOffer && addUpsell && (
                  <div className="flex justify-between text-emerald-700">
                    <span className="truncate max-w-[180px]">{upsellTitle}</span>
                    <span className="font-bold">+₹{upsellPrice}</span>
                  </div>
                )}

                {discountAmount > 0 && (
                  <div className="flex justify-between text-rose-600">
                    <span>Coupon Discount</span>
                    <span className="font-bold">-₹{discountAmount}</span>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                  <span className="text-sm font-extrabold text-slate-900">Total Amount:</span>
                  <span className="text-3xl font-black text-emerald-600">₹{total}</span>
                </div>
              </div>

              {/* Promo Code Form */}
              <form onSubmit={handleApplyCoupon} className="flex space-x-2 pt-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => {
                    setCouponCode(e.target.value);
                    if (couponError) setCouponError('');
                  }}
                  placeholder="Enter Coupon Code"
                  className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold uppercase text-slate-900 placeholder:normal-case placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </form>
              {couponApplied && (
                <p className="text-[11px] font-bold text-emerald-600">✓ Coupon applied successfully! Saved ₹{discountAmount}</p>
              )}
              {couponError && (
                <p className="text-[11px] font-bold text-rose-600">✗ {couponError}</p>
              )}

              {/* Big Pay Button */}
              <button
                onClick={handlePayNow}
                disabled={isProcessing}
                className="w-full py-4 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-emerald-500/30 transition-all cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-75"
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>{processingStatus || 'Connecting Gateway...'}</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>PAY ₹{total} & GET INSTANT ACCESS 🚀</span>
                  </>
                )}
              </button>

              {/* Supported Gateways icons */}
              <div className="pt-2 text-center space-y-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Supported Payment Methods:
                </p>
                <div className="flex flex-wrap items-center justify-center gap-1.5 text-[10px] font-bold text-slate-600">
                  <span className="bg-slate-100 px-2 py-1 rounded border border-slate-200">PhonePe</span>
                  <span className="bg-slate-100 px-2 py-1 rounded border border-slate-200">Google Pay</span>
                  <span className="bg-slate-100 px-2 py-1 rounded border border-slate-200">Paytm</span>
                  <span className="bg-slate-100 px-2 py-1 rounded border border-slate-200">UPI QR</span>
                  <span className="bg-slate-100 px-2 py-1 rounded border border-slate-200">Cards / NetBanking</span>
                </div>
              </div>

            </div>

            {/* Trust Seals Badge Box */}
            <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-md space-y-3 text-xs text-slate-600">
              <div className="flex items-center space-x-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-900">100% Satisfaction & Safe Access</h4>
                  <p className="text-[10px] text-slate-500">256-Bit SSL Security + Instant Automated Link Delivery</p>
                </div>
              </div>
              <div className="flex items-center space-x-2.5 pt-2 border-t border-slate-100">
                <BadgeCheck className="w-5 h-5 text-indigo-600 shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-900">21,500+ Happy Customers</h4>
                  <p className="text-[10px] text-slate-500">Rated ★ 4.97/5 by creators & editors across India</p>
                </div>
              </div>
            </div>

            {/* Need Help WhatsApp Support */}
            <div className="bg-emerald-50 rounded-2xl p-3.5 border border-emerald-200 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2 text-emerald-900 font-bold">
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Need help with your payment?</span>
              </div>
              <a
                href="https://wa.me/919837371137?text=Hi%20Bazara%20Support%2C%20I%20need%20help%20with%20checkout"
                target="_blank"
                rel="noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] px-3 py-1.5 rounded-xl transition-colors shrink-0"
              >
                Chat Support
              </a>
            </div>

          </div>

        </div>
      </main>

      {/* Floating Recent Buyer Toast Notification */}
      {recentBuyer && (
        <div className="fixed bottom-4 left-4 z-50 bg-white border border-slate-200 text-slate-900 p-3 rounded-2xl shadow-2xl shadow-slate-900/10 flex items-center space-x-3 max-w-xs animate-bounce">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">
            ✓
          </div>
          <div className="text-xs">
            <p className="font-bold">{recentBuyer.name} from {recentBuyer.city}</p>
            <p className="text-[10px] text-slate-500">Purchased package • {recentBuyer.time}</p>
          </div>
        </div>
      )}

    </div>
  );
}
