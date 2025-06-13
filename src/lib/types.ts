
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
  date: string; // Changed from Date to string to match TransactionItem
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

// Updated Account type to include title property
export interface Account {
  id: string;
  name: string;
  title?: string; // Added optional title property
  type: 'checking' | 'savings' | 'credit' | 'investment';
  balance: number;
  category: string;
  created_at?: string;
}

// Updated Budget type to include trend property
export interface Budget {
  id: string;
  name: string;
  amount: number;
  spent: number;
  category: string;
  trend: string; // Added trend property
  created_at?: string;
}
