import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      books: {
        Row: {
          id: string;
          title: string;
          author: string;
          description: string | null;
          genre: string | null;
          condition: 'excellent' | 'good' | 'fair' | 'poor';
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          author: string;
          description?: string | null;
          genre?: string | null;
          condition: 'excellent' | 'good' | 'fair' | 'poor';
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          author?: string;
          description?: string | null;
          genre?: string | null;
          condition?: 'excellent' | 'good' | 'fair' | 'poor';
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};