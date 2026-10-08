/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useFinance } from '../contexts/FinanceContext';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Target, 
  Bell, 
  Plus, 
  ArrowRight, 
  ArrowUpRight, 
  ArrowDownRight,
  Sparkles,
  Award,
  HelpCircle
} from 'lucide-react';
import * as Icons from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { 
    user, 
    transactions, 
    categories, 
    goals, 
    budgets, 
    notifications, 
    currency, 
    saldoAtual, 
    totalReceitas, 
    totalDespesas, 
    totalDestinadoMetas, 
    setActivePage,
    clearNotif
  } = useFinance();

  // Get active notifications (unread or recent warning/danger)
  const activeAlerts = notifications.filter(n => !n.read && ['warning', 'danger'].includes(n.type)).slice(0, 3);

  // Get last 5 transactions
  const recentTransactions = transactions.slice(0, 5);

  // Calculate top spending category for the current month
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const categoryTotals: { [key: string]: number } = {};

  transactions
    .filter(tx => 
      tx.type === 'expense' && 
      new Date(tx.date).getMonth() === currentMonth && 
      new Date(tx.date).getFullYear() === currentYear
    )
    .forEach(tx => {
      categoryTotals[tx.categoryId] = (categoryTotals[tx.categoryId] || 0) + tx.amount;
    });

  const sortedCategories = Object.entries(categoryTotals)
    .map(([id, amount]) => {
      const cat = categories.find(c => c.id === id);
      return {
        id,
        name: cat?.name || 'Outros',
        icon: cat?.icon || 'HelpCircle',
        amount
      };
    })
    .sort((a, b) => b.amount - a.amount);

  const topExpenseCategory = sortedCategories[0]?.name || 'Nenhuma';

  // Find top single transaction
  const currentMonthExpenses = transactions.filter(tx => 
    tx.type === 'expense' && 
    new Date(tx.date).getMonth() === currentMonth && 
    new Date(tx.date).getFullYear() === currentYear
  );
  
  const topSingleExpense = currentMonthExpenses.length > 0 
    ? [...currentMonthExpenses].sort((a, b) => b.amount - a.amount)[0] 
    : null;

  // Render dynamic Lucide Icon helper
  const renderIcon = (iconName: string, className = '') => {
    const LucideIcon = (Icons as any)[iconName] || HelpCircle;
    return <LucideIcon size={16} className={className} />;
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Welcome Header Section */}
      <div className="bg-gradient-to-r from-[#0B2545] to-[#1E3E62] text-white p-6 rounded-2xl shadow-md border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 translate-x-12 -translate-y-6 select-none pointer-events-none">
          <Sparkles size={200} />
        </div>
        <div className="relative z-10">
          <h1 className="font-serif text-2xl font-bold tracking-tight">
            Olá, {user?.name || 'Utilizador'}! 👋
          </h1>
          <p className="text-slate-300 text-xs mt-1">
            {transactions.length === 0 
              ? 'Bem-vindo ao UniFinance. Registe a sua primeira transação para começar.' 
              : 'Aqui está o resumo financeiro das suas contas em Moçambique.'
            }
          </p>
        </div>
        <div className="flex gap-2 relative z-10">
          <button
            onClick={() => setActivePage('income')}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-[#0B2545] font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 shadow-md active:scale-95"
          >
            <Plus size={14} strokeWidth={2.5} />
            Registar Receita
          </button>
          <button
            onClick={() => setActivePage('expenses')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-lg border border-slate-700 transition-all flex items-center gap-1.5 active:scale-95"
          >
            <Plus size={14} strokeWidth={2} />
            Registar Despesa
          </button>
        </div>
      </div>

      {/* 2. Top Banner Alerts Panel (non-intrusive) */}
      {activeAlerts.length > 0 && (
        <div className="space-y-2 animate-fade-in">
          {activeAlerts.map(alert => (
            <div 
              key={alert.id}
              className={`flex items-start justify-between p-3.5 rounded-xl border text-xs font-medium ${
                alert.type === 'danger' 
                  ? 'bg-rose-50 border-rose-100 text-rose-800 dark:bg-rose-950/20 dark:border-rose-900/50 dark:text-rose-200' 
                  : 'bg-amber-50 border-amber-100 text-amber-800 dark:bg-amber-950/20 dark:border-amber-900/50 dark:text-amber-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Bell size={14} className={alert.type === 'danger' ? 'text-rose-500' : 'text-amber-500'} />
                <span>{alert.message}</span>
              </div>
              <button 
                onClick={() => clearNotif(alert.id)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors shrink-0 font-semibold"
              >
                Dispensar
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 3. Core Financial KPI Cards (Automatic Recalculations) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* CARD 1: Saldo atual (Saldo Inicial + Receitas - Despesas) */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800/80 shadow-xs flex flex-col justify-between group hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-250">
          <div className="flex justify-between items-start mb-3">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Saldo Geral Disponível</span>
              <span className="text-xs text-slate-400">Total calculado em tempo real</span>
            </div>
            <div className="p-2 bg-slate-50 dark:bg-slate-800 text-brand-primary dark:text-amber-400 rounded-lg shadow-inner shrink-0">
              <Wallet size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-mono font-bold tracking-tight text-slate-900 dark:text-white tabular-nums leading-none">
              {saldoAtual.toLocaleString('pt-MZ', { minimumFractionDigits: 2 })} <span className="text-xs font-sans text-slate-400">{currency}</span>
            </h3>
            <div className="flex items-center gap-1.5 mt-2">
              <span className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded ${saldoAtual >= 0 ? 'bg-emerald-100/60 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300' : 'bg-rose-100/60 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300'}`}>
                {saldoAtual >= 0 ? 'Positivo' : 'Negativo'}
              </span>
              <span className="text-[10px] text-slate-400">Saldo inicial: {user?.saldoInicial?.toLocaleString('pt-MZ') || 0} MZN</span>
            </div>
          </div>
        </div>

        {/* CARD 2: Total Receitas */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800/80 shadow-xs flex flex-col justify-between group hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-250">
          <div className="flex justify-between items-start mb-3">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Receitas</span>
              <span className="text-xs text-slate-400">Ganhos registados</span>
            </div>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-lg shrink-0">
              <TrendingUp size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-mono font-bold tracking-tight text-emerald-600 dark:text-emerald-400 tabular-nums leading-none">
              +{totalReceitas.toLocaleString('pt-MZ', { minimumFractionDigits: 2 })} <span className="text-xs font-sans text-slate-400">{currency}</span>
            </h3>
            <button 
              onClick={() => setActivePage('income')}
              className="text-[10px] font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 mt-2.5 flex items-center gap-1"
            >
              Ver receitas <ArrowRight size={10} />
            </button>
          </div>
        </div>

        {/* CARD 3: Total Despesas */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800/80 shadow-xs flex flex-col justify-between group hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-250">
          <div className="flex justify-between items-start mb-3">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Despesas</span>
              <span className="text-xs text-slate-400">Gastos efetuados</span>
            </div>
            <div className="p-2 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-lg shrink-0">
              <TrendingDown size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-mono font-bold tracking-tight text-rose-600 dark:text-rose-400 tabular-nums leading-none">
              -{totalDespesas.toLocaleString('pt-MZ', { minimumFractionDigits: 2 })} <span className="text-xs font-sans text-slate-400">{currency}</span>
            </h3>
            <button 
              onClick={() => setActivePage('expenses')}
              className="text-[10px] font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 mt-2.5 flex items-center gap-1"
            >
              Ver despesas <ArrowRight size={10} />
            </button>
          </div>
        </div>

        {/* CARD 4: Valor Destinado a Metas */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800/80 shadow-xs flex flex-col justify-between group hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-250">
          <div className="flex justify-between items-start mb-3">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Destinado a Metas</span>
              <span className="text-xs text-slate-400">Total poupado / guardado</span>
            </div>
            <div className="p-2 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-lg shrink-0">
              <Target size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-mono font-bold tracking-tight text-amber-600 dark:text-amber-400 tabular-nums leading-none">
              {totalDestinadoMetas.toLocaleString('pt-MZ', { minimumFractionDigits: 2 })} <span className="text-xs font-sans text-slate-400">{currency}</span>
            </h3>
            <button 
              onClick={() => setActivePage('goals')}
              className="text-[10px] font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 mt-2.5 flex items-center gap-1"
            >
              Ver metas criadas <ArrowRight size={10} />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Monthly Financial Health Summary Section */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800/80 shadow-xs">
        <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Award size={14} className="text-brand-accent" />
          Resumo de Saúde Financeira ({
            ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'][new Date().getMonth()]
          })
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-800/50 flex justify-between items-center">
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Maior Categoria de Gasto</p>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-200 mt-1">{topExpenseCategory}</p>
            </div>
            <span className="text-2xl">🍲</span>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-800/50 flex justify-between items-center">
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Maior Despesa Única</p>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-200 mt-1 truncate max-w-[180px]">
                {topSingleExpense ? topSingleExpense.description : 'Nenhuma'}
              </p>
            </div>
            <span className="font-mono text-xs font-bold text-rose-500 tabular-nums">
              {topSingleExpense ? `-${topSingleExpense.amount.toLocaleString('pt-MZ')} MZN` : '-'}
            </span>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-800/50 flex flex-col justify-center">
            <div className="flex justify-between text-xs mb-1 font-medium">
              <span className="text-slate-500">Taxa de Poupança</span>
              <span className="font-mono text-[#0B2545] dark:text-amber-400 font-bold">
                {totalReceitas > 0 ? ((1 - (totalDespesas / totalReceitas)) * 100).toFixed(1) : '0.0'}%
              </span>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: `${totalReceitas > 0 ? Math.max(0, Math.min(100, (1 - (totalDespesas / totalReceitas)) * 100)) : 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 5. Last Transactions & Active Goals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Columns 1 & 2: Recent Transactions */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800/80 lg:col-span-2 shadow-xs">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Últimos Movimentos
            </h3>
            <button
              onClick={() => setActivePage('transactions')}
              className="text-[10px] font-bold text-[#0B2545] dark:text-amber-400 hover:underline flex items-center gap-1"
            >
              Ver Todas
              <ArrowRight size={12} />
            </button>
          </div>

          <div className="overflow-x-auto">
            {recentTransactions.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                Nenhuma movimentação registada. Clique em "+ Registar" para começar!
              </div>
            ) : (
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase text-[9px] font-bold tracking-wider">
                    <th className="pb-2">Data</th>
                    <th className="pb-2">Descrição</th>
                    <th className="pb-2">Categoria</th>
                    <th className="pb-2">Método</th>
                    <th className="pb-2 text-right">Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {recentTransactions.map((tx) => {
                    const cat = categories.find(c => c.id === tx.categoryId);
                    return (
                      <tr key={tx.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all">
                        <td className="py-3 font-medium text-slate-400">
                          {new Date(tx.date).toLocaleDateString('pt-MZ')}
                        </td>
                        <td className="py-3 font-semibold text-slate-700 dark:text-slate-200">
                          {tx.description}
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            {cat ? renderIcon(cat.icon, 'text-[#0B2545] dark:text-amber-400') : null}
                            <span className="text-slate-500 dark:text-slate-400">{cat?.name || 'Geral'}</span>
                          </div>
                        </td>
                        <td className="py-3 text-slate-500">
                          {tx.paymentMethod}
                        </td>
                        <td className={`py-3 text-right font-mono font-bold tabular-nums ${tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                          {tx.type === 'income' ? '+' : '-'}{tx.amount.toLocaleString('pt-MZ', { minimumFractionDigits: 2 })} MZN
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Column 3: Active Goals progress */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800/80 lg:col-span-1 shadow-xs">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Objetivos & Metas
            </h3>
            <button
              onClick={() => setActivePage('goals')}
              className="text-[10px] font-bold text-[#0B2545] dark:text-amber-400 hover:underline"
            >
              Gerir Metas
            </button>
          </div>

          {goals.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              Sem metas definidas de momento. Planeie os seus investimentos futuros!
            </div>
          ) : (
            <div className="space-y-4">
              {goals.slice(0, 3).map(goal => {
                const percent = (goal.currentAmount / goal.targetAmount) * 100;
                const faltante = goal.targetAmount - goal.currentAmount;
                return (
                  <div key={goal.id} className="p-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800/60 rounded-xl">
                    <div className="flex justify-between items-start mb-1.5">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate max-w-[140px] block">
                        {goal.name}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-slate-400">
                        {percent.toFixed(0)}%
                      </span>
                    </div>
                    
                    <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-750 rounded-full overflow-hidden mb-2">
                      <div 
                        className="h-full bg-amber-500 rounded-full"
                        style={{ width: `${Math.min(100, percent)}%` }}
                      />
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-medium font-mono">
                      <span>{goal.currentAmount.toLocaleString('pt-MZ')} MZN guardados</span>
                      <span>Objetivo: {goal.targetAmount.toLocaleString('pt-MZ')} MZN</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
};
