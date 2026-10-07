import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import {
  ArrowLeft,
  MapPin,
  Check,
  CreditCard,
  Banknote,
  Wallet,
  Smartphone,
  ShieldCheck,
  Lock,
} from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import { Order } from '../types';

interface CheckoutScreenProps {
  onBack: () => void;
  onOrderSuccess: (order: Order) => void;
}

const PAYMENT_METHODS = [
  {
    id: 'upi',
    title: 'UPI Payment (GPay, PhonePe, Paytm)',
    subtitle: 'Instant & Fast Payment',
    icon: Smartphone,
  },
  {
    id: 'card',
    title: 'Credit / Debit Card',
    subtitle: 'Visa, Mastercard, RuPay',
    icon: CreditCard,
  },
  {
    id: 'cod',
    title: 'Cash on Delivery',
    subtitle: 'Pay cash or UPI upon delivery',
    icon: Banknote,
  },
  {
    id: 'wallet',
    title: 'CravePay Wallet',
    subtitle: 'Balance: ₹1,250 (Flat 5% Cashback)',
    icon: Wallet,
  },
];

export const CheckoutScreen: React.FC<CheckoutScreenProps> = ({ onBack, onOrderSuccess }) => {
  const {
    cartItems,
    cartRestaurant,
    selectedAddress,
    addresses,
    setSelectedAddress,
    grandTotal,
    placeOrder,
  } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<string>('upi');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handlePlaceOrder = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const createdOrder = placeOrder(
        PAYMENT_METHODS.find((p) => p.id === paymentMethod)?.title || 'UPI'
      );
      onOrderSuccess(createdOrder);
    }, 1800);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <ArrowLeft size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout & Payment</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Step 1: Confirm Delivery Address */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>1. Delivery Address</Text>
          {addresses.map((addr) => {
            const isSelected = selectedAddress.id === addr.id;
            return (
              <TouchableOpacity
                key={addr.id}
                style={[styles.addressCard, isSelected && styles.selectedAddressCard]}
                onPress={() => setSelectedAddress(addr)}
                activeOpacity={0.8}
              >
                <View style={styles.addrIconCircle}>
                  <MapPin size={16} color={COLORS.primary} />
                </View>
                <View style={styles.addrTextContainer}>
                  <Text style={styles.addrTitle}>{addr.title}</Text>
                  <Text style={styles.addrDesc} numberOfLines={2}>
                    {addr.addressLine1}, {addr.city}
                  </Text>
                </View>
                {isSelected && (
                  <View style={styles.selectedBadge}>
                    <Check size={12} color={COLORS.white} />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Step 2: Payment Method */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>2. Choose Payment Method</Text>

          {PAYMENT_METHODS.map((pm) => {
            const isSelected = paymentMethod === pm.id;
            const IconComponent = pm.icon;

            return (
              <TouchableOpacity
                key={pm.id}
                style={[styles.paymentRow, isSelected && styles.selectedPaymentRow]}
                onPress={() => setPaymentMethod(pm.id)}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.pmIconCircle,
                    isSelected && { backgroundColor: COLORS.primaryLight },
                  ]}
                >
                  <IconComponent
                    size={20}
                    color={isSelected ? COLORS.primary : COLORS.textPrimary}
                  />
                </View>

                <View style={styles.pmInfo}>
                  <Text style={[styles.pmTitle, isSelected && { color: COLORS.primary }]}>
                    {pm.title}
                  </Text>
                  <Text style={styles.pmSubtitle}>{pm.subtitle}</Text>
                </View>

                <View
                  style={[
                    styles.radioCircle,
                    isSelected && styles.radioCircleActive,
                  ]}
                >
                  {isSelected && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Order Summary Box */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>3. Order Summary</Text>
          <View style={styles.summaryBox}>
            <Text style={styles.restTitle}>{cartRestaurant?.name}</Text>
            <Text style={styles.itemsSummary}>
              {cartItems.map((i) => `${i.quantity}x ${i.foodItem.name}`).join(', ')}
            </Text>
            <View style={styles.summaryTotalRow}>
              <Text style={styles.summaryTotalLabel}>Grand Total</Text>
              <Text style={styles.summaryTotalVal}>₹{grandTotal}</Text>
            </View>
          </View>
        </View>

        <View style={styles.secureBox}>
          <Lock size={16} color={COLORS.vegGreen} />
          <Text style={styles.secureText}>256-Bit Bank-Grade Secure Payment Encrypted</Text>
        </View>
      </ScrollView>

      {/* Place Order CTA Footer */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomLabel}>TOTAL AMOUNT</Text>
          <Text style={styles.bottomAmount}>₹{grandTotal}</Text>
        </View>

        <TouchableOpacity
          style={[styles.placeOrderBtn, isProcessing && styles.btnDisabled]}
          onPress={handlePlaceOrder}
          disabled={isProcessing}
          activeOpacity={0.85}
        >
          {isProcessing ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : (
            <Text style={styles.placeOrderText}>Place Order</Text>
          )}
        </TouchableOpacity>
      </View>
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
    paddingBottom: 90,
  },
  sectionCard: {
    backgroundColor: COLORS.cardBackground,
    padding: SPACING.lg,
    borderRadius: RADIUS.xl,
    marginBottom: SPACING.md,
    ...SHADOWS.light,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.xs,
    backgroundColor: COLORS.background,
  },
  selectedAddressCard: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  addrIconCircle: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  addrTextContainer: {
    flex: 1,
  },
  addrTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  addrDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  selectedBadge: {
    width: 20,
    height: 20,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.xs,
    backgroundColor: COLORS.background,
  },
  selectedPaymentRow: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  pmIconCircle: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  pmInfo: {
    flex: 1,
  },
  pmTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  pmSubtitle: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: RADIUS.full,
    borderWidth: 2,
    borderColor: COLORS.textMuted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioCircleActive: {
    borderColor: COLORS.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary,
  },
  summaryBox: {
    backgroundColor: COLORS.background,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
  },
  restTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  itemsSummary: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },
  summaryTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.md,
    paddingTop: SPACING.xs,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  summaryTotalLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  summaryTotalVal: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.primary,
  },
  secureBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: SPACING.sm,
  },
  secureText: {
    fontSize: 11,
    color: COLORS.vegGreen,
    fontWeight: '700',
    marginLeft: SPACING.xs,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.cardBackground,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    ...SHADOWS.heavy,
  },
  bottomLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 0.5,
  },
  bottomAmount: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  placeOrderBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    ...SHADOWS.medium,
  },
  btnDisabled: {
    opacity: 0.7,
  },
  placeOrderText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '800',
  },
});
