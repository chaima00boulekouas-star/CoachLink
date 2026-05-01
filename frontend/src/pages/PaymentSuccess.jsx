import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';

const PaymentSuccess = () => {
  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-6">
          <CheckCircle size={40} className="text-green-500" />
        </div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">Payment Successful!</h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 max-w-md">
          Thank you for your purchase. Your order has been processed and your programs are now available.
        </p>
        <div className="flex gap-4">
          <Link to="/athlete/dashboard">
            <button className="bg-indigo-600 text-white font-bold px-8 py-3 rounded-xl hover:opacity-90 transition-opacity">
              Go to Dashboard
            </button>
          </Link>
          <Link to="/athlete/store">
            <button className="border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 font-bold px-8 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PaymentSuccess;
