import { Platform } from 'react-native';

// Font families based on platform
const fontFamilies = {
  regular: Platform.OS === 'ios' ? 'System' : 'Roboto',
  medium: Platform.OS === 'ios' ? 'System' : 'Roboto-Medium',
  light: Platform.OS === 'ios' ? 'System' : 'Roboto-Light',
  thin: Platform.OS === 'ios' ? 'System' : 'Roboto-Thin',
};

// Font weights based on platform
const fontWeights = {
  thin: Platform.OS === 'ios' ? '100' : 'normal',
  light: Platform.OS === 'ios' ? '300' : 'normal',
  regular: 'normal',
  medium: Platform.OS === 'ios' ? '500' : 'normal',
  bold: 'bold',
};

// Font configuration for React Native Paper
export const fontConfig = {
  web: {
    regular: {
      fontFamily: fontFamilies.regular,
      fontWeight: fontWeights.regular,
    },
    medium: {
      fontFamily: fontFamilies.medium,
      fontWeight: fontWeights.medium,
    },
    light: {
      fontFamily: fontFamilies.light,
      fontWeight: fontWeights.light,
    },
    thin: {
      fontFamily: fontFamilies.thin,
      fontWeight: fontWeights.thin,
    },
  },
  ios: {
    regular: {
      fontFamily: fontFamilies.regular,
      fontWeight: fontWeights.regular,
    },
    medium: {
      fontFamily: fontFamilies.medium,
      fontWeight: fontWeights.medium,
    },
    light: {
      fontFamily: fontFamilies.light,
      fontWeight: fontWeights.light,
    },
    thin: {
      fontFamily: fontFamilies.thin,
      fontWeight: fontWeights.thin,
    },
  },
  android: {
    regular: {
      fontFamily: fontFamilies.regular,
      fontWeight: fontWeights.regular,
    },
    medium: {
      fontFamily: fontFamilies.medium,
      fontWeight: fontWeights.medium,
    },
    light: {
      fontFamily: fontFamilies.light,
      fontWeight: fontWeights.light,
    },
    thin: {
      fontFamily: fontFamilies.thin,
      fontWeight: fontWeights.thin,
    },
  },
};

// Typography styles for consistent text styling
export const typography = {
  // Headlines
  h1: {
    fontFamily: fontFamilies.light,
    fontWeight: fontWeights.light,
    fontSize: 96,
    letterSpacing: -1.5,
    lineHeight: 112,
  },
  h2: {
    fontFamily: fontFamilies.light,
    fontWeight: fontWeights.light,
    fontSize: 60,
    letterSpacing: -0.5,
    lineHeight: 72,
  },
  h3: {
    fontFamily: fontFamilies.regular,
    fontWeight: fontWeights.regular,
    fontSize: 48,
    letterSpacing: 0,
    lineHeight: 56,
  },
  h4: {
    fontFamily: fontFamilies.regular,
    fontWeight: fontWeights.regular,
    fontSize: 34,
    letterSpacing: 0.25,
    lineHeight: 40,
  },
  h5: {
    fontFamily: fontFamilies.regular,
    fontWeight: fontWeights.regular,
    fontSize: 24,
    letterSpacing: 0,
    lineHeight: 32,
  },
  h6: {
    fontFamily: fontFamilies.medium,
    fontWeight: fontWeights.medium,
    fontSize: 20,
    letterSpacing: 0.15,
    lineHeight: 28,
  },
  
  // Subtitles
  subtitle1: {
    fontFamily: fontFamilies.regular,
    fontWeight: fontWeights.regular,
    fontSize: 16,
    letterSpacing: 0.15,
    lineHeight: 24,
  },
  subtitle2: {
    fontFamily: fontFamilies.medium,
    fontWeight: fontWeights.medium,
    fontSize: 14,
    letterSpacing: 0.1,
    lineHeight: 20,
  },
  
  // Body
  body1: {
    fontFamily: fontFamilies.regular,
    fontWeight: fontWeights.regular,
    fontSize: 16,
    letterSpacing: 0.5,
    lineHeight: 24,
  },
  body2: {
    fontFamily: fontFamilies.regular,
    fontWeight: fontWeights.regular,
    fontSize: 14,
    letterSpacing: 0.25,
    lineHeight: 20,
  },
  
  // Other
  button: {
    fontFamily: fontFamilies.medium,
    fontWeight: fontWeights.medium,
    fontSize: 14,
    letterSpacing: 1.25,
    lineHeight: 16,
    textTransform: 'uppercase',
  },
  caption: {
    fontFamily: fontFamilies.regular,
    fontWeight: fontWeights.regular,
    fontSize: 12,
    letterSpacing: 0.4,
    lineHeight: 16,
  },
  overline: {
    fontFamily: fontFamilies.regular,
    fontWeight: fontWeights.regular,
    fontSize: 10,
    letterSpacing: 1.5,
    lineHeight: 16,
    textTransform: 'uppercase',
  },
};

export default {
  fontFamilies,
  fontWeights,
  fontConfig,
  typography,
};