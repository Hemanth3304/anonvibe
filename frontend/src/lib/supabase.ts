import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string | null;
          purpose: string | null;
          interests: string[] | null;
          languages: string[] | null;
          location_geohash: string | null;
          avatar_url: string | null;
          onboarding_step: number;
          created_at: string;
        };
        Insert: {
          id: string;
          username?: string | null;
          purpose?: string | null;
          interests?: string[] | null;
          languages?: string[] | null;
          location_geohash?: string | null;
          avatar_url?: string | null;
          onboarding_step?: number;
        };
        Update: {
          username?: string | null;
          purpose?: string | null;
          interests?: string[] | null;
          languages?: string[] | null;
          location_geohash?: string | null;
          avatar_url?: string | null;
          onboarding_step?: number;
        };
      };
    };
  };
};
