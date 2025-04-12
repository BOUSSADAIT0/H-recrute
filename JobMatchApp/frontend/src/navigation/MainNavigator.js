import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Role-specific navigators
import CandidateNavigator from './CandidateNavigator';
import EmployerNavigator from './EmployerNavigator';

// Common screens
import NotificationsScreen from '../screens/common/NotificationsScreen';
import MessagingScreen from '../screens/common/MessagingScreen';
import ChatScreen from '../screens/common/ChatScreen';
import SettingsScreen from '../screens/common/SettingsScreen';

// Contexts and Hooks
import useAuth from '../hooks/useAuth';
import useTheme from '../hooks/useTheme';

// Constants
import { ROUTES, USER_ROLES } from '../config/constants';

// Create stack navigator
const Stack = createStackNavigator();

const MainNavigator = () => {
  const { user, getRole } = useAuth();
  const { theme } = useTheme();
  
  // Determine which navigator to use based on user role
  const getInitialRouteName = () => {
    const role = getRole();
    
    if (role === USER_ROLES.EMPLOYER) {
      return 'EmployerNavigator';
    } else {
      // Default to job seeker navigator
      return 'CandidateNavigator';
    }
  };
  
  return (
    <Stack.Navigator
      initialRouteName={getInitialRouteName()}
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        cardStyle: { backgroundColor: theme.colors.background },
      }}
    >
      {/* Role-specific navigators */}
      <Stack.Screen
        name="CandidateNavigator"
        component={CandidateNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EmployerNavigator"
        component={EmployerNavigator}
        options={{ headerShown: false }}
      />
      
      {/* Common screens accessible from all navigators */}
      <Stack.Screen
        name={ROUTES.COMMON.NOTIFICATIONS}
        component={NotificationsScreen}
        options={{ title: 'Notifications' }}
      />
      <Stack.Screen
        name={ROUTES.COMMON.MESSAGES}
        component={MessagingScreen}
        options={{ title: 'Messages' }}
      />
      <Stack.Screen
        name={ROUTES.COMMON.CHAT}
        component={ChatScreen}
        options={({ route }) => ({
          title: route.params?.name || 'Chat',
        })}
      />
      <Stack.Screen
        name={ROUTES.COMMON.SETTINGS}
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
    </Stack.Navigator>
  );
};

export default MainNavigator;