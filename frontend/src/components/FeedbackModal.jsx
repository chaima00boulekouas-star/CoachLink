import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, MessageSquare, AlertCircle, Heart, History, Loader2, Star, CornerDownRight } from 'lucide-react';
import { feedbackService } from '../api/dataService';
import { toast } from 'react-hot-toast';

const FeedbackModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('new'); // 'new' or 'history'
  const [type, setType] = useState('suggestion');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    if (isOpen && activeTab === 'history') {
      fetchHistory();
    }
  }, [isOpen, activeTab]);

  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const data = await feedbackService.getMyHistory();
      setHistory(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch feedback history", err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !body.trim()) {
      return toast.error("Please fill in all fields");
    }

    setLoading(true);
    try {
      await feedbackService.submit({ type, subject, body, rating });
      toast.success("Feedback submitted! Thank you.");
      setSubject('');
      setBody('');
      setActiveTab('history');
      fetchHistory();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit feedback");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-700"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-gradient-to-r from-primary-blue/5 to-purple-500/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary-blue/10 text-primary-blue flex items-center justify-center">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <h2 className="font-black text-slate-900 dark:text-white">Feedback & Support</h2>
                  <div className="flex gap-4 mt-1">
                    <button 
                      onClick={() => setActiveTab('new')}
                      className={`text-[10px] uppercase tracking-widest font-black transition-colors ${activeTab === 'new' ? 'text-primary-blue' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      New Submission
                    </button>
                    <button 
                      onClick={() => setActiveTab('history')}
                      className={`text-[10px] uppercase tracking-widest font-black transition-colors ${activeTab === 'history' ? 'text-primary-blue' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      History {history.length > 0 && `(${history.length})`}
                    </button>
                  </div>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors">
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto">
              {activeTab === 'new' ? (
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                  {/* Type Selection */}
                  <div className="flex p-1 bg-slate-100 dark:bg-slate-900/50 rounded-2xl">
                    {[
                      { id: 'suggestion', icon: MessageSquare, label: 'Suggestion' },
                      { id: 'bug', icon: AlertCircle, label: 'Bug' },
                      { id: 'praise', icon: Heart, label: 'Praise' },
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setType(t.id)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
                          type === t.id 
                            ? 'bg-white dark:bg-slate-700 text-primary-blue shadow-sm' 
                            : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                        }`}
                      >
                        <t.icon size={14} />
                        {t.label}
                      </button>
                    ))}
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 block px-1">Subject</label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="What's this about?"
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-primary-blue transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 block px-1">Message</label>
                    <textarea
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      placeholder="Tell us more details..."
                      rows={4}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-primary-blue transition-colors resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setRating(s)}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black transition-all ${
                            rating === s ? 'bg-amber-400 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider text-right flex-1">Rate your experience</p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary-blue text-white font-black py-4 rounded-2xl shadow-xl shadow-primary-blue/20 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <>
                        <Send size={18} />
                        Send Feedback
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="p-6 space-y-4">
                  {historyLoading ? (
                    <div className="flex flex-col items-center py-10">
                      <Loader2 className="animate-spin text-primary-blue mb-2" />
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Loading history...</p>
                    </div>
                  ) : history.length === 0 ? (
                    <div className="text-center py-12 px-6">
                      <History size={40} className="mx-auto text-slate-200 mb-3" />
                      <p className="text-slate-500 text-sm font-semibold">No feedback history found.</p>
                      <button 
                        onClick={() => setActiveTab('new')}
                        className="text-primary-blue text-xs font-bold mt-2 hover:underline"
                      >
                        Submit your first feedback
                      </button>
                    </div>
                  ) : (
                    history.map(item => (
                      <div key={item._id} className="bg-slate-50 dark:bg-slate-900/30 rounded-2xl border border-slate-100 dark:border-slate-700 p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                            item.status === 'resolved' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
                          }`}>
                            {item.status}
                          </span>
                          <span className="text-[10px] text-slate-400">{new Date(item.createdAt).toLocaleDateString()}</span>
                        </div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">{item.subject}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3">{item.body}</p>
                        
                        {item.reply && (
                          <div className="mt-3 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800">
                            <div className="flex items-center gap-2 mb-1">
                              <CornerDownRight size={12} className="text-indigo-500" />
                              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Admin Response</span>
                            </div>
                            <p className="text-xs text-indigo-700 dark:text-indigo-300 italic">"{item.reply}"</p>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default FeedbackModal;
