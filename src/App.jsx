import React, { useState, useEffect } from 'react';
import HomePage from './pages/HomePage';
import CourseLandingPage from './pages/CourseLandingPage';
import AiMasteryLandingPage from './pages/AiMasteryLandingPage';
import VideoEditingLandingPage from './pages/VideoEditingLandingPage';
import FollowersGrowthPage from './pages/FollowersGrowthPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import AccessDashboardPage from './pages/AccessDashboardPage';
import AdminPage from './pages/AdminPage';
import ProfilePage from './pages/ProfilePage';
import WhatsAppCrmPage from './pages/WhatsAppCrmPage';
import MaintenanceModePage from './pages/MaintenanceModePage';
import LoginModal from './components/LoginModal';
import PolicyModal from './components/PolicyModal';
import { getProducts, getSettings, updateSettings, createOrder, getCurrentUser, signOutUser, supabase, checkAdminSession } from './supabase';
import { initialProducts } from './data/initialProducts';
import { sendOrderDeliveryEmail } from './services/emailService';
import { sendWhatsAppOrderDelivery } from './services/whatsappService';
import { trackPageView, trackPurchase } from './services/metaPixel';
import { Lock, Unlock, X } from 'lucide-react';




export default function App() {
  const getPolicyTabFromPath = () => {
    const path = window.location.pathname.toLowerCase();
    if (path.includes('privacy')) return 'privacy';
    if (path.includes('terms')) return 'terms';
    if (path.includes('refund')) return 'refund';
    if (path.includes('shipping') || path.includes('delivery')) return 'shipping';
    if (path.includes('contact')) return 'contact';
    return null;
  };

  // Determine initial page from URL pathname
  const getInitialPage = () => {
    const rawPath = window.location.pathname.toLowerCase().split('?')[0].replace(/\/+$/, '') || '/';
    if (rawPath === '/home') return 'home';
    if (rawPath === '/checkout') return 'checkout';
    if (rawPath === '/access') return 'access';
    if (rawPath === '/admin') return 'admin';
    if (rawPath === '/crm' || rawPath === '/whatsapp-crm' || rawPath === '/inbox') return 'crm';
    if (rawPath === '/profile') return 'profile';
    if (rawPath === '/product') return 'product';
    if (rawPath.includes('follow') || rawPath.includes('smm') || rawPath.includes('growth') || rawPath.includes('boost')) return 'followers';
    if (rawPath === '/ai-mastery-hindi' || rawPath === '/ai-mastery' || rawPath === '/bundle' || rawPath === '/ebooks') return 'ai-mastery';
    if (rawPath === '/video-editing' || rawPath === '/editpro' || rawPath === '/editing' || rawPath === '/assets' || rawPath === '/combo') return 'video-editing';
    return 'landing'; // Default root '/'
  };

  const [currentPage, setCurrentPage] = useState(getInitialPage);
  const [products, setProducts] = useState([]);
  const [settings, setSettings] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(Boolean(getPolicyTabFromPath()));
  const [policyInitialTab, setPolicyInitialTab] = useState(getPolicyTabFromPath() || 'terms');
  const [isAdminPreviewActive, setIsAdminPreviewActive] = useState(() => {
    try {
      return localStorage.getItem('bazara_admin_preview_active') === 'true';
    } catch (e) {
      return false;
    }
  });


  const refreshData = async () => {
    try {
      const prods = await getProducts();
      const sett = await getSettings();
      if (prods && Array.isArray(prods)) setProducts(prods);
      if (sett) setSettings(sett);
    } catch (err) {
      console.warn('refreshData error:', err);
    }
  };

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setLoading(true);
        // Guarantee max 2.5s wait time so loading screen never hangs on network latency or Supabase failure
        const dataPromise = refreshData();
        const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 2500));
        await Promise.race([dataPromise, timeoutPromise]);

        const currentUser = await getCurrentUser();
        if (isMounted && currentUser) setUser(currentUser);
      } catch (e) {
        console.warn('Initialization error:', e);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    if (supabase && supabase.auth) {
      const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
        try {
          if (session?.user) {
            const formattedUser = {
              id: session.user.id,
              email: session.user.email,
              phone: session.user.phone,
              name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
              avatar: session.user.user_metadata?.avatar_url
            };
            if (isMounted) setUser(formattedUser);
            localStorage.setItem('bazara_current_user', JSON.stringify(formattedUser));

            // Clean up hash (#access_token=...) and navigate back to original page (e.g. /home)
            try {
              const returnUrl = localStorage.getItem('bazara_auth_return_url');
              if (returnUrl) {
                localStorage.removeItem('bazara_auth_return_url');
                window.history.replaceState({}, '', returnUrl);
                const cleanPath = returnUrl.split('?')[0].toLowerCase();
                if (cleanPath === '/home') setCurrentPage('home');
                else if (cleanPath === '/checkout') setCurrentPage('checkout');
                else if (cleanPath === '/access') setCurrentPage('access');
                else if (cleanPath === '/profile') setCurrentPage('profile');
                else if (cleanPath === '/admin') setCurrentPage('admin');
              } else if (window.location.hash && window.location.hash.includes('access_token')) {
                window.history.replaceState({}, '', window.location.pathname + window.location.search);
              }
            } catch (e) {}
          } else if (event === 'SIGNED_OUT') {
            if (isMounted) setUser(null);
            localStorage.removeItem('bazara_current_user');
          }
        } catch (authErr) {
          console.warn('Auth change handler error:', authErr);
        }
      });
      return () => {
        isMounted = false;
        if (data?.subscription) {
          try {
            data.subscription.unsubscribe();
          } catch (e) {}
        }
      };
    }

    return () => {
      isMounted = false;
    };
  }, []);


  // Listen to browser Back/Forward navigation
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPage(getInitialPage());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Track Meta Pixel PageView on page change
  useEffect(() => {
    trackPageView(currentPage);
  }, [currentPage]);

  // Restore selectedProduct from URL query parameter on refresh or direct link visit
  useEffect(() => {
    if (products && products.length > 0) {
      const params = new URLSearchParams(window.location.search);
      const prodIdOrSlug = params.get('id') || params.get('product') || params.get('p');

      if (prodIdOrSlug) {
        const matched = products.find(p => 
          String(p.id).toLowerCase() === prodIdOrSlug.toLowerCase() || 
          (p.slug && String(p.slug).toLowerCase() === prodIdOrSlug.toLowerCase())
        );
        if (matched) {
          setSelectedProduct(matched);
          return;
        }
      }

      // If on product or checkout page and no product matched or selected yet, select default
      if (!selectedProduct && (currentPage === 'product' || currentPage === 'checkout')) {
        const fallback = 
          products.find(p => p.category === 'course' || p.product_type === 'course') ||
          products[0];
        if (fallback) {
          setSelectedProduct(fallback);
        }
      }
    }
  }, [products, currentPage]);

  // Helper to change page and push history state
  const navigateTo = (page, pathUrl) => {
    setCurrentPage(page);
    if (pathUrl) {
      window.history.pushState({}, '', pathUrl);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Find featured course for the root landing page
  const featuredCourseId = settings?.featured_course_id || 'prod-course-ai';
  const defaultMasterclassCourse = initialProducts.find(p => p.id === 'prod-course-ai') || initialProducts[1];
  const featuredCourse = 
    products.find(p => p.id === featuredCourseId) ||
    products.find(p => p.category === 'course' || p.product_type === 'course') ||
    defaultMasterclassCourse;

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    if (product.id === 'prod-ai-mastery-hindi' || product.slug === 'ai-mastery-hindi-ebook-bundle') {
      navigateTo('ai-mastery', `/ai-mastery-hindi`);
    } else if (
      product.id === 'prod-editor-combo' || 
      product.id === 'prod-editing-assets' || 
      product.id === 'prod-editing-course' || 
      product.id === 'prod-capcut-pro' ||
      product.slug === 'complete-editor-combo' ||
      product.slug === 'premium-editing-assets' ||
      product.slug === 'video-editing-mega-course' ||
      product.slug === 'capcut-pro-software'
    ) {
      navigateTo('video-editing', '/video-editing');
    } else {
      navigateTo('product', `/product?id=${product.slug || product.id}`);
    }
  };

  const handleInstantBuy = (product) => {
    setSelectedProduct(product);
    navigateTo('checkout', `/checkout?id=${product.slug || product.id}`);
  };

  const handlePaymentComplete = async (orderPayload) => {
    const order = await createOrder({
      ...orderPayload,
      userId: user?.id || null
    });
    setCompletedOrder(order);

    // Track verified Purchase conversion in Meta Pixel & CAPI (with duplicate protection)
    trackPurchase(order);

    // Automatically send official Google Drive delivery email via Brevo
    if (orderPayload.customerEmail) {
      sendOrderDeliveryEmail({
        customerEmail: orderPayload.customerEmail,
        customerName: orderPayload.customerName || user?.name,
        productTitle: orderPayload.productTitle,
        driveUrl: orderPayload.driveUrl,
        upsellIncluded: orderPayload.upsellIncluded,
        upsellTitle: orderPayload.upsellTitle,
        upsellDriveUrl: orderPayload.upsellDriveUrl,
        orderId: order.id,
        amount: orderPayload.amount
      }).catch(err => console.warn('Automated delivery email failed:', err));
    }

    // Automatically send official Google Drive delivery WhatsApp message
    if (orderPayload.customerPhone) {
      sendWhatsAppOrderDelivery({
        customerPhone: orderPayload.customerPhone,
        customerName: orderPayload.customerName || user?.name,
        productTitle: orderPayload.productTitle,
        driveUrl: orderPayload.driveUrl,
        upsellIncluded: orderPayload.upsellIncluded,
        upsellTitle: orderPayload.upsellTitle,
        upsellDriveUrl: orderPayload.upsellDriveUrl
      }).catch(err => console.warn('Automated WhatsApp delivery failed:', err));
    }

    navigateTo('access', '/access');
  };

  const handleUserLogout = async () => {
    await signOutUser();
    setUser(null);
    navigateTo('home', '/home');
  };



  const handleNavigate = (tab) => {
    if (tab === 'landing') {
      navigateTo('landing', '/');
    } else if (tab === 'home' || tab === 'deals') {
      navigateTo('home', '/home');
    } else if (tab === 'video-editing' || tab === 'editing') {
      navigateTo('video-editing', '/video-editing');
    } else if (tab === 'ai-mastery' || tab === 'ebook') {
      navigateTo('ai-mastery', '/ai-mastery-hindi');
    } else if (tab === 'followers' || tab === 'smm' || tab === 'growth') {
      navigateTo('followers', '/followers');
    } else if (tab === 'library') {
      if (completedOrder) {
        navigateTo('access', '/access');
      } else {
        alert('Aapne abhi koi digital bundle ya course purchase nahi kiya hai. Download access ke liye pehle enroll karein!');
      }
    } else if (tab === 'profile') {
      navigateTo('profile', '/profile');
    } else if (tab === 'admin') {
      navigateTo('admin', '/admin');
    }
  };

  if (loading) {
    const isFollowersPath = 
      currentPage === 'followers' || 
      window.location.pathname.toLowerCase().includes('follow') || 
      window.location.pathname.toLowerCase().includes('smm') ||
      window.location.pathname.toLowerCase().includes('growth') ||
      window.location.pathname.toLowerCase().includes('boost');

    if (isFollowersPath) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 flex flex-col items-center justify-center p-6 text-center select-none">
          <div className="relative mb-5">
            <div className="absolute -inset-3 bg-gradient-to-r from-purple-500/25 via-pink-500/20 to-emerald-500/25 rounded-3xl blur-xl animate-pulse" />
            <img 
              src="/logo.png?v=2" 
              alt="bazara.in" 
              className="relative w-16 h-16 rounded-2xl object-contain shadow-xl shadow-purple-500/15 animate-pulse" 
            />
          </div>

          <div className="flex items-center justify-center space-x-1.5 mb-2.5">
            <span className="text-lg font-black text-slate-900 tracking-wider">BAZARA</span>
            <span className="text-base font-black text-emerald-600">.in</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/90 mb-3 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-[11px] font-extrabold text-emerald-700 uppercase tracking-wider">
              India's #1 Social Media Growth Hub
            </span>
          </div>

          <p className="text-xs font-semibold text-slate-600 tracking-wide max-w-xs">
            Connecting to high-speed secure growth server...
          </p>

          <div className="w-48 h-1.5 bg-slate-100 rounded-full overflow-hidden mt-4 border border-slate-200/80 shadow-inner">
            <div className="h-full bg-gradient-to-r from-purple-600 via-pink-500 to-emerald-500 w-full animate-pulse rounded-full" />
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-transparent flex flex-col items-center justify-center space-y-4">
        <div className="relative">
          <img src="/logo.png?v=2" alt="bazara.in" className="w-14 h-14 rounded-2xl object-contain shadow-2xl shadow-indigo-500/30 animate-pulse" />
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="text-sm font-black text-white uppercase tracking-wider">bazara</span>
          <span className="text-xs font-bold text-emerald-400">.in</span>
        </div>
        <p className="text-xs text-slate-400">Loading ultra-premium digital learning platform...</p>
      </div>
    );
  }

  const aiMasteryProduct = 
    products.find(p => p.id === 'prod-ai-mastery-hindi' || p.slug === 'ai-mastery-hindi-ebook-bundle') ||
    initialProducts.find(p => p.id === 'prod-ai-mastery-hindi') ||
    initialProducts[0];

  const isMaintenanceActive = Boolean(settings?.is_maintenance_mode);
  let isViewingAsVisitor = false;
  try {
    isViewingAsVisitor = sessionStorage.getItem('bazara_view_as_visitor') === 'true';
  } catch (e) {}

  const isAuthorizedPreview = !isViewingAsVisitor && (isAdminPreviewActive || checkAdminSession());

  // If Store is Locked and Visitor is NOT authorized with admin passcode -> show Maintenance Screen
  if (isMaintenanceActive && !isAuthorizedPreview && currentPage !== 'admin' && currentPage !== 'crm') {
    return (
      <MaintenanceModePage
        settings={settings}
        onUnlockPreview={() => {
          try {
            sessionStorage.removeItem('bazara_view_as_visitor');
            localStorage.setItem('bazara_admin_preview_active', 'true');
          } catch (e) {}
          setIsAdminPreviewActive(true);
        }}
        onAdminLogin={() => {
          try {
            sessionStorage.removeItem('bazara_view_as_visitor');
          } catch (e) {}
          navigateTo('admin', '/admin');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen relative bg-transparent text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-300">
      
      {/* Persistent Store Lock / Maintenance Mode Active Banner (When Previewing) */}
      {isMaintenanceActive && (
        <div className="sticky top-0 z-50 w-full bg-gradient-to-r from-amber-600 via-rose-600 to-amber-700 text-white px-3 sm:px-6 py-2.5 flex items-center justify-between text-xs font-bold shadow-2xl border-b border-white/20">
          <div className="flex items-center space-x-2 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping shrink-0" />
            <Lock className="w-4 h-4 shrink-0 text-amber-200" />
            <span className="truncate">
              MAINTENANCE MODE IS ACTIVE (Customers see Upgrading screen • You are in Admin Live Preview)
            </span>
          </div>
          <div className="flex items-center space-x-2 shrink-0 ml-2">
            {currentPage !== 'admin' && (
              <button
                onClick={() => navigateTo('admin', '/admin')}
                className="px-3 py-1 rounded-lg bg-black/40 hover:bg-black/60 text-white font-bold text-[11px] border border-white/20 transition-all cursor-pointer"
              >
                Admin Dashboard
              </button>
            )}
            <button
              onClick={async () => {
                const updated = { ...settings, is_maintenance_mode: false };
                await updateSettings(updated);
                await refreshData();
              }}
              className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-[11px] shadow-sm transition-all cursor-pointer flex items-center space-x-1"
            >
              <Unlock className="w-3 h-3" />
              <span>Turn Off Maintenance</span>
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('bazara_admin_preview_active');
                setIsAdminPreviewActive(false);
              }}
              className="p-1 rounded-lg hover:bg-black/30 text-white/80 hover:text-white transition-all cursor-pointer"
              title="Exit Preview Mode"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Global Luxury Ambient Lighting & Vignette Layer (matches reference screenshot) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        {/* Soft Top Forest Teal/Cyan Glow */}
        <div className="absolute -top-[180px] left-1/2 -translate-x-1/2 w-[850px] max-w-[120vw] h-[500px] bg-teal-500/[0.08] rounded-full blur-[130px]" />
        {/* Deep Midnight Indigo Aura on Right */}
        <div className="absolute -top-[80px] -right-[120px] w-[500px] h-[500px] bg-indigo-600/[0.08] rounded-full blur-[140px]" />
        {/* Subtle Mid-Screen Emerald Bloom */}
        <div className="absolute top-[42%] -left-[160px] w-[450px] h-[450px] bg-emerald-600/[0.06] rounded-full blur-[150px]" />
        {/* Subtle Bottom Ambient Depth */}
        <div className="absolute -bottom-[150px] right-1/4 w-[600px] h-[450px] bg-indigo-900/[0.08] rounded-full blur-[160px]" />
        {/* Micro-luminous Top Rim Light */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-teal-400/25 to-transparent" />
      </div>

      <div className="relative z-10">
        {/* 1. DEDICATED VIDEO EDITING / EDITPRO LANDING PAGE */}
        {currentPage === 'video-editing' && (
          <div key="video-editing" className="animate-page-enter">
            <VideoEditingLandingPage
              onBuyProduct={(prod) => handleInstantBuy(prod)}
              onNavigateToStore={() => navigateTo('home', '/home')}
              settings={settings}
            />
          </div>
        )}

        {/* 2. DEDICATED AI MASTERY HINDI LANDING PAGE */}
        {currentPage === 'ai-mastery' && (
          <div key="ai-mastery" className="animate-page-enter">
            <AiMasteryLandingPage
              product={aiMasteryProduct}
              onEnroll={(bundleToBuy) => handleInstantBuy(bundleToBuy || aiMasteryProduct)}
              onNavigateToStore={() => navigateTo('home', '/home')}
              settings={settings}
            />
          </div>
        )}

        {/* 2.5 DEDICATED INSTAGRAM FOLLOWERS & SMM GROWTH PAGE */}
        {currentPage === 'followers' && (
          <div key="followers" className="animate-page-enter">
            <FollowersGrowthPage
              onBuyProduct={(prod) => handleInstantBuy(prod)}
              onNavigateToStore={() => navigateTo('home', '/home')}
              settings={settings}
            />
          </div>
        )}

        {/* 3. ROOT LANDING PAGE (/): Defaults to Video Editing / EditPro Store */}
        {currentPage === 'landing' && (
          <div key="landing" className="animate-page-enter">
            {settings?.featured_course_id === 'prod-ai-mastery-hindi' ? (
              <AiMasteryLandingPage
                product={aiMasteryProduct}
                onEnroll={(bundleToBuy) => handleInstantBuy(bundleToBuy || aiMasteryProduct)}
                onNavigateToStore={() => navigateTo('home', '/home')}
                settings={settings}
              />
            ) : settings?.featured_course_id === 'prod-course-ai' ? (
              <CourseLandingPage
                course={featuredCourse}
                onEnroll={(courseToBuy) => handleInstantBuy(courseToBuy || featuredCourse)}
                onNavigateToStore={() => navigateTo('home', '/home')}
                settings={settings}
              />
            ) : (
              <VideoEditingLandingPage
                onBuyProduct={(prod) => handleInstantBuy(prod)}
                onNavigateToStore={() => navigateTo('home', '/home')}
                settings={settings}
              />
            )}
          </div>
        )}

        {/* 3. STORE MARKETPLACE (bazara.in/home): All digital bundles, search & categories */}
        {currentPage === 'home' && (
          <div key="home" className="animate-page-enter">
            <HomePage
              products={products}
            settings={settings}
            onSelectProduct={handleSelectProduct}
            onInstantBuy={handleInstantBuy}
            onNavigate={handleNavigate}
            user={user}
            setUser={setUser}
          />
        </div>
      )}

      {/* 3. PRODUCT DETAIL PAGE */}
      {currentPage === 'product' && (
        <div key={`product-${selectedProduct?.id || 'loading'}`} className="animate-page-enter">
          {selectedProduct ? (
            <ProductDetailPage
              product={selectedProduct}
              user={user}
              onNavigate={handleNavigate}
              onOpenLogin={() => setIsLoginModalOpen(true)}
              onBack={() => navigateTo('home', '/home')}
              onBuyNow={handleInstantBuy}
            />
          ) : (
            <div className="min-h-screen flex flex-col items-center justify-center space-y-3 bg-transparent text-slate-400">
              <div className="w-8 h-8 rounded-full border-2 border-emerald-400/20 border-t-emerald-400 animate-spin" />
              <p className="text-xs font-semibold tracking-wider uppercase text-slate-500">Loading Product...</p>
            </div>
          )}
        </div>
      )}

        {/* 4. CHECKOUT PAGE */}
        {currentPage === 'checkout' && (
          <div key={`checkout-${selectedProduct?.id || 'loading'}`} className="animate-page-enter">
            {selectedProduct ? (
              <CheckoutPage
                product={selectedProduct}
                user={user}
                onBack={() => {
                  if (selectedProduct?.id === 'prod-ai-mastery-hindi' || selectedProduct?.slug === 'ai-mastery-hindi-ebook-bundle') {
                    navigateTo('ai-mastery', '/ai-mastery-hindi');
                  } else {
                    navigateTo('video-editing', '/video-editing');
                  }
                }}
                onPaymentComplete={handlePaymentComplete}
              />
            ) : (
            <div className="min-h-screen flex flex-col items-center justify-center space-y-3 bg-transparent text-slate-400">
              <div className="w-8 h-8 rounded-full border-2 border-emerald-400/20 border-t-emerald-400 animate-spin" />
              <p className="text-xs font-semibold tracking-wider uppercase text-slate-500">Loading Checkout...</p>
            </div>
          )}
        </div>
      )}

      {/* 5. ACCESS DASHBOARD PAGE */}
      {currentPage === 'access' && (
        <div key="access" className="animate-page-enter">
          <AccessDashboardPage
            order={completedOrder || {
              id: 'ORD-DEMO',
              productTitle: selectedProduct?.title || featuredCourse?.title || 'AI Video Editing Masterclass',
              customerPhone: '9876543210',
              driveUrl: selectedProduct?.drive_download_url || featuredCourse?.drive_download_url || 'https://drive.google.com'
            }}
            onBackToHome={() => navigateTo('landing', '/')}
          />
        </div>
      )}

      {/* 6. PROFILE / VAULT PAGE */}
      {currentPage === 'profile' && (
        <div key="profile" className="animate-page-enter">
          <ProfilePage
            user={user}
            setUser={setUser}
            completedOrder={completedOrder}
            onBackToHome={() => navigateTo('home', '/home')}
            onLoginClick={() => setIsLoginModalOpen(true)}
            onLogout={handleUserLogout}
          />
        </div>
      )}

      {/* 7. ADMIN CONTROL PANEL */}
      {currentPage === 'admin' && (
        <div key="admin" className="animate-page-enter">
          <AdminPage
            products={products}
            settings={settings}
            onRefresh={refreshData}
            onBack={() => navigateTo('home', '/home')}
            onOpenCrm={() => navigateTo('crm', '/crm')}
          />
        </div>
      )}

      {/* 8. WHATSAPP CRM & INBOX */}
      {currentPage === 'crm' && (
        <div key="crm" className="animate-page-enter">
          <WhatsAppCrmPage onBack={() => navigateTo('admin', '/admin')} />
        </div>
      )}

      {/* Global Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={(userData) => {
          setUser(userData);
          setIsLoginModalOpen(false);
        }}
      />

      {/* Direct Policy Modal for Google / Payment Compliance */}
      <PolicyModal
        isOpen={isPolicyModalOpen}
        onClose={() => setIsPolicyModalOpen(false)}
        initialTab={policyInitialTab}
      />
      </div>
    </div>
  );
}

