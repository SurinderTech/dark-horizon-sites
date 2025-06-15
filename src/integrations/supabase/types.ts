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
      agents: {
        Row: {
          category: string
          created_at: string
          description: string
          features: Json
          id: string
          is_popular: boolean | null
          lifetime_price: number
          monthly_price: number
          name: string
          yearly_price: number
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          features?: Json
          id?: string
          is_popular?: boolean | null
          lifetime_price: number
          monthly_price: number
          name: string
          yearly_price: number
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          features?: Json
          id?: string
          is_popular?: boolean | null
          lifetime_price?: number
          monthly_price?: number
          name?: string
          yearly_price?: number
        }
        Relationships: []
      }
      flight_bookings: {
        Row: {
          airline: string | null
          created_at: string
          departure_date: string
          destination: string
          flight_number: string | null
          id: string
          origin: string
          passengers: number
          prompt: string | null
          return_date: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          airline?: string | null
          created_at?: string
          departure_date: string
          destination: string
          flight_number?: string | null
          id?: string
          origin: string
          passengers?: number
          prompt?: string | null
          return_date?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          airline?: string | null
          created_at?: string
          departure_date?: string
          destination?: string
          flight_number?: string | null
          id?: string
          origin?: string
          passengers?: number
          prompt?: string | null
          return_date?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "flight_bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      food_orders: {
        Row: {
          address: string
          created_at: string
          description: string
          id: string
          restaurant: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          address: string
          created_at?: string
          description: string
          id?: string
          restaurant?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string
          created_at?: string
          description?: string
          id?: string
          restaurant?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "food_orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      hotel_bookings: {
        Row: {
          check_in: string
          check_out: string
          created_at: string
          guests: number
          hotel_name: string | null
          id: string
          location: string
          prompt: string | null
          room_type: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          check_in: string
          check_out: string
          created_at?: string
          guests?: number
          hotel_name?: string | null
          id?: string
          location: string
          prompt?: string | null
          room_type?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          check_in?: string
          check_out?: string
          created_at?: string
          guests?: number
          hotel_name?: string | null
          id?: string
          location?: string
          prompt?: string | null
          room_type?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "hotel_bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          role?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      purchases: {
        Row: {
          agent_id: string | null
          amount: number
          id: string
          purchase_type: string
          purchased_at: string
          status: string
          stripe_session_id: string | null
          user_id: string | null
        }
        Insert: {
          agent_id?: string | null
          amount: number
          id?: string
          purchase_type: string
          purchased_at?: string
          status?: string
          stripe_session_id?: string | null
          user_id?: string | null
        }
        Update: {
          agent_id?: string | null
          amount?: number
          id?: string
          purchase_type?: string
          purchased_at?: string
          status?: string
          stripe_session_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchases_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchases_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      scheduled_posts: {
        Row: {
          attachment_name: string | null
          content: string | null
          created_at: string
          error_message: string | null
          id: number
          image_url: string | null
          platform: string
          response: Json | null
          scheduled_at: string
          status: string
          updated_at: string
        }
        Insert: {
          attachment_name?: string | null
          content?: string | null
          created_at?: string
          error_message?: string | null
          id?: number
          image_url?: string | null
          platform: string
          response?: Json | null
          scheduled_at: string
          status?: string
          updated_at?: string
        }
        Update: {
          attachment_name?: string | null
          content?: string | null
          created_at?: string
          error_message?: string | null
          id?: number
          image_url?: string | null
          platform?: string
          response?: Json | null
          scheduled_at?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      transport_bookings: {
        Row: {
          created_at: string
          destination: string
          id: string
          mode: string
          origin: string
          passengers: number
          prompt: string | null
          provider: string | null
          status: string
          ticket_number: string | null
          travel_date: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          destination: string
          id?: string
          mode: string
          origin: string
          passengers?: number
          prompt?: string | null
          provider?: string | null
          status?: string
          ticket_number?: string | null
          travel_date: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          destination?: string
          id?: string
          mode?: string
          origin?: string
          passengers?: number
          prompt?: string | null
          provider?: string | null
          status?: string
          ticket_number?: string | null
          travel_date?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transport_bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
