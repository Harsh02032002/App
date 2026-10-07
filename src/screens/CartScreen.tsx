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
import {
  ArrowLeft,
  Trash2,
  Plus,
  Minus,
  Tag,
  MapPin,
  ChevronRight,
  ShieldCheck,
  Heart,
  Sparkles,
  Check,
} from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { CouponModal } from '../components/CouponModal';
import { EmptyState } from '../components/EmptyState';
import { LocationModal } from '../components/LocationModal';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';

interface CartScreenProps {
  onBack: () => void;
  onProceedCheckout: () => void;
  onExploreFood: () => void;
}

export const CartScreen: React.FC<CartScreenProps> = ({
  onBack,
  onProceedCheckout,
  onExploreFood,
}) => {
  const {
    cartItems,
    cartRestaurant,
    updateQuantity,
    removeFromCart,
    itemTotal,
    deliveryFee,
    platformFee,
    taxes,
    discountAmount,
    grandTotal,
    appliedCoupon,
    removeCoupon,
    selectedAddress,
  } = useApp();

  const [showCouponModal, setShowCouponModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedTip, setSelectedTip] = useState<number>(30);

  if (cartItems.length === 0 || !cartRestaurant) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={onBack}>
            <ArrowLeft size={22} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Cart</Text>
        </View>
        <EmptyState
          type="cart"
          title="Your Cart is Empty"
          subtitle="Good food is always cooking! Go ahead and add some delicious items from top restaurants."
          buttonText="Explore Restaurants"
          onPressButton={onExploreFood}
        />
      </SafeAreaView>
    );
  }

  const finalGrandTotal = grandTotal + selectedTip;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <ArrowLeft size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>My Cart</Text>
          <Text style={styles.headerSubTitle}>{cartRestaurant.name}</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Restaurant Header Banner */}
        <View style={styles.restaurantBannerCard}>
          <Image source={{ uri: cartRestaurant.coverImage }} style={styles.restImage} />
          <View style={styles.restInfo}>
            <Text style={styles.restName}>{cartRestaurant.name}</Text>
            <Text style={styles.restArea}>{cartRestaurant.area}</Text>
          </View>
        </View>

        {/* Cart Items List */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeaderTitle}>Ordered Items ({cartItems.length})</Text>

          {cartItems.map((item) => (
            <View key={item.cartItemId} style={styles.itemRow}>
              {/* Veg/Non-Veg Icon */}
              <View style={styles.itemMainLeft}>
                <View
                  style={[
                    styles.vegSquare,
                    {
                      borderColor:
                        item.foodItem.type === 'veg' ? COLORS.vegGreen : COLORS.nonVegRed,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.vegDot,
                      {
                        backgroundColor:
                          item.foodItem.type === 'veg' ? COLORS.vegGreen : COLORS.nonVegRed,
                      },
                    ]}
                  />
                </View>
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName}>{item.foodItem.name}</Text>
                  <Text style={styles.itemUnitPrice}>₹{item.foodItem.price}</Text>

                  {/* Size customization text */}
                  {item.selectedSize && (
                    <Text style={styles.customText}>Size: {item.selectedSize.name}</Text>
                  )}

                  {/* Addons breakdown */}
                  {item.selectedAddOns.length > 0 && (
                    <Text style={styles.customText}>
                      Add-ons: {item.selectedAddOns.map((a) => a.name).join(', ')}
                    </Text>
                  )}
                </View>
              </View>

              {/* Stepper & Total Price */}
              <View style={styles.itemMainRight}>
                <View style={styles.stepperBox}>
                  <TouchableOpacity
                    onPress={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                    style={styles.stepBtn}
                  >
                    <Minus size={12} color={COLORS.primary} />
                  </TouchableOpacity>
                  <Text style={styles.stepQty}>{item.quantity}</Text>
                  <TouchableOpacity
                    onPress={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                    style={styles.stepBtn}
                  >
                    <Plus size={12} color={COLORS.primary} />
                  </TouchableOpacity>
                </View>

                <Text style={styles.itemTotalPrice}>₹{item.totalPrice}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Coupon Promo Section */}
        <TouchableOpacity
          style={styles.couponCard}
          onPress={() => setShowCouponModal(true)}
          activeOpacity={0.8}
        >
          <View style={styles.couponLeft}>
            <View style={styles.tagIconCircle}>
              <Tag size={18} color={COLORS.primary} />
            </View>
            <View>
              <Text style={styles.couponTitle}>
                {appliedCoupon ? `Applied: ${appliedCoupon.code}` : 'Apply Coupon Code'}
              </Text>
              <Text style={styles.couponSub}>
                {appliedCoupon
                  ? `Saved ₹${discountAmount} with ${appliedCoupon.code}`
                  : 'Unlock up to 50% OFF discounts'}
              </Text>
            </View>
          </View>

          {appliedCoupon ? (
            <TouchableOpacity onPress={removeCoupon}>
              <Text style={styles.removeCouponText}>Remove</Text>
            </TouchableOpacity>
          ) : (
            <ChevronRight size={18} color={COLORS.textSecondary} />
          )}
        </TouchableOpacity>

        {/* Tip Delivery Partner */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeaderTitle}>Tip Your Delivery Partner</Text>
          <Text style={styles.tipSub}>
            100% of your tip goes directly to your delivery partner.
          </Text>
          <View style={styles.tipRow}>
            {[20, 30, 50, 100].map((tip) => (
              <TouchableOpacity
                key={tip}
                style={[styles.tipChip, selectedTip === tip && styles.activeTipChip]}
                onPress={() => setSelectedTip(selectedTip === tip ? 0 : tip)}
              >
                <Text style={[styles.tipChipText, selectedTip === tip && styles.activeTipText]}>
                  ₹{tip}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Delivery Address Card */}
        <View style={styles.sectionCard}>
          <View style={styles.addrHeaderRow}>
            <View style={styles.addrTitleGroup}>
              <MapPin size={18} color={COLORS.primary} />
              <Text style={styles.addrHeaderTitle}>Deliver To: {selectedAddress.title}</Text>
            </View>
            <TouchableOpacity onPress={() => setShowLocationModal(true)}>
              <Text style={styles.changeAddrText}>Change</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.addrDetailText}>
            {selectedAddress.addressLine1}, {selectedAddress.city} - {selectedAddress.pincode}
          </Text>
        </View>

        {/* Bill Summary Breakdown */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeaderTitle}>Bill Details</Text>

          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Item Total</Text>
            <Text style={styles.billValue}>₹{itemTotal}</Text>
          </View>

          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Delivery Fee (2.4 km)</Text>
            <Text style={styles.billValue}>₹{deliveryFee}</Text>
          </View>

          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Platform Fee</Text>
            <Text style={styles.billValue}>₹{platformFee}</Text>
          </View>

          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Government Taxes (5%)</Text>
            <Text style={styles.billValue}>₹{taxes}</Text>
          </View>

          {discountAmount > 0 && (
            <View style={styles.billRow}>
              <Text style={[styles.billLabel, styles.discountText]}>Coupon Discount</Text>
              <Text style={[styles.billValue, styles.discountText]}>-₹{discountAmount}</Text>
            </View>
          )}

          {selectedTip > 0 && (
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Delivery Partner Tip</Text>
              <Text style={styles.billValue}>₹{selectedTip}</Text>
            </View>
          )}

          <View style={styles.billDivider} />

          <View style={styles.billRow}>
            <Text style={styles.grandTotalLabel}>To Pay</Text>
            <Text style={styles.grandTotalValue}>₹{finalGrandTotal}</Text>
          </View>
        </View>

        <View style={styles.cancellationPolicyBox}>
          <ShieldCheck size={16} color={COLORS.textMuted} />
          <Text style={styles.policyText}>
            Orders once placed cannot be cancelled after 60 seconds of restaurant confirmation.
          </Text>
        </View>
      </ScrollView>

      {/* Checkout Bottom Bar */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.payTotalLabel}>TOTAL TO PAY</Text>
          <Text style={styles.payTotalAmount}>₹{finalGrandTotal}</Text>
        </View>

        <TouchableOpacity
          style={styles.checkoutBtn}
          onPress={onProceedCheckout}
          activeOpacity={0.85}
        >
          <Text style={styles.checkoutText}>Proceed to Checkout</Text>
          <ChevronRight size={18} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* Coupon Modal */}
      <CouponModal visible={showCouponModal} onClose={() => setShowCouponModal(false)} />

      {/* Location Modal */}
      <LocationModal visible={showLocationModal} onClose={() => setShowLocationModal(false)} />
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
  headerSubTitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: 90,
  },
  restaurantBannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.light,
  },
  restImage: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.md,
  },
  restInfo: {
    marginLeft: SPACING.md,
  },
  restName: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  restArea: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  sectionCard: {
    backgroundColor: COLORS.cardBackground,
    padding: SPACING.lg,
    borderRadius: RADIUS.xl,
    marginBottom: SPACING.md,
    ...SHADOWS.light,
  },
  sectionHeaderTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  itemMainLeft: {
    flexDirection: 'row',
    flex: 1,
    marginRight: SPACING.md,
  },
  vegSquare: {
    width: 14,
    height: 14,
    borderWidth: 1.5,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
    marginRight: SPACING.xs,
  },
  vegDot: {
    width: 6,
    height: 6,
    borderRadius: RADIUS.full,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  itemUnitPrice: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  customText: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  itemMainRight: {
    alignItems: 'flex-end',
  },
  stepperBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: RADIUS.xs,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginBottom: 6,
  },
  stepBtn: {
    padding: 4,
  },
  stepQty: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primary,
    marginHorizontal: 8,
  },
  itemTotalPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  couponCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.cardBackground,
    padding: SPACING.lg,
    borderRadius: RADIUS.xl,
    marginBottom: SPACING.md,
    ...SHADOWS.light,
  },
  couponLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagIconCircle: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  couponTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  couponSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  removeCouponText: {
    color: COLORS.nonVegRed,
    fontSize: 12,
    fontWeight: '700',
  },
  tipSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: -SPACING.xs,
    marginBottom: SPACING.md,
  },
  tipRow: {
    flexDirection: 'row',
  },
  tipChip: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: SPACING.sm,
  },
  activeTipChip: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  tipChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  activeTipText: {
    color: COLORS.white,
    fontWeight: '800',
  },
  addrHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  addrTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addrHeaderTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginLeft: SPACING.xs,
  },
  changeAddrText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  addrDetailText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 16,
    marginLeft: 26,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  billLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  billValue: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  discountText: {
    color: COLORS.vegGreen,
    fontWeight: '700',
  },
  billDivider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: SPACING.xs,
  },
  grandTotalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  grandTotalValue: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.primary,
  },
  cancellationPolicyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    marginVertical: SPACING.sm,
  },
  policyText: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginLeft: SPACING.xs,
    lineHeight: 16,
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
  payTotalLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 0.5,
  },
  payTotalAmount: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  checkoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    ...SHADOWS.medium,
  },
  checkoutText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '800',
    marginRight: 4,
  },
});
