/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Mail, Github, MessageSquare, Heart, ExternalLink, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-12 pt-8 border-t border-slate-200/60 dark:border-slate-800/80 text-slate-500 dark:text-slate-400">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        
        {/* Left Side: Developer Info */}
        <div className="space-y-1.5 text-center md:text-left">
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            Desenvolvido por
          </p>
          <a
            href="https://tytozdevsolutions.com" // Placeholder for developer website
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 text-sm font-bold text-[#0B2545] dark:text-amber-400 hover:text-brand-primary-light dark:hover:text-amber-300 transition-colors"
          >
            <span>tytozdevsolutions</span>
            <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
          <p className="text-[11px] text-slate-400">
            Soluções digitais inteligentes sob medida.
          </p>
        </div>

        {/* Center Side: Motivational Message */}
        <div className="text-center px-4 space-y-1">
          <p className="text-xs italic font-medium leading-relaxed max-w-sm mx-auto text-slate-600 dark:text-slate-350">
            "O controle financeiro não limita a sua liberdade; ele a constrói. Comece pequeno, planeie com sabedoria e colha o futuro que merece."
          </p>
          <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400">
            <span>UniFinance</span>
            <Heart size={10} className="text-rose-500 fill-rose-500 animate-pulse" />
            <span>Seu dinheiro, sob controle.</span>
          </div>
        </div>

        {/* Right Side: Quick Contact Handles */}
        <div className="flex flex-col items-center md:items-end gap-3">
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            Conecte-se Connosco
          </p>
          <div className="flex items-center gap-2.5">
            {/* Email link */}
            <a
              href="mailto:titosmarindze03@gmail.com"
              className="p-2 bg-slate-100 hover:bg-[#0B2545] dark:bg-slate-800 dark:hover:bg-amber-400 hover:text-white dark:hover:text-[#0B2545] text-slate-600 dark:text-slate-300 rounded-xl transition-all shadow-xs"
              title="Enviar Email"
            >
              <Mail size={15} />
            </a>

            {/* Github Link */}
            <a
              href="https://github.com/titosmarindze03" // Standard GitHub path
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-slate-100 hover:bg-[#0B2545] dark:bg-slate-800 dark:hover:bg-amber-400 hover:text-white dark:hover:text-[#0B2545] text-slate-600 dark:text-slate-300 rounded-xl transition-all shadow-xs"
              title="GitHub"
            >
              <Github size={15} />
            </a>

            {/* WhatsApp Link */}
            <a
              href="https://wa.me/258840000000" // Customizable Mozambique WhatsApp URL prefix
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-slate-100 hover:bg-emerald-600 dark:bg-slate-800 dark:hover:bg-emerald-500 hover:text-white dark:hover:text-white text-slate-600 dark:text-slate-300 rounded-xl transition-all shadow-xs"
              title="WhatsApp"
            >
              <MessageSquare size={15} />
            </a>
          </div>
          <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
            <ShieldCheck size={11} className="text-emerald-500" />
            <span>Plataforma 100% Segura</span>
          </div>
        </div>

      </div>

      {/* Copyright row */}
      <div className="mt-8 pt-4 pb-6 border-t border-slate-100 dark:border-slate-800/40 text-center text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
        &copy; {new Date().getFullYear()} UniFinance. Todos os direitos reservados.
      </div>
    </footer>
  );
};
