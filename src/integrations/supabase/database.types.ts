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
      categories: {
        Row: {
          id: string
          title: string
          color: string
        }
        Insert: {
          id: string
          title: string
          color: string
        }
        Update: {
          id?: string
          title?: string
          color?: string
        }
      }
      contact_categories: {
        Row: {
          contact_id: string
          category_id: string
        }
        Insert: {
          contact_id: string
          category_id: string
        }
        Update: {
          contact_id?: string
          category_id?: string
        }
      }
      contacts: {
        Row: {
          id: string
          name: string
          email: string | null
          phone: string | null
          image: string | null
          reminder_interval: number | null
          reminder_unit: string | null
          start_date: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          email?: string | null
          phone?: string | null
          image?: string | null
          reminder_interval?: number | null
          reminder_unit?: string | null
          start_date?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          email?: string | null
          phone?: string | null
          image?: string | null
          reminder_interval?: number | null
          reminder_unit?: string | null
          start_date?: string | null
          created_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}