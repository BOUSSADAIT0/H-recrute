import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  FlatList,
  Image,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';

// Components
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import JobCard from '../../components/candidate/JobCard';

// Hooks and Context
import useAuth from '../../hooks/useAuth';
import useTheme from '../../hooks/useTheme';

// Services
import jobApi from '../../services/api/jobApi';
import notificationApi from '../../services/api/notificationApi';

// Styles and Constants
import { globalStyles } from '../../styles/globalStyles';
import { spacing } from '../../styles/spacing';
import { typography } from '../../styles/typography';
import { ROUTES } from '../../config/constants';

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { theme } = useTheme();
  
  // State
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [error, setError] = useState(null);
  
  // Fetch data on component mount
  useEffect(() => {
    fetchHomeData();
    fetchUnreadNotifications();
  }, []);
  
  // Fetch home screen data
  const fetchHomeData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch recommended jobs
      const recommendedResponse = await jobApi.getRecommendedJobs();
      setRecommendedJobs(recommendedResponse.data.data || []);
      
      // Fetch recent jobs
      const recentResponse = await jobApi.getJobs({ limit: 5, sort: 'createdAt', order: 'desc' });
      setRecentJobs(recentResponse.data.data || []);
    } catch (error) {
      console.error('Error fetching home data:', error);
      setError('Failed to load data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch unread notifications count
  const fetchUnreadNotifications = async () => {
    try {
      const response = await notificationApi.getUnreadCount();
      setUnreadNotifications(response.data.data || 0);
    } catch (error) {
      console.error('Error fetching notifications count:', error);
    }
  };
  
  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([fetchHomeData(), fetchUnreadNotifications()]);
    setIsRefreshing(false);
  };
  
  // Handle viewing all recommended jobs
  const handleViewAllRecommended = () => {
    navigation.navigate('SearchStack', {
      screen: ROUTES.JOB_SEEKER.JOB_SEARCH,
      params: { recommended: true },
    });
  };
  
  // Navigate to job details
  const handleJobPress = (job) => {
    navigation.navigate(ROUTES.JOB_SEEKER.JOB_DETAIL, { jobId: job._id });
  };
  
  // Navigate to notifications
  const handleNotificationsPress = () => {
    navigation.navigate(ROUTES.COMMON.NOTIFICATIONS);
  };
  
  // Navigate to messages
  const handleMessagesPress = () => {
    navigation.navigate(ROUTES.COMMON.MESSAGES);
  };
  
  // Navigate to saved jobs
  const handleSavedJobsPress = () => {
    navigation.navigate(ROUTES.JOB_SEEKER.SAVED_JOBS);
  };
  
  // Render welcome header
  const renderHeader = () => {
    const greeting = getGreeting();
    const firstName = user?.firstName || 'there';
    
    return (
      <View style={styles.headerContainer}>
        <View style={styles.greetingContainer}>
          <Text style={[styles.greeting, { color: theme.colors.textSecondary }]}>
            {greeting}
          </Text>
          <Text style={[styles.userName, { color: theme.colors.text }]}>
            {firstName}!
          </Text>
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: theme.colors.primary + '20' }]}
            onPress={handleNotificationsPress}
          >
            <Icon name="bell-outline" size={24} color={theme.colors.primary} />
            {unreadNotifications > 0 && (
              <View style={[styles.badge, { backgroundColor: theme.colors.error }]}>
                <Text style={styles.badgeText}>
                  {unreadNotifications > 9 ? '9+' : unreadNotifications}
                </Text>
              </View>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: theme.colors.primary + '20' }]}
            onPress={handleMessagesPress}
          >
            <Icon name="email-outline" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  
  // Get appropriate greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };
  
  // Render quick actions section
  const renderQuickActions = () => {
    return (
      <View style={styles.quickActionsContainer}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Quick Actions
        </Text>
        
        <View style={styles.actionCardsContainer}>
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: theme.colors.primary + '10' }]}
            onPress={() => navigation.navigate('SearchStack')}
          >
            <Icon name="magnify" size={32} color={theme.colors.primary} />
            <Text style={[styles.actionCardText, { color: theme.colors.text }]}>
              Find Jobs
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: theme.colors.accent + '10' }]}
            onPress={() => navigation.navigate('ApplicationsStack')}
          >
            <Icon name="file-document-outline" size={32} color={theme.colors.accent} />
            <Text style={[styles.actionCardText, { color: theme.colors.text }]}>
              My Applications
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: theme.colors.success + '10' }]}
            onPress={handleSavedJobsPress}
          >
            <Icon name="bookmark-outline" size={32} color={theme.colors.success} />
            <Text style={[styles.actionCardText, { color: theme.colors.text }]}>
              Saved Jobs
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: theme.colors.info + '10' }]}
            onPress={() => navigation.navigate('ProfileStack')}
          >
            <Icon name="account-outline" size={32} color={theme.colors.info} />
            <Text style={[styles.actionCardText, { color: theme.colors.text }]}>
              Profile
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  
  // Render recommended jobs section
  const renderRecommendedJobs = () => {
    if (recommendedJobs.length === 0) {
      return (
        <Card style={styles.emptyStateCard}>
          <Icon 
            name="lightbulb-outline" 
            size={48} 
            color={theme.colors.primary} 
            style={styles.emptyStateIcon} 
          />
          <Text style={[styles.emptyStateTitle, { color: theme.colors.text }]}>
            No recommended jobs yet
          </Text>
          <Text style={[styles.emptyStateDescription, { color: theme.colors.textSecondary }]}>
            Complete your profile and add skills to get personalized job recommendations.
          </Text>
          <Button
            title="Update Profile"
            onPress={() => navigation.navigate('ProfileStack', { screen: ROUTES.JOB_SEEKER.EDIT_PROFILE })}
            style={styles.emptyStateButton}
          />
        </Card>
      );
    }
    
    return (
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Recommended For You
          </Text>
          
          <TouchableOpacity onPress={handleViewAllRecommended}>
            <Text style={[styles.viewAllText, { color: theme.colors.primary }]}>
              View All
            </Text>
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={recommendedJobs}
          keyExtractor={(item) => item._id}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <JobCard
              job={item}
              onPress={() => handleJobPress(item)}
              style={styles.horizontalJobCard}
            />
          )}
          contentContainerStyle={styles.horizontalListContent}
          ListEmptyComponent={
            <Text style={[styles.emptyListText, { color: theme.colors.textSecondary }]}>
              No recommended jobs found
            </Text>
          }
        />
      </View>
    );
  };
  
  // Render recent jobs section
  const renderRecentJobs = () => {
    return (
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Recent Jobs
          </Text>
          
          <TouchableOpacity onPress={() => navigation.navigate('SearchStack')}>
            <Text style={[styles.viewAllText, { color: theme.colors.primary }]}>
              View All
            </Text>
          </TouchableOpacity>
        </View>
        
        {recentJobs.length > 0 ? (
          recentJobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              onPress={() => handleJobPress(job)}
              style={styles.verticalJobCard}
            />
          ))
        ) : (
          <Text style={[styles.emptyListText, { color: theme.colors.textSecondary }]}>
            No recent jobs found
          </Text>
        )}
      </View>
    );
  };
  
  // Show loading indicator
  if (isLoading && !isRefreshing) {
    return <Loading />;
  }
  
  return (
    <SafeAreaView style={[globalStyles.safeArea, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      >
        {renderHeader()}
        
        {error ? (
          <Card style={styles.errorCard}>
            <Text style={[styles.errorText, { color: theme.colors.error }]}>
              {error}
            </Text>
            <Button
              title="Retry"
              onPress={fetchHomeData}
              type="outline"
              style={styles.retryButton}
            />
          </Card>
        ) : (
          <>
            {renderQuickActions()}
            {renderRecommendedJobs()}
            {renderRecentJobs()}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: spacing.large,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.medium,
    paddingVertical: spacing.medium,
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    ...typography.body1,
  },
  userName: {
    ...typography.h5,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  iconButton: {
    padding: spacing.small,
    borderRadius: 20,
    marginLeft: spacing.small,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
  },
  badgeText: {
    ...typography.caption,
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  quickActionsContainer: {
    padding: spacing.medium,
  },
  sectionTitle: {
    ...typography.h6,
    marginBottom: spacing.medium,
  },
  actionCardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    padding: spacing.medium,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: spacing.medium,
  },
  actionCardText: {
    ...typography.subtitle2,
    marginTop: spacing.small,
    textAlign: 'center',
  },
  sectionContainer: {
    padding: spacing.medium,
    marginBottom: spacing.medium,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.medium,
  },
  viewAllText: {
    ...typography.button,
  },
  horizontalListContent: {
    paddingRight: spacing.medium,
  },
  horizontalJobCard: {
    width: 280,
    marginRight: spacing.medium,
  },
  verticalJobCard: {
    marginBottom: spacing.medium,
  },
  emptyListText: {
    ...typography.body2,
    textAlign: 'center',
    padding: spacing.large,
  },
  emptyStateCard: {
    padding: spacing.large,
    alignItems: 'center',
    margin: spacing.medium,
  },
  emptyStateIcon: {
    marginBottom: spacing.medium,
  },
  emptyStateTitle: {
    ...typography.h6,
    textAlign: 'center',
    marginBottom: spacing.small,
  },
  emptyStateDescription: {
    ...typography.body2,
    textAlign: 'center',
    marginBottom: spacing.large,
  },
  emptyStateButton: {
    marginTop: spacing.small,
  },
  errorCard: {
    margin: spacing.medium,
    padding: spacing.medium,
    alignItems: 'center',
  },
  errorText: {
    ...typography.body1,
    textAlign: 'center',
    marginBottom: spacing.medium,
  },
  retryButton: {
    marginTop: spacing.small,
  },
});

export default HomeScreen;