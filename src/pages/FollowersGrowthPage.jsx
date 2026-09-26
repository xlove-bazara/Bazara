import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Star, 
  Flame, 
  Clock, 
  TrendingUp, 
  UserCheck, 
  Lock, 
  ArrowRight, 
  Copy, 
  HelpCircle, 
  MessageCircle, 
  ChevronDown, 
  ChevronUp, 
  Play, 
  Crown,
  Award,
  Users,
  Check,
  Search,
  AlertCircle,
  X,
  CreditCard,
  CheckCircle
} from 'lucide-react';

const InstagramIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export default function FollowersGrowthPage({ onBuyProduct, onNavigateToStore, settings }) {
  const [selectedCategory, setSelectedCategory] = useState('followers'); // 'followers' | 'likes' | 'views'
  const [toastNotification, setToastNotification] = useState(null);
  const [activeFaq, setActiveFaq] = useState(null);

  // SMM Compact 1-Step Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activePack, setActivePack] = useState(null);
  const [modalInstaHandle, setModalInstaHandle] = useState('');
  const [modalError, setModalError] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Live timer countdown
  const [timeLeft, setTimeLeft] = useState({ minutes: 14, seconds: 59 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { minutes: prev.minutes - 1, seconds: 59 };
        return { minutes: 15, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
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

  // Live Sales Toasts Simulation
  useEffect(() => {
    const notifications = [
      { name: "Rahul S. from Delhi", action: "bought 10k Indian Followers (₹199)", time: "2 mins ago" },
      { name: "Priya M. from Mumbai", action: "bought 1M Followers + Blue Tick (₹600)", time: "Just now" },
      { name: "Vikram K. from Bangalore", action: "purchased 50k Followers Pack (₹350)", time: "4 mins ago" },
      { name: "Ananya R. from Jaipur", action: "bought 1k Followers Pack (₹99)", time: "1 min ago" },
      { name: "Suresh P. from Ahmedabad", action: "bought 30k Followers + Blue Tick (₹250)", time: "5 mins ago" }
    ];

    let index = 0;
    const toastInterval = setInterval(() => {
      setToastNotification(notifications[index % notifications.length]);
      index++;
      setTimeout(() => setToastNotification(null), 4500);
    }, 8000);

    return () => clearInterval(toastInterval);
  }, []);

  // Exact Packages from followersfuel.shop screenshot
  const followerPackages = [
    {
      id: "prod-insta-100",
      slug: "100-indian-followers",
      title: "100 Indian Followers",
      subTitle: "Premium Quality Starter Pack",
      price: 16,
      originalPrice: 160,
      tag: "⚡ STARTER PACK",
      badgeColor: "bg-pink-600 text-white",
      desc: "Premium Quality: Hum 100 Indian Followers aapko dete hain. Instant delivery fast speed.",
      features: [
        "100 Real Indian Followers",
        "Instant Fast Auto Server Speed",
        "100% Safe — No Password Needed",
        "30-Day Auto Refill Guarantee"
      ]
    },
    {
      id: "prod-insta-1k",
      slug: "1k-indian-followers",
      title: "1k Indian Followers",
      subTitle: "Authority Profile Booster",
      price: 99,
      originalPrice: 999,
      tag: "⭐ BEST SELLER",
      badgeColor: "bg-amber-400 text-slate-950 font-black",
      desc: "Authority Booster: 1,000 Real Indian Followers aapke profile authority ko boost karne me help karta hain.",
      popular: true,
      features: [
        "1,000 Real Indian Followers",
        "Instant Delivery Starts in 60s",
        "Boosts Profile Authority & Trust",
        "Lifetime Non-Drop Protection"
      ]
    },
    {
      id: "prod-insta-10k",
      slug: "10k-indian-followers-combo",
      title: "10k Indian Followers",
      subTitle: "Organic Vibe & Instant Growth",
      price: 199,
      originalPrice: 1999,
      tag: "🔥 INSTANT GROWTH",
      badgeColor: "bg-rose-600 text-white",
      desc: "Organic Vibe: 10,000 Followers se aapka profile saaf saaf professional lagta hai.",
      bonus: "🎁 MEGA BONUS: 5K LIKES FREE On All Posts! 🔥",
      features: [
        "10,000 Real Indian Followers",
        "🎁 MEGA BONUS: 5,000 Free Post Likes",
        "Instant VIP Processing Speed",
        "100% Non-Drop Auto Refill"
      ]
    },
    {
      id: "prod-insta-30k",
      slug: "30k-indian-followers-bluetick",
      title: "30k Indian Followers 🌐",
      subTitle: "Influence Power Pack",
      price: 250,
      originalPrice: 2500,
      tag: "📌 TRENDING",
      badgeColor: "bg-purple-600 text-white",
      desc: "Influence Power: 30,000 Indian Followers aapko instant creator/influencer bana dete hain.",
      bonus: "🎁 EXCLUSIVE: Blue Tick (Verification) Free! 📑",
      features: [
        "30,000 Real Indian Followers",
        "🎁 EXCLUSIVE: Meta Blue Tick Request Free",
        "Super Priority Server Speed",
        "Lifetime Non-Drop Guarantee"
      ]
    },
    {
      id: "prod-insta-50k",
      slug: "50k-indian-followers-vvip",
      title: "50k Indian Followers 🌐",
      subTitle: "Brand Authority Pack",
      price: 350,
      originalPrice: 3500,
      tag: "💎 VVIP PERSONAL PACK",
      badgeColor: "bg-gradient-to-r from-rose-500 to-amber-500 text-white",
      desc: "Brand Authority: Professional Brands & Creators ke liye ye sabse best option.",
      bonus: "🎁 COMBO FREE: Blue Tick + 5k Likes On All Posts! ✨",
      features: [
        "50,000 Real Indian Followers",
        "🎁 BONUS: Meta Blue Tick + 5k Likes",
        "Instant Celebrity Processing",
        "100% Lifetime Auto Refill Protection"
      ]
    },
    {
      id: "prod-insta-100k",
      slug: "100k-indian-followers-mega",
      title: "100k Indian Followers 🌐",
      subTitle: "Mega Celebrity Empire",
      price: 500,
      originalPrice: 5000,
      tag: "👑 MEGA EMPIRE",
      badgeColor: "bg-slate-900 text-rose-400 border border-rose-500/50",
      desc: "Mega Empire: 1 Lakh Indian Followers ka yeh pack aapko celebrity-like status deta hai.",
      bonus: "📍 VVIP NON-DROP • Blue Tick • 10k Likes • 100k Views",
      features: [
        "100,000 Real Indian Followers",
        "📍 Official Meta Blue Tick Request",
        "📍 10,000 Likes + 100,000 Reel Views",
        "Dedicated VIP Server Delivery"
      ]
    },
    {
      id: "prod-insta-1m-vvip",
      slug: "1M-followers-blue-tick-vvip",
      title: "1M Followers + Blue Tick",
      subTitle: "VVIP Exclusive Celebrity Card",
      price: 600,
      originalPrice: 9999,
      tag: "💎 VVIP EXCLUSIVE",
      badgeColor: "bg-amber-400 text-black font-black",
      isVvip: true,
      desc: "Is 1 Million Super Pack me 10 Lakh Real Followers aur Mega Online Status Milta Hai.",
      bonus: "CLAIM VVIP CELEBRITY STATUS NOW",
      features: [
        "1,000,000 (10 Lakh) Real Followers",
        "Official Meta Blue Tick Badge Request",
        "100,000 Bonus Post Likes & Reels Views",
        "VIP Dedicated WhatsApp Manager",
        "100% Lifetime Auto Refill Guarantee"
      ]
    }
  ];

  const likesPackages = [
    {
      id: "prod-likes-1k",
      slug: "1k-post-likes",
      title: "1,000 Indian Post Likes",
      subTitle: "Instant Engagement Booster",
      price: 15,
      originalPrice: 150,
      tag: "❤️ LIKES PACK",
      badgeColor: "bg-rose-500 text-white",
      desc: "Instant 1,000 Post Likes to boost organic reach.",
      features: ["1,000 Real Indian Likes", "Instant Delivery on Post Link", "No Password Needed"]
    },
    {
      id: "prod-likes-10k",
      slug: "10k-post-likes",
      title: "10,000 Indian Post Likes",
      subTitle: "Explore Page Booster",
      price: 49,
      originalPrice: 490,
      tag: "🔥 VIRAL LIKES",
      badgeColor: "bg-purple-600 text-white",
      desc: "10,000 Likes split across your posts.",
      features: ["10,000 High Quality Likes", "Split on Multiple Posts", "Triggers Explore Algorithm"]
    }
  ];

  const viewsPackages = [
    {
      id: "prod-views-50k",
      slug: "50k-reels-views-combo",
      title: "50,000 Reels Views + 5k Likes",
      subTitle: "Reel Algorithm Viral Booster",
      price: 99,
      originalPrice: 990,
      tag: "🎬 VIRAL REELS",
      badgeColor: "bg-rose-600 text-white",
      desc: "50,000 Retention Views + 5,000 Likes for your Reel.",
      features: ["50,000 High Retention Reel Views", "5,000 Reel Likes", "Instant Speed on Reel Link"]
    }
  ];

  const activePackages = selectedCategory === 'followers' 
    ? followerPackages 
    : selectedCategory === 'likes' 
    ? likesPackages 
    : viewsPackages;

  // Open Compact SMM Checkout Modal
  const handleOpenCheckoutModal = (pkg) => {
    setActivePack(pkg);
    setModalInstaHandle('');
    setModalError('');
    setIsModalOpen(true);
  };

  // Trigger Instant Razorpay Payment inside Modal
  const handleExecutePayment = (e) => {
    e.preventDefault();
    if (!modalInstaHandle.trim()) {
      setModalError('Please enter your Instagram Username or Reel Link!');
      return;
    }
    setModalError('');

    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID || process.env.REACT_APP_RAZORPAY_KEY_ID;

    // If real Razorpay key present, trigger live Razorpay
    if (razorpayKey && window.Razorpay) {
      setIsProcessingPayment(true);
      const options = {
        key: razorpayKey,
        amount: Math.round(activePack.price * 100),
        currency: 'INR',
        name: 'FollowersFuel SMM',
        description: `${activePack.title} - Handle: ${modalInstaHandle.trim()}`,
        image: typeof window !== 'undefined' && window.location.origin ? `${window.location.origin}/logo.png?v=2` : 'https://bazara.in/logo.png?v=2',
        prefill: {
          contact: '9876543210',
          email: `${modalInstaHandle.replace(/[^a-zA-Z0-9]/g, '') || 'user'}@followersfuel.shop`,
          name: modalInstaHandle.trim()
        },
        theme: { color: '#ff2b7d' },
        modal: {
          ondismiss: function () {
            setIsProcessingPayment(false);
          }
        },
        handler: function (response) {
          setIsProcessingPayment(false);
          setIsModalOpen(false);
          onBuyProduct({
            ...activePack,
            customNote: `Instagram Handle: ${modalInstaHandle.trim()}`,
            razorpayPaymentId: response.razorpay_payment_id
          });
        }
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } else {
      // Fallback: Direct Checkout Page trigger
      setIsModalOpen(false);
      onBuyProduct({
        ...activePack,
        customNote: `Instagram Handle: ${modalInstaHandle.trim()}`
      });
    }
  };

  const faqs = [
    {
      q: "Kya followers real hote hain aur drop honge?",
      a: "Haan, hum 100% Real Indian Non-Drop Followers deliver karte hain. 30-Day se lekar lifetime auto-refill guarantee included hoti hai."
    },
    {
      q: "Kya Instagram Password dena padega?",
      a: "Bilkul NAHI! Hum kabhi bhi password nahi maangte. Sirf aapka Username (@username) ya Link chahiye hota hai."
    },
    {
      q: "Delivery kitne time me start hoti hai?",
      a: "Payment successfully hote hi automated server 60 seconds ke andar delivery auto-start kar deta hai."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-rose-500 selection:text-white pb-20">
      
      {/* Top Ticker */}
      <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 text-white text-xs font-bold py-2.5 px-4 text-center shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-center space-x-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          <span>👑 100% REAL INDIAN PREMIUM • INSTANT DELIVERY • OFFER EXPIRES IN:</span>
          <span className="bg-black/30 px-2 py-0.5 rounded font-mono font-black text-amber-300">
            {String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2.5 cursor-pointer" onClick={onNavigateToStore}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-500 p-0.5 flex items-center justify-center shadow-sm">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <InstagramIcon className="w-5 h-5 text-rose-600" />
              </div>
            </div>
            <div>
              <span className="font-black text-lg tracking-tight text-slate-900">followersfuel🚀</span>
              <span className="text-[10px] ml-1 px-1.5 py-0.5 bg-rose-100 text-rose-700 font-black rounded-md uppercase">bazara</span>
            </div>
          </div>

          <a 
            href={`https://wa.me/${(settings?.support_whatsapp || '919837371137').replace(/[^0-9]/g, '')}?text=Hi%20FollowersFuel%20Support`}
            target="_blank" 
            rel="noreferrer"
            className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-extrabold flex items-center space-x-1 transition-all"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>Support</span>
          </a>
        </div>
      </header>

      {/* Category Selection Bar (Matching followersfuel screenshot) */}
      <section className="py-6 px-4 max-w-xl mx-auto">
        <div className="bg-white p-1.5 rounded-2xl border-2 border-rose-500/20 shadow-sm flex items-center justify-between gap-1">
          <button
            onClick={() => setSelectedCategory('followers')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              selectedCategory === 'followers'
                ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            👥 Followers
          </button>
          <button
            onClick={() => setSelectedCategory('likes')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              selectedCategory === 'likes'
                ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ❤️ Likes
          </button>
          <button
            onClick={() => setSelectedCategory('views')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              selectedCategory === 'views'
                ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🎬 Views
          </button>
        </div>
      </section>

      {/* Package List Grid (Exact Cards from Screenshot) */}
      <section className="px-4 max-w-lg mx-auto space-y-6">
        {activePackages.map((pkg) => (
          <div
            key={pkg.id}
            className={`relative bg-white rounded-3xl p-6 transition-all duration-200 border text-center ${
              pkg.isVvip 
                ? 'bg-gradient-to-b from-slate-900 via-slate-950 to-black text-white border-amber-400 shadow-2xl' 
                : pkg.popular
                ? 'border-amber-400 bg-gradient-to-b from-amber-50/30 to-white shadow-lg shadow-amber-500/10'
                : 'border-slate-200 shadow-md'
            }`}
          >
            {/* Tag Badge */}
            {pkg.tag && (
              <div className={`absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm whitespace-nowrap ${pkg.badgeColor}`}>
                {pkg.tag}
              </div>
            )}

            {/* Title */}
            <h3 className={`text-2xl font-black pt-2 ${pkg.isVvip ? 'text-amber-300' : 'text-slate-900'}`}>
              {pkg.title}
            </h3>

            {/* Price */}
            <div className="my-3">
              <span className={`text-4xl font-black ${pkg.isVvip ? 'text-amber-400' : 'text-rose-600'}`}>
                ₹{pkg.price}
              </span>
              <span className="text-xs text-slate-400 line-through ml-2">₹{pkg.originalPrice}</span>
            </div>

            {/* Description */}
            <p className={`text-xs font-medium leading-relaxed px-2 ${pkg.isVvip ? 'text-slate-300' : 'text-slate-600'}`}>
              {pkg.desc}
            </p>

            {/* Bonus Pill */}
            {pkg.bonus && (
              <div className={`mt-3 py-1.5 px-3 rounded-xl text-xs font-extrabold ${
                pkg.isVvip ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30' : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}>
                {pkg.bonus}
              </div>
            )}

            {/* Buy Button */}
            <button
              onClick={() => handleOpenCheckoutModal(pkg)}
              className={`w-full mt-5 py-4 px-6 rounded-2xl font-black text-base uppercase tracking-wider shadow-lg flex items-center justify-center space-x-2 transition-all transform active:scale-95 cursor-pointer ${
                pkg.isVvip
                  ? 'bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-black shadow-amber-400/25'
                  : 'bg-gradient-to-r from-rose-500 via-pink-600 to-rose-600 text-white shadow-rose-500/25 hover:brightness-105'
              }`}
            >
              <span>{pkg.isVvip ? 'CLAIM VVIP STATUS NOW' : 'Buy Now'}</span>
            </button>

          </div>
        ))}
      </section>

      {/* FAQ Accordion */}
      <section className="py-10 px-4 max-w-lg mx-auto border-t border-slate-200/60 mt-10">
        <h3 className="text-lg font-black text-slate-900 text-center mb-4">Frequently Asked Questions</h3>
        <div className="space-y-2">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full px-4 py-3 text-left flex items-center justify-between font-bold text-xs text-slate-900 cursor-pointer"
              >
                <span>{faq.q}</span>
                {activeFaq === idx ? <ChevronUp className="w-4 h-4 text-rose-500" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              {activeFaq === idx && (
                <div className="px-4 pb-3 text-xs text-slate-600 border-t border-slate-100 pt-2 font-medium">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Live Sales Toast */}
      {toastNotification && (
        <div className="fixed bottom-6 left-4 z-50 bg-slate-900 text-white p-3 rounded-2xl shadow-2xl border border-slate-800 flex items-center space-x-3 max-w-xs animate-slide-up">
          <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="text-[11px] leading-snug">
            <p className="font-extrabold text-white">{toastNotification.name}</p>
            <p className="text-slate-300">{toastNotification.action}</p>
          </div>
        </div>
      )}

      {/* ULTRA-COMPACT 1-STEP SMM CHECKOUT MODAL (No Name, Email, or Phone required) */}
      {isModalOpen && activePack && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white text-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 overflow-hidden relative p-6 space-y-4 animate-scale-up">
            
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                1-Step Instant Checkout
              </span>
              <h2 className="text-xl font-black text-slate-900 mt-2">
                {activePack.title}
              </h2>
              <div className="flex items-baseline space-x-2 mt-1">
                <span className="text-3xl font-black text-rose-600">₹{activePack.price}</span>
                <span className="text-xs text-slate-400 line-through">₹{activePack.originalPrice}</span>
              </div>
            </div>

            {/* Single Input Field: Instagram Username / Profile Link */}
            <form onSubmit={handleExecutePayment} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                  Instagram Profile Username or Reel Link <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-black">
                    @
                  </div>
                  <input
                    type="text"
                    required
                    value={modalInstaHandle}
                    onChange={(e) => {
                      setModalInstaHandle(e.target.value);
                      if (modalError) setModalError('');
                    }}
                    placeholder="e.g. virat.kohli or insta profile URL"
                    className="w-full pl-9 pr-4 py-3.5 bg-slate-50 text-slate-900 placeholder-slate-400 font-semibold text-sm rounded-2xl border border-slate-200 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20 transition-all"
                  />
                </div>
                {modalError && (
                  <p className="text-xs font-bold text-rose-600 mt-1 flex items-center space-x-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{modalError}</span>
                  </p>
                )}
              </div>

              {/* Guarantees Badges */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 text-[11px] font-bold text-slate-600 space-y-1">
                <div className="flex items-center space-x-1.5 text-emerald-600">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>100% Safe • Password ki koi zarurat nahi hai</span>
                </div>
                <div className="flex items-center space-x-1.5 text-slate-700">
                  <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Payment ke baad instant 60 seconds me auto-start</span>
                </div>
              </div>

              {/* Instant Pay Button */}
              <button
                type="submit"
                disabled={isProcessingPayment}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-600 to-rose-600 text-white font-black text-base uppercase tracking-wider shadow-lg shadow-rose-500/25 hover:brightness-105 transition-all transform active:scale-95 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                {isProcessingPayment ? (
                  <span>Opening Razorpay Gateway...</span>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    <span>PAY ₹{activePack.price} NOW</span>
                  </>
                )}
              </button>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
