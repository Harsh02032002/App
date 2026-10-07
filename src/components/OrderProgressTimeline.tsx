import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Check, Clock } from 'lucide-react-native';
import { OrderTimelineStep } from '../types';
import { COLORS, SPACING, RADIUS } from '../constants/theme';

interface OrderProgressTimelineProps {
  steps: OrderTimelineStep[];
}

export const OrderProgressTimeline: React.FC<OrderProgressTimelineProps> = ({ steps }) => {
  return (
    <View style={styles.container}>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;

        return (
          <View key={step.status} style={styles.stepRow}>
            {/* Left Circle & Line */}
            <View style={styles.indicatorContainer}>
              <View
                style={[
                  styles.circle,
                  step.completed && styles.completedCircle,
                  step.current && styles.currentCircle,
                ]}
              >
                {step.completed ? (
                  <Check size={12} color={COLORS.white} />
                ) : step.current ? (
                  <View style={styles.innerDot} />
                ) : (
                  <View style={styles.futureDot} />
                )}
              </View>
              {!isLast && (
                <View
                  style={[
                    styles.line,
                    step.completed && steps[index + 1].completed && styles.completedLine,
                  ]}
                />
              )}
            </View>

            {/* Right Text Details */}
            <View style={styles.textContainer}>
              <View style={styles.titleRow}>
                <Text
                  style={[
                    styles.label,
                    step.completed && styles.completedLabel,
                    step.current && styles.currentLabel,
                  ]}
                >
                  {step.label}
                </Text>
                <Text style={styles.timeText}>{step.time}</Text>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: SPACING.md,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    minHeight: 48,
  },
  indicatorContainer: {
    alignItems: 'center',
    width: 24,
    marginRight: SPACING.md,
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  completedCircle: {
    backgroundColor: COLORS.vegGreen,
  },
  currentCircle: {
    backgroundColor: COLORS.primary,
    borderWidth: 2,
    borderColor: COLORS.primaryLight,
  },
  innerDot: {
    width: 8,
    height: 8,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.white,
  },
  futureDot: {
    width: 6,
    height: 6,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.textMuted,
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: COLORS.border,
    marginVertical: 2,
  },
  completedLine: {
    backgroundColor: COLORS.vegGreen,
  },
  textContainer: {
    flex: 1,
    paddingTop: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  completedLabel: {
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  currentLabel: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  timeText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
});
