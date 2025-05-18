
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
        // If it's the auth property, return an object with auth methods
        if (prop === 'auth') {
          return {
            signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: null }),
            signUp: () => Promise.resolve({ data: { user: null, session: null }, error: null }),
            signOut: () => Promise.resolve({ error: null }),
            getSession: () => Promise.resolve({ data: { session: null }, error: null }),
            getUser: () => Promise.resolve({ data: { user: null }, error: null }),
            resetPasswordForEmail: () => Promise.resolve({ error: null }),
            onAuthStateChange: (callback) => {
              // Return a mock subscription object
              return {
                subscription: {
                  unsubscribe: () => {}
                },
                data: { subscription: { unsubscribe: () => {} } }
              };
            }
          };
        }
        
        // For other Supabase methods, return a function that can be chained
        return function() {
          return {
            from: () => ({
              select: () => ({
                eq: () => ({
                  single: () => Promise.resolve({ data: null, error: null }),
                  order: () => ({
                    limit: () => Promise.resolve({ data: [], error: null })
                  }),
                }),
                order: () => ({
                  limit: () => Promise.resolve({ data: [], error: null })
                }),
              }),
              insert: () => Promise.resolve({ data: null, error: null }),
              update: () => ({
                eq: () => Promise.resolve({ data: null, error: null })
              }),
              delete: () => ({
                eq: () => Promise.resolve({ data: null, error: null })
              })
            }),
            storage: () => ({
              from: () => ({
                upload: () => Promise.resolve({ data: null, error: null }),
                getPublicUrl: () => ({ data: { publicUrl: '' } })
              })
            }),
            data: [],
            error: null,
            count: null,
            status: 200,
            statusText: 'OK'
          };
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
