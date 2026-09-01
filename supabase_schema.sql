-- =========================================================
-- BAZARA.IN SUPABASE DATABASE SCHEMA
-- Copy and run this script inside Supabase -> SQL Editor -> Run
-- =========================================================

-- 1. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE,
    category TEXT DEFAULT 'reels',
    product_type TEXT DEFAULT 'reels',
    price NUMERIC NOT NULL,
    original_price NUMERIC,
    discount_percentage NUMERIC DEFAULT 0,
    tag TEXT,
    is_trending BOOLEAN DEFAULT true,
    is_flash_sale BOOLEAN DEFAULT false,
    badge TEXT DEFAULT 'Instant G-Drive',
    cover_image TEXT NOT NULL,
    gallery_images JSONB DEFAULT '[]'::jsonb,
    features JSONB DEFAULT '[]'::jsonb,
    specs JSONB DEFAULT '[]'::jsonb,
    whats_included JSONB DEFAULT '[]'::jsonb,
    sample_reels JSONB DEFAULT '[]'::jsonb,
    rating NUMERIC DEFAULT 4.9,
    reviews_count INT DEFAULT 1200,
    downloads_count INT DEFAULT 15000,
    drive_download_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Allow public read access to products
CREATE POLICY "Allow public read access on products"
ON public.products FOR SELECT
USING (true);

-- Allow public insert/update/delete (or restrict to authenticated admin)
CREATE POLICY "Allow public insert on products"
ON public.products FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow public update on products"
ON public.products FOR UPDATE
USING (true);

CREATE POLICY "Allow public delete on products"
ON public.products FOR DELETE
USING (true);

-- 2. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    productId TEXT,
    productTitle TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    customerPhone TEXT NOT NULL,
    customerEmail TEXT,
    upsellIncluded BOOLEAN DEFAULT false,
    driveUrl TEXT NOT NULL,
    razorpayPaymentId TEXT,
    status TEXT DEFAULT 'completed',
    userId TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert on orders"
ON public.orders FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow public read on orders"
ON public.orders FOR SELECT
USING (true);

-- 3. SITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.site_settings (
    id INT PRIMARY KEY DEFAULT 1,
    marquee_announcements JSONB DEFAULT '[]'::jsonb,
    whatsapp_support_number TEXT DEFAULT '919876543210',
    telegram_link TEXT DEFAULT 'https://t.me/bazara',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on site_settings"
ON public.site_settings FOR SELECT
USING (true);

CREATE POLICY "Allow public update on site_settings"
ON public.site_settings FOR ALL
USING (true);
