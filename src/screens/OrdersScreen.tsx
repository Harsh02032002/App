import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import { ArrowLeft, RefreshCw, Star, Navigation, Clock, CheckCircle2 } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { RatingModal } from '../components/RatingModal';
import { EmptyState } from '../components/EmptyState';
import { Order } from '../types';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';

interface OrdersScreenProps {
  onBack: () => void;
  onTrackOrder: (orderId: string) => void;
  onNavigateCart: () => void;
}

export const OrdersScreen: React.FC<OrdersScreenProps> = ({
  onBack,
  onTrackOrder,
  onNavigateCart,
}) => {
  const { orders, reorder } = useApp();
  const [activeTab, setActiveTab] = useState<'active' | 'past'>('active');
  const [ratingModalRestaurant, setRatingModalRestaurant] = useState<string | null>(null);

  const activeOrders = orders.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled');
  const pastOrders = orders.filter((o) => o.status === 'delivered' || o.status === 'cancelled');

  const displayedOrders = activeTab === 'active' ? activeOrders : pastOrders;

  const handleReorder = (order: Order) => {
    reorder(order);
    onNavigateCart();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <ArrowLeft size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Orders</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsRow}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'active' && styles.activeTabBtn]}
          onPress={() => setActiveTab('active')}
        >
          <Text style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}>
            Active Orders ({activeOrders.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'past' && styles.activeTabBtn]}
          onPress={() => setActiveTab('past')}
        >
          <Text style={[styles.tabText, activeTab === 'past' && styles.activeTabText]}>
            Past Orders ({pastOrders.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {displayedOrders.length === 0 ? (
          <EmptyState
            type="orders"
            title={activeTab === 'active' ? 'No Active Orders' : 'No Past Orders'}
            subtitle={
              activeTab === 'active'
                ? "You don't have any ongoing food orders right now."
                : "Your past food delivery history will show up here."
            }
          />
        ) : (
          displayedOrders.map((ord) => {
            const isLive = ord.status !== 'delivered' && ord.status !== 'cancelled';

            return (
              <View key={ord.id} style={styles.orderCard}>
                {/* Header: Restaurant & Status */}
                <View style={styles.cardHeader}>
                  <View style={styles.restGroup}>
                    <Image source={{ uri: ord.restaurantImage }} style={styles.restImage} />
                    <View style={styles.restTextGroup}>
                      <Text style={styles.restName}>{ord.restaurantName}</Text>
                      <Text style={styles.orderDate}>Order #{ord.id} • {ord.createdAt}</Text>
                    </View>
                  </View>

                  <View
                    style={[
                      styles.statusBadge,
                      isLive ? styles.liveStatusBadge : styles.deliveredStatusBadge,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        isLive ? styles.liveStatusText : styles.deliveredStatusText,
                      ]}
                    >
                      {ord.status.replace(/_/g, ' ').toUpperCase()}
                    </Text>
                  </View>
                </View>

                {/* Items Summary */}
                <View style={styles.itemsBox}>
                  {ord.items.map((item, idx) => (
                    <Text key={idx} style={styles.itemLine}>
                      {item.quantity}x {item.foodItem.name}
                      {item.selectedSize ? ` (${item.selectedSize.name})` : ''}
                    </Text>
                  ))}
                </View>

                {/* Footer: Price & Actions */}
                <View style={styles.cardFooter}>
                  <Text style={styles.totalPrice}>₹{ord.grandTotal}</Text>

                  <View style={styles.actionsGroup}>
                    {isLive ? (
                      <TouchableOpacity
                        style={styles.trackBtn}
                        onPress={() => onTrackOrder(ord.id)}
                        activeOpacity={0.8}
                      >
                        <Navigation size={14} color={COLORS.white} style={{ marginRight: 4 }} />
                        <Text style={styles.trackBtnText}>Track Order</Text>
                      </TouchableOpacity>
                    ) : (
                      <>
                        <TouchableOpacity
                          style={styles.rateBtn}
                          onPress={() => setRatingModalRestaurant(ord.restaurantName)}
                          activeOpacity={0.8}
                        >
                          <Star size={14} color={COLORS.starYellow} fill={COLORS.starYellow} />
                          <Text style={styles.rateBtnText}>Rate</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.reorderBtn}
                          onPress={() => handleReorder(ord)}
                          activeOpacity={0.8}
                        >
                          <RefreshCw size={14} color={COLORS.primary} style={{ marginRight: 4 }} />
                          <Text style={styles.reorderBtnText}>Reorder</Text>
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Rating Modal */}
      <RatingModal
        visible={!!ratingModalRestaurant}
        restaurantName={ratingModalRestaurant || ''}
        onClose={() => setRatingModalRestaurant(null)}
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
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  orderCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.light,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  restGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: SPACING.xs,
  },
  restImage: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
  },
  restTextGroup: {
    marginLeft: SPACING.md,
    flex: 1,
  },
  restName: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  orderDate: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.xs,
  },
  liveStatusBadge: {
    backgroundColor: COLORS.primaryLight,
  },
  deliveredStatusBadge: {
    backgroundColor: '#ECFDF5',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
  },
  liveStatusText: {
    color: COLORS.primary,
  },
  deliveredStatusText: {
    color: COLORS.vegGreen,
  },
  itemsBox: {
    backgroundColor: COLORS.background,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.md,
  },
  itemLine: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  actionsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: 8,
    borderRadius: RADIUS.md,
  },
  trackBtnText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '700',
  },
  rateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondaryLight,
    paddingHorizontal: SPACING.md,
    paddingVertical: 8,
    borderRadius: RADIUS.md,
    marginRight: SPACING.xs,
  },
  rateBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#D97706',
    marginLeft: 3,
  },
  reorderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: SPACING.md,
    paddingVertical: 8,
    borderRadius: RADIUS.md,
  },
  reorderBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
});
