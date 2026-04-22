import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, User, ShoppingBag, Users, FileText,
  Star, Settings, LogOut, Dumbbell, X, Search, Bell, Calendar
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/store';
import Logo from './Logo';

const trainerNavItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/profile/me', icon: User, label: 'My Profile' },
  { to: '/store', icon: ShoppingBag, label: 'My Store' },
  { to: '/athletes', icon: Users, label: 'Athletes' },
  { to: '/requests', icon: FileText, label: 'Requests' },
  { to: '/favorites', icon: Star, label: 'Favourites' },
];

const athleteNavItems = [
  { to: '/athlete/home',         icon: LayoutDashboard, label: 'Home' },
  { to: '/athlete/dashboard',    icon: Dumbbell,        label: 'Dashboard' },
  { to: '/coaches',              icon: Search,          label: 'Find Trainers' },
  { to: '/athlete/store',        icon: ShoppingBag,     label: 'Store' },
  { to: '/athlete/sessions',     icon: Calendar,        label: 'My Sessions' },
  { to: '/requests',             icon: FileText,        label: 'My Requests' },
  { to: '/athlete/notifications',icon: Bell,            label: 'Notifications' },
  { to: '/athlete/profile',      icon: User,            label: 'My Profile' },
];



/**
 * DashboardSidebar
 * Receives `isOpen` and `onClose` from DashboardLayout.
 * Slides in from the left when `isOpen` is true.
 * A dark backdrop is placed behind it that also closes it on click.
 */
const DashboardSidebar = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const role = useSelector(state => state.auth.role);
  
  const navItems     = role === 'athlete' ? athleteNavItems : trainerNavItems;
  const settingsPath = role === 'athlete' ? '/athlete/settings' : '/settings';
  const bottomNavItems = [{ to: settingsPath, icon: Settings, label: 'Settings' }];

  const handleLogout = () => {
    dispatch(logout());
    onClose();
    navigate('/');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30"
          />

          {/* Sidebar panel */}
          <motion.aside
            key="sidebar"
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-dark-card border-r border-slate-100 dark:border-dark-border flex flex-col z-40 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-5 border-b border-slate-100 dark:border-dark-border">
              <Logo className="h-8" />
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-600 dark:hover:text-white transition-all"
              >
                <X size={18} />
              </button>
            </div>

            {/* Main Nav */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest px-3 mb-3">Menu</p>
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200
                    ${isActive
                      ? 'bg-primary-blue text-white shadow-lg shadow-blue-500/25'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                    }`
                  }
                >
                  {(() => {
                    const Icon = item.icon;
                    return <Icon size={18} />;
                  })()}
                  {item.label}
                </NavLink>
              ))}
            </nav>

            {/* Bottom Nav */}
            <div className="px-3 py-4 border-t border-slate-100 dark:border-dark-border space-y-1">
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest px-3 mb-3">Account</p>
              {bottomNavItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200
                    ${isActive
                      ? 'bg-primary-blue text-white shadow-lg shadow-blue-500/25'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
                    }`
                  }
                >
                  {(() => {
                    const Icon = item.icon;
                    return <Icon size={18} />;
                  })()}
                  {item.label}
                </NavLink>
              ))}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default DashboardSidebar;
