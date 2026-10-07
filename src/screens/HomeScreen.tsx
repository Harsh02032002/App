import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { ShoppingBag, ArrowRight, Sparkles, TrendingUp, Award, Flame } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { MOCK_CATEGORIES, MOCK_RESTAURANTS } from '../data/mockData';
import { Header } from '../components/Header';
import { SearchBar } from '../components/SearchBar';
import { CategoryCard } from '../components/CategoryCard';
import { BannerCarousel } from '../components/BannerCarousel';
import { RestaurantCard } from '../components/RestaurantCard';
import { CouponModal } from '../components/CouponModal';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';

interface HomeScreenProps {
  onSelectRestaurant: (restaurantId: string) => void;
  onNavigateSearch: () => void;
  onNavigateCart: () => void;
  onNavigateNotifications: () => void;
  onNavigateProfile: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onSelectRestaurant,
  onNavigateSearch,
  onNavigateCart,
  onNavigateNotifications,
  onNavigateProfile,
}) => {
  const { searchQuery, setSearchQuery, cartItems, cartRestaurant, grandTotal, applyCoupon } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showCouponModal, setShowCouponModal] = useState(false);

  // Filter restaurants by category or search term
  const filteredRestaurants = MOCK_RESTAURANTS.filter((rest) => {
    if (selectedCategory) {
      return rest.cuisines.some((c) => c.toLowerCase().includes(selectedCategory.toLowerCase()));
    }
    return true;
  });

  const topRatedRestaurants = MOCK_RESTAURANTS.filter((r) => r.rating >= 4.7);
  const offerRestaurants = MOCK_RESTAURANTS.filter((r) => r.offerBadge);

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Bar Header */}
      <Header
        onPressNotifications={onNavigateNotifications}
        onPressProfile={onNavigateProfile}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Search Input Bar */}
        <TouchableOpacity activeOpacity={0.9} onPress={onNavigateSearch}>
          <View pointerEvents="none">
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search for restaurants, cuisines or dishes..."
              editable={false}
            />
          </View>
        </TouchableOpacity>

        {/* Categories Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>What's on your mind?</Text>
          {selectedCategory && (
            <TouchableOpacity onPress={() => setSelectedCategory(null)}>
              <Text style={styles.clearFilterText}>Reset Filter</Text>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {MOCK_CATEGORIES.map((cat) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              isSelected={selectedCategory === cat.name}
              onPress={(name) =>
                setSelectedCategory((prev) => (prev === name ? null : name))
              }
            />
          ))}
        </ScrollView>

        {/* Promos Banner Carousel */}
        <BannerCarousel
          onPressBanner={(code) => {
            applyCoupon(code);
            setShowCouponModal(true);
          }}
        />

        {/* Top Rated Horizontal Section */}
        <View style={styles.sectionHeader}>
          <View style={styles.titleWithIcon}>
            <Award size={18} color={COLORS.secondary} style={{ marginRight: 6 }} />
            <Text style={styles.sectionTitle}>Top Rated Gourmet Spots</Text>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalRestaurantsScroll}
        >
          {topRatedRestaurants.map((rest) => (
            <RestaurantCard
              key={`top-${rest.id}`}
              restaurant={rest}
              horizontal
              onPress={() => onSelectRestaurant(rest.id)}
            />
          ))}
        </ScrollView>

        {/* Best Offers Section */}
        <View style={styles.sectionHeader}>
          <View style={styles.titleWithIcon}>
            <Flame size={18} color={COLORS.primary} style={{ marginRight: 6 }} />
            <Text style={styles.sectionTitle}>Great Offers Near You</Text>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalRestaurantsScroll}
        >
          {offerRestaurants.map((rest) => (
            <RestaurantCard
              key={`offer-${rest.id}`}
              restaurant={rest}
              horizontal
              onPress={() => onSelectRestaurant(rest.id)}
            />
          ))}
        </ScrollView>

        {/* Main "Restaurants Near You" Vertical List */}
        <View style={styles.sectionHeader}>
          <View style={styles.titleWithIcon}>
            <TrendingUp size={18} color={COLORS.primary} style={{ marginRight: 6 }} />
            <Text style={styles.sectionTitle}>
              {selectedCategory ? `${selectedCategory} Places` : 'All Restaurants Near You'}
            </Text>
          </View>
          <Text style={styles.countText}>{filteredRestaurants.length} places</Text>
        </View>

        {filteredRestaurants.map((rest) => (
          <RestaurantCard
            key={rest.id}
            restaurant={rest}
            onPress={() => onSelectRestaurant(rest.id)}
          />
        ))}
      </ScrollView>

      {/* Floating Bottom Cart Pill (Visible when items are in cart) */}
      {totalCartCount > 0 && cartRestaurant && (
        <TouchableOpacity
          style={styles.floatingCartPill}
          onPress={onNavigateCart}
          activeOpacity={0.9}
        >
          <View style={styles.cartPillLeft}>
            <View style={styles.cartCountBadge}>
              <Text style={styles.cartCountText}>{totalCartCount}</Text>
            </View>
            <View style={styles.cartPillInfo}>
              <Text style={styles.cartPillTitle}>{cartRestaurant.name}</Text>
              <Text style={styles.cartPillPrice}>₹{grandTotal} • View Cart</Text>
            </View>
          </View>

          <View style={styles.cartPillRight}>
            <Text style={styles.viewCartText}>Checkout</Text>
            <ArrowRight size={16} color={COLORS.white} />
          </View>
        </TouchableOpacity>
      )}

      {/* Coupon Modal */}
      <CouponModal
        visible={showCouponModal}
        onClose={() => setShowCouponModal(false)}
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  clearFilterText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  countText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  categoryScroll: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xs,
  },
  horizontalRestaurantsScroll: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  floatingCartPill: {
    position: 'absolute',
    bottom: 16,
    left: SPACING.lg,
    right: SPACING.lg,
    height: 56,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    ...SHADOWS.heavy,
  },
  cartPillLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cartCountBadge: {
    width: 28,
    height: 28,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  cartCountText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '800',
  },
  cartPillInfo: {
    flex: 1,
  },
  cartPillTitle: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '700',
  },
  cartPillPrice: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 11,
  },
  cartPillRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewCartText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '800',
    marginRight: 4,
  },
});
