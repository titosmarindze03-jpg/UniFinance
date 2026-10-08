/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useFinance } from '../contexts/FinanceContext';
import { Wallet, CheckCircle, ChevronRight, GraduationCap, Coins, Sparkles, BookOpen } from 'lucide-react';

export const Onboarding: React.FC = () => {
  const { user, completeOnboarding, addToast } = useFinance();
  const [step, setStep] = useState(1);
  const [saldoInicial, setSaldoInicial] = useState<number>(5000);
  
  // Choose standard starting categories
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    'exp-alimentacao', 'exp-transporte', 'exp-educacao', 'exp-internet'
  ]);

  const [hasGoal, setHasGoal] = useState<boolean>(true);
  const [goalName, setGoalName] = useState<string>('Comprar Computador Académico');
  const [goalTarget, setGoalTarget] = useState<number>(35000);

  const categoriesOptions = [
    { id: 'exp-alimentacao', label: 'Alimentação', icon: '🍲' },
    { id: 'exp-transporte', label: 'Transporte / Chapa', icon: '🚌' },
    { id: 'exp-educacao', label: 'Educação / Propinas', icon: '📚' },
    { id: 'exp-internet', label: 'Pacotes de Internet', icon: '📶' },
    { id: 'exp-habitacao', label: 'Aluguer de Quarto', icon: '🏠' },
    { id: 'exp-entretenimento', label: 'Lazer e Saídas', icon: '🍿' },
  ];

  const handleToggleCategory = (catId: string) => {
    if (selectedCategories.includes(catId)) {
      setSelectedCategories(prev => prev.filter(id => id !== catId));
    } else {
      setSelectedCategories(prev => [...prev, catId]);
    }
  };

  const handleNext = () => {
    if (step === 1 && saldoInicial < 0) {
      addToast('O saldo inicial não pode ser negativo.', 'warning');
      return;
    }
    if (step === 2 && selectedCategories.length === 0) {
      addToast('Escolha pelo menos uma categoria de despesa para prosseguir.', 'warning');
      return;
    }
    if (step === 3 && hasGoal) {
      if (!goalName) {
        addToast('Diga-nos o nome da sua meta.', 'warning');
        return;
      }
      if (goalTarget <= 0) {
        addToast('O valor objetivo deve ser superior a zero.', 'warning');
        return;
      }
    }

    if (step < 4) {
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  };

  const handleFinish = async () => {
    try {
      await completeOnboarding(
        saldoInicial,
        selectedCategories,
        hasGoal ? { name: goalName, target: goalTarget } : undefined
      );
    } catch {
      addToast('Ocorreu um erro ao guardar as suas preferências.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A0F1D] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-4">
        <h2 className="font-serif text-3xl font-extrabold text-slate-900 dark:text-white flex items-center justify-center gap-2">
          <span>Uni</span>
          <span className="text-amber-500">Finance</span>
        </h2>
        <p className="text-slate-400 dark:text-slate-500 text-xs mt-1 uppercase tracking-wider font-semibold">
          Bem-vindo, {user?.name}! 👋
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white dark:bg-slate-900 py-8 px-6 shadow-xl rounded-2xl border border-slate-200/60 dark:border-slate-800/80">
          
          {/* Progress Indicators */}
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center flex-1 last:flex-initial">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300
                  ${step === s 
                    ? 'bg-[#0B2545] text-white ring-4 ring-slate-100 dark:ring-slate-800' 
                    : step > s 
                      ? 'bg-emerald-500 text-white' 
                      : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600'
                  }
                `}>
                  {step > s ? '✓' : s}
                </div>
                {s < 4 && (
                  <div className={`
                    h-1 flex-1 mx-2 rounded-full transition-all duration-300
                    ${step > s ? 'bg-emerald-400' : 'bg-slate-100 dark:bg-slate-800'}
                  `} />
                )}
              </div>
            ))}
          </div>

          {/* STEP 1: INITIAL BALANCE */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="text-center">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 font-serif">
                  Passo 1: Qual é o seu saldo inicial?
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Introduza o dinheiro disponível na sua conta bancária, carteira móvel (M-Pesa, e-Mola, mKesh) ou dinheiro em mão.
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center gap-4">
                <div className="bg-[#0B2545]/10 text-[#0B2545] dark:bg-amber-400/10 dark:text-amber-400 p-3 rounded-full">
                  <Wallet size={24} />
                </div>
                
                <div className="relative w-full max-w-xs">
                  <input
                    type="number"
                    value={saldoInicial}
                    onChange={(e) => setSaldoInicial(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full text-center text-2xl font-mono font-bold py-2 bg-transparent border-b-2 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-hidden focus:border-brand-primary dark:focus:border-brand-accent transition-all tabular-nums"
                  />
                  <span className="absolute bottom-2.5 right-2 text-xs text-slate-400 font-bold font-mono">
                    MZN
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">
                  *Pode reajustar ou alterar este saldo a qualquer momento no seu perfil.
                </span>
              </div>
            </div>
          )}

          {/* STEP 2: CATEGORIES SETUP */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="text-center">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 font-serif">
                  Passo 2: Selecione as suas despesas recorrentes
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Ative as categorias em que costuma gastar dinheiro no dia a dia. Isso criará o seu plano inicial de orçamento.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto p-1">
                {categoriesOptions.map((cat) => {
                  const isSelected = selectedCategories.includes(cat.id);
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleToggleCategory(cat.id)}
                      className={`
                        p-4 rounded-xl border text-left flex flex-col justify-between h-24 transition-all duration-200 cursor-pointer
                        ${isSelected 
                          ? 'border-emerald-500 bg-emerald-50/20 text-emerald-900 dark:text-emerald-100 shadow-xs' 
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50/40 hover:bg-slate-150'
                        }
                      `}
                    >
                      <span className="text-2xl">{cat.icon}</span>
                      <span className="text-xs font-semibold">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: FINANCIAL GOALS */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="text-center">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 font-serif">
                  Passo 3: Deseja criar uma meta financeira?
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Adicione um objetivo de poupança (ex: comprar um computador, pagar propinas, reserva de emergência) e nós vamos ajudar-lhe a poupar.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-800/60">
                  <input
                    type="checkbox"
                    id="has-goal"
                    checked={hasGoal}
                    onChange={(e) => setHasGoal(e.target.checked)}
                    className="w-4 h-4 text-brand-primary rounded focus:ring-brand-primary"
                  />
                  <label htmlFor="has-goal" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Sim, pretendo registar uma meta inicial agora.
                  </label>
                </div>

                {hasGoal && (
                  <div className="space-y-3 bg-slate-50/50 dark:bg-slate-800/30 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 animate-fade-in">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        Nome da Meta
                      </label>
                      <input
                        type="text"
                        value={goalName}
                        onChange={(e) => setGoalName(e.target.value)}
                        placeholder="Ex: Propinas 2º Semestre"
                        className="block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        Valor Objetivo (MZN)
                      </label>
                      <input
                        type="number"
                        value={goalTarget}
                        onChange={(e) => setGoalTarget(Math.max(0, parseFloat(e.target.value) || 0))}
                        placeholder="Ex: 15000"
                        className="block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-mono font-semibold tabular-nums"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: ONBOARDING COMPLETED */}
          {step === 4 && (
            <div className="space-y-5 text-center">
              <div className="flex justify-center mb-2">
                <div className="bg-emerald-500/10 text-emerald-500 p-4 rounded-full ring-8 ring-emerald-50/50">
                  <CheckCircle size={44} />
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 font-serif">
                O seu UniFinance está pronto! 🎉
              </h3>
              
              <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                Parabéns, {user?.name}! Configurou com sucesso a base para a sua organização financeira. Agora poderá gerir receitas, despesas, orçamentos mensais e ver relatórios em tempo real.
              </p>

              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-800 text-left space-y-2.5 max-w-sm mx-auto">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Configuração Inicial Guardada:</p>
                <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300">
                  <span>Saldo Inicial:</span>
                  <strong className="font-mono tabular-nums">{saldoInicial.toLocaleString('pt-MZ')} MZN</strong>
                </div>
                <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300">
                  <span>Categorias de Despesa:</span>
                  <strong className="text-right">{selectedCategories.length} Ativas</strong>
                </div>
                {hasGoal && (
                  <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300">
                    <span>Meta Financeira:</span>
                    <strong className="truncate max-w-[200px]">{goalName} ({goalTarget.toLocaleString('pt-MZ')} MZN)</strong>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="mt-8 flex gap-3">
            {step > 1 && step < 4 && (
              <button
                onClick={handleBack}
                className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold uppercase tracking-wider rounded-lg transition-all"
              >
                Voltar
              </button>
            )}
            
            {step < 4 ? (
              <button
                onClick={handleNext}
                className="flex-1 py-2.5 px-4 bg-[#0B2545] hover:bg-brand-primary-light text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <span>Seguinte</span>
                <ChevronRight size={14} />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                className="w-full py-3 px-4 bg-[#0B2545] hover:bg-brand-primary-light text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <span>Entrar no Painel Financeiro</span>
                <ChevronRight size={14} />
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
