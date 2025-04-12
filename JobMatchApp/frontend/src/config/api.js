import axios from 'axios';
import Config from 'react-native-config';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base URL from environment variables
const API_URL = Config.API_URL || 'http://localhost:5000/api';
const API_VERSION = Config.API_VERSION || 'v1';

// Create axios instance with default config
const api = axios.create({
  baseURL: `${API_URL}/${API_VERSION}`,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 15000, // 15 seconds timeout
});

// Request interceptor for API calls
api.interceptors.request.use(
  async (config) => {
    // Get the token from storage
    const token = await AsyncStorage.getItem(Config.JWT_STORAGE_KEY);
    
    // If token exists, add it to request headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 Unauthorized and we haven't retried already
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        const refreshToken = await AsyncStorage.getItem(Config.REFRESH_TOKEN_STORAGE_KEY);
        
        if (!refreshToken) {
          // No refresh token available, reject with original error
          return Promise.reject(error);
        }
        
        // Request new token with refresh token
        const response = await axios.post(`${API_URL}/${API_VERSION}/auth/refresh-token`, {
          refreshToken,
        });
        
        // If refresh successful, save new tokens
        if (response.data.token) {
          await AsyncStorage.setItem(Config.JWT_STORAGE_KEY, response.data.token);
          
          if (response.data.refreshToken) {
            await AsyncStorage.setItem(Config.REFRESH_TOKEN_STORAGE_KEY, response.data.refreshToken);
          }
          
          // Update Authorization header
          originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
          
          // Retry the original request with new token
          return api(originalRequest);
        }
      } catch (refreshError) {
        // If refresh token request fails, clear tokens
        await AsyncStorage.removeItem(Config.JWT_STORAGE_KEY);
        await AsyncStorage.removeItem(Config.REFRESH_TOKEN_STORAGE_KEY);
        
        // Handle refresh error here (e.g., redirect to login)
        return Promise.reject(refreshError);
      }
    }
    
    // Return the original error if not handled above
    return Promise.reject(error);
  }
);

export default api;