import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { supabase, BACKEND_BASE_URL } from '../config/api';

export default function ChatScreen({ route, navigation }) {
  const { conversation, customer } = route.params;

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showAttachModal, setShowAttachModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  // Audio Recording states
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);
  const recordInterval = useRef(null);

  // Audio Playback states
  const [sound, setSound] = useState(null);
  const [playingMsgId, setPlayingMsgId] = useState(null);

  const flatListRef = useRef(null);

  // 1. Fetch Messages
  const fetchMessages = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('whatsapp_messages')
        .select('*')
        .eq('conversation_id', conversation.id)
        .order('timestamp', { ascending: false });

      if (error) throw error;
      setMessages(data || []);

      // Mark as read in CRM
      if (conversation.unread_count > 0) {
        await supabase
          .from('whatsapp_conversations')
          .update({ unread_count: 0 })
          .eq('id', conversation.id);
      }
    } catch (e) {
      console.error('Error fetching messages on Android:', e);
    } finally {
      setLoading(false);
    }
  }, [conversation.id, conversation.unread_count]);

  useEffect(() => {
    fetchMessages();

    // Supabase Realtime Listener for new incoming/outgoing messages
    const channel = supabase
      .channel(`chat_${conversation.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'whatsapp_messages', filter: `conversation_id=eq.${conversation.id}` },
        payload => {
          setMessages(prev => [payload.new, ...prev]);
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'whatsapp_messages', filter: `conversation_id=eq.${conversation.id}` },
        payload => {
          setMessages(prev => prev.map(m => (m.id === payload.new.id ? payload.new : m)));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      if (sound) sound.unloadAsync();
      if (recording) recording.stopAndUnloadAsync();
      if (recordInterval.current) clearInterval(recordInterval.current);
    };
  }, [conversation.id, fetchMessages]);

  // 2. Send Message Helper
  const sendMessage = async ({ messageType = 'text', textContent = null, mediaUrl = null, filename = null, templateName = null }) => {
    try {
      setSending(true);

      const payload = {
        customerId: customer.id,
        conversationId: conversation.id,
        to: customer.whatsapp_number,
        messageType,
        textContent,
        mediaUrl,
        filename,
        templateName
      };

      const res = await fetch(`${BACKEND_BASE_URL}/api/whatsapp-send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        Alert.alert('Send Failed', data.error || 'Could not send message via WhatsApp Meta API');
      }
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setSending(false);
    }
  };

  const handleSendText = () => {
    if (!inputText.trim()) return;
    const msg = inputText.trim();
    setInputText('');
    sendMessage({ messageType: 'text', textContent: msg });
  };

  // 3. Audio Recording Flow
  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') {
        Alert.alert('Permission needed', 'Audio recording permission is required to send voice notes.');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true
      });

      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(newRecording);
      setIsRecording(true);
      setRecordDuration(0);

      recordInterval.current = setInterval(() => {
        setRecordDuration(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopAndSendRecording = async () => {
    if (!recording) return;
    try {
      clearInterval(recordInterval.current);
      setIsRecording(false);
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();

      // Convert or proxy to send
      sendMessage({
        messageType: 'audio',
        mediaUrl: uri
      });

      setRecording(null);
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  };

  const cancelRecording = async () => {
    if (!recording) return;
    clearInterval(recordInterval.current);
    setIsRecording(false);
    await recording.stopAndUnloadAsync();
    setRecording(null);
  };

  // 4. Play Audio Flow
  const playAudio = async (msgId, uri) => {
    try {
      if (sound && playingMsgId === msgId) {
        await sound.pauseAsync();
        setPlayingMsgId(null);
        return;
      }

      if (sound) {
        await sound.unloadAsync();
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true }
      );
      setSound(newSound);
      setPlayingMsgId(msgId);

      newSound.setOnPlaybackStatusUpdate(status => {
        if (status.didJustFinish) {
          setPlayingMsgId(null);
        }
      });
    } catch (e) {
      console.error('Audio playback error', e);
    }
  };

  // 5. Image Picker (Camera or Gallery)
  const pickImage = async (useCamera = false) => {
    setShowAttachModal(false);
    const result = useCamera
      ? await ImagePicker.launchCameraAsync({ quality: 0.8, base64: true })
      : await ImagePicker.launchImageLibraryAsync({ quality: 0.8, base64: true });

    if (!result.canceled && result.assets && result.assets[0]) {
      const asset = result.assets[0];
      const base64Data = `data:image/jpeg;base64,${asset.base64}`;
      sendMessage({
        messageType: 'image',
        mediaUrl: base64Data
      });
    }
  };

  // 6. Document Picker (PDF)
  const pickDocument = async () => {
    setShowAttachModal(false);
    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/pdf', 'application/msword', 'text/plain'],
      copyToCacheDirectory: true
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      const doc = result.assets[0];
      sendMessage({
        messageType: 'document',
        mediaUrl: doc.uri,
        filename: doc.name
      });
    }
  };

  // 7. Render Individual Message Bubble
  const renderMessage = ({ item }) => {
    const isOutbound = item.direction === 'outbound';

    return (
      <View style={[styles.bubbleContainer, isOutbound ? styles.outboundContainer : styles.inboundContainer]}>
        <View style={[styles.bubble, isOutbound ? styles.outboundBubble : styles.inboundBubble]}>
          {/* Image */}
          {item.message_type === 'image' && (
            <Image
              source={{ uri: item.media_url || `${BACKEND_BASE_URL}/api/whatsapp-media?media_id=${item.media_id}` }}
              style={styles.mediaImage}
              resizeMode="cover"
            />
          )}

          {/* Document */}
          {item.message_type === 'document' && (
            <View style={styles.docRow}>
              <Ionicons name="document-text" size={28} color="#10B981" />
              <Text style={styles.docName} numberOfLines={1}>
                {item.filename || 'PDF Document'}
              </Text>
            </View>
          )}

          {/* Audio / Voice Note */}
          {item.message_type === 'audio' && (
            <TouchableOpacity
              style={styles.audioRow}
              onPress={() => playAudio(item.id, item.media_url || `${BACKEND_BASE_URL}/api/whatsapp-media?media_id=${item.media_id}`)}
            >
              <Ionicons
                name={playingMsgId === item.id ? 'pause-circle' : 'play-circle'}
                size={34}
                color={isOutbound ? '#FFFFFF' : '#10B981'}
              />
              <View style={styles.audioWaveContainer}>
                <Text style={[styles.audioText, isOutbound && { color: '#E2E8F0' }]}>
                  {playingMsgId === item.id ? 'Playing audio...' : 'Voice Note'}
                </Text>
              </View>
            </TouchableOpacity>
          )}

          {/* Text */}
          {item.text_content && (
            <Text style={[styles.messageText, isOutbound ? styles.outboundText : styles.inboundText]}>
              {item.text_content}
            </Text>
          )}

          {/* Timestamp & Status Ticks */}
          <View style={styles.metaRow}>
            <Text style={[styles.timeText, isOutbound && { color: '#A7F3D0' }]}>
              {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
            {isOutbound && (
              <Ionicons
                name={
                  item.delivery_status === 'read'
                    ? 'checkmark-done'
                    : item.delivery_status === 'delivered'
                    ? 'checkmark-done'
                    : 'checkmark'
                }
                size={14}
                color={item.delivery_status === 'read' ? '#38BDF8' : '#A7F3D0'}
                style={{ marginLeft: 3 }}
              />
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* 24-hr Status Bar */}
      <View style={styles.sessionBanner}>
        <Text style={styles.sessionText}>Meta WhatsApp 24-Hour Active Window</Text>
        <TouchableOpacity onPress={() => setShowTemplateModal(true)}>
          <Text style={styles.templateBtnText}>Templates</Text>
        </TouchableOpacity>
      </View>

      {/* Messages FlatList */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id || item.meta_message_id}
        renderItem={renderMessage}
        inverted
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyChat}>
              <Text style={styles.emptyChatText}>No messages yet. Send a reply below.</Text>
            </View>
          )
        }
      />

      {/* Audio Recording Active Banner */}
      {isRecording && (
        <View style={styles.recordBar}>
          <View style={styles.recordingIndicator}>
            <Ionicons name="mic" size={18} color="#EF4444" />
            <Text style={styles.recordingDuration}>{recordDuration}s</Text>
          </View>
          <TouchableOpacity onPress={cancelRecording} style={styles.cancelRecordBtn}>
            <Text style={styles.cancelRecordText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={stopAndSendRecording} style={styles.sendRecordBtn}>
            <Ionicons name="send" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      )}

      {/* Bottom Composer */}
      {!isRecording && (
        <View style={styles.composerContainer}>
          <TouchableOpacity onPress={() => setShowAttachModal(true)} style={styles.iconBtn}>
            <Ionicons name="attach" size={24} color="#94A3B8" />
          </TouchableOpacity>

          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type a WhatsApp message..."
            placeholderTextColor="#64748B"
            multiline
          />

          <TouchableOpacity onPress={startRecording} style={styles.iconBtn}>
            <Ionicons name="mic" size={22} color="#10B981" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSendText}
            disabled={!inputText.trim() || sending}
            style={[styles.sendBtn, (!inputText.trim() || sending) && { opacity: 0.5 }]}
          >
            {sending ? <ActivityIndicator size="small" color="#090A0F" /> : <Ionicons name="send" size={16} color="#090A0F" />}
          </TouchableOpacity>
        </View>
      )}

      {/* Attach Modal */}
      <Modal visible={showAttachModal} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowAttachModal(false)}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.modalOption} onPress={() => pickImage(true)}>
              <Ionicons name="camera" size={24} color="#10B981" />
              <Text style={styles.modalOptionText}>Camera Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOption} onPress={() => pickImage(false)}>
              <Ionicons name="images" size={24} color="#3B82F6" />
              <Text style={styles.modalOptionText}>Gallery Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOption} onPress={pickDocument}>
              <Ionicons name="document-text" size={24} color="#F59E0B" />
              <Text style={styles.modalOptionText}>PDF / Document</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Template Modal */}
      <Modal visible={showTemplateModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.templateModalBox}>
            <Text style={styles.templateTitle}>Send Approved Meta Template</Text>
            <Text style={styles.templateSub}>Use pre-approved templates to start/resume 24h window:</Text>

            {[
              { name: 'order_delivery_update', label: 'Order Delivery & Download' },
              { name: 'payment_reminder', label: 'Payment Reminder' },
              { name: 'general_support_followup', label: 'Customer Support Follow-up' }
            ].map(tpl => (
              <TouchableOpacity
                key={tpl.name}
                style={styles.templateItem}
                onPress={() => {
                  setShowTemplateModal(false);
                  sendMessage({ messageType: 'template', templateName: tpl.name });
                }}
              >
                <Text style={styles.templateItemTitle}>{tpl.label}</Text>
                <Text style={styles.templateItemSub}>{tpl.name}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity onPress={() => setShowTemplateModal(false)} style={styles.closeModalBtn}>
              <Text style={styles.closeModalText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090A0F'
  },
  sessionBanner: {
    backgroundColor: '#064E3B',
    paddingVertical: 6,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  sessionText: {
    color: '#A7F3D0',
    fontSize: 11,
    fontWeight: '500'
  },
  templateBtnText: {
    color: '#FCD34D',
    fontSize: 11,
    fontWeight: 'bold'
  },
  listContent: {
    paddingVertical: 10,
    paddingHorizontal: 12
  },
  bubbleContainer: {
    marginVertical: 4,
    flexDirection: 'row'
  },
  inboundContainer: {
    justifyContent: 'flex-start'
  },
  outboundContainer: {
    justifyContent: 'flex-end'
  },
  bubble: {
    maxWidth: '82%',
    padding: 10,
    borderRadius: 14
  },
  inboundBubble: {
    backgroundColor: '#1E293B',
    borderTopLeftRadius: 2
  },
  outboundBubble: {
    backgroundColor: '#059669',
    borderTopRightRadius: 2
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20
  },
  inboundText: {
    color: '#F8FAFC'
  },
  outboundText: {
    color: '#FFFFFF'
  },
  mediaImage: {
    width: 220,
    height: 180,
    borderRadius: 8,
    marginBottom: 4
  },
  docRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 8,
    borderRadius: 8,
    marginBottom: 4
  },
  docName: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '500',
    flex: 1
  },
  audioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4
  },
  audioWaveContainer: {
    flex: 1
  },
  audioText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '500'
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 4
  },
  timeText: {
    fontSize: 10,
    color: '#64748B'
  },
  composerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: '#334155'
  },
  iconBtn: {
    padding: 8
  },
  textInput: {
    flex: 1,
    backgroundColor: '#090A0F',
    color: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    fontSize: 14,
    maxHeight: 100,
    marginHorizontal: 4
  },
  sendBtn: {
    backgroundColor: '#10B981',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4
  },
  recordBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#450A0A',
    paddingHorizontal: 16,
    paddingVertical: 10
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  recordingDuration: {
    color: '#FCA5A5',
    fontSize: 14,
    fontWeight: 'bold'
  },
  cancelRecordBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#1E293B',
    borderRadius: 8
  },
  cancelRecordText: {
    color: '#E2E8F0',
    fontSize: 12
  },
  sendRecordBtn: {
    backgroundColor: '#DC2626',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  modalContent: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    width: '80%',
    gap: 12
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#334155'
  },
  modalOptionText: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '500'
  },
  templateModalBox: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 18,
    width: '90%',
    maxHeight: '80%'
  },
  templateTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4
  },
  templateSub: {
    color: '#94A3B8',
    fontSize: 12,
    marginBottom: 14
  },
  templateItem: {
    backgroundColor: '#090A0F',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#334155'
  },
  templateItemTitle: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '600'
  },
  templateItemSub: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 2
  },
  closeModalBtn: {
    marginTop: 10,
    alignItems: 'center',
    paddingVertical: 10
  },
  closeModalText: {
    color: '#94A3B8',
    fontSize: 13
  },
  emptyChat: {
    alignItems: 'center',
    padding: 20
  },
  emptyChatText: {
    color: '#64748B',
    fontSize: 12
  }
});
