/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { FinanceProvider, useFinance } from './contexts/FinanceContext';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Onboarding } from './pages/Onboarding';
import { AppLayout } from './components/layout/AppLayout';
import { Calculator } from './components/Calculator';
import { ToastContainer } from './components/ToastContainer';

const AppContent: React.FC = () => {
  const { user, activePage } = useFinance();

  // If user is not logged in, render public pages
  if (!user) {
    if (activePage === 'register') {
      return <Register />;
    }
    if (activePage === 'login') {
      return <Login />;
    }
    return <Landing />;
  }

  // If logged in but onboarding is not completed
  if (!user.onboardingCompleted) {
    return <Onboarding />;
  }

  // Full app dashboard with sidebar / header
  return <AppLayout />;
};

export default function App() {
  return (
    <FinanceProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-[#0A0F1D] text-slate-800 dark:text-slate-100 transition-colors duration-350">
        <AppContent />
        
        {/* Global floating elements */}
        <Calculator />
        <ToastContainer />
      </div>
    </FinanceProvider>
  );
}
