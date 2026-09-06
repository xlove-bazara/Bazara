import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../config/api';

export default function CustomerDetailScreen({ route, navigation }) {
  const { customer, conversation } = route.params;
  const [name, setName] = useState(customer?.name || '');
  const [notes, setNotes] = useState(customer?.notes || '');
  const [saving, setSaving] = useState(false);

  const saveDetails = async () => {
    try {
      setSaving(true);
      const { error } = await supabase
        .from('whatsapp_customers')
        .update({ name, notes })
        .eq('id', customer.id);

      if (error) throw error;
      Alert.alert('Saved', 'Customer details and notes updated successfully.');
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Profile Header */}
      <View style={styles.headerBox}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{name ? name.charAt(0).toUpperCase() : '?'}</Text>
        </View>
        <Text style={styles.phoneText}>+{customer?.whatsapp_number}</Text>
        <Text style={styles.statusText}>Status: {conversation?.status?.toUpperCase() || 'ACTIVE'}</Text>
      </View>

      {/* Name Input */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Customer Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter full name"
          placeholderTextColor="#64748B"
        />
      </View>

      {/* CRM Notes Input */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>CRM Internal Notes</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={notes}
          onChangeText={setNotes}
          placeholder="Add internal notes about lead, purchase details, special instructions..."
          placeholderTextColor="#64748B"
          multiline
          numberOfLines={6}
        />
      </View>

      {/* Save Button */}
      <TouchableOpacity
        style={[styles.saveBtn, saving && { opacity: 0.6 }]}
        onPress={saveDetails}
        disabled={saving}
      >
        <Ionicons name="save-outline" size={18} color="#090A0F" style={{ marginRight: 6 }} />
        <Text style={styles.saveBtnText}>{saving ? 'Saving...' : 'Save Changes'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090A0F',
    padding: 16
  },
  headerBox: {
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
    marginBottom: 20
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#10B981'
  },
  avatarText: {
    color: '#10B981',
    fontSize: 24,
    fontWeight: 'bold'
  },
  phoneText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold'
  },
  statusText: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 4
  },
  formGroup: {
    marginBottom: 16
  },
  label: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
    textTransform: 'uppercase'
  },
  input: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 10,
    color: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top'
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 10
  },
  saveBtnText: {
    color: '#090A0F',
    fontSize: 15,
    fontWeight: 'bold'
  }
});
