import React, { useState, useEffect } from 'react';
import HomePage from './pages/HomePage';
import CourseLandingPage from './pages/CourseLandingPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import AccessDashboardPage from './pages/AccessDashboardPage';
import AdminPage from './pages/AdminPage';
import ProfilePage from './pages/ProfilePage';
import LoginModal from './components/LoginModal';
import PolicyModal from './components/PolicyModal';
import { getProducts, getSettings, createOrder, getCurrentUser, signOutUser, supabase } from './supabase';
import { initialProducts } from './data/initialProducts';
import { sendOrderDeliveryEmail } from './services/emailService';
import { sendWhatsAppOrderDelivery } from './services/whatsappService';




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
    const path = window.location.pathname.toLowerCase().replace(/\/+$/, '') || '/';
    if (path === '/home') return 'home';
    if (path === '/checkout') return 'checkout';
    if (path === '/access') return 'access';
    if (path === '/admin') return 'admin';
    if (path === '/profile') return 'profile';
    if (path === '/product') return 'product';
    return 'landing'; // Default root '/' is the single course landing page
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


  const refreshData = async () => {
    const prods = await getProducts();
    const sett = await getSettings();
    setProducts(prods);
    setSettings(sett);
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await refreshData();
      const currentUser = await getCurrentUser();
      if (currentUser) setUser(currentUser);
      setLoading(false);
    })();

    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          const formattedUser = {
            id: session.user.id,
            email: session.user.email,
            phone: session.user.phone,
            name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
            avatar: session.user.user_metadata?.avatar_url
          };
          setUser(formattedUser);
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
          setUser(null);
          localStorage.removeItem('bazara_current_user');
        }
      });
      return () => subscription.unsubscribe();

    }
  }, []);


  // Listen to browser Back/Forward navigation
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPage(getInitialPage());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

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
    navigateTo('product', `/product?id=${product.slug || product.id}`);
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

    // Automatically send official Google Drive delivery email via Brevo
    if (orderPayload.customerEmail) {
      sendOrderDeliveryEmail({
        customerEmail: orderPayload.customerEmail,
        customerName: orderPayload.customerName || user?.name,
        productTitle: orderPayload.productTitle,
        driveUrl: orderPayload.driveUrl,
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
        driveUrl: orderPayload.driveUrl
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
    return (
      <div className="min-h-screen bg-[#08090E] flex flex-col items-center justify-center space-y-4">
        <div className="relative">
          <img src="/logo.png" alt="bazara.in" className="w-14 h-14 rounded-2xl object-contain shadow-2xl shadow-indigo-500/30 animate-pulse" />
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="text-sm font-black text-white uppercase tracking-wider">bazara</span>
          <span className="text-xs font-bold text-emerald-400">.in</span>
        </div>
        <p className="text-xs text-slate-400">Loading ultra-premium digital learning platform...</p>
      </div>
    );

  }

  return (
    <div className="min-h-screen bg-[#08090E] text-slate-100">
      {/* 1. ROOT LANDING PAGE (bazara.in /): Single Course Landing Page with About bazara & FAQs */}
      {currentPage === 'landing' && (
        <div key="landing" className="animate-page-enter">
          <CourseLandingPage
            course={featuredCourse}
            onEnroll={(courseToBuy) => handleInstantBuy(courseToBuy || featuredCourse)}
            onNavigateToStore={() => navigateTo('home', '/home')}
            settings={settings}
          />
        </div>
      )}

      {/* 2. STORE MARKETPLACE (bazara.in/home): All digital bundles, search & categories */}
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
            <div className="min-h-screen flex flex-col items-center justify-center space-y-3 bg-[#08090E] text-slate-400">
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
              onBack={() => navigateTo(selectedProduct.category === 'course' ? 'landing' : 'home', selectedProduct.category === 'course' ? '/' : '/home')}
              onPaymentComplete={handlePaymentComplete}
            />
          ) : (
            <div className="min-h-screen flex flex-col items-center justify-center space-y-3 bg-[#08090E] text-slate-400">
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
          />
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
  );
}

