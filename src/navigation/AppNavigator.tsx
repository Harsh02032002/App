import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Home, Search, ShoppingBag, Heart, User } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { SplashScreen } from '../screens/SplashScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { OTPScreen } from '../screens/OTPScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { RestaurantDetailScreen } from '../screens/RestaurantDetailScreen';
import { CartScreen } from '../screens/CartScreen';
import { CheckoutScreen } from '../screens/CheckoutScreen';
import { OrderConfirmationScreen } from '../screens/OrderConfirmationScreen';
import { LiveTrackingScreen } from '../screens/LiveTrackingScreen';
import { OrdersScreen } from '../screens/OrdersScreen';
import { FavouritesScreen } from '../screens/FavouritesScreen';
import { NotificationsScreen } from '../screens/NotificationsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { Order } from '../types';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';

export type ScreenName =
  | 'splash'
  | 'onboarding'
  | 'login'
  | 'otp'
  | 'home'
  | 'search'
  | 'restaurant_detail'
  | 'cart'
  | 'checkout'
  | 'order_confirmation'
  | 'live_tracking'
  | 'orders'
  | 'favourites'
  | 'notifications'
  | 'profile';

export const AppNavigator: React.FC = () => {
  const { isLoggedIn, cartItems, activeOrder } = useApp();

  const [currentScreen, setCurrentScreen] = useState<ScreenName>('splash');
  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'orders' | 'favourites' | 'profile'>('home');
  
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>('rest-1');
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [trackingOrderId, setTrackingOrderId] = useState<string | undefined>(undefined);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Tab switch handler
  const handleTabPress = (tab: 'home' | 'search' | 'orders' | 'favourites' | 'profile') => {
    setActiveTab(tab);
    switch (tab) {
      case 'home':
        setCurrentScreen('home');
        break;
      case 'search':
        setCurrentScreen('search');
        break;
      case 'orders':
        setCurrentScreen('orders');
        break;
      case 'favourites':
        setCurrentScreen('favourites');
        break;
      case 'profile':
        setCurrentScreen('profile');
        break;
    }
  };

  const navigateToRestaurant = (restId: string) => {
    setSelectedRestaurantId(restId);
    setCurrentScreen('restaurant_detail');
  };

  const navigateToTracking = (ordId?: string) => {
    setTrackingOrderId(ordId);
    setCurrentScreen('live_tracking');
  };

  // Render current active screen
  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return (
          <SplashScreen
            onFinish={() => setCurrentScreen('onboarding')}
          />
        );

      case 'onboarding':
        return (
          <OnboardingScreen
            onFinish={() => setCurrentScreen(isLoggedIn ? 'home' : 'login')}
          />
        );

      case 'login':
        return (
          <LoginScreen
            onSendOtp={() => setCurrentScreen('otp')}
          />
        );

      case 'otp':
        return (
          <OTPScreen
            onSuccess={() => {
              setCurrentScreen('home');
              setActiveTab('home');
            }}
            onBack={() => setCurrentScreen('login')}
          />
        );

      case 'home':
        return (
          <HomeScreen
            onSelectRestaurant={navigateToRestaurant}
            onNavigateSearch={() => handleTabPress('search')}
            onNavigateCart={() => setCurrentScreen('cart')}
            onNavigateNotifications={() => setCurrentScreen('notifications')}
            onNavigateProfile={() => handleTabPress('profile')}
          />
        );

      case 'search':
        return (
          <SearchScreen
            onBack={() => handleTabPress('home')}
            onSelectRestaurant={navigateToRestaurant}
          />
        );

      case 'restaurant_detail':
        return (
          <RestaurantDetailScreen
            restaurantId={selectedRestaurantId}
            onBack={() => setCurrentScreen('home')}
            onNavigateCart={() => setCurrentScreen('cart')}
          />
        );

      case 'cart':
        return (
          <CartScreen
            onBack={() => setCurrentScreen('home')}
            onProceedCheckout={() => setCurrentScreen('checkout')}
            onExploreFood={() => handleTabPress('home')}
          />
        );

      case 'checkout':
        return (
          <CheckoutScreen
            onBack={() => setCurrentScreen('cart')}
            onOrderSuccess={(order) => {
              setConfirmedOrder(order);
              setCurrentScreen('order_confirmation');
            }}
          />
        );

      case 'order_confirmation':
        return (
          <OrderConfirmationScreen
            order={confirmedOrder}
            onTrackOrder={(ordId) => navigateToTracking(ordId)}
            onGoHome={() => handleTabPress('home')}
          />
        );

      case 'live_tracking':
        return (
          <LiveTrackingScreen
            orderId={trackingOrderId}
            onBack={() => handleTabPress('orders')}
          />
        );

      case 'orders':
        return (
          <OrdersScreen
            onBack={() => handleTabPress('home')}
            onTrackOrder={(ordId) => navigateToTracking(ordId)}
            onNavigateCart={() => setCurrentScreen('cart')}
          />
        );

      case 'favourites':
        return (
          <FavouritesScreen
            onBack={() => handleTabPress('home')}
            onSelectRestaurant={navigateToRestaurant}
            onExploreFood={() => handleTabPress('home')}
          />
        );

      case 'notifications':
        return (
          <NotificationsScreen
            onBack={() => handleTabPress('home')}
            onSelectOrderTrack={(ordId) => navigateToTracking(ordId)}
          />
        );

      case 'profile':
        return (
          <ProfileScreen
            onNavigateOrders={() => handleTabPress('orders')}
            onNavigateFavourites={() => handleTabPress('favourites')}
            onNavigateNotifications={() => setCurrentScreen('notifications')}
            onLogout={() => setCurrentScreen('login')}
          />
        );

      default:
        return (
          <HomeScreen
            onSelectRestaurant={navigateToRestaurant}
            onNavigateSearch={() => handleTabPress('search')}
            onNavigateCart={() => setCurrentScreen('cart')}
            onNavigateNotifications={() => setCurrentScreen('notifications')}
            onNavigateProfile={() => handleTabPress('profile')}
          />
        );
    }
  };

  // Determine if bottom navigation bar should be visible
  const showBottomBar = [
    'home',
    'search',
    'orders',
    'favourites',
    'profile',
  ].includes(currentScreen);

  return (
    <View style={styles.container}>
      <View style={styles.screenContainer}>{renderScreen()}</View>

      {/* Modern Bottom Navigation Tab Bar */}
      {showBottomBar && (
        <SafeAreaView style={styles.bottomBarSafeArea}>
          <View style={styles.bottomBarContainer}>
            <TouchableOpacity
              style={styles.tabItem}
              onPress={() => handleTabPress('home')}
              activeOpacity={0.7}
            >
              <Home
                size={22}
                color={activeTab === 'home' ? COLORS.primary : COLORS.textMuted}
              />
              <Text
                style={[
                  styles.tabLabel,
                  activeTab === 'home' && styles.activeTabLabel,
                ]}
              >
                Home
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.tabItem}
              onPress={() => handleTabPress('search')}
              activeOpacity={0.7}
            >
              <Search
                size={22}
                color={activeTab === 'search' ? COLORS.primary : COLORS.textMuted}
              />
              <Text
                style={[
                  styles.tabLabel,
                  activeTab === 'search' && styles.activeTabLabel,
                ]}
              >
                Search
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.tabItem}
              onPress={() => handleTabPress('orders')}
              activeOpacity={0.7}
            >
              <View style={styles.tabIconWrapper}>
                <ShoppingBag
                  size={22}
                  color={activeTab === 'orders' ? COLORS.primary : COLORS.textMuted}
                />
                {activeOrder && (
                  <View style={styles.activeOrderPulseDot} />
                )}
              </View>
              <Text
                style={[
                  styles.tabLabel,
                  activeTab === 'orders' && styles.activeTabLabel,
                ]}
              >
                Orders
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.tabItem}
              onPress={() => handleTabPress('favourites')}
              activeOpacity={0.7}
            >
              <Heart
                size={22}
                color={activeTab === 'favourites' ? COLORS.primary : COLORS.textMuted}
              />
              <Text
                style={[
                  styles.tabLabel,
                  activeTab === 'favourites' && styles.activeTabLabel,
                ]}
              >
                Favourites
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.tabItem}
              onPress={() => handleTabPress('profile')}
              activeOpacity={0.7}
            >
              <User
                size={22}
                color={activeTab === 'profile' ? COLORS.primary : COLORS.textMuted}
              />
              <Text
                style={[
                  styles.tabLabel,
                  activeTab === 'profile' && styles.activeTabLabel,
                ]}
              >
                Profile
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  screenContainer: {
    flex: 1,
  },
  bottomBarSafeArea: {
    backgroundColor: COLORS.cardBackground,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    ...SHADOWS.heavy,
  },
  bottomBarContainer: {
    flexDirection: 'row',
    height: 56,
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: COLORS.cardBackground,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  tabIconWrapper: {
    position: 'relative',
  },
  activeOrderPulseDot: {
    position: 'absolute',
    top: -2,
    right: -4,
    width: 8,
    height: 8,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textMuted,
    marginTop: 3,
  },
  activeTabLabel: {
    color: COLORS.primary,
    fontWeight: '800',
  },
});
