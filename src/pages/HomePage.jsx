import React, { useState, useEffect } from 'react';
import MarqueeTicker from '../components/MarqueeTicker';
import Header from '../components/Header';
import StoryCategories from '../components/StoryCategories';
import HeroSection from '../components/HeroSection';
import BentoProductGrid from '../components/BentoProductGrid';
import BottomDock from '../components/BottomDock';
import QuickViewModal from '../components/QuickViewModal';
import LoginModal from '../components/LoginModal';
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
      />

      <main className="max-w-md mx-auto space-y-4 pt-1">
        {/* 3. Instagram-Style Story Categories Slider */}
        <StoryCategories
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
        />

        {/* 4. Hero Conversion Section */}
        {selectedCategory === 'all' && !searchQuery && (
          <>
            <HeroSection onExploreClick={() => setSelectedCategory('reels')} />

            {/* Live Stats Strip */}
            <div className="grid grid-cols-4 gap-1.5 px-4 text-center">
              <div className="p-2.5 rounded-2xl bg-[#131724] border border-white/[0.06] shadow-md">
                <span className="text-sm font-black text-emerald-400 block">100K+</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase">Downloads</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-[#131724] border border-white/[0.06] shadow-md">
                <span className="text-sm font-black text-amber-400 block">4.9 ★</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase">Rating</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-[#131724] border border-white/[0.06] shadow-md">
                <span className="text-sm font-black text-indigo-400 block">25K+</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase">Creators</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-[#131724] border border-white/[0.06] shadow-md">
                <span className="text-sm font-black text-teal-400 block">100%</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase">PLR Rights</span>
              </div>
            </div>
          </>
        )}

        {/* 5. Limited-Time Flash Deal Countdown Card */}
        {selectedCategory === 'all' && !searchQuery && (
          <div className="px-4">
            <div className="rounded-2xl p-3.5 glass-panel border border-rose-500/20 bg-gradient-to-r from-rose-950/30 via-purple-950/20 to-transparent flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
                  <Clock className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-xs font-black text-rose-400 uppercase tracking-wider">FLASH SALE</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-500 text-slate-950 font-bold">ENDS TODAY</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Get 90% OFF on all digital assets</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedCategory('flash_sale')}
                className="px-3 py-1.5 rounded-full text-xs font-bold bg-rose-500 hover:bg-rose-400 text-slate-950 shadow-md active:scale-95 transition-all"
              >
                Claim Deal
              </button>
            </div>
          </div>
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

        {/* ⭐ 7. FEATURED SUPER VAULT SPOTLIGHT BANNER */}
        {selectedCategory === 'all' && !searchQuery && (
          <section className="px-4 py-2">
            <div className="relative overflow-hidden rounded-3xl p-5 bg-gradient-to-br from-indigo-950/70 via-[#131724] to-emerald-950/50 border border-emerald-500/30 shadow-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500 text-slate-950">
                  ⚡ 90% OFF MEGA COMBO
                </span>
                <span className="text-xs font-bold text-emerald-400 flex items-center">
                  <Sparkles className="w-3.5 h-3.5 mr-1" /> All-in-One Vault
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-black text-white leading-tight">
                  The Ultimate Creator Mega Bundle
                </h3>
                <p className="text-xs text-slate-300 leading-snug">
                  Get instant access to 15,000+ 4K Reels + 5 Masterclasses + 10 E-Books + 500+ CapCut Presets in one master Drive folder.
                </p>
              </div>

              <div className="flex items-baseline space-x-2 pt-1">
                <span className="text-2xl font-black text-emerald-400">₹499</span>
                <span className="text-sm text-slate-400 line-through">₹4,999</span>
                <span className="text-xs font-bold text-amber-400">Save ₹4,500 Today</span>
              </div>

              <button
                onClick={() => {
                  const combo = products.find(p => p.slug.includes('mega-bundle') || p.id.includes('combo')) || products[0];
                  onSelectProduct(combo);
                }}
                className="w-full py-3 rounded-full font-black text-xs uppercase tracking-wider text-slate-950 bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-400 shadow-xl shadow-emerald-500/30 active:scale-95 transition-all flex items-center justify-center space-x-1.5"
              >
                <span>Unlock Complete Mega Vault Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </section>
        )}

        {/* ⭐ 8. HOW IT WORKS (3 Simple Steps) */}
        <section className="px-4 py-3 space-y-3">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 text-center">
            How It Works • 3 Simple Steps
          </h3>
          <div className="space-y-2">
            <div className="p-3.5 rounded-2xl bg-[#131724] border border-white/[0.08] flex items-center space-x-3.5 shadow-md">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-black text-xs shrink-0">
                1
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Choose Your Digital Asset</h4>
                <p className="text-[11px] text-slate-400">Pick from viral 4K reels packs, masterclass courses, or e-books.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#131724] border border-white/[0.08] flex items-center space-x-3.5 shadow-md">
              <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-black text-xs shrink-0">
                2
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">1-Tap Fast Checkout</h4>
                <p className="text-[11px] text-slate-400">Pay securely via UPI (GPay, PhonePe, Paytm) or Cards.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#131724] border border-white/[0.08] flex items-center space-x-3.5 shadow-md">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-black text-xs shrink-0">
                3
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Instant Google Drive Access</h4>
                <p className="text-[11px] text-slate-400">Direct download link delivered on your WhatsApp & screen instantly!</p>
              </div>
            </div>
          </div>
        </section>

        {/* ⭐ 9. CREATOR WALL OF LOVE (Real Customer Reviews) */}
        <section className="px-4 py-3 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
              Creator Reviews & Proof
            </h3>
            <span className="text-[11px] text-emerald-400 font-bold">★ 4.9 Verified Rating</span>
          </div>

          <div className="space-y-2.5">
            <div className="p-4 rounded-2xl bg-[#131724] border border-white/[0.08] space-y-2 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-xs">
                    A
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Aman Sharma</span>
                    <span className="text-[10px] text-slate-400">Mumbai • Instagram Creator</span>
                  </div>
                </div>
                <div className="flex text-amber-400 text-xs">★★★★★</div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                "Grew my motivation page from 2k to 85k followers in just 35 days using the 4K Luxury Reels pack. Zero watermarks and the quality is insane!"
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#131724] border border-white/[0.08] space-y-2 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-full bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center text-xs">
                    R
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Ritika Patel</span>
                    <span className="text-[10px] text-slate-400">Delhi • Video Editor</span>
                  </div>
                </div>
                <div className="flex text-amber-400 text-xs">★★★★★</div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                "The AI video editing masterclass and CapCut XML presets saved me at least 15 hours every single week for client projects. 100% worth every rupee."
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#131724] border border-white/[0.08] space-y-2 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-xs">
                    S
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Sameer Khan</span>
                    <span className="text-[10px] text-slate-400">Bangalore • Digital Marketer</span>
                  </div>
                </div>
                <div className="flex text-amber-400 text-xs">★★★★★</div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                "Bought the bundle with commercial PLR rights. Already generated ₹18,000 reselling with my own branding. Customer support on WhatsApp is super fast!"
              </p>
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
          <div className="flex items-center justify-center space-x-1">
            <span className="text-base font-black text-white">bazara</span>
            <span className="text-xs font-bold text-emerald-400">.in</span>
          </div>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            India's #1 Premium Store for Viral Reels Bundles, Video Courses & Digital Assets.
          </p>
          <div className="text-[11px] text-slate-400 flex items-center justify-center space-x-4">
            <span className="hover:text-slate-200 cursor-pointer">Refund Policy</span>
            <span>•</span>
            <span className="hover:text-slate-200 cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-slate-200 cursor-pointer">WhatsApp Support</span>
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
