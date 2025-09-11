import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  RefreshControl,
  Animated,
  Modal,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { 
  Settings, 
  Bell, 
  Coins, 
  MessageSquare,
  Bug,
  CreditCard,
  X,
  Lock,
  CheckCircle,
  PlayCircle
} from "lucide-react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from "@/constants/colors";
import Layout from "@/constants/layout";
import { useUser } from "@/hooks/useUser";
import CourseCard from "@/components/dashboard/CourseCard";
import { Course, Module } from "@/types";

const MOCK_COURSES: Course[] = [
  {
    id: '1',
    title: '🦁 Animals That Could Kill You',
    description: 'Learn about the world\'s most dangerous animals and how to survive encounters with them.',
    category: 'Nature',
    thumbnailUrl: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=400',
    progress: 75,
    totalVideos: 127,
    completedVideos: 95,
    pointsEarned: 950,
    totalPoints: 1270,
    isLiked: true,
    lastAccessedAt: new Date('2024-01-10'),
    enrolledAt: new Date('2024-01-01'),
    difficulty: 'intermediate',
    estimatedTime: 360,
    modules: [
      { id: 'm1', title: 'Big Cats', thumbnailUrl: '', videos: [], quizzes: [], progress: 100, isLocked: false, order: 1 },
      { id: 'm2', title: 'Venomous Snakes', thumbnailUrl: '', videos: [], quizzes: [], progress: 100, isLocked: false, order: 2 },
      { id: 'm3', title: 'Ocean Predators', thumbnailUrl: '', videos: [], quizzes: [], progress: 60, isLocked: false, order: 3 },
      { id: 'm4', title: 'Insects & Arachnids', thumbnailUrl: '', videos: [], quizzes: [], progress: 0, isLocked: false, order: 4 },
      { id: 'm5', title: 'Survival Guide', thumbnailUrl: '', videos: [], quizzes: [], progress: 0, isLocked: true, order: 5 },
    ]
  },
  {
    id: '2',
    title: '🚀 Insane Space Facts',
    description: 'Mind-blowing facts about the universe that will change how you see the night sky.',
    category: 'Science',
    thumbnailUrl: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400',
    progress: 45,
    totalVideos: 89,
    completedVideos: 40,
    pointsEarned: 400,
    totalPoints: 890,
    isLiked: false,
    lastAccessedAt: new Date('2024-01-09'),
    enrolledAt: new Date('2024-01-02'),
    difficulty: 'beginner',
    estimatedTime: 240,
    modules: [
      { id: 'm1', title: 'Solar System', thumbnailUrl: '', videos: [], quizzes: [], progress: 100, isLocked: false, order: 1 },
      { id: 'm2', title: 'Black Holes', thumbnailUrl: '', videos: [], quizzes: [], progress: 80, isLocked: false, order: 2 },
      { id: 'm3', title: 'Galaxies', thumbnailUrl: '', videos: [], quizzes: [], progress: 0, isLocked: false, order: 3 },
      { id: 'm4', title: 'Time & Space', thumbnailUrl: '', videos: [], quizzes: [], progress: 0, isLocked: true, order: 4 },
    ]
  },
  {
    id: '3',
    title: '⚔️ Weird History Nobody Talks About',
    description: 'Discover the bizarre, shocking, and hilarious moments from history your teachers never mentioned.',
    category: 'History',
    thumbnailUrl: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=400',
    progress: 0,
    totalVideos: 156,
    completedVideos: 0,
    pointsEarned: 0,
    totalPoints: 1560,
    isLiked: true,
    enrolledAt: new Date('2024-01-08'),
    difficulty: 'intermediate',
    estimatedTime: 420,
    modules: []
  },
  {
    id: '4',
    title: '🍕 Foods That Changed The World',
    description: 'The incredible stories behind the foods that shaped civilizations and changed history.',
    category: 'Culture',
    thumbnailUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
    progress: 100,
    totalVideos: 94,
    completedVideos: 94,
    pointsEarned: 940,
    totalPoints: 940,
    isLiked: true,
    completedAt: new Date('2024-01-07'),
    enrolledAt: new Date('2023-12-20'),
    certificateUrl: 'certificate-url',
    difficulty: 'beginner',
    estimatedTime: 300,
    modules: []
  },
  {
    id: '5',
    title: '🧠 Psychology Tricks That Actually Work',
    description: 'Master the art of persuasion and understand how the human mind really works.',
    category: 'Skills',
    thumbnailUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400',
    progress: 34,
    totalVideos: 112,
    completedVideos: 38,
    pointsEarned: 380,
    totalPoints: 1120,
    isLiked: false,
    lastAccessedAt: new Date('2024-01-11'),
    enrolledAt: new Date('2024-01-05'),
    difficulty: 'advanced',
    estimatedTime: 360,
    modules: []
  },
];

export default function DashboardScreen() {
  const router = useRouter();
  const { user } = useUser();
  const [refreshing, setRefreshing] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [catalogModalVisible, setCatalogModalVisible] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [moduleDetailVisible, setModuleDetailVisible] = useState(false);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    loadCourses();
    animateEntrance();
  }, []);

  const animateEntrance = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const loadCourses = async () => {
    try {
      const storedCourses = await AsyncStorage.getItem('userCourses');
      if (storedCourses) {
        setCourses(JSON.parse(storedCourses));
      } else {
        setCourses(MOCK_COURSES);
        await AsyncStorage.setItem('userCourses', JSON.stringify(MOCK_COURSES));
      }
    } catch (error) {
      console.error('Error loading courses:', error);
      setCourses(MOCK_COURSES);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadCourses();
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const inProgressCourses = courses.filter(c => c.progress > 0 && c.progress < 100)
    .sort((a, b) => (b.lastAccessedAt?.getTime() || 0) - (a.lastAccessedAt?.getTime() || 0));
  
  const notStartedCourses = courses.filter(c => c.progress === 0 && c.enrolledAt);
  
  const savedCourses = courses.filter(c => c.isLiked);
  
  const completedCourses = courses.filter(c => c.progress === 100);

  const handleCatalogPress = (course: Course) => {
    setSelectedCourse(course);
    setCatalogModalVisible(true);
  };

  const handleModulePress = (module: Module) => {
    if (!module.isLocked) {
      setSelectedModule(module);
      setModuleDetailVisible(true);
    } else {
      Alert.alert('Module Locked', 'Complete 80% of the previous module to unlock this one.');
    }
  };

  const handleRequestCourse = () => {
    Alert.alert('Request a Course', 'What topic would you like to learn about?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Submit Request', onPress: () => console.log('Course requested') }
    ]);
  };

  const renderCourseSection = (title: string, courseList: Course[], emptyMessage: string) => {
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{title}</Text>
          {courseList.length > 0 && (
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {courseList.length > 0 ? (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.coursesScroll}
          >
            {courseList.map((course) => (
              <CourseCard 
                key={course.id} 
                course={course}
                onResume={() => router.push('/player')}
                onDescription={() => Alert.alert(course.title, course.description)}
                onCatalog={() => handleCatalogPress(course)}
              />
            ))}
          </ScrollView>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>{emptyMessage}</Text>
          </View>
        )}
      </View>
    );
  };

  const renderCatalogModal = () => {
    if (!selectedCourse) return null;

    return (
      <Modal
        visible={catalogModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setCatalogModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedCourse.title}</Text>
              <TouchableOpacity onPress={() => setCatalogModalVisible(false)}>
                <X color={Colors.text.primary} size={24} />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.modalSubtitle}>
              {selectedCourse.modules?.length || 0} Modules • {selectedCourse.totalVideos} Videos
            </Text>

            <ScrollView style={styles.modulesList}>
              {selectedCourse.modules?.map((module, index) => (
                <TouchableOpacity
                  key={module.id}
                  style={[styles.moduleItem, module.isLocked && styles.lockedModule]}
                  onPress={() => handleModulePress(module)}
                >
                  <View style={styles.moduleImageContainer}>
                    <Image 
                      source={{ uri: module.thumbnailUrl || selectedCourse.thumbnailUrl }}
                      style={[styles.moduleImage, module.isLocked && styles.lockedImage]}
                    />
                    {module.isLocked && (
                      <View style={styles.lockOverlay}>
                        <Lock color={Colors.white} size={24} />
                      </View>
                    )}
                  </View>
                  
                  <View style={styles.moduleInfo}>
                    <Text style={styles.moduleTitle}>
                      Module {index + 1}: {module.title}
                    </Text>
                    <View style={styles.moduleProgress}>
                      <View style={styles.moduleProgressBar}>
                        <View 
                          style={[
                            styles.moduleProgressFill,
                            { width: `${module.progress}%` }
                          ]}
                        />
                      </View>
                      <Text style={styles.moduleProgressText}>{module.progress}%</Text>
                    </View>
                    {module.isLocked && (
                      <Text style={styles.lockedText}>
                        Complete 80% of previous module to unlock
                      </Text>
                    )}
                  </View>

                  <TouchableOpacity 
                    style={[styles.enterButton, module.isLocked && styles.enterButtonDisabled]}
                    disabled={module.isLocked}
                  >
                    <Text style={styles.enterButtonText}>Enter</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  const renderModuleDetailModal = () => {
    if (!selectedModule) return null;

    const mockContent = Array.from({ length: 12 }, (_, i) => ({
      id: `content-${i}`,
      type: i % 4 === 3 ? 'quiz' : 'video',
      title: i % 4 === 3 ? `Quiz ${Math.floor(i / 4) + 1}` : `Video ${i + 1}`,
      progress: Math.random() * 100,
      completed: Math.random() > 0.5,
    }));

    return (
      <Modal
        visible={moduleDetailVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModuleDetailVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedModule.title}</Text>
              <TouchableOpacity onPress={() => setModuleDetailVisible(false)}>
                <X color={Colors.text.primary} size={24} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={mockContent}
              numColumns={3}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.contentGrid}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.contentThumbnail}>
                  <View style={styles.thumbnailContainer}>
                    <Image 
                      source={{ uri: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200' }}
                      style={styles.thumbnailImage}
                    />
                    {item.completed && (
                      <View style={styles.completedOverlay}>
                        <CheckCircle color={Colors.accentGreen} size={32} fill={Colors.white} />
                      </View>
                    )}
                    {!item.completed && item.progress > 0 && (
                      <View style={styles.progressRing}>
                        <Text style={styles.progressRingText}>{Math.round(item.progress)}%</Text>
                      </View>
                    )}
                    {item.type === 'video' && !item.completed && (
                      <PlayCircle 
                        color={Colors.white} 
                        size={32} 
                        style={styles.playIcon}
                      />
                    )}
                  </View>
                  <Text style={styles.contentTitle}>{item.title}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Animated.View 
          style={[
            styles.animatedContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.profileAvatar}>
              <Image 
                source={{ uri: 'https://ui-avatars.com/api/?name=' + (user?.name || 'User') }}
                style={styles.avatarImage}
              />
            </TouchableOpacity>

            <Text style={styles.logoText}>Scrollogy</Text>

            <View style={styles.headerRight}>
              <View style={styles.pointsContainer}>
                <Coins color={Colors.accentYellow} size={16} />
                <Text style={styles.currentPoints}>{user?.points || 0}</Text>
              </View>
              <Text style={styles.totalPoints}>Total: {user?.totalPoints || 0}</Text>
            </View>

            <TouchableOpacity 
              onPress={() => router.push('/settings')}
              style={styles.settingsButton}
            >
              <Settings color={Colors.text.primary} size={24} />
            </TouchableOpacity>
          </View>

          {/* Notifications */}
          <TouchableOpacity style={styles.notificationBar}>
            <View style={styles.notificationIcon}>
              <Bell color={Colors.text.primary} size={20} />
              <View style={styles.notificationDot} />
            </View>
            <Text style={styles.notificationText}>You have 3 new achievements!</Text>
          </TouchableOpacity>

          {/* Course Sections */}
          {renderCourseSection('🎬 Continue Learning', inProgressCourses, 'Start your first course! 📚')}
          {renderCourseSection('🚀 Ready to Start', notStartedCourses, 'Browse courses to get started 🔍')}
          {renderCourseSection('❤️ Saved Courses', savedCourses, 'Like courses to save them here ❤️')}
          {renderCourseSection('🏆 Completed', completedCourses, 'Complete courses to see them here 🏆')}

          {/* Bottom Actions */}
          <View style={styles.bottomActions}>
            <TouchableOpacity 
              style={styles.requestButton}
              onPress={handleRequestCourse}
            >
              <MessageSquare color={Colors.white} size={20} />
              <Text style={styles.requestButtonText}>Request a Custom Course</Text>
            </TouchableOpacity>

            <View style={styles.bottomLinks}>
              <TouchableOpacity style={styles.linkButton}>
                <Bug color={Colors.text.secondary} size={16} />
                <Text style={styles.linkText}>Report Bug/Feedback</Text>
              </TouchableOpacity>

              {user && (
                <TouchableOpacity style={styles.linkButton}>
                  <CreditCard color={Colors.text.secondary} size={16} />
                  <Text style={styles.linkText}>Manage Subscription</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      {renderCatalogModal()}
      {renderModuleDetailModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  animatedContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.lg,
    paddingTop: Layout.spacing.lg,
    paddingBottom: Layout.spacing.md,
  },
  profileAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  logoText: {
    fontSize: Layout.fontSize.xl,
    fontWeight: 'bold',
    color: Colors.primary,
    marginLeft: Layout.spacing.md,
    flex: 1,
  },
  headerRight: {
    alignItems: 'flex-end',
    marginRight: Layout.spacing.md,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  currentPoints: {
    fontSize: Layout.fontSize.md,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  totalPoints: {
    fontSize: Layout.fontSize.xs,
    color: Colors.text.secondary,
  },
  settingsButton: {
    padding: Layout.spacing.sm,
  },
  notificationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    marginHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.md,
    padding: Layout.spacing.md,
    borderRadius: Layout.borderRadius.medium,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  notificationIcon: {
    position: 'relative',
    marginRight: Layout.spacing.sm,
  },
  notificationDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.error,
  },
  notificationText: {
    fontSize: Layout.fontSize.sm,
    color: Colors.text.primary,
    flex: 1,
  },
  section: {
    paddingVertical: Layout.spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.md,
  },
  sectionTitle: {
    fontSize: Layout.fontSize.lg,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  seeAll: {
    fontSize: Layout.fontSize.sm,
    color: Colors.primary,
    fontWeight: '600',
  },
  coursesScroll: {
    paddingHorizontal: Layout.spacing.lg,
  },
  emptyState: {
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.xl,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: Layout.fontSize.md,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  bottomActions: {
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.xl,
  },
  requestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    padding: Layout.spacing.lg,
    borderRadius: Layout.borderRadius.large,
    gap: Layout.spacing.sm,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  requestButtonText: {
    fontSize: Layout.fontSize.md,
    fontWeight: 'bold',
    color: Colors.white,
  },
  bottomLinks: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: Layout.spacing.lg,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.xs,
  },
  linkText: {
    fontSize: Layout.fontSize.sm,
    color: Colors.text.secondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: Layout.borderRadius.xl,
    borderTopRightRadius: Layout.borderRadius.xl,
    paddingTop: Layout.spacing.lg,
    paddingBottom: Layout.spacing.xl,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.sm,
  },
  modalTitle: {
    fontSize: Layout.fontSize.lg,
    fontWeight: 'bold',
    color: Colors.text.primary,
    flex: 1,
    marginRight: Layout.spacing.md,
  },
  modalSubtitle: {
    fontSize: Layout.fontSize.sm,
    color: Colors.text.secondary,
    paddingHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.lg,
  },
  modulesList: {
    paddingHorizontal: Layout.spacing.lg,
  },
  moduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray.lightest,
    borderRadius: Layout.borderRadius.medium,
    padding: Layout.spacing.md,
    marginBottom: Layout.spacing.md,
  },
  lockedModule: {
    opacity: 0.6,
  },
  moduleImageContainer: {
    width: 60,
    height: 60,
    borderRadius: Layout.borderRadius.small,
    overflow: 'hidden',
    position: 'relative',
  },
  moduleImage: {
    width: '100%',
    height: '100%',
  },
  lockedImage: {
    opacity: 0.5,
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moduleInfo: {
    flex: 1,
    marginLeft: Layout.spacing.md,
  },
  moduleTitle: {
    fontSize: Layout.fontSize.md,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: Layout.spacing.xs,
  },
  moduleProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.sm,
  },
  moduleProgressBar: {
    flex: 1,
    height: 4,
    backgroundColor: Colors.gray.light,
    borderRadius: 2,
    overflow: 'hidden',
  },
  moduleProgressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
  moduleProgressText: {
    fontSize: Layout.fontSize.xs,
    color: Colors.text.secondary,
    minWidth: 35,
  },
  lockedText: {
    fontSize: Layout.fontSize.xs,
    color: Colors.text.secondary,
    marginTop: Layout.spacing.xs,
  },
  enterButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.small,
  },
  enterButtonDisabled: {
    backgroundColor: Colors.gray.medium,
  },
  enterButtonText: {
    fontSize: Layout.fontSize.sm,
    fontWeight: '600',
    color: Colors.white,
  },
  contentGrid: {
    padding: Layout.spacing.lg,
  },
  contentThumbnail: {
    flex: 1,
    margin: Layout.spacing.xs,
    alignItems: 'center',
  },
  thumbnailContainer: {
    width: 90,
    height: 90,
    borderRadius: Layout.borderRadius.small,
    overflow: 'hidden',
    position: 'relative',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  completedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressRing: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -20 }],
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(123, 104, 238, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressRingText: {
    fontSize: Layout.fontSize.xs,
    color: Colors.white,
    fontWeight: 'bold',
  },
  playIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -16 }, { translateY: -16 }],
  },
  contentTitle: {
    fontSize: Layout.fontSize.xs,
    color: Colors.text.primary,
    marginTop: Layout.spacing.xs,
    textAlign: 'center',
  },
});