import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Supabase client setup with proper error handling
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Configuration validation
const isConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isConfigured) {
  console.error('❌ Supabase configuration missing!');
  console.error('Please set the following environment variables:');
  console.error('- VITE_SUPABASE_URL');
  console.error('- VITE_SUPABASE_ANON_KEY');
  console.warn('🔄 Using mock Supabase client for demonstration purposes');
}

// Create the Supabase client
const supabase = isConfigured
  ? createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce'
      },
      global: {
        headers: {
          'X-Client-Info': 'cashflow-canvas-calendar@1.0.0'
        }
      }
    })
  : createMockSupabaseClient();

// Mock client for development/demo purposes
function createMockSupabaseClient(): any {
  console.warn('🔄 Using mock Supabase client for demonstration purposes');

  // Mock data storage
  let mockUser: any = null;
  let mockSession: any = null;
  const mockData: Record<string, any[]> = {
    transactions: [],
    budgets: [],
    accounts: [],
    businesses: [],
    profiles: []
  };

  // Create a proxy object that will return mock implementations for Supabase methods
  return new Proxy({}, {
    get: function(target: any, prop: string | symbol) {
      if (typeof prop === 'string') {
        // Auth methods
        if (prop === 'auth') {
          return {
            signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
              console.log('🔐 Mock login with:', email);

              if (!email || !password) {
                return {
                  data: { user: null, session: null },
                  error: { message: 'Email and password are required' }
                };
              }

              mockUser = {
                id: 'demo-user-123',
                email: email,
                user_metadata: { name: 'Demo User' }
              };

              mockSession = {
                access_token: 'mock-access-token',
                refresh_token: 'mock-refresh-token',
                expires_in: 3600,
                token_type: 'bearer',
                user: mockUser
              };

              return {
                data: { user: mockUser, session: mockSession },
                error: null
              };
            },

            signUp: async ({ email, password, options }: any) => {
              console.log('📝 Mock signup with:', email);

              if (!email || !password) {
                return {
                  data: { user: null, session: null },
                  error: { message: 'Email and password are required' }
                };
              }

              const newUser = {
                id: 'mock-new-user-' + Date.now(),
                email: email,
                user_metadata: options?.data || {}
              };

              mockData.profiles.push({
                id: newUser.id,
                email: email,
                name: options?.data?.name || '',
                created_at: new Date().toISOString()
              });

              return {
                data: { user: newUser, session: null },
                error: null
              };
            },

            signOut: async () => {
              console.log('🚪 Mock signout');
              mockUser = null;
              mockSession = null;
              return { error: null };
            },

            resetPasswordForEmail: async (email: string) => {
              console.log('🔑 Mock password reset for:', email);
              return { data: {}, error: null };
            },

            getUser: async () => {
              return {
                data: { user: mockUser },
                error: null
              };
            },

            getSession: async () => {
              return {
                data: { session: mockSession },
                error: null
              };
            },

            onAuthStateChange: (callback: any) => {
              // Simulate auth state changes
              setTimeout(() => {
                if (mockSession) {
                  callback('SIGNED_IN', mockSession);
                } else {
                  callback('SIGNED_OUT', null);
                }
              }, 100);

              return {
                data: { subscription: { unsubscribe: () => {} } },
                error: null
              };
            }
          };
        }

        // Database operations
        if (prop === 'from') {
          return (tableName: string) => {
            return {
              select: (columns = '*') => {
                const chainable = {
                  eq: (column: string, value: any) => ({
                    ...chainable,
                    then: (resolve: any) => resolve({
                      data: mockData[tableName] || [],
                      error: null
                    })
                  }),
                  then: (resolve: any) => resolve({
                    data: mockData[tableName] || [],
                    error: null
                  })
                };
                return chainable;
              },
              insert: (data: any) => ({
                then: (resolve: any) => {
                  const newItem = { ...data, id: Date.now().toString(), created_at: new Date().toISOString() };
                  if (!mockData[tableName]) mockData[tableName] = [];
                  mockData[tableName].push(newItem);
                  console.log(`📝 Mock insert into ${tableName}:`, newItem);
                  resolve({ data: [newItem], error: null });
                }
              }),
              update: (data: any) => ({
                eq: (column: string, value: any) => ({
                  then: (resolve: any) => {
                    console.log(`✏️ Mock update in ${tableName}:`, data);
                    resolve({ data: [data], error: null });
                  }
                })
              }),
              delete: () => ({
                eq: (column: string, value: any) => ({
                  then: (resolve: any) => {
                    console.log(`🗑️ Mock delete from ${tableName}`);
                    resolve({ data: [], error: null });
                  }
                })
              })
            };
          };
        }

        // Return a generic promise for any other method
        return () => Promise.resolve({
          data: [],
          error: null,
          count: null,
          status: 200,
          statusText: 'OK'
        });
      }
      return undefined;
    }
  });
}

// Export configuration status for components to check
export const isSupabaseConfigured = isConfigured;
export { supabase };
