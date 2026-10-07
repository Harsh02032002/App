import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Switch,
  Image,
} from 'react-native';
import {
  Power,
  MapPin,
  TrendingUp,
  Award,
  Navigation,
  CheckCircle2,
  Clock,
  Phone,
  DollarSign,
  Compass,
} from 'lucide-react-native';
import { useApp } from '../../context/AppContext';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { MOCK_DELIVERY_REQUESTS } from '../../services/deliveryService';

interface RiderHomeScreenProps {
  onNavigateRequests: () => void;
  onNavigatePickup: () => void;
}

export const RiderHomeScreen: React.FC<RiderHomeScreenProps> = ({
  onNavigateRequests,
  onNavigatePickup,
}) => {
  const { isRiderOnline, setIsRiderOnline, activeOrder } = useApp();

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Banner: Online Toggle */}
      <View style={[styles.onlineBanner, isRiderOnline ? styles.bannerOnline : styles.bannerOffline]}>
        <View style={styles.bannerLeft}>
          <View style={[styles.statusDot, isRiderOnline ? styles.dotOnline : styles.dotOffline]} />
          <View>
            <Text style={styles.statusTitle}>
              {isRiderOnline ? "You're Online & Ready" : "You're Offline"}
            </Text>
            <Text style={styles.statusSub}>
              {isRiderOnline ? 'Looking for nearby delivery requests...' : 'Turn on toggle to start receiving orders'}
            </Text>
          </View>
        </View>

        <Switch
          value={isRiderOnline}
          onValueChange={setIsRiderOnline}
          trackColor={{ false: COLORS.border, true: '#A7F3D0' }}
          thumbColor={isRiderOnline ? COLORS.vegGreen : COLORS.textMuted}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Today's Earnings & Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={styles.statIconBox}>
              <TrendingUp size={20} color={COLORS.vegGreen} />
            </View>
            <Text style={styles.statValue}>₹1,240</Text>
            <Text style={styles.statLabel}>Today's Earnings</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconBox, { backgroundColor: COLORS.primaryLight }]}>
              <CheckCircle2 size={20} color={COLORS.primary} />
            </View>
            <Text style={styles.statValue}>14</Text>
            <Text style={styles.statLabel}>Completed Orders</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconBox, { backgroundColor: '#FEF3C7' }]}>
              <Compass size={20} color="#D97706" />
            </View>
            <Text style={styles.statValue}>42.5 km</Text>
            <Text style={styles.statLabel}>Distance Covered</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconBox, { backgroundColor: COLORS.secondaryLight }]}>
              <Award size={20} color={COLORS.secondary} />
            </View>
            <Text style={styles.statValue}>4.9 ⭐</Text>
            <Text style={styles.statLabel}>Rider Rating</Text>
          </View>
        </View>

        {/* Incoming Request Alert Pill */}
        {isRiderOnline && (
          <TouchableOpacity
            style={styles.incomingAlertCard}
            onPress={onNavigateRequests}
            activeOpacity={0.9}
          >
            <View style={styles.alertLeft}>
              <View style={styles.pulseDot} />
              <View>
                <Text style={styles.alertTitle}>New Delivery Request Available!</Text>
                <Text style={styles.alertSub}>The Royal Biryani House • Est. ₹85</Text>
              </View>
            </View>
            <View style={styles.viewReqBtn}>
              <Text style={styles.viewReqText}>View Request</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Map Hotspot Visual Canvas */}
        <View style={styles.mapCard}>
          <View style={styles.mapHeader}>
            <MapPin size={16} color={COLORS.primary} />
            <Text style={styles.mapHeaderTitle}>Demand Hotspot Area: Connaught Place</Text>
          </View>

          <View style={styles.mapCanvas}>
            <View style={styles.road1} />
            <View style={styles.road2} />
            <View style={styles.hotspotZone1} />
            <View style={styles.hotspotZone2} />

            {/* Rider Location Marker */}
            <View style={styles.riderPin}>
              <Navigation size={18} color={COLORS.white} style={{ transform: [{ rotate: '45deg' }] }} />
            </View>
          </View>
        </View>

        {/* Active Assigned Order Card */}
        {activeOrder && (
          <View style={styles.activeOrderCard}>
            <Text style={styles.activeCardTitle}>Current Assigned Order</Text>
            <View style={styles.activeCardBody}>
              <Text style={styles.activeRestName}>{activeOrder.restaurantName}</Text>
              <Text style={styles.activeAddr}>Deliver to: {activeOrder.deliveryAddress.title}</Text>
              <Text style={styles.activeAmount}>Earnings: ₹85 • {activeOrder.items.length} Items</Text>

              <TouchableOpacity
                style={styles.startNavBtn}
                onPress={onNavigatePickup}
                activeOpacity={0.85}
              >
                <Navigation size={16} color={COLORS.white} style={{ marginRight: 6 }} />
                <Text style={styles.startNavText}>Start Delivery Task</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  onlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  bannerOnline: {
    backgroundColor: '#ECFDF5',
  },
  bannerOffline: {
    backgroundColor: COLORS.cardBackground,
  },
  bannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: RADIUS.full,
    marginRight: SPACING.md,
  },
  dotOnline: {
    backgroundColor: COLORS.vegGreen,
  },
  dotOffline: {
    backgroundColor: COLORS.textMuted,
  },
  statusTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  statusSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  statCard: {
    width: '48%',
    backgroundColor: COLORS.cardBackground,
    padding: SPACING.md,
    borderRadius: RADIUS.xl,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.light,
  },
  statIconBox: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  incomingAlertCard: {
    backgroundColor: '#1E293B',
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
    ...SHADOWS.heavy,
  },
  alertLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  pulseDot: {
    width: 10,
    height: 10,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary,
    marginRight: SPACING.md,
  },
  alertTitle: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '800',
  },
  alertSub: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 2,
  },
  viewReqBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.md,
  },
  viewReqText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '800',
  },
  mapCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.light,
  },
  mapHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  mapHeaderTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginLeft: SPACING.xs,
  },
  mapCanvas: {
    height: 160,
    backgroundColor: '#E2E8F0',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  road1: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 16,
    backgroundColor: COLORS.white,
    top: '40%',
  },
  road2: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 16,
    backgroundColor: COLORS.white,
    left: '50%',
  },
  hotspotZone1: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(239, 68, 68, 0.25)',
    top: 10,
    left: 20,
  },
  hotspotZone2: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(245, 158, 11, 0.25)',
    bottom: 10,
    right: 30,
  },
  riderPin: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.full,
    backgroundColor: '#059669',
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.heavy,
  },
  activeOrderCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1.5,
    borderColor: '#059669',
    ...SHADOWS.medium,
  },
  activeCardTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#059669',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  activeCardBody: {
    marginTop: SPACING.xs,
  },
  activeRestName: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  activeAddr: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  activeAmount: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: 4,
  },
  startNavBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#059669',
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    marginTop: SPACING.md,
  },
  startNavText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '800',
  },
});
