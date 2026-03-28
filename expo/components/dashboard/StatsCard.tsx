import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';
import Layout from '@/constants/layout';

interface StatsCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}

export default function StatsCard({ icon, label, value, color }: StatsCardProps) {
  const getGradient = (): [string, string] => {
    switch (color) {
      case Colors.accentOrange:
        return Colors.gradients.orange as [string, string];
      case Colors.accentYellow:
        return Colors.gradients.secondary as [string, string];
      case Colors.primary:
        return Colors.gradients.primary as [string, string];
      default:
        return Colors.gradients.primary as [string, string];
    }
  };

  return (
    <LinearGradient
      colors={getGradient()}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.container, Colors.shadows.small]}
    >
      <View style={styles.iconContainer}>{icon}</View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Layout.spacing.lg,
    borderRadius: 16,
    alignItems: 'center',
    minHeight: 110,
    marginHorizontal: Layout.spacing.xs,
  },
  iconContainer: {
    marginBottom: Layout.spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: Layout.spacing.sm,
  },
  value: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: Layout.spacing.xs,
  },
  label: {
    fontSize: Layout.fontSize.xs,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
    textAlign: 'center',
  },
});