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

  // Recent buyer ticker simulation (Conversion booster)
  useEffect(() => {
    const buyers = [
      { name: "Rahul S.", city: "Mumbai", product: "10,000+ Viral Reels Bundle", time: "2m ago" },
      { name: "Aakash V.", city: "Delhi", product: "AI Video Editing Course", time: "4m ago" },
      { name: "Priya M.", city: "Bangalore", product: "Zero to 100K Followers E-Book", time: "1m ago" },
      { name: "Sameer K.", city: "Hyderabad", product: "Ultimate Creator Mega Bundle", time: "just now" }
    ];

    const interval = setInterval(() => {
      const randomBuyer = buyers[Math.floor(Math.random() * buyers.length)];
      setRecentBuyer(randomBuyer);
      setTimeout(() => setRecentBuyer(null), 4000);
    }, 10000);

    return () => clearInterval(interval);
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

      {/* Social Proof Purchase Toast */}
      {recentBuyer && (
        <div className="fixed bottom-20 left-4 z-40 max-w-xs animate-slideUp pointer-events-none">
          <div className="p-2.5 rounded-2xl glass-panel border border-emerald-500/30 bg-[#0c101d]/90 shadow-2xl flex items-center space-x-2.5">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <div className="text-[11px]">
              <span className="font-bold text-white">{recentBuyer.name}</span>
              <span className="text-slate-400"> ({recentBuyer.city}) bought </span>
              <span className="font-semibold text-emerald-400">{recentBuyer.product}</span>
              <div className="text-[9px] text-slate-400">{recentBuyer.time}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
