/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, User, ShieldCheck, Wallet, ArrowLeft } from 'lucide-react';
import { useFinance } from '../contexts/FinanceContext';

export const Register: React.FC = () => {
  const { register, setActivePage, addToast } = useFinance();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      addToast('Por favor preencha todos os campos obrigatórios.', 'warning');
      return;
    }

    if (password.length < 6) {
      addToast('A palavra-passe deve conter pelo menos 6 caracteres.', 'warning');
      return;
    }

    if (password !== confirmPassword) {
      addToast('As palavras-passe introduzidas não coincidem.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const passwordHash = btoa(password); // Simple client-side simulation
      await register(name, email, passwordHash);
    } catch {
      // Errors handled within AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A0F1D] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Back CTA link */}
      <div className="absolute top-6 left-6">
        <button 
          onClick={() => setActivePage('landing')}
          className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
        >
          <ArrowLeft size={14} />
          Voltar ao Início
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-4">
          <div className="bg-[#0B2545] text-amber-400 p-3 rounded-2xl shadow-lg ring-4 ring-slate-100 dark:ring-slate-800/40">
            <Wallet size={32} strokeWidth={2} />
          </div>
        </div>
        
        <h2 className="text-center font-serif text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          UniFinance
        </h2>
        <p className="mt-1 text-center text-xs text-slate-500 dark:text-slate-400">
          Inicie o seu controlo financeiro pessoal hoje mesmo.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-900 py-8 px-4 shadow-xl rounded-2xl border border-slate-200/60 dark:border-slate-800/80 sm:px-10">
          
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="reg-name" className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                Nome Completo
              </label>
              <div className="relative rounded-lg shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User size={16} />
                </div>
                <input
                  id="reg-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome ou apelido"
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-brand-primary dark:focus:ring-brand-accent focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="reg-email" className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                Endereço de Email
              </label>
              <div className="relative rounded-lg shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail size={16} />
                </div>
                <input
                  id="reg-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemplo@gmail.com"
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-brand-primary dark:focus:ring-brand-accent focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="reg-password" className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                Palavra-passe
              </label>
              <div className="relative rounded-lg shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock size={16} />
                </div>
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="block w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-brand-primary dark:focus:ring-brand-accent focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="reg-confirm" className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                Confirmar Palavra-passe
              </label>
              <div className="relative rounded-lg shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock size={16} />
                </div>
                <input
                  id="reg-confirm"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repita a palavra-passe"
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-brand-primary dark:focus:ring-brand-accent focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Privacy flag */}
            <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider bg-slate-50 dark:bg-slate-800 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800/40">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span>Dados protegidos pela política UniFinance</span>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-[#0B2545] hover:bg-brand-primary-light text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-md transition-all focus:outline-hidden focus:ring-2 focus:ring-[#0B2545] disabled:opacity-50"
              >
                {isLoading ? 'A criar conta...' : 'Concluir Registo'}
              </button>
            </div>
          </form>

          <div className="mt-6 border-t border-slate-150 dark:border-slate-800 pt-6 text-center text-xs text-slate-500 dark:text-slate-400">
            Já tem uma conta UniFinance?{' '}
            <button
              onClick={() => setActivePage('login')}
              className="font-bold text-[#0B2545] dark:text-amber-400 hover:underline"
            >
              Iniciar Sessão
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
