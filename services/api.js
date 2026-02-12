// services/api.js
import axios from 'axios';

// MockAPI.io base URL - replace with your actual MockAPI endpoint
// Format: https://YOUR_PROJECT_ID.mockapi.io/api/v1
const MOCK_API_BASE_URL = 'https://698d7eebb79d1c928ed582de.mockapi.io/api/v1'; // Your actual MockAPI endpoint

// Create axios instance with base configuration
const api = axios.create({
  baseURL: MOCK_API_BASE_URL,
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
      if (error.code === 'NETWORK_ERROR') {
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
      throw error;
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

// Tasks API methods (for future integration)
export const tasksAPI = {
  getTasks: async () => {
    // Mock tasks data
    return {
      data: [
        { id: 1, title: 'Safety Inspection', status: 'pending', assignedTo: 'TA' },
        { id: 2, title: 'Equipment Check', status: 'completed', assignedTo: 'SIC' }
      ]
    };
  }
};

export default api;