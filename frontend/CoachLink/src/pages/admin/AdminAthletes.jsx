import React, { useState } from 'react';
import { Search, Eye, Ban, CheckCircle } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';

const ATHLETES = [
  { id: 1,  name: 'Alex Johnson',   sport: 'Basketball', coach: 'Tashi Duncan',   sessions: 24, joined: '2025-02-24', status: 'active',  avatar: 'AJ' },
  { id: 2,  name: 'James Williams', sport: 'Tennis',     coach: 'Tashi Duncan',   sessions: 12, joined: '2025-02-23', status: 'active',  avatar: 'JW' },
  { id: 3,  name: 'Kevin Okafor',   sport: 'Football',   coach: 'Marcus Johnson', sessions: 8,  joined: '2025-02-21', status: 'active',  avatar: 'KO' },
  { id: 4,  name: 'Sarah Thompson', sport: 'Yoga',       coach: 'Sophie Lee',     sessions: 30, joined: '2025-01-15', status: 'active',  avatar: 'ST' },
  { id: 5,  name: 'Patrick Zweig',  sport: 'Tennis',     coach: 'Tashi Duncan',   sessions: 5,  joined: '2025-03-01', status: 'active',  avatar: 'PZ' },
  { id: 6,  name: 'Lucy Martin',    sport: 'Gym',        coach: 'Rachel Green',   sessions: 16, joined: '2025-01-20', status: 'active',  avatar: 'LM' },
  { id: 7,  name: 'Tom Nguyen',     sport: 'Swimming',   coach: 'David Park',     sessions: 2,  joined: '2025-03-10', status: 'banned',  avatar: 'TN' },
  { id: 8,  name: 'Aisha Patel',    sport: 'Basketball', coach: 'Elena Williams', sessions: 19, joined: '2025-01-08', status: 'active',  avatar: 'AP' },
  { id: 9,  name: 'Chris Reed',     sport: 'Football',   coach: 'James Carter',   sessions: 7,  joined: '2025-02-17', status: 'active',  avatar: 'CR' },
  { id: 10, name: 'Mia Foster',     sport: 'Gym',        coach: 'Rachel Green',   sessions: 11, joined: '2025-02-05', status: 'active',  avatar: 'MF' },
];

const STATUS_CFG = {
  active: 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400',
  banned: 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400',
};

const AdminAthletes = () => {
  const [search, setSearch]     = useState('');
  const [sportF, setSportF]     = useState('All');
  const [athletes, setAthletes] = useState(ATHLETES);
  const [selected, setSelected] = useState(null);

  const sports = ['All', ...Array.from(new Set(ATHLETES.map(a => a.sport))).sort()];

  const filtered = athletes.filter(a => {
    const q = search.toLowerCase();
    const mQ = a.name.toLowerCase().includes(q) || a.sport.toLowerCase().includes(q) || a.coach.toLowerCase().includes(q);
    const mS = sportF === 'All' || a.sport === sportF;
    return mQ && mS;
  });

  const toggle = (id) =>
    setAthletes(prev => prev.map(a => a.id === id ? { ...a, status: a.status === 'active' ? 'banned' : 'active' } : a));

  const activeCount = athletes.filter(a => a.status === 'active').length;
  const bannedCount = athletes.filter(a => a.status === 'banned').length;

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6">

        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Athletes</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            <span className="font-bold text-green-600">{activeCount}</span> active ·{' '}
            <span className="font-bold text-red-500">{bannedCount}</span> banned
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Athletes',    value: athletes.length,  color: 'text-indigo-600' },
            { label: 'Active',            value: activeCount,      color: 'text-green-600' },
            { label: 'Banned / Inactive', value: bannedCount,      color: 'text-red-500' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 shadow-sm text-center">
              <p className={`text-3xl font-black ${color} mb-1`}>{value}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, sport or coach..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {sports.map(s => (
              <button
                key={s}
                onClick={() => setSportF(s)}
                className={`text-xs font-bold px-4 py-2.5 rounded-xl whitespace-nowrap transition-all ${
                  sportF === s
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                    : 'bg-white dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-600 hover:border-indigo-400'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/30">
                  {['Athlete', 'Sport', 'Current Coach', 'Sessions', 'Joined', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider px-5 py-3.5">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(a => (
                  <tr key={a.id} className="border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center text-xs font-black flex-shrink-0">
                          {a.avatar}
                        </div>
                        <span className="font-semibold text-sm text-slate-800 dark:text-white">{a.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-400">{a.sport}</td>
                    <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-400">{a.coach}</td>
                    <td className="px-5 py-4 text-sm font-bold text-slate-800 dark:text-white">{a.sessions}</td>
                    <td className="px-5 py-4 text-xs text-slate-400">{a.joined}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${STATUS_CFG[a.status]}`}>
                        {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setSelected(selected?.id === a.id ? null : a)}
                          className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500 flex items-center justify-center hover:bg-indigo-100 dark:hover:bg-indigo-900/20 hover:text-indigo-600 transition-colors"
                        >
                          <Eye size={13} />
                        </button>
                        <button
                          onClick={() => toggle(a.id)}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                            a.status === 'banned'
                              ? 'bg-green-50 dark:bg-green-900/10 text-green-600 hover:bg-green-100'
                              : 'bg-red-50 dark:bg-red-900/10 text-red-500 hover:bg-red-100'
                          }`}
                        >
                          {a.status === 'banned' ? <CheckCircle size={13} /> : <Ban size={13} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-400"><p className="font-semibold">No athletes match your filter</p></div>
          )}
        </div>

        {/* Detail Panel */}
        {selected && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-indigo-200 dark:border-indigo-800 p-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-slate-900 dark:text-white text-lg">{selected.name} — Profile</h3>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white font-bold text-lg">✕</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Sport',        value: selected.sport },
                { label: 'Coach',        value: selected.coach },
                { label: 'Sessions',     value: selected.sessions },
                { label: 'Member Since', value: selected.joined },
                { label: 'Status',       value: selected.status },
              ].map(({ label, value }) => (
                <div key={label} className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3">
                  <p className="text-xs text-slate-400 mb-1">{label}</p>
                  <p className="font-bold text-slate-900 dark:text-white">{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
};

export default AdminAthletes;
