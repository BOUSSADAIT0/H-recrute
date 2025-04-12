import React, { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';

// Navigators
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';

// Contexts and Hooks
import useAuth from '../hooks/useAuth';
import useTheme from '../hooks/useTheme';

// Utils and Constants
import { STORAGE_KEYS } from '../config/constants';

// Components
import Loading from '../components/common/Loading';
import OnboardingScreen from '../screens/auth/OnboardingScreen';

const AppNavigator = () => {
  const { isLoading, isAuthenticated } = useAuth();
  const { isDarkMode, theme } = useTheme();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true);

  // Check if onboarding has been completed
  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const onboardingComplete = await AsyncStorage.getItem(
          STORAGE_KEYS.ONBOARDING_COMPLETE
        );
        
        // Show onboarding if the user has not completed it
        setShowOnboarding(onboardingComplete !== 'true');
        setIsCheckingOnboarding(false);
      } catch (error) {
        console.error('Error checking onboarding status', error);
        setShowOnboarding(false);
        setIsCheckingOnboarding(false);
      }
    };

    checkOnboarding();
  }, []);

  // Mark onboarding as complete
  const handleOnboardingComplete = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETE, 'true');
      setShowOnboarding(false);
    } catch (error) {
      console.error('Error saving onboarding status', error);
    }
  };

  // Show loading screen while checking auth and onboarding
  if (isLoading || isCheckingOnboarding) {
    return <Loading />;
  }

  // Show onboarding screen if needed
  if (showOnboarding && !isAuthenticated) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  return (
    <>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      
      {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
    </>
  );
};

export default AppNavigator;