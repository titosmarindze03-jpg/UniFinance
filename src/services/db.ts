/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Transaction, Category, Budget, Goal, FinancialNotification, UserProfile } from '../types/finance';

// Default categories available to everyone
export const DEFAULT_CATEGORIES: Category[] = [
  // Income
  { id: 'inc-salario', name: 'Salário', type: 'income', icon: 'Briefcase', description: 'Rendimentos de trabalho fixo' },
  { id: 'inc-bolsa', name: 'Bolsa de estudos', type: 'income', icon: 'GraduationCap', description: 'Apoio de estudos universitários' },
  { id: 'inc-mesada', name: 'Mesada', type: 'income', icon: 'Coins', description: 'Mesada familiar ou apoio regular' },
  { id: 'inc-freelance', name: 'Freelance', type: 'income', icon: 'Cpu', description: 'Trabalhos pontuais e projetos independentes' },
  { id: 'inc-negocio', name: 'Negócio', type: 'income', icon: 'Store', description: 'Rendimentos de empreendedorismo próprio' },
  { id: 'inc-invest', name: 'Investimento', type: 'income', icon: 'TrendingUp', description: 'Retorno de investimentos financeiros' },
  { id: 'inc-outros', name: 'Outros (Receita)', type: 'income', icon: 'PlusCircle', description: 'Outras fontes de receita' },
  
  // Expenses
  { id: 'exp-alimentacao', name: 'Alimentação', type: 'expense', icon: 'Utensils', description: 'Supermercado, restaurantes, lanches' },
  { id: 'exp-transporte', name: 'Transporte', type: 'expense', icon: 'Car', description: 'Chapa, táxi, combustível, manutenção' },
  { id: 'exp-educacao', name: 'Educação', type: 'expense', icon: 'BookOpen', description: 'Propinas, livros, material escolar' },
  { id: 'exp-internet', name: 'Internet', type: 'expense', icon: 'Wifi', description: 'Pacotes de dados e internet fixa' },
  { id: 'exp-comunicacao', name: 'Comunicação', type: 'expense', icon: 'Phone', description: 'Crédito de chamadas e mensagens' },
  { id: 'exp-habitacao', name: 'Habitação', type: 'expense', icon: 'Home', description: 'Aluguer, água, energia (Credelec)' },
  { id: 'exp-saude', name: 'Saúde', type: 'expense', icon: 'HeartPulse', description: 'Farmácia, consultas, seguro de saúde' },
  { id: 'exp-compras', name: 'Compras', type: 'expense', icon: 'ShoppingBag', description: 'Vestuário, calçado, bens pessoais' },
  { id: 'exp-entretenimento', name: 'Entretenimento', type: 'expense', icon: 'Tv', description: 'Cinema, streaming, saídas com amigos' },
  { id: 'exp-viagens', name: 'Viagens', type: 'expense', icon: 'Compass', description: 'Passagens, hotéis, deslocações de lazer' },
  { id: 'exp-dividas', name: 'Dívidas', type: 'expense', icon: 'Receipt', description: 'Pagamento de empréstimos, créditos' },
  { id: 'exp-outros', name: 'Outros (Despesa)', type: 'expense', icon: 'HelpCircle', description: 'Outras despesas imprevistas' }
];

// Helper delay to simulate actual database/API networking
const networkDelay = (ms = 250) => new Promise(resolve => setTimeout(resolve, ms));

// Helper for localStorage with types
const getStorageItem = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage`, error);
    return defaultValue;
  }
};

const setStorageItem = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing ${key} to localStorage`, error);
  }
};

// Database state structures
interface UserCredentials {
  userId: string;
  email: string;
  passwordHash: string; // Simulated secure storage
}

export const UniFinanceDB = {
  // --- AUTHENTICATION & PROFILES ---
  async registerUser(name: string, email: string, passwordHash: string): Promise<UserProfile> {
    await networkDelay();
    const normalizedEmail = email.toLowerCase().trim();
    
    // Check if user already exists
    const credentials: UserCredentials[] = getStorageItem('unifinance_credentials', []);
    if (credentials.some(c => c.email === normalizedEmail)) {
      throw new Error('Este email já está registado na plataforma.');
    }

    const userId = 'usr_' + Math.random().toString(36).substring(2, 11);
    
    // Save credentials
    credentials.push({ userId, email: normalizedEmail, passwordHash });
    setStorageItem('unifinance_credentials', credentials);

    // Create profile
    const profile: UserProfile = {
      id: userId,
      name,
      email: normalizedEmail,
      role: 'USER',
      defaultCurrency: 'MZN',
      onboardingCompleted: false,
      createdAt: new Date().toISOString()
    };

    const profiles: UserProfile[] = getStorageItem('unifinance_profiles', []);
    profiles.push(profile);
    setStorageItem('unifinance_profiles', profiles);

    // Start with a completely clean profile without preloaded mock data
    // (no transactions, no budgets, no goals, no notifications)

    return profile;
  },

  async loginUser(email: string, passwordHash: string): Promise<UserProfile> {
    await networkDelay();
    const normalizedEmail = email.toLowerCase().trim();
    
    const credentials: UserCredentials[] = getStorageItem('unifinance_credentials', []);
    const matchingCred = credentials.find(c => c.email === normalizedEmail && c.passwordHash === passwordHash);
    
    if (!matchingCred) {
      throw new Error('Email ou senha incorretos. Por favor tente novamente.');
    }

    const profiles: UserProfile[] = getStorageItem('unifinance_profiles', []);
    const profile = profiles.find(p => p.id === matchingCred.userId);

    if (!profile) {
      throw new Error('Perfil de utilizador não encontrado.');
    }

    return profile;
  },

  async getProfile(userId: string): Promise<UserProfile | null> {
    await networkDelay();
    const profiles: UserProfile[] = getStorageItem('unifinance_profiles', []);
    return profiles.find(p => p.id === userId) || null;
  },

  async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    await networkDelay();
    const profiles: UserProfile[] = getStorageItem('unifinance_profiles', []);
    const index = profiles.findIndex(p => p.id === userId);
    
    if (index === -1) {
      throw new Error('Perfil não encontrado para atualização.');
    }

    const updatedProfile = { ...profiles[index], ...updates };
    profiles[index] = updatedProfile;
    setStorageItem('unifinance_profiles', profiles);

    return updatedProfile;
  },

  // --- TRANSACTIONS (RECEITAS & DESPESAS) ---
  async getTransactions(userId: string): Promise<Transaction[]> {
    await networkDelay();
    const allTx: Transaction[] = getStorageItem('unifinance_transactions', []);
    return allTx.filter(tx => tx.userId === userId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  async addTransaction(userId: string, txData: Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Transaction> {
    await networkDelay();
    if (txData.amount <= 0) {
      throw new Error('O valor da transação deve ser superior a zero.');
    }
    
    const newTx: Transaction = {
      ...txData,
      id: 'tx_' + Math.random().toString(36).substring(2, 11),
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const allTx: Transaction[] = getStorageItem('unifinance_transactions', []);
    allTx.push(newTx);
    setStorageItem('unifinance_transactions', allTx);

    // After adding transaction, verify and trigger notifications for budgets
    await this.evaluateBudgetsAndNotify(userId, newTx.categoryId);

    return newTx;
  },

  async updateTransaction(userId: string, txId: string, updates: Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Transaction> {
    await networkDelay();
    if (updates.amount <= 0) {
      throw new Error('O valor da transação deve ser superior a zero.');
    }

    const allTx: Transaction[] = getStorageItem('unifinance_transactions', []);
    const index = allTx.findIndex(tx => tx.id === txId && tx.userId === userId);

    if (index === -1) {
      throw new Error('Transação não encontrada ou sem permissão de acesso.');
    }

    const updatedTx: Transaction = {
      ...allTx[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    allTx[index] = updatedTx;
    setStorageItem('unifinance_transactions', allTx);

    await this.evaluateBudgetsAndNotify(userId, updatedTx.categoryId);

    return updatedTx;
  },

  async deleteTransaction(userId: string, txId: string): Promise<void> {
    await networkDelay();
    const allTx: Transaction[] = getStorageItem('unifinance_transactions', []);
    const txToDelete = allTx.find(tx => tx.id === txId && tx.userId === userId);
    
    if (!txToDelete) {
      throw new Error('Transação não encontrada ou sem permissão de eliminação.');
    }

    const filtered = allTx.filter(tx => !(tx.id === txId && tx.userId === userId));
    setStorageItem('unifinance_transactions', filtered);

    await this.evaluateBudgetsAndNotify(userId, txToDelete.categoryId);
  },

  // --- CATEGORIES ---
  async getCategories(userId: string): Promise<Category[]> {
    await networkDelay();
    const custom: Category[] = getStorageItem('unifinance_custom_categories', []);
    const userCustom = custom.filter(c => c.userId === userId);
    return [...DEFAULT_CATEGORIES, ...userCustom];
  },

  async addCategory(userId: string, name: string, type: 'income' | 'expense', icon: string, description?: string): Promise<Category> {
    await networkDelay();
    const custom: Category[] = getStorageItem('unifinance_custom_categories', []);
    
    // Check duplication
    const all = [...DEFAULT_CATEGORIES, ...custom.filter(c => c.userId === userId)];
    if (all.some(c => c.name.toLowerCase() === name.toLowerCase() && c.type === type)) {
      throw new Error('Já existe uma categoria com este nome para este tipo.');
    }

    const newCat: Category = {
      id: 'cat_' + Math.random().toString(36).substring(2, 11),
      userId,
      name,
      type,
      icon,
      description
    };

    custom.push(newCat);
    setStorageItem('unifinance_custom_categories', custom);
    return newCat;
  },

  // --- BUDGETS (ORÇAMENTOS) ---
  async getBudgets(userId: string): Promise<Budget[]> {
    await networkDelay();
    const budgets: Budget[] = getStorageItem('unifinance_budgets', []);
    return budgets.filter(b => b.userId === userId);
  },

  async addOrUpdateBudget(userId: string, categoryId: string, amount: number): Promise<Budget> {
    await networkDelay();
    if (amount <= 0) {
      throw new Error('O valor do orçamento deve ser superior a zero.');
    }

    const budgets: Budget[] = getStorageItem('unifinance_budgets', []);
    const index = budgets.findIndex(b => b.userId === userId && b.categoryId === categoryId);

    let budget: Budget;

    if (index !== -1) {
      budget = {
        ...budgets[index],
        amount,
        startDate: new Date().toISOString()
      };
      budgets[index] = budget;
    } else {
      budget = {
        id: 'bud_' + Math.random().toString(36).substring(2, 11),
        userId,
        categoryId,
        amount,
        period: 'monthly',
        startDate: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };
      budgets.push(budget);
    }

    setStorageItem('unifinance_budgets', budgets);
    await this.evaluateBudgetsAndNotify(userId, categoryId);

    return budget;
  },

  async deleteBudget(userId: string, budgetId: string): Promise<void> {
    await networkDelay();
    const budgets: Budget[] = getStorageItem('unifinance_budgets', []);
    const filtered = budgets.filter(b => !(b.id === budgetId && b.userId === userId));
    setStorageItem('unifinance_budgets', filtered);
  },

  // --- GOALS (METAS FINANCEIRAS) ---
  async getGoals(userId: string): Promise<Goal[]> {
    await networkDelay();
    const goals: Goal[] = getStorageItem('unifinance_goals', []);
    return goals.filter(g => g.userId === userId);
  },

  async addGoal(userId: string, goalData: Omit<Goal, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Goal> {
    await networkDelay();
    if (goalData.targetAmount <= 0) {
      throw new Error('O valor objetivo deve ser superior a zero.');
    }
    if (goalData.currentAmount < 0) {
      throw new Error('O valor guardado atualmente não pode ser negativo.');
    }

    const newGoal: Goal = {
      ...goalData,
      id: 'goal_' + Math.random().toString(36).substring(2, 11),
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const goals: Goal[] = getStorageItem('unifinance_goals', []);
    goals.push(newGoal);
    setStorageItem('unifinance_goals', goals);

    await this.evaluateGoalsAndNotify(userId, newGoal);

    return newGoal;
  },

  async updateGoal(userId: string, goalId: string, updates: Partial<Omit<Goal, 'id' | 'userId' | 'createdAt'>>): Promise<Goal> {
    await networkDelay();
    const goals: Goal[] = getStorageItem('unifinance_goals', []);
    const index = goals.findIndex(g => g.id === goalId && g.userId === userId);

    if (index === -1) {
      throw new Error('Meta financeira não encontrada.');
    }

    const updatedGoal: Goal = {
      ...goals[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    goals[index] = updatedGoal;
    setStorageItem('unifinance_goals', goals);

    await this.evaluateGoalsAndNotify(userId, updatedGoal);

    return updatedGoal;
  },

  async deleteGoal(userId: string, goalId: string): Promise<void> {
    await networkDelay();
    const goals: Goal[] = getStorageItem('unifinance_goals', []);
    const filtered = goals.filter(g => !(g.id === goalId && g.userId === userId));
    setStorageItem('unifinance_goals', filtered);
  },

  // --- NOTIFICATIONS ---
  async getNotifications(userId: string): Promise<FinancialNotification[]> {
    await networkDelay();
    const notifs: FinancialNotification[] = getStorageItem('unifinance_notifications', []);
    return notifs.filter(n => n.userId === userId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  async addNotification(userId: string, message: string, type: FinancialNotification['type']): Promise<FinancialNotification> {
    const notifs: FinancialNotification[] = getStorageItem('unifinance_notifications', []);
    
    // Prevent duplicate unread notifications with identical messages
    if (notifs.some(n => n.userId === userId && n.message === message && !n.read)) {
      return notifs.find(n => n.userId === userId && n.message === message && !n.read)!;
    }

    const newNotif: FinancialNotification = {
      id: 'not_' + Math.random().toString(36).substring(2, 11),
      userId,
      message,
      type,
      date: new Date().toISOString(),
      read: false
    };

    notifs.push(newNotif);
    setStorageItem('unifinance_notifications', notifs);
    return newNotif;
  },

  async markNotificationAsRead(userId: string, notifId: string): Promise<void> {
    await networkDelay(100);
    const notifs: FinancialNotification[] = getStorageItem('unifinance_notifications', []);
    const index = notifs.findIndex(n => n.id === notifId && n.userId === userId);
    if (index !== -1) {
      notifs[index].read = true;
      setStorageItem('unifinance_notifications', notifs);
    }
  },

  async markAllNotificationsAsRead(userId: string): Promise<void> {
    await networkDelay(100);
    const notifs: FinancialNotification[] = getStorageItem('unifinance_notifications', []);
    const updated = notifs.map(n => n.userId === userId ? { ...n, read: true } : n);
    setStorageItem('unifinance_notifications', updated);
  },

  async clearNotification(userId: string, notifId: string): Promise<void> {
    await networkDelay(100);
    const notifs: FinancialNotification[] = getStorageItem('unifinance_notifications', []);
    const filtered = notifs.filter(n => !(n.id === notifId && n.userId === userId));
    setStorageItem('unifinance_notifications', filtered);
  },

  // --- BUDGET & GOAL NOTIFICATION RUNTIME VERIFIER ---
  async evaluateBudgetsAndNotify(userId: string, categoryId: string): Promise<void> {
    const budgets: Budget[] = getStorageItem('unifinance_budgets', []);
    const budget = budgets.find(b => b.userId === userId && b.categoryId === categoryId);
    if (!budget) return;

    const allTx: Transaction[] = getStorageItem('unifinance_transactions', []);
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    // Get current month expense total for this category
    const totalSpent = allTx
      .filter(tx => 
        tx.userId === userId && 
        tx.categoryId === categoryId && 
        tx.type === 'expense' &&
        new Date(tx.date).getMonth() === currentMonth &&
        new Date(tx.date).getFullYear() === currentYear
      )
      .reduce((sum, tx) => sum + tx.amount, 0);

    const percent = (totalSpent / budget.amount) * 100;
    const cat = DEFAULT_CATEGORIES.find(c => c.id === categoryId) || { name: 'Categoria' };

    if (percent >= 100) {
      const excess = totalSpent - budget.amount;
      if (excess > 0) {
        await this.addNotification(
          userId,
          `Aviso de Orçamento! Ultrapassou o limite de gastos para a categoria "${cat.name}". Excedente de ${excess.toLocaleString('pt-MZ')} MZN.`,
          'danger'
        );
      } else {
        await this.addNotification(
          userId,
          `Alerta! Atingiu exatamente 100% do seu orçamento mensal para "${cat.name}" (${budget.amount.toLocaleString('pt-MZ')} MZN).`,
          'warning'
        );
      }
    } else if (percent >= 80) {
      await this.addNotification(
        userId,
        `Atenção! Consumiu mais de 80% do orçamento de "${cat.name}". Gastos atuais: ${totalSpent.toLocaleString('pt-MZ')} de ${budget.amount.toLocaleString('pt-MZ')} MZN.`,
        'warning'
      );
    }
  },

  async evaluateGoalsAndNotify(userId: string, goal: Goal): Promise<void> {
    const percent = (goal.currentAmount / goal.targetAmount) * 100;
    if (percent >= 100) {
      await this.addNotification(
        userId,
        `Parabéns! Alcançou o objetivo da sua meta "${goal.name}". Todo o valor de ${goal.targetAmount.toLocaleString('pt-MZ')} MZN foi poupado com sucesso! 🎉`,
        'success'
      );
    } else if (percent >= 90) {
      await this.addNotification(
        userId,
        `Quase lá! Falta muito pouco para realizar a sua meta "${goal.name}". Já guardou ${percent.toFixed(1)}% do valor objetivo! 💪`,
        'info'
      );
    }
  },

  // --- SEED SEED DATA (MOCK DATA ON INITIAL LOAD OR REGISTER) ---
  seedMockDataForUser(userId: string) {
    // 1. Transactions seed
    const txs: Transaction[] = getStorageItem('unifinance_transactions', []);
    
    // Only seed if this user has no transactions
    if (txs.some(t => t.userId === userId)) return;

    const baseDate = new Date();
    const dateStr = (offsetDays: number) => {
      const d = new Date(baseDate);
      d.setDate(d.getDate() - offsetDays);
      return d.toISOString().split('T')[0];
    };

    const mockTransactions: Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>[] = [
      { type: 'income', description: 'Bolsa de Estudos Académica', amount: 5000, categoryId: 'inc-bolsa', paymentMethod: 'Transferência', date: dateStr(15), notes: 'Subsídio mensal para despesas de estudante' },
      { type: 'income', description: 'Trabalho Freelance Web Design', amount: 8500, categoryId: 'inc-freelance', paymentMethod: 'M-Pesa', date: dateStr(10), notes: 'Desenvolvimento do portal do Grémio' },
      { type: 'income', description: 'Mesada Familiar', amount: 2500, categoryId: 'inc-mesada', paymentMethod: 'M-Pesa', date: dateStr(5), notes: 'Apoio mensal dos pais' },
      { type: 'income', description: 'Salário de Estágio', amount: 15000, categoryId: 'inc-salario', paymentMethod: 'Transferência', date: dateStr(2), notes: 'Estágio profissional no banco' },

      { type: 'expense', description: 'Aluguer de Quarto Universitário', amount: 4500, categoryId: 'exp-habitacao', paymentMethod: 'Transferência', date: dateStr(14), notes: 'Mensalidade do quarto perto do campus' },
      { type: 'expense', description: 'Supermercado Mensal Recheio', amount: 3200, categoryId: 'exp-alimentacao', paymentMethod: 'Cartão de Débito', date: dateStr(12), notes: 'Compras do mês' },
      { type: 'expense', description: 'Mensalidade Internet Fibra', amount: 1500, categoryId: 'exp-internet', paymentMethod: 'M-Pesa', date: dateStr(9), notes: 'Acesso às aulas virtuais e pesquisa' },
      { type: 'expense', description: 'Propina Semestral Faculdade', amount: 3500, categoryId: 'exp-educacao', paymentMethod: 'Transferência', date: dateStr(8), notes: 'Propina do curso de engenharia' },
      { type: 'expense', description: 'Combustível e Transporte Coletivo', amount: 650, categoryId: 'exp-transporte', paymentMethod: 'Dinheiro', date: dateStr(7), notes: 'Chapas para o campus e combustível' },
      { type: 'expense', description: 'Farmácia - Medicamentos gripe', amount: 450, categoryId: 'exp-saude', paymentMethod: 'M-Pesa', date: dateStr(6), notes: 'Xarope e comprimidos' },
      { type: 'expense', description: 'Almoço no Restaurante Universitário', amount: 180, categoryId: 'exp-alimentacao', paymentMethod: 'Dinheiro', date: dateStr(4) },
      { type: 'expense', description: 'Recarga Vodacom de Voz e Dados', amount: 500, categoryId: 'exp-comunicacao', paymentMethod: 'M-Pesa', date: dateStr(3) },
      { type: 'expense', description: 'Saída de Fim de Semana', amount: 800, categoryId: 'exp-entretenimento', paymentMethod: 'M-Pesa', date: dateStr(1), notes: 'Cinema e lanches com colegas' }
    ];

    mockTransactions.forEach((t, index) => {
      txs.push({
        ...t,
        id: `tx_mock_${userId}_${index}`,
        userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    });
    setStorageItem('unifinance_transactions', txs);

    // 2. Budgets seed
    const budgets: Budget[] = getStorageItem('unifinance_budgets', []);
    const mockBudgets = [
      { categoryId: 'exp-alimentacao', amount: 4000 },
      { categoryId: 'exp-transporte', amount: 1200 },
      { categoryId: 'exp-internet', amount: 2000 },
      { categoryId: 'exp-comunicacao', amount: 800 },
      { categoryId: 'exp-educacao', amount: 5000 }
    ];

    mockBudgets.forEach((b, index) => {
      budgets.push({
        id: `bud_mock_${userId}_${index}`,
        userId,
        categoryId: b.categoryId,
        amount: b.amount,
        period: 'monthly',
        startDate: new Date().toISOString(),
        createdAt: new Date().toISOString()
      });
    });
    setStorageItem('unifinance_budgets', budgets);

    // 3. Goals seed
    const goals: Goal[] = getStorageItem('unifinance_goals', []);
    const mockGoals: Omit<Goal, 'id' | 'userId' | 'createdAt' | 'updatedAt'>[] = [
      { name: 'Comprar Computador Portátil', targetAmount: 45000, currentAmount: 15000, deadline: dateStr(-180), category: 'Computador', description: 'Laptop potente para programação e trabalhos académicos' },
      { name: 'Pagar Matrícula e Propinas 2027', targetAmount: 20000, currentAmount: 8500, deadline: dateStr(-120), category: 'Propinas', description: 'Fundo reservado para propinas do próximo semestre' },
      { name: 'Fundo de Reserva / Emergência', targetAmount: 15000, currentAmount: 5000, category: 'Reserva de emergência', description: 'Para gastos imprevistos com saúde ou reparos' }
    ];

    mockGoals.forEach((g, index) => {
      goals.push({
        ...g,
        id: `goal_mock_${userId}_${index}`,
        userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    });
    setStorageItem('unifinance_goals', goals);

    // 4. Notifications seed
    const notifs: FinancialNotification[] = getStorageItem('unifinance_notifications', []);
    const mockNotifs = [
      { message: 'Bem-vindo ao UniFinance! Defina o seu saldo inicial no seu perfil para começar.', type: 'success' as const },
      { message: 'Atenção! Consumiu mais de 80% do orçamento de "Alimentação".', type: 'warning' as const }
    ];

    mockNotifs.forEach((n, index) => {
      notifs.push({
        id: `not_mock_${userId}_${index}`,
        userId,
        message: n.message,
        type: n.type,
        date: dateStr(1),
        read: false
      });
    });
    setStorageItem('unifinance_notifications', notifs);
  },

  async resetUserData(userId: string): Promise<void> {
    await networkDelay();
    
    // Wipe transactions
    const txs: Transaction[] = getStorageItem('unifinance_transactions', []);
    setStorageItem('unifinance_transactions', txs.filter(t => t.userId !== userId));

    // Wipe budgets
    const budgets: Budget[] = getStorageItem('unifinance_budgets', []);
    setStorageItem('unifinance_budgets', budgets.filter(b => b.userId !== userId));

    // Wipe goals
    const goals: Goal[] = getStorageItem('unifinance_goals', []);
    setStorageItem('unifinance_goals', goals.filter(g => g.userId !== userId));

    // Wipe notifications
    const notifs: FinancialNotification[] = getStorageItem('unifinance_notifications', []);
    setStorageItem('unifinance_notifications', notifs.filter(n => n.userId !== userId));

    // Wipe custom categories
    const customCats: Category[] = getStorageItem('unifinance_custom_categories', []);
    setStorageItem('unifinance_custom_categories', customCats.filter(c => c.userId !== userId));
  }
};
