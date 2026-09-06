// WhatsApp CRM Client Service
// Hybrid Supabase JS direct client + API Serverless fallback

import { supabase } from '../supabase';

export const whatsappCrmService = {
  // 1. Fetch Conversations with direct Supabase query + API fallback
  async getConversations({ filter = 'all', search = '' } = {}) {
    try {
      if (supabase) {
        let query = supabase
          .from('whatsapp_conversations')
          .select(`
            id,
            customer_id,
            status,
            last_message_preview,
            last_message_type,
            last_message_at,
            last_customer_message_at,
            unread_count,
            is_archived,
            created_at,
            updated_at,
            whatsapp_customers (
              id,
              whatsapp_number,
              name,
              profile_photo_url,
              status,
              notes,
              unread_count
            )
          `)
          .order('last_message_at', { ascending: false });

        if (filter === 'unread') {
          query = query.gt('unread_count', 0);
        } else if (['new', 'pending', 'resolved'].includes(filter)) {
          query = query.eq('status', filter);
        }

        const { data, error } = await query;
        if (!error && data) {
          let list = data;
          if (search && search.trim()) {
            const s = search.trim().toLowerCase();
            list = list.filter(conv => {
              const cust = conv.whatsapp_customers;
              return (
                cust?.name?.toLowerCase().includes(s) ||
                cust?.whatsapp_number?.includes(s) ||
                conv.last_message_preview?.toLowerCase().includes(s)
              );
            });
          }
          return { data: list, error: null };
        }
      }

      // Fallback to Serverless API if direct DB query returns error or empty
      const res = await fetch(`/api/whatsapp-crm?action=conversations&filter=${filter}&search=${encodeURIComponent(search)}`);
      const json = await res.json();
      return { data: json.data || [], error: json.error || null };
    } catch (error) {
      console.error('Error fetching WhatsApp conversations:', error);
      return { data: [], error: error.message };
    }
  },

  // 2. Fetch Messages for a specific conversation
  async getMessages(conversationId) {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('whatsapp_messages')
          .select('*')
          .eq('conversation_id', conversationId)
          .order('timestamp', { ascending: true });

        if (!error && data) {
          return { data, error: null };
        }
      }

      const res = await fetch(`/api/whatsapp-crm?action=messages&conversation_id=${conversationId}`);
      const json = await res.json();
      return { data: json.data || [], error: json.error || null };
    } catch (error) {
      console.error('Error fetching WhatsApp messages:', error);
      return { data: [], error: error.message };
    }
  },

  // 3. Send Outbound Message
  async sendMessage({ customerId, conversationId, to, messageType = 'text', textContent, mediaUrl, mediaId, filename, templateName, templateComponents }) {
    try {
      const response = await fetch('/api/whatsapp-send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId,
          conversationId,
          to,
          messageType,
          textContent,
          mediaUrl,
          mediaId,
          filename,
          templateName,
          templateComponents
        })
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to dispatch WhatsApp message');
      }

      return { success: true, data: result };
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      return { success: false, error: error.message };
    }
  },

  // 4. Mark Conversation as Read
  async markAsRead(conversationId, customerId, lastMetaMessageId) {
    try {
      await fetch('/api/whatsapp-crm?action=mark_read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId, customerId, lastMetaMessageId })
      });
      return { success: true };
    } catch (error) {
      console.error('Error marking as read:', error);
      return { success: false, error: error.message };
    }
  },

  // 5. Update Status
  async updateStatus(conversationId, customerId, status) {
    try {
      const res = await fetch('/api/whatsapp-crm?action=update_status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId, customerId, status })
      });
      return await res.json();
    } catch (error) {
      console.error('Error updating status:', error);
      return { success: false, error: error.message };
    }
  },

  // 6. Update Customer Details & Notes
  async updateCustomer(customerId, { name, notes }) {
    try {
      const res = await fetch('/api/whatsapp-crm?action=update_customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId, name, notes })
      });
      return await res.json();
    } catch (error) {
      console.error('Error updating customer:', error);
      return { success: false, error: error.message };
    }
  },

  // 7. Get Dashboard Summary Stats
  async getDashboardStats() {
    try {
      const res = await fetch('/api/whatsapp-crm?action=stats');
      if (!res.ok) throw new Error('Failed to fetch CRM stats');
      return await res.json();
    } catch (error) {
      return {
        totalCustomers: 0,
        unreadConversations: 0,
        activeConversations: 0,
        pendingConversations: 0,
        resolvedConversations: 0,
        messagesToday: 0
      };
    }
  },

  // 8. Subscribe to Realtime Updates
  subscribeToRealtime({ onNewMessage, onStatusUpdate, onConversationUpdate }) {
    if (!supabase) return () => {};

    const channel = supabase
      .channel('whatsapp_crm_live_sync')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'whatsapp_messages' },
        payload => {
          if (onNewMessage) onNewMessage(payload.new);
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'whatsapp_messages' },
        payload => {
          if (onStatusUpdate) onStatusUpdate(payload.new);
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'whatsapp_conversations' },
        payload => {
          if (onConversationUpdate) onConversationUpdate(payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }
};
