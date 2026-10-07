import { User, DeliveryPartner, Restaurant, AppRole } from '../types';

export const mockAuthService = {
  async loginCustomer(phone: string): Promise<User> {
    return {
      id: 'usr-101',
      name: 'Aarav Sharma',
      phone: phone || '+91 98765 43210',
      email: 'aarav.sharma@example.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
      memberSince: 'October 2024',
    };
  },

  async loginRider(phone: string): Promise<DeliveryPartner> {
    return {
      id: 'driver-99',
      name: 'Kabir Verma',
      phone: phone || '+91 98112 33445',
      email: 'kabir.verma@cravedash.com',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
      rating: 4.9,
      vehicleType: 'EV',
      vehicleNumber: 'DL 01 CRAVE (Honda Activa)',
      drivingLicenseNo: 'DL-14202100892',
      isOnline: true,
      currentLat: 28.6310,
      currentLng: 77.2160,
      todayEarnings: 1240,
      todayCompletedOrders: 14,
      todayDistanceKm: 42.5,
      weeklyEarnings: 7850,
      monthlyEarnings: 28450,
    };
  },

  async loginRestaurant(phone: string): Promise<{ ownerName: string; restaurantId: string }> {
    return {
      ownerName: 'Vikram Malhotra',
      restaurantId: 'rest-1',
    };
  },
};
