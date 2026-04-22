import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  DollarSign, Package, Calendar, Users, Star,
  Plus, Tv2, Clock, CheckCircle, XCircle, MoreHorizontal
} from 'lucide-react';
import StatCard from '../components/StatCard';
import DashboardLayout from '../components/DashboardLayout';

// Generate initials avatar with consistent color
const Avatar = ({ name, className = '' }) => {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const colors = ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-orange-500', 'bg-pink-500', 'bg-indigo-500'];
  const colorIndex = name.charCodeAt(0) % colors.length;
  return (
    <div className={`${colors[colorIndex]} rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0 ${className}`}>
      {initials}
    </div>
  );
};

// Mock earnings data for the chart
const earningsData = [
  { month: 'Nov', value: 3000 },
  { month: 'Dec', value: 4500 },
  { month: 'Jan', value: 3800 },
  { month: 'Feb', value: 5500 },
  { month: 'Mar', value: 6000 },
  { month: 'Apr', value: 7200 },
];

const maxValue = Math.max(...earningsData.map(d => d.value));

const EarningsChart = () => (
  <div className="relative h-32 flex items-end space-x-1 mt-4">
    {earningsData.map((d, i) => {
      const height = (d.value / maxValue) * 100;
      return (
        <div key={i} className="flex flex-col items-center flex-1">
          <div
            className="w-full rounded-t-lg bg-gradient-to-t from-primary-blue/30 to-primary-blue/5 relative group"
            style={{ height: `${height}%` }}
          >
            <div
              className="absolute bottom-0 left-0 right-0 rounded-t-lg bg-gradient-to-t from-primary-blue to-indigo-400"
              style={{ height: '30%', minHeight: '4px' }}
            />
            {/* Tooltip */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] rounded px-1.5 py-0.5 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10">
              ${d.value.toLocaleString()}
            </div>
          </div>
          <span className="text-[10px] text-slate-400 mt-1">{d.month}</span>
        </div>
      );
    })}
  </div>
);

const recentOrders = [
  { id: 1, trainee: 'Alex Johnson', product: '12-Week Football Program', price: '$299', qty: 1, status: 'Paid', date: 'Apr 7, 2026', initials: 'AJ', color: 'bg-blue-500' },
  { id: 2, trainee: 'Sarah Martinez', product: 'Elite Tactics Masterclass', price: '$149', qty: 1, status: 'Paid', date: 'Apr 6, 2026', initials: 'SM', color: 'bg-pink-500' },
  { id: 3, trainee: 'Mike Brown', product: 'Speed & Agility Accelerator', price: '$189', qty: 2, status: 'Pending', date: 'Apr 5, 2026', initials: 'MB', color: 'bg-green-500' },
  { id: 4, trainee: 'Emma Davis', product: 'Nutrition & Meal Guide', price: '$79', qty: 1, status: 'Paid', date: 'Apr 4, 2026', initials: 'ED', color: 'bg-orange-500' },
  { id: 5, trainee: 'James Wilson', product: 'Mental Performance Bundle', price: '$129', qty: 1, status: 'Cancelled', date: 'Apr 3, 2026', initials: 'JW', color: 'bg-purple-500' },
];

const upcomingSessions = [
  { id: 1, name: 'Alex Johnson', time: 'Today · 09:00 AM', initials: 'AJ', color: 'bg-blue-500' },
  { id: 2, name: 'Sarah Martinez', time: 'Today · 02:00 PM', initials: 'SM', color: 'bg-pink-500' },
  { id: 3, name: 'Mike Brown', time: 'Tomorrow · 10:00 AM', initials: 'MB', color: 'bg-green-500' },
];

const athleteRequests = [
  { id: 1, name: 'Chris Evans', sport: 'Football', level: 'Competitive', goal: 'Skill Improvement', initials: 'CE', color: 'bg-indigo-500' },
  { id: 2, name: 'Lena Gomez', sport: 'Football', level: 'Beginner', goal: 'Fitness', initials: 'LG', color: 'bg-purple-500' },
];

const statusStyles = {
  Paid: 'text-green-600 dark:text-green-400',
  Pending: 'text-amber-600 dark:text-amber-400',
  Cancelled: 'text-red-500 dark:text-red-400',
};

const TrainerDashboard = () => {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-6">
          {/* Main Content */}
          <div className="flex-1 min-w-0 space-y-6">
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-0.5">Welcome back 👋</p>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Ted Lasso</h1>
              </div>
              <div className="text-right">
                <p className="hidden sm:block text-sm text-slate-500 dark:text-slate-400">{today}</p>
                <Link to="/profile/me" className="text-sm font-bold text-primary-blue hover:underline">View Profile →</Link>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
              <StatCard label="Total Earnings" value="$12,450" icon={DollarSign} iconBg="bg-primary-orange" trend={18} trendLabel="+18% this month" />
              <StatCard label="Total Products" value="6" icon={Package} iconBg="bg-primary-blue" trend={2} trendLabel="+2 this week" />
              <StatCard label="Upcoming" value="3 Sessions" icon={Calendar} iconBg="bg-green-500" trend={0} trendLabel="Next: Today 9AM" />
              <StatCard label="Total Trainees" value="0" icon={Users} iconBg="bg-purple-500" trend={3} trendLabel="+3 this month" />
              <StatCard label="Coach Rating" value="4.8" icon={Star} iconBg="bg-amber-400" trend={5} trendLabel="↑ Top 5%" />
            </div>

            {/* Earnings Chart + Quick Actions + Sessions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Earnings Chart */}
              <div className="bg-white dark:bg-dark-card rounded-2xl p-6 border border-slate-100 dark:border-dark-border shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">Earnings Overview</h3>
                    <p className="text-xs text-slate-400">Last 6 months · Total: $30,700</p>
                  </div>
                  <span className="text-xs font-bold text-green-500">+10% vs last period</span>
                </div>
                <EarningsChart />
              </div>

              {/* Quick Actions + Sessions */}
              <div className="space-y-4">
                {/* Quick Actions */}
                <div className="bg-white dark:bg-dark-card rounded-2xl p-5 border border-slate-100 dark:border-dark-border shadow-sm">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-4 text-sm uppercase tracking-wider">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Add Product', icon: Plus, to: '/store/new-product' },
                      { label: 'Create Program', icon: Tv2, to: '/programs/new' },
                      { label: 'View Sessions', icon: Clock, to: '/sessions' },
                      { label: 'Manage Store', icon: Package, to: '/store' },
                    ].map(({ label, icon: Icon, to }) => (
                      <Link
                        key={label}
                        to={to}
                        className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border border-slate-100 dark:border-dark-border hover:border-primary-blue/40 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-all group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center group-hover:bg-primary-blue/10 transition-colors">
                          <Icon size={16} className="text-slate-500 dark:text-slate-400 group-hover:text-primary-blue transition-colors" />
                        </div>
                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 text-center leading-tight">{label}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Upcoming Sessions */}
                <div className="bg-white dark:bg-dark-card rounded-2xl p-5 border border-slate-100 dark:border-dark-border shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider">Upcoming Sessions</h3>
                    <span className="bg-primary-blue text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">3</span>
                  </div>
                  <div className="space-y-3">
                    {upcomingSessions.map(s => (
                      <div key={s.id} className="flex items-center gap-3">
                        <div className={`${s.color} w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                          {s.initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{s.name}</p>
                          <p className="text-xs text-slate-400">{s.time}</p>
                        </div>
                        <span className="text-xs font-semibold bg-indigo-50 dark:bg-indigo-900/20 text-primary-blue px-2 py-0.5 rounded-full">Scheduled</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white dark:bg-dark-card rounded-2xl border border-slate-100 dark:border-dark-border shadow-sm overflow-hidden">
              <div className="flex items-center justify-between p-5 pb-4 border-b border-slate-100 dark:border-dark-border">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">Recent Orders</h3>
                  <p className="text-xs text-slate-400">Last 5 transactions</p>
                </div>
                <Link to="/orders" className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-primary-blue transition-colors">
                  <Calendar size={14} />
                  View All
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-dark-border">
                      {['Trainee', 'Product', 'Price', 'Qty', 'Status', 'Date'].map(h => (
                        <th key={h} className="text-left text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-5 py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-dark-border">
                    {recentOrders.map(order => (
                      <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <div className={`${order.color} w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold`}>{order.initials}</div>
                            <span className="text-sm font-semibold text-slate-900 dark:text-white whitespace-nowrap">{order.trainee}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-sm text-slate-600 dark:text-slate-400 max-w-[180px] truncate">{order.product}</td>
                        <td className="px-5 py-3 text-sm font-bold text-slate-900 dark:text-white">{order.price}</td>
                        <td className="px-5 py-3 text-sm text-slate-600 dark:text-slate-400">{order.qty}</td>
                        <td className={`px-5 py-3 text-sm font-bold ${statusStyles[order.status]}`}>{order.status}</td>
                        <td className="px-5 py-3 text-xs text-slate-400 whitespace-nowrap">{order.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Athlete Requests */}
            <div className="bg-white dark:bg-dark-card rounded-2xl p-5 border border-slate-100 dark:border-dark-border shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">Athlete Requests</h3>
                  <p className="text-xs text-slate-400">Pending approval</p>
                </div>
                <span className="bg-primary-orange/10 text-primary-orange text-xs font-bold px-2 py-0.5 rounded-full">2 new</span>
              </div>
              <div className="space-y-3">
                {athleteRequests.map(req => (
                  <div key={req.id} className="flex flex-wrap items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/5">
                    <div className={`${req.color} w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                      {req.initials}
                    </div>
                    <div className="flex-1 min-w-[120px]">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{req.name}</p>
                      <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                        <span className="text-xs font-semibold bg-primary-orange/10 text-primary-orange px-1.5 py-0.5 rounded">{req.sport}</span>
                        <span className="text-xs text-slate-400 hidden sm:inline">{req.level} · Goal: {req.goal}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-auto">
                      <button className="flex items-center gap-1 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 px-2 py-1 rounded-lg transition-colors">
                        <XCircle size={14} /> <span className="hidden sm:inline">Decline</span>
                      </button>
                      <button className="flex items-center gap-1 text-xs font-bold text-white bg-primary-blue px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity">
                        <CheckCircle size={14} /> <span className="hidden sm:inline">Accept</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar - Profile Card */}
          <div className="hidden xl:block w-64 flex-shrink-0 space-y-4">
            {/* Profile Card */}
            <div className="bg-white dark:bg-dark-card rounded-2xl overflow-hidden border border-slate-100 dark:border-dark-border shadow-sm">
              <div className="h-24 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 relative">
                <img
                  src="https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?auto=format&fit=crop&q=80&w=400"
                  alt="Ted Lasso"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 text-center -mt-8">
                <div className="w-16 h-16 bg-primary-blue rounded-2xl mx-auto mb-3 overflow-hidden border-4 border-white dark:border-dark-card shadow-lg">
                  <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200" alt="Ted Lasso" className="w-full h-full object-cover" />
                </div>
                <h3 className="font-black text-slate-900 dark:text-white text-sm">Ted Lasso</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Head Coach · Football</p>
                <Link to="/profile/me">
                  <button className="w-full bg-primary-orange text-white text-xs font-bold py-2 rounded-xl hover:opacity-90 transition-opacity">
                    View Profile
                  </button>
                </Link>
              </div>
            </div>

            {/* Athletes in Team */}
            <div className="bg-white dark:bg-dark-card rounded-2xl p-4 border border-slate-100 dark:border-dark-border shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Athletes in Team</h4>
                <Link to="/athletes" className="text-xs font-bold text-primary-blue hover:underline">See All</Link>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-dark-border overflow-hidden">
                    <img
                      src={`https://i.pravatar.cc/100?img=${i + 10}`}
                      alt="athlete"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TrainerDashboard;
