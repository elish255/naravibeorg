export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  __InternalSupabase: { PostgrestVersion: "14.17" };
  public: {
    Tables: {
      profiles: {
        Row: { id: string; full_name: string; username: string; phone: string; country: string; has_paid: boolean; created_at: string; updated_at: string };
        Insert: { id: string; full_name?: string; username: string; phone?: string; country?: string; has_paid?: boolean; created_at?: string; updated_at?: string };
        Update: { id?: string; full_name?: string; username?: string; phone?: string; country?: string; has_paid?: boolean; created_at?: string; updated_at?: string };
        Relationships: [];
      };
      payments: {
        Row: { id: string; user_id: string; phone: string; payment_phone: string | null; amount: number; currency: string; order_id: string | null; reference: string | null; status: string; transid: string | null; verified_at: string | null; verified_by: string | null; created_at: string; updated_at: string };
        Insert: { id?: string; user_id: string; phone: string; payment_phone?: string | null; amount: number; currency?: string; order_id?: string | null; reference?: string | null; status?: string; transid?: string | null; verified_at?: string | null; verified_by?: string | null; created_at?: string; updated_at?: string };
        Update: { id?: string; user_id?: string; phone?: string; payment_phone?: string | null; amount?: number; currency?: string; order_id?: string | null; reference?: string | null; status?: string; transid?: string | null; verified_at?: string | null; verified_by?: string | null; created_at?: string; updated_at?: string };
        Relationships: [];
      };
      admin_notifications: {
        Row: { id: string; payment_id: string | null; user_id: string | null; type: string; message: string | null; read_at: string | null; created_at: string };
        Insert: { id?: string; payment_id?: string | null; user_id?: string | null; type?: string; message?: string | null; read_at?: string | null; created_at?: string };
        Update: { id?: string; payment_id?: string | null; user_id?: string | null; type?: string; message?: string | null; read_at?: string | null; created_at?: string };
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;
type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];
export type Tables<T extends keyof DefaultSchema["Tables"]> = DefaultSchema["Tables"][T]["Row"];
export type TablesInsert<T extends keyof DefaultSchema["Tables"]> = DefaultSchema["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof DefaultSchema["Tables"]> = DefaultSchema["Tables"][T]["Update"];
export type Enums<T extends keyof DefaultSchema["Enums"]> = DefaultSchema["Enums"][T];
export const Constants = { public: { Enums: {} } } as const;
