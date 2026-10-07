import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Star, X, Check } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';

interface RatingModalProps {
  visible: boolean;
  restaurantName: string;
  onClose: () => void;
}

export const RatingModal: React.FC<RatingModalProps> = ({
  visible,
  restaurantName,
  onClose,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [feedback, setFeedback] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <X size={20} color={COLORS.textPrimary} />
          </TouchableOpacity>

          {!submitted ? (
            <>
              <Text style={styles.title}>Rate your experience</Text>
              <Text style={styles.subtitle}>How was your food from {restaurantName}?</Text>

              {/* 5 Stars */}
              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => setRating(star)}
                    activeOpacity={0.7}
                    style={{ padding: 4 }}
                  >
                    <Star
                      size={36}
                      color={star <= rating ? COLORS.starYellow : COLORS.border}
                      fill={star <= rating ? COLORS.starYellow : 'transparent'}
                    />
                  </TouchableOpacity>
                ))}
              </View>

              {/* Feedback TextInput */}
              <TextInput
                style={styles.textInput}
                placeholder="Write your feedback (optional)..."
                placeholderTextColor={COLORS.textMuted}
                value={feedback}
                onChangeText={setFeedback}
                multiline
                numberOfLines={3}
              />

              <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} activeOpacity={0.8}>
                <Text style={styles.submitText}>Submit Review</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.successBox}>
              <View style={styles.successIconCircle}>
                <Check size={28} color={COLORS.white} />
              </View>
              <Text style={styles.successTitle}>Thank You!</Text>
              <Text style={styles.successSub}>Your review helps us improve.</Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  modalCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    position: 'relative',
    ...SHADOWS.heavy,
  },
  closeBtn: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    padding: SPACING.xs,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: SPACING.md,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  starsRow: {
    flexDirection: 'row',
    marginVertical: SPACING.lg,
  },
  textInput: {
    width: '100%',
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    fontSize: 13,
    color: COLORS.textPrimary,
    marginBottom: SPACING.lg,
    height: 80,
    textAlignVertical: 'top',
  },
  submitBtn: {
    width: '100%',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  submitText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700',
  },
  successBox: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  successIconCircle: {
    width: 54,
    height: 54,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.vegGreen,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  successSub: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});
