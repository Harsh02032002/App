import { DeliveryRequest, DeliveryPartner } from '../types';

export const MOCK_DELIVERY_REQUESTS: DeliveryRequest[] = [
  {
    id: 'req-101',
    orderId: 'ORD-98421',
    restaurantId: 'rest-1',
    restaurantName: 'The Royal Biryani House',
    restaurantAddress: '45 Connaught Place, Inner Circle',
    customerName: 'Aarav Sharma',
    customerAddress: 'Flat 402, Block B, Green Valley, Sector 62',
    distanceKm: 4.2,
    pickupDistanceKm: 0.8,
    estimatedTimeMinutes: 22,
    estimatedEarnings: 85,
    orderAmount: 533,
    itemsCount: 2,
    expiresInSeconds: 30,
  },
  {
    id: 'req-102',
    orderId: 'ORD-87120',
    restaurantId: 'rest-3',
    restaurantName: "La Pino's Pizza Studio",
    restaurantAddress: '88 Park Street Extension',
    customerName: 'Ananya Roy',
    customerAddress: 'Tower 3, 6th Floor, Cyber Tech Park',
    distanceKm: 3.1,
    pickupDistanceKm: 1.2,
    estimatedTimeMinutes: 18,
    estimatedEarnings: 65,
    orderAmount: 464,
    itemsCount: 1,
    expiresInSeconds: 45,
  },
];

export const mockDeliveryService = {
  async getDeliveryRequests(): Promise<DeliveryRequest[]> {
    return MOCK_DELIVERY_REQUESTS;
  },

  async acceptRequest(requestId: string): Promise<boolean> {
    return true;
  },

  async rejectRequest(requestId: string): Promise<boolean> {
    return true;
  },
};
