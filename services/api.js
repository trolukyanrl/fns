// services/api.js
import axios from 'axios';

// MockAPI.io base URLs
// Main project: Users and BA Sets
const BASE_URL_MAIN = 'https://698d7eebb79d1c928ed582de.mockapi.io/api/v1';
// Safety Kits and Tasks project
const BASE_URL_SK = 'https://699196a06279728b0154de02.mockapi.io';

// Create axios instances for different projects
const api = axios.create({
  baseURL: BASE_URL_MAIN,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Axios instance for Safety Kits and Tasks
const skApi = axios.create({
  baseURL: BASE_URL_SK,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens if needed
api.interceptors.request.use(
  async (config) => {
    // Add auth token if available
    // For React Native, we'll handle token storage in AuthContext
    // Token will be passed via context, not localStorage
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.log('Unauthorized access - redirect to login');
    }
    return Promise.reject(error);
  }
);

// Authentication API methods
export const authAPI = {
  // Login with username and password
  login: async (credentials) => {
    try {
      console.log('Attempting login with:', credentials.username);
      
      // First, find user by username
      const usersResponse = await api.get('/users', {
        params: {
          username: credentials.username
        }
      });
      
      console.log('API response:', usersResponse.data);
      
      const user = usersResponse.data.find(u => u.password === credentials.password);
      
      if (user) {
        // Successful login
        console.log('Login successful for user:', user.username);
        return {
          data: {
            success: true,
            user: {
              id: user.id,
              username: user.username,
              role: user.role,
              name: user.name,
              token: 'mock-jwt-token-' + user.id
            },
            message: 'Login successful'
          }
        };
      } else {
        // Failed login
        console.log('Invalid credentials');
        throw {
          response: {
            status: 401,
            data: {
              success: false,
              message: 'Invalid credentials'
            }
          }
        };
      }
    } catch (error) {
      console.error('Login API error:', error.message);
      
      // Handle different error types
      if (error.response?.status === 404) {
        // User not found
        throw {
          response: {
            status: 404,
            data: {
              success: false,
              message: 'User not found. Please check your username.'
            }
          }
        };
      } else if (error.response?.status) {
        // Other HTTP errors
        throw {
          response: {
            status: error.response.status,
            data: {
              success: false,
              message: error.response.data?.message || 'Login failed. Please try again.'
            }
          }
        };
      } else if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
        throw {
          response: {
            status: 500,
            data: {
              success: false,
              message: 'Network error. Please check your connection.'
            }
          }
        };
      }
      
      // Re-throw if it already has proper error structure
      if (error.response?.data?.message) {
        throw error;
      }
      
      // Fallback error
      throw {
        response: {
          status: 500,
          data: {
            success: false,
            message: 'An error occurred during login. Please try again.'
          }
        }
      };
    }
  },

  // Logout
  logout: async () => {
    // Simulate logout API call
    return { data: { success: true, message: 'Logged out successfully' } };
  },

  // Verify token (for session validation)
  verifyToken: async (token) => {
    // Simulate token verification
    return { 
      data: { 
        valid: true, 
        user: { 
          id: '1', 
          username: 'sic@123', 
          role: 'SIC', 
          name: 'Safety Inspector' 
        } 
      } 
    };
  }
};

// Items API methods (BA Sets and Safety Kits)
export const itemsAPI = {
  getBASets: async () => await api.get('/BA_Sets'),
  getSafetyKits: async () => await skApi.get('/sk')
};

// Tasks API methods - using Safety Kits project
export const tasksAPI = {
  getTasks: async () => await skApi.get('/tasks'),
  createTask: async (taskData) => {
    // Transform the task data to use distinct field names
    const transformedData = {
      ...taskData,
      // Keep the original structure but we'll handle the ID mapping in the response
    };
    
    const response = await skApi.post('/tasks', transformedData);
    
    // Transform the response to use distinct field names
    if (response.data) {
      // The API will return the task with an 'id' field (task ID: 1, 2, 3...)
      // We need to ensure asset IDs remain as BA-001, SK-001, etc.
      
      // For BA-Sets, ensure each asset has both taskAssetId and assetId
      if (response.data.baSets && Array.isArray(response.data.baSets)) {
        response.data.baSets = response.data.baSets.map(asset => ({
          ...asset,
          // Keep the original asset ID as assetId
          assetId: asset.id,
          // The task ID will be the main task's id field
          taskId: response.data.id
        }));
      }
      
      // For Safety Kits, ensure each asset has both taskAssetId and assetId
      if (response.data.safetyKits && Array.isArray(response.data.safetyKits)) {
        response.data.safetyKits = response.data.safetyKits.map(asset => ({
          ...asset,
          // Keep the original asset ID as assetId
          assetId: asset.id,
          // The task ID will be the main task's id field
          taskId: response.data.id
        }));
      }
    }
    
    return response;
  },
  updateTask: async (taskId, taskData) => await skApi.put(`/tasks/${taskId}`, taskData),
  deleteTask: async (taskId) => await skApi.delete(`/tasks/${taskId}`)
};

export default api;