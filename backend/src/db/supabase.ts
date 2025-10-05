import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

// Configuration Supabase
const supabaseUrl = process.env.SUPABASE_URL || 'https://demo.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'demo-key';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'demo-service-key';

// Mode démo - pas d'erreur si les clés ne sont pas configurées
console.warn('⚠️  Mode démo activé - Configurez vos clés Supabase pour la production');

// Client Supabase pour les opérations publiques
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client Supabase avec service role pour les opérations administratives
export const supabaseAdmin = createClient(
  supabaseUrl, 
  supabaseServiceRoleKey || supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Fonction utilitaire pour tester la connexion
export const testSupabaseConnection = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error && error.code !== 'PGRST116') { // PGRST116 = table doesn't exist (normal au début)
      console.error('Erreur de connexion Supabase:', error);
      return false;
    }
    
    console.log('✅ Connexion Supabase établie avec succès');
    return true;
  } catch (error) {
    console.error('❌ Erreur lors du test de connexion Supabase:', error);
    return false;
  }
};

// Fonction pour exécuter des requêtes SQL brutes (utile pour les migrations)
export const executeSQL = async (sql: string): Promise<any> => {
  try {
    const { data, error } = await supabaseAdmin.rpc('exec_sql', { sql_query: sql });
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Erreur lors de l\'exécution SQL:', error);
    throw error;
  }
};

export default supabase;
