import React from 'react';
import { Link } from 'react-router-dom';
import {
  Search, Target, Play, History, TrendingUp,
  Edit2, CheckCircle2, Calendar, MapPin
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';

const RECENT_SESSIONS = [
  {
    id: 1,
    coach: 'Marcus Johnson',
    sport: 'Tennis',
    duration: '6 months',
    result: 'Improved shooting percentage from 42% to 58%',
    year: '2024',
  },
  {
    id: 2,
    coach: 'Coach Mike Davis',
    sport: 'Tennis',
    duration: '1 year',
    result: 'Enhanced defensive positioning and footwork',
    year: '2023',
  },
];

const CHART_POINTS = [80, 75, 85, 60, 65, 55, 40, 45, 30, 20, 25];

const PerformanceChart = () => (
  <div className="relative h-32 w-full">
    <div className="absolute inset-0 bg-gradient-to-t from-orange-500/10 to-transparent rounded-lg" />
    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
      <path
        d="M0,80 L10,75 L20,85 L30,60 L40,65 L50,55 L60,40 L70,45 L80,30 L90,20 L100,25"
        fill="none"
        stroke="#FF5B22"
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
    {CHART_POINTS.map((val, i) => (
      <div
        key={i}
        style={{ left: `${i * 10}%`, top: `${val}%` }}
        className="absolute w-2 h-2 bg-white dark:bg-slate-800 border-2 border-orange-500 rounded-full -translate-x-1/2 -translate-y-1/2 shadow-sm"
      />
    ))}
  </div>
);

const AthleteDashboard = () => (
  <DashboardLayout>
    <div className="max-w-6xl mx-auto space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Hello, Patrick Zweig!</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Track your progress and achieve your goals</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">

        {/* Main Column */}
        <div className="space-y-6">

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Training Sessions */}
            <div className="bg-indigo-50 dark:bg-indigo-900/10 rounded-3xl p-6 border border-indigo-100 dark:border-indigo-900/30">
              <div className="flex justify-between items-start mb-4">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Training Sessions</span>
                <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-indigo-600 shadow-sm">
                  <Play size={14} className="fill-current" />
                </div>
              </div>
              <h2 className="text-4xl font-black text-slate-900 dark:text-white">24</h2>
              <p className="text-sm text-slate-500 mb-4">This Month</p>
              <div className="flex items-end gap-1.5 h-10">
                {[40, 60, 30, 80, 50, 70, 90, 60].map((h, i) => (
                  <div key={i} className="flex-1 bg-indigo-200 dark:bg-indigo-800/50 rounded-sm" style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>

            {/* Goals Completed */}
            <div className="bg-orange-50 dark:bg-orange-900/10 rounded-3xl p-6 border border-orange-100 dark:border-orange-900/30">
              <div className="flex justify-between items-start mb-4">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Goals Completed</span>
                <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-orange-500 shadow-sm">
                  <Target size={14} />
                </div>
              </div>
              <h2 className="text-4xl font-black text-slate-900 dark:text-white">8/12</h2>
              <p className="text-sm text-slate-500 mb-4">67% Achievement</p>
              <div className="w-full bg-orange-200 dark:bg-orange-900/50 h-2 rounded-full">
                <div className="w-[67%] bg-orange-500 h-full rounded-full" />
              </div>
            </div>
          </div>

          {/* Performance Chart */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Performance Score</h3>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                  <TrendingUp size={12} className="text-green-500" />
                  +8.2% Increasing Steadily
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-slate-900 dark:text-white">87.51</span>
                <span className="text-xs text-slate-500 ml-1">pts</span>
              </div>
            </div>
            <PerformanceChart />
            <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-4 uppercase">
              <span>1w</span><span>2w</span><span>1m</span><span>3m</span><span>All</span>
            </div>
          </div>

          {/* Recent Sessions */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <History size={18} className="text-indigo-600" />
              Recent Training Sessions
            </h3>
            <div className="space-y-4">
              {RECENT_SESSIONS.map((session) => (
                <div key={session.id} className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 relative">
                  <span className="absolute top-5 right-5 text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded">
                    {session.year}
                  </span>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-1">{session.coach}</h4>
                  <p className="text-xs text-slate-500 mb-2">{session.sport}</p>
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 mb-2">
                    <Calendar size={12} />
                    {session.duration}
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300">{session.result}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">

          {/* Profile Card */}
          <div className="bg-gradient-to-b from-indigo-600/90 to-indigo-700 rounded-3xl p-5 shadow-lg text-white">
            <h3 className="font-black text-xl mt-2 mb-1">Patrick Zweig</h3>
            <p className="text-xs text-white/70 flex items-center gap-1 mb-4">
              <MapPin size={12} /> New York, NY
            </p>
            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-slate-700 mb-4">
              <img
                src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=400"
                alt="Patrick Zweig"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-3 gap-2 text-center mb-4">
              {[{ label: 'age', val: '25' }, { label: 'sport', val: 'Tennis' }, { label: 'level', val: 'Pro' }].map((s) => (
                <div key={s.label}>
                  <div className="text-sm font-black">{s.val}</div>
                  <div className="text-[10px] text-white/60">{s.label}</div>
                </div>
              ))}
            </div>
            <Link to="/athlete/profile" className="block">
              <button className="w-full py-2.5 bg-white/20 hover:bg-white/30 border border-white/30 text-white text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                <Edit2 size={14} /> Edit Profile
              </button>
            </Link>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4 text-sm">Quick Actions</h3>
            <div className="space-y-2">
              {[
                { to: '/coaches', icon: Search, label: 'Find Trainers' },
                { to: '/requests', icon: Target, label: 'My Requests' },
              ].map((action) => {
                const Icon = action.icon;
                return (
                  <Link key={action.to} to={action.to} className="block">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors group">
                      <Icon size={16} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{action.label}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Availability */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4 text-sm">Availability</h3>
            <div className="space-y-2">
              {['Monday', 'Wednesday', 'Friday'].map((day) => (
                <div key={day} className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700">
                  <CheckCircle2 size={16} className="text-green-500" />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{day}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  </DashboardLayout>
);

export default AthleteDashboard;
