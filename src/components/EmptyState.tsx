import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ShoppingBag, Heart, Bell, UtensilsCrossed } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';

interface EmptyStateProps {
  type: 'cart' | 'favourites' | 'orders' | 'notifications' | 'search';
  title: string;
  subtitle: string;
  buttonText?: string;
  onPressButton?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  title,
  subtitle,
  buttonText,
  onPressButton,
}) => {
  const getIcon = () => {
    switch (type) {
      case 'cart':
        return <ShoppingBag size={48} color={COLORS.primary} />;
      case 'favourites':
        return <Heart size={48} color={COLORS.primary} />;
      case 'orders':
        return <UtensilsCrossed size={48} color={COLORS.primary} />;
      case 'notifications':
        return <Bell size={48} color={COLORS.primary} />;
      default:
        return <ShoppingBag size={48} color={COLORS.primary} />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>{getIcon()}</View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      {buttonText && onPressButton && (
        <TouchableOpacity style={styles.button} onPress={onPressButton} activeOpacity={0.8}>
          <Text style={styles.buttonText}>{buttonText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xxl,
    backgroundColor: COLORS.cardBackground,
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: SPACING.xl,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    ...SHADOWS.medium,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
  },
});
