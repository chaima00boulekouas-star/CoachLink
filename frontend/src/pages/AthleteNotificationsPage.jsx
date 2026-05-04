import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Check, CheckCheck, Trash2, Star, Calendar, UserPlus, UserCheck, UserX, ShoppingBag, MessageCircle } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setNotificationCount } from '../redux/store';
import { notificationService } from '../api/dataService';

const typeConfig = {
  request:          { icon: UserPlus,    color: 'bg-primary-blue/10 text-primary-blue' },
  request_accepted: { icon: UserCheck,   color: 'bg-green-100 dark:bg-green-900/20 text-green-600' },
  request_declined: { icon: UserX,       color: 'bg-red-100 dark:bg-red-900/20 text-red-500' },
  session:          { icon: Calendar,    color: 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600' },
  order:            { icon: ShoppingBag, color: 'bg-primary-orange/10 text-primary-orange' },
  review:           { icon: Star,        color: 'bg-amber-100 dark:bg-amber-900/20 text-amber-500' },
  system:           { icon: Bell,        color: 'bg-slate-100 dark:bg-slate-700 text-slate-500' },
  message:          { icon: MessageCircle, color: 'bg-blue-100 dark:bg-blue-900/20 text-blue-500' },
};

const timeAgo = (dateStr) => {
  const now = new Date();
  const d = new Date(dateStr);
  const diffMs = now - d;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} hour${diffHr > 1 ? 's' : ''} ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const FILTERS = ['All', 'Unread', 'Sessions', 'Requests', 'Messages'];

const AthleteNotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const res = await notificationService.getAll();
      const notifs = res.notifications || res || [];
      setNotifications(notifs);
      const unread = notifs.filter(n => !n.read).length;
      dispatch(setNotificationCount(unread));
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [dispatch]);

  const filtered = notifications.filter((n) => {
    if (filter === 'Unread')   return !n.read;
    if (filter === 'Sessions') return n.type === 'session';
    if (filter === 'Requests') return n.type === 'request' || n.type === 'request_accepted' || n.type === 'request_declined';
    if (filter === 'Messages') return n.type === 'message';
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      try {
        await notificationService.markRead(notification._id);
        setNotifications(prev => prev.map(n => n._id === notification._id ? { ...n, read: true } : n));
        const unread = notifications.filter(n => !n.read && n._id !== notification._id).length;
        dispatch(setNotificationCount(unread));
      } catch (err) {
        console.error('Failed to mark read:', err);
      }
    }
    
    if (notification.link) {
      navigate(notification.link);
    } else if (notification.relatedId && notification.type === 'message') {
      navigate(`/chat/${notification.relatedId}`);
    }
  };

  const markAllRead = async () => {
    try {
      await notificationService.markAllRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      dispatch(setNotificationCount(0));
    } catch (err) {
      console.error('Failed to mark all read:', err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await notificationService.delete(id);
      setNotifications(prev => prev.filter(n => n._id !== id));
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white">Notifications</h1>
                {unreadCount > 0 && (
                  <p className="text-sm text-slate-500 mt-1">
                    <span className="font-bold text-indigo-600">{unreadCount}</span> unread
                  </p>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
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
              ) : (
                filtered.map((n) => {
                  const cfg  = typeConfig[n.type] || typeConfig.system;
                  const Icon = cfg.icon;
                  return (
                    <motion.div
                      key={n._id}
                      layout
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      onClick={() => handleNotificationClick(n)}
                      className={`flex items-start gap-4 p-4 rounded-2xl border transition-all group cursor-pointer ${
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
                          <span className="text-[10px] text-slate-400 whitespace-nowrap mt-0.5">{timeAgo(n.createdAt)}</span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{n.message}</p>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteNotification(n._id); }}
                          title="Delete"
                          className="w-7 h-7 rounded-lg bg-red-50 dark:bg-red-900/10 text-red-400 flex items-center justify-center hover:bg-red-100 transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                      {!n.read && <div className="w-2 h-2 bg-indigo-600 rounded-full flex-shrink-0 mt-2" />}
                    </motion.div>
                  );
                })
              )}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AthleteNotificationsPage;
