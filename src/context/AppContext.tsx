import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  User,
  CartItem,
  FoodItem,
  Restaurant,
  Order,
  Address,
  Coupon,
  NotificationItem,
  FilterOptions,
  CustomizationOption,
  OrderStatus,
} from '../types';
import {
  MOCK_RESTAURANTS,
  MOCK_FOOD_ITEMS,
  MOCK_COUPONS,
  MOCK_ADDRESSES,
  MOCK_ORDERS,
  MOCK_NOTIFICATIONS,
} from '../data/mockData';

interface AppContextType {
  // Auth
  user: User | null;
  isLoggedIn: boolean;
  loginPhone: string;
  setLoginPhone: (phone: string) => void;
  login: (phone: string) => void;
  verifyOtp: (otp: string) => boolean;
  logout: () => void;

  // Cart
  cartItems: CartItem[];
  cartRestaurant: Restaurant | null;
  addToCart: (
    foodItem: FoodItem,
    selectedSize?: CustomizationOption,
    selectedAddOns?: CustomizationOption[],
    quantity?: number,
    instructions?: string
  ) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, newQuantity: number) => void;
  clearCart: () => void;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  // Financial Calculations
  itemTotal: number;
  deliveryFee: number;
  platformFee: number;
  taxes: number;
  discountAmount: number;
  grandTotal: number;

  // Favourites
  favoriteRestaurantIds: string[];
  favoriteFoodIds: string[];
  toggleFavoriteRestaurant: (id: string) => void;
  toggleFavoriteFood: (id: string) => void;

  // Addresses
  addresses: Address[];
  selectedAddress: Address;
  setSelectedAddress: (addr: Address) => void;
  addAddress: (addr: Omit<Address, 'id'>) => void;

  // Orders
  orders: Order[];
  activeOrder: Order | null;
  placeOrder: (paymentMethod: string) => Order;
  reorder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;

  // Search & Filter
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterOptions: FilterOptions;
  setFilterOptions: React.Dispatch<React.SetStateAction<FilterOptions>>;
  resetFilters: () => void;

  // Notifications
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  markNotificationsAsRead: () => void;
  
  // Customization Modal State
  activeCustomizationFood: FoodItem | null;
  setActiveCustomizationFood: (food: FoodItem | null) => void;
}

const DEFAULT_FILTERS: FilterOptions = {
  sortBy: 'relevance',
  cuisines: [],
  offersOnly: false,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Auth state
  const [user, setUser] = useState<User | null>({
    id: 'usr-101',
    name: 'Aarav Sharma',
    phone: '+91 98765 43210',
    email: 'aarav.sharma@example.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
    memberSince: 'October 2024',
  });
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [loginPhone, setLoginPhone] = useState<string>('');

  // Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartRestaurant, setCartRestaurant] = useState<Restaurant | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // Favourites State
  const [favoriteRestaurantIds, setFavoriteRestaurantIds] = useState<string[]>(['rest-1', 'rest-3']);
  const [favoriteFoodIds, setFavoriteFoodIds] = useState<string[]>(['food-1', 'food-5']);

  // Address State
  const [addresses, setAddresses] = useState<Address[]>(MOCK_ADDRESSES);
  const [selectedAddress, setSelectedAddress] = useState<Address>(MOCK_ADDRESSES[0]);

  // Orders State
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterOptions, setFilterOptions] = useState<FilterOptions>(DEFAULT_FILTERS);

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);

  // Customization Modal State
  const [activeCustomizationFood, setActiveCustomizationFood] = useState<FoodItem | null>(null);

  // Load persisted favorites/cart on launch
  useEffect(() => {
    const loadState = async () => {
      try {
        const savedFavs = await AsyncStorage.getItem('fav_restaurants');
        if (savedFavs) setFavoriteRestaurantIds(JSON.parse(savedFavs));
      } catch (e) {
        console.log('AsyncStorage error:', e);
      }
    };
    loadState();
  }, []);

  const login = (phone: string) => {
    setLoginPhone(phone);
  };

  const verifyOtp = (otp: string): boolean => {
    if (otp.length === 4 || otp.length === 6) {
      setUser({
        id: 'usr-101',
        name: 'Aarav Sharma',
        phone: loginPhone || '+91 98765 43210',
        email: 'aarav.sharma@example.com',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
        memberSince: 'Just Now',
      });
      setIsLoggedIn(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  // Cart operations
  const addToCart = (
    foodItem: FoodItem,
    selectedSize?: CustomizationOption,
    selectedAddOns: CustomizationOption[] = [],
    quantity: number = 1,
    instructions?: string
  ) => {
    const parentRest = MOCK_RESTAURANTS.find((r) => r.id === foodItem.restaurantId) || null;

    // Check if adding from a different restaurant
    if (cartRestaurant && cartRestaurant.id !== foodItem.restaurantId && cartItems.length > 0) {
      // Clear previous restaurant items
      setCartItems([]);
      setAppliedCoupon(null);
    }

    setCartRestaurant(parentRest);

    let addOnsPrice = selectedAddOns.reduce((acc, item) => acc + item.price, 0);
    let sizePrice = selectedSize ? selectedSize.price : 0;
    let basePrice = foodItem.price + sizePrice + addOnsPrice;

    // Create unique key for item + customizations
    const addOnIdsKey = selectedAddOns.map((a) => a.id).sort().join('-');
    const sizeIdKey = selectedSize ? selectedSize.id : '';
    const cartItemId = `${foodItem.id}_${sizeIdKey}_${addOnIdsKey}`;

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += quantity;
        updated[existingIndex].totalPrice = updated[existingIndex].quantity * basePrice;
        return updated;
      } else {
        return [
          ...prevItems,
          {
            cartItemId,
            foodItem,
            quantity,
            selectedSize,
            selectedAddOns,
            instructions,
            totalPrice: basePrice * quantity,
          },
        ];
      }
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCartItems((prev) => {
      const updated = prev.filter((item) => item.cartItemId !== cartItemId);
      if (updated.length === 0) {
        setCartRestaurant(null);
        setAppliedCoupon(null);
      }
      return updated;
    });
  };

  const updateQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) => {
        if (item.cartItemId === cartItemId) {
          const unitPrice = item.totalPrice / item.quantity;
          return {
            ...item,
            quantity: newQuantity,
            totalPrice: unitPrice * newQuantity,
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setCartRestaurant(null);
    setAppliedCoupon(null);
  };

  const applyCoupon = (code: string) => {
    const coupon = MOCK_COUPONS.find((c) => c.code.toUpperCase() === code.toUpperCase());
    if (!coupon) {
      return { success: false, message: 'Invalid promo coupon code' };
    }

    const currentItemTotal = cartItems.reduce((sum, i) => sum + i.totalPrice, 0);
    if (currentItemTotal < coupon.minOrderValue) {
      return {
        success: false,
        message: `Minimum order value for ${coupon.code} is ₹${coupon.minOrderValue}`,
      };
    }

    setAppliedCoupon(coupon);
    return { success: true, message: `Coupon '${coupon.code}' applied successfully!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Financial calculations
  const itemTotal = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);
  const deliveryFee = itemTotal > 0 ? (cartRestaurant?.distanceKm && cartRestaurant.distanceKm > 3 ? 45 : 30) : 0;
  const platformFee = itemTotal > 0 ? 10 : 0;
  const taxes = itemTotal > 0 ? Math.round(itemTotal * 0.05) : 0;

  let discountAmount = 0;
  if (appliedCoupon && itemTotal > 0) {
    if (appliedCoupon.discountType === 'percentage') {
      discountAmount = Math.round((itemTotal * appliedCoupon.discountValue) / 100);
      if (appliedCoupon.maxDiscount && discountAmount > appliedCoupon.maxDiscount) {
        discountAmount = appliedCoupon.maxDiscount;
      }
    } else if (appliedCoupon.discountType === 'flat') {
      discountAmount = appliedCoupon.discountValue;
    }
  }

  const grandTotal = Math.max(0, itemTotal + deliveryFee + platformFee + taxes - discountAmount);

  // Toggle Favorites
  const toggleFavoriteRestaurant = async (id: string) => {
    setFavoriteRestaurantIds((prev) => {
      const next = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
      AsyncStorage.setItem('fav_restaurants', JSON.stringify(next));
      return next;
    });
  };

  const toggleFavoriteFood = async (id: string) => {
    setFavoriteFoodIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  // Add address
  const addAddress = (newAddr: Omit<Address, 'id'>) => {
    const created: Address = {
      ...newAddr,
      id: `addr-${Date.now()}`,
    };
    setAddresses((prev) => [...prev, created]);
    setSelectedAddress(created);
  };

  // Orders & checkout
  const activeOrder = orders.find((o) => o.status !== 'delivered' && o.status !== 'cancelled') || null;

  const placeOrder = (paymentMethod: string): Order => {
    const newOrder: Order = {
      id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      restaurantId: cartRestaurant?.id || 'rest-1',
      restaurantName: cartRestaurant?.name || 'The Royal Biryani House',
      restaurantImage: cartRestaurant?.coverImage || 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300',
      items: [...cartItems],
      itemTotal,
      deliveryFee,
      platformFee,
      taxes,
      discount: discountAmount,
      couponCode: appliedCoupon?.code,
      grandTotal,
      status: 'placed',
      createdAt: 'Just Now',
      estimatedDeliveryTime: '25-30 mins',
      deliveryAddress: selectedAddress,
      paymentMethod,
      deliveryPartner: {
        id: 'driver-99',
        name: 'Kabir Verma',
        phone: '+91 98112 33445',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
        rating: 4.9,
        vehicleNumber: 'DL 01 CRAVE (Honda Activa)',
        currentLat: cartRestaurant?.latitude || 28.6315,
        currentLng: cartRestaurant?.longitude || 77.2167,
      },
      timeline: [
        { status: 'placed', label: 'Order Placed', time: 'Just now', completed: true, current: true },
        { status: 'accepted', label: 'Restaurant Accepted', time: 'In 2 mins', completed: false, current: false },
        { status: 'preparing', label: 'Food Being Prepared', time: 'In 10 mins', completed: false, current: false },
        { status: 'picked_up', label: 'Picked Up', time: 'In 18 mins', completed: false, current: false },
        { status: 'on_the_way', label: 'Valet on the way', time: 'In 22 mins', completed: false, current: false },
        { status: 'delivered', label: 'Delivered', time: 'In 28 mins', completed: false, current: false },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Create notification
    const newNotif: NotificationItem = {
      id: `n-${Date.now()}`,
      title: '🎉 Order Placed Successfully!',
      message: `Your order #${newOrder.id} from ${newOrder.restaurantName} is confirmed!`,
      timestamp: 'Just now',
      type: 'order',
      isRead: false,
      orderId: newOrder.id,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    clearCart();
    return newOrder;
  };

  const reorder = (orderToReorder: Order) => {
    clearCart();
    orderToReorder.items.forEach((item) => {
      addToCart(
        item.foodItem,
        item.selectedSize,
        item.selectedAddOns,
        item.quantity,
        item.instructions
      );
    });
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const statusOrder: OrderStatus[] = [
            'placed',
            'accepted',
            'preparing',
            'picked_up',
            'on_the_way',
            'delivered',
          ];
          const newIdx = statusOrder.indexOf(newStatus);

          const updatedTimeline = ord.timeline.map((step) => {
            const stepIdx = statusOrder.indexOf(step.status);
            return {
              ...step,
              completed: stepIdx <= newIdx,
              current: stepIdx === newIdx,
            };
          });

          return {
            ...ord,
            status: newStatus,
            timeline: updatedTimeline,
          };
        }
        return ord;
      })
    );
  };

  const resetFilters = () => setFilterOptions(DEFAULT_FILTERS);

  const markNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const unreadNotificationCount = notifications.filter((n) => !n.isRead).length;

  return (
    <AppContext.Provider
      value={{
        user,
        isLoggedIn,
        loginPhone,
        setLoginPhone,
        login,
        verifyOtp,
        logout,

        cartItems,
        cartRestaurant,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        appliedCoupon,
        applyCoupon,
        removeCoupon,

        itemTotal,
        deliveryFee,
        platformFee,
        taxes,
        discountAmount,
        grandTotal,

        favoriteRestaurantIds,
        favoriteFoodIds,
        toggleFavoriteRestaurant,
        toggleFavoriteFood,

        addresses,
        selectedAddress,
        setSelectedAddress,
        addAddress,

        orders,
        activeOrder,
        placeOrder,
        reorder,
        updateOrderStatus,

        searchQuery,
        setSearchQuery,
        filterOptions,
        setFilterOptions,
        resetFilters,

        notifications,
        unreadNotificationCount,
        markNotificationsAsRead,

        activeCustomizationFood,
        setActiveCustomizationFood,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
