import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';
import Layout from '@/constants/layout';

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    icon: string;
    color: string;
    videoCount: number;
  };
  isSelected: boolean;
  onPress: () => void;
}

export default function CategoryCard({ category, isSelected, onPress }: CategoryCardProps) {
  const getGradient = (): [string, string] => {
    switch (category.color) {
      case Colors.accentGreen:
        return Colors.gradients.success as [string, string];
      case Colors.accentBlue:
        return Colors.gradients.blue as [string, string];
      case Colors.accentOrange:
        return Colors.gradients.orange as [string, string];
      case Colors.accentYellow:
        return Colors.gradients.secondary as [string, string];
      case Colors.primary:
        return Colors.gradients.primary as [string, string];
      case Colors.accentPink:
        return Colors.gradients.pink as [string, string];
      default:
        return Colors.gradients.primary as [string, string];
    }
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <LinearGradient
        colors={getGradient()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.container,
          Colors.shadows.small,
          isSelected && styles.selected
        ]}
      >
        <Text style={styles.icon}>{category.icon}</Text>
        <Text style={styles.name}>{category.name}</Text>
        <Text style={styles.count}>{category.videoCount} courses</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 130,
    padding: Layout.spacing.lg,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  selected: {
    borderColor: Colors.white,
    transform: [{ scale: 1.05 }],
  },
  icon: {
    fontSize: 36,
    marginBottom: Layout.spacing.sm,
  },
  name: {
    fontSize: Layout.fontSize.sm,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: Layout.spacing.xs,
    textAlign: 'center',
  },
  count: {
    fontSize: Layout.fontSize.xs,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
  },
});