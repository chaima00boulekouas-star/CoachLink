import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';

const MainLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Define paths where the back button should NOT appear
  const hideBackButtonPaths = ['/', '/join'];
  const showBackButton = !hideBackButtonPaths.includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-dark-bg selection:bg-indigo-100 dark:selection:bg-indigo-900/40">
      <Navbar />
      <main className="flex-grow pt-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          {showBackButton && (
            <button 
              onClick={() => navigate(-1)} 
              className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white mb-6 transition-colors group w-fit"
            >
              <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-dark-card border border-slate-200 dark:border-dark-border flex items-center justify-center group-hover:bg-slate-100 dark:group-hover:bg-slate-800 transition-colors shadow-sm">
                <ArrowLeft size={16} className="text-slate-600 dark:text-slate-300 group-hover:text-indigo-600 transition-colors" />
              </div>
              <span className="text-sm font-bold tracking-wide">Back</span>
            </button>
          )}
        </div>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
