import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  StatusBar, 
  Platform,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';
import { spacing } from '../../styles/spacing';
import useTheme from '../../hooks/useTheme';

/**
 * Custom Header component for screens
 * @param {Object} props - Component props
 * @param {string} props.title - Header title
 * @param {boolean} [props.showBackButton=false] - Show back button
 * @param {Function} [props.onBackPress] - Custom back button handler
 * @param {React.ReactNode} [props.rightComponent] - Component to render on the right
 * @param {Object} [props.style] - Additional container style
 * @param {Object} [props.titleStyle] - Additional title style
 * @param {boolean} [props.transparent=false] - Transparent header
 * @param {string} [props.leftIcon] - Custom left icon
 * @returns {React.ReactElement} Header component
 */
const Header = ({
  title,
  showBackButton = false,
  onBackPress,
  rightComponent,
  style,
  titleStyle,
  transparent = false,
  leftIcon,
}) => {
  const navigation = useNavigation();
  const { theme, isDarkMode } = useTheme();
  
  // Default back handler uses navigation
  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };
  
  // Status bar style based on theme
  const statusBarStyle = isDarkMode ? 'light-content' : 'dark-content';
  
  return (
    <>
      <StatusBar
        barStyle={statusBarStyle}
        backgroundColor={transparent ? 'transparent' : theme.colors.background}
        translucent={transparent}
      />
      
      <SafeAreaView
        style={[
          { backgroundColor: transparent ? 'transparent' : theme.colors.background },
        ]}
      >
        <View
          style={[
            styles.container,
            { backgroundColor: transparent ? 'transparent' : theme.colors.background },
            style,
          ]}
        >
          <View style={styles.leftContainer}>
            {showBackButton && (
              <TouchableOpacity
                onPress={handleBackPress}
                style={styles.backButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Icon
                  name={leftIcon || 'arrow-left'}
                  size={24}
                  color={theme.colors.text}
                />
              </TouchableOpacity>
            )}
          </View>
          
          <View style={styles.titleContainer}>
            <Text
              style={[
                styles.title,
                { color: theme.colors.text },
                titleStyle,
              ]}
              numberOfLines={1}
            >
              {title}
            </Text>
          </View>
          
          <View style={styles.rightContainer}>
            {rightComponent}
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.medium,
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  leftContainer: {
    width: 40,
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  rightContainer: {
    width: 40,
    alignItems: 'flex-end',
  },
  title: {
    ...typography.h6,
  },
  backButton: {
    padding: spacing.small,
    marginLeft: -spacing.small,
  },
});

export default Header;