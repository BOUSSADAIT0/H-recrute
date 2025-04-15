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
 * ApplicationItem component for displaying job applications in employer view
 * @param {Object} props - Component props
 * @param {Object} props.application - Application data
 * @param {Function} props.onPress - Card press handler
 * @param {Function} [props.onStatusChange] - Status change handler
 * @param {Object} [props.style] - Additional container style
 * @returns {React.ReactElement} ApplicationItem component
 */
const ApplicationItem = ({
  application,
  onPress,
  onStatusChange,
  style,
}) => {
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
  
  // Get profile picture
  const getProfilePicture = () => {
    if (application.applicant?.profilePicture) {
      return { uri: application.applicant.profilePicture };
    }
    return require('../../assets/images/default-profile.png');
  };
  
  // Handle status change
  const handleStatusChange = (newStatus) => {
    if (onStatusChange) {
      onStatusChange(application._id, newStatus);
    }
  };
  
  // Get next action based on current status
  const getNextAction = () => {
    switch (application.status) {
      case APPLICATION_STATUS.PENDING:
        return {
          label: 'Review',
          status: APPLICATION_STATUS.REVIEWING,
          icon: 'eye',
          color: theme.colors.info
        };
      case APPLICATION_STATUS.REVIEWING:
        return {
          label: 'Interview',
          status: APPLICATION_STATUS.INTERVIEWED,
          icon: 'calendar-account',
          color: theme.colors.accent
        };
      case APPLICATION_STATUS.INTERVIEWED:
        return {
          label: 'Offer',
          status: APPLICATION_STATUS.OFFERED,
          icon: 'check-circle',
          color: theme.colors.success
        };
      case APPLICATION_STATUS.OFFERED:
        return {
          label: 'Hire',
          status: APPLICATION_STATUS.HIRED,
          icon: 'briefcase',
          color: theme.colors.success
        };
      default:
        return null;
    }
  };
  
  const nextAction = getNextAction();
  
  return (
    <Card style={[styles.card, style]} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.applicantInfo}>
          <Image
            source={getProfilePicture()}
            style={styles.profilePicture}
            resizeMode="cover"
          />
          <View style={styles.nameContainer}>
            <Text 
              style={[styles.applicantName, { color: theme.colors.text }]}
              numberOfLines={1}
            >
              {application.applicant?.firstName} {application.applicant?.lastName}
            </Text>
            
            {application.applicant?.title && (
              <Text 
                style={[styles.applicantTitle, { color: theme.colors.textSecondary }]}
                numberOfLines={1}
              >
                {application.applicant.title}
              </Text>
            )}
            
            {application.applicant?.location && (
              <View style={styles.locationContainer}>
                <Icon name="map-marker-outline" size={14} color={theme.colors.textSecondary} />
                <Text 
                  style={[styles.locationText, { color: theme.colors.textSecondary }]}
                  numberOfLines={1}
                >
                  {application.applicant.location}
                </Text>
              </View>
            )}
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
          <Icon name="calendar" size={16} color={theme.colors.textSecondary} />
          <Text 
            style={[styles.detailText, { color: theme.colors.textSecondary }]}
            numberOfLines={1}
          >
            Applied on {formatDate(application.createdAt)}
          </Text>
        </View>
        
        {application.matchScore && (
          <View style={styles.detailItem}>
            <Icon name="percent" size={16} color={theme.colors.textSecondary} />
            <Text 
              style={[styles.detailText, { color: theme.colors.textSecondary }]}
              numberOfLines={1}
            >
              {application.matchScore}% match
            </Text>
          </View>
        )}
        
        {application.lastUpdated && (
          <View style={styles.detailItem}>
            <Icon name="clock-outline" size={16} color={theme.colors.textSecondary} />
            <Text 
              style={[styles.detailText, { color: theme.colors.textSecondary }]}
              numberOfLines={1}
            >
              Last updated {moment(application.lastUpdated).fromNow()}
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.viewButton}
          onPress={onPress}
        >
          <Text style={[styles.viewButtonText, { color: theme.colors.primary }]}>
            View Details
          </Text>
          <Icon name="chevron-right" size={16} color={theme.colors.primary} />
        </TouchableOpacity>
        
        {nextAction && (
          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: nextAction.color + '20', borderColor: nextAction.color }
            ]}
            onPress={() => handleStatusChange(nextAction.status)}
          >
            <Icon name={nextAction.icon} size={16} color={nextAction.color} />
            <Text style={[styles.actionButtonText, { color: nextAction.color }]}>
              {nextAction.label}
            </Text>
          </TouchableOpacity>
        )}
        
        {application.status !== APPLICATION_STATUS.REJECTED && (
          <TouchableOpacity
            style={[
              styles.rejectButton,
              { backgroundColor: theme.colors.error + '20', borderColor: theme.colors.error }
            ]}
            onPress={() => handleStatusChange(APPLICATION_STATUS.REJECTED)}
          >
            <Icon name="close" size={16} color={theme.colors.error} />
            <Text style={[styles.rejectButtonText, { color: theme.colors.error }]}>
              Reject
            </Text>
          </TouchableOpacity>
        )}
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
  applicantInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: spacing.small,
  },
  nameContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  applicantName: {
    ...typography.subtitle1,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  applicantTitle: {
    ...typography.body2,
    marginBottom: 2,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    ...typography.caption,
    marginLeft: 4,
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
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    paddingTop: spacing.small,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 'auto',
  },
  viewButtonText: {
    ...typography.button,
    marginRight: spacing.extraSmall,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.extraSmall,
    paddingHorizontal: spacing.small,
    borderRadius: 4,
    borderWidth: 1,
    marginLeft: spacing.small,
  },
  actionButtonText: {
    ...typography.caption,
    fontWeight: '500',
    marginLeft: 4,
  },
  rejectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.extraSmall,
    paddingHorizontal: spacing.small,
    borderRadius: 4,
    borderWidth: 1,
    marginLeft: spacing.small,
  },
  rejectButtonText: {
    ...typography.caption,
    fontWeight: '500',
    marginLeft: 4,
  },
});

export default ApplicationItem;