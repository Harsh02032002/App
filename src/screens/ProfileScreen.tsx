import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import {
  ShoppingBag,
  MapPin,
  CreditCard,
  Heart,
  Bell,
  HelpCircle,
  FileText,
  ShieldCheck,
  LogOut,
  ChevronRight,
  User,
  Sparkles,
} from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { LocationModal } from '../components/LocationModal';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';

interface ProfileScreenProps {
  onNavigateOrders: () => void;
  onNavigateFavourites: () => void;
  onNavigateNotifications: () => void;
  onLogout: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onNavigateOrders,
  onNavigateFavourites,
  onNavigateNotifications,
  onLogout,
}) => {
  const { user, orders, favoriteRestaurantIds, favoriteFoodIds, addresses, logout } = useApp();
  const [showLocationModal, setShowLocationModal] = useState(false);

  const totalFavs = favoriteRestaurantIds.length + favoriteFoodIds.length;

  const handleLogout = () => {
    logout();
    onLogout();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.avatarWrapper}>
            {user?.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarFallback}>
                <User size={32} color={COLORS.white} />
              </View>
            )}
            <View style={styles.proBadge}>
              <Sparkles size={10} color={COLORS.white} />
              <Text style={styles.proBadgeText}>PRO</Text>
            </View>
          </View>

          <Text style={styles.userName}>{user?.name || 'Aarav Sharma'}</Text>
          <Text style={styles.userContact}>{user?.phone || '+91 98765 43210'} • {user?.email}</Text>

          {/* User Quick Stats */}
          <View style={styles.statsRow}>
            <TouchableOpacity style={styles.statBox} onPress={onNavigateOrders}>
              <Text style={styles.statNum}>{orders.length}</Text>
              <Text style={styles.statLabel}>Orders</Text>
            </TouchableOpacity>

            <View style={styles.statDivider} />

            <TouchableOpacity style={styles.statBox} onPress={onNavigateFavourites}>
              <Text style={styles.statNum}>{totalFavs}</Text>
              <Text style={styles.statLabel}>Favourites</Text>
            </TouchableOpacity>

            <View style={styles.statDivider} />

            <TouchableOpacity style={styles.statBox} onPress={() => setShowLocationModal(true)}>
              <Text style={styles.statNum}>{addresses.length}</Text>
              <Text style={styles.statLabel}>Addresses</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Menu Options Group */}
        <View style={styles.menuGroup}>
          <Text style={styles.groupTitle}>ACCOUNT & PREFERENCES</Text>

          <TouchableOpacity style={styles.menuRow} onPress={onNavigateOrders}>
            <View style={styles.menuLeft}>
              <View style={styles.menuIconBox}>
                <ShoppingBag size={18} color={COLORS.primary} />
              </View>
              <Text style={styles.menuLabel}>My Orders</Text>
            </View>
            <ChevronRight size={18} color={COLORS.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuRow} onPress={() => setShowLocationModal(true)}>
            <View style={styles.menuLeft}>
              <View style={styles.menuIconBox}>
                <MapPin size={18} color={COLORS.primary} />
              </View>
              <Text style={styles.menuLabel}>Saved Delivery Addresses</Text>
            </View>
            <ChevronRight size={18} color={COLORS.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuRow} onPress={onNavigateFavourites}>
            <View style={styles.menuLeft}>
              <View style={styles.menuIconBox}>
                <Heart size={18} color={COLORS.primary} />
              </View>
              <Text style={styles.menuLabel}>My Favourites</Text>
            </View>
            <ChevronRight size={18} color={COLORS.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuRow} onPress={onNavigateNotifications}>
            <View style={styles.menuLeft}>
              <View style={styles.menuIconBox}>
                <Bell size={18} color={COLORS.primary} />
              </View>
              <Text style={styles.menuLabel}>Notifications</Text>
            </View>
            <ChevronRight size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>

        <View style={styles.menuGroup}>
          <Text style={styles.groupTitle}>SUPPORT & LEGAL</Text>

          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => alert('CraveDash 24/7 Support Hotline: 1800-272-833')}
          >
            <View style={styles.menuLeft}>
              <View style={styles.menuIconBox}>
                <HelpCircle size={18} color={COLORS.textPrimary} />
              </View>
              <Text style={styles.menuLabel}>Help & 24/7 Support</Text>
            </View>
            <ChevronRight size={18} color={COLORS.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuRow} onPress={() => alert('Terms of Service v1.0')}>
            <View style={styles.menuLeft}>
              <View style={styles.menuIconBox}>
                <FileText size={18} color={COLORS.textPrimary} />
              </View>
              <Text style={styles.menuLabel}>Terms & Conditions</Text>
            </View>
            <ChevronRight size={18} color={COLORS.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuRow} onPress={() => alert('Privacy Policy v1.0')}>
            <View style={styles.menuLeft}>
              <View style={styles.menuIconBox}>
                <ShieldCheck size={18} color={COLORS.textPrimary} />
              </View>
              <Text style={styles.menuLabel}>Privacy Policy</Text>
            </View>
            <ChevronRight size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
          <LogOut size={18} color={COLORS.nonVegRed} style={{ marginRight: 6 }} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>CraveDash App v1.0.0 (Build 984)</Text>
      </ScrollView>

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
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  userCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    marginBottom: SPACING.lg,
    ...SHADOWS.light,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: SPACING.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.full,
  },
  avatarFallback: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  proBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: COLORS.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  proBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: COLORS.white,
    marginLeft: 2,
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  userContact: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: SPACING.lg,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statNum: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: COLORS.borderLight,
  },
  menuGroup: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    ...SHADOWS.light,
  },
  groupTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textMuted,
    marginBottom: SPACING.xs,
    paddingHorizontal: SPACING.md,
    letterSpacing: 0.5,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIconBox: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  menuLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.md,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.nonVegRed,
  },
  versionText: {
    fontSize: 11,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
});
