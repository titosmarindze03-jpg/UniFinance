import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, X, Smartphone, ArrowUpFromLine, PlusSquare } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 rounded-lg bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary dark:text-blue-400 text-xs font-semibold px-2.5 py-1.5 transition-colors border border-brand-primary/20"
        title="Instalar UniFinance no seu dispositivo"
      >
        <Download size={14} className="animate-bounce" />
        <span className="hidden md:inline">Instalar App</span>
      </button>
    );
  }

  // iOS Safari flow (beforeinstallprompt is not supported by WebKit)
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 rounded-lg bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary dark:text-blue-400 text-xs font-semibold px-2.5 py-1.5 transition-colors border border-brand-primary/20"
          title="Instalar UniFinance no iPhone / iPad"
        >
          <Smartphone size={14} />
          <span className="hidden md:inline">Instalar no iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in">
            <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-brand-primary text-amber-400 flex items-center justify-center font-bold text-xs shrink-0">
                    U
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Instalar UniFinance</h3>
                    <p className="text-[10px] text-slate-400">Adicionar à Tela de Início</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-4 my-4">
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Siga estas etapas simples para instalar o <strong>UniFinance</strong> no seu iPhone ou iPad usando o Safari:
                </p>

                <div className="space-y-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 bg-blue-500/10 text-blue-500 rounded-lg shrink-0">
                      <ArrowUpFromLine size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">1. Toque em Compartilhar</p>
                      <p className="text-[11px] text-slate-500">Toque no ícone de compartilhamento na barra inferior do Safari.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-1.5 bg-blue-500/10 text-blue-500 rounded-lg shrink-0">
                      <PlusSquare size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">2. Adicionar à Tela de Início</p>
                      <p className="text-[11px] text-slate-500">Role a lista de opções para baixo e selecione "Adicionar à Tela de Início".</p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2 bg-brand-primary hover:bg-brand-primary-light text-white font-semibold rounded-xl text-xs transition-colors shadow-lg shadow-brand-primary/10 cursor-pointer"
              >
                Entendi
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
