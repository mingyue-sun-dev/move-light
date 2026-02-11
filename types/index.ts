import type { User as SupabaseUser } from "@supabase/supabase-js";

export type User = SupabaseUser;

export interface Category {
  id: string;
  user_id: string;
  name: string;
  color: string;
  created_at: string;
}

export interface Item {
  id: string;
  user_id: string;
  name: string;
  category_id: string;
  is_essential: boolean;
  weight_grams: number;
  tags: string[];
  last_used_at: string | null;
  notes: string | null;
  created_at: string;
  category?: Category;
}

export interface PackingResult {
  packed: Item[];
  overflow: Item[];
  essentialCoverage: number;
}
