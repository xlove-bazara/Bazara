import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  Award, 
  Users, 
  BookOpen, 
  Download, 
  ArrowRight, 
  ChevronDown, 
  ChevronUp, 
  Star, 
  FolderDown, 
  Lock, 
  HelpCircle, 
  Zap, 
  MessageCircle, 
  Check, 
  ExternalLink,
  Laptop,
  GraduationCap,
  Briefcase,
  TrendingUp,
  FileText,
  Layers,
  Gift,
  PhoneCall,
  Mail,
  Shield,
  Smartphone
} from 'lucide-react';
import PolicyModal from '../components/PolicyModal';
import { trackViewContent } from '../services/metaPixel';

export default function AiMasteryLandingPage({ 
  product, 
  onEnroll, 
  onNavigateToStore, 
  settings 
}) {
  const [selectedBookIdx, setSelectedBookIdx] = useState(0);
  const [openFaqIdx, setOpenFaqIdx] = useState(null);
  const [policyModal, setPolicyModal] = useState({ isOpen: false, tab: 'terms' });
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 44, seconds: 18 });

  // Urgency Countdown Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 2, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const defaultBundle = {
    id: "prod-ai-mastery-hindi",
    slug: "ai-mastery-hindi-ebook-bundle",
    title: "AI Mastery in Hindi (4-in-1 Complete Practical E-Book Bundle)",
    price: 99,
    original_price: 999,
    discount_percentage: 90,
    badge: "📚 4 E-Books Combo in Hindi",
    rating: 4.97,
    reviews_count: 2450,
    downloads_count: 18900,
    short_desc: "Aapki apni Hindi bhasha me 4 powerful practical e-books ka master combo: AI Mastermind, Smart Office, AI For Students aur AI Money Maker. Step-by-step guides, prompts aur tools to master AI for study, work & online earning.",
    drive_download_url: "https://drive.google.com/drive/folders/1ffXXiSYbwjXJByDDGeYGIH1HEeeqaM9i?usp=drive_link",
    bump_title: "15,000+ AI Prompts Vault (ChatGPT, Gemini, Claude & More)",
    bump_price: 49,
    bump_image: "/bump-offer-banner.jpg",
    bump_drive_url: "https://drive.google.com/drive/folders/1oasuoPFBKL5JUpBKahxeRwlKQK4n8X4P?usp=drive_link"
  };

  const activeBundle = {
    ...defaultBundle,
    ...(product || {})
  };

  // Track ViewContent event on landing/bundle page view
  useEffect(() => {
    trackViewContent(activeBundle);
  }, [activeBundle.id]);

  const booksList = [
    {
      id: "book-1",
      number: "01",
      title: "AI Mastermind",
      hindiSubtitle: "प्रॉम्प्ट इंजीनियरिंग और एआई टूल्स मास्टर गाइड",
      tag: "🧠 Prompt Engineering & Core AI",
      badgeColor: "from-teal-500 to-emerald-400",
      icon: "🧠",
      pages: "95 Pages",
      desc: "ChatGPT, DeepSeek, Claude, Midjourney aur top 50+ AI tools ka complete practical guide. Step-by-step prompt frameworks taaki pehli hi koshish me perfect result mile.",
      highlights: [
        "Generative AI & LLMs ki basic understanding bilkul aasan Hindi me",
        "ChatGPT & DeepSeek Prompting Frameworks (Role-Task-Context-Format)",
        "Midjourney & Leonardo AI se Ultra-Realistic 4K Images generate karna",
        "Top 50+ Free AI Tools Directory (Categorized by Work Type)"
      ]
    },
    {
      id: "book-2",
      number: "02",
      title: "Smart Office",
      hindiSubtitle: "ऑफिस वर्क ऑटोमेशन और 10x प्रोडक्टिविटी",
      tag: "🏢 10x Office Speed & Automation",
      badgeColor: "from-blue-500 to-indigo-400",
      icon: "🏢",
      pages: "90 Pages",
      desc: "Daily office tasks ko 10x fast karein: Complex Excel formulas, automated email drafting, client proposals, aur attractive PowerPoint decks seconds me banayein.",
      highlights: [
        "Advanced Excel Formulas (VLOOKUP, INDEX-MATCH) & Data Analysis via AI",
        "Professional Email Writing, Formal Responses & Client Proposals",
        "Gamma AI aur ChatGPT se 2 minute me Cinematic Presentation Decks",
        "ATS-Friendly High-Converting Resume & Job Application Generator"
      ]
    },
    {
      id: "book-3",
      number: "03",
      title: "AI For Students",
      hindiSubtitle: "स्मार्ट स्टडी, असाइनमेंट्स और एग्जाम प्रिपरेशन",
      tag: "🎓 Study Smart & Score High",
      badgeColor: "from-amber-500 to-orange-400",
      icon: "🎓",
      pages: "100 Pages",
      desc: "School aur College students ke liye ultimate study companion. Fast assignment solving, complex chapters ka 1-page summary, aur mock test question generator.",
      highlights: [
        "100-Page ke lambe Chapters ko 1-Page Visual Revision Notes me badalna",
        "Assignments aur College Project Reports taiyar karna with proper citations",
        "Maths & Programming doubts ko step-by-step logic ke sath solve karna",
        "Exam preparation ke liye AI Flashcards aur Quiz Questions generate karna"
      ]
    },
    {
      id: "book-4",
      number: "04",
      title: "AI Money Maker",
      hindiSubtitle: "फ्रीलांसिंग, कंटेंट क्रिएशन और ऑनलाइन इनकम",
      tag: "💰 Freelance & Online Income",
      badgeColor: "from-emerald-500 to-teal-300",
      icon: "💰",
      pages: "95 Pages",
      desc: "Practical online earning blueprints: Freelance client services, Faceless YouTube/Instagram Reels scriptwriting, aur digital products create karke sell karna.",
      highlights: [
        "5 High-Income AI Freelance Skills jinse aap client work shuru kar sakte hain",
        "Faceless Viral Reels & YouTube Shorts Content Creation Machine",
        "Digital E-Books, Canva Templates aur AI Art bech kar passive income",
        "National aur International Clients ko pitch aur close karne ka blueprint"
      ]
    }
  ];

  const targetAudiences = [
    {
      icon: GraduationCap,
      title: "School & College Students",
      desc: "Apne assignments fast banayein, exam revision notes taiyar karein aur complex concepts ko aasan Hindi me samjhein.",
      color: "emerald"
    },
    {
      icon: Briefcase,
      title: "Job Seekers & Office Employees",
      desc: "Excel formulas, professional emails, presentations aur ATS-friendly resume banayein aur office me 10x fast banein.",
      color: "indigo"
    },
    {
      icon: TrendingUp,
      title: "Content Creators & Freelancers",
      desc: "Faceless reels scripts, viral ideas, copy-paste prompts aur digital products sell karke monthly online income generate karein.",
      color: "amber"
    },
    {
      icon: BookOpen,
      title: "Teachers, Trainers & Business Owners",
      desc: "Lesson plans banayein, training modules taiyar karein aur apne business ke customer support & marketing ko automate karein.",
      color: "teal"
    }
  ];

  const bonuses = [
    {
      id: "b1",
      val: "₹1,499",
      title: "500+ Copy-Paste Viral Prompts Bank",
      desc: "Coding, Copywriting, Marketing, SEO aur Daily Productivity ke liye pre-written tested prompts.",
      tag: "FREE BONUS 1"
    },
    {
      id: "b2",
      val: "₹1,499",
      title: "Top 100+ Free AI Tools Mega Directory",
      desc: "Best AI tools categorized by category (Video, Audio, Image, Text, Coding, Automation).",
      tag: "FREE BONUS 2"
    },
    {
      id: "b3",
      val: "₹1,999",
      title: "Lifetime G-Drive Updates & New Chapters",
      desc: "Future me jab bhi naye AI tools aayenge, naye PDF updates bina kisi extra charge ke Drive me milenge.",
      tag: "FREE BONUS 3"
    }
  ];

  const faqs = [
    {
      q: "Payment complete hone ke baad e-books kaise aur kahan milengi?",
      a: "Payment confirm hote hi agle page par 1-Click Master Google Drive link unlock ho jayegi jahan se aap charo books turant padh ya download kar sakte hain. Sath hi aapke registered WhatsApp number aur Email par bhi direct download link deliver ho jayegi."
    },
    {
      q: "Kya ye PDF e-books mobile phone aur laptop dono par open hongi?",
      a: "Haan, 100%! Saari e-books high-resolution PDF format me hain jo kisi bhi Android phone, iPhone, iPad, Tablet ya Laptop/PC me asaani se open hoti hain. Aap offline download karke lifetime access rakh sakte hain."
    },
    {
      q: "Kya is bundle ke liye pehle se coding ya computer expertise aani chahiye?",
      a: "Bilkul nahi! Ye 4 e-books khas tour par beginners ke liye simple Hindi aur aasan Hinglish me likhi gayi hain jisme screenshots aur step-by-step instructions shamil hain."
    },
    {
      q: "Order Bump Offer me kya milega?",
      a: "Agar aap checkout karte waqt +₹49 ka Special Order Bump tick karte hain, toh aapko alag se '5,000+ High-Retention Viral ChatGPT Prompts Bank + 100+ Editable Canva AI Templates' ka exclusive folder deliver kiya jayega."
    },
    {
      q: "Kya mujhe future me updates ke liye extra paise dene honge?",
      a: "Nahi, ek baar ₹99 pay karne par aapko Lifetime Access milta hai. Future me add hone wale naye AI chapters aapke Google Drive folder me bina kisi extra fees ke add ho jayenge."
    },
    {
      q: "Agar download karte waqt koi help chahiye ho toh support kahan milega?",
      a: "Aapko bazara.in ki dedicated WhatsApp customer support helpline milti hai jahan hamari team turant aapki query solve karti hai."
    }
  ];

  const reviews = [
    {
      name: "Rahul Verma",
      role: "B.Tech Final Year Student",
      city: "Patna, Bihar",
      rating: 5,
      comment: "₹99 me itna solid practical content maine pehle kabhi nahi dekha! 'AI For Students' aur 'AI Mastermind' padhkar mere exam revision aur project reports ka sara time bacha gaya. Highly recommended!"
    },
    {
      name: "Pooja Sharma",
      role: "Corporate Executive",
      city: "Delhi NCR",
      rating: 5,
      comment: "'Smart Office' book ki Excel prompting aur automated email templates kamaal hain. Jo Excel report banane me 2 ghante lagte the, wo ab 5 minute me taiyar ho jati hai!"
    },
    {
      name: "Aman Shaikh",
      role: "Freelance Content Creator",
      city: "Mumbai, Maharashtra",
      rating: 5,
      comment: "'AI Money Maker' padhke maine apna pehla faceless Instagram theme page shuru kiya aur ChatGPT prompts use karke 10 din me 50+ viral scripts ready kar li. Bump offer ke prompts bhi super helpful hain."
    },
    {
      name: "Vikram Rathore",
      role: "Digital Marketer",
      city: "Jaipur, Rajasthan",
      rating: 5,
      comment: "Pure bundle me zero bakwas aur 100% practical steps hain. Hindi me hone ki wajah se har tool ka use turant samajh aa gaya. Instant Google Drive delivery was butter smooth!"
    }
  ];

  return (
    <div className="min-h-screen pb-24 md:pb-12 bg-transparent text-slate-100 selection:bg-emerald-500/30">
      
      {/* 1. Urgency Countdown Top Bar */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 px-4 py-2 text-center text-xs font-bold text-white shadow-md flex items-center justify-center space-x-2">
        <span className="inline-block w-2 h-2 rounded-full bg-amber-300 animate-ping" />
        <span>⚡ SPECIAL LAUNCH OFFER: 4 E-BOOKS COMBO AT FLAT 90% OFF</span>
        <span className="hidden sm:inline text-emerald-100">• Offer ends in</span>
        <span className="px-2 py-0.5 rounded bg-black/30 font-mono text-amber-200">
          {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
        </span>
      </div>

      {/* 2. Navigation Header */}
      <header className="sticky top-0 z-40 px-4 md:px-8 py-3.5 backdrop-blur-2xl bg-[#091017]/85 border-b border-white/[0.08]">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center space-x-2.5">
            <img
              src="/logo.png?v=2"
              alt="bazara.in Logo"
              className="w-8 h-8 rounded-xl object-contain shadow-lg shadow-emerald-500/20"
            />
            <div className="flex items-baseline space-x-1">
              <span className="font-extrabold text-xl tracking-tight text-white uppercase">
                bazara
              </span>
              <span className="text-xs font-bold text-emerald-400">.in</span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold uppercase tracking-widest text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                AI E-Books Hub
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-6 text-xs font-semibold text-slate-300">
            <a href="#books-breakdown" className="hover:text-emerald-400 transition-colors">4 Books Inside</a>
            <a href="#who-is-this-for" className="hover:text-emerald-400 transition-colors">Target Audience</a>
            <a href="#free-bonuses" className="hover:text-emerald-400 transition-colors">Free Bonuses</a>
            <a href="#reviews" className="hover:text-emerald-400 transition-colors">Verified Reviews</a>
            <a href="#faq" className="hover:text-emerald-400 transition-colors">FAQ</a>
            <button
              onClick={() => setPolicyModal({ isOpen: true, tab: 'terms' })}
              className="text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            >
              Policies
            </button>
          </nav>

          {/* Top CTA */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onEnroll(activeBundle)}
              className="px-4 md:px-6 py-2 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-400 hover:opacity-95 text-slate-950 shadow-lg shadow-emerald-500/30 active:scale-95 transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <span>Get 4 Books ₹{activeBundle.price}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* 3. HERO SECTION */}
      <section className="relative pt-8 pb-14 px-4 md:px-8 overflow-hidden">
        {/* Luxury Background Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 md:w-[700px] h-96 bg-emerald-500/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-0 w-80 h-80 bg-indigo-600/15 rounded-full blur-[130px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-5 relative z-10">
          
          {/* Eyebrow Trust Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black shadow-sm">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>🔥 4-in-1 Complete Practical AI E-Book Combo (Simple Hindi)</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-snug md:leading-tight">
            AI Mastery in Hindi: 4 Powerful E-Books to Master <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400">ChatGPT, Office Automation & Online Earning</span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm md:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Apni Hindi bhasha me seekhein step-by-step bina kisi coding headache ke. Students, Office Professionals, Teachers aur Creators ke liye India ka #1 AI Action Guide Bundle.
          </p>

          {/* Social Proof Strip */}
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 text-xs text-slate-300 pt-1">
            <div className="flex items-center space-x-1.5">
              <div className="flex text-amber-400 text-sm">★★★★★</div>
              <span className="font-bold text-white">{activeBundle.rating || 4.97}/5</span>
              <span className="text-slate-400">({activeBundle.reviews_count || 2450}+ Verified Readers)</span>
            </div>
            <span className="hidden sm:inline text-slate-600">•</span>
            <div className="flex items-center space-x-1.5">
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-bold text-white">{activeBundle.downloads_count || 18900}+ Copies Delivered</span>
            </div>
            <span className="hidden sm:inline text-slate-600">•</span>
            <div className="flex items-center space-x-1.5">
              <FolderDown className="w-3.5 h-3.5 text-indigo-400" />
              <span className="font-semibold text-white">Instant G-Drive Link</span>
            </div>
          </div>

          {/* Main 3D Hero Banner Showcase */}
          <div className="pt-4 max-w-3xl mx-auto">
            <div className="relative rounded-3xl overflow-hidden border border-white/20 shadow-2xl shadow-emerald-500/15 group bg-slate-950 aspect-video">
              <img
                src="/ai-mastery-banner.jpg"
                alt="AI Mastery 4-in-1 E-Book Bundle"
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
              />
              <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-[10px] sm:text-[11px] font-black text-amber-300 border border-white/15 flex items-center space-x-1.5 shadow-lg">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>4 FULL E-BOOKS • 380+ PAGES</span>
              </div>
            </div>

            {/* Feature Badges below the banner */}
            <div className="mt-3 flex items-center justify-between text-[11px] sm:text-xs text-slate-300 px-1">
              <span className="px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md font-semibold border border-white/10 text-slate-300 flex items-center space-x-1.5 shadow-sm">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Instant 1-Second Access</span>
              </span>
              <span className="px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold backdrop-blur-md flex items-center space-x-1.5 shadow-sm">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Lifetime Google Drive Access</span>
              </span>
            </div>
          </div>

          {/* 4 Books 3D Interactive Hero Showcase Cards */}
          <div className="pt-4 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-3xl mx-auto text-left">
            {booksList.map((b, idx) => (
              <div
                key={b.id}
                onClick={() => setSelectedBookIdx(idx)}
                className={`p-3.5 rounded-2xl border transition-all duration-300 cursor-pointer relative overflow-hidden group ${
                  selectedBookIdx === idx 
                    ? 'bg-gradient-to-b from-[#192233] to-[#111624] border-emerald-500 shadow-xl shadow-emerald-500/10 scale-[1.02]' 
                    : 'bg-[#0f1422]/80 border-white/10 hover:border-white/20 hover:scale-[1.01]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xl">{b.icon}</span>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-white/[0.06] text-emerald-400 border border-white/10">
                    BOOK {b.number}
                  </span>
                </div>
                <h4 className="text-xs font-black text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
                  {b.title}
                </h4>
                <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-tight">
                  {b.hindiSubtitle}
                </p>
                <div className="mt-2.5 pt-2 border-t border-white/[0.06] flex items-center justify-between text-[10px] text-slate-400">
                  <span>{b.pages}</span>
                  <span className="text-emerald-400 font-bold">PDF E-Book</span>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing & Hero CTA Box */}
          <div className="pt-4 max-w-lg mx-auto space-y-3">
            <div className="p-5 rounded-3xl bg-[#131724] border border-white/10 shadow-2xl space-y-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    Exclusive Digital Bundle Price
                  </span>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl sm:text-4xl font-black text-emerald-400">₹{activeBundle.price}</span>
                    <span className="text-sm font-semibold text-slate-400 line-through">₹{activeBundle.original_price}</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse">
                      SAVE {activeBundle.discount_percentage}%
                    </span>
                  </div>
                </div>
                <div className="text-right text-[11px]">
                  <span className="px-2 py-1 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold block mb-1">
                    ⚡ 90% OFF
                  </span>
                  <span className="text-slate-400 text-[10px]">All 4 Books Included</span>
                </div>
              </div>

              {/* Big Action CTA */}
              <button
                onClick={() => onEnroll(activeBundle)}
                className="w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider text-slate-950 bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-400 shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 active:scale-[0.98] transition-all flex items-center justify-center space-x-2 cursor-pointer btn-shine-effect"
              >
                <Zap className="w-4 h-4 fill-slate-950" />
                <span>GET 4-IN-1 AI MASTERY BUNDLE ₹{activeBundle.price} 🚀</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Guarantees */}
              <div className="flex items-center justify-center space-x-3 sm:space-x-4 text-[11px] text-slate-400 pt-1">
                <span className="flex items-center space-x-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Instant G-Drive</span>
                </span>
                <span className="flex items-center space-x-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>WhatsApp Delivery</span>
                </span>
                <span className="flex items-center space-x-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Lifetime Access</span>
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. KEY METRICS STRIP */}
      <section className="border-y border-white/[0.08] bg-[#0c0e18]/80 py-6 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <BookOpen className="w-5 h-5 text-emerald-400 mx-auto mb-1.5" />
            <span className="text-base font-black text-white block">4 Full E-Books</span>
            <span className="text-[11px] text-slate-400">Complete Master Bundle</span>
          </div>
          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <Layers className="w-5 h-5 text-indigo-400 mx-auto mb-1.5" />
            <span className="text-base font-black text-white block">380+ Pages</span>
            <span className="text-[11px] text-slate-400">Full Color Illustrated PDF</span>
          </div>
          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <Laptop className="w-5 h-5 text-amber-400 mx-auto mb-1.5" />
            <span className="text-base font-black text-white block">50+ AI Tools</span>
            <span className="text-[11px] text-slate-400">Practical Step-by-Step</span>
          </div>
          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <Smartphone className="w-5 h-5 text-teal-400 mx-auto mb-1.5" />
            <span className="text-base font-black text-white block">100% Mobile Ready</span>
            <span className="text-[11px] text-slate-400">Read on Phone & PC</span>
          </div>
        </div>
      </section>

      {/* 5. DETAILED 4-BOOK BREAKDOWN (BENTO STYLE) */}
      <section id="books-breakdown" className="py-14 px-4 md:px-8 max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-emerald-400">
            What's Inside The Master Combo
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Explore All 4 Practical AI E-Books
          </h2>
          <p className="text-xs md:text-sm text-slate-400 max-w-xl mx-auto">
            Har book ko practical tarike se simple Hindi bhasha me design kiya gaya hai jisse aap turant implement kar sakein.
          </p>
        </div>

        {/* 4 Books Detailed Cards */}
        <div className="space-y-4">
          {booksList.map((book, idx) => (
            <div
              key={book.id}
              className="p-5 md:p-6 rounded-3xl bg-[#131724] border border-white/[0.08] hover:border-emerald-500/30 transition-all shadow-xl space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.06] pb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-xl shrink-0">
                    {book.icon}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        BOOK {book.number}
                      </span>
                      <h3 className="text-base font-black text-white">
                        {book.title}
                      </h3>
                    </div>
                    <span className="text-xs text-slate-400 font-medium">
                      {book.hindiSubtitle}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 self-start sm:self-auto">
                  <span className="px-2.5 py-1 rounded-xl bg-white/[0.05] border border-white/[0.08] text-[11px] font-bold text-slate-300">
                    {book.pages}
                  </span>
                  <span className="px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-bold text-emerald-400">
                    HD Color PDF
                  </span>
                </div>
              </div>

              <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                {book.desc}
              </p>

              <div className="p-3.5 rounded-2xl bg-[#090d16] border border-white/[0.06] space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block">
                  Key Topics & Practical Workflows Covered:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                  {book.highlights.map((h, hIdx) => (
                    <div key={hIdx} className="flex items-start space-x-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5 stroke-[3]" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. WHO IS THIS FOR SECTION */}
      <section id="who-is-this-for" className="py-12 px-4 md:px-8 max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-indigo-400">
            Target Audience
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Ye 4-in-1 Bundle Kiske Liye Hai?
          </h2>
          <p className="text-xs md:text-sm text-slate-400 max-w-xl mx-auto">
            Chahe aap student ho, job karte ho ya apna kaam karte ho — ye bundle aapka 80% daily time bachayega.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {targetAudiences.map((aud, aIdx) => {
            const Icon = aud.icon;
            return (
              <div
                key={aIdx}
                className="p-5 rounded-3xl bg-[#131724] border border-white/[0.08] space-y-3 hover:border-emerald-500/30 transition-all shadow-lg"
              >
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-black text-white">
                  {aud.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {aud.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. FREE MEGA BONUSES (WORTH ₹4,999) */}
      <section id="free-bonuses" className="py-12 px-4 md:px-8 max-w-4xl mx-auto space-y-6">
        <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-[#162235] via-[#131724] to-[#0c0f1d] border-2 border-emerald-500/40 shadow-2xl shadow-emerald-500/10 space-y-6">
          <div className="text-center space-y-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 inline-block shadow-md">
              🎁 FREE MEGA BONUSES INCLUDED (VALUE ₹4,999)
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Aaj Enroll Karne Par Ye 3 Bonuses Bilkul FREE Milenge
            </h2>
            <p className="text-xs md:text-sm text-slate-300 max-w-lg mx-auto">
              Main 4 E-books ke sath aapko niche diye gaye 3 high-value bonus assets bina kisi extra charge ke unlock honge:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {bonuses.map((b) => (
              <div
                key={b.id}
                className="p-4 rounded-2xl bg-[#090d16]/90 border border-white/10 space-y-2 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                      {b.tag}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400 line-through">
                      {b.val}
                    </span>
                  </div>
                  <h4 className="text-xs font-black text-white">
                    {b.title}
                  </h4>
                  <p className="text-[11px] text-slate-300 leading-tight">
                    {b.desc}
                  </p>
                </div>
                <div className="pt-2 border-t border-white/[0.06] text-right">
                  <span className="text-xs font-black text-emerald-400">FREE With Bundle ✓</span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => onEnroll(activeBundle)}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/30 active:scale-95 transition-all cursor-pointer inline-flex items-center justify-center space-x-2"
            >
              <span>Unlock 4 Books + 3 Free Bonuses @ ₹{activeBundle.price}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 8. SPECIAL ORDER BUMP PREVIEW */}
      <section className="py-6 px-4 md:px-8 max-w-4xl mx-auto">
        <div className="p-5 md:p-6 rounded-3xl bg-gradient-to-br from-[#182333] via-[#131724] to-[#0d101d] border border-emerald-500/30 shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.08] pb-3">
            <div className="flex items-center space-x-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              <span className="text-[11px] font-black uppercase tracking-wider text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20">
                EXCLUSIVE CHECKOUT ORDER BUMP
              </span>
            </div>
            <span className="text-xs font-black px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 self-start sm:self-auto">
              Optional Add-on (+₹49 ONLY)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-6 rounded-2xl overflow-hidden border border-white/10 shadow-lg group">
              <img
                src="/bump-offer-banner.jpg"
                alt="15,000+ AI Prompts Vault"
                className="w-full aspect-[16/9] object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="md:col-span-6 space-y-2">
              <h3 className="text-base font-black text-white leading-snug">
                15,000+ AI Prompts Vault (ChatGPT, Gemini, Claude & More)
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                3,000+ ChatGPT, 2,000+ Gemini, 2,500+ AI Image Prompts, Marketing, Ads, SEO & Business Growth Prompts worth ₹999 — Checkout par sirf <strong>+₹{activeBundle.bump_price || 1}</strong> me 1-click me add kar sakte hain!
              </p>
              <div className="pt-2 flex items-center space-x-2 text-[11px] text-emerald-400 font-bold">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Available inside 1-Click Fast Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. VERIFIED REVIEWS */}
      <section id="reviews" className="py-12 px-4 md:px-8 max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-emerald-400">
            Real Feedback
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Readers & Students Kya Kehte Hain
          </h2>
          <p className="text-xs md:text-sm text-slate-400 max-w-xl mx-auto">
            18,900+ se zyada readers ne is AI bundle ko padhkar apne daily work aur study me implement kiya hai.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {reviews.map((rev, rIdx) => (
            <div
              key={rIdx}
              className="p-5 rounded-3xl bg-[#131724] border border-white/[0.08] space-y-3 shadow-lg flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex text-amber-400 text-xs">
                  {'★'.repeat(rev.rating)}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="flex items-center space-x-3 pt-3 border-t border-white/[0.06]">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-xs font-black text-emerald-400">
                  {rev.name[0]}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white leading-tight">
                    {rev.name}
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    {rev.role} • {rev.city}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 10. FAQ SECTION */}
      <section id="faq" className="py-12 px-4 md:px-8 max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-indigo-400">
            Frequently Asked Questions
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Aapke Sabhi Sawalon Ke Jawab
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, fIdx) => {
            const isOpen = openFaqIdx === fIdx;
            return (
              <div
                key={fIdx}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  isOpen 
                    ? 'bg-[#131724] border-emerald-500/40' 
                    : 'bg-[#0e121e] border-white/[0.08] hover:border-white/20'
                }`}
              >
                <button
                  onClick={() => setOpenFaqIdx(isOpen ? null : fIdx)}
                  className="w-full p-4 md:p-5 text-left flex items-center justify-between space-x-3 cursor-pointer"
                >
                  <span className="text-xs md:text-sm font-bold text-white">
                    {faq.q}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4 md:px-5 pb-4 text-xs md:text-sm text-slate-300 leading-relaxed border-t border-white/[0.06] pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 11. FINAL BOTTOM CTA STRIP */}
      <section className="py-12 px-4 md:px-8 max-w-4xl mx-auto">
        <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-[#131724] to-[#0c0f1d] border border-emerald-500/30 text-center space-y-4 shadow-2xl">
          <h3 className="text-xl md:text-2xl font-black text-white">
            Ready to Master AI with India's #1 Hindi E-Book Combo?
          </h3>
          <p className="text-xs md:text-sm text-slate-300 max-w-lg mx-auto">
            Get instant Google Drive access to all 4 E-Books + 3 Free Bonuses for just ₹{activeBundle.price} (Flat 90% Launch Discount).
          </p>
          <button
            onClick={() => onEnroll(activeBundle)}
            className="w-full sm:w-auto px-10 py-4 rounded-full font-black text-sm uppercase tracking-wider text-slate-950 bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-400 shadow-xl shadow-emerald-500/40 hover:shadow-emerald-500/60 active:scale-95 transition-all cursor-pointer inline-flex items-center justify-center space-x-2 btn-shine-effect"
          >
            <Zap className="w-4 h-4 fill-slate-950" />
            <span>PAY ₹{activeBundle.price} & GET INSTANT ACCESS 🚀</span>
          </button>
        </div>
      </section>

      {/* 12. FOOTER */}
      <footer className="border-t border-white/[0.08] py-8 px-4 text-center text-xs text-slate-500 space-y-3">
        <div className="flex items-center justify-center space-x-2">
          <img src="/logo.png?v=2" alt="bazara.in" className="w-6 h-6 rounded-lg object-contain opacity-80" />
          <span className="font-bold text-white uppercase">bazara.in</span>
        </div>
        <p>© {new Date().getFullYear()} bazara.in. All Rights Reserved. Instant Digital Product Delivery Platform.</p>
        <div className="flex items-center justify-center space-x-4 text-[11px] text-slate-400">
          <button onClick={() => setPolicyModal({ isOpen: true, tab: 'terms' })} className="hover:text-white cursor-pointer">Terms</button>
          <span>•</span>
          <button onClick={() => setPolicyModal({ isOpen: true, tab: 'privacy' })} className="hover:text-white cursor-pointer">Privacy</button>
          <span>•</span>
          <button onClick={() => setPolicyModal({ isOpen: true, tab: 'refund' })} className="hover:text-white cursor-pointer">Refund Policy</button>
          <span>•</span>
          <button onClick={() => setPolicyModal({ isOpen: true, tab: 'contact' })} className="hover:text-white cursor-pointer">Contact Us</button>
        </div>
      </footer>

      {/* 13. STICKY MOBILE BOTTOM CTA DOCK */}
      <div className="fixed bottom-0 inset-x-0 z-40 md:hidden p-3 bg-[#091017]/95 backdrop-blur-2xl border-t border-white/10 shadow-2xl">
        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">4 E-Books Combo</span>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-xl font-black text-emerald-400">₹{activeBundle.price}</span>
              <span className="text-xs text-slate-400 line-through">₹{activeBundle.original_price}</span>
            </div>
          </div>

          <button
            onClick={() => onEnroll(activeBundle)}
            className="flex-1 py-3 px-4 rounded-xl font-black text-xs uppercase tracking-wider text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 shadow-lg shadow-emerald-500/30 active:scale-95 transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
          >
            <span>GET 4 BOOKS NOW</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Policy Modal */}
      <PolicyModal
        isOpen={policyModal.isOpen}
        onClose={() => setPolicyModal({ isOpen: false, tab: 'terms' })}
        initialTab={policyModal.tab}
      />

    </div>
  );
}
