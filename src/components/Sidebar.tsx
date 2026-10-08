/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  PieChart, 
  Calculator as CalcIcon, 
  User, 
  Settings, 
  LogOut, 
  BookOpen, 
  Sparkles, 
  ShieldAlert,
  Wallet
} from 'lucide-react';
import { useFinance } from '../contexts/FinanceContext';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const { activePage, setActivePage, user, logout, showCalculator, setShowCalculator, theme } = useFinance();
  const [logoClicks, setLogoClicks] = React.useState(0);

  const menuItems = [
    { id: 'dashboard', label: 'Painel Geral', icon: LayoutDashboard },
    { id: 'transactions', label: 'Movimentações', icon: ArrowLeftRight },
    { id: 'income', label: 'Registar Receita', icon: TrendingUp },
    { id: 'expenses', label: 'Registar Despesa', icon: TrendingDown },
    { id: 'budgets', label: 'Orçamentos', icon: ShieldAlert },
    { id: 'goals', label: 'Metas / Poupança', icon: Target },
    { id: 'reports', label: 'Relatórios', icon: PieChart },
    { id: 'education', label: 'Educação Fin.', icon: BookOpen },
    { id: 'ai-assistant', label: 'UniFinance AI', icon: Sparkles, highlight: true },
  ];

  const secondaryItems = [
    { id: 'profile', label: 'Meu Perfil', icon: User },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  const handleNav = (pageId: string) => {
    setActivePage(pageId);
    setIsOpen(false); // Close mobile menu if open
  };

  const handleCalculatorToggle = () => {
    setShowCalculator(!showCalculator);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed inset-y-0 left-0 bg-brand-primary text-white w-64 z-50 transform transition-transform duration-300 lg:translate-x-0 lg:static flex flex-col justify-between h-screen overflow-hidden
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex-1 overflow-y-auto min-h-0 scrollbar-thin scrollbar-thumb-brand-primary-light/30">
          {/* Logo Brand Zone - Elegant display type with gold detail */}
          <div 
            onClick={() => {
              const newClicks = logoClicks + 1;
              if (newClicks >= 5) {
                setLogoClicks(0);
                const code = prompt('Introduza o código de acesso secreto de Administrador:');
                if (code === 'tytozadmin2026') {
                  setActivePage('admin');
                } else if (code !== null) {
                  alert('Código de acesso inválido!');
                }
              } else {
                setLogoClicks(newClicks);
              }
            }}
            className="p-6 border-b border-brand-primary-light/50 flex items-center gap-3 cursor-pointer select-none active:scale-95 transition-all duration-200"
            title="UniFinance"
          >
            <div className="bg-amber-500 text-brand-primary p-2 rounded-lg font-bold shadow-md">
              <Wallet size={20} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="font-serif text-xl tracking-tight font-bold flex items-center gap-1">
                <span>Uni</span>
                <span className="text-amber-400">Finance</span>
              </h1>
              <span className="text-[10px] text-slate-300 font-medium tracking-widest uppercase block mt-0.5">
                Sob Controle
              </span>
            </div>
          </div>

          {/* Navigation Menu Links */}
          <nav className="p-4 space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold px-3 block mb-2">
              Menu Principal
            </span>
            {menuItems.map(item => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`
                    w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all group duration-200
                    ${isActive 
                      ? 'bg-amber-500 text-brand-primary font-semibold shadow-sm' 
                      : item.highlight
                        ? 'text-amber-400 hover:bg-brand-primary-light/60 hover:text-amber-300'
                        : 'text-slate-200 hover:bg-brand-primary-light/40 hover:text-white'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={16} className={`shrink-0 ${isActive ? 'text-brand-primary' : item.highlight ? 'text-amber-400 group-hover:animate-pulse' : 'text-slate-300'}`} />
                    <span className="whitespace-nowrap">{item.label}</span>
                  </div>
                  {item.highlight && !isActive && (
                    <span className="bg-amber-400/20 text-amber-300 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                      Novo
                    </span>
                  )}
                </button>
              );
            })}

            {/* Separator / Utility Tools */}
            <div className="pt-4 mt-2 border-t border-brand-primary-light/40">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold px-3 block mb-2">
                Utilidades
              </span>
              <button
                onClick={handleCalculatorToggle}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all text-slate-200 hover:bg-brand-primary-light/40 hover:text-white
                  ${showCalculator ? 'bg-brand-primary-light/70 text-amber-300' : ''}
                `}
              >
                <CalcIcon size={16} className="text-slate-300" />
                <span className="whitespace-nowrap">Calculadora Integrada</span>
              </button>
            </div>
          </nav>

          {/* User profile & configurations */}
          <div className="p-4 border-t border-brand-primary-light/50 bg-[#07192F]/60">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold px-3 block mb-2">
            Ajustes & Conta
          </span>
          <div className="space-y-1 mb-4">
            {user?.email === 'titosmarindze03@gmail.com' && (
              <button
                onClick={() => handleNav('admin')}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all mb-1.5 duration-200 border cursor-pointer
                  ${activePage === 'admin' 
                    ? 'bg-rose-500 text-white border-rose-600 font-bold shadow-xs' 
                    : 'text-amber-300 border-amber-500/20 hover:bg-brand-primary-light/60 hover:text-amber-200'
                  }
                `}
              >
                <ShieldAlert size={16} className={activePage === 'admin' ? 'text-white' : 'text-amber-400'} />
                <span className="whitespace-nowrap">Painel Secreto Admin 🔐</span>
              </button>
            )}

            {secondaryItems.map(item => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all
                    ${isActive 
                      ? 'bg-amber-500 text-brand-primary font-semibold' 
                      : 'text-slate-200 hover:bg-brand-primary-light/40 hover:text-white'
                    }
                  `}
                >
                  <Icon size={16} className={isActive ? 'text-brand-primary' : 'text-slate-300'} />
                  <span className="whitespace-nowrap">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Connected User Profile Indicator */}
          {user && (
            <div className="flex items-center gap-3 p-2 bg-brand-primary-light/40 rounded-xl mb-3 border border-brand-primary-light/20">
              <div className="w-8 h-8 rounded-full bg-amber-400 text-brand-primary flex items-center justify-center font-bold text-sm shrink-0 uppercase shadow-inner">
                {user.name.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-white truncate leading-none mb-1">{user.name}</p>
                <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase block">{user.role}</span>
              </div>
            </div>
          )}
        </div>
        </div>
      </aside>
    </>
  );
};
