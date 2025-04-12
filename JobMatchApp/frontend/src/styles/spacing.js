// Base spacing unit (in pixels)
const baseUnit = 8;

// Spacing scale
export const spacing = {
  // Named spacing values
  none: 0,
  extraSmall: baseUnit / 2, // 4px
  small: baseUnit, // 8px
  medium: baseUnit * 2, // 16px
  large: baseUnit * 3, // 24px
  extraLarge: baseUnit * 4, // 32px
  huge: baseUnit * 6, // 48px
  
  // Numeric spacing values
  // These are useful when you need precise control
  get unit() { return baseUnit; },
  get halfUnit() { return baseUnit / 2; },
  get doubleUnit() { return baseUnit * 2; },
  get tripleUnit() { return baseUnit * 3; },
  get quadrupleUnit() { return baseUnit * 4; },
  
  // Layout spacing
  screenPadding: baseUnit * 2, // 16px
  sectionGap: baseUnit * 3, // 24px
  componentGap: baseUnit, // 8px
  
  // Form spacing
  formGroupMargin: baseUnit * 2, // 16px
  inputPadding: baseUnit, // 8px
  inputMargin: baseUnit, // 8px
  
  // List spacing
  listItemPadding: baseUnit * 1.5, // 12px
  listItemGap: baseUnit, // 8px
};

// Generate numeric spacing values (1-10)
for (let i = 1; i <= 10; i++) {
  spacing[i] = baseUnit * i;
}

export default spacing;