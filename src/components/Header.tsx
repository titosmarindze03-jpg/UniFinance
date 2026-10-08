/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Menu, Bell, User, Plus, X, Sparkles, LogOut, Check } from 'lucide-react';
import { useFinance } from '../contexts/FinanceContext';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const { 
    user, 
    notifications, 
    activePage, 
    setActivePage, 
    markNotifAsRead, 
    markAllNotifsAsRead, 
    clearNotif,
    saldoAtual,
    currency,
    logout
  } = useFinance();

  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifDropdownOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPageTitle = () => {
    switch (activePage) {
      case 'dashboard': return 'Painel Geral';
      case 'transactions': return 'Histórico de Movimentações';
      case 'income': return 'Adicionar Receita';
      case 'expenses': return 'Registar Despesa';
      case 'budgets': return 'Orçamentos Mensais';
      case 'goals': return 'Metas & Poupança';
      case 'reports': return 'Evolução & Relatórios';
      case 'education': return 'Educação Financeira';
      case 'ai-assistant': return 'UniFinance AI';
      case 'profile': return 'Meu Perfil';
      case 'settings': return 'Configurações';
      default: return 'Painel';
    }
  };

  const unreadNotifications = notifications.filter(n => !n.read);

  const handleNotificationClick = async (notifId: string) => {
    await markNotifAsRead(notifId);
  };

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800/80 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Page Title & Breadcrumb Area */}
      <div className="flex items-center gap-3">
        {/* Hamburger Menu on Mobile */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg lg:hidden"
          aria-label="Abrir Menu"
        >
          <Menu size={20} />
        </button>
        
        <div className="hidden sm:block">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
            <span>UniFinance</span>
            <span>/</span>
            <span className="text-brand-accent">{getPageTitle()}</span>
          </div>
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 font-sans tracking-tight">
            {getPageTitle()}
          </h2>
        </div>
        
        {/* Small header logo for mobile viewport */}
        <div className="sm:hidden font-serif font-bold text-base text-brand-primary dark:text-white flex items-center gap-1">
          <span>Uni</span>
          <span className="text-amber-500">Finance</span>
        </div>
      </div>

      {/* Action Zone - Balance overview & interactive dropdowns */}
      <div className="flex items-center gap-4">
        
        {/* Quick balance display inside header */}
        {user && (
          <div className="hidden md:flex flex-col items-end px-3 py-1 border-r border-slate-200 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Saldo Disponível</span>
            <span className={`text-xs font-mono font-bold tabular-nums ${saldoAtual >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
              {saldoAtual.toLocaleString('pt-MZ', { minimumFractionDigits: 2 })} {currency}
            </span>
          </div>
        )}

        {/* Quick Add CTA Dropdown Button */}
        {user && (
          <div className="flex gap-2">
            <button
              onClick={() => setActivePage('income')}
              className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
            >
              <Plus size={14} strokeWidth={2.5} />
              <span className="hidden sm:inline">Receita</span>
            </button>
            <button
              onClick={() => setActivePage('expenses')}
              className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
            >
              <Plus size={14} strokeWidth={2.5} />
              <span className="hidden sm:inline">Despesa</span>
            </button>
          </div>
        )}

        {/* AI Assistant Shortcut bubble */}
        {user && activePage !== 'ai-assistant' && (
          <button
            onClick={() => setActivePage('ai-assistant')}
            className="p-2 text-amber-500 hover:text-amber-600 bg-amber-500/10 hover:bg-amber-500/20 rounded-full transition-all group relative"
            title="Perguntar ao Assistente AI"
          >
            <Sparkles size={16} className="group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full animate-ping"></span>
          </button>
        )}

        {/* PWA Install Button */}
        {user && <PWAInstallButton />}

        {/* Notifications Dropdown Container */}
        {user && (
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
              className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all relative"
              aria-label="Notificações"
            >
              <Bell size={18} />
              {unreadNotifications.length > 0 && (
                <span className="absolute top-1 right-1 bg-rose-500 text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 font-mono">
                  {unreadNotifications.length}
                </span>
              )}
            </button>

            {notifDropdownOpen && (
              <div className="absolute right-0 mt-2.5 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 overflow-hidden animate-fade-in">
                <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800/60">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Alertas & Alertas</span>
                  {unreadNotifications.length > 0 && (
                    <button 
                      onClick={markAllNotifsAsRead}
                      className="text-[10px] text-brand-accent hover:underline font-semibold flex items-center gap-1"
                    >
                      <Check size={12} strokeWidth={2.5} />
                      Marcar todas
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 text-xs">
                      Não existem alertas ou notificações neste momento.
                    </div>
                  ) : (
                    notifications.map(notif => {
                      let typeColor = 'bg-blue-500/10 text-blue-500';
                      if (notif.type === 'danger') typeColor = 'bg-rose-500/10 text-rose-500';
                      if (notif.type === 'warning') typeColor = 'bg-amber-500/10 text-amber-500';
                      if (notif.type === 'success') typeColor = 'bg-emerald-500/10 text-emerald-500';

                      return (
                        <div 
                          key={notif.id} 
                          className={`p-3.5 flex items-start gap-3 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors ${!notif.read ? 'bg-slate-50/40 dark:bg-slate-800/20' : ''}`}
                        >
                          <span className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${!notif.read ? 'bg-amber-500' : 'bg-transparent'}`} />
                          <div className="flex-1">
                            <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed font-medium">
                              {notif.message}
                            </p>
                            <span className="text-[9px] text-slate-400 mt-1 block">
                              {new Date(notif.date).toLocaleDateString('pt-MZ')} às {new Date(notif.date).toLocaleTimeString('pt-MZ', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <button 
                            onClick={() => clearNotif(notif.id)}
                            className="text-slate-300 hover:text-slate-500 dark:hover:text-slate-400 shrink-0 p-0.5"
                            title="Remover"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Small Profile Quick Dropdown */}
        {user && (
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2 p-0.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-brand-primary text-amber-400 flex items-center justify-center font-bold text-xs shrink-0 select-none uppercase shadow-sm">
                {user.name.charAt(0)}
              </div>
            </button>

            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2.5 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 overflow-hidden animate-fade-in">
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30">
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate leading-none mb-1">{user.name}</p>
                  <span className="text-[10px] text-slate-400 truncate block">{user.email}</span>
                </div>
                <div className="p-1 space-y-0.5">
                  <button
                    onClick={() => { setActivePage('profile'); setProfileDropdownOpen(false); }}
                    className="w-full text-left px-3 py-2 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <User size={14} className="text-slate-400" />
                    Meu Perfil
                  </button>
                  <button
                    onClick={() => { setActivePage('settings'); setProfileDropdownOpen(false); }}
                    className="w-full text-left px-3 py-2 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <User size={14} className="text-slate-400" />
                    Configurações
                  </button>
                  <hr className="border-slate-100 dark:border-slate-800 my-1" />
                  <button
                    onClick={() => { logout(); setProfileDropdownOpen(false); }}
                    className="w-full text-left px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <LogOut size={14} className="text-rose-500" />
                    Terminar Sessão
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
