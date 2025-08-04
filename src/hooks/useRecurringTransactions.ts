/**
 * Recurring Transactions and Cashflow Prediction Hook
 * Manages recurring transactions and generates future cashflow predictions
 */

import { useState, useEffect, useMemo } from 'react';
import { Transaction } from '@/lib/types';
import { addDays, addWeeks, addMonths, addYears, format, isAfter, isBefore } from 'date-fns';

export interface RecurringTransaction {
  id: string;
  template: Omit<Transaction, 'id' | 'date'>;
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly';
  startDate: Date;
  endDate?: Date;
  nextOccurrence: Date;
  isActive: boolean;
  created_at: string;
}

export interface PredictedTransaction extends Transaction {
  isRecurring: boolean;
  recurringId?: string;
  confidence: 'high' | 'medium' | 'low';
}

export interface CashflowPrediction {
  date: Date;
  predictedIncome: number;
  predictedExpenses: number;
  predictedNet: number;
  transactions: PredictedTransaction[];
  confidence: 'high' | 'medium' | 'low';
}

// Mock recurring transactions for demo
const mockRecurringTransactions: RecurringTransaction[] = [
  {
    id: 'recurring-1',
    template: {
      description: 'Monthly Salary',
      amount: 5000,
      type: 'income',
      category: 'personal',
      expenseType: undefined
    },
    frequency: 'monthly',
    startDate: new Date('2024-01-01'),
    nextOccurrence: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    isActive: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'recurring-2',
    template: {
      description: 'Rent Payment',
      amount: 1200,
      type: 'expense',
      category: 'personal',
      expenseType: 'housing'
    },
    frequency: 'monthly',
    startDate: new Date('2024-01-01'),
    nextOccurrence: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    isActive: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'recurring-3',
    template: {
      description: 'Internet Bill',
      amount: 80,
      type: 'expense',
      category: 'personal',
      expenseType: 'utilities'
    },
    frequency: 'monthly',
    startDate: new Date('2024-01-01'),
    nextOccurrence: new Date(new Date().getFullYear(), new Date().getMonth(), 15),
    isActive: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'recurring-4',
    template: {
      description: 'Client Retainer',
      amount: 2500,
      type: 'income',
      category: 'business',
      expenseType: undefined
    },
    frequency: 'monthly',
    startDate: new Date('2024-01-01'),
    nextOccurrence: new Date(new Date().getFullYear(), new Date().getMonth(), 5),
    isActive: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'recurring-5',
    template: {
      description: 'Office Rent',
      amount: 800,
      type: 'expense',
      category: 'business',
      expenseType: 'office'
    },
    frequency: 'monthly',
    startDate: new Date('2024-01-01'),
    nextOccurrence: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    isActive: true,
    created_at: new Date().toISOString()
  }
];

export const useRecurringTransactions = () => {
  const [recurringTransactions, setRecurringTransactions] = useState<RecurringTransaction[]>(mockRecurringTransactions);
  const [isLoading, setIsLoading] = useState(false);

  // Calculate next occurrence date based on frequency
  const calculateNextOccurrence = (
    lastDate: Date, 
    frequency: RecurringTransaction['frequency']
  ): Date => {
    switch (frequency) {
      case 'daily':
        return addDays(lastDate, 1);
      case 'weekly':
        return addWeeks(lastDate, 1);
      case 'biweekly':
        return addWeeks(lastDate, 2);
      case 'monthly':
        return addMonths(lastDate, 1);
      case 'quarterly':
        return addMonths(lastDate, 3);
      case 'yearly':
        return addYears(lastDate, 1);
      default:
        return addMonths(lastDate, 1);
    }
  };

  // Generate predicted transactions for a date range
  const generatePredictedTransactions = (
    startDate: Date,
    endDate: Date,
    existingTransactions: Transaction[] = []
  ): PredictedTransaction[] => {
    const predicted: PredictedTransaction[] = [];
    
    // Get existing transaction patterns for pattern-based predictions
    const existingPatterns = analyzeTransactionPatterns(existingTransactions);
    
    recurringTransactions.forEach(recurring => {
      if (!recurring.isActive) return;
      
      let currentDate = new Date(recurring.nextOccurrence);
      let occurrenceCount = 0;
      const maxOccurrences = 100; // Prevent infinite loops
      
      while (
        isBefore(currentDate, endDate) && 
        occurrenceCount < maxOccurrences &&
        (!recurring.endDate || isBefore(currentDate, recurring.endDate))
      ) {
        if (isAfter(currentDate, startDate) || format(currentDate, 'yyyy-MM-dd') === format(startDate, 'yyyy-MM-dd')) {
          // Check if this transaction already exists
          const existingTransaction = existingTransactions.find(tx => 
            format(new Date(tx.date), 'yyyy-MM-dd') === format(currentDate, 'yyyy-MM-dd') &&
            tx.description.toLowerCase().includes(recurring.template.description.toLowerCase())
          );
          
          if (!existingTransaction) {
            predicted.push({
              id: `predicted-${recurring.id}-${format(currentDate, 'yyyy-MM-dd')}`,
              ...recurring.template,
              date: currentDate.toISOString(),
              isRecurring: true,
              recurringId: recurring.id,
              confidence: 'high'
            });
          }
        }
        
        currentDate = calculateNextOccurrence(currentDate, recurring.frequency);
        occurrenceCount++;
      }
    });

    // Add pattern-based predictions
    existingPatterns.forEach(pattern => {
      const patternPredictions = generatePatternBasedPredictions(pattern, startDate, endDate, existingTransactions);
      predicted.push(...patternPredictions);
    });

    return predicted.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  // Analyze existing transactions for patterns
  const analyzeTransactionPatterns = (transactions: Transaction[]) => {
    const patterns: any[] = [];
    
    // Group transactions by description similarity
    const transactionGroups = new Map<string, Transaction[]>();
    
    transactions.forEach(tx => {
      const key = tx.description.toLowerCase().trim();
      if (!transactionGroups.has(key)) {
        transactionGroups.set(key, []);
      }
      transactionGroups.get(key)!.push(tx);
    });

    // Identify potential recurring patterns
    transactionGroups.forEach((group, description) => {
      if (group.length >= 2) {
        // Check for regular intervals
        const sortedDates = group
          .map(tx => new Date(tx.date))
          .sort((a, b) => a.getTime() - b.getTime());
        
        const intervals: number[] = [];
        for (let i = 1; i < sortedDates.length; i++) {
          const daysDiff = Math.round((sortedDates[i].getTime() - sortedDates[i-1].getTime()) / (1000 * 60 * 60 * 24));
          intervals.push(daysDiff);
        }
        
        // Check if intervals are consistent (within 3 days tolerance)
        const avgInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
        const isConsistent = intervals.every(interval => Math.abs(interval - avgInterval) <= 3);
        
        if (isConsistent && avgInterval >= 7) { // At least weekly
          patterns.push({
            description,
            transactions: group,
            averageInterval: avgInterval,
            confidence: group.length >= 3 ? 'high' : 'medium',
            lastOccurrence: sortedDates[sortedDates.length - 1],
            template: group[group.length - 1] // Use most recent as template
          });
        }
      }
    });

    return patterns;
  };

  // Generate predictions based on identified patterns
  const generatePatternBasedPredictions = (
    pattern: any,
    startDate: Date,
    endDate: Date,
    existingTransactions: Transaction[]
  ): PredictedTransaction[] => {
    const predictions: PredictedTransaction[] = [];
    
    let nextDate = addDays(pattern.lastOccurrence, Math.round(pattern.averageInterval));
    let occurrenceCount = 0;
    const maxOccurrences = 50;
    
    while (
      isBefore(nextDate, endDate) && 
      occurrenceCount < maxOccurrences
    ) {
      if (isAfter(nextDate, startDate) || format(nextDate, 'yyyy-MM-dd') === format(startDate, 'yyyy-MM-dd')) {
        // Check if this transaction already exists
        const existingTransaction = existingTransactions.find(tx => 
          format(new Date(tx.date), 'yyyy-MM-dd') === format(nextDate, 'yyyy-MM-dd') &&
          tx.description.toLowerCase().includes(pattern.template.description.toLowerCase())
        );
        
        if (!existingTransaction) {
          predictions.push({
            id: `pattern-${pattern.description}-${format(nextDate, 'yyyy-MM-dd')}`,
            ...pattern.template,
            date: nextDate.toISOString(),
            isRecurring: false,
            confidence: pattern.confidence === 'high' ? 'medium' : 'low' // Lower confidence for pattern-based
          });
        }
      }
      
      nextDate = addDays(nextDate, Math.round(pattern.averageInterval));
      occurrenceCount++;
    }
    
    return predictions;
  };

  // Generate cashflow predictions for a date range
  const generateCashflowPredictions = (
    startDate: Date,
    endDate: Date,
    existingTransactions: Transaction[] = []
  ): CashflowPrediction[] => {
    const predictions: CashflowPrediction[] = [];
    const predictedTransactions = generatePredictedTransactions(startDate, endDate, existingTransactions);
    
    // Group predictions by date
    const transactionsByDate = new Map<string, PredictedTransaction[]>();
    
    // Add existing transactions
    existingTransactions.forEach(tx => {
      const dateKey = format(new Date(tx.date), 'yyyy-MM-dd');
      if (!transactionsByDate.has(dateKey)) {
        transactionsByDate.set(dateKey, []);
      }
      transactionsByDate.get(dateKey)!.push({
        ...tx,
        isRecurring: false,
        confidence: 'high'
      });
    });
    
    // Add predicted transactions
    predictedTransactions.forEach(tx => {
      const dateKey = format(new Date(tx.date), 'yyyy-MM-dd');
      if (!transactionsByDate.has(dateKey)) {
        transactionsByDate.set(dateKey, []);
      }
      transactionsByDate.get(dateKey)!.push(tx);
    });
    
    // Generate daily predictions
    for (let date = new Date(startDate); date <= endDate; date = addDays(date, 1)) {
      const dateKey = format(date, 'yyyy-MM-dd');
      const dayTransactions = transactionsByDate.get(dateKey) || [];
      
      const income = dayTransactions
        .filter(tx => tx.type === 'income')
        .reduce((sum, tx) => sum + tx.amount, 0);
      
      const expenses = dayTransactions
        .filter(tx => tx.type === 'expense')
        .reduce((sum, tx) => sum + tx.amount, 0);
      
      // Calculate confidence based on transaction confidence
      const confidenceScores = dayTransactions.map(tx => {
        switch (tx.confidence) {
          case 'high': return 3;
          case 'medium': return 2;
          case 'low': return 1;
          default: return 3;
        }
      });
      
      const avgConfidence = confidenceScores.length > 0 
        ? confidenceScores.reduce((sum, score) => sum + score, 0) / confidenceScores.length
        : 3;
      
      const confidence: 'high' | 'medium' | 'low' = 
        avgConfidence >= 2.5 ? 'high' : avgConfidence >= 1.5 ? 'medium' : 'low';
      
      predictions.push({
        date: new Date(date),
        predictedIncome: income,
        predictedExpenses: expenses,
        predictedNet: income - expenses,
        transactions: dayTransactions,
        confidence
      });
    }
    
    return predictions;
  };

  // Add a new recurring transaction
  const addRecurringTransaction = (recurring: Omit<RecurringTransaction, 'id' | 'created_at'>) => {
    const newRecurring: RecurringTransaction = {
      ...recurring,
      id: `recurring-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    
    setRecurringTransactions(prev => [...prev, newRecurring]);
    return newRecurring;
  };

  // Update a recurring transaction
  const updateRecurringTransaction = (id: string, updates: Partial<RecurringTransaction>) => {
    setRecurringTransactions(prev => 
      prev.map(recurring => 
        recurring.id === id ? { ...recurring, ...updates } : recurring
      )
    );
  };

  // Delete a recurring transaction
  const deleteRecurringTransaction = (id: string) => {
    setRecurringTransactions(prev => prev.filter(recurring => recurring.id !== id));
  };

  // Get upcoming transactions for the next N days
  const getUpcomingTransactions = (days: number = 30, existingTransactions: Transaction[] = []) => {
    const startDate = new Date();
    const endDate = addDays(startDate, days);
    return generatePredictedTransactions(startDate, endDate, existingTransactions);
  };

  return {
    recurringTransactions,
    isLoading,
    generatePredictedTransactions,
    generateCashflowPredictions,
    addRecurringTransaction,
    updateRecurringTransaction,
    deleteRecurringTransaction,
    getUpcomingTransactions,
    analyzeTransactionPatterns
  };
};
