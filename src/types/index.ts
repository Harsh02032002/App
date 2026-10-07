export type FoodType = 'veg' | 'non-veg' | 'egg';
export type AppRole = 'customer' | 'restaurant' | 'delivery';

export interface CustomizationOption {
  id: string;
  name: string;
  price: number;
}

export interface CustomizationGroup {
  id: string;
  title: string;
  required: boolean;
  maxSelection?: number;
  options: CustomizationOption[];
}

export interface FoodItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  type: FoodType;
  category: string;
  rating: number;
  ratingCount: number;
  isBestseller?: boolean;
  isCustomizable?: boolean;
  isAvailable?: boolean;
  preparationTimeMinutes?: number;
  customizationGroups?: CustomizationGroup[];
}

export interface Restaurant {
  id: string;
  name: string;
  tagline: string;
  coverImage: string;
  logo: string;
  rating: number;
  reviewCount: number;
  deliveryTimeMinutes: number;
  distanceKm: number;
  costForTwo: number;
  cuisines: string[];
  address: string;
  area: string;
  isPromoted?: boolean;
  isPureVeg?: boolean;
  isOpen?: boolean;
  acceptingOrders?: boolean;
  offerBadge?: string;
  aboutText: string;
  openingHours: string;
  phone?: string;
  email?: string;
  latitude: number;
  longitude: number;
}

export interface CartCustomization {
  groupId: string;
  groupTitle: string;
  optionId: string;
  optionName: string;
  price: number;
}

export interface CartItem {
  cartItemId: string;
  foodItem: FoodItem;
  quantity: number;
  selectedSize?: CustomizationOption;
  selectedAddOns: CustomizationOption[];
  instructions?: string;
  totalPrice: number;
}

export type OrderStatus =
  | 'placed'
  | 'accepted'
  | 'preparing'
  | 'ready_for_pickup'
  | 'picked_up'
  | 'on_the_way'
  | 'delivered'
  | 'cancelled';

export interface OrderTimelineStep {
  status: OrderStatus;
  label: string;
  time: string;
  completed: boolean;
  current: boolean;
}

export interface DeliveryPartner {
  id: string;
  name: string;
  phone: string;
  email?: string;
  photo: string;
  rating: number;
  vehicleType: 'Bike' | 'Scooter' | 'EV' | 'Bicycle';
  vehicleNumber: string;
  drivingLicenseNo?: string;
  isOnline: boolean;
  currentLat: number;
  currentLng: number;
  todayEarnings: number;
  todayCompletedOrders: number;
  todayDistanceKm: number;
  weeklyEarnings: number;
  monthlyEarnings: number;
}

export interface DeliveryRequest {
  id: string;
  orderId: string;
  restaurantId: string;
  restaurantName: string;
  restaurantAddress: string;
  customerName: string;
  customerAddress: string;
  distanceKm: number;
  pickupDistanceKm: number;
  estimatedTimeMinutes: number;
  estimatedEarnings: number;
  orderAmount: number;
  itemsCount: number;
  expiresInSeconds: number;
}

export interface Order {
  id: string;
  restaurantId: string;
  restaurantName: string;
  restaurantImage: string;
  items: CartItem[];
  itemTotal: number;
  deliveryFee: number;
  platformFee: number;
  taxes: number;
  discount: number;
  couponCode?: string;
  grandTotal: number;
  status: OrderStatus;
  createdAt: string;
  estimatedDeliveryTime: string;
  deliveryAddress: Address;
  paymentMethod: string;
  deliveryPartner?: DeliveryPartner;
  timeline: OrderTimelineStep[];
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar: string;
  memberSince: string;
}

export interface Address {
  id: string;
  title: 'Home' | 'Work' | 'Other';
  addressLine1: string;
  addressLine2?: string;
  city: string;
  pincode: string;
  isDefault?: boolean;
  latitude: number;
  longitude: number;
}

export interface Coupon {
  code: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  isActive?: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'order' | 'promo' | 'system' | 'payout';
  isRead: boolean;
  orderId?: string;
  role?: AppRole;
}

export interface FilterOptions {
  sortBy: 'relevance' | 'rating' | 'deliveryTime' | 'costLowHigh' | 'costHighLow';
  foodType?: 'all' | 'veg' | 'non-veg';
  cuisines: string[];
  minRating?: number;
  maxDeliveryTime?: number;
  maxCostForTwo?: number;
  offersOnly?: boolean;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  iconName: string;
}

export interface ReviewItem {
  id: string;
  customerName: string;
  customerAvatar: string;
  rating: number;
  reviewText: string;
  date: string;
  orderItems: string[];
  reply?: string;
}

export interface RestaurantAnalytics {
  todayRevenue: number;
  weeklyRevenue: number;
  monthlyRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  avgRating: number;
  avgOrderValue: number;
  cancellationRate: number;
  topSellingDishes: { name: string; count: number; sales: number }[];
}
