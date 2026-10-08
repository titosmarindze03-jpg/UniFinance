/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useFinance } from '../contexts/FinanceContext';
import { Settings, Moon, Sun, Coins, ShieldCheck, ChevronRight } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { theme, toggleTheme, currency, setCurrency, addToast } = useFinance();
  const [selectedCurrency, setSelectedCurrency] = useState(currency);

  const currencies = [
    { code: 'MZN', symbol: 'MT', name: 'Metical Moçambicano (padrão)' },
    { code: 'USD', symbol: '$', name: 'Dólar Americano' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'ZAR', symbol: 'R', name: 'Rand Sul-Africano' }
  ];

  const handleSaveSettings = () => {
    setCurrency(selectedCurrency);
    addToast('Configurações de moeda atualizadas com sucesso.', 'success');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* General Settings */}
      <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800/80 p-6 shadow-xs space-y-6">
        <div>
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 font-serif mb-4 uppercase tracking-wider flex items-center gap-2">
            <Settings size={16} className="text-[#0B2545] dark:text-amber-400" />
            Configurações do Sistema
          </h2>

          <div className="space-y-5">
            {/* Theme selector */}
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-800/60">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Aparência do Painel</p>
                <p className="text-[10px] text-slate-400">Alterne entre o tema claro e o tema noturno do UniFinance.</p>
              </div>
              <button
                type="button"
                onClick={toggleTheme}
                className="p-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xs transition-colors cursor-pointer"
                title="Alternar Tema"
              >
                {theme === 'dark' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-slate-600" />}
              </button>
            </div>

            {/* Currency selector */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-800/60 gap-4">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Moeda Padrão de Amostragem</p>
                <p className="text-[10px] text-slate-400">Defina o símbolo monetário padrão utilizado nos cálculos gerais.</p>
              </div>
              
              <div className="flex items-center gap-2">
                <select
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value)}
                  className="py-1.5 px-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold"
                >
                  {currencies.map(c => (
                    <option key={c.code} value={c.code}>{c.code} ({c.symbol})</option>
                  ))}
                </select>
                
                <button
                  onClick={handleSaveSettings}
                  className="px-4 py-2 bg-[#0B2545] text-white text-[11px] font-bold uppercase rounded-lg shadow-xs hover:bg-brand-primary-light"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Information metadata */}
      <div className="space-y-6">
        <div className="bg-[#0B2545]/5 dark:bg-[#0B2545]/20 border border-slate-200 dark:border-slate-800/80 p-5 rounded-xl text-slate-600 dark:text-slate-350 space-y-4">
          <h3 className="text-xs font-bold text-[#0B2545] dark:text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck size={16} />
            Privacidade e Segurança
          </h3>
          <p className="text-[11px] leading-relaxed">
            Todas as suas informações e movimentações financeiras são mantidas em base local encriptada. O UniFinance não envia informações do seu orçamento pessoal para servidores externos de publicidade.
          </p>
          <div className="text-[10px] text-slate-400">
            Versão do Software: <strong className="font-mono text-slate-500">v1.1.0-prod (Moçambique)</strong>
          </div>
        </div>
      </div>

    </div>
  );
};
