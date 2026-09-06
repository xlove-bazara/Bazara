# 🚀 Bazara WhatsApp CRM & Native Android App Setup Guide

This guide explains how to configure your **Meta WhatsApp Cloud API**, **Supabase Database**, and **Native Android App (APK)**.

---

## 1. Supabase Database Setup (1-Click SQL Script)

1. Open your [Supabase Dashboard](https://supabase.com/dashboard).
2. Go to **SQL Editor** -> **New Query**.
3. Copy the entire content from `supabase_whatsapp_crm.sql` and click **Run**.
4. This will automatically create:
   - `whatsapp_customers`
   - `whatsapp_conversations`
   - `whatsapp_messages` (with unique `meta_message_id` for duplicate prevention)
   - `whatsapp_tags` & `whatsapp_customer_tags`
   - Realtime WebSockets publication for instant live chat.

---

## 2. Meta WhatsApp Cloud API Webhook Configuration

1. Go to [developers.facebook.com](https://developers.facebook.com) -> **Your WhatsApp App**.
2. In the left sidebar, click **WhatsApp** -> **Configuration**.
3. Under **Webhook**, click **Edit**:
   - **Callback URL**: `https://bazara.in/api/whatsapp-webhook` *(or your Vercel deployment URL)*
   - **Verify Token**: `bazara_whatsapp_crm_verify_token_2026` *(or your configured token)*
   - Click **Verify and save**.
4. In **Webhook fields**, click **Manage** and subscribe to:
   - ✅ **`messages`** (Receives customer text, images, PDFs, voice notes, and delivery/read statuses).

---

## 3. Environment Variables (`.env`)

Add the following keys to your Vercel / Server environment:

```env
# Supabase
VITE_SUPABASE_URL=https://vkmjrqkptqgtyqfhzrqx.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_public_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Meta WhatsApp Cloud API
WHATSAPP_TOKEN=your_permanent_meta_system_user_token
META_ACCESS_TOKEN=your_permanent_meta_system_user_token
WHATSAPP_PHONE_NUMBER_ID=1360291297158291
META_PHONE_NUMBER_ID=1360291297158291
WHATSAPP_WABA_ID=your_waba_account_id
WHATSAPP_VERIFY_TOKEN=bazara_whatsapp_crm_verify_token_2026
```

---

## 4. How to Build the Native Android App (APK)

The dedicated Android project is located in `whatsapp-crm-android/`.

### Option A: 1-Command Cloud Build (EAS APK Generation)
```bash
cd whatsapp-crm-android
npm install
npx eas-cli build -p android --profile preview
```
*When the build finishes, EAS will give you a direct download link for the **standalone `.apk` file** to install on your Android phone.*

### Option B: Local Android Build
```bash
cd whatsapp-crm-android
npx expo run:android
```

---

## 5. Web CRM Access

You can also access the CRM on desktop/laptop at:
- **URL**: `https://bazara.in/crm` or click the **WhatsApp CRM** link in your Admin Dashboard.
