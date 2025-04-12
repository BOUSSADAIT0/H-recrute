import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

// Components
import ApplicationItem from '../../components/candidate/ApplicationItem';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Header from '../../components/common/Header';

// Hooks and Context
import useTheme from '../../hooks/useTheme';

// Services
import applicationApi from '../../services/api/applicationApi';

// Utils and Constants
import { globalStyles } from '../../styles/globalStyles';
import { spacing } from '../../styles/spacing';
import { typography } from '../../styles/typography';
import { APPLICATION_STATUS, ROUTES } from '../../config/constants';

const ApplicationsScreen = ({ navigation }) => {
  const { theme } = useTheme();
  
  // State
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Fetch applications when screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchApplications();
      return () => {};
    }, [statusFilter])
  );
  
  // Fetch applications from API
  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const params = {};
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }
      
      const response = await applicationApi.getUserApplications(params);
      setApplications(response.data.data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setError('Failed to load applications. Please try again.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };
  
  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchApplications();
  };
  
  // Handle application press
  const handleApplicationPress = (application) => {
    navigation.navigate(ROUTES.JOB_SEEKER.APPLICATION_DETAIL, { 
      applicationId: application._id 
    });
  };
  
  // Render header with filter
  const renderHeader = () => {
    return (
      <View style={styles.filterContainer}>
        <Text style={[styles.filterLabel, { color: theme.colors.text }]}>
          Filter by status:
        </Text>
        <View style={[
          styles.pickerContainer, 
          { 
            borderColor: theme.colors.border,
            backgroundColor: theme.colors.background,
          }
        ]}>
          <Picker
            selectedValue={statusFilter}
            onValueChange={(itemValue) => setStatusFilter(itemValue)}
            style={{ color: theme.colors.text }}
          >
            <Picker.Item label="All Applications" value="all" />
            <Picker.Item label="Pending" value={APPLICATION_STATUS.PENDING} />
            <Picker.Item label="Reviewing" value={APPLICATION_STATUS.REVIEWING} />
            <Picker.Item label="Interviewed" value={APPLICATION_STATUS.INTERVIEWED} />
            <Picker.Item label="Offered" value={APPLICATION_STATUS.OFFERED} />
            <Picker.Item label="Hired" value={APPLICATION_STATUS.HIRED} />
            <Picker.Item label="Rejected" value={APPLICATION_STATUS.REJECTED} />
            <Picker.Item label="Withdrawn" value={APPLICATION_STATUS.WITHDRAWN} />
          </Picker>
        </View>
      </View>
    );
  };
  
  // Render application list
  const renderApplicationList = () => {
    if (isLoading && !isRefreshing) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      );
    }
    
    if (error) {
      return (
        <Card style={styles.errorCard}>
          <Icon name="alert-circle-outline" size={48} color={theme.colors.error} />
          <Text style={[styles.errorText, { color: theme.colors.error }]}>
            {error}
          </Text>
          <Button
            title="Retry"
            onPress={fetchApplications}
            style={styles.retryButton}
          />
        </Card>
      );
    }
    
    if (applications.length === 0) {
      return (
        <Card style={styles.emptyCard}>
          <Icon name="file-document-outline" size={48} color={theme.colors.textSecondary} />
          <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
            No applications found
          </Text>
          <Text style={[styles.emptyDescription, { color: theme.colors.textSecondary }]}>
            {statusFilter === 'all' 
              ? 'You haven\'t applied to any jobs yet.' 
              : `You don\'t have any ${statusFilter} applications.`}
          </Text>
          <Button
            title="Find Jobs"
            onPress={() => navigation.navigate('SearchStack')}
            style={styles.findJobsButton}
          />
        </Card>
      );
    }
    
    return (
      <FlatList
        data={applications}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <ApplicationItem
            application={item}
            onPress={() => handleApplicationPress(item)}
            style={styles.applicationItem}
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      />
    );
  };
  
  return (
    <SafeAreaView style={[globalStyles.safeArea, { backgroundColor: theme.colors.background }]}>
      <Header title="My Applications" />
      <View style={styles.container}>
        {renderHeader()}
        {renderApplicationList()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterContainer: {
    padding: spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  filterLabel: {
    ...typography.subtitle2,
    marginBottom: spacing.extraSmall,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 8,
  },
  listContent: {
    padding: spacing.medium,
    paddingTop: 0,
  },
  applicationItem: {
    marginBottom: spacing.medium,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.extraLarge,
  },
  errorCard: {
    margin: spacing.medium,
    padding: spacing.large,
    alignItems: 'center',
  },
  errorText: {
    ...typography.body1,
    textAlign: 'center',
    marginVertical: spacing.medium,
  },
  retryButton: {
    marginTop: spacing.small,
  },
  emptyCard: {
    margin: spacing.medium,
    padding: spacing.large,
    alignItems: 'center',
  },
  emptyTitle: {
    ...typography.h6,
    marginTop: spacing.medium,
    marginBottom: spacing.small,
  },
  emptyDescription: {
    ...typography.body2,
    textAlign: 'center',
    marginBottom: spacing.large,
  },
  findJobsButton: {
    marginTop: spacing.small,
  },
});

export default ApplicationsScreen;