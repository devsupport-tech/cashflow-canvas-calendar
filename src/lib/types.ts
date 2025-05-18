export type ExpenseCategory = 'personal' | 'business' | string;

export type ExpenseType = 
  | 'food' 
  | 'transportation' 
  | 'housing' 
  | 'utilities' 
  | 'entertainment' 
  | 'shopping' 
  | 'health' 
  | 'education'
  | 'travel'
  | 'subscription'
  | 'office'
  | 'marketing'
  | 'other';

export type TransactionType = 'expense' | 'income';

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: Date;
  type: TransactionType;
  category?: ExpenseCategory;
  expenseType?: ExpenseType;
  tags?: string[];
}

export interface MonthlyTotal {
  month: Date;
  income: number;
  expenses: {
    personal: number;
    business: number;
  };
  total: number;
}

export interface DailyTotal {
  date: Date;
  expenses: {
    personal: number;
    business: number;
  };
  income: number;
}

export interface CategoryTotal {
  category: ExpenseType;
  amount: number;
  percentage: number;
}

export interface FinanceSummary {
  totalIncome: number;
  totalExpenses: number;
  netAmount: number;
  personalExpenses: number;
  businessExpenses: number;
  monthlySummary: MonthlyTotal[];
  categoryTotals: {
    personal: CategoryTotal[];
    business: CategoryTotal[];
  };
}

export interface Business {
  id: string;
  name: string;
  color: string;
  createdAt: Date | string;
}

// Define a workspace option type for dropdowns and selectors
export interface WorkspaceOption {
  value: string;
  label: string;
  color: string;
}
