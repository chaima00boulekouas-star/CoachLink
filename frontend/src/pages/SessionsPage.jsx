import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Video, MapPin, Plus, ChevronLeft, ChevronRight, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { Link } from 'react-router-dom';

const sessionStatusConfig = {
  Scheduled: { icon: CheckCircle, className: 'text-primary-blue bg-indigo-50 dark:bg-indigo-900/20', dot: 'bg-primary-blue' },
  Completed: { icon: CheckCircle, className: 'text-green-600 bg-green-50 dark:bg-green-900/20', dot: 'bg-green-500' },
  Cancelled: { icon: XCircle, className: 'text-red-500 bg-red-50 dark:bg-red-900/20', dot: 'bg-red-500' },
  Pending: { icon: AlertCircle, className: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20', dot: 'bg-amber-500' },
};

const sessions = [
  { id: 1, athlete: 'Alex Johnson', sport: 'Football', date: 'Today', time: '09:00 AM', duration: '60 min', type: 'Video', status: 'Scheduled', avatar: 'AJ', color: 'bg-blue-500' },
  { id: 2, athlete: 'Sarah Martinez', sport: 'Basketball', date: 'Today', time: '02:00 PM', duration: '45 min', type: 'In-Person', status: 'Scheduled', avatar: 'SM', color: 'bg-pink-500' },
  { id: 3, athlete: 'Mike Brown', sport: 'Football', date: 'Tomorrow', time: '10:00 AM', duration: '90 min', type: 'Video', status: 'Scheduled', avatar: 'MB', color: 'bg-green-500' },
  { id: 4, athlete: 'Emma Davis', sport: 'Tennis', date: 'Apr 12, 2026', time: '11:00 AM', duration: '60 min', type: 'In-Person', status: 'Pending', avatar: 'ED', color: 'bg-orange-500' },
  { id: 5, athlete: 'James Wilson', sport: 'Football', date: 'Apr 8, 2026', time: '09:00 AM', duration: '60 min', type: 'Video', status: 'Completed', avatar: 'JW', color: 'bg-purple-500' },
  { id: 6, athlete: 'Chris Evans', sport: 'Football', date: 'Apr 5, 2026', time: '03:00 PM', duration: '45 min', type: 'In-Person', status: 'Cancelled', avatar: 'CE', color: 'bg-indigo-500' },
];

const weeks = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const calendarDays = Array.from({ length: 30 }, (_, i) => i + 1);

const SessionsPage = () => {
  const [view, setView] = useState('list'); // 'list' | 'calendar'
  const [filter, setFilter] = useState('All');
  const [currentMonth] = useState('April 2026');

  const filters = ['All', 'Scheduled', 'Pending', 'Completed', 'Cancelled'];
  const filtered = sessions.filter(s => filter === 'All' || s.status === filter);

  const sessionDays = [10, 11, 15, 17, 20];

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">Training Sessions</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Manage and track all your coaching sessions</p>
          </div>
          <div className="flex items-center gap-3">
            {/* View toggle */}
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
            <button className="flex items-center gap-1.5 bg-primary-blue text-white text-sm font-bold px-4 py-2 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/20">
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
              className={`text-xs font-bold px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                filter === f
                  ? 'bg-primary-blue text-white shadow-lg shadow-blue-500/20'
                  : 'bg-white dark:bg-dark-card text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-dark-border hover:border-primary-blue'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {view === 'list' ? (
          /* Session list */
          <div className="space-y-4">
            {filtered.map(s => {
              const sc = sessionStatusConfig[s.status];
              const StatusIcon = sc.icon;
              return (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-dark-card rounded-2xl border border-slate-100 dark:border-dark-border shadow-sm p-5 flex items-center gap-5"
                >
                  {/* Status indicator */}
                  <div className={`w-1.5 self-stretch rounded-full flex-shrink-0 ${sc.dot}`} />

                  {/* Avatar */}
                  <div className={`${s.color} w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                    {s.avatar}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">{s.athlete}</h3>
                    <p className="text-xs text-primary-orange font-semibold">{s.sport}</p>
                  </div>

                  {/* Meta */}
                  <div className="hidden sm:flex items-center gap-6 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={13} className="text-primary-blue" />
                      <span className="font-semibold">{s.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock size={13} className="text-primary-blue" />
                      <span className="font-semibold">{s.time} · {s.duration}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {s.type === 'Video' ? <Video size={13} className="text-indigo-500" /> : <MapPin size={13} className="text-green-500" />}
                      <span className="font-semibold">{s.type}</span>
                    </div>
                  </div>

                  {/* Status */}
                  <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl ${sc.className}`}>
                    <StatusIcon size={13} /> {s.status}
                  </span>
                </motion.div>
              );
            })}
          </div>
        ) : (
          /* Calendar view */
          <div className="bg-white dark:bg-dark-card rounded-2xl border border-slate-100 dark:border-dark-border shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">{currentMonth}</h2>
              <div className="flex gap-2">
                <button className="w-8 h-8 rounded-lg border border-slate-200 dark:border-dark-border flex items-center justify-center text-slate-500 hover:border-primary-blue hover:text-primary-blue transition-colors">
                  <ChevronLeft size={16} />
                </button>
                <button className="w-8 h-8 rounded-lg border border-slate-200 dark:border-dark-border flex items-center justify-center text-slate-500 hover:border-primary-blue hover:text-primary-blue transition-colors">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weeks.map(d => (
                <div key={d} className="text-center text-xs font-bold text-slate-400 dark:text-slate-500 py-2">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {/* Offset for April starting on Wednesday */}
              {[...Array(2)].map((_, i) => <div key={`e-${i}`} />)}
              {calendarDays.map(day => {
                const hasSession = sessionDays.includes(day);
                const isToday = day === 10;
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
