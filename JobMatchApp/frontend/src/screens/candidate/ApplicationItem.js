import React from 'react';
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
import { APPLICATION_STATUS } from '../../config/constants';

/**
 * ApplicationItem component to display job application items
 * @param {Object} props - Component props
 * @param {Object} props.application - Application data
 * @param {Function} props.onPress - Card press handler
 * @param {Object} [props.style] - Additional container style
 * @returns {React.ReactElement} ApplicationItem component
 */
const ApplicationItem = ({ application, onPress, style }) => {
  const { theme } = useTheme();
  
  // Get status color based on application status
  const getStatusColor = () => {
    switch (application.status) {
      case APPLICATION_STATUS.PENDING:
        return theme.colors.statusPending;
      case APPLICATION_STATUS.REVIEWING:
        return theme.colors.info;
      case APPLICATION_STATUS.INTERVIEWED:
        return theme.colors.accent;
      case APPLICATION_STATUS.REJECTED:
        return theme.colors.error;
      case APPLICATION_STATUS.OFFERED:
        return theme.colors.success;
      case APPLICATION_STATUS.HIRED:
        return theme.colors.success;
      case APPLICATION_STATUS.WITHDRAWN:
        return theme.colors.disabled;
      default:
        return theme.colors.textSecondary;
    }
  };
  
  // Format application status for display
  const formatStatus = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };
  
  // Format application date
  const formatDate = (date) => {
    return moment(date).format('MMM D, YYYY');
  };
  
  // Format time since application
  const formatTimeAgo = () => {
    return moment(application.createdAt).fromNow();
  };
  
  // Get company logo
  const getCompanyLogo = () => {
    if (application.job?.company?.logo) {
      return { uri: application.job.company.logo };
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
              {application.job?.title || 'Unknown Job'}
            </Text>
            <Text 
              style={[styles.companyName, { color: theme.colors.textSecondary }]}
              numberOfLines={1}
            >
              {application.job?.company?.name || 'Unknown Company'}
            </Text>
          </View>
        </View>
        
        <View style={[
          styles.statusBadge, 
          { backgroundColor: getStatusColor() + '20' }
        ]}>
          <Text style={[styles.statusText, { color: getStatusColor() }]}>
            {formatStatus(application.status)}
          </Text>
        </View>
      </View>
      
      <View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          <Icon name="map-marker-outline" size={16} color={theme.colors.textSecondary} />
          <Text 
            style={[styles.detailText, { color: theme.colors.textSecondary }]}
            numberOfLines={1}
          >
            {application.job?.location || 'Location not specified'}
          </Text>
        </View>
        
        <View style={styles.detailItem}>
          <Icon name="calendar-outline" size={16} color={theme.colors.textSecondary} />
          <Text 
            style={[styles.detailText, { color: theme.colors.textSecondary }]}
            numberOfLines={1}
          >
            Applied on {formatDate(application.createdAt)}
          </Text>
        </View>
        
        {application.interviewDate && (
          <View style={styles.detailItem}>
            <Icon name="calendar-clock" size={16} color={theme.colors.accent} />
            <Text 
              style={[styles.detailText, { color: theme.colors.accent }]}
              numberOfLines={1}
            >
              Interview on {formatDate(application.interviewDate)}
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.footer}>
        {application.lastUpdated && (
          <Text style={[styles.timeAgo, { color: theme.colors.textSecondary }]}>
            Updated {moment(application.lastUpdated).fromNow()}
          </Text>
        )}
        
        <View style={styles.actionsContainer}>
          <Icon name="chevron-right" size={20} color={theme.colors.textSecondary} />
        </View>
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
  statusBadge: {
    paddingHorizontal: spacing.small,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: spacing.small,
  },
  statusText: {
    ...typography.caption,
    fontWeight: '500',
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
  timeAgo: {
    ...typography.caption,
  },
  actionsContainer: {
    flexDirection: 'row',
  },
});

export default ApplicationItem;