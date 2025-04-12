import React, { createContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from 'react-native-config';
import { STORAGE_KEYS } from '../config/constants';
import authApi from '../services/api/authApi';

// Initial state
const initialState = {
  user: null,
  token: null,
  refreshToken: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,
};

// Create context
export const AuthContext = createContext(initialState);

// Action types
const AUTH_LOADING = 'AUTH_LOADING';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
const AUTH_ERROR = 'AUTH_ERROR';
const LOGOUT = 'LOGOUT';
const UPDATE_USER = 'UPDATE_USER';
const CLEAR_ERROR = 'CLEAR_ERROR';

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_LOADING:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken,
        error: null,
      };
    case AUTH_ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case LOGOUT:
      return {
        ...initialState,
        isLoading: false,
      };
    case UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    case CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// Provider Component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for stored token on app startup
  useEffect(() => {
    const loadToken = async () => {
      try {
        dispatch({ type: AUTH_LOADING });
        
        const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        const refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
        
        if (token && userData) {
          const user = JSON.parse(userData);
          
          // Set auth state
          dispatch({
            type: LOGIN_SUCCESS,
            payload: { user, token, refreshToken },
          });
        } else {
          // No stored token found
          dispatch({ type: LOGOUT });
        }
      } catch (err) {
        console.error('Error loading auth token', err);
        dispatch({
          type: AUTH_ERROR,
          payload: 'Session load failed',
        });
      }
    };

    loadToken();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      dispatch({ type: AUTH_LOADING });
      
      const response = await authApi.login(email, password);
      const { user, token, refreshToken } = response.data;
      
      // Store auth data in AsyncStorage
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      
      if (refreshToken) {
        await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      }
      
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
      
      // Update auth state
      dispatch({
        type: LOGIN_SUCCESS,
        payload: { user, token, refreshToken },
      });
      
      return user;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      dispatch({
        type: AUTH_ERROR,
        payload: errorMessage,
      });
      throw err;
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      dispatch({ type: AUTH_LOADING });
      
      const response = await authApi.register(userData);
      const { user, token, refreshToken } = response.data;
      
      // Store auth data in AsyncStorage
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      
      if (refreshToken) {
        await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      }
      
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
      
      // Update auth state
      dispatch({
        type: REGISTER_SUCCESS,
        payload: { user, token, refreshToken },
      });
      
      return user;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed';
      dispatch({
        type: AUTH_ERROR,
        payload: errorMessage,
      });
      throw err;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Call logout API if available
      await authApi.logout();
    } catch (err) {
      console.error('Logout API error', err);
    } finally {
      // Clear storage regardless of API success
      await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      await AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
      
      // Update auth state
      dispatch({ type: LOGOUT });
    }
  };

  // Update user profile
  const updateUser = async (userData) => {
    try {
      dispatch({ type: AUTH_LOADING });
      
      // Call API to update user data
      const response = await authApi.updateProfile(userData);
      const updatedUser = response.data;
      
      // Update stored user data
      const currentUserData = JSON.parse(
        await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA)
      );
      
      const mergedUserData = { ...currentUserData, ...updatedUser };
      await AsyncStorage.setItem(
        STORAGE_KEYS.USER_DATA,
        JSON.stringify(mergedUserData)
      );
      
      // Update auth state
      dispatch({
        type: UPDATE_USER,
        payload: updatedUser,
      });
      
      return updatedUser;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Profile update failed';
      dispatch({
        type: AUTH_ERROR,
        payload: errorMessage,
      });
      throw err;
    }
  };

  // Clear auth errors
  const clearError = () => {
    dispatch({ type: CLEAR_ERROR });
  };

  // Value object to be provided to consumers
  const value = {
    ...state,
    login,
    register,
    logout,
    updateUser,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;