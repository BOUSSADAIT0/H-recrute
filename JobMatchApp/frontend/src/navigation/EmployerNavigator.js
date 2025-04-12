import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Screens
import DashboardScreen from '../screens/employer/DashboardScreen';
import PostJobScreen from '../screens/employer/PostJobScreen';
import EditJobScreen from '../screens/employer/EditJobScreen';
import MyJobsScreen from '../screens/employer/MyJobsScreen';
import JobApplicationsScreen from '../screens/employer/JobApplicationsScreen';
import CandidateSearchScreen from '../screens/employer/CandidateSearchScreen';
import CandidateDetailScreen from '../screens/employer/CandidateDetailScreen';
import CompanyProfileScreen from '../screens/employer/CompanyProfileScreen';
import EditCompanyProfileScreen from '../screens/employer/EditCompanyProfileScreen';

// Constants and Theme
import { ROUTES } from '../config/constants';
import useTheme from '../hooks/useTheme';

// Create navigators
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Dashboard stack navigator
const DashboardStackNavigator = () => {
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
        name={ROUTES.EMPLOYER.DASHBOARD}
        component={DashboardScreen}
        options={{ title: 'Dashboard', headerShown: false }}
      />
      <Stack.Screen
        name={ROUTES.EMPLOYER.JOB_APPLICATIONS}
        component={JobApplicationsScreen}
        options={({ route }) => ({
          title: route.params?.jobTitle
            ? `Applications for ${route.params.jobTitle}`
            : 'Applications',
        })}
      />
    </Stack.Navigator>
  );
};

// Jobs stack navigator
const JobsStackNavigator = () => {
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
        name={ROUTES.EMPLOYER.MY_JOBS}
        component={MyJobsScreen}
        options={{ title: 'My Jobs', headerShown: false }}
      />
      <Stack.Screen
        name={ROUTES.EMPLOYER.POST_JOB}
        component={PostJobScreen}
        options={{ title: 'Post New Job' }}
      />
      <Stack.Screen
        name={ROUTES.EMPLOYER.EDIT_JOB}
        component={EditJobScreen}
        options={{ title: 'Edit Job' }}
      />
      <Stack.Screen
        name={ROUTES.EMPLOYER.JOB_APPLICATIONS}
        component={JobApplicationsScreen}
        options={({ route }) => ({
          title: route.params?.jobTitle
            ? `Applications for ${route.params.jobTitle}`
            : 'Applications',
        })}
      />
    </Stack.Navigator>
  );
};

// Candidates stack navigator
const CandidatesStackNavigator = () => {
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
        name={ROUTES.EMPLOYER.CANDIDATE_SEARCH}
        component={CandidateSearchScreen}
        options={{ title: 'Find Candidates', headerShown: false }}
      />
      <Stack.Screen
        name={ROUTES.EMPLOYER.CANDIDATE_DETAIL}
        component={CandidateDetailScreen}
        options={({ route }) => ({
          title: route.params?.name || 'Candidate Profile',
        })}
      />
    </Stack.Navigator>
  );
};

// Company stack navigator
const CompanyStackNavigator = () => {
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
        name={ROUTES.EMPLOYER.COMPANY_PROFILE}
        component={CompanyProfileScreen}
        options={{ title: 'Company Profile', headerShown: false }}
      />
      <Stack.Screen
        name={ROUTES.EMPLOYER.EDIT_COMPANY}
        component={EditCompanyProfileScreen}
        options={{ title: 'Edit Company Profile' }}
      />
    </Stack.Navigator>
  );
};

// Main tab navigator for employers
const EmployerNavigator = () => {
  const { theme } = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          
          if (route.name === 'DashboardStack') {
            iconName = focused ? 'view-dashboard' : 'view-dashboard-outline';
          } else if (route.name === 'JobsStack') {
            iconName = focused ? 'briefcase' : 'briefcase-outline';
          } else if (route.name === 'CandidatesStack') {
            iconName = focused ? 'account-search' : 'account-search-outline';
          } else if (route.name === 'CompanyStack') {
            iconName = focused ? 'domain' : 'domain';
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
        name="DashboardStack"
        component={DashboardStackNavigator}
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen
        name="JobsStack"
        component={JobsStackNavigator}
        options={{ title: 'Jobs' }}
      />
      <Tab.Screen
        name="CandidatesStack"
        component={CandidatesStackNavigator}
        options={{ title: 'Candidates' }}
      />
      <Tab.Screen
        name="CompanyStack"
        component={CompanyStackNavigator}
        options={{ title: 'Company' }}
      />
    </Tab.Navigator>
  );
};

export default EmployerNavigator;