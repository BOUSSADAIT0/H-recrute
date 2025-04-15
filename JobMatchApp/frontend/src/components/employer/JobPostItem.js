import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
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

/**
 * JobPostItem component for displaying job posting in employer dashboard
 * @param {Object} props - Component props
 * @param {Object} props.job - Job data
 * @param {Function} props.onPress - Card press handler
 * @param {Function} [props.onEditPress] - Edit button press handler
 * @param {Function} [props.onDeletePress] - Delete button press handler
 * @param {Function} [props.onToggleStatus] - Toggle status button press handler
 * @param {Object} [props.style] - Additional container style
 * @returns {React.ReactElement} JobPostItem component
 */
const JobPostItem = ({
  job,
  onPress,
  onEditPress,
  onDeletePress,
  onToggleStatus,
  style,
}) => {
  const { theme } = useTheme();

  // Format date
  const formatDate = (date) => {
    return moment(date).format('MMM D, YYYY');
  };

  // Format time ago
  const formatTimeAgo = () => {
    return moment(job.createdAt).fromNow();
  };

  // Get status color
  const getStatusColor = () => {
    switch (job.status) {
      case 'active':
        return theme.colors.success;
      case 'paused':
        return theme.colors.warning;
      case 'closed':
        return theme.colors.error;
      case 'draft':
        return theme.colors.textSecondary;
      case 'filled':
        return theme.colors.accent;
      default:
        return theme.colors.textSecondary;
    }
  };

  // Format job status
  const formatStatus = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <Card style={[styles.card, style]} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={[styles.jobTitle, { color: theme.colors.text }]} numberOfLines={1}>
            {job.title}
          </Text>
          
          <View style={styles.statusContainer}>
            <View style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor() + '20' }
            ]}>
              <Text style={[styles.statusText, { color: getStatusColor() }]}>
                {formatStatus(job.status)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          <Icon name="map-marker-outline" size={16} color={theme.colors.textSecondary} />
          <Text style={[styles.detailText, { color: theme.colors.textSecondary }]} numberOfLines={1}>
            {job.location || 'Location not specified'}
            {job.remote && ' (Remote)'}
          </Text>
        </View>

        <View style={styles.detailItem}>
          <Icon name="calendar-outline" size={16} color={theme.colors.textSecondary} />
          <Text style={[styles.detailText, { color: theme.colors.textSecondary }]} numberOfLines={1}>
            Posted on {formatDate(job.createdAt)}
          </Text>
        </View>

        {job.deadline && (
          <View style={styles.detailItem}>
            <Icon name="calendar-clock" size={16} color={theme.colors.textSecondary} />
            <Text style={[styles.detailText, { color: theme.colors.textSecondary }]} numberOfLines={1}>
              Deadline: {formatDate(job.deadline)}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Icon name="eye-outline" size={16} color={theme.colors.textSecondary} />
          <Text style={[styles.statText, { color: theme.colors.textSecondary }]}>
            {job.views || 0} views
          </Text>
        </View>

        <View style={styles.statItem}>
          <Icon name="file-document-outline" size={16} color={theme.colors.textSecondary} />
          <Text style={[styles.statText, { color: theme.colors.textSecondary }]}>
            {job.applicationCount || 0} applications
          </Text>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, { borderColor: theme.colors.border }]}
          onPress={() => onEditPress(job)}
        >
          <Icon name="pencil" size={16} color={theme.colors.primary} />
          <Text style={[styles.actionText, { color: theme.colors.primary }]}>
            Edit
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { borderColor: theme.colors.border }]}
          onPress={() => onToggleStatus(job)}
        >
          <Icon 
            name={job.status === 'active' ? 'pause' : 'play'} 
            size={16} 
            color={job.status === 'active' ? theme.colors.warning : theme.colors.success} 
          />
          <Text 
            style={[
              styles.actionText, 
              { color: job.status === 'active' ? theme.colors.warning : theme.colors.success }
            ]}
          >
            {job.status === 'active' ? 'Pause' : 'Activate'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { borderColor: theme.colors.border }]}
          onPress={() => onDeletePress(job)}
        >
          <Icon name="delete" size={16} color={theme.colors.error} />
          <Text style={[styles.actionText, { color: theme.colors.error }]}>
            Delete
          </Text>
        </TouchableOpacity>
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
  titleContainer: {
    flex: 1,
  },
  jobTitle: {
    ...typography.subtitle1,
    fontWeight: 'bold',
    marginBottom: spacing.extraSmall,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.extraSmall,
  },
  statusBadge: {
    paddingHorizontal: spacing.small,
    paddingVertical: 4,
    borderRadius: 4,
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
  statsContainer: {
    flexDirection: 'row',
    marginBottom: spacing.medium,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.large,
  },
  statText: {
    ...typography.caption,
    marginLeft: spacing.small,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    paddingTop: spacing.small,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.extraSmall,
    paddingHorizontal: spacing.small,
    borderRadius: 4,
    borderWidth: 1,
  },
  actionText: {
    ...typography.caption,
    fontWeight: '500',
    marginLeft: spacing.extraSmall,
  },
});

export default JobPostItem;