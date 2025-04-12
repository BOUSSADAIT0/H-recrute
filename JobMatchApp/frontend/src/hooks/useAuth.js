import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

/**
 * Custom hook to access auth context
 * @returns {Object} Auth context values and methods
 */
const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  // Destructure auth context values
  const {
    user,
    token,
    refreshToken,
    isLoading,
    isAuthenticated,
    error,
    login,
    register,
    logout,
    updateUser,
    clearError,
  } = context;

  // Helper functions
  const isEmployer = () => {
    return user?.role === 'recruiter';
  };

  const isJobSeeker = () => {
    return user?.role === 'jobseeker';
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const getRole = () => {
    return user?.role || null;
  };
  
  // Return all context values and additional helper functions
  return {
    user,
    token,
    refreshToken,
    isLoading,
    isAuthenticated,
    error,
    login,
    register,
    logout,
    updateUser,
    clearError,
    isEmployer,
    isJobSeeker,
    isAdmin,
    getRole,
  };
};

export default useAuth;