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
      catalog_lines: {
        Row: {
          enabled: boolean
          line: Database["public"]["Enums"]["product_line"]
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          enabled?: boolean
          line: Database["public"]["Enums"]["product_line"]
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          enabled?: boolean
          line?: Database["public"]["Enums"]["product_line"]
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          actor_email: string | null
          actor_id: string | null
          changed_fields: string[] | null
          created_at: string
          id: number
          new_data: Json | null
          old_data: Json | null
          record_id: string
          table_name: string
        }
        Insert: {
          action: string
          actor_email?: string | null
          actor_id?: string | null
          changed_fields?: string[] | null
          created_at?: string
          id?: never
          new_data?: Json | null
          old_data?: Json | null
          record_id: string
          table_name: string
        }
        Update: {
          action?: string
          actor_email?: string | null
          actor_id?: string | null
          changed_fields?: string[] | null
          created_at?: string
          id?: never
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string
          table_name?: string
        }
        Relationships: []
      }
      formula_compositions: {
        Row: {
          active: boolean
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          formula_id: string
          id: string
          ingredient_id: string | null
          ingredient_name: string
          metadata: Json
          quantity: number
          reason_deleted: string | null
          sort_order: number
          unit: Database["public"]["Enums"]["composition_unit"]
          updated_at: string
          updated_by: string | null
          version: number
        }
        Insert: {
          active?: boolean
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          formula_id: string
          id?: string
          ingredient_id?: string | null
          ingredient_name: string
          metadata?: Json
          quantity: number
          reason_deleted?: string | null
          sort_order?: number
          unit: Database["public"]["Enums"]["composition_unit"]
          updated_at?: string
          updated_by?: string | null
          version?: number
        }
        Update: {
          active?: boolean
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          formula_id?: string
          id?: string
          ingredient_id?: string | null
          ingredient_name?: string
          metadata?: Json
          quantity?: number
          reason_deleted?: string | null
          sort_order?: number
          unit?: Database["public"]["Enums"]["composition_unit"]
          updated_at?: string
          updated_by?: string | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "formula_compositions_formula_id_fkey"
            columns: ["formula_id"]
            isOneToOne: false
            referencedRelation: "formulas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "formula_compositions_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
        ]
      }
      formula_costs: {
        Row: {
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          formula_id: string
          id: string
          internal_notes: string | null
          metadata: Json
          reason_deleted: string | null
          unit_cost_cents: number | null
          updated_at: string
          updated_by: string | null
          version: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          formula_id: string
          id?: string
          internal_notes?: string | null
          metadata?: Json
          reason_deleted?: string | null
          unit_cost_cents?: number | null
          updated_at?: string
          updated_by?: string | null
          version?: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          formula_id?: string
          id?: string
          internal_notes?: string | null
          metadata?: Json
          reason_deleted?: string | null
          unit_cost_cents?: number | null
          updated_at?: string
          updated_by?: string | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "formula_costs_formula_id_fkey"
            columns: ["formula_id"]
            isOneToOne: true
            referencedRelation: "formulas"
            referencedColumns: ["id"]
          },
        ]
      }
      formula_sheet_approvals: {
        Row: {
          active: boolean
          approved_at: string
          approved_by_license: string
          approved_by_name: string
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          formula_id: string
          id: string
          metadata: Json
          notes: string | null
          reason_deleted: string | null
          sheet_version: number
          updated_at: string
          updated_by: string | null
          version: number
        }
        Insert: {
          active?: boolean
          approved_at?: string
          approved_by_license: string
          approved_by_name: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          formula_id: string
          id?: string
          metadata?: Json
          notes?: string | null
          reason_deleted?: string | null
          sheet_version: number
          updated_at?: string
          updated_by?: string | null
          version?: number
        }
        Update: {
          active?: boolean
          approved_at?: string
          approved_by_license?: string
          approved_by_name?: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          formula_id?: string
          id?: string
          metadata?: Json
          notes?: string | null
          reason_deleted?: string | null
          sheet_version?: number
          updated_at?: string
          updated_by?: string | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "formula_sheet_approvals_formula_id_fkey"
            columns: ["formula_id"]
            isOneToOne: false
            referencedRelation: "formulas"
            referencedColumns: ["id"]
          },
        ]
      }
      formulas: {
        Row: {
          active: boolean
          benefits: string[]
          box_depth_mm: number | null
          box_gross_weight_g: number | null
          box_height_mm: number | null
          box_width_mm: number | null
          capsule_count: number | null
          compliance_norms: string[] | null
          compliance_source: string | null
          compliance_verified_at: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          description: string
          dun14: string | null
          ean13: string | null
          featured_at: string | null
          format: Database["public"]["Enums"]["product_format"]
          general_benefits_summary: string | null
          gross_weight_g: number | null
          id: string
          ingredients_list: string | null
          line: Database["public"]["Enums"]["product_line"]
          list_price_cents: number | null
          metadata: Json
          minimum_order_potes: number
          mockup_path: string | null
          name: string
          net_weight: string | null
          nutritional_info: string | null
          package_depth_mm: number | null
          package_height_mm: number | null
          package_width_mm: number | null
          pote_contents_description: string | null
          reason_deleted: string | null
          regulatory_product_type: string | null
          segment_id: string
          serving_description: string | null
          shelf_life_months: number | null
          slug: string
          sort_order: number
          storage_instructions: string | null
          target_audience: string | null
          technical_sheet_title: string | null
          technical_sheet_version: number
          units_per_box: number | null
          updated_at: string
          updated_by: string | null
          usage_instructions: string | null
          version: number
          warnings: string | null
        }
        Insert: {
          active?: boolean
          benefits?: string[]
          box_depth_mm?: number | null
          box_gross_weight_g?: number | null
          box_height_mm?: number | null
          box_width_mm?: number | null
          capsule_count?: number | null
          compliance_norms?: string[] | null
          compliance_source?: string | null
          compliance_verified_at?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string
          dun14?: string | null
          ean13?: string | null
          featured_at?: string | null
          format: Database["public"]["Enums"]["product_format"]
          general_benefits_summary?: string | null
          gross_weight_g?: number | null
          id?: string
          ingredients_list?: string | null
          line: Database["public"]["Enums"]["product_line"]
          list_price_cents?: number | null
          metadata?: Json
          minimum_order_potes?: number
          mockup_path?: string | null
          name: string
          net_weight?: string | null
          nutritional_info?: string | null
          package_depth_mm?: number | null
          package_height_mm?: number | null
          package_width_mm?: number | null
          pote_contents_description?: string | null
          reason_deleted?: string | null
          regulatory_product_type?: string | null
          segment_id: string
          serving_description?: string | null
          shelf_life_months?: number | null
          slug: string
          sort_order?: number
          storage_instructions?: string | null
          target_audience?: string | null
          technical_sheet_title?: string | null
          technical_sheet_version?: number
          units_per_box?: number | null
          updated_at?: string
          updated_by?: string | null
          usage_instructions?: string | null
          version?: number
          warnings?: string | null
        }
        Update: {
          active?: boolean
          benefits?: string[]
          box_depth_mm?: number | null
          box_gross_weight_g?: number | null
          box_height_mm?: number | null
          box_width_mm?: number | null
          capsule_count?: number | null
          compliance_norms?: string[] | null
          compliance_source?: string | null
          compliance_verified_at?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string
          dun14?: string | null
          ean13?: string | null
          featured_at?: string | null
          format?: Database["public"]["Enums"]["product_format"]
          general_benefits_summary?: string | null
          gross_weight_g?: number | null
          id?: string
          ingredients_list?: string | null
          line?: Database["public"]["Enums"]["product_line"]
          list_price_cents?: number | null
          metadata?: Json
          minimum_order_potes?: number
          mockup_path?: string | null
          name?: string
          net_weight?: string | null
          nutritional_info?: string | null
          package_depth_mm?: number | null
          package_height_mm?: number | null
          package_width_mm?: number | null
          pote_contents_description?: string | null
          reason_deleted?: string | null
          regulatory_product_type?: string | null
          segment_id?: string
          serving_description?: string | null
          shelf_life_months?: number | null
          slug?: string
          sort_order?: number
          storage_instructions?: string | null
          target_audience?: string | null
          technical_sheet_title?: string | null
          technical_sheet_version?: number
          units_per_box?: number | null
          updated_at?: string
          updated_by?: string | null
          usage_instructions?: string | null
          version?: number
          warnings?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "formulas_segment_id_fkey"
            columns: ["segment_id"]
            isOneToOne: false
            referencedRelation: "segments"
            referencedColumns: ["id"]
          },
        ]
      }
      ingredients: {
        Row: {
          active: boolean
          category: Database["public"]["Enums"]["ingredient_category"]
          claim_min_amount: number | null
          claim_source: string | null
          claim_text: string | null
          claim_verified_at: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          description: string | null
          id: string
          image_path: string | null
          metadata: Json
          name: string
          reason_deleted: string | null
          slug: string
          sort_order: number
          synonyms: string[]
          updated_at: string
          updated_by: string | null
          version: number
        }
        Insert: {
          active?: boolean
          category?: Database["public"]["Enums"]["ingredient_category"]
          claim_min_amount?: number | null
          claim_source?: string | null
          claim_text?: string | null
          claim_verified_at?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          id?: string
          image_path?: string | null
          metadata?: Json
          name: string
          reason_deleted?: string | null
          slug: string
          sort_order?: number
          synonyms?: string[]
          updated_at?: string
          updated_by?: string | null
          version?: number
        }
        Update: {
          active?: boolean
          category?: Database["public"]["Enums"]["ingredient_category"]
          claim_min_amount?: number | null
          claim_source?: string | null
          claim_text?: string | null
          claim_verified_at?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          id?: string
          image_path?: string | null
          metadata?: Json
          name?: string
          reason_deleted?: string | null
          slug?: string
          sort_order?: number
          synonyms?: string[]
          updated_at?: string
          updated_by?: string | null
          version?: number
        }
        Relationships: []
      }
      leads: {
        Row: {
          cart_snapshot: Json
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          id: string
          metadata: Json
          name: string
          reason_deleted: string | null
          updated_at: string
          updated_by: string | null
          version: number
          whatsapp: string
        }
        Insert: {
          cart_snapshot?: Json
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          metadata?: Json
          name: string
          reason_deleted?: string | null
          updated_at?: string
          updated_by?: string | null
          version?: number
          whatsapp: string
        }
        Update: {
          cart_snapshot?: Json
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          metadata?: Json
          name?: string
          reason_deleted?: string | null
          updated_at?: string
          updated_by?: string | null
          version?: number
          whatsapp?: string
        }
        Relationships: []
      }
      quote_items: {
        Row: {
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          formula_id: string
          formula_name_snapshot: string
          id: string
          line_cost_cents: number | null
          line_total_cents: number | null
          metadata: Json
          profit_cents: number | null
          profit_margin_pct: number | null
          quantity_potes: number
          quote_id: string
          reason_deleted: string | null
          sort_order: number
          unit_cost_cents: number | null
          unit_price_cents: number | null
          updated_at: string
          updated_by: string | null
          version: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          formula_id: string
          formula_name_snapshot: string
          id?: string
          line_cost_cents?: number | null
          line_total_cents?: number | null
          metadata?: Json
          profit_cents?: number | null
          profit_margin_pct?: number | null
          quantity_potes: number
          quote_id: string
          reason_deleted?: string | null
          sort_order?: number
          unit_cost_cents?: number | null
          unit_price_cents?: number | null
          updated_at?: string
          updated_by?: string | null
          version?: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          formula_id?: string
          formula_name_snapshot?: string
          id?: string
          line_cost_cents?: number | null
          line_total_cents?: number | null
          metadata?: Json
          profit_cents?: number | null
          profit_margin_pct?: number | null
          quantity_potes?: number
          quote_id?: string
          reason_deleted?: string | null
          sort_order?: number
          unit_cost_cents?: number | null
          unit_price_cents?: number | null
          updated_at?: string
          updated_by?: string | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "quote_items_formula_id_fkey"
            columns: ["formula_id"]
            isOneToOne: false
            referencedRelation: "formulas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_items_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quote_summaries"
            referencedColumns: ["quote_id"]
          },
          {
            foreignKeyName: "quote_items_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      quotes: {
        Row: {
          created_at: string
          created_by: string | null
          customer_name: string
          customer_whatsapp: string
          deleted_at: string | null
          deleted_by: string | null
          id: string
          internal_note: string | null
          lead_id: string | null
          metadata: Json
          quote_number: number
          reason_deleted: string | null
          status: Database["public"]["Enums"]["quote_status"]
          updated_at: string
          updated_by: string | null
          version: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          customer_name: string
          customer_whatsapp: string
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          internal_note?: string | null
          lead_id?: string | null
          metadata?: Json
          quote_number?: never
          reason_deleted?: string | null
          status?: Database["public"]["Enums"]["quote_status"]
          updated_at?: string
          updated_by?: string | null
          version?: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          customer_name?: string
          customer_whatsapp?: string
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          internal_note?: string | null
          lead_id?: string | null
          metadata?: Json
          quote_number?: never
          reason_deleted?: string | null
          status?: Database["public"]["Enums"]["quote_status"]
          updated_at?: string
          updated_by?: string | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "quotes_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      segments: {
        Row: {
          active: boolean
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          id: string
          name: string
          reason_deleted: string | null
          slug: string
          sort_order: number
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          active?: boolean
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          name: string
          reason_deleted?: string | null
          slug: string
          sort_order?: number
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          active?: boolean
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          name?: string
          reason_deleted?: string | null
          slug?: string
          sort_order?: number
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      staff_profiles: {
        Row: {
          active: boolean
          can_manage_quotes: boolean
          created_at: string
          created_by: string | null
          full_name: string
          updated_at: string
          updated_by: string | null
          user_id: string
        }
        Insert: {
          active?: boolean
          can_manage_quotes?: boolean
          created_at?: string
          created_by?: string | null
          full_name: string
          updated_at?: string
          updated_by?: string | null
          user_id: string
        }
        Update: {
          active?: boolean
          can_manage_quotes?: boolean
          created_at?: string
          created_by?: string | null
          full_name?: string
          updated_at?: string
          updated_by?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      quote_summaries: {
        Row: {
          created_at: string | null
          customer_name: string | null
          customer_whatsapp: string | null
          internal_note: string | null
          item_count: number | null
          lead_id: string | null
          quote_id: string | null
          quote_number: number | null
          status: Database["public"]["Enums"]["quote_status"] | null
          total_cents: number | null
          total_profit_cents: number | null
        }
        Relationships: [
          {
            foreignKeyName: "quotes_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      each: { Args: { hs: unknown }; Returns: Record<string, unknown>[] }
      fn_capture_lead: {
        Args: { p_cart_snapshot?: Json; p_name: string; p_whatsapp: string }
        Returns: string
      }
      fn_generate_quote: {
        Args: {
          p_customer_name: string
          p_customer_whatsapp: string
          p_items: Json
          p_lead_id?: string
        }
        Returns: {
          quote_id: string
          quote_number: number
        }[]
      }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
    }
    Enums: {
      composition_unit: "g" | "mg" | "mcg" | "ml" | "l" | "ui" | "kg"
      ingredient_category:
        | "vitamina"
        | "mineral"
        | "aminoacido"
        | "extrato_vegetal"
        | "outro"
      product_format: "capsula" | "soluvel" | "gummy" | "liquido"
      product_line: "premium" | "basica" | "essencial" | "lemon_caps"
      quote_status: "aberto" | "aprovado" | "recusado" | "expirado"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      composition_unit: ["g", "mg", "mcg", "ml", "l", "ui", "kg"],
      ingredient_category: [
        "vitamina",
        "mineral",
        "aminoacido",
        "extrato_vegetal",
        "outro",
      ],
      product_format: ["capsula", "soluvel", "gummy", "liquido"],
      product_line: ["premium", "basica", "essencial", "lemon_caps"],
      quote_status: ["aberto", "aprovado", "recusado", "expirado"],
    },
  },
} as const
