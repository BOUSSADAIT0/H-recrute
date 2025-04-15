import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';

// Components
import Card from '../common/Card';

// Hooks and Context
import useTheme from '../../hooks/useTheme';

// Styles and Constants
import { spacing } from '../../styles/spacing';
import { typography } from '../../styles/typography';
import { JOB_TYPES } from '../../config/constants';

/**
 * JobCard component to display job listings
 * @param {Object} props - Component props
 * @param {Object} props.job - Job data object
 * @param {Function} props.onPress - Card press handler
 * @param {Object} [props.style] - Additional card style
 * @param {Function} [props.onSave] - Save/bookmark handler
 * @param {boolean} [props.isSaved] - Whether job is saved/bookmarked
 * @returns {React.ReactElement} JobCard component
 */
const JobCard = ({ job, onPress, style, onSave, isSaved: propIsSaved }) => {
  const { theme } = useTheme();
  const [isSaved, setIsSaved] = useState(propIsSaved || false);
  
  // Format job type for display
  const formatJobType = (type) => {
    const jobType = JOB_TYPES.find(item => item.id === type);
    return jobType ? jobType.label : type;
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
  
  // Format time since job was posted
  const formatTimeAgo = () => {
    return moment(job.createdAt).fromNow();
  };
  
  // Handle save/bookmark job
  const handleSave = () => {
    setIsSaved(!isSaved);
    if (onSave) {
      onSave(job, !isSaved);
    }
  };
  
  // Get default logo if company logo is not available
  const getCompanyLogo = () => {
    if (job.company?.logo) {
      return { uri: job.company.logo };
    }
    return require('../../assets/images/company-placeholder.png');
  };
  
  return (
    <Card style={[styles.card, style]} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.companyInfo}>
          <Image
            source={getCompanyLogo()}
            style={styles.companyLogo}
            resizeMode="contain"
          />
          <View style={styles.titleContainer}>
            <Text 
              style={[styles.jobTitle, { color: theme.colors.text }]}
              numberOfLines={1}
            >
              {job.title}
            </Text>
            <Text 
              style={[styles.companyName, { color: theme.colors.textSecondary }]}
              numberOfLines={1}
            >
              {job.company?.name || 'Unknown Company'}
            </Text>
          </View>
        </View>
        
        {onSave && (
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={handleSave}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            <Icon
              name={isSaved ? 'bookmark' : 'bookmark-outline'}
              size={24}
              color={isSaved ? theme.colors.primary : theme.colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          <Icon name="map-marker-outline" size={16} color={theme.colors.textSecondary} />
          <Text 
            style={[styles.detailText, { color: theme.colors.textSecondary }]}
            numberOfLines={1}
          >
            {job.location || 'Location not specified'}
            {job.remote && ' (Remote)'}
          </Text>
        </View>
        
        <View style={styles.detailItem}>
          <Icon name="briefcase-outline" size={16} color={theme.colors.textSecondary} />
          <Text 
            style={[styles.detailText, { color: theme.colors.textSecondary }]}
            numberOfLines={1}
          >
            {formatJobType(job.type)}
          </Text>
        </View>
        
        <View style={styles.detailItem}>
          <Icon name="currency-usd" size={16} color={theme.colors.textSecondary} />
          <Text 
            style={[styles.detailText, { color: theme.colors.textSecondary }]}
            numberOfLines={1}
          >
            {formatSalary()}
          </Text>
        </View>
      </View>
      
      <View style={styles.footer}>
        {job.requiredSkills && job.requiredSkills.length > 0 && (
          <View style={styles.skillsContainer}>
            {job.requiredSkills.slice(0, 3).map((skill, index) => (
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
            {job.requiredSkills.length > 3 && (
              <View style={[styles.skillBadge, { backgroundColor: theme.colors.border }]}>
                <Text style={[styles.skillText, { color: theme.colors.textSecondary }]}>
                  +{job.requiredSkills.length - 3}
                </Text>
              </View>
            )}
          </View>
        )}
        
        <Text style={[styles.timeAgo, { color: theme.colors.textSecondary }]}>
          {formatTimeAgo()}
        </Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: spacing.medium,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.small,
  },
  companyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  companyLogo: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: spacing.small,
  },
  titleContainer: {
    flex: 1,
  },
  jobTitle: {
    ...typography.subtitle1,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  companyName: {
    ...typography.body2,
  },
  saveButton: {
    padding: spacing.extraSmall,
    marginLeft: spacing.small,
  },
  detailsContainer: {
    marginBottom: spacing.small,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.extraSmall,
  },
  detailText: {
    ...typography.body2,
    marginLeft: spacing.small,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.small,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillBadge: {
    paddingHorizontal: spacing.small,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: spacing.small,
    marginBottom: spacing.extraSmall,
  },
  skillText: {
    ...typography.caption,
    fontWeight: '500',
  },
  timeAgo: {
    ...typography.caption,
  },
});

export default JobCard;