import React, { useState, useEffect } from 'react';
import { Search, Eye, Ban, CheckCircle, Loader2 } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import { adminService } from '../../api/dataService';
import { toast } from 'react-hot-toast';

const STATUS_CFG = {
  active: 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400',
  banned: 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400',
};

const AdminAthletes = () => {
  const [athletes, setAthletes] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [filter, setFilter]     = useState('all');

  useEffect(() => {
    fetchAthletes();
  }, [filter]);

  const fetchAthletes = async () => {
    setLoading(true);
    try {
      const data = await adminService.getUsers({ role: 'athlete', status: filter });
      setAthletes(data);
    } catch (err) {
      toast.error("Failed to load athletes");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await adminService.updateUserStatus(id, status);
      toast.success(`Athlete marked as ${status}`);
      fetchAthletes();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const filtered = athletes.filter(a => 
    a.name?.toLowerCase().includes(search.toLowerCase()) ||
    a.email?.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = athletes.filter(a => a.status === 'active').length;
  const bannedCount = athletes.filter(a => a.status === 'banned').length;

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Athletes</h1>
          <div className="flex gap-4 mt-1">
            <p className="text-sm font-bold text-green-600">{activeCount} active</p>
            <p className="text-sm font-bold text-red-500">{bannedCount} banned</p>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4">
          <div className="relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name, email or coach..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'active', 'banned'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-3 rounded-2xl text-xs font-bold capitalize transition-all ${filter === f ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700 hover:border-indigo-400'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-700/30 border-b border-slate-100 dark:border-slate-700">
                    {['Athlete','Sport','Joined','Status','Actions'].map(h => (
                      <th key={h} className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider px-6 py-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
                  {filtered.length === 0 ? (
                    <tr><td colSpan={5} className="px-6 py-10 text-center text-slate-400">No athletes found</td></tr>
                  ) : filtered.map(a => (
                    <tr key={a._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center text-xs font-black uppercase">
                            {a.name?.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">{a.name}</p>
                            <p className="text-[10px] text-slate-400">{a.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{a.sport || 'N/A'}</td>
                      <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400">{new Date(a.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg capitalize ${STATUS_CFG[a.status] || STATUS_CFG.active}`}>
                          {a.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateStatus(a._id, 'active')} title="Activate" className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-green-600 hover:bg-green-50 transition-all flex items-center justify-center"><CheckCircle size={14}/></button>
                          <button onClick={() => updateStatus(a._id, 'banned')} title="Ban" className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all flex items-center justify-center"><Ban size={14}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAthletes;
