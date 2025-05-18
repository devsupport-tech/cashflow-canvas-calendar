
/**
 * Export expenses to a CSV file
 */
export const exportExpensesToCSV = (expenses: ExpenseItem[]) => {
  // CSV headers
  const headers = ["id", "description", "amount", "date", "category", "expenseType"];
  
  // Format the data as CSV rows
  const csvContent = [
    headers.join(","),
    ...expenses.map(expense => [
      expense.id,
      `"${expense.description.replace(/"/g, '""')}"`, // Escape quotes in description
      expense.amount,
      expense.date,
      expense.category,
      expense.expenseType
    ].join(","))
  ].join("\n");
  
  // Create a blob and download it
  downloadCSVFile(csvContent, `expenses-export-${new Date().toISOString().slice(0, 10)}.csv`);
};

/**
 * Export transactions to a CSV file
 */
export const exportTransactionsToCSV = (transactions: Transaction[]) => {
  // CSV headers
  const headers = ["id", "description", "amount", "date", "category", "type"];
  
  // Format the data as CSV rows
  const csvContent = [
    headers.join(","),
    ...transactions.map(transaction => [
      transaction.id,
      `"${transaction.description.replace(/"/g, '""')}"`, // Escape quotes in description
      transaction.amount,
      transaction.date,
      transaction.category,
      transaction.type || "expense"
    ].join(","))
  ].join("\n");
  
  // Create a blob and download it
  downloadCSVFile(csvContent, `transactions-export-${new Date().toISOString().slice(0, 10)}.csv`);
};

/**
 * Helper function to download CSV data
 */
const downloadCSVFile = (csvContent: string, fileName: string) => {
  try {
    // Create a blob and download it
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
  } catch (error) {
    console.error("Error exporting CSV:", error);
  }
};

/**
 * Parse CSV data into expense items
 */
export const parseCSVToExpenses = (csvData: string): ExpenseItem[] => {
  try {
    // Split into rows and remove header
    const rows = csvData.trim().split("\n");
    if (rows.length < 2) return [];
    
    const headers = rows[0].toLowerCase().split(",");
    const expenses: ExpenseItem[] = [];
    
    // Start from index 1 to skip headers
    for (let i = 1; i < rows.length; i++) {
      // Handle quoted fields properly (for descriptions with commas)
      const row = parseCSVRow(rows[i]);
      
      const expense: Partial<ExpenseItem> = {};
      
      // Map each column to the appropriate field
      headers.forEach((header, index) => {
        if (header === "id") expense.id = Number(row[index]);
        else if (header === "description") expense.description = row[index];
        else if (header === "amount") expense.amount = parseFloat(row[index]);
        else if (header === "date") expense.date = row[index];
        else if (header === "category") expense.category = row[index] as any;
        else if (header === "expensetype") expense.expenseType = row[index] as any;
      });
      
      // Only add if it has required fields
      if (expense.description && expense.amount !== undefined) {
        expenses.push({
          id: expense.id || Math.floor(Math.random() * 10000),
          description: expense.description,
          amount: expense.amount,
          date: expense.date || new Date().toISOString().slice(0, 10),
          category: expense.category || 'personal',
          expenseType: expense.expenseType || 'other'
        });
      }
    }
    
    return expenses;
  } catch (error) {
    console.error("Error parsing CSV:", error);
    return [];
  }
};

/**
 * Parse a CSV row handling quoted fields
 */
const parseCSVRow = (row: string): string[] => {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  
  for (let i = 0; i < row.length; i++) {
    const char = row[i];
    
    if (char === '"') {
      // Toggle quote state
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      // End of field
      result.push(current);
      current = "";
    } else {
      // Add character to current field
      current += char;
    }
  }
  
  // Add the last field
  result.push(current);
  return result;
};

// Import the types
import { ExpenseItem } from "@/components/expenses/ExpenseCard";
import { Transaction } from "@/lib/types";
