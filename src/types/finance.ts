/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  description: string;
  amount: number;
  categoryId: string;
  paymentMethod: string;
  date: string; // ISO string YYYY-MM-DD
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  userId?: string; // If undefined, it is a default system category
  name: string;
  type: TransactionType;
  icon: string; // Name of Lucide icon
  description?: string;
}

export interface Budget {
  id: string;
  userId: string;
  categoryId: string;
  amount: number;
  period: 'monthly';
  startDate: string;
  endDate?: string;
  createdAt: string;
}

export interface Goal {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string; // ISO string YYYY-MM-DD
  category: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FinancialNotification {
  id: string;
  userId: string;
  message: string;
  type: 'warning' | 'danger' | 'success' | 'info';
  date: string;
  read: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
  defaultCurrency: string; // e.g. "MZN", "USD", "EUR"
  saldoInicial?: number; // Initial starting balance
  onboardingCompleted: boolean;
  createdAt: string;
}

export interface SavingState {
  targetAmount: number;
  currentAmount: number;
}
