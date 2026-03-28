import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Animated } from 'react-native';
import Colors from '@/constants/colors';
import Layout from '@/constants/layout';

interface AchievementToastProps {
  visible: boolean;
  title: string;
  icon: string;
  points: number;
  onDismiss: () => void;
}

export default function AchievementToast({
  visible,
  title,
  icon,
  points,
  onDismiss,
}: AchievementToastProps) {
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: -100,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => {
          onDismiss();
        });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [visible, translateY, opacity, onDismiss]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <View style={styles.content}>
        <Text style={styles.icon}>{icon}</Text>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.points}>+{points} points</Text>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: Layout.spacing.lg,
    right: Layout.spacing.lg,
    zIndex: 9999,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: Layout.spacing.md,
    borderRadius: Layout.borderRadius.medium,
    gap: Layout.spacing.md,
    ...Colors.shadows.medium,
    borderLeftWidth: 4,
    borderLeftColor: Colors.accentYellow,
  },
  icon: {
    fontSize: 32,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: Layout.fontSize.md,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: Layout.spacing.xs,
  },
  points: {
    fontSize: Layout.fontSize.sm,
    fontWeight: '600',
    color: Colors.accentYellow,
  },
});
