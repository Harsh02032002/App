import React from 'react';
import { TouchableOpacity, Text, Image, StyleSheet, View } from 'react-native';
import { Category } from '../types';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';

interface CategoryCardProps {
  category: Category;
  isSelected?: boolean;
  onPress: (categoryName: string) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, isSelected, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.container, isSelected && styles.selectedContainer]}
      onPress={() => onPress(category.name)}
      activeOpacity={0.8}
    >
      <View style={styles.imageWrapper}>
        <Image source={{ uri: category.image }} style={styles.image} resizeMode="cover" />
      </View>
      <Text style={[styles.title, isSelected && styles.selectedTitle]} numberOfLines={1}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: 76,
    marginRight: SPACING.md,
  },
  selectedContainer: {
    transform: [{ scale: 1.05 }],
  },
  imageWrapper: {
    width: 64,
    height: 64,
    borderRadius: RADIUS.full,
    overflow: 'hidden',
    backgroundColor: COLORS.borderLight,
    marginBottom: SPACING.xs,
    borderWidth: 2,
    borderColor: COLORS.primaryLight,
    ...SHADOWS.light,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  selectedTitle: {
    color: COLORS.primary,
    fontWeight: '700',
  },
});
