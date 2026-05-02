import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Send, ArrowLeft, Loader2, MessageCircle } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { chatService } from '../api/dataService';
import { useSelector } from 'react-redux';

const COLORS = ['bg-blue-500', 'bg-pink-500', 'bg-green-500', 'bg-orange-500', 'bg-purple-500'];

const ChatPage = () => {
  const { conversationId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);
  const currentUser = useSelector(state => state.auth?.user);
  const pollRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fetch conversations list
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const data = await chatService.getConversations();
        setConversations(data.conversations || []);
      } catch (err) {
        console.error('Failed to fetch conversations:', err);
      }
    };
    fetchConversations();
  }, []);

  // Fetch messages when a conversation is selected
  useEffect(() => {
    if (!conversationId) {
      setIsLoading(false);
      return;
    }

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
        setMessages(data.messages || []);
      } catch { /* ignore polling errors */ }
    }, 3000);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !conversationId || isSending) return;

    setIsSending(true);
    try {
      const data = await chatService.sendMessage(conversationId, newMessage.trim());
      setMessages(prev => [...prev, data.message]);
      setNewMessage('');

      // Update the conversation list's last message
      setConversations(prev =>
        prev.map(c =>
          c._id === conversationId
            ? { ...c, lastMessage: { text: newMessage.trim(), sender: currentUser?._id, createdAt: new Date() }, updatedAt: new Date() }
            : c
        ).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      );
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setIsSending(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return '??';
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  };

  const getOtherParticipant = (conv) => {
    if (!conv?.participants || !currentUser) return null;
    return conv.participants.find(p => p._id !== currentUser._id) || conv.participants[0];
  };

  const activeConv = conversations.find(c => c._id === conversationId);
  const otherUser = activeConv ? getOtherParticipant(activeConv) : null;

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className="bg-white dark:bg-dark-card rounded-2xl border border-slate-100 dark:border-dark-border shadow-sm overflow-hidden" style={{ height: 'calc(100vh - 160px)' }}>
          <div className="flex h-full">

            {/* Sidebar — conversation list */}
            <div className={`w-full sm:w-80 border-r border-slate-100 dark:border-dark-border flex flex-col flex-shrink-0 ${conversationId ? 'hidden sm:flex' : 'flex'}`}>
              <div className="p-4 border-b border-slate-100 dark:border-dark-border">
                <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <MessageCircle size={20} className="text-primary-blue" /> Messages
                </h2>
              </div>

              <div className="flex-1 overflow-y-auto">
                {conversations.length === 0 ? (
                  <div className="text-center py-16 px-4">
                    <MessageCircle size={40} className="mx-auto mb-3 text-slate-200 dark:text-dark-border" />
                    <p className="text-sm text-slate-400 dark:text-slate-600 font-semibold">No conversations yet</p>
                    <p className="text-xs text-slate-400 mt-1">Start one from the Athletes page</p>
                  </div>
                ) : (
                  conversations.map((conv, idx) => {
                    const other = getOtherParticipant(conv);
                    const isActive = conv._id === conversationId;
                    return (
                      <Link key={conv._id} to={`/chat/${conv._id}`}>
                        <div className={`flex items-center gap-3 p-3.5 cursor-pointer transition-colors border-b border-slate-50 dark:border-dark-border ${
                          isActive
                            ? 'bg-indigo-50 dark:bg-indigo-900/20 border-l-2 border-l-primary-blue'
                            : 'hover:bg-slate-50 dark:hover:bg-white/5'
                        }`}>
                          {other?.avatar ? (
                            <img src={other.avatar.startsWith('http') ? other.avatar : `http://localhost:5000/${other.avatar}`}
                              alt={other.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                          ) : (
                            <div className={`${COLORS[idx % COLORS.length]} w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0`}>
                              {getInitials(other?.name)}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{other?.name || 'Unknown'}</p>
                            <p className="text-xs text-slate-400 truncate">
                              {conv.lastMessage?.text || 'No messages yet'}
                            </p>
                          </div>
                          {conv.lastMessage?.createdAt && (
                            <span className="text-[10px] text-slate-400 flex-shrink-0">
                              {new Date(conv.lastMessage.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                          )}
                        </div>
                      </Link>
                    );
                  })
                )}
              </div>
            </div>

            {/* Main chat area */}
            <div className={`flex-1 flex flex-col ${!conversationId ? 'hidden sm:flex' : 'flex'}`}>
              {!conversationId ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageCircle size={64} className="mx-auto mb-4 text-slate-200 dark:text-dark-border" />
                    <h3 className="text-xl font-black text-slate-300 dark:text-slate-600">Select a conversation</h3>
                    <p className="text-sm text-slate-300 dark:text-slate-600 mt-1">Choose from the sidebar or start a new chat</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Chat header */}
                  <div className="p-4 border-b border-slate-100 dark:border-dark-border flex items-center gap-3">
                    <Link to="/chat" className="sm:hidden">
                      <ArrowLeft size={20} className="text-slate-500" />
                    </Link>
                    {otherUser?.avatar ? (
                      <img src={otherUser.avatar.startsWith('http') ? otherUser.avatar : `http://localhost:5000/${otherUser.avatar}`}
                        alt={otherUser.name} className="w-9 h-9 rounded-full object-cover" />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-primary-blue flex items-center justify-center text-white font-bold text-xs">
                        {getInitials(otherUser?.name)}
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white text-sm">{otherUser?.name || 'Chat'}</p>
                      <p className="text-[10px] text-slate-400 capitalize">{otherUser?.role || ''}</p>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50 dark:bg-dark-bg/50">
                    {isLoading ? (
                      <div className="flex justify-center py-10">
                        <Loader2 size={24} className="animate-spin text-primary-blue" />
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="text-center py-10">
                        <p className="text-sm text-slate-400">No messages yet. Say hello! 👋</p>
                      </div>
                    ) : (
                      messages.map((msg, i) => {
                        const senderId = msg.sender?._id || msg.sender;
                        const isMe = senderId === currentUser?._id;
                        return (
                          <div key={msg._id || i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                              isMe
                                ? 'bg-primary-blue text-white rounded-br-md'
                                : 'bg-white dark:bg-dark-card text-slate-900 dark:text-white border border-slate-100 dark:border-dark-border rounded-bl-md'
                            }`}>
                              <p className="leading-relaxed">{msg.text}</p>
                              <p className={`text-[9px] mt-1 ${isMe ? 'text-white/60' : 'text-slate-400'}`}>
                                {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : ''}
                              </p>
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
                        type="text"
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-dark-bg text-sm text-slate-900 dark:text-white focus:outline-none focus:border-primary-blue focus:ring-4 focus:ring-primary-blue/10 transition-all"
                      />
                      <button
                        type="submit"
                        disabled={!newMessage.trim() || isSending}
                        className="w-10 h-10 bg-primary-blue text-white rounded-xl flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-40 shadow-sm shadow-blue-500/20"
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
