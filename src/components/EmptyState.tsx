/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import * as Icons from 'lucide-react';

interface EmptyStateProps {
  iconName: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  iconName,
  title,
  description,
  actionLabel,
  onAction
}) => {
  // Resolve Lucide Icon dynamically
  const LucideIcon = (Icons as any)[iconName] || Icons.HelpCircle;

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-lg mx-auto my-6">
      <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-full text-brand-primary dark:text-amber-400 mb-4 ring-4 ring-slate-100 dark:ring-slate-800">
        <LucideIcon size={32} strokeWidth={1.5} />
      </div>
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">
        {title}
      </h3>
      <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs mb-6">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-5 py-2.5 bg-brand-primary hover:bg-brand-primary-light text-white text-xs font-semibold rounded-lg shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
        >
          <Icons.Plus size={14} strokeWidth={2.5} />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
};
