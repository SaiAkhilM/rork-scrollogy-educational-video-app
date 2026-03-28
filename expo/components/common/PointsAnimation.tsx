import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Animated, Dimensions } from 'react-native';
import Colors from '@/constants/colors';
import Layout from '@/constants/layout';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface PointsAnimationProps {
  points: number;
  onComplete: () => void;
  startPosition?: { x: number; y: number };
  endPosition?: { x: number; y: number };
}

export default function PointsAnimation({
  points,
  onComplete,
  startPosition = { x: screenWidth / 2, y: screenHeight / 2 },
  endPosition = { x: screenWidth - 80, y: 60 },
}: PointsAnimationProps) {
  const translateX = useRef(new Animated.Value(startPosition.x)).current;
  const translateY = useRef(new Animated.Value(startPosition.y)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: endPosition.x,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: endPosition.y,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.5,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.8,
          duration: 350,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 500,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onComplete();
    });
  }, [translateX, translateY, scale, opacity, startPosition.x, startPosition.y, endPosition.x, endPosition.y, onComplete]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            { translateX },
            { translateY },
            { scale },
          ],
          opacity,
        },
      ]}
    >
      <View style={styles.pointsBadge}>
        <Text style={styles.pointsText}>+{points}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 9999,
  },
  pointsBadge: {
    backgroundColor: Colors.accentYellow,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.large,
    shadowColor: Colors.accentYellow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 8,
  },
  pointsText: {
    fontSize: Layout.fontSize.xl,
    fontWeight: 'bold',
    color: Colors.white,
  },
});
