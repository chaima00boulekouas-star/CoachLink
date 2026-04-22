import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Star, MessageCircle, CheckCircle, XCircle, Trophy, Target } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { acceptRequest, declineRequest } from '../redux/store';

const athletes = [
  { id: 1, name: 'Alex Johnson', sport: 'Football', level: 'Competitive', goal: 'Skill Improvement', status: 'active', joinDate: 'Jan 2026', sessions: 12, progress: 78, avatar: 'AJ', color: 'bg-blue-500' },
  { id: 2, name: 'Sarah Martinez', sport: 'Basketball', level: 'Intermediate', goal: 'Competition Prep', status: 'active', joinDate: 'Feb 2026', sessions: 8, progress: 62, avatar: 'SM', color: 'bg-pink-500' },
  { id: 3, name: 'Mike Brown', sport: 'Football', level: 'Beginner', goal: 'Fitness', status: 'active', joinDate: 'Feb 2026', sessions: 5, progress: 40, avatar: 'MB', color: 'bg-green-500' },
  { id: 4, name: 'Emma Davis', sport: 'Tennis', level: 'Intermediate', goal: 'Technique Improvement', status: 'pending', joinDate: 'Mar 2026', sessions: 0, progress: 0, avatar: 'ED', color: 'bg-orange-500' },
  { id: 5, name: 'James Wilson', sport: 'Football', level: 'Advanced', goal: 'Professional Training', status: 'inactive', joinDate: 'Nov 2025', sessions: 24, progress: 95, avatar: 'JW', color: 'bg-purple-500' },
  { id: 6, name: 'Chris Evans', sport: 'Football', level: 'Competitive', goal: 'Skill Improvement', status: 'pending', joinDate: 'Apr 2026', sessions: 0, progress: 0, avatar: 'CE', color: 'bg-indigo-500' },
];

const statusConfig = {
  active: { label: 'Active', className: 'text-green-600 bg-green-50 dark:bg-green-900/20' },
  pending: { label: 'Pending', className: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20' },
  inactive: { label: 'Inactive', className: 'text-slate-500 bg-slate-100 dark:bg-dark-border' },
};

const AthletesPage = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const dispatch = useDispatch();

  const filters = ['All', 'Active', 'Pending', 'Inactive'];
  const filtered = athletes.filter(a => {
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) || a.sport.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || a.status === filter.toLowerCase();
    return matchSearch && matchFilter;
  });

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">Athletes</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your team and track their progress</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-dark-card px-3 py-1.5 rounded-xl border border-slate-200 dark:border-dark-border">
              {athletes.filter(a => a.status === 'active').length} Active
            </span>
          </div>
        </div>

        {/* Search + filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search athletes or sports..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-card text-slate-900 dark:text-white text-sm focus:outline-none focus:border-primary-blue focus:ring-4 focus:ring-primary-blue/10 transition-all"
            />
          </div>
          <div className="flex gap-2">
            {filters.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-xs font-bold px-3 py-2 rounded-xl transition-all ${
                  filter === f ? 'bg-primary-blue text-white shadow-lg shadow-blue-500/20' : 'bg-white dark:bg-dark-card text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-dark-border hover:border-primary-blue'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Athletes grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence>
            {filtered.map(a => {
              const sc = statusConfig[a.status];
              return (
                <motion.div
                  key={a.id}
                  layout
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white dark:bg-dark-card rounded-2xl border border-slate-100 dark:border-dark-border shadow-sm p-5"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`${a.color} w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0`}>
                      {a.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-slate-900 dark:text-white text-sm">{a.name}</h3>
                          <p className="text-xs font-semibold text-primary-orange">{a.sport}</p>
                        </div>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-xl ${sc.className}`}>
                          {sc.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                    {[
                      { label: 'Level', value: a.level },
                      { label: 'Sessions', value: a.sessions },
                      { label: 'Joined', value: a.joinDate },
                    ].map(stat => (
                      <div key={stat.label} className="bg-slate-50 dark:bg-white/5 rounded-xl py-2">
                        <p className="text-xs font-black text-slate-900 dark:text-white">{stat.value}</p>
                        <p className="text-[10px] text-slate-400">{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Progress bar */}
                  {a.status === 'active' && (
                    <div className="mb-4">
                      <div className="flex justify-between text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                        <span>Goal: {a.goal}</span>
                        <span>{a.progress}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 dark:bg-dark-border rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${a.progress}%` }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className="h-full bg-gradient-to-r from-primary-blue to-indigo-400 rounded-full"
                        />
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link to="/requests" className="flex-1">
                      <button className="w-full flex items-center justify-center gap-1.5 text-xs font-bold text-primary-blue border border-primary-blue/30 rounded-xl py-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-colors">
                        <MessageCircle size={13} /> Message
                      </button>
                    </Link>
                    {a.status === 'pending' ? (
                      <>
                        <button
                          onClick={() => dispatch(declineRequest(a.id))}
                          className="flex items-center gap-1 text-xs font-bold text-red-500 border border-red-200 dark:border-red-800 rounded-xl px-3 py-2 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                        >
                          <XCircle size={13} />
                        </button>
                        <button
                          onClick={() => dispatch(acceptRequest(a.id))}
                          className="flex items-center gap-1 text-xs font-bold text-green-600 border border-green-200 dark:border-green-800 rounded-xl px-3 py-2 hover:bg-green-50 dark:hover:bg-green-900/10 transition-colors"
                        >
                          <CheckCircle size={13} />
                        </button>
                      </>
                    ) : (
                      <Link to="/sessions" className="flex-1">
                        <button className="w-full flex items-center justify-center gap-1.5 text-xs font-bold bg-primary-blue text-white rounded-xl py-2 hover:opacity-90 transition-opacity">
                          <Trophy size={13} /> View Sessions
                        </button>
                      </Link>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AthletesPage;
