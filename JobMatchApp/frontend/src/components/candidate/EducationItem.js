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
 * EducationItem component for displaying education history
 * @param {Object} props - Component props
 * @param {Object} props.education - Education data
 * @param {Function} [props.onPress] - Item press handler
 * @param {Function} [props.onEdit] - Edit button press handler
 * @param {Function} [props.onDelete] - Delete button press handler
 * @param {Object} [props.style] - Additional container style
 * @param {boolean} [props.editable=false] - Whether item is editable
 * @returns {React.ReactElement} EducationItem component
 */
const EducationItem = ({
  education,
  onPress,
  onEdit,
  onDelete,
  style,
  editable = false,
}) => {
  const { theme } = useTheme();
  
  // Format date range
  const formatDateRange = () => {
    const startDate = education.startDate ? moment(education.startDate).format('MMM YYYY') : '';
    
    if (education.isCurrent) {
      return `${startDate} - Present`;
    }
    
    const endDate = education.endDate ? moment(education.endDate).format('MMM YYYY') : '';
    return `${startDate} - ${endDate}`;
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
        <Icon name="school" size={24} color={theme.colors.primary} />
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={[styles.degree, { color: theme.colors.text }]}>
          {education.degree}
        </Text>
        
        <Text style={[styles.institution, { color: theme.colors.textSecondary }]}>
          {education.institution}
        </Text>
        
        <Text style={[styles.dateRange, { color: theme.colors.textSecondary }]}>
          {formatDateRange()}
        </Text>
        
        {education.fieldOfStudy && (
          <Text style={[styles.field, { color: theme.colors.textSecondary }]}>
            {education.fieldOfStudy}
          </Text>
        )}
        
        {education.description && (
          <Text style={[styles.description, { color: theme.colors.text }]}>
            {education.description}
          </Text>
        )}
      </View>
      
      {editable && (
        <View style={styles.actionsContainer}>
          {onEdit && (
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={() => onEdit(education)}
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            ><Icon name="pencil" size={20} color={theme.colors.primary} />
            </TouchableOpacity>
          )}
          
          {onDelete && (
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={() => onDelete(education)}
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
  degree: {
    ...typography.subtitle1,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  institution: {
    ...typography.body2,
    marginBottom: 2,
  },
  dateRange: {
    ...typography.caption,
    marginBottom: 4,
  },
  field: {
    ...typography.body2,
    fontStyle: 'italic',
    marginBottom: 4,
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

export default EducationItem;