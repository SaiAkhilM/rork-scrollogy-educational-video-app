import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated } from 'react-native';
import { Heart, MessageCircle, Link2, Subtitles } from 'lucide-react-native';
import Colors from '@/constants/colors';
import Layout from '@/constants/layout';

interface VideoOverlayProps {
  likes: number;
  isLiked: boolean;
  onLike: () => void;
  commentsCount: number;
  onComments: () => void;
  onSources: () => void;
  showSubtitles: boolean;
  onToggleSubtitles: () => void;
  subtitleText?: string;
}

export default function VideoOverlay({
  likes,
  isLiked,
  onLike,
  commentsCount,
  onComments,
  onSources,
  showSubtitles,
  onToggleSubtitles,
  subtitleText,
}: VideoOverlayProps) {
  const [likeAnimation] = useState(new Animated.Value(1));

  const handleLike = () => {
    Animated.sequence([
      Animated.timing(likeAnimation, {
        toValue: 1.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(likeAnimation, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
    onLike();
  };

  const formatCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <View style={styles.container}>
      {showSubtitles && subtitleText && (
        <View style={styles.subtitlesContainer}>
          <Text style={styles.subtitlesText}>{subtitleText}</Text>
        </View>
      )}

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
          <Animated.View style={{ transform: [{ scale: likeAnimation }] }}>
            <Heart
              color={isLiked ? Colors.error : Colors.white}
              fill={isLiked ? Colors.error : 'transparent'}
              size={32}
            />
          </Animated.View>
          <Text style={styles.actionText}>{formatCount(likes)}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={onComments}>
          <MessageCircle color={Colors.white} size={32} />
          <Text style={styles.actionText}>{formatCount(commentsCount)}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={onSources}>
          <Link2 color={Colors.white} size={32} />
          <Text style={styles.actionText}>Sources</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={onToggleSubtitles}>
          <Subtitles
            color={showSubtitles ? Colors.accentYellow : Colors.white}
            size={32}
          />
          <Text style={styles.actionText}>CC</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    paddingBottom: Layout.spacing.xl * 2,
    paddingRight: Layout.spacing.md,
  },
  subtitlesContainer: {
    position: 'absolute',
    bottom: 120,
    left: -Layout.window.width + 100,
    right: 80,
    paddingHorizontal: Layout.spacing.lg,
    alignItems: 'center',
  },
  subtitlesText: {
    color: Colors.white,
    fontSize: Layout.fontSize.md,
    fontWeight: '600',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.small,
  },
  actionsContainer: {
    alignItems: 'center',
    gap: Layout.spacing.lg,
  },
  actionButton: {
    alignItems: 'center',
    gap: Layout.spacing.xs,
  },
  actionText: {
    color: Colors.white,
    fontSize: Layout.fontSize.xs,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 3,
  },
});
