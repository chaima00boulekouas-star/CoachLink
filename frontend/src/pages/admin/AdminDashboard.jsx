import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserCheck, Users, Flag, Package, Zap, TrendingUp, TrendingDown, Eye, Ban, ChevronRight } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';

// ── Mock Data ─────────────────────────────────────────────────────────────
const STATS = [
  { label: 'Total Trainers',  value: '342',   icon: UserCheck, delta: '+8.5%', up: true,  color: 'from-indigo-500 to-indigo-600' },
  { label: 'Total Athletes',  value: '1,248', icon: Users,     delta: '+13%',  up: true,  color: 'from-purple-500 to-purple-600' },
  { label: 'Total Reports',   value: '12',    icon: Flag,      delta: '-0.5%', up: false, color: 'from-red-500 to-rose-600' },
  { label: 'Total Products',  value: '456',   icon: Package,   delta: '+12%',  up: true,  color: 'from-emerald-500 to-green-600' },
  { label: 'Active Requests', value: '87',    icon: Zap,       delta: '+9%',   up: true,  color: 'from-amber-500 to-orange-500' },
];

const PENDING_REPORTS = [
  { id: 1, reporter: 'John Athlete',  target: 'Mike Trainer',  reason: 'Spam or Misleading Content',  date: '2025-02-24', status: 'pending' },
  { id: 2, reporter: 'Sarah Athlete', target: 'David Trainer', reason: 'Inappropriate Behavior',       date: '2025-02-23', status: 'resolved' },
  { id: 3, reporter: 'Tom Athlete',   target: 'Lisa Trainer',  reason: 'Fake Account',                 date: '2025-02-23', status: 'pending' },
  { id: 4, reporter: 'Anna Wilson',   target: 'Chris Evans',   reason: 'Harassment',                   date: '2025-02-22', status: 'pending' },
];

const RECENT_USERS = [
  { id: 1, name: 'Alex Johnson',  role: 'Athlete', sport: 'Basketball', joined: '2025-02-24', status: 'active',  avatar: 'AJ' },
  { id: 2, name: 'Maria Garcia',  role: 'Trainer', sport: 'Soccer',     joined: '2025-02-24', status: 'active',  avatar: 'MG' },
  { id: 3, name: 'James Williams',role: 'Athlete', sport: 'Tennis',     joined: '2025-02-23', status: 'active',  avatar: 'JW' },
  { id: 4, name: 'Emily Chen',    role: 'Trainer', sport: 'Gym',        joined: '2025-02-22', status: 'banned',  avatar: 'EC' },
  { id: 5, name: 'Kevin Okafor',  role: 'Athlete', sport: 'Football',   joined: '2025-02-21', status: 'active',  avatar: 'KO' },
];

// Simple SVG line-chart for platform activity
const CHART_POINTS = [18,28,35,30,52,45,60,55,72,68,80,88,75,90,96];

const ActivityChart = () => {
  const w = 700; const h = 160; const pad = 20;
  const xs = CHART_POINTS.map((_, i) => pad + (i / (CHART_POINTS.length - 1)) * (w - pad * 2));
  const ys = CHART_POINTS.map(v => h - pad - ((v / 100) * (h - pad * 2)));
  const polyline = xs.map((x, i) => `${x},${ys[i]}`).join(' ');
  const area = `M${xs[0]},${ys[0]} ` + xs.slice(1).map((x, i) => `L${x},${ys[i+1]}`).join(' ') + ` L${xs[xs.length-1]},${h} L${xs[0]},${h} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-40" preserveAspectRatio="none">
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#chartGrad)" />
      <polyline points={polyline} fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {xs.map((x, i) => <circle key={i} cx={x} cy={ys[i]} r="3" fill="#6366f1" />)}
    </svg>
  );
};

const StatusBadge = ({ status }) => {
  const cfg = {
    pending:  'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400',
    resolved: 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400',
    banned:   'bg-red-100   dark:bg-red-900/20   text-red-700   dark:text-red-400',
    active:   'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400',
  };
  return (
    <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${cfg[status] || cfg.pending}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// ── Page ─────────────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const [banned, setBanned] = useState([]);

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Welcome back! Here's what's happening on your platform today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {STATS.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3 shadow-lg`}>
                  <Icon size={18} className="text-white" />
                </div>
                <p className="text-2xl font-black text-slate-900 dark:text-white leading-none mb-1">{s.value}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{s.label}</p>
                <div className={`flex items-center gap-1 text-xs font-bold ${s.up ? 'text-green-600' : 'text-red-500'}`}>
                  {s.up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                  {s.delta} from last week
                </div>
              </div>
            );
          })}
        </div>

        {/* Chart */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <div>
              <h2 className="font-black text-slate-900 dark:text-white text-lg">Platform Activity</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">User growth and engagement over time</p>
            </div>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1.5 rounded-lg">Last 15 days</span>
          </div>
          <div className="mt-4">
            <ActivityChart />
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-slate-400">
            {['1k','5k','10k','15k','20k','25k','30k','35k','40k','45k','50k','55k','60k'].map(l => <span key={l}>{l}</span>)}
          </div>
        </div>

        {/* Bottom grid: Pending Reports + Recent Users */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-6">

          {/* Pending Reports */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-700">
              <div>
                <h2 className="font-black text-slate-900 dark:text-white">Pending Reports</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">12 reports require attention</p>
              </div>
              <Link to="/admin/reports" className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1">
                View All <ChevronRight size={13} />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/30">
                    {['Reporter','Reported User','Reason','Date','Status','Actions'].map(h => (
                      <th key={h} className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PENDING_REPORTS.map(r => (
                    <tr key={r.id} className="border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors">
                      <td className="px-4 py-3 text-sm font-semibold text-slate-800 dark:text-slate-200">{r.reporter}</td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{r.target}</td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{r.reason}</td>
                      <td className="px-4 py-3 text-xs text-slate-400">{r.date}</td>
                      <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                      <td className="px-4 py-3">
                        <Link to="/admin/reports">
                          <button className="text-xs font-bold bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity">Review</button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Users */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-700 flex-wrap gap-2">
              <div>
                <h2 className="font-black text-slate-900 dark:text-white">Recent Users</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Latest registrations and activity</p>
              </div>
              <Link to="/admin/athletes" className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1">
                View All <ChevronRight size={13} />
              </Link>
            </div>
            <div className="divide-y divide-slate-50 dark:divide-slate-700/50">
              {RECENT_USERS.map(u => (
                <div key={u.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors">
                  <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center text-xs font-black flex-shrink-0">
                    {u.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{u.name}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">{u.role} · {u.sport}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <StatusBadge status={u.status} />
                    <div className="flex gap-1">
                      <button className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center hover:bg-indigo-100 dark:hover:bg-indigo-900/20 hover:text-indigo-600 transition-colors">
                        <Eye size={12} />
                      </button>
                      <button
                        onClick={() => setBanned(p => p.includes(u.id) ? p.filter(x => x !== u.id) : [...p, u.id])}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-colors ${
                          banned.includes(u.id)
                            ? 'bg-green-100 dark:bg-green-900/20 text-green-600'
                            : 'bg-red-50 dark:bg-red-900/10 text-red-500 hover:bg-red-100'
                        }`}
                      >
                        <Ban size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
