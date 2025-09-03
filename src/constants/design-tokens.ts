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
  // Card variants
  cardBase: `bg-white border border-gray-200 ${DESIGN_TOKENS.radius.lg} ${DESIGN_TOKENS.shadows.sm}`,
  cardElevated: `bg-white border border-gray-200 ${DESIGN_TOKENS.radius.lg} ${DESIGN_TOKENS.shadows.lg}`,
  cardDark: `bg-gray-900 text-white border border-gray-800 ${DESIGN_TOKENS.radius.lg} ${DESIGN_TOKENS.shadows.xl}`,
  
  // Typography combinations
  titlePrimary: `${DESIGN_TOKENS.typography.xl} font-bold text-foreground`,
  titleSecondary: `${DESIGN_TOKENS.typography.lg} font-semibold text-foreground`,
  bodyText: `${DESIGN_TOKENS.typography.sm} text-muted-foreground leading-relaxed`,
  captionText: `${DESIGN_TOKENS.typography.xs} text-muted-foreground`,
  
  // Interactive elements
  buttonPrimary: `bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus:ring-red-500`,
  buttonSecondary: `bg-gray-100 text-gray-800 hover:bg-gray-200 active:bg-gray-300 focus:ring-gray-300`,
  buttonSuccess: `bg-green-600 text-white hover:bg-green-700 active:bg-green-800 focus:ring-green-500`,
  
  // Link styles  
  linkPrimary: `text-red-600 hover:text-red-700 font-medium ${DESIGN_TOKENS.animation.transition}`,
  linkSecondary: `text-gray-600 hover:text-gray-800 ${DESIGN_TOKENS.animation.transition}`,
} as const;