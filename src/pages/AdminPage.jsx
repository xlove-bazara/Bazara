import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  ArrowLeft, 
  Save, 
  X, 
  Layers, 
  Film, 
  BookOpen, 
  Monitor, 
  Sparkles, 
  Check, 
  Settings,
  FolderDown,
  RefreshCw,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  ExternalLink,
  ShieldCheck,
  Video,
  LogOut,
  BarChart3,
  CheckCircle,
  HelpCircle,
  KeyRound,
  Users,
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Phone,
  Search,
  MessageCircle,
  Zap,
  Image as ImageIcon
} from 'lucide-react';

import { 
  saveProduct, 
  deleteProduct, 
  updateSettings, 
  clearDemoProducts,
  getAdminPassword,
  saveAdminPassword,
  checkAdminSession,
  setAdminSession,
  getOrders
} from '../supabase';


export default function AdminPage({ 
  products, 
  settings, 
  onRefresh, 
  onBack 
}) {
  // Admin Authentication State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(checkAdminSession);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  // Password Change in Settings
  const [currentPassInput, setCurrentPassInput] = useState('');
  const [newPassInput, setNewPassInput] = useState('');
  const [passChangeStatus, setPassChangeStatus] = useState('');

  // Tab & Editor State
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics' | 'products' | 'settings'
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [orderSearchQuery, setOrderSearchQuery] = useState('');

  const loadRealOrders = async () => {
    setLoadingOrders(true);
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (e) {
      console.warn('Failed to load orders:', e);
    }
    setLoadingOrders(false);
  };

  React.useEffect(() => {
    loadRealOrders();
  }, []);

  // Real Calculated Metrics
  const totalRevenue = orders.reduce((acc, o) => acc + (Number(o.amount) || 0), 0);
  const totalOrders = orders.length;
  const uniqueUsersCount = new Set(orders.map(o => o.customerEmail || o.customerPhone).filter(Boolean)).size;
  const aov = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  // Real Product Sales Breakdown ("Kya Bika Hai")
  const productSalesMap = {};
  orders.forEach(order => {
    const key = order.productId || order.productTitle || 'Digital Product';
    if (!productSalesMap[key]) {
      productSalesMap[key] = {
        productId: order.productId,
        title: order.productTitle || 'Digital Product',
        unitsSold: 0,
        totalRevenue: 0,
        driveUrl: order.driveUrl,
        lastSoldAt: order.created_at
      };
    }
    productSalesMap[key].unitsSold += 1;
    productSalesMap[key].totalRevenue += (Number(order.amount) || 0);
  });
  const productSales = Object.values(productSalesMap).sort((a, b) => b.totalRevenue - a.totalRevenue);

  // Real Orders Filtered
  const filteredOrders = orders.filter(ord => {
    if (!orderSearchQuery.trim()) return true;
    const q = orderSearchQuery.toLowerCase();
    return (
      ord.id?.toLowerCase().includes(q) ||
      ord.customerEmail?.toLowerCase().includes(q) ||
      ord.customerPhone?.toLowerCase().includes(q) ||
      ord.productTitle?.toLowerCase().includes(q)
    );
  });

  const [editingProduct, setEditingProduct] = useState(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');

  const [marqueeTexts, setMarqueeTexts] = useState(
    settings?.marquee_announcements || [
      "⚡ FLASH SALE: UP TO 90% OFF ON ALL BUNDLES",
      "📁 1-SECOND INSTANT GOOGLE DRIVE ACCESS",
      "⭐ 25,000+ CREATORS TRUST BAZARA.IN"
    ]
  );
  const [newTickerText, setNewTickerText] = useState('');
  const [saveStatus, setSaveStatus] = useState('');

  // Default clean product template for creating new product
  const emptyProduct = {
    id: '',
    title: '',
    slug: '',
    category: 'course',
    product_type: 'course',
    price: 499,
    original_price: 3999,
    discount_percentage: 88,
    tag: '⭐ TOP RATED MASTERCLASS',
    badge: '🎓 Complete Video Course',
    cover_image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80',
    video_url: '',
    gallery_images: [
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800'
    ],
    sample_reels: [
      { id: "r1", title: "Sample Video 1", views: "Preview", type: "Sample Video", thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500", video_url: "" },
      { id: "r2", title: "Sample Video 2", views: "Preview", type: "Sample Video", thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500", video_url: "" }
    ],
    drive_download_url: 'https://drive.google.com/drive/folders/bazara-download-sample',
    short_desc: 'Comprehensive masterclass with live project source codes and instant Google Drive access.',
    rating: 4.96,
    reviews_count: 1680,
    features: [
      'Instant Google Drive Lifetime Access',
      'Full Source Code Included',
      'Verified Certificate of Completion'
    ],
    course_details: {
      instructor: 'Viplav Kumar (Senior Full-Stack Engineer & AI Specialist)',
      duration: '8.5+ Hours HD',
      video_url: '',
      modules_count: '5 Modules',
      curriculum: [
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
        }
      ]
    },
    reels_details: {
      total_count: '5,000+ 4K Reels',
      resolution: '4K Ultra HD',
      watermark: 'Zero Watermark',
      rights: 'Commercial PLR Rights'
    },
    ebook_details: {
      pages_count: '120 Pages',
      format: 'PDF & EPUB',
      chapters: ['Chapter 1: Getting Started', 'Chapter 2: Scaling Up']
    },
    software_details: {
      platforms: 'Windows & Mac',
      license_type: 'Lifetime License Key',
      activation: 'Delivered via Email & WhatsApp'
    },
    enable_bump_offer: false,
    bump_title: '',
    bump_price: 99,
    bump_desc: ''
  };


  const [formData, setFormData] = useState(emptyProduct);

  const [loadingAuth, setLoadingAuth] = useState(false);

  // Admin Auth Handlers
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoadingAuth(true);
    try {
      const correct = await getAdminPassword();
      if (passwordInput.trim() === correct.trim()) {
        setAdminSession(true);
        setIsAdminAuthenticated(true);
        setAuthError('');
      } else {
        setAuthError('Incorrect Password. Please check and try again.');
      }
    } catch (err) {
      setAuthError('Authentication check failed.');
    } finally {
      setLoadingAuth(false);
    }
  };

  const handleAdminLogout = () => {
    setAdminSession(false);
    setIsAdminAuthenticated(false);
    setPasswordInput('');
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const correct = await getAdminPassword();
      if (currentPassInput.trim() !== correct.trim()) {
        setPassChangeStatus('❌ Current password is incorrect!');
        return;
      }
      if (!newPassInput || newPassInput.trim().length < 4) {
        setPassChangeStatus('❌ New password must be at least 4 characters long!');
        return;
      }
      await saveAdminPassword(newPassInput.trim());
      setPassChangeStatus('✓ Password permanently saved in Supabase Database!');
      setCurrentPassInput('');
      setNewPassInput('');
      setTimeout(() => setPassChangeStatus(''), 3500);
    } catch (err) {
      setPassChangeStatus('❌ Error saving to Supabase: ' + err.message);
    }
  };


  const handleOpenEdit = (product) => {
    const cloned = JSON.parse(JSON.stringify(product));
    if (!Array.isArray(cloned.gallery_images)) {
      cloned.gallery_images = cloned.cover_image ? [cloned.cover_image] : [];
    }
    setFormData(cloned);
    setEditingProduct(product);
    setIsCreatingNew(false);
  };


  const handleOpenCreate = () => {
    setFormData({
      ...emptyProduct,
      id: 'prod-' + Date.now(),
      slug: 'new-product-' + Date.now().toString().slice(-4)
    });
    setEditingProduct(null);
    setIsCreatingNew(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setSaveStatus('Saving...');
    try {
      await saveProduct(formData);
      setSaveStatus('Saved Successfully! ✓');
      setTimeout(() => {
        setSaveStatus('');
        setEditingProduct(null);
        setIsCreatingNew(false);
        if (onRefresh) onRefresh();
      }, 700);
    } catch (err) {
      alert('Error saving product');
      setSaveStatus('');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to permanently delete this product?')) {
      await deleteProduct(id);
      if (onRefresh) onRefresh();
    }
  };

  const handleSetFeaturedCourse = async (courseId) => {
    const updatedSettings = {
      ...(settings || {}),
      featured_course_id: courseId
    };
    await updateSettings(updatedSettings);
    if (onRefresh) onRefresh();
  };

  const handleSaveMarquee = async () => {
    const updatedSettings = {
      ...(settings || {}),
      marquee_announcements: marqueeTexts
    };
    await updateSettings(updatedSettings);
    alert('Marquee Ticker announcements updated successfully! 🚀');
    if (onRefresh) onRefresh();
  };

  const handleAddTickerText = () => {
    if (newTickerText.trim()) {
      setMarqueeTexts([...marqueeTexts, newTickerText.trim()]);
      setNewTickerText('');
    }
  };

  const handleRemoveTickerText = (index) => {
    setMarqueeTexts(marqueeTexts.filter((_, idx) => idx !== index));
  };

  const allCourses = products.filter(p => p.category === 'course' || p.product_type === 'course');
  const featuredCourseId = settings?.featured_course_id || 'prod-course-ai';
  const currentFeaturedCourse = products.find(p => p.id === featuredCourseId) || allCourses[0];

  const filteredProducts = products.filter((p) => {
    if (filterCategory === 'all') return true;
    if (filterCategory === 'course') return p.category === 'course' || p.product_type === 'course';
    if (filterCategory === 'reels') return p.category === 'reels' || p.product_type === 'reels';
    if (filterCategory === 'subscription') return p.category === 'subscription' || p.product_type === 'subscription';
    if (filterCategory === 'ebook') return p.category === 'ebook' || p.product_type === 'ebook';
    if (filterCategory === 'software') return p.category === 'software' || p.product_type === 'software';
    return true;
  });


  // ================= 1. ADMIN AUTHENTICATION GATE =================
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-[#08090E] flex flex-col items-center justify-center p-4 selection:bg-emerald-500/30">
        <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-[#0e111d] border border-white/15 shadow-2xl space-y-6 text-center">
          <div className="space-y-3">
            <img src="/logo.png" alt="bazara.in" className="w-16 h-16 mx-auto rounded-2xl object-contain shadow-xl shadow-indigo-500/30" />
            <div>
              <h1 className="text-xl font-black text-white tracking-tight">bazara.in Control Panel</h1>
              <p className="text-xs text-slate-400 mt-1">Restricted Area • Store Owner Authentication Required</p>
            </div>
          </div>

          {authError && (
            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold">
              {authError}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4 text-left">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">Owner Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter admin password..."
                  className="w-full px-3.5 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-400 font-mono pr-10"
                  required
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-white cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5">
                🔑 Default password: <code className="text-emerald-400 font-mono font-bold bg-white/[0.05] px-1.5 py-0.5 rounded">admin123</code>
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl font-black text-xs uppercase tracking-wider bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-xl shadow-emerald-500/30 active:scale-95 transition-all flex items-center justify-center space-x-2 cursor-pointer btn-shine-effect"
            >
              <Lock className="w-4 h-4" />
              <span>Unlock Admin Panel 🚀</span>
            </button>
          </form>

          <div className="pt-2 border-t border-white/[0.06]">
            <button
              onClick={onBack}
              className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
            >
              ← Return to Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ================= 2. DESKTOP OPTIMIZED ADMIN DASHBOARD =================
  return (
    <div className="min-h-screen pb-20 bg-[#08090E] text-slate-100 selection:bg-emerald-500/30">
      {/* Top Desktop & Mobile Header */}
      <header className="sticky top-0 z-30 px-4 sm:px-8 py-3.5 backdrop-blur-xl bg-[#08090E]/85 border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={onBack}
              className="p-2 rounded-full glass-panel text-slate-300 hover:text-white border border-white/10 active:scale-95 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-2.5">
              <img src="/logo.png" alt="bazara.in" className="w-8 h-8 rounded-lg object-contain shadow-sm" />
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-sm sm:text-base text-white tracking-tight">bazara.in Admin Console</span>
                  <span className="hidden sm:inline-block text-[10px] font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                    Online
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 hidden sm:block">Full-Stack Digital Store, Video Courses & YouTube Engine</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={onBack}
              className="hidden md:flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 text-xs font-semibold border border-white/10 transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
              <span>View Store</span>
            </button>
            <button
              onClick={handleAdminLogout}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 text-xs font-bold border border-rose-500/30 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Lock Admin</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Full-Width PC & Tablet Optimized Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* KPI / Stats Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          <div className="p-4 rounded-2xl bg-[#131724] border border-white/[0.08] space-y-1 shadow-lg">
            <span className="text-[11px] text-slate-400 font-semibold block">Total Catalog Items</span>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-black text-white">{products.length}</span>
              <span className="text-[10px] font-bold text-emerald-400 px-1.5 py-0.2 rounded bg-emerald-500/10">
                {allCourses.length} Courses
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#131724] border border-white/[0.08] space-y-1 shadow-lg">
            <span className="text-[11px] text-slate-400 font-semibold block">Live Root Course</span>
            <div className="truncate text-xs font-bold text-emerald-400 mt-1">
              {currentFeaturedCourse?.title || 'Web Dev Masterclass'}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#131724] border border-white/[0.08] space-y-1 shadow-lg">
            <span className="text-[11px] text-slate-400 font-semibold block">Video Trailer System</span>
            <div className="flex items-center space-x-1.5 text-xs font-bold text-indigo-400 mt-1">
              <Video className="w-3.5 h-3.5" />
              <span>YouTube & MP4 Ready</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#131724] border border-white/[0.08] space-y-1 shadow-lg">
            <span className="text-[11px] text-slate-400 font-semibold block">Delivery Automation</span>
            <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-400 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>1-Tap G-Drive Vault</span>
            </div>
          </div>
        </div>

        {/* ================= ACTIVE HOMEPAGE COURSE SELECTOR ================= */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-950/40 via-[#121624] to-[#0c0f1a] border border-emerald-500/30 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center space-x-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-emerald-400">
                Active Homepage Course (Live on bazara.in /)
              </h3>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 w-fit">
              Currently Live on Root Landing Page
            </span>
          </div>

          <p className="text-xs text-slate-300">
            Dropdown se select karein ki <span className="text-emerald-400 font-semibold">bazara.in</span> root URL par kaunsa masterclass landing page render hoga:
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center">
            <div className="lg:col-span-2">
              <select
                value={featuredCourseId}
                onChange={(e) => handleSetFeaturedCourse(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#181d2e] border border-emerald-500/40 text-xs sm:text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer shadow-lg"
              >
                {allCourses.length === 0 && (
                  <option value="">No courses available — Add a course first</option>
                )}
                {allCourses.map((c) => (
                  <option key={c.id} value={c.id}>
                    🎓 {c.title} (Selling at ₹{c.price})
                  </option>
                ))}
              </select>
            </div>

            {currentFeaturedCourse && (
              <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-between space-x-3">
                <div className="flex items-center space-x-3 min-w-0">
                  <img
                    src={currentFeaturedCourse.cover_image}
                    alt={currentFeaturedCourse.title}
                    className="w-12 h-12 rounded-xl object-cover shrink-0 border border-white/10 shadow-md"
                  />
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-white block truncate">{currentFeaturedCourse.title}</span>
                    <span className="text-[11px] text-emerald-400 font-bold">₹{currentFeaturedCourse.price} • {currentFeaturedCourse.course_details?.duration || 'HD Video'}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleOpenEdit(currentFeaturedCourse)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-xs font-bold border border-emerald-500/30 shrink-0 cursor-pointer transition-all"
                >
                  Edit Course
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tab Switcher: Real Analytics vs Products vs Settings */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 flex-wrap gap-3">
          <div className="flex space-x-2 overflow-x-auto pb-1 max-w-full">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shrink-0 ${
                activeTab === 'analytics'
                  ? 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/25'
                  : 'bg-[#131724] text-slate-400 hover:text-white border border-white/[0.06]'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Real Profit & Orders ({orders.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shrink-0 ${
                activeTab === 'products'
                  ? 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/25'
                  : 'bg-[#131724] text-slate-400 hover:text-white border border-white/[0.06]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Products & Courses ({products.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shrink-0 ${
                activeTab === 'settings'
                  ? 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/25'
                  : 'bg-[#131724] text-slate-400 hover:text-white border border-white/[0.06]'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Marquee & Security</span>
            </button>
          </div>

          {activeTab === 'products' && (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleOpenCreate}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center space-x-1.5 shadow-lg shadow-emerald-500/25 active:scale-95 transition-all cursor-pointer btn-shine-effect"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Course / Product</span>
              </button>
            </div>
          )}

          {activeTab === 'analytics' && (
            <button
              onClick={loadRealOrders}
              disabled={loadingOrders}
              className="px-3.5 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-bold flex items-center space-x-1.5 cursor-pointer transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingOrders ? 'animate-spin text-emerald-400' : ''}`} />
              <span>Sync Orders</span>
            </button>
          )}
        </div>

        {/* ================= TAB 0: REAL ANALYTICS & PROFIT INTELLIGENCE ================= */}
        {activeTab === 'analytics' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Real KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {/* 1. Total Real Profit */}
              <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-950/40 via-[#131a2c] to-[#0d121f] border border-emerald-500/30 shadow-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Real Profit</span>
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  ₹{totalRevenue.toLocaleString('en-IN')}
                </div>
                <div className="flex items-center space-x-1.5 text-[11px] text-emerald-400 font-semibold">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Real customer earnings</span>
                </div>
              </div>

              {/* 2. Total Units Sold */}
              <div className="p-5 rounded-3xl bg-[#131724] border border-white/[0.08] shadow-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Units Sold</span>
                  <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {totalOrders}
                </div>
                <div className="text-[11px] text-slate-400">
                  Completed orders count
                </div>
              </div>

              {/* 3. Unique Customers */}
              <div className="p-5 rounded-3xl bg-[#131724] border border-white/[0.08] shadow-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Real Users</span>
                  <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {uniqueUsersCount}
                </div>
                <div className="text-[11px] text-slate-400">
                  Verified buyers / students
                </div>
              </div>

              {/* 4. Average Order Value */}
              <div className="p-5 rounded-3xl bg-[#131724] border border-white/[0.08] shadow-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Avg Order Value</span>
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  ₹{aov.toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-slate-400">
                  Per customer basket size
                </div>
              </div>
            </div>

            {/* "Kya Bika Hai" — Product Sales Breakdown */}
            <div className="p-6 rounded-3xl bg-[#101422] border border-white/[0.08] shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center space-x-2">
                    <span>🔥 Kya Bika Hai (Product Sales Breakdown)</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Real sales count aur kis course/bundle se kitna profit generate hua</p>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {productSales.length} Best-Sellers
                </span>
              </div>

              {productSales.length === 0 ? (
                <div className="text-center py-10 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-2">
                  <ShoppingBag className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-xs text-slate-300 font-bold">Abhi tak koi product sell nahi hua hai.</p>
                  <p className="text-[11px] text-slate-500">Jaise hi koi customer buy karega, har course ka sales count aur revenue yahan show hoga.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {productSales.map((item, idx) => {
                    const revenueShare = totalRevenue > 0 ? Math.round((item.totalRevenue / totalRevenue) * 100) : 0;
                    return (
                      <div key={idx} className="p-4 rounded-2xl bg-[#141829] border border-white/[0.08] hover:border-emerald-500/40 transition-all space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center space-x-2">
                            <span className="w-6 h-6 rounded-lg bg-white/10 text-white font-black text-xs flex items-center justify-center shrink-0">
                              #{idx + 1}
                            </span>
                            <span className="text-xs font-bold text-white line-clamp-1">{item.title}</span>
                          </div>
                          <span className="text-xs font-extrabold text-emerald-400 shrink-0">
                            ₹{item.totalRevenue.toLocaleString('en-IN')}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[11px] bg-white/[0.03] p-2.5 rounded-xl border border-white/[0.04]">
                          <div>
                            <span className="text-slate-400 block text-[10px]">Units Sold</span>
                            <span className="font-bold text-white">{item.unitsSold} orders</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px]">Store Share</span>
                            <span className="font-bold text-emerald-400">{revenueShare}% of Revenue</span>
                          </div>
                        </div>

                        <div className="w-full bg-white/[0.06] rounded-full h-1.5 overflow-hidden">
                          <div className="bg-emerald-400 h-full rounded-full transition-all" style={{ width: `${revenueShare}%` }} />
                        </div>

                        {item.driveUrl && (
                          <a
                            href={item.driveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[11px] text-slate-300 hover:text-white flex items-center justify-between pt-1 border-t border-white/[0.06]"
                          >
                            <span className="truncate">📁 Drive Vault</span>
                            <ExternalLink className="w-3 h-3 text-emerald-400 shrink-0" />
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Real Orders & Customers Feed */}
            <div className="p-6 rounded-3xl bg-[#101422] border border-white/[0.08] shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center space-x-2">
                    <span>📋 Real Customer Orders ({filteredOrders.length})</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">100% Real verified purchases with customer email, phone & vault delivery</p>
                </div>

                {/* Search Filter */}
                <div className="relative min-w-[240px]">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={orderSearchQuery}
                    onChange={(e) => setOrderSearchQuery(e.target.value)}
                    placeholder="Search email, phone, order ID..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {filteredOrders.length === 0 ? (
                <div className="text-center py-12 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-2">
                  <ShieldCheck className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-xs text-slate-300 font-bold">Koi orders nahi mile.</p>
                  <p className="text-[11px] text-slate-500">
                    {orderSearchQuery ? 'Search term se match karta koi order nahi hai.' : 'Real checkout hone par customer ka order yahan instant dikhega!'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="text-[11px] uppercase tracking-wider text-slate-400 bg-white/[0.03] border-b border-white/[0.06]">
                      <tr>
                        <th className="py-3 px-4 font-semibold">Order ID</th>
                        <th className="py-3 px-4 font-semibold">Customer Details</th>
                        <th className="py-3 px-4 font-semibold">Product Purchased</th>
                        <th className="py-3 px-4 font-semibold">Amount Paid</th>
                        <th className="py-3 px-4 font-semibold">Date & Time</th>
                        <th className="py-3 px-4 font-semibold">Drive Vault</th>
                        <th className="py-3 px-4 font-semibold">Contact</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                      {filteredOrders.map((ord) => {
                        const dateStr = ord.created_at ? new Date(ord.created_at).toLocaleString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : 'Recent';

                        return (
                          <tr key={ord.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                              {ord.id}
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="font-semibold text-white">{ord.customerEmail || 'No Email'}</div>
                              <div className="text-[11px] text-slate-400 font-mono flex items-center space-x-1 mt-0.5">
                                <Phone className="w-3 h-3 text-slate-500" />
                                <span>{ord.customerPhone || 'N/A'}</span>
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="font-bold text-white block max-w-[200px] truncate">{ord.productTitle}</span>
                              {ord.upsellIncluded && (
                                <span className="text-[10px] text-emerald-400 font-semibold block">+ 500 Presets Bundle</span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 font-extrabold text-white">
                              ₹{ord.amount || 0}
                            </td>
                            <td className="py-3.5 px-4 text-slate-400 text-[11px] whitespace-nowrap">
                              {dateStr}
                            </td>
                            <td className="py-3.5 px-4">
                              {ord.driveUrl ? (
                                <a
                                  href={ord.driveUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 border border-emerald-500/30 text-[11px] font-bold inline-flex items-center space-x-1 transition-all"
                                >
                                  <span>Open Drive</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              ) : (
                                <span className="text-slate-500 text-[11px]">No link</span>
                              )}
                            </td>
                            <td className="py-3.5 px-4">
                              {ord.customerPhone && (
                                <a
                                  href={`https://wa.me/91${ord.customerPhone.replace(/\D/g, '')}?text=Hi! Thank you for purchasing ${encodeURIComponent(ord.productTitle)} on bazara.in. Here is your access link: ${encodeURIComponent(ord.driveUrl || 'https://bazara.in')}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 inline-flex items-center space-x-1 text-[11px] font-bold transition-all"
                                  title="Contact Customer on WhatsApp"
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                  <span>WhatsApp</span>
                                </a>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 1: PRODUCTS & COURSES MANAGEMENT ================= */}

        {activeTab === 'products' && (
          <div className="space-y-4">
            {/* Category Filter Pills */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
              <span className="text-xs font-semibold text-slate-400 mr-1">Filter:</span>
              {[
                { id: 'all', label: `All (${products.length})` },
                { id: 'reels', label: '🎬 Reel Bundles' },
                { id: 'course', label: `🎓 Courses (${allCourses.length})` },
                { id: 'subscription', label: '👑 Subscriptions' },
                { id: 'software', label: '💻 Software' },
                { id: 'ebook', label: '📚 E-Books' }
              ].map(cat => (

                <button
                  key={cat.id}
                  onClick={() => setFilterCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    filterCategory === cat.id
                      ? 'bg-white/15 text-white border border-white/20'
                      : 'bg-white/[0.03] text-slate-400 hover:text-white border border-white/[0.04]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Desktop Responsive Grid (3-column on desktop, 1 on mobile) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((product) => {
                const isCourse = product.category === 'course' || product.product_type === 'course';
                const isFeatured = product.id === featuredCourseId;
                const hasVideo = product.video_url || product.course_details?.video_url || (product.sample_reels && product.sample_reels[0]?.video_url);

                return (
                  <div
                    key={product.id}
                    className={`p-4 rounded-3xl bg-[#131724] border transition-all flex flex-col justify-between space-y-3.5 shadow-xl ${
                      isFeatured ? 'border-emerald-500/50 shadow-emerald-500/10 ring-1 ring-emerald-500/20' : 'border-white/[0.08] hover:border-white/20'
                    }`}
                  >
                    <div className="space-y-3">
                      {/* Thumbnail & Badges */}
                      <div className="relative rounded-2xl overflow-hidden aspect-video bg-black">
                        <img
                          src={product.cover_image}
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-black/75 backdrop-blur-md text-white border border-white/10">
                            {product.category}
                          </span>
                          {isFeatured && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-slate-950 shadow-md">
                              ★ Live on /
                            </span>
                          )}
                        </div>

                        {hasVideo && (
                          <div className="absolute bottom-2 left-2">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-600/90 text-white flex items-center space-x-1 backdrop-blur-md">
                              <Video className="w-3 h-3" />
                              <span>Trailer Attached</span>
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div>
                        <h4 className="font-bold text-sm text-white line-clamp-2 leading-snug">
                          {product.title}
                        </h4>
                        <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                          {product.short_desc}
                        </p>
                      </div>
                    </div>

                    {/* Price and Action Strip */}
                    <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                      <div>
                        <div className="flex items-baseline space-x-1.5">
                          <span className="text-lg font-black text-emerald-400">₹{product.price}</span>
                          <span className="text-xs text-slate-400 line-through">₹{product.original_price}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {isCourse && !isFeatured && (
                          <button
                            onClick={() => handleSetFeaturedCourse(product.id)}
                            title="Set as Root Homepage Course"
                            className="px-2.5 py-1.5 rounded-xl bg-white/[0.05] hover:bg-emerald-500/20 text-[11px] font-bold text-slate-300 hover:text-emerald-400 border border-white/10 transition-colors cursor-pointer"
                          >
                            Set Live
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenEdit(product)}
                          className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
                          title="Edit Product"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= TAB 2: MARQUEE & SECURITY SETTINGS ================= */}
        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 1. Marquee Ticker Editor */}
            <div className="p-5 rounded-3xl bg-[#131724] border border-white/[0.08] space-y-4 shadow-xl">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>Top Announcement Marquee Ticker</span>
                </h4>
                <p className="text-xs text-slate-400">Website ke top par chalne wala text customize karein</p>
              </div>

              <div className="space-y-2">
                {marqueeTexts.map((text, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={text}
                      onChange={(e) => {
                        const updated = [...marqueeTexts];
                        updated[idx] = e.target.value;
                        setMarqueeTexts(updated);
                      }}
                      className="flex-1 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs"
                    />
                    <button
                      onClick={() => handleRemoveTickerText(idx)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-400 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newTickerText}
                  onChange={(e) => setNewTickerText(e.target.value)}
                  placeholder="Naya announcement text likhein..."
                  className="flex-1 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs"
                />
                <button
                  onClick={handleAddTickerText}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs cursor-pointer"
                >
                  Add
                </button>
              </div>

              <button
                onClick={handleSaveMarquee}
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider cursor-pointer btn-shine-effect"
              >
                Save Marquee Announcements 🚀
              </button>
            </div>

            {/* 2. Admin Security Password Management */}
            <div className="p-5 rounded-3xl bg-[#131724] border border-white/[0.08] space-y-4 shadow-xl">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                  <KeyRound className="w-4 h-4 text-emerald-400" />
                  <span>Admin Security & Password Lock</span>
                </h4>
                <p className="text-xs text-slate-400">Apna secret admin password yahan se badlein</p>
              </div>

              {passChangeStatus && (
                <div className={`p-2.5 rounded-xl text-xs font-semibold text-center ${
                  passChangeStatus.includes('✓') ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}>
                  {passChangeStatus}
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Current Admin Password</label>
                  <input
                    type="password"
                    value={currentPassInput}
                    onChange={(e) => setCurrentPassInput(e.target.value)}
                    placeholder="Enter current password..."
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">New Admin Password</label>
                  <input
                    type="password"
                    value={newPassInput}
                    onChange={(e) => setNewPassInput(e.target.value)}
                    placeholder="Enter new password (min 4 chars)..."
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-mono"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-wider text-xs cursor-pointer btn-shine-effect"
                >
                  Update Admin Password 🔒
                </button>
              </form>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] text-[11px] text-slate-400 space-y-1">
                <span className="font-bold text-slate-300 block">Security Notes:</span>
                <p>• Password change karne ke baad agli baar login karte waqt naya password use hoga.</p>
                <p>• Panel close karne ke baad top header me <strong className="text-rose-400">Lock Admin</strong> button dabakar lock kar sakte hain.</p>
              </div>
            </div>
          </div>
        )}

        {/* ================= 3. DESKTOP OPTIMIZED EDIT / CREATE MODAL ================= */}
        {(editingProduct || isCreatingNew) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
            <div className="relative w-full max-w-4xl max-h-[92vh] rounded-3xl p-5 sm:p-7 glass-panel border border-white/15 shadow-2xl bg-[#0e111d] flex flex-col">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <h3 className="text-base font-black text-white">
                    {isCreatingNew ? 'Create New Course / Product' : `Editing: ${editingProduct?.title}`}
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setIsCreatingNew(false);
                  }}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable Form Body (2-Column Responsive Layout) */}
              <form onSubmit={handleSaveProduct} className="flex-1 overflow-y-auto pr-1 py-4 space-y-4 text-xs">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  
                  {/* LEFT COLUMN: Main Catalog Info */}
                  <div className="space-y-3">
                    <div>
                      <label className="font-semibold text-slate-300 block mb-1">Product Title</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-emerald-400 focus:outline-none"
                        placeholder="e.g. Website Development with AI Masterclass"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="font-semibold text-slate-300 block mb-1">
                          Product Category <span className="text-emerald-400 font-bold">(Website pe kahan dikhega)</span>
                        </label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            category: e.target.value, 
                            product_type: e.target.value === 'subscription' ? 'course' : e.target.value 
                          })}
                          className="w-full px-3 py-2 rounded-xl bg-[#161a28] border border-white/10 text-white focus:border-emerald-400 focus:outline-none font-bold text-xs"
                        >
                          <option value="reels">🎬 Reel Bundle</option>
                          <option value="course">🎓 Video Course</option>
                          <option value="subscription">👑 Subscription</option>
                          <option value="software">💻 Software</option>
                          <option value="ebook">📚 E-Book</option>
                        </select>
                      </div>

                      <div>
                        <label className="font-semibold text-slate-300 block mb-1">Layout Template</label>
                        <select
                          value={formData.product_type}
                          onChange={(e) => setFormData({ ...formData, product_type: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-[#161a28] border border-white/10 text-white focus:border-emerald-400 focus:outline-none text-xs"
                        >
                          <option value="reels">Reels Layout</option>
                          <option value="course">Course / Video Layout</option>
                          <option value="subscription">Subscription Layout</option>
                          <option value="software">Software Layout</option>
                          <option value="ebook">E-Book Layout</option>
                        </select>
                      </div>

                    </div>

                    {/* Pricing */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="font-semibold text-slate-300 block mb-1">Selling Price (₹)</label>
                        <input
                          type="number"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                          className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-emerald-400 font-bold focus:border-emerald-400 focus:outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-300 block mb-1">Original Price (₹)</label>
                        <input
                          type="number"
                          value={formData.original_price}
                          onChange={(e) => setFormData({ ...formData, original_price: Number(e.target.value) })}
                          className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-slate-400 line-through focus:border-emerald-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Cover & G-Drive Link */}
                    {/* Cover Image */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-semibold text-slate-300">Cover Image URL (Main Display Image)</label>
                        {formData.cover_image && (
                          <span className="text-[10px] text-emerald-400 font-bold">✓ Preview Active</span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        {formData.cover_image && (
                          <img 
                            src={formData.cover_image} 
                            alt="Cover" 
                            className="w-9 h-9 rounded-xl object-cover bg-white/5 border border-emerald-500/30 shrink-0"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        )}
                        <input
                          type="url"
                          value={formData.cover_image}
                          onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-emerald-400 focus:outline-none"
                          placeholder="https://images.unsplash.com/... or image url"
                          required
                        />
                      </div>
                    </div>

                    {/* Multiple Product Gallery Images (1 se jyada images) */}
                    <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-slate-200 flex items-center space-x-1.5 text-xs">
                          <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Product Extra Gallery Images (Multiple Photos)</span>
                        </label>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                          {(formData.gallery_images || []).length} photos
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-tight">
                        💡 Yahan aap 1 se jyada images (screenshots, samples, proofs) add kar sakte hain. Customer jab product kholega toh ye saari photos slider me dikhengi!
                      </p>

                      {/* Image List */}
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {(formData.gallery_images || []).map((imgUrl, gIdx) => (
                          <div key={gIdx} className="flex items-center space-x-2">
                            <span className="text-[10px] font-mono text-slate-400 w-4 shrink-0">#{gIdx + 1}</span>
                            {/* Preview thumbnail */}
                            <img
                              src={imgUrl || 'https://placehold.co/80x80/1e293b/94a3b8?text=Image'}
                              alt=""
                              onError={(e) => { e.target.src = 'https://placehold.co/80x80/1e293b/94a3b8?text=Image'; }}
                              className="w-8 h-8 rounded-lg object-cover bg-white/5 border border-white/10 shrink-0"
                            />
                            <input
                              type="url"
                              value={imgUrl}
                              onChange={(e) => {
                                const updated = [...(formData.gallery_images || [])];
                                updated[gIdx] = e.target.value;
                                setFormData({ ...formData, gallery_images: updated });
                              }}
                              placeholder="Image direct URL (e.g. https://...)"
                              className="flex-1 px-2.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-white text-xs focus:border-emerald-400 focus:outline-none font-mono"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const updated = [...(formData.gallery_images || [])];
                                updated.splice(gIdx, 1);
                                setFormData({ ...formData, gallery_images: updated });
                              }}
                              className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer shrink-0"
                              title="Delete photo"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Add Image Button */}
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...(formData.gallery_images || [])];
                          updated.push('');
                          setFormData({ ...formData, gallery_images: updated });
                        }}
                        className="w-full py-1.5 rounded-xl border border-dashed border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 font-bold text-[11px] flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>+ Add 1 More Product Image URL</span>
                      </button>
                    </div>


                    <div>
                      <label className="font-semibold text-slate-300 block mb-1">Google Drive Download URL (Delivered to buyer)</label>
                      <input
                        type="url"
                        value={formData.drive_download_url}
                        onChange={(e) => setFormData({ ...formData, drive_download_url: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-emerald-400 focus:border-emerald-400 focus:outline-none font-mono"
                        required
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-300 block mb-1">Short Description / Subtitle</label>
                      <textarea
                        rows={3}
                        value={formData.short_desc || ''}
                        onChange={(e) => setFormData({ ...formData, short_desc: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-emerald-400 focus:outline-none"
                        placeholder="Brief summary of what the buyer receives..."
                      />
                    </div>

                    {/* Order Bump Offer (Upsell) Controls */}
                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Zap className="w-4 h-4 text-amber-400" />
                          <span className="text-xs font-black text-amber-300 uppercase tracking-wider">
                            Checkout Order Bump (Upsell)
                          </span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={Boolean(formData.enable_bump_offer)}
                            onChange={(e) => setFormData({ ...formData, enable_bump_offer: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
                        </label>
                      </div>

                      <p className="text-[11px] text-slate-300">
                        Kya checkout page par is product ke sath extra Order Bump / Upgrade offer dikhana hai?
                      </p>

                      {formData.enable_bump_offer && (
                        <div className="space-y-2.5 pt-2 border-t border-amber-500/20 text-xs">
                          <div className="grid grid-cols-3 gap-2">
                            <div className="col-span-2">
                              <label className="font-semibold text-slate-300 block mb-1">Bump Offer Title</label>
                              <input
                                type="text"
                                value={formData.bump_title || ''}
                                onChange={(e) => setFormData({ ...formData, bump_title: e.target.value })}
                                placeholder="e.g. 500+ CapCut XML Presets Pack"
                                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white focus:border-amber-400 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="font-semibold text-slate-300 block mb-1">Bump Price (₹)</label>
                              <input
                                type="number"
                                value={formData.bump_price || 99}
                                onChange={(e) => setFormData({ ...formData, bump_price: Number(e.target.value) })}
                                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-amber-400 font-bold focus:border-amber-400 focus:outline-none"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="font-semibold text-slate-300 block mb-1">Bump Short Description</label>
                            <input
                              type="text"
                              value={formData.bump_desc || ''}
                              onChange={(e) => setFormData({ ...formData, bump_desc: e.target.value })}
                              placeholder="e.g. Pre-configured cinematic animations & sound effects..."
                              className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white focus:border-amber-400 focus:outline-none text-[11px]"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>


                  {/* RIGHT COLUMN: Video Trailer & Course Curriculum */}
                  <div className="space-y-3">
                    {/* Specific Fields for Courses */}
                    {(formData.category === 'course' || formData.product_type === 'course') && (
                      <div className="p-3.5 rounded-2xl bg-indigo-950/20 border border-indigo-500/25 space-y-3">
                        <span className="text-xs font-black text-indigo-300 uppercase tracking-wider block">
                          🎓 Course & Video Trailer Engine
                        </span>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="font-semibold text-slate-300 block mb-1">Instructor / Mentor</label>
                            <input
                              type="text"
                              value={formData.course_details?.instructor || ''}
                              onChange={(e) => setFormData({
                                ...formData,
                                course_details: { ...formData.course_details, instructor: e.target.value }
                              })}
                              placeholder="e.g. Viplav Kumar"
                              className="w-full px-2.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-white"
                            />
                          </div>
                          <div>
                            <label className="font-semibold text-slate-300 block mb-1">Duration</label>
                            <input
                              type="text"
                              value={formData.course_details?.duration || ''}
                              onChange={(e) => setFormData({
                                ...formData,
                                course_details: { ...formData.course_details, duration: e.target.value }
                              })}
                              placeholder="e.g. 8.5+ Hours HD"
                              className="w-full px-2.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-white"
                            />
                          </div>
                        </div>

                        {/* Video / YouTube Trailer Link */}
                        <div>
                          <label className="font-semibold text-slate-300 block mb-1">
                            Course Video / YouTube Trailer Link 🎥
                          </label>
                          <input
                            type="url"
                            value={formData.video_url || formData.course_details?.video_url || ''}
                            onChange={(e) => setFormData({
                              ...formData,
                              video_url: e.target.value,
                              course_details: { ...formData.course_details, video_url: e.target.value }
                            })}
                            placeholder="e.g. https://www.youtube.com/watch?v=... or https://youtu.be/..."
                            className="w-full px-2.5 py-2 rounded-lg bg-white/[0.04] border border-emerald-500/40 text-emerald-400 font-mono text-xs focus:outline-none focus:border-emerald-400"
                          />
                          <p className="text-[10px] text-slate-400 mt-1">
                            💡 YouTube link ya Shorts link daalo — website trailer par click karne par live popup me chalega!
                          </p>
                        </div>

                        {/* Interactive Curriculum Breakdown Editor */}
                        <div className="pt-2 border-t border-indigo-500/20 space-y-3">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                              📚 Curriculum Breakdown Editor
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const defaultModules = [
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
                                setFormData({
                                  ...formData,
                                  course_details: { ...formData.course_details, curriculum: defaultModules }
                                });
                              }}
                              className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30 hover:bg-emerald-500/30 transition-all cursor-pointer"
                            >
                              + Load 5 Web Dev Modules
                            </button>
                          </div>

                          {/* Modules List */}
                          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                            {(formData.course_details?.curriculum || []).map((mod, mIdx) => (
                              <div key={mIdx} className="p-2.5 rounded-xl bg-black/50 border border-white/10 space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-slate-300">Module #{mIdx + 1}</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const curr = [...(formData.course_details?.curriculum || [])];
                                      curr.splice(mIdx, 1);
                                      setFormData({
                                        ...formData,
                                        course_details: { ...formData.course_details, curriculum: curr }
                                      });
                                    }}
                                    className="text-rose-400 hover:text-rose-300 p-1 text-[10px] flex items-center space-x-0.5 cursor-pointer"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                    <span>Delete</span>
                                  </button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                  <div className="sm:col-span-2">
                                    <input
                                      type="text"
                                      value={mod.title || ''}
                                      onChange={(e) => {
                                        const curr = [...(formData.course_details?.curriculum || [])];
                                        curr[mIdx] = { ...curr[mIdx], title: e.target.value };
                                        setFormData({
                                          ...formData,
                                          course_details: { ...formData.course_details, curriculum: curr }
                                        });
                                      }}
                                      placeholder="Module title..."
                                      className="w-full px-2 py-1 rounded bg-white/[0.04] border border-white/10 text-white text-xs"
                                    />
                                  </div>
                                  <div>
                                    <input
                                      type="text"
                                      value={mod.duration || ''}
                                      onChange={(e) => {
                                        const curr = [...(formData.course_details?.curriculum || [])];
                                        curr[mIdx] = { ...curr[mIdx], duration: e.target.value };
                                        setFormData({
                                          ...formData,
                                          course_details: { ...formData.course_details, curriculum: curr }
                                        });
                                      }}
                                      placeholder="Duration (e.g. 1 hr)"
                                      className="w-full px-2 py-1 rounded bg-white/[0.04] border border-white/10 text-white text-xs"
                                    />
                                  </div>
                                </div>

                                {/* Lessons inside module */}
                                <div className="space-y-1 pt-1">
                                  {(mod.lessons || []).map((lesson, lIdx) => (
                                    <div key={lIdx} className="flex items-center space-x-1.5">
                                      <span className="text-[10px] text-emerald-400 font-mono">{lIdx + 1}.</span>
                                      <input
                                        type="text"
                                        value={lesson}
                                        onChange={(e) => {
                                          const curr = [...(formData.course_details?.curriculum || [])];
                                          const updatedLessons = [...(curr[mIdx].lessons || [])];
                                          updatedLessons[lIdx] = e.target.value;
                                          curr[mIdx] = { ...curr[mIdx], lessons: updatedLessons };
                                          setFormData({
                                            ...formData,
                                            course_details: { ...formData.course_details, curriculum: curr }
                                          });
                                        }}
                                        className="flex-1 px-2 py-0.5 rounded bg-white/[0.04] border border-white/10 text-white text-xs"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const curr = [...(formData.course_details?.curriculum || [])];
                                          const updatedLessons = [...(curr[mIdx].lessons || [])];
                                          updatedLessons.splice(lIdx, 1);
                                          curr[mIdx] = { ...curr[mIdx], lessons: updatedLessons };
                                          setFormData({
                                            ...formData,
                                            course_details: { ...formData.course_details, curriculum: curr }
                                          });
                                        }}
                                        className="p-0.5 text-slate-500 hover:text-rose-400 cursor-pointer"
                                      >
                                        <X className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  ))}

                                  <button
                                    type="button"
                                    onClick={() => {
                                      const curr = [...(formData.course_details?.curriculum || [])];
                                      const updatedLessons = [...(curr[mIdx].lessons || []), 'New Lesson Title'];
                                      curr[mIdx] = { ...curr[mIdx], lessons: updatedLessons };
                                      setFormData({
                                        ...formData,
                                        course_details: { ...formData.course_details, curriculum: curr }
                                      });
                                    }}
                                    className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1 cursor-pointer pt-0.5"
                                  >
                                    <Plus className="w-3 h-3" />
                                    <span>Add Lesson</span>
                                  </button>
                                </div>
                              </div>
                            ))}

                            <button
                              type="button"
                              onClick={() => {
                                const curr = [...(formData.course_details?.curriculum || [])];
                                curr.push({
                                  title: `Module ${curr.length + 1}: New Module Title`,
                                  duration: '1 hr 00 mins',
                                  lessons: ['Lesson 1 Overview', 'Lesson 2 Hands-on Practice']
                                });
                                setFormData({
                                  ...formData,
                                  course_details: { ...formData.course_details, curriculum: curr }
                                });
                              }}
                              className="w-full py-2 rounded-xl border border-dashed border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 font-bold text-xs flex items-center justify-center space-x-1 transition-all cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>+ Add New Module to Curriculum</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Reels / Digital Product Video Grid */}
                    {formData.category !== 'course' && (
                      <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                        <span className="font-bold text-white block">YouTube / Video Preview Links</span>
                        <p className="text-[10px] text-slate-400">
                          💡 Yahan aap YouTube Shorts link ya video link daal sakte hain:
                        </p>
                        <div className="space-y-2">
                          {formData.sample_reels?.slice(0, 2).map((reel, rIdx) => (
                            <div key={rIdx} className="p-2 rounded-xl bg-white/[0.04] space-y-1">
                              <span className="text-[10px] text-emerald-400 font-bold block">Video #{rIdx + 1} Title</span>
                              <input
                                type="text"
                                value={reel.title}
                                onChange={(e) => {
                                  const updated = [...formData.sample_reels];
                                  updated[rIdx].title = e.target.value;
                                  setFormData({ ...formData, sample_reels: updated });
                                }}
                                className="w-full px-2 py-1 rounded bg-white/[0.05] text-xs text-white"
                              />
                              <span className="text-[10px] text-slate-300 block">YouTube Link / Video URL</span>
                              <input
                                type="url"
                                value={reel.video_url || ''}
                                onChange={(e) => {
                                  const updated = [...formData.sample_reels];
                                  updated[rIdx].video_url = e.target.value;
                                  setFormData({ ...formData, sample_reels: updated });
                                }}
                                placeholder="https://youtube.com/shorts/... or https://youtu.be/..."
                                className="w-full px-2 py-1 rounded bg-white/[0.05] text-[11px] text-emerald-400 font-mono"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Modal Footer / Save Action */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProduct(null);
                      setIsCreatingNew(false);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 font-bold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/25 active:scale-95 transition-all cursor-pointer btn-shine-effect"
                  >
                    {saveStatus || 'Save Product to Store 🚀'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
