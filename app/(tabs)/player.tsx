import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Play } from 'lucide-react-native';
import Colors from '@/constants/colors';
import Layout from '@/constants/layout';
import VideoPlayer from '@/components/player/VideoPlayer';
import VideoInfo from '@/components/player/VideoInfo';
import VideoOverlay from '@/components/player/VideoOverlay';
import QuizOverlay from '@/components/player/QuizOverlay';
import CommentsDrawer from '@/components/player/CommentsDrawer';
import SourcesModal from '@/components/player/SourcesModal';
import { Video, Quiz, Comment, Source } from '@/types';

const { height: screenHeight } = Dimensions.get('window');

type FeedItem = 
  | { type: 'video'; data: Video }
  | { type: 'quiz'; data: Quiz };

export default function PlayerScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSubtitles, setShowSubtitles] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showSources, setShowSources] = useState(false);
  const [videoLikes, setVideoLikes] = useState<Record<string, boolean>>({});

  const mockVideos: Video[] = [
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
  ];

  const mockQuiz: Quiz = {
    id: 'quiz-1',
    title: 'Animals Quiz',
    moduleId: 'module-1',
    courseId: '1',
    courseName: 'Animals That Could Kill You',
    completed: false,
    questions: [
      {
        id: 'q1',
        question: 'What is the deadliest animal to humans?',
        options: [
          'Shark',
          'Mosquito',
          'Lion',
          'Snake',
        ],
        correctAnswer: 1,
      },
      {
        id: 'q2',
        question: 'What\'s the difference between venomous and poisonous?',
        options: [
          'They are the same thing',
          'Venomous injects toxin, poisonous is ingested',
          'Poisonous injects toxin, venomous is ingested',
          'Venomous is more dangerous',
        ],
        correctAnswer: 1,
      },
      {
        id: 'q3',
        question: 'Which insect kills the most humans per year?',
        options: [
          'Bee',
          'Wasp',
          'Mosquito',
          'Fire Ant',
        ],
        correctAnswer: 2,
      },
    ],
  };

  const feedItems: FeedItem[] = [
    { type: 'video', data: mockVideos[0] },
    { type: 'video', data: mockVideos[1] },
    { type: 'quiz', data: mockQuiz },
  ];

  const mockComments: Comment[] = [
    {
      id: '1',
      userId: '1',
      userName: 'Sarah Johnson',
      text: 'This is so fascinating! I had no idea mosquitoes were that dangerous 😱',
      likes: 24,
      isLiked: false,
      createdAt: new Date(Date.now() - 3600000),
    },
    {
      id: '2',
      userId: '2',
      userName: 'Mike Chen',
      text: 'Great explanation! Really helps understand the difference.',
      likes: 12,
      isLiked: false,
      createdAt: new Date(Date.now() - 7200000),
    },
  ];

  const mockSources: Source[] = [
    {
      id: '1',
      title: 'World Health Organization - Vector-borne diseases',
      url: 'https://www.who.int/news-room/fact-sheets/detail/vector-borne-diseases',
      domain: 'who.int',
      isVerified: true,
    },
    {
      id: '2',
      title: 'National Geographic - Deadliest Animals',
      url: 'https://www.nationalgeographic.com/animals/article/deadliest-animals',
      domain: 'nationalgeographic.com',
      isVerified: true,
    },
  ];

  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [commentLikes, setCommentLikes] = useState<Record<string, boolean>>({});

  const hasNoCourse = feedItems.length === 0;

  useEffect(() => {
    console.log('Current index:', currentIndex);
  }, [currentIndex]);

  const handleViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      const index = viewableItems[0].index;
      if (index !== null && index !== currentIndex) {
        setCurrentIndex(index);
      }
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const handleLike = (videoId: string) => {
    setVideoLikes((prev) => ({
      ...prev,
      [videoId]: !prev[videoId],
    }));
  };

  const handleAddComment = (text: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      userId: 'current-user',
      userName: 'You',
      text,
      likes: 0,
      isLiked: false,
      createdAt: new Date(),
    };
    setComments([newComment, ...comments]);
  };

  const handleLikeComment = (commentId: string) => {
    setCommentLikes((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              likes: comment.likes + (commentLikes[commentId] ? -1 : 1),
              isLiked: !commentLikes[commentId],
            }
          : comment
      )
    );
  };

  const handleQuizComplete = (score: number) => {
    console.log('Quiz completed with score:', score);
    Alert.alert(
      'Quiz Complete! 🎉',
      `You scored ${score}%! Great job!`,
      [
        {
          text: 'Continue',
          onPress: () => {
            if (currentIndex < feedItems.length - 1) {
              flatListRef.current?.scrollToIndex({
                index: currentIndex + 1,
                animated: true,
              });
            }
          },
        },
      ]
    );
  };

  const handleQuizSkip = () => {
    Alert.alert(
      'Skip Quiz?',
      'Remember: Certificates require all correct answers!',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Skip Anyway',
          style: 'destructive',
          onPress: () => {
            if (currentIndex < feedItems.length - 1) {
              flatListRef.current?.scrollToIndex({
                index: currentIndex + 1,
                animated: true,
              });
            }
          },
        },
      ]
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconContainer}>
        <Play color={Colors.primary} size={64} />
      </View>
      <Text style={styles.emptyTitle}>Ready to learn?</Text>
      <Text style={styles.emptySubtitle}>
        Browse courses and start your learning journey
      </Text>
      <TouchableOpacity
        style={styles.browseButton}
        onPress={() => router.push('/(tabs)/explore')}
      >
        <Text style={styles.browseButtonText}>Browse Courses</Text>
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item, index }: { item: FeedItem; index: number }) => {
    const isActive = index === currentIndex;

    if (item.type === 'quiz') {
      return (
        <View style={styles.itemContainer}>
          <QuizOverlay
            quiz={item.data}
            onComplete={handleQuizComplete}
            onSkip={handleQuizSkip}
          />
        </View>
      );
    }

    const video = item.data;
    const isLiked = videoLikes[video.id] || false;

    return (
      <View style={styles.itemContainer}>
        <VideoPlayer video={video} isActive={isActive} />

        <View style={styles.overlay}>
          <VideoInfo video={video} />
          <VideoOverlay
            likes={video.likes + (isLiked ? 1 : 0)}
            isLiked={isLiked}
            onLike={() => handleLike(video.id)}
            commentsCount={comments.length}
            onComments={() => setShowComments(true)}
            onSources={() => setShowSources(true)}
            showSubtitles={showSubtitles}
            onToggleSubtitles={() => setShowSubtitles(!showSubtitles)}
            subtitleText={
              showSubtitles
                ? 'This is an example subtitle text that would appear here'
                : undefined
            }
          />
        </View>
      </View>
    );
  };

  if (hasNoCourse) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {renderEmptyState()}
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <FlatList
        ref={flatListRef}
        data={feedItems}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.type}-${index}`}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToInterval={screenHeight - (Platform.OS === 'ios' ? 120 : 80)}
        snapToAlignment="start"
        getItemLayout={(data, index) => ({
          length: screenHeight - (Platform.OS === 'ios' ? 120 : 80),
          offset: (screenHeight - (Platform.OS === 'ios' ? 120 : 80)) * index,
          index,
        })}
      />

      <CommentsDrawer
        visible={showComments}
        onClose={() => setShowComments(false)}
        comments={comments}
        onAddComment={handleAddComment}
        onLikeComment={handleLikeComment}
      />

      <SourcesModal
        visible={showSources}
        onClose={() => setShowSources(false)}
        sources={mockSources}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray.dark,
  },
  itemContainer: {
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.xl,
    backgroundColor: Colors.background,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.gray.lightest,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Layout.spacing.xl,
  },
  emptyTitle: {
    fontSize: Layout.fontSize.xxl,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: Layout.spacing.sm,
  },
  emptySubtitle: {
    fontSize: Layout.fontSize.md,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: Layout.spacing.xl,
  },
  browseButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Layout.spacing.xl,
    paddingVertical: Layout.spacing.md,
    borderRadius: Layout.borderRadius.large,
    ...Colors.shadows.medium,
  },
  browseButtonText: {
    color: Colors.white,
    fontSize: Layout.fontSize.lg,
    fontWeight: 'bold',
  },
});
