import { createClient } from '@supabase/supabase-js';
import { initialProducts, defaultSiteSettings } from './data/initialProducts';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://zhwdaimprkmqljjwrbpk.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_eDWmwO-eoswzD8cdjudEJQ_ie4y7w9v';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);


export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Local storage key constants
const PRODUCTS_KEY = 'bazara_products_v3';
const SETTINGS_KEY = 'bazara_settings_v3';
const ORDERS_KEY = 'bazara_orders_v1';
const COUPONS_KEY = 'bazara_coupons_v1';

// Seed initial products into localStorage if empty, and ensure latest course data
const getStoredProducts = () => {
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    let prods = initialProducts;
    if (raw) {
      prods = JSON.parse(raw);
    }
    // Filter out system records from stored products
    prods = prods.filter(p => p.category !== 'system' && p.id !== 'system-coupons');

    // Guarantee that prod-course-ai defaults to App & Website Development with AI course while preserving user edits
    const latestWebDev = initialProducts.find(p => p.id === 'prod-course-ai');
    if (latestWebDev) {
      const idx = prods.findIndex(p => p.id === 'prod-course-ai');
      if (idx >= 0) {
        const isStale = !prods[idx].title || 
          prods[idx].title.includes('Video Editing') || 
          prods[idx].title.includes('Shorts Monetization') ||
          prods[idx].title === 'Website Development with AI Masterclass' ||
          !prods[idx].title.includes('App');
        prods[idx] = isStale 
          ? { ...latestWebDev, ...prods[idx], title: latestWebDev.title, short_desc: latestWebDev.short_desc } 
          : { ...latestWebDev, ...prods[idx] };
      } else {
        prods.unshift(latestWebDev);
      }
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(prods));
    }
    return prods;
  } catch (e) {
    console.warn('LocalStorage error, using initialProducts', e);
    return initialProducts.filter(p => p.category !== 'system' && p.id !== 'system-coupons');
  }
};

const getStoredSettings = () => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(defaultSiteSettings));
      return defaultSiteSettings;
    }
    const parsed = JSON.parse(raw);
    return { ...defaultSiteSettings, ...parsed, featured_course_id: 'prod-course-ai' };
  } catch (e) {
    return defaultSiteSettings;
  }
};


// API Functions
export async function getProducts() {
  const latestWebDev = initialProducts.find(p => p.id === 'prod-course-ai');

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        // Filter out system internal config records
        const userProducts = data.filter(p => p.category !== 'system' && p.id !== 'system-coupons');

        // Guarantee the course masterclass is available for landing page and admin management
        const hasCourse = userProducts.some(p => p.id === 'prod-course-ai' || p.category === 'course');
        const prods = hasCourse ? userProducts : [...userProducts, latestWebDev].filter(Boolean);

        const mapped = prods.map(p => {
          if (p.id === 'prod-course-ai' && latestWebDev) {
            const isStale = !p.title || 
              p.title.includes('Video Editing') || 
              p.title.includes('Shorts Monetization') || 
              p.title === 'Website Development with AI Masterclass' ||
              !p.title.includes('App');
            return isStale 
              ? { ...latestWebDev, ...p, title: latestWebDev.title, short_desc: latestWebDev.short_desc } 
              : { ...latestWebDev, ...p };
          }
          return p;
        });
        return mapped;
      }
    } catch (err) {
      console.warn('Supabase fetch failed, falling back to local database:', err);
    }
  }
  return getStoredProducts();
}

// Coupons API Functions
export async function getCoupons() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('features')
        .eq('id', 'system-coupons')
        .maybeSingle();
      if (!error && data && Array.isArray(data.features)) {
        localStorage.setItem(COUPONS_KEY, JSON.stringify(data.features));
        return data.features;
      }
    } catch (err) {
      console.warn('Supabase getCoupons failed:', err);
    }
  }
  try {
    const raw = localStorage.getItem(COUPONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export async function saveCoupons(couponsList) {
  const cleanList = Array.isArray(couponsList) ? couponsList : [];
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('products')
        .update({ features: cleanList })
        .eq('id', 'system-coupons');
      if (error) {
        await supabase.from('products').upsert({
          id: 'system-coupons',
          title: 'Coupon Codes Configuration',
          price: 0,
          drive_download_url: 'system',
          cover_image: 'system',
          category: 'system',
          features: cleanList
        });
      }
    } catch (err) {
      console.warn('Supabase saveCoupons failed:', err);
    }
  }
  localStorage.setItem(COUPONS_KEY, JSON.stringify(cleanList));
  return cleanList;
}



export async function getProductBySlug(slug) {
  const products = await getProducts();
  return products.find(p => p.slug === slug || p.id === slug) || null;
}

// Direct Image Upload Helper (Supports Supabase Storage & compressed Web-ready Base64 fallback)
export async function uploadImageFile(file) {
  if (!file) return null;

  // 1. Try Supabase Storage if configured
  if (isSupabaseConfigured && supabase) {
    try {
      const ext = file.name ? file.name.split('.').pop() : 'jpg';
      const cleanExt = ext.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || 'jpg';
      const fileName = `prod_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${cleanExt}`;
      
      const { data, error } = await supabase.storage
        .from('products')
        .upload(fileName, file, { cacheControl: '3600', upsert: true });

      if (!error && data) {
        const { data: { publicUrl } } = supabase.storage
          .from('products')
          .getPublicUrl(fileName);
        if (publicUrl) return publicUrl;
      }
    } catch (err) {
      console.warn('Supabase storage upload failed, falling back to optimized compression:', err);
    }
  }

  // 2. High-speed Canvas compression fallback (max 1200px, 85% JPEG quality)
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxDim = 1200;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          resolve(dataUrl);
        } catch (canvasErr) {
          resolve(e.target.result);
        }
      };
      img.onerror = () => resolve(e.target.result);
      img.src = e.target.result;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

function updateStoredProductLocally(productData) {
  try {
    const products = getStoredProducts();
    const demoIds = ['prod-reels-10k', 'prod-course-ai-edit', 'prod-ebook-100k', 'prod-software-autoreel', 'prod-mega-combo'];
    
    let updatedProducts;
    let savedItem = { ...productData };

    const existingIndex = products.findIndex(p => p.id === productData.id);
    if (existingIndex >= 0) {
      updatedProducts = [...products];
      updatedProducts[existingIndex] = { ...updatedProducts[existingIndex], ...productData };
      savedItem = updatedProducts[existingIndex];
    } else {
      savedItem.id = savedItem.id || 'prod-' + Date.now();
      savedItem.slug = savedItem.slug || (savedItem.title ? savedItem.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'product-' + Date.now());
      
      const onlyDemosLeft = products.every(p => demoIds.includes(p.id) || p.is_demo);
      if (onlyDemosLeft) {
        updatedProducts = [savedItem];
      } else {
        updatedProducts = [savedItem, ...products.filter(p => !demoIds.includes(p.id))];
      }
    }

    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updatedProducts));
    return savedItem;
  } catch (e) {
    console.warn('LocalStorage save error:', e);
    return productData;
  }
}

export async function saveProduct(productData) {
  const cleanProduct = {
    ...productData,
    price: Number(productData.price) || 0,
    original_price: Number(productData.original_price) || 0,
    discount_percentage: (Number(productData.original_price) > Number(productData.price) && Number(productData.price) > 0)
      ? Math.round(((Number(productData.original_price) - Number(productData.price)) / Number(productData.original_price)) * 100)
      : (Number(productData.discount_percentage) || 0)
  };

  if (isSupabaseConfigured && supabase) {
    try {
      if (cleanProduct.id) {
        // Check if product already exists in Supabase
        const { data: existing } = await supabase
          .from('products')
          .select('id')
          .eq('id', cleanProduct.id)
          .maybeSingle();

        if (existing) {
          // UPDATE existing record
          const { data, error } = await supabase
            .from('products')
            .update(cleanProduct)
            .eq('id', cleanProduct.id)
            .select();
          if (!error && data && data.length > 0) {
            updateStoredProductLocally(data[0]);
            return data[0];
          }
          if (error) console.error('Supabase update product failed:', error);
        } else {
          // INSERT new record
          const { data, error } = await supabase
            .from('products')
            .insert([cleanProduct])
            .select();
          if (!error && data && data.length > 0) {
            updateStoredProductLocally(data[0]);
            return data[0];
          }
          if (error) console.error('Supabase insert product failed:', error);
        }
      } else {
        cleanProduct.id = 'prod-' + Date.now();
        const { data, error } = await supabase
          .from('products')
          .insert([cleanProduct])
          .select();
        if (!error && data && data.length > 0) {
          updateStoredProductLocally(data[0]);
          return data[0];
        }
        if (error) console.error('Supabase insert product failed:', error);
      }
    } catch (e) {
      console.warn('Supabase save error, writing locally:', e);
    }
  }

  // Local storage persistence fallback
  return updateStoredProductLocally(cleanProduct);
}

export async function clearDemoProducts() {
  const demoIds = ['prod-reels-10k', 'prod-course-ai-edit', 'prod-ebook-100k', 'prod-software-autoreel', 'prod-mega-combo'];
  const products = getStoredProducts();
  const filtered = products.filter(p => !demoIds.includes(p.id) && !p.is_demo);
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(filtered));
  return filtered;
}

export async function deleteProduct(productId) {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('products').delete().eq('id', productId);
    } catch (e) {
      console.warn('Supabase delete error:', e);
    }
  }

  const products = getStoredProducts();
  const filtered = products.filter(p => p.id !== productId);
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(filtered));
  return true;
}

export async function getSettings() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .limit(1)
        .single();
      if (!error && data) return data;
    } catch (e) {
      console.warn('Supabase settings fetch error:', e);
    }
  }
  return getStoredSettings();
}

export async function updateSettings(newSettings) {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('site_settings').upsert([newSettings]);
    } catch (e) {
      console.warn('Supabase settings update error:', e);
    }
  }
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
  return newSettings;
}

export async function createOrder(orderPayload) {
  const orderId = 'ORD-' + Math.random().toString(36).substring(2, 9).toUpperCase();
  const order = {
    id: orderId,
    ...orderPayload,
    created_at: new Date().toISOString(),
    status: 'completed'
  };

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('orders').insert([order]);
    } catch (e) {
      console.warn('Supabase order insert error:', e);
    }
  }

  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    const orders = raw ? JSON.parse(raw) : [];
    orders.unshift(order);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  } catch (e) {
    console.error(e);
  }

  return order;
}

export async function getOrder(orderId) {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    const orders = raw ? JSON.parse(raw) : [];
    return orders.find(o => o.id === orderId) || null;
  } catch (e) {
    return null;
  }
}

export async function getOrders() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) {
        const raw = localStorage.getItem(ORDERS_KEY);
        const localOrders = raw ? JSON.parse(raw) : [];
        const map = new Map();
        [...data, ...localOrders].forEach(o => {
          if (o && o.id) map.set(o.id, o);
        });
        return Array.from(map.values()).sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
      }
    } catch (e) {
      console.warn('Supabase fetch orders error:', e);
    }
  }

  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}


// ================= OFFICIAL SUPABASE AUTHENTICATION =================
export async function signInWithGoogle() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured. Please check your environment keys.');
  }

  // Save current exact page path so user returns to the exact same page
  if (typeof window !== 'undefined') {
    try {
      const returnPath = window.location.pathname + window.location.search;
      localStorage.setItem('bazara_auth_return_url', returnPath);
    } catch (e) {}
  }

  const redirectUrl = typeof window !== 'undefined' 
    ? window.location.href.split('#')[0] 
    : 'https://bazara.in/home';

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUrl
    }
  });
  if (error) throw error;
  return data;
}


export async function sendOtp(phoneOrEmail) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured. Please check your environment keys.');
  }
  const redirectUrl = typeof window !== 'undefined' ? window.location.origin : 'https://bazara.in';

  if (phoneOrEmail.includes('@')) {
    const { data, error } = await supabase.auth.signInWithOtp({
      email: phoneOrEmail.trim(),
      options: {
        emailRedirectTo: redirectUrl,
        shouldCreateUser: true
      }
    });
    if (error) throw error;
    return { type: 'email', data };
  } else {
    const cleanPhone = phoneOrEmail.startsWith('+') ? phoneOrEmail : `+91${phoneOrEmail.replace(/\D/g, '')}`;
    const { data, error } = await supabase.auth.signInWithOtp({
      phone: cleanPhone,
      options: {
        shouldCreateUser: true
      }
    });
    if (error) throw error;
    return { type: 'phone', data };
  }
}


export async function verifyOtp(phoneOrEmail, token) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured.');
  }

  if (phoneOrEmail.includes('@')) {
    const { data, error } = await supabase.auth.verifyOtp({
      email: phoneOrEmail.trim(),
      token: token.trim(),
      type: 'email'
    });
    if (error) throw error;
    return data;
  } else {
    const cleanPhone = phoneOrEmail.startsWith('+') ? phoneOrEmail : `+91${phoneOrEmail.replace(/\D/g, '')}`;
    const { data, error } = await supabase.auth.verifyOtp({
      phone: cleanPhone,
      token: token.trim(),
      type: 'sms'
    });
    if (error) throw error;
    return data;
  }
}


export async function getCurrentUser() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        return {
          id: session.user.id,
          email: session.user.email,
          phone: session.user.phone,
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Creator',
          avatar: session.user.user_metadata?.avatar_url
        };
      }
    } catch (e) {
      console.warn('Session check failed:', e);
    }
  }
  // Check local session
  try {
    const raw = localStorage.getItem('bazara_current_user');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export async function signOutUser() {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn(e);
    }
  }
  localStorage.removeItem('bazara_current_user');
  try {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('sb-') || key.includes('supabase.auth')) {
        localStorage.removeItem(key);
      }
    });
  } catch (e) {}
}


export async function getAdminPassword() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('admin_password')
        .eq('id', 1)
        .single();
      if (!error && data?.admin_password) {
        return data.admin_password;
      }
    } catch (e) {
      console.warn('Supabase fetch admin password error:', e);
    }
  }
  try {
    const stored = localStorage.getItem(ADMIN_PASS_KEY);
    return stored || 'admin123'; // Default fallback
  } catch (e) {
    return 'admin123';
  }
}

export async function saveAdminPassword(newPassword) {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase
        .from('site_settings')
        .upsert([{ id: 1, admin_password: newPassword, updated_at: new Date().toISOString() }]);
    } catch (e) {
      console.warn('Supabase save admin password error:', e);
    }
  }
  try {
    localStorage.setItem(ADMIN_PASS_KEY, newPassword);
    return true;
  } catch (e) {
    return false;
  }
}


export function checkAdminSession() {
  try {
    const sessionAuth = sessionStorage.getItem(ADMIN_SESSION_KEY);
    if (sessionAuth === 'authenticated') return true;

    const localAuth = localStorage.getItem(ADMIN_SESSION_KEY);
    if (localAuth) {
      try {
        const parsed = JSON.parse(localAuth);
        // Valid for 7 days
        if (parsed?.authenticated && parsed?.timestamp && (Date.now() - parsed.timestamp < 7 * 24 * 60 * 60 * 1000)) {
          return true;
        }
      } catch (e) {
        if (localAuth === 'authenticated') return true;
      }
    }
    return false;
  } catch (e) {
    return false;
  }
}

export function setAdminSession(auth) {
  try {
    if (auth) {
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'authenticated');
      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify({
        authenticated: true,
        timestamp: Date.now()
      }));
    } else {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
      localStorage.removeItem(ADMIN_SESSION_KEY);
    }
  } catch (e) {}
}

