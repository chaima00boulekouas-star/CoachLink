import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Settings, Bell, Menu, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useSelector, useDispatch } from 'react-redux';
import { setNotificationCount } from '../redux/store';
import { notificationService } from '../api/dataService';
import Logo from './Logo';

/**
 * DashboardTopbar
 * Receives `onToggleSidebar` to open/close the drawer.
 * Role-aware: notification and settings links route to the correct page.
 */
const DashboardTopbar = ({ onToggleSidebar }) => {
  const { theme, toggleTheme } = useTheme();
  const dispatch = useDispatch();
  const notificationCount = useSelector((s) => s.ui.notificationCount);
  const role = useSelector((s) => s.auth.role);

  useEffect(() => {
    if (!role) return;
    const fetchCount = async () => {
      try {
        const res = await notificationService.getUnreadCount();
        if (res && typeof res.count === 'number') {
          dispatch(setNotificationCount(res.count));
        }
      } catch (err) {
        console.error("Failed to fetch notification count", err);
      }
    };

    fetchCount();
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, [dispatch, role]);

  const isAthlete        = role === 'athlete';
  const notificationsPath = isAthlete ? '/athlete/notifications' : '/notifications';
  const settingsPath      = isAthlete ? '/athlete/settings'      : '/settings';

  return (
    <header className="fixed top-0 left-0 right-0 h-[60px] bg-white dark:bg-dark-bg border-b border-slate-100 dark:border-dark-border flex items-center px-4 z-20 shadow-sm">

      {/* Left: Hamburger toggle */}
      <button
        onClick={onToggleSidebar}
        className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-primary-blue transition-all mr-3"
        title="Toggle menu"
      >
        <Menu size={20} />
      </button>

      {/* Brand */}
      <Link to="/" className="mr-auto flex items-center gap-2">
        <Logo className="h-9" />
        {role && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            isAthlete
              ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
              : 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
          }`}>
            {isAthlete ? 'Athlete' : 'Trainer'}
          </span>
        )}
      </Link>

      {/* Right: action buttons */}
      <div className="flex items-center gap-2">

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:scale-110 transition-all"
          title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
          {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
        </button>

        {/* Search (trainer only — athletes have coach search in their own nav) */}
        {!isAthlete && (
          <Link
            to="/search"
            className="w-9 h-9 rounded-full bg-white dark:bg-white/5 border border-slate-100 dark:border-dark-border flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-primary-blue hover:border-primary-blue transition-all shadow-sm"
            title="Search"
          >
            <Search size={16} />
          </Link>
        )}

        {/* Settings — role-aware */}
        <Link
          to={settingsPath}
          className="w-9 h-9 rounded-full bg-white dark:bg-white/5 border border-slate-100 dark:border-dark-border flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-primary-blue hover:border-primary-blue transition-all shadow-sm"
          title="Settings"
        >
          <Settings size={16} />
        </Link>

        {/* Notifications — role-aware */}
        <Link
          to={notificationsPath}
          className="relative w-9 h-9 rounded-full bg-white dark:bg-white/5 border border-slate-100 dark:border-dark-border flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-primary-blue hover:border-primary-blue transition-all shadow-sm"
          title="Notifications"
        >
          <Bell size={16} />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary-blue text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {notificationCount}
            </span>
          )}
        </Link>

      </div>
    </header>
  );
};

export default DashboardTopbar;
