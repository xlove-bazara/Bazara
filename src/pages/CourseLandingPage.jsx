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
  GraduationCap,
  FileText,
  Mail
} from 'lucide-react';
import VideoModal from '../components/VideoModal';
import PolicyModal from '../components/PolicyModal';

export default function CourseLandingPage({ 
  course, 
  onEnroll, 
  onNavigateToStore, 
  settings 
}) {
  const [openModuleIdx, setOpenModuleIdx] = useState(0);
  const [openFaqIdx, setOpenFaqIdx] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);
  const [policyModal, setPolicyModal] = useState({ isOpen: false, tab: 'terms' });
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

  const defaultWebDevCourse = {
    id: 'prod-course-ai',
    title: 'Website Development with AI Masterclass',
    price: 499,
    original_price: 3999,
    discount_percentage: 88,
    badge: '🎓 Complete Video Course',
    rating: 4.96,
    reviews_count: 1680,
    downloads_count: 12400,
    cover_image: '/course-banner.jpg',
    short_desc: 'Master modern full-stack website development with cutting-edge AI tools (Cursor, ChatGPT, Claude & v0). Learn to build and launch responsive websites, connect dynamic backends, and get high-paying freelance web clients.',
    course_details: {
      instructor: 'Viplav Kumar (Senior Full-Stack Engineer & AI Specialist)',
      duration: '8.5+ Hours of HD Video Lessons',
      modules_count: '5 In-Depth Modules (32 Lessons)',
      level: 'Beginner to Advanced (Zero coding background required)',
      certificate: 'Official bazara.in Verified Web Development Certificate'
    }
  };

  // Only take custom course data if it is genuinely a course product
  const isCourseProduct = course && (
    course.id === 'prod-course-ai' || 
    course.category === 'course' || 
    course.product_type === 'course'
  );

  const activeCourse = {
    ...defaultWebDevCourse,
    ...(isCourseProduct ? course : {}),
    cover_image: '/course-banner.jpg'
  };

  const defaultWebDevCurriculum = [
    {
      title: 'Module 1: Web Development Foundations & AI Coding Setup',
      duration: '1 hr 10 mins',
      lessons: [
        'How the Modern Web Works: HTML5, CSS3 & Responsive Design',
        'Cursor AI & Claude Code: Setting Up Your 10x Developer Environment',
        'Prompt Engineering for Code: Generating Bug-Free Clean Syntax'
      ]
    },
    {
      title: 'Module 2: Rapid UI & Frontend Engineering with React & Tailwind CSS',
      duration: '1 hr 45 mins',
      lessons: [
        'Component Architecture: Header, Hero, Bento Grids & Modals',
        'Instant UI Generation with v0 by Vercel & Tailwind CSS',
        'Mobile Responsiveness & Glassmorphism Animation Effects'
      ]
    },
    {
      title: 'Module 3: Dynamic Backend, Database & Payment Gateway Integration',
      duration: '2 hrs 00 mins',
      lessons: [
        'Setting Up Supabase: Relational Tables, Policies & Realtime Data',
        'User Authentication: Email, Passwords & Phone OTP Flow',
        'Payment Gateway Integration: Razorpay, Cashfree & UPI Checkout'
      ]
    },
    {
      title: 'Module 4: Real-World Capstone Web Projects',
      duration: '2 hrs 15 mins',
      lessons: [
        'Project 1: High-Converting SaaS Landing Page with Lead Capture',
        'Project 2: Dynamic Creator Portfolio with CMS Backing',
        'Project 3: Full-Stack E-Commerce Digital Storefront'
      ]
    },
    {
      title: 'Module 5: Domain Setup, Production Deployment & Freelance Blueprint',
      duration: '1 hr 20 mins',
      lessons: [
        '1-Click Production Deployment to Vercel with Custom Domain & Free SSL',
        'SEO Optimization, OpenGraph Meta Tags & Speed Tuning (100/100 Lighthouse)',
        'The ₹50,000/Month Freelance Web Dev Client Acquisition System'
      ]
    }
  ];

  // If user configured custom curriculum in Admin, use that!
  const hasCustomCurriculum = activeCourse.course_details?.curriculum && 
    Array.isArray(activeCourse.course_details.curriculum) && 
    activeCourse.course_details.curriculum.length > 0 && 
    !activeCourse.course_details.curriculum[0]?.title?.includes('Retention');

  const curriculum = hasCustomCurriculum ? activeCourse.course_details.curriculum : defaultWebDevCurriculum;

  // Active Trailer Video URL (Supports YouTube link, YouTube Shorts, or MP4)
  const trailerUrl = activeCourse.video_url || 
    activeCourse.course_details?.video_url || 
    'https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-screen-close-up-43093-large.mp4';



  const courseFaqs = [
    {
      q: 'Payment complete hone ke baad course access kaise aur kahan milega?',
      a: 'Payment confirm hote hi turant agle page par 1-Click Master Google Drive access link unlock ho jayegi. Sath hi aapke registered WhatsApp number aur Email par bhi direct watch and download credentials instantly deliver hongi.'
    },
    {
      q: 'Kya is course ke liye pehle se coding ya computer science degree chahiye?',
      a: 'Bilkul nahi! Ye masterclass zero background se start hoti hai. Viplav Kumar aapko step-by-step sikhate hain ki AI tools (Cursor, ChatGPT, Claude) ki madad se bina kisi coding headache ke professional websites kaise banai jati hain.'
    },
    {
      q: 'Kya main mobile phone aur laptop dono par videos dekh aur sikh sakta hoon?',
      a: 'Haan, 100%! Pura course mobile-friendly hai. Aap apne smartphone, tablet, ya laptop/PC kisi bhi device par HD stream kar sakte ho ya offline download karke lifetime dekh sakte ho.'
    },
    {
      q: 'Kya course me live website internet par deploy karna sikhaya jayega?',
      a: 'Haan! Module 5 me aapko live custom domain link karna, free SSL setup karna, aur Vercel par 1-click global hosting karna practical step-by-step sikhaya gaya hai.'
    },
    {
      q: 'Course ki validity kitni hai aur kya future updates free milenge?',
      a: 'Aapko Lifetime Access milta hai. Jab bhi naye AI models, web frameworks ya tools update honge, naye modules bina kisi extra charge ke aapke Google Drive folder me add kar diye jayenge.'
    },
    {
      q: 'Kya mujhe Certificate of Completion milega?',
      a: 'Haan, saare modules complete karne ke baad aapko bazara.in Verified Digital Certificate provide kiya jayega jise aap apne LinkedIn profile, resume ya freelance portfolio me add kar sakte hain.'
    },
    {
      q: 'Agar practice karte waqt koi doubt ya error aaye toh kaise solve hoga?',
      a: 'Aapko bazara.in ke Exclusive Telegram Mastermind Community ka access milta hai jahan mentor Viplav Kumar aur top developers active rehte hain. Sath hi direct WhatsApp helpline bhi available hai.'
    }
  ];

  const reviews = [
    {
      name: 'Ankit Sharma',
      role: 'Freelance Web Designer',
      city: 'Delhi',
      avatar: 'A',
      rating: 5,
      comment: 'Viplav sir ka AI workflow unbelievable hai! Maine Cursor aur Supabase use karke 3 din me apna pehla dynamic web app bana liya aur US client ko ₹45,000 me deliver kiya!'
    },
    {
      name: 'Sneha Patel',
      role: 'BCA Student',
      city: 'Bangalore',
      avatar: 'S',
      rating: 5,
      comment: 'College me 3 saal me jo nahi seekh paayi, wo is masterclass me 1 hafte me clear ho gaya. Tailwind CSS aur AI prompting concepts are explained in crystal-clear Hinglish.'
    },
    {
      name: 'Rohan Mehta',
      role: 'Digital Agency Founder',
      city: 'Mumbai',
      avatar: 'R',
      rating: 5,
      comment: 'The payment gateway integration and deployment modules alone are worth 10x the course fee. The included project source codes saved me hundreds of hours of work.'
    }
  ];

  return (
    <div className="min-h-screen pb-20 md:pb-8 bg-[#08090E] text-slate-100 selection:bg-emerald-500/30">
      {/* 1. Urgency Countdown Top Bar */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 px-4 py-2 text-center text-xs font-bold text-white shadow-md flex items-center justify-center space-x-2">
        <span className="inline-block w-2 h-2 rounded-full bg-amber-300 animate-ping" />
        <span>⚡ SPECIAL ADMISSIONS OPEN: FLAT {activeCourse.discount_percentage}% OFF</span>
        <span className="hidden sm:inline text-emerald-100">• Offer ends in</span>
        <span className="px-2 py-0.5 rounded bg-black/30 font-mono text-amber-200">
          {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
        </span>
      </div>

      {/* 2. Navigation Header */}
      <header className="sticky top-0 z-40 px-4 md:px-8 py-3 backdrop-blur-2xl bg-[#08090E]/85 border-b border-white/[0.08]">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center space-x-2.5">
            <img
              src="/logo.png"
              alt="bazara.in Logo"
              className="w-8 h-8 rounded-xl object-contain shadow-lg shadow-indigo-500/25"
            />
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
              onClick={() => setPolicyModal({ isOpen: true, tab: 'terms' })}
              className="text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            >
              Policies
            </button>
          </nav>

          {/* CTA Action */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onEnroll(activeCourse)}
              className="px-4 md:px-6 py-2 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/25 active:scale-95 transition-all flex items-center space-x-1.5 cursor-pointer btn-shine-effect"
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
            <span>100% Practical Masterclass • Mentored by Viplav Kumar</span>
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
              <span className="font-bold text-white">{activeCourse.rating || 4.96}/5</span>
              <span className="text-slate-400">({activeCourse.reviews_count || 1680}+ Verified Reviews)</span>
            </div>
            <span className="hidden sm:inline text-slate-600">•</span>
            <div className="flex items-center space-x-1.5">
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-bold text-white">{activeCourse.downloads_count || 12400}+ Students Enrolled</span>
            </div>
            <span className="hidden sm:inline text-slate-600">•</span>
            <div className="flex items-center space-x-1.5">
              <Award className="w-3.5 h-3.5 text-indigo-400" />
              <span className="font-semibold text-white">Verified Certificate</span>
            </div>
          </div>

          {/* Course Cover Banner Image (Only image as requested, video player removed for now) */}
          <div className="pt-4 max-w-3xl mx-auto">
            <div className="relative rounded-3xl overflow-hidden border border-white/20 shadow-2xl shadow-emerald-500/10 group bg-slate-900 aspect-video">
              <img
                src="/course-banner.jpg"
                alt={activeCourse.title}
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
              />
            </div>

            {/* Feature Badges below the banner */}
            <div className="mt-3 flex items-center justify-between text-[11px] sm:text-xs text-slate-300 px-1">
              <span className="px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md font-semibold border border-white/10 text-slate-300 flex items-center space-x-1.5 shadow-sm">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>HD 1080p • 32 On-Demand Lessons</span>
              </span>
              <span className="px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold backdrop-blur-md flex items-center space-x-1.5 shadow-sm">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Lifetime G-Drive Access</span>
              </span>
            </div>
          </div>

          {/* Pricing & Hero CTA Box */}
          <div className="pt-4 max-w-lg mx-auto space-y-3">
            <div className="p-4 rounded-3xl bg-[#131724] border border-white/10 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Limited Time Special Admission</span>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-black text-emerald-400">₹{activeCourse.price}</span>
                    <span className="text-sm font-semibold text-slate-400 line-through">₹{activeCourse.original_price}</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      SAVE {activeCourse.discount_percentage}%
                    </span>
                  </div>
                </div>
                <div className="text-right text-[11px] text-slate-400">
                  <span className="text-amber-400 font-bold block">Only 12 Seats Left</span>
                  <span>in this batch</span>
                </div>
              </div>

              <button
                onClick={() => onEnroll(activeCourse)}
                className="w-full py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40 active:scale-98 transition-all flex items-center justify-center space-x-2 cursor-pointer btn-shine-effect"
              >
                <Zap className="w-4 h-4 fill-slate-950" />
                <span>Enroll in Web Dev Masterclass (Instant Access)</span>
                <ArrowRight className="w-4 h-4" />
              </button>


              <div className="flex items-center justify-center space-x-4 text-[11px] text-slate-400 pt-1">
                <span className="flex items-center space-x-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Instant G-Drive Delivery</span>
                </span>
                <span className="flex items-center space-x-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Lifetime Access</span>
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
            <span className="text-base font-black text-white block">8.5+ Hours</span>
            <span className="text-[11px] text-slate-400">Structured HD Content</span>
          </div>
          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <BookOpen className="w-5 h-5 text-indigo-400 mx-auto mb-1.5" />
            <span className="text-base font-black text-white block">32 Lessons</span>
            <span className="text-[11px] text-slate-400">5 Hands-on Modules</span>
          </div>
          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <Laptop className="w-5 h-5 text-amber-400 mx-auto mb-1.5" />
            <span className="text-base font-black text-white block">Full Source Code</span>
            <span className="text-[11px] text-slate-400">3 Ready-to-Deploy Projects</span>
          </div>
          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <GraduationCap className="w-5 h-5 text-teal-400 mx-auto mb-1.5" />
            <span className="text-base font-black text-white block">Verified Certificate</span>
            <span className="text-[11px] text-slate-400">Official bazara.in Credential</span>
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
            Everything is structured step-by-step. Go from zero coding background to launching production websites and earning as an AI-powered developer.
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
                <Laptop className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Beginners & Non-Techies</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Zero coding background? Learn how modern AI coding assistants (Cursor & Claude) do the heavy lifting so you can build stunning websites easily.
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-[#131724] border border-white/10 space-y-2">
              <div className="w-9 h-9 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Aspiring Freelancers</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Offer high-demand web development services to businesses and charge ₹25,000–₹60,000 per website with rapid 48-hour delivery times.
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-[#131724] border border-white/10 space-y-2">
              <div className="w-9 h-9 rounded-2xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Students & Professionals</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Build a portfolio of real, live web apps to crack software engineering roles or build your own startup MVPs without hiring developers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. ABOUT BAZARA.IN SECTION */}
      <section id="about-bazara" className="py-14 px-4 md:px-8 max-w-4xl mx-auto space-y-8">
        <div className="p-6 md:p-10 rounded-3xl bg-gradient-to-br from-[#121624] via-[#0d101a] to-[#121624] border border-emerald-500/20 shadow-2xl relative overflow-hidden space-y-6">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>About bazara.in Academy</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white">
              Empowering India's Next Generation of AI-Powered Web Developers
            </h2>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              <strong className="text-white">bazara.in</strong> is India’s premier digital learning platform focused on practical, high-income digital skills. We bridge the gap between traditional college theory and modern AI-driven industry standards. Our masterclasses are designed by seasoned engineers to deliver tangible results in days, not years.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-1.5">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <h4 className="text-xs font-bold text-white">Zero Fluff, 100% Practical</h4>
              <p className="text-[11px] text-slate-400">
                Build real websites from Day 1. Every module includes copy-paste source code and production-ready templates.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-1.5">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h4 className="text-xs font-bold text-white">25,000+ Enrolled Learners</h4>
              <p className="text-[11px] text-slate-400">
                A thriving nationwide community of developers, creators, and freelancers upskilling every single week.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-1.5">
              <FolderDown className="w-5 h-5 text-emerald-400" />
              <h4 className="text-xs font-bold text-white">Instant Lifetime G-Drive</h4>
              <p className="text-[11px] text-slate-400">
                Immediate access upon checkout. Stream or download lessons forever with continuous free curriculum updates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. MEET YOUR MENTOR: VIPLAV KUMAR */}
      <section id="instructor" className="py-12 px-4 md:px-8 max-w-4xl mx-auto">
        <div className="p-6 md:p-8 rounded-3xl bg-[#131724] border border-white/10 flex flex-col md:flex-row items-center gap-6">
          <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl overflow-hidden shrink-0 border-2 border-emerald-500/30 shadow-xl bg-slate-800 flex items-center justify-center">
            <div className="w-full h-full bg-gradient-to-tr from-emerald-600 via-teal-700 to-indigo-800 flex flex-col items-center justify-center text-white p-2 text-center">
              <span className="text-3xl font-black">VK</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200 mt-1">Viplav Kumar</span>
            </div>
          </div>
          <div className="space-y-2 text-center md:text-left">
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20">
              Lead Course Mentor & Full-Stack Architect
            </span>
            <h3 className="text-xl font-bold text-white">Viplav Kumar</h3>
            <p className="text-xs text-indigo-400 font-medium">Senior Full-Stack Engineer • Mentored 10,000+ Students in Modern Tech</p>
            <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
              Viplav Kumar has engineered high-scale web platforms and pioneered AI-assisted coding workflows for clients globally. In this comprehensive masterclass, Viplav breaks down modern web architecture, frontend UI, backend databases, and AI coding tools into easy, actionable steps that anyone can master in days.
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
              '32 Full HD Video Lessons with Lifetime Watch Access',
              'Complete Source Code of 3 Production Web Apps (SaaS, Portfolio & Store)',
              'Curated AI Prompt Bank for Cursor IDE, ChatGPT & Claude',
              'Official bazara.in Verified Certificate of Completion',
              'Private Telegram VIP Mastermind Community with Viplav Kumar',
              'Lifetime Free Curriculum Updates for New AI Tools & Frameworks'
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

      {/* 11. FAQ ACCORDION */}
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
            Start Building Modern Websites with AI Today
          </h2>
          <p className="text-xs md:text-sm text-slate-300 max-w-md mx-auto">
            Get instant access to all 32 HD video lessons, 3 capstone projects source code, AI prompt bank, and private community with Viplav Kumar for just ₹{activeCourse.price}.
          </p>

          <div className="flex items-center justify-center space-x-3">
            <span className="text-3xl md:text-4xl font-black text-emerald-400">₹{activeCourse.price}</span>
            <span className="text-base text-slate-400 line-through">₹{activeCourse.original_price}</span>
          </div>

          <button
            onClick={() => onEnroll(activeCourse)}
            className="w-full max-w-md mx-auto py-4 rounded-2xl font-black text-sm uppercase tracking-wider bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-xl shadow-emerald-500/30 active:scale-95 transition-all flex items-center justify-center space-x-2 cursor-pointer btn-shine-effect"
          >
            <span>Enroll Now • ₹{activeCourse.price} Only</span>
            <ArrowRight className="w-4 h-4" />
          </button>


          <p className="text-[11px] text-slate-400">
            🔒 256-Bit SSL Encrypted Payment • Instant G-Drive Delivery to WhatsApp & Email
          </p>
        </div>
      </section>

      {/* 13. COMPLIANT FOOTER (Payment Gateway Compliant, Store link removed) */}
      <footer className="px-4 py-8 border-t border-white/[0.08] text-center space-y-4 max-w-5xl mx-auto">
        <div className="flex items-center justify-center space-x-2">
          <img src="/logo.png" alt="bazara.in" className="w-8 h-8 rounded-lg object-contain shadow-md" />
          <div className="flex items-baseline space-x-1">
            <span className="text-lg font-black text-white">bazara</span>
            <span className="text-sm font-bold text-emerald-400">.in</span>
          </div>
        </div>

        <p className="text-xs text-slate-400 max-w-md mx-auto">
          India's Premier Digital Learning Platform for Modern Web Development & AI Engineering. Mentored by Viplav Kumar.
        </p>

        {/* Essential Legal Links Required by Payment Gateways */}
        <div className="text-xs text-slate-400 flex flex-wrap items-center justify-center gap-3 md:gap-5 pt-1">
          <button
            onClick={() => setPolicyModal({ isOpen: true, tab: 'terms' })}
            className="hover:text-emerald-400 underline cursor-pointer"
          >
            Terms & Conditions
          </button>
          <span>•</span>
          <button
            onClick={() => setPolicyModal({ isOpen: true, tab: 'privacy' })}
            className="hover:text-emerald-400 underline cursor-pointer"
          >
            Privacy Policy
          </button>
          <span>•</span>
          <button
            onClick={() => setPolicyModal({ isOpen: true, tab: 'refund' })}
            className="hover:text-emerald-400 underline cursor-pointer"
          >
            Refund Policy
          </button>
          <span>•</span>
          <button
            onClick={() => setPolicyModal({ isOpen: true, tab: 'shipping' })}
            className="hover:text-emerald-400 underline cursor-pointer"
          >
            Digital Delivery & Shipping
          </button>
          <span>•</span>
          <button
            onClick={() => setPolicyModal({ isOpen: true, tab: 'contact' })}
            className="hover:text-emerald-400 underline cursor-pointer"
          >
            Contact Us
          </button>
        </div>

        <div className="pt-2 text-[11px] text-slate-500 space-y-1">
          <p>© 2026 bazara.in • All Rights Reserved</p>
          <p>Support: support@bazara.in • WhatsApp: +91 98765 43210</p>
        </div>
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
          className="flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/30 flex items-center justify-center space-x-1.5 active:scale-95 transition-all cursor-pointer btn-shine-effect"
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
        onBuyClick={() => onEnroll(activeCourse)}
      />

      {/* Payment Gateway Compliant Legal Policies Modal */}
      <PolicyModal
        isOpen={policyModal.isOpen}
        onClose={() => setPolicyModal({ ...policyModal, isOpen: false })}
        initialTab={policyModal.tab}
      />
    </div>
  );
}
