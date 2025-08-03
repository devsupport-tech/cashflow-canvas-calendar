/**
 * Import/Export Functionality System
 * Handles CSV import/export with proper validation and error handling
 */

import { TransactionItem } from '@/lib/types';
import { validator, transactionSchema } from './validation';
import { errorHandler } from './errorHandler';

export interface ImportResult {
  success: boolean;
  data?: TransactionItem[];
  errors?: string[];
  warnings?: string[];
  totalRows?: number;
  validRows?: number;
}

export interface ExportOptions {
  filename?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  categories?: string[];
  includeHeaders?: boolean;
}

export class ImportExportManager {
  private static instance: ImportExportManager;

  private constructor() {}

  static getInstance(): ImportExportManager {
    if (!ImportExportManager.instance) {
      ImportExportManager.instance = new ImportExportManager();
    }
    return ImportExportManager.instance;
  }

  /**
   * Import transactions from CSV file
   */
  async importTransactionsFromCSV(file: File): Promise<ImportResult> {
    try {
      // Validate file
      const fileValidation = validator.validateFile(file, {
        maxSize: 10 * 1024 * 1024, // 10MB
        allowedTypes: ['text/csv']
      });

      if (!fileValidation.isValid) {
        return {
          success: false,
          errors: [fileValidation.error || 'Invalid file']
        };
      }

      // Read file content
      const content = await this.readFileAsText(file);
      
      // Parse CSV
      const rows = this.parseCSV(content);
      
      if (rows.length === 0) {
        return {
          success: false,
          errors: ['File is empty or contains no valid data']
        };
      }

      // Process rows
      const result = await this.processCSVRows(rows);
      
      return result;
    } catch (error) {
      errorHandler.handleError(error, 'CSV Import');
      return {
        success: false,
        errors: ['Failed to import CSV file: ' + (error as Error).message]
      };
    }
  }

  /**
   * Export transactions to CSV
   */
  async exportTransactionsToCSV(
    transactions: TransactionItem[],
    options: ExportOptions = {}
  ): Promise<void> {
    try {
      const {
        filename = `transactions_${new Date().toISOString().split('T')[0]}.csv`,
        dateRange,
        categories,
        includeHeaders = true
      } = options;

      // Filter transactions based on options
      let filteredTransactions = [...transactions];

      if (dateRange) {
        filteredTransactions = filteredTransactions.filter(tx => {
          const txDate = new Date(tx.date);
          return txDate >= dateRange.start && txDate <= dateRange.end;
        });
      }

      if (categories && categories.length > 0) {
        filteredTransactions = filteredTransactions.filter(tx =>
          categories.includes(tx.category || '')
        );
      }

      if (filteredTransactions.length === 0) {
        errorHandler.handleError(
          new Error('No transactions match the export criteria'),
          'CSV Export'
        );
        return;
      }

      // Generate CSV content
      const csvContent = this.generateCSVContent(filteredTransactions, includeHeaders);
      
      // Download file
      this.downloadCSV(csvContent, filename);
      
      errorHandler.handleSuccess(
        'Export completed',
        `Exported ${filteredTransactions.length} transactions to ${filename}`
      );
    } catch (error) {
      errorHandler.handleError(error, 'CSV Export');
    }
  }

  /**
   * Export budgets to CSV
   */
  async exportBudgetsToCSV(budgets: any[], filename?: string): Promise<void> {
    try {
      const csvFilename = filename || `budgets_${new Date().toISOString().split('T')[0]}.csv`;
      
      if (budgets.length === 0) {
        errorHandler.handleError(
          new Error('No budgets to export'),
          'Budget Export'
        );
        return;
      }

      const headers = ['Name', 'Amount', 'Category', 'Period', 'Created Date'];
      const rows = budgets.map(budget => [
        budget.name,
        budget.amount.toString(),
        budget.category,
        budget.period || 'monthly',
        new Date(budget.created_at).toLocaleDateString()
      ]);

      const csvContent = this.arrayToCSV([headers, ...rows]);
      this.downloadCSV(csvContent, csvFilename);
      
      errorHandler.handleSuccess(
        'Export completed',
        `Exported ${budgets.length} budgets to ${csvFilename}`
      );
    } catch (error) {
      errorHandler.handleError(error, 'Budget Export');
    }
  }

  /**
   * Read file as text
   */
  private readFileAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        resolve(event.target?.result as string);
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsText(file);
    });
  }

  /**
   * Parse CSV content into rows
   */
  private parseCSV(content: string): string[][] {
    const lines = content.split('\n').filter(line => line.trim());
    const rows: string[][] = [];

    for (const line of lines) {
      // Simple CSV parsing - handles quoted fields
      const row: string[] = [];
      let current = '';
      let inQuotes = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          row.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      
      row.push(current.trim());
      rows.push(row);
    }

    return rows;
  }

  /**
   * Process CSV rows and validate data
   */
  private async processCSVRows(rows: string[][]): Promise<ImportResult> {
    const errors: string[] = [];
    const warnings: string[] = [];
    const validTransactions: TransactionItem[] = [];
    
    // Detect headers
    const hasHeaders = this.detectHeaders(rows[0]);
    const dataRows = hasHeaders ? rows.slice(1) : rows;
    
    if (dataRows.length === 0) {
      return {
        success: false,
        errors: ['No data rows found in CSV file']
      };
    }

    // Expected column order: Description, Amount, Type, Date, Category
    const expectedColumns = ['description', 'amount', 'type', 'date', 'category'];
    
    for (let i = 0; i < dataRows.length; i++) {
      const row = dataRows[i];
      const rowNumber = hasHeaders ? i + 2 : i + 1;
      
      try {
        // Skip empty rows
        if (row.every(cell => !cell.trim())) {
          warnings.push(`Row ${rowNumber}: Empty row skipped`);
          continue;
        }
        
        // Validate row has enough columns
        if (row.length < 4) {
          errors.push(`Row ${rowNumber}: Insufficient columns (expected at least 4)`);
          continue;
        }
        
        // Parse transaction data
        const transactionData = {
          description: row[0]?.trim() || '',
          amount: this.parseAmount(row[1]?.trim() || '0'),
          type: this.parseTransactionType(row[2]?.trim() || ''),
          date: this.parseDate(row[3]?.trim() || ''),
          category: row[4]?.trim() || 'personal'
        };
        
        // Validate transaction
        const validation = validator.validate(transactionSchema, transactionData);
        
        if (!validation.success) {
          const errorMessages = Object.values(validation.errors || {}).join(', ');
          errors.push(`Row ${rowNumber}: ${errorMessages}`);
          continue;
        }
        
        // Create transaction item
        const transaction: TransactionItem = {
          id: `import-${Date.now()}-${i}`,
          ...validation.data!,
          created_at: new Date().toISOString()
        };
        
        validTransactions.push(transaction);
      } catch (error) {
        errors.push(`Row ${rowNumber}: ${(error as Error).message}`);
      }
    }
    
    return {
      success: validTransactions.length > 0,
      data: validTransactions,
      errors: errors.length > 0 ? errors : undefined,
      warnings: warnings.length > 0 ? warnings : undefined,
      totalRows: dataRows.length,
      validRows: validTransactions.length
    };
  }

  /**
   * Detect if first row contains headers
   */
  private detectHeaders(firstRow: string[]): boolean {
    if (!firstRow || firstRow.length === 0) return false;
    
    const headerKeywords = ['description', 'amount', 'type', 'date', 'category'];
    const firstRowLower = firstRow.map(cell => cell.toLowerCase().trim());
    
    return headerKeywords.some(keyword => 
      firstRowLower.some(cell => cell.includes(keyword))
    );
  }

  /**
   * Parse amount from string
   */
  private parseAmount(amountStr: string): number {
    // Remove currency symbols and whitespace
    const cleaned = amountStr.replace(/[$,\s]/g, '');
    const amount = parseFloat(cleaned);
    
    if (isNaN(amount)) {
      throw new Error(`Invalid amount: ${amountStr}`);
    }
    
    return Math.abs(amount); // Always positive, type determines income/expense
  }

  /**
   * Parse transaction type
   */
  private parseTransactionType(typeStr: string): 'income' | 'expense' {
    const type = typeStr.toLowerCase().trim();
    
    if (type.includes('income') || type.includes('credit') || type.includes('+')) {
      return 'income';
    }
    
    if (type.includes('expense') || type.includes('debit') || type.includes('-')) {
      return 'expense';
    }
    
    // Default to expense if unclear
    return 'expense';
  }

  /**
   * Parse date from string
   */
  private parseDate(dateStr: string): string {
    const date = new Date(dateStr);
    
    if (isNaN(date.getTime())) {
      throw new Error(`Invalid date: ${dateStr}`);
    }
    
    return date.toISOString();
  }

  /**
   * Generate CSV content from transactions
   */
  private generateCSVContent(transactions: TransactionItem[], includeHeaders: boolean): string {
    const headers = ['Description', 'Amount', 'Type', 'Date', 'Category'];
    const rows = transactions.map(tx => [
      tx.description,
      tx.amount.toString(),
      tx.type,
      new Date(tx.date).toLocaleDateString(),
      tx.category || 'personal'
    ]);

    const allRows = includeHeaders ? [headers, ...rows] : rows;
    return this.arrayToCSV(allRows);
  }

  /**
   * Convert array to CSV string
   */
  private arrayToCSV(data: string[][]): string {
    return data.map(row => 
      row.map(cell => {
        // Escape quotes and wrap in quotes if contains comma or quote
        const escaped = cell.replace(/"/g, '""');
        return cell.includes(',') || cell.includes('"') || cell.includes('\n') 
          ? `"${escaped}"` 
          : escaped;
      }).join(',')
    ).join('\n');
  }

  /**
   * Download CSV file
   */
  private downloadCSV(content: string, filename: string): void {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  }

  /**
   * Get import template CSV
   */
  getImportTemplate(): string {
    const headers = ['Description', 'Amount', 'Type', 'Date', 'Category'];
    const sampleData = [
      ['Salary Payment', '5000', 'income', '2024-01-01', 'personal'],
      ['Grocery Shopping', '150', 'expense', '2024-01-02', 'personal'],
      ['Client Payment', '2500', 'income', '2024-01-03', 'business'],
      ['Office Supplies', '75', 'expense', '2024-01-04', 'business']
    ];
    
    return this.arrayToCSV([headers, ...sampleData]);
  }

  /**
   * Download import template
   */
  downloadImportTemplate(): void {
    const content = this.getImportTemplate();
    this.downloadCSV(content, 'transaction_import_template.csv');
    
    errorHandler.handleSuccess(
      'Template downloaded',
      'Use this template to format your transaction data for import'
    );
  }
}

// Export singleton instance
export const importExportManager = ImportExportManager.getInstance();
