import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  DollarSign, Package, Calendar, Users, Star,
  Plus, Tv2, Clock, CheckCircle, XCircle, MoreHorizontal
} from 'lucide-react';
import StatCard from '../components/StatCard';
import DashboardLayout from '../components/DashboardLayout';
import { useSelector, useDispatch } from 'react-redux';
import { trainerService, requestService } from '../api/dataService';
import authService from '../api/authService';
import { updateUser } from '../redux/store';
import { getImageUrl } from '../utils/imageUrl';
import { toast } from 'react-hot-toast';

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

const EarningsChart = ({ data }) => {
  const maxVal = data.length > 0 ? Math.max(...data.map(d => d.value)) : 1;
  if (data.length === 0) {
    return <p className="text-sm text-slate-400 text-center py-8">No earnings data yet</p>;
  }
  return (
    <div className="relative h-32 flex items-end space-x-1 mt-4">
      {data.map((d, i) => {
        const height = (d.value / maxVal) * 100;
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
};

const statusStyles = {
  Paid: 'text-green-600 dark:text-green-400',
  Pending: 'text-amber-600 dark:text-amber-400',
  Cancelled: 'text-red-500 dark:text-red-400',
};

const TrainerDashboard = () => {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  const user = useSelector(state => state.auth.user);
  const userName = user?.name || 'Coach';

  const [stats, setStats] = useState({ totalEarnings: 0, totalProducts: 0, upcomingSessions: 0, totalAthletes: 0, ratingAvg: 0 });
  const [earningsData, setEarningsData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [athleteRequests, setAthleteRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await trainerService.getDashboardStats();
        setStats(data.stats || stats);
        setEarningsData(data.earnings || []);
        setRecentOrders(data.recentOrders || []);
        setUpcomingSessions(data.upcomingSessions || []);
        setAthleteRequests(data.athleteRequests || []);

        // Refresh user data to ensure verification/subscription status is current
        const freshUser = await authService.getMe();
        if (freshUser) {
          dispatch(updateUser(freshUser));
        }
      } catch (err) {
        console.error('Failed to fetch dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [dispatch]);

  const handleAccept = async (requestId) => {
    try {
      await requestService.accept(requestId);
      toast.success('Request accepted!');
      setAthleteRequests(prev => prev.filter(r => r.id !== requestId));
      // Refresh stats if needed
      const data = await trainerService.getDashboardStats();
      setStats(data.stats || stats);
    } catch (err) {
      toast.error('Failed to accept request');
    }
  };

  const handleDecline = async (requestId) => {
    try {
      await requestService.decline(requestId);
      toast.success('Request declined');
      setAthleteRequests(prev => prev.filter(r => r.id !== requestId));
    } catch (err) {
      toast.error('Failed to decline request');
    }
  };

  const maxValue = earningsData.length > 0 ? Math.max(...earningsData.map(d => d.value)) : 1;

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
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  {userName}
                  {user?.isTrainerVerified && (
                    <span title="Verified Professional" className="bg-primary-blue/10 p-1 rounded-full">
                      <CheckCircle size={20} className="text-primary-blue fill-primary-blue/20" />
                    </span>
                  )}
                </h1>
                <div className="mt-2 flex items-center gap-2">
                  {user?.isSubscribed ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-[10px] font-black text-indigo-600 uppercase tracking-wider">
                      Premium Plan
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                      Free Plan
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="hidden sm:block text-sm text-slate-500 dark:text-slate-400">{today}</p>
                <Link to="/profile/me" className="text-sm font-bold text-primary-blue hover:underline">View Profile →</Link>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
              <StatCard label="Total Earnings" value={`$${stats.totalEarnings?.toLocaleString() || '0'}`} icon={DollarSign} iconBg="bg-primary-orange" />
              <StatCard label="Total Products" value={String(stats.totalProducts || 0)} icon={Package} iconBg="bg-primary-blue" />
              <StatCard label="Upcoming" value={`${stats.upcomingSessions || 0} Sessions`} icon={Calendar} iconBg="bg-green-500" />
              <StatCard label="Total Athletes" value={String(stats.totalAthletes || 0)} icon={Users} iconBg="bg-purple-500" />
              <StatCard label="Trainer Rating" value={String(stats.ratingAvg || '0.0')} icon={Star} iconBg="bg-amber-400" />
            </div>

            {/* Earnings Chart + Quick Actions + Sessions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Earnings Chart */}
              <div className="bg-white dark:bg-dark-card rounded-2xl p-6 border border-slate-100 dark:border-dark-border shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">Earnings Overview</h3>
                    <p className="text-xs text-slate-400">Last 6 months</p>
                  </div>
                  <span className="text-xs font-bold text-green-500">Overview</span>
                </div>
                <EarningsChart data={earningsData} />
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
                    {upcomingSessions.length > 0 && (
                      <span className="bg-primary-blue text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{upcomingSessions.length}</span>
                    )}
                  </div>
                  <div className="space-y-3">
                    {upcomingSessions.length === 0 ? (
                      <p className="text-sm text-slate-400 text-center py-4">No upcoming sessions</p>
                    ) : (
                      upcomingSessions.map(s => {
                        const athleteName = s.athlete?.name || 'Athlete';
                        const initials = athleteName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
                        const sessionDate = s.date ? new Date(s.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'TBD';
                        const colors = ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-orange-500', 'bg-pink-500'];
                        const color = colors[athleteName.charCodeAt(0) % colors.length];
                        return (
                          <div key={s._id} className="flex items-center gap-3">
                            {s.athlete?.avatar ? (
                              <img src={getImageUrl(s.athlete.avatar)} alt={athleteName} className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                            ) : (
                              <div className={`${color} w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                                {initials}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{athleteName}</p>
                              <p className="text-xs text-slate-400">{sessionDate}</p>
                            </div>
                            <span className="text-xs font-semibold bg-indigo-50 dark:bg-indigo-900/20 text-primary-blue px-2 py-0.5 rounded-full capitalize">{s.status}</span>
                          </div>
                        );
                      })
                    )}
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
                      {['Athlete', 'Product', 'Price', 'Qty', 'Status', 'Date'].map(h => (
                        <th key={h} className="text-left text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-5 py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-dark-border">
                    {recentOrders.map(order => (
                      <tr key={order._id || order.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <Avatar name={order.user?.name || order.trainee || "User"} className="w-7 h-7" />
                            <span className="text-sm font-semibold text-slate-900 dark:text-white whitespace-nowrap">{order.user?.name || order.trainee}</span>
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
                <div className="flex items-center gap-3">
                  <Link to="/requests" className="text-xs font-bold text-primary-blue hover:underline">View All</Link>
                  {athleteRequests.length > 0 && (
                    <span className="bg-primary-orange/10 text-primary-orange text-xs font-bold px-2 py-0.5 rounded-full">
                      {athleteRequests.length} new
                    </span>
                  )}
                </div>
              </div>
              <div className="space-y-3">
                {athleteRequests.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-4">No pending requests</p>
                ) : (
                  athleteRequests.map(req => (
                    <div key={req.id} className="flex flex-wrap items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/5">
                      {req.avatar ? (
                        <img src={getImageUrl(req.avatar)} alt={req.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                      ) : (
                        <div className={`${req.color} w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                          {req.initials}
                        </div>
                      )}
                      <div className="flex-1 min-w-[120px]">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{req.name}</p>
                        <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                          <span className="text-xs font-semibold bg-primary-orange/10 text-primary-orange px-1.5 py-0.5 rounded">{req.sport}</span>
                          <span className="text-xs text-slate-400 hidden sm:inline">{req.level} · Goal: {req.goal}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-auto">
                        <button 
                          onClick={() => handleDecline(req.id)}
                          className="flex items-center gap-1 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 px-2 py-1 rounded-lg transition-colors"
                        >
                          <XCircle size={14} /> <span className="hidden sm:inline">Decline</span>
                        </button>
                        <button 
                          onClick={() => handleAccept(req.id)}
                          className="flex items-center gap-1 text-xs font-bold text-white bg-primary-blue px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity"
                        >
                          <CheckCircle size={14} /> <span className="hidden sm:inline">Accept</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar - Profile Card */}
          <div className="hidden xl:block w-72 flex-shrink-0 space-y-6">
            {/* Profile Card */}
            <div className="bg-white dark:bg-dark-card rounded-3xl overflow-hidden border border-slate-100 dark:border-dark-border shadow-sm">
              <div 
                className="h-28 bg-slate-200 dark:bg-slate-700 bg-cover bg-center"
                style={{ backgroundImage: `url('${user?.coverImage ? getImageUrl(user.coverImage) : 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1000'}')` }}
              />
              <div className="p-6 text-center -mt-12">
                <div className="relative inline-block mb-3">
                  {user?.avatar ? (
                    <img 
                      src={getImageUrl(user.avatar)} 
                      alt={userName} 
                      className="w-20 h-20 rounded-full object-cover border-4 border-white dark:border-dark-card shadow-xl bg-white" 
                    />
                  ) : (
                    <Avatar name={userName} className="w-20 h-20 text-3xl border-4 border-white dark:border-dark-card shadow-xl" />
                  )}
                  <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-dark-card rounded-full shadow-sm" />
                </div>
                <h3 className="font-black text-slate-900 dark:text-white text-base mb-0.5 flex items-center justify-center gap-1.5">
                  {userName}
                  {user?.isTrainerVerified && <CheckCircle size={14} className="text-primary-blue fill-primary-blue/20" />}
                </h3>
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">Professional Trainer</p>
                <Link to="/profile/me">
                  <button className="w-full bg-primary-orange text-white text-sm font-bold py-3 rounded-2xl shadow-lg shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
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
