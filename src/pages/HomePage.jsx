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
  Award
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
          <HeroSection onExploreClick={() => setSelectedCategory('reels')} />
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

        {/* 7. Why bazara.in? Trust Badges */}
        <section className="px-4 py-4 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 text-center">
            Why 25,000+ Creators Choose bazara.in
          </h3>
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-2xl glass-panel border border-white/[0.06] space-y-1">
              <FolderDown className="w-5 h-5 text-emerald-400" />
              <h4 className="text-xs font-bold text-white">Instant G-Drive</h4>
              <p className="text-[10px] text-slate-400">Direct 1-tap download link sent immediately.</p>
            </div>
            <div className="p-3 rounded-2xl glass-panel border border-white/[0.06] space-y-1">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h4 className="text-xs font-bold text-white">Commercial PLR</h4>
              <p className="text-[10px] text-slate-400">100% legal rights to monetize and resell.</p>
            </div>
            <div className="p-3 rounded-2xl glass-panel border border-white/[0.06] space-y-1">
              <Zap className="w-5 h-5 text-emerald-400" />
              <h4 className="text-xs font-bold text-white">4K 60FPS Clean</h4>
              <p className="text-[10px] text-slate-400">Zero logos, zero watermarks, ready to post.</p>
            </div>
            <div className="p-3 rounded-2xl glass-panel border border-white/[0.06] space-y-1">
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
