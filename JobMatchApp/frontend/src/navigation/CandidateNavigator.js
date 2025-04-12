import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Screens
import HomeScreen from '../screens/candidate/HomeScreen';
import JobSearchScreen from '../screens/candidate/JobSearchScreen';
import JobDetailScreen from '../screens/candidate/JobDetailScreen';
import ApplicationsScreen from '../screens/candidate/ApplicationsScreen';
import ApplicationDetailScreen from '../screens/candidate/ApplicationDetailScreen';
import ProfileScreen from '../screens/candidate/ProfileScreen';
import EditProfileScreen from '../screens/candidate/EditProfileScreen';
import SavedJobsScreen from '../screens/candidate/SavedJobsScreen';

// Constants and Theme
import { ROUTES } from '../config/constants';
import useTheme from '../hooks/useTheme';

// Create navigators
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Home stack navigator
const HomeStackNavigator = () => {
  const { theme } = useTheme();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: theme.colors.text,
        cardStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Stack.Screen
        name={ROUTES.JOB_SEEKER.HOME}
        component={HomeScreen}
        options={{ title: 'Home', headerShown: false }}
      />
      <Stack.Screen
        name={ROUTES.JOB_SEEKER.JOB_DETAIL}
        component={JobDetailScreen}
        options={{ title: 'Job Details' }}
      />
      <Stack.Screen
        name={ROUTES.JOB_SEEKER.SAVED_JOBS}
        component={SavedJobsScreen}
        options={{ title: 'Saved Jobs' }}
      />
    </Stack.Navigator>
  );
};

// Search stack navigator
const SearchStackNavigator = () => {
  const { theme } = useTheme();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: theme.colors.text,
        cardStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Stack.Screen
        name={ROUTES.JOB_SEEKER.JOB_SEARCH}
        component={JobSearchScreen}
        options={{ title: 'Find Jobs', headerShown: false }}
      />
      <Stack.Screen
        name={ROUTES.JOB_SEEKER.JOB_DETAIL}
        component={JobDetailScreen}
        options={{ title: 'Job Details' }}
      />
    </Stack.Navigator>
  );
};

// Applications stack navigator
const ApplicationsStackNavigator = () => {
  const { theme } = useTheme();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: theme.colors.text,
        cardStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Stack.Screen
        name={ROUTES.JOB_SEEKER.APPLICATIONS}
        component={ApplicationsScreen}
        options={{ title: 'My Applications', headerShown: false }}
      />
      <Stack.Screen
        name={ROUTES.JOB_SEEKER.APPLICATION_DETAIL}
        component={ApplicationDetailScreen}
        options={{ title: 'Application Details' }}
      />
    </Stack.Navigator>
  );
};

// Profile stack navigator
const ProfileStackNavigator = () => {
  const { theme } = useTheme();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: theme.colors.text,
        cardStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Stack.Screen
        name={ROUTES.JOB_SEEKER.PROFILE}
        component={ProfileScreen}
        options={{ title: 'My Profile', headerShown: false }}
      />
      <Stack.Screen
        name={ROUTES.JOB_SEEKER.EDIT_PROFILE}
        component={EditProfileScreen}
        options={{ title: 'Edit Profile' }}
      />
    </Stack.Navigator>
  );
};

// Main tab navigator for job seekers
const CandidateNavigator = () => {
  const { theme } = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          
          if (route.name === 'HomeStack') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'SearchStack') {
            iconName = focused ? 'magnify' : 'magnify';
          } else if (route.name === 'ApplicationsStack') {
            iconName = focused ? 'file-document' : 'file-document-outline';
          } else if (route.name === 'ProfileStack') {
            iconName = focused ? 'account' : 'account-outline';
          }
          
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.disabled,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="HomeStack"
        component={HomeStackNavigator}
        options={{ title: 'Home' }}
      />
      <Tab.Screen
        name="SearchStack"
        component={SearchStackNavigator}
        options={{ title: 'Search' }}
      />
      <Tab.Screen
        name="ApplicationsStack"
        component={ApplicationsStackNavigator}
        options={{ title: 'Applications' }}
      />
      <Tab.Screen
        name="ProfileStack"
        component={ProfileStackNavigator}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

export default CandidateNavigator;