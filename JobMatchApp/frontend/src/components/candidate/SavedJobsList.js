import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';

// Hooks and Context
import useTheme from '../../hooks/useTheme';

// Styles and Constants
import { spacing } from '../../styles/spacing';
import { typography } from '../../styles/typography';

/**
 * SavedJobsList component for displaying saved/bookmarked jobs
 * @param {Object} props - Component props
 * @param {Array} props.savedJobs - List of saved jobs
 * @param {Function} props.onJobPress - Job item press handler
 * @param {Function} props.onRemove - Remove button press handler
 * @param {boolean} [props.isLoading=false] - Loading state
 * @param {Object} [props.style] - Additional container style
 * @returns {React.ReactElement} SavedJobsList component
 */
const SavedJobsList = ({
  savedJobs = [],
  onJobPress,
  onRemove,
  isLoading = false,
  style
}) => {
  const { theme } = useTheme();
  
  // Format time since job was saved
  const formatTimeAgo = (date) => {
    return moment(date).fromNow();
  };
  
  // Render loading state
  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, style]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }
  
  // Render empty state
  if (savedJobs.length === 0) {
    return (
      <View style={[styles.emptyContainer, style]}>
        <Icon name="bookmark-outline" size={48} color={theme.colors.textSecondary} />
        <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
          No saved jobs
        </Text>
        <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
          Jobs you save will appear here for easy access.
        </Text>
      </View>
    );
  }
  
  // Render job list
  return (
    <FlatList
      data={savedJobs}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={[
            styles.jobItem,
            { 
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border
            }
          ]}
          onPress={() => onJobPress(item)}
        >
          <View style={styles.jobInfo}>
            <Text 
              style={[styles.jobTitle, { color: theme.colors.text }]}
              numberOfLines={1}
            >
              {item.title}
            </Text>
            <Text 
              style={[styles.companyName, { color: theme.colors.textSecondary }]}
              numberOfLines={1}
            >
              {item.company}
            </Text>
            <Text style={[styles.savedDate, { color: theme.colors.textSecondary }]}>
              Saved {formatTimeAgo(item.savedAt)}
            </Text>
          </View>
          
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => onRemove(item.id)}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            <Icon name="bookmark-remove" size={24} color={theme.colors.error} />
          </TouchableOpacity>
        </TouchableOpacity>
      )}
      style={[styles.list, style]}
      contentContainerStyle={styles.listContent}
    />
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.extraLarge,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.extraLarge,
  },
  emptyTitle: {
    ...typography.h6,
    marginTop: spacing.medium,
    marginBottom: spacing.small,
  },
  emptyText: {
    ...typography.body2,
    textAlign: 'center',
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: spacing.medium,
  },
  jobItem: {
    flexDirection: 'row',
    padding: spacing.medium,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: spacing.medium,
  },
  jobInfo: {
    flex: 1,
  },
  jobTitle: {
    ...typography.subtitle1,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  companyName: {
    ...typography.body2,
    marginBottom: 8,
  },
  savedDate: {
    ...typography.caption,
  },
  removeButton: {
    padding: spacing.small,
    marginLeft: spacing.small,
    justifyContent: 'center',
  },
});

export default SavedJobsList;