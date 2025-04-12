import React, { useState } from 'react';
import { 
  View, 
  TextInput as RNTextInput, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';
import { spacing } from '../../styles/spacing';
import useTheme from '../../hooks/useTheme';

/**
 * Custom TextInput component
 * @param {Object} props - Component props
 * @param {string} [props.label] - Input label
 * @param {string} [props.placeholder] - Input placeholder
 * @param {string} [props.value] - Input value
 * @param {Function} [props.onChangeText] - Text change handler
 * @param {string} [props.error] - Error message
 * @param {boolean} [props.secureTextEntry] - Password input
 * @param {string} [props.icon] - Left icon name
 * @param {string} [props.rightIcon] - Right icon name
 * @param {Function} [props.onRightIconPress] - Right icon press handler
 * @param {boolean} [props.multiline] - Multiline input
 * @param {Object} [props.style] - Additional container style
 * @param {Object} [props.inputStyle] - Additional input style
 * @param {boolean} [props.required] - Mark field as required
 * @returns {React.ReactElement} TextInput component
 */
const TextInput = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  secureTextEntry,
  icon,
  rightIcon,
  onRightIconPress,
  multiline = false,
  style,
  inputStyle,
  required = false,
  ...rest
}) => {
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);
  
  // Handle password visibility toggle
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  
  // Determine if password toggle should be shown
  const showPasswordToggle = secureTextEntry;
  
  // Determine border color based on state
  const getBorderColor = () => {
    if (error) return theme.colors.error;
    if (isFocused) return theme.colors.primary;
    return theme.colors.border;
  };
  
  // Input height for multiline
  const getInputHeight = () => {
    if (multiline) return { minHeight: 100, textAlignVertical: 'top' };
    return { height: 50 };
  };
  
  return (
    <View style={[styles.container, style]}>
      {/* Label */}
      {label && (
        <View style={styles.labelContainer}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            {label}
            {required && <Text style={{ color: theme.colors.error }}> *</Text>}
          </Text>
        </View>
      )}
      
      {/* Input container */}
      <View
        style={[
          styles.inputContainer,
          { 
            borderColor: getBorderColor(),
            backgroundColor: theme.colors.background,
          },
          getInputHeight(),
        ]}
      >
        {/* Left icon */}
        {icon && (
          <Icon
            name={icon}
            size={20}
            color={isFocused ? theme.colors.primary : theme.colors.textSecondary}
            style={styles.leftIcon}
          />
        )}
        
        {/* Text input */}
        <RNTextInput
          style={[
            styles.input,
            { color: theme.colors.text },
            inputStyle,
          ]}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          multiline={multiline}
          {...rest}
        />
        
        {/* Right icon or password toggle */}
        {(rightIcon || showPasswordToggle) && (
          <TouchableOpacity
            onPress={showPasswordToggle ? togglePasswordVisibility : onRightIconPress}
            style={styles.rightIconContainer}
          >
            <Icon
              name={
                showPasswordToggle
                  ? isPasswordVisible
                    ? 'eye-off'
                    : 'eye'
                  : rightIcon
              }
              size={20}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>
      
      {/* Error message */}
      {error && (
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.medium,
  },
  labelContainer: {
    marginBottom: spacing.extraSmall,
  },
  label: {
    ...typography.subtitle2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: spacing.medium,
  },
  input: {
    ...typography.body1,
    flex: 1,
    paddingVertical: spacing.small,
  },
  leftIcon: {
    marginRight: spacing.small,
  },
  rightIconContainer: {
    padding: spacing.small,
    marginRight: -spacing.small,
  },
  errorText: {
    ...typography.caption,
    marginTop: spacing.extraSmall,
  },
});

export default TextInput;