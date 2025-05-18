
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      expenses: {
        Row: {
          id: number
          description: string
          amount: number
          date: string
          category: string
          expense_type: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: number
          description: string
          amount: number
          date: string
          category: string
          expense_type: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: number
          description?: string
          amount?: number
          date?: string
          category?: string
          expense_type?: string
          user_id?: string
          created_at?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          email: string
          name: string | null
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          avatar_url?: string | null
          created_at?: string
        }
      }
      businesses: {
        Row: {
          id: string
          name: string
          color: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          color: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          color?: string
          user_id?: string
          created_at?: string
        }
      }
    }
  }
}
