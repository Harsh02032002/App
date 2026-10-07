import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Animated,
} from 'react-native';
import { CheckCircle2, Navigation, Home, Clock, Sparkles } from 'lucide-react-native';
import { Order } from '../types';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';

interface OrderConfirmationScreenProps {
  order: Order | null;
  onTrackOrder: (orderId: string) => void;
  onGoHome: () => void;
}

export const OrderConfirmationScreen: React.FC<OrderConfirmationScreenProps> = ({
  order,
  onTrackOrder,
  onGoHome,
}) => {
  const [scaleAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, []);

  const orderId = order?.id || 'ORD-98421';
  const restaurantName = order?.restaurantName || 'The Royal Biryani House';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Animated Checkmark Circle */}
        <Animated.View style={[styles.iconCircle, { transform: [{ scale: scaleAnim }] }]}>
          <CheckCircle2 size={64} color={COLORS.white} />
        </Animated.View>

        <Text style={styles.title}>Order Placed Successfully!</Text>
        <Text style={styles.orderIdText}>Order #{orderId}</Text>
        <Text style={styles.subtitle}>
          The restaurant has received your order and is starting preparation right away.
        </Text>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Clock size={18} color={COLORS.primary} />
            <View style={styles.infoTextGroup}>
              <Text style={styles.infoLabel}>Estimated Delivery</Text>
              <Text style={styles.infoVal}>25 - 30 Minutes</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Sparkles size={18} color={COLORS.secondary} />
            <View style={styles.infoTextGroup}>
              <Text style={styles.infoLabel}>Restaurant</Text>
              <Text style={styles.infoVal}>{restaurantName}</Text>
            </View>
          </View>
        </View>

        {/* Buttons */}
        <TouchableOpacity
          style={styles.trackBtn}
          onPress={() => onTrackOrder(orderId)}
          activeOpacity={0.85}
        >
          <Navigation size={18} color={COLORS.white} style={{ marginRight: 6 }} />
          <Text style={styles.trackBtnText}>Track Live Order</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.homeBtn} onPress={onGoHome} activeOpacity={0.8}>
          <Home size={18} color={COLORS.textPrimary} style={{ marginRight: 6 }} />
          <Text style={styles.homeBtnText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cardBackground,
    justifyContent: 'center',
  },
  content: {
    padding: SPACING.xl,
    alignItems: 'center',
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.vegGreen,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
    ...SHADOWS.heavy,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  orderIdText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: 4,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.xs,
    marginBottom: SPACING.xl,
    lineHeight: 20,
  },
  infoCard: {
    width: '100%',
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoTextGroup: {
    marginLeft: SPACING.md,
  },
  infoLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  infoVal: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: SPACING.md,
  },
  trackBtn: {
    width: '100%',
    height: 52,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
    ...SHADOWS.medium,
  },
  trackBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '800',
  },
  homeBtn: {
    width: '100%',
    height: 50,
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  homeBtnText: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
});
