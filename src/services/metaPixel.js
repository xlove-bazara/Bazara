// Meta Pixel & Conversions API Tracking Helper for Bazara
// Meta Dataset / Pixel ID: 946148641877992

export const META_PIXEL_ID = '946148641877992';
const TRACKED_PURCHASES_KEY = 'bazara_tracked_meta_purchases_v1';

/**
 * Check if window.fbq is available or initialize fallback queue
 */
const isFbqAvailable = () => {
  if (typeof window === 'undefined') return false;
  if (typeof window.fbq === 'function') return true;
  try {
    const n = function() {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!window._fbq) window._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = '2.0';
    n.queue = [];
    window.fbq = n;
    window.fbq('init', META_PIXEL_ID);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Retrieve the set of order/payment IDs that have already been tracked as Purchase conversions
 */
const getTrackedPurchaseIds = () => {
  try {
    const local = localStorage.getItem(TRACKED_PURCHASES_KEY);
    const session = sessionStorage.getItem(TRACKED_PURCHASES_KEY);
    const localList = local ? JSON.parse(local) : [];
    const sessionList = session ? JSON.parse(session) : [];
    const merged = Array.from(new Set([...localList, ...sessionList]));
    return merged;
  } catch (e) {
    return [];
  }
};

/**
 * Record an order/payment ID as tracked to prevent any future duplicate Purchase fires
 */
const markPurchaseAsTracked = (id) => {
  if (!id) return;
  try {
    const existing = getTrackedPurchaseIds();
    if (!existing.includes(id)) {
      const updated = [...existing, id];
      localStorage.setItem(TRACKED_PURCHASES_KEY, JSON.stringify(updated));
      sessionStorage.setItem(TRACKED_PURCHASES_KEY, JSON.stringify(updated));
    }
  } catch (e) {
    console.warn('[Meta Pixel] Failed to persist tracked purchase ID:', e);
  }
};

/**
 * Check if an order has already fired a Purchase conversion
 */
export const isPurchaseAlreadyTracked = (orderId) => {
  if (!orderId) return false;
  const tracked = getTrackedPurchaseIds();
  return tracked.includes(String(orderId));
};

/**
 * Reset tracked purchases (useful for testing and admin simulation)
 */
export const resetTrackedPurchases = () => {
  try {
    localStorage.removeItem(TRACKED_PURCHASES_KEY);
    sessionStorage.removeItem(TRACKED_PURCHASES_KEY);
    console.log('[Meta Pixel] Tracked purchases history reset.');
  } catch (e) {}
};

/**
 * Track PageView event on route/page transition
 */
export const trackPageView = (pageName = '') => {
  if (!isFbqAvailable()) return;
  try {
    window.fbq('track', 'PageView', {
      page_name: pageName,
      page_path: typeof window !== 'undefined' ? window.location.pathname : ''
    });
    if (import.meta.env?.DEV) {
      console.log(`[Meta Pixel] PageView tracked (${pageName || window.location.pathname})`);
    }
  } catch (err) {
    console.warn('[Meta Pixel] PageView tracking failed:', err);
  }
};

/**
 * Track ViewContent event when viewing a product or landing page
 * @param {Object} product - Product details
 */
export const trackViewContent = (product) => {
  if (!product) return;
  if (!isFbqAvailable()) return;

  try {
    const contentId = String(product.id || product.slug || 'product');
    const contentName = product.title || 'Digital Product';
    const contentCategory = product.category || (product.product_type === 'course' ? 'course' : 'digital_bundle');
    const price = Number(product.price) || 0;

    const params = {
      content_name: contentName,
      content_category: contentCategory,
      content_ids: [contentId],
      content_type: 'product',
      value: price,
      currency: 'INR'
    };

    window.fbq('track', 'ViewContent', params);

    if (import.meta.env?.DEV) {
      console.log('[Meta Pixel] ViewContent tracked:', params);
    }
  } catch (err) {
    console.warn('[Meta Pixel] ViewContent tracking failed:', err);
  }
};

/**
 * Track InitiateCheckout event when customer opens the checkout page
 * @param {Object} product - Product details
 * @param {number} totalAmount - Total payable amount including upsell and discounts
 */
export const trackInitiateCheckout = (product, totalAmount) => {
  if (!product) return;
  if (!isFbqAvailable()) return;

  try {
    const contentId = String(product.id || product.slug || 'product');
    const contentName = product.title || 'Digital Product';
    const contentCategory = product.category || 'digital_product';
    const amount = Number(totalAmount !== undefined ? totalAmount : product.price) || 0;

    const params = {
      content_name: contentName,
      content_category: contentCategory,
      content_ids: [contentId],
      content_type: 'product',
      value: amount,
      currency: 'INR',
      num_items: 1
    };

    window.fbq('track', 'InitiateCheckout', params);

    if (import.meta.env?.DEV) {
      console.log('[Meta Pixel] InitiateCheckout tracked:', params);
    }
  } catch (err) {
    console.warn('[Meta Pixel] InitiateCheckout tracking failed:', err);
  }
};

/**
 * Track Purchase event ONLY AFTER confirmed, verified payment
 * Includes strict idempotency and deduplication protection.
 *
 * @param {Object} order - Confirmed order payload
 * @returns {Object} { tracked: boolean, duplicate: boolean, eventId: string }
 */
export const trackPurchase = async (order) => {
  if (!order) {
    console.warn('[Meta Pixel] trackPurchase called without order object');
    return { tracked: false, duplicate: false, reason: 'missing_order' };
  }

  const primaryId = order.id || order.orderId;
  const paymentProofId = order.razorpayPaymentId || order.paymentId;
  const orderId = primaryId || paymentProofId;

  if (!orderId) {
    console.warn('[Meta Pixel] trackPurchase: Missing order ID or payment ID');
    return { tracked: false, duplicate: false, reason: 'missing_id' };
  }

  // 1. Strict Duplicate Check: Never fire Purchase twice for the same order
  if (isPurchaseAlreadyTracked(orderId) || (paymentProofId && isPurchaseAlreadyTracked(paymentProofId))) {
    console.warn(`[Meta Pixel] Purchase duplicate prevented for order [${orderId}]. Event will NOT fire again.`);
    return { tracked: false, duplicate: true, orderId };
  }

  // 2. Mark this order and payment ID as tracked immediately
  markPurchaseAsTracked(orderId);
  if (paymentProofId) {
    markPurchaseAsTracked(paymentProofId);
  }

  // 3. Prepare parameters
  const amount = Number(order.amount) || 0;
  const contentId = String(order.productId || order.product_id || 'prod');
  const contentName = order.productTitle || order.product_title || 'Digital Product';
  const numItems = order.upsellIncluded ? 2 : 1;
  const eventId = paymentProofId || orderId; // Unified event_id for Meta Pixel & CAPI deduplication

  const params = {
    content_name: contentName,
    content_category: 'digital_product',
    content_ids: [contentId],
    content_type: 'product',
    value: amount,
    currency: 'INR',
    num_items: numItems,
    order_id: String(orderId),
    transaction_id: String(paymentProofId || orderId)
  };

  // 4. Fire Browser-Side Meta Pixel Purchase event with eventID for deduplication
  if (isFbqAvailable()) {
    try {
      window.fbq('track', 'Purchase', params, { eventID: eventId });
      console.log(`[Meta Pixel] ✅ Verified Purchase tracked successfully! Order: ${orderId}, Value: ₹${amount}, EventID: ${eventId}`);
    } catch (err) {
      console.warn('[Meta Pixel] Browser Pixel Purchase fire failed:', err);
    }
  } else {
    console.warn('[Meta Pixel] window.fbq was not ready when Purchase was triggered.');
  }

  // 5. Asynchronously dispatch Conversions API (CAPI) client-to-server bridge
  try {
    fetch('/api/meta-capi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventName: 'Purchase',
        eventId: eventId,
        eventSourceUrl: typeof window !== 'undefined' ? window.location.href : 'https://bazara.in/checkout',
        userData: {
          email: order.customerEmail || order.email,
          phone: order.customerPhone || order.phone,
          name: order.customerName || order.name
        },
        customData: params
      })
    }).catch(capiErr => {
      // Non-blocking catch
      if (import.meta.env?.DEV) {
        console.log('[Meta CAPI] Server dispatch note:', capiErr?.message || capiErr);
      }
    });
  } catch (e) {}

  return {
    tracked: true,
    duplicate: false,
    orderId,
    eventId
  };
};
