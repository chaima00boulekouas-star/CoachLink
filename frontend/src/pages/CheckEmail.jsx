import React from 'react';
import { Mail, ArrowLeft } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const CheckEmail = () => {
  const location = useLocation();
  // Optional: pass the email address from signup state
  const email = location.state?.email || 'your email';

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-slate-50 dark:bg-[#0A0A16]">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-100 dark:border-slate-700 text-center relative overflow-hidden">
        
        {/* Decorative top bar */}
        <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600" />

        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600 animate-pulse">
            <Mail size={40} />
          </div>
        </div>
        
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Check Your Email</h1>
        
        <p className="text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
          We've sent a verification link to <strong className="text-slate-700 dark:text-slate-300">{email}</strong>. 
          Please check your inbox and click the link to verify your account.
        </p>
        
        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl mb-8 border border-amber-200 dark:border-amber-800">
          <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">
            Don't see it? Check your spam or junk folder.
          </p>
        </div>
        
        <Link 
          to="/login"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 dark:text-slate-400 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Login
        </Link>

      </div>
    </div>
  );
};

export default CheckEmail;
