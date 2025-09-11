import React, { useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  SafeAreaView,
  Platform,
} from "react-native";
import { Heart, Share2, BookmarkPlus, ChevronUp } from "lucide-react-native";
import Colors from "@/constants/colors";
import Layout from "@/constants/layout";
import VideoPlayer from "@/components/player/VideoPlayer";
import VideoInfo from "@/components/player/VideoInfo";
import { Video } from "@/types";

const { height: screenHeight } = Dimensions.get('window');

export default function PlayerScreen() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const videos: Video[] = [
    {
      id: '1',
      title: 'The Most Dangerous Predators on Earth',
      description: 'Discover which animals could actually kill you and why they\'re so deadly. From tiny insects to massive predators!',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=800',
      duration: 180,
      course: {
        id: '1',
        name: 'Animals That Could Kill You',
        thumbnail: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=200',
      },
      category: 'Nature',
      difficulty: 'beginner',
      likes: 2400,
      views: 2400000,
    },
    {
      id: '2',
      title: 'Venomous vs Poisonous: The Deadly Difference',
      description: 'Learn the shocking difference between venomous and poisonous animals - it could save your life!',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800',
      duration: 240,
      course: {
        id: '1',
        name: 'Animals That Could Kill You',
        thumbnail: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=200',
      },
      category: 'Nature',
      difficulty: 'beginner',
      likes: 1892,
      views: 1800000,
    },
    {
      id: '3',
      title: 'Tiny Killers: Insects That Can End You',
      description: 'The smallest creatures can be the deadliest. Meet the insects that have killed more humans than any other animal.',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1509718443690-d8e2fb3474b7?w=800',
      duration: 200,
      course: {
        id: '1',
        name: 'Animals That Could Kill You',
        thumbnail: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=200',
      },
      category: 'Nature',
      difficulty: 'beginner',
      likes: 3200,
      views: 2100000,
    },
  ];

  const currentVideo = videos[currentVideoIndex];

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / screenHeight);
    if (index !== currentVideoIndex && index >= 0 && index < videos.length) {
      setCurrentVideoIndex(index);
      setIsLiked(false);
      setIsSaved(false);
    }
  };

  const scrollToNext = () => {
    if (currentVideoIndex < videos.length - 1) {
      scrollViewRef.current?.scrollTo({
        y: (currentVideoIndex + 1) * screenHeight,
        animated: true,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
      >
        {videos.map((video, index) => (
          <View key={video.id} style={styles.videoContainer}>
            <VideoPlayer video={video} isActive={index === currentVideoIndex} />
            
            {/* Video Info Overlay */}
            <View style={styles.overlay}>
              <VideoInfo video={video} />
              
              {/* Action Buttons */}
              <View style={styles.actions}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => setIsLiked(!isLiked)}
                >
                  <Heart 
                    color={isLiked ? Colors.error : Colors.white} 
                    fill={isLiked ? Colors.error : 'transparent'}
                    size={28} 
                  />
                  <Text style={styles.actionText}>
                    {video.likes + (isLiked ? 1 : 0)}
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.actionButton}>
                  <Share2 color={Colors.white} size={28} />
                  <Text style={styles.actionText}>Share</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => setIsSaved(!isSaved)}
                >
                  <BookmarkPlus 
                    color={isSaved ? Colors.accentYellow : Colors.white} 
                    fill={isSaved ? Colors.accentYellow : 'transparent'}
                    size={28} 
                  />
                  <Text style={styles.actionText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Swipe Up Indicator */}
            {index < videos.length - 1 && (
              <TouchableOpacity 
                style={styles.swipeIndicator}
                onPress={scrollToNext}
              >
                <ChevronUp color={Colors.white} size={24} />
                <Text style={styles.swipeText}>Next video</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray.dark,
  },
  videoContainer: {
    height: screenHeight - (Platform.OS === 'ios' ? 120 : 80),
    position: 'relative',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: Layout.spacing.md,
    paddingBottom: Layout.spacing.xl,
  },
  actions: {
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
  },
  swipeIndicator: {
    position: 'absolute',
    bottom: 60,
    alignSelf: 'center',
    alignItems: 'center',
    opacity: 0.8,
  },
  swipeText: {
    color: Colors.white,
    fontSize: Layout.fontSize.xs,
    marginTop: Layout.spacing.xs,
  },
});