import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';
import Layout from '@/constants/layout';

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    category?: string;
    progress: number;
    totalLessons: number;
    completedLessons: number;
    thumbnailUrl: string;
  };
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <TouchableOpacity style={[styles.container, Colors.shadows.small]}>
      <Image source={{ uri: course.thumbnailUrl }} style={styles.thumbnail} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.7)']}
        style={styles.overlay}
      />
      <View style={styles.content}>
        {course.category && (
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{course.category}</Text>
          </View>
        )}
        <Text style={styles.title} numberOfLines={2}>{course.title}</Text>
        <Text style={styles.progress}>
          {course.completedLessons}/{course.totalLessons} videos
        </Text>
        <View style={styles.progressBar}>
          <LinearGradient
            colors={Colors.gradients.success as [string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.progressFill, { width: `${course.progress}%` }]}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 220,
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginRight: Layout.spacing.md,
    overflow: 'hidden',
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: 140,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 140,
  },
  content: {
    padding: Layout.spacing.lg,
    position: 'relative',
  },
  categoryBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: Layout.spacing.sm,
  },
  categoryText: {
    fontSize: 10,
    color: Colors.white,
    fontWeight: '600',
  },
  title: {
    fontSize: Layout.fontSize.md,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: Layout.spacing.sm,
    lineHeight: 20,
  },
  progress: {
    fontSize: Layout.fontSize.xs,
    color: Colors.text.secondary,
    marginBottom: Layout.spacing.sm,
    fontWeight: '500',
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.gray.light,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
});