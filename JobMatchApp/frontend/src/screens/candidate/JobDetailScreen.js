import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Share,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';

// Components
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import Card from '../../components/common/Card';
import Header from '../../components/common/Header';

// Hooks and Context
import useAuth from '../../hooks/useAuth';
import useTheme from '../../hooks/useTheme';

// Services
import jobApi from '../../services/api/jobApi';
import applicationApi from '../../services/api/applicationApi';
import storageService from '../../services/storage/asyncStorage';

// Utils and Constants
import { globalStyles } from '../../styles/globalStyles';
import { spacing } from '../../styles/spacing';
import { typography } from '../../styles/typography';
import { JOB_TYPES, EXPERIENCE_LEVELS, STORAGE_KEYS, ROUTES } from '../../config/constants';

const JobDetailScreen = ({ navigation, route }) => {
  const { jobId } = route.params;
  const { user } = useAuth();
  const { theme } = useTheme();
  
  // State
  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  
  // Effects
  useEffect(() => {
    fetchJobDetails();
    checkIfJobSaved();
    checkIfAlreadyApplied();
  }, [jobId]);
  
  // Fetch job details
  const fetchJobDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await jobApi.getJobById(jobId);
      setJob(response.data.data);
    } catch (error) {
      console.error('Error fetching job details:', error);
      setError('Failed to load job details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Check if job is saved in storage
  const checkIfJobSaved = async () => {
    try {
      const savedJobs = await storageService.getObject(STORAGE_KEYS.SAVED_JOBS) || {};
      setIsSaved(!!savedJobs[jobId]);
    } catch (error) {
      console.error('Error checking saved job:', error);
    }
  };
  
  // Check if user has already applied for this job
  const checkIfAlreadyApplied = async () => {
    try {
      const response = await applicationApi.getUserApplications();
      const applications = response.data.data || [];
      const hasApplied = applications.some(app => app.job._id === jobId);
      setHasApplied(hasApplied);
    } catch (error) {
      console.error('Error checking application status:', error);
    }
  };
  
  // Toggle save job
  const toggleSaveJob = async () => {
    try {
      const savedJobs = await storageService.getObject(STORAGE_KEYS.SAVED_JOBS) || {};
      const newIsSaved = !isSaved;
      
      if (newIsSaved) {
        // Save job
        savedJobs[jobId] = {
          id: jobId,
          title: job.title,
          company: job.company?.name || 'Unknown Company',
          savedAt: new Date().toISOString(),
        };
      } else {
        // Remove job
        delete savedJobs[jobId];
      }
      
      await storageService.storeObject(STORAGE_KEYS.SAVED_JOBS, savedJobs);
      setIsSaved(newIsSaved);
    } catch (error) {
      console.error('Error saving job:', error);
      Alert.alert('Error', 'Could not save job. Please try again.');
    }
  };
  
  // Handle apply for job
  const handleApply = async () => {
    try {
      setIsApplying(true);
      
      // Navigate to application form
      navigation.navigate('ApplicationsStack', {
        screen: 'CreateApplication',
        params: { job: job },
      });
    } catch (error) {
      console.error('Error applying for job:', error);
      Alert.alert('Error', 'Could not process your application. Please try again.');
    } finally {
      setIsApplying(false);
    }
  };
  
  // Handle share job
  const handleShare = async () => {
    try {
      const jobUrl = `your-app-scheme://jobs/${jobId}`;
      const title = job.title;
      const message = `Check out this job: ${title} at ${job.company?.name || 'a company'}\n\n${jobUrl}`;
      
      await Share.share({
        message,
        title: `Job: ${title}`,
      });
    } catch (error) {
      console.error('Error sharing job:', error);
    }
  };
  
  // Format job type
  const formatJobType = (type) => {
    const jobType = JOB_TYPES.find(item => item.id === type);
    return jobType ? jobType.label : type;
  };
  
  // Format experience level
  const formatExperienceLevel = (level) => {
    const expLevel = EXPERIENCE_LEVELS.find(item => item.id === level);
    return expLevel ? expLevel.label : level;
  };
  
  // Format salary range
  const formatSalary = () => {
    if (!job.salary || (!job.salary.min && !job.salary.max)) {
      return 'Salary not specified';
    }
    
    if (job.salary.min && job.salary.max) {
      return `${formatCurrency(job.salary.min)} - ${formatCurrency(job.salary.max)}`;
    } else if (job.salary.min) {
      return `From ${formatCurrency(job.salary.min)}`;
    } else if (job.salary.max) {
      return `Up to ${formatCurrency(job.salary.max)}`;
    }
  };
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: job.salary?.currency || 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  // Format date
  const formatDate = (date) => {
    return moment(date).format('MMM D, YYYY');
  };
  
  // Get company logo
  const getCompanyLogo = () => {
    if (job?.company?.logo) {
      return { uri: job.company.logo };
    }
    return require('../../assets/images/company-placeholder.png');
  };
  
  // Open website
  const openWebsite = (url) => {
    if (!url) return;
    
    // Add https if not present
    let website = url;
    if (!website.startsWith('http')) {
      website = `https://${website}`;
    }
    
    Linking.canOpenURL(website).then(supported => {
      if (supported) {
        Linking.openURL(website);
      } else {
        Alert.alert('Error', 'Cannot open this website');
      }
    });
  };
  
  if (isLoading) {
    return <Loading />;
  }
  
  if (error || !job) {
    return (
      <SafeAreaView style={[globalStyles.safeArea, { backgroundColor: theme.colors.background }]}>
        <Header
          title="Job Details"
          showBackButton
          onBackPress={() => navigation.goBack()}
        />
        <View style={styles.errorContainer}>
          <Icon name="alert-circle-outline" size={64} color={theme.colors.error} />
          <Text style={[styles.errorText, { color: theme.colors.error }]}>
            {error || 'Job not found'}
          </Text>
          <Button
            title="Try Again"
            onPress={fetchJobDetails}
            style={styles.retryButton}
          />
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={[globalStyles.safeArea, { backgroundColor: theme.colors.background }]}>
      <Header
        title="Job Details"
        showBackButton
        onBackPress={() => navigation.goBack()}
        rightComponent={
          <TouchableOpacity 
            onPress={handleShare}
            style={styles.shareButton}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            <Icon name="share-variant" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        }
      />
      
      <ScrollView style={styles.container}>
        {/* Job header */}
        <View style={styles.jobHeader}>
          <View style={styles.companyLogoContainer}>
            <Image
              source={getCompanyLogo()}
              style={styles.companyLogo}
              resizeMode="contain"
            />
          </View>
          
          <View style={styles.jobTitleContainer}>
            <Text style={[styles.jobTitle, { color: theme.colors.text }]}>
              {job.title}
            </Text>
            
            <TouchableOpacity
              onPress={() => navigation.navigate('CompanyProfile', { companyId: job.company?._id })}
              style={styles.companyContainer}
            >
              <Text style={[styles.companyName, { color: theme.colors.primary }]}>
                {job.company?.name || 'Unknown Company'}
              </Text>
            </TouchableOpacity>
            
            <View style={styles.locationContainer}>
              <Icon name="map-marker-outline" size={16} color={theme.colors.textSecondary} />
              <Text style={[styles.locationText, { color: theme.colors.textSecondary }]}>
                {job.location || 'Location not specified'}
                {job.remote && ' (Remote)'}
              </Text>
            </View>
            
            <View style={styles.postedContainer}>
              <Icon name="clock-outline" size={16} color={theme.colors.textSecondary} />
              <Text style={[styles.postedText, { color: theme.colors.textSecondary }]}>
                Posted on {formatDate(job.createdAt)}
              </Text>
            </View>
          </View>
        </View>
        
        {/* Quick info card */}
        <Card style={styles.quickInfoCard}>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                Job Type
              </Text>
              <Text style={[styles.infoValue, { color: theme.colors.text }]}>
                {formatJobType(job.type)}
              </Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                Experience
              </Text>
              <Text style={[styles.infoValue, { color: theme.colors.text }]}>
                {formatExperienceLevel(job.experienceLevel)}
              </Text>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                Salary
              </Text>
              <Text style={[styles.infoValue, { color: theme.colors.text }]}>
                {formatSalary()}
              </Text>
            </View>
            
            {job.deadline && (
              <View style={styles.infoItem}>
                <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                  Deadline
                </Text>
                <Text style={[styles.infoValue, { color: theme.colors.text }]}>
                  {formatDate(job.deadline)}
                </Text>
              </View>
            )}
          </View>
        </Card>
        
        {/* Job description */}
        <Card style={styles.sectionCard}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Job Description
          </Text>
          <Text style={[styles.descriptionText, { color: theme.colors.text }]}>
            {job.description}
          </Text>
        </Card>
        
        {/* Responsibilities */}
        {job.responsibilities && job.responsibilities.length > 0 && (
          <Card style={styles.sectionCard}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Responsibilities
            </Text>
            <View style={styles.listContainer}>
              {job.responsibilities.map((item, index) => (
                <View key={index} style={styles.listItem}>
                  <Icon name="check-circle" size={16} color={theme.colors.primary} />
                  <Text style={[styles.listItemText, { color: theme.colors.text }]}>
                    {item}
                  </Text>
                </View>
              ))}
            </View>
          </Card>
        )}
        
        {/* Requirements */}
        {job.requirements && job.requirements.length > 0 && (
          <Card style={styles.sectionCard}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Requirements
            </Text>
            <View style={styles.listContainer}>
              {job.requirements.map((item, index) => (
                <View key={index} style={styles.listItem}>
                  <Icon name="check-circle" size={16} color={theme.colors.primary} />
                  <Text style={[styles.listItemText, { color: theme.colors.text }]}>
                    {item}
                  </Text>
                </View>
              ))}
            </View>
          </Card>
        )}
        
        {/* Skills */}
        {job.requiredSkills && job.requiredSkills.length > 0 && (
          <Card style={styles.sectionCard}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Skills
            </Text>
            <View style={styles.skillsContainer}>
              {job.requiredSkills.map((skill, index) => (
                <View 
                  key={index} 
                  style={[
                    styles.skillBadge, 
                    { backgroundColor: theme.colors.primary + '20' }
                  ]}
                >
                  <Text style={[styles.skillText, { color: theme.colors.primary }]}>
                    {typeof skill === 'object' ? skill.name : skill}
                  </Text>
                </View>
              ))}
            </View>
          </Card>
        )}
        
        {/* Benefits */}
        {job.benefits && job.benefits.length > 0 && (
          <Card style={styles.sectionCard}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Benefits
            </Text>
            <View style={styles.listContainer}>
              {job.benefits.map((item, index) => (
                <View key={index} style={styles.listItem}>
                  <Icon name="check-circle" size={16} color={theme.colors.success} />
                  <Text style={[styles.listItemText, { color: theme.colors.text }]}>
                    {item}
                  </Text>
                </View>
              ))}
            </View>
          </Card>
        )}
        
        {/* Company info */}
        {job.company && (
          <Card 
            style={styles.sectionCard}
            onPress={() => navigation.navigate('CompanyProfile', { companyId: job.company._id })}
          >
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              About the Company
            </Text>
            
            <View style={styles.companyInfoContainer}>
              <Image
                source={getCompanyLogo()}
                style={styles.companyInfoLogo}
                resizeMode="contain"
              />
              
              <View style={styles.companyInfoDetails}>
                <Text style={[styles.companyInfoName, { color: theme.colors.text }]}>
                  {job.company.name}
                </Text>
                
                {job.company.location && (
                  <View style={styles.companyInfoItem}>
                    <Icon name="map-marker-outline" size={16} color={theme.colors.textSecondary} />
                    <Text style={[styles.companyInfoText, { color: theme.colors.textSecondary }]}>
                      {job.company.location}
                    </Text>
                  </View>
                )}
                
                {job.company.industry && (
                  <View style={styles.companyInfoItem}>
                    <Icon name="briefcase-outline" size={16} color={theme.colors.textSecondary} />
                    <Text style={[styles.companyInfoText, { color: theme.colors.textSecondary }]}>
                      {job.company.industry}
                    </Text>
                  </View>
                )}
                
                {job.company.website && (
                  <TouchableOpacity 
                    style={styles.companyInfoItem}
                    onPress={() => openWebsite(job.company.website)}
                  >
                    <Icon name="web" size={16} color={theme.colors.primary} />
                    <Text style={[styles.companyInfoText, { color: theme.colors.primary }]}>
                      Visit Website
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
            
            {job.company.description && (
              <Text style={[styles.companyDescription, { color: theme.colors.text }]}>
                {job.company.description.length > 150 
                  ? `${job.company.description.substring(0, 150)}...` 
                  : job.company.description}
              </Text>
            )}
            
            <View style={styles.viewProfileContainer}>
              <Text style={[styles.viewProfileText, { color: theme.colors.primary }]}>
                View Company Profile
              </Text>
              <Icon name="chevron-right" size={16} color={theme.colors.primary} />
            </View>
          </Card>
        )}
        
        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
      
      {/* Action buttons */}
      <View style={[styles.actionButtonsContainer, { backgroundColor: theme.colors.background }]}>
        <TouchableOpacity
          onPress={toggleSaveJob}
          style={[
            styles.saveButton,
            { 
              backgroundColor: isSaved 
                ? theme.colors.primary + '20' 
                : theme.colors.background,
              borderColor: theme.colors.border 
            }
          ]}
        >
          <Icon
            name={isSaved ? 'bookmark' : 'bookmark-outline'}
            size={24}
            color={isSaved ? theme.colors.primary : theme.colors.text}
          />
        </TouchableOpacity>
        
        <Button
          title={hasApplied ? "Already Applied" : "Apply Now"}
          onPress={handleApply}
          loading={isApplying}
          disabled={hasApplied}
          style={styles.applyButton}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.large,
  },
  errorText: {
    ...typography.body1,
    textAlign: 'center',
    marginVertical: spacing.medium,
  },
  retryButton: {
    marginTop: spacing.small,
  },
  shareButton: {
    padding: spacing.small,
  },
  jobHeader: {
    flexDirection: 'row',
    padding: spacing.medium,
    alignItems: 'center',
  },
  companyLogoContainer: {
    marginRight: spacing.medium,
  },
  companyLogo: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  jobTitleContainer: {
    flex: 1,
  },
  jobTitle: {
    ...typography.h5,
    fontWeight: 'bold',
    marginBottom: spacing.extraSmall,
  },
  companyContainer: {
    marginBottom: spacing.extraSmall,
  },
  companyName: {
    ...typography.subtitle1,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.extraSmall,
  },
  locationText: {
    ...typography.body2,
    marginLeft: spacing.small,
  },
  postedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postedText: {
    ...typography.caption,
    marginLeft: spacing.small,
  },
  quickInfoCard: {
    margin: spacing.medium,
    marginTop: 0,
    padding: spacing.medium,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.small,
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    ...typography.caption,
    marginBottom: 2,
  },
  infoValue: {
    ...typography.body1,
    fontWeight: '500',
  },
  sectionCard: {
    margin: spacing.medium,
    marginTop: 0,
    padding: spacing.medium,
  },
  sectionTitle: {
    ...typography.h6,
    fontWeight: 'bold',
    marginBottom: spacing.medium,
  },
  descriptionText: {
    ...typography.body1,
    lineHeight: 24,
  },
  listContainer: {
    marginTop: spacing.small,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: spacing.small,
    alignItems: 'flex-start',
  },
  listItemText: {
    ...typography.body1,
    flex: 1,
    marginLeft: spacing.small,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillBadge: {
    paddingHorizontal: spacing.medium,
    paddingVertical: spacing.small,
    borderRadius: 20,
    marginRight: spacing.small,
    marginBottom: spacing.small,
  },
  skillText: {
    ...typography.caption,
    fontWeight: '500',
  },
  companyInfoContainer: {
    flexDirection: 'row',
    marginBottom: spacing.medium,
  },
  companyInfoLogo: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: spacing.medium,
  },
  companyInfoDetails: {
    flex: 1,
  },
  companyInfoName: {
    ...typography.subtitle1,
    fontWeight: 'bold',
    marginBottom: spacing.extraSmall,
  },
  companyInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.extraSmall,
  },
  companyInfoText: {
    ...typography.body2,
    marginLeft: spacing.small,
  },
  companyDescription: {
    ...typography.body2,
    marginTop: spacing.small,
    marginBottom: spacing.medium,
  },
  viewProfileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  viewProfileText: {
    ...typography.subtitle2,
    marginRight: spacing.extraSmall,
  },
  bottomSpacing: {
    height: 80,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    padding: spacing.medium,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  saveButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    marginRight: spacing.medium,
  },
  applyButton: {
    flex: 1,
  },
});

export default JobDetailScreen;