import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';
import Layout from '@/constants/layout';

interface AchievementBadgeProps {
  achievement: {
    id: string;
    title: string;
    icon: string;
    unlocked: boolean;
    gradient?: string[];
  };
}

export default function AchievementBadge({ achievement }: AchievementBadgeProps) {
  if (!achievement.unlocked) {
    return (
      <TouchableOpacity style={[styles.container, styles.locked]}>
        <Text style={styles.icon}>{achievement.icon}</Text>
        <Text style={[styles.title, styles.lockedText]} numberOfLines={1}>
          {achievement.title}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.containerWrapper}>
      <LinearGradient
        colors={achievement.gradient as [string, string] || Colors.gradients.primary as [string, string]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.container, Colors.shadows.small]}
      >
        <Text style={styles.icon}>{achievement.icon}</Text>
        <Text style={styles.title} numberOfLines={1}>
          {achievement.title}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  containerWrapper: {
    width: '30%',
    aspectRatio: 1,
    marginBottom: Layout.spacing.sm,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: Layout.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locked: {
    backgroundColor: Colors.gray.lightest,
    opacity: 0.6,
    width: '30%',
    aspectRatio: 1,
    marginBottom: Layout.spacing.sm,
  },
  icon: {
    fontSize: 32,
    marginBottom: Layout.spacing.sm,
  },
  title: {
    fontSize: 11,
    color: Colors.white,
    textAlign: 'center',
    fontWeight: '700',
  },
  lockedText: {
    color: Colors.text.secondary,
  },
});