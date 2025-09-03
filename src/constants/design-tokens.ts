// ==================== DESIGN SYSTEM TOKENS ====================

export const DESIGN_TOKENS = {
  // Unified spacing system
  spacing: {
    xs: "0.5rem",    // 8px
    sm: "0.75rem",   // 12px  
    md: "1rem",      // 16px
    lg: "1.5rem",    // 24px
    xl: "2rem",      // 32px
    xxl: "3rem",     // 48px
  },

  // Typography scale
  typography: {
    xs: "text-xs",      // 12px
    sm: "text-sm",      // 14px
    base: "text-base",  // 16px
    lg: "text-lg",      // 18px
    xl: "text-xl",      // 20px
    "2xl": "text-2xl",  // 24px
    "3xl": "text-3xl",  // 30px
    "4xl": "text-4xl",  // 36px
    "5xl": "text-5xl",  // 48px
  },

  // Responsive breakpoints mapping
  responsive: {
    sm: "sm:",
    md: "md:",
    lg: "lg:",
    xl: "xl:",
  },

  // Consistent padding patterns
  padding: {
    card: "p-4 sm:p-6",
    section: "p-3 sm:p-4", 
    compact: "p-2 sm:p-3",
    spacious: "p-6 sm:p-8",
  },

  // Border radius system
  radius: {
    sm: "rounded",
    md: "rounded-md", 
    lg: "rounded-lg",
    xl: "rounded-xl",
    full: "rounded-full",
  },

  // Shadow system
  shadows: {
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
    xl: "shadow-xl",
    "2xl": "shadow-2xl",
  },

  // Animation durations
  animation: {
    fast: "duration-200",
    normal: "duration-300", 
    slow: "duration-500",
    transition: "transition-all",
  },
} as const;

export const UNIFIED_STYLES = {
  // Unified Card System - Gestalt principles with consistent borders and subtle hierarchy
  cardPrimary: `bg-white border-2 border-red-500/20 ${DESIGN_TOKENS.radius.lg} ${DESIGN_TOKENS.shadows.md} hover:shadow-lg ${DESIGN_TOKENS.animation.transition}`,
  cardSecondary: `bg-white border border-gray-200 ${DESIGN_TOKENS.radius.lg} ${DESIGN_TOKENS.shadows.sm} hover:shadow-md ${DESIGN_TOKENS.animation.transition}`,
  cardAccent: `bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 ${DESIGN_TOKENS.radius.lg} ${DESIGN_TOKENS.shadows.sm} hover:shadow-md ${DESIGN_TOKENS.animation.transition}`,
  cardSuccess: `bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 ${DESIGN_TOKENS.radius.lg} ${DESIGN_TOKENS.shadows.sm} hover:shadow-md ${DESIGN_TOKENS.animation.transition}`,
  cardDark: `bg-gradient-to-br from-gray-900 to-gray-800 text-white border border-gray-700 ${DESIGN_TOKENS.radius.lg} ${DESIGN_TOKENS.shadows.md} hover:shadow-lg ${DESIGN_TOKENS.animation.transition}`,
  
  // Content containers with subtle visual separations
  contentBlock: `bg-gray-50/50 border border-gray-100 ${DESIGN_TOKENS.radius.md} p-3 sm:p-4`,
  contentBlockAccent: `bg-red-50/50 border border-red-100 ${DESIGN_TOKENS.radius.md} p-3 sm:p-4`,
  contentBlockSuccess: `bg-green-50/50 border border-green-100 ${DESIGN_TOKENS.radius.md} p-3 sm:p-4`,
  
  // Typography combinations
  titlePrimary: `${DESIGN_TOKENS.typography.xl} font-bold text-gray-900`,
  titleSecondary: `${DESIGN_TOKENS.typography.lg} font-semibold text-gray-800`,
  bodyText: `${DESIGN_TOKENS.typography.sm} sm:${DESIGN_TOKENS.typography.base} text-gray-700 leading-relaxed`,
  captionText: `${DESIGN_TOKENS.typography.xs} sm:${DESIGN_TOKENS.typography.sm} text-gray-600`,
  
  // Interactive elements with consistent styling
  buttonPrimary: `bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus:ring-red-500/50 ${DESIGN_TOKENS.animation.transition}`,
  buttonSecondary: `bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 ${DESIGN_TOKENS.animation.transition}`,
  buttonSuccess: `bg-green-600 text-white hover:bg-green-700 active:bg-green-800 focus:ring-green-500/50 ${DESIGN_TOKENS.animation.transition}`,
  
  // Link styles with consistent behavior
  linkPrimary: `text-red-600 hover:text-red-700 font-medium ${DESIGN_TOKENS.animation.transition} hover:underline`,
  linkSecondary: `text-gray-600 hover:text-gray-800 ${DESIGN_TOKENS.animation.transition}`,
  
  // Unified spacing system
  sectionSpacing: `space-y-6`,
  cardSpacing: `space-y-4 sm:space-y-5`,
} as const;