import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, Plus, X, CheckCircle, XCircle, AlertCircle, Send, Loader, User } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { sessionService } from '../api/dataService';
import { getImageUrl } from '../utils/imageUrl';

const statusConfig = {
  scheduled:  { label: 'Scheduled',  icon: CheckCircle, className: 'text-primary-blue bg-indigo-50 dark:bg-indigo-900/20',  dot: 'bg-primary-blue' },
  done:       { label: 'Completed',  icon: CheckCircle, className: 'text-green-600 bg-green-50 dark:bg-green-900/20',       dot: 'bg-green-500' },
  cancelled:  { label: 'Cancelled',  icon: XCircle,     className: 'text-red-500 bg-red-50 dark:bg-red-900/20',             dot: 'bg-red-500' },
};

const formatDate = (d) => {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};
const formatTime = (d) => {
  if (!d) return '';
  return new Date(d).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

// ─── New Session Modal ──────────────────────────────────────────────────────

const NewSessionModal = ({ onClose, onCreated }) => {
  const [athletes, setAthletes] = useState([]);
  const [loadingAthletes, setLoadingAthletes] = useState(true);
  const [form, setForm] = useState({
    athleteId: '', date: '', time: '', title: '', duration: '1 hour', location: '', notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAthletes = async () => {
      try {
        const res = await sessionService.getAcceptedAthletes();
        setAthletes(res.athletes || []);
      } catch (err) {
        console.error('Failed to load athletes:', err);
      } finally {
        setLoadingAthletes(false);
      }
    };
    fetchAthletes();
  }, []);

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.athleteId || !form.date || !form.time) return;
    setError('');
    setSubmitting(true);

    try {
      const dateTime = new Date(`${form.date}T${form.time}`);
      await sessionService.create({
        athleteId: form.athleteId,
        date: dateTime.toISOString(),
        title: form.title || 'Training Session',
        duration: form.duration,
        location: form.location || 'TBD',
        notes: form.notes,
      });
      setSuccess(true);
      setTimeout(() => { onCreated(); onClose(); }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create session');
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = 'w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-700">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">Schedule a Session</h2>
            <p className="text-xs text-slate-500 mt-0.5">Create a session with one of your accepted athletes</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {success ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
                <CheckCircle size={32} className="text-green-500" />
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">Session Created!</h3>
              <p className="text-sm text-slate-500">The athlete has been notified.</p>
            </div>
          ) : (
            <>
              {/* Select Athlete */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Select Athlete</label>
                {loadingAthletes ? (
                  <div className="flex items-center gap-2 py-3 text-sm text-slate-400">
                    <Loader size={14} className="animate-spin" /> Loading athletes...
                  </div>
                ) : athletes.length === 0 ? (
                  <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl">
                    <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">No accepted athletes yet. Athletes must send you a request first, and you need to accept it.</p>
                  </div>
                ) : (
                  <select value={form.athleteId} onChange={set('athleteId')} required className={inputCls}>
                    <option value="">Choose an athlete...</option>
                    {athletes.map((a) => (
                      <option key={a._id} value={a._id}>{a.name} — {a.email}</option>
                    ))}
                  </select>
                )}
              </div>

              {/* Title */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Session Title</label>
                <input type="text" value={form.title} onChange={set('title')} placeholder="e.g. Strength Training, Cardio Session" className={inputCls} />
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
                  <option value="30 min">30 minutes</option>
                  <option value="1 hour">1 hour</option>
                  <option value="1.5 hours">1.5 hours</option>
                  <option value="2 hours">2 hours</option>
                  <option value="3 hours">3 hours</option>
                </select>
              </div>

              {/* Location */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Location</label>
                <input type="text" value={form.location} onChange={set('location')} placeholder="e.g. City Gym, Online (Zoom)" className={inputCls} />
              </div>

              {/* Notes */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Notes (optional)</label>
                <textarea value={form.notes} onChange={set('notes')} placeholder="Session focus, things to bring, etc." rows={2} className={`${inputCls} resize-none`} />
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl">
                  <AlertCircle size={14} className="text-red-500 flex-shrink-0" />
                  <p className="text-xs font-bold text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting || !form.athleteId || !form.date || !form.time || athletes.length === 0}
                  className="flex-1 flex items-center justify-center gap-2 bg-primary-blue text-white font-bold py-3 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {submitting ? <Loader size={16} className="animate-spin" /> : <Calendar size={16} />}
                  {submitting ? 'Creating...' : 'Schedule Session'}
                </button>
                <button type="button" onClick={onClose} className="px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
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

const SessionsPage = () => {
  const [view, setView] = useState('list');
  const [filter, setFilter] = useState('All');
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const data = await sessionService.getTrainerSessions();
      setSessions(data.sessions || []);
    } catch (err) {
      console.error('Failed to fetch sessions:', err);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSessions(); }, []);

  const handleStatusChange = async (sessionId, status) => {
    try {
      await sessionService.updateStatus(sessionId, status);
      setSessions(prev => prev.map(s => s._id === sessionId ? { ...s, status } : s));
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const filters = ['All', 'Scheduled', 'Completed', 'Cancelled'];
  const mapFilter = { Scheduled: 'scheduled', Completed: 'done', Cancelled: 'cancelled' };
  const filtered = sessions.filter(s => filter === 'All' || s.status === mapFilter[filter]);

  const counts = {
    All: sessions.length,
    Scheduled: sessions.filter(s => s.status === 'scheduled').length,
    Completed: sessions.filter(s => s.status === 'done').length,
    Cancelled: sessions.filter(s => s.status === 'cancelled').length,
  };

  // Calendar helpers
  const now = new Date();
  const currentMonth = now.toLocaleString('default', { month: 'long', year: 'numeric' });
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const firstDayOffset = (new Date(now.getFullYear(), now.getMonth(), 1).getDay() + 6) % 7; // Monday start
  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const sessionDays = sessions.filter(s => s.status === 'scheduled').map(s => new Date(s.date).getDate());
  const weeks = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <DashboardLayout>
      <AnimatePresence>{showModal && <NewSessionModal onClose={() => setShowModal(false)} onCreated={fetchSessions} />}</AnimatePresence>

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">Training Sessions</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              <span className="font-bold text-indigo-600">{counts.Scheduled}</span> scheduled, <span className="font-bold text-green-600">{counts.Completed}</span> completed
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-slate-100 dark:bg-dark-card rounded-xl p-1 border border-slate-200 dark:border-dark-border">
              {['list', 'calendar'].map(v => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg capitalize transition-all ${
                    view === v ? 'bg-white dark:bg-dark-bg text-primary-blue shadow-sm' : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
            <button onClick={() => setShowModal(true)} className="flex items-center gap-1.5 bg-primary-blue text-white text-sm font-bold px-4 py-2 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/20">
              <Plus size={16} /> New Session
            </button>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                filter === f
                  ? 'bg-primary-blue text-white shadow-lg shadow-blue-500/20'
                  : 'bg-white dark:bg-dark-card text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-dark-border hover:border-primary-blue'
              }`}
            >
              {f}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${filter === f ? 'bg-white/20' : 'bg-slate-200 dark:bg-slate-600'}`}>
                {counts[f]}
              </span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : view === 'list' ? (
          <div className="space-y-4">
            {filtered.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-dark-card rounded-2xl border border-slate-100 dark:border-dark-border">
                <Calendar size={40} className="mx-auto mb-3 text-slate-300 dark:text-slate-600" />
                <p className="text-slate-400 font-semibold mb-3">No {filter === 'All' ? '' : filter.toLowerCase()} sessions</p>
                <button onClick={() => setShowModal(true)} className="text-sm font-bold text-indigo-600 hover:underline">
                  Schedule a new session →
                </button>
              </div>
            ) : filtered.map(s => {
              const sc = statusConfig[s.status] || statusConfig.scheduled;
              const StatusIcon = sc.icon;
              return (
                <motion.div
                  key={s._id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-dark-card rounded-2xl border border-slate-100 dark:border-dark-border shadow-sm overflow-hidden"
                >
                  <div className="flex items-center gap-5 p-5">
                    <div className={`w-1.5 self-stretch rounded-full flex-shrink-0 ${sc.dot}`} />

                    {/* Avatar */}
                    <div className="w-11 h-11 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 flex-shrink-0">
                      <img
                        src={getImageUrl(s.athlete?.avatar, `https://ui-avatars.com/api/?name=${encodeURIComponent(s.athlete?.name || 'A')}&background=6366f1&color=fff`)}
                        alt={s.athlete?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm">{s.athlete?.name || 'Athlete'}</h3>
                      <p className="text-xs text-primary-orange font-semibold">{s.title || 'Training Session'}</p>
                    </div>

                    {/* Meta */}
                    <div className="hidden sm:flex items-center gap-6 text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-primary-blue" />
                        <span className="font-semibold">{formatDate(s.date)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock size={13} className="text-primary-blue" />
                        <span className="font-semibold">{formatTime(s.date)} · {s.duration}</span>
                      </div>
                      {s.location && s.location !== 'TBD' && (
                        <div className="flex items-center gap-1.5">
                          <MapPin size={13} className="text-green-500" />
                          <span className="font-semibold">{s.location}</span>
                        </div>
                      )}
                    </div>

                    {/* Status */}
                    <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl ${sc.className}`}>
                      <StatusIcon size={13} /> {sc.label}
                    </span>
                  </div>

                  {/* Notes */}
                  {s.notes && (
                    <div className="px-5 pb-4 ml-[4.5rem]">
                      <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                        <p className="text-xs text-slate-600 dark:text-slate-400 italic">"{s.notes}"</p>
                      </div>
                    </div>
                  )}

                  {/* Actions for scheduled sessions */}
                  {s.status === 'scheduled' && (
                    <div className="px-5 pb-4 ml-[4.5rem] flex gap-2">
                      <button
                        onClick={() => handleStatusChange(s._id, 'done')}
                        className="text-xs font-bold text-green-600 border border-green-200 dark:border-green-800 px-3 py-1.5 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/10 transition-colors"
                      >
                        Mark Complete
                      </button>
                      <button
                        onClick={() => handleStatusChange(s._id, 'cancelled')}
                        className="text-xs font-bold text-red-500 border border-red-200 dark:border-red-800 px-3 py-1.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        ) : (
          /* Calendar view */
          <div className="bg-white dark:bg-dark-card rounded-2xl border border-slate-100 dark:border-dark-border shadow-sm p-6">
            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-6">{currentMonth}</h2>
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weeks.map(d => (
                <div key={d} className="text-center text-xs font-bold text-slate-400 dark:text-slate-500 py-2">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {[...Array(firstDayOffset)].map((_, i) => <div key={`e-${i}`} />)}
              {calendarDays.map(day => {
                const hasSession = sessionDays.includes(day);
                const isToday = day === now.getDate();
                return (
                  <button
                    key={day}
                    className={`relative aspect-square rounded-xl flex flex-col items-center justify-center text-sm font-bold transition-all ${
                      isToday ? 'bg-primary-blue text-white' :
                      hasSession ? 'bg-indigo-50 dark:bg-indigo-900/20 text-primary-blue hover:bg-indigo-100' :
                      'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
                    }`}
                  >
                    {day}
                    {hasSession && !isToday && (
                      <div className="absolute bottom-1.5 w-1 h-1 bg-primary-blue rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SessionsPage;
