/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useFinance } from '../contexts/FinanceContext';
import { Plus, TrendingDown, Calendar, AlertTriangle, Check, ArrowDownRight, HelpCircle } from 'lucide-react';
import * as Icons from 'lucide-react';

export const ExpensePage: React.FC = () => {
  const { transactions, categories, addTransaction, currency } = useFinance();
  
  // Form states
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [categoryId, setCategoryId] = useState('exp-alimentacao');
  const [paymentMethod, setPaymentMethod] = useState('M-Pesa');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Expense category list
  const expenseCategories = categories.filter(c => c.type === 'expense');

  // Expense transactions only
  const expenseTransactions = transactions.filter(t => t.type === 'expense');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || amount <= 0 || !categoryId) return;

    setIsLoading(true);
    try {
      await addTransaction({
        type: 'expense',
        description,
        amount,
        categoryId,
        paymentMethod,
        date,
        notes
      });
      // Clear form
      setDescription('');
      setAmount(0);
      setNotes('');
    } catch {
      // Handled in context
    } finally {
      setIsLoading(false);
    }
  };

  const renderIcon = (iconName: string, className = '') => {
    const LucideIcon = (Icons as any)[iconName] || HelpCircle;
    return <LucideIcon size={16} className={className} />;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Column 1 & 2: Form and Info */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800/80 shadow-xs">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-rose-500/10 text-rose-650 dark:text-rose-400 p-2 rounded-xl">
              <TrendingDown size={20} />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-800 dark:text-slate-100 font-serif">Registar Nova Despesa</h1>
              <p className="text-xs text-slate-400">Insira as suas despesas diárias, propinas, transportes ou contas de internet.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">O que comprou / pagou? *</label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ex: Jantar no refeitório universitário"
                  className="block w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Valor (MZN) *</label>
                <input
                  type="number"
                  required
                  min="0.01"
                  step="any"
                  value={amount || ''}
                  onChange={(e) => setAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                  placeholder="Ex: 150"
                  className="block w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-mono font-bold tabular-nums"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Categoria *</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="block w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg text-xs"
                >
                  {expenseCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Método de Pagamento</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="block w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg text-xs"
                >
                  <option value="M-Pesa">M-Pesa</option>
                  <option value="e-Mola">e-Mola</option>
                  <option value="mKesh">mKesh</option>
                  <option value="Dinheiro">Dinheiro</option>
                  <option value="Transferência Bancária">Transferência Bancária</option>
                  <option value="Cartão de Débito">Cartão de Débito</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Data da Despesa</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="block w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Observações / Notas (Opcional)</label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex: Pagamento efetuado via M-Pesa com taxa incluída."
                className="block w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg text-xs"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Plus size={14} strokeWidth={2.5} />
                <span>{isLoading ? 'A Registar...' : 'Registar Despesa'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Detailed Category Glossary */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800/80 shadow-xs">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Principais Categorias de Gasto</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {expenseCategories.slice(0, 9).map(cat => (
              <div key={cat.id} className="flex gap-2.5 items-start p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-all">
                <div className="p-1.5 bg-slate-100 dark:bg-slate-800 text-rose-500 rounded-md">
                  {renderIcon(cat.icon)}
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 leading-none">{cat.name}</p>
                  <p className="text-[9px] text-slate-400 mt-1 line-clamp-2">{cat.description || 'Despesa diária'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Column 3: Summary of logged Incomes */}
      <div className="space-y-6">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800/80 shadow-xs">
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
            Histórico Recente de Despesas
          </h3>

          <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
            {expenseTransactions.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-10">Não possui despesas registadas.</p>
            ) : (
              expenseTransactions.map(tx => {
                const cat = categories.find(c => c.id === tx.categoryId);
                return (
                  <div key={tx.id} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800/60 flex justify-between items-center hover:border-slate-200 transition-all">
                    <div className="overflow-hidden pr-2">
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">{tx.description}</p>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1">
                        <span>{new Date(tx.date).toLocaleDateString('pt-MZ')}</span>
                        <span>·</span>
                        <span className="truncate max-w-[80px]">{cat?.name}</span>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-rose-600 dark:text-rose-400 whitespace-nowrap tabular-nums">
                      -{tx.amount.toLocaleString('pt-MZ')} {currency}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

    </div>
  );
};
