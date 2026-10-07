import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { X, Check, Plus, Minus, ShieldCheck } from 'lucide-react-native';
import { FoodItem, CustomizationOption } from '../types';
import { useApp } from '../context/AppContext';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';

interface Props {
  visible: boolean;
  foodItem: FoodItem | null;
  onClose: () => void;
}

export const FoodCustomizationModal: React.FC<Props> = ({ visible, foodItem, onClose }) => {
  const { addToCart } = useApp();

  const [selectedSize, setSelectedSize] = useState<CustomizationOption | undefined>(undefined);
  const [selectedAddOns, setSelectedAddOns] = useState<CustomizationOption[]>([]);
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    if (foodItem) {
      setQuantity(1);
      setSelectedAddOns([]);
      // Default to first size option if available
      const sizeGroup = foodItem.customizationGroups?.find((g) => g.id === 'size' || g.title.toLowerCase().includes('size') || g.title.toLowerCase().includes('portion'));
      if (sizeGroup && sizeGroup.options.length > 0) {
        setSelectedSize(sizeGroup.options[0]);
      } else {
        setSelectedSize(undefined);
      }
    }
  }, [foodItem]);

  if (!foodItem) return null;

  const sizeAddPrice = selectedSize ? selectedSize.price : 0;
  const addOnsTotal = selectedAddOns.reduce((acc, curr) => acc + curr.price, 0);
  const itemUnitPrice = foodItem.price + sizeAddPrice + addOnsTotal;
  const totalCalculatedPrice = itemUnitPrice * quantity;

  const toggleAddOn = (addon: CustomizationOption) => {
    setSelectedAddOns((prev) =>
      prev.some((a) => a.id === addon.id)
        ? prev.filter((a) => a.id !== addon.id)
        : [...prev, addon]
    );
  };

  const handleAddToCart = () => {
    addToCart(foodItem, selectedSize, selectedAddOns, quantity);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          {/* Header Bar */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Customize Item</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Item Banner Header */}
            <View style={styles.foodHeader}>
              <Image source={{ uri: foodItem.image }} style={styles.foodImage} />
              <View style={styles.foodInfo}>
                <Text style={styles.foodName}>{foodItem.name}</Text>
                <Text style={styles.foodDesc} numberOfLines={2}>
                  {foodItem.description}
                </Text>
                <Text style={styles.basePrice}>Base Price: ₹{foodItem.price}</Text>
              </View>
            </View>

            {/* Customization Groups */}
            {foodItem.customizationGroups?.map((group) => (
              <View key={group.id} style={styles.groupContainer}>
                <View style={styles.groupHeader}>
                  <Text style={styles.groupTitle}>{group.title}</Text>
                  {group.required && <Text style={styles.requiredBadge}>REQUIRED</Text>}
                </View>

                {group.options.map((option) => {
                  const isSizeGroup = group.id === 'size' || group.title.toLowerCase().includes('size') || group.title.toLowerCase().includes('portion');
                  const isSelected = isSizeGroup
                    ? selectedSize?.id === option.id
                    : selectedAddOns.some((a) => a.id === option.id);

                  return (
                    <TouchableOpacity
                      key={option.id}
                      style={[styles.optionRow, isSelected && styles.selectedOptionRow]}
                      onPress={() => {
                        if (isSizeGroup) {
                          setSelectedSize(option);
                        } else {
                          toggleAddOn(option);
                        }
                      }}
                      activeOpacity={0.7}
                    >
                      <View style={styles.optionLeft}>
                        <View
                          style={[
                            styles.checkboxCircle,
                            isSizeGroup && styles.radioCircle,
                            isSelected && styles.checkedCircle,
                          ]}
                        >
                          {isSelected && <Check size={12} color={COLORS.white} />}
                        </View>
                        <Text style={[styles.optionName, isSelected && styles.selectedOptionText]}>
                          {option.name}
                        </Text>
                      </View>

                      <Text style={styles.optionPrice}>
                        {option.price === 0 ? 'Free' : `+₹${option.price}`}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}

            <View style={styles.hygieneNote}>
              <ShieldCheck size={16} color={COLORS.vegGreen} />
              <Text style={styles.hygieneText}>Freshly prepared with top hygiene standards</Text>
            </View>
          </ScrollView>

          {/* Footer Controls & Add CTA */}
          <View style={styles.footer}>
            {/* Quantity Stepper */}
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                <Minus size={16} color={COLORS.textPrimary} />
              </TouchableOpacity>
              <Text style={styles.qtyText}>{quantity}</Text>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => setQuantity((q) => q + 1)}
              >
                <Plus size={16} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>

            {/* Add to Cart CTA */}
            <TouchableOpacity style={styles.addCta} onPress={handleAddToCart} activeOpacity={0.85}>
              <Text style={styles.ctaText}>Add Item</Text>
              <Text style={styles.ctaPrice}>₹{totalCalculatedPrice}</Text>
            </TouchableOpacity>
          </View>
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
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  closeBtn: {
    padding: SPACING.xs,
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  foodHeader: {
    flexDirection: 'row',
    marginBottom: SPACING.lg,
  },
  foodImage: {
    width: 70,
    height: 70,
    borderRadius: RADIUS.md,
  },
  foodInfo: {
    flex: 1,
    marginLeft: SPACING.md,
    justifyContent: 'center',
  },
  foodName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  foodDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  basePrice: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: 4,
  },
  groupContainer: {
    marginBottom: SPACING.lg,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  groupTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  requiredBadge: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.xs,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.background,
    marginBottom: SPACING.xs,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedOptionRow: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxCircle: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: COLORS.textMuted,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  radioCircle: {
    borderRadius: RADIUS.full,
  },
  checkedCircle: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  optionName: {
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  selectedOptionText: {
    fontWeight: '600',
    color: COLORS.primary,
  },
  optionPrice: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  hygieneNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginTop: SPACING.sm,
  },
  hygieneText: {
    fontSize: 12,
    color: COLORS.vegGreen,
    fontWeight: '600',
    marginLeft: SPACING.xs,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    backgroundColor: COLORS.cardBackground,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    padding: 4,
    marginRight: SPACING.md,
  },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginHorizontal: SPACING.md,
  },
  addCta: {
    flex: 1,
    height: 48,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    ...SHADOWS.medium,
  },
  ctaText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700',
  },
  ctaPrice: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '800',
  },
});
