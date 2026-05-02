import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Trophy, Target, Calendar, Star, Edit2, Search } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { useSelector } from 'react-redux';

const AthleteProfilePage = () => {
  const user = useSelector((s) => s.auth.user);

  const name       = user?.name       || 'Athlete';
  const location   = user?.location   || '';
  const sports     = Array.isArray(user?.sports) ? user.sports : (user?.sport ? [user.sport] : []);
  const level      = user?.level      || '';
  const age        = user?.age        || '';
  const goal       = user?.goal       || user?.fitnessGoals?.[0] || '';
  const style      = user?.style      || '';
  const availability = Array.isArray(user?.availability) ? user.availability : [];
  const reason     = user?.reason     || '';

  const goalLabel = {
    fitness: 'General Fitness & Conditioning',
    skill: 'Skill Improvement',
    competition: 'Competition Preparation',
    recovery: 'Recovery & Rehabilitation',
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Hero Card */}
        <div className="relative bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-3xl overflow-hidden p-8 md:p-10 text-white">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/3" />
          </div>
          <div className="relative flex flex-col sm:flex-row items-start gap-6">
            <div className="w-28 h-28 rounded-2xl overflow-hidden border-4 border-white/30 shadow-2xl flex-shrink-0 bg-indigo-800 flex items-center justify-center">
              <span className="text-5xl font-black text-white/40">{name.charAt(0)}</span>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-black mb-1">{name}</h1>
              <p className="text-white/70 flex items-center gap-1.5 text-sm mb-4">
                <MapPin size={14} /> {location || 'Location not set'}
              </p>
              <div className="flex flex-wrap gap-3 mb-5">
                {sports.length > 0 && sports.map((s) => (
                  <span key={s} className="bg-white/20 backdrop-blur text-xs font-bold px-3 py-1.5 rounded-full">🏅 {s}</span>
                ))}
                {level && <span className="bg-white/20 backdrop-blur text-xs font-bold px-3 py-1.5 rounded-full">⭐ {level}</span>}
                {age && <span className="bg-white/20 backdrop-blur text-xs font-bold px-3 py-1.5 rounded-full">{age} years old</span>}
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
                { icon: Calendar, label: 'Sessions',     value: '0', color: 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600' },
                { icon: Trophy,   label: 'Goals Met',    value: '0',  color: 'bg-amber-100 dark:bg-amber-900/20 text-amber-500' },
                { icon: Target,   label: 'Active Goals', value: goal ? '1' : '0',  color: 'bg-orange-100 dark:bg-orange-900/20 text-orange-500' },
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
                {sports.length > 0 ? sports.map((s) => (
                  <div key={s} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-100 dark:border-slate-700">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{s}</p>
                    </div>
                    {level && (
                      <span className="text-xs font-black text-orange-500 bg-orange-50 dark:bg-orange-900/20 px-3 py-1.5 rounded-full">
                        {level}
                      </span>
                    )}
                  </div>
                )) : (
                  <p className="text-sm text-slate-400">No sports added yet.</p>
                )}
              </div>
              {(goal || style) && (
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 space-y-2">
                  {goal && (
                    <div>
                      <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Primary Goal</p>
                      <p className="font-bold text-slate-900 dark:text-white mt-1">{goalLabel[goal] || goal}</p>
                    </div>
                  )}
                  {style && (
                    <div>
                      <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Preferred Coaching Style</p>
                      <p className="font-bold text-slate-900 dark:text-white mt-1 capitalize">{style}</p>
                    </div>
                  )}
                </div>
              )}
              {reason && (
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Why I'm Here</p>
                  <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">{reason}</p>
                </div>
              )}
            </div>

          </div>

          {/* Right: Goals & Info */}
          <div className="space-y-6">

            {/* Goals */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
              <h2 className="font-black text-slate-900 dark:text-white text-lg mb-5 flex items-center gap-2">
                <Target size={18} className="text-orange-500" /> My Goals
              </h2>
              {goal ? (
                <div className="p-3 rounded-xl bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-[10px] font-black">✓</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{goalLabel[goal] || goal}</p>
                </div>
              ) : (
                <p className="text-sm text-slate-400">No goals set yet. Edit your profile to add goals.</p>
              )}
            </div>

            {/* Availability */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
              <h2 className="font-black text-slate-900 dark:text-white text-lg mb-4">Availability</h2>
              <div className="space-y-2">
                {availability.length > 0 ? availability.map((day) => (
                  <div key={day} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-100 dark:border-slate-700">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{day}</span>
                    <span className="text-xs font-bold text-green-600 bg-green-100 dark:bg-green-900/20 px-2.5 py-1 rounded-full">Available</span>
                  </div>
                )) : (
                  <p className="text-sm text-slate-400">No availability set yet.</p>
                )}
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
};

export default AthleteProfilePage;
