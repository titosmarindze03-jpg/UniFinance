/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sidebar } from '../Sidebar';
import { Header } from '../Header';
import { useFinance } from '../../contexts/FinanceContext';

// Import All Page views
import { Dashboard } from '../../pages/Dashboard';
import { Transactions } from '../../pages/Transactions';
import { IncomePage } from '../../pages/IncomePage';
import { ExpensePage } from '../../pages/ExpensePage';
import { BudgetsPage } from '../../pages/BudgetsPage';
import { GoalsPage } from '../../pages/GoalsPage';
import { ReportsPage } from '../../pages/ReportsPage';
import { EducationPage } from '../../pages/EducationPage';
import { AIAssistantPage } from '../../pages/AIAssistantPage';
import { ProfilePage } from '../../pages/ProfilePage';
import { SettingsPage } from '../../pages/SettingsPage';
import { AdminDashboard } from '../../pages/AdminDashboard';
import { Footer } from '../Footer';

export const AppLayout: React.FC = () => {
  const { activePage } = useFinance();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Dynamic router based on global context state
  const renderActivePage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'transactions':
        return <Transactions />;
      case 'income':
        return <IncomePage />;
      case 'expenses':
        return <ExpensePage />;
      case 'budgets':
        return <BudgetsPage />;
      case 'goals':
        return <GoalsPage />;
      case 'reports':
        return <ReportsPage />;
      case 'education':
        return <EducationPage />;
      case 'ai-assistant':
        return <AIAssistantPage />;
      case 'profile':
        return <ProfilePage />;
      case 'settings':
        return <SettingsPage />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-[#0A0F1D] text-slate-800 dark:text-slate-100 overflow-hidden font-sans">
      {/* Sidebar Navigation Column */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Primary Work Zone containing top header and layout canvas */}
      <div className="flex flex-col flex-1 h-full min-w-0 overflow-hidden">
        {/* Top Header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Scrollable Layout Body */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto animate-fade-in">
            {renderActivePage()}
            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
};
