import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import {
  CheckCircle, XCircle, Mail, Clock, Trash2, Send, UserPlus, Search
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { requestService } from '../api/dataService';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../utils/imageUrl';

// ─── Shared helpers ────────────────────────────────────────────────────────

const statusBadge = {
  accepted: 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800',
  rejected: 'bg-red-100 dark:bg-red-900/20 text-red-500 dark:text-red-400 border-red-200 dark:border-red-800',
  pending:  'bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800',
};

const statusLabel = { accepted: 'Accepted', rejected: 'Declined', pending: 'Pending' };
const StatusIcon  = { accepted: CheckCircle, rejected: XCircle, pending: Clock };

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// ─── Trainer view: incoming athlete requests ────────────────────────────────

const TrainerRequestCard = ({ request, onAccept, onDecline }) => {
  const Icon = StatusIcon[request.status];
  const athlete = request.athlete;
  const [acting, setActing] = useState(false);

  const handleAccept = async () => {
    setActing(true);
    await onAccept(request._id);
    setActing(false);
  };

  const handleDecline = async () => {
    setActing(true);
    await onDecline(request._id);
    setActing(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-start gap-4 p-5">
        <div className="w-14 h-14 rounded-xl bg-slate-200 dark:bg-slate-700 overflow-hidden flex-shrink-0">
          <img
            src={getImageUrl(athlete?.avatar, `https://ui-avatars.com/api/?name=${encodeURIComponent(athlete?.name || 'A')}&background=6366f1&color=fff`)}
            alt={athlete?.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-slate-900 dark:text-white">{athlete?.name || 'Athlete'}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">{athlete?.email}</p>
        </div>
        <div className="flex-shrink-0">
          {request.status === 'pending' ? (
            <div className="flex items-center gap-2">
              <button
                onClick={handleDecline}
                disabled={acting}
                className="flex items-center gap-1.5 text-sm font-bold text-red-500 border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10 px-3 py-1.5 rounded-xl hover:bg-red-100 transition-colors disabled:opacity-50"
              >
                <XCircle size={15} /> Decline
              </button>
              <button
                onClick={handleAccept}
                disabled={acting}
                className="flex items-center gap-1.5 text-sm font-bold text-green-600 border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10 px-3 py-1.5 rounded-xl hover:bg-green-100 transition-colors disabled:opacity-50"
              >
                <CheckCircle size={15} /> Accept
              </button>
            </div>
          ) : (
            <span className={`flex items-center gap-1.5 text-sm font-bold px-3 py-1.5 rounded-xl border ${statusBadge[request.status]}`}>
              <Icon size={15} /> {statusLabel[request.status]}
            </span>
          )}
        </div>
      </div>

      {/* Message */}
      <div className="px-5 pb-4">
        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4">
          <p className="text-xs font-semibold text-slate-400 mb-1.5">Message:</p>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{request.message}</p>
        </div>
        <div className="flex items-center gap-3 mt-3 text-xs text-slate-400">
          <span>Sent: <strong className="text-slate-500 dark:text-slate-400">{formatDate(request.createdAt)}</strong></span>
          {request.updatedAt !== request.createdAt && request.status !== 'pending' && (
            <>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span>Responded: <strong className="text-slate-500 dark:text-slate-400">{formatDate(request.updatedAt)}</strong></span>
            </>
          )}
        </div>
      </div>

      {/* Status info */}
      <AnimatePresence>
        {request.status === 'accepted' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mx-5 mb-5 rounded-xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10 p-4"
          >
            <p className="text-xs font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
              <CheckCircle size={13} /> You accepted this athlete as your trainee.
            </p>
          </motion.div>
        )}

        {request.status === 'rejected' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mx-5 mb-5 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10 p-3"
          >
            <p className="text-xs font-semibold text-red-500">You declined this request.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── Athlete view: outgoing requests to coaches ─────────────────────────────

const AthleteRequestCard = ({ request, onCancel }) => {
  const Icon = StatusIcon[request.status];
  const trainer = request.trainer;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden"
    >
      <div className="flex items-start gap-4 p-5">
        <div className="w-14 h-14 rounded-xl bg-slate-200 dark:bg-slate-700 overflow-hidden flex-shrink-0">
          <img
            src={getImageUrl(trainer?.avatar, `https://ui-avatars.com/api/?name=${encodeURIComponent(trainer?.name || 'T')}&background=f97316&color=fff`)}
            alt={trainer?.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-slate-900 dark:text-white">{trainer?.name || 'Trainer'}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">{trainer?.email}</p>
        </div>
        <div className="flex-shrink-0 flex items-center gap-2">
          <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border ${statusBadge[request.status]}`}>
            <Icon size={13} /> {statusLabel[request.status]}
          </span>
          {request.status === 'pending' && (
            <button
              onClick={() => onCancel(request._id)}
              className="w-8 h-8 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-600 text-slate-400 hover:text-red-500 hover:border-red-300 transition-all"
              title="Cancel request"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="px-5 pb-4">
        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4">
          <p className="text-xs font-semibold text-slate-400 mb-1.5">Your Message:</p>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{request.message}</p>
        </div>
        <div className="flex items-center gap-3 mt-3 text-xs text-slate-400">
          <span>Sent: <strong className="text-slate-500 dark:text-slate-400">{formatDate(request.createdAt)}</strong></span>
          {request.updatedAt !== request.createdAt && request.status !== 'pending' && (
            <>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span>Responded: <strong className="text-slate-500 dark:text-slate-400">{formatDate(request.updatedAt)}</strong></span>
            </>
          )}
        </div>
      </div>

      {/* Status info */}
      <AnimatePresence>
        {request.status === 'accepted' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mx-5 mb-5 rounded-xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10 p-4"
          >
            <p className="text-xs font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
              <CheckCircle size={13} /> Request Accepted! You are now a trainee of {trainer?.name}.
            </p>
            {trainer?.email && (
              <div className="flex items-center gap-2 mt-2">
                <Mail size={13} className="text-indigo-600" />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{trainer.email}</span>
              </div>
            )}
          </motion.div>
        )}

        {request.status === 'rejected' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mx-5 mb-5 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10 p-3"
          >
            <p className="text-xs font-semibold text-red-500">The trainer declined your request. Try another trainer!</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── Main page (role-aware) ─────────────────────────────────────────────────

const MyTrainerRequests = () => {
  const role     = useSelector((s) => s.auth.role);
  const isAthlete = role === 'athlete';

  const [requests, setRequests] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState('all'); // all | pending | accepted | rejected

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const res = isAthlete
          ? await requestService.getOutgoing()
          : await requestService.getIncoming();
        setRequests(res.requests || []);
      } catch (err) {
        console.error('Failed to fetch requests:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [isAthlete]);

  const handleAccept = async (id) => {
    try {
      await requestService.accept(id);
      setRequests(prev => prev.map(r => r._id === id ? { ...r, status: 'accepted', updatedAt: new Date().toISOString() } : r));
    } catch (err) {
      console.error('Failed to accept:', err);
    }
  };

  const handleDecline = async (id) => {
    try {
      await requestService.decline(id);
      setRequests(prev => prev.map(r => r._id === id ? { ...r, status: 'rejected', updatedAt: new Date().toISOString() } : r));
    } catch (err) {
      console.error('Failed to decline:', err);
    }
  };

  const handleCancel = async (id) => {
    try {
      await requestService.cancel(id);
      setRequests(prev => prev.filter(r => r._id !== id));
    } catch (err) {
      console.error('Failed to cancel:', err);
    }
  };

  const filteredRequests = filter === 'all' ? requests : requests.filter(r => r.status === filter);

  const counts = {
    all: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    accepted: requests.filter(r => r.status === 'accepted').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-1">
            {isAthlete ? 'My Trainer Requests' : 'Athlete Requests'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            {isAthlete
              ? 'Track the requests you have sent to trainers'
              : 'Manage incoming training requests from athletes'}
          </p>
          {isAthlete && (
            <Link to="/coaches" className="inline-flex items-center gap-2 mt-4 bg-orange-500 text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-orange-500/20">
              <UserPlus size={15} /> Find a New Trainer
            </Link>
          )}
        </div>

        {/* Filter Tabs */}
        {requests.length > 0 && (
          <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
            {['all', 'pending', 'accepted', 'rejected'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                  filter === f
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  filter === f ? 'bg-white/20' : 'bg-slate-200 dark:bg-slate-600'
                }`}>
                  {counts[f]}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Cards */}
        <div className="space-y-5">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredRequests.length > 0 ? (
            filteredRequests.map((req) => (
              isAthlete ? (
                <AthleteRequestCard key={req._id} request={req} onCancel={handleCancel} />
              ) : (
                <TrainerRequestCard key={req._id} request={req} onAccept={handleAccept} onDecline={handleDecline} />
              )
            ))
          ) : (
            <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
              <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center">
                <Send size={24} className="text-slate-400" />
              </div>
              <p className="text-slate-400 text-sm font-semibold mb-1">
                {filter !== 'all' ? `No ${filter} requests` : 'No requests yet'}
              </p>
              {isAthlete && filter === 'all' && (
                <Link to="/coaches" className="text-indigo-600 text-sm font-bold hover:underline mt-2 inline-block">
                  Browse trainers →
                </Link>
              )}
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
};

export default MyTrainerRequests;
