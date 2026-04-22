import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import {
  CheckCircle, XCircle, Phone, Mail, MessageCircle,
  Instagram, Clock, Trash2
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { acceptRequest, declineRequest, cancelAthleteRequest } from '../redux/store';
import { Link } from 'react-router-dom';

// ─── Shared helpers ────────────────────────────────────────────────────────

const statusBadge = {
  accepted: 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800',
  rejected: 'bg-red-100 dark:bg-red-900/20 text-red-500 dark:text-red-400 border-red-200 dark:border-red-800',
  pending:  'bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800',
};

const statusLabel = { accepted: 'Accepted', rejected: 'Declined', pending: 'Pending' };
const StatusIcon  = { accepted: CheckCircle, rejected: XCircle, pending: Clock };

// ─── Trainer view: incoming athlete requests ────────────────────────────────

const TrainerRequestCard = ({ request }) => {
  const dispatch = useDispatch();
  const Icon = StatusIcon[request.status];

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
            src={`https://i.pravatar.cc/100?u=${request.name}`}
            alt={request.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-slate-900 dark:text-white">{request.name}</h3>
          <p className="text-sm font-semibold text-orange-500">{request.sport}</p>
        </div>
        <div className="flex-shrink-0">
          {request.status === 'pending' ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => dispatch(declineRequest(request.id))}
                className="flex items-center gap-1.5 text-sm font-bold text-red-500 border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10 px-3 py-1.5 rounded-xl hover:bg-red-100 transition-colors"
              >
                <XCircle size={15} /> Decline
              </button>
              <button
                onClick={() => dispatch(acceptRequest(request.id))}
                className="flex items-center gap-1.5 text-sm font-bold text-green-600 border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10 px-3 py-1.5 rounded-xl hover:bg-green-100 transition-colors"
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
      <div className="px-5 pb-3">
        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3.5">
          <p className="text-xs font-semibold text-slate-400 mb-1">Message:</p>
          <p className="text-sm text-slate-700 dark:text-slate-300">{request.message}</p>
        </div>
        <div className="flex items-center gap-3 mt-3 text-xs text-slate-400">
          <span>Sent: <strong className="text-slate-500 dark:text-slate-400">{request.sentDate}</strong></span>
          {request.responseDate && (
            <>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span>Response: <strong className="text-slate-500 dark:text-slate-400">{request.responseDate}</strong></span>
            </>
          )}
        </div>
      </div>

      {/* Accepted contact block */}
      <AnimatePresence>
        {request.status === 'accepted' && request.contact && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mx-5 mb-5 rounded-xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10 p-4"
          >
            <p className="text-xs font-bold text-green-600 dark:text-green-400 mb-3 flex items-center gap-2">
              <CheckCircle size={13} /> Request Accepted — Contact Info:
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { Icon: Phone, label: 'Phone', val: request.contact.phone },
                { Icon: Mail, label: 'Email', val: request.contact.email },
                { Icon: MessageCircle, label: 'WhatsApp', val: request.contact.whatsapp },
                { Icon: Instagram, label: 'Instagram', val: request.contact.instagram },
              ].map(({ Icon: I, label, val }) => (
                <div key={label} className="flex items-center gap-2">
                  <I size={13} className="text-indigo-600 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] text-slate-400">{label}</p>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{val}</p>
                  </div>
                </div>
              ))}
            </div>
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

const AthleteRequestCard = ({ request }) => {
  const dispatch = useDispatch();
  const Icon = StatusIcon[request.status];

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
            src={`https://i.pravatar.cc/100?u=coach-${request.coachName}`}
            alt={request.coachName}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-slate-900 dark:text-white">{request.coachName}</h3>
          <p className="text-sm font-semibold text-orange-500">{request.sport}</p>
          <p className="text-xs text-slate-400 mt-0.5">Plan: <span className="font-semibold text-slate-600 dark:text-slate-300">{request.plan}</span></p>
        </div>
        <div className="flex-shrink-0 flex items-center gap-2">
          <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border ${statusBadge[request.status]}`}>
            <Icon size={13} /> {statusLabel[request.status]}
          </span>
          {request.status === 'pending' && (
            <button
              onClick={() => dispatch(cancelAthleteRequest(request.id))}
              className="w-8 h-8 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-600 text-slate-400 hover:text-red-500 hover:border-red-300 transition-all"
              title="Cancel request"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="px-5 pb-3">
        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3.5">
          <p className="text-xs font-semibold text-slate-400 mb-1">Your Message:</p>
          <p className="text-sm text-slate-700 dark:text-slate-300">{request.message}</p>
        </div>
        <div className="flex items-center gap-3 mt-3 text-xs text-slate-400">
          <span>Sent: <strong className="text-slate-500 dark:text-slate-400">{request.sentDate}</strong></span>
          {request.responseDate && (
            <>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span>Response: <strong className="text-slate-500 dark:text-slate-400">{request.responseDate}</strong></span>
            </>
          )}
        </div>
      </div>

      {/* Accepted: coach contact */}
      <AnimatePresence>
        {request.status === 'accepted' && request.coachContact && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mx-5 mb-5 rounded-xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10 p-4"
          >
            <p className="text-xs font-bold text-green-600 dark:text-green-400 mb-3 flex items-center gap-2">
              <CheckCircle size={13} /> Coach accepted! Here is their contact:
            </p>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Phone size={13} className="text-indigo-600" />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{request.coachContact.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={13} className="text-indigo-600" />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{request.coachContact.email}</span>
              </div>
            </div>
          </motion.div>
        )}

        {request.status === 'rejected' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mx-5 mb-5 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10 p-3"
          >
            <p className="text-xs font-semibold text-red-500">The coach declined your request. Try another coach!</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── Main page (role-aware) ─────────────────────────────────────────────────

const MyTrainerRequests = () => {
  const role             = useSelector((s) => s.auth.role);
  const trainerRequests  = useSelector((s) => s.requests.items);
  const athleteRequests  = useSelector((s) => s.athleteRequests.items);
  const isAthlete        = role === 'athlete';

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-1">
            {isAthlete ? 'My Coach Requests' : 'Athlete Requests'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            {isAthlete
              ? 'Track the requests you have sent to coaches'
              : 'Manage incoming training requests from athletes'}
          </p>
          {isAthlete && (
            <Link to="/coaches" className="inline-flex items-center gap-2 mt-4 bg-orange-500 text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-orange-500/20">
              + Find a New Coach
            </Link>
          )}
        </div>

        {/* Cards */}
        <div className="space-y-5">
          {isAthlete ? (
            athleteRequests.length > 0 ? (
              athleteRequests.map((req) => (
                <AthleteRequestCard key={req.id} request={req} />
              ))
            ) : (
              <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                <p className="text-slate-400 text-sm font-semibold">No requests sent yet.</p>
                <Link to="/coaches" className="text-indigo-600 text-sm font-bold hover:underline mt-2 inline-block">
                  Browse coaches →
                </Link>
              </div>
            )
          ) : (
            trainerRequests.map((req) => (
              <TrainerRequestCard key={req.id} request={req} />
            ))
          )}
        </div>

      </div>
    </DashboardLayout>
  );
};

export default MyTrainerRequests;
