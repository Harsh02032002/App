import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Animated, Easing } from 'react-native';
import { MapPin, Navigation, Store, Home, Compass } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';

interface LiveMapPlaceholderProps {
  restaurantName: string;
  driverName?: string;
  eta?: string;
}

export const LiveMapPlaceholder: React.FC<LiveMapPlaceholderProps> = ({
  restaurantName,
  driverName = 'Rohan Sharma',
  eta = '15-20 mins',
}) => {
  // Animated position along vector path
  const [driverPos] = useState(new Animated.Value(0));

  useEffect(() => {
    const animationLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(driverPos, {
          toValue: 1,
          duration: 8000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(driverPos, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    );
    animationLoop.start();
    return () => animationLoop.stop();
  }, [driverPos]);

  // Interpolate coordinates across simulated map grid
  const interpolatedLeft = driverPos.interpolate({
    inputRange: [0, 0.4, 0.7, 1],
    outputRange: ['22%', '45%', '68%', '78%'],
  });

  const interpolatedTop = driverPos.interpolate({
    inputRange: [0, 0.4, 0.7, 1],
    outputRange: ['35%', '48%', '52%', '70%'],
  });

  return (
    <View style={styles.mapCanvas}>
      {/* Map Background Grid Simulation */}
      <View style={styles.roadHorizontal1} />
      <View style={styles.roadHorizontal2} />
      <View style={styles.roadVertical1} />
      <View style={styles.roadVertical2} />

      {/* Simulated Park / Lake Areas */}
      <View style={styles.parkArea} />
      <View style={styles.lakeArea} />

      {/* Dotted Route Line Simulation */}
      <View style={styles.routeContainer}>
        <View style={styles.routeDot1} />
        <View style={styles.routeDot2} />
        <View style={styles.routeDot3} />
        <View style={styles.routeDot4} />
      </View>

      {/* 1. Restaurant Pin (Start) */}
      <View style={[styles.pinWrapper, { top: '30%', left: '18%' }]}>
        <View style={styles.restaurantPin}>
          <Store size={16} color={COLORS.white} />
        </View>
        <View style={styles.pinLabel}>
          <Text style={styles.pinLabelText} numberOfLines={1}>
            {restaurantName}
          </Text>
        </View>
      </View>

      {/* 2. Live Moving Delivery Driver Pin */}
      <Animated.View
        style={[
          styles.pinWrapper,
          {
            top: interpolatedTop,
            left: interpolatedLeft,
            zIndex: 10,
          },
        ]}
      >
        <View style={styles.driverPulseRing} />
        <View style={styles.driverPin}>
          <Navigation size={18} color={COLORS.white} style={{ transform: [{ rotate: '45deg' }] }} />
        </View>
        <View style={styles.driverLabel}>
          <Text style={styles.driverLabelText}>{driverName}</Text>
        </View>
      </Animated.View>

      {/* 3. Customer Destination Pin */}
      <View style={[styles.pinWrapper, { top: '68%', left: '76%' }]}>
        <View style={styles.customerPin}>
          <Home size={16} color={COLORS.white} />
        </View>
        <View style={styles.pinLabel}>
          <Text style={styles.pinLabelText}>Your Address</Text>
        </View>
      </View>

      {/* Top Floating ETA Badge */}
      <View style={styles.etaBadge}>
        <Compass size={16} color={COLORS.primary} style={{ marginRight: 6 }} />
        <Text style={styles.etaTitle}>Estimated Arrival: </Text>
        <Text style={styles.etaTime}>{eta}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mapCanvas: {
    height: 240,
    width: '100%',
    backgroundColor: '#E5E9EC',
    position: 'relative',
    overflow: 'hidden',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  // Map Road simulation
  roadHorizontal1: {
    position: 'absolute',
    top: '35%',
    left: 0,
    right: 0,
    height: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#D4D8DC',
  },
  roadHorizontal2: {
    position: 'absolute',
    top: '72%',
    left: 0,
    right: 0,
    height: 24,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#D4D8DC',
  },
  roadVertical1: {
    position: 'absolute',
    left: '20%',
    top: 0,
    bottom: 0,
    width: 20,
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#D4D8DC',
  },
  roadVertical2: {
    position: 'absolute',
    left: '78%',
    top: 0,
    bottom: 0,
    width: 24,
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#D4D8DC',
  },
  parkArea: {
    position: 'absolute',
    top: '10%',
    left: '40%',
    width: 90,
    height: 60,
    backgroundColor: '#C8E6C9',
    borderRadius: RADIUS.md,
    opacity: 0.8,
  },
  lakeArea: {
    position: 'absolute',
    bottom: '10%',
    left: '30%',
    width: 110,
    height: 50,
    backgroundColor: '#BBDEFB',
    borderRadius: 30,
    opacity: 0.8,
  },

  // Route points
  routeContainer: {
    position: 'absolute',
    top: '36%',
    left: '22%',
    right: '22%',
    bottom: '25%',
  },
  routeDot1: {
    position: 'absolute',
    top: 10,
    left: 20,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  routeDot2: {
    position: 'absolute',
    top: 35,
    left: 70,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  routeDot3: {
    position: 'absolute',
    top: 50,
    left: 130,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  routeDot4: {
    position: 'absolute',
    top: 75,
    left: 170,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },

  // Pin styling
  pinWrapper: {
    position: 'absolute',
    alignItems: 'center',
  },
  restaurantPin: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.full,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  customerPin: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.vegGreen,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  driverPin: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.heavy,
  },
  driverPulseRing: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255, 56, 92, 0.3)',
    top: -6,
    left: -6,
  },
  pinLabel: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.xs,
    marginTop: 2,
    ...SHADOWS.light,
  },
  pinLabelText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  driverLabel: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.xs,
    marginTop: 2,
    ...SHADOWS.light,
  },
  driverLabelText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.white,
  },
  etaBadge: {
    position: 'absolute',
    top: 14,
    alignSelf: 'center',
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    ...SHADOWS.medium,
  },
  etaTitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  etaTime: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '800',
  },
});
