import React from 'react';
import { Link } from 'react-router-dom';
import { XCircle } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';

const PaymentFailure = () => {
  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6">
          <XCircle size={40} className="text-red-500" />
        </div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">Payment Failed</h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 max-w-md">
          We couldn't process your payment. Please try again or contact support if the issue persists.
        </p>
        <div className="flex gap-4">
          <Link to="/cart">
            <button className="bg-red-500 text-white font-bold px-8 py-3 rounded-xl hover:opacity-90 transition-opacity">
              Return to Cart
            </button>
          </Link>
          <Link to="/athlete/dashboard">
            <button className="border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 font-bold px-8 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              Go to Dashboard
            </button>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PaymentFailure;
