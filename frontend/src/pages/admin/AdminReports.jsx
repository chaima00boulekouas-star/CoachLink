import React, { useState } from 'react';
import { Flag, CheckCircle, Trash2, AlertTriangle, Search } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';

const REPORTS = [
  { id: 1,  reporter: 'John Athlete',  target: 'Mike Trainer',  targetRole: 'Trainer', reason: 'Spam or Misleading Content',          detail: 'This trainer is promoting fake certifications and charging for fake programs.',           date: '2025-02-24', status: 'pending' },
  { id: 2,  reporter: 'Sarah Athlete', target: 'David Trainer', targetRole: 'Trainer', reason: 'Inappropriate Behavior',               detail: 'The trainer sent unsolicited messages with inappropriate content during sessions.',         date: '2025-02-23', status: 'resolved' },
  { id: 3,  reporter: 'Tom Athlete',   target: 'Lisa Trainer',  targetRole: 'Trainer', reason: 'Fake Account',                         detail: 'Profile photo and credentials appear to be scraped from a different coach online.',        date: '2025-02-23', status: 'pending' },
  { id: 4,  reporter: 'Anna Wilson',   target: 'Chris Evans',   targetRole: 'Trainer', reason: 'Harassment',                           detail: 'Trainer kept contacting me after I declined their program offer.',                         date: '2025-02-22', status: 'pending' },
  { id: 5,  reporter: 'Mike Trainer',  target: 'Jake Athlete',  targetRole: 'Athlete', reason: 'Abusive Language',                     detail: 'Athlete used very offensive language during online coaching session recording.',           date: '2025-02-21', status: 'dismissed' },
  { id: 6,  reporter: 'Emma Davis',    target: 'Ben Trainer',   targetRole: 'Trainer', reason: 'Refund Dispute',                       detail: 'Paid for 3-month program, trainer became unresponsive after first week.',                  date: '2025-02-20', status: 'resolved' },
  { id: 7,  reporter: 'Liam Moore',    target: 'Sophia Trainer',targetRole: 'Trainer', reason: 'Impersonation',                        detail: 'This account is using the photos and bio of a real professional coach from Instagram.',    date: '2025-02-19', status: 'pending' },
];

const STATUS_CFG = {
  pending:   'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  resolved:  'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800',
  dismissed: 'bg-slate-100 dark:bg-slate-700 text-slate-500 border-slate-200 dark:border-slate-600',
};

const FILTERS = ['All', 'Pending', 'Resolved', 'Dismissed'];

const AdminReports = () => {
  const [reports, setReports] = useState(REPORTS);
  const [filter, setFilter]   = useState('All');
  const [search, setSearch]   = useState('');
  const [expanded, setExpanded] = useState(null);

  const filtered = reports.filter(r => {
    const q = search.toLowerCase();
    const mQ = r.reporter.toLowerCase().includes(q) || r.target.toLowerCase().includes(q) || r.reason.toLowerCase().includes(q);
    const mF = filter === 'All' || r.status === filter.toLowerCase();
    return mQ && mF;
  });

  const setStatus = (id, status) =>
    setReports(prev => prev.map(r => r.id === id ? { ...r, status } : r));

  const dismiss = (id) => setReports(prev => prev.filter(r => r.id !== id));

  const pending  = reports.filter(r => r.status === 'pending').length;
  const resolved = reports.filter(r => r.status === 'resolved').length;

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-6">

        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">Reports</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              <span className="font-bold text-amber-600">{pending}</span> pending review ·{' '}
              <span className="font-bold text-green-600">{resolved}</span> resolved
            </p>
          </div>
          {pending > 0 && (
            <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 px-4 py-2.5 rounded-xl">
              <AlertTriangle size={16} className="text-amber-600" />
              <span className="text-sm font-bold text-amber-700 dark:text-amber-400">{pending} reports need attention</span>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search reports..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
          <div className="flex gap-2">
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-xs font-bold px-4 py-2.5 rounded-xl whitespace-nowrap transition-all ${
                  filter === f
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                    : 'bg-white dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-600 hover:border-indigo-400'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Report Cards */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-12 text-center">
              <Flag size={36} className="mx-auto mb-3 text-slate-300 dark:text-slate-600" />
              <p className="text-slate-400 font-semibold">No reports match your filter</p>
            </div>
          ) : filtered.map(r => (
            <div key={r.id} className={`bg-white dark:bg-slate-800 rounded-2xl border shadow-sm overflow-hidden ${r.status === 'pending' ? 'border-amber-200 dark:border-amber-900/50' : 'border-slate-100 dark:border-slate-700'}`}>
              <div className="flex items-start justify-between gap-4 p-5 flex-wrap">

                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${r.status === 'pending' ? 'bg-amber-100 dark:bg-amber-900/20 text-amber-600' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}`}>
                    <Flag size={18} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-bold text-slate-900 dark:text-white text-sm">{r.reason}</span>
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-lg border ${STATUS_CFG[r.status]}`}>
                        {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{r.reporter}</span>
                      {' reported '}
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{r.target}</span>
                      {' '}
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${r.targetRole === 'Trainer' ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-600' : 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600'}`}>
                        {r.targetRole}
                      </span>
                      {' · '}{r.date}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                    className="text-xs font-bold text-indigo-600 border border-indigo-200 dark:border-indigo-800 px-3 py-2 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-colors"
                  >
                    {expanded === r.id ? 'Collapse' : 'Review'}
                  </button>
                  {r.status === 'pending' && (
                    <button
                      onClick={() => setStatus(r.id, 'resolved')}
                      className="w-8 h-8 rounded-xl bg-green-50 dark:bg-green-900/10 text-green-600 flex items-center justify-center hover:bg-green-100 transition-colors"
                      title="Resolve"
                    >
                      <CheckCircle size={15} />
                    </button>
                  )}
                  <button
                    onClick={() => dismiss(r.id)}
                    className="w-8 h-8 rounded-xl bg-red-50 dark:bg-red-900/10 text-red-400 flex items-center justify-center hover:bg-red-100 transition-colors"
                    title="Dismiss"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Expanded Detail */}
              {expanded === r.id && (
                <div className="border-t border-slate-100 dark:border-slate-700 px-5 py-4 bg-slate-50 dark:bg-slate-700/30">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Report Detail</p>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-4">"{r.detail}"</p>
                  <div className="flex gap-2 flex-wrap">
                    {r.status === 'pending' && (
                      <>
                        <button onClick={() => setStatus(r.id, 'resolved')} className="flex items-center gap-1.5 bg-green-600 text-white text-xs font-bold px-4 py-2 rounded-xl hover:opacity-90 transition-opacity">
                          <CheckCircle size={13} /> Resolve Report
                        </button>
                        <button onClick={() => setStatus(r.id, 'dismissed')} className="flex items-center gap-1.5 bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 text-xs font-bold px-4 py-2 rounded-xl hover:opacity-90 transition-opacity">
                          Dismiss
                        </button>
                        <button className="flex items-center gap-1.5 border border-red-200 dark:border-red-800 text-red-500 text-xs font-bold px-4 py-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                          Ban {r.target}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminReports;
