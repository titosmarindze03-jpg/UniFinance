import React, { useState, useEffect } from 'react';
import { useFinance } from '../contexts/FinanceContext';
import { UniFinanceDB } from '../services/db';
import { UserProfile, Transaction } from '../types/finance';
import { 
  Users, 
  ArrowLeft, 
  Search, 
  Download, 
  Trash2, 
  Megaphone, 
  ShieldAlert, 
  Activity, 
  TrendingUp, 
  DollarSign, 
  CheckCircle, 
  XCircle, 
  X,
  Bell
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { setActivePage, user, addToast } = useFinance();
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [totalTransactions, setTotalTransactions] = useState<number>(0);
  const [totalVolume, setTotalVolume] = useState<number>(0);
  const [currencyStats, setCurrencyStats] = useState<Record<string, number>>({});
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Broadcast Notification modal state
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'info' | 'warning' | 'danger' | 'success'>('info');

  // Delete User Confirmation Modal State
  const [deleteConfirmUser, setDeleteConfirmUser] = useState<{ id: string, email: string } | null>(null);

  // Load Admin stats
  const loadAdminStats = () => {
    try {
      // 1. Load profiles from localStorage
      const savedProfilesStr = localStorage.getItem('unifinance_profiles');
      const savedProfiles: UserProfile[] = savedProfilesStr ? JSON.parse(savedProfilesStr) : [];
      setProfiles(savedProfiles);

      // 2. Load transactions from localStorage
      const savedTransactionsStr = localStorage.getItem('unifinance_transactions');
      const savedTransactions: Transaction[] = savedTransactionsStr ? JSON.parse(savedTransactionsStr) : [];
      setTotalTransactions(savedTransactions.length);

      // 3. Compute currency counts and total volume (summing absolute values)
      let volume = 0;
      const currencies: Record<string, number> = {};

      savedTransactions.forEach(tx => {
        volume += tx.amount;
      });
      setTotalVolume(volume);

      savedProfiles.forEach(p => {
        const cur = p.defaultCurrency || 'MZN';
        currencies[cur] = (currencies[cur] || 0) + 1;
      });
      setCurrencyStats(currencies);
    } catch (e) {
      console.error('Error loading admin statistics', e);
      addToast('Erro ao carregar estatísticas do sistema.', 'error');
    }
  };

  useEffect(() => {
    loadAdminStats();
  }, []);

  // Filter users based on search
  const filteredProfiles = profiles.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Export full database in JSON
  const exportDatabase = () => {
    try {
      const keys = [
        'unifinance_profiles',
        'unifinance_credentials',
        'unifinance_transactions',
        'unifinance_categories',
        'unifinance_budgets',
        'unifinance_goals',
        'unifinance_notifications'
      ];

      const fullBackup: Record<string, any> = {};
      keys.forEach(key => {
        const val = localStorage.getItem(key);
        fullBackup[key] = val ? JSON.parse(val) : null;
      });

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fullBackup, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `unifinance_backup_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      addToast('Base de dados exportada com sucesso!', 'success');
    } catch (e) {
      addToast('Erro ao exportar base de dados.', 'error');
    }
  };

  // Trigger delete confirmation modal
  const handleDeleteClick = (userId: string, userEmail: string) => {
    if (userEmail.toLowerCase() === 'titosmarindze03@gmail.com') {
      addToast('A conta do proprietário principal não pode ser excluída.', 'error');
      return;
    }
    setDeleteConfirmUser({ id: userId, email: userEmail });
  };

  // Actual execution of deletion from state confirmation
  const handleConfirmDelete = () => {
    if (!deleteConfirmUser) return;
    const { id: userId, email: userEmail } = deleteConfirmUser;

    try {
      // 1. Remove profile
      const savedProfiles = JSON.parse(localStorage.getItem('unifinance_profiles') || '[]');
      const filteredP = savedProfiles.filter((p: any) => p.id !== userId);
      localStorage.setItem('unifinance_profiles', JSON.stringify(filteredP));

      // 2. Remove credentials
      const savedCreds = JSON.parse(localStorage.getItem('unifinance_credentials') || '[]');
      const filteredC = savedCreds.filter((c: any) => c.userId !== userId);
      localStorage.setItem('unifinance_credentials', JSON.stringify(filteredC));

      // 3. Remove transactions
      const savedTx = JSON.parse(localStorage.getItem('unifinance_transactions') || '[]');
      const filteredT = savedTx.filter((t: any) => t.userId !== userId);
      localStorage.setItem('unifinance_transactions', JSON.stringify(filteredT));

      // 4. Remove goals
      const savedGoals = JSON.parse(localStorage.getItem('unifinance_goals') || '[]');
      const filteredG = savedGoals.filter((g: any) => g.userId !== userId);
      localStorage.setItem('unifinance_goals', JSON.stringify(filteredG));

      // 5. Remove budgets
      const savedBudgets = JSON.parse(localStorage.getItem('unifinance_budgets') || '[]');
      const filteredB = savedBudgets.filter((b: any) => b.userId !== userId);
      localStorage.setItem('unifinance_budgets', JSON.stringify(filteredB));

      // 6. Remove custom categories
      const savedCats = JSON.parse(localStorage.getItem('unifinance_custom_categories') || '[]');
      const filteredCat = savedCats.filter((c: any) => c.userId !== userId);
      localStorage.setItem('unifinance_custom_categories', JSON.stringify(filteredCat));

      // 7. Remove notifications
      const savedNotifs = JSON.parse(localStorage.getItem('unifinance_notifications') || '[]');
      const filteredN = savedNotifs.filter((n: any) => n.userId !== userId);
      localStorage.setItem('unifinance_notifications', JSON.stringify(filteredN));

      addToast('Utilizador e todos os seus registos excluídos com sucesso!', 'success');
      setDeleteConfirmUser(null);
      loadAdminStats();
    } catch (e) {
      addToast('Erro ao remover utilizador.', 'error');
    }
  };

  // Broadcast System Alert (Add notification to ALL profiles)
  const handleBroadcastAlert = () => {
    if (!alertMessage.trim()) {
      addToast('Escreva uma mensagem para disparar o alerta.', 'warning');
      return;
    }

    try {
      const savedNotifs = JSON.parse(localStorage.getItem('unifinance_notifications') || '[]');
      
      // Add a notification object for each user profile
      profiles.forEach(p => {
        const newNotif = {
          id: 'notif_sys_' + Math.random().toString(36).substring(2, 11),
          userId: p.id,
          message: `[ALERTA DE SISTEMA]: ${alertMessage}`,
          type: alertType,
          read: false,
          date: new Date().toISOString()
        };
        savedNotifs.push(newNotif);
      });

      localStorage.setItem('unifinance_notifications', JSON.stringify(savedNotifs));
      addToast('Alerta de sistema enviado com sucesso para todos os utilizadores!', 'success');
      setAlertMessage('');
      setShowAlertModal(false);
    } catch (e) {
      addToast('Erro ao enviar alerta global.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Admin Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActivePage('dashboard')}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg transition-colors cursor-pointer"
            title="Voltar ao Painel Geral"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">Painel Administrativo Secreto</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">UniFinance Control Panel</h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowAlertModal(true)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <Megaphone size={14} />
            Alerta Global
          </button>
          <button
            onClick={exportDatabase}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <Download size={14} />
            Exportar DB
          </button>
        </div>
      </div>

      {/* 2. Admin Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Registered Users */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
            <Users size={24} />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Utilizadores</span>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-mono mt-0.5">{profiles.length}</h3>
          </div>
        </div>

        {/* Card 2: Total System Transactions */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
            <Activity size={24} />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Movimentações Totais</span>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-mono mt-0.5">{totalTransactions}</h3>
          </div>
        </div>

        {/* Card 3: Funds Tracked */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl">
            <TrendingUp size={24} />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Fluxo Financeiro (Total)</span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white font-mono mt-0.5">
              {totalVolume.toLocaleString('pt-MZ', { minimumFractionDigits: 0 })} MZN
            </h3>
          </div>
        </div>

        {/* Card 4: Currency counts */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className="p-3 bg-violet-500/10 text-violet-500 rounded-xl">
            <DollarSign size={24} />
          </div>
          <div className="flex-1">
            <span className="text-xs text-slate-400 font-medium">Moedas Preferidas</span>
            <div className="flex gap-2.5 mt-1 text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
              {Object.keys(currencyStats).length === 0 ? (
                <span>Sem moedas</span>
              ) : (
                Object.entries(currencyStats).map(([cur, count]) => (
                  <span key={cur} className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                    {cur}: {count}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. User Directory and Database Administration */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        {/* Table Search Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Diretório Global de Utilizadores</h2>
            <p className="text-xs text-slate-400">Verifique e administre todas as contas registradas no navegador local.</p>
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Pesquisar por nome ou email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:border-brand-accent text-slate-800 dark:text-slate-200 transition-colors"
            />
          </div>
        </div>

        {/* User directory table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                <th className="px-6 py-4">Utilizador / ID</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Função</th>
                <th className="px-6 py-4">Registo</th>
                <th className="px-6 py-4 text-center">Onboarding</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filteredProfiles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-slate-400">
                    Nenhum utilizador encontrado com o termo pesquisado.
                  </td>
                </tr>
              ) : (
                filteredProfiles.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                    {/* User Avatar + Name */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-primary text-amber-400 font-bold flex items-center justify-center uppercase select-none shadow-sm">
                          {p.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-850 dark:text-white leading-tight">{p.name}</p>
                          <span className="text-[10px] text-slate-400 font-mono block mt-0.5">{p.id}</span>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4 font-medium text-slate-600 dark:text-slate-355 font-mono truncate max-w-[180px]">
                      {p.email}
                    </td>

                    {/* Role */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                        p.email.toLowerCase() === 'titosmarindze03@gmail.com' 
                          ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' 
                          : 'bg-blue-500/10 text-blue-500'
                      }`}>
                        {p.email.toLowerCase() === 'titosmarindze03@gmail.com' ? 'OWNER' : p.role || 'USER'}
                      </span>
                    </td>

                    {/* Date Registered */}
                    <td className="px-6 py-4 text-slate-400 font-medium">
                      {p.createdAt ? new Date(p.createdAt).toLocaleDateString('pt-MZ') : 'Desconhecida'}
                    </td>

                    {/* Onboarding Completed */}
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        {p.onboardingCompleted ? (
                          <span className="text-emerald-500" title="Concluído">
                            <CheckCircle size={16} />
                          </span>
                        ) : (
                          <span className="text-slate-300 dark:text-slate-700" title="Pendente">
                            <XCircle size={16} />
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDeleteClick(p.id, p.email)}
                        className={`p-1.5 rounded-lg border transition-all text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 border-transparent hover:bg-rose-50 dark:hover:bg-rose-950/20 cursor-pointer ${
                          p.email.toLowerCase() === 'titosmarindze03@gmail.com' ? 'opacity-30 cursor-not-allowed' : ''
                        }`}
                        disabled={p.email.toLowerCase() === 'titosmarindze03@gmail.com'}
                        title="Excluir conta permanentemente"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Global Alert / Broadcast Modal */}
      {showAlertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-amber-500 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Megaphone size={18} className="animate-pulse" />
                <h3 className="text-sm font-bold">Disparar Alerta Global de Sistema</h3>
              </div>
              <button
                onClick={() => setShowAlertModal(false)}
                className="text-white hover:opacity-80 p-1 rounded-lg"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Form */}
            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Este alerta será adicionado instantaneamente à caixa de notificações de **TODOS** os utilizadores cadastrados no sistema. Use com moderação.
              </p>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Tipo de Alerta</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['info', 'warning', 'danger', 'success'] as const).map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setAlertType(type)}
                      className={`py-1.5 px-2 rounded-xl text-[10px] font-bold uppercase tracking-wider text-center border cursor-pointer transition-all ${
                        alertType === type
                          ? type === 'info' ? 'bg-blue-500/10 text-blue-500 border-blue-500' :
                            type === 'warning' ? 'bg-amber-500/10 text-amber-500 border-amber-500' :
                            type === 'danger' ? 'bg-rose-500/10 text-rose-500 border-rose-500' :
                            'bg-emerald-500/10 text-emerald-500 border-emerald-500'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 hover:text-slate-600'
                      }`}
                    >
                      {type === 'danger' ? 'erro' : type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Mensagem do Alerta</label>
                <textarea
                  placeholder="Escreva a mensagem do alerta oficial do administrador..."
                  rows={4}
                  value={alertMessage}
                  onChange={(e) => setAlertMessage(e.target.value)}
                  className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:border-amber-500 text-slate-800 dark:text-slate-100 transition-colors resize-none"
                />
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAlertModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleBroadcastAlert}
                  className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition-colors shadow-lg shadow-amber-500/15 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Bell size={14} />
                  Enviar Alerta
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Delete User Confirmation Modal */}
      {deleteConfirmUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-rose-600 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <ShieldAlert size={18} className="animate-bounce" />
                <h3 className="text-sm font-bold">Confirmar Exclusão de Conta</h3>
              </div>
              <button
                onClick={() => setDeleteConfirmUser(null)}
                className="text-white hover:opacity-80 p-1 rounded-lg"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div className="p-3.5 bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-300 border border-rose-100 dark:border-rose-900/30 rounded-xl">
                <p className="text-xs font-semibold leading-relaxed">
                  Aviso Crítico: Esta ação é permanente e irreversível.
                </p>
                <p className="text-[11px] mt-1 opacity-90">
                  Todos os dados, transações, metas, orçamentos, categorias personalizadas e credenciais de login associadas a este utilizador serão eliminados definitivamente de forma permanente.
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Utilizador Selecionado</span>
                <p className="text-xs font-mono font-bold text-slate-850 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-800 truncate">
                  {deleteConfirmUser.email}
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmUser(null)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors shadow-lg shadow-rose-600/15 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Trash2 size={14} />
                  Sim, Excluir Tudo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
