import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { BookOpen } from 'lucide-react-native';
import Colors from '@/constants/colors';
import Layout from '@/constants/layout';
import { Video } from '@/types';

interface VideoInfoProps {
  video: Video;
}

export default function VideoInfo({ video }: VideoInfoProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.courseInfo}>
        {video.course.thumbnail ? (
          <Image source={{ uri: video.course.thumbnail }} style={styles.courseThumbnail} />
        ) : (
          <View style={styles.courseThumbnailPlaceholder}>
            <BookOpen size={20} color={Colors.white} />
          </View>
        )}
        <Text style={styles.courseName}>{video.course.name}</Text>
      </TouchableOpacity>
      
      <Text style={styles.title}>{video.title}</Text>
      <Text style={styles.description} numberOfLines={2}>
        {video.description}
      </Text>
      
      <View style={styles.tags}>
        <View style={styles.tag}>
          <Text style={styles.tagText}>#{video.category}</Text>
        </View>
        <View style={styles.tag}>
          <Text style={styles.tagText}>#{video.difficulty}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingRight: 60,
  },
  courseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  courseThumbnail: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: Layout.spacing.sm,
  },
  courseThumbnailPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Layout.spacing.sm,
  },
  courseName: {
    color: Colors.white,
    fontSize: Layout.fontSize.sm,
    fontWeight: '600',
    flex: 1,
  },
  title: {
    color: Colors.white,
    fontSize: Layout.fontSize.md,
    fontWeight: 'bold',
    marginBottom: Layout.spacing.sm,
  },
  description: {
    color: Colors.white,
    fontSize: Layout.fontSize.sm,
    opacity: 0.9,
    marginBottom: Layout.spacing.sm,
  },
  tags: {
    flexDirection: 'row',
    gap: Layout.spacing.sm,
  },
  tag: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: Layout.spacing.xs,
    borderRadius: Layout.borderRadius.small,
  },
  tagText: {
    color: Colors.white,
    fontSize: Layout.fontSize.xs,
    fontWeight: '600',
  },
});