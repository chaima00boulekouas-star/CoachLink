import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Flag, Send, AlertTriangle } from 'lucide-react';
import { reportService } from '../api/dataService';
import { toast } from 'react-hot-toast';

const ReportModal = ({ isOpen, onClose, reportedUserId, reportedUserName }) => {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      return toast.error("Please provide a reason for the report");
    }

    setLoading(true);
    try {
      await reportService.submit(reportedUserId, reason);
      toast.success("Report submitted. Our team will review it.");
      setReason('');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-700"
          >
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-red-500/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-500 flex items-center justify-center">
                  <Flag size={20} />
                </div>
                <div>
                  <h2 className="font-black text-slate-900 dark:text-white">Report User</h2>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Reporting {reportedUserName}</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors">
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-2xl flex gap-3 border border-amber-100 dark:border-amber-800/30">
                <AlertTriangle size={18} className="text-amber-500 flex-shrink-0" />
                <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                  Reporting a user will notify the administration team. Please provide specific details about the violation (harassment, fake profile, inappropriate content, etc.).
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 block px-1">Reason for Report</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Describe why you are reporting this user..."
                  rows={5}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-red-400 transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-red-500/20 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Flag size={18} />
                    Submit Report
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ReportModal;
