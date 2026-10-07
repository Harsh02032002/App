import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { ArrowLeft, Clock, MapPin, Store, DollarSign, Check, X, ShieldCheck } from 'lucide-react-native';
import { MOCK_DELIVERY_REQUESTS } from '../../services/deliveryService';
import { DeliveryRequest } from '../../types';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';

interface RiderRequestsScreenProps {
  onBack: () => void;
  onAcceptRequest: (request: DeliveryRequest) => void;
}

export const RiderRequestsScreen: React.FC<RiderRequestsScreenProps> = ({
  onBack,
  onAcceptRequest,
}) => {
  const [requests, setRequests] = useState<DeliveryRequest[]>(MOCK_DELIVERY_REQUESTS);
  const [timer, setTimer] = useState<number>(30);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 30));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleReject = (id: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <ArrowLeft size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Delivery Requests ({requests.length})</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {requests.length === 0 ? (
          <View style={styles.emptyBox}>
            <Clock size={48} color={COLORS.textMuted} />
            <Text style={styles.emptyTitle}>No Pending Requests</Text>
            <Text style={styles.emptySub}>Stay online! New requests will pop up automatically as nearby customers order.</Text>
          </View>
        ) : (
          requests.map((req) => (
            <View key={req.id} style={styles.requestCard}>
              {/* Card Header with Countdown */}
              <View style={styles.cardHeaderRow}>
                <View style={styles.earningsBadge}>
                  <Text style={styles.earningsLabel}>EARNINGS</Text>
                  <Text style={styles.earningsValue}>+₹{req.estimatedEarnings}</Text>
                </View>

                <View style={styles.timerBadge}>
                  <Clock size={14} color={COLORS.primary} />
                  <Text style={styles.timerText}>{timer}s left</Text>
                </View>
              </View>

              {/* Restaurant Pickup Location */}
              <View style={styles.locationGroup}>
                <View style={styles.iconCircleStore}>
                  <Store size={16} color={COLORS.white} />
                </View>
                <View style={styles.locationInfo}>
                  <Text style={styles.locationTag}>PICKUP ({req.pickupDistanceKm} km away)</Text>
                  <Text style={styles.locationName}>{req.restaurantName}</Text>
                  <Text style={styles.locationAddr}>{req.restaurantAddress}</Text>
                </View>
              </View>

              <View style={styles.dottedConnector} />

              {/* Customer Drop Location */}
              <View style={styles.locationGroup}>
                <View style={styles.iconCircleHome}>
                  <MapPin size={16} color={COLORS.white} />
                </View>
                <View style={styles.locationInfo}>
                  <Text style={styles.locationTag}>DROP ({req.distanceKm} km trip)</Text>
                  <Text style={styles.locationName}>{req.customerName}</Text>
                  <Text style={styles.locationAddr}>{req.customerAddress}</Text>
                </View>
              </View>

              {/* Meta details */}
              <View style={styles.metaRow}>
                <Text style={styles.metaText}>Est. Time: {req.estimatedTimeMinutes} mins</Text>
                <Text style={styles.metaText}>Order Value: ₹{req.orderAmount}</Text>
                <Text style={styles.metaText}>{req.itemsCount} Items</Text>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={styles.rejectBtn}
                  onPress={() => handleReject(req.id)}
                  activeOpacity={0.8}
                >
                  <X size={16} color={COLORS.nonVegRed} />
                  <Text style={styles.rejectText}>Decline</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.acceptBtn}
                  onPress={() => onAcceptRequest(req)}
                  activeOpacity={0.85}
                >
                  <Check size={18} color={COLORS.white} />
                  <Text style={styles.acceptText}>Accept Order</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
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
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  emptyBox: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl * 2,
    paddingHorizontal: SPACING.xl,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: SPACING.md,
  },
  emptySub: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
  },
  requestCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.medium,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  earningsBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: SPACING.md,
    paddingVertical: 4,
    borderRadius: RADIUS.md,
  },
  earningsLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.vegGreen,
    letterSpacing: 0.5,
  },
  earningsValue: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.vegGreen,
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
  },
  timerText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primary,
    marginLeft: 4,
  },
  locationGroup: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconCircleStore: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.full,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  iconCircleHome: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.full,
    backgroundColor: '#059669',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  locationInfo: {
    flex: 1,
  },
  locationTag: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 0.5,
  },
  locationName: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: 1,
  },
  locationAddr: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  dottedConnector: {
    width: 2,
    height: 16,
    backgroundColor: COLORS.border,
    marginLeft: 15,
    marginVertical: 4,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.background,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginVertical: SPACING.md,
  },
  metaText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rejectBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    marginRight: SPACING.xs,
  },
  rejectText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.nonVegRed,
    marginLeft: 4,
  },
  acceptBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#059669',
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    marginLeft: SPACING.xs,
  },
  acceptText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.white,
    marginLeft: 4,
  },
});
