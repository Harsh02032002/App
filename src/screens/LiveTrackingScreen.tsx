import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert,
} from 'react-native';
import { ArrowLeft, Phone, MessageSquare, Star, Play, ShieldAlert } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { LiveMapPlaceholder } from '../components/LiveMapPlaceholder';
import { OrderProgressTimeline } from '../components/OrderProgressTimeline';
import { OrderStatus } from '../types';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';

interface LiveTrackingScreenProps {
  orderId?: string;
  onBack: () => void;
}

export const LiveTrackingScreen: React.FC<LiveTrackingScreenProps> = ({
  orderId,
  onBack,
}) => {
  const { orders, updateOrderStatus } = useApp();

  // Find target order or default to active order
  const activeOrder =
    orders.find((o) => o.id === orderId) ||
    orders.find((o) => o.status !== 'delivered') ||
    orders[0];

  const nextStatusMap: Record<OrderStatus, OrderStatus> = {
    placed: 'accepted',
    accepted: 'preparing',
    preparing: 'picked_up',
    picked_up: 'on_the_way',
    on_the_way: 'delivered',
    delivered: 'delivered',
    cancelled: 'cancelled',
  };

  const handleSimulateNext = () => {
    if (!activeOrder) return;
    const next = nextStatusMap[activeOrder.status];
    if (next !== activeOrder.status) {
      updateOrderStatus(activeOrder.id, next);
    } else {
      alert('Order is already marked as Delivered!');
    }
  };

  if (!activeOrder) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={onBack}>
            <ArrowLeft size={22} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Order Tracking</Text>
        </View>
        <View style={styles.emptyCenter}>
          <Text style={styles.emptyTitle}>No active order to track</Text>
        </View>
      </SafeAreaView>
    );
  }

  const partner = activeOrder.deliveryPartner;

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <ArrowLeft size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Live Order Tracking</Text>
          <Text style={styles.headerSub}>Order #{activeOrder.id}</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Animated Map Simulation */}
        <LiveMapPlaceholder
          restaurantName={activeOrder.restaurantName}
          driverName={partner?.name}
          eta={activeOrder.estimatedDeliveryTime}
        />

        {/* Delivery Partner Profile Card */}
        {partner && (
          <View style={styles.partnerCard}>
            <View style={styles.partnerInfoRow}>
              <Image source={{ uri: partner.photo }} style={styles.partnerAvatar} />
              <View style={styles.partnerTextGroup}>
                <View style={styles.partnerNameRow}>
                  <Text style={styles.partnerName}>{partner.name}</Text>
                  <View style={styles.ratingBadge}>
                    <Star size={10} color={COLORS.white} fill={COLORS.white} />
                    <Text style={styles.ratingText}>{partner.rating}</Text>
                  </View>
                </View>
                <Text style={styles.partnerVehicle}>{partner.vehicleNumber}</Text>
                <Text style={styles.partnerStatus}>Your Delivery Valet</Text>
              </View>
            </View>

            {/* Call / Chat Action Buttons */}
            <View style={styles.partnerActionsRow}>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => alert(`Calling ${partner.name} at ${partner.phone}...`)}
              >
                <Phone size={16} color={COLORS.primary} />
                <Text style={styles.actionBtnText}>Call Driver</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => alert(`Opening chat with ${partner.name}...`)}
              >
                <MessageSquare size={16} color={COLORS.primary} />
                <Text style={styles.actionBtnText}>Chat</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Order Progress Timeline Stepper */}
        <View style={styles.timelineCard}>
          <Text style={styles.cardHeaderTitle}>Order Progress</Text>
          <OrderProgressTimeline steps={activeOrder.timeline} />
        </View>

        {/* Simulator Control Action */}
        <View style={styles.simulatorCard}>
          <View style={styles.simTextGroup}>
            <Text style={styles.simTitle}>Prototype Demo Action</Text>
            <Text style={styles.simSub}>Advance order status to next stage</Text>
          </View>

          <TouchableOpacity
            style={styles.simBtn}
            onPress={handleSimulateNext}
            activeOpacity={0.8}
          >
            <Play size={16} color={COLORS.white} fill={COLORS.white} />
            <Text style={styles.simBtnText}>Next Stage</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  headerSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  scrollContent: {
    paddingBottom: SPACING.xxl,
  },
  emptyCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    color: COLORS.textMuted,
  },
  partnerCard: {
    backgroundColor: COLORS.cardBackground,
    margin: SPACING.lg,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    ...SHADOWS.medium,
  },
  partnerInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  partnerAvatar: {
    width: 54,
    height: 54,
    borderRadius: RADIUS.full,
    marginRight: SPACING.md,
  },
  partnerTextGroup: {
    flex: 1,
  },
  partnerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  partnerName: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginRight: SPACING.xs,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.vegGreen,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: RADIUS.xs,
  },
  ratingText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '800',
    marginLeft: 3,
  },
  partnerVehicle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  partnerStatus: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: '700',
    marginTop: 2,
  },
  partnerActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primaryLight,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    marginHorizontal: 4,
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
    marginLeft: SPACING.xs,
  },
  timelineCard: {
    backgroundColor: COLORS.cardBackground,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    ...SHADOWS.light,
  },
  cardHeaderTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  simulatorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#334155',
    marginHorizontal: SPACING.lg,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
  },
  simTextGroup: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  simTitle: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '700',
  },
  simSub: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 2,
  },
  simBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: 8,
    borderRadius: RADIUS.md,
  },
  simBtnText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '800',
    marginLeft: 4,
  },
});
