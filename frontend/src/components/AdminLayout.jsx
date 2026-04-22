import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, UserCheck, Flag, MessageSquare,
  Package, LogOut, HelpCircle, Shield, Menu, X,
  Moon, Sun, Bell, ChevronRight, ChevronLeft,
  CheckCircle, Info, AlertTriangle, Trash2
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/store';
import { useTheme } from '../context/ThemeContext';
import logoImg from '../assets/logo.png';

// ── Admin Notifications (mock) ────────────────────────────────────────────
const ADMIN_NOTIFS = [
  { id: 1, type: 'report',   title: 'New Report Filed',      body: 'Tom Athlete reported Lisa Trainer for a fake account.',       time: '2 min ago', read: false },
  { id: 2, type: 'user',     title: 'New User Registered',   body: 'Patrick Zweig signed up as an athlete.',                     time: '14 min ago', read: false },
  { id: 3, type: 'feedback', title: 'Feedback Received',     body: 'Sophie Lee left a feature suggestion for scheduling.',        time: '1 hr ago',  read: false },
  { id: 4, type: 'report',   title: 'Report Resolved',       body: 'The report against David Trainer was marked resolved.',       time: '3 hrs ago', read: true },
  { id: 5, type: 'product',  title: 'Product Suspended',     body: 'Swimming Speed Drills was suspended pending review.',         time: '1 day ago', read: true },
];

const NOTIF_ICON = {
  report:   { icon: Flag,          color: 'bg-red-100 dark:bg-red-900/20 text-red-500' },
  user:     { icon: Users,         color: 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-500' },
  feedback: { icon: MessageSquare, color: 'bg-purple-100 dark:bg-purple-900/20 text-purple-500' },
  product:  { icon: Package,       color: 'bg-amber-100 dark:bg-amber-900/20 text-amber-500' },
};

const NotificationsDropdown = ({ onClose }) => {
  const [items, setItems] = useState(ADMIN_NOTIFS);
  const ref = useRef(null);

  // close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const markAllRead = () => setItems(p => p.map(n => ({ ...n, read: true })));
  const remove      = (id) => setItems(p => p.filter(n => n.id !== id));
  const markRead    = (id) => setItems(p => p.map(n => n.id === id ? { ...n, read: true } : n));

  const unread = items.filter(n => !n.read).length;

  return (
    <div
      ref={ref}
      className="absolute right-0 top-12 w-80 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-2xl z-50 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-700">
        <div>
          <h3 className="font-black text-slate-900 dark:text-white text-sm">Notifications</h3>
          {unread > 0 && <p className="text-[10px] text-indigo-600 font-bold">{unread} unread</p>}
        </div>
        <div className="flex items-center gap-2">
          {unread > 0 && (
            <button onClick={markAllRead} className="text-[10px] font-bold text-indigo-600 hover:underline">
              Mark all read
            </button>
          )}
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 dark:hover:text-white">
            <X size={15} />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="max-h-72 overflow-y-auto divide-y divide-slate-50 dark:divide-slate-700/50">
        {items.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-sm">No notifications</div>
        ) : items.map(n => {
          const cfg  = NOTIF_ICON[n.type] || NOTIF_ICON.feedback;
          const Icon = cfg.icon;
          return (
            <div
              key={n.id}
              className={`flex items-start gap-3 px-4 py-3 group transition-colors cursor-pointer ${
                n.read ? '' : 'bg-indigo-50/60 dark:bg-indigo-900/10'
              }`}
              onClick={() => markRead(n.id)}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.color}`}>
                <Icon size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-bold leading-snug ${n.read ? 'text-slate-600 dark:text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                  {n.title}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">{n.body}</p>
                <p className="text-[9px] text-slate-300 dark:text-slate-600 mt-1">{n.time}</p>
              </div>
              <button
                onClick={e => { e.stopPropagation(); remove(n.id); }}
                className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-400 transition-all flex-shrink-0 mt-0.5"
              >
                <Trash2 size={12} />
              </button>
              {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 flex-shrink-0 mt-1.5" />}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-4 py-2.5 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/30">
        <p className="text-[10px] text-slate-400 text-center font-semibold">Admin notifications · CoachLink</p>
      </div>
    </div>
  );
};

// ── Help Center Drawer ────────────────────────────────────────────────────
const HELP_ARTICLES = [
  { icon: Info,          title: 'How to ban a user',        body: 'Navigate to Trainers or Athletes, find the user, and click the Ban (🚫) icon. Banned users lose platform access immediately.' },
  { icon: Flag,          title: 'Handling reports',         body: 'Go to Reports, expand a report to view details, then click Resolve or Dismiss. You may also ban the reported user directly.' },
  { icon: MessageSquare, title: 'Responding to feedback',   body: 'Open Feedback, click Reply on any card, type your message and click Send Reply. The feedback status will update to Resolved.' },
  { icon: Package,       title: 'Suspending a product',     body: 'Open Products, click the Suspend icon (⊘) or use the detail panel. Suspended products are hidden from the athlete store.' },
  { icon: AlertTriangle, title: 'Escalation procedure',     body: 'For critical reports involving safety, document the case, resolve in-system, and escalate to legal@coachlink.com.' },
  { icon: CheckCircle,   title: 'Restoring a user account', body: 'Find the banned user in Trainers or Athletes and click the Restore (✓) button. They will regain full platform access.' },
];

const HelpDrawer = ({ onClose }) => (
  <div className="fixed inset-0 z-50 flex">
    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
    <div className="relative ml-auto w-full max-w-md bg-white dark:bg-slate-800 h-full flex flex-col shadow-2xl">
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-xl flex items-center justify-center">
            <HelpCircle size={16} />
          </div>
          <h2 className="font-black text-slate-900 dark:text-white">Help Center</h2>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors">
          <X size={20} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <p className="text-sm text-slate-500 dark:text-slate-400">Common admin tasks and guides:</p>
        {HELP_ARTICLES.map(({ icon: Icon, title, body }) => (
          <div key={title} className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <Icon size={15} className="text-indigo-600 flex-shrink-0" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">{title}</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{body}</p>
          </div>
        ))}
      </div>
      <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-700">
        <p className="text-xs text-slate-400 text-center">Need more help? <a href="mailto:admin@coachlink.com" className="text-indigo-600 font-bold hover:underline">admin@coachlink.com</a></p>
      </div>
    </div>
  </div>
);

// ── Nav Items ─────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard Overview' },
  { to: '/admin/trainers',  icon: UserCheck,       label: 'Trainers' },
  { to: '/admin/athletes',  icon: Users,           label: 'Athletes' },
  { to: '/admin/reports',   icon: Flag,            label: 'Reports' },
  { to: '/admin/feedback',  icon: MessageSquare,   label: 'Feedback' },
  { to: '/admin/products',  icon: Package,         label: 'Products' },
];

// ── Sidebar ───────────────────────────────────────────────────────────────
const Sidebar = ({ mobileOpen, onMobileClose, desktopOpen }) => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const [showHelp, setShowHelp] = useState(false);

  const handleLogout = () => { dispatch(logout()); navigate('/'); };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 lg:hidden"
          onClick={onMobileClose}
        />
      )}
      {showHelp && <HelpDrawer onClose={() => setShowHelp(false)} />}

      {/* Panel */}
      <aside className={`
        h-screen flex-shrink-0 flex flex-col transition-all duration-300
        bg-white dark:bg-slate-800 border-r border-slate-100 dark:border-slate-700
        fixed top-0 left-0 z-40 shadow-xl
        ${mobileOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64'}
        lg:relative lg:z-auto lg:shadow-none lg:translate-x-0
        ${desktopOpen ? 'lg:w-64' : 'lg:w-0 lg:overflow-hidden lg:border-r-0'}
      `}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-700">
          <img
            src={logoImg}
            alt="CoachLink"
            className="h-9 w-auto object-contain"
          />
          <button
            onClick={onMobileClose}
            className="lg:hidden w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-600 dark:hover:text-white transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Main Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-3 mb-3">Main Menu</p>
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onMobileClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4 border-t border-slate-100 dark:border-slate-700 space-y-1">
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-3 mb-3">Account</p>
          <button
            onClick={() => setShowHelp(true)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-all"
          >
            <HelpCircle size={18} />
            Help Center
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
          >
            <LogOut size={18} />
            Log Out
          </button>
        </div>
      </aside>
    </>
  );
};

// ── Topbar ────────────────────────────────────────────────────────────────
const AdminTopbar = ({ onMobileMenu, onToggleSidebar }) => {
  const { theme, toggleTheme } = useTheme();
  const [showNotifs, setShowNotifs] = useState(false);

  const unread = ADMIN_NOTIFS.filter(n => !n.read).length;

  return (
    <header className="h-[60px] bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-white/5 flex items-center px-4 gap-3 flex-shrink-0 shadow-sm sticky top-0 z-20">

      {/* Mobile hamburger */}
      <button
        onClick={onMobileMenu}
        className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
      >
        <Menu size={20} />
      </button>

      {/* Desktop sidebar toggle */}
      <button
        onClick={onToggleSidebar}
        className="hidden lg:flex w-9 h-9 rounded-xl items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
        title="Toggle sidebar"
      >
        <Menu size={20} />
      </button>

      {/* Search */}
      <div className="mr-auto hidden sm:block">
        <div className="relative">
          <input
            type="text"
            placeholder="Search users, products, reports..."
            className="w-64 pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-slate-300 focus:outline-none focus:border-indigo-400 transition-colors"
          />
          <svg className="absolute left-3 top-2.5 text-slate-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">

        {/* Theme */}
        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:scale-110 transition-all"
          title="Toggle theme"
        >
          {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifs(p => !p)}
            className="relative w-9 h-9 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <Bell size={16} />
            {unread > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                {unread}
              </span>
            )}
          </button>
          {showNotifs && <NotificationsDropdown onClose={() => setShowNotifs(false)} />}
        </div>

        {/* Admin identity */}
        <div className="flex items-center gap-2 pl-3 border-l border-slate-100 dark:border-white/10">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
            <Shield size={14} className="text-white" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-bold text-slate-800 dark:text-white leading-none">Admin User</p>
            <p className="text-[10px] text-slate-400">admin@coachlink.com</p>
          </div>
        </div>
      </div>
    </header>
  );
};

// ── Main Layout ───────────────────────────────────────────────────────────
const AdminLayout = ({ children }) => {
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 flex">
      <Sidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        desktopOpen={sidebarOpen}
      />
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <AdminTopbar
          onMobileMenu={() => setMobileOpen(true)}
          onToggleSidebar={() => setSidebarOpen(p => !p)}
        />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
