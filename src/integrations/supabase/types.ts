export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      ai_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          role: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      appointments: {
        Row: {
          created_at: string
          doctor: string | null
          id: string
          location: string | null
          notes: string | null
          scheduled_at: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          doctor?: string | null
          id?: string
          location?: string | null
          notes?: string | null
          scheduled_at: string
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          doctor?: string | null
          id?: string
          location?: string | null
          notes?: string | null
          scheduled_at?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      contractions: {
        Row: {
          duration_seconds: number
          id: string
          interval_seconds: number | null
          started_at: string
          user_id: string
        }
        Insert: {
          duration_seconds: number
          id?: string
          interval_seconds?: number | null
          started_at?: string
          user_id: string
        }
        Update: {
          duration_seconds?: number
          id?: string
          interval_seconds?: number | null
          started_at?: string
          user_id?: string
        }
        Relationships: []
      }
      daily_logs: {
        Row: {
          created_at: string
          exercise_minutes: number
          id: string
          log_date: string
          meals_completed: number
          mood: string | null
          notes: string | null
          sleep_hours: number
          user_id: string
          water_glasses: number
        }
        Insert: {
          created_at?: string
          exercise_minutes?: number
          id?: string
          log_date?: string
          meals_completed?: number
          mood?: string | null
          notes?: string | null
          sleep_hours?: number
          user_id: string
          water_glasses?: number
        }
        Update: {
          created_at?: string
          exercise_minutes?: number
          id?: string
          log_date?: string
          meals_completed?: number
          mood?: string | null
          notes?: string | null
          sleep_hours?: number
          user_id?: string
          water_glasses?: number
        }
        Relationships: []
      }
      kick_sessions: {
        Row: {
          duration_seconds: number
          id: string
          kicks: number
          started_at: string
          user_id: string
        }
        Insert: {
          duration_seconds?: number
          id?: string
          kicks?: number
          started_at?: string
          user_id: string
        }
        Update: {
          duration_seconds?: number
          id?: string
          kicks?: number
          started_at?: string
          user_id?: string
        }
        Relationships: []
      }
      medicines: {
        Row: {
          active: boolean
          created_at: string
          dosage: string | null
          frequency: string
          id: string
          name: string
          time_of_day: string
          user_id: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          dosage?: string | null
          frequency?: string
          id?: string
          name: string
          time_of_day?: string
          user_id: string
        }
        Update: {
          active?: boolean
          created_at?: string
          dosage?: string | null
          frequency?: string
          id?: string
          name?: string
          time_of_day?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          baby_type: string
          created_at: string
          due_date: string | null
          email: string | null
          full_name: string
          height_cm: number | null
          id: string
          lmp_date: string | null
          onboarded: boolean
          updated_at: string
          weight_kg: number | null
        }
        Insert: {
          avatar_url?: string | null
          baby_type?: string
          created_at?: string
          due_date?: string | null
          email?: string | null
          full_name?: string
          height_cm?: number | null
          id: string
          lmp_date?: string | null
          onboarded?: boolean
          updated_at?: string
          weight_kg?: number | null
        }
        Update: {
          avatar_url?: string | null
          baby_type?: string
          created_at?: string
          due_date?: string | null
          email?: string | null
          full_name?: string
          height_cm?: number | null
          id?: string
          lmp_date?: string | null
          onboarded?: boolean
          updated_at?: string
          weight_kg?: number | null
        }
        Relationships: []
      }
      reminder_settings: {
        Row: {
          medicine_enabled: boolean
          prenatal_vitamin_enabled: boolean
          updated_at: string
          user_id: string
          water_enabled: boolean
          workout_enabled: boolean
        }
        Insert: {
          medicine_enabled?: boolean
          prenatal_vitamin_enabled?: boolean
          updated_at?: string
          user_id: string
          water_enabled?: boolean
          workout_enabled?: boolean
        }
        Update: {
          medicine_enabled?: boolean
          prenatal_vitamin_enabled?: boolean
          updated_at?: string
          user_id?: string
          water_enabled?: boolean
          workout_enabled?: boolean
        }
        Relationships: []
      }
      symptoms: {
        Row: {
          id: string
          logged_at: string
          name: string
          notes: string | null
          severity: string
          user_id: string
        }
        Insert: {
          id?: string
          logged_at?: string
          name: string
          notes?: string | null
          severity?: string
          user_id: string
        }
        Update: {
          id?: string
          logged_at?: string
          name?: string
          notes?: string | null
          severity?: string
          user_id?: string
        }
        Relationships: []
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
