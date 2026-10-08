/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Transaction, Category, Budget, Goal, FinancialNotification, UserProfile } from '../types/finance';
import { UniFinanceDB, DEFAULT_CATEGORIES } from '../services/db';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface FinanceContextType {
  user: UserProfile | null;
  isLoading: boolean;
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
  goals: Goal[];
  notifications: FinancialNotification[];
  activePage: string;
  theme: 'light' | 'dark';
  showCalculator: boolean;
  toasts: ToastMessage[];
  currency: string;
  
  // Financial metrics
  saldoInicial: number;
  totalReceitas: number;
  totalDespesas: number;
  totalDestinadoMetas: number;
  saldoAtual: number;

  // Setters & Actions
  setActivePage: (page: string) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  setCurrency: (currency: string) => void;
  setShowCalculator: (show: boolean) => void;
  addToast: (message: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
  
  // Auth actions
  login: (email: string, passwordHash: string) => Promise<void>;
  register: (name: string, email: string, passwordHash: string) => Promise<void>;
  logout: () => void;
  recoverPassword: (email: string) => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  completeOnboarding: (saldoInicial: number, mainCategories: string[], firstGoal?: { name: string; target: number }) => Promise<void>;
  resetAllData: () => Promise<void>;

  // Financial actions
  addTransaction: (tx: Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTransaction: (id: string, tx: Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  addCategory: (name: string, type: 'income' | 'expense', icon: string, description?: string) => Promise<void>;
  addOrUpdateBudget: (categoryId: string, amount: number) => Promise<void>;
  deleteBudget: (budgetId: string) => Promise<void>;
  addGoal: (goal: Omit<Goal, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateGoal: (id: string, updates: Partial<Omit<Goal, 'id' | 'userId' | 'createdAt'>>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  depositToGoal: (goalId: string, amount: number) => Promise<void>;
  
  // Notification actions
  markNotifAsRead: (id: string) => Promise<void>;
  markAllNotifsAsRead: () => Promise<void>;
  clearNotif: (id: string) => Promise<void>;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [notifications, setNotifications] = useState<FinancialNotification[]>([]);
  
  const [activePage, setActivePageState] = useState<string>('landing');
  const [theme, setThemeState] = useState<'light' | 'dark'>('light');
  const [showCalculator, setShowCalculator] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [currency, setCurrencyState] = useState<string>('MZN');

  // Load active user from localStorage on start
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      const storedUserId = localStorage.getItem('unifinance_logged_user_id');
      const savedTheme = localStorage.getItem('unifinance_theme') as 'light' | 'dark' || 'light';
      
      setThemeState(savedTheme);
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      if (storedUserId) {
        try {
          const profile = await UniFinanceDB.getProfile(storedUserId);
          if (profile) {
            setUser(profile);
            setCurrencyState(profile.defaultCurrency || 'MZN');
            
            if (profile.onboardingCompleted) {
              setActivePageState('dashboard');
            } else {
              setActivePageState('onboarding');
            }
          } else {
            localStorage.removeItem('unifinance_logged_user_id');
            setActivePageState('landing');
          }
        } catch (error) {
          console.error('Error fetching stored profile', error);
          setActivePageState('landing');
        }
      } else {
        setActivePageState('landing');
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  // Sync user data whenever user logs in or user changes
  useEffect(() => {
    if (!user) {
      setTransactions([]);
      setCategories([]);
      setBudgets([]);
      setGoals([]);
      setNotifications([]);
      return;
    }

    const loadUserData = async () => {
      try {
        const [txs, cats, buds, gls, notifs] = await Promise.all([
          UniFinanceDB.getTransactions(user.id),
          UniFinanceDB.getCategories(user.id),
          UniFinanceDB.getBudgets(user.id),
          UniFinanceDB.getGoals(user.id),
          UniFinanceDB.getNotifications(user.id)
        ]);
        
        setTransactions(txs);
        setCategories(cats);
        setBudgets(buds);
        setGoals(gls);
        setNotifications(notifs);
        setCurrencyState(user.defaultCurrency || 'MZN');
      } catch (error) {
        console.error('Error loading user dashboard data', error);
        addToast('Ocorreu um erro ao carregar os seus dados financeiros.', 'error');
      }
    };

    loadUserData();
  }, [user]);

  // Set theme & sync HTML element
  const setTheme = (t: 'light' | 'dark') => {
    setThemeState(t);
    localStorage.setItem('unifinance_theme', t);
    if (t === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const setCurrency = async (curr: string) => {
    if (user && user.defaultCurrency === curr) {
      setCurrencyState(curr);
      return;
    }
    setCurrencyState(curr);
    if (user) {
      await updateProfile({ defaultCurrency: curr });
    }
  };

  const setActivePage = (page: string) => {
    if (!user && !['landing', 'login', 'register', 'recover-password'].includes(page)) {
      setActivePageState('login');
    } else {
      setActivePageState(page);
    }
    // Auto scroll to top when navigation occurs
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toast Management
  const addToast = (message: string, type: ToastMessage['type'] = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // --- METRIC CALCULATIONS ---
  const saldoInicial = user?.saldoInicial ?? 10000;
  
  const totalReceitas = transactions
    .filter(t => t.type === 'income' && t.description !== 'Saldo Inicial Registado')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalDespesas = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalDestinadoMetas = goals
    .reduce((acc, g) => acc + g.currentAmount, 0);

  const saldoAtual = saldoInicial + totalReceitas - totalDespesas;

  // --- AUTH ACTIONS ---
  const login = async (email: string, passwordHash: string) => {
    setIsLoading(true);
    try {
      const profile = await UniFinanceDB.loginUser(email, passwordHash);
      setUser(profile);
      localStorage.setItem('unifinance_logged_user_id', profile.id);
      addToast(`Bem-vindo de volta, ${profile.name}! 👋`, 'success');
      
      if (profile.onboardingCompleted) {
        setActivePageState('dashboard');
      } else {
        setActivePageState('onboarding');
      }
    } catch (error: any) {
      addToast(error.message || 'Erro ao realizar login.', 'error');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, passwordHash: string) => {
    setIsLoading(true);
    try {
      const profile = await UniFinanceDB.registerUser(name, email, passwordHash);
      setUser(profile);
      localStorage.setItem('unifinance_logged_user_id', profile.id);
      addToast('Conta criada com sucesso! Seja bem-vindo ao UniFinance.', 'success');
      setActivePageState('onboarding');
    } catch (error: any) {
      addToast(error.message || 'Erro ao criar conta.', 'error');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('unifinance_logged_user_id');
    addToast('Sessão encerrada com sucesso.', 'info');
    setActivePageState('landing');
  };

  const recoverPassword = async (email: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated network
      addToast(`Instruções de recuperação enviadas para o email: ${email}`, 'info');
    } catch (error: any) {
      addToast('Erro ao processar recuperação de senha.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    try {
      const updated = await UniFinanceDB.updateProfile(user.id, updates);
      setUser(updated);
      setCurrencyState(updated.defaultCurrency);
      addToast('Perfil atualizado com sucesso!', 'success');
    } catch (error: any) {
      addToast(error.message || 'Erro ao atualizar perfil.', 'error');
    }
  };

  const completeOnboarding = async (
    sInicial: number, 
    mainCategories: string[], 
    firstGoal?: { name: string; target: number }
  ) => {
    if (!user) return;
    setIsLoading(true);
    try {
      const updatedProfile = await UniFinanceDB.updateProfile(user.id, {
        saldoInicial: sInicial,
        onboardingCompleted: true
      });
      setUser(updatedProfile);

      // Create a transaction mapping to this initial setup if they want
      if (sInicial > 0) {
        await UniFinanceDB.addTransaction(user.id, {
          type: 'income',
          description: 'Saldo Inicial Registado',
          amount: sInicial,
          categoryId: 'inc-outros',
          paymentMethod: 'Dinheiro',
          date: new Date().toISOString().split('T')[0],
          notes: 'Configurado durante o onboarding de boas-vindas.'
        });
      }

      // If first goal is specified
      if (firstGoal && firstGoal.name && firstGoal.target > 0) {
        await UniFinanceDB.addGoal(user.id, {
          name: firstGoal.name,
          targetAmount: firstGoal.target,
          currentAmount: 0,
          category: 'Poupança',
          description: 'Minha primeira meta criada no UniFinance!'
        });
      }

      // Reload
      const txs = await UniFinanceDB.getTransactions(user.id);
      const gls = await UniFinanceDB.getGoals(user.id);
      setTransactions(txs);
      setGoals(gls);

      addToast('Onboarding concluído! O UniFinance está pronto a usar.', 'success');
      setActivePageState('dashboard');
    } catch (error: any) {
      addToast('Erro ao salvar configurações de onboarding.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // --- FINANCIAL ACTIONS ---
  const addTransaction = async (txData: Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;
    try {
      await UniFinanceDB.addTransaction(user.id, txData);
      
      // Reload Transactions and Notifications
      const [txs, notifs] = await Promise.all([
        UniFinanceDB.getTransactions(user.id),
        UniFinanceDB.getNotifications(user.id)
      ]);
      setTransactions(txs);
      setNotifications(notifs);
      
      addToast(txData.type === 'income' ? 'Receita adicionada com sucesso!' : 'Despesa registada com sucesso!', 'success');
    } catch (error: any) {
      addToast(error.message || 'Erro ao adicionar movimentação.', 'error');
      throw error;
    }
  };

  const updateTransaction = async (txId: string, txData: Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;
    try {
      await UniFinanceDB.updateTransaction(user.id, txId, txData);
      
      const [txs, notifs] = await Promise.all([
        UniFinanceDB.getTransactions(user.id),
        UniFinanceDB.getNotifications(user.id)
      ]);
      setTransactions(txs);
      setNotifications(notifs);
      
      addToast('Movimentação atualizada com sucesso!', 'success');
    } catch (error: any) {
      addToast(error.message || 'Erro ao atualizar movimentação.', 'error');
      throw error;
    }
  };

  const deleteTransaction = async (txId: string) => {
    if (!user) return;
    try {
      await UniFinanceDB.deleteTransaction(user.id, txId);
      
      const [txs, notifs] = await Promise.all([
        UniFinanceDB.getTransactions(user.id),
        UniFinanceDB.getNotifications(user.id)
      ]);
      setTransactions(txs);
      setNotifications(notifs);
      
      addToast('Movimentação eliminada com sucesso.', 'info');
    } catch (error: any) {
      addToast(error.message || 'Erro ao eliminar movimentação.', 'error');
      throw error;
    }
  };

  const addCategory = async (name: string, type: 'income' | 'expense', icon: string, description?: string) => {
    if (!user) return;
    try {
      await UniFinanceDB.addCategory(user.id, name, type, icon, description);
      const cats = await UniFinanceDB.getCategories(user.id);
      setCategories(cats);
      addToast(`Categoria "${name}" adicionada com sucesso.`, 'success');
    } catch (error: any) {
      addToast(error.message || 'Erro ao criar categoria.', 'error');
      throw error;
    }
  };

  const addOrUpdateBudget = async (categoryId: string, amount: number) => {
    if (!user) return;
    try {
      await UniFinanceDB.addOrUpdateBudget(user.id, categoryId, amount);
      
      const [buds, notifs] = await Promise.all([
        UniFinanceDB.getBudgets(user.id),
        UniFinanceDB.getNotifications(user.id)
      ]);
      setBudgets(buds);
      setNotifications(notifs);
      
      addToast('Orçamento guardado com sucesso!', 'success');
    } catch (error: any) {
      addToast(error.message || 'Erro ao definir orçamento.', 'error');
      throw error;
    }
  };

  const deleteBudget = async (budgetId: string) => {
    if (!user) return;
    try {
      await UniFinanceDB.deleteBudget(user.id, budgetId);
      const buds = await UniFinanceDB.getBudgets(user.id);
      setBudgets(buds);
      addToast('Orçamento removido com sucesso.', 'info');
    } catch (error: any) {
      addToast('Erro ao remover orçamento.', 'error');
    }
  };

  const addGoal = async (goalData: Omit<Goal, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;
    try {
      await UniFinanceDB.addGoal(user.id, goalData);
      
      const [gls, notifs] = await Promise.all([
        UniFinanceDB.getGoals(user.id),
        UniFinanceDB.getNotifications(user.id)
      ]);
      setGoals(gls);
      setNotifications(notifs);
      
      addToast('Meta financeira criada com sucesso!', 'success');
    } catch (error: any) {
      addToast(error.message || 'Erro ao criar meta.', 'error');
      throw error;
    }
  };

  const updateGoal = async (goalId: string, updates: Partial<Omit<Goal, 'id' | 'userId' | 'createdAt'>>) => {
    if (!user) return;
    try {
      await UniFinanceDB.updateGoal(user.id, goalId, updates);
      
      const [gls, notifs] = await Promise.all([
        UniFinanceDB.getGoals(user.id),
        UniFinanceDB.getNotifications(user.id)
      ]);
      setGoals(gls);
      setNotifications(notifs);
      
      addToast('Meta financeira atualizada com sucesso!', 'success');
    } catch (error: any) {
      addToast(error.message || 'Erro ao atualizar meta.', 'error');
      throw error;
    }
  };

  const deleteGoal = async (goalId: string) => {
    if (!user) return;
    try {
      await UniFinanceDB.deleteGoal(user.id, goalId);
      const gls = await UniFinanceDB.getGoals(user.id);
      setGoals(gls);
      addToast('Meta financeira eliminada.', 'info');
    } catch (error: any) {
      addToast('Erro ao eliminar meta.', 'error');
    }
  };

  const depositToGoal = async (goalId: string, amount: number) => {
    if (!user) return;
    try {
      const targetGoal = goals.find(g => g.id === goalId);
      if (!targetGoal) return;
      
      const newAmount = targetGoal.currentAmount + amount;
      await UniFinanceDB.updateGoal(user.id, goalId, { currentAmount: newAmount });
      
      const gls = await UniFinanceDB.getGoals(user.id);
      setGoals(gls);
      addToast(`Depositado ${amount.toLocaleString('pt-MZ')} MZN na meta "${targetGoal.name}".`, 'success');
    } catch (error: any) {
      addToast('Erro ao depositar na meta.', 'error');
    }
  };

  const resetAllData = async () => {
    if (!user) return;
    try {
      await UniFinanceDB.resetUserData(user.id);
      
      const [txs, cats, buds, gls, notifs] = await Promise.all([
        UniFinanceDB.getTransactions(user.id),
        UniFinanceDB.getCategories(user.id),
        UniFinanceDB.getBudgets(user.id),
        UniFinanceDB.getGoals(user.id),
        UniFinanceDB.getNotifications(user.id)
      ]);
      
      setTransactions(txs);
      setCategories(cats);
      setBudgets(buds);
      setGoals(gls);
      setNotifications(notifs);
      
      const updatedProfile = await UniFinanceDB.updateProfile(user.id, {
        saldoInicial: 0,
        onboardingCompleted: false
      });
      setUser(updatedProfile);
      
      addToast('A sua conta foi reiniciada com sucesso.', 'info');
      setActivePageState('onboarding');
    } catch (error) {
      addToast('Erro ao reiniciar os seus dados.', 'error');
    }
  };

  // --- NOTIFICATION ACTIONS ---
  const markNotifAsRead = async (id: string) => {
    if (!user) return;
    try {
      await UniFinanceDB.markNotificationAsRead(user.id, id);
      const notifs = await UniFinanceDB.getNotifications(user.id);
      setNotifications(notifs);
    } catch (error) {
      console.error(error);
    }
  };

  const markAllNotifsAsRead = async () => {
    if (!user) return;
    try {
      await UniFinanceDB.markAllNotificationsAsRead(user.id);
      const notifs = await UniFinanceDB.getNotifications(user.id);
      setNotifications(notifs);
      addToast('Todas as notificações foram marcadas como lidas.', 'info');
    } catch (error) {
      console.error(error);
    }
  };

  const clearNotif = async (id: string) => {
    if (!user) return;
    try {
      await UniFinanceDB.clearNotification(user.id, id);
      const notifs = await UniFinanceDB.getNotifications(user.id);
      setNotifications(notifs);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FinanceContext.Provider value={{
      user,
      isLoading,
      transactions,
      categories,
      budgets,
      goals,
      notifications,
      activePage,
      theme,
      showCalculator,
      toasts,
      currency,
      saldoInicial,
      totalReceitas,
      totalDespesas,
      totalDestinadoMetas,
      saldoAtual,
      setActivePage,
      setTheme,
      toggleTheme,
      setCurrency,
      setShowCalculator,
      addToast,
      removeToast,
      login,
      register,
      logout,
      recoverPassword,
      updateProfile,
      completeOnboarding,
      resetAllData,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      addCategory,
      addOrUpdateBudget,
      deleteBudget,
      addGoal,
      updateGoal,
      deleteGoal,
      depositToGoal,
      markNotifAsRead,
      markAllNotifsAsRead,
      clearNotif
    }}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance deve ser utilizado dentro de um FinanceProvider');
  }
  return context;
};
