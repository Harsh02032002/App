import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Star, Plus, Minus, Heart } from 'lucide-react-native';
import { FoodItem } from '../types';
import { useApp } from '../context/AppContext';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';

interface FoodItemCardProps {
  foodItem: FoodItem;
  onPressCustomization?: () => void;
}

export const FoodItemCard: React.FC<FoodItemCardProps> = ({
  foodItem,
  onPressCustomization,
}) => {
  const { cartItems, addToCart, updateQuantity, favoriteFoodIds, toggleFavoriteFood } = useApp();

  const isFavorite = favoriteFoodIds.includes(foodItem.id);

  // Find total quantity of this food in cart across customization variations
  const cartEntries = cartItems.filter((i) => i.foodItem.id === foodItem.id);
  const currentQuantity = cartEntries.reduce((sum, i) => sum + i.quantity, 0);
  const firstCartItemId = cartEntries.length > 0 ? cartEntries[0].cartItemId : null;

  const handleAddClick = () => {
    if (foodItem.isCustomizable) {
      if (onPressCustomization) onPressCustomization();
    } else {
      addToCart(foodItem);
    }
  };

  const handleIncrement = () => {
    if (foodItem.isCustomizable && onPressCustomization) {
      onPressCustomization();
    } else if (firstCartItemId) {
      updateQuantity(firstCartItemId, currentQuantity + 1);
    } else {
      addToCart(foodItem);
    }
  };

  const handleDecrement = () => {
    if (firstCartItemId) {
      updateQuantity(firstCartItemId, currentQuantity - 1);
    }
  };

  return (
    <View style={styles.cardContainer}>
      <View style={styles.leftContent}>
        {/* Veg/Non-Veg Badge */}
        <View style={styles.badgeRow}>
          <View
            style={[
              styles.foodTypeSquare,
              { borderColor: foodItem.type === 'veg' ? COLORS.vegGreen : COLORS.nonVegRed },
            ]}
          >
            <View
              style={[
                styles.foodTypeDot,
                { backgroundColor: foodItem.type === 'veg' ? COLORS.vegGreen : COLORS.nonVegRed },
              ]}
            />
          </View>
          {foodItem.isBestseller && (
            <View style={styles.bestsellerBadge}>
              <Star size={10} color={COLORS.secondary} fill={COLORS.secondary} />
              <Text style={styles.bestsellerText}>BESTSELLER</Text>
            </View>
          )}
        </View>

        {/* Title */}
        <Text style={styles.title}>{foodItem.name}</Text>

        {/* Price & Discount */}
        <View style={styles.priceRow}>
          <Text style={styles.price}>₹{foodItem.price}</Text>
          {foodItem.originalPrice && (
            <Text style={styles.originalPrice}>₹{foodItem.originalPrice}</Text>
          )}
        </View>

        {/* Rating */}
        <View style={styles.ratingRow}>
          <Star size={12} color={COLORS.starYellow} fill={COLORS.starYellow} />
          <Text style={styles.ratingText}>{foodItem.rating.toFixed(1)}</Text>
          <Text style={styles.ratingCount}>({foodItem.ratingCount})</Text>
        </View>

        {/* Description */}
        <Text style={styles.description} numberOfLines={2}>
          {foodItem.description}
        </Text>
      </View>

      {/* Right Image & Add Button */}
      <View style={styles.rightContent}>
        <View style={styles.imageWrapper}>
          <Image source={{ uri: foodItem.image }} style={styles.image} />
          <TouchableOpacity
            style={styles.favIcon}
            onPress={() => toggleFavoriteFood(foodItem.id)}
            activeOpacity={0.7}
          >
            <Heart
              size={14}
              color={isFavorite ? COLORS.primary : COLORS.white}
              fill={isFavorite ? COLORS.primary : 'rgba(0,0,0,0.3)'}
            />
          </TouchableOpacity>
        </View>

        {/* Add / Stepper Button */}
        <View style={styles.buttonWrapper}>
          {currentQuantity === 0 ? (
            <TouchableOpacity style={styles.addButton} onPress={handleAddClick} activeOpacity={0.8}>
              <Text style={styles.addButtonText}>ADD</Text>
              <Plus size={14} color={COLORS.primary} style={{ marginLeft: 2 }} />
            </TouchableOpacity>
          ) : (
            <View style={styles.stepperContainer}>
              <TouchableOpacity onPress={handleDecrement} style={styles.stepperBtn}>
                <Minus size={14} color={COLORS.primary} />
              </TouchableOpacity>
              <Text style={styles.stepperText}>{currentQuantity}</Text>
              <TouchableOpacity onPress={handleIncrement} style={styles.stepperBtn}>
                <Plus size={14} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
          )}

          {foodItem.isCustomizable && (
            <Text style={styles.customizableTag}>Customizable</Text>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SPACING.md,
    backgroundColor: COLORS.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  leftContent: {
    flex: 1,
    paddingRight: SPACING.md,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  foodTypeSquare: {
    width: 15,
    height: 15,
    borderWidth: 1.5,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.xs,
  },
  foodTypeDot: {
    width: 7,
    height: 7,
    borderRadius: RADIUS.full,
  },
  bestsellerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondaryLight,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: RADIUS.xs,
  },
  bestsellerText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#D97706',
    marginLeft: 3,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  originalPrice: {
    fontSize: 12,
    color: COLORS.textMuted,
    textDecorationLine: 'line-through',
    marginLeft: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginLeft: 3,
  },
  ratingCount: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginLeft: 3,
  },
  description: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  rightContent: {
    alignItems: 'center',
    width: 110,
  },
  imageWrapper: {
    width: 100,
    height: 100,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: COLORS.borderLight,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  favIcon: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: RADIUS.full,
    padding: 4,
  },
  buttonWrapper: {
    marginTop: -18,
    alignItems: 'center',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderColor: COLORS.primary,
    borderWidth: 1.5,
    borderRadius: RADIUS.sm,
    width: 90,
    height: 34,
    ...SHADOWS.light,
  },
  addButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primary,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
    borderWidth: 1,
    borderRadius: RADIUS.sm,
    width: 90,
    height: 34,
    paddingHorizontal: SPACING.xs,
    ...SHADOWS.light,
  },
  stepperBtn: {
    padding: SPACING.xs,
  },
  stepperText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primary,
  },
  customizableTag: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 2,
  },
});
