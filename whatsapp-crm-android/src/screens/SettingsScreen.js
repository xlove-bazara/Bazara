import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>WhatsApp Cloud API Connection</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Ionicons name="logo-whatsapp" size={24} color="#10B981" />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={styles.cardTitle}>Meta Cloud API v20.0</Text>
              <Text style={styles.cardSubtitle}>Connected & Active</Text>
            </View>
            <View style={styles.onlineBadge}>
              <Text style={styles.onlineText}>LIVE</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Supabase Realtime */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Realtime Synchronization</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Ionicons name="flash" size={24} color="#3B82F6" />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={styles.cardTitle}>Supabase WebSockets</Text>
              <Text style={styles.cardSubtitle}>Realtime Instant Notifications</Text>
            </View>
            <View style={[styles.onlineBadge, { backgroundColor: '#1E3A8A' }]}>
              <Text style={[styles.onlineText, { color: '#60A5FA' }]}>CONNECTED</Text>
            </View>
          </View>
        </View>
      </View>

      {/* App Info */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Application Information</Text>
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>App Name</Text>
            <Text style={styles.infoValue}>Bazara WhatsApp CRM</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Platform</Text>
            <Text style={styles.infoValue}>Native Android (APK / AAB)</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Version</Text>
            <Text style={styles.infoValue}>v1.0.0 (Production Build)</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090A0F',
    padding: 16
  },
  section: {
    marginBottom: 20
  },
  sectionHeader: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 8,
    letterSpacing: 0.5
  },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#334155'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold'
  },
  cardSubtitle: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 2
  },
  onlineBadge: {
    backgroundColor: '#064E3B',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6
  },
  onlineText: {
    color: '#34D399',
    fontSize: 10,
    fontWeight: 'bold'
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#334155'
  },
  infoLabel: {
    color: '#94A3B8',
    fontSize: 13
  },
  infoValue: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '500'
  }
});
