import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { ChevronRight, Sparkles, Compass, Bike, Utensils } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';

interface OnboardingScreenProps {
  onFinish: () => void;
}

const SLIDES = [
  {
    id: '1',
    title: 'Discover Top Restaurants Near You',
    description: 'Explore thousands of curated restaurants, trending dishes, and local culinary favorites delivered hot & fresh.',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
    icon: Compass,
  },
  {
    id: '2',
    title: 'Order Your Favourite Craving',
    description: 'Customize your meals with easy add-ons, exclusive promo discounts, and instant seamless checkout.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800',
    icon: Utensils,
  },
  {
    id: '3',
    title: 'Track Your Order Live in Real-Time',
    description: 'Watch your delivery partner bring your food directly to your doorstep with live GPS map tracking.',
    image: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?w=800',
    icon: Bike,
  },
];

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      onFinish();
    }
  };

  const currentSlide = SLIDES[currentIndex];
  const IconComponent = currentSlide.icon;

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header: Skip */}
      <View style={styles.topHeader}>
        <View style={styles.logoRow}>
          <Sparkles size={20} color={COLORS.primary} />
          <Text style={styles.logoText}>CraveDash</Text>
        </View>
        <TouchableOpacity onPress={onFinish} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Main Slide Card */}
      <View style={styles.slideContainer}>
        <View style={styles.imageWrapper}>
          <Image source={{ uri: currentSlide.image }} style={styles.image} resizeMode="cover" />
          <View style={styles.iconCircle}>
            <IconComponent size={28} color={COLORS.white} />
          </View>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>{currentSlide.title}</Text>
          <Text style={styles.description}>{currentSlide.description}</Text>
        </View>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.footer}>
        {/* Pagination Dots */}
        <View style={styles.pagination}>
          {SLIDES.map((_, idx) => (
            <View
              key={idx}
              style={[
                styles.dot,
                currentIndex === idx && styles.activeDot,
              ]}
            />
          ))}
        </View>

        {/* Action Button */}
        <TouchableOpacity style={styles.nextButton} onPress={handleNext} activeOpacity={0.85}>
          <Text style={styles.nextText}>
            {currentIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'}
          </Text>
          <ChevronRight size={18} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cardBackground,
    justifyContent: 'space-between',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primary,
    marginLeft: 6,
  },
  skipButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  skipText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  slideContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  imageWrapper: {
    width: '100%',
    height: 280,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: SPACING.xl,
    ...SHADOWS.heavy,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  iconCircle: {
    position: 'absolute',
    bottom: -1,
    right: SPACING.lg,
    width: 60,
    height: 60,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: COLORS.cardBackground,
    ...SHADOWS.medium,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
    lineHeight: 28,
  },
  description: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xl,
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.border,
    marginRight: 6,
  },
  activeDot: {
    width: 24,
    backgroundColor: COLORS.primary,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.full,
    ...SHADOWS.medium,
  },
  nextText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700',
    marginRight: 4,
  },
});
