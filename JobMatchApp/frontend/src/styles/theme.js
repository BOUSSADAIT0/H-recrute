import { DefaultTheme, configureFonts } from 'react-native-paper';
import { colors } from './colors';
import { fontConfig } from './typography';

// Base theme configuration for React Native Paper
export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    accent: colors.accent,
    background: colors.background,
    surface: colors.surface,
    text: colors.text,
    error: colors.error,
    disabled: colors.disabled,
    placeholder: colors.placeholder,
    backdrop: colors.backdrop,
    notification: colors.notification,
  },
  fonts: configureFonts(fontConfig),
  roundness: 8,
  animation: {
    scale: 1.0,
  },
};

// Dark theme configuration
export const darkTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primaryDark,
    accent: colors.accentDark,
    background: colors.backgroundDark,
    surface: colors.surfaceDark,
    text: colors.textDark,
    error: colors.errorDark,
    disabled: colors.disabledDark,
    placeholder: colors.placeholderDark,
    backdrop: colors.backdropDark,
    notification: colors.notificationDark,
  },
  fonts: configureFonts(fontConfig),
  roundness: 8,
  animation: {
    scale: 1.0,
  },
};

// Theme context provider values
export const themeOptions = {
  light: theme,
  dark: darkTheme,
};

export default {
  theme,
  darkTheme,
  themeOptions,
};