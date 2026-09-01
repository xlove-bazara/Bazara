import React, { useState, useEffect } from 'react';
import MarqueeTicker from '../components/MarqueeTicker';
import Header from '../components/Header';
import StoryCategories from '../components/StoryCategories';
import HeroSection from '../components/HeroSection';
import BentoProductGrid from '../components/BentoProductGrid';
import BottomDock from '../components/BottomDock';
import QuickViewModal from '../components/QuickViewModal';
import LoginModal from '../components/LoginModal';
import PolicyModal from '../components/PolicyModal';
import { 
  Zap, 
  FolderDown, 
  ShieldCheck, 
  Clock, 
  Sparkles, 
  CheckCircle,
  HelpCircle,
  TrendingUp,
  Award,
  Star,
  Users,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Check,
  Package,
  ArrowRight
} from 'lucide-react';

export default function HomePage({ 
  products, 
  settings, 
  onSelectProduct, 
  onInstantBuy, 
  onNavigate, 
  user, 
  setUser 
}) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [recentBuyer, setRecentBuyer] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);
  const [policyModal, setPolicyModal] = useState({ isOpen: false, tab: 'terms' });




  // Live root course that appears on bazara.in
  const featuredCourseId = settings?.featured_course_id || 'prod-course-ai';
  const featuredCourse = 
    products.find(p => p.id === featuredCourseId) ||
    products.find(p => p.category === 'course' || p.product_type === 'course') ||
    products[0];


  // Filter products based on Category & Search
  const filteredProducts = products.filter((p) => {
    const matchesCategory = 
      selectedCategory === 'all' || 
      (selectedCategory === 'flash_sale' ? p.is_flash_sale : p.category === selectedCategory);

    const matchesSearch = searchQuery === '' || 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.short_desc?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // Recent buyer ticker simulation (Conversion booster with 20+ unique names)
  useEffect(() => {
    const buyers = [
      { name: "Rahul S.", city: "Mumbai", time: "2m ago" },
      { name: "Aakash V.", city: "Delhi", time: "4m ago" },
      { name: "Priya M.", city: "Bangalore", time: "1m ago" },
      { name: "Sameer K.", city: "Hyderabad", time: "just now" },
      { name: "Aditya P.", city: "Pune", time: "3m ago" },
      { name: "Sneha R.", city: "Kolkata", time: "5m ago" },
      { name: "Vikram N.", city: "Ahmedabad", time: "2m ago" },
      { name: "Kunal T.", city: "Jaipur", time: "1m ago" },
      { name: "Ananya B.", city: "Chandigarh", time: "just now" },
      { name: "Deepak G.", city: "Lucknow", time: "6m ago" },
      { name: "Rohan M.", city: "Indore", time: "3m ago" },
      { name: "Neha J.", city: "Surat", time: "2m ago" },
      { name: "Karan S.", city: "Bhopal", time: "4m ago" },
      { name: "Pooja D.", city: "Nagpur", time: "1m ago" },
      { name: "Manish K.", city: "Patna", time: "3m ago" },
      { name: "Ritika C.", city: "Noida", time: "just now" },
      { name: "Arjun W.", city: "Gurgaon", time: "2m ago" },
      { name: "Divya L.", city: "Coimbatore", time: "5m ago" },
      { name: "Siddharth T.", city: "Kochi", time: "3m ago" },
      { name: "Megha S.", city: "Visakhapatnam", time: "4m ago" }
    ];

    let currentIndex = 0;

    const interval = setInterval(() => {
      setRecentBuyer(buyers[currentIndex % buyers.length]);
      currentIndex++;
      // Show for 6.5 seconds so it is comfortably readable
      setTimeout(() => setRecentBuyer(null), 6500);
    }, 14000);

    // Initial first show after 3 seconds
    const initialTimer = setTimeout(() => {
      setRecentBuyer(buyers[0]);
      currentIndex++;
      setTimeout(() => setRecentBuyer(null), 6500);
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(initialTimer);
    };
  }, []);

  // Smooth Cross-Fade Auto-Loop Reviews Data
  const reviewsList = [
    {
      name: "Aman Sharma",
      city: "Mumbai",
      role: "Instagram Creator (85k+ Followers)",
      avatar: "A",
      text: "Grew my motivation page from 2k to 85k followers in just 35 days using the 4K Luxury Reels pack. Zero watermarks and the quality is insane!"
    },
    {
      name: "Ritika Patel",
      city: "Delhi",
      role: "Freelance Video Editor",
      avatar: "R",
      text: "The AI video editing masterclass and CapCut XML presets saved me at least 15 hours every single week for client projects. 100% worth every rupee."
    },
    {
      name: "Sameer Khan",
      city: "Bangalore",
      role: "Digital Marketer & Reseller",
      avatar: "S",
      text: "Bought the bundle with commercial PLR rights. Already generated ₹18,000 reselling with my own branding. Customer support on WhatsApp is super fast!"
    },
    {
      name: "Divya L.",
      city: "Pune",
      role: "Fitness & Lifestyle Creator",
      avatar: "D",
      text: "Viral hook templates in the E-book are mindblowing. My first reel using the 3-second hook format crossed 1.2M views on Instagram!"
    }
  ];

  const [activeReviewIdx, setActiveReviewIdx] = useState(0);
  const [isFading, setIsFading] = useState(false);

  // Auto-rotate reviews with gentle fade out -> update -> fade in
  useEffect(() => {
    const reviewInterval = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setActiveReviewIdx((prev) => (prev + 1) % reviewsList.length);
        setIsFading(false);
      }, 400); // 400ms smooth fade transition
    }, 4500);

    return () => clearInterval(reviewInterval);
  }, [reviewsList.length]);

  return (
    <div className="min-h-screen pb-24 bg-[#08090E] text-slate-100 selection:bg-emerald-500/30">
      {/* 1. Continuous Infinite Marquee Ticker */}
      <MarqueeTicker announcements={settings?.marquee_announcements} />

      {/* 2. Floating Frosted Header */}
      <Header
        onSearch={(q) => setSearchQuery(q)}
        onNavigate={onNavigate}
        onOpenLogin={() => setIsLoginOpen(true)}
        user={user}
        activeTab="home"
      />

      <main className="max-w-md md:max-w-5xl lg:max-w-6xl mx-auto space-y-6 pt-2 pb-16 px-4 md:px-8">
        {/* 3. Instagram-Style Story Categories Slider */}
        <StoryCategories
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
        />

        {/* 4. Hero Conversion Section */}
        {selectedCategory === 'all' && !searchQuery && (
          <>
            <HeroSection 
              featuredCourse={featuredCourse}
              onEnroll={() => onInstantBuy(featuredCourse)}
              onViewCourse={() => onSelectProduct(featuredCourse)}
            />


            {/* Live Stats Strip */}
            <div className="grid grid-cols-4 gap-2 md:gap-4 text-center">
              <div className="p-3 md:p-4 rounded-2xl glass-panel shadow-md">
                <span className="text-sm md:text-xl font-black text-emerald-400 block">100K+</span>
                <span className="text-[9px] md:text-xs font-bold text-slate-400 uppercase">Downloads</span>
              </div>
              <div className="p-3 md:p-4 rounded-2xl glass-panel shadow-md">
                <span className="text-sm md:text-xl font-black text-amber-400 block">4.9 ★</span>
                <span className="text-[9px] md:text-xs font-bold text-slate-400 uppercase">Rating</span>
              </div>
              <div className="p-3 md:p-4 rounded-2xl glass-panel shadow-md">
                <span className="text-sm md:text-xl font-black text-indigo-400 block">25K+</span>
                <span className="text-[9px] md:text-xs font-bold text-slate-400 uppercase">Creators</span>
              </div>
              <div className="p-3 md:p-4 rounded-2xl glass-panel shadow-md">
                <span className="text-sm md:text-xl font-black text-teal-400 block">100%</span>
                <span className="text-[9px] md:text-xs font-bold text-slate-400 uppercase">PLR Rights</span>
              </div>
            </div>
          </>
        )}

        {/* 6. Dynamic Bento Product Grid */}
        <BentoProductGrid
          products={filteredProducts}
          title={
            searchQuery 
              ? `Results for "${searchQuery}"`
              : selectedCategory === 'all' 
                ? 'Trending Bundles' 
                : `${selectedCategory.toUpperCase()} Showcase`
          }
          onProductClick={(prod) => onSelectProduct(prod)}
          onQuickViewClick={(prod) => setQuickViewProduct(prod)}
        />

        {/* ⭐ CREATOR WALL OF LOVE (Horizontal Smooth Fade-In / Fade-Out Auto Loop) */}
        <section className="py-3 space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center space-x-1.5">
              <span>Creator Reviews & Proof</span>
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/20">
              ★ 4.9 Verified Proof
            </span>
          </div>

          {/* Smooth Auto Fade-in / Fade-out Card */}
          <div className="relative min-h-[145px] p-4 rounded-3xl bg-[#131724] border border-white/[0.08] shadow-2xl flex flex-col justify-between transition-all">
            <div className={`transition-all duration-500 ease-in-out space-y-2 ${isFading ? 'opacity-0 translate-y-1' : 'opacity-100 translate-y-0'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-indigo-600 font-black text-white text-xs flex items-center justify-center shadow-md">
                    {reviewsList[activeReviewIdx].avatar}
                  </div>
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="text-xs font-bold text-white leading-none">
                        {reviewsList[activeReviewIdx].name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        ({reviewsList[activeReviewIdx].city})
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-medium block mt-0.5">
                      {reviewsList[activeReviewIdx].role}
                    </span>
                  </div>
                </div>
                <div className="flex text-amber-400 text-xs tracking-tighter">★★★★★</div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed italic">
                "{reviewsList[activeReviewIdx].text}"
              </p>
            </div>

            {/* Horizontal Pagination Dots */}
            <div className="flex items-center justify-center space-x-1.5 pt-3 border-t border-white/[0.05]">
              {reviewsList.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  onClick={() => {
                    setIsFading(true);
                    setTimeout(() => {
                      setActiveReviewIdx(dotIdx);
                      setIsFading(false);
                    }, 200);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    activeReviewIdx === dotIdx ? 'w-5 bg-emerald-400' : 'w-1.5 bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ⭐ 10. INTERACTIVE FAQ ACCORDION */}
        <section className="px-4 py-3 space-y-3">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 text-center">
            Frequently Asked Questions
          </h3>

          <div className="space-y-2">
            {[
              {
                q: "Payment ke baad link kahan milegi?",
                a: "Payment complete hote hi turant agle page par 1-tap Google Drive download button aayega. Sath hi tumhare WhatsApp number aur Email par bhi link instantly deliver hogi."
              },
              {
                q: "Kya reels me koi watermark ya logo hoga?",
                a: "Bilkul nahi! Saari reels 100% clean, watermark-free aur logo-free hain. Tum direct apne page par bina kisi issue ke upload kar sakte ho."
              },
              {
                q: "Kya main mobile phone me download kar sakta hoon?",
                a: "Haan, bilkul! Chahe iPhone ho ya Android ya Laptop, tum direct Google Drive se ek-ek video ya pura folder 1 click me download kar sakte ho."
              },
              {
                q: "Commercial Resell Rights (PLR) ka kya matlab hai?",
                a: "Iska matlab hai ki tum in digital products ko apne naam se, apne Instagram page ya website par aage sell karke 100% profit rakh sakte ho."
              }
            ].map((faq, fIdx) => {
              const isOpen = openFaq === fIdx;
              return (
                <div key={fIdx} className="rounded-2xl bg-[#131724] border border-white/[0.08] overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : fIdx)}
                    className="w-full p-3.5 text-left flex items-center justify-between text-xs font-bold text-slate-200"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-emerald-400 shrink-0 ml-2" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-2" />}
                  </button>
                  {isOpen && (
                    <div className="px-3.5 pb-3.5 pt-1 text-[11px] text-slate-400 leading-relaxed border-t border-white/[0.05]">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ⭐ 11. VIP COMMUNITY BANNER */}
        <section className="px-4 py-2">
          <div className="p-4 rounded-3xl bg-indigo-950/30 border border-indigo-500/20 space-y-2.5 text-center">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">
              Join 12,000+ Creators on Telegram
            </h4>
            <p className="text-[11px] text-slate-300 max-w-xs mx-auto">
              Get free viral audio hooks, CapCut templates, and algorithm updates every single week.
            </p>
            <a
              href="https://t.me/bazara_creators"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-full text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Join Free VIP Mastermind →</span>
            </a>
          </div>
        </section>

        {/* 12. Why bazara.in? Trust Badges */}
        <section className="px-4 py-3 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 text-center">
            Why 25,000+ Creators Choose bazara.in
          </h3>
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3.5 rounded-2xl bg-[#131724] border border-white/[0.06] space-y-1 shadow-md">
              <FolderDown className="w-5 h-5 text-emerald-400" />
              <h4 className="text-xs font-bold text-white">Instant G-Drive</h4>
              <p className="text-[10px] text-slate-400">Direct 1-tap download link sent immediately.</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#131724] border border-white/[0.06] space-y-1 shadow-md">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h4 className="text-xs font-bold text-white">Commercial PLR</h4>
              <p className="text-[10px] text-slate-400">100% legal rights to monetize and resell.</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#131724] border border-white/[0.06] space-y-1 shadow-md">
              <Zap className="w-5 h-5 text-emerald-400" />
              <h4 className="text-xs font-bold text-white">4K 60FPS Clean</h4>
              <p className="text-[10px] text-slate-400">Zero logos, zero watermarks, ready to post.</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#131724] border border-white/[0.06] space-y-1 shadow-md">
              <Award className="w-5 h-5 text-emerald-400" />
              <h4 className="text-xs font-bold text-white">Lifetime Updates</h4>
              <p className="text-[10px] text-slate-400">New reels and modules added monthly for free.</p>
            </div>
          </div>
        </section>

        {/* 8. Footer Info */}
        <footer className="px-4 pt-6 pb-4 border-t border-white/[0.08] text-center space-y-3">
          <div className="flex items-center justify-center space-x-2">
            <img src="/logo.png" alt="bazara.in" className="w-7 h-7 rounded-lg object-contain shadow-md" />
            <div className="flex items-baseline space-x-1">
              <span className="text-base font-black text-white">bazara</span>
              <span className="text-xs font-bold text-emerald-400">.in</span>
            </div>
          </div>

          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            India's Leading Digital Learning & Tech Skill Academy.
          </p>
          <div className="text-[11px] text-slate-400 flex flex-wrap items-center justify-center gap-3">
            <button onClick={() => setPolicyModal({ isOpen: true, tab: 'terms' })} className="hover:text-emerald-400 underline cursor-pointer">
              Terms & Conditions
            </button>
            <span>•</span>
            <button onClick={() => setPolicyModal({ isOpen: true, tab: 'privacy' })} className="hover:text-emerald-400 underline cursor-pointer">
              Privacy Policy
            </button>
            <span>•</span>
            <button onClick={() => setPolicyModal({ isOpen: true, tab: 'refund' })} className="hover:text-emerald-400 underline cursor-pointer">
              Refund Policy
            </button>
            <span>•</span>
            <button onClick={() => setPolicyModal({ isOpen: true, tab: 'shipping' })} className="hover:text-emerald-400 underline cursor-pointer">
              Digital Delivery
            </button>
            <span>•</span>
            <button onClick={() => setPolicyModal({ isOpen: true, tab: 'contact' })} className="hover:text-emerald-400 underline cursor-pointer">
              Contact Us
            </button>
          </div>
          <p className="text-[10px] text-slate-400">© 2026 bazara.in • All Rights Reserved</p>
        </footer>
      </main>

      {/* Floating Bottom Dock */}
      <BottomDock activeTab="home" onTabChange={(tab) => onNavigate(tab)} />

      {/* Quick View Slide-up Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onViewDetails={(prod) => onSelectProduct(prod)}
        onInstantBuy={(prod) => onInstantBuy(prod)}
      />

      {/* Login / OTP Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={(userData) => {
          setUser(userData);
          setIsLoginOpen(false);
        }}
      />

      {/* Legal Policies Modal */}
      <PolicyModal
        isOpen={policyModal.isOpen}
        onClose={() => setPolicyModal({ ...policyModal, isOpen: false })}
        initialTab={policyModal.tab}
      />

      {/* Social Proof Purchase Toast (Solid Opaque, No Overlap, No Product Name) */}
      {recentBuyer && (
        <div className="fixed bottom-16 left-3.5 z-40 max-w-[270px] pointer-events-none animate-slideUp">
          <div className="px-3 py-2 rounded-2xl bg-[#131724] border border-emerald-500/40 shadow-2xl shadow-black flex items-center space-x-2.5">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-xs min-w-0">
              <div className="font-bold text-white truncate">
                {recentBuyer.name} <span className="text-slate-400 font-normal text-[11px]">({recentBuyer.city})</span>
              </div>
              <div className="text-[10px] text-emerald-400 font-semibold flex items-center space-x-1">
                <span>Instant Access Unlocked</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400">{recentBuyer.time}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
