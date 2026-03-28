import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, FileText, List } from 'lucide-react-native';
import Colors from '@/constants/colors';
import Layout from '@/constants/layout';
import { Course } from '@/types';

interface CourseCardProps {
  course: Course;
  onOpenCatalog?: () => void;
}

export default function CourseCard({ course, onOpenCatalog }: CourseCardProps) {
  const renderSegmentedProgress = () => {
    const totalSegments = 10;
    const completedSegments = Math.floor((course.progress / 100) * totalSegments);
    const inProgressSegments = course.progress > 0 && course.progress < 100 ? 1 : 0;
    const lockedSegments = totalSegments - completedSegments - inProgressSegments;

    return (
      <View style={styles.segmentedProgressBar}>
        {Array.from({ length: completedSegments }).map((_, i) => (
          <View key={`complete-${i}`} style={[styles.segment, styles.segmentComplete]} />
        ))}
        {Array.from({ length: inProgressSegments }).map((_, i) => (
          <View key={`progress-${i}`} style={[styles.segment, styles.segmentInProgress]} />
        ))}
        {Array.from({ length: lockedSegments }).map((_, i) => (
          <View key={`locked-${i}`} style={[styles.segment, styles.segmentLocked]} />
        ))}
      </View>
    );
  };

  return (
    <View style={[styles.container, Colors.shadows.small]}>
      <TouchableOpacity activeOpacity={0.9}>
        <Image source={{ uri: course.thumbnailUrl }} style={styles.thumbnail} />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.overlay}
        />
        <View style={styles.playIconOverlay}>
          <View style={styles.playIconCircle}>
            <Play color={Colors.white} size={24} fill={Colors.white} />
          </View>
        </View>
      </TouchableOpacity>
      
      <View style={styles.content}>
        {course.category && (
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{course.category}</Text>
          </View>
        )}
        <Text style={styles.title} numberOfLines={2}>{course.title}</Text>
        <Text style={styles.progress}>
          {course.completedVideos}/{course.totalVideos} videos
        </Text>
        
        {renderSegmentedProgress()}
        
        <View style={styles.pointsBadge}>
          <Text style={styles.pointsText}>{course.points} pts</Text>
        </View>
        
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton}>
            <Play color={Colors.primary} size={16} />
            <Text style={styles.actionButtonText}>Resume</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <FileText color={Colors.primary} size={16} />
            <Text style={styles.actionButtonText}>Info</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={onOpenCatalog}
          >
            <List color={Colors.primary} size={16} />
            <Text style={styles.actionButtonText}>Catalog</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 280,
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginRight: Layout.spacing.md,
    overflow: 'hidden',
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: 157,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 157,
  },
  playIconOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(123, 104, 238, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: Layout.spacing.md,
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
    marginBottom: Layout.spacing.xs,
    lineHeight: 20,
    minHeight: 40,
  },
  progress: {
    fontSize: Layout.fontSize.xs,
    color: Colors.text.secondary,
    marginBottom: Layout.spacing.sm,
    fontWeight: '500',
  },
  segmentedProgressBar: {
    flexDirection: 'row',
    gap: 3,
    marginBottom: Layout.spacing.sm,
  },
  segment: {
    flex: 1,
    height: 6,
    borderRadius: 3,
  },
  segmentComplete: {
    backgroundColor: Colors.accentGreen,
  },
  segmentInProgress: {
    backgroundColor: Colors.primary,
  },
  segmentLocked: {
    backgroundColor: Colors.gray.light,
  },
  pointsBadge: {
    position: 'absolute',
    top: Layout.spacing.md,
    right: Layout.spacing.md,
    backgroundColor: Colors.accentYellow,
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pointsText: {
    fontSize: 10,
    color: Colors.white,
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
    gap: Layout.spacing.xs,
    marginTop: Layout.spacing.sm,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: Layout.spacing.xs,
    backgroundColor: Colors.gray.lightest,
    borderRadius: Layout.borderRadius.small,
  },
  actionButtonText: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: '600',
  },
});