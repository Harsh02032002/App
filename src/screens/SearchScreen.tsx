import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { ArrowLeft, SlidersHorizontal, Search, Star, Sparkles, Filter } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { MOCK_RESTAURANTS, MOCK_FOOD_ITEMS } from '../data/mockData';
import { SearchBar } from '../components/SearchBar';
import { RestaurantCard } from '../components/RestaurantCard';
import { FoodItemCard } from '../components/FoodItemCard';
import { FoodCustomizationModal } from '../components/FoodCustomizationModal';
import { FoodItem } from '../types';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';

interface SearchScreenProps {
  onBack: () => void;
  onSelectRestaurant: (restaurantId: string) => void;
}

const POPULAR_CUISINES = ['Biryani', 'Pizza', 'Burger', 'Chinese', 'Momos', 'Desserts', 'Healthy', 'South Indian'];
const RECENT_SEARCHES = ['Hyderabadi Biryani', 'Double Smash Burger', 'Pepperoni Pizza', 'Garlic Bread'];

export const SearchScreen: React.FC<SearchScreenProps> = ({ onBack, onSelectRestaurant }) => {
  const { searchQuery, setSearchQuery, setActiveCustomizationFood, activeCustomizationFood } = useApp();

  const [vegOnly, setVegOnly] = useState(false);
  const [offersOnly, setOffersOnly] = useState(false);
  const [minRating, setMinRating] = useState<number | null>(null);

  // Search logic
  const query = searchQuery.trim().toLowerCase();

  const matchingRestaurants = MOCK_RESTAURANTS.filter((r) => {
    if (vegOnly && !r.isPureVeg) return false;
    if (offersOnly && !r.offerBadge) return false;
    if (minRating && r.rating < minRating) return false;

    if (!query) return true;
    return (
      r.name.toLowerCase().includes(query) ||
      r.cuisines.some((c) => c.toLowerCase().includes(query)) ||
      r.area.toLowerCase().includes(query)
    );
  });

  const matchingFoodItems = MOCK_FOOD_ITEMS.filter((f) => {
    if (vegOnly && f.type !== 'veg') return false;
    if (minRating && f.rating < minRating) return false;

    if (!query) return false;
    return (
      f.name.toLowerCase().includes(query) ||
      f.category.toLowerCase().includes(query) ||
      f.description.toLowerCase().includes(query)
    );
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <ArrowLeft size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search for restaurants, dishes..."
            autoFocus
          />
        </View>
      </View>

      {/* Quick Filter Pill Buttons */}
      <View style={styles.filterPillsRow}>
        <TouchableOpacity
          style={[styles.pill, vegOnly && styles.activePill]}
          onPress={() => setVegOnly(!vegOnly)}
        >
          <View style={[styles.vegDot, vegOnly && styles.activeVegDot]} />
          <Text style={[styles.pillText, vegOnly && styles.activePillText]}>Pure Veg</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.pill, offersOnly && styles.activePill]}
          onPress={() => setOffersOnly(!offersOnly)}
        >
          <Sparkles size={14} color={offersOnly ? COLORS.white : COLORS.primary} />
          <Text style={[styles.pillText, offersOnly && styles.activePillText]}>Offers</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.pill, minRating === 4.5 && styles.activePill]}
          onPress={() => setMinRating(minRating === 4.5 ? null : 4.5)}
        >
          <Star size={14} color={minRating === 4.5 ? COLORS.white : COLORS.starYellow} fill={COLORS.starYellow} />
          <Text style={[styles.pillText, minRating === 4.5 && styles.activePillText]}>Rating 4.5+</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {!query ? (
          /* Recent & Popular Tags when empty */
          <View style={styles.discoverySection}>
            <Text style={styles.sectionTitle}>Recent Searches</Text>
            <View style={styles.tagsContainer}>
              {RECENT_SEARCHES.map((tag) => (
                <TouchableOpacity
                  key={tag}
                  style={styles.tagChip}
                  onPress={() => setSearchQuery(tag)}
                >
                  <Search size={14} color={COLORS.textMuted} style={{ marginRight: 4 }} />
                  <Text style={styles.tagText}>{tag}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.sectionTitle, { marginTop: SPACING.xl }]}>Popular Cuisines</Text>
            <View style={styles.tagsContainer}>
              {POPULAR_CUISINES.map((cuisine) => (
                <TouchableOpacity
                  key={cuisine}
                  style={[styles.tagChip, styles.cuisineChip]}
                  onPress={() => setSearchQuery(cuisine)}
                >
                  <Text style={styles.cuisineChipText}>{cuisine}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : (
          /* Search Results */
          <View>
            {/* Matching Dishes Section */}
            {matchingFoodItems.length > 0 && (
              <View style={styles.resultsGroup}>
                <Text style={styles.groupTitle}>Dishes ({matchingFoodItems.length})</Text>
                {matchingFoodItems.map((food) => (
                  <FoodItemCard
                    key={food.id}
                    foodItem={food}
                    onPressCustomization={() => setActiveCustomizationFood(food)}
                  />
                ))}
              </View>
            )}

            {/* Matching Restaurants Section */}
            <View style={styles.resultsGroup}>
              <Text style={styles.groupTitle}>Restaurants ({matchingRestaurants.length})</Text>
              {matchingRestaurants.map((rest) => (
                <RestaurantCard
                  key={rest.id}
                  restaurant={rest}
                  onPress={() => onSelectRestaurant(rest.id)}
                />
              ))}
            </View>

            {matchingRestaurants.length === 0 && matchingFoodItems.length === 0 && (
              <View style={styles.noResultsBox}>
                <Search size={48} color={COLORS.textMuted} />
                <Text style={styles.noResultsTitle}>No results found for "{searchQuery}"</Text>
                <Text style={styles.noResultsSub}>Try searching for 'Biryani', 'Burger', or 'Pizza'</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: SPACING.md,
    backgroundColor: COLORS.cardBackground,
  },
  backBtn: {
    paddingLeft: SPACING.lg,
    paddingRight: SPACING.xs,
  },
  filterPillsRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xs,
    backgroundColor: COLORS.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: SPACING.xs,
  },
  activePill: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  vegDot: {
    width: 8,
    height: 8,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.vegGreen,
    marginRight: 4,
  },
  activeVegDot: {
    backgroundColor: COLORS.white,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  activePillText: {
    color: COLORS.white,
  },
  scrollContent: {
    paddingBottom: SPACING.xxl,
  },
  discoverySection: {
    padding: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    paddingHorizontal: SPACING.md,
    paddingVertical: 8,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  tagText: {
    fontSize: 13,
    color: COLORS.textPrimary,
  },
  cuisineChip: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primaryLight,
  },
  cuisineChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  resultsGroup: {
    marginTop: SPACING.md,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  noResultsBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxl * 2,
    paddingHorizontal: SPACING.xl,
  },
  noResultsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: SPACING.md,
    textAlign: 'center',
  },
  noResultsSub: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
});
