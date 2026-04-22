import React, { useState } from 'react';
import { Bell, Check, CheckCheck, Trash2, Star, Calendar, MessageSquare, CheckCircle } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';

const INITIAL = [
  { id: 1, type: 'request', title: 'Request Accepted!', message: 'Tashi Duncan accepted your training request for the Elite Program. Check their contact info in My Requests.', time: 'Just now', read: false },
  { id: 2, type: 'session', title: 'Upcoming Session',  message: 'You have a session with Tashi Duncan tomorrow at 10:00 AM. Make sure to warm up beforehand!', time: '1 hour ago', read: false },
  { id: 3, type: 'promo',   title: 'New Program Available', message: 'Marcus Johnson just published a new Football Conditioning Program. Check it out in the store.', time: '3 hours ago', read: false },
  { id: 4, type: 'review',  title: 'Leave a Review',   message: 'Your session with Coach Elena has ended. Share your feedback to help other athletes.', time: '1 day ago',  read: true },
  { id: 5, type: 'system',  title: 'Profile Incomplete', message: 'Complete your profile to get better coach recommendations tailored to your sport and level.', time: '2 days ago', read: true },
];

const typeConfig = {
  request: { icon: CheckCircle,   color: 'bg-green-100 dark:bg-green-900/20 text-green-600' },
  session: { icon: Calendar,      color: 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600' },
  promo:   { icon: Star,          color: 'bg-amber-100 dark:bg-amber-900/20 text-amber-500' },
  review:  { icon: MessageSquare, color: 'bg-purple-100 dark:bg-purple-900/20 text-purple-600' },
  system:  { icon: Bell,          color: 'bg-slate-100 dark:bg-slate-700 text-slate-500' },
};

const FILTERS = ['All', 'Unread', 'Sessions', 'Requests'];

const AthleteNotificationsPage = () => {
  const [items, setItems]   = useState(INITIAL);
  const [filter, setFilter] = useState('All');

  const filtered = items.filter((n) => {
    if (filter === 'Unread')   return !n.read;
    if (filter === 'Sessions') return n.type === 'session';
    if (filter === 'Requests') return n.type === 'request';
    return true;
  });

  const unread = items.filter((n) => !n.read).length;

  const markRead   = (id) => setItems((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  const markAll    = ()   => setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  const deleteItem = (id) => setItems((prev) => prev.filter((n) => n.id !== id));

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">Notifications</h1>
            {unread > 0 && (
              <p className="text-sm text-slate-500 mt-1">
                <span className="font-bold text-indigo-600">{unread}</span> unread
              </p>
            )}
          </div>
          {unread > 0 && (
            <button
              onClick={markAll}
              className="flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 px-3 py-2 rounded-xl transition-colors"
            >
              <CheckCheck size={16} /> Mark all read
            </button>
          )}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
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

        {/* List */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <Bell size={48} className="mx-auto mb-3 opacity-30" />
              <p className="font-semibold">No notifications here</p>
            </div>
          ) : filtered.map((n) => {
            const cfg  = typeConfig[n.type] || typeConfig.system;
            const Icon = cfg.icon;
            return (
              <div
                key={n.id}
                className={`flex items-start gap-4 p-4 rounded-2xl border transition-all group ${
                  n.read
                    ? 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700'
                    : 'bg-indigo-50/50 dark:bg-indigo-900/10 border-indigo-200/50 dark:border-indigo-800/50'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.color}`}>
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-bold ${n.read ? 'text-slate-700 dark:text-slate-300' : 'text-slate-900 dark:text-white'}`}>
                      {n.title}
                    </p>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap mt-0.5">{n.time}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{n.message}</p>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  {!n.read && (
                    <button
                      onClick={() => markRead(n.id)}
                      className="w-7 h-7 rounded-lg bg-green-100 dark:bg-green-900/20 text-green-600 flex items-center justify-center hover:bg-green-200 transition-colors"
                    >
                      <Check size={13} />
                    </button>
                  )}
                  <button
                    onClick={() => deleteItem(n.id)}
                    className="w-7 h-7 rounded-lg bg-red-50 dark:bg-red-900/10 text-red-400 flex items-center justify-center hover:bg-red-100 transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                {!n.read && <div className="w-2 h-2 bg-indigo-600 rounded-full flex-shrink-0 mt-2" />}
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AthleteNotificationsPage;
