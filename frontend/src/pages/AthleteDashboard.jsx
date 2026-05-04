import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, Target, Play, History, TrendingUp,
  Edit2, CheckCircle2, Calendar, MapPin, Loader2
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { useSelector } from 'react-redux';
import { athleteService } from '../api/dataService';
import { getImageUrl } from '../utils/imageUrl';

const PerformanceChart = ({ points = [80, 75, 85, 60, 65, 55, 40, 45, 30, 20, 25] }) => (
  <div className="relative h-32 w-full">
    <div className="absolute inset-0 bg-gradient-to-t from-orange-500/10 to-transparent rounded-lg" />
    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
      <path
        d={`M0,${points[0]} ${points.map((p, i) => `L${i * 10},${p}`).join(' ')}`}
        fill="none"
        stroke="#FF5B22"
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
    {points.map((val, i) => (
      <div
        key={i}
        style={{ left: `${i * 10}%`, top: `${val}%` }}
        className="absolute w-2 h-2 bg-white dark:bg-slate-800 border-2 border-orange-500 rounded-full -translate-x-1/2 -translate-y-1/2 shadow-sm"
      />
    ))}
  </div>
);

const AthleteDashboard = () => {
  const user = useSelector((s) => s.auth.user);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await athleteService.getDashboard();
        setData(res);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const name     = user?.name     || 'Athlete';
  const stats    = data?.stats    || { totalSessions: 0, upcomingSessions: 0, completedSessions: 0, activeTrainers: 0, performanceScore: 0 };
  const profile  = data?.profile  || { sport: '—', level: '—', goal: '—', location: '—', age: '—' };
  const sessions = data?.recentSessions || [];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 size={32} className="animate-spin text-indigo-600" />
        </div>
      </DashboardLayout>
    );
  }

  return (
  <DashboardLayout>
    <div className="max-w-6xl mx-auto space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Hello, {name}!</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Track your progress and achieve your goals</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Main Column */}
        <div className="lg:col-span-8 space-y-6">

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Training Sessions */}
            <div className="bg-indigo-50 dark:bg-indigo-900/10 rounded-3xl p-6 border border-indigo-100 dark:border-indigo-900/30">
              <div className="flex justify-between items-start mb-4">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Total Sessions</span>
                <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-indigo-600 shadow-sm">
                  <Play size={14} className="fill-current" />
                </div>
              </div>
              <h2 className="text-4xl font-black text-slate-900 dark:text-white">{stats.totalSessions}</h2>
              <p className="text-sm text-slate-500 mb-4">{stats.upcomingSessions} Upcoming</p>
              <div className="flex items-end gap-1.5 h-10">
                {[40, 60, 30, 80, 50, 70, 90, 60].map((h, i) => (
                  <div key={i} className="flex-1 bg-indigo-200 dark:bg-indigo-800/50 rounded-sm" style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>

            {/* Goals Completed */}
            <div className="bg-orange-50 dark:bg-orange-900/10 rounded-3xl p-6 border border-orange-100 dark:border-orange-900/30">
              <div className="flex justify-between items-start mb-4">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Completed Sessions</span>
                <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-orange-500 shadow-sm">
                  <Target size={14} />
                </div>
              </div>
              <h2 className="text-4xl font-black text-slate-900 dark:text-white">{stats.completedSessions}</h2>
              <p className="text-sm text-slate-500 mb-4">{stats.activeTrainers} Active Trainers</p>
              <div className="w-full bg-orange-200 dark:bg-orange-900/50 h-2 rounded-full">
                <div 
                  className="bg-orange-500 h-full rounded-full transition-all duration-1000" 
                  style={{ width: `${Math.min(100, (stats.completedSessions / (stats.totalSessions || 1)) * 100)}%` }} 
                />
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
                <span className="text-2xl font-black text-slate-900 dark:text-white">{stats.performanceScore.toFixed(2)}</span>
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
            {sessions.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-slate-400 text-sm italic">No training sessions recorded yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sessions.map((session) => (
                  <div key={session._id} className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-600 overflow-hidden flex-shrink-0">
                      <img src={getImageUrl(session.trainer?.avatar)} alt={session.trainer?.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-slate-900 dark:text-white truncate">{session.trainer?.name}</h4>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                          session.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                        }`}>
                          {session.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(session.date).toLocaleDateString()}</span>
                        <span className="font-bold text-indigo-600">{session.type}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-4 space-y-6">

          {/* Profile Card */}
          <div className="bg-gradient-to-b from-indigo-600/90 to-indigo-700 rounded-3xl p-6 shadow-lg text-white">
            <h3 className="font-black text-xl mt-2 mb-1">{name}</h3>
            <p className="text-xs text-white/70 flex items-center gap-1 mb-4">
              <MapPin size={12} /> {profile.location}
            </p>
            <div className="aspect-square rounded-2xl overflow-hidden bg-slate-700/50 mb-6 border-2 border-white/10">
              {user?.avatar ? (
                <img src={getImageUrl(user.avatar)} alt={name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/20 text-7xl font-black">
                  {name.charAt(0)}
                </div>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2 text-center mb-6">
              {[
                { label: 'age',   val: profile.age },
                { label: 'sport', val: profile.sport },
                { label: 'level', val: profile.level },
              ].map((s) => (
                <div key={s.label} className="bg-white/10 rounded-xl py-2">
                  <div className="text-sm font-black truncate px-1">{s.val}</div>
                  <div className="text-[10px] text-white/60 uppercase font-bold tracking-tighter">{s.label}</div>
                </div>
              ))}
            </div>
            <Link to="/athlete/profile/edit" className="block">
              <button className="w-full py-3 bg-white text-indigo-600 text-sm font-black rounded-xl hover:bg-slate-100 transition-colors flex items-center justify-center gap-2 shadow-sm">
                <Edit2 size={14} /> Edit Profile
              </button>
            </Link>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4 text-sm">Quick Actions</h3>
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
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
            <h3 className="font-bold text-slate-900 dark:text-white mb-4 text-sm">Target Goal</h3>
            <div className="p-4 rounded-xl bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30 text-center">
              <p className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase mb-1">Primary Objective</p>
              <p className="text-sm font-black text-slate-900 dark:text-white">{profile.goal}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  </DashboardLayout>
  );
};

export default AthleteDashboard;
