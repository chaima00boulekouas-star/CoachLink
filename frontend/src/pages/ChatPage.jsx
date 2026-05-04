import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Send, ArrowLeft, Loader2, MessageCircle, CheckCheck, Check, Search, Trash2 } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { chatService } from '../api/dataService';
import { useSelector } from 'react-redux';
import { getImageUrl } from '../utils/imageUrl';

const AVATAR_FALLBACK = (name, bg = '6366f1') =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name || '?')}&background=${bg}&color=fff&size=128`;

const formatTime = (d) => {
  if (!d) return '';
  return new Date(d).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

const formatDate = (d) => {
  if (!d) return '';
  const date = new Date(d);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const formatSidebarTime = (d) => {
  if (!d) return '';
  const date = new Date(d);
  const today = new Date();
  if (date.toDateString() === today.toDateString()) {
    return formatTime(d);
  }
  const diffDays = Math.floor((today - date) / 86400000);
  if (diffDays < 7) return date.toLocaleDateString('en-US', { weekday: 'short' });
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// Group messages by date for date separators
const groupMessagesByDate = (messages) => {
  const groups = [];
  let currentDate = '';
  for (const msg of messages) {
    const date = formatDate(msg.createdAt);
    if (date !== currentDate) {
      groups.push({ type: 'date', date });
      currentDate = date;
    }
    groups.push({ type: 'message', ...msg });
  }
  return groups;
};

const ChatPage = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cleanedUp, setCleanedUp] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const currentUser = useSelector(state => state.auth?.user);
  const pollRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Get the current user ID consistently
  const myId = currentUser?._id || currentUser?.id;

  // Cleanup duplicates on first load
  useEffect(() => {
    if (cleanedUp) return;
    const cleanup = async () => {
      try {
        await chatService.cleanupDuplicates();
        setCleanedUp(true);
      } catch {
        setCleanedUp(true);
      }
    };
    cleanup();
  }, [cleanedUp]);

  // Fetch conversations list
  useEffect(() => {
    if (!cleanedUp) return;
    const fetchConversations = async () => {
      try {
        const data = await chatService.getConversations();
        setConversations(data.conversations || []);
      } catch (err) {
        console.error('Failed to fetch conversations:', err);
      }
    };
    fetchConversations();
  }, [cleanedUp]);

  // Fetch messages when a conversation is selected
  useEffect(() => {
    if (!conversationId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const fetchMessages = async () => {
      try {
        const data = await chatService.getMessages(conversationId);
        setMessages(data.messages || []);
      } catch (err) {
        console.error('Failed to fetch messages:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();

    // Poll for new messages every 3 seconds
    pollRef.current = setInterval(async () => {
      try {
        const data = await chatService.getMessages(conversationId);
        setMessages(prev => {
          // Only update if message count changed to avoid unnecessary re-renders
          if (JSON.stringify(prev.map(m => m._id)) !== JSON.stringify((data.messages || []).map(m => m._id))) {
            return data.messages || [];
          }
          // Still update read status
          return data.messages || prev;
        });
      } catch { /* ignore polling errors */ }
    }, 3000);

    // Also refresh conversation list to update unread counts
    const convPoll = setInterval(async () => {
      try {
        const data = await chatService.getConversations();
        setConversations(data.conversations || []);
      } catch { /* ignore */ }
    }, 5000);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
      clearInterval(convPoll);
    };
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Focus input when conversation changes
  useEffect(() => {
    if (conversationId) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [conversationId]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !conversationId || isSending) return;

    const text = newMessage.trim();
    setNewMessage('');
    setIsSending(true);

    // Optimistic update — show the message immediately
    const tempMsg = {
      _id: `temp-${Date.now()}`,
      sender: { _id: myId, name: currentUser?.name },
      text,
      createdAt: new Date().toISOString(),
      read: false,
      _temp: true,
    };
    setMessages(prev => [...prev, tempMsg]);

    try {
      const data = await chatService.sendMessage(conversationId, text);

      // Replace temp message with real one
      setMessages(prev =>
        prev.map(m => m._temp ? data.message : m)
      );

      // Update the conversation list's last message
      setConversations(prev =>
        prev.map(c =>
          c._id === conversationId
            ? { ...c, lastMessage: { text, sender: myId, createdAt: new Date() }, updatedAt: new Date(), unreadCount: 0 }
            : c
        ).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      );
    } catch (err) {
      console.error('Failed to send message:', err);
      // Remove the temp message on failure
      setMessages(prev => prev.filter(m => !m._temp));
      setNewMessage(text); // Restore the text
    } finally {
      setIsSending(false);
    }
  };

  const getOtherParticipant = (conv) => {
    if (!conv?.participants || !myId) return null;
    return conv.participants.find(p => (p._id || p) !== myId) || conv.participants[0];
  };

  const activeConv = conversations.find(c => c._id === conversationId);
  const otherUser = activeConv ? getOtherParticipant(activeConv) : null;

  // Filter conversations by search
  const filteredConversations = conversations.filter(conv => {
    if (!searchQuery.trim()) return true;
    const other = getOtherParticipant(conv);
    return other?.name?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className="bg-white dark:bg-dark-card rounded-2xl border border-slate-100 dark:border-dark-border shadow-sm overflow-hidden" style={{ height: 'calc(100vh - 160px)' }}>
          <div className="flex h-full">

            {/* ─── Sidebar ─────────────────────────────────────────────── */}
            <div className={`w-full sm:w-80 border-r border-slate-100 dark:border-dark-border flex flex-col flex-shrink-0 ${conversationId ? 'hidden sm:flex' : 'flex'}`}>
              <div className="p-4 border-b border-slate-100 dark:border-dark-border">
                <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2 mb-3">
                  <MessageCircle size={20} className="text-primary-blue" /> Messages
                </h2>
                {/* Search */}
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search conversations..."
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-dark-bg text-slate-900 dark:text-white focus:outline-none focus:border-primary-blue transition-colors"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {filteredConversations.length === 0 ? (
                  <div className="text-center py-16 px-4">
                    <MessageCircle size={40} className="mx-auto mb-3 text-slate-200 dark:text-dark-border" />
                    <p className="text-sm text-slate-400 dark:text-slate-600 font-semibold">
                      {searchQuery ? 'No matching conversations' : 'No conversations yet'}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">Start a chat from a trainer's or athlete's profile</p>
                  </div>
                ) : (
                  filteredConversations.map((conv) => {
                    const other = getOtherParticipant(conv);
                    const isActive = conv._id === conversationId;
                    const hasUnread = conv.unreadCount > 0 && !isActive;
                    const isLastMsgMine = conv.lastMessage?.sender?.toString() === myId;

                    return (
                      <Link key={conv._id} to={`/chat/${conv._id}`}>
                        <div className={`flex items-center gap-3 p-3.5 cursor-pointer transition-all border-b border-slate-50 dark:border-dark-border/50 ${
                          isActive
                            ? 'bg-indigo-50 dark:bg-indigo-900/20 border-l-2 border-l-primary-blue'
                            : hasUnread
                              ? 'bg-blue-50/50 dark:bg-blue-900/10 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                              : 'hover:bg-slate-50 dark:hover:bg-white/5'
                        }`}>
                          {/* Avatar */}
                          <div className="relative flex-shrink-0">
                            <img
                              src={getImageUrl(other?.avatar, AVATAR_FALLBACK(other?.name, other?.role === 'trainer' ? 'f97316' : '6366f1'))}
                              alt={other?.name}
                              className="w-11 h-11 rounded-full object-cover"
                            />
                            {/* Role dot */}
                            <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-dark-card ${
                              other?.role === 'trainer' ? 'bg-orange-500' : 'bg-indigo-500'
                            }`} />
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className={`text-sm truncate ${hasUnread ? 'font-black text-slate-900 dark:text-white' : 'font-bold text-slate-700 dark:text-slate-300'}`}>
                                {other?.name || 'Unknown'}
                              </p>
                              <span className="text-[10px] text-slate-400 flex-shrink-0">
                                {formatSidebarTime(conv.lastMessage?.createdAt || conv.updatedAt)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between gap-2 mt-0.5">
                              <p className={`text-xs truncate ${hasUnread ? 'text-slate-700 dark:text-slate-300 font-semibold' : 'text-slate-400'}`}>
                                {isLastMsgMine && <span className="text-slate-400">You: </span>}
                                {conv.lastMessage?.text || 'No messages yet'}
                              </p>
                              {hasUnread && (
                                <span className="flex-shrink-0 w-5 h-5 bg-primary-blue text-white text-[9px] font-black rounded-full flex items-center justify-center">
                                  {conv.unreadCount}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })
                )}
              </div>
            </div>

            {/* ─── Main chat area ──────────────────────────────────────── */}
            <div className={`flex-1 flex flex-col ${!conversationId ? 'hidden sm:flex' : 'flex'}`}>
              {!conversationId ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-5 bg-slate-100 dark:bg-dark-border rounded-2xl flex items-center justify-center">
                      <MessageCircle size={36} className="text-slate-300 dark:text-slate-600" />
                    </div>
                    <h3 className="text-xl font-black text-slate-300 dark:text-slate-600">Select a conversation</h3>
                    <p className="text-sm text-slate-300 dark:text-slate-600 mt-1">Choose from the sidebar to start chatting</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Chat header */}
                  <div className="p-4 border-b border-slate-100 dark:border-dark-border flex items-center gap-3 bg-white dark:bg-dark-card">
                    <Link to="/chat" className="sm:hidden w-8 h-8 rounded-xl bg-slate-100 dark:bg-dark-border flex items-center justify-center">
                      <ArrowLeft size={16} className="text-slate-500" />
                    </Link>
                    <div className="relative">
                      <img
                        src={getImageUrl(otherUser?.avatar, AVATAR_FALLBACK(otherUser?.name, otherUser?.role === 'trainer' ? 'f97316' : '6366f1'))}
                        alt={otherUser?.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-dark-card ${
                        otherUser?.role === 'trainer' ? 'bg-orange-500' : 'bg-indigo-500'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-slate-900 dark:text-white text-sm">{otherUser?.name || 'Chat'}</p>
                      <p className="text-[10px] text-slate-400 capitalize flex items-center gap-1">
                        <span className={`inline-block w-1.5 h-1.5 rounded-full ${
                          otherUser?.role === 'trainer' ? 'bg-orange-500' : 'bg-indigo-500'
                        }`} />
                        {otherUser?.role || ''}
                      </p>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-1 bg-slate-50/50 dark:bg-dark-bg/50">
                    {isLoading ? (
                      <div className="flex justify-center py-10">
                        <Loader2 size={24} className="animate-spin text-primary-blue" />
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="text-center py-10">
                        <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 dark:bg-dark-border rounded-2xl flex items-center justify-center">
                          <Send size={24} className="text-slate-300 dark:text-slate-600" />
                        </div>
                        <p className="text-sm text-slate-400 font-semibold">No messages yet</p>
                        <p className="text-xs text-slate-400 mt-1">Say hello to start the conversation! 👋</p>
                      </div>
                    ) : (
                      groupedMessages.map((item, i) => {
                        if (item.type === 'date') {
                          return (
                            <div key={`date-${i}`} className="flex items-center justify-center py-3">
                              <span className="text-[10px] font-bold text-slate-400 bg-white dark:bg-dark-card px-3 py-1 rounded-full border border-slate-100 dark:border-dark-border shadow-sm">
                                {item.date}
                              </span>
                            </div>
                          );
                        }

                        const senderId = item.sender?._id || item.sender;
                        const isMe = senderId?.toString() === myId?.toString();

                        return (
                          <div key={item._id || i} className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-1`}>
                            {/* Other user avatar */}
                            {!isMe && (
                              <img
                                src={getImageUrl(otherUser?.avatar, AVATAR_FALLBACK(otherUser?.name, otherUser?.role === 'trainer' ? 'f97316' : '6366f1'))}
                                alt=""
                                className="w-7 h-7 rounded-full object-cover mr-2 mt-1 flex-shrink-0"
                              />
                            )}

                            <div className={`max-w-[70%] group`}>
                              <div className={`px-4 py-2.5 text-sm leading-relaxed ${
                                isMe
                                  ? 'bg-primary-blue text-white rounded-2xl rounded-br-md shadow-sm shadow-blue-500/10'
                                  : 'bg-white dark:bg-dark-card text-slate-900 dark:text-white border border-slate-100 dark:border-dark-border rounded-2xl rounded-bl-md shadow-sm'
                              } ${item._temp ? 'opacity-70' : ''}`}>
                                <p>{item.text}</p>
                              </div>
                              <div className={`flex items-center gap-1 mt-0.5 px-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <span className="text-[9px] text-slate-400">
                                  {formatTime(item.createdAt)}
                                </span>
                                {isMe && (
                                  item.read ? (
                                    <CheckCheck size={11} className="text-blue-400" />
                                  ) : (
                                    <Check size={11} className="text-slate-400" />
                                  )
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message input */}
                  <form onSubmit={handleSend} className="p-4 border-t border-slate-100 dark:border-dark-border bg-white dark:bg-dark-card">
                    <div className="flex gap-2">
                      <input
                        ref={inputRef}
                        type="text"
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-dark-bg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-primary-blue focus:ring-4 focus:ring-primary-blue/10 transition-all"
                      />
                      <button
                        type="submit"
                        disabled={!newMessage.trim() || isSending}
                        className="w-11 h-11 bg-primary-blue text-white rounded-xl flex items-center justify-center hover:opacity-90 transition-all disabled:opacity-40 shadow-lg shadow-blue-500/20 active:scale-95"
                      >
                        {isSending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ChatPage;
