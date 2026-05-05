import React, { useState, useEffect } from 'react';
import { Search, Flag, Trash2, CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import { adminService } from '../../api/dataService';
import { toast } from 'react-hot-toast';

const STATUS_CFG = {
  pending:   { label: 'Pending',   className: 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400' },
  resolved:  { label: 'Resolved',  className: 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' },
  dismissed: { label: 'Dismissed', className: 'bg-slate-100 dark:bg-slate-700 text-slate-500' },
};

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState('All');
  const [search, setSearch]   = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const data = await adminService.getReports();
      if (Array.isArray(data)) {
        setReports(data);
      } else {
        console.error("Unexpected data format for reports:", data);
        setReports([]);
      }
    } catch (err) {
      console.error("Fetch reports error:", err);
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await adminService.updateReportStatus(id, status);
      toast.success(`Report marked as ${status}`);
      fetchReports();
    } catch (err) {
      toast.error("Failed to update report");
    }
  };

  const filtered = reports.filter(r => {
    const mF = filter === 'All' || r.status === filter.toLowerCase();
    const mS = r.reason.toLowerCase().includes(search.toLowerCase()) || 
               r.reporter?.name?.toLowerCase().includes(search.toLowerCase()) ||
               r.reportedUser?.name?.toLowerCase().includes(search.toLowerCase());
    return mF && mS;
  });

  const pendingCount = reports.filter(r => r.status === 'pending').length;

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">Reports</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              <span className="font-bold text-amber-600">{pendingCount}</span> pending review · {reports.length - pendingCount} resolved
            </p>
          </div>
          {pendingCount > 0 && (
            <div className="hidden sm:flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 px-4 py-2 rounded-2xl">
              <AlertCircle size={16} className="text-amber-600" />
              <span className="text-xs font-bold text-amber-700 dark:text-amber-400">{pendingCount} reports need attention</span>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search reports..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
          <div className="flex gap-2">
            {['All', 'Pending', 'Resolved', 'Dismissed'].map(f => (
              <button 
                key={f} 
                onClick={() => setFilter(f)}
                className={`text-xs font-bold px-5 py-2.5 rounded-xl transition-all ${filter === f ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700 hover:border-indigo-400'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="space-y-4">
          {loading ? (
            <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>
          ) : filtered.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 p-12 text-center">
              <Flag size={48} className="mx-auto mb-4 text-slate-200" />
              <p className="text-slate-400 font-bold">No reports found matching your criteria</p>
            </div>
          ) : filtered.map(r => {
            const cfg = STATUS_CFG[r.status] || STATUS_CFG.pending;
            return (
              <div key={r._id} className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden p-5 flex flex-col md:flex-row md:items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-700/50 flex items-center justify-center text-slate-400 flex-shrink-0">
                  <Flag size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-slate-900 dark:text-white">{r.reason}</h3>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${cfg.className}`}>{cfg.label}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-bold text-slate-700 dark:text-slate-300">{r.reporter?.name}</span> reported 
                    <span className="font-bold text-slate-700 dark:text-slate-300 ml-1">{r.reportedUser?.name}</span> 
                    <span className="ml-2 text-[10px] opacity-60">· {new Date(r.createdAt).toLocaleDateString()}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => updateStatus(r._id, 'resolved')}
                    className="flex-1 md:flex-none text-xs font-bold text-indigo-600 border border-indigo-100 dark:border-indigo-800 px-5 py-2.5 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-colors"
                  >
                    Review
                  </button>
                  <button onClick={() => updateStatus(r._id, 'resolved')} title="Resolve" className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-900/10 text-green-600 flex items-center justify-center hover:bg-green-100 transition-colors"><CheckCircle size={16}/></button>
                  <button onClick={() => updateStatus(r._id, 'dismissed')} title="Dismiss" className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-400 flex items-center justify-center hover:bg-slate-100 transition-colors"><XCircle size={16}/></button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminReports;
