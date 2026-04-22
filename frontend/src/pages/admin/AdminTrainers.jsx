import React, { useState } from 'react';
import { Search, Eye, Ban, CheckCircle, XCircle, Star } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';

const TRAINERS = [
  { id: 1,  name: 'Tashi Duncan',    sport: 'Tennis',      athletes: 12, rating: 4.9, revenue: '$2,340', joined: '2024-01-10', status: 'active',    avatar: 'TD' },
  { id: 2,  name: 'Marcus Johnson',  sport: 'Football',    athletes: 9,  rating: 4.8, revenue: '$1,870', joined: '2024-02-14', status: 'active',    avatar: 'MJ' },
  { id: 3,  name: 'Elena Williams',  sport: 'Basketball',  athletes: 7,  rating: 4.7, revenue: '$1,540', joined: '2024-02-28', status: 'active',    avatar: 'EW' },
  { id: 4,  name: 'James Carter',    sport: 'Fitness',     athletes: 5,  rating: 4.6, revenue: '$980',   joined: '2024-03-15', status: 'active',    avatar: 'JC' },
  { id: 5,  name: 'Sophie Lee',      sport: 'Yoga',        athletes: 18, rating: 4.9, revenue: '$3,100', joined: '2024-01-05', status: 'active',    avatar: 'SL' },
  { id: 6,  name: 'David Park',      sport: 'Swimming',    athletes: 3,  rating: 3.8, revenue: '$480',   joined: '2024-04-01', status: 'suspended', avatar: 'DP' },
  { id: 7,  name: 'Mike Torres',     sport: 'Football',    athletes: 0,  rating: 2.1, revenue: '$0',     joined: '2024-03-20', status: 'banned',    avatar: 'MT' },
  { id: 8,  name: 'Rachel Green',    sport: 'Gym',         athletes: 6,  rating: 4.5, revenue: '$1,200', joined: '2024-02-10', status: 'active',    avatar: 'RG' },
];

const STATUS_CFG = {
  active:    'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400',
  suspended: 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400',
  banned:    'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400',
};

const AdminTrainers = () => {
  const [search, setSearch]     = useState('');
  const [statusF, setStatusF]   = useState('All');
  const [trainers, setTrainers] = useState(TRAINERS);
  const [selected, setSelected] = useState(null);

  const filters = ['All', 'Active', 'Suspended', 'Banned'];

  const filtered = trainers.filter(t => {
    const q = search.toLowerCase();
    const matchQ = t.name.toLowerCase().includes(q) || t.sport.toLowerCase().includes(q);
    const matchS = statusF === 'All' || t.status === statusF.toLowerCase();
    return matchQ && matchS;
  });

  const setStatus = (id, status) =>
    setTrainers(prev => prev.map(t => t.id === id ? { ...t, status } : t));

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6">

        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">Trainers</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">{trainers.length} registered trainers on the platform</p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="w-3 h-3 rounded-full bg-green-500 inline-block" /> Active
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block ml-3" /> Suspended
            <span className="w-3 h-3 rounded-full bg-red-500 inline-block ml-3" /> Banned
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or sport..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
          <div className="flex gap-2">
            {filters.map(f => (
              <button
                key={f}
                onClick={() => setStatusF(f)}
                className={`text-xs font-bold px-4 py-2.5 rounded-xl whitespace-nowrap transition-all ${
                  statusF === f
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                    : 'bg-white dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-600 hover:border-indigo-400'
                }`}
              >
                {f}
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
                  {['Trainer','Sport','Athletes','Rating','Revenue','Joined','Status','Actions'].map(h => (
                    <th key={h} className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider px-5 py-3.5">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(t => (
                  <tr key={t.id} className="border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center text-xs font-black flex-shrink-0">
                          {t.avatar}
                        </div>
                        <span className="font-semibold text-sm text-slate-800 dark:text-white">{t.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-400">{t.sport}</td>
                    <td className="px-5 py-4 text-sm font-bold text-slate-800 dark:text-white">{t.athletes}</td>
                    <td className="px-5 py-4">
                      <span className="flex items-center gap-1 text-sm font-bold text-amber-500">
                        <Star size={12} className="fill-amber-400" /> {t.rating}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm font-bold text-green-600">{t.revenue}</td>
                    <td className="px-5 py-4 text-xs text-slate-400">{t.joined}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${STATUS_CFG[t.status]}`}>
                        {t.status.charAt(0).toUpperCase() + t.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setSelected(selected?.id === t.id ? null : t)}
                          className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center hover:bg-indigo-100 dark:hover:bg-indigo-900/20 hover:text-indigo-600 transition-colors"
                          title="View"
                        >
                          <Eye size={14} />
                        </button>
                        {t.status !== 'active' ? (
                          <button
                            onClick={() => setStatus(t.id, 'active')}
                            className="w-8 h-8 rounded-lg bg-green-50 dark:bg-green-900/10 text-green-600 flex items-center justify-center hover:bg-green-100 transition-colors"
                            title="Restore"
                          >
                            <CheckCircle size={14} />
                          </button>
                        ) : (
                          <button
                            onClick={() => setStatus(t.id, 'suspended')}
                            className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/10 text-amber-600 flex items-center justify-center hover:bg-amber-100 transition-colors"
                            title="Suspend"
                          >
                            <XCircle size={14} />
                          </button>
                        )}
                        <button
                          onClick={() => setStatus(t.id, 'banned')}
                          className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/10 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors"
                          title="Ban"
                        >
                          <Ban size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-400 dark:text-slate-500">
              <p className="font-semibold">No trainers match your filter</p>
            </div>
          )}
        </div>

        {/* Detail Panel */}
        {selected && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-indigo-200 dark:border-indigo-800 p-6 shadow-md">
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-black text-slate-900 dark:text-white text-lg">{selected.name} — Details</h3>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors text-lg font-bold">✕</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              {[
                { label: 'Sport',    value: selected.sport },
                { label: 'Athletes', value: selected.athletes },
                { label: 'Rating',   value: selected.rating },
                { label: 'Revenue',  value: selected.revenue },
                { label: 'Joined',   value: selected.joined },
                { label: 'Status',   value: selected.status },
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

export default AdminTrainers;
