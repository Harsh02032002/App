import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MapPin, ChevronDown, Bell, User } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import { LocationModal } from './LocationModal';

interface HeaderProps {
  onPressProfile?: () => void;
  onPressNotifications?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onPressProfile, onPressNotifications }) => {
  const { selectedAddress, unreadNotificationCount, user } = useApp();
  const [showLocationModal, setShowLocationModal] = useState(false);

  return (
    <View style={styles.container}>
      {/* Location Section */}
      <TouchableOpacity
        style={styles.locationContainer}
        onPress={() => setShowLocationModal(true)}
        activeOpacity={0.7}
      >
        <View style={styles.iconCircle}>
          <MapPin size={18} color={COLORS.primary} />
        </View>
        <View style={styles.locationTextContainer}>
          <View style={styles.locationTitleRow}>
            <Text style={styles.locationTitle}>{selectedAddress.title}</Text>
            <ChevronDown size={16} color={COLORS.textPrimary} style={{ marginLeft: 2 }} />
          </View>
          <Text style={styles.locationSubtitle} numberOfLines={1}>
            {selectedAddress.addressLine1}, {selectedAddress.city}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Right Icons: Notification & Profile */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={onPressNotifications}
          activeOpacity={0.7}
        >
          <Bell size={22} color={COLORS.textPrimary} />
          {unreadNotificationCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadNotificationCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.profileButton}
          onPress={onPressProfile}
          activeOpacity={0.7}
        >
          {user?.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarFallback}>
              <User size={18} color={COLORS.white} />
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Location Modal */}
      <LocationModal
        visible={showLocationModal}
        onClose={() => setShowLocationModal(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.cardBackground,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: SPACING.md,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  locationTextContainer: {
    flex: 1,
  },
  locationTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  locationSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.full,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '700',
  },
  profileButton: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.full,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  avatarFallback: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
