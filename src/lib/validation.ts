/**
 * Comprehensive Form Validation System
 * Provides consistent validation rules and error handling for forms
 */

import { z } from 'zod';

// Common validation schemas
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

export const nameSchema = z
  .string()
  .min(1, 'Name is required')
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name must be less than 50 characters');

export const amountSchema = z
  .number()
  .positive('Amount must be positive')
  .max(1000000, 'Amount cannot exceed $1,000,000');

export const descriptionSchema = z
  .string()
  .min(1, 'Description is required')
  .min(3, 'Description must be at least 3 characters')
  .max(200, 'Description must be less than 200 characters');

export const dateSchema = z
  .string()
  .min(1, 'Date is required')
  .refine((date) => !isNaN(Date.parse(date)), 'Please enter a valid date');

// Transaction validation schema
export const transactionSchema = z.object({
  description: descriptionSchema,
  amount: amountSchema,
  type: z.enum(['income', 'expense'], {
    required_error: 'Transaction type is required',
    invalid_type_error: 'Transaction type must be income or expense'
  }),
  date: dateSchema,
  category: z.enum(['personal', 'business'], {
    required_error: 'Category is required'
  }),
  expenseType: z.string().optional()
});

// Budget validation schema
export const budgetSchema = z.object({
  name: z
    .string()
    .min(1, 'Budget name is required')
    .min(3, 'Budget name must be at least 3 characters')
    .max(50, 'Budget name must be less than 50 characters'),
  amount: amountSchema,
  category: z.enum(['personal', 'business'], {
    required_error: 'Category is required'
  }),
  period: z.enum(['weekly', 'monthly', 'quarterly', 'yearly'], {
    required_error: 'Budget period is required'
  }).optional().default('monthly')
});

// Account validation schema
export const accountSchema = z.object({
  name: z
    .string()
    .min(1, 'Account name is required')
    .min(3, 'Account name must be at least 3 characters')
    .max(50, 'Account name must be less than 50 characters'),
  type: z.enum(['checking', 'savings', 'credit', 'investment'], {
    required_error: 'Account type is required'
  }),
  balance: z
    .number()
    .min(-1000000, 'Balance cannot be less than -$1,000,000')
    .max(1000000, 'Balance cannot exceed $1,000,000'),
  category: z.enum(['personal', 'business'], {
    required_error: 'Category is required'
  })
});

// Business validation schema
export const businessSchema = z.object({
  name: z
    .string()
    .min(1, 'Business name is required')
    .min(2, 'Business name must be at least 2 characters')
    .max(100, 'Business name must be less than 100 characters'),
  color: z
    .string()
    .min(1, 'Color is required')
    .regex(/^#[0-9A-F]{6}$/i, 'Please select a valid color')
});

// Authentication validation schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required')
});

export const signupSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'Please confirm your password')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

export const resetPasswordSchema = z.object({
  email: emailSchema
});

// Profile update schema
export const profileUpdateSchema = z.object({
  name: nameSchema.optional(),
  email: emailSchema.optional()
});

// CSV Import validation
export const csvImportSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, 'File size must be less than 5MB')
    .refine((file) => file.type === 'text/csv' || file.name.endsWith('.csv'), 'File must be a CSV file')
});

// Validation utility functions
export class ValidationHelper {
  /**
   * Validate data against a schema and return formatted errors
   */
  static validate<T>(schema: z.ZodSchema<T>, data: unknown): {
    success: boolean;
    data?: T;
    errors?: Record<string, string>;
  } {
    const result = schema.safeParse(data);
    
    if (result.success) {
      return {
        success: true,
        data: result.data
      };
    }
    
    const errors: Record<string, string> = {};
    result.error.errors.forEach((error) => {
      const path = error.path.join('.');
      errors[path] = error.message;
    });
    
    return {
      success: false,
      errors
    };
  }

  /**
   * Validate email format
   */
  static isValidEmail(email: string): boolean {
    return emailSchema.safeParse(email).success;
  }

  /**
   * Validate password strength
   */
  static isValidPassword(password: string): boolean {
    return passwordSchema.safeParse(password).success;
  }

  /**
   * Get password strength score (0-4)
   */
  static getPasswordStrength(password: string): {
    score: number;
    feedback: string[];
  } {
    const feedback: string[] = [];
    let score = 0;

    if (password.length >= 8) {
      score++;
    } else {
      feedback.push('Use at least 8 characters');
    }

    if (/[A-Z]/.test(password)) {
      score++;
    } else {
      feedback.push('Add uppercase letters');
    }

    if (/[a-z]/.test(password)) {
      score++;
    } else {
      feedback.push('Add lowercase letters');
    }

    if (/[0-9]/.test(password)) {
      score++;
    } else {
      feedback.push('Add numbers');
    }

    if (/[^A-Za-z0-9]/.test(password)) {
      score++;
      if (score > 4) score = 4;
    } else if (score === 4) {
      feedback.push('Add special characters for extra security');
    }

    return { score, feedback };
  }

  /**
   * Validate amount input
   */
  static validateAmount(amount: string | number): {
    isValid: boolean;
    value?: number;
    error?: string;
  } {
    const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    
    if (isNaN(numericAmount)) {
      return {
        isValid: false,
        error: 'Please enter a valid number'
      };
    }
    
    if (numericAmount <= 0) {
      return {
        isValid: false,
        error: 'Amount must be greater than zero'
      };
    }
    
    if (numericAmount > 1000000) {
      return {
        isValid: false,
        error: 'Amount cannot exceed $1,000,000'
      };
    }
    
    return {
      isValid: true,
      value: numericAmount
    };
  }

  /**
   * Validate date input
   */
  static validateDate(date: string | Date): {
    isValid: boolean;
    value?: Date;
    error?: string;
  } {
    let dateObj: Date;
    
    if (typeof date === 'string') {
      dateObj = new Date(date);
    } else {
      dateObj = date;
    }
    
    if (isNaN(dateObj.getTime())) {
      return {
        isValid: false,
        error: 'Please enter a valid date'
      };
    }
    
    // Check if date is not too far in the future (more than 1 year)
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
    
    if (dateObj > oneYearFromNow) {
      return {
        isValid: false,
        error: 'Date cannot be more than one year in the future'
      };
    }
    
    // Check if date is not too far in the past (more than 10 years)
    const tenYearsAgo = new Date();
    tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 10);
    
    if (dateObj < tenYearsAgo) {
      return {
        isValid: false,
        error: 'Date cannot be more than 10 years in the past'
      };
    }
    
    return {
      isValid: true,
      value: dateObj
    };
  }

  /**
   * Sanitize string input
   */
  static sanitizeString(input: string): string {
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/\s+/g, ' '); // Normalize whitespace
  }

  /**
   * Validate file upload
   */
  static validateFile(file: File, options: {
    maxSize?: number;
    allowedTypes?: string[];
  } = {}): {
    isValid: boolean;
    error?: string;
  } {
    const { maxSize = 5 * 1024 * 1024, allowedTypes = ['text/csv'] } = options;
    
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`
      };
    }
    
    if (!allowedTypes.includes(file.type) && !allowedTypes.some(type => file.name.endsWith(type.split('/')[1]))) {
      return {
        isValid: false,
        error: `File must be one of: ${allowedTypes.join(', ')}`
      };
    }
    
    return {
      isValid: true
    };
  }
}

// Export validation schemas and helper
export {
  ValidationHelper as validator
};
