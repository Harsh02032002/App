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
import { ArrowLeft, Phone, Navigation, CheckCircle2, Store, PackageCheck } from 'lucide-react-native';
import { useApp } from '../../context/AppContext';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';

interface RiderPickupScreenProps {
  onBack: () => void;
  onConfirmPickup: () => void;
}

export const RiderPickupScreen: React.FC<RiderPickupScreenProps> = ({
  onBack,
  onConfirmPickup,
}) => {
  const { activeOrder, updateOrderStatus } = useApp();

  const restaurantName = activeOrder?.restaurantName || 'The Royal Biryani House';
  const restaurantAddress = activeOrder?.deliveryAddress.addressLine1 || '45 Connaught Place';
  const items = activeOrder?.items || [];

  const handleConfirm = () => {
    if (activeOrder) {
      updateOrderStatus(activeOrder.id, 'picked_up');
    }
    onConfirmPickup();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <ArrowLeft size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Task: Restaurant Pickup</Text>
          <Text style={styles.headerSub}>Order #{activeOrder?.id || 'ORD-98421'}</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Map Navigation View */}
        <View style={styles.mapCard}>
          <View style={styles.mapCanvas}>
            <View style={styles.roadLine} />
            <View style={styles.riderPin}>
              <Navigation size={18} color={COLORS.white} style={{ transform: [{ rotate: '45deg' }] }} />
            </View>
            <View style={styles.restPin}>
              <Store size={18} color={COLORS.white} />
            </View>

            <View style={styles.etaBox}>
              <Text style={styles.etaText}>0.8 km • 4 mins to Restaurant</Text>
            </View>
          </View>

          <View style={styles.navActionsRow}>
            <TouchableOpacity
              style={styles.navBtn}
              onPress={() => alert('Opening Google Maps navigation to restaurant...')}
            >
              <Navigation size={16} color={COLORS.white} />
              <Text style={styles.navBtnText}>Start Navigation</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.callBtn}
              onPress={() => alert('Calling Restaurant Manager...')}
            >
              <Phone size={16} color={COLORS.textPrimary} />
              <Text style={styles.callBtnText}>Call Store</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Restaurant Card */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTag}>PICKUP LOCATION</Text>
          <Text style={styles.restTitle}>{restaurantName}</Text>
          <Text style={styles.restAddr}>{restaurantAddress}</Text>
        </View>

        {/* Items Checklist Card */}
        <View style={styles.sectionCard}>
          <View style={styles.checklistHeader}>
            <PackageCheck size={18} color={COLORS.primary} />
            <Text style={styles.checklistTitle}>Verify Order Items ({items.length})</Text>
          </View>

          {items.map((item, idx) => (
            <View key={idx} style={styles.itemCheckRow}>
              <CheckCircle2 size={16} color={COLORS.vegGreen} />
              <View style={styles.itemTextGroup}>
                <Text style={styles.itemName}>
                  {item.quantity}x {item.foodItem.name}
                </Text>
                {item.selectedSize && (
                  <Text style={styles.itemSize}>Size: {item.selectedSize.name}</Text>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Confirm Pickup Action Button */}
        <TouchableOpacity
          style={styles.confirmPickupBtn}
          onPress={handleConfirm}
          activeOpacity={0.85}
        >
          <Text style={styles.confirmText}>Confirm Order Pickup</Text>
        </TouchableOpacity>
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
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  mapCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    marginBottom: SPACING.lg,
    ...SHADOWS.medium,
  },
  mapCanvas: {
    height: 180,
    backgroundColor: '#CBD5E1',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  roadLine: {
    position: 'absolute',
    left: '20%',
    right: '20%',
    height: 4,
    backgroundColor: COLORS.white,
  },
  riderPin: {
    position: 'absolute',
    left: '25%',
    width: 36,
    height: 36,
    borderRadius: RADIUS.full,
    backgroundColor: '#059669',
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.heavy,
  },
  restPin: {
    position: 'absolute',
    right: '25%',
    width: 36,
    height: 36,
    borderRadius: RADIUS.full,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.heavy,
  },
  etaBox: {
    position: 'absolute',
    bottom: 12,
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.md,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    ...SHADOWS.light,
  },
  etaText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  navActionsRow: {
    flexDirection: 'row',
    padding: SPACING.md,
    backgroundColor: COLORS.cardBackground,
  },
  navBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    marginRight: SPACING.xs,
  },
  navBtnText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '800',
    marginLeft: 4,
  },
  callBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    marginLeft: SPACING.xs,
  },
  callBtnText: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 4,
  },
  sectionCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.light,
  },
  sectionTag: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 0.5,
  },
  restTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  restAddr: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  checklistHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  checklistTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginLeft: SPACING.xs,
  },
  itemCheckRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
  },
  itemTextGroup: {
    marginLeft: SPACING.sm,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  itemSize: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  confirmPickupBtn: {
    backgroundColor: '#059669',
    paddingVertical: SPACING.lg,
    borderRadius: RADIUS.xl,
    alignItems: 'center',
    marginTop: SPACING.md,
    ...SHADOWS.medium,
  },
  confirmText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '900',
  },
});
