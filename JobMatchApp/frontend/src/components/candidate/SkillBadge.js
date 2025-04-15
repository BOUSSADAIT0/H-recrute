import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

// Hooks and Context
import useTheme from '../../hooks/useTheme';

// Styles and Constants
import { spacing } from '../../styles/spacing';
import { typography } from '../../styles/typography';

/**
 * SkillBadge component for displaying skills
 * @param {Object} props - Component props
 * @param {string} props.name - Skill name
 * @param {string} [props.level] - Skill level
 * @param {boolean} [props.selectable=false] - Whether badge is selectable
 * @param {boolean} [props.selected=false] - Whether badge is selected
 * @param {Function} [props.onPress] - Badge press handler
 * @param {Object} [props.style] - Additional container style
 * @returns {React.ReactElement} SkillBadge component
 */
const SkillBadge = ({
  name,
  level,
  selectable = false,
  selected = false,
  onPress,
  style,
}) => {
  const { theme } = useTheme();
  
  // Get badge colors based on selection state
  const getBadgeColors = () => {
    if (selectable) {
      if (selected) {
        return {
          backgroundColor: theme.colors.primary,
          textColor: theme.colors.white,
        };
      } else {
        return {
          backgroundColor: theme.colors.background,
          textColor: theme.colors.text,
        };
      }
    } else {
      return {
        backgroundColor: theme.colors.primary + '20',
        textColor: theme.colors.primary,
      };
    }
  };
  
  const { backgroundColor, textColor } = getBadgeColors();
  
  // Create badge component
  const Badge = () => (
    <View
      style={[
        styles.badge,
        { backgroundColor, borderColor: selected ? theme.colors.primary : theme.colors.border },
        style,
      ]}
    >
      <Text style={[styles.badgeText, { color: textColor }]}>
        {name}
      </Text>
      {level && (
        <Text style={[styles.levelText, { color: textColor }]}>
          {` • ${level}`}
        </Text>
      )}
    </View>
  );
  
  // Render pressable or static badge
  if (selectable && onPress) {
    return (
      <TouchableOpacity onPress={() => onPress(name)} activeOpacity={0.7}>
        <Badge />
      </TouchableOpacity>
    );
  }
  
  return <Badge />;
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: spacing.small,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: spacing.small,
    marginBottom: spacing.small,
  },
  badgeText: {
    ...typography.caption,
    fontWeight: '500',
  },
  levelText: {
    ...typography.caption,
  },
});

export default SkillBadge;