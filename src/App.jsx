import React, { useState, useEffect } from 'react';
import HomePage from './pages/HomePage';
import CourseLandingPage from './pages/CourseLandingPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import AccessDashboardPage from './pages/AccessDashboardPage';
import AdminPage from './pages/AdminPage';
import ProfilePage from './pages/ProfilePage';
import LoginModal from './components/LoginModal';
import { getProducts, getSettings, createOrder, getCurrentUser } from './supabase';


export default function App() {
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
  }, []);


  // Listen to browser Back/Forward navigation
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPage(getInitialPage());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

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
  const featuredCourse = 
    products.find(p => p.id === featuredCourseId) ||
    products.find(p => p.category === 'course' || p.product_type === 'course') ||
    products[0];

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    navigateTo('product', `/product?id=${product.slug || product.id}`);
  };

  const handleInstantBuy = (product) => {
    setSelectedProduct(product);
    navigateTo('checkout', '/checkout');
  };

  const handlePaymentComplete = async (orderPayload) => {
    const order = await createOrder({
      ...orderPayload,
      userId: user?.id || null
    });
    setCompletedOrder(order);
    navigateTo('access', '/access');
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
        <CourseLandingPage
          course={featuredCourse}
          onEnroll={(courseToBuy) => handleInstantBuy(courseToBuy || featuredCourse)}
          onNavigateToStore={() => navigateTo('home', '/home')}
          settings={settings}
        />
      )}

      {/* 2. STORE MARKETPLACE (bazara.in/home): All digital bundles, search & categories */}
      {currentPage === 'home' && (
        <HomePage
          products={products}
          settings={settings}
          onSelectProduct={handleSelectProduct}
          onInstantBuy={handleInstantBuy}
          onNavigate={handleNavigate}
          user={user}
          setUser={setUser}
        />
      )}

      {/* 3. PRODUCT DETAIL PAGE */}
      {currentPage === 'product' && selectedProduct && (
        <ProductDetailPage
          product={selectedProduct}
          onBack={() => navigateTo('home', '/home')}
          onBuyNow={handleInstantBuy}
        />
      )}

      {/* 4. CHECKOUT PAGE */}
      {currentPage === 'checkout' && selectedProduct && (
        <CheckoutPage
          product={selectedProduct}
          user={user}
          onBack={() => navigateTo(selectedProduct.category === 'course' ? 'landing' : 'home', selectedProduct.category === 'course' ? '/' : '/home')}
          onPaymentComplete={handlePaymentComplete}
        />
      )}

      {/* 5. ACCESS DASHBOARD PAGE */}
      {currentPage === 'access' && (
        <AccessDashboardPage
          order={completedOrder || {
            id: 'ORD-DEMO',
            productTitle: selectedProduct?.title || featuredCourse?.title || 'AI Video Editing Masterclass',
            customerPhone: '9876543210',
            driveUrl: selectedProduct?.drive_download_url || featuredCourse?.drive_download_url || 'https://drive.google.com'
          }}
          onBackToHome={() => navigateTo('landing', '/')}
        />
      )}

      {/* 6. PROFILE / VAULT PAGE */}
      {currentPage === 'profile' && (
        <ProfilePage
          user={user}
          completedOrder={completedOrder}
          onBackToHome={() => navigateTo('home', '/home')}
          onOpenAdmin={() => navigateTo('admin', '/admin')}
          onLoginClick={() => setIsLoginModalOpen(true)}
          onLogout={() => setUser(null)}
        />
      )}

      {/* 7. ADMIN CONTROL PANEL */}
      {currentPage === 'admin' && (
        <AdminPage
          products={products}
          settings={settings}
          onRefresh={refreshData}
          onBack={() => navigateTo('home', '/home')}
        />
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
    </div>
  );
}
