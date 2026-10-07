import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Star, Clock, MapPin, Heart, Tag } from 'lucide-react-native';
import { Restaurant } from '../types';
import { useApp } from '../context/AppContext';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onPress: () => void;
  horizontal?: boolean;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  onPress,
  horizontal = false,
}) => {
  const { favoriteRestaurantIds, toggleFavoriteRestaurant } = useApp();
  const isFavorite = favoriteRestaurantIds.includes(restaurant.id);

  if (horizontal) {
    return (
      <TouchableOpacity
        style={styles.horizontalCard}
        onPress={onPress}
        activeOpacity={0.88}
      >
        <Image source={{ uri: restaurant.coverImage }} style={styles.horizontalImage} />
        
        {/* Heart Favorite Button */}
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => toggleFavoriteRestaurant(restaurant.id)}
          activeOpacity={0.7}
        >
          <Heart
            size={16}
            color={isFavorite ? COLORS.primary : COLORS.white}
            fill={isFavorite ? COLORS.primary : 'transparent'}
          />
        </TouchableOpacity>

        <View style={styles.horizontalContent}>
          <View style={styles.ratingBadge}>
            <Star size={12} color={COLORS.white} fill={COLORS.white} />
            <Text style={styles.ratingText}>{restaurant.rating.toFixed(1)}</Text>
          </View>

          <Text style={styles.name} numberOfLines={1}>
            {restaurant.name}
          </Text>

          <Text style={styles.cuisines} numberOfLines={1}>
            {restaurant.cuisines.join(' • ')}
          </Text>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Clock size={12} color={COLORS.textSecondary} />
              <Text style={styles.metaText}>{restaurant.deliveryTimeMinutes} mins</Text>
            </View>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.metaText}>₹{restaurant.costForTwo} for two</Text>
          </View>

          {restaurant.offerBadge && (
            <View style={styles.offerTag}>
              <Tag size={12} color={COLORS.primary} />
              <Text style={styles.offerText} numberOfLines={1}>
                {restaurant.offerBadge}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={styles.verticalCard}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: restaurant.coverImage }} style={styles.verticalImage} />
        
        {/* Promoted Badge */}
        {restaurant.isPromoted && (
          <View style={styles.promotedBadge}>
            <Text style={styles.promotedText}>PROMOTED</Text>
          </View>
        )}

        {/* Favorite Heart */}
        <TouchableOpacity
          style={styles.favoriteButtonLarge}
          onPress={() => toggleFavoriteRestaurant(restaurant.id)}
          activeOpacity={0.7}
        >
          <Heart
            size={18}
            color={isFavorite ? COLORS.primary : COLORS.white}
            fill={isFavorite ? COLORS.primary : 'rgba(0,0,0,0.3)'}
          />
        </TouchableOpacity>

        {/* Offer Overlay Ribbon */}
        {restaurant.offerBadge && (
          <View style={styles.offerRibbon}>
            <Tag size={12} color={COLORS.white} />
            <Text style={styles.offerRibbonText}>{restaurant.offerBadge}</Text>
          </View>
        )}
      </View>

      <View style={styles.cardInfo}>
        <View style={styles.titleRow}>
          <Text style={styles.name} numberOfLines={1}>
            {restaurant.name}
          </Text>
          <View style={styles.ratingBadge}>
            <Star size={12} color={COLORS.white} fill={COLORS.white} />
            <Text style={styles.ratingText}>{restaurant.rating.toFixed(1)}</Text>
          </View>
        </View>

        <Text style={styles.cuisines} numberOfLines={1}>
          {restaurant.cuisines.join(' • ')}
        </Text>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Clock size={14} color={COLORS.textSecondary} />
            <Text style={styles.metaText}>{restaurant.deliveryTimeMinutes} mins</Text>
          </View>
          <Text style={styles.dot}>•</Text>
          <View style={styles.metaItem}>
            <MapPin size={14} color={COLORS.textSecondary} />
            <Text style={styles.metaText}>{restaurant.distanceKm} km</Text>
          </View>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.metaText}>₹{restaurant.costForTwo} for two</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Vertical Card Styles
  verticalCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: RADIUS.lg,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.medium,
  },
  imageContainer: {
    height: 170,
    position: 'relative',
    backgroundColor: COLORS.borderLight,
  },
  verticalImage: {
    width: '100%',
    height: '100%',
  },
  promotedBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.xs,
  },
  promotedText: {
    color: COLORS.white,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  favoriteButtonLarge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  offerRibbon: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: 4,
  },
  offerRibbonText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 6,
  },

  // Card Info
  cardInfo: {
    padding: SPACING.md,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginRight: SPACING.sm,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.vegGreen,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.xs,
  },
  ratingText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 3,
  },
  cuisines: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 3,
  },
  dot: {
    marginHorizontal: 6,
    color: COLORS.textMuted,
    fontSize: 12,
  },

  // Horizontal Card Styles
  horizontalCard: {
    width: 220,
    backgroundColor: COLORS.cardBackground,
    borderRadius: RADIUS.lg,
    marginRight: SPACING.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.light,
  },
  horizontalImage: {
    width: '100%',
    height: 120,
  },
  horizontalContent: {
    padding: SPACING.sm,
    position: 'relative',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 26,
    height: 26,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  offerTag: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.xs,
  },
  offerText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primary,
    marginLeft: 4,
  },
});
