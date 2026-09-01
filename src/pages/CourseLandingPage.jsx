import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  Play, 
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
  Globe, 
  Zap, 
  MessageCircle, 
  Check, 
  ExternalLink,
  Laptop,
  GraduationCap
} from 'lucide-react';
import VideoModal from '../components/VideoModal';

export default function CourseLandingPage({ 
  course, 
  onEnroll, 
  onNavigateToStore, 
  settings 
}) {
  const [openModuleIdx, setOpenModuleIdx] = useState(0);
  const [openFaqIdx, setOpenFaqIdx] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 48, seconds: 35 });

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

  // Safe fallback if course is not yet loaded or customized
  const activeCourse = course || {
    id: 'prod-course-ai',
    title: 'AI Video Editing & Content Creation Masterclass',
    price: 499,
    original_price: 3499,
    discount_percentage: 86,
    badge: '🎓 Verified Masterclass',
    rating: 4.95,
    reviews_count: 1420,
    downloads_count: 11200,
    cover_image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&auto=format&fit=crop&q=80',
    short_desc: 'Master step-by-step professional video editing with modern AI workflows, Premiere Pro & CapCut. Learn high-retention storytelling, sound design, and how to monetize your skills.',
    course_details: {
      instructor: 'Vikram Sharma (Ex-Agency Creative Director & Digital Mentor)',
      duration: '6.5+ Hours of HD Video Lessons',
      modules_count: '5 In-Depth Modules (28 Lessons)',
      level: 'Beginner to Advanced (No prior experience needed)',
      certificate: 'Official bazara.in Verified Completion Certificate'
    }
  };

  const curriculum = activeCourse.course_details?.curriculum || [
    {
      title: 'Module 1: Foundations of High-Retention Video & Visual Hooks',
      duration: '45 mins',
      lessons: [
        'Psychology of 3-Second Retention: How Algorithms Rank Content',
        'Frame Composition, Aspect Ratios & Lighting Fundamentals',
        'CapCut & Premiere Pro Quick Setup for Speed Editing'
      ]
    },
    {
      title: 'Module 2: AI Workflows & Automated Content Production',
      duration: '1 hr 20 mins',
      lessons: [
        'AI Scriptwriting & Storyboarding with Custom Prompt Frameworks',
        'AI Voiceover Generation (ElevenLabs & Studio-Grade Free Tools)',
        'Automated Kinetic Subtitles, Emoji Styling & Motion Graphics'
      ]
    },
    {
      title: 'Module 3: Cinematic Pacing, B-Roll & Advanced Sound Design',
      duration: '1 hr 10 mins',
      lessons: [
        'Cinematic Transitions, Speed Ramping & Whip Pans',
        'Sound Design Mastery: Layering Whooshes, Risers, Sub-bass & Impacts',
        'Color Grading LUTs & Exporting in 4K Crystal-Clear Bitrate'
      ]
    },
    {
      title: 'Module 4: Client Acquisition & Career Monetization Blueprint',
      duration: '1 hr 35 mins',
      lessons: [
        'Building a High-Converting Portfolio Without Past Clients',
        'Cold DM & Email Pitch Templates That Win High-Ticket Retainers',
        'Pricing Your Services: Freelancing, Retainers & Agency Scaling'
      ]
    },
    {
      title: 'Module 5: Bonus Masterclasses & Action Toolkits',
      duration: '1 hr 00 mins',
      lessons: [
        'Case Study: Dissecting a 5-Million-View Viral Video',
        'Downloadable SFX Library, Premiere Presets & LUTs Pack',
        'Live Q&A Recording & Certification Assessment'
      ]
    }
  ];

  const courseFaqs = [
    {
      q: 'Payment complete hone ke baad course access kaise aur kahan milega?',
      a: 'Payment confirm hote hi turant agle page par 1-Click Master Google Drive link unlock ho jayegi. Sath hi aapke registered WhatsApp number aur Email par bhi direct watch and download link instantly send ki jayegi.'
    },
    {
      q: 'Kya is course ke liye pehle se koi video editing ya technical knowledge chahiye?',
      a: 'Bilkul nahi! Ye masterclass zero se start hoti hai. Chahe aap absolute beginner ho ya already basic video banate ho, step-by-step screen recordings ke sath sab kuch practically sikhaya gaya hai.'
    },
    {
      q: 'Kya main mobile phone (Android / iPhone) par videos dekh aur sikh sakta hoon?',
      a: 'Haan, 100%! Pura course mobile-friendly hai. Aap apne smartphone, tablet, ya laptop/PC kisi bhi device par stream kar sakte ho ya offline download karke lifetime dekh sakte ho.'
    },
    {
      q: 'Course ki validity kitni hai aur kya future updates free milenge?',
      a: 'Aapko Lifetime Access milta hai. Jab bhi hum naye modules, AI tools ya editing tricks add karenge, aapko automatically updated folders bina kisi extra charge ke milenge.'
    },
    {
      q: 'Kya mujhe Certificate of Completion milega?',
      a: 'Haan, saare modules complete karne ke baad aapko bazara.in Verified Digital Certificate provide kiya jayega jise aap apne LinkedIn profile, resume ya freelance portfolio me add kar sakte hain.'
    },
    {
      q: 'Agar course dekhte waqt koi doubt ya sawal ho toh kaise solve hoga?',
      a: 'Aapko bazara.in ke Exclusive Telegram Mastermind Community ka access milta hai jahan mentor aur top students active rehte hain. Sath hi direct WhatsApp support bhi available hai.'
    }
  ];

  const reviews = [
    {
      name: 'Rohan Deshmukh',
      role: 'Freelance Video Editor',
      city: 'Pune',
      avatar: 'R',
      rating: 5,
      comment: 'Maine YouTube par 6 mahine waste kiye the. Is single course ne CapCut aur AI workflow ko itna simple bana diya ki pehle hi hafte me 2 US clients ke video projects close kar liye!'
    },
    {
      name: 'Pooja Verma',
      role: 'Digital Content Creator',
      city: 'Delhi',
      avatar: 'P',
      rating: 5,
      comment: 'Sound design aur 3-second hook module is gold! Meri engagement 3x badh gayi hai. Zero theory, pure practical implementation. Highly recommended to everyone.'
    },
    {
      name: 'Aditya Mehta',
      role: 'Agency Founder',
      city: 'Mumbai',
      avatar: 'A',
      rating: 5,
      comment: 'The instructor explains concepts in clear Hinglish with exact step-by-step screen shares. The downloadable sound effects and LUTs alone are worth 5x the price.'
    }
  ];

  return (
    <div className="min-h-screen pb-20 md:pb-8 bg-[#08090E] text-slate-100 selection:bg-emerald-500/30">
      {/* 1. Urgency Countdown Top Bar */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 px-4 py-2 text-center text-xs font-bold text-white shadow-md flex items-center justify-center space-x-2">
        <span className="inline-block w-2 h-2 rounded-full bg-amber-300 animate-ping" />
        <span>⚡ SPECIAL BATCH ADMISSIONS OPEN: FLAT {activeCourse.discount_percentage}% OFF</span>
        <span className="hidden sm:inline text-emerald-100">• Offer ends in</span>
        <span className="px-2 py-0.5 rounded bg-black/30 font-mono text-amber-200">
          {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
        </span>
      </div>

      {/* 2. Navigation Header */}
      <header className="sticky top-0 z-40 px-4 md:px-8 py-3 backdrop-blur-2xl bg-[#08090E]/85 border-b border-white/[0.08]">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center font-black text-slate-950 text-sm shadow-md shadow-emerald-500/30">
              b
            </div>
            <div className="flex items-baseline space-x-1">
              <span className="font-extrabold text-xl tracking-tight text-white uppercase">
                bazara
              </span>
              <span className="text-xs font-bold text-emerald-400">.in</span>
              <span className="hidden md:inline-block ml-2 text-[10px] font-semibold uppercase tracking-widest text-slate-400 bg-white/[0.06] px-2 py-0.5 rounded-full border border-white/10">
                Academy
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-6 text-xs font-semibold text-slate-300">
            <a href="#curriculum" className="hover:text-emerald-400 transition-colors">Curriculum</a>
            <a href="#about-bazara" className="hover:text-emerald-400 transition-colors">About bazara.in</a>
            <a href="#instructor" className="hover:text-emerald-400 transition-colors">Mentor</a>
            <a href="#reviews" className="hover:text-emerald-400 transition-colors">Reviews</a>
            <a href="#faq" className="hover:text-emerald-400 transition-colors">FAQ</a>
            <button
              onClick={onNavigateToStore}
              className="px-3 py-1.5 rounded-full text-xs font-bold text-slate-300 hover:text-white bg-white/[0.05] hover:bg-white/10 border border-white/10 transition-all flex items-center space-x-1"
            >
              <span>Explore Store / All Bundles</span>
              <ExternalLink className="w-3 h-3 text-emerald-400" />
            </button>
          </nav>

          {/* CTA Action */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onNavigateToStore}
              className="md:hidden px-3 py-1.5 rounded-full text-[11px] font-bold text-slate-300 bg-white/[0.06] border border-white/10"
            >
              Store
            </button>
            <button
              onClick={() => onEnroll(activeCourse)}
              className="px-4 md:px-6 py-2 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/25 active:scale-95 transition-all flex items-center space-x-1.5"
            >
              <span>Enroll Now ₹{activeCourse.price}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* 3. HERO SECTION */}
      <section className="relative pt-8 pb-14 px-4 md:px-8 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 md:w-[650px] h-96 bg-emerald-500/10 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute top-1/3 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-5 relative z-10">
          {/* Trust Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>100% Practical Course • Complete Video Masterclass</span>
          </div>

          {/* Headline */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight md:leading-tight">
            {activeCourse.title}
          </h1>

          {/* Subtitle */}
          <p className="text-sm md:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {activeCourse.short_desc}
          </p>

          {/* Social Proof Strip */}
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 text-xs text-slate-300 pt-1">
            <div className="flex items-center space-x-1.5">
              <div className="flex text-amber-400 text-sm">★★★★★</div>
              <span className="font-bold text-white">{activeCourse.rating || 4.95}/5</span>
              <span className="text-slate-400">({activeCourse.reviews_count || 1420}+ Ratings)</span>
            </div>
            <span className="hidden sm:inline text-slate-600">•</span>
            <div className="flex items-center space-x-1.5">
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-bold text-white">{activeCourse.downloads_count || 11200}+ Enrolled Learners</span>
            </div>
            <span className="hidden sm:inline text-slate-600">•</span>
            <div className="flex items-center space-x-1.5">
              <Award className="w-3.5 h-3.5 text-indigo-400" />
              <span className="font-semibold text-white">Verified Certificate</span>
            </div>
          </div>

          {/* Video Preview Card / Cover */}
          <div className="pt-4 max-w-3xl mx-auto">
            <div className="relative rounded-3xl overflow-hidden border border-white/15 shadow-2xl shadow-emerald-500/10 group bg-slate-900 aspect-video md:aspect-[21/9]">
              <img
                src={activeCourse.cover_image}
                alt={activeCourse.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#08090E] via-black/40 to-transparent" />

              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                <button
                  onClick={() => setActiveVideo({
                    title: activeCourse.title,
                    url: 'https://assets.mixkit.co/videos/preview/mixkit-vertical-animation-of-futuristic-lines-and-particles-42514-large.mp4'
                  })}
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-emerald-500/90 hover:bg-emerald-400 text-slate-950 flex items-center justify-center shadow-xl shadow-emerald-500/40 hover:scale-110 active:scale-95 transition-all cursor-pointer"
                >
                  <Play className="w-7 h-7 md:w-8 md:h-8 fill-slate-950 ml-1" />
                </button>
                <span className="mt-3 text-xs font-bold text-white tracking-wide bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                  Watch Free Course Trailer (2 mins)
                </span>
              </div>

              {/* Badges on Video */}
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] text-white">
                <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md font-semibold border border-white/10">
                  HD 1080p • On-Demand Lessons
                </span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/80 text-slate-950 font-bold">
                  Lifetime Access
                </span>
              </div>
            </div>
          </div>

          {/* Pricing & Hero CTA Box */}
          <div className="pt-4 max-w-lg mx-auto space-y-3">
            <div className="p-4 rounded-3xl bg-[#131724] border border-white/10 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Limited Time Special Price</span>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-black text-emerald-400">₹{activeCourse.price}</span>
                    <span className="text-sm font-semibold text-slate-400 line-through">₹{activeCourse.original_price}</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      SAVE {activeCourse.discount_percentage}%
                    </span>
                  </div>
                </div>
                <div className="text-right text-[11px] text-slate-400">
                  <span className="text-amber-400 font-bold block">Only 14 Seats Left</span>
                  <span>at this price</span>
                </div>
              </div>

              <button
                onClick={() => onEnroll(activeCourse)}
                className="w-full py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40 active:scale-98 transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-slate-950" />
                <span>Enroll in Masterclass Now (Instant Access)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center space-x-4 text-[11px] text-slate-400 pt-1">
                <span className="flex items-center space-x-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Instant G-Drive Link</span>
                </span>
                <span className="flex items-center space-x-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Lifetime Validity</span>
                </span>
                <span className="flex items-center space-x-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>100% Safe UPI / Card</span>
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
            <Clock className="w-5 h-5 text-emerald-400 mx-auto mb-1.5" />
            <span className="text-base font-black text-white block">6.5+ Hours</span>
            <span className="text-[11px] text-slate-400">Structured Video Content</span>
          </div>
          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <BookOpen className="w-5 h-5 text-indigo-400 mx-auto mb-1.5" />
            <span className="text-base font-black text-white block">28 Lessons</span>
            <span className="text-[11px] text-slate-400">5 Hands-on Modules</span>
          </div>
          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <Laptop className="w-5 h-5 text-amber-400 mx-auto mb-1.5" />
            <span className="text-base font-black text-white block">Phone & Laptop</span>
            <span className="text-[11px] text-slate-400">Works on all devices</span>
          </div>
          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <GraduationCap className="w-5 h-5 text-teal-400 mx-auto mb-1.5" />
            <span className="text-base font-black text-white block">Verified Certificate</span>
            <span className="text-[11px] text-slate-400">Included with Course</span>
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE CURRICULUM ACCORDION */}
      <section id="curriculum" className="py-14 px-4 md:px-8 max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-emerald-400">
            Syllabus & Road Map
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Complete Course Curriculum Breakdown
          </h2>
          <p className="text-xs md:text-sm text-slate-400 max-w-xl mx-auto">
            Everything is structured step-by-step. Go from absolute beginner to skilled video professional with zero guesswork.
          </p>
        </div>

        <div className="space-y-3">
          {curriculum.map((mod, mIdx) => {
            const isOpen = openModuleIdx === mIdx;
            return (
              <div
                key={mIdx}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  isOpen
                    ? 'bg-[#131724] border-emerald-500/40 shadow-lg shadow-emerald-500/5'
                    : 'bg-[#0d101a] border-white/[0.08] hover:border-white/20'
                }`}
              >
                <button
                  onClick={() => setOpenModuleIdx(isOpen ? null : mIdx)}
                  className="w-full p-4 md:p-5 text-left flex items-center justify-between space-x-3 cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-7 h-7 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-xs font-black text-emerald-400 shrink-0">
                      {mIdx + 1}
                    </span>
                    <div>
                      <h3 className="text-xs md:text-sm font-bold text-white">
                        {mod.title}
                      </h3>
                      <div className="flex items-center space-x-2 text-[11px] text-slate-400 mt-0.5">
                        <span>{mod.lessons.length} Lessons</span>
                        <span>•</span>
                        <span>{mod.duration}</span>
                      </div>
                    </div>
                  </div>
                  <div className="shrink-0 text-slate-400">
                    {isOpen ? <ChevronUp className="w-5 h-5 text-emerald-400" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 md:px-5 pb-5 pt-1 border-t border-white/[0.06] space-y-2.5">
                    {mod.lessons.map((lesson, lIdx) => (
                      <div
                        key={lIdx}
                        className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-between space-x-2 text-xs"
                      >
                        <div className="flex items-center space-x-2.5 text-slate-200">
                          <Play className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{lesson}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono shrink-0">HD Video</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. WHO IS THIS COURSE FOR? */}
      <section className="py-12 px-4 md:px-8 bg-[#0b0e17] border-y border-white/[0.08]">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-400">Target Audience</span>
            <h2 className="text-2xl md:text-3xl font-black text-white">Who Will Benefit Most From This Course?</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-[#131724] border border-white/10 space-y-2">
              <div className="w-9 h-9 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Aspiring Creators</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Want to build an audience on Instagram or YouTube but struggle with video quality, retention, and slow editing workflows.
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-[#131724] border border-white/10 space-y-2">
              <div className="w-9 h-9 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Laptop className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Freelancers & Editors</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Learn modern AI automation and sound design to charge 3x-5x higher retainer fees for international client projects.
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-[#131724] border border-white/10 space-y-2">
              <div className="w-9 h-9 rounded-2xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Students & Side-Hustlers</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Build a marketable digital skill from scratch using your laptop or smartphone and start earning online in your free time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. ABOUT BAZARA.IN SECTION (Requested by User) */}
      <section id="about-bazara" className="py-14 px-4 md:px-8 max-w-4xl mx-auto space-y-8">
        <div className="p-6 md:p-10 rounded-3xl bg-gradient-to-br from-[#121624] via-[#0d101a] to-[#121624] border border-emerald-500/20 shadow-2xl relative overflow-hidden space-y-6">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>About bazara.in Academy</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white">
              Empowering India's Next Generation of Digital Creators & Professionals
            </h2>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              <strong className="text-white">bazara.in</strong> is India’s premier digital learning platform built to bridge the gap between traditional theoretical education and high-demand online skills. We design hyper-focused, 100% practical masterclasses created by real-world practitioners.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-1.5">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <h4 className="text-xs font-bold text-white">Zero Theory, 100% Action</h4>
              <p className="text-[11px] text-slate-400">
                Every minute of video content is packed with actionable screen recordings, workflows, and real templates.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-1.5">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h4 className="text-xs font-bold text-white">25,000+ Enrolled Learners</h4>
              <p className="text-[11px] text-slate-400">
                Trusted by thousands of students across India who have upskilled and transformed their careers.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-1.5">
              <FolderDown className="w-5 h-5 text-emerald-400" />
              <h4 className="text-xs font-bold text-white">Instant Lifetime G-Drive</h4>
              <p className="text-[11px] text-slate-400">
                No complex logins or expiring links. Access your masterclass forever with 1-tap Google Drive delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. MEET YOUR MENTOR */}
      <section id="instructor" className="py-12 px-4 md:px-8 max-w-4xl mx-auto">
        <div className="p-6 md:p-8 rounded-3xl bg-[#131724] border border-white/10 flex flex-col md:flex-row items-center gap-6">
          <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl overflow-hidden shrink-0 border-2 border-emerald-500/30 shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80"
              alt="Mentor Vikram Sharma"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-2 text-center md:text-left">
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20">
              Lead Course Mentor
            </span>
            <h3 className="text-xl font-bold text-white">Vikram Sharma</h3>
            <p className="text-xs text-indigo-400 font-medium">Ex-Creative Agency Lead • Trained 15,000+ Students Online</p>
            <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
              With 7+ years of experience directing commercial video campaigns and generating over 50M+ views across social platforms, Vikram breaks down complex editing and AI tools into simple, step-by-step masterclasses anyone can follow.
            </p>
          </div>
        </div>
      </section>

      {/* 9. WHAT'S INCLUDED IN THE ENROLLMENT */}
      <section className="py-12 px-4 md:px-8 bg-[#0b0e17] border-y border-white/[0.08]">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-400">All-Inclusive Package</span>
            <h2 className="text-2xl md:text-3xl font-black text-white">Everything Included When You Enroll Today</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl mx-auto">
            {[
              '28 Full HD Video Lessons with Lifetime Watch Access',
              'Downloadable Project Files, SFX Library & Cinematic LUTs Pack',
              'Ready-to-use CapCut & Premiere Pro Kinetic Text Presets',
              'Official bazara.in Verified Completion Certificate',
              'Private Telegram VIP Mastermind Community Access',
              'Free Future Curriculum Updates Whenever AI Tools Update'
            ].map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-[#131724] border border-white/[0.06] flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-xs font-semibold text-slate-200">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. STUDENT REVIEWS */}
      <section id="reviews" className="py-14 px-4 md:px-8 max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-emerald-400">Learner Proof</span>
          <h2 className="text-2xl md:text-3xl font-black text-white">What Our Students Say</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reviews.map((rev, rIdx) => (
            <div key={rIdx} className="p-5 rounded-3xl bg-[#131724] border border-white/10 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex text-amber-400 text-xs">★★★★★</div>
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>
              <div className="flex items-center space-x-3 pt-3 border-t border-white/[0.06]">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-indigo-600 font-bold text-white text-xs flex items-center justify-center">
                  {rev.avatar}
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">{rev.name}</span>
                  <span className="text-[10px] text-slate-400">{rev.role} • {rev.city}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 11. FAQ ACCORDION (Requested by User) */}
      <section id="faq" className="py-14 px-4 md:px-8 max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-emerald-400">Got Questions?</span>
          <h2 className="text-2xl md:text-3xl font-black text-white">Frequently Asked Questions</h2>
          <p className="text-xs text-slate-400">Everything you need to know before enrolling in the masterclass.</p>
        </div>

        <div className="space-y-2.5">
          {courseFaqs.map((faq, fIdx) => {
            const isOpen = openFaqIdx === fIdx;
            return (
              <div key={fIdx} className="rounded-2xl bg-[#131724] border border-white/[0.08] overflow-hidden">
                <button
                  onClick={() => setOpenFaqIdx(isOpen ? null : fIdx)}
                  className="w-full p-4 text-left flex items-center justify-between text-xs md:text-sm font-bold text-slate-200 cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-emerald-400 shrink-0 ml-2" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-2" />}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-slate-400 leading-relaxed border-t border-white/[0.05]">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 12. BOTTOM ENROLLMENT CARD */}
      <section className="py-12 px-4 md:px-8 max-w-3xl mx-auto">
        <div className="p-6 md:p-10 rounded-3xl bg-gradient-to-tr from-emerald-950/50 via-[#131724] to-indigo-950/50 border border-emerald-500/30 text-center space-y-5 shadow-2xl">
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
            Instant Lifetime Access
          </span>
          <h2 className="text-2xl md:text-4xl font-black text-white">
            Start Learning & Transforming Today
          </h2>
          <p className="text-xs md:text-sm text-slate-300 max-w-md mx-auto">
            Get instant access to all 28 HD lessons, project files, sound effects library, and mentor community for just ₹{activeCourse.price}.
          </p>

          <div className="flex items-center justify-center space-x-3">
            <span className="text-3xl md:text-4xl font-black text-emerald-400">₹{activeCourse.price}</span>
            <span className="text-base text-slate-400 line-through">₹{activeCourse.original_price}</span>
          </div>

          <button
            onClick={() => onEnroll(activeCourse)}
            className="w-full max-w-md mx-auto py-4 rounded-2xl font-black text-sm uppercase tracking-wider bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-xl shadow-emerald-500/30 active:scale-95 transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>Enroll Now • ₹{activeCourse.price} Only</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <p className="text-[11px] text-slate-400">
            🔒 256-Bit SSL Encrypted Payment • Instant G-Drive Delivery to WhatsApp & Email
          </p>
        </div>
      </section>

      {/* 13. FOOTER */}
      <footer className="px-4 py-8 border-t border-white/[0.08] text-center space-y-4 max-w-5xl mx-auto">
        <div className="flex items-center justify-center space-x-1">
          <span className="text-lg font-black text-white">bazara</span>
          <span className="text-sm font-bold text-emerald-400">.in</span>
        </div>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          India's Premier Digital Learning Platform for High-Impact Skills & Creator Masterclasses.
        </p>
        <div className="text-xs text-slate-400 flex flex-wrap items-center justify-center gap-4">
          <button onClick={onNavigateToStore} className="hover:text-emerald-400 underline cursor-pointer">
            Explore All Courses & Products (Store)
          </button>
          <span>•</span>
          <span className="hover:text-slate-200 cursor-pointer">Refund Policy</span>
          <span>•</span>
          <span className="hover:text-slate-200 cursor-pointer">Terms & Conditions</span>
          <span>•</span>
          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 hover:underline flex items-center space-x-1"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp Support</span>
          </a>
        </div>
        <p className="text-[10px] text-slate-400">© 2026 bazara.in • All Rights Reserved</p>
      </footer>

      {/* 14. MOBILE STICKY BOTTOM ENROLL DOCK */}
      <div className="fixed bottom-0 left-0 right-0 z-30 p-3 bg-[#08090E]/95 backdrop-blur-2xl border-t border-white/10 md:hidden flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] text-slate-400 block line-through">₹{activeCourse.original_price}</span>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-lg font-black text-emerald-400">₹{activeCourse.price}</span>
            <span className="text-[10px] font-bold text-emerald-400 px-1.5 py-0.2 rounded bg-emerald-500/20">
              {activeCourse.discount_percentage}% OFF
            </span>
          </div>
        </div>

        <button
          onClick={() => onEnroll(activeCourse)}
          className="flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/30 flex items-center justify-center space-x-1.5 active:scale-95 transition-all cursor-pointer"
        >
          <span>Enroll Now</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Video Teaser Modal */}
      <VideoModal
        isOpen={Boolean(activeVideo)}
        onClose={() => setActiveVideo(null)}
        videoUrl={activeVideo?.url}
        title={activeVideo?.title}
      />
    </div>
  );
}
