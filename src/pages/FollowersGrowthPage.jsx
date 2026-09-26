import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Star, 
  Lock, 
  Clock,
  ArrowRight, 
  MessageCircle, 
  ChevronDown, 
  ChevronUp, 
  AlertCircle,
  X,
  CreditCard,
  Crown,
  Play
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
  const [selectedYtCategory, setSelectedYtCategory] = useState('subscribers'); // 'subscribers' | 'watchtime' | 'views' | 'likes'
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
      { name: "Vikas M. from Lucknow", action: "bought YouTube 1k Subs Pack (₹200)", time: "2 mins ago", type: "yt" },
      { name: "Priya M. from Mumbai", action: "bought 1M Followers + Blue Tick (₹600)", time: "3 mins ago", type: "insta" },
      { name: "Amit V. from Bangalore", action: "bought 20k Telegram Members (₹299)", time: "4 mins ago", type: "tg" },
      { name: "Suresh P. from Punjab", action: "bought 4000 Watch Hours (₹650)", time: "5 mins ago", type: "yt" }
    ];

    let index = 0;
    const toastInterval = setInterval(() => {
      setToastNotification(notifications[index % notifications.length]);
      index++;
      setTimeout(() => setToastNotification(null), 4500);
    }, 7000);

    return () => clearInterval(toastInterval);
  }, []);

  // 1. Instagram Followers Packages
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
      features: [
        "1,000,000 (10 Lakh) Real Active Followers",
        "Official Meta Blue Tick Badge Request Support",
        "100k Bonus Likes + 500k Reel Views Included",
        "VIP Dedicated WhatsApp Manager (24/7 Priority)"
      ]
    }
  ];

  // 2. Instagram Likes Packages
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

  // 3. Instagram Views Packages
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

  // 4. Instagram ID Unban & Recovery Packages
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

  // 5. YouTube Subscribers Packages (Screenshot 1 Exact)
  const ytSubscribersPackages = [
    {
      id: "prod-yt-sub-1k",
      slug: "1k-youtube-subscribers",
      title: "1k Subscribers 🇮🇳",
      price: 200,
      originalPrice: 999,
      tag: "Starter",
      badgeColor: "bg-amber-400 text-black font-extrabold",
      cardBorder: "border-amber-400",
      btnColor: "bg-[#ff2b7d] hover:bg-rose-600",
      desc: "1k real Indian subscribers. Safe growth for channel & monetization support.",
      features: ["Safe Delivery", "Real Users", "Trusted"]
    },
    {
      id: "prod-yt-sub-5k",
      slug: "5k-youtube-subscribers",
      title: "5k Subscribers 🚀",
      price: 450,
      originalPrice: 1999,
      tag: "Popular",
      badgeColor: "bg-amber-400 text-black font-extrabold",
      cardBorder: "border-emerald-500",
      btnColor: "bg-[#ff2b7d] hover:bg-rose-600",
      desc: "Fast delivery with premium Indian audience boost.",
      features: ["Real Growth", "Secure", "Lifetime Refill"]
    },
    {
      id: "prod-yt-sub-10k",
      slug: "10k-youtube-subscribers",
      title: "10k Subscribers 🔥",
      price: 800,
      originalPrice: 3999,
      tag: "Best Deal",
      badgeColor: "bg-amber-400 text-black font-extrabold",
      cardBorder: "border-rose-600",
      btnColor: "bg-[#ff2b7d] hover:bg-rose-600",
      desc: "Best package for serious creators to grow quickly.",
      features: ["Safe", "Monetization Friendly", "High Authority"]
    }
  ];

  // 6. YouTube Watch Time Packages (Screenshot 3 Exact)
  const ytWatchTimePackages = [
    {
      id: "prod-yt-wt-1k",
      slug: "1000-watch-hours",
      title: "1000 Watch Hours ⏰",
      price: 200,
      originalPrice: 999,
      tag: "Starter",
      badgeColor: "bg-amber-400 text-black font-extrabold",
      cardBorder: "border-amber-400",
      btnColor: "bg-[#ff2b7d] hover:bg-rose-600",
      desc: "Real watch time. Complete in 2 days. Monetization support.",
      features: ["Real Watch Time", "Complete in 2 Days", "Monetization Support"]
    },
    {
      id: "prod-yt-wt-2k",
      slug: "2000-watch-hours",
      title: "2000 Watch Hours 🚀",
      price: 350,
      originalPrice: 1499,
      tag: "Popular",
      badgeColor: "bg-amber-400 text-black font-extrabold",
      cardBorder: "border-emerald-500",
      btnColor: "bg-[#ff2b7d] hover:bg-rose-600",
      desc: "Fast safe watch hours delivery.",
      features: ["Fast Safe Delivery", "High Retention Playback", "Safe for Channel"]
    },
    {
      id: "prod-yt-wt-3k",
      slug: "3000-watch-hours",
      title: "3000 Watch Hours 💎",
      price: 450,
      originalPrice: 1999,
      tag: "Hot",
      badgeColor: "bg-amber-400 text-black font-extrabold",
      cardBorder: "border-sky-500",
      btnColor: "bg-[#ff2b7d] hover:bg-rose-600",
      desc: "Real watch time. Safe for monetization.",
      features: ["Safe for Monetization", "Real Watch Time", "Rapid Turnaround"]
    },
    {
      id: "prod-yt-wt-4k",
      slug: "4000-watch-hours",
      title: "4000 Watch Hours 👑",
      price: 650,
      originalPrice: 2999,
      tag: "Best Deal",
      badgeColor: "bg-amber-400 text-black font-extrabold",
      cardBorder: "border-rose-600",
      btnColor: "bg-[#ff2b7d] hover:bg-rose-600",
      desc: "Complete monetization package. Fast completion in 2 days.",
      features: ["Complete 4000 Hrs Goal", "100% Monetization Audit Safe", "Fast 2-Day Completion"]
    }
  ];

  // 7. YouTube Views Packages (Screenshot 4 Exact)
  const ytViewsPackages = [
    {
      id: "prod-yt-views-1k",
      slug: "1k-youtube-views",
      title: "1k YouTube Views 🇮🇳",
      price: 100,
      originalPrice: 499,
      tag: "Starter",
      badgeColor: "bg-amber-400 text-black font-extrabold",
      cardBorder: "border-amber-400",
      btnColor: "bg-[#ff2b7d] hover:bg-rose-600",
      desc: "1k Indian YouTube views with safe delivery. Suitable for creators looking to increase video reach.",
      features: ["🇮🇳 Indian Views", "Safe Delivery", "Trusted Service"]
    },
    {
      id: "prod-yt-views-10k",
      slug: "10k-youtube-views",
      title: "10k YouTube Views 🇮🇳",
      price: 300,
      originalPrice: 1299,
      tag: "Popular",
      badgeColor: "bg-amber-400 text-black font-extrabold",
      cardBorder: "border-emerald-500",
      btnColor: "bg-[#ff2b7d] hover:bg-rose-600",
      desc: "10k Indian YouTube views with fast delivery and creator-friendly service.",
      features: ["🇮🇳 Indian Views", "Fast Delivery", "Secure"]
    },
    {
      id: "prod-yt-views-100k",
      slug: "100k-youtube-views",
      title: "100k YouTube Views 🇮🇳",
      price: 699,
      originalPrice: 2999,
      tag: "Best Deal",
      badgeColor: "bg-amber-400 text-black font-extrabold",
      cardBorder: "border-rose-600",
      btnColor: "bg-[#ff2b7d] hover:bg-rose-600",
      desc: "100k Indian YouTube views with high-volume delivery for your videos.",
      features: ["🇮🇳 Indian Views", "Safe Delivery", "Trusted"]
    }
  ];

  // 8. YouTube Likes Packages (Screenshot 2 Exact)
  const ytLikesPackages = [
    {
      id: "prod-yt-likes-1k",
      slug: "1k-youtube-likes",
      title: "1k YouTube Likes 🇮🇳",
      price: 109,
      originalPrice: 499,
      tag: "Starter",
      badgeColor: "bg-amber-400 text-black font-extrabold",
      cardBorder: "border-amber-400",
      btnColor: "bg-[#ff2b7d] hover:bg-rose-600",
      desc: "1k Indian YouTube likes with organic-style engagement and safe delivery.",
      features: ["🇮🇳 Indian Likes", "Real Engagement", "Trusted"]
    },
    {
      id: "prod-yt-likes-5k",
      slug: "5k-youtube-likes",
      title: "5k YouTube Likes 🇮🇳",
      price: 200,
      originalPrice: 899,
      tag: "Popular",
      badgeColor: "bg-amber-400 text-black font-extrabold",
      cardBorder: "border-emerald-500",
      btnColor: "bg-[#ff2b7d] hover:bg-rose-600",
      desc: "5k Indian YouTube likes for stronger video engagement and social proof.",
      features: ["🇮🇳 Indian Likes", "Safe Delivery", "Secure"]
    },
    {
      id: "prod-yt-likes-10k",
      slug: "10k-youtube-likes",
      title: "10k YouTube Likes 🇮🇳",
      price: 400,
      originalPrice: 1499,
      tag: "Hot",
      badgeColor: "bg-amber-400 text-black font-extrabold",
      cardBorder: "border-sky-500",
      btnColor: "bg-[#ff2b7d] hover:bg-rose-600",
      desc: "10k Indian YouTube likes with fast delivery and creator-friendly service.",
      features: ["🇮🇳 Indian Likes", "Fast Delivery", "Trusted"]
    },
    {
      id: "prod-yt-likes-50k",
      slug: "50k-youtube-likes",
      title: "50k YouTube Likes 🇮🇳",
      price: 800,
      originalPrice: 2999,
      tag: "Best Deal",
      badgeColor: "bg-amber-400 text-black font-extrabold",
      cardBorder: "border-rose-600",
      btnColor: "bg-[#ff2b7d] hover:bg-rose-600",
      desc: "50k Indian YouTube likes for high-volume engagement on your videos.",
      features: ["🇮🇳 Indian Likes", "Safe Delivery", "Trusted"]
    }
  ];

  // 9. Facebook Packages
  const facebookPackages = [
    {
      id: "prod-fb-5k",
      slug: "5k-facebook-likes-followers",
      title: "5k Facebook Likes + Followers 🇮🇳",
      price: 180,
      originalPrice: 999,
      tag: "Starter",
      badgeColor: "bg-amber-400 text-black font-extrabold",
      cardBorder: "border-amber-400",
      btnColor: "bg-blue-600 hover:bg-blue-700",
      desc: "5k Indian Facebook Page likes and followers for building your page audience and social presence.",
      features: ["🇮🇳 Indian Audience", "Safe Delivery", "Trusted Service"]
    },
    {
      id: "prod-fb-10k",
      slug: "10k-facebook-likes-followers",
      title: "10k Facebook Likes + Followers 🇮🇳",
      price: 250,
      originalPrice: 1499,
      tag: "Popular",
      badgeColor: "bg-amber-400 text-black font-extrabold",
      cardBorder: "border-emerald-500",
      btnColor: "bg-blue-600 hover:bg-blue-700",
      desc: "10k Indian Facebook Page likes and followers with fast and reliable delivery.",
      features: ["🇮🇳 Indian Audience", "Fast Delivery", "Secure"]
    },
    {
      id: "prod-fb-15k",
      slug: "15k-facebook-likes-followers",
      title: "15k Facebook Likes + Followers 🇮🇳",
      price: 350,
      originalPrice: 1999,
      tag: "Hot",
      badgeColor: "bg-amber-400 text-black font-extrabold",
      cardBorder: "border-sky-500",
      btnColor: "bg-blue-600 hover:bg-blue-700",
      desc: "15k Indian Facebook Page likes and followers for stronger page reach and social presence.",
      features: ["🇮🇳 Indian Audience", "Safe Delivery", "Trusted"]
    },
    {
      id: "prod-fb-100k",
      slug: "100k-facebook-likes-followers",
      title: "100k Facebook Likes + Followers 🇮🇳",
      price: 500,
      originalPrice: 3999,
      tag: "Best Deal",
      badgeColor: "bg-amber-400 text-black font-extrabold",
      cardBorder: "border-purple-600",
      btnColor: "bg-blue-600 hover:bg-blue-700",
      desc: "100k Indian Facebook Page likes and followers for high-volume page growth.",
      features: ["🇮🇳 Indian Audience", "Fast Delivery", "Trusted"]
    },
    {
      id: "prod-fb-1m",
      slug: "1m-facebook-likes-followers",
      title: "1M Facebook Likes + Followers 🇮🇳",
      price: 599,
      originalPrice: 7999,
      tag: "🔥 OFFER",
      badgeColor: "bg-amber-400 text-black font-extrabold",
      cardBorder: "border-rose-600",
      btnColor: "bg-blue-600 hover:bg-blue-700",
      desc: "Special offer on 1 million Indian Facebook Page likes and followers. High-volume package at an offer price.",
      features: ["🇮🇳 Indian Audience", "Fast Delivery", "Special Offer"]
    }
  ];

  // 10. Telegram Packages
  const telegramPackages = [
    {
      id: "prod-tg-10k",
      slug: "10k-telegram-members",
      title: "10k Telegram Members 🇮🇳",
      price: 199,
      originalPrice: 999,
      tag: "Starter",
      badgeColor: "bg-amber-400 text-black font-extrabold",
      cardBorder: "border-amber-400",
      btnColor: "bg-[#ff2b7d] hover:bg-rose-600",
      desc: "10k Indian Telegram members for building a stronger community presence and channel reach.",
      features: ["🇮🇳 Indian Members", "Safe Delivery", "Trusted Service"]
    },
    {
      id: "prod-tg-20k",
      slug: "20k-telegram-members",
      title: "20k Telegram Members 🇮🇳",
      price: 299,
      originalPrice: 1499,
      tag: "Popular",
      badgeColor: "bg-amber-400 text-black font-extrabold",
      cardBorder: "border-emerald-500",
      btnColor: "bg-[#ff2b7d] hover:bg-rose-600",
      desc: "20k Indian Telegram members with fast delivery for growing your channel or group.",
      features: ["🇮🇳 Indian Members", "Fast Delivery", "Secure"]
    },
    {
      id: "prod-tg-50k",
      slug: "50k-telegram-members",
      title: "50k Telegram Members 🇮🇳",
      price: 499,
      originalPrice: 2499,
      tag: "Hot",
      badgeColor: "bg-amber-400 text-black font-extrabold",
      cardBorder: "border-sky-500",
      btnColor: "bg-[#ff2b7d] hover:bg-rose-600",
      desc: "50k Indian Telegram members for high-volume community growth and stronger social presence.",
      features: ["🇮🇳 Indian Members", "Safe Delivery", "Trusted"]
    },
    {
      id: "prod-tg-100k",
      slug: "100k-telegram-members",
      title: "100k Telegram Members 🇮🇳",
      price: 799,
      originalPrice: 4999,
      tag: "Best Deal",
      badgeColor: "bg-amber-400 text-black font-extrabold",
      cardBorder: "border-rose-600",
      btnColor: "bg-[#ff2b7d] hover:bg-rose-600",
      desc: "100k Indian Telegram members for large-scale channel or group growth.",
      features: ["🇮🇳 Indian Members", "Fast Delivery", "Trusted"]
    }
  ];

  // Verified Buyer Reviews for Auto-Scrolling Marquee
  const testimonials = [
    {
      id: 1,
      name: "Rohan Mehta",
      city: "Delhi",
      badge: "Verified Buyer",
      service: "50k Followers Combo",
      rating: 5,
      review: "Bhai ₹199 wale 50k pack me 10 mins ke andar sare followers aur 5k bonus likes aagaye! Organic reach bhi badh gayi."
    },
    {
      id: 2,
      name: "Anand K.",
      city: "Jaipur",
      badge: "Verified ID Recovery",
      service: "Insta ID Unban (₹299)",
      rating: 5,
      review: "Mera Instagram account 2 hafte se suspended tha. Bazara ₹299 Unban service buy karne ke 24 ghante ke andar ID recover ho gayi!"
    },
    {
      id: 3,
      name: "Sneha Sharma",
      city: "Mumbai",
      badge: "Verified Creator",
      service: "100k Reels Views (₹50)",
      rating: 5,
      review: "Maine 100k Views pack liya tha. Meri Reel viral ho gayi aur explore page se 10k naye genuine followers mile!"
    },
    {
      id: 4,
      name: "Amit Verma",
      city: "Bangalore",
      badge: "Community Admin",
      service: "20k Telegram Members",
      rating: 5,
      review: "Trading channel ke liye 20k Telegram members order kiye the. Same day full active members deliver ho gaye."
    },
    {
      id: 5,
      name: "Pooja Patel",
      city: "Ahmedabad",
      badge: "Brand Owner",
      service: "15k Facebook Likes (₹350)",
      rating: 5,
      review: "E-commerce page ka trust badhane ke liye 15k Likes best package tha. Fast delivery and 100% active audience."
    },
    {
      id: 6,
      name: "Deepak Gill",
      city: "Chandigarh",
      badge: "Verified VVIP",
      service: "1M Followers + Blue Tick",
      rating: 5,
      review: "1 Million VVIP pack best investment tha! WhatsApp dedicated manager ne Blue Tick request submit karne me poora guide kiya."
    }
  ];

  const getDisplayedPackages = () => {
    if (activePlatform === 'unban') return unbanPackages;
    if (activePlatform === 'youtube') {
      if (selectedYtCategory === 'watchtime') return ytWatchTimePackages;
      if (selectedYtCategory === 'views') return ytViewsPackages;
      if (selectedYtCategory === 'likes') return ytLikesPackages;
      return ytSubscribersPackages;
    }
    if (activePlatform === 'facebook') return facebookPackages;
    if (activePlatform === 'telegram') return telegramPackages;
    
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
          : activePlatform === 'telegram'
          ? 'Please enter your Telegram Channel / Group Link!'
          : activePlatform === 'facebook'
          ? 'Please enter your Facebook Page Link!'
          : activePlatform === 'youtube'
          ? 'Please enter your YouTube Channel URL or Video Link!'
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
        description: `${activePack.title} - Target: ${modalInstaHandle.trim()}`,
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
            customNote: `${activePack?.isUnban ? 'Banned Account' : 'Handle/Link'}: ${modalInstaHandle.trim()}`,
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
        customNote: `${activePack?.isUnban ? 'Banned Account' : 'Handle/Link'}: ${modalInstaHandle.trim()}`
      });
    }
  };

  const faqs = [
    {
      q: "Kya YouTube views, watch time aur subscribers safe hain?",
      a: "Haan, 100% Real High Retention views & watch time deliver kiye jaate hain jo YouTube Partner Program (Monetization) audit ke liye 100% safe hain."
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
    <div className="min-h-screen bg-[#fcfdfd] text-slate-900 font-sans selection:bg-rose-500 selection:text-white pb-24">
      
      {/* 1. TOP DYNAMIC LIVE URGENCY & MARQUEE ANNOUNCEMENT BANNER */}
      <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 text-white py-2 px-3 shadow-sm border-b border-rose-800/20">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-2.5">
          {/* Live Marquee Scrolling Text */}
          <div className="flex-1 overflow-hidden relative">
            <div className="flex items-center space-x-6 whitespace-nowrap animate-marquee">
              <div className="flex items-center space-x-1.5 text-xs font-black tracking-wide">
                <span className="w-2 h-2 rounded-full bg-white animate-ping shrink-0" />
                <span>⚡ SPECIAL FLASH SALE: 90% OFF ALL PACKAGES • 100% NON-DROP & 30-DAY AUTO REFILL • INSTANT 60S DELIVERY • 24/7 LIVE SUPPORT ⚡</span>
              </div>
              <div className="flex items-center space-x-1.5 text-xs font-black tracking-wide">
                <span className="w-2 h-2 rounded-full bg-white animate-ping shrink-0" />
                <span>⚡ SPECIAL FLASH SALE: 90% OFF ALL PACKAGES • 100% NON-DROP & 30-DAY AUTO REFILL • INSTANT 60S DELIVERY • 24/7 LIVE SUPPORT ⚡</span>
              </div>
            </div>
          </div>

          {/* Prominent Urgency Countdown Timer (Visible on all devices including Mobile!) */}
          <div className="shrink-0 flex items-center space-x-1.5 bg-black/40 border border-white/20 px-2.5 py-1 rounded-full text-[11px] font-mono font-black text-amber-300 shadow-inner">
            <Clock className="w-3.5 h-3.5 text-amber-300 animate-spin" />
            <span className="tracking-wider">{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}</span>
          </div>
        </div>
      </div>

      {/* 2. STICKY CLEAN HEADER */}
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
            className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-xs font-black flex items-center space-x-1.5 transition-all shadow-md shadow-emerald-500/25 border border-emerald-400/30 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <MessageCircle className="w-4 h-4 text-white" />
            <span className="font-extrabold tracking-wide">WhatsApp Support</span>
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
                ? 'bg-[#ff2b7d] text-white shadow-md shadow-rose-600/20 ring-2 ring-rose-500/30' 
                : 'bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-50'
            }`}
          >
            <span>💖 Instagram</span>
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
            onClick={() => {
              setActivePlatform('youtube');
              setSelectedYtCategory('subscribers');
            }}
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
        <section className="pt-4 pb-2 px-4 max-w-xl mx-auto">
          <div className="bg-white p-1.5 rounded-full border border-slate-200 shadow-xs flex items-center justify-between gap-1">
            <button
              onClick={() => setSelectedCategory('followers')}
              className={`flex-1 py-2.5 rounded-full text-xs font-black transition-all cursor-pointer flex items-center justify-center space-x-1 ${
                selectedCategory === 'followers'
                  ? 'bg-[#ff2b7d] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>👥 Followers</span>
            </button>
            <button
              onClick={() => setSelectedCategory('likes')}
              className={`flex-1 py-2.5 rounded-full text-xs font-black transition-all cursor-pointer flex items-center justify-center space-x-1 ${
                selectedCategory === 'likes'
                  ? 'bg-[#ff2b7d] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>❤️ Likes</span>
            </button>
            <button
              onClick={() => setSelectedCategory('views')}
              className={`flex-1 py-2.5 rounded-full text-xs font-black transition-all cursor-pointer flex items-center justify-center space-x-1 ${
                selectedCategory === 'views'
                  ? 'bg-[#ff2b7d] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🎬 Views</span>
            </button>
          </div>
        </section>
      )}

      {/* 4.5 YOUTUBE SUB-CATEGORY TABS (Subscribers / Watch Time / Views / Likes) */}
      {activePlatform === 'youtube' && (
        <section className="pt-4 pb-2 px-4 max-w-xl mx-auto space-y-3">
          <div className="bg-white p-5 rounded-3xl border border-red-200 shadow-sm text-center space-y-2">
            <h2 className="text-xl font-black text-slate-900">Welcome to YouTube Growth 🚀</h2>
            <p className="text-xs text-slate-600 font-medium">
              Buy YouTube services instantly. Indian subscribers, watch time, views & likes with safe delivery. Creator-friendly services for channel growth.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs">
            <button
              onClick={() => setSelectedYtCategory('subscribers')}
              className={`py-2.5 px-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center space-x-1 ${
                selectedYtCategory === 'subscribers'
                  ? 'bg-[#ff2b7d] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 bg-slate-50'
              }`}
            >
              <span>👥 Subscribers</span>
            </button>
            <button
              onClick={() => setSelectedYtCategory('watchtime')}
              className={`py-2.5 px-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center space-x-1 ${
                selectedYtCategory === 'watchtime'
                  ? 'bg-[#ff2b7d] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 bg-slate-50'
              }`}
            >
              <span>⏰ Watch Time</span>
            </button>
            <button
              onClick={() => setSelectedYtCategory('views')}
              className={`py-2.5 px-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center space-x-1 ${
                selectedYtCategory === 'views'
                  ? 'bg-[#ff2b7d] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 bg-slate-50'
              }`}
            >
              <span>👁️ Views</span>
            </button>
            <button
              onClick={() => setSelectedYtCategory('likes')}
              className={`py-2.5 px-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center space-x-1 ${
                selectedYtCategory === 'likes'
                  ? 'bg-[#ff2b7d] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 bg-slate-50'
              }`}
            >
              <span>👍 Likes</span>
            </button>
          </div>
        </section>
      )}

      {/* 5. DEDICATED HEADER BANNERS (FOR UNBAN, FACEBOOK, TELEGRAM) */}
      {activePlatform === 'unban' && (
        <section className="pt-4 pb-2 px-4 max-w-xl mx-auto">
          <div className="bg-gradient-to-br from-purple-900 via-slate-900 to-indigo-950 text-white p-6 rounded-3xl border border-purple-500/30 shadow-xl space-y-3">
            <div className="flex items-center space-x-2 text-amber-400 font-extrabold text-xs">
              <Lock className="w-4 h-4" />
              <span className="uppercase tracking-wider">100% Guaranteed Account Recovery</span>
            </div>
            <h2 className="text-2xl font-black text-white leading-tight">
              🔒 Instagram ID Unban & Recovery
            </h2>
            <p className="text-xs text-slate-300 font-medium leading-relaxed">
              Got your Instagram account disabled, suspended, or banned? Don't worry! We offer a 100% account recovery service with complete trust, safety, and rapid turnaround time.
            </p>
          </div>
        </section>
      )}

      {activePlatform === 'facebook' && (
        <section className="pt-4 pb-2 px-4 max-w-xl mx-auto">
          <div className="bg-white p-5 rounded-3xl border border-blue-200 shadow-sm text-center space-y-2">
            <h2 className="text-xl font-black text-slate-900">Facebook Services 📘</h2>
            <p className="text-xs text-slate-600 font-medium">
              Grow your Facebook Page with Indian likes and followers. Choose a package below for fast delivery and reliable service.
            </p>
            <div className="inline-block py-1 px-3 bg-blue-50 text-blue-700 text-xs font-black rounded-full border border-blue-200">
              👍 Page Likes + Followers
            </div>
          </div>
        </section>
      )}

      {activePlatform === 'telegram' && (
        <section className="pt-4 pb-2 px-4 max-w-xl mx-auto">
          <div className="bg-white p-5 rounded-3xl border border-sky-200 shadow-sm text-center space-y-2">
            <h2 className="text-xl font-black text-slate-900">Telegram Services 📱</h2>
            <p className="text-xs text-slate-600 font-medium">
              Grow your Telegram channel or group with Indian members. Choose a package below for quick delivery and reliable service.
            </p>
            <div className="inline-block py-1 px-3 bg-sky-50 text-sky-700 text-xs font-black rounded-full border border-sky-200">
              👥 Indian Members
            </div>
          </div>
        </section>
      )}

      {/* 6. PACKAGE CARDS GRID */}
      <section className="px-4 max-w-md mx-auto space-y-6 pt-4">
        {displayedPackages.map((pkg) => {
          // Special Luxury Styling for 1M VVIP Card
          if (pkg.isVvip) {
            return (
              <div
                key={pkg.id}
                className="relative bg-gradient-to-b from-[#090d16] via-[#0d1322] to-black rounded-[32px] p-7 text-center border-2 border-amber-400 shadow-2xl shadow-amber-500/15 overflow-hidden"
              >
                {/* Background Ambient Glow */}
                <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

                {/* VVIP Badge */}
                <div className="inline-flex items-center space-x-1 px-4 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-black shadow-md mb-3">
                  <Crown className="w-3.5 h-3.5 fill-black" />
                  <span>💎 VVIP EXCLUSIVE</span>
                </div>

                {/* Title */}
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {pkg.title}
                </h3>

                {/* Price */}
                <div className="my-4 flex items-baseline justify-center space-x-2">
                  <span className="text-5xl font-black tracking-tight bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 bg-clip-text text-transparent">
                    ₹{pkg.price}
                  </span>
                  <span className="text-sm text-slate-500 line-through font-bold">₹{pkg.originalPrice}</span>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-300 font-medium leading-relaxed px-2">
                  {pkg.desc}
                </p>

                {/* Features Bullet List */}
                {pkg.features && (
                  <div className="mt-5 pt-4 border-t border-white/10 text-left space-y-2.5">
                    {pkg.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center space-x-2.5 text-xs font-semibold text-slate-200">
                        <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* 1M VVIP BUTTON WITH CONTINUOUS LIGHT REFLECTION SWEEP ANIMATION */}
                <button
                  onClick={() => handleOpenCheckoutModal(pkg)}
                  className="w-full mt-6 py-4 px-6 rounded-2xl font-black text-lg uppercase tracking-wider bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-black shadow-xl shadow-amber-400/30 flex items-center justify-center space-x-2 transition-all transform active:scale-95 cursor-pointer relative overflow-hidden group btn-shine-effect"
                >
                  <span className="relative z-10 font-extrabold tracking-wide">CLAIM VVIP STATUS NOW</span>
                  <ArrowRight className="w-5 h-5 relative z-10" />
                </button>
              </div>
            );
          }

          // Standard Package Cards (Followers, Likes, Views, YouTube, FB, TG)
          const customCardBorder = pkg.cardBorder || (pkg.isUnban ? 'border-purple-500' : pkg.popular ? 'border-amber-400' : 'border-slate-200/90');
          const customBtnColor = pkg.btnColor || (pkg.isUnban ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:brightness-110' : 'bg-[#ff2b7d] hover:bg-rose-600');

          return (
            <div
              key={pkg.id}
              className={`relative bg-white rounded-3xl p-6 text-center transition-all duration-300 border-2 ${customCardBorder} shadow-md hover:shadow-lg`}
            >
              {/* Tag Badge */}
              {pkg.tag && (
                <div className={`absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm whitespace-nowrap ${pkg.badgeColor}`}>
                  {pkg.tag}
                </div>
              )}

              {/* Title */}
              <h3 className="text-2xl font-black pt-2 text-slate-900">
                {pkg.title}
              </h3>

              {/* Price */}
              <div className="my-3">
                <span className={`text-5xl font-black tracking-tight ${pkg.isUnban ? 'text-purple-600' : 'text-[#ff2b7d]'}`}>
                  ₹{pkg.price}
                </span>
                <span className="text-xs text-slate-400 line-through ml-2">₹{pkg.originalPrice}</span>
              </div>

              {/* Description */}
              <p className="text-xs font-medium leading-relaxed px-2 text-slate-600">
                {pkg.desc}
              </p>

              {/* Features Bullet List */}
              {pkg.features && pkg.features.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-100 text-left space-y-2">
                  {pkg.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-xs font-semibold text-slate-700">
                      <CheckCircle2 className={`w-4 h-4 shrink-0 ${pkg.isUnban ? 'text-purple-600' : 'text-emerald-500'}`} />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Bonus Pill */}
              {pkg.bonus && (
                <div className="mt-3.5 py-2 px-3 rounded-2xl text-xs font-extrabold bg-rose-50 text-rose-600 border border-rose-200">
                  {pkg.bonus}
                </div>
              )}

              {/* BUY NOW BUTTON WITH SHINE REFLECTION EFFECT */}
              <button
                onClick={() => handleOpenCheckoutModal(pkg)}
                className={`w-full mt-6 py-4 px-6 rounded-2xl font-black text-lg uppercase tracking-wider text-white shadow-lg shadow-rose-500/25 flex items-center justify-center space-x-2 transition-all transform active:scale-95 cursor-pointer relative overflow-hidden group btn-shine-effect ${customBtnColor}`}
              >
                <span className="relative z-10">
                  {pkg.isUnban ? 'RECOVER ACCOUNT NOW' : 'Buy Now'}
                </span>
                <ArrowRight className="w-5 h-5 relative z-10" />
              </button>

            </div>
          );
        })}
      </section>

      {/* 7. HORIZONTAL AUTO-SCROLLING MARQUEE TESTIMONIALS CAROUSEL */}
      <section className="py-12 border-t border-slate-200/60 mt-12 overflow-hidden bg-slate-50/50">
        <div className="text-center mb-6 px-4">
          <span className="text-[11px] font-black uppercase tracking-widest text-[#ff2b7d]">⭐ Customer Proof & Live Ratings</span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">Verified Buyer Testimonials</h3>
          <p className="text-xs text-slate-500 font-medium">Real experiences from creators, brands, and influencers</p>
        </div>

        {/* Smooth Infinite Marquee Carousel Container */}
        <div className="relative w-full overflow-hidden py-3">
          <div className="flex space-x-4 animate-marquee hover:[animation-play-state:paused] w-max cursor-grab">
            {[...testimonials, ...testimonials].map((t, index) => (
              <div
                key={`${t.id}-${index}`}
                className="w-[300px] sm:w-[340px] bg-white p-5 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between shrink-0 space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex text-amber-400 space-x-0.5">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
                      ✔ {t.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 font-medium leading-relaxed italic">
                    "{t.review}"
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-black text-slate-900">{t.name}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{t.city} • {t.service}</p>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-rose-50 text-rose-600 font-black text-xs flex items-center justify-center">
                    {t.name.charAt(0)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FAQ ACCORDION */}
      <section className="py-10 px-4 max-w-md mx-auto">
        <h3 className="text-lg font-black text-slate-900 text-center mb-4">Frequently Asked Questions</h3>
        <div className="space-y-2">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden">
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

      {/* 9. LIGHT GLASSMORPHIC LIVE SALES TOAST NOTIFICATION */}
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

      {/* 10. ULTRA-COMPACT 1-STEP CHECKOUT MODAL */}
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
                <span className={`text-3xl font-black ${activePack.isUnban ? 'text-purple-600' : 'text-[#ff2b7d]'}`}>
                  ₹{activePack.price}
                </span>
                <span className="text-xs text-slate-400 line-through">₹{activePack.originalPrice}</span>
              </div>
            </div>

            {/* Single Input Field */}
            <form onSubmit={handleExecutePayment} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                  {activePack.isUnban 
                    ? 'Banned Instagram Handle or Email' 
                    : activePlatform === 'telegram'
                    ? 'Telegram Channel / Group Link'
                    : activePlatform === 'facebook'
                    ? 'Facebook Page URL'
                    : activePlatform === 'youtube'
                    ? 'YouTube Channel URL or Video Link'
                    : 'Instagram Profile Username or Reel Link'} <span className="text-rose-600">*</span>
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
                    placeholder={
                      activePack.isUnban 
                        ? "e.g. banned_username or registered email" 
                        : activePlatform === 'telegram'
                        ? "e.g. t.me/yourchannel or username"
                        : activePlatform === 'facebook'
                        ? "e.g. facebook.com/yourpage"
                        : activePlatform === 'youtube'
                        ? "e.g. youtube.com/@channel or video URL"
                        : "e.g. virat.kohli or profile link"
                    }
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
                className={`w-full py-4 px-6 rounded-2xl text-white font-black text-base uppercase tracking-wider shadow-lg transition-all transform active:scale-95 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 btn-shine-effect ${
                  activePack.isUnban
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 shadow-purple-600/30 hover:brightness-110'
                    : 'bg-[#ff2b7d] hover:bg-rose-600 shadow-rose-500/30'
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
