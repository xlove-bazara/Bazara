import React, { useState, useEffect } from 'react';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import AccessDashboardPage from './pages/AccessDashboardPage';
import AdminPage from './pages/AdminPage';
import ProfilePage from './pages/ProfilePage';
import LoginModal from './components/LoginModal';
import { getProducts, getSettings, createOrder } from './supabase';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home'); // 'home' | 'product' | 'checkout' | 'access' | 'admin' | 'profile'
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
      setLoading(false);
    })();
  }, []);

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setCurrentPage('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInstantBuy = (product) => {
    setSelectedProduct(product);
    setCurrentPage('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePaymentComplete = async (orderPayload) => {
    const order = await createOrder({
      ...orderPayload,
      userId: user?.id || null
    });
    setCompletedOrder(order);
    setCurrentPage('access');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (tab) => {
    if (tab === 'home') {
      setCurrentPage('home');
    } else if (tab === 'deals') {
      setCurrentPage('home');
    } else if (tab === 'library') {
      if (completedOrder) {
        setCurrentPage('access');
      } else {
        alert('You haven\'t purchased any bundles yet. Unlock any digital pack to access your downloads!');
      }
    } else if (tab === 'profile') {
      setCurrentPage('profile');
    } else if (tab === 'admin') {
      setCurrentPage('admin');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#08090E] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-2 border-emerald-500/30 border-t-emerald-400 animate-spin" />
        <div className="flex items-center space-x-1.5">
          <span className="text-sm font-black text-white uppercase tracking-wider">bazara</span>
          <span className="text-xs font-bold text-emerald-400">.in</span>
        </div>
        <p className="text-xs text-slate-400">Loading ultra-premium digital store...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08090E] text-slate-100">
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

      {currentPage === 'product' && selectedProduct && (
        <ProductDetailPage
          product={selectedProduct}
          onBack={() => setCurrentPage('home')}
          onBuyNow={handleInstantBuy}
        />
      )}

      {currentPage === 'checkout' && selectedProduct && (
        <CheckoutPage
          product={selectedProduct}
          user={user}
          onBack={() => setCurrentPage('product')}
          onPaymentComplete={handlePaymentComplete}
        />
      )}

      {currentPage === 'access' && (
        <AccessDashboardPage
          order={completedOrder || {
            id: 'ORD-DEMO',
            productTitle: selectedProduct?.title || '10,000+ Viral Reels Bundle',
            customerPhone: '9876543210',
            driveUrl: selectedProduct?.drive_download_url || 'https://drive.google.com'
          }}
          onBackToHome={() => setCurrentPage('home')}
        />
      )}

      {currentPage === 'profile' && (
        <ProfilePage
          user={user}
          completedOrder={completedOrder}
          onBackToHome={() => setCurrentPage('home')}
          onOpenAdmin={() => setCurrentPage('admin')}
          onLoginClick={() => setIsLoginModalOpen(true)}
          onLogout={() => setUser(null)}
        />
      )}

      {currentPage === 'admin' && (
        <AdminPage
          products={products}
          settings={settings}
          onRefresh={refreshData}
          onBack={() => setCurrentPage('home')}
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
