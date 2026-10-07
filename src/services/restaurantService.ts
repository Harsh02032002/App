import { RestaurantAnalytics, ReviewItem } from '../types';

export const MOCK_RESTAURANT_ANALYTICS: RestaurantAnalytics = {
  todayRevenue: 18450,
  weeklyRevenue: 112400,
  monthlyRevenue: 485000,
  totalOrders: 124,
  pendingOrders: 8,
  completedOrders: 110,
  cancelledOrders: 6,
  avgRating: 4.8,
  avgOrderValue: 410,
  cancellationRate: 1.2,
  topSellingDishes: [
    { name: 'Hyderabadi Chicken Dum Biryani', count: 48, sales: 16320 },
    { name: 'Special Mutton Dum Biryani', count: 32, sales: 14720 },
    { name: 'Chicken Galouti Kebab', count: 24, sales: 7680 },
    { name: 'Paneer Tikka Dum Biryani', count: 20, sales: 5800 },
  ],
};

export const MOCK_REVIEWS: ReviewItem[] = [
  {
    id: 'rev-1',
    customerName: 'Aarav Sharma',
    customerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    rating: 5,
    reviewText: 'The Biryani was slow cooked to perfection! Saffron aroma was incredible and chicken was super juicy.',
    date: 'Today, 2:30 PM',
    orderItems: ['Hyderabadi Chicken Dum Biryani', 'Extra Raita'],
    reply: 'Thank you Aarav! Happy to serve you delicious Biryani always.',
  },
  {
    id: 'rev-2',
    customerName: 'Priya Patel',
    customerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    rating: 4.8,
    reviewText: 'Great packaging and quick prep time. Mirchi ka salan was spicy and delicious.',
    date: 'Yesterday, 8:15 PM',
    orderItems: ['Special Mutton Dum Biryani'],
  },
  {
    id: 'rev-3',
    customerName: 'Rohan Gupta',
    customerAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
    rating: 5,
    reviewText: 'Galouti kebabs melt in mouth! Authentic Awadhi taste.',
    date: '3 days ago',
    orderItems: ['Chicken Galouti Kebab (4 pcs)'],
  },
];
