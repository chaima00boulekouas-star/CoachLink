import React, { useState } from 'react';
import { Package, Search, Eye, Trash2, CheckCircle, XCircle, TrendingUp, Star } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';

const PRODUCTS = [
  { id: 1, title: '12-Week Tennis Mastery Guide',        trainer: 'Tashi Duncan',   sport: 'Tennis',     price: 49,  sales: 128, rating: 4.8, status: 'active',   date: '2024-12-01' },
  { id: 2, title: 'Football Conditioning Program',       trainer: 'Marcus Johnson', sport: 'Football',   price: 79,  sales: 87,  rating: 4.7, status: 'active',   date: '2025-01-10' },
  { id: 3, title: 'Basketball Fundamentals Course',      trainer: 'Elena Williams', sport: 'Basketball', price: 59,  sales: 54,  rating: 4.6, status: 'active',   date: '2025-01-20' },
  { id: 4, title: 'Advanced Serve & Volley Tactics',     trainer: 'Tashi Duncan',   sport: 'Tennis',     price: 39,  sales: 210, rating: 4.9, status: 'active',   date: '2024-11-15' },
  { id: 5, title: 'Strength & Conditioning Bundle',      trainer: 'James Carter',   sport: 'Gym',        price: 99,  sales: 32,  rating: 4.5, status: 'active',   date: '2025-02-01' },
  { id: 6, title: 'Defensive Positioning Masterclass',   trainer: 'Marcus Johnson', sport: 'Football',   price: 49,  sales: 61,  rating: 4.4, status: 'active',   date: '2025-01-05' },
  { id: 7, title: 'Yoga Flow for Athletes',              trainer: 'Sophie Lee',     sport: 'Yoga',       price: 29,  sales: 175, rating: 4.9, status: 'active',   date: '2024-10-20' },
  { id: 8, title: 'Swimming Speed Drills',               trainer: 'David Park',     sport: 'Swimming',   price: 35,  sales: 8,   rating: 2.1, status: 'suspended',date: '2025-03-01' },
];

const STATUS_CFG = {
  active:    'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400',
  suspended: 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400',
};

const SPORTS = ['All', ...Array.from(new Set(PRODUCTS.map(p => p.sport))).sort()];

const AdminProducts = () => {
  const [products, setProducts] = useState(PRODUCTS);
  const [search, setSearch]     = useState('');
  const [sportF, setSportF]     = useState('All');
  const [selected, setSelected] = useState(null);

  const filtered = products.filter(p => {
    const q = search.toLowerCase();
    const mQ = p.title.toLowerCase().includes(q) || p.trainer.toLowerCase().includes(q);
    const mS = sportF === 'All' || p.sport === sportF;
    return mQ && mS;
  });

  const toggle = (id) =>
    setProducts(prev => prev.map(p => p.id === id ? { ...p, status: p.status === 'active' ? 'suspended' : 'active' } : p));
  const remove = (id) => { setProducts(prev => prev.filter(p => p.id !== id)); setSelected(null); };

  const totalRevenue = products.reduce((s, p) => s + p.price * p.sales, 0).toLocaleString();
  const totalSales   = products.reduce((s, p) => s + p.sales, 0);

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6">

        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Products</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Admin control panel for all coach products</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Products', value: products.length,          icon: Package,    color: 'text-indigo-600', bg: 'bg-indigo-100 dark:bg-indigo-900/20' },
            { label: 'Total Sales',    value: totalSales,               icon: TrendingUp, color: 'text-green-600',  bg: 'bg-green-100 dark:bg-green-900/20' },
            { label: 'Platform Revenue', value: `$${totalRevenue}`,     icon: TrendingUp, color: 'text-emerald-600',bg: 'bg-emerald-100 dark:bg-emerald-900/20' },
            { label: 'Avg Rating',     value: '4.6',                    icon: Star,       color: 'text-amber-500',  bg: 'bg-amber-100 dark:bg-amber-900/20' },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm">
              <div className={`w-10 h-10 rounded-xl ${bg} ${color} flex items-center justify-center mb-3`}>
                <Icon size={18} />
              </div>
              <p className={`text-2xl font-black ${color} mb-1`}>{value}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search products or trainers..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {SPORTS.map(s => (
              <button key={s} onClick={() => setSportF(s)} className={`text-xs font-bold px-4 py-2.5 rounded-xl whitespace-nowrap transition-all ${sportF === s ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'bg-white dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-600 hover:border-indigo-400'}`}>{s}</button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/30">
                  {['Product', 'Trainer', 'Sport', 'Price', 'Sales', 'Rating', 'Added', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider px-5 py-3.5">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id} className="border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors">
                    <td className="px-5 py-4">
                      <span className="font-semibold text-sm text-slate-800 dark:text-white leading-snug">{p.title}</span>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">{p.trainer}</td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-bold text-orange-500 bg-orange-50 dark:bg-orange-900/20 px-2.5 py-1 rounded-full">{p.sport}</span>
                    </td>
                    <td className="px-5 py-4 text-sm font-bold text-slate-800 dark:text-white">${p.price}</td>
                    <td className="px-5 py-4 text-sm font-bold text-green-600">{p.sales}</td>
                    <td className="px-5 py-4">
                      <span className="flex items-center gap-1 text-sm font-bold text-amber-500">
                        <Star size={12} className="fill-amber-400" /> {p.rating}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-400">{p.date}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${STATUS_CFG[p.status]}`}>
                        {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setSelected(selected?.id === p.id ? null : p)} className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500 flex items-center justify-center hover:bg-indigo-100 dark:hover:bg-indigo-900/20 hover:text-indigo-600 transition-colors">
                          <Eye size={13} />
                        </button>
                        <button onClick={() => toggle(p.id)} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${p.status === 'active' ? 'bg-amber-50 dark:bg-amber-900/10 text-amber-600 hover:bg-amber-100' : 'bg-green-50 dark:bg-green-900/10 text-green-600 hover:bg-green-100'}`}>
                          {p.status === 'active' ? <XCircle size={13} /> : <CheckCircle size={13} />}
                        </button>
                        <button onClick={() => remove(p.id)} className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/10 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors">
                          <Trash2 size={13} />
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
              <Package size={32} className="mx-auto mb-3 opacity-30" />
              <p className="font-semibold">No products match your filter</p>
            </div>
          )}
        </div>

        {/* Detail Panel */}
        {selected && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-indigo-200 dark:border-indigo-800 p-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-slate-900 dark:text-white">{selected.title}</h3>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white font-bold text-lg">✕</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
              {[
                { label: 'Trainer',  value: selected.trainer },
                { label: 'Sport',    value: selected.sport },
                { label: 'Price',    value: `$${selected.price}` },
                { label: 'Sales',    value: selected.sales },
                { label: 'Revenue',  value: `$${(selected.price * selected.sales).toLocaleString()}` },
                { label: 'Rating',   value: selected.rating },
                { label: 'Added',    value: selected.date },
                { label: 'Status',   value: selected.status },
              ].map(({ label, value }) => (
                <div key={label} className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3">
                  <p className="text-xs text-slate-400 mb-1">{label}</p>
                  <p className="font-bold text-slate-900 dark:text-white">{value}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => toggle(selected.id)} className={`text-xs font-bold px-4 py-2 rounded-xl transition-opacity ${selected.status === 'active' ? 'bg-amber-500 text-white' : 'bg-green-600 text-white'} hover:opacity-90`}>
                {selected.status === 'active' ? 'Suspend Product' : 'Restore Product'}
              </button>
              <button onClick={() => remove(selected.id)} className="text-xs font-bold px-4 py-2 rounded-xl bg-red-100 dark:bg-red-900/20 text-red-600 hover:bg-red-200 transition-colors">
                Delete Product
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminProducts;
