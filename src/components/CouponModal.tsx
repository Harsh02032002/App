import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { X, Tag, Check, Sparkles } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { MOCK_COUPONS } from '../data/mockData';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';

interface CouponModalProps {
  visible: boolean;
  onClose: () => void;
}

export const CouponModal: React.FC<CouponModalProps> = ({ visible, onClose }) => {
  const { appliedCoupon, applyCoupon, removeCoupon, itemTotal } = useApp();

  const handleApply = (code: string) => {
    const res = applyCoupon(code);
    if (res.success) {
      onClose();
    } else {
      alert(res.message);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <Tag size={20} color={COLORS.primary} />
              <Text style={styles.headerTitle}>Available Promo Coupons</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollContent}>
            {MOCK_COUPONS.map((coupon) => {
              const isApplied = appliedCoupon?.code === coupon.code;
              const isEligible = itemTotal >= coupon.minOrderValue;

              return (
                <View
                  key={coupon.code}
                  style={[
                    styles.couponCard,
                    isApplied && styles.appliedCard,
                    !isEligible && styles.disabledCard,
                  ]}
                >
                  <View style={styles.couponTop}>
                    <View style={styles.codeContainer}>
                      <Text style={styles.codeText}>{coupon.code}</Text>
                    </View>
                    {isApplied ? (
                      <TouchableOpacity
                        style={styles.appliedBtn}
                        onPress={removeCoupon}
                      >
                        <Check size={14} color={COLORS.vegGreen} />
                        <Text style={styles.appliedBtnText}>APPLIED</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={[styles.applyBtn, !isEligible && styles.applyBtnDisabled]}
                        onPress={() => handleApply(coupon.code)}
                        disabled={!isEligible}
                      >
                        <Text style={styles.applyBtnText}>APPLY</Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  <Text style={styles.couponTitle}>{coupon.title}</Text>
                  <Text style={styles.couponDesc}>{coupon.description}</Text>

                  {!isEligible && (
                    <Text style={styles.minWarning}>
                      Add ₹{coupon.minOrderValue - itemTotal} more to unlock this offer
                    </Text>
                  )}
                </View>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: COLORS.cardBackground,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginLeft: SPACING.xs,
  },
  closeBtn: {
    padding: SPACING.xs,
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  couponCard: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
  },
  appliedCard: {
    borderColor: COLORS.vegGreen,
    backgroundColor: '#ECFDF5',
  },
  disabledCard: {
    opacity: 0.7,
  },
  couponTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  codeContainer: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: SPACING.md,
    paddingVertical: 4,
    borderRadius: RADIUS.xs,
  },
  codeText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 1,
  },
  applyBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: 6,
    borderRadius: RADIUS.sm,
  },
  applyBtnDisabled: {
    backgroundColor: COLORS.textMuted,
  },
  applyBtnText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '800',
  },
  appliedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.sm,
  },
  appliedBtnText: {
    color: COLORS.vegGreen,
    fontSize: 12,
    fontWeight: '800',
    marginLeft: 4,
  },
  couponTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 4,
  },
  couponDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  minWarning: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: '600',
    marginTop: 6,
  },
});
