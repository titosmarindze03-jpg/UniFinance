/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useFinance } from '../contexts/FinanceContext';
import { User, Wallet, ShieldAlert, Key, Save, AlertTriangle, Eye, EyeOff } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile, resetAllData, addToast } = useFinance();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [role, setRole] = useState(user?.role || 'Estudante Universitário');
  const [saldoInicial, setSaldoInicial] = useState<number>(user?.saldoInicial || 5000);

  const [isResetConfirming, setIsResetConfirming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const roles = [
    'Estudante Universitário',
    'Estudante Técnico / Profissional',
    'Jovem Profissional',
    'Trabalhador',
    'Pequeno Empreendedor',
    'Outro'
  ];

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      addToast('Nome e Email são obrigatórios.', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      await updateProfile({
        name,
        email,
        role,
        saldoInicial
      });
    } catch {
      // Toast handled by context
    } finally {
      setIsLoading(false);
    }
  };

  const handleFullReset = async () => {
    setIsLoading(true);
    try {
      await resetAllData();
      setIsResetConfirming(false);
    } catch {
      addToast('Erro ao reiniciar as suas configurações.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Edit Profile Form */}
      <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800/80 p-6 shadow-xs">
        <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 font-serif mb-4 uppercase tracking-wider flex items-center gap-2">
          <User size={16} className="text-[#0B2545] dark:text-amber-400" />
          Dados de Identidade do Utilizador
        </h2>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Nome de Apresentação *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Endereço de Email *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Ocupação / Perfil Académico</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="block w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg text-xs"
              >
                {roles.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Reajustar Saldo Inicial (MZN) *</label>
              <input
                type="number"
                required
                min="0"
                value={saldoInicial || 0}
                onChange={(e) => setSaldoInicial(Math.max(0, parseFloat(e.target.value) || 0))}
                className="block w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-mono font-bold tabular-nums"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 bg-[#0B2545] hover:bg-brand-primary-light text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              <Save size={14} />
              <span>{isLoading ? 'A Guardar...' : 'Salvar Perfil'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Dangerous Wipe Action Panel */}
      <div className="space-y-6">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 shadow-xs">
          <h2 className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <ShieldAlert size={14} />
            Zona de Segurança
          </h2>
          <p className="text-[11px] text-slate-500 leading-relaxed mb-4">
            Deseja reiniciar a sua conta do zero? Esta operação eliminará de forma permanente todas as movimentações, orçamentos e metas financeiras definidas.
          </p>

          {!isResetConfirming ? (
            <button
              onClick={() => setIsResetConfirming(true)}
              className="w-full py-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider rounded-lg border border-rose-100 dark:border-rose-900/40 transition-all"
            >
              Reiniciar Todos os Dados
            </button>
          ) : (
            <div className="p-3 bg-rose-50/50 dark:bg-rose-950/30 rounded-xl border border-rose-200 dark:border-rose-900/60 text-center space-y-3.5 animate-pulse">
              <p className="text-[10px] text-rose-800 dark:text-rose-200 font-semibold leading-relaxed">
                Tem a certeza absoluta? Esta ação não poderá ser desfeita futuramente.
              </p>
              <div className="flex gap-2 justify-center">
                <button
                  onClick={handleFullReset}
                  disabled={isLoading}
                  className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] uppercase rounded-md transition-all"
                >
                  Sim, Eliminar Tudo
                </button>
                <button
                  onClick={() => setIsResetConfirming(false)}
                  className="px-4 py-1.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[10px] uppercase rounded-md transition-all"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
