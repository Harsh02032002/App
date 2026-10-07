import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Sparkles, ArrowRight } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';

interface BannerCarouselProps {
  onPressBanner?: (code: string) => void;
}

const BANNERS = [
  {
    id: 'b1',
    title: '50% OFF ON YOUR FIRST CRAVING',
    subtitle: 'Use Code: FIRST50 | Max ₹120 OFF',
    bgColor: '#FF385C',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500',
    code: 'FIRST50',
  },
  {
    id: 'b2',
    title: 'FREE DELIVERY ON ALL ORDERS',
    subtitle: 'No Minimum Order | Code: CRAVEFREE',
    bgColor: '#10B981',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500',
    code: 'CRAVEFREE',
  },
  {
    id: 'b3',
    title: 'FLAT ₹100 CASHBACK',
    subtitle: 'On Gourmet Biryanis & Burgers',
    bgColor: '#8B5CF6',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500',
    code: 'WELCOME100',
  },
];

export const BannerCarousel: React.FC<BannerCarouselProps> = ({ onPressBanner }) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        decelerationRate="fast"
        snapToInterval={310}
      >
        {BANNERS.map((banner) => (
          <TouchableOpacity
            key={banner.id}
            style={[styles.bannerCard, { backgroundColor: banner.bgColor }]}
            onPress={() => onPressBanner && onPressBanner(banner.code)}
            activeOpacity={0.9}
          >
            <View style={styles.textContainer}>
              <View style={styles.badgeRow}>
                <Sparkles size={14} color="#FFF" />
                <Text style={styles.badgeText}>SPECIAL OFFER</Text>
              </View>
              <Text style={styles.title}>{banner.title}</Text>
              <Text style={styles.subtitle}>{banner.subtitle}</Text>
              <View style={styles.claimButton}>
                <Text style={styles.claimText}>Order Now</Text>
                <ArrowRight size={14} color="#FFF" style={{ marginLeft: 4 }} />
              </View>
            </View>

            <Image source={{ uri: banner.image }} style={styles.bannerImage} resizeMode="cover" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.md,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
  },
  bannerCard: {
    width: 290,
    height: 140,
    borderRadius: RADIUS.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.lg,
    marginRight: SPACING.md,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  textContainer: {
    flex: 1,
    marginRight: SPACING.xs,
    justifyContent: 'center',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  title: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 18,
    marginBottom: 4,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 11,
    marginBottom: 8,
  },
  claimButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  claimText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
  },
  bannerImage: {
    width: 90,
    height: 90,
    borderRadius: RADIUS.lg,
  },
});
