/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useFinance } from '../contexts/FinanceContext';
import { Goal } from '../types/finance';
import { 
  Target, 
  Plus, 
  Trash2, 
  Edit3, 
  X, 
  HelpCircle, 
  PiggyBank, 
  Sparkles,
  Award,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import * as Icons from 'lucide-react';
import { EmptyState } from '../components/EmptyState';

export const GoalsPage: React.FC = () => {
  const { 
    goals, 
    addGoal, 
    updateGoal, 
    deleteGoal, 
    depositToGoal, 
    currency, 
    addToast 
  } = useFinance();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  
  // Deposit state
  const [depositGoalId, setDepositGoalId] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState<number>(0);

  // Form Fields
  const [goalName, setGoalName] = useState('');
  const [goalTarget, setGoalTarget] = useState<number>(0);
  const [goalCurrent, setGoalCurrent] = useState<number>(0);
  const [goalDeadline, setGoalDeadline] = useState('');

  const resetForm = () => {
    setEditingGoal(null);
    setGoalName('');
    setGoalTarget(0);
    setGoalCurrent(0);
    setGoalDeadline(new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]); // 90 days default
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const handleOpenEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setGoalName(goal.name);
    setGoalTarget(goal.targetAmount);
    setGoalCurrent(goal.currentAmount);
    setGoalDeadline(goal.deadline || '');
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalName || goalTarget <= 0) {
      addToast('Por favor preencha todos os campos obrigatórios.', 'warning');
      return;
    }

    const payload = {
      name: goalName,
      targetAmount: goalTarget,
      currentAmount: goalCurrent,
      deadline: goalDeadline || undefined,
      category: 'Poupança'
    };

    try {
      if (editingGoal) {
        await updateGoal(editingGoal.id, payload);
      } else {
        await addGoal(payload);
      }
      setIsFormOpen(false);
      resetForm();
    } catch {
      // Handled in context
    }
  };

  const handleOpenDeposit = (goalId: string) => {
    setDepositGoalId(goalId);
    setDepositAmount(0);
  };

  const handleDepositSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!depositGoalId || depositAmount <= 0) {
      addToast('Introduza um montante de poupança superior a zero.', 'warning');
      return;
    }

    try {
      await depositToGoal(depositGoalId, depositAmount);
      setDepositGoalId(null);
      setDepositAmount(0);
    } catch {
      // Handled in context
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Page header controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold font-serif text-slate-800 dark:text-white leading-none">Minhas Metas e Objetivos</h1>
          <p className="text-xs text-slate-400 mt-1">Defina objetivos de poupança a curto ou longo prazo e acompanhe a sua evolução académica e pessoal.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="w-full sm:w-auto px-4 py-2.5 bg-[#0B2545] hover:bg-brand-primary-light text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-md flex items-center justify-center gap-1.5 transition-all"
        >
          <Plus size={14} strokeWidth={2.5} />
          Criar Nova Meta
        </button>
      </div>

      {/* Main Grid View */}
      {goals.length === 0 ? (
        <EmptyState
          iconName="Target"
          title="Nenhuma meta financeira registada"
          description="Deseja comprar um laptop, pagar o seu próximo semestre ou criar um fundo de reserva? Comece hoje mesmo a planear as suas poupanças!"
          actionLabel="Criar Primeira Meta"
          onAction={handleOpenAdd}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((g) => {
            const percent = (g.currentAmount / g.targetAmount) * 100;
            const isCompleted = g.currentAmount >= g.targetAmount;
            const remaining = Math.max(0, g.targetAmount - g.currentAmount);

            return (
              <div 
                key={g.id} 
                className={`bg-white dark:bg-slate-900 rounded-xl border p-5 flex flex-col justify-between shadow-xs hover:shadow-md transition-all relative overflow-hidden
                  ${isCompleted ? 'border-emerald-250 dark:border-emerald-800/40 bg-emerald-50/5' : 'border-slate-200 dark:border-slate-800/80'}
                `}
              >
                {/* Decoration badge for complete */}
                {isCompleted && (
                  <div className="absolute right-0 top-0 bg-emerald-500 text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-bl-lg flex items-center gap-1">
                    <Award size={10} />
                    Completa
                  </div>
                )}

                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl shadow-inner ${isCompleted ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 dark:bg-slate-800 text-[#0B2545] dark:text-amber-400'}`}>
                        <Target size={18} />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 max-w-[140px] truncate">{g.name}</h3>
                        <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mt-0.5">Fundo Dedicado</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(g)}
                        className="p-1 text-slate-400 hover:text-[#0B2545] dark:hover:text-amber-400 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800"
                        title="Editar meta"
                      >
                        <Edit3 size={13} />
                      </button>
                      <button
                        onClick={() => deleteGoal(g.id)}
                        className="p-1 text-slate-400 hover:text-rose-500 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800"
                        title="Remover meta"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Summary amount values inside clean card */}
                  <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-800 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/60 my-4 text-xs font-mono font-medium leading-normal">
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider font-sans mb-1">Total Poupado</p>
                      <span className="text-slate-800 dark:text-slate-150 tabular-nums">{g.currentAmount.toLocaleString('pt-MZ')} MZN</span>
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider font-sans mb-1">Objetivo</p>
                      <span className="text-slate-800 dark:text-slate-150 tabular-nums">{g.targetAmount.toLocaleString('pt-MZ')} MZN</span>
                    </div>
                  </div>

                  {/* Deadline info */}
                  {g.deadline && (
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium mb-3">
                      <span>Prazo final:</span>
                      <strong className="text-slate-600 dark:text-slate-300 font-bold">
                        {new Date(g.deadline).toLocaleDateString('pt-MZ')}
                      </strong>
                    </div>
                  )}

                  {/* Progress slider bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-mono font-bold text-slate-400">
                      <span>Progresso da meta</span>
                      <span>{percent.toFixed(1)}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${isCompleted ? 'bg-emerald-500' : 'bg-amber-500'}`}
                        style={{ width: `${Math.min(100, percent)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Quick Add Funds Buttons */}
                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                  <button
                    onClick={() => handleOpenDeposit(g.id)}
                    className="flex-1 py-1.5 px-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-800 text-[#0B2545] dark:text-amber-400 text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5"
                  >
                    <PiggyBank size={14} />
                    Poupar / Reforçar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* --- GOAL SETUP MODAL --- */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-scale-in">
            <div className="flex justify-between items-center bg-[#0B2545] text-white px-5 py-4">
              <h3 className="font-serif text-sm font-bold tracking-tight">
                {editingGoal ? 'Editar Meta Financeira' : 'Criar Nova Meta'}
              </h3>
              <button 
                onClick={() => setIsFormOpen(false)}
                className="text-slate-300 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Nome da Meta / Objetivo *
                </label>
                <input
                  type="text"
                  required
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                  placeholder="Ex: Pagamento Propina 2º Semestre"
                  className="block w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Valor Objetivo (MZN) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={goalTarget || ''}
                    onChange={(e) => setGoalTarget(Math.max(0, parseFloat(e.target.value) || 0))}
                    placeholder="Ex: 15000"
                    className="block w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-mono font-bold tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Valor Inicial Poupança
                  </label>
                  <input
                    type="number"
                    value={goalCurrent || ''}
                    onChange={(e) => setGoalCurrent(Math.max(0, parseFloat(e.target.value) || 0))}
                    disabled={!!editingGoal}
                    placeholder="Ex: 500"
                    className="block w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-mono font-bold tabular-nums disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Prazo Limite / Data Alvo (Opcional)
                </label>
                <input
                  type="date"
                  value={goalDeadline}
                  onChange={(e) => setGoalDeadline(e.target.value)}
                  className="block w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg text-xs"
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
                  {editingGoal ? 'Guardar' : 'Criar Meta'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ADD SAVINGS DEPOSIT MODAL --- */}
      {depositGoalId && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white rounded-2xl shadow-2xl w-full max-w-xs overflow-hidden animate-scale-in">
            <div className="flex justify-between items-center bg-[#0B2545] text-white px-5 py-4">
              <h3 className="font-serif text-xs font-bold tracking-tight">Guardar Poupança</h3>
              <button 
                onClick={() => setDepositGoalId(null)}
                className="text-slate-300 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleDepositSubmit} className="p-4 space-y-4">
              <div className="p-3 bg-amber-50 dark:bg-amber-950/20 text-amber-900 dark:text-amber-200 rounded-xl border border-amber-100 dark:border-amber-900/50 flex items-start gap-2.5">
                <Sparkles size={16} className="shrink-0 text-amber-500 mt-0.5" />
                <p className="text-[10px] leading-relaxed font-semibold">
                  Esta quantia será registada como canalizada para a sua meta, reduzindo proporcionalmente o valor em falta.
                </p>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Valor a Depositar (MZN) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={depositAmount || ''}
                  onChange={(e) => {
                    const val = Math.max(0, parseFloat(e.target.value) || 0);
                    setDepositAmount(val);
                  }}
                  placeholder="Ex: 500"
                  className="block w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-mono font-bold tabular-nums"
                />
              </div>

              <div className="flex gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setDepositGoalId(null)}
                  className="flex-1 py-2 px-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold uppercase tracking-wider rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-3 bg-[#0B2545] text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-brand-primary-light"
                >
                  Depositar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
