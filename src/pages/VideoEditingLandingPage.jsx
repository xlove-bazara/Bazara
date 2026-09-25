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
  ArrowUpRight,
  ZoomIn,
  ZoomOut,
  RotateCw
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

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(0);

  // Modal State for "View Details" Poster Lightbox
  const [modalProduct, setModalProduct] = useState(null);
  const [lightboxZoom, setLightboxZoom] = useState(100);
  const [lightboxRotation, setLightboxRotation] = useState(0);

  // Lock body scroll and listen for Escape key when lightbox is open
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setModalProduct(null);
      }
    };
    if (modalProduct) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [modalProduct]);

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
      image: "/poster-editing-assets.jpg",
      cover_image: "/poster-editing-assets.jpg",
      enable_bump_offer: true,
      bump_title: "Unlock 15,000+ Ready-to-Use AI Prompts Vault",
      bump_price: 49,
      bump_desc: "⚡ ChatGPT & AI का पूरा फायदा तभी मिलता है जब सही Prompts हों! 1-Click में Copy-Paste करें और अपने काम को 10x Fast बनाएं!",
      bump_image: "/bump-offer-banner.jpg",
      bump_drive_url: "https://drive.google.com/drive/folders/1oasuoPFBKL5JUpBKahxeRwlKQK4n8X4P?usp=drive_link",
      tagline: "Instant cinematic glow for all your videos & reels",
      features: [
        "1000+ premium LUTs & presets",
        "VFX, overlays, transitions",
        "Sound effects & background music",
        "Works with all editing software like Premiere Pro, CapCut, AE & Filmora"
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
      image: "/poster-editing-course.jpg",
      cover_image: "/poster-editing-course.jpg",
      enable_bump_offer: true,
      bump_title: "Unlock 15,000+ Ready-to-Use AI Prompts Vault",
      bump_price: 49,
      bump_desc: "⚡ ChatGPT & AI का पूरा फायदा तभी मिलता है जब सही Prompts हों! 1-Click में Copy-Paste करें और अपने काम को 10x Fast बनाएं!",
      bump_image: "/bump-offer-banner.jpg",
      bump_drive_url: "https://drive.google.com/drive/folders/1oasuoPFBKL5JUpBKahxeRwlKQK4n8X4P?usp=drive_link",
      tagline: "From beginner to high-paid freelance video editor",
      features: [
        "5 Complete Step-by-Step Editing Courses in 1 Master Bundle",
        "Beginner to Advanced Masterclass Lessons (Zero to Pro)",
        "Hindi + English Clear Audio Explanations",
        "Includes Practice Raw Clips, Project Files & Shortcut Sheets"
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
      image: "/poster-capcut-pro.jpg",
      cover_image: "/poster-capcut-pro.jpg",
      enable_bump_offer: true,
      bump_title: "Unlock 15,000+ Ready-to-Use AI Prompts Vault",
      bump_price: 49,
      bump_desc: "⚡ ChatGPT & AI का पूरा फायदा तभी मिलता है जब सही Prompts हों! 1-Click में Copy-Paste करें और अपने काम को 10x Fast बनाएं!",
      bump_image: "/bump-offer-banner.jpg",
      bump_drive_url: "https://drive.google.com/drive/folders/1oasuoPFBKL5JUpBKahxeRwlKQK4n8X4P?usp=drive_link",
      tagline: "Unlock 100% VIP effects, transitions & no watermark export",
      features: [
        "All CapCut Pro Transitions, 3D Effects & AI Filters Unlocked",
        "Automatic Subtitles / Captions with Viral Animation Emojis",
        "Ultra HD 4K 60FPS Exports with Zero Watermark",
        "PC (Windows 10/11 & Mac) + Android/iOS Installation Setup"
      ],
      drive_download_url: "https://drive.google.com/drive/folders/bazara-capcut-pro-software"
    },
    {
      id: "prod-editor-combo",
      slug: "complete-editor-combo",
      title: "Complete Editor Combo",
      subtitle: "All 3 products together — biggest savings",
      badge: "MOST VALUE",
      discount: "96% OFF",
      price: 299,
      originalPrice: 7497,
      saveAmount: 7198,
      isCombo: true,
      image: "/poster-editor-combo.jpg",
      cover_image: "/poster-editor-combo.jpg",
      enable_bump_offer: true,
      bump_title: "Unlock 15,000+ Ready-to-Use AI Prompts Vault",
      bump_price: 49,
      bump_desc: "⚡ ChatGPT & AI का पूरा फायदा तभी मिलता है जब सही Prompts हों! 1-Click में Copy-Paste करें और अपने काम को 10x Fast बनाएं!",
      bump_image: "/bump-offer-banner.jpg",
      bump_drive_url: "https://drive.google.com/drive/folders/1oasuoPFBKL5JUpBKahxeRwlKQK4n8X4P?usp=drive_link",
      tagline: "All 3 products together in one master pack — biggest savings",
      features: [
        "Everything in Mega Course",
        "Everything in Asset Bundle",
        "CapCut Software included",
        "Priority access & support"
      ],
      drive_download_url: "https://drive.google.com/drive/folders/bazara-complete-editor-combo-master"
    }
  ];

  const comboProduct = products.find(p => p.isCombo);

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
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80",
      rating: 5,
      comment: "Bhai ₹299 me itna saara content milna impossible lagta tha! LUTs aur SFX pack ne meri editing speed 3x badha di hai. Clients ab meri color grading ki tareef karte hain.",
      pack: "Verified Buyer · Complete Combo"
    },
    {
      name: "Sameer Shaikh",
      role: "Instagram Reel Creator (140k Followers)",
      avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=200&auto=format&fit=crop&q=80",
      rating: 5,
      comment: "CapCut Pro features aur sound design packs are pure gold! Jo reels pehle dull lagti thi, ab cinema quality lagti hain. Ek hi din me 2 reels viral ho gayi.",
      pack: "Verified Buyer · Complete Combo"
    },
    {
      name: "Ananya Deshmukh",
      role: "Content Creator & Agency Owner",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80",
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
            <img
              src="/logo.png?v=2"
              alt="bazara.in"
              className="w-9 h-9 rounded-xl object-contain shadow-lg shadow-emerald-500/20"
            />
            <div>
              <div className="flex items-baseline space-x-0.5">
                <span className="text-lg font-black tracking-tight text-white uppercase">
                  bazara
                </span>
                <span className="text-sm font-black text-emerald-400">.in</span>
              </div>
              <span className="hidden xs:block text-[9.5px] uppercase font-bold tracking-widest text-slate-400 -mt-1">
                Video Editing Hub
              </span>
            </div>
          </div>

          {/* Quick Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-300">
            <a href="#products" className="hover:text-emerald-400 transition-colors">Products & Bundles</a>
            <a href="#preview" className="hover:text-emerald-400 transition-colors">Before & After</a>
            <a href="#reviews" className="hover:text-emerald-400 transition-colors">Reviews</a>
            <a href="#faq" className="hover:text-emerald-400 transition-colors">FAQs</a>
          </nav>

          {/* Header Action Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onBuyProduct(comboProduct)}
              className="btn-shine-effect relative group overflow-hidden bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm shadow-md shadow-emerald-500/25 transition-all active:scale-95 flex items-center gap-1.5"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>Get Combo ₹299</span>
            </button>
          </div>
        </div>
      </header>

      {/* 3. HERO SECTION WITH INTERACTIVE QUALITY TRANSFORMATION SLIDER */}
      <section id="preview" className="relative pt-6 pb-12 sm:pt-12 sm:pb-16 overflow-hidden">
        {/* Subtle Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[650px] h-[350px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-10 right-10 w-[350px] h-[350px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10">
          
          {/* Hero Tag Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs font-semibold tracking-wide backdrop-blur-md mb-4 shadow-sm shadow-emerald-500/10 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Live Quality Transformation • Complete Video Editing Arsenal</span>
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
          <p className="mt-3 sm:mt-5 text-slate-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Drag the interactive slider below to see how flat, dull raw footage turns into a Hollywood cinematic masterpiece. 10,000+ 4K LUTs, Sound Effects, CapCut Pro & 5 Masterclasses.
          </p>

          {/* Interactive Before/After Visual Card */}
          <div className="mt-6 max-w-3xl mx-auto relative rounded-3xl overflow-hidden border-2 border-emerald-500/30 shadow-2xl shadow-emerald-500/15 bg-slate-900 aspect-video select-none group">
            {/* "After" Image (Right Layer / Background) */}
            <img 
              src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&auto=format&fit=crop&q=85" 
              alt="After Pro Color Grading"
              className="absolute inset-0 w-full h-full object-cover filter contrast-125 saturate-150"
            />
            
            {/* "Before" Image (Left Layer / Clipped via clipPath) */}
            <img 
              src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&auto=format&fit=crop&q=85" 
              alt="Before Flat Raw Footage"
              className="absolute inset-0 w-full h-full object-cover filter grayscale contrast-75 brightness-90"
              style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
            />

            {/* "Before" Label */}
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-black/75 backdrop-blur-md px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold text-slate-200 border border-white/20 shadow-md">
              RAW / FLAT LOG (BEFORE)
            </div>

            {/* "After" Label */}
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 font-black px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-[11px] shadow-lg">
              ✨ PRO CINEMATIC LUT (AFTER)
            </div>

            {/* Divider Line & Handle */}
            <div 
              className="absolute inset-y-0 w-0.5 bg-white shadow-[0_0_15px_rgba(52,211,153,0.8)] cursor-ew-resize flex items-center justify-center pointer-events-none"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-950 text-white shadow-xl flex items-center justify-center border-2 border-emerald-400 ring-2 ring-emerald-500/40">
                <Sliders className="w-4 h-4 text-emerald-400" />
              </div>
            </div>

            {/* Slider Range Input (Touch/Mouse Controller) */}
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={sliderPos}
              onChange={(e) => setSliderPos(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
              aria-label="Before and after comparison slider"
            />
          </div>

          {/* Drag Left/Right Micro Guide */}
          <div className="mt-3 flex items-center justify-between text-[11px] sm:text-xs text-slate-400 max-w-3xl mx-auto px-2">
            <span>👈 Drag Left: Reveal More After Grade</span>
            <span>Drag Right: Compare With Raw Clip 👉</span>
          </div>

          {/* Urgency Pill */}
          <div className="mt-5 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs font-medium">
            <Clock className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
            <span>LIMITED TIME PROMO — Price jumps to ₹7,497 in</span>
            <span className="font-mono font-bold text-amber-200">{formatTimer(timeLeft)}</span>
          </div>

          {/* 4 Trust Badges */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-2xl mx-auto text-xs font-medium text-slate-300">
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

          {/* Software Compatibility Bar */}
          <div className="mt-8 pt-6 border-t border-white/[0.06]">
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



      {/* 6. PRICING & PRODUCTS SECTION (Direct Competitor Style but 10x More Premium) */}
      <section id="products" className="py-14 sm:py-24 relative overflow-hidden">
        {/* Massive Ambient Radial Spotlight Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] max-w-[95vw] h-[340px] bg-gradient-to-b from-emerald-500/25 via-teal-500/15 to-transparent blur-[110px] rounded-full pointer-events-none -z-10" />
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[400px] h-[180px] bg-cyan-400/20 blur-[85px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          
          {/* Header Container with Frosted Halo Spotlight Frame */}
          <div className="relative max-w-3xl mx-auto text-center mb-12 sm:mb-16 py-6 sm:py-8 px-4 rounded-3xl bg-gradient-to-b from-white/[0.04] via-emerald-950/20 to-transparent border border-white/[0.08] backdrop-blur-xl shadow-2xl shadow-emerald-950/40">
            {/* Top Glowing Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-400/40 bg-gradient-to-r from-emerald-500/20 via-teal-500/15 to-cyan-500/20 text-emerald-300 text-xs font-black uppercase tracking-widest mb-3 shadow-lg shadow-emerald-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              <span>PICK YOUR PACK • LIFETIME ACCESS</span>
            </div>

            {/* Glowing Headline with Underline Glow */}
            <div className="relative inline-block my-1">
              <div className="absolute -inset-x-8 -inset-y-4 bg-gradient-to-r from-emerald-500/30 via-teal-400/25 to-cyan-500/30 blur-2xl rounded-full pointer-events-none -z-10 opacity-70" />
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight">
                4 Products.{' '}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(52,211,153,0.5)]">
                    All Worth Grabbing.
                  </span>
                  <span className="absolute -bottom-1.5 left-0 right-0 h-[3.5px] bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 rounded-full shadow-[0_0_15px_rgba(52,211,153,0.9)]" />
                </span>
              </h2>
            </div>

            {/* Subtitle */}
            <p className="text-slate-300 text-xs sm:text-sm md:text-base max-w-xl mx-auto mt-4 leading-relaxed font-medium">
              Hand-picked, lifetime access, instant Google Drive delivery.{' '}
              <span className="text-emerald-400 font-bold">Buy individually or grab the complete combo to save 96%.</span>
            </p>

            {/* Micro Feature Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-[11px] font-bold text-slate-300">
              <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 border border-white/10 flex items-center gap-1.5 shadow-sm">
                <Zap className="w-3 h-3 text-emerald-400" /> Instant Drive Link
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 border border-white/10 flex items-center gap-1.5 shadow-sm">
                <Check className="w-3 h-3 text-emerald-400" /> 100% Commercial PLR
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 border border-white/10 flex items-center gap-1.5 shadow-sm">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> 4.97 Creator Rated
              </span>
            </div>
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
                      ? 'pt-8 bg-gradient-to-b from-slate-900 via-[#0d1622] to-slate-950 border-2 border-emerald-400 shadow-2xl shadow-emerald-500/20 ring-2 ring-emerald-500/20 lg:-translate-y-2' 
                      : 'bg-slate-900/60 hover:bg-slate-900/80 border border-white/[0.08] hover:border-white/20'
                  }`}
                >
                  {/* Combo Recommended Ribbon */}
                  {isCombo && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 text-slate-950 text-[10.5px] font-black uppercase tracking-wider px-4 py-1 rounded-full shadow-lg shadow-emerald-500/30 border border-white/40">
                        <Star className="w-3 h-3 fill-slate-950 text-slate-950 shrink-0" />
                        <span>MOST RECOMMENDED</span>
                      </span>
                    </div>
                  )}

                  <div>
                    {/* Top Badges */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      {isCombo ? (
                        <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                          <span>MOST VALUE</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                          {prod.badge}
                        </span>
                      )}
                      <span className="text-[10.5px] font-black text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20">
                        {prod.discount}
                      </span>
                    </div>

                    {/* Product Title & Subtitle */}
                    <h3 className="text-xl font-black text-white leading-snug">
                      {prod.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1.5 font-medium leading-relaxed">
                      {prod.subtitle}
                    </p>

                    {/* Features Checklist */}
                    <ul className="mt-5 space-y-2.5">
                      {prod.features.slice(0, 4).map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-snug">
                          <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </span>
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
                      <span className="text-xs font-semibold text-slate-400">
                        Save ₹{prod.saveAmount}
                      </span>
                    </div>

                    {/* View Details Button */}
                    <button
                      onClick={() => {
                        setLightboxZoom(100);
                        setLightboxRotation(0);
                        setModalProduct(prod);
                      }}
                      className="w-full mb-2.5 py-2.5 px-3 rounded-xl border border-white/15 hover:border-emerald-500/50 bg-white/[0.04] hover:bg-white/[0.08] text-xs font-bold text-slate-200 hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4 text-emerald-400" />
                      <span>View Details</span>
                    </button>

                    {/* Buy Now Button with Shimmer Sweep */}
                    <button
                      onClick={() => onBuyProduct(prod)}
                      className={`btn-shine-effect w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 active:scale-95 ${
                        isCombo
                          ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 shadow-lg shadow-emerald-500/30'
                          : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/10'
                      }`}
                    >
                      <Zap className="w-4 h-4 fill-slate-950 shrink-0" />
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
                  <th className="p-3.5 sm:p-4 text-emerald-400 font-black bg-emerald-500/10">Bazara.in Combo</th>
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
                className="btn-shine-effect w-full sm:w-auto bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black px-8 py-4 rounded-2xl text-base shadow-xl shadow-emerald-500/30 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
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
            <img src="/logo.png?v=2" alt="bazara.in" className="w-5 h-5 rounded-lg object-contain opacity-90" />
            <span className="font-bold text-white uppercase tracking-wider">
              bazara<span className="text-emerald-400">.in</span>
            </span>
            <span className="text-slate-500">•</span>
            <span>Instant Digital Delivery</span>
          </div>

          <p className="text-slate-400 text-[11px]">
            © {new Date().getFullYear()} Bazara.in. All Rights Reserved. Instant Digital Product Delivery Platform.
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
            className="btn-shine-effect flex-1 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/25 active:scale-95"
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

      {/* 15. "VIEW DETAILS" FULL POSTER LIGHTBOX MODAL */}
      {modalProduct && (
        <div 
          className="fixed inset-0 z-[100] flex flex-col justify-between bg-black/95 backdrop-blur-xl animate-fade-in select-none"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setModalProduct(null);
            }
          }}
        >
          {/* Top Header & Toolbar Controls */}
          <div className="w-full bg-slate-950/90 border-b border-white/10 px-4 py-3 flex items-center justify-between gap-3 z-30 shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                {modalProduct.badge || "OFFICIAL POSTER"}
              </span>
              <h3 className="text-xs sm:text-sm font-bold text-white truncate">
                {modalProduct.title}
              </h3>
            </div>

            {/* Lightbox Controls */}
            <div className="flex items-center gap-1.5 shrink-0">
              {/* Zoom Out */}
              <button
                type="button"
                onClick={() => setLightboxZoom(prev => Math.max(50, prev - 25))}
                title="Zoom Out"
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-slate-200 hover:text-white transition"
              >
                <ZoomOut className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Zoom Percentage / Reset */}
              <button
                type="button"
                onClick={() => setLightboxZoom(100)}
                title="Click to reset zoom to 100%"
                className="px-2.5 py-1 text-xs font-bold text-slate-300 hover:text-white rounded-xl bg-white/10 hover:bg-white/20 transition min-w-[52px] text-center"
              >
                {lightboxZoom}%
              </button>

              {/* Zoom In */}
              <button
                type="button"
                onClick={() => setLightboxZoom(prev => Math.min(250, prev + 25))}
                title="Zoom In"
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-slate-200 hover:text-white transition"
              >
                <ZoomIn className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Rotate 90deg */}
              <button
                type="button"
                onClick={() => setLightboxRotation(prev => (prev + 90) % 360)}
                title="Rotate 90°"
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-slate-200 hover:text-white transition"
              >
                <RotateCw className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setModalProduct(null)}
                title="Close Lightbox"
                className="p-2 ml-1 rounded-xl bg-white/10 hover:bg-rose-600 active:scale-95 text-slate-200 hover:text-white transition"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          {/* Central Image Viewport (Scrollable & Zoomable) */}
          <div 
            className="flex-1 w-full overflow-auto flex items-center justify-center p-3 sm:p-6"
            onClick={(e) => {
              if (e.target === e.currentTarget) setModalProduct(null);
            }}
          >
            <div 
              className="transition-transform duration-200 ease-out origin-center flex items-center justify-center max-w-full max-h-full"
              style={{
                transform: `scale(${lightboxZoom / 100}) rotate(${lightboxRotation}deg)`
              }}
            >
              {modalProduct.image ? (
                <img 
                  src={modalProduct.image} 
                  alt={modalProduct.title}
                  className="max-h-[72vh] w-auto max-w-[92vw] sm:max-w-xl md:max-w-2xl object-contain rounded-2xl shadow-2xl border border-white/10 select-none"
                  draggable={false}
                />
              ) : (
                <div className="text-slate-400 text-sm">No poster image available</div>
              )}
            </div>
          </div>

          {/* Bottom Sticky Action / Pricing Bar for High Conversions */}
          <div className="w-full bg-slate-950/95 border-t border-white/10 px-4 py-3 z-30 shrink-0">
            <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-emerald-400">
                  ₹{modalProduct.price}
                </span>
                <span className="text-xs text-slate-500 line-through">
                  ₹{modalProduct.originalPrice}
                </span>
                <span className="hidden sm:inline-block text-[11px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                  Save ₹{modalProduct.saveAmount} ({modalProduct.discount})
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  const p = modalProduct;
                  setModalProduct(null);
                  onBuyProduct(p);
                }}
                className="btn-shine-effect py-2.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/30 active:scale-95"
              >
                <Zap className="w-4 h-4 fill-slate-950" />
                <span>Buy Now · ₹{modalProduct.price}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
