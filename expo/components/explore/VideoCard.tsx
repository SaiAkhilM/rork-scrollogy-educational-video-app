import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, Eye, TrendingUp } from 'lucide-react-native';
import Colors from '@/constants/colors';
import Layout from '@/constants/layout';

interface VideoCardProps {
  video: {
    id: string;
    title: string;
    author: string;
    thumbnailUrl: string;
    duration: number;
    views: number;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
  };
}

export default function VideoCard({ video }: VideoCardProps) {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  const getDifficultyColor = () => {
    switch (video.difficulty) {
      case 'beginner': return Colors.accentGreen;
      case 'intermediate': return Colors.accentYellow;
      case 'advanced': return Colors.accentOrange;
    }
  };

  return (
    <TouchableOpacity style={[styles.container, Colors.shadows.small]}>
      <View style={styles.thumbnailContainer}>
        <Image source={{ uri: video.thumbnailUrl }} style={styles.thumbnail} />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.overlay}
        />
        <LinearGradient
          colors={Colors.gradients.primary as [string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.playOverlay}
        >
          <Play color={Colors.white} fill={Colors.white} size={28} />
        </LinearGradient>
        <View style={styles.duration}>
          <Text style={styles.durationText}>{formatDuration(video.duration)}</Text>
        </View>
        {video.views > 1000000 && (
          <View style={styles.trendingBadge}>
            <TrendingUp size={12} color={Colors.white} />
            <Text style={styles.trendingText}>VIRAL</Text>
          </View>
        )}
      </View>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>{video.title}</Text>
        <Text style={styles.author}>{video.author}</Text>
        <View style={styles.footer}>
          <View style={styles.stats}>
            <Eye size={16} color={Colors.accentGreen} />
            <Text style={styles.statsText}>{formatViews(video.views)} views</Text>
          </View>
          <LinearGradient
            colors={[getDifficultyColor(), getDifficultyColor() + 'AA']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.difficulty}
          >
            <Text style={styles.difficultyText}>
              {video.difficulty.toUpperCase()}
            </Text>
          </LinearGradient>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginBottom: Layout.spacing.lg,
    overflow: 'hidden',
  },
  thumbnailContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  playOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -35 }, { translateY: -35 }],
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  duration: {
    position: 'absolute',
    bottom: Layout.spacing.md,
    right: Layout.spacing.md,
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: 6,
    borderRadius: 12,
  },
  durationText: {
    color: Colors.white,
    fontSize: Layout.fontSize.xs,
    fontWeight: '700',
  },
  trendingBadge: {
    position: 'absolute',
    top: Layout.spacing.md,
    left: Layout.spacing.md,
    backgroundColor: Colors.accentOrange,
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendingText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: '700',
  },
  content: {
    padding: Layout.spacing.lg,
  },
  title: {
    fontSize: Layout.fontSize.lg,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: Layout.spacing.sm,
    lineHeight: 22,
  },
  author: {
    fontSize: Layout.fontSize.sm,
    color: Colors.text.secondary,
    marginBottom: Layout.spacing.md,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.sm,
  },
  statsText: {
    fontSize: Layout.fontSize.sm,
    color: Colors.text.primary,
    fontWeight: '600',
  },
  difficulty: {
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    borderRadius: 16,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.white,
  },
});