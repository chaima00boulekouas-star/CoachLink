import React, { useState, useEffect } from 'react';
import { Search, Eye, XCircle, Ban, CheckCircle, Loader2 } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import { adminService } from '../../api/dataService';
import { toast } from 'react-hot-toast';

const STATUS_CFG = {
  active:    { label: 'Active',    className: 'text-green-600 bg-green-50 dark:bg-green-900/20', dot: 'bg-green-500' },
  suspended: { label: 'Suspended', className: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20', dot: 'bg-amber-500' },
  banned:    { label: 'Banned',    className: 'text-red-600 bg-red-50 dark:bg-red-900/20',     dot: 'bg-red-500' },
};

const AdminTrainers = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [filter, setFilter]     = useState('all');

  useEffect(() => {
    fetchTrainers();
  }, [filter]);

  const fetchTrainers = async () => {
    setLoading(true);
    try {
      const data = await adminService.getUsers({ role: 'trainer', status: filter });
      if (Array.isArray(data)) {
        setTrainers(data);
      } else {
        console.error("Unexpected data format for trainers:", data);
        setTrainers([]);
      }
    } catch (err) {
      console.error("Fetch trainers error:", err);
      toast.error("Failed to load trainers");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await adminService.updateUserStatus(id, status);
      toast.success(`Trainer marked as ${status}`);
      fetchTrainers();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const filtered = trainers.filter(t => 
    t.name?.toLowerCase().includes(search.toLowerCase()) ||
    t.specialization?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">Trainers</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">{trainers.length} registered trainers on the platform</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500"/> Active</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500"/> Suspended</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500"/> Banned</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name or sport..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
          <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
            {['all', 'active', 'suspended', 'banned'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-5 py-2 rounded-xl text-xs font-bold capitalize transition-all ${filter === f ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500 hover:text-indigo-600'}`}
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
                    {['Trainer','Sport','Rating','Joined','Status','Actions'].map(h => (
                      <th key={h} className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider px-6 py-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-10 text-center text-slate-400">No trainers found</td>
                    </tr>
                  ) : filtered.map(t => {
                    const cfg = STATUS_CFG[t.status] || STATUS_CFG.active;
                    return (
                      <tr key={t._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center text-xs font-black uppercase">
                              {t.name?.charAt(0)}
                            </div>
                            <span className="text-sm font-bold text-slate-900 dark:text-white">{t.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{t.sport || 'N/A'}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <span className="text-amber-400">★</span>
                            <span className="text-sm font-bold text-slate-900 dark:text-white">{t.rating?.toFixed(1) || '5.0'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400">{new Date(t.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold ${cfg.className}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                            {cfg.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button onClick={() => updateStatus(t._id, 'active')} title="Activate" className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-green-600 hover:bg-green-50 transition-all flex items-center justify-center"><CheckCircle size={14}/></button>
                            <button onClick={() => updateStatus(t._id, 'suspended')} title="Suspend" className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-all flex items-center justify-center"><XCircle size={14}/></button>
                            <button onClick={() => updateStatus(t._id, 'banned')} title="Ban" className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all flex items-center justify-center"><Ban size={14}/></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminTrainers;
