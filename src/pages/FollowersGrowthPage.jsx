import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Star, 
  Lock, 
  ArrowRight, 
  MessageCircle, 
  ChevronDown, 
  ChevronUp, 
  Users, 
  Heart, 
  Play, 
  AlertCircle,
  X,
  CreditCard,
  ShieldAlert,
  KeyRound,
  Check,
  Globe,
  Tv,
  Send,
  ThumbsUp
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

  // Dynamic Live Sales Toasts Simulation (Clean White Glassmorphic Style)
  useEffect(() => {
    const notifications = [
      { name: "Rahul S. from Delhi", action: "bought 10k Indian Followers (₹199)", time: "1 min ago", type: "insta" },
      { name: "Anand K. from Jaipur", action: "ordered Insta ID Recovery (₹299)", time: "Just now", type: "unban" },
      { name: "Priya M. from Mumbai", action: "bought 1M Followers + Blue Tick (₹600)", time: "2 mins ago", type: "insta" },
      { name: "Vikram K. from Bangalore", action: "purchased 100k Indian Views (₹50)", time: "3 mins ago", type: "insta" },
      { name: "Sneha G. from Ahmedabad", action: "ordered YouTube 1k Subs Pack (₹299)", time: "4 mins ago", type: "yt" },
      { name: "Suresh P. from Ludhiana", action: "bought 30k Followers + Blue Tick (₹250)", time: "5 mins ago", type: "insta" }
    ];

    let index = 0;
    const toastInterval = setInterval(() => {
      setToastNotification(notifications[index % notifications.length]);
      index++;
      setTimeout(() => setToastNotification(null), 4500);
    }, 7000);

    return () => clearInterval(toastInterval);
  }, []);

  // Instagram Followers Packages
  const followerPackages = [
    {
      id: "prod-insta-100",
      slug: "100-indian-followers",
      title: "100 Indian Followers",
      price: 16,
      originalPrice: 160,
      tag: "⚡ STARTER PACK",
      badgeColor: "bg-rose-100 text-rose-700 border border-rose-200",
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
      badgeColor: "bg-amber-100 text-amber-800 border border-amber-300 font-extrabold",
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
      badgeColor: "bg-rose-500 text-white font-extrabold shadow-sm",
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
      badgeColor: "bg-purple-100 text-purple-800 border border-purple-200",
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
      badgeColor: "bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold",
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
      badgeColor: "bg-slate-900 text-rose-300 border border-slate-700",
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
      badgeColor: "bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-black font-black",
      isVvip: true,
      desc: "Is 1 Million Super Pack me 10 Lakh Real Followers aur Mega Online Status Milta Hai.",
      bonus: "CLAIM VVIP CELEBRITY STATUS NOW",
      features: ["1,000,000 (10 Lakh) Real Followers", "Official Meta Blue Tick Badge Request", "VIP Dedicated WhatsApp Support"]
    }
  ];

  // Likes Packages
  const likesPackages = [
    {
      id: "prod-likes-100",
      slug: "100-indian-likes",
      title: "100 Indian Likes",
      price: 15,
      originalPrice: 150,
      tag: "⚡ QUICK START",
      badgeColor: "bg-rose-100 text-rose-700 border border-rose-200",
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
      badgeColor: "bg-amber-100 text-amber-800 border border-amber-300 font-bold",
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
      badgeColor: "bg-rose-500 text-white font-extrabold",
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
      badgeColor: "bg-purple-100 text-purple-800 border border-purple-200",
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
      badgeColor: "bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-black font-black",
      isVvip: true,
      desc: "Maximum Impact: Sabse bada engagement package! Celebrity level interaction jo aapko top suggestion me dikhayega.",
      features: ["100,000 Real Indian Likes", "Celebrity Level Interaction", "Heavy Real Active Indian Users"]
    }
  ];

  // Views Packages
  const viewsPackages = [
    {
      id: "prod-views-1k",
      slug: "1k-indian-views",
      title: "1k Indian Views",
      price: 10,
      originalPrice: 100,
      tag: "⚡ FAST START",
      badgeColor: "bg-rose-100 text-rose-700 border border-rose-200",
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
      badgeColor: "bg-purple-100 text-purple-800 border border-purple-200",
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
      badgeColor: "bg-amber-100 text-amber-800 border border-amber-300 font-bold",
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
      badgeColor: "bg-rose-500 text-white font-extrabold",
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
      badgeColor: "bg-purple-600 text-white font-extrabold",
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
      badgeColor: "bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-black font-black",
      isVvip: true,
      desc: "Global Domination: Sabse bada aur powerful package! 1 Crore views jo sirf celebrity profiles par hote hain.",
      features: ["10,000,000 (1 Crore) Real Views", "100% Guaranteed Viral Surge", "VVIP Dedicated Processing"]
    }
  ];

  // Instagram ID Unban & Recovery Packages (Dedicated Premium Section)
  const unbanPackages = [
    {
      id: "prod-unban-pro",
      slug: "instagram-id-unban-recovery",
      title: "Instagram ID Unban & Account Recovery",
      price: 299,
      originalPrice: 2999,
      tag: "🔒 100% SECURE RECOVERY",
      badgeColor: "bg-purple-600 text-white font-extrabold shadow-sm",
      isUnban: true,
      desc: "Got your Instagram account disabled, suspended, or banned? Don't worry! We offer 100% account recovery service with complete trust, safety, and rapid turnaround. Let our experts handle the technical appeal process to bring your account back safely.",
      features: [
        "100% Account Recovery Guarantee",
        "Full Trusted & Transparent Process",
        "Fast Appeal Recovery Speed",
        "100% Safe & Confidential Handling",
        "24/7 Expert Support Team"
      ]
    },
    {
      id: "prod-blue-tick-audit",
      slug: "meta-blue-tick-verification-audit",
      title: "Official Meta Blue Tick Badge Setup & Audit",
      price: 499,
      originalPrice: 4999,
      tag: "👑 VIP VERIFICATION",
      badgeColor: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold",
      isUnban: true,
      desc: "Get your profile officially audited and approved for Meta Blue Tick Verification on Instagram & Facebook. Includes complete PR article placement guidance and priority review submission.",
      features: [
        "Official Meta Blue Tick Submission Guidance",
        "PR Article Placement & Notability Audit",
        "Profile Identity Lock & Impersonation Shield",
        "Priority VIP Direct Support Handler"
      ]
    }
  ];

  // YouTube Packages
  const youtubePackages = [
    {
      id: "prod-yt-monetization",
      slug: "youtube-monetization-pack",
      title: "YouTube Channel Monetization Pack",
      price: 399,
      originalPrice: 3999,
      tag: "🔴 MONETIZATION PACK",
      badgeColor: "bg-red-600 text-white font-extrabold",
      desc: "1,000 Real Subscribers + 4,000 Watch Hours to unlock YouTube Partner Program and start earning revenue.",
      features: ["1,000 Genuine Subscribers", "4,000 Real Watch Hours", "Safe for Monetization Audit", "Lifetime Guarantee"]
    }
  ];

  // Facebook & Telegram Packages
  const otherPackages = [
    {
      id: "prod-fb-followers",
      slug: "facebook-page-followers",
      title: "10,000 Facebook Page Followers & Likes",
      price: 199,
      originalPrice: 1999,
      tag: "🔵 FB BOOST",
      badgeColor: "bg-blue-600 text-white font-extrabold",
      desc: "Boost your Facebook Page authority with 10,000 genuine Followers & Page Likes.",
      features: ["10,000 Real Facebook Followers", "Instant Page Boost", "100% Non-Drop"]
    },
    {
      id: "prod-tg-members",
      slug: "telegram-channel-members",
      title: "5,000 Telegram Channel Members",
      price: 149,
      originalPrice: 1499,
      tag: "✈️ TELEGRAM BOOST",
      badgeColor: "bg-sky-500 text-white font-extrabold",
      desc: "Add 5,000 active Telegram members to your channel or group instantly.",
      features: ["5,000 Active Members", "Instant Member Join", "Post Impression Boost"]
    }
  ];

  const getDisplayedPackages = () => {
    if (activePlatform === 'unban') return unbanPackages;
    if (activePlatform === 'youtube') return youtubePackages;
    if (activePlatform === 'facebook' || activePlatform === 'telegram') return otherPackages;
    
    // Instagram Growth
    if (selectedCategory === 'followers') return followerPackages;
    if (selectedCategory === 'likes') return likesPackages;
    return viewsPackages;
  };

  const displayedPackages = getDisplayedPackages();

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
      setModalError(
        activePack?.isUnban 
          ? 'Please enter your Banned Instagram Handle or Email!'
          : 'Please enter your Instagram Username or Profile Link!'
      );
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
            customNote: `${activePack?.isUnban ? 'Banned Account' : 'Instagram Handle'}: ${modalInstaHandle.trim()}`,
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
        customNote: `${activePack?.isUnban ? 'Banned Account' : 'Instagram Handle'}: ${modalInstaHandle.trim()}`
      });
    }
  };

  const faqs = [
    {
      q: "Kya followers real hote hain aur drop honge?",
      a: "Haan, hum 100% Real Indian Non-Drop Followers deliver karte hain. 30-Day se lekar lifetime auto-refill guarantee included hoti hai."
    },
    {
      q: "Kya Instagram ID Unban service 100% guaranteed hai?",
      a: "Haan, humari expert security & legal appeal team Instagram Meta security guidelines ke mutabiq aapki banned/disabled ID recover karti hai. Complete 100% success refund guarantee hoti hai."
    },
    {
      q: "Kya Password dena padega?",
      a: "Bilkul NAHI! Hum kabhi bhi aapka password nahi maangte. Sirf aapka Username (@username) ya Link chahiye hota hai."
    },
    {
      q: "Delivery kitne time me start hoti hai?",
      a: "Payment successfully hote hi automated server 60 seconds ke andar delivery auto-start kar deta hai."
    }
  ];

  return (
    <div className="min-h-screen bg-[#fcfdfd] text-slate-900 font-sans selection:bg-rose-500 selection:text-white pb-20">
      
      {/* 1. SINGLE ELEGANT TOP ANNOUNCEMENT BANNER (Replaced 3 cluttered bars with 1 ultra-sleek bar) */}
      <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 text-white text-xs font-bold py-2.5 px-4 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-center sm:text-left">
          <div className="flex items-center space-x-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <span className="truncate">⚡ SPECIAL FLASH SALE: 100% Real & Active Indian Profiles • Instant Delivery</span>
          </div>
          <div className="hidden sm:flex items-center space-x-1.5 font-mono text-amber-300 bg-black/25 px-2.5 py-0.5 rounded-full text-[11px]">
            <Clock className="w-3.5 h-3.5" />
            <span>EXPIRES IN: {String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}</span>
          </div>
        </div>
      </div>

      {/* 2. STICKY CLEAN HEADER (Branded bazara.in — Stays on /follower page) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div 
            className="flex items-center space-x-2.5 cursor-pointer"
            onClick={() => {
              // Stay on /follower page when clicking logo
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-500 p-0.5 flex items-center justify-center shadow-md shadow-rose-500/10">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                <InstagramIcon className="w-5 h-5 text-rose-600" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline space-x-1">
                <span className="font-black text-xl tracking-tight text-slate-900 uppercase">bazara</span>
                <span className="text-xs font-bold text-rose-600">.in</span>
              </div>
              <p className="text-[9px] text-slate-400 font-extrabold tracking-wider uppercase">#1 PREMIUM SMM & RECOVERY HUB</p>
            </div>
          </div>

          <a 
            href={`https://wa.me/${(settings?.support_whatsapp || '919837371137').replace(/[^0-9]/g, '')}?text=Hi%20Bazara%20SMM%20Support`}
            target="_blank" 
            rel="noreferrer"
            className="px-4 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold flex items-center space-x-1.5 transition-all shadow-md shadow-slate-900/10"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>WhatsApp Support</span>
          </a>
        </div>
      </header>

      {/* 3. PLATFORM SELECTOR TABS */}
      <section className="pt-6 px-4 max-w-xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <button
            onClick={() => {
              setActivePlatform('instagram');
              setSelectedCategory('followers');
            }}
            className={`py-3 px-3 rounded-2xl text-xs font-black flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
              activePlatform === 'instagram' 
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20 ring-2 ring-rose-500/30' 
                : 'bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-50'
            }`}
          >
            <span>💖 Instagram Growth</span>
          </button>
          
          <button
            onClick={() => setActivePlatform('unban')}
            className={`py-3 px-3 rounded-2xl text-xs font-black flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
              activePlatform === 'unban' 
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/20 ring-2 ring-purple-500/30' 
                : 'bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-50'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Insta ID Unban</span>
          </button>

          <button
            onClick={() => setActivePlatform('youtube')}
            className={`py-3 px-3 rounded-2xl text-xs font-black flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
              activePlatform === 'youtube' 
                ? 'bg-red-600 text-white shadow-md shadow-red-600/20 ring-2 ring-red-500/30' 
                : 'bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-50'
            }`}
          >
            <span>🔴 YouTube</span>
          </button>

          <button
            onClick={() => setActivePlatform('facebook')}
            className={`py-3 px-3 rounded-2xl text-xs font-black flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
              activePlatform === 'facebook' 
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 ring-2 ring-blue-500/30' 
                : 'bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-50'
            }`}
          >
            <span>🔵 Facebook</span>
          </button>

          <button
            onClick={() => setActivePlatform('telegram')}
            className={`col-span-2 sm:col-span-1 py-3 px-3 rounded-2xl text-xs font-black flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
              activePlatform === 'telegram' 
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20 ring-2 ring-sky-400/30' 
                : 'bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-50'
            }`}
          >
            <span>✈️ Telegram</span>
          </button>
        </div>
      </section>

      {/* 4. INSTAGRAM SUB-CATEGORY TABS (Followers / Likes / Views) */}
      {activePlatform === 'instagram' && (
        <section className="pt-4 pb-4 px-4 max-w-xl mx-auto">
          <div className="bg-white p-1.5 rounded-full border border-slate-200 shadow-xs flex items-center justify-between gap-1">
            <button
              onClick={() => setSelectedCategory('followers')}
              className={`flex-1 py-2.5 rounded-full text-xs font-black transition-all cursor-pointer flex items-center justify-center space-x-1 ${
                selectedCategory === 'followers'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>👥 Followers</span>
            </button>
            <button
              onClick={() => setSelectedCategory('likes')}
              className={`flex-1 py-2.5 rounded-full text-xs font-black transition-all cursor-pointer flex items-center justify-center space-x-1 ${
                selectedCategory === 'likes'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>❤️ Likes</span>
            </button>
            <button
              onClick={() => setSelectedCategory('views')}
              className={`flex-1 py-2.5 rounded-full text-xs font-black transition-all cursor-pointer flex items-center justify-center space-x-1 ${
                selectedCategory === 'views'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🎬 Views</span>
            </button>
          </div>
        </section>
      )}

      {/* 5. INSTAGRAM ID UNBAN HEADER BANNER (When ID Unban Tab Selected) */}
      {activePlatform === 'unban' && (
        <section className="pt-4 pb-2 px-4 max-w-xl mx-auto">
          <div className="bg-gradient-to-br from-purple-900 via-slate-900 to-indigo-950 text-white p-6 rounded-3xl border border-purple-500/30 shadow-xl space-y-3">
            <div className="flex items-center space-x-2 text-amber-400 font-extrabold text-xs">
              <Lock className="w-4 h-4" />
              <span className="uppercase tracking-wider">100% Guaranteed Account Recovery</span>
            </div>
            <h2 className="text-2xl font-black text-white leading-tight">
              🔒 Instagram ID Unban & Recovery Service
            </h2>
            <p className="text-xs text-slate-300 font-medium leading-relaxed">
              Got your Instagram account disabled, suspended, or banned? Don't worry! We offer a 100% account recovery service with complete trust, safety, and rapid turnaround time. Let our experts handle the technical appeal process to bring your account back safely.
            </p>
            <div className="pt-1 flex items-center space-x-4 text-[11px] font-bold text-slate-300">
              <span className="flex items-center space-x-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> <span>No Password Needed</span></span>
              <span className="flex items-center space-x-1"><ShieldCheck className="w-3.5 h-3.5 text-purple-400" /> <span>Full Money Back Guarantee</span></span>
            </div>
          </div>
        </section>
      )}

      {/* 6. PACKAGE CARDS GRID */}
      <section className="px-4 max-w-md mx-auto space-y-6 pt-4">
        {displayedPackages.map((pkg) => (
          <div
            key={pkg.id}
            className={`relative bg-white rounded-3xl p-6 text-center transition-all duration-300 border ${
              pkg.isVvip 
                ? 'bg-gradient-to-b from-slate-900 via-slate-950 to-black text-white border-2 border-amber-400 shadow-2xl' 
                : pkg.isUnban
                ? 'border-2 border-purple-500 bg-gradient-to-b from-purple-50/20 to-white shadow-xl shadow-purple-500/10'
                : pkg.popular
                ? 'border-2 border-amber-400 bg-white shadow-xl shadow-amber-500/10'
                : 'border border-slate-200/90 shadow-md hover:shadow-lg'
            }`}
          >
            {/* Tag Badge */}
            {pkg.tag && (
              <div className={`absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm whitespace-nowrap ${pkg.badgeColor}`}>
                {pkg.tag}
              </div>
            )}

            {/* Title */}
            <h3 className={`text-2xl font-black pt-2 ${pkg.isVvip ? 'text-amber-300' : 'text-slate-900'}`}>
              {pkg.title}
            </h3>

            {/* Price */}
            <div className="my-3">
              <span className={`text-5xl font-black tracking-tight ${pkg.isVvip ? 'text-amber-400' : pkg.isUnban ? 'text-purple-600' : 'text-rose-600'}`}>
                ₹{pkg.price}
              </span>
              <span className="text-xs text-slate-400 line-through ml-2">₹{pkg.originalPrice}</span>
            </div>

            {/* Description */}
            <p className={`text-xs font-medium leading-relaxed px-2 ${pkg.isVvip ? 'text-slate-300' : 'text-slate-600'}`}>
              {pkg.desc}
            </p>

            {/* Features Bullet List */}
            {pkg.features && pkg.features.length > 0 && (
              <div className="mt-4 pt-3 border-t border-slate-100 text-left space-y-2">
                {pkg.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center space-x-2 text-xs font-semibold text-slate-700">
                    <CheckCircle2 className={`w-4 h-4 shrink-0 ${pkg.isVvip ? 'text-amber-400' : pkg.isUnban ? 'text-purple-600' : 'text-emerald-500'}`} />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Bonus Pill */}
            {pkg.bonus && (
              <div className={`mt-3.5 py-2 px-3 rounded-2xl text-xs font-extrabold ${
                pkg.isVvip ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30' : 'bg-rose-50 text-rose-600 border border-rose-200'
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
                  : pkg.isUnban
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-purple-600/30 hover:brightness-110'
                  : 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/30 hover:shadow-rose-600/50'
              }`}
            >
              <span className="relative z-10">
                {pkg.isVvip ? 'CLAIM VVIP STATUS NOW' : pkg.isUnban ? 'RECOVER ACCOUNT NOW' : 'Buy Now'}
              </span>
              <ArrowRight className="w-5 h-5 relative z-10" />
            </button>

          </div>
        ))}
      </section>

      {/* 7. CUSTOMER REVIEWS & FEEDBACK SECTION */}
      <section className="py-12 px-4 max-w-md mx-auto border-t border-slate-200/60 mt-10">
        <div className="text-center mb-6">
          <span className="text-[11px] font-black uppercase tracking-widest text-rose-600">⭐ Customer Proof & Ratings</span>
          <h3 className="text-xl font-black text-slate-900 mt-1">Verified Buyer Testimonials</h3>
        </div>

        <div className="space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex text-amber-400 space-x-1">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
            </div>
            <p className="text-xs text-slate-700 font-semibold italic">
              "Mera Instagram account 2 hafte se suspended tha. Bazara ₹299 Unban service buy karne ke 24 ghante ke andar meri ID recover ho gayi!"
            </p>
            <p className="text-[11px] font-extrabold text-slate-900 pt-1 border-t border-slate-100">
              — Anand K., Jaipur (Verified ID Recovery)
            </p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex text-amber-400 space-x-1">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
            </div>
            <p className="text-xs text-slate-700 font-semibold italic">
              "Bhai ₹199 wale 10k pack ka delivery 2 mins me start ho gaya! Organic reach bhi badh gayi."
            </p>
            <p className="text-[11px] font-extrabold text-slate-900 pt-1 border-t border-slate-100">
              — Vikas S., Mumbai (Verified Buyer)
            </p>
          </div>
        </div>
      </section>

      {/* 8. FAQ ACCORDION */}
      <section className="py-8 px-4 max-w-md mx-auto">
        <h3 className="text-lg font-black text-slate-900 text-center mb-4">Frequently Asked Questions</h3>
        <div className="space-y-2">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden">
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full px-4 py-3 text-left flex items-center justify-between font-bold text-xs text-slate-900 cursor-pointer"
              >
                <span>{faq.q}</span>
                {activeFaq === idx ? <ChevronUp className="w-4 h-4 text-rose-600" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
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

      {/* 9. LIGHT GLASSMORPHIC LIVE SALES TOAST NOTIFICATION (Clean White Theme Match) */}
      {toastNotification && (
        <div className="fixed bottom-6 left-4 z-50 bg-white/95 backdrop-blur-md text-slate-900 p-3.5 rounded-2xl shadow-xl border border-slate-200 flex items-center space-x-3 max-w-xs animate-slide-up">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
            toastNotification.type === 'unban' ? 'bg-purple-100 text-purple-600' : 'bg-emerald-100 text-emerald-600'
          }`}>
            {toastNotification.type === 'unban' ? <Lock className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
          </div>
          <div className="text-[11px] leading-snug">
            <p className="font-extrabold text-slate-900">{toastNotification.name}</p>
            <p className="text-slate-600 font-medium">{toastNotification.action}</p>
            <span className="text-[9px] text-slate-400 font-bold">{toastNotification.time}</span>
          </div>
        </div>
      )}

      {/* 10. ULTRA-COMPACT 1-STEP CHECKOUT MODAL (No Name, Email, or Phone required) */}
      {isModalOpen && activePack && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
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
              <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                activePack.isUnban ? 'text-purple-700 bg-purple-50 border-purple-200' : 'text-rose-700 bg-rose-50 border-rose-200'
              }`}>
                {activePack.isUnban ? '1-Step Account Recovery' : '1-Step Instant Checkout'}
              </span>
              <h2 className="text-xl font-black text-slate-900 mt-2">
                {activePack.title}
              </h2>
              <div className="flex items-baseline space-x-2 mt-1">
                <span className={`text-3xl font-black ${activePack.isUnban ? 'text-purple-600' : 'text-rose-600'}`}>
                  ₹{activePack.price}
                </span>
                <span className="text-xs text-slate-400 line-through">₹{activePack.originalPrice}</span>
              </div>
            </div>

            {/* Single Input Field: Instagram Username / Link or Banned ID */}
            <form onSubmit={handleExecutePayment} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                  {activePack.isUnban ? 'Banned Instagram Profile Handle or Email' : 'Instagram Profile Username or Reel Link'} <span className="text-rose-600">*</span>
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
                    placeholder={activePack.isUnban ? "e.g. banned_username or registered email" : "e.g. virat.kohli or insta profile URL"}
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
                  <span>{activePack.isUnban ? 'Fast priority appeal submission within 24 hours' : 'Payment ke baad instant 60 seconds me auto-start'}</span>
                </div>
              </div>

              {/* Instant Pay Button */}
              <button
                type="submit"
                disabled={isProcessingPayment}
                className={`w-full py-4 px-6 rounded-2xl text-white font-black text-base uppercase tracking-wider shadow-lg transition-all transform active:scale-95 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 ${
                  activePack.isUnban
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 shadow-purple-600/30 hover:brightness-110'
                    : 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/30'
                }`}
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
