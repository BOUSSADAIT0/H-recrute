// Base palette
const palette = {
    // Primary colors
    blue: {
      100: '#E3F2FD',
      200: '#BBDEFB',
      300: '#90CAF9',
      400: '#64B5F6',
      500: '#2196F3',  // Primary
      600: '#1E88E5',
      700: '#1976D2',
      800: '#1565C0',
      900: '#0D47A1',
    },
    
    // Secondary colors
    teal: {
      100: '#E0F2F1',
      200: '#B2DFDB',
      300: '#80CBC4',
      400: '#4DB6AC',
      500: '#009688',  // Accent
      600: '#00897B',
      700: '#00796B',
      800: '#00695C',
      900: '#004D40',
    },
    
    // Grey
    grey: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#EEEEEE',
      300: '#E0E0E0',
      400: '#BDBDBD',
      500: '#9E9E9E',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },
    
    // Status colors
    success: '#4CAF50',
    warning: '#FFC107',
    error: '#F44336',
    info: '#2196F3',
    
    // Others
    white: '#FFFFFF',
    black: '#000000',
    transparent: 'transparent',
  };
  
  // Light theme colors
  export const colors = {
    primary: palette.blue[500],
    primaryLight: palette.blue[300],
    primaryDark: palette.blue[700],
    
    accent: palette.teal[500],
    accentLight: palette.teal[300],
    accentDark: palette.teal[700],
    
    background: palette.white,
    surface: palette.white,
    card: palette.grey[50],
    
    text: palette.grey[900],
    textSecondary: palette.grey[700],
    textDisabled: palette.grey[500],
    
    border: palette.grey[300],
    divider: palette.grey[200],
    
    success: palette.success,
    warning: palette.warning,
    error: palette.error,
    info: palette.info,
    
    disabled: palette.grey[300],
    placeholder: palette.grey[500],
    backdrop: 'rgba(0, 0, 0, 0.5)',
    notification: palette.error,
    
    // Application status colors
    statusPending: '#FFC107',
    statusReviewing: '#2196F3',
    statusInterviewed: '#9C27B0',
    statusOffered: '#4CAF50',
    statusRejected: '#F44336',
    statusWithdrawn: '#9E9E9E',
    statusHired: '#009688',
  };
  
  // Dark theme colors
  export const colorsDark = {
    primaryDark: palette.blue[400],
    accentDark: palette.teal[400],
    backgroundDark: palette.grey[900],
    surfaceDark: palette.grey[800],
    cardDark: palette.grey[800],
    
    textDark: palette.grey[100],
    textSecondaryDark: palette.grey[300],
    textDisabledDark: palette.grey[500],
    
    borderDark: palette.grey[700],
    dividerDark: palette.grey[700],
    
    disabledDark: palette.grey[700],
    placeholderDark: palette.grey[500],
    backdropDark: 'rgba(0, 0, 0, 0.7)',
    notificationDark: palette.error,
  };
  
  // Combine all colors for export
  export default {
    ...colors,
    ...colorsDark,
    palette,
  };