import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar, Clock, MapPin, X, Send,
  CheckCircle, AlertCircle, Loader
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';

const SESSIONS = [
  {
    id: 1,
    coach: 'Tashi Duncan',
    sport: 'Tennis',
    date: 'Apr 14, 2026',
    time: '10:00 AM',
    duration: '1.5 hrs',
    location: 'Central Park Courts, New York',
    status: 'upcoming',
    image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 2,
    coach: 'Tashi Duncan',
    sport: 'Tennis',
    date: 'Apr 7, 2026',
    time: '11:00 AM',
    duration: '1 hr',
    location: 'Central Park Courts, New York',
    status: 'completed',
    image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=200',
    note: 'Focused on serve consistency and baseline footwork.',
  },
  {
    id: 3,
    coach: 'Marcus Johnson',
    sport: 'Football',
    date: 'Mar 28, 2026',
    time: '3:00 PM',
    duration: '2 hrs',
    location: 'Riverside Sports Complex',
    status: 'completed',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=200',
    note: 'Defensive drills and quick-reaction agility work.',
  },
  {
    id: 4,
    coach: 'Elena Williams',
    sport: 'Basketball',
    date: 'Mar 15, 2026',
    time: '9:30 AM',
    duration: '1.5 hrs',
    location: 'Online (Zoom)',
    status: 'cancelled',
    image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=200',
  },
];

const COACHES = [
  { id: 1, name: 'Tashi Duncan',   sport: 'Tennis' },
  { id: 2, name: 'Marcus Johnson', sport: 'Football' },
  { id: 3, name: 'Elena Williams', sport: 'Basketball' },
];

const STATUS_CONFIG = {
  upcoming:  { label: 'Upcoming',  className: 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800' },
  completed: { label: 'Completed', className: 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800' },
  cancelled: { label: 'Cancelled', className: 'bg-red-100 dark:bg-red-900/20 text-red-500 dark:text-red-400 border-red-200 dark:border-red-800' },
};

const FILTERS = ['All', 'Upcoming', 'Completed', 'Cancelled'];

// ─── New Session Modal ──────────────────────────────────────────────────────

const NewSessionModal = ({ onClose, onSubmit }) => {
  const [form, setForm] = useState({
    coachId: '', date: '', time: '', duration: '1', notes: '', location: '',
  });
  const [loading, setLoading] = useState(false);
  const [done, setDone]       = useState(false);

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.coachId || !form.date || !form.time) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setDone(true);
      setTimeout(() => { onSubmit(form); onClose(); }, 1500);
    }, 1200);
  };

  const inputCls = 'w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-700">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">Request a New Session</h2>
            <p className="text-xs text-slate-500 mt-0.5">Send a session request to your coach</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          {done ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
                <CheckCircle size={32} className="text-green-500" />
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">Request Sent!</h3>
              <p className="text-sm text-slate-500">Your coach will confirm the session shortly.</p>
            </div>
          ) : (
            <>
              {/* Coach */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Select Coach</label>
                <select value={form.coachId} onChange={set('coachId')} required className={inputCls}>
                  <option value="">Choose a coach...</option>
                  {COACHES.map((c) => (
                    <option key={c.id} value={c.id}>{c.name} — {c.sport}</option>
                  ))}
                </select>
              </div>

              {/* Date + Time */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Date</label>
                  <input type="date" value={form.date} onChange={set('date')} required className={inputCls} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Time</label>
                  <input type="time" value={form.time} onChange={set('time')} required className={inputCls} />
                </div>
              </div>

              {/* Duration */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Duration</label>
                <select value={form.duration} onChange={set('duration')} className={inputCls}>
                  <option value="0.5">30 minutes</option>
                  <option value="1">1 hour</option>
                  <option value="1.5">1.5 hours</option>
                  <option value="2">2 hours</option>
                </select>
              </div>

              {/* Location */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Location (optional)</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={set('location')}
                  placeholder="e.g. Central Park Courts, or Online"
                  className={inputCls}
                />
              </div>

              {/* Notes */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Session Notes (optional)</label>
                <textarea
                  value={form.notes}
                  onChange={set('notes')}
                  placeholder="What do you want to focus on in this session?"
                  rows={3}
                  className={`${inputCls} resize-none`}
                />
              </div>

              {(!form.coachId || !form.date || !form.time) && (
                <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                  <AlertCircle size={13} /> Please select a coach, date and time to continue.
                </p>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading || !form.coachId || !form.date || !form.time}
                  className="flex-1 flex items-center justify-center gap-2 bg-orange-500 text-white font-bold py-3 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-orange-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader size={16} className="animate-spin" /> : <Send size={16} />}
                  {loading ? 'Sending...' : 'Send Request'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

// ─── Main Page ──────────────────────────────────────────────────────────────

const AthleteSessionsPage = () => {
  const [filter, setFilter]     = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [sessions, setSessions]   = useState(SESSIONS);

  const filtered = sessions.filter((s) => {
    if (filter === 'All') return true;
    return s.status === filter.toLowerCase();
  });

  const handleNewSession = (form) => {
    const coach = COACHES.find((c) => String(c.id) === String(form.coachId));
    setSessions((prev) => [
      {
        id: Date.now(),
        coach: coach?.name || 'Unknown Coach',
        sport: coach?.sport || '',
        date: new Date(form.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        time: form.time,
        duration: `${form.duration} hr${form.duration !== '1' ? 's' : ''}`,
        location: form.location || 'TBD',
        status: 'upcoming',
        image: 'https://i.pravatar.cc/200?u=' + form.coachId,
        note: form.notes,
      },
      ...prev,
    ]);
  };

  const upcomingCount  = sessions.filter((s) => s.status === 'upcoming').length;
  const completedCount = sessions.filter((s) => s.status === 'completed').length;

  return (
    <DashboardLayout>
      {showModal && <NewSessionModal onClose={() => setShowModal(false)} onSubmit={handleNewSession} />}

      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">Training Sessions</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              <span className="font-bold text-indigo-600">{upcomingCount}</span> upcoming,{' '}
              <span className="font-bold text-green-600">{completedCount}</span> completed
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-orange-500 text-white font-bold px-5 py-3 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-orange-500/25"
          >
            <Calendar size={17} /> New Session
          </button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Sessions', value: sessions.length,  color: 'bg-indigo-600' },
            { label: 'Completed',      value: completedCount,   color: 'bg-green-500' },
            { label: 'Upcoming',       value: upcomingCount,    color: 'bg-orange-500' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 shadow-sm text-center">
              <div className={`text-2xl font-black ${color === 'bg-indigo-600' ? 'text-indigo-600' : color === 'bg-green-500' ? 'text-green-500' : 'text-orange-500'} mb-1`}>
                {value}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{label}</p>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs font-bold px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                filter === f
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                  : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-indigo-400'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Session Cards */}
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
              <Calendar size={40} className="mx-auto mb-3 text-slate-300 dark:text-slate-600" />
              <p className="text-slate-400 font-semibold mb-3">No {filter.toLowerCase()} sessions</p>
              <button
                onClick={() => setShowModal(true)}
                className="text-sm font-bold text-indigo-600 hover:underline"
              >
                Request a new session →
              </button>
            </div>
          ) : filtered.map((session) => {
            const cfg = STATUS_CONFIG[session.status];
            return (
              <div key={session.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="flex items-start gap-4 p-5">
                  <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-slate-200 dark:bg-slate-700">
                    <img src={session.image} alt={session.coach} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white">{session.coach}</h3>
                        <p className="text-sm font-semibold text-orange-500">{session.sport}</p>
                      </div>
                      <span className={`text-xs font-bold px-3 py-1.5 rounded-xl border flex-shrink-0 ${cfg.className}`}>
                        {cfg.label}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={12} className="text-indigo-400" /> {session.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock size={12} className="text-indigo-400" /> {session.time} · {session.duration}
                      </span>
                      <span className="flex items-center gap-1.5 sm:col-span-1 col-span-2">
                        <MapPin size={12} className="text-indigo-400 flex-shrink-0" /> {session.location}
                      </span>
                    </div>
                    {session.note && (
                      <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                        <p className="text-xs text-slate-600 dark:text-slate-400 italic">"{session.note}"</p>
                      </div>
                    )}
                  </div>
                </div>
                {session.status === 'upcoming' && (
                  <div className="px-5 pb-4 flex gap-2">
                    <Link to={`/trainer/${COACHES.find((c) => c.name === session.coach)?.id || 1}`}>
                      <button className="text-xs font-bold text-indigo-600 border border-indigo-200 dark:border-indigo-800 px-4 py-2 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-colors">
                        View Coach
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </DashboardLayout>
  );
};

export default AthleteSessionsPage;
