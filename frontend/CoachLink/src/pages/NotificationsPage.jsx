import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Check, CheckCheck, Settings, ShoppingBag, Calendar, UserPlus, Star, Trash2 } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { useDispatch } from 'react-redux';
import { setNotificationCount } from '../redux/store';

const notificationTypes = {
  request: { icon: UserPlus, color: 'bg-primary-blue/10 text-primary-blue' },
  order: { icon: ShoppingBag, color: 'bg-primary-orange/10 text-primary-orange' },
  session: { icon: Calendar, color: 'bg-green-100 dark:bg-green-900/20 text-green-600' },
  review: { icon: Star, color: 'bg-amber-100 dark:bg-amber-900/20 text-amber-500' },
  system: { icon: Bell, color: 'bg-slate-100 dark:bg-dark-border text-slate-500' },
};

const initialNotifications = [
  { id: 1, type: 'request', title: 'New Training Request', message: 'Chris Evans sent you a training request for Football coaching.', time: 'Just now', read: false },
  { id: 2, type: 'request', title: 'New Training Request', message: 'Lena Gomez would like to join your beginner fitness program.', time: '5 min ago', read: false },
  { id: 3, type: 'order', title: 'New Order Received', message: 'Alex Johnson purchased 12-Week Football Program ($299).', time: '1 hour ago', read: false },
  { id: 4, type: 'session', title: 'Session Reminder', message: 'You have a session with Sarah Martinez today at 2:00 PM.', time: '2 hours ago', read: true },
  { id: 5, type: 'review', title: 'New Review', message: 'Mike Brown left you a 5-star review on your Elite Defense Masterclass.', time: '1 day ago', read: true },
  { id: 6, type: 'order', title: 'New Order Received', message: 'Emma Davis purchased Nutrition & Meal Guide ($79).', time: '1 day ago', read: true },
  { id: 7, type: 'system', title: 'Subscription Renewal', message: 'Your store subscription will auto-renew on May 8, 2026. Make sure your payment info is up to date.', time: '2 days ago', read: true },
];

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState('All');
  const dispatch = useDispatch();

  const filters = ['All', 'Unread', 'Requests', 'Orders', 'Sessions'];

  const filtered = notifications.filter(n => {
    if (filter === 'Unread') return !n.read;
    if (filter === 'Requests') return n.type === 'request';
    if (filter === 'Orders') return n.type === 'order';
    if (filter === 'Sessions') return n.type === 'session';
    return true;
  });

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    dispatch(setNotificationCount(0));
  };

  const markRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    const unread = notifications.filter(n => !n.read && n.id !== id).length;
    dispatch(setNotificationCount(unread));
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                You have <span className="font-bold text-primary-blue">{unreadCount}</span> unread notifications
              </p>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1.5 text-sm font-bold text-primary-blue hover:bg-indigo-50 dark:hover:bg-indigo-900/10 px-3 py-2 rounded-xl transition-colors"
            >
              <CheckCheck size={16} /> Mark all read
            </button>
          )}
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

        {/* Notification list */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-slate-400 dark:text-slate-500">
              <Bell size={48} className="mx-auto mb-3 opacity-30" />
              <p className="font-semibold">No notifications here</p>
            </div>
          ) : filtered.map(n => {
            const config = notificationTypes[n.type];
            const Icon = config.icon;
            return (
              <motion.div
                key={n.id}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className={`flex items-start gap-4 p-4 rounded-2xl border transition-all group ${
                  n.read
                    ? 'bg-white dark:bg-dark-card border-slate-100 dark:border-dark-border'
                    : 'bg-indigo-50/50 dark:bg-indigo-900/10 border-primary-blue/20'
                }`}
              >
                {/* Icon */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${config.color}`}>
                  <Icon size={18} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-bold ${n.read ? 'text-slate-700 dark:text-slate-300' : 'text-slate-900 dark:text-white'}`}>
                      {n.title}
                    </p>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap mt-0.5">{n.time}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{n.message}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  {!n.read && (
                    <button
                      onClick={() => markRead(n.id)}
                      title="Mark as read"
                      className="w-7 h-7 rounded-lg bg-green-100 dark:bg-green-900/20 text-green-600 flex items-center justify-center hover:bg-green-200 transition-colors"
                    >
                      <Check size={13} />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(n.id)}
                    title="Delete"
                    className="w-7 h-7 rounded-lg bg-red-50 dark:bg-red-900/10 text-red-400 flex items-center justify-center hover:bg-red-100 transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                {/* Unread dot */}
                {!n.read && (
                  <div className="w-2 h-2 bg-primary-blue rounded-full flex-shrink-0 mt-1" />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NotificationsPage;
