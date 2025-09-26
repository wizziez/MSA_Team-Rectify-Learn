import axios from 'axios';
import { logApiRequest, logApiResponse, logApiError } from './logger'; // Import logger functions

// Update API URL to match the production server with correct protocol
const API_URL = process.env.REACT_APP_API_URL
// console.log('Using API URL:', API_URL);

// Create a configurable axios instance with better timeout handling
export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 60000, // Increased to 60 seconds for longer operations
  withCredentials: false // Changed to false to avoid CORS preflight issues
});

// Helper function to get CSRF token from cookies if available
const getCSRFToken = () => {
  try {
    // First try to get from cookies
    const name = 'csrftoken=';
    const decodedCookie = decodeURIComponent(document.cookie || '');
    
    if (!decodedCookie) {
      console.log('No cookies found, using default CSRF token');
      return 'Aah5N7ogDEx7Rka0a7ndNDYXbZZgHRvjj6L11vq8zamoY3EqNgyPhTsD6i5bkrKm';
    }
    
    const cookieArray = decodedCookie.split(';');
    
    for (let i = 0; i < cookieArray.length; i++) {
      let cookie = cookieArray[i].trim();
      if (cookie.indexOf(name) === 0) {
        return cookie.substring(name.length, cookie.length);
      }
    }
  } catch (error) {
    console.error('Error parsing CSRF token from cookies:', error);
  }
  
  // Return the token from the API documentation
  return 'Aah5N7ogDEx7Rka0a7ndNDYXbZZgHRvjj6L11vq8zamoY3EqNgyPhTsD6i5bkrKm';
};

// Create a simple cache for API responses
const apiCache = {
  quizQuestions: {},
  // Cache expiry time in milliseconds (15 minutes)
  expiryTime: 15 * 60 * 1000,
  
  // Get cached data if available and not expired
  get(key, subKey = null) {
    const cacheItem = this[key]?.[subKey];
    if (cacheItem && (Date.now() - cacheItem.timestamp < this.expiryTime)) {
      console.log(`Using cached data for ${key}/${subKey}`);
      return cacheItem.data;
    }
    return null;
  },
  
  // Store data in cache
  set(key, subKey, data) {
    if (!this[key]) this[key] = {};
    this[key][subKey] = {
      data,
      timestamp: Date.now()
    };
    console.log(`Cached data for ${key}/${subKey}`);
  },
  
  // Clear specific cache items
  clear(key, subKey = null) {
    if (subKey && this[key]) {
      delete this[key][subKey];
    } else if (key) {
      delete this[key];
    }
  },
  
  // Clear all cache
  clearAll() {
    Object.keys(this).forEach(key => {
      if (typeof this[key] === 'object' && key !== 'expiryTime') {
        this[key] = {};
      }
    });
  }
};

// Helper function for formatting file sizes
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Helper function to check if an error is a token limit error
const isTokenLimitError = (error) => {
  if (!error.response) return false;
  
  // Check the error response data
  const responseData = error.response.data;
  
  // Check different possible formats of token limit error responses
  return (
    (error.response.status === 403 && 
     (responseData?.error?.includes('Token limit exceeded') || 
      responseData?.detail?.includes('Token limit exceeded') ||
      (typeof responseData === 'string' && responseData.includes('Token limit exceeded'))))
  );
};

// Helper function to extract reset time from token limit error
const extractTokenResetTime = (error) => {
  if (!error.response || !error.response.data) return 'some time';
  
  const responseData = error.response.data;
  let errorMessage = '';
  
  if (responseData.error) {
    errorMessage = responseData.error;
  } else if (responseData.detail) {
    errorMessage = responseData.detail;
  } else if (typeof responseData === 'string') {
    errorMessage = responseData;
  }
  
  const timeInfo = errorMessage.match(/reset in approximately ([^.]+)/) || 
                   errorMessage.match(/reset in ([^.]+)/) ||
                   errorMessage.match(/Will reset in ([^.]+)/);
                   
  return timeInfo ? timeInfo[1] : 'some time';
};


// Define the handleApiError function before it's used
// After the extractTokenResetTime function but before where it's used in apiService
// Helper function to handle API errors
const handleApiError = (error) => {
  // Special handling for token limit errors
  if (isTokenLimitError(error)) {
    const resetTime = extractTokenResetTime(error);
    return {
      message: 'API Token Limit Exceeded',
      detail: `You've reached the usage limit. The limit will reset in ${resetTime}. Please try again later.`,
      status: 403
    };
  }
  
  if (!error.response) {
    return {
      message: 'Network error. The server is not responding.',
      detail: 'Please make sure your backend API is running at ' + API_URL
    };
  }
  
  const status = error.response.status;
  let message = 'An error occurred';
  let detail = '';
  
  switch (status) {
    case 401:
      message = 'Authentication failed';
      detail = 'Please log in again to continue';
      // Clear the token since it's invalid
      localStorage.removeItem('rectifyToken');
      break;
    case 403:
      message = 'Permission denied';
      detail = 'You do not have permission to access this resource';
      break;
    case 404:
      message = 'Resource not found';
      detail = 'The requested resource does not exist';
      break;
    case 500:
      message = 'Server error';
      detail = 'Something went wrong on the server. Please try again later.';
      break;
    default:
      if (error.response.data && error.response.data.detail) {
        detail = error.response.data.detail;
      } else if (error.response.data && error.response.data.error) {
        message = error.response.data.error;
        detail = error.response.data.detail || '';
      }
  }
  
  return { message, detail, status };
};

// Add request interceptor to include auth token and CSRF token
apiClient.interceptors.request.use(
  (config) => {
    // Log the request
    logApiRequest('Axios', config.method.toUpperCase(), config.url, config.data);

    // Add JWT token for authentication
    const token = localStorage.getItem('rectifyToken');
    if (token) {
      console.log('Adding auth token to request');
      config.headers['Authorization'] = `Bearer ${token}`;
    } else {
      console.warn('No token available for request to', config.url);
    }
    
    // Always add CSRF token
    const csrfToken = getCSRFToken();
    if (csrfToken) {
      config.headers['X-CSRFTOKEN'] = csrfToken;
      console.log('Adding CSRF token to request');
    }
    
    return config;
  },
  (error) => {
    // Log request error
    logApiError('Axios', error.config?.method?.toUpperCase() || 'UNKNOWN', error.config?.url || 'UNKNOWN', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => {
    // Log the successful response
    logApiResponse('Axios', response.config.method.toUpperCase(), response.config.url, response.status, response.data);
    return response;
  },
  async (error) => {
    // Log the response error
    logApiError('Axios', error.config?.method?.toUpperCase() || 'UNKNOWN', error.config?.url || 'UNKNOWN', error.response?.data || error.message, error.response?.status);

    const originalRequest = error.config;
    
    // Check if this is a token limit error
    if (isTokenLimitError(error)) {
      const resetTime = extractTokenResetTime(error);
      console.error(`Token limit exceeded. Will reset in ${resetTime}`);
      return Promise.reject(new Error(`API token limit exceeded. Please try again in ${resetTime}.`));
    }
    
    // If error is 403 (forbidden) and we haven't tried to refresh token yet
    if (error.response && error.response.status === 403 && !originalRequest._retry) {
      console.log('Received 403 Forbidden error, checking token validity');
      
      // Force reauthentication if token is invalid
      if (error.response?.data?.detail?.includes('Invalid token') || 
          error.response?.data?.detail?.includes('Token is invalid') ||
          error.response?.data?.detail?.includes('not valid')) {
        console.error('Token is invalid, redirecting to login');
        localStorage.removeItem('rectifyToken');
        window.location.href = '/login';
        return Promise.reject(new Error('Your session has expired. Please log in again.'));
      }
    }
    
    return Promise.reject(error);
  }
);

// Define API service methods based on the documentation
const apiService = {
  // Authentication functions removed as Supabase handles auth
  
  // Document operations
  uploadDocument: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    console.log('Uploading document to:', `${API_URL}/documents/process/`);
    console.log('File being uploaded:', file.name, `(${formatFileSize(file.size)})`);
    
    // Use the exact endpoint from the API docs
    return apiClient.post('/documents/process/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json',
        'X-CSRFTOKEN': getCSRFToken()
      },
      timeout: 60000 // Increase timeout to 60 seconds for larger files
    })
    .then(response => {
      console.log('Document upload response:', response.data);
      
      // Extract the document ID from the response for subsequent operations
      const documentId = response.data.id;
      
      return {
        document_id: documentId,
        id: documentId,
        status: 'complete',
        message: 'Document uploaded successfully'
      };
    })
    .catch(error => {
      // Enhanced error logging with more details
      console.error('Document upload error:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers
      });
      
      // Provide more specific error messages based on status code
      if (error.response?.status === 400) {
        const errorMessage = error.response.data?.error || 'Invalid file format or corrupted file.';
        throw new Error(`Upload failed: ${errorMessage}`);
      } else if (error.response?.status === 413) {
        throw new Error('File is too large. Please upload a smaller document.');
      } else if (error.response?.status === 401) {
        throw new Error('You need to be logged in to upload documents.');
      } else if (error.response?.status === 429) {
        throw new Error('Too many upload attempts. Please try again later.');
      } else {
        throw error;
      }
    });
  },
  
  getDocuments: () => {
    console.log('Fetching documents from:', `${API_URL}/documents/`);
    
    return apiClient.get('/documents/', {
      headers: {
        'X-CSRFTOKEN': getCSRFToken()
      }
    })
    .then(response => {
      console.log('Documents response:', response.data);
      return response;
    })
    .catch(error => {
      console.error('Get documents error:', error.response?.data || error.message);
      throw error;
    });
  },
  
  deleteDocument: (documentId) => {
    console.log(`Deleting document with ID: ${documentId}`);
    
    // Use the exact endpoint format from the API docs: /documents/delete/{id}/
    return apiClient.delete(`/documents/delete/${documentId}/`, {
      headers: {
        'X-CSRFTOKEN': getCSRFToken()
      }
    })
    .then(response => {
      console.log('Document delete response:', response.data);
      return response;
    })
    .catch(error => {
      console.error('Document delete error:', error.response?.data || error.message);
      throw error;
    });
  },
  
  // Quiz operations with improved handling based on the API docs
  generateQuiz: (documentId, options = {}) => {
    // Extract options with defaults
    const {
      difficulty = 'medium',
      number_of_quizzes = 10,
      title = '',
      include_hints = true,
      include_explanations = true
    } = typeof options === 'object' ? options : { difficulty: options, number_of_quizzes: 10 };
    
    console.log(`Generating ${number_of_quizzes} ${difficulty} quizzes for document ${documentId}`);
    console.log('Sending request to:', `${API_URL}/generate-quiz/`);
    
    // Validate inputs based on API requirements
    if (number_of_quizzes < 1 || number_of_quizzes > 30) {
      return Promise.reject(new Error('Number of quizzes must be between 1 and 30'));
    }
    
    if (!['easy', 'medium', 'hard'].includes(difficulty)) {
      return Promise.reject(new Error('Difficulty must be one of: easy, medium, hard'));
    }
    
    // Validate document ID
    if (!documentId) {
      return Promise.reject(new Error('Document ID is required'));
    }
    
    // Format the payload exactly as expected by the API
    const payload = {
      document_id: parseInt(documentId, 10) || documentId,
      difficulty: difficulty,
      number_of_quizzes: parseInt(number_of_quizzes, 10),
      include_hints: Boolean(include_hints),
      include_explanations: Boolean(include_explanations)
    };
    
    // Include additional properties if provided
    if (title) payload.title = title;
    
    console.log('Quiz generation payload:', payload);
    
    return apiClient.post('/generate-quiz/', payload, {
      headers: {
        'X-CSRFTOKEN': getCSRFToken(),
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .then(response => {
      console.log('Quiz generation succeeded:', response.data);
      return response.data;
    })
    .catch(error => {
      // Log detailed error information for debugging
      console.error('Quiz generation error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        config: error.config?.data,
        url: error.config?.url
      });
      
      // Check specific error cases
      if (error.response?.status === 400) {
        console.error('Quiz generation error - invalid request:', error.response.data);
        const errorDetail = error.response.data?.detail || 
                            error.response.data?.error || 
                            JSON.stringify(error.response.data);
        throw new Error(`Invalid quiz generation request: ${errorDetail}`);
      } else if (error.response?.status === 404) {
        console.error('Quiz generation error - document not found:', error.response.data);
        throw new Error(`Document ID ${documentId} not found. Please upload the document first.`);
      } else if (error.response?.status === 403) {
        console.error('Quiz generation error - permission denied:', error.response.data);
        throw new Error('You do not have permission to generate quizzes for this document.');
      } else if (error.response?.status === 429) {
        console.error('Quiz generation error - rate limited:', error.response.data);
        throw new Error('You have made too many quiz generation requests. Please try again later.');
      } else if (isTokenLimitError(error)) {
        const resetTime = extractTokenResetTime(error);
        throw new Error(`API token limit exceeded. Please try again in ${resetTime}.`);
      } else if (error.response?.data?.detail) {
        console.error('Quiz generation error with details:', error.response.data);
        throw new Error(error.response.data.detail);
      }
      
      console.error('Quiz generation failed:', error.response?.data || error.message);
      throw error;
    });
  },
  
  getDocumentQuizzes: (documentId) => {
    console.log(`Fetching quizzes for document ${documentId}`);
    
    // Update to use the correct API path format from docs
    return apiClient.get(`/quizzes/${documentId}/`, {
      headers: {
        'X-CSRFTOKEN': getCSRFToken()
      }
    })
    .then(response => {
      console.log('Document quizzes response:', response.data);
      return response;
    })
    .catch(error => {
      console.error('Get document quizzes error:', error.response?.data || error.message);
      throw error;
    });
  },
  
  // Quiz history operations
  getQuizAttempts: () => {
    console.log('Fetching quiz history');
    
    // Use the correct endpoint from the API docs
    return apiClient.get('/quiz/history/', {
      headers: {
        'X-CSRFTOKEN': getCSRFToken()
      }
    })
    .then(response => {
      console.log('Quiz history response:', response.data);
      return response;
    })
    .catch(error => {
      console.error('Quiz history error:', error.response?.data || error.message);
      
      // If we get a 404, it might mean the endpoint doesn't exist in this version of the API
      if (error.response?.status === 404) {
        console.log('Quiz history endpoint not found, falling back to local data');
        // Return a mock response with empty data
        return { data: [] };
      }
      
      throw error;
    });
  },
  
  // Add this new function to get quiz attempts by quiz ID
  getQuizAttemptsByQuizId: async (quizId) => {
    try {
      logApiRequest('GET', `/quiz/history/`);
      
      // First check the cache
      const cachedData = apiCache.get('quizAttempts', quizId);
      if (cachedData) return cachedData;
      
      // Based on docs, we get all quiz history and filter by quizId
      const response = await apiClient.get(`/quiz/history/`, {
        headers: { 'X-CSRFToken': getCSRFToken() }
      });
      
      logApiResponse('GET', `/quiz/history/`, response);
      
      // Filter the response for the specific quiz ID
      if (response.data && Array.isArray(response.data)) {
        const filteredData = response.data.filter(item => 
          item.quiz_id == quizId || item.document_id == quizId
        );
        
        const filteredResponse = { ...response, data: filteredData };
        
        // Cache the filtered response
        apiCache.set('quizAttempts', quizId, filteredResponse);
        
        return filteredResponse;
      }
      
      // Cache the response
      apiCache.set('quizAttempts', quizId, response);
      
      return response;
    } catch (error) {
      logApiError('GET', `/quiz/history/`, error);
      
      // Special case for no attempts yet (which might come back as a 404)
      if (error.response && error.response.status === 404) {
        console.log('No quiz attempts found for this quiz ID, returning empty array');
        return { data: [] };
      }
      
      console.error('Error fetching quiz attempts by quiz ID:', error);
      return { data: [], error: handleApiError(error) };
    }
  },
  
  // Add this new function to get quiz questions for a specific quiz
  getQuizQuestions: async (quizId) => {
    try {
      // According to the API docs, the correct endpoint is:
      const endpoint = `/quizzes/${quizId}/`;
      logApiRequest('GET', endpoint);
      
      // First check the cache
      const cachedData = apiCache.get('quizQuestions', quizId);
      if (cachedData) return cachedData;
      
      // Try the documented endpoint format
      const response = await apiClient.get(endpoint, {
        headers: { 'X-CSRFToken': getCSRFToken() }
      });
      
      logApiResponse('GET', endpoint, response);
      
      // Cache the response
      apiCache.set('quizQuestions', quizId, response);
      
      return response;
    } catch (error) {
      logApiError('GET', `/quizzes/${quizId}/`, error);
      
      console.error('Error fetching quiz questions:', error);
      return { data: [], error: handleApiError(error) };
    }
  },
  
  // Helper function to generate mock quiz questions for development/demo
  generateMockQuestions: (quizId) => {
    const mockQuestions = [
      {
        id: `${quizId}_1`,
        question: "What is the main difference between mitosis and meiosis?",
        options: [
          "Mitosis produces two identical cells, while meiosis produces four genetically different cells",
          "Mitosis occurs in plants, while meiosis occurs in animals",
          "Mitosis is sexual reproduction, while meiosis is asexual reproduction",
          "Mitosis happens in the liver, while meiosis happens in the brain"
        ],
        correctOptionIndex: 0,
        difficulty: "medium",
        explanation: "Mitosis is cell division resulting in two identical daughter cells with the same chromosome count as the parent cell. Meiosis results in four genetically diverse cells with half the chromosomes."
      },
      {
        id: `${quizId}_2`,
        question: "Which law of thermodynamics states that energy cannot be created or destroyed?",
        options: [
          "Zeroth Law of Thermodynamics",
          "First Law of Thermodynamics",
          "Second Law of Thermodynamics",
          "Third Law of Thermodynamics"
        ],
        correctOptionIndex: 1,
        difficulty: "hard",
        explanation: "The First Law of Thermodynamics, or Law of Conservation of Energy, states that energy cannot be created or destroyed, only transferred or converted between forms."
      },
      {
        id: `${quizId}_3`,
        question: "What is the primary function of DNA?",
        options: [
          "Energy storage",
          "Protein synthesis",
          "Genetic information storage",
          "Cell structure support"
        ],
        correctOptionIndex: 2,
        difficulty: "easy",
        explanation: "DNA (Deoxyribonucleic Acid) is the primary storage molecule for genetic information in organisms. It contains instructions for development, functioning, growth, and reproduction."
      },
      {
        id: `${quizId}_4`,
        question: "What is the difference between an ionic and covalent bond?",
        options: [
          "Ionic bonds involve sharing electrons, while covalent bonds involve transferring electrons",
          "Ionic bonds involve transferring electrons, while covalent bonds involve sharing electrons",
          "Ionic bonds occur in solids, while covalent bonds occur in liquids",
          "Ionic bonds are stronger than covalent bonds"
        ],
        correctOptionIndex: 1,
        difficulty: "medium",
        explanation: "Ionic bonds form when electrons transfer between atoms, creating positive and negative ions that attract each other. Covalent bonds form when atoms share electrons."
      },
      {
        id: `${quizId}_5`,
        question: "What is the Pythagorean theorem?",
        options: [
          "The sum of the angles in a triangle equals 180 degrees",
          "The area of a circle equals πr²",
          "In a right triangle, the sum of the squares of the two shorter sides equals the square of the hypotenuse",
          "The perimeter of a rectangle equals 2(length + width)"
        ],
        correctOptionIndex: 2,
        difficulty: "easy",
        explanation: "The Pythagorean theorem states that in a right triangle, the square of the hypotenuse (side opposite the right angle) equals the sum of squares of the other two sides (a² + b² = c²)."
      }
    ];
    
    return mockQuestions;
  },
  
  // Token usage operations from the API docs
  getTokenUsage: () => {
    console.log('Fetching token usage information');
    
    return apiClient.get('/token-usage/', {
      headers: {
        'X-CSRFTOKEN': getCSRFToken()
      }
    })
    .then(response => {
      console.log('Token usage response:', response.data);
      return response.data;
    })
    .catch(error => {
      console.error('Token usage error:', error.response?.data || error.message);
      throw error;
    });
  },
  
  getQuizHistory: async () => {
    try {
      // console.log('Fetching quiz history from:', `${API_URL}/quiz/history/`);
      
      const response = await apiClient.get('/quiz/history/', {
        headers: {
          'X-CSRFTOKEN': getCSRFToken()
        }
      });
      
      // console.log('Quiz history response:', response.data);
      
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data && Array.isArray(response.data.results)) {
        // Handle case where API returns { results: [...] } format for backward compatibility
        return response.data.results;
      } else {
        console.warn('Unexpected quiz history format:', response.data);
        return [];
      }
    } catch (error) {
      // Log detailed error information
      console.error('Error fetching quiz history:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        url: error.config?.url
      });
      
      const errorInfo = handleApiError(error);
      console.error('Formatted error:', errorInfo);
      
      // For errors, return empty array
      return [];
    }
  },
  
  // Get full session detail for a specific quiz history session
  getQuizSessionDetail: async (sessionId) => {
    try {
      console.log(`Fetching quiz session detail for session ID: ${sessionId}`);
      
      const response = await apiClient.get(`/quiz/history/${sessionId}/`, {
        headers: {
          'X-CSRFTOKEN': getCSRFToken()
        }
      });
      
      console.log('Quiz session detail response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching quiz session detail:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      
      // Format error message based on status code
      if (error.response?.status === 404) {
        throw new Error('Quiz session not found.');
      } else if (error.response?.status === 403) {
        throw new Error('You do not have permission to access this quiz session.');
      } else {
        throw new Error('Failed to load quiz session details. Please try again later.');
      }
    }
  },
  
  // Fix the saveQuizAttempt function to match API documentation
  saveQuizAttempt: async (quizData) => {
    try {
      // Format the data to match the API expectations
      // According to the API docs, we should be using the quiz/submit/ endpoint
      // for this functionality, which handles both submission and saving
      const formattedData = {
        document_id: parseInt(quizData.document_id, 10) || quizData.document_id,
        answers: quizData.answers || []
      };
      
      console.log('Saving quiz attempt with formatted data:', formattedData);
      
      // Use the documented endpoint
      const response = await apiClient.post('/quiz/submit/', formattedData, {
        headers: {
          'X-CSRFToken': getCSRFToken(),
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      console.log('Quiz attempt saved successfully:', response.data);
      return response.data;
    } catch (error) {
      // Provide detailed error logging but don't throw
      console.error('Error saving quiz attempt:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      
      return null;
    }
  },
  
  // Add function to submit quiz answers and get results
  submitQuizAnswers: async (documentId, answers) => {
    try {
      // Format the payload as expected by the API
      const payload = {
        document_id: parseInt(documentId, 10) || documentId,
        answers: answers.map(answer => ({
          quiz_id: answer.quiz_id,
          selected_option_index: answer.selected_option_index,
          time_taken: answer.time_taken
        }))
      };
      
      console.log('Submitting quiz answers:', payload);
      
      // Use the documented endpoint
      const response = await apiClient.post('/quiz/submit/', payload, {
        headers: {
          'X-CSRFToken': getCSRFToken(),
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Quiz submission successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error submitting quiz answers:', error.response?.data || error.message);
      
      // For quiz submission, we should throw the error to show the user
      const errorMsg = error.response?.data?.error || 
                      'Failed to submit quiz answers. Please try again.';
      throw new Error(errorMsg);
    }
  },
  
  // Add deleteQuiz function 
  deleteQuiz: (quizId) => {
    console.log(`Deleting quiz with ID: ${quizId}`);
    
    // Per API documentation, document deletion endpoint is used 
    // since quizzes are associated with documents
    return apiClient.delete(`/documents/delete/${quizId}/`, {
      headers: {
        'X-CSRFTOKEN': getCSRFToken()
      }
    })
    .then(response => {
      console.log('Quiz delete response:', response.data);
      return response;
    })
    .catch(error => {
      console.error('Quiz delete error:', error.response?.data || error.message);
      throw error;
    });
  },
  
  // Add a reference to the handleApiError function
  handleApiError,
  
  // Generate flashcards from a document
  generateFlashcards: async (documentId, options = {}) => {
    try {
      // Default options
      const {
        count = 10,
        difficulty = 'medium'
      } = options;
      
      console.log(`Generating ${count} flashcards for document ${documentId}`);
      
      const payload = {
        document_id: parseInt(documentId, 10),
        difficulty: difficulty,
        number_of_flashcards: parseInt(count, 10)
      };
      
      console.log('Flashcard generation payload:', payload);
      
      // Log the full URL being called
      const fullUrl = `${apiClient.defaults.baseURL}/generate-flashcards/`;
      console.log('Calling flashcard generation endpoint:', fullUrl);
      
      const response = await apiClient.post('/generate-flashcards/', payload, {
        headers: {
          'Authorization': `Bearer ${getCSRFToken()}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Flashcard generation response:', response);
      
      if (!response.data) {
        throw new Error('No data received from flashcard generation');
      }

      // Clear the flashcards cache for this document after successful generation
      apiCache.clear('flashcards', documentId.toString());
      console.log('Cleared flashcards cache for document:', documentId);
      
      // Immediately fetch and return the newly generated flashcards
      const newFlashcardsResponse = await apiClient.get(`/flashcards/${documentId}/`, {
        headers: {
          'Authorization': `Bearer ${getCSRFToken()}`
        }
      });
      
      console.log('Newly generated flashcards:', newFlashcardsResponse.data);
      return newFlashcardsResponse.data;
      
    } catch (error) {
      console.error('Detailed flashcard generation error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText,
        config: error.config
      });
      
      if (error.response?.status === 404) {
        throw new Error('Flashcard generation endpoint not found. Please check if the API is running correctly.');
      } else if (error.response?.status === 401) {
        throw new Error('Authentication failed. Please log in again.');
      } else if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      } else {
        throw new Error(`Failed to generate flashcards: ${error.message || 'Unknown error'}`);
      }
    }
  },
  
  // Get flashcards for a document
  getFlashcards: async (documentId) => {
    try {
      // First check the cache
      const cachedData = apiCache.get('flashcards', documentId);
      if (cachedData) return cachedData;
      
      console.log(`Fetching flashcards for document ${documentId}`);
      
      const response = await apiClient.get(`/flashcards/${documentId}/`, {
        headers: {
          'Authorization': `Bearer ${getCSRFToken()}`
        }
      });
      
      console.log('Flashcards response:', response.data);
      
      // Cache the flashcards
      apiCache.set('flashcards', documentId, { data: response.data });
      
      return { data: response.data };
    } catch (error) {
      console.error('Error fetching flashcards:', error);
      
      // If no flashcards yet, return empty array
      if (error.response?.status === 404) {
        return { data: [] };
      }
      
      return { data: [], error: handleApiError(error) };
    }
  },
  
  // Submit flashcard review session
  submitFlashcardReview: async (documentId, reviews) => {
    try {
      console.log(`Submitting flashcard reviews for document ${documentId}`);
      
      const payload = {
        document_id: parseInt(documentId, 10),
        reviews: reviews.map(review => ({
          flashcard_id: review.flashcard_id,
          confidence_level: review.confidence_level
        }))
      };
      
      const response = await apiClient.post('/flashcards/submit-review/', payload, {
        headers: {
          'Authorization': `Bearer ${getCSRFToken()}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Flashcard review submitted:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error submitting flashcard review:', error);
      const errorInfo = handleApiError(error);
      throw new Error(`Failed to submit flashcard review: ${errorInfo.detail || errorInfo.message}`);
    }
  },
  
  // Generate mock flashcards for development/demo
  generateMockFlashcards: (documentId) => {
    const mockFlashcards = [
      {
        id: `${documentId}_f1`,
        front: "What is photosynthesis?",
        back: "Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize nutrients from carbon dioxide and water, generating oxygen as a byproduct.",
        hint: "Think about how plants make their food",
        difficulty: "medium"
      },
      {
        id: `${documentId}_f2`,
        front: "Define Newton's First Law of Motion",
        back: "An object at rest stays at rest and an object in motion stays in motion with the same speed and in the same direction unless acted upon by an unbalanced force.",
        hint: "Also known as the law of inertia",
        difficulty: "easy"
      },
      {
        id: `${documentId}_f3`,
        front: "What is the capital of France?",
        back: "Paris",
        hint: "City of Light",
        difficulty: "easy"
      },
      {
        id: `${documentId}_f4`,
        front: "What is the Pythagorean theorem?",
        back: "In a right triangle, the square of the hypotenuse equals the sum of squares of the other two sides (a² + b² = c²).",
        hint: "Involves right triangles",
        difficulty: "medium"
      },
      {
        id: `${documentId}_f5`,
        front: "What is the First Amendment to the U.S. Constitution?",
        back: "It protects freedom of speech, religion, press, assembly, and the right to petition the government for a redress of grievances.",
        hint: "Protects basic civil liberties",
        difficulty: "hard"
      }
    ];
    
    return { data: mockFlashcards };
  },
  
  // Save flashcard study progress
  saveFlashcardProgress: async (documentId, flashcardData) => {
    try {
      console.log(`Saving flashcard progress for document ${documentId}`);
      
      const payload = {
        document_id: parseInt(documentId, 10) || documentId,
        flashcard_data: flashcardData
      };
      
      // Use the same endpoint as quiz submission
      const response = await apiClient.post('/quiz/submit/', payload, {
        headers: {
          'X-CSRFToken': getCSRFToken(),
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      console.log('Flashcard progress saved:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error saving flashcard progress:', error);
      return null; // Return null instead of throwing to avoid breaking the UI flow
    }
  },

  // Mnemonic operations
  generateMnemonics: async (documentId, options = {}) => {
    try {
      console.log(`Generating mnemonics for document ${documentId}`);
      
      const payload = {
        document_id: parseInt(documentId, 10),
        types: options.types || [],
        topics: options.topics || [],
        instructions: options.instructions || ''
      };
      
      console.log('Mnemonic generation payload:', payload);
      
      const response = await apiClient.post('/generate-mnemonic/', payload, {
        headers: {
          'X-CSRFToken': getCSRFToken(),
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Mnemonic generation response:', response.data);
      
      // Clear cache after successful generation
      apiCache.clear('mnemonics', documentId.toString());
      
      return response.data;
    } catch (error) {
      console.error('Error generating mnemonics:', error);
      
      if (error.response?.status === 404) {
        throw new Error('Document not found. Please check if the document exists.');
      } else if (error.response?.status === 400) {
        throw new Error(error.response.data?.detail || 'Invalid request parameters.');
      } else if (error.response?.status === 500) {
        throw new Error('AI service failure. Please try again later.');
      }
      
      throw new Error(error.response?.data?.detail || 'Failed to generate mnemonics.');
    }
  },

  // Get mnemonics for a document
  getMnemonics: async (documentId) => {
    try {
      // First check the cache
      const cachedData = apiCache.get('mnemonics', documentId);
      if (cachedData) return cachedData;
      
      console.log(`Fetching mnemonics for document ${documentId}`);
      
      const response = await apiClient.get(`/get-mnemonics/${documentId}/`, {
        headers: {
          'X-CSRFToken': getCSRFToken()
        }
      });
      
      console.log('Mnemonics response:', response.data);
      
      // Cache the mnemonics
      apiCache.set('mnemonics', documentId, response);
      
      return response;
    } catch (error) {
      console.error('Error fetching mnemonics:', error);
      
      // If no mnemonics yet, return empty array
      if (error.response?.status === 404) {
        return { data: [] };
      }
      
      return { data: [], error: handleApiError(error) };
    }
  },

  // Get documents with mnemonic status
  getMnemonicDocuments: async () => {
    try {
      console.log('Fetching documents with mnemonic status');
      
      const response = await apiClient.get('/mnemonic-documents/', {
        headers: {
          'X-CSRFToken': getCSRFToken()
        }
      });
      
      console.log('Mnemonic documents response:', response.data);
      return response;
    } catch (error) {
      console.error('Error fetching mnemonic documents:', error);
      throw error;
    }
  }
};

// Review System API Functions (Module 2)
export const getReviewDocumentsToday = async () => {
  try {
    console.log('Fetching documents scheduled for review today');
    
    const response = await apiClient.get('/review/today/', {
      headers: {
        'X-CSRFToken': getCSRFToken()
      }
    });
    
    console.log('Today\'s review documents response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching today\'s review documents:', error);
    throw error;
  }
};

export const getReviewDocumentsByDate = async (date) => {
  try {
    console.log('Fetching documents scheduled for review on:', date);
    
    const response = await apiClient.get('/review/date/', {
      params: { date },
      headers: {
        'X-CSRFToken': getCSRFToken()
      }
    });
    
    console.log('Review documents by date response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching review documents by date:', error);
    throw error;
  }
};

export const getReviewDocumentsDateRange = async (startDate, endDate) => {
  try {
    console.log('Fetching documents scheduled for review between:', startDate, 'and', endDate);
    
    const response = await apiClient.get('/review/date-range/', {
      params: { 
        start_date: startDate, 
        end_date: endDate 
      },
      headers: {
        'X-CSRFToken': getCSRFToken()
      }
    });
    
    console.log('Review documents by date range response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching review documents by date range:', error);
    throw error;
  }
};

export const getReviewCalendar = async (year, month) => {
  try {
    console.log('Fetching review calendar data for:', year, month);
    
    const response = await apiClient.get('/review/calendar/', {
      params: { year, month },
      headers: {
        'X-CSRFToken': getCSRFToken()
      }
    });
    
    console.log('Review calendar response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching review calendar:', error);
    throw error;
  }
};

// Study Planner API methods
apiService.getStudyPlans = async () => {
  try {
    logApiRequest('GET', '/study-plans/');
    
    const response = await apiClient.get('/study-plans/', {
      headers: {
        'X-CSRFToken': getCSRFToken()
      }
    });
    
    logApiResponse('GET', '/study-plans/', response);
    return response;
  } catch (error) {
    logApiError('GET', '/study-plans/', error);
    throw error;
  }
};

apiService.getStudyPlan = async (studyPlanId) => {
  try {
    logApiRequest('GET', `/study-plans/${studyPlanId}/`);
    
    const response = await apiClient.get(`/study-plans/${studyPlanId}/`, {
      headers: {
        'X-CSRFToken': getCSRFToken()
      }
    });
    
    logApiResponse('GET', `/study-plans/${studyPlanId}/`, response);
    return response;
  } catch (error) {
    logApiError('GET', `/study-plans/${studyPlanId}/`, error);
    throw error;
  }
};

apiService.generateStudyPlan = async (studyPlanData) => {
  try {
    logApiRequest('POST', '/study-plans/generate/', studyPlanData);
    
    const response = await apiClient.post('/study-plans/generate/', studyPlanData, {
      headers: {
        'X-CSRFToken': getCSRFToken(),
        'Content-Type': 'application/json'
      },
      timeout: 120000 // 2 minutes for AI generation
    });
    
    logApiResponse('POST', '/study-plans/generate/', response);
    return response;
  } catch (error) {
    logApiError('POST', '/study-plans/generate/', error);
    throw error;
  }
};

apiService.updateStudyPlan = async (studyPlanId, updateData) => {
  try {
    logApiRequest('PATCH', `/study-plans/${studyPlanId}/`, updateData);
    
    const response = await apiClient.patch(`/study-plans/${studyPlanId}/`, updateData, {
      headers: {
        'X-CSRFToken': getCSRFToken(),
        'Content-Type': 'application/json'
      }
    });
    
    logApiResponse('PATCH', `/study-plans/${studyPlanId}/`, response);
    return response;
  } catch (error) {
    logApiError('PATCH', `/study-plans/${studyPlanId}/`, error);
    throw error;
  }
};

apiService.deleteStudyPlan = async (studyPlanId) => {
  try {
    logApiRequest('DELETE', `/study-plans/${studyPlanId}/`);
    
    const response = await apiClient.delete(`/study-plans/${studyPlanId}/`, {
      headers: {
        'X-CSRFToken': getCSRFToken()
      }
    });
    
    logApiResponse('DELETE', `/study-plans/${studyPlanId}/`, response);
    return response;
  } catch (error) {
    logApiError('DELETE', `/study-plans/${studyPlanId}/`, error);
    throw error;
  }
};

apiService.getStudyPlanProgress = async (studyPlanId) => {
  try {
    logApiRequest('GET', `/study-plans/${studyPlanId}/progress/`);
    
    const response = await apiClient.get(`/study-plans/${studyPlanId}/progress/`, {
      headers: {
        'X-CSRFToken': getCSRFToken()
      }
    });
    
    logApiResponse('GET', `/study-plans/${studyPlanId}/progress/`, response);
    return response;
  } catch (error) {
    logApiError('GET', `/study-plans/${studyPlanId}/progress/`, error);
    throw error;
  }
};

apiService.getStudyPlanSteps = async (studyPlanId, day = null) => {
  try {
    const params = day ? { day } : {};
    logApiRequest('GET', `/study-plans/${studyPlanId}/steps/`, params);
    
    const response = await apiClient.get(`/study-plans/${studyPlanId}/steps/`, {
      params,
      headers: {
        'X-CSRFToken': getCSRFToken()
      }
    });
    
    logApiResponse('GET', `/study-plans/${studyPlanId}/steps/`, response);
    return response;
  } catch (error) {
    logApiError('GET', `/study-plans/${studyPlanId}/steps/`, error);
    throw error;
  }
};

apiService.updateStudyPlanStep = async (stepId, updateData) => {
  try {
    logApiRequest('PATCH', `/study-plan-steps/${stepId}/update/`, updateData);
    
    const response = await apiClient.patch(`/study-plan-steps/${stepId}/update/`, updateData, {
      headers: {
        'X-CSRFToken': getCSRFToken(),
        'Content-Type': 'application/json'
      }
    });
    
    logApiResponse('PATCH', `/study-plan-steps/${stepId}/update/`, response);
    return response;
  } catch (error) {
    logApiError('PATCH', `/study-plan-steps/${stepId}/update/`, error);
    throw error;
  }
};

export default apiService;
