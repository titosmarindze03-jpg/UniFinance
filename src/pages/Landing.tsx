/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useFinance } from '../contexts/FinanceContext';
import { PWAInstallButton } from '../components/PWAInstallButton';
import { 
  Wallet, 
  Target, 
  ShieldCheck, 
  Sparkles, 
  TrendingUp, 
  ArrowRight, 
  GraduationCap, 
  BookOpen, 
  Award,
  ChevronRight
} from 'lucide-react';
import { Footer } from '../components/Footer';

export const Landing: React.FC = () => {
  const { setActivePage, user } = useFinance();

  return (
    <div className="min-h-screen relative bg-slate-50 dark:bg-[#0A0F1D] text-slate-855 dark:text-slate-100 flex flex-col justify-between selection:bg-amber-400 selection:text-brand-primary overflow-hidden">
      
      {/* Background Image Layer with custom Opacity */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat pointer-events-none opacity-90 dark:opacity-20 mix-blend-overlay dark:mix-blend-normal"
        style={{ 
          backgroundImage: `url('https://unifor.br/documents/20143/573160/materia-principal-unifor-noticias-800-getty-images.jpg/d8842b0c-0085-21f1-fea9-ac57f2ed8bd5?t=1645450288017')`
        }}
      />
      {/* Premium Backdrop Overlay to ensure perfect contrast and text readability */}
      <div className="absolute inset-0 z-0 bg-slate-50/70 dark:bg-[#0A0F1D]/85 pointer-events-none" />

      {/* Content Wrapper */}
      <div className="relative z-10 flex flex-col justify-between min-h-screen">
      
      {/* 1. Header Navigation Bar */}
      <nav className="max-w-7xl w-full mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-[#0B2545] text-amber-400 p-2 rounded-xl shadow-md">
            <Wallet size={20} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="font-serif text-lg tracking-tight font-bold flex items-center gap-1 leading-none text-slate-900 dark:text-white">
              <span>Uni</span>
              <span className="text-amber-500">Finance</span>
            </h1>
            <span className="text-[9px] text-slate-400 font-semibold tracking-widest uppercase block mt-1">
              Moçambique
            </span>
          </div>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-3">
          <PWAInstallButton />
          
          {user ? (
            <button
              onClick={() => setActivePage('dashboard')}
              className="px-4.5 py-2 bg-[#0B2545] hover:bg-brand-primary-light text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5"
            >
              <span>Ir para o Painel</span>
              <ArrowRight size={13} />
            </button>
          ) : (
            <>
              <button
                onClick={() => setActivePage('login')}
                className="text-xs font-bold text-slate-650 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors cursor-pointer"
              >
                Entrar
              </button>
              <button
                onClick={() => setActivePage('register')}
                className="px-4.5 py-2.5 bg-[#0B2545] hover:bg-brand-primary-light text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
              >
                Criar Conta Grátis
              </button>
            </>
          )}
        </div>
      </nav>

      {/* 2. Hero Presentation Section */}
      <main className="max-w-7xl w-full mx-auto px-6 py-12 md:py-20 flex flex-col lg:flex-row items-center justify-between gap-12">
        
        {/* Left Side Copywriting */}
        <div className="flex-1 space-y-6 max-w-2xl text-left">
          
          {/* Accent badge indicating educational project */}
          <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 px-3.5 py-1.5 rounded-full border border-amber-500/20 text-xs font-bold uppercase tracking-wider">
            <GraduationCap size={14} />
            <span>Gestão Financeira Académica & Geral</span>
          </div>

          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.08]">
            Seu dinheiro, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-600">sob controlo.</span>
          </h2>

          <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed font-medium">
            O UniFinance é uma plataforma moderna e intuitiva desenhada para ajudar estudantes universitários, jovens profissionais e empreendedores em Moçambique a planear gastos, definir orçamentos mensais, alcançar metas de poupança e gerir o dinheiro sem mistérios.
          </p>

          <div className="flex flex-wrap gap-3.5 pt-4">
            <button
              onClick={() => setActivePage('register')}
              className="px-6 py-3.5 bg-[#0B2545] hover:bg-brand-primary-light text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
            >
              <span>Começar Agora Grátis</span>
              <ChevronRight size={14} />
            </button>
            <button
              onClick={() => setActivePage('login')}
              className="px-6 py-3.5 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-200 font-semibold text-xs uppercase tracking-wider rounded-xl border border-slate-200 dark:border-slate-800 transition-all cursor-pointer"
            >
              Iniciar Sessão
            </button>
          </div>

          {/* Core Trust Factors */}
          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-200 dark:border-slate-800/80">
            <div>
              <h4 className="text-xl font-mono font-bold text-slate-800 dark:text-white leading-none">100%</h4>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-1">Seguro & Local</p>
            </div>
            <div>
              <h4 className="text-xl font-mono font-bold text-slate-800 dark:text-white leading-none">MZN</h4>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-1">Moeda Nacional</p>
            </div>
            <div>
              <h4 className="text-xl font-mono font-bold text-slate-800 dark:text-white leading-none">AI</h4>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-1">Assistente Integrado</p>
            </div>
          </div>

        </div>

        {/* Right Side Visual Component (Mock UI preview with high fidelity CSS) */}
        <div className="flex-1 w-full max-w-lg lg:max-w-none relative animate-fade-in">
          
          {/* Beautiful glowing backlights */}
          <div className="absolute inset-0 bg-amber-500/10 blur-3xl rounded-full" />
          
          <div className="relative bg-[#0F172A] border border-slate-800 rounded-2xl shadow-2xl p-6 text-white space-y-6">
            {/* Mock Header */}
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500" />
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
              </div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">unifinance.co.mz</span>
            </div>

            {/* Simulated Balance KPI */}
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Saldo Geral Disponível</span>
              <h3 className="text-2xl font-mono font-bold text-amber-400">15.450,00 MZN</h3>
            </div>

            {/* Simulated Mini Progress bar (Budgets) */}
            <div className="space-y-2 p-3 bg-[#0B2545]/40 border border-[#0B2545] rounded-xl">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-200">
                <span>Alimentação / Refeitório</span>
                <span>75%</span>
              </div>
              <div className="w-full h-1.5 bg-[#0F172A] rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: '75%' }} />
              </div>
              <p className="text-[10px] text-slate-400">Orçamento mensal de 4.000 MZN quase atingido.</p>
            </div>

            {/* Simulated transactions list */}
            <div className="space-y-3">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">Últimos Lançamentos</span>
              
              <div className="flex justify-between items-center text-xs border-b border-slate-800 pb-2">
                <div>
                  <p className="font-semibold text-slate-200">Bolsa de Estudos Académica</p>
                  <span className="text-[9px] text-slate-500">Hoje às 09:30</span>
                </div>
                <strong className="text-emerald-400 font-mono font-bold">+12.000 MZN</strong>
              </div>

              <div className="flex justify-between items-center text-xs border-b border-slate-800 pb-2">
                <div>
                  <p className="font-semibold text-slate-200">Pacote de Internet Mensal</p>
                  <span className="text-[9px] text-slate-500">Ontem às 14:15</span>
                </div>
                <strong className="text-rose-400 font-mono font-bold">-1.200 MZN</strong>
              </div>
            </div>

            {/* Secure warning tag */}
            <div className="pt-2 flex items-center gap-2 text-[9px] text-slate-500 uppercase font-bold tracking-wider">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span>Base local encriptada · Sem partilha de dados</span>
            </div>

          </div>
        </div>

      </main>

      {/* 3. Footer */}
      <div className="max-w-7xl w-full mx-auto px-6">
        <Footer />
      </div>

      </div>
    </div>
  );
};
