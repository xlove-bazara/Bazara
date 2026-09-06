// WhatsApp CRM Client Service
// Handles Supabase DB queries, Realtime subscriptions, and API dispatches

import { supabase } from '../supabase';

export const whatsappCrmService = {
  // 1. Fetch Conversations with optional search and filter
  async getConversations({ filter = 'all', search = '', limit = 50 } = {}) {
    try {
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
        .order('last_message_at', { ascending: false })
        .limit(limit);

      if (filter === 'unread') {
        query = query.gt('unread_count', 0);
      } else if (filter === 'new') {
        query = query.eq('status', 'new');
      } else if (filter === 'pending') {
        query = query.eq('status', 'pending');
      } else if (filter === 'resolved') {
        query = query.eq('status', 'resolved');
      }

      const { data, error } = await query;
      if (error) throw error;

      let results = data || [];

      // Client-side search for customer name, number, or last message
      if (search && search.trim()) {
        const lowerSearch = search.trim().toLowerCase();
        results = results.filter(conv => {
          const cust = conv.whatsapp_customers;
          const nameMatch = cust?.name?.toLowerCase().includes(lowerSearch);
          const phoneMatch = cust?.whatsapp_number?.includes(lowerSearch);
          const previewMatch = conv.last_message_preview?.toLowerCase().includes(lowerSearch);
          return nameMatch || phoneMatch || previewMatch;
        });
      }

      return { data: results, error: null };
    } catch (error) {
      console.error('Error fetching WhatsApp conversations:', error);
      return { data: [], error };
    }
  },

  // 2. Fetch Messages for a specific conversation (paginated)
  async getMessages(conversationId, { limit = 50, beforeTimestamp = null } = {}) {
    try {
      let query = supabase
        .from('whatsapp_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('timestamp', { ascending: true })
        .limit(limit);

      if (beforeTimestamp) {
        query = query.lt('timestamp', beforeTimestamp);
      }

      const { data, error } = await query;
      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      console.error('Error fetching WhatsApp messages:', error);
      return { data: [], error };
    }
  },

  // 3. Send Outbound Message (Text, Media, Voice, Template)
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

  // 5. Update Conversation / Customer Status
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
      console.error('Error fetching CRM stats:', error);
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
    const channel = supabase
      .channel('whatsapp_crm_live')
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
