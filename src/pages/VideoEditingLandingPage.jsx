import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Download, 
  Infinity as InfinityIcon, 
  Check, 
  Star, 
  ArrowRight, 
  Play, 
  Eye, 
  Flame, 
  Clock, 
  Laptop, 
  Smartphone, 
  Volume2, 
  Film, 
  Layers, 
  ChevronDown, 
  ChevronUp, 
  X, 
  HelpCircle, 
  MessageCircle, 
  CheckCircle2, 
  Lock, 
  Gift, 
  Users, 
  Percent,
  Sliders,
  ExternalLink,
  Tag,
  ArrowUpRight
} from 'lucide-react';

export default function VideoEditingLandingPage({ 
  onBuyProduct, 
  onNavigateToStore, 
  settings 
}) {
  // Dynamic Countdown Timer (14 mins 59 secs format)
  const [timeLeft, setTimeLeft] = useState(() => {
    try {
      const saved = sessionStorage.getItem('editpro_timer');
      return saved ? parseInt(saved, 10) : 899; // 14:59 in seconds
    } catch (e) {
      return 899;
    }
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const next = prev > 1 ? prev - 1 : 899;
        try { sessionStorage.setItem('editpro_timer', next.toString()); } catch (e) {}
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Before / After Slider State
  const [sliderPos, setSliderPos] = useState(55);
  const [isDragging, setIsDragging] = useState(false);

  // Active Asset Preview Tab
  const [activeAssetTab, setActiveAssetTab] = useState('luts');

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(0);

  // Modal State for "View Details"
  const [modalProduct, setModalProduct] = useState(null);

  // Live Toast Notification
  const [toastNotification, setToastNotification] = useState(null);

  const notificationsPool = [
    { name: "Rahul S.", city: "Mumbai", pack: "Complete Editor Combo (₹299)", time: "2 min ago" },
    { name: "Aman V.", city: "Delhi", pack: "Editing Asset Pack (₹99)", time: "4 min ago" },
    { name: "Kunal M.", city: "Bangalore", pack: "Complete Editor Combo (₹299)", time: "1 min ago" },
    { name: "Priya P.", city: "Pune", pack: "Video Editing Mega Course (₹99)", time: "3 min ago" },
    { name: "Vikram R.", city: "Hyderabad", pack: "CapCut Pro Software (₹199)", time: "5 min ago" },
    { name: "Deepak S.", city: "Jaipur", pack: "Complete Editor Combo (₹299)", time: "Just now" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const randomItem = notificationsPool[Math.floor(Math.random() * notificationsPool.length)];
      setToastNotification(randomItem);
      const hideTimeout = setTimeout(() => setToastNotification(null), 4000);
      return () => clearTimeout(hideTimeout);
    }, 9000);
    return () => clearInterval(interval);
  }, []);

  // Products Data matching competitor exactly
  const products = [
    {
      id: "prod-editing-assets",
      slug: "premium-editing-assets",
      title: "Premium High Quality Editing Assets",
      subtitle: "LUTs · Presets · VFX · SFX · Animations · Overlays · Plugins",
      badge: "CREATOR FAVORITE",
      discount: "96% OFF",
      price: 99,
      originalPrice: 2499,
      saveAmount: 2400,
      isCombo: false,
      tagline: "Instant cinematic glow for all your videos & reels",
      features: [
        "1,000+ Cinematic 3D LUTs (Teal-Orange, Moody, Wedding, Vintage, Film)",
        "2,000+ Studio Sound Effects (SFX, Whooshes, Risers, Impacts & Beats)",
        "500+ 4K Overlays (Dust, Film Burns, Light Leaks, Glitches & Textures)",
        "Motion Graphics, Lower Thirds & Animated Title Presets",
        "Works with Premiere Pro, CapCut, DaVinci Resolve, AE & Filmora",
        "Instant 1-Click Google Drive Link with Lifetime Access"
      ],
      drive_download_url: "https://drive.google.com/drive/folders/bazara-video-editing-assets"
    },
    {
      id: "prod-editing-course",
      slug: "video-editing-mega-course",
      title: "Video Editing Mega Course Bundle",
      subtitle: "CapCut · Filmora · After Effects · Premiere Pro · DaVinci",
      badge: "BEST FOR LEARNERS",
      discount: "95% OFF",
      price: 99,
      originalPrice: 1999,
      saveAmount: 1900,
      isCombo: false,
      tagline: "From beginner to high-paid freelance video editor",
      features: [
        "5 Complete Step-by-Step Editing Courses in 1 Master Bundle",
        "Beginner to Advanced Masterclass Lessons (Zero to Pro)",
        "Hindi + English Clear Audio Explanations",
        "Includes Practice Raw Clips, Project Files & Shortcut Sheets",
        "Viral Reel Hooks, Velocity Curves & Sound Design Formulas",
        "Lifetime Access with Free Future Updates"
      ],
      drive_download_url: "https://drive.google.com/drive/folders/bazara-video-editing-course"
    },
    {
      id: "prod-capcut-pro",
      slug: "capcut-pro-software",
      title: "CapCut Software Pro Edition",
      subtitle: "All premium features unlocked for PC & Mobile",
      badge: "PRO TOOLS UNLOCKED",
      discount: "93% OFF",
      price: 199,
      originalPrice: 2999,
      saveAmount: 2800,
      isCombo: false,
      tagline: "Unlock 100% VIP effects, transitions & no watermark export",
      features: [
        "All CapCut Pro Transitions, 3D Effects & AI Filters Unlocked",
        "Automatic Subtitles / Captions with Viral Animation Emojis",
        "Ultra HD 4K 60FPS Exports with Zero Watermark",
        "PC (Windows 10/11 & Mac) + Android/iOS Installation Setup",
        "Speed Velocity Curves, Motion Blur & Smooth Slow Motion",
        "Step-by-Step 2-Minute Installation Video Guide Included"
      ],
      drive_download_url: "https://drive.google.com/drive/folders/bazara-capcut-pro-software"
    },
    {
      id: "prod-editor-combo",
      slug: "complete-editor-combo",
      title: "Complete All-In-One Editor Combo",
      subtitle: "Mega Course + 10,000+ Assets + CapCut Pro + VIP Bonuses",
      badge: "★ MOST RECOMMENDED / BEST VALUE",
      discount: "96% OFF",
      price: 299,
      originalPrice: 7497,
      saveAmount: 7198,
      isCombo: true,
      tagline: "Everything you will ever need to edit viral videos in one master vault",
      features: [
        "Everything in Video Editing Mega Course (All 5 Full Courses)",
        "Everything in 10,000+ Premium Asset Bundle (LUTs, SFX, Overlays)",
        "CapCut Software Pro (PC + Mobile VIP Unlocked Edition)",
        "BONUS 1: 5,000+ Viral Ready-to-Post Reels Clips & Trending Beats (Worth ₹999)",
        "BONUS 2: High-Paying Freelancing & Client-Getting DM Scripts (Worth ₹1,499)",
        "Single 1-Click Master Google Drive Access + Lifetime VIP WhatsApp Support"
      ],
      drive_download_url: "https://drive.google.com/drive/folders/bazara-complete-editor-combo-master"
    }
  ];

  const comboProduct = products.find(p => p.isCombo);

  const assetCategories = [
    {
      id: 'luts',
      name: '1,000+ 3D LUTs',
      count: '1,000+',
      icon: Film,
      desc: 'Cinematic color grading for flat footage. Hollywood Teal-Orange, Moody Dark, Film Warm, Wedding & Vintage aesthetics.',
      items: ['Teal & Orange Blockbuster', 'Moody Vintage Film', 'Cyberpunk Neon Glow', 'Clean Wedding Pastel', 'Golden Hour Glow', 'Black & White Cinema']
    },
    {
      id: 'sfx',
      name: '2,000+ Sound FX',
      count: '2,000+',
      icon: Volume2,
      desc: 'High dynamic range SFX to make your cuts punchy. Whooshes, cinematic risers, deep 808 bass drops & reel impact hits.',
      items: ['Fast Cinematic Whooshes', 'Deep Sub Bass Drops', 'Tension Riser Buildups', 'Mechanical & UI Clicks', 'Ambient Atmospheric Drones', 'Gunshots & Metal Hits']
    },
    {
      id: 'overlays',
      name: '500+ 4K Overlays',
      count: '500+',
      icon: Layers,
      desc: 'Drag & drop blending overlays to give your footage vintage grain, organic light flares and stylish glitches.',
      items: ['Real 35mm Film Grain', 'Organic Golden Light Leaks', 'Film Burn Transitions', 'Retro VHS Static', 'Anamorphic Lens Flares', 'Dust & Scratch Textures']
    },
    {
      id: 'motion',
      name: 'Motion Graphics',
      count: '350+',
      icon: Sparkles,
      desc: 'Plug-and-play animated lower thirds, viral subscribe buttons, text popups and kinetic callouts.',
      items: ['Viral Reel Captions & Titles', 'Instagram Follow & Like Popups', 'Animated Neon Arrows', 'Sound Waveform Visualizers', 'Smooth Split-Screen Templates', 'Modern Glassmorphic Boxes']
    }
  ];

  const faqs = [
    {
      q: "Payment ke baad mujhe assets aur course kaise milenge?",
      a: "Payment complete hote hi turant screen par aapko 1-Click Official Google Drive Master Link mil jayega. Saath hi aapke WhatsApp aur Email par bhi Drive link aur download instructions auto-send ho jayenge. Zero waiting time!"
    },
    {
      q: "Kya ye phone (Android / iPhone) aur PC dono pe chalega?",
      a: "Ji haan, bilkul! LUTs, Sound Effects aur Overlays CapCut Mobile, VN Editor, KineMaster, Premiere Pro, After Effects, DaVinci Resolve aur Filmora sabhi software aur devices me 100% smoothly kaam karte hain."
    },
    {
      q: "Kya koi monthly subscription ya hidden charges hain?",
      a: "Nahi, bilkul nahi! Ye ONE-TIME PAYMENT hai. Aapko lifetime access milta hai bina kisi monthly ya yearly subscription ke. Future ke naye updates bhi aapko free me milenge."
    },
    {
      q: "Agar mujhe file use karne ya install karne me koi dikkat aaye to?",
      a: "Aapke paas hamara Direct VIP WhatsApp Support rahega. Folder ke andar step-by-step video tutorials bhi diye gaye hain jo aapko guide karenge."
    },
    {
      q: "Payment ke kaun-kaun se options available hain?",
      a: "Aap Google Pay, PhonePe, Paytm, CRED, Amazon Pay, UPI, Debit/Credit Card aur Net Banking kisi se bhi 100% secure payment kar sakte hain."
    }
  ];

  const testimonials = [
    {
      name: "Rohan Verma",
      role: "Freelance Video Editor & YouTuber",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
      rating: 5,
      comment: "Bhai ₹299 me itna saara content milna impossible lagta tha! LUTs aur SFX pack ne meri editing speed 3x badha di hai. Clients ab meri color grading ki tareef karte hain.",
      pack: "Verified Buyer · Complete Combo"
    },
    {
      name: "Sameer Shaikh",
      role: "Instagram Reel Creator (140k Followers)",
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80",
      rating: 5,
      comment: "CapCut Pro features aur sound design packs are pure gold! Jo reels pehle dull lagti thi, ab cinema quality lagti hain. Ek hi din me 2 reels viral ho gayi.",
      pack: "Verified Buyer · Complete Combo"
    },
    {
      name: "Ananya Deshmukh",
      role: "Content Creator & Agency Owner",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80",
      rating: 5,
      comment: "Mega Course beginner friendly hai aur practice raw footage bhi included hai. Kisi aur course pe ₹5,000 kharch karne ki zaroorat hi nahi padi. Best investment!",
      pack: "Verified Buyer · Mega Course"
    }
  ];

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-300 font-sans relative overflow-x-hidden pb-24 md:pb-16">
      
      {/* 1. TOP FLASH SALE URGENCY BAR */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 text-white text-xs sm:text-sm font-semibold py-2 px-4 shadow-lg backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 truncate">
            <span className="flex h-2 w-2 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <span className="font-bold tracking-wide uppercase text-[11px] sm:text-xs">⚡ LIMITED TIME 96% OFF FLASH SALE</span>
            <span className="hidden sm:inline text-white/80">• Instant Google Drive Link Delivery</span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 bg-black/25 px-2.5 py-1 rounded-full border border-white/20">
            <Clock className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span className="text-[11px] sm:text-xs font-mono font-bold tracking-wider text-amber-200">
              Ends in {formatTimer(timeLeft)}
            </span>
          </div>
        </div>
      </div>

      {/* 2. HEADER NAVBAR */}
      <header className="border-b border-white/[0.08] bg-[#090b12]/80 backdrop-blur-xl sticky top-[37px] z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Sparkles className="w-5 h-5 text-black" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-white flex items-center gap-1">
                EditPro <span className="text-emerald-400">Store</span>
              </span>
              <span className="hidden xs:block text-[9.5px] uppercase font-bold tracking-widest text-slate-400 -mt-1">
                Pro Editing Vault
              </span>
            </div>
          </div>

          {/* Quick Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-300">
            <a href="#products" className="hover:text-emerald-400 transition-colors">Products & Bundles</a>
            <a href="#preview" className="hover:text-emerald-400 transition-colors">Before & After</a>
            <a href="#assets" className="hover:text-emerald-400 transition-colors">What's Inside</a>
            <a href="#reviews" className="hover:text-emerald-400 transition-colors">Reviews</a>
            <a href="#faq" className="hover:text-emerald-400 transition-colors">FAQs</a>
          </nav>

          {/* Header Action Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onBuyProduct(comboProduct)}
              className="relative group overflow-hidden bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm shadow-md shadow-emerald-500/25 transition-all active:scale-95 flex items-center gap-1.5"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>Get Combo ₹299</span>
            </button>
          </div>
        </div>
      </header>

      {/* 3. HERO SECTION */}
      <section className="relative pt-8 pb-14 sm:pt-14 sm:pb-20 overflow-hidden">
        {/* Subtle Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-10 right-10 w-[350px] h-[350px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10">
          
          {/* Hero Tag Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs font-semibold tracking-wide backdrop-blur-md mb-5 shadow-sm shadow-emerald-500/10 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Complete Video Editing Arsenal for Indian Creators</span>
          </div>

          {/* Main Hero Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.12] text-white max-w-4xl mx-auto">
            Become A Pro Video Editor <br className="hidden sm:block" />
            Starting at Just{' '}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                ₹99
              </span>
              <span className="absolute -bottom-1 left-0 w-full h-[3px] bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full" />
            </span>
          </h1>

          {/* Hero Subheadline */}
          <p className="mt-4 sm:mt-6 text-slate-300 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed font-normal">
            5 Complete Masterclasses (CapCut, Premiere Pro, After Effects, DaVinci & Filmora) + 10,000+ 4K Cinematic LUTs, Sound Effects & CapCut Pro. Instant 1-Click Google Drive download. No monthly subscriptions, ever.
          </p>

          {/* Urgency Pill */}
          <div className="mt-5 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs font-medium">
            <Clock className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
            <span>LIMITED TIME PROMO — Price jumps to ₹7,497 in</span>
            <span className="font-mono font-bold text-amber-200">{formatTimer(timeLeft)}</span>
          </div>

          {/* 4 Trust Badges */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-2xl mx-auto text-xs font-medium text-slate-300">
            <div className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-slate-900/60 border border-white/[0.06] backdrop-blur-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>100% Safe UPI</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-slate-900/60 border border-white/[0.06] backdrop-blur-sm">
              <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Instant Download</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-slate-900/60 border border-white/[0.06] backdrop-blur-sm">
              <InfinityIcon className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Lifetime Access</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-slate-900/60 border border-white/[0.06] backdrop-blur-sm">
              <Smartphone className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Phone + PC Support</span>
            </div>
          </div>

          {/* Dual Action CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={() => onBuyProduct(comboProduct)}
              className="w-full sm:w-auto relative group overflow-hidden bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-extrabold px-8 py-4 rounded-2xl text-base shadow-xl shadow-emerald-500/30 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
            >
              <Zap className="w-5 h-5 fill-slate-950" />
              <span>Claim All-In-One Combo · ₹299</span>
              <span className="bg-black/20 text-slate-950 text-xs px-2 py-0.5 rounded-full font-bold ml-1">96% OFF</span>
            </button>

            <a
              href="#products"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-slate-200 text-sm font-semibold transition-all hover:border-emerald-500/40 flex items-center justify-center gap-2"
            >
              <span>Explore Individual Packs (₹99)</span>
              <ArrowRight className="w-4 h-4 text-emerald-400" />
            </a>
          </div>

          {/* Software Compatibility Bar */}
          <div className="mt-10 pt-7 border-t border-white/[0.06]">
            <p className="text-[11px] uppercase font-bold tracking-widest text-slate-400 mb-3">
              100% Compatible With Your Favorite Software & Apps
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-semibold text-slate-300">
              <span className="px-3 py-1 rounded-full bg-slate-900 border border-emerald-500/20 text-emerald-300">CapCut (PC & Mobile)</span>
              <span className="px-3 py-1 rounded-full bg-slate-900 border border-emerald-500/20 text-emerald-300">Adobe Premiere Pro</span>
              <span className="px-3 py-1 rounded-full bg-slate-900 border border-emerald-500/20 text-emerald-300">Adobe After Effects</span>
              <span className="px-3 py-1 rounded-full bg-slate-900 border border-emerald-500/20 text-emerald-300">DaVinci Resolve</span>
              <span className="px-3 py-1 rounded-full bg-slate-900 border border-emerald-500/20 text-emerald-300">Wondershare Filmora</span>
              <span className="px-3 py-1 rounded-full bg-slate-900 border border-emerald-500/20 text-emerald-300">VN Video Editor</span>
            </div>
          </div>

        </div>
      </section>

      {/* 4. STATS COUNTER STRIP */}
      <section className="border-y border-white/[0.08] bg-slate-950/80 py-6">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-black text-white">21,500+</div>
            <div className="text-xs text-slate-400 font-medium mt-0.5">Indian Creators Enrolled</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400">150+ GB</div>
            <div className="text-xs text-slate-400 font-medium mt-0.5">High Quality Pro Assets</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-amber-400 flex items-center justify-center gap-1">
              4.98 <Star className="w-5 h-5 fill-amber-400 text-amber-400 inline" />
            </div>
            <div className="text-xs text-slate-400 font-medium mt-0.5">Verified Student Rating</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-cyan-400">₹0 / Month</div>
            <div className="text-xs text-slate-400 font-medium mt-0.5">Zero Subscriptions Forever</div>
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE BEFORE VS AFTER PREVIEW SLIDER (Conversion Anchor) */}
      <section id="preview" className="py-14 sm:py-20 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest">
              Live Quality Transformation
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white mt-1">
              See What 1-Click Pro LUTs & Effects Do To Your Video
            </h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto mt-2">
              Drag the interactive slider below to see how flat, dull raw footage turns into a Hollywood cinematic masterpiece.
            </p>
          </div>

          {/* Interactive Before/After Visual Card */}
          <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-slate-900 aspect-video select-none group">
            {/* "After" Image (Right Layer / Background) */}
            <img 
              src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&auto=format&fit=crop&q=85" 
              alt="After Pro Color Grading"
              className="absolute inset-0 w-full h-full object-cover filter contrast-125 saturate-150"
            />
            
            {/* "Before" Image (Left Layer / Clipped) */}
            <div 
              className="absolute inset-y-0 left-0 overflow-hidden"
              style={{ width: `${sliderPos}%` }}
            >
              <img 
                src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&auto=format&fit=crop&q=85" 
                alt="Before Flat Raw Footage"
                className="absolute inset-0 w-full h-full object-cover filter grayscale contrast-75 brightness-90"
                style={{ width: '100%', maxWidth: 'none' }}
              />
              <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-slate-300 border border-white/20">
                RAW / FLAT LOG (BEFORE)
              </div>
            </div>

            {/* "After" Label */}
            <div className="absolute top-4 right-4 bg-emerald-500/90 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-black text-black shadow-lg">
              ✨ PRO CINEMATIC LUT (AFTER)
            </div>

            {/* Divider Line & Handle */}
            <div 
              className="absolute inset-y-0 w-1 bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] cursor-ew-resize flex items-center justify-center"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="w-8 h-8 rounded-full bg-white text-slate-900 shadow-xl flex items-center justify-center font-bold text-xs border-2 border-emerald-400">
                <Sliders className="w-4 h-4 text-emerald-600" />
              </div>
            </div>

            {/* Slider Range Input (Touch/Mouse Controller) */}
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={sliderPos}
              onChange={(e) => setSliderPos(e.target.value)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
            />
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-slate-400 px-2">
            <span>👈 Drag Left: Reveal More After Grade</span>
            <span>Drag Right: Compare With Raw Clip 👉</span>
          </div>
        </div>
      </section>

      {/* 6. WHAT'S INSIDE THE VAULT (CATEGORIES TAB) */}
      <section id="assets" className="py-14 sm:py-20 bg-slate-950/60 border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest">
              Production-Grade Creative Assets
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-1">
              Everything Needed to Produce 10x Better Videos
            </h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto mt-2">
              Cleanly sorted into organized Google Drive folders with easy thumbnails & instant 1-click downloads.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {assetCategories.map(tab => {
              const Icon = tab.icon;
              const isActive = activeAssetTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveAssetTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    isActive 
                      ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20' 
                      : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-white/[0.06]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>

          {/* Active Tab Content Card */}
          {(() => {
            const current = assetCategories.find(c => c.id === activeAssetTab);
            const Icon = current.icon;
            return (
              <div className="bg-slate-900/70 border border-white/[0.08] rounded-3xl p-6 sm:p-8 backdrop-blur-xl max-w-4xl mx-auto">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      {current.name}
                      <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full font-mono">
                        {current.count} Files
                      </span>
                    </h3>
                    <p className="text-slate-300 text-sm mt-1 leading-relaxed">{current.desc}</p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-6 border-t border-white/[0.06]">
                  {current.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-slate-200 bg-slate-950/60 p-3 rounded-xl border border-white/[0.04]">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* 7. PRICING & PRODUCTS SECTION (Direct Competitor Style but 10x More Premium) */}
      <section id="products" className="py-14 sm:py-24 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
              Pick Your Pack
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white">
              4 Products. <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">All Worth Grabbing.</span>
            </h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto mt-2">
              Hand-picked, lifetime access, instant Google Drive delivery. Buy individually or grab the complete combo to save 96%.
            </p>
          </div>

          {/* Products Grid (4 Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {products.map((prod) => {
              const isCombo = prod.isCombo;
              return (
                <div 
                  key={prod.id}
                  className={`relative flex flex-col justify-between rounded-3xl p-6 transition-all duration-300 ${
                    isCombo 
                      ? 'bg-gradient-to-b from-slate-900 via-[#0d1622] to-slate-950 border-2 border-emerald-400 shadow-2xl shadow-emerald-500/20 ring-2 ring-emerald-500/20 lg:-translate-y-2' 
                      : 'bg-slate-900/60 hover:bg-slate-900/80 border border-white/[0.08] hover:border-white/20'
                  }`}
                >
                  {/* Combo Recommended Ribbon */}
                  {isCombo && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 text-[10.5px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-lg">
                      ★ MOST RECOMMENDED / BEST VALUE
                    </div>
                  )}

                  <div>
                    {/* Top Badges */}
                    <div className="flex items-center justify-between gap-2 mb-3 mt-1">
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md ${
                        isCombo ? 'bg-emerald-400 text-slate-950' : 'bg-emerald-500/10 text-emerald-300'
                      }`}>
                        {prod.badge}
                      </span>
                      <span className="text-[10.5px] font-black text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-md">
                        {prod.discount}
                      </span>
                    </div>

                    {/* Product Title & Subtitle */}
                    <h3 className="text-lg font-black text-white leading-snug">
                      {prod.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {prod.subtitle}
                    </p>

                    {/* Features Checklist */}
                    <ul className="mt-5 space-y-2.5">
                      {prod.features.slice(0, isCombo ? 6 : 4).map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-300 leading-snug">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Pricing & CTA Buttons */}
                  <div className="mt-6 pt-5 border-t border-white/[0.08]">
                    <div className="flex items-baseline justify-between mb-4">
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-emerald-400">
                          ₹{prod.price}
                        </span>
                        <span className="text-xs text-slate-500 line-through">
                          ₹{prod.originalPrice}
                        </span>
                      </div>
                      <span className="text-[10.5px] font-semibold text-emerald-300/80">
                        Save ₹{prod.saveAmount}
                      </span>
                    </div>

                    {/* View Details Button */}
                    <button
                      onClick={() => setModalProduct(prod)}
                      className="w-full mb-2 py-2 px-3 rounded-xl border border-white/10 hover:border-emerald-500/40 bg-white/[0.03] text-xs font-semibold text-slate-300 hover:text-white transition-all flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-emerald-400" />
                      <span>View Details</span>
                    </button>

                    {/* Buy Now Button */}
                    <button
                      onClick={() => onBuyProduct(prod)}
                      className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-1.5 active:scale-95 ${
                        isCombo
                          ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 shadow-lg shadow-emerald-500/30'
                          : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                      }`}
                    >
                      <Zap className="w-4 h-4 fill-slate-950" />
                      <span>Buy Now · ₹{prod.price}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. COMPARISON TABLE: US VS TRADITIONAL SUBSCRIPTIONS */}
      <section className="py-14 sm:py-20 bg-slate-950/70 border-t border-white/[0.06]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest">
              Unmatched Value Comparison
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white mt-1">
              Why Spend ₹30,000+ Every Year On Subscriptions?
            </h2>
          </div>

          <div className="rounded-2xl border border-white/10 overflow-hidden bg-slate-900/60 shadow-xl">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-900 text-slate-300 border-b border-white/10">
                <tr>
                  <th className="p-3.5 sm:p-4 font-bold">Feature</th>
                  <th className="p-3.5 sm:p-4 text-slate-400 font-semibold">Envato / MotionArray</th>
                  <th className="p-3.5 sm:p-4 text-emerald-400 font-black bg-emerald-500/10">EditPro Store Combo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] text-slate-300">
                <tr>
                  <td className="p-3.5 sm:p-4 font-medium">Pricing Model</td>
                  <td className="p-3.5 sm:p-4 text-rose-400">₹2,800 / Month (₹33,600/year)</td>
                  <td className="p-3.5 sm:p-4 text-emerald-400 font-bold bg-emerald-500/10">Just ₹299 (One-Time)</td>
                </tr>
                <tr>
                  <td className="p-3.5 sm:p-4 font-medium">Mega Editing Courses</td>
                  <td className="p-3.5 sm:p-4 text-slate-500">None (Extra ₹5k+ each)</td>
                  <td className="p-3.5 sm:p-4 text-emerald-400 font-bold bg-emerald-500/10">5 Complete Courses Included</td>
                </tr>
                <tr>
                  <td className="p-3.5 sm:p-4 font-medium">CapCut Pro Software VIP</td>
                  <td className="p-3.5 sm:p-4 text-slate-500">Not Included</td>
                  <td className="p-3.5 sm:p-4 text-emerald-400 font-bold bg-emerald-500/10">Included (PC + Mobile)</td>
                </tr>
                <tr>
                  <td className="p-3.5 sm:p-4 font-medium">Access Duration</td>
                  <td className="p-3.5 sm:p-4 text-rose-400">Ends when you stop paying</td>
                  <td className="p-3.5 sm:p-4 text-emerald-400 font-bold bg-emerald-500/10">Lifetime Free Updates</td>
                </tr>
                <tr>
                  <td className="p-3.5 sm:p-4 font-medium">Delivery Method</td>
                  <td className="p-3.5 sm:p-4">Complex web downloads</td>
                  <td className="p-3.5 sm:p-4 text-emerald-400 font-bold bg-emerald-500/10">1-Click Fast Google Drive</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 9. REAL REVIEWS & SOCIAL PROOF */}
      <section id="reviews" className="py-14 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest">
              Real Creator Feedback
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-1">
              Trusted by 21,500+ Editors Across India
            </h2>
            <p className="text-slate-400 text-sm max-w-md mx-auto mt-2">
              From college students making their first reel to high-earning freelance agency editors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div 
                key={idx} 
                className="rounded-3xl p-6 bg-slate-900/60 border border-white/[0.08] hover:border-emerald-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-1 text-amber-400">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Verified Buyer
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic">
                    "{t.comment}"
                  </p>
                </div>

                <div className="flex items-center gap-3 mt-6 pt-4 border-t border-white/[0.06]">
                  <img 
                    src={t.avatar} 
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover border border-emerald-500/30" 
                  />
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white">{t.name}</h4>
                    <p className="text-[11px] text-slate-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. FAQ ACCORDION SECTION */}
      <section id="faq" className="py-14 sm:py-20 bg-slate-950/60 border-t border-white/[0.06]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest">
              Have Questions?
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white mt-1">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-2">
              Sabhi important sawalo ke jawab yahan diye gaye hain.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx}
                  className="rounded-2xl border border-white/[0.08] bg-slate-900/60 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 text-sm sm:text-base font-bold text-white hover:text-emerald-400 transition-colors"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-5 sm:px-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/[0.04] pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 11. FINAL BOTTOM HIGH-CONVERSION CTA CALLOUT */}
      <section className="py-14 sm:py-20 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-b from-slate-900 via-[#0d1622] to-slate-950 border border-emerald-500/40 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
            
            <span className="inline-block text-xs font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full mb-3">
              One-Time ₹299 Deal
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
              Ready to Upgrade Your Editing Game Today?
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm max-w-lg mx-auto mt-3">
              Join 21,500+ editors creating high-retention viral reels and cinema-grade client projects. Instant Google Drive download.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => onBuyProduct(comboProduct)}
                className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black px-8 py-4 rounded-2xl text-base shadow-xl shadow-emerald-500/30 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                <Zap className="w-5 h-5 fill-slate-950" />
                <span>Get Complete Combo · ₹299 (96% OFF)</span>
              </button>
            </div>

            <div className="mt-5 text-[11px] text-slate-400 flex items-center justify-center gap-4">
              <span>🔒 100% Encrypted UPI Payment</span>
              <span>⚡ Delivery within 2 seconds</span>
            </div>
          </div>
        </div>
      </section>

      {/* 12. FOOTER */}
      <footer className="border-t border-white/[0.08] bg-black py-8 text-center text-xs text-slate-400">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-white">EditPro Store</span>
            <span>• Instant Digital Delivery</span>
          </div>

          <p className="text-slate-400 text-[11px]">
            © {new Date().getFullYear()} EditPro Store. All Rights Reserved. Not affiliated with Adobe or ByteDance.
          </p>
        </div>
      </footer>

      {/* 13. STICKY MOBILE BOTTOM BAR (CRITICAL CONVERSION DRIVER) */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-[#090b12]/95 border-t border-emerald-500/30 backdrop-blur-xl p-3 md:hidden shadow-2xl">
        <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
              Complete Combo (All 3)
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-emerald-400">₹299</span>
              <span className="text-xs text-slate-500 line-through">₹7,497</span>
              <span className="text-[9.5px] font-bold text-rose-400 bg-rose-500/10 px-1 rounded">96% OFF</span>
            </div>
          </div>

          <button
            onClick={() => onBuyProduct(comboProduct)}
            className="flex-1 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/25 active:scale-95"
          >
            <Zap className="w-4 h-4 fill-slate-950" />
            <span>Instant Buy Now</span>
          </button>
        </div>
      </div>

      {/* 14. LIVE RECENT ORDER POPUP TOAST (SOCIAL PROOF FOMO) */}
      {toastNotification && (
        <div className="fixed bottom-20 sm:bottom-6 left-4 z-50 animate-bounce-subtle bg-slate-900/95 border border-emerald-500/30 text-white rounded-2xl p-3 shadow-2xl backdrop-blur-xl max-w-xs flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="text-xs leading-tight">
            <p className="font-bold text-slate-100">
              {toastNotification.name} <span className="text-slate-400 font-normal">from {toastNotification.city}</span>
            </p>
            <p className="text-emerald-400 font-semibold text-[11px] truncate mt-0.5">
              Purchased {toastNotification.pack}
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">{toastNotification.time}</p>
          </div>
        </div>
      )}

      {/* 15. "VIEW DETAILS" PRODUCT MODAL */}
      {modalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-white/20 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalProduct(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md">
              {modalProduct.badge}
            </span>

            <h3 className="text-xl font-black text-white mt-2">
              {modalProduct.title}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {modalProduct.tagline}
            </p>

            <div className="my-5 p-4 rounded-2xl bg-slate-950/60 border border-white/[0.06]">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                What's Included in This Pack:
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                {modalProduct.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-baseline justify-between mb-5">
              <div>
                <span className="text-2xl font-black text-emerald-400">₹{modalProduct.price}</span>
                <span className="text-xs text-slate-500 line-through ml-2">₹{modalProduct.originalPrice}</span>
              </div>
              <span className="text-xs font-semibold text-emerald-300">Save ₹{modalProduct.saveAmount} (96% OFF)</span>
            </div>

            <button
              onClick={() => {
                const p = modalProduct;
                setModalProduct(null);
                onBuyProduct(p);
              }}
              className="w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black py-3.5 px-4 rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 active:scale-95"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>Proceed to Instant Checkout · ₹{modalProduct.price}</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
