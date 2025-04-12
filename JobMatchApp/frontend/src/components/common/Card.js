import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { spacing } from '../../styles/spacing';
import useTheme from '../../hooks/useTheme';

/**
 * Card component for displaying content in a contained, elevated card
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Card content
 * @param {Object} [props.style] - Additional container style
 * @param {Object} [props.contentStyle] - Additional content container style
 * @param {Function} [props.onPress] - Card press handler
 * @param {number} [props.elevation=2] - Card elevation (shadow)
 * @param {boolean} [props.noPadding=false] - Remove default padding
 * @returns {React.ReactElement} Card component
 */
const Card = ({
  children,
  style,
  contentStyle,
  onPress,
  elevation = 2,
  noPadding = false,
  ...rest
}) => {
  const { theme } = useTheme();
  
  // Determine if card should be pressable
  const isCardPressable = !!onPress;
  
  // Get shadow style based on elevation
  const getShadowStyle = () => {
    return {
      shadowColor: theme.colors.black,
      shadowOffset: { width: 0, height: elevation },
      shadowOpacity: 0.1,
      shadowRadius: elevation,
      elevation: elevation,
    };
  };
  
  // Base card container style
  const containerStyle = [
    styles.container,
    { 
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
    },
    getShadowStyle(),
    style,
  ];
  
  // Content padding style
  const paddingStyle = !noPadding && styles.content;
  
  // Render pressable card
  if (isCardPressable) {
    return (
      <TouchableOpacity 
        style={containerStyle}
        onPress={onPress}
        activeOpacity={0.7}
        {...rest}
      >
        <View style={[paddingStyle, contentStyle]}>
          {children}
        </View>
      </TouchableOpacity>
    );
  }
  
  // Render standard card
  return (
    <View style={containerStyle} {...rest}>
      <View style={[paddingStyle, contentStyle]}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    borderWidth: 0.5,
    marginVertical: spacing.small,
    overflow: 'hidden',
  },
  content: {
    padding: spacing.medium,
  },
});

export default Card;