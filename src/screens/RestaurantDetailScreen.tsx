import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {
  ArrowLeft,
  Heart,
  Share2,
  Star,
  Clock,
  MapPin,
  Tag,
  Search,
  ArrowRight,
  Info,
  ThumbsUp,
} from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { MOCK_RESTAURANTS, MOCK_FOOD_ITEMS } from '../data/mockData';
import { FoodItemCard } from '../components/FoodItemCard';
import { FoodCustomizationModal } from '../components/FoodCustomizationModal';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';

interface Props {
  restaurantId: string;
  onBack: () => void;
  onNavigateCart: () => void;
}

export const RestaurantDetailScreen: React.FC<Props> = ({
  restaurantId,
  onBack,
  onNavigateCart,
}) => {
  const {
    favoriteRestaurantIds,
    toggleFavoriteRestaurant,
    cartItems,
    grandTotal,
    activeCustomizationFood,
    setActiveCustomizationFood,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'menu' | 'reviews' | 'about'>('menu');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [vegOnly, setVegOnly] = useState<boolean>(false);

  const restaurant = MOCK_RESTAURANTS.find((r) => r.id === restaurantId) || MOCK_RESTAURANTS[0];
  const isFavorite = favoriteRestaurantIds.includes(restaurant.id);

  // Dishes for this restaurant (or fallback mock items)
  let restaurantDishes = MOCK_FOOD_ITEMS.filter(
    (f) => f.restaurantId === restaurant.id || restaurant.id === 'rest-1'
  );

  if (vegOnly) {
    restaurantDishes = restaurantDishes.filter((f) => f.type === 'veg');
  }

  if (selectedCategory !== 'All') {
    restaurantDishes = restaurantDishes.filter((f) => f.category === selectedCategory);
  }

  // Categories list extracted dynamically
  const availableCategories = ['All', ...Array.from(new Set(MOCK_FOOD_ITEMS.map((f) => f.category)))];

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Top Cover Image Banner */}
        <View style={styles.coverImageContainer}>
          <Image source={{ uri: restaurant.coverImage }} style={styles.coverImage} />

          {/* Top Actions Overlay */}
          <View style={styles.topActionsRow}>
            <TouchableOpacity style={styles.iconCircleBtn} onPress={onBack} activeOpacity={0.8}>
              <ArrowLeft size={20} color={COLORS.textPrimary} />
            </TouchableOpacity>

            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                style={styles.iconCircleBtn}
                onPress={() => toggleFavoriteRestaurant(restaurant.id)}
                activeOpacity={0.8}
              >
                <Heart
                  size={20}
                  color={isFavorite ? COLORS.primary : COLORS.textPrimary}
                  fill={isFavorite ? COLORS.primary : 'transparent'}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Restaurant Header Details Card */}
        <View style={styles.restaurantHeaderCard}>
          <View style={styles.titleRow}>
            <Text style={styles.restaurantName}>{restaurant.name}</Text>
            <View style={styles.ratingBadge}>
              <Star size={14} color={COLORS.white} fill={COLORS.white} />
              <Text style={styles.ratingText}>{restaurant.rating.toFixed(1)}</Text>
            </View>
          </View>

          <Text style={styles.cuisines}>{restaurant.cuisines.join(' • ')}</Text>
          <Text style={styles.addressText} numberOfLines={1}>
            <MapPin size={12} color={COLORS.textMuted} /> {restaurant.address}
          </Text>

          {/* Meta Info Row */}
          <View style={styles.metaInfoRow}>
            <View style={styles.metaPill}>
              <Clock size={14} color={COLORS.primary} />
              <Text style={styles.metaPillText}>{restaurant.deliveryTimeMinutes} mins</Text>
            </View>
            <View style={styles.metaPill}>
              <MapPin size={14} color={COLORS.primary} />
              <Text style={styles.metaPillText}>{restaurant.distanceKm} km</Text>
            </View>
            <View style={styles.metaPill}>
              <Text style={styles.metaPillText}>₹{restaurant.costForTwo} for 2</Text>
            </View>
          </View>

          {/* Offer Banner */}
          {restaurant.offerBadge && (
            <View style={styles.offerBanner}>
              <Tag size={14} color={COLORS.primary} />
              <Text style={styles.offerBannerText}>{restaurant.offerBadge}</Text>
            </View>
          )}
        </View>

        {/* Navigation Tabs: Menu / Reviews / About */}
        <View style={styles.tabsRow}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'menu' && styles.activeTabBtn]}
            onPress={() => setActiveTab('menu')}
          >
            <Text style={[styles.tabText, activeTab === 'menu' && styles.activeTabText]}>
              Menu
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'reviews' && styles.activeTabBtn]}
            onPress={() => setActiveTab('reviews')}
          >
            <Text style={[styles.tabText, activeTab === 'reviews' && styles.activeTabText]}>
              Reviews ({restaurant.reviewCount})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'about' && styles.activeTabBtn]}
            onPress={() => setActiveTab('about')}
          >
            <Text style={[styles.tabText, activeTab === 'about' && styles.activeTabText]}>
              About
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'menu' && (
          <View>
            {/* Category horizontal scroll & Veg Only filter */}
            <View style={styles.filterBar}>
              <TouchableOpacity
                style={[styles.vegToggleBtn, vegOnly && styles.activeVegToggle]}
                onPress={() => setVegOnly(!vegOnly)}
              >
                <View style={[styles.vegSquare, vegOnly && styles.activeVegSquare]}>
                  <View style={styles.vegDot} />
                </View>
                <Text style={[styles.vegToggleText, vegOnly && styles.activeVegToggleText]}>
                  Veg Only
                </Text>
              </TouchableOpacity>

              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {availableCategories.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.catChip, selectedCategory === cat && styles.activeCatChip]}
                    onPress={() => setSelectedCategory(cat)}
                  >
                    <Text
                      style={[
                        styles.catChipText,
                        selectedCategory === cat && styles.activeCatChipText,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Food Items List */}
            {restaurantDishes.map((food) => (
              <FoodItemCard
                key={food.id}
                foodItem={food}
                onPressCustomization={() => setActiveCustomizationFood(food)}
              />
            ))}
          </View>
        )}

        {activeTab === 'reviews' && (
          <View style={styles.tabContentPadding}>
            <View style={styles.reviewSummaryCard}>
              <Text style={styles.summaryRatingNum}>{restaurant.rating}</Text>
              <View style={styles.summaryStarsRow}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={16} color={COLORS.starYellow} fill={COLORS.starYellow} />
                ))}
              </View>
              <Text style={styles.summaryCount}>Based on {restaurant.reviewCount} user ratings</Text>
            </View>

            {/* Mock Reviews */}
            <View style={styles.reviewCard}>
              <Text style={styles.reviewerName}>Rohan Gupta ⭐ 5.0</Text>
              <Text style={styles.reviewDate}>2 days ago</Text>
              <Text style={styles.reviewBody}>
                The Biryani was so fragrant and hot! Meat was super tender. Packaging was top-notch.
              </Text>
            </View>

            <View style={styles.reviewCard}>
              <Text style={styles.reviewerName}>Ananya Roy ⭐ 4.8</Text>
              <Text style={styles.reviewDate}>1 week ago</Text>
              <Text style={styles.reviewBody}>
                Fast delivery within 25 mins. The garlic bread and pizza crust were delicious!
              </Text>
            </View>
          </View>
        )}

        {activeTab === 'about' && (
          <View style={styles.tabContentPadding}>
            <Text style={styles.aboutHeading}>About Restaurant</Text>
            <Text style={styles.aboutText}>{restaurant.aboutText}</Text>

            <View style={styles.infoRow}>
              <Info size={16} color={COLORS.primary} />
              <Text style={styles.infoLabel}>Opening Hours:</Text>
              <Text style={styles.infoVal}>{restaurant.openingHours}</Text>
            </View>

            <View style={styles.infoRow}>
              <MapPin size={16} color={COLORS.primary} />
              <Text style={styles.infoLabel}>Full Address:</Text>
              <Text style={styles.infoVal}>{restaurant.address}</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Floating Bottom Cart Bar */}
      {totalCartCount > 0 && (
        <TouchableOpacity
          style={styles.floatingCartBar}
          onPress={onNavigateCart}
          activeOpacity={0.9}
        >
          <View>
            <Text style={styles.cartItemsCountText}>
              {totalCartCount} ITEM{totalCartCount > 1 ? 'S' : ''} ADDED
            </Text>
            <Text style={styles.cartPriceText}>₹{grandTotal} plus taxes</Text>
          </View>

          <View style={styles.viewCartBtnRow}>
            <Text style={styles.viewCartLabel}>View Cart</Text>
            <ArrowRight size={18} color={COLORS.white} />
          </View>
        </TouchableOpacity>
      )}

      {/* Customization Modal */}
      <FoodCustomizationModal
        visible={!!activeCustomizationFood}
        foodItem={activeCustomizationFood}
        onClose={() => setActiveCustomizationFood(null)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 90,
  },
  coverImageContainer: {
    height: 200,
    width: '100%',
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  topActionsRow: {
    position: 'absolute',
    top: SPACING.md,
    left: SPACING.lg,
    right: SPACING.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconCircleBtn: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  restaurantHeaderCard: {
    backgroundColor: COLORS.cardBackground,
    marginTop: -24,
    marginHorizontal: SPACING.lg,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    ...SHADOWS.medium,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  restaurantName: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
    flex: 1,
    marginRight: SPACING.xs,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.vegGreen,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.xs,
  },
  ratingText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '800',
    marginLeft: 4,
  },
  cuisines: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  addressText: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  metaInfoRow: {
    flexDirection: 'row',
    marginTop: SPACING.md,
    justifyContent: 'space-between',
  },
  metaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.md,
  },
  metaPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginLeft: 4,
  },
  offerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.md,
    marginTop: SPACING.md,
  },
  offerBannerText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
    marginLeft: 6,
  },
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardBackground,
    marginTop: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTabBtn: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  activeTabText: {
    color: COLORS.primary,
    fontWeight: '800',
  },
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.cardBackground,
  },
  vegToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: SPACING.md,
  },
  activeVegToggle: {
    backgroundColor: '#ECFDF5',
    borderColor: COLORS.vegGreen,
  },
  vegSquare: {
    width: 14,
    height: 14,
    borderWidth: 1.5,
    borderColor: COLORS.vegGreen,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  activeVegSquare: {
    backgroundColor: COLORS.vegGreen,
  },
  vegDot: {
    width: 6,
    height: 6,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.vegGreen,
  },
  vegToggleText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  activeVegToggleText: {
    color: COLORS.vegGreen,
  },
  catChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.background,
    marginRight: SPACING.xs,
  },
  activeCatChip: {
    backgroundColor: COLORS.primary,
  },
  catChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  activeCatChipText: {
    color: COLORS.white,
    fontWeight: '700',
  },
  tabContentPadding: {
    padding: SPACING.lg,
  },
  reviewSummaryCard: {
    backgroundColor: COLORS.cardBackground,
    padding: SPACING.lg,
    borderRadius: RADIUS.xl,
    alignItems: 'center',
    marginBottom: SPACING.lg,
    ...SHADOWS.light,
  },
  summaryRatingNum: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  summaryStarsRow: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  summaryCount: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  reviewCard: {
    backgroundColor: COLORS.cardBackground,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  reviewDate: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  reviewBody: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 6,
    lineHeight: 18,
  },
  aboutHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  aboutText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: SPACING.lg,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginLeft: SPACING.xs,
    width: 110,
  },
  infoVal: {
    fontSize: 13,
    color: COLORS.textSecondary,
    flex: 1,
  },
  floatingCartBar: {
    position: 'absolute',
    bottom: 16,
    left: SPACING.lg,
    right: SPACING.lg,
    height: 58,
    backgroundColor: COLORS.vegGreen,
    borderRadius: RADIUS.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    ...SHADOWS.heavy,
  },
  cartItemsCountText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  cartPriceText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '800',
  },
  viewCartBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewCartLabel: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '800',
    marginRight: 6,
  },
});
