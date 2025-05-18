
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Supabase client setup
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase;

if (!supabaseUrl || !supabaseAnonKey) {
  // Create a mock Supabase client that will prevent crashes but won't actually connect
  console.warn('Supabase credentials missing. Using mock client. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables to connect to Supabase.');
  
  // Create a proxy object that will return mock implementations for Supabase methods
  supabase = new Proxy({}, {
    get: function(target, prop) {
      // Return a function that resolves with empty data for any method called
      if (typeof prop === 'string') {
        return function() {
          // If it's an authentication method
          if (prop.startsWith('auth')) {
            return {
              data: { user: null, session: null },
              error: null
            };
          }
          
          // For database operations
          return Promise.resolve({
            data: [],
            error: null,
            count: null,
            status: 200,
            statusText: 'OK'
          });
        };
      }
      return undefined;
    }
  });
} else {
  // Create the real Supabase client
  supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
}

export { supabase };
