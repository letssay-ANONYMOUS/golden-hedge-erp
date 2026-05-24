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
      aml_alerts: {
        Row: {
          assigned_to: string | null
          broker_id: string | null
          created_at: string | null
          entity_id: string | null
          entity_type: string
          id: string
          organization_id: string | null
          resolved_at: string | null
          rule_triggered: string
          severity: string | null
          status: string | null
        }
        Insert: {
          assigned_to?: string | null
          broker_id?: string | null
          created_at?: string | null
          entity_id?: string | null
          entity_type: string
          id?: string
          organization_id?: string | null
          resolved_at?: string | null
          rule_triggered: string
          severity?: string | null
          status?: string | null
        }
        Update: {
          assigned_to?: string | null
          broker_id?: string | null
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          organization_id?: string | null
          resolved_at?: string | null
          rule_triggered?: string
          severity?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "aml_alerts_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "users_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "aml_alerts_broker_id_fkey"
            columns: ["broker_id"]
            isOneToOne: false
            referencedRelation: "brokers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "aml_alerts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      approval_requests: {
        Row: {
          approved_by: string | null
          created_at: string | null
          entity_id: string
          entity_type: string
          id: string
          organization_id: string | null
          reason: string | null
          rejected_by: string | null
          requested_action: string
          requested_by: string | null
          required_role: Database["public"]["Enums"]["user_role_enum"]
          resolved_at: string | null
          status: Database["public"]["Enums"]["approval_status"] | null
        }
        Insert: {
          approved_by?: string | null
          created_at?: string | null
          entity_id: string
          entity_type: string
          id?: string
          organization_id?: string | null
          reason?: string | null
          rejected_by?: string | null
          requested_action: string
          requested_by?: string | null
          required_role: Database["public"]["Enums"]["user_role_enum"]
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["approval_status"] | null
        }
        Update: {
          approved_by?: string | null
          created_at?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          organization_id?: string | null
          reason?: string | null
          rejected_by?: string | null
          requested_action?: string
          requested_by?: string | null
          required_role?: Database["public"]["Enums"]["user_role_enum"]
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["approval_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "approval_requests_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "users_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "approval_requests_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "approval_requests_rejected_by_fkey"
            columns: ["rejected_by"]
            isOneToOne: false
            referencedRelation: "users_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "approval_requests_requested_by_fkey"
            columns: ["requested_by"]
            isOneToOne: false
            referencedRelation: "users_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          entity_id: string | null
          entity_type: string
          id: string
          organization_id: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          entity_id?: string | null
          entity_type: string
          id?: string
          organization_id?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          organization_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      broker_commission_rules: {
        Row: {
          broker_id: string | null
          created_at: string | null
          id: string
          markup_per_oz: number | null
          metal_id: string | null
        }
        Insert: {
          broker_id?: string | null
          created_at?: string | null
          id?: string
          markup_per_oz?: number | null
          metal_id?: string | null
        }
        Update: {
          broker_id?: string | null
          created_at?: string | null
          id?: string
          markup_per_oz?: number | null
          metal_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "broker_commission_rules_broker_id_fkey"
            columns: ["broker_id"]
            isOneToOne: false
            referencedRelation: "brokers"
            referencedColumns: ["id"]
          },
        ]
      }
      broker_documents: {
        Row: {
          broker_id: string | null
          created_at: string | null
          document_id: string | null
          document_type: string
          expiry_date: string | null
          id: string
          status: Database["public"]["Enums"]["compliance_status"] | null
        }
        Insert: {
          broker_id?: string | null
          created_at?: string | null
          document_id?: string | null
          document_type: string
          expiry_date?: string | null
          id?: string
          status?: Database["public"]["Enums"]["compliance_status"] | null
        }
        Update: {
          broker_id?: string | null
          created_at?: string | null
          document_id?: string | null
          document_type?: string
          expiry_date?: string | null
          id?: string
          status?: Database["public"]["Enums"]["compliance_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "broker_documents_broker_id_fkey"
            columns: ["broker_id"]
            isOneToOne: false
            referencedRelation: "brokers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "broker_documents_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "document_files"
            referencedColumns: ["id"]
          },
        ]
      }
      broker_limits: {
        Row: {
          broker_id: string | null
          id: string
          max_open_exposure_usd: number | null
          max_quote_size_oz: number | null
          requires_prefunding: boolean | null
          updated_at: string | null
        }
        Insert: {
          broker_id?: string | null
          id?: string
          max_open_exposure_usd?: number | null
          max_quote_size_oz?: number | null
          requires_prefunding?: boolean | null
          updated_at?: string | null
        }
        Update: {
          broker_id?: string | null
          id?: string
          max_open_exposure_usd?: number | null
          max_quote_size_oz?: number | null
          requires_prefunding?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "broker_limits_broker_id_fkey"
            columns: ["broker_id"]
            isOneToOne: true
            referencedRelation: "brokers"
            referencedColumns: ["id"]
          },
        ]
      }
      broker_risk_profiles: {
        Row: {
          broker_id: string | null
          id: string
          last_review_date: string | null
          next_review_date: string | null
          notes: string | null
          reviewed_by: string | null
          risk_level: string | null
        }
        Insert: {
          broker_id?: string | null
          id?: string
          last_review_date?: string | null
          next_review_date?: string | null
          notes?: string | null
          reviewed_by?: string | null
          risk_level?: string | null
        }
        Update: {
          broker_id?: string | null
          id?: string
          last_review_date?: string | null
          next_review_date?: string | null
          notes?: string | null
          reviewed_by?: string | null
          risk_level?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "broker_risk_profiles_broker_id_fkey"
            columns: ["broker_id"]
            isOneToOne: true
            referencedRelation: "brokers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "broker_risk_profiles_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "users_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      broker_status_history: {
        Row: {
          broker_id: string | null
          changed_by: string | null
          created_at: string | null
          id: string
          new_status: Database["public"]["Enums"]["compliance_status"]
          old_status: Database["public"]["Enums"]["compliance_status"] | null
          reason: string | null
        }
        Insert: {
          broker_id?: string | null
          changed_by?: string | null
          created_at?: string | null
          id?: string
          new_status: Database["public"]["Enums"]["compliance_status"]
          old_status?: Database["public"]["Enums"]["compliance_status"] | null
          reason?: string | null
        }
        Update: {
          broker_id?: string | null
          changed_by?: string | null
          created_at?: string | null
          id?: string
          new_status?: Database["public"]["Enums"]["compliance_status"]
          old_status?: Database["public"]["Enums"]["compliance_status"] | null
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "broker_status_history_broker_id_fkey"
            columns: ["broker_id"]
            isOneToOne: false
            referencedRelation: "brokers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "broker_status_history_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "users_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      broker_users: {
        Row: {
          broker_id: string | null
          created_at: string | null
          id: string
          is_primary: boolean | null
          user_profile_id: string | null
        }
        Insert: {
          broker_id?: string | null
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          user_profile_id?: string | null
        }
        Update: {
          broker_id?: string | null
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          user_profile_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "broker_users_broker_id_fkey"
            columns: ["broker_id"]
            isOneToOne: false
            referencedRelation: "brokers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "broker_users_user_profile_id_fkey"
            columns: ["user_profile_id"]
            isOneToOne: false
            referencedRelation: "users_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      brokers: {
        Row: {
          country: string | null
          created_at: string | null
          id: string
          name: string
          organization_id: string | null
          registration_number: string | null
          status: Database["public"]["Enums"]["compliance_status"] | null
        }
        Insert: {
          country?: string | null
          created_at?: string | null
          id?: string
          name: string
          organization_id?: string | null
          registration_number?: string | null
          status?: Database["public"]["Enums"]["compliance_status"] | null
        }
        Update: {
          country?: string | null
          created_at?: string | null
          id?: string
          name?: string
          organization_id?: string | null
          registration_number?: string | null
          status?: Database["public"]["Enums"]["compliance_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "brokers_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      compliance_case_notes: {
        Row: {
          author_id: string | null
          case_id: string | null
          created_at: string | null
          id: string
          note_text: string
        }
        Insert: {
          author_id?: string | null
          case_id?: string | null
          created_at?: string | null
          id?: string
          note_text: string
        }
        Update: {
          author_id?: string | null
          case_id?: string | null
          created_at?: string | null
          id?: string
          note_text?: string
        }
        Relationships: [
          {
            foreignKeyName: "compliance_case_notes_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compliance_case_notes_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "compliance_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      compliance_cases: {
        Row: {
          assigned_to: string | null
          broker_id: string | null
          case_type: string
          created_at: string | null
          id: string
          organization_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          broker_id?: string | null
          case_type: string
          created_at?: string | null
          id?: string
          organization_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          broker_id?: string | null
          case_type?: string
          created_at?: string | null
          id?: string
          organization_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "compliance_cases_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "users_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compliance_cases_broker_id_fkey"
            columns: ["broker_id"]
            isOneToOne: false
            referencedRelation: "brokers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compliance_cases_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      compliance_holds: {
        Row: {
          entity_id: string
          entity_type: string
          id: string
          organization_id: string | null
          placed_at: string | null
          placed_by: string | null
          reason: string
          released_at: string | null
          released_by: string | null
          status: string | null
        }
        Insert: {
          entity_id: string
          entity_type: string
          id?: string
          organization_id?: string | null
          placed_at?: string | null
          placed_by?: string | null
          reason: string
          released_at?: string | null
          released_by?: string | null
          status?: string | null
        }
        Update: {
          entity_id?: string
          entity_type?: string
          id?: string
          organization_id?: string | null
          placed_at?: string | null
          placed_by?: string | null
          reason?: string
          released_at?: string | null
          released_by?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "compliance_holds_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compliance_holds_placed_by_fkey"
            columns: ["placed_by"]
            isOneToOne: false
            referencedRelation: "users_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compliance_holds_released_by_fkey"
            columns: ["released_by"]
            isOneToOne: false
            referencedRelation: "users_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      custody_certificates: {
        Row: {
          broker_id: string | null
          created_by: string | null
          document_id: string | null
          id: string
          issued_date: string
        }
        Insert: {
          broker_id?: string | null
          created_by?: string | null
          document_id?: string | null
          id?: string
          issued_date: string
        }
        Update: {
          broker_id?: string | null
          created_by?: string | null
          document_id?: string | null
          id?: string
          issued_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "custody_certificates_broker_id_fkey"
            columns: ["broker_id"]
            isOneToOne: false
            referencedRelation: "brokers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "custody_certificates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "custody_certificates_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "document_files"
            referencedColumns: ["id"]
          },
        ]
      }
      document_files: {
        Row: {
          bucket_name: string
          file_name: string
          id: string
          organization_id: string | null
          storage_path: string
          uploaded_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          bucket_name: string
          file_name: string
          id?: string
          organization_id?: string | null
          storage_path: string
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          bucket_name?: string
          file_name?: string
          id?: string
          organization_id?: string | null
          storage_path?: string
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_files_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_files_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "users_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      frozen_parties: {
        Row: {
          broker_id: string | null
          frozen_at: string | null
          frozen_by: string | null
          id: string
          organization_id: string | null
          reason: string
          status: string | null
          unfrozen_at: string | null
          unfrozen_by: string | null
        }
        Insert: {
          broker_id?: string | null
          frozen_at?: string | null
          frozen_by?: string | null
          id?: string
          organization_id?: string | null
          reason: string
          status?: string | null
          unfrozen_at?: string | null
          unfrozen_by?: string | null
        }
        Update: {
          broker_id?: string | null
          frozen_at?: string | null
          frozen_by?: string | null
          id?: string
          organization_id?: string | null
          reason?: string
          status?: string | null
          unfrozen_at?: string | null
          unfrozen_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "frozen_parties_broker_id_fkey"
            columns: ["broker_id"]
            isOneToOne: false
            referencedRelation: "brokers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "frozen_parties_frozen_by_fkey"
            columns: ["frozen_by"]
            isOneToOne: false
            referencedRelation: "users_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "frozen_parties_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "frozen_parties_unfrozen_by_fkey"
            columns: ["unfrozen_by"]
            isOneToOne: false
            referencedRelation: "users_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      goaml_report_drafts: {
        Row: {
          created_at: string | null
          id: string
          narrative: string | null
          organization_id: string | null
          reference_number: string | null
          report_type: string
          status: string | null
          subject_broker_id: string | null
          submitted_by: string | null
          submitted_date: string | null
          submitted_manually: boolean | null
          suspicion_reason: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          narrative?: string | null
          organization_id?: string | null
          reference_number?: string | null
          report_type: string
          status?: string | null
          subject_broker_id?: string | null
          submitted_by?: string | null
          submitted_date?: string | null
          submitted_manually?: boolean | null
          suspicion_reason?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          narrative?: string | null
          organization_id?: string | null
          reference_number?: string | null
          report_type?: string
          status?: string | null
          subject_broker_id?: string | null
          submitted_by?: string | null
          submitted_date?: string | null
          submitted_manually?: boolean | null
          suspicion_reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "goaml_report_drafts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "goaml_report_drafts_subject_broker_id_fkey"
            columns: ["subject_broker_id"]
            isOneToOne: false
            referencedRelation: "brokers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "goaml_report_drafts_submitted_by_fkey"
            columns: ["submitted_by"]
            isOneToOne: false
            referencedRelation: "users_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      hedge_config: {
        Row: {
          auto_hedge_enabled: boolean
          exposure_threshold_grams: number
          hedge_increment_grams: number
          id: string
          max_slippage_pct: number
          metal_id: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          auto_hedge_enabled?: boolean
          exposure_threshold_grams: number
          hedge_increment_grams: number
          id?: string
          max_slippage_pct?: number
          metal_id: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          auto_hedge_enabled?: boolean
          exposure_threshold_grams?: number
          hedge_increment_grams?: number
          id?: string
          max_slippage_pct?: number
          metal_id?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hedge_config_metal_id_fkey"
            columns: ["metal_id"]
            isOneToOne: true
            referencedRelation: "metals"
            referencedColumns: ["id"]
          },
        ]
      }
      hedge_orders: {
        Row: {
          broker_order_id: string | null
          created_at: string
          created_by: string | null
          direction: Database["public"]["Enums"]["hedge_direction"]
          error_message: string | null
          executed_price_usd: number | null
          id: string
          metal_id: string
          quantity_grams: number
          quantity_oz: number
          slippage_pct: number | null
          status: Database["public"]["Enums"]["hedge_order_status"]
          trigger_price_usd: number
          updated_at: string
        }
        Insert: {
          broker_order_id?: string | null
          created_at?: string
          created_by?: string | null
          direction: Database["public"]["Enums"]["hedge_direction"]
          error_message?: string | null
          executed_price_usd?: number | null
          id?: string
          metal_id: string
          quantity_grams: number
          quantity_oz: number
          slippage_pct?: number | null
          status?: Database["public"]["Enums"]["hedge_order_status"]
          trigger_price_usd: number
          updated_at?: string
        }
        Update: {
          broker_order_id?: string | null
          created_at?: string
          created_by?: string | null
          direction?: Database["public"]["Enums"]["hedge_direction"]
          error_message?: string | null
          executed_price_usd?: number | null
          id?: string
          metal_id?: string
          quantity_grams?: number
          quantity_oz?: number
          slippage_pct?: number | null
          status?: Database["public"]["Enums"]["hedge_order_status"]
          trigger_price_usd?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hedge_orders_metal_id_fkey"
            columns: ["metal_id"]
            isOneToOne: false
            referencedRelation: "metals"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_bars: {
        Row: {
          bar_serial_number: string | null
          created_at: string | null
          id: string
          lot_id: string | null
          metal_id: string | null
          ownership_broker_id: string | null
          purity_grade_id: string | null
          status: Database["public"]["Enums"]["inventory_status"] | null
          vault_location_id: string | null
          weight_grams: number
        }
        Insert: {
          bar_serial_number?: string | null
          created_at?: string | null
          id?: string
          lot_id?: string | null
          metal_id?: string | null
          ownership_broker_id?: string | null
          purity_grade_id?: string | null
          status?: Database["public"]["Enums"]["inventory_status"] | null
          vault_location_id?: string | null
          weight_grams: number
        }
        Update: {
          bar_serial_number?: string | null
          created_at?: string | null
          id?: string
          lot_id?: string | null
          metal_id?: string | null
          ownership_broker_id?: string | null
          purity_grade_id?: string | null
          status?: Database["public"]["Enums"]["inventory_status"] | null
          vault_location_id?: string | null
          weight_grams?: number
        }
        Relationships: [
          {
            foreignKeyName: "inventory_bars_lot_id_fkey"
            columns: ["lot_id"]
            isOneToOne: false
            referencedRelation: "inventory_lots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_bars_metal_id_fkey"
            columns: ["metal_id"]
            isOneToOne: false
            referencedRelation: "metals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_bars_ownership_broker_id_fkey"
            columns: ["ownership_broker_id"]
            isOneToOne: false
            referencedRelation: "brokers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_bars_purity_grade_id_fkey"
            columns: ["purity_grade_id"]
            isOneToOne: false
            referencedRelation: "purity_grades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_bars_vault_location_id_fkey"
            columns: ["vault_location_id"]
            isOneToOne: false
            referencedRelation: "vault_locations"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_lots: {
        Row: {
          assay_certificate_id: string | null
          created_at: string | null
          gross_weight_grams: number
          id: string
          metal_id: string | null
          net_weight_grams: number
          organization_id: string | null
          purity_grade_id: string | null
          received_date: string
          status: Database["public"]["Enums"]["inventory_status"] | null
          supplier_id: string | null
          vault_location_id: string | null
        }
        Insert: {
          assay_certificate_id?: string | null
          created_at?: string | null
          gross_weight_grams: number
          id?: string
          metal_id?: string | null
          net_weight_grams: number
          organization_id?: string | null
          purity_grade_id?: string | null
          received_date: string
          status?: Database["public"]["Enums"]["inventory_status"] | null
          supplier_id?: string | null
          vault_location_id?: string | null
        }
        Update: {
          assay_certificate_id?: string | null
          created_at?: string | null
          gross_weight_grams?: number
          id?: string
          metal_id?: string | null
          net_weight_grams?: number
          organization_id?: string | null
          purity_grade_id?: string | null
          received_date?: string
          status?: Database["public"]["Enums"]["inventory_status"] | null
          supplier_id?: string | null
          vault_location_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_lots_assay_certificate_id_fkey"
            columns: ["assay_certificate_id"]
            isOneToOne: false
            referencedRelation: "document_files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_lots_metal_id_fkey"
            columns: ["metal_id"]
            isOneToOne: false
            referencedRelation: "metals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_lots_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_lots_purity_grade_id_fkey"
            columns: ["purity_grade_id"]
            isOneToOne: false
            referencedRelation: "purity_grades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_lots_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_lots_vault_location_id_fkey"
            columns: ["vault_location_id"]
            isOneToOne: false
            referencedRelation: "vault_locations"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_movements: {
        Row: {
          bar_id: string | null
          created_at: string | null
          destination_location_id: string | null
          id: string
          inventory_type: string
          lot_id: string | null
          moved_by: string | null
          movement_type: Database["public"]["Enums"]["movement_type"]
          organization_id: string | null
          quantity: number | null
          reference_entity_id: string | null
          reference_entity_type: string | null
          source_location_id: string | null
        }
        Insert: {
          bar_id?: string | null
          created_at?: string | null
          destination_location_id?: string | null
          id?: string
          inventory_type: string
          lot_id?: string | null
          moved_by?: string | null
          movement_type: Database["public"]["Enums"]["movement_type"]
          organization_id?: string | null
          quantity?: number | null
          reference_entity_id?: string | null
          reference_entity_type?: string | null
          source_location_id?: string | null
        }
        Update: {
          bar_id?: string | null
          created_at?: string | null
          destination_location_id?: string | null
          id?: string
          inventory_type?: string
          lot_id?: string | null
          moved_by?: string | null
          movement_type?: Database["public"]["Enums"]["movement_type"]
          organization_id?: string | null
          quantity?: number | null
          reference_entity_id?: string | null
          reference_entity_type?: string | null
          source_location_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_movements_bar_id_fkey"
            columns: ["bar_id"]
            isOneToOne: false
            referencedRelation: "inventory_bars"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_movements_destination_location_id_fkey"
            columns: ["destination_location_id"]
            isOneToOne: false
            referencedRelation: "vault_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_movements_lot_id_fkey"
            columns: ["lot_id"]
            isOneToOne: false
            referencedRelation: "inventory_lots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_movements_moved_by_fkey"
            columns: ["moved_by"]
            isOneToOne: false
            referencedRelation: "users_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_movements_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_movements_source_location_id_fkey"
            columns: ["source_location_id"]
            isOneToOne: false
            referencedRelation: "vault_locations"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_reservations: {
        Row: {
          bar_id: string | null
          created_at: string | null
          id: string
          inventory_type: string
          lot_id: string | null
          organization_id: string | null
          quantity: number | null
          reference_entity_id: string | null
          reference_entity_type: string | null
          reserved_by: string | null
          status: string | null
        }
        Insert: {
          bar_id?: string | null
          created_at?: string | null
          id?: string
          inventory_type: string
          lot_id?: string | null
          organization_id?: string | null
          quantity?: number | null
          reference_entity_id?: string | null
          reference_entity_type?: string | null
          reserved_by?: string | null
          status?: string | null
        }
        Update: {
          bar_id?: string | null
          created_at?: string | null
          id?: string
          inventory_type?: string
          lot_id?: string | null
          organization_id?: string | null
          quantity?: number | null
          reference_entity_id?: string | null
          reference_entity_type?: string | null
          reserved_by?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_reservations_bar_id_fkey"
            columns: ["bar_id"]
            isOneToOne: false
            referencedRelation: "inventory_bars"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_reservations_lot_id_fkey"
            columns: ["lot_id"]
            isOneToOne: false
            referencedRelation: "inventory_lots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_reservations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_reservations_reserved_by_fkey"
            columns: ["reserved_by"]
            isOneToOne: false
            referencedRelation: "users_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_items: {
        Row: {
          amount: number
          description: string
          id: string
          invoice_id: string | null
        }
        Insert: {
          amount: number
          description: string
          id?: string
          invoice_id?: string | null
        }
        Update: {
          amount?: number
          description?: string
          id?: string
          invoice_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          broker_id: string | null
          created_at: string | null
          currency: string | null
          document_id: string | null
          due_date: string | null
          id: string
          invoice_number: string
          organization_id: string | null
          status: string | null
          total_amount: number
          trade_id: string | null
        }
        Insert: {
          broker_id?: string | null
          created_at?: string | null
          currency?: string | null
          document_id?: string | null
          due_date?: string | null
          id?: string
          invoice_number: string
          organization_id?: string | null
          status?: string | null
          total_amount: number
          trade_id?: string | null
        }
        Update: {
          broker_id?: string | null
          created_at?: string | null
          currency?: string | null
          document_id?: string | null
          due_date?: string | null
          id?: string
          invoice_number?: string
          organization_id?: string | null
          status?: string | null
          total_amount?: number
          trade_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_broker_id_fkey"
            columns: ["broker_id"]
            isOneToOne: false
            referencedRelation: "brokers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "document_files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_trade_id_fkey"
            columns: ["trade_id"]
            isOneToOne: false
            referencedRelation: "trades"
            referencedColumns: ["id"]
          },
        ]
      }
      kyc_webhook_logs: {
        Row: {
          applicant_id: string | null
          event_type: string | null
          id: string
          payload: Json | null
          processed_at: string | null
        }
        Insert: {
          applicant_id?: string | null
          event_type?: string | null
          id?: string
          payload?: Json | null
          processed_at?: string | null
        }
        Update: {
          applicant_id?: string | null
          event_type?: string | null
          id?: string
          payload?: Json | null
          processed_at?: string | null
        }
        Relationships: []
      }
      live_prices: {
        Row: {
          currency: string | null
          id: string
          metal_id: string | null
          price_per_gram: number
          updated_at: string | null
        }
        Insert: {
          currency?: string | null
          id?: string
          metal_id?: string | null
          price_per_gram: number
          updated_at?: string | null
        }
        Update: {
          currency?: string | null
          id?: string
          metal_id?: string | null
          price_per_gram?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "live_prices_metal_id_fkey"
            columns: ["metal_id"]
            isOneToOne: false
            referencedRelation: "metals"
            referencedColumns: ["id"]
          },
        ]
      }
      metals: {
        Row: {
          id: string
          name: string
          symbol: string
        }
        Insert: {
          id: string
          name: string
          symbol: string
        }
        Update: {
          id?: string
          name?: string
          symbol?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          broker_id: string | null
          created_at: string | null
          created_by: string | null
          currency: string | null
          id: string
          organization_id: string | null
          quote_id: string | null
          status: Database["public"]["Enums"]["order_status"] | null
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          broker_id?: string | null
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          id?: string
          organization_id?: string | null
          quote_id?: string | null
          status?: Database["public"]["Enums"]["order_status"] | null
          total_amount: number
          updated_at?: string | null
        }
        Update: {
          broker_id?: string | null
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          id?: string
          organization_id?: string | null
          quote_id?: string | null
          status?: Database["public"]["Enums"]["order_status"] | null
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_broker_id_fkey"
            columns: ["broker_id"]
            isOneToOne: false
            referencedRelation: "brokers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      ownership_allocations: {
        Row: {
          allocated_by: string | null
          bar_id: string | null
          broker_id: string | null
          created_at: string | null
          id: string
          inventory_type: string
          lot_id: string | null
          quantity: number | null
          trade_id: string | null
        }
        Insert: {
          allocated_by?: string | null
          bar_id?: string | null
          broker_id?: string | null
          created_at?: string | null
          id?: string
          inventory_type: string
          lot_id?: string | null
          quantity?: number | null
          trade_id?: string | null
        }
        Update: {
          allocated_by?: string | null
          bar_id?: string | null
          broker_id?: string | null
          created_at?: string | null
          id?: string
          inventory_type?: string
          lot_id?: string | null
          quantity?: number | null
          trade_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ownership_allocations_allocated_by_fkey"
            columns: ["allocated_by"]
            isOneToOne: false
            referencedRelation: "users_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ownership_allocations_bar_id_fkey"
            columns: ["bar_id"]
            isOneToOne: false
            referencedRelation: "inventory_bars"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ownership_allocations_broker_id_fkey"
            columns: ["broker_id"]
            isOneToOne: false
            referencedRelation: "brokers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ownership_allocations_lot_id_fkey"
            columns: ["lot_id"]
            isOneToOne: false
            referencedRelation: "inventory_lots"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          broker_id: string | null
          confirmed_at: string | null
          confirmed_by: string | null
          created_at: string | null
          currency: string | null
          id: string
          invoice_id: string | null
          organization_id: string | null
          payment_method: string
          reference_number: string | null
          status: string | null
        }
        Insert: {
          amount: number
          broker_id?: string | null
          confirmed_at?: string | null
          confirmed_by?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          invoice_id?: string | null
          organization_id?: string | null
          payment_method: string
          reference_number?: string | null
          status?: string | null
        }
        Update: {
          amount?: number
          broker_id?: string | null
          confirmed_at?: string | null
          confirmed_by?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          invoice_id?: string | null
          organization_id?: string | null
          payment_method?: string
          reference_number?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_broker_id_fkey"
            columns: ["broker_id"]
            isOneToOne: false
            referencedRelation: "brokers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_confirmed_by_fkey"
            columns: ["confirmed_by"]
            isOneToOne: false
            referencedRelation: "users_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      permissions: {
        Row: {
          description: string | null
          id: string
          name: string
        }
        Insert: {
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      pos_payments: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          id: string
          payment_method: string
          reference_number: string | null
          sale_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          id?: string
          payment_method: string
          reference_number?: string | null
          sale_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          id?: string
          payment_method?: string
          reference_number?: string | null
          sale_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pos_payments_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "pos_sales"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_receipts: {
        Row: {
          document_id: string | null
          generated_at: string | null
          id: string
          receipt_number: string
          sale_id: string | null
        }
        Insert: {
          document_id?: string | null
          generated_at?: string | null
          id?: string
          receipt_number: string
          sale_id?: string | null
        }
        Update: {
          document_id?: string | null
          generated_at?: string | null
          id?: string
          receipt_number?: string
          sale_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pos_receipts_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "document_files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_receipts_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "pos_sales"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_returns: {
        Row: {
          approved_by: string | null
          created_at: string | null
          id: string
          original_sale_id: string | null
          reason: string | null
          return_amount: number
          session_id: string | null
        }
        Insert: {
          approved_by?: string | null
          created_at?: string | null
          id?: string
          original_sale_id?: string | null
          reason?: string | null
          return_amount: number
          session_id?: string | null
        }
        Update: {
          approved_by?: string | null
          created_at?: string | null
          id?: string
          original_sale_id?: string | null
          reason?: string | null
          return_amount?: number
          session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pos_returns_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "users_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_returns_original_sale_id_fkey"
            columns: ["original_sale_id"]
            isOneToOne: false
            referencedRelation: "pos_sales"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_returns_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "pos_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_sale_items: {
        Row: {
          custom_weight: number | null
          id: string
          inventory_bar_id: string | null
          making_charge: number | null
          metal_id: string | null
          price_per_gram: number
          product_id: string | null
          purity_grade_id: string | null
          sale_id: string | null
          total_price: number
        }
        Insert: {
          custom_weight?: number | null
          id?: string
          inventory_bar_id?: string | null
          making_charge?: number | null
          metal_id?: string | null
          price_per_gram: number
          product_id?: string | null
          purity_grade_id?: string | null
          sale_id?: string | null
          total_price: number
        }
        Update: {
          custom_weight?: number | null
          id?: string
          inventory_bar_id?: string | null
          making_charge?: number | null
          metal_id?: string | null
          price_per_gram?: number
          product_id?: string | null
          purity_grade_id?: string | null
          sale_id?: string | null
          total_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "pos_sale_items_inventory_bar_id_fkey"
            columns: ["inventory_bar_id"]
            isOneToOne: false
            referencedRelation: "inventory_bars"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_sale_items_metal_id_fkey"
            columns: ["metal_id"]
            isOneToOne: false
            referencedRelation: "metals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_sale_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_sale_items_purity_grade_id_fkey"
            columns: ["purity_grade_id"]
            isOneToOne: false
            referencedRelation: "purity_grades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_sale_items_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "pos_sales"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_sales: {
        Row: {
          broker_id: string | null
          created_at: string | null
          created_by: string | null
          currency: string | null
          customer_name: string | null
          discount: number | null
          id: string
          net_amount: number
          organization_id: string | null
          session_id: string | null
          status: string | null
          tax_amount: number | null
          total_amount: number
        }
        Insert: {
          broker_id?: string | null
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          customer_name?: string | null
          discount?: number | null
          id?: string
          net_amount: number
          organization_id?: string | null
          session_id?: string | null
          status?: string | null
          tax_amount?: number | null
          total_amount: number
        }
        Update: {
          broker_id?: string | null
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          customer_name?: string | null
          discount?: number | null
          id?: string
          net_amount?: number
          organization_id?: string | null
          session_id?: string | null
          status?: string | null
          tax_amount?: number | null
          total_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "pos_sales_broker_id_fkey"
            columns: ["broker_id"]
            isOneToOne: false
            referencedRelation: "brokers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_sales_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_sales_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_sales_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "pos_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_sessions: {
        Row: {
          actual_cash: number | null
          cashier_id: string | null
          closed_at: string | null
          closing_cash: number | null
          expected_cash: number | null
          id: string
          location_id: string | null
          opened_at: string | null
          opening_cash: number | null
          organization_id: string | null
          session_notes: string | null
          status: string | null
          variance: number | null
        }
        Insert: {
          actual_cash?: number | null
          cashier_id?: string | null
          closed_at?: string | null
          closing_cash?: number | null
          expected_cash?: number | null
          id?: string
          location_id?: string | null
          opened_at?: string | null
          opening_cash?: number | null
          organization_id?: string | null
          session_notes?: string | null
          status?: string | null
          variance?: number | null
        }
        Update: {
          actual_cash?: number | null
          cashier_id?: string | null
          closed_at?: string | null
          closing_cash?: number | null
          expected_cash?: number | null
          id?: string
          location_id?: string | null
          opened_at?: string | null
          opening_cash?: number | null
          organization_id?: string | null
          session_notes?: string | null
          status?: string | null
          variance?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pos_sessions_cashier_id_fkey"
            columns: ["cashier_id"]
            isOneToOne: false
            referencedRelation: "users_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_sessions_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "vault_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_sessions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      price_snapshots: {
        Row: {
          currency: string | null
          id: string
          metal_id: string | null
          price_per_gram: number
          snapshot_at: string | null
        }
        Insert: {
          currency?: string | null
          id?: string
          metal_id?: string | null
          price_per_gram: number
          snapshot_at?: string | null
        }
        Update: {
          currency?: string | null
          id?: string
          metal_id?: string | null
          price_per_gram?: number
          snapshot_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "price_snapshots_metal_id_fkey"
            columns: ["metal_id"]
            isOneToOne: false
            referencedRelation: "metals"
            referencedColumns: ["id"]
          },
        ]
      }
      product_categories: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          category_id: string | null
          id: string
          is_active: boolean | null
          metal_id: string | null
          name: string
          purity_grade_id: string | null
          weight_grams: number | null
        }
        Insert: {
          category_id?: string | null
          id?: string
          is_active?: boolean | null
          metal_id?: string | null
          name: string
          purity_grade_id?: string | null
          weight_grams?: number | null
        }
        Update: {
          category_id?: string | null
          id?: string
          is_active?: boolean | null
          metal_id?: string | null
          name?: string
          purity_grade_id?: string | null
          weight_grams?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_metal_id_fkey"
            columns: ["metal_id"]
            isOneToOne: false
            referencedRelation: "metals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_purity_grade_id_fkey"
            columns: ["purity_grade_id"]
            isOneToOne: false
            referencedRelation: "purity_grades"
            referencedColumns: ["id"]
          },
        ]
      }
      purity_grades: {
        Row: {
          id: string
          metal_id: string | null
          name: string
          purity: number
        }
        Insert: {
          id: string
          metal_id?: string | null
          name: string
          purity: number
        }
        Update: {
          id?: string
          metal_id?: string | null
          name?: string
          purity?: number
        }
        Relationships: [
          {
            foreignKeyName: "purity_grades_metal_id_fkey"
            columns: ["metal_id"]
            isOneToOne: false
            referencedRelation: "metals"
            referencedColumns: ["id"]
          },
        ]
      }
      qabd_evidence: {
        Row: {
          created_at: string | null
          document_id: string | null
          evidence_type: string
          id: string
          trade_id: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          created_at?: string | null
          document_id?: string | null
          evidence_type: string
          id?: string
          trade_id?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          created_at?: string | null
          document_id?: string | null
          evidence_type?: string
          id?: string
          trade_id?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "qabd_evidence_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "document_files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "qabd_evidence_trade_id_fkey"
            columns: ["trade_id"]
            isOneToOne: false
            referencedRelation: "trades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "qabd_evidence_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "users_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      quotes: {
        Row: {
          approved_by: string | null
          base_metal_value: number | null
          broker_id: string | null
          broker_user_id: string | null
          created_at: string | null
          created_by: string | null
          currency: string | null
          expiry_timestamp: string | null
          fee_applied: number | null
          id: string
          making_charge: number | null
          metal_id: string | null
          organization_id: string | null
          premium_applied: number | null
          price_snapshot_id: string | null
          purity_grade_id: string | null
          spread_applied: number | null
          status: Database["public"]["Enums"]["quote_status"] | null
          tax_placeholder: number | null
          total_price: number
          updated_at: string | null
          validity_seconds: number | null
          weight_grams: number
        }
        Insert: {
          approved_by?: string | null
          base_metal_value?: number | null
          broker_id?: string | null
          broker_user_id?: string | null
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          expiry_timestamp?: string | null
          fee_applied?: number | null
          id?: string
          making_charge?: number | null
          metal_id?: string | null
          organization_id?: string | null
          premium_applied?: number | null
          price_snapshot_id?: string | null
          purity_grade_id?: string | null
          spread_applied?: number | null
          status?: Database["public"]["Enums"]["quote_status"] | null
          tax_placeholder?: number | null
          total_price: number
          updated_at?: string | null
          validity_seconds?: number | null
          weight_grams: number
        }
        Update: {
          approved_by?: string | null
          base_metal_value?: number | null
          broker_id?: string | null
          broker_user_id?: string | null
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          expiry_timestamp?: string | null
          fee_applied?: number | null
          id?: string
          making_charge?: number | null
          metal_id?: string | null
          organization_id?: string | null
          premium_applied?: number | null
          price_snapshot_id?: string | null
          purity_grade_id?: string | null
          spread_applied?: number | null
          status?: Database["public"]["Enums"]["quote_status"] | null
          tax_placeholder?: number | null
          total_price?: number
          updated_at?: string | null
          validity_seconds?: number | null
          weight_grams?: number
        }
        Relationships: [
          {
            foreignKeyName: "quotes_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "users_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_broker_id_fkey"
            columns: ["broker_id"]
            isOneToOne: false
            referencedRelation: "brokers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_broker_user_id_fkey"
            columns: ["broker_user_id"]
            isOneToOne: false
            referencedRelation: "users_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_metal_id_fkey"
            columns: ["metal_id"]
            isOneToOne: false
            referencedRelation: "metals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_price_snapshot_id_fkey"
            columns: ["price_snapshot_id"]
            isOneToOne: false
            referencedRelation: "price_snapshots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_purity_grade_id_fkey"
            columns: ["purity_grade_id"]
            isOneToOne: false
            referencedRelation: "purity_grades"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          permission_id: string
          role_id: string
        }
        Insert: {
          permission_id: string
          role_id: string
        }
        Update: {
          permission_id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          description: string | null
          id: string
          name: Database["public"]["Enums"]["user_role_enum"]
        }
        Insert: {
          description?: string | null
          id?: string
          name: Database["public"]["Enums"]["user_role_enum"]
        }
        Update: {
          description?: string | null
          id?: string
          name?: Database["public"]["Enums"]["user_role_enum"]
        }
        Relationships: []
      }
      settlements: {
        Row: {
          broker_id: string | null
          created_at: string | null
          currency: string | null
          id: string
          organization_id: string | null
          settled_at: string | null
          status: string | null
          total_amount: number
        }
        Insert: {
          broker_id?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          organization_id?: string | null
          settled_at?: string | null
          status?: string | null
          total_amount: number
        }
        Update: {
          broker_id?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          organization_id?: string | null
          settled_at?: string | null
          status?: string | null
          total_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "settlements_broker_id_fkey"
            columns: ["broker_id"]
            isOneToOne: false
            referencedRelation: "brokers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "settlements_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      sharia_trade_checks: {
        Row: {
          created_at: string | null
          custody_evidence_generated: boolean | null
          id: string
          no_derivative_flag: boolean | null
          no_margin_flag: boolean | null
          payment_confirmed: boolean | null
          physical_inventory_exists: boolean | null
          price_snapshot_valid: boolean | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
          trade_id: string | null
        }
        Insert: {
          created_at?: string | null
          custody_evidence_generated?: boolean | null
          id?: string
          no_derivative_flag?: boolean | null
          no_margin_flag?: boolean | null
          payment_confirmed?: boolean | null
          physical_inventory_exists?: boolean | null
          price_snapshot_valid?: boolean | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          trade_id?: string | null
        }
        Update: {
          created_at?: string | null
          custody_evidence_generated?: boolean | null
          id?: string
          no_derivative_flag?: boolean | null
          no_margin_flag?: boolean | null
          payment_confirmed?: boolean | null
          physical_inventory_exists?: boolean | null
          price_snapshot_valid?: boolean | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          trade_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sharia_trade_checks_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "users_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sharia_trade_checks_trade_id_fkey"
            columns: ["trade_id"]
            isOneToOne: false
            referencedRelation: "trades"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          contact_info: string | null
          id: string
          name: string
          organization_id: string | null
        }
        Insert: {
          contact_info?: string | null
          id?: string
          name: string
          organization_id?: string | null
        }
        Update: {
          contact_info?: string | null
          id?: string
          name?: string
          organization_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "suppliers_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      system_settings: {
        Row: {
          id: string
          organization_id: string | null
          setting_key: string
          setting_value: Json | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          id?: string
          organization_id?: string | null
          setting_key: string
          setting_value?: Json | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          id?: string
          organization_id?: string | null
          setting_key?: string
          setting_value?: Json | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "system_settings_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "system_settings_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      trade_events: {
        Row: {
          created_at: string | null
          event_type: string
          id: string
          new_status: Database["public"]["Enums"]["trade_status"] | null
          notes: string | null
          old_status: Database["public"]["Enums"]["trade_status"] | null
          trade_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_type: string
          id?: string
          new_status?: Database["public"]["Enums"]["trade_status"] | null
          notes?: string | null
          old_status?: Database["public"]["Enums"]["trade_status"] | null
          trade_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_type?: string
          id?: string
          new_status?: Database["public"]["Enums"]["trade_status"] | null
          notes?: string | null
          old_status?: Database["public"]["Enums"]["trade_status"] | null
          trade_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trade_events_trade_id_fkey"
            columns: ["trade_id"]
            isOneToOne: false
            referencedRelation: "trades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trade_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      trades: {
        Row: {
          broker_id: string | null
          created_by: string | null
          currency: string | null
          execution_time: string | null
          id: string
          metal_id: string | null
          order_id: string | null
          organization_id: string | null
          status: Database["public"]["Enums"]["trade_status"] | null
          total_price: number
          updated_at: string | null
          weight_grams: number
        }
        Insert: {
          broker_id?: string | null
          created_by?: string | null
          currency?: string | null
          execution_time?: string | null
          id?: string
          metal_id?: string | null
          order_id?: string | null
          organization_id?: string | null
          status?: Database["public"]["Enums"]["trade_status"] | null
          total_price: number
          updated_at?: string | null
          weight_grams: number
        }
        Update: {
          broker_id?: string | null
          created_by?: string | null
          currency?: string | null
          execution_time?: string | null
          id?: string
          metal_id?: string | null
          order_id?: string | null
          organization_id?: string | null
          status?: Database["public"]["Enums"]["trade_status"] | null
          total_price?: number
          updated_at?: string | null
          weight_grams?: number
        }
        Relationships: [
          {
            foreignKeyName: "trades_broker_id_fkey"
            columns: ["broker_id"]
            isOneToOne: false
            referencedRelation: "brokers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trades_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trades_metal_id_fkey"
            columns: ["metal_id"]
            isOneToOne: false
            referencedRelation: "metals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trades_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trades_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          role_id: string
          user_id: string
        }
        Insert: {
          role_id: string
          user_id: string
        }
        Update: {
          role_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      users_profile: {
        Row: {
          created_at: string | null
          email: string | null
          first_name: string | null
          id: string
          is_active: boolean | null
          kyc_applicant_id: string | null
          kyc_status: string | null
          kyc_verified_at: string | null
          last_name: string | null
          organization_id: string | null
          role: Database["public"]["Enums"]["user_role_enum"]
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id: string
          is_active?: boolean | null
          kyc_applicant_id?: string | null
          kyc_status?: string | null
          kyc_verified_at?: string | null
          last_name?: string | null
          organization_id?: string | null
          role?: Database["public"]["Enums"]["user_role_enum"]
        }
        Update: {
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          is_active?: boolean | null
          kyc_applicant_id?: string | null
          kyc_status?: string | null
          kyc_verified_at?: string | null
          last_name?: string | null
          organization_id?: string | null
          role?: Database["public"]["Enums"]["user_role_enum"]
        }
        Relationships: [
          {
            foreignKeyName: "users_profile_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      vault_locations: {
        Row: {
          description: string | null
          id: string
          name: string
          vault_id: string | null
        }
        Insert: {
          description?: string | null
          id?: string
          name: string
          vault_id?: string | null
        }
        Update: {
          description?: string | null
          id?: string
          name?: string
          vault_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vault_locations_vault_id_fkey"
            columns: ["vault_id"]
            isOneToOne: false
            referencedRelation: "vaults"
            referencedColumns: ["id"]
          },
        ]
      }
      vaults: {
        Row: {
          id: string
          location: string | null
          name: string
          organization_id: string | null
        }
        Insert: {
          id?: string
          location?: string | null
          name: string
          organization_id?: string | null
        }
        Update: {
          id?: string
          location?: string | null
          name?: string
          organization_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vaults_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      business_dashboard: {
        Row: {
          pending_payment_amount: number | null
          sales_this_month: number | null
          sales_today: number | null
        }
        Relationships: []
      }
      compliance_dashboard: {
        Row: {
          active_holds: number | null
          open_aml_alerts: number | null
          open_compliance_cases: number | null
        }
        Relationships: []
      }
      inventory_dashboard: {
        Row: {
          metal_id: string | null
          total_allocated_grams: number | null
          total_available_grams: number | null
          total_reserved_grams: number | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_bars_metal_id_fkey"
            columns: ["metal_id"]
            isOneToOne: false
            referencedRelation: "metals"
            referencedColumns: ["id"]
          },
        ]
      }
      net_exposure: {
        Row: {
          hedged_short_grams: number | null
          metal_id: string | null
          net_exposure_grams: number | null
          physical_held_grams: number | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_bars_metal_id_fkey"
            columns: ["metal_id"]
            isOneToOne: false
            referencedRelation: "metals"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      user_broker_id: { Args: never; Returns: string }
      user_organization_id: { Args: never; Returns: string }
      user_role: {
        Args: never
        Returns: Database["public"]["Enums"]["user_role_enum"]
      }
    }
    Enums: {
      approval_status: "pending" | "approved" | "rejected" | "cancelled"
      compliance_status:
        | "clear"
        | "pending_review"
        | "enhanced_due_diligence"
        | "held"
        | "rejected"
        | "frozen"
      hedge_direction: "short" | "long"
      hedge_order_status:
        | "pending"
        | "partial_fill"
        | "filled"
        | "failed"
        | "cancelled"
      inventory_status:
        | "available"
        | "reserved"
        | "allocated"
        | "delivered"
        | "damaged"
        | "frozen"
        | "under_review"
      movement_type:
        | "received"
        | "transferred"
        | "reserved"
        | "released"
        | "allocated"
        | "delivered"
        | "adjusted"
        | "frozen"
        | "unfrozen"
        | "returned"
      order_status:
        | "draft"
        | "pending_quote"
        | "pending_approval"
        | "pending_payment"
        | "payment_confirmed"
        | "pending_inventory_allocation"
        | "completed"
        | "cancelled"
        | "rejected"
        | "disputed"
      quote_status:
        | "draft"
        | "requested"
        | "priced"
        | "pending_dealer_approval"
        | "sent_to_broker"
        | "accepted"
        | "expired"
        | "rejected"
        | "cancelled"
      trade_status:
        | "created"
        | "inventory_reserved"
        | "payment_pending"
        | "payment_confirmed"
        | "inventory_allocated"
        | "custody_issued"
        | "completed"
        | "reversed"
        | "cancelled"
      user_role_enum:
        | "super_admin"
        | "admin"
        | "dealer"
        | "broker"
        | "compliance_officer"
        | "inventory_manager"
        | "finance_manager"
        | "cashier_pos"
        | "viewer"
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
    Enums: {
      approval_status: ["pending", "approved", "rejected", "cancelled"],
      compliance_status: [
        "clear",
        "pending_review",
        "enhanced_due_diligence",
        "held",
        "rejected",
        "frozen",
      ],
      hedge_direction: ["short", "long"],
      hedge_order_status: [
        "pending",
        "partial_fill",
        "filled",
        "failed",
        "cancelled",
      ],
      inventory_status: [
        "available",
        "reserved",
        "allocated",
        "delivered",
        "damaged",
        "frozen",
        "under_review",
      ],
      movement_type: [
        "received",
        "transferred",
        "reserved",
        "released",
        "allocated",
        "delivered",
        "adjusted",
        "frozen",
        "unfrozen",
        "returned",
      ],
      order_status: [
        "draft",
        "pending_quote",
        "pending_approval",
        "pending_payment",
        "payment_confirmed",
        "pending_inventory_allocation",
        "completed",
        "cancelled",
        "rejected",
        "disputed",
      ],
      quote_status: [
        "draft",
        "requested",
        "priced",
        "pending_dealer_approval",
        "sent_to_broker",
        "accepted",
        "expired",
        "rejected",
        "cancelled",
      ],
      trade_status: [
        "created",
        "inventory_reserved",
        "payment_pending",
        "payment_confirmed",
        "inventory_allocated",
        "custody_issued",
        "completed",
        "reversed",
        "cancelled",
      ],
      user_role_enum: [
        "super_admin",
        "admin",
        "dealer",
        "broker",
        "compliance_officer",
        "inventory_manager",
        "finance_manager",
        "cashier_pos",
        "viewer",
      ],
    },
  },
} as const
