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
  AlertCircle
} from 'lucide-react';

const InstagramIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export default function FollowersGrowthPage({ onBuyProduct, onNavigateToStore, settings }) {
  const [selectedCategory, setSelectedCategory] = useState('followers'); // 'followers' | 'reels'
  const [instaHandle, setInstaHandle] = useState('');
  const [handleError, setHandleError] = useState('');
  const [selectedPackId, setSelectedPackId] = useState('prod-insta-50k');
  const [activeFaq, setActiveFaq] = useState(null);
  const [toastNotification, setToastNotification] = useState(null);

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

  // Live Sales Toasts Simulation
  useEffect(() => {
    const notifications = [
      { name: "Rahul S. from Delhi", action: "bought 50,000 Instagram Followers", time: "2 mins ago" },
      { name: "Priya M. from Mumbai", action: "unlocked 100k PRO Influencer Pack", time: "Just now" },
      { name: "Vikram K. from Bangalore", action: "purchased 1,000,000 VVIP Blue Tick Pack", time: "4 mins ago" },
      { name: "Ananya R. from Jaipur", action: "bought 50,000 Reels Views Boost", time: "1 min ago" },
      { name: "Suresh P. from Ahmedabad", action: "bought 10,000 Followers Pack", time: "5 mins ago" }
    ];

    let index = 0;
    const toastInterval = setInterval(() => {
      setToastNotification(notifications[index % notifications.length]);
      index++;
      setTimeout(() => setToastNotification(null), 4500);
    }, 9000);

    return () => clearInterval(toastInterval);
  }, []);

  const followerPackages = [
    {
      id: "prod-insta-10k",
      slug: "10k-instagram-followers",
      title: "10,000 Followers",
      subTitle: "Starter Profile Booster",
      price: 99,
      originalPrice: 999,
      tag: "⚡ STARTER PACK",
      badgeColor: "bg-blue-600 text-white",
      popular: false,
      features: [
        "10,000 Real Non-Drop Followers",
        "Instant Start (2 - 5 Minutes)",
        "100% Safe — No Password Needed",
        "30-Day Auto Refill Guarantee"
      ]
    },
    {
      id: "prod-insta-50k",
      slug: "50k-instagram-followers-combo",
      title: "50,000 Followers + 10k Likes",
      subTitle: "Viral Profile Accelerator",
      price: 199,
      originalPrice: 2499,
      tag: "🔥 MOST POPULAR & BEST SELLER",
      badgeColor: "bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white",
      popular: true,
      features: [
        "50,000 Real Non-Drop Followers",
        "FREE BONUS: 10,000 High Quality Post Likes",
        "Instant VIP Server Speed (Under 60 sec)",
        "Lifetime Auto Refill Protection",
        "Boosts Profile Reach & Explore Ranking"
      ]
    },
    {
      id: "prod-insta-100k",
      slug: "100k-instagram-followers-pro",
      title: "100,000 Followers",
      subTitle: "PRO Creator & Brand Pack",
      price: 299,
      originalPrice: 3999,
      tag: "👑 PRO CREATOR CHOICE",
      badgeColor: "bg-purple-600 text-white",
      popular: false,
      features: [
        "100,000 Real Active Followers",
        "25,000 Bonus Likes & Story Views",
        "Super Priority Server Speed",
        "Lifetime Refill Guarantee",
        "Unlocks Brand Sponsorship Deals"
      ]
    },
    {
      id: "prod-insta-1m-vvip",
      slug: "1M-followers-blue-tick-vvip",
      title: "1 Million + Meta Blue Tick Request",
      subTitle: "VVIP Celebrity & Brand Empire",
      price: 599,
      originalPrice: 9999,
      tag: "💎 VVIP EXCLUSIVE EDITION",
      badgeColor: "bg-black text-amber-300 border border-amber-400/50",
      isVvip: true,
      features: [
        "1,000,000 (1 Million) Real Followers",
        "Official Meta Blue Tick Badge Request Guide",
        "100,000 Bonus Post Likes & Reels Views",
        "Dedicated VIP 1-on-1 Support Manager",
        "100% Lifetime Auto Refill Guarantee"
      ]
    }
  ];

  const reelsPackages = [
    {
      id: "prod-insta-reels-boost",
      slug: "50k-reels-views-boost",
      title: "50,000 Reel Views + 5k Likes",
      subTitle: "Reel Algorithm Booster",
      price: 149,
      originalPrice: 1499,
      tag: "🎬 REELS VIRAL BOOSTER",
      badgeColor: "bg-rose-600 text-white",
      features: [
        "50,000 High Retention Reel Views",
        "5,000 High Quality Reel Likes",
        "Instant Speed on Reel Link",
        "Triggers Explore Page Algorithm"
      ]
    }
  ];

  const activePackages = selectedCategory === 'followers' ? followerPackages : reelsPackages;
  const currentSelectedPack = activePackages.find(p => p.id === selectedPackId) || activePackages[0];

  const handleCheckoutSubmit = (pkg) => {
    const targetPack = pkg || currentSelectedPack;
    if (!instaHandle.trim()) {
      setHandleError('Please enter your Instagram Profile Username or Reel Link before proceeding!');
      window.scrollTo({ top: 350, behavior: 'smooth' });
      return;
    }
    setHandleError('');

    // Attach handle/link to checkout payload
    onBuyProduct({
      ...targetPack,
      customNote: `Instagram Handle/Link: ${instaHandle.trim()}`
    });
  };

  const faqs = [
    {
      q: "Kya followers real hote hain aur drop honge?",
      a: "Haan, hum sirf high quality non-drop followers deliver karte hain. Humare sabhi packages 30-day se lekar lifetime auto-refill guarantee ke saath aate hain. Agar kabhi follow count thoda drop hota hai toh system use automatically auto-refill kar deta hai."
    },
    {
      q: "Kya mujhe apna Instagram Password dena hoga?",
      a: "Bilkul NAHI! Hum kabhi bhi aapka password nahi maangte. Humko sirf aapka Public Profile Username (@username) ya Reel Link chahiye hota hai. Aapka account 100% safe rahega."
    },
    {
      q: "Delivery start hone me kitna time lagta hai?",
      a: "Payment successfully hone ke turant baad (2 se 5 minutes ke andar) delivery auto-start ho jaati hai. 50k & 100k packages 15-30 mins me complete ho jaate hain."
    },
    {
      q: "Kya mera Instagram account ban toh nahi hoga?",
      a: "Bilkul safe hai. Humara delivery algorithm Instagram ke daily guidelines and security limits ke acccording kaam karta hai. Abhi tak 50,000+ creators and profiles grow ho chuki hain."
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-rose-500 selection:text-white">
      
      {/* Top Urgency Ticker Bar */}
      <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 text-white text-xs sm:text-sm font-bold py-2.5 px-4 text-center shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-center space-x-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          <span>⚡ SPECIAL FLASH SALE: 90% OFF ALL PACKAGES — Offer Expires In:</span>
          <span className="bg-black/30 px-2 py-0.5 rounded font-mono font-black text-amber-300">
            {String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={onNavigateToStore}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-0.5 flex items-center justify-center shadow-md">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                <InstagramIcon className="w-5 h-5 text-rose-600" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-black text-lg tracking-tight text-slate-900">followersfuel</span>
                <span className="text-xs px-1.5 py-0.5 bg-rose-100 text-rose-700 font-extrabold rounded-md uppercase">by bazara</span>
              </div>
              <p className="text-[10px] text-slate-500 font-semibold tracking-wide">#1 PREMIUM SMM GROWTH STORE</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="hidden md:flex items-center space-x-4 text-xs font-bold text-slate-600">
              <span className="flex items-center space-x-1"><ShieldCheck className="w-4 h-4 text-emerald-500" /> <span>100% Safe</span></span>
              <span className="flex items-center space-x-1"><Lock className="w-4 h-4 text-blue-500" /> <span>No Password</span></span>
              <span className="flex items-center space-x-1"><Zap className="w-4 h-4 text-amber-500" /> <span>Instant Delivery</span></span>
            </div>
            <a 
              href={`https://wa.me/${(settings?.support_whatsapp || '919837371137').replace(/[^0-9]/g, '')}?text=Hi%20FollowersFuel%20Support`}
              target="_blank" 
              rel="noreferrer"
              className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold flex items-center space-x-1.5 transition-all"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">WhatsApp Help</span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-8 pb-12 px-4 bg-gradient-to-b from-rose-50/50 via-white to-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-rose-500/10 via-purple-500/10 to-amber-500/10 border border-rose-200/60 px-4 py-1.5 rounded-full shadow-xs">
            <Sparkles className="w-4 h-4 text-rose-600 animate-spin" />
            <span className="text-xs font-extrabold text-slate-800 tracking-wide uppercase">
              Official Non-Drop Instagram Growth Protocol
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Grow Your Instagram Profile with <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-rose-600 via-purple-600 to-amber-500 bg-clip-text text-transparent">
              100% Real Non-Drop Followers
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
            Get instant Instagram Followers, Post Likes & Reels Views at guaranteed lowest rates. 
            No password required • 100% Safe • 30-Day Auto Refill Guarantee.
          </p>

          {/* Social Proof Trust Badges */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-slate-600">
            <div className="flex items-center space-x-1 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-xs">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
              <span className="text-slate-900 font-extrabold ml-1">4.98/5</span>
              <span className="text-slate-400">(68,000+ Orders)</span>
            </div>
            <div className="flex items-center space-x-1 bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-full border border-emerald-200/60">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Instant Auto Server Delivery</span>
            </div>
          </div>

          {/* User Handle Input Card (High Conversion Centerpiece) */}
          <div className="mt-8 max-w-xl mx-auto bg-white p-5 sm:p-6 rounded-3xl border-2 border-rose-500/20 shadow-xl shadow-rose-500/5 text-left space-y-3">
            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">
              Step 1: Enter Your Instagram Profile Username or Reel Link
            </label>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-bold">
                @
              </div>
              <input
                type="text"
                value={instaHandle}
                onChange={(e) => {
                  setInstaHandle(e.target.value);
                  if (handleError) setHandleError('');
                }}
                placeholder="e.g. virat.kohli or insta profile URL"
                className={`w-full pl-9 pr-4 py-3.5 bg-slate-50 text-slate-900 placeholder-slate-400 font-semibold rounded-2xl border ${
                  handleError ? 'border-rose-500 bg-rose-50/50' : 'border-slate-200 focus:border-rose-500'
                } focus:outline-none focus:ring-2 focus:ring-rose-500/20 text-sm transition-all`}
              />
            </div>

            {handleError ? (
              <p className="text-xs font-bold text-rose-600 flex items-center space-x-1 animate-bounce">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{handleError}</span>
              </p>
            ) : (
              <p className="text-[11px] text-slate-500 flex items-center space-x-1">
                <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>100% Confidential. Password ki zarurat NAHI hai.</span>
              </p>
            )}
          </div>

        </div>
      </section>

      {/* Category Tabs */}
      <section className="py-8 px-4 max-w-6xl mx-auto">
        <div className="flex items-center justify-center space-x-3 max-w-md mx-auto bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button
            onClick={() => {
              setSelectedCategory('followers');
              setSelectedPackId('prod-insta-50k');
            }}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
              selectedCategory === 'followers'
                ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Instagram Followers</span>
          </button>
          <button
            onClick={() => {
              setSelectedCategory('reels');
              setSelectedPackId('prod-insta-reels-boost');
            }}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
              selectedCategory === 'reels'
                ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Play className="w-4 h-4" />
            <span>Reels Viral Boost</span>
          </button>
        </div>

        {/* Package Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {activePackages.map((pkg) => {
            const isSelected = selectedPackId === pkg.id;
            return (
              <div
                key={pkg.id}
                onClick={() => setSelectedPackId(pkg.id)}
                className={`relative bg-white rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between border cursor-pointer ${
                  pkg.isVvip 
                    ? 'bg-gradient-to-b from-slate-900 to-black text-white border-amber-400 shadow-2xl' 
                    : isSelected
                    ? 'border-rose-500 shadow-xl shadow-rose-500/10 ring-2 ring-rose-500/20 scale-[1.02]'
                    : 'border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md'
                }`}
              >
                {/* Tag Badge */}
                {pkg.tag && (
                  <div className={`absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm shrink-0 whitespace-nowrap ${pkg.badgeColor}`}>
                    {pkg.tag}
                  </div>
                )}

                <div>
                  {/* Header Title */}
                  <div className="text-center pt-2 pb-4 border-b border-slate-100/10">
                    <h3 className={`text-xl font-black ${pkg.isVvip ? 'text-amber-300' : 'text-slate-900'}`}>
                      {pkg.title}
                    </h3>
                    <p className={`text-xs font-medium ${pkg.isVvip ? 'text-slate-400' : 'text-slate-500'}`}>
                      {pkg.subTitle}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="text-center py-5">
                    <div className="flex items-baseline justify-center space-x-2">
                      <span className={`text-4xl sm:text-5xl font-black ${pkg.isVvip ? 'text-amber-400' : 'text-rose-600'}`}>
                        ₹{pkg.price}
                      </span>
                      <span className={`text-sm line-through ${pkg.isVvip ? 'text-slate-500' : 'text-slate-400'}`}>
                        ₹{pkg.originalPrice}
                      </span>
                    </div>
                    <p className={`text-[11px] font-bold uppercase tracking-wider mt-1 ${pkg.isVvip ? 'text-amber-300/80' : 'text-emerald-600'}`}>
                      ⚡ Instant Auto Delivery Included
                    </p>
                  </div>

                  {/* Feature List */}
                  <ul className="space-y-3 text-xs font-semibold py-2">
                    {pkg.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${pkg.isVvip ? 'text-amber-400' : 'text-rose-500'}`} />
                        <span className={pkg.isVvip ? 'text-slate-200' : 'text-slate-700'}>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Buy Button */}
                <div className="pt-6">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCheckoutSubmit(pkg);
                    }}
                    className={`w-full py-3.5 px-4 rounded-2xl font-black text-sm uppercase tracking-wider shadow-lg flex items-center justify-center space-x-2 transition-all transform active:scale-95 cursor-pointer ${
                      pkg.isVvip
                        ? 'bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-black hover:brightness-110 shadow-amber-400/20'
                        : pkg.popular
                        ? 'bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 text-white hover:opacity-95 shadow-rose-500/25'
                        : 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-900/10'
                    }`}
                  >
                    <span>BUY NOW — ₹{pkg.price}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </section>

      {/* Why Choose Us Trust Section */}
      <section className="py-12 px-4 bg-slate-50 border-y border-slate-200/60">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Kyu 68,000+ Creators Trust FollowersFuel?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
              Pure quality and instant server delivery with 100% money back safety.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900">No Password Required</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Aapke profile ki safety 100% humari guarantee hai. Hum kabhi bhi aapka Instagram password nahi maangte.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900">Instant Automated Server</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Payment hote hi server instant auto-trigger ho jaata hai aur 2-5 mins me delivery start ho jaati hai.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900">30-Day Auto Refill Guarantee</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Agar kabhi follow count me thoda sa bhi drop aata hai, humara system 30 dino tak auto-refill karta hai.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Real Customer Reviews Section */}
      <section className="py-12 px-4 max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <span className="text-xs font-extrabold text-rose-600 uppercase tracking-widest">Real Customer Reviews</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">Creators & Influencers Feedback</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center space-x-1 text-amber-400">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
            </div>
            <p className="text-xs text-slate-700 font-medium italic">
              "Bhai ₹199 wale 50k pack me mast delivery mil gayi! 10 mins ke andar sare followers aur 10k bonus likes aagaye."
            </p>
            <div className="flex items-center space-x-2 pt-2 border-t border-slate-100">
              <div className="w-8 h-8 rounded-full bg-rose-500 text-white font-black text-xs flex items-center justify-center">R</div>
              <div>
                <p className="text-xs font-extrabold text-slate-900">Rohan Mehta</p>
                <p className="text-[10px] text-slate-400">Verified Buyer • Delhi</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center space-x-1 text-amber-400">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
            </div>
            <p className="text-xs text-slate-700 font-medium italic">
              "Maine Reel Viral boost buy kiya tha. Meri Reel viral hoke 1,20,000 views touch kar gayi! Truly high conversion tool."
            </p>
            <div className="flex items-center space-x-2 pt-2 border-t border-slate-100">
              <div className="w-8 h-8 rounded-full bg-purple-500 text-white font-black text-xs flex items-center justify-center">S</div>
              <div>
                <p className="text-xs font-extrabold text-slate-900">Sneha Sharma</p>
                <p className="text-[10px] text-slate-400">Verified Creator • Jaipur</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center space-x-1 text-amber-400">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
            </div>
            <p className="text-xs text-slate-700 font-medium italic">
              "1 Million VVIP pack best deal thi. Meta Blue Tick guidance ne help kar diya. 100% recommended for serious creators!"
            </p>
            <div className="flex items-center space-x-2 pt-2 border-t border-slate-100">
              <div className="w-8 h-8 rounded-full bg-black text-amber-400 font-black text-xs flex items-center justify-center">A</div>
              <div>
                <p className="text-xs font-extrabold text-slate-900">Aman Verma</p>
                <p className="text-[10px] text-slate-400">Verified Brand • Mumbai</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="py-12 px-4 max-w-3xl mx-auto border-t border-slate-200/60">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-slate-900">Frequently Asked Questions</h2>
          <p className="text-xs text-slate-500 font-semibold mt-1">Frequently asked questions by creators</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full px-5 py-4 text-left flex items-center justify-between font-bold text-xs sm:text-sm text-slate-900 cursor-pointer"
              >
                <span>{faq.q}</span>
                {activeFaq === idx ? <ChevronUp className="w-4 h-4 text-rose-500 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
              </button>
              {activeFaq === idx && (
                <div className="px-5 pb-4 text-xs text-slate-600 leading-relaxed font-medium border-t border-slate-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Live Sales Notification Toast */}
      {toastNotification && (
        <div className="fixed bottom-20 left-4 z-50 bg-slate-900 text-white p-3.5 rounded-2xl shadow-2xl border border-slate-800 flex items-center space-x-3 max-w-xs animate-slide-up">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="text-[11px] leading-snug">
            <p className="font-extrabold text-white">{toastNotification.name}</p>
            <p className="text-slate-300 font-medium">{toastNotification.action}</p>
            <span className="text-[9px] text-emerald-400 font-bold">{toastNotification.time}</span>
          </div>
        </div>
      )}

      {/* Mobile Sticky Bottom Quick Bar */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 shadow-2xl flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">SELECTED PACK</span>
          <p className="text-sm font-black text-rose-600">₹{currentSelectedPack.price} <span className="text-[10px] text-slate-400 line-through">₹{currentSelectedPack.originalPrice}</span></p>
        </div>
        <button
          onClick={() => handleCheckoutSubmit(currentSelectedPack)}
          className="py-3 px-6 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-extrabold text-xs uppercase tracking-wider shadow-md flex items-center space-x-1"
        >
          <span>BUY NOW</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
