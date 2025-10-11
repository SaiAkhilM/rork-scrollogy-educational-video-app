import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Flame } from 'lucide-react-native';
import Colors from '@/constants/colors';
import Layout from '@/constants/layout';

interface StreakIndicatorProps {
  streak: number;
  size?: 'small' | 'medium' | 'large';
}

export default function StreakIndicator({ streak, size = 'medium' }: StreakIndicatorProps) {
  const getStreakColor = () => {
    if (streak >= 30) return Colors.accentYellow;
    if (streak >= 7) return Colors.gray.medium;
    if (streak >= 3) return Colors.accentOrange;
    return Colors.accentOrange;
  };

  const getStreakLabel = () => {
    if (streak >= 30) return 'Gold';
    if (streak >= 7) return 'Silver';
    if (streak >= 3) return 'Bronze';
    return '';
  };

  const sizeStyles = {
    small: {
      container: styles.containerSmall,
      icon: 16,
      text: styles.streakTextSmall,
      label: styles.labelSmall,
    },
    medium: {
      container: styles.containerMedium,
      icon: 24,
      text: styles.streakTextMedium,
      label: styles.labelMedium,
    },
    large: {
      container: styles.containerLarge,
      icon: 32,
      text: styles.streakTextLarge,
      label: styles.labelLarge,
    },
  };

  const currentSize = sizeStyles[size];
  const streakColor = getStreakColor();
  const streakLabel = getStreakLabel();

  return (
    <View style={[styles.container, currentSize.container]}>
      <Flame color={streakColor} size={currentSize.icon} />
      <View style={styles.textContainer}>
        <Text style={[styles.streakText, currentSize.text]}>{streak}</Text>
        {streakLabel && <Text style={[styles.label, currentSize.label]}>{streakLabel}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.xs,
  },
  containerSmall: {
    gap: Layout.spacing.xs,
  },
  containerMedium: {
    gap: Layout.spacing.sm,
  },
  containerLarge: {
    gap: Layout.spacing.md,
  },
  textContainer: {
    alignItems: 'center',
  },
  streakText: {
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  streakTextSmall: {
    fontSize: Layout.fontSize.sm,
  },
  streakTextMedium: {
    fontSize: Layout.fontSize.lg,
  },
  streakTextLarge: {
    fontSize: Layout.fontSize.xl,
  },
  label: {
    fontWeight: '600',
    color: Colors.text.secondary,
  },
  labelSmall: {
    fontSize: Layout.fontSize.xs,
  },
  labelMedium: {
    fontSize: Layout.fontSize.sm,
  },
  labelLarge: {
    fontSize: Layout.fontSize.md,
  },
});
