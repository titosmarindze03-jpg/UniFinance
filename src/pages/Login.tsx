/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, Wallet, ArrowLeft } from 'lucide-react';
import { useFinance } from '../contexts/FinanceContext';

export const Login: React.FC = () => {
  const { login, setActivePage, addToast } = useFinance();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecovering, setIsRecovering] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      addToast('Por favor, preencha todos os campos.', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate simple hash
      const passwordHash = btoa(password); 
      await login(email, passwordHash);
    } catch (err: any) {
      // Handled inside context
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryEmail) {
      addToast('Introduza o seu email registado.', 'warning');
      return;
    }
    
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      addToast(`Instruções de redefinição de senha enviadas para ${recoveryEmail}`, 'info');
      setIsRecovering(false);
      setRecoveryEmail('');
    } catch {
      addToast('Erro ao processar o seu pedido.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A0F1D] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Branding and back to landing page indicator */}
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
        <p className="mt-1 text-center text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
          "Seu dinheiro, sob controle." Gestão inteligente para a comunidade académica e geral.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-900 py-8 px-4 shadow-xl rounded-2xl border border-slate-200/60 dark:border-slate-800/80 sm:px-10">
          
          {!isRecovering ? (
            /* LOGIN FORM */
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Endereço de Email
                </label>
                <div className="relative rounded-lg shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail size={16} />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="estudante@unitiva.ac.mz"
                    className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-brand-primary dark:focus:ring-brand-accent focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="password" className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                    Palavra-passe
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsRecovering(true)}
                    className="text-xs font-semibold text-brand-accent hover:text-brand-accent-light"
                  >
                    Esqueceu-se da senha?
                  </button>
                </div>
                
                <div className="relative rounded-lg shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock size={16} />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-brand-primary dark:focus:ring-brand-accent focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Security info flag */}
              <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider bg-slate-50 dark:bg-slate-800 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800/40">
                <ShieldCheck size={14} className="text-emerald-500" />
                <span>Dados encriptados de ponta a ponta</span>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 bg-[#0B2545] hover:bg-brand-primary-light text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-md transition-all focus:outline-hidden focus:ring-2 focus:ring-[#0B2545] disabled:opacity-50"
                >
                  {isLoading ? 'A processar...' : 'Aceder à Minha Conta'}
                </button>
              </div>
            </form>
          ) : (
            /* RECOVERY FORM */
            <form className="space-y-6" onSubmit={handleRecovery}>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-2">Recuperar Palavra-passe</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Introduza o endereço de email associado à sua conta. Enviaremos as instruções necessárias para criar uma nova senha.
              </p>
              
              <div>
                <label htmlFor="recovery-email" className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Endereço de Email
                </label>
                <div className="relative rounded-lg shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail size={16} />
                  </div>
                  <input
                    id="recovery-email"
                    type="email"
                    required
                    value={recoveryEmail}
                    onChange={(e) => setRecoveryEmail(e.target.value)}
                    placeholder="estudante@unitiva.ac.mz"
                    className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-brand-primary dark:focus:ring-brand-accent focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsRecovering(false)}
                  className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold uppercase tracking-wider rounded-lg transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-2.5 px-4 bg-brand-accent hover:bg-brand-accent-light text-brand-primary text-xs font-bold uppercase tracking-wider rounded-lg transition-all disabled:opacity-50"
                >
                  {isLoading ? 'A enviar...' : 'Recuperar'}
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 border-t border-slate-150 dark:border-slate-800 pt-6 text-center text-xs text-slate-500 dark:text-slate-400">
            Ainda não tem conta no UniFinance?{' '}
            <button
              onClick={() => setActivePage('register')}
              className="font-bold text-[#0B2545] dark:text-amber-400 hover:underline"
            >
              Registar-se Grátis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
