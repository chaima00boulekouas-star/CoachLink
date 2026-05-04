import React, { useState, useEffect } from 'react';
import { MessageSquare, ThumbsUp, Trash2, Star, CornerDownRight, Loader2 } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import { adminService } from '../../api/dataService';
import { toast } from 'react-hot-toast';

const TYPE_CFG = {
  suggestion: { label: 'Suggestion', className: 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' },
  bug:        { label: 'Bug Report', className: 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400' },
  praise:     { label: 'Praise',     className: 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' },
};

const STATUS_CFG = {
  new:       { label: 'New',       className: 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' },
  in_review: { label: 'In Review', className: 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400' },
  resolved:  { label: 'Resolved',  className: 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' },
};

const AdminFeedback = () => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState('All');
  const [typeF, setTypeF]       = useState('All');
  const [replyId, setReplyId]   = useState(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    setLoading(true);
    try {
      const data = await adminService.getFeedback();
      setFeedback(data);
    } catch (err) {
      toast.error("Failed to load feedback");
    } finally {
      setLoading(false);
    }
  };

  const doReply = async (id) => {
    if (!replyText.trim()) return;
    try {
      await adminService.replyFeedback(id, replyText);
      toast.success("Reply sent and feedback resolved");
      setReplyId(null);
      setReplyText('');
      fetchFeedback();
    } catch (err) {
      toast.error("Failed to send reply");
    }
  };

  const filtered = feedback.filter(f => {
    const mF = filter === 'All' || f.status === filter.toLowerCase().replace(' ', '_');
    const mT = typeF === 'All' || f.type === typeF.toLowerCase();
    return mF && mT;
  });

  const newCount = feedback.filter(f => f.status === 'new').length;

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Feedback</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {feedback.length} total entries · <span className="font-bold text-indigo-600">{newCount}</span> new
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
          <div className="flex gap-2 flex-wrap">
            {['All', 'New', 'In Review', 'Resolved'].map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`text-xs font-bold px-4 py-2 rounded-xl transition-all ${filter === f ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-600 hover:border-indigo-400'}`}>{f}</button>
            ))}
          </div>
          <div className="w-px bg-slate-200 dark:bg-slate-600 hidden sm:block" />
          <div className="flex gap-2 flex-wrap">
            {['All', 'Bug', 'Suggestion', 'Praise'].map(t => (
              <button key={t} onClick={() => setTypeF(t)} className={`text-xs font-bold px-4 py-2 rounded-xl transition-all ${typeF === t ? 'bg-purple-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-600 hover:border-purple-400'}`}>{t}</button>
            ))}
          </div>
        </div>

        {/* Cards */}
        <div className="space-y-4">
          {loading ? (
            <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>
          ) : filtered.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 p-12 text-center">
              <MessageSquare size={48} className="mx-auto mb-4 text-slate-200" />
              <p className="text-slate-400 font-bold">No feedback matches your filters</p>
            </div>
          ) : filtered.map(f => {
            const typeCfg   = TYPE_CFG[f.type] || TYPE_CFG.suggestion;
            const statusCfg = STATUS_CFG[f.status] || STATUS_CFG.new;
            return (
              <div key={f._id} className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="p-5">
                  <div className="flex items-start gap-3 mb-4 flex-wrap">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center text-xs font-black flex-shrink-0 uppercase">
                      {f.user?.name?.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <span className="font-bold text-slate-900 dark:text-white text-sm">{f.user?.name}</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-500 capitalize">{f.user?.role}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${typeCfg.className}`}>{typeCfg.label}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusCfg.className}`}>{statusCfg.label}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={11} className={i < f.rating ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200 dark:fill-slate-600 dark:text-slate-600'} />
                        ))}
                        <span className="text-[10px] text-slate-400 ml-1">{new Date(f.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <h3 className="font-bold text-slate-800 dark:text-white mb-1">{f.subject}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{f.body}</p>

                  {f.reply && (
                    <div className="mt-4 flex gap-2 p-3 bg-indigo-50 dark:bg-indigo-900/10 rounded-xl border border-indigo-100 dark:border-indigo-800">
                      <CornerDownRight size={14} className="text-indigo-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-indigo-700 dark:text-indigo-300 italic">"{f.reply}"</p>
                    </div>
                  )}
                </div>

                <div className="px-5 pb-4 flex items-center gap-2">
                  <button
                    onClick={() => setReplyId(replyId === f._id ? null : f._id)}
                    className="text-xs font-bold text-indigo-600 border border-indigo-200 dark:border-indigo-800 px-4 py-2 rounded-xl hover:bg-indigo-50 transition-colors"
                  >
                    {replyId === f._id ? 'Cancel' : 'Reply'}
                  </button>
                </div>

                {replyId === f._id && (
                  <div className="px-5 pb-5 border-t border-slate-100 dark:border-slate-700 pt-4">
                    <textarea
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      placeholder="Type your reply to this feedback..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors resize-none mb-3"
                    />
                    <button
                      onClick={() => doReply(f._id)}
                      disabled={!replyText.trim()}
                      className="bg-indigo-600 text-white text-xs font-bold px-6 py-2.5 rounded-xl hover:opacity-90 disabled:opacity-40"
                    >
                      Send Reply
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminFeedback;
