import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2, ArrowRight } from 'lucide-react';
import { authService } from '../api/authService';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error'
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link.');
        return;
      }

      try {
        const res = await authService.verifyEmail(token);
        setStatus('success');
        setMessage(res.message || 'Email verified successfully!');
      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Verification failed or link expired.');
      }
    };

    verify();
  }, [token]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-slate-100 dark:border-slate-700 text-center">
        
        {status === 'loading' && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <Loader2 className="w-16 h-16 text-indigo-600 animate-spin" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">Verifying Email...</h1>
            <p className="text-slate-500 dark:text-slate-400">Please wait while we confirm your identity.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center text-green-600">
                <CheckCircle2 size={40} />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Email Verified!</h1>
              <p className="text-slate-500 dark:text-slate-400">{message}</p>
            </div>
            <Link 
              to="/login"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:opacity-90 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/20"
            >
              Go to Login <ArrowRight size={18} />
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center text-red-600">
                <XCircle size={40} />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Verification Failed</h1>
              <p className="text-slate-500 dark:text-slate-400">{message}</p>
            </div>
            <div className="flex flex-col gap-3">
              <Link 
                to="/signup"
                className="bg-indigo-600 hover:opacity-90 text-white font-bold px-8 py-3 rounded-xl transition-all"
              >
                Try Signing Up Again
              </Link>
              <Link 
                to="/"
                className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default VerifyEmail;
