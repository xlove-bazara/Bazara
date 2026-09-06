-- =========================================================
-- BAZARA WHATSAPP CRM - SUPABASE DATABASE SCHEMA (IDEMPOTENT)
-- Safe to run multiple times without errors
-- =========================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. WHATSAPP CUSTOMERS TABLE
CREATE TABLE IF NOT EXISTS public.whatsapp_customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    whatsapp_number TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    profile_photo_url TEXT,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'pending', 'resolved')),
    unread_count INT NOT NULL DEFAULT 0,
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    notes TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. WHATSAPP CONVERSATIONS TABLE
CREATE TABLE IF NOT EXISTS public.whatsapp_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES public.whatsapp_customers(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'pending', 'resolved')),
    last_message_preview TEXT,
    last_message_type TEXT DEFAULT 'text' CHECK (last_message_type IN ('text', 'image', 'document', 'audio', 'video', 'template', 'sticker', 'other')),
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    last_customer_message_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    unread_count INT NOT NULL DEFAULT 0,
    is_archived BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. WHATSAPP MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.whatsapp_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES public.whatsapp_conversations(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES public.whatsapp_customers(id) ON DELETE CASCADE,
    meta_message_id TEXT UNIQUE,
    direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
    message_type TEXT NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'document', 'audio', 'video', 'template', 'sticker', 'reaction', 'other')),
    text_content TEXT,
    media_id TEXT,
    media_url TEXT,
    filename TEXT,
    mime_type TEXT,
    file_size BIGINT,
    delivery_status TEXT NOT NULL DEFAULT 'sent' CHECK (delivery_status IN ('pending', 'sent', 'delivered', 'read', 'failed')),
    error_message TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    raw_payload JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. WHATSAPP TAGS TABLE
CREATE TABLE IF NOT EXISTS public.whatsapp_tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    color TEXT DEFAULT '#10B981',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. CUSTOMER TAG JUNCTION TABLE
CREATE TABLE IF NOT EXISTS public.whatsapp_customer_tags (
    customer_id UUID NOT NULL REFERENCES public.whatsapp_customers(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES public.whatsapp_tags(id) ON DELETE CASCADE,
    PRIMARY KEY (customer_id, tag_id)
);

-- 7. WHATSAPP TEMPLATES TABLE
CREATE TABLE IF NOT EXISTS public.whatsapp_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    category TEXT DEFAULT 'MARKETING',
    language TEXT DEFAULT 'en',
    status TEXT DEFAULT 'APPROVED',
    body_text TEXT NOT NULL,
    header_type TEXT,
    header_text TEXT,
    footer_text TEXT,
    buttons JSONB DEFAULT '[]'::jsonb,
    components JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. WHATSAPP CRM SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.whatsapp_crm_settings (
    id INT PRIMARY KEY DEFAULT 1,
    welcome_message_enabled BOOLEAN DEFAULT false,
    welcome_message_text TEXT DEFAULT 'Hello! Thanks for reaching out to us. How can we help you today?',
    business_phone_id TEXT,
    business_waba_id TEXT,
    auto_mark_read BOOLEAN DEFAULT true,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Default tags & settings
INSERT INTO public.whatsapp_crm_settings (id, welcome_message_enabled, welcome_message_text)
VALUES (1, false, 'Hello! Thanks for reaching out to us. How can we help you today?')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.whatsapp_tags (name, color)
VALUES 
    ('VIP Lead', '#F59E0B'),
    ('Paid Customer', '#10B981'),
    ('Needs Follow-up', '#EF4444'),
    ('General Query', '#3B82F6')
ON CONFLICT (name) DO NOTHING;

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_whatsapp_cust_phone ON public.whatsapp_customers(whatsapp_number);
CREATE INDEX IF NOT EXISTS idx_whatsapp_cust_last_msg ON public.whatsapp_customers(last_message_at DESC);
CREATE INDEX IF NOT EXISTS idx_whatsapp_cust_status ON public.whatsapp_customers(status);
CREATE INDEX IF NOT EXISTS idx_whatsapp_conv_cust ON public.whatsapp_conversations(customer_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_conv_last_msg ON public.whatsapp_conversations(last_message_at DESC);
CREATE INDEX IF NOT EXISTS idx_whatsapp_conv_status ON public.whatsapp_conversations(status);
CREATE INDEX IF NOT EXISTS idx_whatsapp_msg_conv ON public.whatsapp_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_msg_meta_id ON public.whatsapp_messages(meta_message_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_msg_timestamp ON public.whatsapp_messages(timestamp ASC);
CREATE INDEX IF NOT EXISTS idx_whatsapp_msg_delivery ON public.whatsapp_messages(delivery_status);

-- RLS POLICIES (DROP IF EXISTS THEN CREATE)
ALTER TABLE public.whatsapp_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_customer_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_crm_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all on whatsapp_customers" ON public.whatsapp_customers;
DROP POLICY IF EXISTS "Allow all on whatsapp_conversations" ON public.whatsapp_conversations;
DROP POLICY IF EXISTS "Allow all on whatsapp_messages" ON public.whatsapp_messages;
DROP POLICY IF EXISTS "Allow all on whatsapp_tags" ON public.whatsapp_tags;
DROP POLICY IF EXISTS "Allow all on whatsapp_customer_tags" ON public.whatsapp_customer_tags;
DROP POLICY IF EXISTS "Allow all on whatsapp_templates" ON public.whatsapp_templates;
DROP POLICY IF EXISTS "Allow all on whatsapp_crm_settings" ON public.whatsapp_crm_settings;

CREATE POLICY "Allow all on whatsapp_customers" ON public.whatsapp_customers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on whatsapp_conversations" ON public.whatsapp_conversations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on whatsapp_messages" ON public.whatsapp_messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on whatsapp_tags" ON public.whatsapp_tags FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on whatsapp_customer_tags" ON public.whatsapp_customer_tags FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on whatsapp_templates" ON public.whatsapp_templates FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on whatsapp_crm_settings" ON public.whatsapp_crm_settings FOR ALL USING (true) WITH CHECK (true);

-- REALTIME REPLICATION
DO $$
BEGIN
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.whatsapp_customers;
    EXCEPTION WHEN duplicate_object THEN
        NULL;
    END;
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.whatsapp_conversations;
    EXCEPTION WHEN duplicate_object THEN
        NULL;
    END;
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.whatsapp_messages;
    EXCEPTION WHEN duplicate_object THEN
        NULL;
    END;
END $$;
