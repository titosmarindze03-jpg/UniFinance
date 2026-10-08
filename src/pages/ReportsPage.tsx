/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useFinance } from '../contexts/FinanceContext';
import { 
  PieChart, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  ShieldAlert, 
  Sparkles, 
  CheckCircle,
  HelpCircle,
  Info,
  AlertTriangle
} from 'lucide-react';
import * as Icons from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { transactions, categories, budgets, currency, totalReceitas, totalDespesas } = useFinance();
  const [period, setPeriod] = useState<'month' | 'quarter' | 'year'>('month');

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  // --- 1. FILTER TRANSACTIONS ACCORDING TO SELECTED REPORTING WINDOW ---
  const reportTransactions = transactions.filter(tx => {
    const txDateObj = new Date(tx.date);
    if (period === 'month') {
      return txDateObj.getMonth() === currentMonth && txDateObj.getFullYear() === currentYear;
    } else if (period === 'quarter') {
      // Last 3 months
      const diffTime = Math.abs(Date.now() - txDateObj.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 90;
    } else {
      // Whole year
      return txDateObj.getFullYear() === currentYear;
    }
  });

  const periodReceitas = reportTransactions
    .filter(tx => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const periodDespesas = reportTransactions
    .filter(tx => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0);

  // --- 2. CALCULATE FINANCIAL HEALTH RATING ---
  // Excellent: Income > Expense and Savings rate >= 30%
  // Stable: Income > Expense and Savings rate between 0% and 30%
  // Risky: Expense > Income but by less than 15%
  // Critical: Expense > Income by more than 15% OR Zero Income with high expenses
  let healthRating: 'excellent' | 'stable' | 'risky' | 'critical' = 'stable';
  let ratingLabel = 'Estável / Equilibrado';
  let ratingColor = 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/50';
  let healthFeedback = 'O seu nível de gastos está proporcional às suas receitas. Mantenha o controlo!';

  if (periodReceitas > 0) {
    const savingsRate = (1 - (periodDespesas / periodReceitas)) * 100;
    if (savingsRate >= 30) {
      healthRating = 'excellent';
      ratingLabel = 'Excelente Saúde Financeira';
      ratingColor = 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/50';
      healthFeedback = 'Parabéns! Poupa mais de 30% dos seus rendimentos. Está num rumo de investimento seguro!';
    } else if (savingsRate < 0) {
      const deficitPercent = (periodDespesas - periodReceitas) / periodReceitas * 100;
      if (deficitPercent > 15) {
        healthRating = 'critical';
        ratingLabel = 'Saúde Crítica';
        ratingColor = 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/50';
        healthFeedback = 'Alerta: As suas despesas excederam as receitas em mais de 15%. Reduza gastos imediatos e ative orçamentos!';
      } else {
        healthRating = 'risky';
        ratingLabel = 'Situação de Risco';
        ratingColor = 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/50';
        healthFeedback = 'Atenção: Os seus gastos ultrapassaram ligeiramente as receitas. Evite contrair dívidas desnecessárias.';
      }
    }
  } else if (periodDespesas > 0) {
    healthRating = 'critical';
    ratingLabel = 'Saúde Crítica';
    ratingColor = 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/50';
    healthFeedback = 'Alerta: Registou despesas mas não possui nenhuma entrada financeira neste período. Encontre novas fontes!';
  }

  // --- 3. CATEGORIZED EXPENSE BREAKDOWN (percentage & sum) ---
  const catBreakdown: { [key: string]: { name: string; amount: number; percentage: number; icon: string } } = {};
  
  const expenseTX = reportTransactions.filter(tx => tx.type === 'expense');
  expenseTX.forEach(tx => {
    const cat = categories.find(c => c.id === tx.categoryId);
    const catId = tx.categoryId;
    if (!catBreakdown[catId]) {
      catBreakdown[catId] = {
        name: cat?.name || 'Geral',
        amount: 0,
        percentage: 0,
        icon: cat?.icon || 'HelpCircle'
      };
    }
    catBreakdown[catId].amount += tx.amount;
  });

  // Calculate percentages
  const totalCatAmount = Object.values(catBreakdown).reduce((sum, item) => sum + item.amount, 0);
  Object.keys(catBreakdown).forEach(key => {
    catBreakdown[key].percentage = totalCatAmount > 0 
      ? (catBreakdown[key].amount / totalCatAmount) * 100 
      : 0;
  });

  const sortedBreakdown = Object.values(catBreakdown).sort((a, b) => b.amount - a.amount);

  // --- 4. PREDEFINED SYSTEM INTELLIGENT INSIGHTS ---
  const smartInsights: string[] = [];
  
  if (sortedBreakdown.length > 0) {
    const topExp = sortedBreakdown[0];
    if (topExp.percentage >= 35) {
      smartInsights.push(`Gasta consideravelmente em ${topExp.name} (${topExp.percentage.toFixed(0)}% do seu total). Tente pesquisar alternativas mais económicas.`);
    }
  }

  // Check if budgets are near or exceeded
  budgets.forEach(b => {
    const cat = categories.find(c => c.id === b.categoryId);
    const spent = reportTransactions
      .filter(tx => tx.categoryId === b.categoryId && tx.type === 'expense')
      .reduce((sum, tx) => sum + tx.amount, 0);
    
    if (spent > b.amount) {
      smartInsights.push(`Ultrapassou o limite orçamental definido para ${cat?.name || 'Categoria'}. Evite novos lançamentos nesta área.`);
    } else if (spent >= b.amount * 0.8) {
      smartInsights.push(`O seu orçamento de ${cat?.name || 'Categoria'} está quase esgotado (mais de 80% consumido).`);
    }
  });

  // Internet packages reminder check
  const internetSpent = reportTransactions
    .filter(tx => tx.categoryId === 'exp-internet')
    .reduce((sum, tx) => sum + tx.amount, 0);
  if (internetSpent > 1200) {
    smartInsights.push('Gastou mais de 1.200 MZN em pacotes de internet. Sugerimos verificar planos mensais académicos mais vantajosos.');
  }

  // Fallback insights if list is empty
  if (smartInsights.length === 0) {
    smartInsights.push('Excelente controlo financeiro geral. Não existem desvios importantes detetados nas suas contas.');
    smartInsights.push('Recomenda-se manter o registo pontual de cada despesa diária para manter os relatórios exatos.');
  }

  const renderIcon = (iconName: string, className = '') => {
    const LucideIcon = (Icons as any)[iconName] || HelpCircle;
    return <LucideIcon size={16} className={className} />;
  };

  return (
    <div className="space-y-6">
      
      {/* Reporting Control Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold font-serif text-slate-800 dark:text-white leading-none">Relatórios Financeiros</h1>
          <p className="text-xs text-slate-400 mt-1">Estatísticas detalhadas sobre rendimentos, padrões de consumo e alertas automáticos.</p>
        </div>
        
        {/* Reporting Period Tabs */}
        <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-lg w-full sm:w-auto">
          <button
            onClick={() => setPeriod('month')}
            className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${period === 'month' ? 'bg-white dark:bg-slate-800 text-[#0B2545] dark:text-amber-400 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Este Mês
          </button>
          <button
            onClick={() => setPeriod('quarter')}
            className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${period === 'quarter' ? 'bg-white dark:bg-slate-800 text-[#0B2545] dark:text-amber-400 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Últimos 90 dias
          </button>
          <button
            onClick={() => setPeriod('year')}
            className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${period === 'year' ? 'bg-white dark:bg-slate-800 text-[#0B2545] dark:text-amber-400 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Este Ano
          </button>
        </div>
      </div>

      {/* 1. FINANCIAL HEALTH ASSESSMENT SCREEN */}
      <div className={`p-5 rounded-xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all duration-300 ${ratingColor}`}>
        <div className="flex-1 space-y-1">
          <span className="text-[9px] font-bold uppercase tracking-widest block text-slate-400">Diagnóstico de Saúde Financeira</span>
          <h3 className="text-base font-bold font-serif tracking-tight leading-none mb-1.5 flex items-center gap-2">
            <span>{ratingLabel}</span>
            <span className="text-xs">·</span>
            <span className="font-mono text-xs font-bold font-sans">Setembro</span>
          </h3>
          <p className="text-xs leading-relaxed max-w-2xl font-medium opacity-90">{healthFeedback}</p>
        </div>
        
        {/* Core summary values */}
        <div className="flex gap-5 shrink-0 pl-0 md:pl-6 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 pt-4 md:pt-0 w-full md:w-auto">
          <div>
            <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold block">Recebido</span>
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
              +{periodReceitas.toLocaleString('pt-MZ')} MZN
            </span>
          </div>
          <div>
            <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold block">Gasto</span>
            <span className="text-xs font-mono font-bold text-rose-500 tabular-nums">
              -{periodDespesas.toLocaleString('pt-MZ')} MZN
            </span>
          </div>
        </div>
      </div>

      {/* 2. CATEGORY BREAKDOWN VISUAL MAP & RECENT ALERTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Column 1 & 2: Category Breakdown Diagram */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800/80 lg:col-span-2 shadow-xs">
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <PieChart size={14} className="text-[#0B2545] dark:text-amber-400" />
            Distribuição de Despesas por Categoria
          </h3>

          {sortedBreakdown.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-16">Não possui gastos registados neste período para apresentar estatísticas.</p>
          ) : (
            <div className="space-y-4">
              {/* Dynamic bar breakdown displaying exactly category proportion ratios */}
              {sortedBreakdown.map(item => (
                <div key={item.name} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-medium">
                    <div className="flex items-center gap-2">
                      <div className="p-1 bg-slate-50 dark:bg-slate-800 text-slate-600 rounded">
                        {renderIcon(item.icon)}
                      </div>
                      <span className="text-slate-700 dark:text-slate-200">{item.name}</span>
                    </div>
                    <div className="text-right flex items-center gap-3">
                      <span className="font-mono text-slate-400 text-[10px]">{item.percentage.toFixed(1)}%</span>
                      <strong className="font-mono text-slate-800 dark:text-slate-100 tabular-nums">{item.amount.toLocaleString('pt-MZ')} MZN</strong>
                    </div>
                  </div>
                  
                  {/* Progress Line Bar */}
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-brand-primary dark:bg-amber-400 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Column 3: Intelligent AI-like Warnings Insights */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800/80 lg:col-span-1 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Sparkles size={16} className="text-amber-500 animate-pulse" />
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider leading-none">
                Recomendações e Insights
              </h3>
            </div>

            <div className="space-y-3.5">
              {smartInsights.map((insight, index) => (
                <div 
                  key={index}
                  className="p-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800/60 rounded-xl text-xs leading-relaxed text-slate-600 dark:text-slate-350 flex items-start gap-2.5 hover:border-slate-200 transition-all"
                >
                  <AlertTriangle size={15} className="text-amber-500 shrink-0 mt-0.5" />
                  <span>{insight}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-6 text-[10px] text-slate-400 leading-relaxed italic flex items-center gap-1.5">
            <Info size={12} className="text-slate-400 shrink-0" />
            <span>Conselhos baseados no seu histórico pessoal de consumo.</span>
          </div>
        </div>
      </div>

    </div>
  );
};
