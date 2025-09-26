/**
 * Centralized logger for API interactions.
 */

const LOG_PREFIX = {
  REQUEST: '➡️ [API Request]',  // Added outgoing arrow
  RESPONSE: '⬅️ [API Response]', // Added incoming arrow
  ERROR: '❌ [API Error]',    // Added cross mark
  SUPABASE: '⚡ [Supabase]',   // Added lightning bolt
  AXIOS: '☁️ [Axios]',       // Added cloud
};

// Check if the environment is production
const isProduction = process.env.NODE_ENV === 'production';

/**
 * Logs an outgoing API request.
 * @param {string} source - 'Supabase' or 'Axios'
 * @param {string} method - The HTTP method or Supabase function name.
 * @param {string} urlOrTarget - The URL for Axios or the target table/function for Supabase.
 * @param {object | any[]} [data] - Optional request payload or arguments.
 */
export const logApiRequest = (source, method, urlOrTarget, data) => {
  // Disable logging in production
  if (isProduction) return;

  const sourcePrefix = source === 'Supabase' ? LOG_PREFIX.SUPABASE : LOG_PREFIX.AXIOS;
  if (data) {
    console.log(`${sourcePrefix}${LOG_PREFIX.REQUEST}`, method, urlOrTarget, { data });
  } else {
    console.log(`${sourcePrefix}${LOG_PREFIX.REQUEST}`, method, urlOrTarget);
  }
};

/**
 * Logs a successful API response.
 * @param {string} source - 'Supabase' or 'Axios'
 * @param {string} method - The HTTP method or Supabase function name.
 * @param {string} urlOrTarget - The URL for Axios or the target table/function for Supabase.
 * @param {number | string} statusOrResultType - HTTP status code for Axios or a description for Supabase (e.g., 'Success').
 * @param {object | any[]} [data] - Optional response data.
 */
export const logApiResponse = (source, method, urlOrTarget, statusOrResultType, data) => {
  // Disable logging in production
  if (isProduction) return;

  const sourcePrefix = source === 'Supabase' ? LOG_PREFIX.SUPABASE : LOG_PREFIX.AXIOS;
  if (data) {
    console.log(`${sourcePrefix}${LOG_PREFIX.RESPONSE}`, method, urlOrTarget, `Status/Result: ${statusOrResultType}`, { data });
  } else {
    console.log(`${sourcePrefix}${LOG_PREFIX.RESPONSE}`, method, urlOrTarget, `Status/Result: ${statusOrResultType}`);
  }
};

/**
 * Logs an API error.
 * @param {string} source - 'Supabase' or 'Axios'
 * @param {string} method - The HTTP method or Supabase function name.
 * @param {string} urlOrTarget - The URL for Axios or the target table/function for Supabase.
 * @param {object | string} error - The error object or message.
 * @param {number} [status] - Optional HTTP status code for Axios errors.
 */
export const logApiError = (source, method, urlOrTarget, error, status) => {
  // Disable logging in production
  if (isProduction) return;

  const sourcePrefix = source === 'Supabase' ? LOG_PREFIX.SUPABASE : LOG_PREFIX.AXIOS;
  if (status) {
    console.error(`${sourcePrefix}${LOG_PREFIX.ERROR}`, method, urlOrTarget, `Status: ${status}`, { error });
  } else {
    console.error(`${sourcePrefix}${LOG_PREFIX.ERROR}`, method, urlOrTarget, { error });
  }
};
