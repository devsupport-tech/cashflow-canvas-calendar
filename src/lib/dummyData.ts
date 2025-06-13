
import { Business, Transaction, FinanceSummary } from './types';

export const dummyBusinesses: Business[] = [
  {
    id: '1',
    name: 'Tech Startup',
    color: '#3b82f6',
    createdAt: new Date()
  },
  {
    id: '2',
    name: 'Consulting Firm',
    color: '#10b981',
    createdAt: new Date()
  },
  {
    id: '3',
    name: 'E-commerce Store',
    color: '#f59e0b',
    createdAt: new Date()
  }
];

export const dummyTransactions: Transaction[] = [
  {
    id: '1',
    amount: 1500,
    description: 'Freelance Project Payment',
    date: new Date().toISOString(),
    type: 'income',
    category: 'business',
    tags: ['freelance', 'project']
  },
  {
    id: '2',
    amount: 85,
    description: 'Grocery Shopping',
    date: new Date(Date.now() - 86400000).toISOString(),
    type: 'expense',
    category: 'personal',
    expenseType: 'food',
    tags: ['groceries']
  },
  {
    id: '3',
    amount: 250,
    description: 'Office Supplies',
    date: new Date(Date.now() - 172800000).toISOString(),
    type: 'expense',
    category: 'business',
    expenseType: 'office',
    tags: ['supplies', 'office']
  }
];

export const financeSummary: FinanceSummary = {
  totalIncome: 1500,
  totalExpenses: 335,
  netAmount: 1165,
  personalExpenses: 85,
  businessExpenses: 250,
  monthlySummary: [
    {
      month: new Date(),
      income: 1500,
      expenses: { personal: 85, business: 250 },
      total: 1165
    }
  ],
  categoryTotals: {
    personal: [
      { category: 'food', amount: 85, percentage: 100 }
    ],
    business: [
      { category: 'office', amount: 250, percentage: 100 }
    ]
  }
};

export const dummyData = {
  businesses: dummyBusinesses,
  transactions: dummyTransactions,
  financeSummary
};
