import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  View 
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';
import { spacing } from '../../styles/spacing';
import useTheme from '../../hooks/useTheme';

/**
 * Custom button component
 * @param {Object} props - Component props
 * @param {string} props.title - Button label text
 * @param {function} props.onPress - Button press handler
 * @param {string} [props.type='primary'] - Button type (primary, secondary, outline, text)
 * @param {boolean} [props.loading=false] - Show loading indicator
 * @param {boolean} [props.disabled=false] - Disable button
 * @param {string} [props.icon] - Icon name from Material Community Icons
 * @param {Object} [props.style] - Additional container style
 * @param {Object} [props.textStyle] - Additional text style
 * @param {Object} [props.iconStyle] - Additional icon style
 * @param {string} [props.size='medium'] - Button size (small, medium, large)
 * @param {boolean} [props.fullWidth=false] - Full width button
 * @param {any} [props.children] - Child components (alternative to title)
 * @returns {React.ReactElement} Button component
 */
const Button = ({ 
  title,
  onPress,
  type = 'primary',
  loading = false,
  disabled = false,
  icon,
  style,
  textStyle,
  iconStyle,
  size = 'medium',
  fullWidth = false,
  children,
  ...rest
}) => {
  const { theme } = useTheme();
  
  // Determine button styles based on type
  const getButtonStyles = () => {
    switch (type) {
      case 'secondary':
        return {
          backgroundColor: theme.colors.accent,
          borderColor: theme.colors.accent,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: theme.colors.primary,
          borderWidth: 1,
        };
      case 'text':
        return {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
        };
      case 'primary':
      default:
        return {
          backgroundColor: theme.colors.primary,
          borderColor: theme.colors.primary,
        };
    }
  };
  
  // Determine text color based on button type
  const getTextColor = () => {
    switch (type) {
      case 'outline':
      case 'text':
        return theme.colors.primary;
      case 'primary':
      case 'secondary':
      default:
        return colors.white;
    }
  };
  
  // Determine icon color based on button type
  const getIconColor = () => {
    return getTextColor();
  };
  
  // Determine button padding based on size
  const getPadding = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: spacing.small,
          paddingHorizontal: spacing.medium,
        };
      case 'large':
        return {
          paddingVertical: spacing.large,
          paddingHorizontal: spacing.extraLarge,
        };
      case 'medium':
      default:
        return {
          paddingVertical: spacing.medium,
          paddingHorizontal: spacing.large,
        };
    }
  };
  
  // Get text font size based on button size
  const getTextSize = () => {
    switch (size) {
      case 'small':
        return { fontSize: 12 };
      case 'large':
        return { fontSize: 16 };
      case 'medium':
      default:
        return { fontSize: 14 };
    }
  };
  
  // Get icon size based on button size
  const getIconSize = () => {
    switch (size) {
      case 'small':
        return 16;
      case 'large':
        return 24;
      case 'medium':
      default:
        return 20;
    }
  };
  
  return (
    <TouchableOpacity
      onPress={loading ? null : onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[
        styles.button,
        getButtonStyles(),
        getPadding(),
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={getTextColor()} 
          style={styles.activityIndicator} 
        />
      ) : (
        <View style={styles.contentContainer}>
          {icon && (
            <Icon
              name={icon}
              size={getIconSize()}
              color={getIconColor()}
              style={[styles.icon, iconStyle]}
            />
          )}
          
          {children || (
            <Text
              style={[
                styles.text,
                getTextSize(),
                { color: getTextColor() },
                disabled && styles.disabledText,
                textStyle,
              ]}
            >
              {title}
            </Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  fullWidth: {
    width: '100%',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    ...typography.button,
    textAlign: 'center',
  },
  icon: {
    marginRight: spacing.small,
  },
  disabled: {
    opacity: 0.6,
  },
  disabledText: {
    opacity: 0.8,
  },
  activityIndicator: {
    marginHorizontal: spacing.small,
  },
});

export default Button;