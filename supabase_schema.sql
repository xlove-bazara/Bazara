-- ============================================================
-- bazara.in - Database Schema for Supabase PostgreSQL
-- ============================================================

-- 1. Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL, -- 'reels', 'course', 'ebook', 'software', 'flash_sale'
  product_type TEXT NOT NULL, -- 'reels', 'course', 'ebook', 'software'
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  discount_percentage INTEGER,
  tag TEXT,
  badge TEXT,
  cover_image TEXT NOT NULL,
  gallery_images JSONB DEFAULT '[]'::jsonb,
  sample_reels JSONB DEFAULT '[]'::jsonb,
  drive_download_url TEXT NOT NULL,
  short_desc TEXT,
  rating NUMERIC DEFAULT 4.9,
  reviews_count INTEGER DEFAULT 100,
  downloads_count INTEGER DEFAULT 1000,
  is_trending BOOLEAN DEFAULT true,
  is_flash_sale BOOLEAN DEFAULT false,
  features JSONB DEFAULT '[]'::jsonb,
  reels_details JSONB,
  course_details JSONB,
  ebook_details JSONB,
  software_details JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  product_id TEXT REFERENCES public.products(id) ON DELETE SET NULL,
  product_title TEXT,
  amount NUMERIC NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  upsell_included BOOLEAN DEFAULT false,
  drive_url TEXT,
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Create Site Settings Table (For Marquee announcements, etc.)
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'global_settings',
  marquee_announcements JSONB DEFAULT '["⚡ FLASH SALE: UP TO 90% OFF", "📁 1-SECOND INSTANT GOOGLE DRIVE ACCESS"]'::jsonb,
  support_whatsapp TEXT DEFAULT '+91 98765 43210',
  flash_sale_end_hours INTEGER DEFAULT 3,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies: Public can read products and site settings
CREATE POLICY "Allow public read access to products"
  ON public.products FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access to site_settings"
  ON public.site_settings FOR SELECT
  TO public
  USING (true);

-- Allow public to create orders
CREATE POLICY "Allow public insert to orders"
  ON public.orders FOR INSERT
  TO public
  WITH CHECK (true);

-- Admin full access policies (service role / authenticated)
CREATE POLICY "Allow authenticated full access to products"
  ON public.products FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated full access to site_settings"
  ON public.site_settings FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
