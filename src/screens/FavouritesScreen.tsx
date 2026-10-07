import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { MOCK_RESTAURANTS, MOCK_FOOD_ITEMS } from '../data/mockData';
import { RestaurantCard } from '../components/RestaurantCard';
import { FoodItemCard } from '../components/FoodItemCard';
import { FoodCustomizationModal } from '../components/FoodCustomizationModal';
import { EmptyState } from '../components/EmptyState';
import { COLORS, SPACING, RADIUS } from '../constants/theme';

interface FavouritesScreenProps {
  onBack: () => void;
  onSelectRestaurant: (restaurantId: string) => void;
  onExploreFood: () => void;
}

export const FavouritesScreen: React.FC<FavouritesScreenProps> = ({
  onBack,
  onSelectRestaurant,
  onExploreFood,
}) => {
  const {
    favoriteRestaurantIds,
    favoriteFoodIds,
    activeCustomizationFood,
    setActiveCustomizationFood,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'restaurants' | 'dishes'>('restaurants');

  const favRestaurants = MOCK_RESTAURANTS.filter((r) => favoriteRestaurantIds.includes(r.id));
  const favFoodItems = MOCK_FOOD_ITEMS.filter((f) => favoriteFoodIds.includes(f.id));

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <ArrowLeft size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Favourites</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsRow}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'restaurants' && styles.activeTabBtn]}
          onPress={() => setActiveTab('restaurants')}
        >
          <Text style={[styles.tabText, activeTab === 'restaurants' && styles.activeTabText]}>
            Saved Places ({favRestaurants.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'dishes' && styles.activeTabBtn]}
          onPress={() => setActiveTab('dishes')}
        >
          <Text style={[styles.tabText, activeTab === 'dishes' && styles.activeTabText]}>
            Saved Dishes ({favFoodItems.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {activeTab === 'restaurants' && (
          <>
            {favRestaurants.length === 0 ? (
              <EmptyState
                type="favourites"
                title="No Saved Restaurants"
                subtitle="Tap the heart icon on any restaurant to save your top favorite dining places here!"
                buttonText="Explore Restaurants"
                onPressButton={onExploreFood}
              />
            ) : (
              favRestaurants.map((rest) => (
                <RestaurantCard
                  key={rest.id}
                  restaurant={rest}
                  onPress={() => onSelectRestaurant(rest.id)}
                />
              ))
            )}
          </>
        )}

        {activeTab === 'dishes' && (
          <>
            {favFoodItems.length === 0 ? (
              <EmptyState
                type="favourites"
                title="No Saved Dishes"
                subtitle="Tap the heart icon on your favorite dishes to quickly reorder them anytime!"
                buttonText="Explore Food"
                onPressButton={onExploreFood}
              />
            ) : (
              favFoodItems.map((food) => (
                <FoodItemCard
                  key={food.id}
                  foodItem={food}
                  onPressCustomization={() => setActiveCustomizationFood(food)}
                />
              ))
            )}
          </>
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
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  backBtn: {
    padding: SPACING.xs,
    marginRight: SPACING.md,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardBackground,
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
  scrollContent: {
    paddingVertical: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
});
