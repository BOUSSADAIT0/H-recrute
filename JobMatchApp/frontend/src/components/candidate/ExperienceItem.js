import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';

// Hooks and Context
import useTheme from '../../hooks/useTheme';

// Styles and Constants
import { spacing } from '../../styles/spacing';
import { typography } from '../../styles/typography';

/**
 * ExperienceItem component for displaying work experience
 * @param {Object} props - Component props
 * @param {Object} props.experience - Work experience data
 * @param {Function} [props.onPress] - Item press handler
 * @param {Function} [props.onEdit] - Edit button press handler
 * @param {Function} [props.onDelete] - Delete button press handler
 * @param {Object} [props.style] - Additional container style
 * @param {boolean} [props.editable=false] - Whether item is editable
 * @returns {React.ReactElement} ExperienceItem component
 */
const ExperienceItem = ({
  experience,
  onPress,
  onEdit,
  onDelete,
  style,
  editable = false,
}) => {
  const { theme } = useTheme();
  
  // Format date range
  const formatDateRange = () => {
    const startDate = experience.startDate ? moment(experience.startDate).format('MMM YYYY') : '';
    
    if (experience.isCurrent) {
      return `${startDate} - Present`;
    }
    
    const endDate = experience.endDate ? moment(experience.endDate).format('MMM YYYY') : '';
    return `${startDate} - ${endDate}`;
  };
  
  // Calculate duration
  const calculateDuration = () => {
    if (!experience.startDate) return '';
    
    const startDate = moment(experience.startDate);
    const endDate = experience.isCurrent ? moment() : moment(experience.endDate);
    
    const years = endDate.diff(startDate, 'years');
    const months = endDate.diff(startDate, 'months') % 12;
    
    if (years === 0) {
      return `${months} ${months === 1 ? 'month' : 'months'}`;
    } else if (months === 0) {
      return `${years} ${years === 1 ? 'year' : 'years'}`;
    } else {
      return `${years} ${years === 1 ? 'year' : 'years'} ${months} ${months === 1 ? 'month' : 'months'}`;
    }
  };
  
  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        { 
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border
        },
        style,
      ]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.iconContainer}>
        <Icon name="briefcase" size={24} color={theme.colors.primary} />
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          {experience.title}
        </Text>
        
        <Text style={[styles.company, { color: theme.colors.textSecondary }]}>
          {experience.company}
          {experience.location && ` • ${experience.location}`}
        </Text>
        
        <View style={styles.dateContainer}>
          <Text style={[styles.dateRange, { color: theme.colors.textSecondary }]}>
            {formatDateRange()}
          </Text>
          <Text style={[styles.duration, { color: theme.colors.textSecondary }]}>
            ({calculateDuration()})
          </Text>
        </View>
        
        {experience.description && (
          <Text style={[styles.description, { color: theme.colors.text }]}>
            {experience.description}
          </Text>
        )}
      </View>
      
      {editable && (
        <View style={styles.actionsContainer}>
          {onEdit && (
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={() => onEdit(experience)}
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            >
              <Icon name="pencil" size={20} color={theme.colors.primary} />
            </TouchableOpacity>
          )}
          
          {onDelete && (
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={() => onDelete(experience)}
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            >
              <Icon name="delete" size={20} color={theme.colors.error} />
            </TouchableOpacity>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: spacing.medium,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: spacing.medium,
  },
  iconContainer: {
    marginRight: spacing.medium,
    paddingTop: 2,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    ...typography.subtitle1,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  company: {
    ...typography.body2,
    marginBottom: 2,
  },
  dateContainer: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  dateRange: {
    ...typography.caption,
    marginRight: spacing.small,
  },
  duration: {
    ...typography.caption,
    fontStyle: 'italic',
  },
  description: {
    ...typography.body2,
    marginTop: spacing.small,
  },
  actionsContainer: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: spacing.small,
    marginLeft: spacing.small,
  },
});

export default ExperienceItem;