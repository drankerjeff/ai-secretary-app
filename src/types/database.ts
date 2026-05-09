export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          google_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          google_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          google_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          id: string
          user_id: string | null
          title: string
          description: string | null
          priority: 'high' | 'medium' | 'low' | null
          due_date: string | null
          status: 'pending' | 'completed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          title: string
          description?: string | null
          priority?: 'high' | 'medium' | 'low' | null
          due_date?: string | null
          status?: 'pending' | 'completed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          title?: string
          description?: string | null
          priority?: 'high' | 'medium' | 'low' | null
          due_date?: string | null
          status?: 'pending' | 'completed'
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'tasks_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      documents: {
        Row: {
          id: string
          user_id: string | null
          type: 'proofread' | 'minutes' | 'research' | null
          title: string
          original_content: string | null
          processed_content: string | null
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          type?: 'proofread' | 'minutes' | 'research' | null
          title: string
          original_content?: string | null
          processed_content?: string | null
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          type?: 'proofread' | 'minutes' | 'research' | null
          title?: string
          original_content?: string | null
          processed_content?: string | null
          metadata?: Json | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'documents_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      writing_styles: {
        Row: {
          id: string
          user_id: string | null
          style_patterns: Json | null
          sample_count: number
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          style_patterns?: Json | null
          sample_count?: number
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          style_patterns?: Json | null
          sample_count?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'writing_styles_user_id_fkey'
            columns: ['user_id']
            isOneToOne: true
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      calendar_events: {
        Row: {
          id: string
          user_id: string | null
          google_event_id: string | null
          title: string
          description: string | null
          start_datetime: string
          end_datetime: string
          location: string | null
          is_all_day: boolean
          color: string | null
          source: 'manual' | 'google' | 'task'
          task_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          google_event_id?: string | null
          title: string
          description?: string | null
          start_datetime: string
          end_datetime: string
          location?: string | null
          is_all_day?: boolean
          color?: string | null
          source?: 'manual' | 'google' | 'task'
          task_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          google_event_id?: string | null
          title?: string
          description?: string | null
          start_datetime?: string
          end_datetime?: string
          location?: string | null
          is_all_day?: boolean
          color?: string | null
          source?: 'manual' | 'google' | 'task'
          task_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'calendar_events_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'calendar_events_task_id_fkey'
            columns: ['task_id']
            isOneToOne: false
            referencedRelation: 'tasks'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: Record<string, never>
    Functions: {
      update_updated_at_column: {
        Args: Record<string, never>
        Returns: unknown
      }
    }
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

// 型エイリアス（利用側での記述量を減らすため）
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

export type InsertTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']

export type UpdateTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']

export type User = Tables<'users'>
export type Task = Tables<'tasks'>
export type Document = Tables<'documents'>
export type WritingStyle = Tables<'writing_styles'>
export type CalendarEvent = Tables<'calendar_events'>

export type InsertUser = InsertTables<'users'>
export type InsertTask = InsertTables<'tasks'>
export type InsertDocument = InsertTables<'documents'>
export type InsertWritingStyle = InsertTables<'writing_styles'>
export type InsertCalendarEvent = InsertTables<'calendar_events'>

export type UpdateUser = UpdateTables<'users'>
export type UpdateTask = UpdateTables<'tasks'>
export type UpdateDocument = UpdateTables<'documents'>
export type UpdateWritingStyle = UpdateTables<'writing_styles'>
export type UpdateCalendarEvent = UpdateTables<'calendar_events'>
