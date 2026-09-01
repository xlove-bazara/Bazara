import { createClient } from '@supabase/supabase-js';
import { initialProducts, defaultSiteSettings } from './data/initialProducts';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Local storage key constants
const PRODUCTS_KEY = 'bazara_products_v1';
const SETTINGS_KEY = 'bazara_settings_v1';
const ORDERS_KEY = 'bazara_orders_v1';

// Seed initial products into localStorage if empty
const getStoredProducts = () => {
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    if (!raw) {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(initialProducts));
      return initialProducts;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.warn('LocalStorage error, using initialProducts', e);
    return initialProducts;
  }
};

const getStoredSettings = () => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(defaultSiteSettings));
      return defaultSiteSettings;
    }
    return JSON.parse(raw);
  } catch (e) {
    return defaultSiteSettings;
  }
};

// API Functions
export async function getProducts() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data;
      }
    } catch (err) {
      console.warn('Supabase fetch failed, falling back to local database:', err);
    }
  }
  return getStoredProducts();
}

export async function getProductBySlug(slug) {
  const products = await getProducts();
  return products.find(p => p.slug === slug || p.id === slug) || null;
}

export async function saveProduct(productData) {
  if (isSupabaseConfigured && supabase) {
    try {
      if (productData.id && !productData.id.startsWith('prod-')) {
        const { data, error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', productData.id)
          .select();
        if (!error && data) return data[0];
      } else {
        const { data, error } = await supabase
          .from('products')
          .insert([productData])
          .select();
        if (!error && data) return data[0];
      }
    } catch (e) {
      console.warn('Supabase save error, writing locally:', e);
    }
  }

  // Local storage persistence fallback
  const products = getStoredProducts();
  let updatedProducts;
  let savedItem = { ...productData };

  const existingIndex = products.findIndex(p => p.id === productData.id);
  if (existingIndex >= 0) {
    updatedProducts = [...products];
    updatedProducts[existingIndex] = { ...updatedProducts[existingIndex], ...productData };
    savedItem = updatedProducts[existingIndex];
  } else {
    savedItem.id = savedItem.id || 'prod-' + Date.now();
    savedItem.slug = savedItem.slug || savedItem.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    updatedProducts = [savedItem, ...products];
  }

  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updatedProducts));
  return savedItem;
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
