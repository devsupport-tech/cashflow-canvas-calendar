
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Supabase client setup
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase;

if (!supabaseUrl || !supabaseAnonKey) {
  // Create a mock Supabase client that will prevent crashes but won't actually connect
  console.warn('Supabase credentials missing. Using mock client. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables to connect to Supabase.');
  
  // Simple mock data for user simulation
  const mockUserData = {
    id: 'mock-user-id-123',
    email: '',
    name: '',
    created_at: new Date().toISOString(),
  };
  
  let mockSession = null;
  let mockUser = null;
  let mockProfiles = [];
  
  // Create a proxy object that will return mock implementations for Supabase methods
  supabase = new Proxy({}, {
    get: function(target, prop) {
      // Return a function that resolves with mock data for any method called
      if (typeof prop === 'string') {
        // If it's the auth property, return an object with auth methods
        if (prop === 'auth') {
          return {
            signInWithPassword: ({ email, password }) => {
              console.log('Mock login with:', email);
              
              // Basic validation
              if (!email || !password) {
                return Promise.resolve({
                  data: { user: null, session: null },
                  error: { message: 'Email and password are required' }
                });
              }
              
              // Create mock user and session
              mockUser = {
                id: 'mock-user-id-123',
                email: email,
                user_metadata: {}
              };
              
              mockSession = {
                user: mockUser,
                access_token: 'mock-token',
                refresh_token: 'mock-refresh',
                expires_at: Date.now() + 3600,
                token_type: 'bearer'
              };
              
              // Create mock profile if it doesn't exist
              const existingProfile = mockProfiles.find(p => p.email === email);
              if (!existingProfile) {
                mockProfiles.push({
                  id: mockUser.id,
                  email: email,
                  name: email.split('@')[0],
                  avatar_url: null,
                  created_at: new Date().toISOString()
                });
              }
              
              return Promise.resolve({ data: { user: mockUser, session: mockSession }, error: null });
            },
            signUp: ({ email, password }) => {
              console.log('Mock signup with:', email);
              
              // Basic validation
              if (!email || !password) {
                return Promise.resolve({
                  data: { user: null, session: null },
                  error: { message: 'Email and password are required' }
                });
              }
              
              // Create mock user
              mockUser = {
                id: 'mock-user-id-' + Date.now(),
                email: email,
                user_metadata: {}
              };
              
              return Promise.resolve({ data: { user: mockUser, session: null }, error: null });
            },
            signOut: () => {
              console.log('Mock signout');
              mockUser = null;
              mockSession = null;
              return Promise.resolve({ error: null });
            },
            getSession: () => {
              return Promise.resolve({ data: { session: mockSession }, error: null });
            },
            getUser: () => {
              return Promise.resolve({ data: { user: mockUser }, error: null });
            },
            resetPasswordForEmail: (email) => {
              console.log('Mock password reset for:', email);
              return Promise.resolve({ error: null });
            },
            onAuthStateChange: (callback) => {
              // Call the callback once with current state to simulate initial auth state check
              setTimeout(() => {
                callback(
                  mockSession ? 'SIGNED_IN' : 'SIGNED_OUT', 
                  { user: mockUser, session: mockSession }
                );
              }, 100);
              
              // Return a mock subscription object
              return {
                data: { subscription: { unsubscribe: () => {} } }
              };
            }
          };
        }
        
        // Mock database operations
        if (prop === 'from') {
          return (table) => {
            return {
              select: (columns) => {
                const query = {
                  eq: (column, value) => {
                    if (table === 'user_profiles' && mockUser) {
                      const profile = mockProfiles.find(p => p.id === value);
                      return {
                        single: () => {
                          return Promise.resolve({ 
                            data: profile || { 
                              id: mockUser.id,
                              name: mockUser.email?.split('@')[0] || '',
                              email: mockUser.email,
                              avatar_url: null
                            }, 
                            error: null 
                          });
                        }
                      };
                    }
                    return {
                      single: () => Promise.resolve({ data: null, error: null }),
                      order: () => ({
                        limit: () => Promise.resolve({ data: [], error: null })
                      }),
                    };
                  },
                  order: () => ({
                    limit: () => Promise.resolve({ data: [], error: null })
                  }),
                };
                return query;
              },
              insert: (data) => {
                if (table === 'user_profiles' && data) {
                  mockProfiles.push(data);
                }
                return Promise.resolve({ data, error: null });
              },
              update: (data) => {
                return {
                  eq: (column, value) => {
                    if (table === 'user_profiles' && mockProfiles.length > 0) {
                      const profileIndex = mockProfiles.findIndex(p => p.id === value);
                      if (profileIndex >= 0) {
                        mockProfiles[profileIndex] = { ...mockProfiles[profileIndex], ...data };
                      }
                    }
                    return Promise.resolve({ data, error: null });
                  }
                };
              },
              delete: () => ({
                eq: () => Promise.resolve({ data: null, error: null })
              })
            };
          };
        }
        
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
