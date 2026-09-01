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
  RefreshCw
} from 'lucide-react';
import { saveProduct, deleteProduct, updateSettings, clearDemoProducts } from '../supabase';

export default function AdminPage({ 
  products, 
  settings, 
  onRefresh, 
  onBack 
}) {
  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'settings'
  const [editingProduct, setEditingProduct] = useState(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
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
    category: 'reels',
    product_type: 'reels',
    price: 299,
    original_price: 1999,
    discount_percentage: 85,
    tag: 'NEW RELEASE',
    badge: '📁 G-Drive Instant Access',
    cover_image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
    gallery_images: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
      'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800',
      'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800'
    ],
    sample_reels: [
      { id: "r1", title: "Sample Reel 1", views: "1.2M Views", type: "Sample Video", thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500", video_url: "https://assets.mixkit.co/videos/preview/mixkit-vertical-animation-of-futuristic-lines-and-particles-42514-large.mp4" },
      { id: "r2", title: "Sample Reel 2", views: "900K Views", type: "Sample Video", thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500", video_url: "https://assets.mixkit.co/videos/preview/mixkit-vertical-video-of-lights-passing-by-on-a-highway-at-night-42513-large.mp4" },
      { id: "r3", title: "Customer Review", views: "★ Verified Proof", type: "Review", thumbnail: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500", video_url: "https://assets.mixkit.co/videos/preview/mixkit-vertical-animation-of-futuristic-lines-and-particles-42514-large.mp4" },
      { id: "r4", title: "Sample Reel 4", views: "2.4M Views", type: "Sample Video", thumbnail: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=500", video_url: "https://assets.mixkit.co/videos/preview/mixkit-vertical-video-of-lights-passing-by-on-a-highway-at-night-42513-large.mp4" }
    ],
    drive_download_url: 'https://drive.google.com/drive/folders/bazara-download-sample',
    short_desc: 'High-quality digital bundle with instant Google Drive access and commercial license.',
    rating: 4.9,
    reviews_count: 120,
    features: [
      'Instant Google Drive 1-Tap Access',
      'No Watermarks / 100% Commercial PLR Rights',
      'Bonus Presets & Sounds Included'
    ],
    reels_details: {
      total_count: '5,000+ 4K Reels',
      resolution: '4K Ultra HD',
      watermark: 'Zero Watermark',
      rights: 'Commercial PLR Rights'
    },
    course_details: {
      instructor: 'Senior Creator',
      duration: '4.5 Hours',
      modules_count: '4 Modules',
      curriculum: [
        { title: 'Module 1: Foundations', duration: '40 mins', lessons: ['Setup', 'Basic Concepts'] }
      ]
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
    }
  };

  const [formData, setFormData] = useState(emptyProduct);

  const handleOpenEdit = (product) => {
    setFormData(JSON.parse(JSON.stringify(product)));
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

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(id);
      if (onRefresh) onRefresh();
    }
  };

  const handleSaveMarquee = async () => {
    setSaveStatus('Updating Marquee...');
    await updateSettings({
      ...settings,
      marquee_announcements: marqueeTexts
    });
    setSaveStatus('Marquee Updated! ✓');
    setTimeout(() => {
      setSaveStatus('');
      if (onRefresh) onRefresh();
    }, 700);
  };

  const handleAddTickerItem = () => {
    if (newTickerText.trim()) {
      setMarqueeTexts([...marqueeTexts, newTickerText.trim()]);
      setNewTickerText('');
    }
  };

  const handleRemoveTickerItem = (idx) => {
    setMarqueeTexts(marqueeTexts.filter((_, i) => i !== idx));
  };

  const demoIds = ['prod-reels-10k', 'prod-course-ai-edit', 'prod-ebook-100k', 'prod-software-autoreel', 'prod-mega-combo'];
  const hasDemoProducts = products.some(p => demoIds.includes(p.id) || p.is_demo);

  const handleClearDemos = async () => {
    if (confirm('Kya aap saare 5 demo products delete karna chahte hain taaki sirf aapke real products rahein?')) {
      await clearDemoProducts();
      if (onRefresh) onRefresh();
    }
  };

  const featuredCourseId = settings?.featured_course_id || 'prod-course-ai';
  const allCourses = products.filter(p => p.category === 'course' || p.product_type === 'course');
  const currentFeaturedCourse = products.find(p => p.id === featuredCourseId) || allCourses[0];

  const handleSetFeaturedCourse = async (courseId) => {
    setSaveStatus('Setting Homepage Course...');
    await updateSettings({
      ...settings,
      featured_course_id: courseId
    });
    setSaveStatus('Homepage Course Updated! ✓');
    setTimeout(() => {
      setSaveStatus('');
      if (onRefresh) onRefresh();
    }, 700);
  };

  const [productCategoryFilter, setProductCategoryFilter] = useState('all');

  const filteredAdminProducts = products.filter(p => {
    if (productCategoryFilter === 'all') return true;
    if (productCategoryFilter === 'course') return p.category === 'course' || p.product_type === 'course';
    if (productCategoryFilter === 'reels') return p.category === 'reels';
    return p.category === productCategoryFilter;
  });

  return (
    <div className="min-h-screen pb-20 bg-[#08090E] text-slate-100 selection:bg-emerald-500/30">
      {/* Top Header */}
      <header className="sticky top-0 z-30 px-4 py-3 backdrop-blur-xl bg-[#08090E]/85 border-b border-white/[0.06]">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="p-2 rounded-full glass-panel text-slate-300 hover:text-white border border-white/10 active:scale-95 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>bazara.in Control Panel</span>
          </div>
          <img src="/logo.png" alt="bazara.in" className="w-7 h-7 rounded-lg object-contain shadow-sm" />
        </div>
      </header>


      <main className="max-w-md mx-auto px-4 pt-4 space-y-4">
        {/* ================= PROMINENT FEATURED HOMEPAGE COURSE SELECTOR ================= */}
        <div className="p-4 rounded-3xl bg-gradient-to-br from-emerald-950/40 via-[#121624] to-[#0c0f1a] border border-emerald-500/30 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">
                Active Homepage Course (bazara.in /)
              </h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Live on /
            </span>
          </div>

          <p className="text-[11px] text-slate-300">
            Select which video course is displayed on the root landing page (<span className="text-emerald-400 font-semibold">bazara.in</span>).
          </p>

          {/* Current Selection Dropdown */}
          <div className="space-y-2">
            <select
              value={featuredCourseId}
              onChange={(e) => handleSetFeaturedCourse(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-[#181d2e] border border-emerald-500/40 text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-emerald-400 cursor-pointer"
            >
              {allCourses.length === 0 && (
                <option value="">No courses available — Add a course first</option>
              )}
              {allCourses.map((c) => (
                <option key={c.id} value={c.id}>
                  🎓 {c.title} (₹{c.price})
                </option>
              ))}
            </select>

            {currentFeaturedCourse && (
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between space-x-2">
                <div className="flex items-center space-x-2 min-w-0">
                  <img
                    src={currentFeaturedCourse.cover_image}
                    alt=""
                    className="w-10 h-10 rounded-lg object-cover border border-white/10 shrink-0"
                  />
                  <div className="min-w-0">
                    <h5 className="text-xs font-bold text-white truncate">{currentFeaturedCourse.title}</h5>
                    <span className="text-[10px] text-emerald-400 font-bold">₹{currentFeaturedCourse.price} • {currentFeaturedCourse.course_details?.duration || 'Video Course'}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenEdit(currentFeaturedCourse)}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white/10 hover:bg-white/20 text-white shrink-0 cursor-pointer"
                >
                  Edit
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Tabs (Products vs Site Settings) */}
        <div className="flex rounded-2xl p-1 bg-[#131724] border border-white/10">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'products'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Products & Courses ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Marquee & Site Settings
          </button>
        </div>

        {/* ================= TAB 1: PRODUCTS MANAGER ================= */}
        {activeTab === 'products' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-300">
                All Store Products
              </span>
              <div className="flex items-center space-x-2">
                {hasDemoProducts && (
                  <button
                    onClick={handleClearDemos}
                    className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30 flex items-center space-x-1 active:scale-95 transition-all cursor-pointer"
                    title="Remove all dummy/demo products"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Purge 5 Demos</span>
                  </button>
                )}
                <button
                  onClick={handleOpenCreate}
                  className="px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center space-x-1 shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Product</span>
                </button>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar pb-1 text-[11px] font-bold">
              {[
                { id: 'all', label: 'All (' + products.length + ')' },
                { id: 'course', label: '🎓 Courses (' + allCourses.length + ')' },
                { id: 'reels', label: '🎬 Reels' },
                { id: 'ebook', label: '📚 E-Books' },
                { id: 'software', label: '💻 Tools' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setProductCategoryFilter(f.id)}
                  className={`px-3 py-1 rounded-full transition-all whitespace-nowrap cursor-pointer ${
                    productCategoryFilter === f.id
                      ? 'bg-white/20 text-white border border-white/30'
                      : 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/[0.06]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Products List */}
            <div className="space-y-2.5">
              {filteredAdminProducts.map((p) => {
                const isFeatured = p.id === featuredCourseId;
                const isCourse = p.category === 'course' || p.product_type === 'course';

                return (
                  <div
                    key={p.id}
                    className={`p-3 rounded-2xl glass-panel border bg-[#0d101a] space-y-2.5 transition-all ${
                      isFeatured ? 'border-emerald-500/50 shadow-md shadow-emerald-500/10' : 'border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between space-x-3">
                      <img
                        src={p.cover_image}
                        alt={p.title}
                        className="w-14 h-16 rounded-xl object-cover border border-white/10 shrink-0"
                      />
                      <div className="flex-1 min-w-0 space-y-0.5">
                        <div className="flex items-center space-x-1.5">
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-white/10 text-emerald-400 uppercase">
                            {p.category}
                          </span>
                          {isFeatured && (
                            <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              ⭐ LIVE ON /
                            </span>
                          )}
                        </div>
                        <h4 className="text-xs font-bold text-white truncate">{p.title}</h4>
                        <p className="text-xs font-extrabold text-emerald-400">
                          ₹{p.price} <span className="text-[10px] text-slate-400 line-through">₹{p.original_price}</span>
                        </p>
                      </div>

                      <div className="flex items-center space-x-1.5 shrink-0">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10 cursor-pointer"
                          title="Edit Product"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/20 cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Quick Action for Courses: Set as Homepage */}
                    {isCourse && !isFeatured && (
                      <div className="pt-2 border-t border-white/[0.05] flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Make this the homepage course:</span>
                        <button
                          type="button"
                          onClick={() => handleSetFeaturedCourse(p.id)}
                          className="px-2.5 py-1 rounded-lg font-bold bg-emerald-500/15 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 transition-all cursor-pointer"
                        >
                          Set as Homepage Course
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}


        {/* ================= TAB 2: MARQUEE & SETTINGS ================= */}
        {activeTab === 'settings' && (
          <div className="p-4 rounded-3xl glass-panel border border-white/10 space-y-4 bg-[#0d101a]">
            <div>
              <h3 className="text-sm font-bold text-white">Infinite Loop Marquee Ticker</h3>
              <p className="text-xs text-slate-400">These announcements loop continuously on the website header.</p>
            </div>

            <div className="space-y-2">
              {marqueeTexts.map((text, idx) => (
                <div key={idx} className="flex items-center space-x-2 p-2 rounded-xl bg-white/[0.03] border border-white/10">
                  <span className="text-xs text-slate-300 flex-1">{text}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTickerItem(idx)}
                    className="p-1 text-rose-400 hover:text-rose-300"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex space-x-2">
              <input
                type="text"
                value={newTickerText}
                onChange={(e) => setNewTickerText(e.target.value)}
                placeholder="New announcement text..."
                className="flex-1 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
              />
              <button
                type="button"
                onClick={handleAddTickerItem}
                className="px-3 py-2 rounded-xl text-xs font-bold bg-white/15 hover:bg-white/20 text-white"
              >
                Add
              </button>
            </div>

            <button
              onClick={handleSaveMarquee}
              className="w-full py-2.5 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md transition-all flex items-center justify-center space-x-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saveStatus || 'Save Marquee Changes'}</span>
            </button>
          </div>
        )}

        {/* ================= PRODUCT EDIT / CREATE MODAL ================= */}
        {(editingProduct || isCreatingNew) && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
            <div className="w-full sm:max-w-md bg-[#0e111d] rounded-t-3xl sm:rounded-3xl border border-white/15 p-5 space-y-4 shadow-2xl max-h-[92vh] overflow-y-auto no-scrollbar">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <h3 className="text-sm font-black text-white">
                  {isCreatingNew ? 'Add New Digital Product' : 'Edit Product'}
                </h3>
                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setIsCreatingNew(false);
                  }}
                  className="p-1 rounded-full bg-white/10 text-slate-300 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
                {/* Product Title */}
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Product Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-emerald-400 focus:outline-none"
                    required
                  />
                </div>

                {/* Category & Product Type */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value, product_type: e.target.value === 'flash_sale' ? 'reels' : e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#161a28] border border-white/10 text-white focus:border-emerald-400 focus:outline-none"
                    >
                      <option value="reels">🎬 Reels Bundle</option>
                      <option value="course">🎓 Video Course</option>
                      <option value="ebook">📚 E-Book / Guide</option>
                      <option value="software">💻 Software / Tool</option>
                      <option value="flash_sale">🔥 Flash Deal Combo</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">Custom Layout Type</label>
                    <select
                      value={formData.product_type}
                      onChange={(e) => setFormData({ ...formData, product_type: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#161a28] border border-white/10 text-white focus:border-emerald-400 focus:outline-none"
                    >
                      <option value="reels">Reels Template</option>
                      <option value="course">Course Template</option>
                      <option value="ebook">E-Book Template</option>
                      <option value="software">Software Template</option>
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

                {/* Cover Image & G-Drive Link */}
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">
                    Cover Image URL <span className="text-[10px] text-emerald-400 font-bold">(4:3 Ratio, e.g. 1600×1200 or 1200×900)</span>
                  </label>
                  <input
                    type="url"
                    value={formData.cover_image}
                    onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-emerald-400 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Google Drive Download URL (Customer gets this)</label>
                  <input
                    type="url"
                    value={formData.drive_download_url}
                    onChange={(e) => setFormData({ ...formData, drive_download_url: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-emerald-400 focus:border-emerald-400 focus:outline-none"
                    required
                  />
                </div>

                {/* Short Description */}
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Short Description / Subtitle</label>
                  <textarea
                    rows={2}
                    value={formData.short_desc || ''}
                    onChange={(e) => setFormData({ ...formData, short_desc: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-emerald-400 focus:outline-none"
                    placeholder="Brief description of this course or product..."
                  />
                </div>

                {/* Specific Fields for Courses */}
                {(formData.category === 'course' || formData.product_type === 'course') && (
                  <div className="p-3.5 rounded-2xl bg-indigo-950/20 border border-indigo-500/25 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-indigo-300 uppercase tracking-wider block">
                        🎓 Course & Masterclass Details
                      </span>
                    </div>

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

                    {/* Course Video / YouTube Trailer Link */}
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
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white/[0.04] border border-emerald-500/40 text-emerald-400 font-mono text-xs focus:outline-none focus:border-emerald-400"
                      />
                      <p className="text-[10px] text-slate-400 mt-1">
                        💡 YouTube Video link, Shorts link ya MP4 URL daalo — website trailer par click karne se direct play hoga!
                      </p>
                    </div>

                    {/* ================= INTERACTIVE CURRICULUM BREAKDOWN EDITOR ================= */}
                    <div className="pt-2 border-t border-indigo-500/20 space-y-3">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                          📚 Complete Course Curriculum Breakdown
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

                      {/* Module List */}
                      <div className="space-y-3">
                        {(formData.course_details?.curriculum || []).map((mod, mIdx) => (
                          <div key={mIdx} className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-2.5">
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
                                <span>Delete Module</span>
                              </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                              <div className="sm:col-span-2">
                                <label className="text-[10px] text-slate-400 block mb-0.5">Module Title</label>
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
                                  placeholder="e.g. Module 1: Foundations & Setup"
                                  className="w-full px-2.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-white text-xs"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] text-slate-400 block mb-0.5">Duration</label>
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
                                  placeholder="e.g. 1 hr 15 mins"
                                  className="w-full px-2.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-white text-xs"
                                />
                              </div>
                            </div>

                            {/* Lessons List inside this module */}
                            <div className="pt-1.5 space-y-1.5">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                Lessons in this Module
                              </label>
                              {(mod.lessons || []).map((lesson, lIdx) => (
                                <div key={lIdx} className="flex items-center space-x-1.5">
                                  <span className="text-[10px] font-mono text-emerald-400">{lIdx + 1}.</span>
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
                                    className="flex-1 px-2 py-1 rounded bg-white/[0.04] border border-white/10 text-white text-xs"
                                    placeholder="Lesson name..."
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
                                    className="p-1 text-slate-500 hover:text-rose-400 cursor-pointer"
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
                                className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1 pt-1 cursor-pointer"
                              >
                                <Plus className="w-3 h-3" />
                                <span>+ Add Lesson to Module #{mIdx + 1}</span>
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
                          className="w-full py-2.5 rounded-xl border border-dashed border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 font-bold text-xs flex items-center justify-center space-x-1 transition-all cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          <span>+ Add New Module to Curriculum</span>
                        </button>
                      </div>
                    </div>

                    <label className="flex items-center space-x-2 pt-2 cursor-pointer border-t border-indigo-500/20">
                      <input
                        type="checkbox"
                        checked={formData.id === featuredCourseId}
                        onChange={(e) => {
                          if (e.target.checked && formData.id) {
                            handleSetFeaturedCourse(formData.id);
                          }
                        }}
                        className="rounded border-white/20 text-emerald-500 focus:ring-emerald-400"
                      />
                      <span className="text-xs text-emerald-300 font-bold">
                        Feature this course on root Homepage (bazara.in /)
                      </span>
                    </label>
                  </div>
                )}

                {/* 4 Sample Reels for 2x2 Grid (if reels/software/ebook) */}
                {formData.category !== 'course' && (
                  <div className="pt-2 border-t border-white/10 space-y-2">
                    <span className="font-bold text-white block">2x2 Video Showcase Grid (YouTube / Video Preview Links)</span>
                    <p className="text-[10px] text-slate-400">
                      💡 Yahan aap YouTube Shorts link, normal YouTube video link, ya direct video link daal sakte hain:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {formData.sample_reels?.map((reel, rIdx) => (
                        <div key={rIdx} className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-1.5">
                          <span className="text-[10px] text-emerald-400 font-bold block">Reel #{rIdx + 1} Title</span>
                          <input
                            type="text"
                            value={reel.title}
                            onChange={(e) => {
                              const updated = [...formData.sample_reels];
                              updated[rIdx].title = e.target.value;
                              setFormData({ ...formData, sample_reels: updated });
                            }}
                            className="w-full px-2 py-1 rounded bg-white/[0.05] text-xs text-white"
                            placeholder="Reel title..."
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

                {/* Save Button */}
                <div className="pt-3">
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/25 active:scale-95 transition-all cursor-pointer btn-shine-effect"
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
