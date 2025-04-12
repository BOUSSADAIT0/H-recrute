import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';

// Components
import TextInput from '../../components/common/TextInput';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';

// Hooks and Context
import useAuth from '../../hooks/useAuth';
import useTheme from '../../hooks/useTheme';

// Styles and Constants
import { globalStyles } from '../../styles/globalStyles';
import { spacing } from '../../styles/spacing';
import { typography } from '../../styles/typography';
import { ROUTES } from '../../config/constants';

// Validation schema
const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const LoginScreen = ({ navigation }) => {
  const { login, isLoading, error, clearError } = useAuth();
  const { theme } = useTheme();
  
  // Local state
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Handle form submission
  const handleLogin = async (values) => {
    setIsSubmitting(true);
    try {
      await login(values.email, values.password);
      // On success, the auth context will update and redirect the user
    } catch (error) {
      // Error handling is already done in the auth context
      console.log('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Clear any auth errors when component unmounts or when user starts typing
  const handleInputFocus = () => {
    if (error) {
      clearError();
    }
  };
  
  // Loading state
  if (isLoading && !isSubmitting) {
    return <Loading />;
  }
  
  return (
    <SafeAreaView style={[globalStyles.safeArea, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            {/* Logo section */}
            <View style={styles.logoContainer}>
              <Image
                source={require('../../assets/images/logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={[styles.appName, { color: theme.colors.primary }]}>
                JobMatchApp
              </Text>
              <Text style={[styles.tagline, { color: theme.colors.textSecondary }]}>
                Find Your Perfect Career Match
              </Text>
            </View>
            
            {/* Form section */}
            <View style={styles.formContainer}>
              {/* Form title */}
              <Text style={[styles.title, { color: theme.colors.text }]}>
                Sign In
              </Text>
              
              {/* Error message */}
              {error && (
                <View style={[styles.errorContainer, { backgroundColor: theme.colors.error + '20' }]}>
                  <Text style={[styles.errorText, { color: theme.colors.error }]}>
                    {error}
                  </Text>
                </View>
              )}
              
              {/* Login form */}
              <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={LoginSchema}
                onSubmit={handleLogin}
              >
                {({
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  values,
                  errors,
                  touched,
                }) => (
                  <View style={styles.form}>
                    <TextInput
                      label="Email"
                      placeholder="Enter your email"
                      value={values.email}
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                      error={touched.email && errors.email}
                      onFocus={handleInputFocus}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      icon="email-outline"
                      required
                    />
                    
                    <TextInput
                      label="Password"
                      placeholder="Enter your password"
                      value={values.password}
                      onChangeText={handleChange('password')}
                      onBlur={handleBlur('password')}
                      error={touched.password && errors.password}
                      onFocus={handleInputFocus}
                      secureTextEntry
                      icon="lock-outline"
                      required
                    />
                    
                    <TouchableOpacity
                      onPress={() => navigation.navigate(ROUTES.AUTH.FORGOT_PASSWORD)}
                      style={styles.forgotPasswordContainer}
                    >
                      <Text style={[styles.forgotPassword, { color: theme.colors.primary }]}>
                        Forgot Password?
                      </Text>
                    </TouchableOpacity>
                    
                    <Button
                      title="Sign In"
                      onPress={handleSubmit}
                      loading={isSubmitting}
                      style={styles.loginButton}
                      fullWidth
                    />
                  </View>
                )}
              </Formik>
            </View>
            
            {/* Register section */}
            <View style={styles.registerContainer}>
              <Text style={[styles.registerText, { color: theme.colors.textSecondary }]}>
                Don't have an account?
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate(ROUTES.AUTH.REGISTER)}
                style={styles.registerButton}
              >
                <Text style={[styles.registerButtonText, { color: theme.colors.primary }]}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: spacing.large,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.extraLarge,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: spacing.medium,
  },
  appName: {
    ...typography.h4,
    fontWeight: 'bold',
    marginBottom: spacing.small,
  },
  tagline: {
    ...typography.subtitle1,
  },
  formContainer: {
    marginBottom: spacing.extraLarge,
  },
  title: {
    ...typography.h5,
    marginBottom: spacing.large,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  errorContainer: {
    padding: spacing.medium,
    borderRadius: 8,
    marginBottom: spacing.medium,
  },
  errorText: {
    ...typography.body2,
    textAlign: 'center',
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: spacing.large,
  },
  forgotPassword: {
    ...typography.body2,
  },
  loginButton: {
    marginTop: spacing.medium,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    ...typography.body2,
    marginRight: spacing.small,
  },
  registerButtonText: {
    ...typography.subtitle2,
    fontWeight: 'bold',
  },
});

export default LoginScreen;