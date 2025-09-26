import { createClient } from '@supabase/supabase-js';
import { logApiRequest, logApiResponse, logApiError } from './utils/logger'; // Import logger

// Read Supabase credentials from environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Basic check to ensure variables are loaded
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is missing. Make sure you have a .env file set up with REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY.');
  // Optionally throw an error or handle this case appropriately
}

// Create the original Supabase client
const originalSupabase = createClient(supabaseUrl, supabaseAnonKey);

// Proxy handler to intercept and log Supabase calls
const supabaseProxyHandler = {
  get(target, propKey, receiver) {
    const originalValue = Reflect.get(target, propKey, receiver);

    // If the property is a function (like 'from', 'auth', 'rpc', etc.), wrap it
    if (typeof originalValue === 'function') {
      return (...args) => {
        // Log the initial call (e.g., supabase.from('users'))
        logApiRequest('Supabase', propKey, typeof args[0] === 'string' ? args[0] : 'params', args);

        const result = originalValue.apply(target, args);

        // If the result is chainable (like a query builder), wrap it too
        if (result && typeof result === 'object' && typeof result.then !== 'function') { // Check if it's not a promise yet
          // Recursively apply the proxy to the chained object
          return new Proxy(result, createChainableProxyHandler(propKey, args[0] || ''));
        }

        // If the result is a promise (end of the chain), log its resolution/rejection
        if (result && typeof result.then === 'function') {
          return result.then(
            (response) => {
              // Supabase often returns { data, error }
              if (response && (response.data !== undefined || response.error !== undefined)) {
                if (response.error) {
                  logApiError('Supabase', propKey, typeof args[0] === 'string' ? args[0] : 'params', response.error);
                } else {
                  logApiResponse('Supabase', propKey, typeof args[0] === 'string' ? args[0] : 'params', 'Success', response.data);
                }
              } else {
                // Handle other types of responses (e.g., auth responses)
                 logApiResponse('Supabase', propKey, typeof args[0] === 'string' ? args[0] : 'params', 'Success', response);
              }
              return response;
            },
            (error) => {
              logApiError('Supabase', propKey, typeof args[0] === 'string' ? args[0] : 'params', error);
              throw error; // Re-throw the error after logging
            }
          );
        }

        // Return non-function properties or non-thenable results directly
        return result;
      };
    }

    // For non-function properties (like 'auth' object), return a proxy if it's an object
     if (typeof originalValue === 'object' && originalValue !== null) {
       // Apply proxy recursively to nested objects like 'auth'
       return new Proxy(originalValue, supabaseProxyHandler);
     }

    // Return primitive properties directly
    return originalValue;
  },
};

// Helper to create proxy handlers for chainable methods (like .select(), .insert(), .update())
const createChainableProxyHandler = (parentMethod, targetName) => {
  return {
    get(target, propKey, receiver) {
      const originalValue = Reflect.get(target, propKey, receiver);

      if (typeof originalValue === 'function') {
        return (...args) => {
          // Log the chained call (e.g., .select('*'))
          const action = `${parentMethod}(${targetName}).${propKey}`;
           logApiRequest('Supabase', action, 'args', args);

          const result = originalValue.apply(target, args);

          // If the result is still chainable, wrap it again
          if (result && typeof result === 'object' && typeof result.then !== 'function') {
            return new Proxy(result, createChainableProxyHandler(action, '')); // Continue chaining
          }

          // If it's the end of the chain (a promise), log the outcome
          if (result && typeof result.then === 'function') {
            return result.then(
              (response) => {
                 if (response && (response.data !== undefined || response.error !== undefined)) {
                   if (response.error) {
                     logApiError('Supabase', action, 'result', response.error);
                   } else {
                     logApiResponse('Supabase', action, 'result', 'Success', response.data);
                   }
                 } else {
                    logApiResponse('Supabase', action, 'result', 'Success', response);
                 }
                return response;
              },
              (error) => {
                logApiError('Supabase', action, 'result', error);
                throw error;
              }
            );
          }
          return result;
        };
      }
      return originalValue; // Return non-function properties
    },
  };
};


// Export the proxied Supabase client
export const supabase = new Proxy(originalSupabase, supabaseProxyHandler);
