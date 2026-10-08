/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useFinance } from '../contexts/FinanceContext';
import { 
  ShieldAlert, 
  Plus, 
  Trash2, 
  Edit3, 
  X, 
  AlertTriangle, 
  CheckCircle, 
  HelpCircle,
  TrendingDown
} from 'lucide-react';
import * as Icons from 'lucide-react';
import { EmptyState } from '../components/EmptyState';

export const BudgetsPage: React.FC = () => {
  const { 
    transactions, 
    categories, 
    budgets, 
    addOrUpdateBudget, 
    deleteBudget, 
    currency, 
    addToast 
  } = useFinance();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [budgetAmount, setBudgetAmount] = useState<number>(0);

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  // Get only expense categories
  const expenseCategories = categories.filter(c => c.type === 'expense');

  // Format category spent calculation
  const getCategorySpent = (catId: string) => {
    return transactions
      .filter(tx => 
        tx.categoryId === catId && 
        tx.type === 'expense' && 
        new Date(tx.date).getMonth() === currentMonth && 
        new Date(tx.date).getFullYear() === currentYear
      )
      .reduce((sum, tx) => sum + tx.amount, 0);
  };

  const handleOpenAdd = (catId = '', currentLimit = 0) => {
    setSelectedCategoryId(catId || (expenseCategories[0]?.id || ''));
    setBudgetAmount(currentLimit || 2000);
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategoryId || budgetAmount <= 0) {
      addToast('Introduza uma categoria válida e um limite superior a zero.', 'warning');
      return;
    }

    try {
      await addOrUpdateBudget(selectedCategoryId, budgetAmount);
      setIsFormOpen(false);
    } catch {
      // Handled inside context
    }
  };

  const renderIcon = (iconName: string, className = '') => {
    const LucideIcon = (Icons as any)[iconName] || HelpCircle;
    return <LucideIcon size={16} className={className} />;
  };

  return (
    <div className="space-y-6">
      
      {/* Top Section Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold font-serif text-slate-800 dark:text-white leading-none">Limites de Gastos e Orçamentos</h1>
          <p className="text-xs text-slate-400 mt-1">Defina limites mensais por categoria para evitar gastos excessivos e poupar mais.</p>
        </div>
        <button
          onClick={() => handleOpenAdd()}
          className="w-full sm:w-auto px-4 py-2.5 bg-[#0B2545] hover:bg-brand-primary-light text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-md flex items-center justify-center gap-1.5 transition-all"
        >
          <Plus size={14} strokeWidth={2.5} />
          Definir Orçamento
        </button>
      </div>

      {/* Active Budgets Grid */}
      {budgets.length === 0 ? (
        <EmptyState
          iconName="ShieldAlert"
          title="Nenhum limite orçamental definido"
          description="A definição de orçamentos mensais ajuda-lhe a economizar até 30% em gastos desnecessários de alimentação, transporte e lazer."
          actionLabel="Definir Primeiro Orçamento"
          onAction={() => handleOpenAdd()}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgets.map((b) => {
            const cat = categories.find(c => c.id === b.categoryId);
            const spent = getCategorySpent(b.categoryId);
            const percent = (spent / b.amount) * 100;
            const available = b.amount - spent;

            let colorClass = 'bg-emerald-500';
            let bgRingClass = 'border-emerald-100 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/20 dark:border-emerald-900/50 dark:text-emerald-300';
            let alertMessage = null;

            if (percent >= 100) {
              colorClass = 'bg-rose-500';
              bgRingClass = 'border-rose-100 bg-rose-50 text-rose-800 dark:bg-rose-950/20 dark:border-rose-900/50 dark:text-rose-200';
              alertMessage = percent > 100 
                ? `Ultrapassou o limite em ${Math.abs(available).toLocaleString('pt-MZ')} MZN!` 
                : 'Atingiu exatamente o limite orçamentado!';
            } else if (percent >= 80) {
              colorClass = 'bg-amber-500';
              bgRingClass = 'border-amber-100 bg-amber-50 text-amber-800 dark:bg-amber-950/20 dark:border-amber-900/50 dark:text-amber-200';
              alertMessage = 'Consumiu mais de 80% do planeado para este mês.';
            }

            return (
              <div 
                key={b.id} 
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 flex flex-col justify-between shadow-xs hover:shadow-md transition-all relative overflow-hidden"
              >
                <div>
                  {/* Category info */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-amber-400 rounded-xl shadow-inner">
                        {cat ? renderIcon(cat.icon) : <HelpCircle size={16} />}
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100">{cat?.name || 'Geral'}</h3>
                        <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Orçamento Mensal</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenAdd(b.categoryId, b.amount)}
                        className="p-1 text-slate-400 hover:text-[#0B2545] dark:hover:text-amber-400 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800"
                        title="Editar limite"
                      >
                        <Edit3 size={13} />
                      </button>
                      <button
                        onClick={() => deleteBudget(b.id)}
                        className="p-1 text-slate-400 hover:text-rose-500 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800"
                        title="Remover orçamento"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Available, Spent, and Total */}
                  <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800/60 my-4 text-xs font-mono font-medium">
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider font-sans mb-1">Gasto Atual</p>
                      <span className="text-slate-700 dark:text-slate-200 tabular-nums">{spent.toLocaleString('pt-MZ')} MZN</span>
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider font-sans mb-1">Disponível</p>
                      <span className={`tabular-nums ${available >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500 font-bold'}`}>
                        {available.toLocaleString('pt-MZ')} MZN
                      </span>
                    </div>
                  </div>

                  {/* Progress Slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-mono font-bold text-slate-400">
                      <span>Progresso</span>
                      <span>{percent.toFixed(1)}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${colorClass} rounded-full transition-all duration-500`}
                        style={{ width: `${Math.min(100, percent)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Warning message below */}
                {alertMessage && (
                  <div className={`mt-4 border p-2.5 rounded-lg text-[10px] font-semibold leading-relaxed flex items-center gap-2 ${bgRingClass} animate-pulse`}>
                    <AlertTriangle size={12} className="shrink-0" />
                    <span>{alertMessage}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Categories configuration showcase panel */}
      {budgets.length > 0 && (
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800/80 shadow-xs">
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
            Outras Categorias que Pode Monitorizar
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {expenseCategories
              .filter(cat => !budgets.some(b => b.categoryId === cat.id))
              .map(cat => (
                <div key={cat.id} className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <div className="p-1.5 bg-slate-100 dark:bg-slate-800 text-[#0B2545] dark:text-amber-400 rounded-lg">
                      {renderIcon(cat.icon)}
                    </div>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">{cat.name}</span>
                  </div>
                  <button
                    onClick={() => handleOpenAdd(cat.id)}
                    className="text-[10px] font-bold text-brand-accent hover:underline shrink-0"
                  >
                    Ativar
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* --- BUDGET SETUP MODAL --- */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-scale-in">
            <div className="flex justify-between items-center bg-[#0B2545] text-white px-5 py-4">
              <h3 className="font-serif text-sm font-bold tracking-tight">Definir Orçamento de Despesa</h3>
              <button 
                onClick={() => setIsFormOpen(false)}
                className="text-slate-300 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Categoria de Despesa *
                </label>
                <select
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                  className="block w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg text-xs"
                >
                  {expenseCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Limite Mensal Máximo (MZN) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={budgetAmount || ''}
                  onChange={(e) => setBudgetAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                  placeholder="Ex: 3000"
                  className="block w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-mono font-bold tabular-nums"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="flex-1 py-2 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold uppercase tracking-wider rounded-lg transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 bg-[#0B2545] hover:bg-brand-primary-light text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all"
                >
                  Guardar Limite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
