/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useFinance } from '../contexts/FinanceContext';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useFinance();

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full">
      {toasts.map(toast => {
        let icon = <Info className="text-blue-500" size={18} />;
        let borderClass = 'border-blue-100 dark:border-blue-900/50 bg-blue-50/95 dark:bg-blue-950/90 text-blue-800 dark:text-blue-200';
        
        if (toast.type === 'success') {
          icon = <CheckCircle2 className="text-emerald-500" size={18} />;
          borderClass = 'border-emerald-100 dark:border-emerald-900/50 bg-emerald-50/95 dark:bg-emerald-950/90 text-emerald-800 dark:text-emerald-200';
        } else if (toast.type === 'error') {
          icon = <XCircle className="text-rose-500" size={18} />;
          borderClass = 'border-rose-100 dark:border-rose-900/50 bg-rose-50/95 dark:bg-rose-950/90 text-rose-800 dark:text-rose-200';
        } else if (toast.type === 'warning') {
          icon = <AlertTriangle className="text-amber-500" size={18} />;
          borderClass = 'border-amber-100 dark:border-amber-900/50 bg-amber-50/95 dark:bg-amber-950/90 text-amber-800 dark:text-amber-200';
        }

        return (
          <div
            key={toast.id}
            className={`flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md shadow-lg animate-fade-in transition-all duration-300 ${borderClass}`}
            role="alert"
          >
            <div className="shrink-0 mt-0.5">{icon}</div>
            <div className="flex-1 text-xs font-medium leading-relaxed">
              {toast.message}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-0.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
