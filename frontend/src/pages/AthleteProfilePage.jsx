import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Trophy, Target, Calendar, Star, Edit2, Search } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';

const SPORT_LEVELS = [
  { sport: 'Tennis', level: 'Competitive', since: '2020' },
];

const RECENT_SESSIONS = [
  { coach: 'Tashi Duncan', sport: 'Tennis', date: 'Mar 2025', result: 'Improved serve accuracy by 25%' },
  { coach: 'Marcus Johnson', sport: 'Football', date: 'Jan 2025', result: 'Enhanced speed and agility' },
];

const GOALS = [
  { label: 'Win a regional tournament', done: false },
  { label: 'Improve serve speed to 120mph', done: true },
  { label: 'Train 4x per week consistently', done: true },
  { label: 'Master topspin backhand', done: false },
];

const AthleteProfilePage = () => (
  <DashboardLayout>
    <div className="max-w-5xl mx-auto space-y-8">

      {/* Hero Card */}
      <div className="relative bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-3xl overflow-hidden p-8 md:p-10 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/3" />
        </div>
        <div className="relative flex flex-col sm:flex-row items-start gap-6">
          <div className="w-28 h-28 rounded-2xl overflow-hidden border-4 border-white/30 shadow-2xl flex-shrink-0">
            <img
              src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=400"
              alt="Patrick Zweig"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-black mb-1">Patrick Zweig</h1>
            <p className="text-white/70 flex items-center gap-1.5 text-sm mb-4">
              <MapPin size={14} /> New York, NY
            </p>
            <div className="flex flex-wrap gap-3 mb-5">
              <span className="bg-white/20 backdrop-blur text-xs font-bold px-3 py-1.5 rounded-full">🎾 Tennis</span>
              <span className="bg-white/20 backdrop-blur text-xs font-bold px-3 py-1.5 rounded-full">⭐ Competitive</span>
              <span className="bg-white/20 backdrop-blur text-xs font-bold px-3 py-1.5 rounded-full">25 years old</span>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/athlete/profile/edit">
                <button className="bg-white text-indigo-700 text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-white/90 transition-colors flex items-center gap-2">
                  <Edit2 size={14} /> Edit Profile
                </button>
              </Link>
              <Link to="/coaches">
                <button className="bg-white/20 backdrop-blur text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-white/30 border border-white/30 transition-all flex items-center gap-2">
                  <Search size={14} /> Find Coach
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">

        {/* Left: Main info */}
        <div className="space-y-6">

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: Calendar, label: 'Sessions',     value: '24', color: 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600' },
              { icon: Trophy,   label: 'Goals Met',    value: '8',  color: 'bg-amber-100 dark:bg-amber-900/20 text-amber-500' },
              { icon: Target,   label: 'Active Goals', value: '2',  color: 'bg-orange-100 dark:bg-orange-900/20 text-orange-500' },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm text-center">
                <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mx-auto mb-3`}>
                  <Icon size={18} />
                </div>
                <p className="text-2xl font-black text-slate-900 dark:text-white">{value}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{label}</p>
              </div>
            ))}
          </div>

          {/* Athletic Profile */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
            <h2 className="font-black text-slate-900 dark:text-white text-lg mb-5">Athletic Profile</h2>
            <div className="space-y-4">
              {SPORT_LEVELS.map(({ sport, level, since }) => (
                <div key={sport} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-100 dark:border-slate-700">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{sport}</p>
                    <p className="text-xs text-slate-500">Training since {since}</p>
                  </div>
                  <span className="text-xs font-black text-orange-500 bg-orange-50 dark:bg-orange-900/20 px-3 py-1.5 rounded-full">
                    {level}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Primary Goal</p>
              <p className="font-bold text-slate-900 dark:text-white mt-1">Skill Improvement & Competition Preparation</p>
            </div>
          </div>

          {/* Recent Training Sessions */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
            <h2 className="font-black text-slate-900 dark:text-white text-lg mb-5">Recent Training Sessions</h2>
            <div className="space-y-4">
              {RECENT_SESSIONS.map((s) => (
                <div key={s.coach + s.date} className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-100 dark:border-slate-700">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/20 flex items-center justify-center flex-shrink-0">
                    <Calendar size={16} className="text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white text-sm">{s.coach}</p>
                    <p className="text-xs text-orange-500 font-semibold mb-1">{s.sport} · {s.date}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{s.result}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right: Goals & Info */}
        <div className="space-y-6">

          {/* Goals */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
            <h2 className="font-black text-slate-900 dark:text-white text-lg mb-5 flex items-center gap-2">
              <Target size={18} className="text-orange-500" /> My Goals
            </h2>
            <div className="space-y-3">
              {GOALS.map((g) => (
                <div key={g.label} className={`flex items-start gap-3 p-3 rounded-xl ${g.done ? 'bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30' : 'bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700'}`}>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${g.done ? 'bg-green-500' : 'border-2 border-slate-300 dark:border-slate-500'}`}>
                    {g.done && <span className="text-white text-[10px] font-black">✓</span>}
                  </div>
                  <p className={`text-sm font-semibold ${g.done ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-300'}`}>
                    {g.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
            <h2 className="font-black text-slate-900 dark:text-white text-lg mb-4">Availability</h2>
            <div className="space-y-2">
              {['Monday', 'Wednesday', 'Friday', 'Saturday'].map((day) => (
                <div key={day} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-100 dark:border-slate-700">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{day}</span>
                  <span className="text-xs font-bold text-green-600 bg-green-100 dark:bg-green-900/20 px-2.5 py-1 rounded-full">Available</span>
                </div>
              ))}
            </div>
          </div>

          {/* Visible to coaches note */}
          <div className="bg-indigo-50 dark:bg-indigo-900/10 rounded-2xl p-4 border border-indigo-100 dark:border-indigo-900/30">
            <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-1">Visible to coaches</p>
            <p className="text-xs text-indigo-700/70 dark:text-indigo-400/70 leading-relaxed">
              Your sport, level, goals and availability are shown to coaches when browsing your profile.
            </p>
          </div>

        </div>
      </div>
    </div>
  </DashboardLayout>
);

export default AthleteProfilePage;
