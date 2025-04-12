import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';
import useTheme from '../../hooks/useTheme';

/**
 * Loading component to display during async operations
 * @param {Object} props - Component props
 * @param {string} [props.size='large'] - Size of the activity indicator
 * @param {string} [props.color] - Color of the activity indicator
 * @param {string} [props.message='Loading...'] - Message to display
 * @param {boolean} [props.fullScreen=true] - Whether to display full screen
 * @returns {React.ReactElement} Loading component
 */
const Loading = ({ 
  size = 'large', 
  color,
  message = 'Loading...', 
  fullScreen = true 
}) => {
  const { theme, isDarkMode } = useTheme();
  
  // Use provided color or theme primary color
  const indicatorColor = color || theme.colors.primary;
  
  if (fullScreen) {
    return (
      <View style={[
        styles.container, 
        { backgroundColor: theme.colors.background }
      ]}>
        <ActivityIndicator size={size} color={indicatorColor} />
        {message ? (
          <Text style={[
            styles.message, 
            { color: theme.colors.text }
          ]}>
            {message}
          </Text>
        ) : null}
      </View>
    );
  }
  
  return (
    <View style={styles.loaderContainer}>
      <ActivityIndicator size={size} color={indicatorColor} />
      {message ? (
        <Text style={[
          styles.message, 
          { color: theme.colors.text }
        ]}>
          {message}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  loaderContainer: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    ...typography.body2,
    marginTop: 10,
    textAlign: 'center',
  },
});

export default Loading;