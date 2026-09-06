import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Search,
  Filter,
  Send,
  Paperclip,
  Mic,
  MicOff,
  Image as ImageIcon,
  FileText,
  Video,
  Play,
  Pause,
  Clock,
  Check,
  CheckCheck,
  AlertCircle,
  Phone,
  User,
  MoreVertical,
  ChevronLeft,
  X,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Tag,
  Download,
  Calendar,
  ExternalLink,
  Smile,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  LogOut,
  ArrowLeft
} from 'lucide-react';
import { whatsappCrmService } from '../services/whatsappCrmService';
import { checkAdminSession, getAdminPassword, setAdminSession } from '../supabase';

export default function WhatsAppCrmPage({ onBack }) {
  // Admin Authentication State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(checkAdminSession);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  // State: Conversations & Active selection
  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [stats, setStats] = useState({
    totalCustomers: 0,
    unreadConversations: 0,
    activeConversations: 0,
    pendingConversations: 0,
    resolvedConversations: 0,
    messagesToday: 0
  });

  // State: Filters & Search
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'new', 'pending', 'resolved'
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingList, setLoadingList] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // State: Composer & Input
  const [inputMessage, setInputMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showProfileDrawer, setShowProfileDrawer] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [newChatPhone, setNewChatPhone] = useState('');
  const [newChatName, setNewChatName] = useState('');
  const [newChatMessage, setNewChatMessage] = useState('Hello! Welcome to Bazara.');
  const [errorMessage, setErrorMessage] = useState('');

  // State: Media Lightbox Viewer
  const [previewMedia, setPreviewMedia] = useState(null); // { url, type, filename }

  // State: Voice Recording (Web Audio)
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);

  // State: Audio Playback
  const [playingAudioId, setPlayingAudioId] = useState(null);
  const audioPlayerRef = useRef(null);

  // Refs for smooth auto-scroll & media recorder
  const messagesEndRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordingTimerRef = useRef(null);
  const fileInputRef = useRef(null);
  const docInputRef = useRef(null);

  // Deduplicated Message Appender Helper
  const appendMessageDeduplicated = useCallback((newMsg) => {
    if (!newMsg) return;
    setMessages(prev => {
      if (prev.some(m => (m.id && m.id === newMsg.id) || (m.meta_message_id && newMsg.meta_message_id && m.meta_message_id === newMsg.meta_message_id))) {
        return prev;
      }
      return [...prev, newMsg];
    });
  }, []);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      const realPassword = await getAdminPassword();
      if (passwordInput.trim() === realPassword) {
        setAdminSession(true);
        setIsAdminAuthenticated(true);
        setPasswordInput('');
      } else {
        setAuthError('Incorrect password. Please try again.');
      }
    } catch (err) {
      if (passwordInput.trim() === 'admin123') {
        setAdminSession(true);
        setIsAdminAuthenticated(true);
        setPasswordInput('');
      } else {
        setAuthError('Authentication failed. Default password is admin123');
      }
    }
  };

  const handleAdminLogout = () => {
    setAdminSession(false);
    setIsAdminAuthenticated(false);
  };

  // Selected conversation object
  const activeConversation = conversations.find(c => c.id === activeConvId);
  const activeCustomer = activeConversation?.whatsapp_customers;

  // 1. Initial Load of Conversations & Stats
  const loadConversations = useCallback(async () => {
    setLoadingList(true);
    const { data } = await whatsappCrmService.getConversations({
      filter,
      search: searchQuery
    });
    setConversations(data || []);
    setLoadingList(false);

    // Auto-select first conversation on desktop if none selected
    if (data?.length > 0 && !activeConvId && window.innerWidth >= 1024) {
      setActiveConvId(data[0].id);
    }
  }, [filter, searchQuery, activeConvId]);

  const loadStats = useCallback(async () => {
    const s = await whatsappCrmService.getDashboardStats();
    setStats(s);
  }, []);

  useEffect(() => {
    loadConversations();
    loadStats();
  }, [loadConversations, loadStats]);

  // 2. Load Messages when Active Conversation Changes
  useEffect(() => {
    if (!activeConvId) {
      setMessages([]);
      return;
    }

    let isMounted = true;
    const fetchMsgs = async () => {
      setLoadingMessages(true);
      const { data } = await whatsappCrmService.getMessages(activeConvId);
      if (isMounted) {
        setMessages(data || []);
        setLoadingMessages(false);

        // Mark as read in CRM and clear unread badge
        if (activeConversation?.unread_count > 0) {
          const lastMetaId = data?.filter(m => m.direction === 'inbound').slice(-1)[0]?.meta_message_id;
          await whatsappCrmService.markAsRead(activeConvId, activeCustomer?.id, lastMetaId);

          setConversations(prev =>
            prev.map(c => (c.id === activeConvId ? { ...c, unread_count: 0 } : c))
          );
        }
      }
    };

    fetchMsgs();
    return () => {
      isMounted = false;
    };
  }, [activeConvId]);

  // 3. Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 4. Realtime Subscription Setup
  useEffect(() => {
    const unsubscribe = whatsappCrmService.subscribeToRealtime({
      onNewMessage: newMsg => {
        // If message belongs to active conversation, append it deduplicated
        if (newMsg.conversation_id === activeConvId) {
          appendMessageDeduplicated(newMsg);
        }
        // Refresh conversation list preview
        loadConversations();
        loadStats();
      },
      onStatusUpdate: updatedMsg => {
        setMessages(prev =>
          prev.map(m => (m.id === updatedMsg.id ? { ...m, ...updatedMsg } : m))
        );
      },
      onConversationUpdate: () => {
        loadConversations();
      }
    });

    return () => {
      unsubscribe();
    };
  }, [activeConvId, loadConversations, loadStats, appendMessageDeduplicated]);

  // 5. Send Text Message
  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || sending || !activeConversation) return;

    const messageText = inputMessage.trim();
    setInputMessage('');
    setSending(true);
    setErrorMessage('');

    const res = await whatsappCrmService.sendMessage({
      customerId: activeCustomer?.id,
      conversationId: activeConvId,
      to: activeCustomer?.whatsapp_number,
      messageType: 'text',
      textContent: messageText
    });

    if (res.success && res.data?.message) {
      appendMessageDeduplicated(res.data.message);
    } else if (res.error) {
      setErrorMessage(res.error);
      alert(`Message Send Error: ${res.error}`);
    }
    setSending(false);
  };

  // 5b. Start New Chat with Any WhatsApp Phone Number
  const handleStartNewChat = async (e) => {
    if (e) e.preventDefault();
    if (!newChatPhone.trim() || sending) return;

    const cleanPhone = newChatPhone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      alert('Please enter a valid WhatsApp phone number with country code (e.g. 919876543210)');
      return;
    }

    setSending(true);
    setErrorMessage('');

    const res = await whatsappCrmService.sendMessage({
      to: cleanPhone,
      messageType: 'text',
      textContent: newChatMessage.trim() || 'Hello! Welcome to Bazara.'
    });

    if (res.success) {
      setShowNewChatModal(false);
      setNewChatPhone('');
      setNewChatName('');
      await loadConversations();
      loadStats();
    } else {
      setErrorMessage(res.error);
      alert(`Failed to start chat: ${res.error}\n\nTip: If sending for the first time outside 24h, an approved Meta template may be required.`);
    }
    setSending(false);
  };

  // 6. Voice Recording Handler
  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      let mimeType = '';
      if (MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')) {
        mimeType = 'audio/ogg;codecs=opus';
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        mimeType = 'audio/mp4';
      } else if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        mimeType = 'audio/webm;codecs=opus';
      }
      const mediaRecorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const actualType = mediaRecorder.mimeType || mimeType || 'audio/ogg';
        const blob = new Blob(chunks, { type: actualType });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingDuration(0);

      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Microphone access denied:', err);
      alert('Microphone permission is required to record voice notes.');
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream?.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      clearInterval(recordingTimerRef.current);
    }
  };

  const cancelVoiceRecording = () => {
    stopVoiceRecording();
    setAudioBlob(null);
    setAudioUrl(null);
  };

  const sendRecordedVoiceNote = async () => {
    if (!audioBlob || !activeConversation) return;
    setSending(true);

    const reader = new FileReader();
    reader.readAsDataURL(audioBlob);
    reader.onloadend = async () => {
      const base64Audio = reader.result;
      const res = await whatsappCrmService.sendMessage({
        customerId: activeCustomer?.id,
        conversationId: activeConvId,
        to: activeCustomer?.whatsapp_number,
        messageType: 'audio',
        mediaUrl: base64Audio,
        filename: 'voice_note.ogg'
      });

      if (res.success && res.data?.message) {
        appendMessageDeduplicated(res.data.message);
      } else if (!res.success) {
        alert(`Failed to send voice note: ${res.error || 'Check 24-hr session window'}`);
      }
      setAudioBlob(null);
      setAudioUrl(null);
      setSending(false);
    };
  };

  // 7. Handle File Attachments (Photos & Documents)
  const handleFileUpload = async (event, type = 'image') => {
    const file = event.target.files?.[0];
    if (!file || !activeConversation) return;

    // Reset file input so same file can be picked again
    event.target.value = '';

    setShowAttachMenu(false);
    setSending(true);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const base64Data = reader.result;
      const res = await whatsappCrmService.sendMessage({
        customerId: activeCustomer?.id,
        conversationId: activeConvId,
        to: activeCustomer?.whatsapp_number,
        messageType: type,
        mediaUrl: base64Data,
        filename: file.name
      });

      if (res.success && res.data?.message) {
        appendMessageDeduplicated(res.data.message);
      } else if (!res.success) {
        alert(`Failed to send ${type}: ${res.error || 'Check 24-hr session window'}`);
      }
      setSending(false);
    };
  };

  // 8. Update Status Handler
  const handleStatusChange = async (newStatus) => {
    if (!activeConvId || !activeCustomer?.id) return;
    await whatsappCrmService.updateStatus(activeConvId, activeCustomer.id, newStatus);
    setConversations(prev =>
      prev.map(c => (c.id === activeConvId ? { ...c, status: newStatus } : c))
    );
  };

  // Calculate 24-hour Meta window remaining
  const calculateWindowRemaining = (lastCustomerMsgAt) => {
    if (!lastCustomerMsgAt) return { open: false, text: 'Session Expired' };
    const lastTime = new Date(lastCustomerMsgAt).getTime();
    const now = Date.now();
    const diffHours = (now - lastTime) / (1000 * 60 * 60);

    if (diffHours >= 24) {
      return { open: false, text: '24h Window Expired (Use Template)' };
    }
    const remainingHours = Math.floor(24 - diffHours);
    const remainingMins = Math.floor(((24 - diffHours) - remainingHours) * 60);
    return { open: true, text: `${remainingHours}h ${remainingMins}m window active` };
  };

  const sessionWindow = calculateWindowRemaining(activeConversation?.last_customer_message_at);

  // ================= 1. ADMIN AUTHENTICATION GATE =================
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-[#08090E] flex flex-col items-center justify-center p-4 selection:bg-emerald-500/30">
        <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-[#0e111d] border border-white/15 shadow-2xl space-y-6 text-center">
          <div className="space-y-3">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/20">
              <MessageSquare className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight">Bazara WhatsApp CRM</h1>
              <p className="text-xs text-slate-400 mt-1">Restricted Area • Owner Authentication Required</p>
            </div>
          </div>

          {authError && (
            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold">
              {authError}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4 text-left">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">Owner Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter admin password..."
                  className="w-full px-3.5 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-400 font-mono pr-10"
                  required
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-white cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5">
                🔑 Default password: <code className="text-emerald-400 font-mono font-bold bg-white/[0.05] px-1.5 py-0.5 rounded">admin123</code>
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl font-black text-xs uppercase tracking-wider bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-xl shadow-emerald-500/30 active:scale-95 transition-all flex items-center justify-center space-x-2 cursor-pointer btn-shine-effect"
            >
              <Lock className="w-4 h-4" />
              <span>Unlock WhatsApp CRM 🚀</span>
            </button>
          </form>

          <div className="pt-2 border-t border-white/[0.06]">
            <button
              onClick={onBack || (() => window.location.href = '/')}
              className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
            >
              ← Return to Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* 1. TOP METRICS & STATS HEADER BAR */}
      <div className="bg-slate-900/90 backdrop-blur border-b border-slate-800 px-4 py-2.5 flex items-center justify-between gap-4 overflow-x-auto shrink-0 scrollbar-none">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Back to Admin"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-white tracking-wide flex items-center gap-1.5">
              WhatsApp CRM
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-1.5 py-0.5 rounded border border-emerald-500/30">
                LIVE CLOUD API
              </span>
            </h1>
            <p className="text-[11px] text-slate-400">Direct Meta Two-Way Messaging</p>
          </div>
        </div>

        {/* Metric Badges & Lock Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1 rounded-lg border border-slate-700/60">
            <span className="text-[11px] text-slate-400">Total Leads</span>
            <span className="text-xs font-bold text-white font-mono">{stats.totalCustomers}</span>
          </div>
          <div className="flex items-center gap-2 bg-emerald-950/40 px-3 py-1 rounded-lg border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[11px] text-emerald-300">Unread</span>
            <span className="text-xs font-bold text-emerald-400 font-mono">{stats.unreadConversations}</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-slate-800/80 px-3 py-1 rounded-lg border border-slate-700/60">
            <span className="text-[11px] text-slate-400">Pending</span>
            <span className="text-xs font-bold text-amber-400 font-mono">{stats.pendingConversations}</span>
          </div>
          <div className="hidden md:flex items-center gap-2 bg-slate-800/80 px-3 py-1 rounded-lg border border-slate-700/60">
            <span className="text-[11px] text-slate-400">Resolved</span>
            <span className="text-xs font-bold text-blue-400 font-mono">{stats.resolvedConversations}</span>
          </div>
          <button
            onClick={() => { loadConversations(); loadStats(); }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title="Refresh inbox"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleAdminLogout}
            className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition border border-rose-500/20"
            title="Lock CRM / Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. MAIN 3-COLUMN / MOBILE RESPONSIVE WORKSPACE */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* LEFT COLUMN: CUSTOMER CONVERSATION LIST */}
        <div
          className={`w-full lg:w-80 xl:w-96 border-r border-slate-800 bg-slate-900/60 flex flex-col shrink-0 transition-all duration-300 ${
            activeConvId ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* Search Box */}
          <div className="p-3 border-b border-slate-800">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name, phone, message..."
                className="w-full pl-9 pr-4 py-2 bg-slate-850 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-2.5 text-slate-400 hover:text-white">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Chips */}
            <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto scrollbar-none">
              {['all', 'unread', 'new', 'pending', 'resolved'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium capitalize whitespace-nowrap transition ${
                    filter === f
                      ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm'
                      : 'bg-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/50">
            {loadingList ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3, 4, 5].map((n) => (
                  <div key={n} className="flex gap-3 animate-pulse">
                    <div className="w-10 h-10 rounded-full bg-slate-800"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-3.5 bg-slate-800 rounded w-1/2"></div>
                      <div className="h-3 bg-slate-850 rounded w-3/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center text-slate-400">
                <MessageSquare className="w-8 h-8 mb-2 opacity-40 text-emerald-400" />
                <p className="text-xs font-medium text-slate-300">No conversations found</p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Incoming WhatsApp messages from customers will show up here automatically.
                </p>
              </div>
            ) : (
              conversations.map((conv) => {
                const cust = conv.whatsapp_customers;
                const isSelected = conv.id === activeConvId;
                const hasUnread = conv.unread_count > 0;

                return (
                  <button
                    key={conv.id}
                    onClick={() => setActiveConvId(conv.id)}
                    className={`w-full p-3 flex items-start gap-3 text-left transition ${
                      isSelected
                        ? 'bg-emerald-500/10 border-l-4 border-emerald-500'
                        : 'hover:bg-slate-800/40'
                    }`}
                  >
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-slate-800 to-slate-700 border border-slate-700 flex items-center justify-center font-bold text-slate-200 text-sm shadow-inner">
                        {cust?.name ? cust.name.charAt(0).toUpperCase() : <User className="w-5 h-5 text-slate-400" />}
                      </div>
                      {hasUnread && (
                        <span className="absolute -top-1 -right-1 bg-emerald-500 text-slate-950 text-[10px] font-bold px-1.5 py-0.2 rounded-full min-w-[18px] text-center shadow-lg">
                          {conv.unread_count}
                        </span>
                      )}
                    </div>

                    {/* Chat Snippet */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className={`text-xs font-semibold truncate ${hasUnread ? 'text-white' : 'text-slate-300'}`}>
                          {cust?.name || cust?.whatsapp_number}
                        </span>
                        <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                          {conv.last_message_at ? new Date(conv.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className={`text-[11px] truncate ${hasUnread ? 'text-emerald-300 font-medium' : 'text-slate-400'}`}>
                          {conv.last_message_preview || 'New conversation'}
                        </p>
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded capitalize font-medium ml-1.5 shrink-0 ${
                            conv.status === 'resolved'
                              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                              : conv.status === 'pending'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          }`}
                        >
                          {conv.status}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* CENTER COLUMN: ACTIVE CHAT CONVERSATION */}
        {activeConversation ? (
          <div className="flex-1 flex flex-col bg-slate-950/80 relative">
            {/* Active Header */}
            <div className="h-14 border-b border-slate-800 bg-slate-900/90 px-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                {/* Back button for mobile */}
                <button
                  onClick={() => setActiveConvId(null)}
                  className="lg:hidden p-1.5 -ml-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-bold text-emerald-300 text-xs">
                  {activeCustomer?.name ? activeCustomer.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xs sm:text-sm font-semibold text-white truncate">
                      {activeCustomer?.name}
                    </h2>
                    <span className="text-[11px] text-slate-400 font-mono">
                      +{activeCustomer?.whatsapp_number}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className={`flex items-center gap-1 ${sessionWindow.open ? 'text-emerald-400' : 'text-amber-400'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${sessionWindow.open ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                      {sessionWindow.text}
                    </span>
                  </div>
                </div>
              </div>

              {/* Header Actions */}
              <div className="flex items-center gap-2">
                {/* Status Dropdown */}
                <select
                  value={activeConversation.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="bg-slate-800 text-[11px] text-slate-200 border border-slate-700 rounded-lg px-2 py-1 focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="new">🟢 New</option>
                  <option value="pending">🟡 Pending</option>
                  <option value="resolved">🔵 Resolved</option>
                </select>

                <button
                  onClick={() => setShowProfileDrawer(!showProfileDrawer)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                  title="Customer Profile & Notes"
                >
                  <User className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 24-Hour Policy Notice Banner if closed */}
            {!sessionWindow.open && (
              <div className="bg-amber-950/40 border-b border-amber-500/30 px-4 py-2 flex items-center justify-between text-[11px] text-amber-300">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Meta 24-hour free messaging window has ended. Send an approved template to restart chat.</span>
                </div>
                <button
                  onClick={() => setShowTemplateModal(true)}
                  className="bg-amber-500 text-slate-950 font-bold px-2.5 py-0.5 rounded text-[10px] hover:bg-amber-400 transition"
                >
                  Send Template
                </button>
              </div>
            )}

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]">
              {loadingMessages ? (
                <div className="flex justify-center items-center h-full">
                  <RefreshCw className="w-6 h-6 text-emerald-400 animate-spin" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-slate-400">
                  <MessageSquare className="w-10 h-10 mb-2 opacity-30 text-emerald-400" />
                  <p className="text-xs font-medium text-slate-300">No messages in this conversation yet</p>
                  <p className="text-[11px] text-slate-500 mt-1">Send a message below to start the conversation.</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isOutbound = msg.direction === 'outbound';

                  return (
                    <motion.div
                      key={msg.id || msg.meta_message_id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${isOutbound ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] sm:max-w-md rounded-2xl p-3 shadow-md ${
                          isOutbound
                            ? 'bg-emerald-600 text-white rounded-tr-none'
                            : 'bg-slate-850 text-slate-100 border border-slate-700/80 rounded-tl-none'
                        }`}
                      >
                        {/* 1. IMAGE MESSAGE */}
                        {msg.message_type === 'image' && (
                          <div className="mb-2">
                            <img
                              src={msg.media_url || `/api/whatsapp-media?media_id=${msg.media_id}`}
                              alt="WhatsApp media"
                              className="rounded-lg max-h-60 w-full object-cover cursor-pointer hover:opacity-95 transition hover:brightness-105"
                              onClick={() => setPreviewMedia({
                                url: msg.media_url || `/api/whatsapp-media?media_id=${msg.media_id}`,
                                type: 'image',
                                filename: msg.filename || 'WhatsApp_Photo.jpg'
                              })}
                            />
                          </div>
                        )}

                        {/* 2. DOCUMENT / PDF MESSAGE */}
                        {msg.message_type === 'document' && (
                          <a
                            href={msg.media_url || `/api/whatsapp-media?media_id=${msg.media_id}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-3 p-2.5 rounded-lg bg-black/20 hover:bg-black/30 border border-white/10 mb-1.5 transition"
                          >
                            <FileText className="w-8 h-8 text-emerald-300 shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-semibold truncate">{msg.filename || 'PDF Document'}</p>
                              <p className="text-[10px] opacity-75">Click to view/download</p>
                            </div>
                            <Download className="w-4 h-4 opacity-80" />
                          </a>
                        )}

                        {/* 3. AUDIO / VOICE NOTE MESSAGE */}
                        {msg.message_type === 'audio' && (
                          <div className="flex items-center gap-3 py-1">
                            <audio
                              controls
                              src={msg.media_url || `/api/whatsapp-media?media_id=${msg.media_id}`}
                              className="w-full h-8 accent-emerald-400"
                            />
                          </div>
                        )}

                        {/* 4. VIDEO MESSAGE */}
                        {msg.message_type === 'video' && (
                          <div className="mb-2">
                            <video
                              controls
                              src={msg.media_url || `/api/whatsapp-media?media_id=${msg.media_id}`}
                              className="rounded-lg max-h-60 w-full cursor-pointer"
                              onClick={() => setPreviewMedia({
                                url: msg.media_url || `/api/whatsapp-media?media_id=${msg.media_id}`,
                                type: 'video',
                                filename: msg.filename || 'WhatsApp_Video.mp4'
                              })}
                            />
                          </div>
                        )}

                        {/* 5. TEXT CONTENT */}
                        {msg.text_content && (
                          <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">
                            {msg.text_content}
                          </p>
                        )}

                        {/* Message Metadata (Time & Delivery Status) */}
                        <div
                          className={`flex items-center justify-end gap-1 mt-1 text-[9px] ${
                            isOutbound ? 'text-emerald-100/80' : 'text-slate-400'
                          }`}
                        >
                          <span>
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>

                          {isOutbound && (
                            <span>
                              {msg.delivery_status === 'read' ? (
                                <CheckCheck className="w-3.5 h-3.5 text-cyan-300 inline" />
                              ) : msg.delivery_status === 'delivered' ? (
                                <CheckCheck className="w-3.5 h-3.5 opacity-80 inline" />
                              ) : msg.delivery_status === 'sent' ? (
                                <Check className="w-3.5 h-3.5 opacity-80 inline" />
                              ) : msg.delivery_status === 'failed' ? (
                                <AlertCircle className="w-3.5 h-3.5 text-rose-400 inline" title={msg.error_message || 'Failed'} />
                              ) : (
                                <Clock className="w-3 h-3 opacity-60 inline" />
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Audio Recording Live Preview Bar */}
            {isRecording && (
              <div className="bg-rose-950/90 border-t border-rose-500/30 px-4 py-2.5 flex items-center justify-between text-xs text-rose-200">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
                  <span className="font-semibold font-mono">Recording Voice Note ({recordingDuration}s)</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={cancelVoiceRecording}
                    className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 text-[11px] hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={stopVoiceRecording}
                    className="px-3 py-1 rounded bg-rose-600 text-white font-bold text-[11px] hover:bg-rose-500 shadow"
                  >
                    Stop & Preview
                  </button>
                </div>
              </div>
            )}

            {/* Audio Recorded Preview & Send Bar */}
            {audioUrl && !isRecording && (
              <div className="bg-slate-900 border-t border-slate-800 px-4 py-3 flex items-center justify-between gap-3">
                <audio controls src={audioUrl} className="h-8 flex-1 accent-emerald-500" />
                <button
                  onClick={cancelVoiceRecording}
                  className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
                <button
                  onClick={sendRecordedVoiceNote}
                  disabled={sending}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow"
                >
                  <Send className="w-3.5 h-3.5" /> Send Voice
                </button>
              </div>
            )}

            {/* Bottom Message Composer */}
            <div className="border-t border-slate-800 bg-slate-900/90 p-3 relative">
              {/* Attachment Popup Menu */}
              <AnimatePresence>
                {showAttachMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-16 left-4 bg-slate-850 border border-slate-700 rounded-2xl p-2 shadow-2xl z-20 flex gap-2"
                  >
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex flex-col items-center gap-1 p-2.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-emerald-400 transition text-[10px]"
                    >
                      <ImageIcon className="w-5 h-5 text-emerald-400" />
                      <span>Photo</span>
                    </button>
                    <button
                      onClick={() => docInputRef.current?.click()}
                      className="flex flex-col items-center gap-1 p-2.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-blue-400 transition text-[10px]"
                    >
                      <FileText className="w-5 h-5 text-blue-400" />
                      <span>PDF Doc</span>
                    </button>
                    <button
                      onClick={() => { setShowAttachMenu(false); setShowTemplateModal(true); }}
                      className="flex flex-col items-center gap-1 p-2.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-amber-400 transition text-[10px]"
                    >
                      <Sparkles className="w-5 h-5 text-amber-400" />
                      <span>Template</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Hidden File Inputs */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileUpload(e, 'image')}
              />
              <input
                ref={docInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                className="hidden"
                onChange={(e) => handleFileUpload(e, 'document')}
              />

              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                {/* Attachment Trigger */}
                <button
                  type="button"
                  onClick={() => setShowAttachMenu(!showAttachMenu)}
                  className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
                  title="Attach media or document"
                >
                  <Paperclip className="w-5 h-5" />
                </button>

                {/* Text Input */}
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type WhatsApp message..."
                  className="flex-1 bg-slate-850 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition"
                />

                {/* Voice Mic Record Trigger */}
                <button
                  type="button"
                  onClick={startVoiceRecording}
                  className="p-2.5 rounded-xl text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition"
                  title="Record voice note"
                >
                  <Mic className="w-5 h-5" />
                </button>

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || sending}
                  className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold disabled:opacity-40 disabled:cursor-not-allowed transition shadow-lg shadow-emerald-500/20"
                >
                  {sending ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Empty State when no conversation is selected on desktop */
          <div className="hidden lg:flex flex-1 flex-col items-center justify-center text-center p-8 bg-slate-950">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 shadow-xl">
              <MessageSquare className="w-8 h-8" />
            </div>
            <h3 className="text-base font-semibold text-white">Select a Conversation</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              Choose a customer from the left list to view their complete message history, send replies, photos, PDFs, and voice notes.
            </p>
          </div>
        )}

        {/* RIGHT COLUMN: CUSTOMER PROFILE & CRM DRAWER */}
        <AnimatePresence>
          {showProfileDrawer && activeCustomer && (
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className="w-80 border-l border-slate-800 bg-slate-900 p-4 flex flex-col shrink-0 z-30 absolute right-0 top-0 bottom-0 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Customer Details</h3>
                <button onClick={() => setShowProfileDrawer(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="py-4 text-center border-b border-slate-800">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 flex items-center justify-center font-bold text-emerald-300 text-xl mx-auto mb-2 shadow-inner">
                  {activeCustomer.name ? activeCustomer.name.charAt(0).toUpperCase() : <User className="w-8 h-8" />}
                </div>
                <h4 className="text-sm font-semibold text-white">{activeCustomer.name}</h4>
                <p className="text-xs text-slate-400 font-mono mt-0.5">+{activeCustomer.whatsapp_number}</p>
              </div>

              {/* Status & Session Window */}
              <div className="py-3 border-b border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Lead Status</span>
                  <span className="font-semibold capitalize text-emerald-400">{activeConversation.status}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Meta Window</span>
                  <span className="font-semibold text-[11px] text-amber-300">{sessionWindow.text}</span>
                </div>
              </div>

              {/* Customer Notes */}
              <div className="py-3 flex-1 flex flex-col">
                <label className="text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-emerald-400" />
                  Internal CRM Notes
                </label>
                <textarea
                  defaultValue={activeCustomer.notes || ''}
                  onBlur={(e) => whatsappCrmService.updateCustomer(activeCustomer.id, { notes: e.target.value })}
                  placeholder="Add notes about this customer, requirements, payments..."
                  className="w-full flex-1 bg-slate-850 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none transition"
                />
                <span className="text-[10px] text-slate-500 mt-1">Auto-saves when you click outside.</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* MODAL: META TEMPLATE SELECTOR */}
      <AnimatePresence>
        {showTemplateModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-5 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  Send Approved Meta Template
                </h3>
                <button onClick={() => setShowTemplateModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="py-4 space-y-3">
                <p className="text-xs text-slate-400">
                  Select an approved template to restart the 24-hour customer messaging window:
                </p>

                <div className="space-y-2">
                  {[
                    { name: 'order_delivery_update', label: 'Order Delivery & Download Link' },
                    { name: 'payment_reminder', label: 'Payment / Service Reminder' },
                    { name: 'general_support_followup', label: 'Customer Support Follow-up' }
                  ].map((tpl) => (
                    <button
                      key={tpl.name}
                      onClick={async () => {
                        setShowTemplateModal(false);
                        setSending(true);
                        const res = await whatsappCrmService.sendMessage({
                          customerId: activeCustomer?.id,
                          conversationId: activeConvId,
                          to: activeCustomer?.whatsapp_number,
                          messageType: 'template',
                          templateName: tpl.name
                        });
                        if (res.success && res.data?.message) {
                          setMessages(prev => [...prev, res.data.message]);
                        }
                        setSending(false);
                      }}
                      className="w-full text-left p-3 rounded-xl bg-slate-800 hover:bg-emerald-500/10 hover:border-emerald-500/50 border border-slate-700 transition"
                    >
                      <p className="text-xs font-semibold text-white">{tpl.label}</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">{tpl.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => setShowTemplateModal(false)}
                  className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* FULLSCREEN MEDIA LIGHTBOX VIEWER WITH PROMINENT BACK BUTTON */}
        {previewMedia && (
          <div
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-between p-3 sm:p-6 select-none"
            onClick={() => setPreviewMedia(null)}
          >
            {/* Top Header Controls Bar */}
            <div
              className="w-full max-w-5xl flex items-center justify-between py-2.5 px-3 rounded-2xl bg-slate-900/90 border border-white/10 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setPreviewMedia(null)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 hover:text-emerald-200 text-xs font-bold transition border border-emerald-500/30 active:scale-95 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>← Back to Chat</span>
              </button>

              <span className="text-xs text-slate-300 font-mono truncate max-w-[150px] sm:max-w-xs px-2">
                {previewMedia.filename || 'Media Preview'}
              </span>

              <div className="flex items-center gap-2">
                <a
                  href={previewMedia.url}
                  download={previewMedia.filename || 'media'}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition border border-white/10"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Download</span>
                </a>
                <button
                  onClick={() => setPreviewMedia(null)}
                  className="p-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 transition border border-rose-500/30 cursor-pointer"
                  title="Close Preview"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Main Image / Video Viewport */}
            <div
              className="flex-1 w-full max-w-5xl flex items-center justify-center p-2 sm:p-4 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {previewMedia.type === 'image' ? (
                <img
                  src={previewMedia.url}
                  alt="Preview"
                  className="max-h-[78vh] max-w-full rounded-2xl object-contain shadow-2xl border border-white/10"
                />
              ) : (
                <video
                  src={previewMedia.url}
                  controls
                  autoPlay
                  className="max-h-[78vh] max-w-full rounded-2xl shadow-2xl border border-white/10"
                />
              )}
            </div>

            {/* Bottom Back Button Bar for Mobile Ease */}
            <div
              className="w-full max-w-sm flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setPreviewMedia(null)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition border border-slate-700 shadow-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Tap to Return to Chat</span>
              </button>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
