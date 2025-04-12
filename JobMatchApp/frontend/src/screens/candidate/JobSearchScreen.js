import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput as RNTextInput,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

// Components
import JobCard from '../../components/candidate/JobCard';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

// Hooks and Context
import useTheme from '../../hooks/useTheme';

// Services
import jobApi from '../../services/api/jobApi';
import storageService from '../../services/storage/asyncStorage';

// Utils and Constants
import { globalStyles } from '../../styles/globalStyles';
import { spacing } from '../../styles/spacing';
import { typography } from '../../styles/typography';
import { JOB_TYPES, EXPERIENCE_LEVELS, STORAGE_KEYS, ROUTES } from '../../config/constants';

const JobSearchScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  
  // State
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    location: '',
    jobType: '',
    experienceLevel: '',
    page: 1,
    limit: 10,
  });
  const [totalJobs, setTotalJobs] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [savedJobs, setSavedJobs] = useState({});
  
  // Effect for loading saved jobs from storage
  useEffect(() => {
    loadSavedJobs();
  }, []);
  
  // Effect for initial search
  useEffect(() => {
    fetchJobs(true);
  }, []);
  
  // Effect for handling route params
  useEffect(() => {
    if (route.params?.recommended) {
      fetchRecommendedJobs();
    }
  }, [route.params?.recommended]);
  
  // Re-fetch jobs when screen is focused
  useFocusEffect(
    useCallback(() => {
      loadSavedJobs();
      return () => {};
    }, [])
  );
  
  // Load saved jobs from storage
  const loadSavedJobs = async () => {
    try {
      const saved = await storageService.getObject(STORAGE_KEYS.SAVED_JOBS) || {};
      setSavedJobs(saved);
    } catch (error) {
      console.error('Error loading saved jobs:', error);
    }
  };
  
  // Fetch jobs from API
  const fetchJobs = async (reset = false) => {
    try {
      if (reset) {
        setIsLoading(true);
        // Reset page if it's a new search
        setSearchParams(prev => ({ ...prev, page: 1 }));
      } else {
        setIsLoadingMore(true);
      }
      
      setError(null);
      
      // Prepare query params
      const params = { ...searchParams };
      if (reset) {
        params.page = 1;
      }
      
      // Remove empty params
      Object.keys(params).forEach(key => {
        if (params[key] === '') {
          delete params[key];
        }
      });
      
      const response = await jobApi.searchJobs(params);
      const fetchedJobs = response.data.data || [];
      const totalCount = response.data.pagination?.total || 0;
      
      setTotalJobs(totalCount);
      
      if (reset) {
        setJobs(fetchedJobs);
      } else {
        setJobs(prevJobs => [...prevJobs, ...fetchedJobs]);
      }
      
      // Increment page for next fetch
      setSearchParams(prev => ({ ...prev, page: prev.page + 1 }));
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError('Failed to fetch jobs. Please try again.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
      setIsLoadingMore(false);
    }
  };
  
  // Fetch recommended jobs
  const fetchRecommendedJobs = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await jobApi.getRecommendedJobs();
      const recommendedJobs = response.data.data || [];
      setJobs(recommendedJobs);
      setTotalJobs(recommendedJobs.length);
      
      // Update navigation title
      navigation.setOptions({ title: 'Recommended Jobs' });
    } catch (error) {
      console.error('Error fetching recommended jobs:', error);
      setError('Failed to fetch recommended jobs. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchJobs(true);
  };
  
  // Handle load more
  const handleLoadMore = () => {
    if (isLoadingMore || jobs.length >= totalJobs) return;
    fetchJobs(false);
  };
  
  // Handle search
  const handleSearch = () => {
    Keyboard.dismiss();
    fetchJobs(true);
  };
  
  // Handle job press
  const handleJobPress = (job) => {
    navigation.navigate(ROUTES.JOB_SEEKER.JOB_DETAIL, { jobId: job._id });
  };
  
  // Handle save job
  const handleSaveJob = async (job, isSaved) => {
    try {
      // Update local state
      const jobId = job._id;
      const updatedSavedJobs = { ...savedJobs };
      
      if (isSaved) {
        updatedSavedJobs[jobId] = {
          id: jobId,
          title: job.title,
          company: job.company?.name || 'Unknown Company',
          savedAt: new Date().toISOString(),
        };
      } else {
        delete updatedSavedJobs[jobId];
      }
      
      setSavedJobs(updatedSavedJobs);
      
      // Save to storage
      await storageService.storeObject(STORAGE_KEYS.SAVED_JOBS, updatedSavedJobs);
    } catch (error) {
      console.error('Error saving job:', error);
    }
  };
  
  // Toggle search filters
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSearchParams({
      keyword: searchParams.keyword,
      location: '',
      jobType: '',
      experienceLevel: '',
      page: 1,
      limit: 10,
    });
    
    fetchJobs(true);
  };
  
  // Render header with search bar
  const renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <View style={[
          styles.searchBarContainer,
          { backgroundColor: theme.colors.background, borderColor: theme.colors.border }
        ]}>
          <Icon name="magnify" size={20} color={theme.colors.textSecondary} />
          <RNTextInput
            style={[styles.searchInput, { color: theme.colors.text }]}
            placeholder="Search jobs by title, skill, or keyword"
            placeholderTextColor={theme.colors.placeholder}
            value={searchParams.keyword}
            onChangeText={(text) => setSearchParams(prev => ({ ...prev, keyword: text }))}
            returnKeyType="search"
            onSubmitEditing={handleSearch}
          />
          {searchParams.keyword !== '' && (
            <TouchableOpacity
              onPress={() => {
                setSearchParams(prev => ({ ...prev, keyword: '' }));
              }}
            >
              <Icon name="close" size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
        
        <TouchableOpacity
          style={[
            styles.filterButton,
            { backgroundColor: theme.colors.primary + '20' }
          ]}
          onPress={toggleFilters}
        >
          <Icon name="filter-variant" size={20} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>
    );
  };
  
  // Render filters section
  const renderFilters = () => {
    if (!showFilters) return null;
    
    return (
      <Card style={styles.filtersCard}>
        <Text style={[styles.filtersTitle, { color: theme.colors.text }]}>
          Filters
        </Text>
        
        <View style={styles.filterItem}>
          <Text style={[styles.filterLabel, { color: theme.colors.text }]}>
            Location
          </Text>
          <RNTextInput
            style={[
              styles.filterInput,
              { 
                color: theme.colors.text, 
                borderColor: theme.colors.border,
                backgroundColor: theme.colors.background,
              }
            ]}
            placeholder="Enter city or region"
            placeholderTextColor={theme.colors.placeholder}
            value={searchParams.location}
            onChangeText={(text) => setSearchParams(prev => ({ ...prev, location: text }))}
          />
        </View>
        
        <View style={styles.filterItem}>
          <Text style={[styles.filterLabel, { color: theme.colors.text }]}>
            Job Type
          </Text>
          <View style={[
            styles.pickerContainer, 
            { 
              borderColor: theme.colors.border,
              backgroundColor: theme.colors.background,
            }
          ]}>
            <Picker
              selectedValue={searchParams.jobType}
              onValueChange={(itemValue) => 
                setSearchParams(prev => ({ ...prev, jobType: itemValue }))
              }
              style={{ color: theme.colors.text }}
            >
              <Picker.Item label="All Job Types" value="" />
              {JOB_TYPES.map((type) => (
                <Picker.Item key={type.id} label={type.label} value={type.id} />
              ))}
            </Picker>
          </View>
        </View>
        
        <View style={styles.filterItem}>
          <Text style={[styles.filterLabel, { color: theme.colors.text }]}>
            Experience Level
          </Text>
          <View style={[
            styles.pickerContainer, 
            { 
              borderColor: theme.colors.border,
              backgroundColor: theme.colors.background,
            }
          ]}>
            <Picker
              selectedValue={searchParams.experienceLevel}
              onValueChange={(itemValue) => 
                setSearchParams(prev => ({ ...prev, experienceLevel: itemValue }))
              }
              style={{ color: theme.colors.text }}
            >
              <Picker.Item label="All Experience Levels" value="" />
              {EXPERIENCE_LEVELS.map((level) => (
                <Picker.Item key={level.id} label={level.label} value={level.id} />
              ))}
            </Picker>
          </View>
        </View>
        
        <View style={styles.filterButtons}>
          <Button
            title="Clear Filters"
            onPress={clearFilters}
            type="outline"
            style={styles.clearButton}
          />
          <Button
            title="Apply Filters"
            onPress={() => {
              handleSearch();
              toggleFilters();
            }}
            style={styles.applyButton}
          />
        </View>
      </Card>
    );
  };
  
  // Render job list
  const renderJobList = () => {
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
            onPress={() => fetchJobs(true)}
            style={styles.retryButton}
          />
        </Card>
      );
    }
    
    if (jobs.length === 0) {
      return (
        <Card style={styles.emptyCard}>
          <Icon name="file-search-outline" size={48} color={theme.colors.textSecondary} />
          <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
            No jobs found
          </Text>
          <Text style={[styles.emptyDescription, { color: theme.colors.textSecondary }]}>
            Try adjusting your search filters or try again later.
          </Text>
        </Card>
      );
    }
    
    return (
      <FlatList
        data={jobs}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <JobCard
            job={item}
            onPress={() => handleJobPress(item)}
            onSave={handleSaveJob}
            isSaved={!!savedJobs[item._id]}
            style={styles.jobCard}
          />
        )}
        contentContainerStyle={styles.jobList}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={() => isLoadingMore && (
          <View style={styles.loadMoreIndicator}>
            <ActivityIndicator size="small" color={theme.colors.primary} />
            <Text style={[styles.loadMoreText, { color: theme.colors.textSecondary }]}>
              Loading more jobs...
            </Text>
          </View>
        )}
      />
    );
  };
  
  return (
    <SafeAreaView style={[globalStyles.safeArea, { backgroundColor: theme.colors.background }]}>
      <View style={styles.container}>
        {renderHeader()}
        {renderFilters()}
        {renderJobList()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    padding: spacing.medium,
    alignItems: 'center',
  },
  searchBarContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: spacing.medium,
    height: 44,
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.small,
    ...typography.body1,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.small,
  },
  filtersCard: {
    margin: spacing.medium,
    marginTop: 0,
    padding: spacing.medium,
  },
  filtersTitle: {
    ...typography.subtitle1,
    fontWeight: 'bold',
    marginBottom: spacing.medium,
  },
  filterItem: {
    marginBottom: spacing.medium,
  },
  filterLabel: {
    ...typography.subtitle2,
    marginBottom: spacing.extraSmall,
  },
  filterInput: {
    height: 44,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: spacing.medium,
    ...typography.body2,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 8,
  },
  filterButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.small,
  },
  clearButton: {
    flex: 1,
    marginRight: spacing.small,
  },
  applyButton: {
    flex: 1,
  },
  jobList: {
    padding: spacing.medium,
    paddingTop: 0,
  },
  jobCard: {
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
  },
  loadMoreIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.medium,
  },
  loadMoreText: {
    ...typography.body2,
    marginLeft: spacing.small,
  },
});

export default JobSearchScreen;