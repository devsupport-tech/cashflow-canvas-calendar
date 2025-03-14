
import { Transaction, ExpenseCategory, ExpenseType, TransactionType, FinanceSummary, MonthlyTotal, CategoryTotal } from './types';
import { addDays, subDays, startOfMonth, endOfMonth, format, parse, addMonths } from 'date-fns';

// Helper function to create dates more easily
const createDate = (daysFromNow: number): Date => {
  return daysFromNow < 0 ? subDays(new Date(), Math.abs(daysFromNow)) : addDays(new Date(), daysFromNow);
};

// Helper to create transactions
const createTransaction = (
  id: string,
  amount: number,
  description: string,
  daysFromNow: number,
  type: TransactionType,
  category?: ExpenseCategory,
  expenseType?: ExpenseType,
  tags?: string[]
): Transaction => ({
  id,
  amount,
  description,
  date: createDate(daysFromNow),
  type,
  category,
  expenseType,
  tags,
});

// Generate dummy transactions
export const dummyTransactions: Transaction[] = [
  // Personal Expenses
  createTransaction('t1', 85.75, 'Grocery shopping', -1, 'expense', 'personal', 'food', ['groceries', 'weekly']),
  createTransaction('t2', 12.99, 'Netflix subscription', -3, 'expense', 'personal', 'subscription', ['streaming']),
  createTransaction('t3', 45.00, 'Gym membership', -5, 'expense', 'personal', 'health', ['fitness']),
  createTransaction('t4', 32.40, 'Dinner with friends', -2, 'expense', 'personal', 'food', ['dining out']),
  createTransaction('t5', 124.50, 'New running shoes', -7, 'expense', 'personal', 'shopping', ['fitness']),
  createTransaction('t6', 65.00, 'Electric bill', -10, 'expense', 'personal', 'utilities', ['monthly']),
  createTransaction('t7', 22.50, 'Book purchase', -12, 'expense', 'personal', 'entertainment', ['reading']),
  createTransaction('t8', 1200.00, 'Rent payment', -15, 'expense', 'personal', 'housing', ['monthly']),
  createTransaction('t9', 56.78, 'Gas fill-up', -2, 'expense', 'personal', 'transportation', ['car']),
  createTransaction('t10', 36.99, 'Medicine', -6, 'expense', 'personal', 'health', ['pharmacy']),
  
  // Business Expenses
  createTransaction('t11', 199.99, 'Software subscription', -4, 'expense', 'business', 'subscription', ['tools']),
  createTransaction('t12', 75.00, 'Client lunch', -5, 'expense', 'business', 'food', ['meeting', 'client']),
  createTransaction('t13', 450.00, 'Office supplies', -8, 'expense', 'business', 'office', ['quarterly']),
  createTransaction('t14', 25.00, 'Digital marketing', -9, 'expense', 'business', 'marketing', ['ads']),
  createTransaction('t15', 349.99, 'External monitor', -11, 'expense', 'business', 'office', ['equipment']),
  createTransaction('t16', 89.00, 'Internet bill', -14, 'expense', 'business', 'utilities', ['monthly']),
  createTransaction('t17', 750.00, 'Business conference', -20, 'expense', 'business', 'travel', ['annual']),
  createTransaction('t18', 45.99, 'Domain renewal', -25, 'expense', 'business', 'subscription', ['yearly']),
  createTransaction('t19', 180.00, 'Professional consultation', -30, 'expense', 'business', 'other', ['advice']),
  
  // Income
  createTransaction('t20', 3500.00, 'Monthly salary', -1, 'income'),
  createTransaction('t21', 1200.00, 'Freelance project', -7, 'income'),
  createTransaction('t22', 500.00, 'Tax refund', -15, 'income'),
  createTransaction('t23', 350.00, 'Investment dividend', -22, 'income'),
  
  // Upcoming transactions
  createTransaction('t24', 1200.00, 'Next month rent', 15, 'expense', 'personal', 'housing', ['monthly']),
  createTransaction('t25', 65.00, 'Expected utility bill', 20, 'expense', 'personal', 'utilities', ['monthly']),
  createTransaction('t26', 3500.00, 'Expected salary', 29, 'income'),
  
  // Additional personal expenses for current month
  createTransaction('t27', 78.50, 'Haircut', -6, 'expense', 'personal', 'other', ['grooming']),
  createTransaction('t28', 110.25, 'Anniversary dinner', -4, 'expense', 'personal', 'food', ['special']),
  createTransaction('t29', 42.99, 'Video game', -9, 'expense', 'personal', 'entertainment', ['gaming']),
  
  // Additional business expenses for current month
  createTransaction('t30', 299.99, 'Business software', -8, 'expense', 'business', 'subscription', ['tools']),
  createTransaction('t31', 65.00, 'Online course', -5, 'expense', 'business', 'education', ['skills']),
  createTransaction('t32', 120.00, 'Client gift', -3, 'expense', 'business', 'marketing', ['relationship']),
];

// Calculate financial summary
export const calculateFinanceSummary = (): FinanceSummary => {
  const totalIncome = dummyTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const personalExpenses = dummyTransactions
    .filter(t => t.type === 'expense' && t.category === 'personal')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const businessExpenses = dummyTransactions
    .filter(t => t.type === 'expense' && t.category === 'business')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = personalExpenses + businessExpenses;
  
  // Generate monthly summary
  const currentMonth = new Date();
  const monthlySummary: MonthlyTotal[] = Array.from({ length: 6 }, (_, i) => {
    const month = addMonths(startOfMonth(currentMonth), i - 5);
    const monthTransactions = dummyTransactions.filter(t => 
      t.date >= startOfMonth(month) && t.date <= endOfMonth(month)
    );
    
    const monthIncome = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const monthPersonalExpenses = monthTransactions
      .filter(t => t.type === 'expense' && t.category === 'personal')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const monthBusinessExpenses = monthTransactions
      .filter(t => t.type === 'expense' && t.category === 'business')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      month,
      income: monthIncome,
      expenses: {
        personal: monthPersonalExpenses,
        business: monthBusinessExpenses
      },
      total: monthIncome - (monthPersonalExpenses + monthBusinessExpenses)
    };
  });
  
  // Calculate category totals
  const calculateCategoryTotals = (category: ExpenseCategory): CategoryTotal[] => {
    const expenses = dummyTransactions.filter(t => 
      t.type === 'expense' && t.category === category
    );
    
    const totalAmount = expenses.reduce((sum, t) => sum + t.amount, 0);
    
    const expenseTypeMap = new Map<ExpenseType, number>();
    
    expenses.forEach(expense => {
      if (expense.expenseType) {
        const currentAmount = expenseTypeMap.get(expense.expenseType) || 0;
        expenseTypeMap.set(expense.expenseType, currentAmount + expense.amount);
      }
    });
    
    return Array.from(expenseTypeMap.entries())
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: totalAmount > 0 ? (amount / totalAmount) * 100 : 0
      }))
      .sort((a, b) => b.amount - a.amount);
  };
  
  return {
    totalIncome,
    totalExpenses,
    netAmount: totalIncome - totalExpenses,
    personalExpenses,
    businessExpenses,
    monthlySummary,
    categoryTotals: {
      personal: calculateCategoryTotals('personal'),
      business: calculateCategoryTotals('business')
    }
  };
};

export const financeSummary = calculateFinanceSummary();
