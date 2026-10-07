export type FoodType = 'veg' | 'non-veg' | 'egg';

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
  offerBadge?: string;
  aboutText: string;
  openingHours: string;
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
  cartItemId: string; // unique ID including selected customizations
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
  photo: string;
  rating: number;
  vehicleNumber: string;
  currentLat: number;
  currentLng: number;
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
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'order' | 'promo' | 'system';
  isRead: boolean;
  orderId?: string;
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
