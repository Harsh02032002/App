import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { User, Store, Bike } from 'lucide-react-native';
import { AppRole } from '../types';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';

interface EcosystemRoleSwitcherProps {
  activeRole: AppRole;
  onSelectRole: (role: AppRole) => void;
}

export const EcosystemRoleSwitcher: React.FC<EcosystemRoleSwitcherProps> = ({
  activeRole,
  onSelectRole,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.headerLabel}>CRACKING ECOSYSTEM DEMO SWITCHER</Text>
      <View style={styles.pillsRow}>
        <TouchableOpacity
          style={[styles.rolePill, activeRole === 'customer' && styles.activeCustomerPill]}
          onPress={() => onSelectRole('customer')}
          activeOpacity={0.8}
        >
          <User size={14} color={activeRole === 'customer' ? COLORS.white : COLORS.textPrimary} />
          <Text style={[styles.roleText, activeRole === 'customer' && styles.activeText]}>
            Customer App
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.rolePill, activeRole === 'restaurant' && styles.activeRestaurantPill]}
          onPress={() => onSelectRole('restaurant')}
          activeOpacity={0.8}
        >
          <Store size={14} color={activeRole === 'restaurant' ? COLORS.white : COLORS.textPrimary} />
          <Text style={[styles.roleText, activeRole === 'restaurant' && styles.activeText]}>
            Restaurant App
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.rolePill, activeRole === 'delivery' && styles.activeDeliveryPill]}
          onPress={() => onSelectRole('delivery')}
          activeOpacity={0.8}
        >
          <Bike size={14} color={activeRole === 'delivery' ? COLORS.white : COLORS.textPrimary} />
          <Text style={[styles.roleText, activeRole === 'delivery' && styles.activeText]}>
            Delivery App
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0F172A',
    paddingHorizontal: SPACING.md,
    paddingTop: 6,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  headerLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: '#94A3B8',
    textAlign: 'center',
    letterSpacing: 1,
    marginBottom: 4,
  },
  pillsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#1E293B',
    borderRadius: RADIUS.full,
    padding: 3,
  },
  rolePill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    borderRadius: RADIUS.full,
  },
  activeCustomerPill: {
    backgroundColor: COLORS.primary,
  },
  activeRestaurantPill: {
    backgroundColor: '#7C3AED',
  },
  activeDeliveryPill: {
    backgroundColor: '#059669',
  },
  roleText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    marginLeft: 4,
  },
  activeText: {
    color: COLORS.white,
  },
});
