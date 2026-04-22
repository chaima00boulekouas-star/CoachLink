import React, { useState } from 'react';
import { MessageSquare, ThumbsUp, ThumbsDown, Trash2, Star, CornerDownRight } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';

const FEEDBACK = [
  { id: 1, user: 'Alex Johnson',   role: 'Athlete', type: 'suggestion', rating: 5, subject: 'Better coach search filters', body: 'It would be great if athletes could filter coaches by availability time slots, not just sport.', date: '2025-02-24', status: 'new', avatar: 'AJ' },
  { id: 2, user: 'Maria Garcia',   role: 'Trainer', type: 'bug',        rating: 2, subject: 'Profile photo not saving',   body: 'Every time I upload a new profile photo, it reverts to the old one after a page refresh.', date: '2025-02-23', status: 'in_review', avatar: 'MG' },
  { id: 3, user: 'James Williams', role: 'Athlete', type: 'praise',     rating: 5, subject: 'Amazing platform!',           body: 'I found my perfect coach within 2 days and my serve has already improved significantly.', date: '2025-02-22', status: 'resolved', avatar: 'JW' },
  { id: 4, user: 'Sophie Lee',     role: 'Trainer', type: 'suggestion', rating: 4, subject: 'In-app scheduling calendar', body: "The session scheduling feature is good but we really need a built-in calendar view for trainers.", date: '2025-02-21', status: 'new', avatar: 'SL' },
  { id: 5, user: 'Kevin Okafor',   role: 'Athlete', type: 'bug',        rating: 1, subject: 'Payment failed but charged', body: 'I tried to purchase the 12-week program and got an error, but my card was still charged.', date: '2025-02-20', status: 'in_review', avatar: 'KO' },
  { id: 6, user: 'Rachel Green',   role: 'Trainer', type: 'praise',     rating: 5, subject: 'Store feature is excellent', body: 'The store management tools are intuitive and the analytics are very helpful for my business.', date: '2025-02-18', status: 'resolved', avatar: 'RG' },
];

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

const FILTERS = ['All', 'New', 'In Review', 'Resolved'];
const TYPES   = ['All', 'Bug', 'Suggestion', 'Praise'];

const AdminFeedback = () => {
  const [feedback, setFeedback] = useState(FEEDBACK);
  const [filter, setFilter]     = useState('All');
  const [typeF, setTypeF]       = useState('All');
  const [replyId, setReplyId]   = useState(null);
  const [replyText, setReplyText] = useState('');

  const filtered = feedback.filter(f => {
    const mF = filter === 'All' || f.status === filter.toLowerCase().replace(' ', '_');
    const mT = typeF === 'All' || f.type === typeF.toLowerCase();
    return mF && mT;
  });

  const remove    = (id)    => setFeedback(prev => prev.filter(f => f.id !== id));
  const setStatus = (id, s) => setFeedback(prev => prev.map(f => f.id === id ? { ...f, status: s } : f));
  const doReply   = (id)    => {
    if (!replyText.trim()) return;
    setFeedback(prev => prev.map(f => f.id === id ? { ...f, reply: replyText, status: 'resolved' } : f));
    setReplyId(null);
    setReplyText('');
  };

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
            {FILTERS.map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`text-xs font-bold px-4 py-2 rounded-xl whitespace-nowrap transition-all ${filter === f ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'bg-white dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-600 hover:border-indigo-400'}`}>{f}</button>
            ))}
          </div>
          <div className="w-px bg-slate-200 dark:bg-slate-600 hidden sm:block" />
          <div className="flex gap-2 flex-wrap">
            {TYPES.map(t => (
              <button key={t} onClick={() => setTypeF(t)} className={`text-xs font-bold px-4 py-2 rounded-xl whitespace-nowrap transition-all ${typeF === t ? 'bg-purple-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-600 hover:border-purple-400'}`}>{t}</button>
            ))}
          </div>
        </div>

        {/* Cards */}
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-12 text-center">
              <MessageSquare size={36} className="mx-auto mb-3 text-slate-300 dark:text-slate-600" />
              <p className="text-slate-400 font-semibold">No feedback matches your filters</p>
            </div>
          ) : filtered.map(f => {
            const typeCfg   = TYPE_CFG[f.type];
            const statusCfg = STATUS_CFG[f.status] || STATUS_CFG.new;
            return (
              <div key={f.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="p-5">
                  <div className="flex items-start gap-3 mb-4 flex-wrap">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center text-xs font-black flex-shrink-0">
                      {f.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <span className="font-bold text-slate-900 dark:text-white text-sm">{f.user}</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-500">{f.role}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${typeCfg.className}`}>{typeCfg.label}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusCfg.className}`}>{statusCfg.label}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={11} className={i < f.rating ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200 dark:fill-slate-600 dark:text-slate-600'} />
                        ))}
                        <span className="text-[10px] text-slate-400 ml-1">{f.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button onClick={() => setStatus(f.id, 'resolved')} title="Approve" className="w-8 h-8 rounded-lg bg-green-50 dark:bg-green-900/10 text-green-600 flex items-center justify-center hover:bg-green-100 transition-colors"><ThumbsUp size={13} /></button>
                      <button onClick={() => remove(f.id)} title="Delete" className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/10 text-red-400 flex items-center justify-center hover:bg-red-100 transition-colors"><Trash2 size={13} /></button>
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

                {/* Reply area */}
                <div className="px-5 pb-4 flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => setReplyId(replyId === f.id ? null : f.id)}
                    className="text-xs font-bold text-indigo-600 border border-indigo-200 dark:border-indigo-800 px-3 py-1.5 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-colors"
                  >
                    {replyId === f.id ? 'Cancel' : 'Reply'}
                  </button>
                  {f.status !== 'resolved' && (
                    <button onClick={() => setStatus(f.id, 'in_review')} className="text-xs font-bold text-amber-600 border border-amber-200 dark:border-amber-800 px-3 py-1.5 rounded-xl hover:bg-amber-50 dark:hover:bg-amber-900/10 transition-colors">
                      Mark In Review
                    </button>
                  )}
                </div>

                {replyId === f.id && (
                  <div className="px-5 pb-5 border-t border-slate-100 dark:border-slate-700 pt-4">
                    <textarea
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      placeholder="Type your reply to this feedback..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors resize-none mb-3"
                    />
                    <button
                      onClick={() => doReply(f.id)}
                      disabled={!replyText.trim()}
                      className="bg-indigo-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
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
