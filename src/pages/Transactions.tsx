/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useFinance } from '../contexts/FinanceContext';
import { Transaction } from '../types/finance';
import { 
  Search, 
  Filter, 
  Trash2, 
  Edit3, 
  TrendingUp, 
  TrendingDown, 
  X, 
  Plus, 
  HelpCircle, 
  Info,
  Calendar,
  Eye,
  AlertCircle
} from 'lucide-react';
import * as Icons from 'lucide-react';
import { EmptyState } from '../components/EmptyState';

export const Transactions: React.FC = () => {
  const { 
    transactions, 
    categories, 
    currency, 
    addTransaction, 
    updateTransaction, 
    deleteTransaction,
    addToast
  } = useFinance();

  // Filter States
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterPeriod, setFilterPeriod] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Modal / Interaction States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Form Fields
  const [txType, setTxType] = useState<'income' | 'expense'>('expense');
  const [txDescription, setTxDescription] = useState('');
  const [txAmount, setTxAmount] = useState<number>(0);
  const [txCategoryId, setTxCategoryId] = useState('');
  const [txPaymentMethod, setTxPaymentMethod] = useState('M-Pesa');
  const [txDate, setTxDate] = useState(new Date().toISOString().split('T')[0]);
  const [txNotes, setTxNotes] = useState('');

  // Payment Methods Available
  const paymentMethods = ['M-Pesa', 'e-Mola', 'mKesh', 'Dinheiro', 'Transferência Bancária', 'Cartão de Crédito/Débito'];

  const resetForm = () => {
    setEditingTransaction(null);
    setTxType('expense');
    setTxDescription('');
    setTxAmount(0);
    // Select first expense category as default
    const firstExp = categories.find(c => c.type === 'expense');
    setTxCategoryId(firstExp ? firstExp.id : '');
    setTxPaymentMethod('M-Pesa');
    setTxDate(new Date().toISOString().split('T')[0]);
    setTxNotes('');
  };

  const handleOpenAdd = (type: 'income' | 'expense' = 'expense') => {
    resetForm();
    setTxType(type);
    const firstCat = categories.find(c => c.type === type);
    setTxCategoryId(firstCat ? firstCat.id : '');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (tx: Transaction) => {
    setEditingTransaction(tx);
    setTxType(tx.type);
    setTxDescription(tx.description);
    setTxAmount(tx.amount);
    setTxCategoryId(tx.categoryId);
    setTxPaymentMethod(tx.paymentMethod);
    setTxDate(tx.date);
    setTxNotes(tx.notes || '');
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!txDescription || txAmount <= 0 || !txCategoryId) {
      addToast('Por favor preencha todos os campos obrigatórios com valores válidos.', 'warning');
      return;
    }

    const txPayload = {
      type: txType,
      description: txDescription,
      amount: txAmount,
      categoryId: txCategoryId,
      paymentMethod: txPaymentMethod,
      date: txDate,
      notes: txNotes
    };

    try {
      if (editingTransaction) {
        await updateTransaction(editingTransaction.id, txPayload);
      } else {
        await addTransaction(txPayload);
      }
      setIsFormOpen(false);
      resetForm();
    } catch {
      // Handled inside context
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTransaction(id);
      setConfirmDeleteId(null);
    } catch {
      addToast('Erro ao remover a movimentação.', 'error');
    }
  };

  // Switch categories dynamically when type changes
  const handleTypeChangeInForm = (type: 'income' | 'expense') => {
    setTxType(type);
    const firstCat = categories.find(c => c.type === type);
    setTxCategoryId(firstCat ? firstCat.id : '');
  };

  // --- COMPREHENSIVE FILTER ENGINE ---
  const filteredTransactions = transactions
    .filter((tx) => {
      // 1. Search Query
      const matchSearch = tx.description.toLowerCase().includes(search.toLowerCase()) || 
                          (tx.notes && tx.notes.toLowerCase().includes(search.toLowerCase()));
      
      // 2. Type Filter
      const matchType = filterType === 'all' ? true : tx.type === filterType;
      
      // 3. Category Filter
      const matchCategory = filterCategory === 'all' ? true : tx.categoryId === filterCategory;

      // 4. Period Filter
      let matchPeriod = true;
      if (filterPeriod !== 'all') {
        const txDateObj = new Date(tx.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (filterPeriod === 'today') {
          const txDay = new Date(tx.date);
          txDay.setHours(0,0,0,0);
          matchPeriod = txDay.getTime() === today.getTime();
        } else if (filterPeriod === 'week') {
          const diffTime = Math.abs(today.getTime() - txDateObj.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          matchPeriod = diffDays <= 7;
        } else if (filterPeriod === 'month') {
          matchPeriod = txDateObj.getMonth() === today.getMonth() && txDateObj.getFullYear() === today.getFullYear();
        }
      }

      return matchSearch && matchType && matchCategory && matchPeriod;
    })
    .sort((a, b) => {
      const timeA = new Date(a.date).getTime();
      const timeB = new Date(b.date).getTime();
      return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
    });

  // Dynamically resolve Lucide icon
  const renderIcon = (iconName: string, className = '') => {
    const LucideIcon = (Icons as any)[iconName] || HelpCircle;
    return <LucideIcon size={16} className={className} />;
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner Control Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold font-serif text-slate-800 dark:text-white leading-none">Lançamentos Financeiros</h1>
          <p className="text-xs text-slate-400 mt-1">Consulte, filtre e administre todas as suas movimentações de entradas e saídas.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={() => handleOpenAdd('income')}
            className="flex-1 sm:flex-initial px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-lg shadow-xs flex items-center justify-center gap-1.5 transition-all"
          >
            <Plus size={14} strokeWidth={2.5} />
            Nova Receita
          </button>
          <button
            onClick={() => handleOpenAdd('expense')}
            className="flex-1 sm:flex-initial px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-lg shadow-xs flex items-center justify-center gap-1.5 transition-all"
          >
            <Plus size={14} strokeWidth={2.5} />
            Nova Despesa
          </button>
        </div>
      </div>

      {/* Advanced Filter Toolbox Card */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 shadow-xs space-y-4">
        
        {/* Row 1: Search & Type tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Search text query */}
          <div className="relative md:col-span-1">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <Search size={15} />
            </span>
            <input
              type="text"
              placeholder="Pesquisar por descrição ou nota..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg text-xs"
            />
          </div>

          {/* Interactive filter type buttons (Design guidelines: interactive tabs allowed!) */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg w-full md:col-span-1">
            <button
              onClick={() => setFilterType('all')}
              className={`flex-1 text-center py-1 rounded-md text-[11px] font-semibold transition-colors whitespace-nowrap cursor-pointer ${filterType === 'all' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilterType('income')}
              className={`flex-1 text-center py-1 rounded-md text-[11px] font-semibold transition-colors whitespace-nowrap cursor-pointer ${filterType === 'income' ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Receitas
            </button>
            <button
              onClick={() => setFilterType('expense')}
              className={`flex-1 text-center py-1 rounded-md text-[11px] font-semibold transition-colors whitespace-nowrap cursor-pointer ${filterType === 'expense' ? 'bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Despesas
            </button>
          </div>

          {/* Period selector */}
          <div className="flex items-center gap-2 md:col-span-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Período:</span>
            <select
              value={filterPeriod}
              onChange={(e: any) => setFilterPeriod(e.target.value)}
              className="flex-1 py-2 px-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg text-xs"
            >
              <option value="all">Todo o histórico</option>
              <option value="today">Hoje</option>
              <option value="week">Últimos 7 dias</option>
              <option value="month">Este mês</option>
            </select>
          </div>
        </div>

        {/* Row 2: Category & Sort order */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100 dark:border-slate-800">
          
          <div className="flex flex-wrap items-center gap-4">
            {/* Category dropdown selector */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-slate-400">Filtrar Categoria:</span>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="py-1.5 px-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg text-xs"
              >
                <option value="all">Todas as Categorias</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.type === 'income' ? 'R' : 'D'})</option>
                ))}
              </select>
            </div>

            {/* Sorting toggle */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-slate-400">Ordenar por Data:</span>
              <button
                onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
                className="py-1.5 px-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                {sortOrder === 'desc' ? 'Mais recentes primeiro' : 'Mais antigas primeiro'}
              </button>
            </div>
          </div>

          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
            {filteredTransactions.length} registos encontrados
          </span>
        </div>
      </div>

      {/* Main Ledger Database Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800/80 shadow-xs overflow-hidden">
        {filteredTransactions.length === 0 ? (
          <EmptyState
            iconName="ArrowLeftRight"
            title="Nenhuma movimentação encontrada"
            description="Experimente ajustar os filtros ou registe o seu primeiro movimento financeiro clicando no botão abaixo."
            actionLabel="Adicionar Lançamento"
            onAction={() => handleOpenAdd('expense')}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[700px]">
              <thead className="bg-slate-50/60 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-800">
                <tr className="text-slate-400 uppercase text-[9px] font-bold tracking-wider">
                  <th className="py-3 px-4">Data</th>
                  <th className="py-3 px-4">Descrição</th>
                  <th className="py-3 px-4">Categoria</th>
                  <th className="py-3 px-4">Tipo</th>
                  <th className="py-3 px-4">Método</th>
                  <th className="py-3 px-4 text-right">Valor</th>
                  <th className="py-3 px-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredTransactions.map((tx) => {
                  const cat = categories.find(c => c.id === tx.categoryId);
                  const isDeleting = confirmDeleteId === tx.id;

                  return (
                    <tr 
                      key={tx.id} 
                      className={`hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all ${isDeleting ? 'bg-rose-500/5 dark:bg-rose-950/10' : ''}`}
                    >
                      {/* Date */}
                      <td className="py-4 px-4 font-medium text-slate-400 whitespace-nowrap">
                        {new Date(tx.date).toLocaleDateString('pt-MZ')}
                      </td>
                      
                      {/* Description with notes fallback */}
                      <td className="py-4 px-4 font-semibold text-slate-800 dark:text-slate-100">
                        <div>
                          <p>{tx.description}</p>
                          {tx.notes && (
                            <span className="text-[10px] font-normal text-slate-400 block mt-0.5 italic truncate max-w-[200px]">
                              {tx.notes}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          {cat ? renderIcon(cat.icon, 'text-[#0B2545] dark:text-amber-400') : <HelpCircle size={15} />}
                          <span className="text-slate-600 dark:text-slate-300">{cat?.name || 'Geral'}</span>
                        </div>
                      </td>

                      {/* Zero-Pill Design Guidelines metadata label: NO static pills inside table row metadata */}
                      <td className="py-4 px-4">
                        <span className={`font-semibold text-[10px] uppercase tracking-wider ${tx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {tx.type === 'income' ? 'Receita' : 'Despesa'}
                        </span>
                      </td>

                      {/* Payment Method */}
                      <td className="py-4 px-4 text-slate-500 whitespace-nowrap">
                        {tx.paymentMethod}
                      </td>

                      {/* Amount */}
                      <td className={`py-4 px-4 text-right font-mono font-bold tabular-nums text-sm whitespace-nowrap ${tx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {tx.type === 'income' ? '+' : '-'}{tx.amount.toLocaleString('pt-MZ', { minimumFractionDigits: 2 })} MZN
                      </td>

                      {/* Interactive Actions with Confirmations */}
                      <td className="py-4 px-4 text-center whitespace-nowrap">
                        {!isDeleting ? (
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleOpenEdit(tx)}
                              className="p-1.5 text-slate-400 hover:text-[#0B2545] dark:hover:text-amber-400 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                              title="Editar"
                            >
                              <Edit3 size={14} />
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(tx.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                              title="Eliminar"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-1.5 bg-rose-50 dark:bg-rose-950/40 p-1 rounded-lg border border-rose-100 dark:border-rose-900/50 animate-fade-in">
                            <span className="text-[9px] font-bold text-rose-800 dark:text-rose-200 uppercase tracking-wider px-1">Eliminar?</span>
                            <button
                              onClick={() => handleDelete(tx.id)}
                              className="px-2 py-0.5 bg-rose-600 text-white rounded text-[9px] font-bold uppercase transition-all"
                            >
                              Sim
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="px-2 py-0.5 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded text-[9px] font-semibold uppercase transition-all"
                            >
                              Não
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- ADD / EDIT FLOATING MODAL FORM --- */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">
            {/* Modal Header */}
            <div className="flex justify-between items-center bg-[#0B2545] text-white px-5 py-4">
              <h3 className="font-serif text-sm font-bold tracking-tight">
                {editingTransaction ? 'Editar Movimentação' : 'Registar Lançamento Financeiro'}
              </h3>
              <button 
                onClick={() => setIsFormOpen(false)}
                className="text-slate-300 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleFormSubmit} className="p-5 space-y-4">
              {/* Transaction Type Segmented Toggle */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Tipo de Movimentação
                </label>
                <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-lg w-full">
                  <button
                    type="button"
                    onClick={() => handleTypeChangeInForm('income')}
                    className={`flex-1 text-center py-2 rounded-md text-xs font-semibold transition-all cursor-pointer ${txType === 'income' ? 'bg-white dark:bg-slate-800 text-emerald-600 shadow-sm' : 'text-slate-500'}`}
                  >
                    Entrada / Receita
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTypeChangeInForm('expense')}
                    className={`flex-1 text-center py-2 rounded-md text-xs font-semibold transition-all cursor-pointer ${txType === 'expense' ? 'bg-white dark:bg-slate-800 text-rose-600 shadow-sm' : 'text-slate-500'}`}
                  >
                    Saída / Despesa
                  </button>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Descrição / Detalhe *
                </label>
                <input
                  type="text"
                  required
                  value={txDescription}
                  onChange={(e) => setTxDescription(e.target.value)}
                  placeholder={txType === 'income' ? 'Ex: Venda de smartphone antigo' : 'Ex: Compra de cadernos universitários'}
                  className="block w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:ring-2 focus:ring-[#0B2545] outline-hidden"
                />
              </div>

              {/* Amount */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Valor Monetário (MZN) *
                </label>
                <input
                  type="number"
                  required
                  min="0.01"
                  step="any"
                  value={txAmount || ''}
                  onChange={(e) => setTxAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                  placeholder="Ex: 1500.00"
                  className="block w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-mono font-bold focus:ring-2 focus:ring-[#0B2545] outline-hidden tabular-nums"
                />
              </div>

              {/* Category selector */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Categoria *
                </label>
                <select
                  value={txCategoryId}
                  onChange={(e) => setTxCategoryId(e.target.value)}
                  className="block w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:ring-2 focus:ring-[#0B2545] outline-hidden"
                >
                  <option value="" disabled>Escolha uma categoria</option>
                  {categories.filter(c => c.type === txType).map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Payment method & Date row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Método de Pagamento
                  </label>
                  <select
                    value={txPaymentMethod}
                    onChange={(e) => setTxPaymentMethod(e.target.value)}
                    className="block w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:ring-2 focus:ring-[#0B2545] outline-hidden"
                  >
                    {paymentMethods.map(pm => (
                      <option key={pm} value={pm}>{pm}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Data do Movimento
                  </label>
                  <input
                    type="date"
                    required
                    value={txDate}
                    onChange={(e) => setTxDate(e.target.value)}
                    className="block w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:ring-2 focus:ring-[#0B2545] outline-hidden"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Observações / Notas (Opcional)
                </label>
                <textarea
                  rows={2}
                  value={txNotes}
                  onChange={(e) => setTxNotes(e.target.value)}
                  placeholder="Informações adicionais relevantes..."
                  className="block w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:ring-2 focus:ring-[#0B2545] outline-hidden"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="flex-1 py-2 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 bg-[#0B2545] hover:bg-brand-primary-light text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer"
                >
                  {editingTransaction ? 'Guardar' : 'Confirmar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
