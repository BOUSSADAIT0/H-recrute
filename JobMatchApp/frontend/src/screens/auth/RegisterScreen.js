import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Picker } from '@react-native-picker/picker';

// Components
import TextInput from '../../components/common/TextInput';
import Button from '../../components/common/Button';
import Header from '../../components/common/Header';
import Card from '../../components/common/Card';

// Hooks and Context
import useAuth from '../../hooks/useAuth';
import useTheme from '../../hooks/useTheme';

// Styles and Constants
import { globalStyles } from '../../styles/globalStyles';
import { spacing } from '../../styles/spacing';
import { typography } from '../../styles/typography';
import { USER_ROLES, ROUTES } from '../../config/constants';

// Validation schema
const RegisterSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
  role: Yup.string()
    .oneOf([USER_ROLES.JOB_SEEKER, USER_ROLES.EMPLOYER], 'Invalid role')
    .required('Role is required'),
});

const RegisterScreen = ({ navigation }) => {
  const { register, isLoading, error, clearError } = useAuth();
  const { theme } = useTheme();
  
  // Local state
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Handle form submission
  const handleRegister = async (values) => {
    setIsSubmitting(true);
    try {
      // Remove confirmPassword as it's not needed in the API
      const { confirmPassword, ...userData } = values;
      await register(userData);
      // On success, the auth context will update and redirect the user
    } catch (error) {
      // Error handling is already done in the auth context
      console.log('Registration error:', error);
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
  
  return (
    <SafeAreaView style={[globalStyles.safeArea, { backgroundColor: theme.colors.background }]}>
      <Header
        title="Create Account"
        showBackButton
        onBackPress={() => navigation.goBack()}
      />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidView}
      >
        <ScrollView
          contentContainerStyle={[
            globalStyles.scrollViewContent,
            { backgroundColor: theme.colors.background }
          ]}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <Card style={styles.formCard}>
              {/* Form title */}
              <Text style={[styles.title, { color: theme.colors.text }]}>
                Sign Up for JobMatchApp
              </Text>
              
              <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                Please fill out the form below to create your account.
              </Text>
              
              {/* Error message */}
              {error && (
                <View style={[styles.errorContainer, { backgroundColor: theme.colors.error + '20' }]}>
                  <Text style={[styles.errorText, { color: theme.colors.error }]}>
                    {error}
                  </Text>
                </View>
              )}
              
              {/* Register form */}
              <Formik
                initialValues={{
                  firstName: '',
                  lastName: '',
                  email: '',
                  password: '',
                  confirmPassword: '',
                  role: USER_ROLES.JOB_SEEKER,
                }}
                validationSchema={RegisterSchema}
                onSubmit={handleRegister}
              >
                {({
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  values,
                  errors,
                  touched,
                  setFieldValue,
                }) => (
                  <View style={styles.form}>
                    <View style={styles.row}>
                      <View style={styles.halfColumn}>
                        <TextInput
                          label="First Name"
                          placeholder="Enter first name"
                          value={values.firstName}
                          onChangeText={handleChange('firstName')}
                          onBlur={handleBlur('firstName')}
                          error={touched.firstName && errors.firstName}
                          onFocus={handleInputFocus}
                          icon="account-outline"
                          required
                        />
                      </View>
                      
                      <View style={styles.halfColumn}>
                        <TextInput
                          label="Last Name"
                          placeholder="Enter last name"
                          value={values.lastName}
                          onChangeText={handleChange('lastName')}
                          onBlur={handleBlur('lastName')}
                          error={touched.lastName && errors.lastName}
                          onFocus={handleInputFocus}
                          required
                        />
                      </View>
                    </View>
                    
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
                      placeholder="Enter password"
                      value={values.password}
                      onChangeText={handleChange('password')}
                      onBlur={handleBlur('password')}
                      error={touched.password && errors.password}
                      onFocus={handleInputFocus}
                      secureTextEntry
                      icon="lock-outline"
                      required
                    />
                    
                    <TextInput
                      label="Confirm Password"
                      placeholder="Confirm your password"
                      value={values.confirmPassword}
                      onChangeText={handleChange('confirmPassword')}
                      onBlur={handleBlur('confirmPassword')}
                      error={touched.confirmPassword && errors.confirmPassword}
                      onFocus={handleInputFocus}
                      secureTextEntry
                      icon="lock-check-outline"
                      required
                    />
                    
                    <View style={styles.pickerContainer}>
                      <Text style={[styles.label, { color: theme.colors.text }]}>
                        I am a...
                        <Text style={{ color: theme.colors.error }}> *</Text>
                      </Text>
                      
                      <View style={[
                        styles.picker,
                        {
                          backgroundColor: theme.colors.background,
                          borderColor: theme.colors.border,
                        }
                      ]}>
                        <Picker
                          selectedValue={values.role}
                          onValueChange={(itemValue) => setFieldValue('role', itemValue)}
                          style={{ color: theme.colors.text }}
                        >
                          <Picker.Item
                            label="Job Seeker"
                            value={USER_ROLES.JOB_SEEKER}
                          />
                          <Picker.Item
                            label="Employer"
                            value={USER_ROLES.EMPLOYER}
                          />
                        </Picker>
                      </View>
                      
                      {touched.role && errors.role && (
                        <Text style={[globalStyles.errorText, { color: theme.colors.error }]}>
                          {errors.role}
                        </Text>
                      )}
                    </View>
                    
                    <Button
                      title="Create Account"
                      onPress={handleSubmit}
                      loading={isSubmitting}
                      style={styles.registerButton}
                      fullWidth
                    />
                  </View>
                )}
              </Formik>
            </Card>
            
            {/* Login section */}
            <View style={styles.loginContainer}>
              <Text style={[styles.loginText, { color: theme.colors.textSecondary }]}>
                Already have an account?
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate(ROUTES.AUTH.LOGIN)}
                style={styles.loginButton}
              >
                <Text style={[styles.loginButtonText, { color: theme.colors.primary }]}>
                  Sign In
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
  container: {
    flex: 1,
    padding: spacing.medium,
  },
  formCard: {
    padding: spacing.medium,
  },
  title: {
    ...typography.h5,
    marginBottom: spacing.small,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body2,
    marginBottom: spacing.large,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfColumn: {
    width: '48%',
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
  pickerContainer: {
    marginBottom: spacing.medium,
  },
  label: {
    ...typography.subtitle2,
    marginBottom: spacing.extraSmall,
  },
  picker: {
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: spacing.small,
  },
  registerButton: {
    marginTop: spacing.large,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.large,
  },
  loginText: {
    ...typography.body2,
    marginRight: spacing.small,
  },
  loginButtonText: {
    ...typography.subtitle2,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;