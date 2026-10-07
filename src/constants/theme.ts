export const COLORS = {
  primary: '#FF385C',
  primaryDark: '#D92244',
  primaryLight: '#FFEBF0',
  secondary: '#FFB800',
  secondaryLight: '#FFF8E5',
  accent: '#7C3AED',
  accentLight: '#F3E8FF',
  
  // Status Colors
  vegGreen: '#00B562',
  nonVegRed: '#E53935',
  starYellow: '#FFB800',
  infoBlue: '#2196F3',
  
  // Grays & Neutral
  background: '#F8F9FA',
  cardBackground: '#FFFFFF',
  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  
  // Special
  overlay: 'rgba(0, 0, 0, 0.5)',
  shimmer: '#E0E0E0',
  shadowColor: '#171717',
  white: '#FFFFFF',
  black: '#000000',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const SHADOWS = {
  light: {
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  heavy: {
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
};
