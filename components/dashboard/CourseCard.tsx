import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Image,
  Animated,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, Info, List } from 'lucide-react-native';
import Colors from '@/constants/colors';
import Layout from '@/constants/layout';
import { Course } from '@/types';

interface CourseCardProps {
  course: Course;
  onResume?: () => void;
  onDescription?: () => void;
  onCatalog?: () => void;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = 280;
const CARD_HEIGHT = 200;

export default function CourseCard({ 
  course, 
  onResume, 
  onDescription, 
  onCatalog 
}: CourseCardProps) {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const renderModuleProgress = () => {
    const totalModules = course.modules?.length || 5;
    const segments = [];
    
    for (let i = 0; i < totalModules; i++) {
      const module = course.modules?.[i];
      const isCompleted = module ? module.progress === 100 : false;
      const isInProgress = module ? module.progress > 0 && module.progress < 100 : false;
      
      segments.push(
        <View key={i} style={styles.progressSegment}>
          <View 
            style={[
              styles.progressSegmentFill,
              isCompleted && styles.progressCompleted,
              isInProgress && styles.progressInProgress,
            ]}
          />
        </View>
      );
    }
    
    return segments;
  };

  return (
    <Animated.View 
      style={[
        styles.container,
        { transform: [{ scale: scaleAnim }] }
      ]}
    >
      <TouchableOpacity 
        activeOpacity={0.9}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onResume}
      >
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: course.thumbnailUrl }} 
            style={styles.thumbnail}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.3)']}
            style={styles.imageOverlay}
          />
          <View style={styles.playIconContainer}>
            <View style={styles.playIconBg}>
              <Play color={Colors.white} size={24} fill={Colors.white} />
            </View>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>
            {course.title}
          </Text>

          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              {renderModuleProgress()}
            </View>
            <Text style={styles.progressText}>
              {course.completedVideos}/{course.totalVideos} videos
            </Text>
          </View>

          <View style={styles.pointsBadge}>
            <Text style={styles.pointsText}>
              {course.pointsEarned} / {course.totalPoints} pts
            </Text>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.primaryButton]}
              onPress={onResume}
            >
              <Play color={Colors.white} size={14} />
              <Text style={styles.primaryButtonText}>Resume</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.secondaryButton]}
              onPress={onDescription}
            >
              <Info color={Colors.primary} size={14} />
              <Text style={styles.secondaryButtonText}>Info</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.secondaryButton]}
              onPress={onCatalog}
            >
              <List color={Colors.primary} size={14} />
              <Text style={styles.secondaryButtonText}>Catalog</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginRight: Layout.spacing.md,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  imageContainer: {
    width: '100%',
    height: CARD_HEIGHT * 0.55,
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  playIconContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
  },
  playIconBg: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(123, 104, 238, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: Layout.spacing.md,
  },
  title: {
    fontSize: Layout.fontSize.md,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: Layout.spacing.sm,
    lineHeight: 20,
  },
  progressContainer: {
    marginBottom: Layout.spacing.sm,
  },
  progressBar: {
    flexDirection: 'row',
    height: 6,
    marginBottom: 4,
    gap: 2,
  },
  progressSegment: {
    flex: 1,
    backgroundColor: Colors.gray.light,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressSegmentFill: {
    height: '100%',
    backgroundColor: Colors.gray.light,
  },
  progressCompleted: {
    backgroundColor: Colors.accentGreen,
  },
  progressInProgress: {
    backgroundColor: Colors.primary,
  },
  progressText: {
    fontSize: Layout.fontSize.xs,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  pointsBadge: {
    backgroundColor: Colors.accentYellow,
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: Layout.spacing.sm,
  },
  pointsText: {
    fontSize: Layout.fontSize.xs,
    color: Colors.text.primary,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: Layout.spacing.xs,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: Colors.primary,
    backgroundColor: 'transparent',
  },
  primaryButtonText: {
    fontSize: Layout.fontSize.xs,
    color: Colors.white,
    fontWeight: '600',
  },
  secondaryButtonText: {
    fontSize: Layout.fontSize.xs,
    color: Colors.primary,
    fontWeight: '600',
  },
});