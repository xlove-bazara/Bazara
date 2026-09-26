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
  Menu
} from 'lucide-react';

const InstagramIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export default function FollowersGrowthPage({ onBuyProduct, onNavigateToStore, settings }) {
  const [activePlatform, setActivePlatform] = useState('instagram'); // 'instagram' | 'unban' | 'youtube' | 'facebook' | 'telegram'
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

  // Dynamic Live Sales Toasts Simulation
  useEffect(() => {
    const notifications = [
      { name: "Rahul S. from Delhi", action: "bought 1k Indian Followers (₹99)", time: "1 min ago" },
      { name: "Priya M. from Mumbai", action: "bought 10k Indian Followers (₹199)", time: "Just now" },
      { name: "Vikram K. from Bangalore", action: "purchased 100k Indian Views (₹50)", time: "3 mins ago" },
      { name: "Ananya R. from Jaipur", action: "bought 1k Indian Likes (₹40)", time: "2 mins ago" },
      { name: "Suresh P. from Ahmedabad", action: "bought 30k Followers + Blue Tick (₹250)", time: "4 mins ago" },
      { name: "Deepak G. from Chandigarh", action: "bought 1M Followers + Blue Tick (₹600)", time: "Just now" },
      { name: "Simran K. from Ludhiana", action: "bought 500k Indian Views (₹100)", time: "5 mins ago" }
    ];

    let index = 0;
    const toastInterval = setInterval(() => {
      setToastNotification(notifications[index % notifications.length]);
      index++;
      setTimeout(() => setToastNotification(null), 4500);
    }, 7500);

    return () => clearInterval(toastInterval);
  }, []);

  // Exact Followers Packages (Screenshot 1)
  const followerPackages = [
    {
      id: "prod-insta-100",
      slug: "100-indian-followers",
      title: "100 Indian Followers",
      price: 16,
      originalPrice: 160,
      tag: "⚡ STARTER PACK",
      badgeColor: "bg-pink-600 text-white",
      desc: "Premium Quality: Hum 100 Indian Followers aapko dete hain. Instant delivery fast speed.",
      features: ["100 Real Indian Followers", "Instant Fast Delivery", "30-Day Auto Refill Guarantee"]
    },
    {
      id: "prod-insta-1k",
      slug: "1k-indian-followers",
      title: "1k Indian Followers",
      price: 99,
      originalPrice: 999,
      tag: "⭐ BEST SELLER",
      badgeColor: "bg-amber-400 text-slate-950 font-black",
      desc: "Authority Booster: 1,000 Real Indian Followers aapke profile authority ko boost karne me help karta hain.",
      popular: true,
      features: ["1,000 Real Indian Followers", "Instant Delivery (60 Seconds)", "Boosts Profile Authority & Reach"]
    },
    {
      id: "prod-insta-10k",
      slug: "10k-indian-followers-combo",
      title: "10k Indian Followers",
      price: 199,
      originalPrice: 1999,
      tag: "🔥 INSTANT GROWTH",
      badgeColor: "bg-rose-600 text-white",
      desc: "Organic Vibe: 10,000 Followers se aapka profile saaf saaf professional lagta hai.",
      bonus: "🎁 MEGA BONUS: 5K LIKES FREE On All Posts! 🔥",
      features: ["10,000 Real Indian Followers", "🎁 MEGA BONUS: 5,000 Free Post Likes", "Instant VIP Speed"]
    },
    {
      id: "prod-insta-30k",
      slug: "30k-indian-followers-bluetick",
      title: "30k Indian Followers 🌐",
      price: 250,
      originalPrice: 2500,
      tag: "📌 TRENDING",
      badgeColor: "bg-purple-600 text-white",
      desc: "Influence Power: 30,000 Indian Followers aapko instant creator/influencer bana dete hain.",
      bonus: "🎁 EXCLUSIVE: Blue Tick (Verification) Free! 📑",
      features: ["30,000 Real Indian Followers", "🎁 EXCLUSIVE: Blue Tick Verification Free", "Lifetime Non-Drop"]
    },
    {
      id: "prod-insta-50k",
      slug: "50k-indian-followers-vvip",
      title: "50k Indian Followers 🌐",
      price: 350,
      originalPrice: 3500,
      tag: "💎 VVIP PERSONAL PACK",
      badgeColor: "bg-gradient-to-r from-rose-500 to-amber-500 text-white",
      desc: "Brand Authority: Professional Brands ke liye ye sabse best option.",
      bonus: "🎁 COMBO FREE: Blue Tick + 5k Likes On All Posts! ✨",
      features: ["50,000 Real Indian Followers", "🎁 COMBO FREE: Blue Tick + 5k Likes", "Instant Celebrity Speed"]
    },
    {
      id: "prod-insta-100k",
      slug: "100k-indian-followers-mega",
      title: "100k Indian Followers 🌐",
      price: 500,
      originalPrice: 5000,
      tag: "👑 MEGA EMPIRE",
      badgeColor: "bg-slate-900 text-rose-400 border border-rose-500/50",
      desc: "Mega Empire: 1 Lakh Indian Followers ka yeh pack aapko celebrity-like status deta hai.",
      bonus: "📍 VVIP NON-DROP • Blue Tick • 10k Likes • 100k Views",
      features: ["100,000 Real Indian Followers", "📍 Official Meta Blue Tick Request", "📍 10,000 Likes + 100,000 Views"]
    },
    {
      id: "prod-insta-1m-vvip",
      slug: "1M-followers-blue-tick-vvip",
      title: "1M Followers + Blue Tick",
      price: 600,
      originalPrice: 9999,
      tag: "💎 VVIP EXCLUSIVE",
      badgeColor: "bg-amber-400 text-black font-black",
      isVvip: true,
      desc: "Is 1 Million Super Pack me 10 Lakh Real Followers aur Mega Online Status Milta Hai.",
      bonus: "CLAIM VVIP CELEBRITY STATUS NOW",
      features: ["1,000,000 (10 Lakh) Real Followers", "Official Meta Blue Tick Badge Request", "VIP Dedicated WhatsApp Support"]
    }
  ];

  // Exact Likes Packages (Screenshot 1)
  const likesPackages = [
    {
      id: "prod-likes-100",
      slug: "100-indian-likes",
      title: "100 Indian Likes",
      price: 15,
      originalPrice: 150,
      tag: "⚡ QUICK START",
      badgeColor: "bg-rose-500 text-white",
      desc: "Instant Interaction: Aapke post ke liye real Indian engagement. Single post par instant active dikhe.",
      features: ["100 Real Indian Likes", "Instant Interaction", "No Password Needed"]
    },
    {
      id: "prod-likes-1k",
      slug: "1k-indian-likes",
      title: "1k Indian Likes",
      price: 40,
      originalPrice: 400,
      tag: "⚡ FINAL BOOST",
      badgeColor: "bg-amber-400 text-slate-950 font-black",
      desc: "Algorithm Favorite: 1,000 Real Likes aapki post ya reel ki reach ko Explore page par push karta hai.",
      popular: true,
      features: ["1,000 Real Indian Likes", "Pushes Reel to Explore Page", "Instant Fast Delivery"]
    },
    {
      id: "prod-likes-10k",
      slug: "10k-indian-likes",
      title: "10k Indian Likes",
      price: 150,
      originalPrice: 1500,
      tag: "🔥 VIRAL ENGAGEMENT",
      badgeColor: "bg-rose-600 text-white",
      desc: "Social Proof: Serious creators ke liye professional pack. 10k Likes dekhte hi automatic trust banta hai.",
      features: ["10,000 Real High Quality Likes", "Split Across Multiple Posts", "Triggers Explore Algorithm"]
    },
    {
      id: "prod-likes-50k",
      slug: "50k-indian-likes",
      title: "50k Indian Likes",
      price: 250,
      originalPrice: 2500,
      tag: "📌 TRENDING",
      badgeColor: "bg-purple-600 text-white",
      desc: "Massive Reach: Trending creators aur campaign boost ke liye perfect. 50,000 Likes poore India me popular banata hai.",
      features: ["50,000 Real Indian Likes", "Massive Post/Reel Boost", "Trusted by Thousands of Influencers"]
    },
    {
      id: "prod-likes-100k",
      slug: "100k-indian-likes-vvip",
      title: "100k Indian Likes",
      price: 500,
      originalPrice: 5000,
      tag: "👑 TOP TIER",
      badgeColor: "bg-amber-400 text-black font-black",
      isVvip: true,
      desc: "Maximum Impact: Sabse bada engagement package! Celebrity level interaction jo aapko top suggestion me dikhayega.",
      features: ["100,000 Real Indian Likes", "Celebrity Level Interaction", "Heavy Real Active Indian Users"]
    }
  ];

  // Exact Views Packages (Screenshot 2)
  const viewsPackages = [
    {
      id: "prod-views-1k",
      slug: "1k-indian-views",
      title: "1k Indian Views",
      price: 10,
      originalPrice: 100,
      tag: "⚡ FAST START",
      badgeColor: "bg-rose-500 text-white",
      desc: "Instant Visibility: Aapke reel ya video ke liye sabse affordable. High retention views.",
      features: ["1,000 High Retention Reel Views", "Instant Fast Delivery", "No Password Needed"]
    },
    {
      id: "prod-views-10k",
      slug: "10k-indian-views",
      title: "10k Indian Views",
      price: 20,
      originalPrice: 200,
      tag: "⚡ EXPLORE PUSH",
      badgeColor: "bg-pink-600 text-white",
      desc: "Algorithm Boost: 10,000 views aapki reel ko Explore section me lane ke liye perfect hai.",
      features: ["10,000 Real Indian Views", "Pushes Content to Explore", "Instant Server Speed"]
    },
    {
      id: "prod-views-100k",
      slug: "100k-indian-views",
      title: "100k Indian Views",
      price: 50,
      originalPrice: 500,
      tag: "👑 HIGH REACH",
      badgeColor: "bg-amber-400 text-slate-950 font-black",
      popular: true,
      desc: "Trending Potential: 1 Lakh views se aapka content viral ho sakta hai. High retention playback.",
      features: ["100,000 Real Reel Views", "Triggers Viral Algorithm", "Instant High Retention"]
    },
    {
      id: "prod-views-500k",
      slug: "500k-indian-views",
      title: "500k Indian Views",
      price: 100,
      originalPrice: 1000,
      tag: "🔥 MASS PROMOTION",
      badgeColor: "bg-rose-600 text-white",
      desc: "Viral Surge: Adha million views aapki video ko ek mega viral campaign me badal dete hain.",
      features: ["500,000 High Retention Views", "Adha Million Viral Boost", "Lifetime Guarantee"]
    },
    {
      id: "prod-views-1m",
      slug: "1m-indian-views",
      title: "1M Indian Views",
      price: 200,
      originalPrice: 2000,
      tag: "💎 MEGA VIRAL",
      badgeColor: "bg-purple-600 text-white",
      desc: "Million Views Club: Sapna hai 1 Million views? Ab ye har creator ke budget me hai!",
      features: ["1,000,000 (1 Million) Reel Views", "Million Views Badge Status", "Instant Celebrity Velocity"]
    },
    {
      id: "prod-views-10m",
      slug: "10m-indian-views-vvip",
      title: "10M Indian Views",
      price: 500,
      originalPrice: 5000,
      tag: "👑 ULTIMATE REACH",
      badgeColor: "bg-amber-400 text-black font-black",
      isVvip: true,
      desc: "Global Domination: Sabse bada aur powerful package! 1 Crore views jo sirf celebrity profiles par hote hain.",
      features: ["10,000,000 (1 Crore) Real Views", "100% Guaranteed Viral Surge", "VVIP Dedicated Processing"]
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
        name: 'bazara.in SMM',
        description: `${activePack.title} - Handle: ${modalInstaHandle.trim()}`,
        image: typeof window !== 'undefined' && window.location.origin ? `${window.location.origin}/logo.png?v=2` : 'https://bazara.in/logo.png?v=2',
        prefill: {
          contact: '9876543210',
          email: `${modalInstaHandle.replace(/[^a-zA-Z0-9]/g, '') || 'user'}@bazara.in`,
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
    <div className="min-h-screen bg-[#f8f9fc] text-slate-900 font-sans selection:bg-rose-500 selection:text-white pb-20">
      
      {/* 1. TOP MARQUEE TICKER (Matching Screenshot) */}
      <div className="bg-[#1a1a1a] text-amber-300 text-xs font-bold py-2 overflow-hidden border-b-2 border-amber-400">
        <div className="whitespace-nowrap animate-marquee flex items-center space-x-4">
          <span>👑 VVIP EXCLUSIVE: 1 Million Followers + Official Blue Tick Verification Request @ Only ₹600! Limited Time Offer!</span>
          <span>👑 VVIP EXCLUSIVE: 1 Million Followers + Official Blue Tick Verification Request @ Only ₹600! Limited Time Offer!</span>
        </div>
      </div>

      {/* 2. YELLOW TRUST BAR (Matching Screenshot) */}
      <div className="bg-amber-400 text-slate-950 font-black text-[11px] sm:text-xs py-2 px-3 text-center uppercase tracking-wider shadow-xs">
        ✔ 100% REAL INDIAN PROFILES • INSTANT DELIVERY • 24/7 SUPPORT ✔
      </div>

      {/* 3. RED TIMER BAR (Matching Screenshot) */}
      <div className="bg-rose-600 text-white font-black text-xs sm:text-sm py-2 px-4 text-center tracking-widest shadow-sm">
        OFFER EXPIRES IN: {String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
      </div>

      {/* 4. STICKY HEADER (Branded Bazara - Logo stays on /follower page) */}
      <header className="sticky top-0 z-40 bg-[#ff2b7d] text-white shadow-lg shadow-rose-500/20">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => {
              // Stay on /follower page when clicking logo
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center font-black text-white shadow-inner">
              🚀
            </div>
            <div className="flex items-baseline space-x-1">
              <span className="font-black text-2xl tracking-tight text-white uppercase">bazara</span>
              <span className="text-xs font-black text-amber-300">.in</span>
            </div>
          </div>

          <a 
            href={`https://wa.me/${(settings?.support_whatsapp || '919837371137').replace(/[^0-9]/g, '')}?text=Hi%20Bazara%20Support`}
            target="_blank" 
            rel="noreferrer"
            className="px-3.5 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-black flex items-center space-x-1.5 transition-all border border-white/30"
          >
            <MessageCircle className="w-4 h-4 text-white" />
            <span>Support</span>
          </a>
        </div>
      </header>

      {/* 5. PLATFORM SWITCHER BUTTONS (Matching Screenshot) */}
      <section className="pt-6 px-4 max-w-xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <button
            onClick={() => setActivePlatform('instagram')}
            className={`py-2.5 px-3 rounded-2xl text-xs font-black flex items-center justify-center space-x-1.5 shadow-sm transition-all cursor-pointer ${
              activePlatform === 'instagram' ? 'bg-[#ff2b7d] text-white ring-2 ring-rose-400' : 'bg-white text-slate-700 border border-slate-200'
            }`}
          >
            <span>💖 Instagram</span>
          </button>
          <button
            onClick={() => setActivePlatform('unban')}
            className={`py-2.5 px-3 rounded-2xl text-xs font-black flex items-center justify-center space-x-1.5 shadow-sm transition-all cursor-pointer ${
              activePlatform === 'unban' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white ring-2 ring-purple-400' : 'bg-white text-slate-700 border border-slate-200'
            }`}
          >
            <span>🔒 Insta ID Unban</span>
          </button>
          <button
            onClick={() => setActivePlatform('youtube')}
            className={`py-2.5 px-3 rounded-2xl text-xs font-black flex items-center justify-center space-x-1.5 shadow-sm transition-all cursor-pointer ${
              activePlatform === 'youtube' ? 'bg-red-600 text-white ring-2 ring-red-400' : 'bg-white text-slate-700 border border-slate-200'
            }`}
          >
            <span>🔴 YouTube</span>
          </button>
          <button
            onClick={() => setActivePlatform('facebook')}
            className={`py-2.5 px-3 rounded-2xl text-xs font-black flex items-center justify-center space-x-1.5 shadow-sm transition-all cursor-pointer ${
              activePlatform === 'facebook' ? 'bg-blue-600 text-white ring-2 ring-blue-400' : 'bg-white text-slate-700 border border-slate-200'
            }`}
          >
            <span>🔵 Facebook</span>
          </button>
          <button
            onClick={() => setActivePlatform('telegram')}
            className={`col-span-2 sm:col-span-1 py-2.5 px-3 rounded-2xl text-xs font-black flex items-center justify-center space-x-1.5 shadow-sm transition-all cursor-pointer ${
              activePlatform === 'telegram' ? 'bg-sky-500 text-white ring-2 ring-sky-400' : 'bg-white text-slate-700 border border-slate-200'
            }`}
          >
            <span>✈️ Telegram</span>
          </button>
        </div>
      </section>

      {/* 6. SERVICE CATEGORY TABS (Followers / Likes / Views) */}
      <section className="pt-4 pb-6 px-4 max-w-xl mx-auto">
        <div className="bg-white p-2 rounded-full border-2 border-[#ff2b7d] shadow-md flex items-center justify-between gap-1">
          <button
            onClick={() => setSelectedCategory('followers')}
            className={`flex-1 py-2.5 rounded-full text-xs font-black transition-all cursor-pointer flex items-center justify-center space-x-1 ${
              selectedCategory === 'followers'
                ? 'bg-[#ff2b7d] text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>👥 Followers</span>
          </button>
          <button
            onClick={() => setSelectedCategory('likes')}
            className={`flex-1 py-2.5 rounded-full text-xs font-black transition-all cursor-pointer flex items-center justify-center space-x-1 ${
              selectedCategory === 'likes'
                ? 'bg-[#ff2b7d] text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>❤️ Likes</span>
          </button>
          <button
            onClick={() => setSelectedCategory('views')}
            className={`flex-1 py-2.5 rounded-full text-xs font-black transition-all cursor-pointer flex items-center justify-center space-x-1 ${
              selectedCategory === 'views'
                ? 'bg-[#ff2b7d] text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>🎬 Views</span>
          </button>
        </div>
      </section>

      {/* 7. PACKAGE CARDS GRID */}
      <section className="px-4 max-w-md mx-auto space-y-6">
        {activePackages.map((pkg) => (
          <div
            key={pkg.id}
            className={`relative bg-white rounded-[28px] p-6 text-center transition-all duration-300 border ${
              pkg.isVvip 
                ? 'bg-gradient-to-b from-slate-900 via-slate-950 to-black text-white border-2 border-amber-400 shadow-2xl' 
                : pkg.popular
                ? 'border-2 border-amber-400 bg-gradient-to-b from-amber-50/40 to-white shadow-xl shadow-amber-500/10'
                : 'border border-slate-200/80 shadow-md hover:shadow-lg'
            }`}
          >
            {/* Tag Badge */}
            {pkg.tag && (
              <div className={`absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider shadow-sm whitespace-nowrap ${pkg.badgeColor}`}>
                {pkg.tag}
              </div>
            )}

            {/* Title */}
            <h3 className={`text-2xl font-black pt-2 ${pkg.isVvip ? 'text-amber-300' : 'text-slate-900'}`}>
              {pkg.title}
            </h3>

            {/* Price */}
            <div className="my-3">
              <span className={`text-5xl font-black tracking-tight ${pkg.isVvip ? 'text-amber-400' : 'text-[#ff2b7d]'}`}>
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
              <div className={`mt-3.5 py-2 px-3 rounded-2xl text-xs font-extrabold ${
                pkg.isVvip ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30' : 'bg-rose-50 text-[#ff2b7d] border border-rose-200'
              }`}>
                {pkg.bonus}
              </div>
            )}

            {/* BUY NOW ANIMATED BUTTON */}
            <button
              onClick={() => handleOpenCheckoutModal(pkg)}
              className={`w-full mt-6 py-4 px-6 rounded-2xl font-black text-lg uppercase tracking-wider shadow-xl flex items-center justify-center space-x-2 transition-all transform active:scale-95 cursor-pointer relative overflow-hidden group ${
                pkg.isVvip
                  ? 'bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-black shadow-amber-400/30 animate-pulse'
                  : 'bg-[#ff2b7d] hover:bg-rose-600 text-white shadow-rose-500/30 hover:shadow-rose-500/50'
              }`}
            >
              {/* Button Shine Sweep Effect */}
              <span className="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000" />
              <span className="relative z-10">{pkg.isVvip ? 'CLAIM VVIP STATUS NOW' : 'Buy Now'}</span>
            </button>

          </div>
        ))}
      </section>

      {/* 8. CUSTOMER REVIEWS & FEEDBACK SECTION */}
      <section className="py-12 px-4 max-w-md mx-auto border-t border-slate-200/60 mt-10">
        <div className="text-center mb-6">
          <span className="text-[11px] font-black uppercase tracking-widest text-[#ff2b7d]">⭐ Customer Proof & Ratings</span>
          <h3 className="text-xl font-black text-slate-900 mt-1">Verified Buyer Testimonials</h3>
        </div>

        <div className="space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex text-amber-400 space-x-1">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
            </div>
            <p className="text-xs text-slate-700 font-semibold italic">
              "Bhai ₹99 wale 1k pack ka delivery 2 mins me start ho gaya! Organic reach bhi badh gayi."
            </p>
            <p className="text-[11px] font-extrabold text-slate-900 pt-1 border-t border-slate-100">
              — Vikas S., Mumbai (Verified Buyer)
            </p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex text-amber-400 space-x-1">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
            </div>
            <p className="text-xs text-slate-700 font-semibold italic">
              "₹50 me 100k views pack best deal thi. Meri Reel viral hoke 2 Lakh views cross kar gayi!"
            </p>
            <p className="text-[11px] font-extrabold text-slate-900 pt-1 border-t border-slate-100">
              — Ritu P., Delhi (Verified Creator)
            </p>
          </div>
        </div>
      </section>

      {/* 9. FAQ ACCORDION */}
      <section className="py-8 px-4 max-w-md mx-auto">
        <h3 className="text-lg font-black text-slate-900 text-center mb-4">Frequently Asked Questions</h3>
        <div className="space-y-2">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full px-4 py-3 text-left flex items-center justify-between font-bold text-xs text-slate-900 cursor-pointer"
              >
                <span>{faq.q}</span>
                {activeFaq === idx ? <ChevronUp className="w-4 h-4 text-[#ff2b7d]" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
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

      {/* 10. LIVE SALES TOAST NOTIFICATION */}
      {toastNotification && (
        <div className="fixed bottom-6 left-4 z-50 bg-slate-900 text-white p-3.5 rounded-2xl shadow-2xl border border-slate-800 flex items-center space-x-3 max-w-xs animate-slide-up">
          <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="text-[11px] leading-snug">
            <p className="font-extrabold text-white">{toastNotification.name}</p>
            <p className="text-slate-300 font-medium">{toastNotification.action}</p>
          </div>
        </div>
      )}

      {/* 11. ULTRA-COMPACT 1-STEP SMM CHECKOUT MODAL (No Name, Email, or Phone required) */}
      {isModalOpen && activePack && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
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
              <span className="text-[10px] font-black uppercase tracking-wider text-[#ff2b7d] bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                1-Step Instant Checkout
              </span>
              <h2 className="text-xl font-black text-slate-900 mt-2">
                {activePack.title}
              </h2>
              <div className="flex items-baseline space-x-2 mt-1">
                <span className="text-3xl font-black text-[#ff2b7d]">₹{activePack.price}</span>
                <span className="text-xs text-slate-400 line-through">₹{activePack.originalPrice}</span>
              </div>
            </div>

            {/* Single Input Field: Instagram Username / Profile Link */}
            <form onSubmit={handleExecutePayment} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                  Instagram Profile Username or Reel Link <span className="text-[#ff2b7d]">*</span>
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
                    className="w-full pl-9 pr-4 py-3.5 bg-slate-50 text-slate-900 placeholder-slate-400 font-semibold text-sm rounded-2xl border border-slate-200 focus:border-[#ff2b7d] focus:outline-none focus:ring-2 focus:ring-[#ff2b7d]/20 transition-all"
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
                className="w-full py-4 px-6 rounded-2xl bg-[#ff2b7d] hover:bg-rose-600 text-white font-black text-base uppercase tracking-wider shadow-lg shadow-rose-500/30 transition-all transform active:scale-95 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                {isProcessingPayment ? (
                  <span>Opening Payment Gateway...</span>
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
