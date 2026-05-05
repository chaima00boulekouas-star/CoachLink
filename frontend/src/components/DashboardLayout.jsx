import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare } from 'lucide-react';
import DashboardSidebar from './DashboardSidebar';
import DashboardTopbar from './DashboardTopbar';
import FeedbackModal from './FeedbackModal';

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Define paths where the back button should NOT appear
  const hideBackButtonPaths = ['/dashboard', '/athlete/dashboard', '/athlete/home'];
  const showBackButton = !hideBackButtonPaths.includes(location.pathname);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg relative">
      <DashboardTopbar onToggleSidebar={() => setSidebarOpen(prev => !prev)} />
      <DashboardSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        onOpenFeedback={() => setFeedbackOpen(true)}
      />

      <main className="pt-[60px] min-h-screen">
        <div className="p-3 sm:p-5 lg:p-6 max-w-7xl mx-auto">
          {showBackButton && (
            <button 
              onClick={() => navigate(-1)} 
              className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white mb-6 transition-colors group"
            >
              <div className="w-8 h-8 rounded-full bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border flex items-center justify-center group-hover:bg-slate-100 dark:group-hover:bg-slate-800 transition-colors shadow-sm">
                <ArrowLeft size={16} className="text-slate-600 dark:text-slate-300 group-hover:text-primary-blue transition-colors" />
              </div>
              <span className="text-sm font-bold tracking-wide">Back</span>
            </button>
          )}
          {children}
        </div>
      </main>

      {/* Floating Feedback Button */}
      <button 
        onClick={() => setFeedbackOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2.5 rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all group"
      >
        <div className="w-8 h-8 rounded-xl bg-primary-blue/10 text-primary-blue flex items-center justify-center group-hover:bg-primary-blue group-hover:text-white transition-colors">
          <MessageSquare size={16} />
        </div>
        <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Feedback</span>
      </button>

      <FeedbackModal isOpen={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
    </div>
  );
};

export default DashboardLayout;
