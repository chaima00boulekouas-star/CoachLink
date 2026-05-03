import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, CheckCircle } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { sessionService } from '../api/dataService';
import { getImageUrl } from '../utils/imageUrl';

const STATUS_CONFIG = {
  scheduled: { label: 'Upcoming',  className: 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800' },
  done:      { label: 'Completed', className: 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800' },
  cancelled: { label: 'Cancelled', className: 'bg-red-100 dark:bg-red-900/20 text-red-500 dark:text-red-400 border-red-200 dark:border-red-800' },
};

const FILTERS = ['All', 'Upcoming', 'Completed', 'Cancelled'];
const filterMap = { Upcoming: 'scheduled', Completed: 'done', Cancelled: 'cancelled' };

const formatDate = (d) => {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};
const formatTime = (d) => {
  if (!d) return '';
  return new Date(d).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

const AthleteSessionsPage = () => {
  const [filter, setFilter]     = useState('All');
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const data = await sessionService.getAthleteSessions();
        setSessions(data.sessions || []);
      } catch (err) {
        console.error('Failed to fetch sessions:', err);
        setSessions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  const filtered = sessions.filter((s) => {
    if (filter === 'All') return true;
    return s.status === filterMap[filter];
  });

  const upcomingCount  = sessions.filter((s) => s.status === 'scheduled').length;
  const completedCount = sessions.filter((s) => s.status === 'done').length;

  return (
    <DashboardLayout>
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
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Sessions', value: sessions.length,  color: 'text-indigo-600' },
            { label: 'Completed',      value: completedCount,   color: 'text-green-500' },
            { label: 'Upcoming',       value: upcomingCount,    color: 'text-orange-500' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 shadow-sm text-center">
              <div className={`text-2xl font-black ${color} mb-1`}>{value}</div>
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
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
              <Calendar size={40} className="mx-auto mb-3 text-slate-300 dark:text-slate-600" />
              <p className="text-slate-400 font-semibold mb-3">No {filter === 'All' ? '' : filter.toLowerCase()} sessions</p>
              <Link to="/coaches" className="text-sm font-bold text-indigo-600 hover:underline">
                Find a trainer →
              </Link>
            </div>
          ) : filtered.map((session) => {
            const cfg = STATUS_CONFIG[session.status] || STATUS_CONFIG.scheduled;
            const trainer = session.trainer;
            return (
              <div key={session._id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="flex items-start gap-4 p-5">
                  <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-slate-200 dark:bg-slate-700">
                    <img
                      src={getImageUrl(trainer?.avatar, `https://ui-avatars.com/api/?name=${encodeURIComponent(trainer?.name || 'T')}&background=f97316&color=fff`)}
                      alt={trainer?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white">{trainer?.name || 'Trainer'}</h3>
                        <p className="text-sm font-semibold text-orange-500">{session.title || 'Training Session'}</p>
                      </div>
                      <span className={`text-xs font-bold px-3 py-1.5 rounded-xl border flex-shrink-0 ${cfg.className}`}>
                        {cfg.label}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={12} className="text-indigo-400" /> {formatDate(session.date)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock size={12} className="text-indigo-400" /> {formatTime(session.date)} · {session.duration}
                      </span>
                      {session.location && session.location !== 'TBD' && (
                        <span className="flex items-center gap-1.5 sm:col-span-1 col-span-2">
                          <MapPin size={12} className="text-indigo-400 flex-shrink-0" /> {session.location}
                        </span>
                      )}
                    </div>
                    {session.notes && (
                      <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                        <p className="text-xs text-slate-600 dark:text-slate-400 italic">"{session.notes}"</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Completed badge */}
                {session.status === 'done' && (
                  <div className="mx-5 mb-4 p-3 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-xl">
                    <p className="text-xs font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                      <CheckCircle size={13} /> Session completed successfully
                    </p>
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
