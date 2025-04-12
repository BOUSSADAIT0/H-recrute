import { StyleSheet } from 'react-native';
import { colors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';

// Global styles to be used throughout the app
export const globalStyles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    flex: 1,
    padding: spacing.medium,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.medium,
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: spacing.medium,
  },
  
  // Section styles
  section: {
    marginBottom: spacing.large,
  },
  sectionTitle: {
    ...typography.h5,
    marginBottom: spacing.small,
    color: colors.text,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: spacing.medium,
    marginBottom: spacing.medium,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  
  // Form styles
  formGroup: {
    marginBottom: spacing.medium,
  },
  label: {
    ...typography.subtitle2,
    marginBottom: spacing.extraSmall,
    color: colors.text,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.medium,
    backgroundColor: colors.background,
    color: colors.text,
    marginBottom: spacing.small,
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
    marginTop: spacing.extraSmall,
  },
  
  // Button styles
  buttonContainer: {
    marginVertical: spacing.medium,
  },
  button: {
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonPrimary: {
    backgroundColor: colors.primary,
  },
  buttonSecondary: {
    backgroundColor: colors.accent,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  buttonText: {
    ...typography.button,
    color: colors.white,
  },
  buttonOutlineText: {
    ...typography.button,
    color: colors.primary,
  },
  
  // Text styles
  title: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.medium,
  },
  subtitle: {
    ...typography.subtitle1,
    color: colors.textSecondary,
    marginBottom: spacing.medium,
  },
  bodyText: {
    ...typography.body1,
    color: colors.text,
  },
  captionText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  
  // List styles
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  listItemTitle: {
    ...typography.subtitle1,
    color: colors.text,
  },
  listItemSubtitle: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  
  // Image styles
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  coverImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  icon: {
    width: 24,
    height: 24,
  },
  
  // Utility styles
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  flexStart: {
    justifyContent: 'flex-start',
  },
  flexEnd: {
    justifyContent: 'flex-end',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  flex1: {
    flex: 1,
  },
  
  // Margin and padding utility classes
  mt1: { marginTop: spacing.extraSmall },
  mt2: { marginTop: spacing.small },
  mt3: { marginTop: spacing.medium },
  mt4: { marginTop: spacing.large },
  mt5: { marginTop: spacing.extraLarge },
  
  mb1: { marginBottom: spacing.extraSmall },
  mb2: { marginBottom: spacing.small },
  mb3: { marginBottom: spacing.medium },
  mb4: { marginBottom: spacing.large },
  mb5: { marginBottom: spacing.extraLarge },
  
  ml1: { marginLeft: spacing.extraSmall },
  ml2: { marginLeft: spacing.small },
  ml3: { marginLeft: spacing.medium },
  ml4: { marginLeft: spacing.large },
  ml5: { marginLeft: spacing.extraLarge },
  
  mr1: { marginRight: spacing.extraSmall },
  mr2: { marginRight: spacing.small },
  mr3: { marginRight: spacing.medium },
  mr4: { marginRight: spacing.large },
  mr5: { marginRight: spacing.extraLarge },
  
  pt1: { paddingTop: spacing.extraSmall },
  pt2: { paddingTop: spacing.small },
  pt3: { paddingTop: spacing.medium },
  pt4: { paddingTop: spacing.large },
  pt5: { paddingTop: spacing.extraLarge },
  
  pb1: { paddingBottom: spacing.extraSmall },
  pb2: { paddingBottom: spacing.small },
  pb3: { paddingBottom: spacing.medium },
  pb4: { paddingBottom: spacing.large },
  pb5: { paddingBottom: spacing.extraLarge },
  
  pl1: { paddingLeft: spacing.extraSmall },
  pl2: { paddingLeft: spacing.small },
  pl3: { paddingLeft: spacing.medium },
  pl4: { paddingLeft: spacing.large },
  pl5: { paddingLeft: spacing.extraLarge },
  
  pr1: { paddingRight: spacing.extraSmall },
  pr2: { paddingRight: spacing.small },
  pr3: { paddingRight: spacing.medium },
  pr4: { paddingRight: spacing.large },
  pr5: { paddingRight: spacing.extraLarge },
});

export default globalStyles;