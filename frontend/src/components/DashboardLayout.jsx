import React, { useState } from 'react';
import DashboardSidebar from './DashboardSidebar';
import DashboardTopbar from './DashboardTopbar';

/**
 * DashboardLayout
 * Manages the sidebar open/close state here so both Topbar (toggle button)
 * and Sidebar (close on nav / backdrop click) can share the same state.
 * The sidebar is now an overlay drawer — the main content always occupies
 * the full width and only shifts down by the topbar height (60px).
 */
const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg">
      {/* Topbar — always full width */}
      <DashboardTopbar onToggleSidebar={() => setSidebarOpen(prev => !prev)} />

      {/* Sidebar — overlay drawer, managed by open state */}
      <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="pt-[60px] min-h-screen">
        <div className="p-3 sm:p-5 lg:p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
