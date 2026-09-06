import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  StyleSheet,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../config/api';

export default function InboxScreen({ navigation }) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'unread', 'new', 'pending', 'resolved'

  const fetchConversations = useCallback(async () => {
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

      if (activeFilter === 'unread') {
        query = query.gt('unread_count', 0);
      } else if (['new', 'pending', 'resolved'].includes(activeFilter)) {
        query = query.eq('status', activeFilter);
      }

      const { data, error } = await query;
      if (error) throw error;

      let list = data || [];
      if (search.trim()) {
        const s = search.toLowerCase();
        list = list.filter(item => {
          const cust = item.whatsapp_customers;
          return (
            cust?.name?.toLowerCase().includes(s) ||
            cust?.whatsapp_number?.includes(s) ||
            item.last_message_preview?.toLowerCase().includes(s)
          );
        });
      }

      setConversations(list);
    } catch (e) {
      console.error('Error fetching conversations on Android:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activeFilter, search]);

  useEffect(() => {
    fetchConversations();

    // Supabase Realtime Listener on Android
    const channel = supabase
      .channel('android_whatsapp_inbox')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'whatsapp_conversations' }, () => {
        fetchConversations();
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'whatsapp_messages' }, () => {
        fetchConversations();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchConversations]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchConversations();
  };

  const renderItem = ({ item }) => {
    const cust = item.whatsapp_customers;
    const hasUnread = item.unread_count > 0;

    return (
      <TouchableOpacity
        style={styles.chatRow}
        activeOpacity={0.7}
        onPress={() => navigation.navigate('Chat', { conversation: item, customer: cust })}
      >
        {/* Avatar */}
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {cust?.name ? cust.name.charAt(0).toUpperCase() : '?'}
          </Text>
          {hasUnread && (
            <View style={styles.unreadDotBadge}>
              <Text style={styles.unreadBadgeText}>{item.unread_count}</Text>
            </View>
          )}
        </View>

        {/* Content */}
        <View style={styles.chatContent}>
          <View style={styles.topRow}>
            <Text style={[styles.customerName, hasUnread && styles.boldText]} numberOfLines={1}>
              {cust?.name || cust?.whatsapp_number}
            </Text>
            <Text style={styles.timeText}>
              {item.last_message_at ? new Date(item.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
            </Text>
          </View>

          <View style={styles.bottomRow}>
            <Text style={[styles.previewText, hasUnread && styles.unreadPreviewText]} numberOfLines={1}>
              {item.last_message_preview || 'New customer'}
            </Text>
            <View style={[styles.statusTag, styles[`status_${item.status}`]]}>
              <Text style={styles.statusTagText}>{item.status}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#090A0F" />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color="#94A3B8" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder="Search name, phone, message..."
          placeholderTextColor="#64748B"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color="#94A3B8" />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Chips */}
      <View style={styles.filterRow}>
        {['all', 'unread', 'new', 'pending', 'resolved'].map(f => (
          <TouchableOpacity
            key={f}
            onPress={() => setActiveFilter(f)}
            style={[styles.filterChip, activeFilter === f && styles.activeFilterChip]}
          >
            <Text style={[styles.filterText, activeFilter === f && styles.activeFilterText]}>
              {f.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Conversation List */}
      <FlatList
        data={conversations}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#10B981" />}
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyContainer}>
              <Ionicons name="chatbubbles-outline" size={48} color="#10B981" style={{ opacity: 0.5 }} />
              <Text style={styles.emptyTitle}>No Conversations</Text>
              <Text style={styles.emptySub}>Incoming WhatsApp messages will appear here instantly in real-time.</Text>
            </View>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090A0F'
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    marginHorizontal: 14,
    marginVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155'
  },
  searchIcon: {
    marginRight: 8
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#FFFFFF',
    fontSize: 14
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    marginBottom: 10,
    gap: 6
  },
  filterChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: '#1E293B'
  },
  activeFilterChip: {
    backgroundColor: '#10B981'
  },
  filterText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8'
  },
  activeFilterText: {
    color: '#090A0F',
    fontWeight: 'bold'
  },
  chatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B'
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    position: 'relative'
  },
  avatarText: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: 'bold'
  },
  unreadDotBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#10B981',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4
  },
  unreadBadgeText: {
    color: '#090A0F',
    fontSize: 10,
    fontWeight: 'bold'
  },
  chatContent: {
    flex: 1
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4
  },
  customerName: {
    fontSize: 15,
    color: '#E2E8F0',
    fontWeight: '500',
    flex: 1
  },
  boldText: {
    fontWeight: 'bold',
    color: '#FFFFFF'
  },
  timeText: {
    fontSize: 11,
    color: '#64748B'
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  previewText: {
    fontSize: 13,
    color: '#94A3B8',
    flex: 1,
    marginRight: 8
  },
  unreadPreviewText: {
    color: '#34D399',
    fontWeight: '600'
  },
  statusTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4
  },
  status_new: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)'
  },
  status_pending: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)'
  },
  status_resolved: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)'
  },
  statusTagText: {
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#94A3B8'
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12
  },
  emptySub: {
    color: '#64748B',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 6
  }
});
