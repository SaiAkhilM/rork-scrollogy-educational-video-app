import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from "expo-router";
import { Settings, Trophy, Flame, Target, Bell, Coins, MessageSquare, AlertCircle, CreditCard } from "lucide-react-native";
import Colors from "@/constants/colors";
import Layout from "@/constants/layout";
import { useUser } from "@/hooks/useUser";
import StatsCard from "@/components/dashboard/StatsCard";
import CourseCard from "@/components/dashboard/CourseCard";
import AchievementBadge from "@/components/dashboard/AchievementBadge";
import CourseCatalog from "@/components/dashboard/CourseCatalog";
import { Course, Module } from "@/types";

export default function DashboardScreen() {
  const router = useRouter();
  const { user } = useUser();
  const insets = useSafeAreaInsets();
  const [hasNotifications] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showCatalog, setShowCatalog] = useState(false);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);

  const mockCourses: Course[] = [
    {
      id: '1',
      title: '🦁 Animals That Could Kill You',
      description: 'Discover the most dangerous animals on Earth and what makes them deadly.',
      category: 'Nature',
      progress: 75,
      totalVideos: 127,
      completedVideos: 95,
      thumbnailUrl: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=400',
      difficulty: 'beginner',
      estimatedTime: 360,
      points: 1270,
      isEnrolled: true,
      isSaved: false,
      lastAccessed: new Date('2025-10-10'),
      modules: [],
    },
    {
      id: '2',
      title: '🚀 Insane Space Facts',
      description: 'Mind-blowing facts about space that will change how you see the universe.',
      category: 'Science',
      progress: 45,
      totalVideos: 89,
      completedVideos: 40,
      thumbnailUrl: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400',
      difficulty: 'intermediate',
      estimatedTime: 267,
      points: 890,
      isEnrolled: true,
      isSaved: false,
      lastAccessed: new Date('2025-10-09'),
      modules: [],
    },
    {
      id: '3',
      title: '⚔️ Weird History Nobody Talks About',
      description: 'Uncover bizarre historical events that textbooks left out.',
      category: 'History',
      progress: 62,
      totalVideos: 156,
      completedVideos: 97,
      thumbnailUrl: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=400',
      difficulty: 'beginner',
      estimatedTime: 468,
      points: 1560,
      isEnrolled: true,
      isSaved: false,
      lastAccessed: new Date('2025-10-08'),
      modules: [],
    },
    {
      id: '4',
      title: '🍕 Foods That Changed The World',
      description: 'How simple foods shaped civilizations and changed history.',
      category: 'Culture',
      progress: 88,
      totalVideos: 94,
      completedVideos: 83,
      thumbnailUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
      difficulty: 'beginner',
      estimatedTime: 282,
      points: 940,
      isEnrolled: true,
      isSaved: false,
      lastAccessed: new Date('2025-10-11'),
      modules: [],
    },
    {
      id: '5',
      title: '🧠 Psychology Tricks That Actually Work',
      description: 'Proven psychological techniques you can use in everyday life.',
      category: 'Skills',
      progress: 0,
      totalVideos: 112,
      completedVideos: 0,
      thumbnailUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400',
      difficulty: 'intermediate',
      estimatedTime: 336,
      points: 1120,
      isEnrolled: true,
      isSaved: false,
      modules: [],
    },
    {
      id: '6',
      title: '🎨 Art Movements That Changed Everything',
      description: 'Explore revolutionary art movements and their impact on culture.',
      category: 'Culture',
      progress: 0,
      totalVideos: 78,
      completedVideos: 0,
      thumbnailUrl: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400',
      difficulty: 'beginner',
      estimatedTime: 234,
      points: 780,
      isEnrolled: false,
      isSaved: true,
      modules: [],
    },
    {
      id: '7',
      title: '💪 Ancient Warrior Training Methods',
      description: 'How ancient warriors trained and what we can learn from them.',
      category: 'History',
      progress: 100,
      totalVideos: 65,
      completedVideos: 65,
      thumbnailUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400',
      difficulty: 'intermediate',
      estimatedTime: 195,
      points: 650,
      isEnrolled: true,
      isSaved: false,
      lastAccessed: new Date('2025-09-28'),
      modules: [],
    },
  ];

  const mockAchievements = [
    { id: '1', title: 'First Steps', icon: '🎯', unlocked: true, gradient: Colors.gradients.primary },
    { id: '2', title: 'Week Warrior', icon: '🔥', unlocked: true, gradient: Colors.gradients.orange },
    { id: '3', title: 'Knowledge Seeker', icon: '📚', unlocked: true, gradient: Colors.gradients.blue },
    { id: '4', title: 'Master Mind', icon: '🧠', unlocked: false, gradient: Colors.gradients.purple },
    { id: '5', title: 'Speed Demon', icon: '⚡', unlocked: true, gradient: Colors.gradients.success },
    { id: '6', title: 'Night Owl', icon: '🦉', unlocked: false, gradient: Colors.gradients.pink },
  ];

  const continueLearning = mockCourses.filter(c => c.isEnrolled && c.progress > 0 && c.progress < 100);
  const readyToStart = mockCourses.filter(c => c.isEnrolled && c.progress === 0);
  const savedCourses = mockCourses.filter(c => c.isSaved);
  const completedCourses = mockCourses.filter(c => c.progress === 100);

  const handleOpenCatalog = (course: Course) => {
    setSelectedCourse(course);
    setShowCatalog(true);
  };

  const handleModulePress = (module: Module) => {
    setSelectedModule(module);
    setShowCatalog(false);
  };

  const renderEmptyState = (message: string) => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>{message}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Custom Header with Dashboard Title */}
        <View style={[styles.customHeader, { paddingTop: insets.top + Layout.spacing.md }]}>
          <View style={styles.titleRow}>
            <Text style={styles.dashboardTitle}>Dashboard</Text>
            <View style={styles.pointsContainer}>
              <Coins color={Colors.accentYellow} size={18} />
              <View>
                <Text style={styles.pointsValue}>{user?.points || 0}</Text>
                <Text style={styles.pointsLabel}>{user?.totalPoints || 0} total</Text>
              </View>
            </View>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.notificationButton}>
              <Bell color={Colors.text.primary} size={24} />
              {hasNotifications && <View style={styles.notificationDot} />}
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => router.push('/settings')}
              style={styles.settingsButton}
            >
              <Settings color={Colors.text.primary} size={24} />
            </TouchableOpacity>
          </View>
        </View>

        {/* User Welcome Section */}
        <View style={styles.welcomeSection}>
          <View style={styles.welcomeLeft}>
            <TouchableOpacity>
              <Image
                source={{ uri: user?.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.name || 'User') + '&background=7B68EE&color=fff' }}
                style={styles.avatar}
              />
            </TouchableOpacity>
            <View>
              <Text style={styles.greeting}>Welcome back,</Text>
              <Text style={styles.userName}>{user?.name || 'Learner'}! 🔥</Text>
            </View>
          </View>
        </View>

        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          <StatsCard
            icon={<Flame color={Colors.accentOrange} size={24} />}
            label="Day Streak"
            value={user?.streak || 0}
            color={Colors.accentOrange}
          />
          <StatsCard
            icon={<Trophy color={Colors.accentYellow} size={24} />}
            label="Points"
            value={user?.points || 0}
            color={Colors.accentYellow}
          />
          <StatsCard
            icon={<Target color={Colors.primary} size={24} />}
            label="Level"
            value={user?.level || 1}
            color={Colors.primary}
          />
        </View>

        {/* Continue Learning */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🎬 Continue Learning</Text>
            {continueLearning.length > 0 && (
              <TouchableOpacity>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            )}
          </View>
          {continueLearning.length > 0 ? (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.coursesScroll}
            >
              {continueLearning.map((course) => (
                <CourseCard 
                  key={course.id} 
                  course={course}
                  onOpenCatalog={() => handleOpenCatalog(course)}
                />
              ))}
            </ScrollView>
          ) : renderEmptyState("You're all caught up! Start a new course to continue learning.")}
        </View>

        {/* Ready to Start */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🚀 Ready to Start</Text>
            {readyToStart.length > 0 && (
              <TouchableOpacity>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            )}
          </View>
          {readyToStart.length > 0 ? (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.coursesScroll}
            >
              {readyToStart.map((course) => (
                <CourseCard 
                  key={course.id} 
                  course={course}
                  onOpenCatalog={() => handleOpenCatalog(course)}
                />
              ))}
            </ScrollView>
          ) : renderEmptyState("No courses waiting. Explore new topics!")}
        </View>

        {/* Saved Courses */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>💾 Saved Courses</Text>
            {savedCourses.length > 0 && (
              <TouchableOpacity>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            )}
          </View>
          {savedCourses.length > 0 ? (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.coursesScroll}
            >
              {savedCourses.map((course) => (
                <CourseCard 
                  key={course.id} 
                  course={course}
                  onOpenCatalog={() => handleOpenCatalog(course)}
                />
              ))}
            </ScrollView>
          ) : renderEmptyState("Save courses from Explore to find them here.")}
        </View>

        {/* Completed */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🏆 Completed</Text>
            {completedCourses.length > 0 && (
              <TouchableOpacity>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            )}
          </View>
          {completedCourses.length > 0 ? (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.coursesScroll}
            >
              {completedCourses.map((course) => (
                <CourseCard 
                  key={course.id} 
                  course={course}
                  onOpenCatalog={() => handleOpenCatalog(course)}
                />
              ))}
            </ScrollView>
          ) : renderEmptyState("Complete your first course to earn a certificate!")}
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🏆 Your Achievements</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.achievementsGrid}>
            {mockAchievements.map((achievement) => (
              <AchievementBadge key={achievement.id} achievement={achievement} />
            ))}
          </View>
        </View>

        {/* Daily Goal */}
        <View style={styles.dailyGoalCard}>
          <View style={styles.dailyGoalHeader}>
            <Target color={Colors.accentGreen} size={24} />
            <Text style={styles.dailyGoalTitle}>🎯 Daily Challenge</Text>
          </View>
          <Text style={styles.dailyGoalProgress}>3 / 5 videos watched today</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '60%' }]} />
          </View>
          <Text style={styles.motivationText}>Keep going! You&apos;re on fire! 🔥</Text>
        </View>

        {/* Bottom Actions */}
        <View style={styles.bottomActions}>
          <TouchableOpacity 
            style={styles.primaryActionButton}
            onPress={() => router.push('/request-course')}
          >
            <MessageSquare color={Colors.white} size={20} />
            <Text style={styles.primaryActionText}>Request a Custom Course</Text>
          </TouchableOpacity>
          
          <View style={styles.secondaryActions}>
            <TouchableOpacity style={styles.linkButton}>
              <AlertCircle color={Colors.primary} size={16} />
              <Text style={styles.linkText}>Report Bug/Feedback</Text>
            </TouchableOpacity>
            
            {user?.isPremium && (
              <TouchableOpacity style={styles.linkButton}>
                <CreditCard color={Colors.primary} size={16} />
                <Text style={styles.linkText}>Manage Subscription</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>

      {selectedCourse && (
        <CourseCatalog
          course={selectedCourse}
          visible={showCatalog}
          onClose={() => setShowCatalog(false)}
          onModulePress={handleModulePress}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  customHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.lg,
    paddingTop: Layout.spacing.lg,
    paddingBottom: Layout.spacing.sm,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray.light,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.sm,
    flex: 1,
  },
  dashboardTitle: {
    fontSize: Layout.fontSize.xxl,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.sm,
  },
  welcomeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.lg,
    paddingTop: Layout.spacing.md,
    paddingBottom: Layout.spacing.sm,
  },
  welcomeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.md,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray.light,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.xs,
    backgroundColor: Colors.gray.light,
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: 6,
    borderRadius: Layout.borderRadius.medium,
  },
  pointsValue: {
    fontSize: Layout.fontSize.sm,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  pointsLabel: {
    fontSize: 10,
    color: Colors.text.secondary,
  },
  notificationButton: {
    padding: Layout.spacing.xs,
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.error,
  },
  greeting: {
    fontSize: Layout.fontSize.md,
    color: Colors.text.secondary,
  },
  userName: {
    fontSize: Layout.fontSize.xl,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  settingsButton: {
    padding: Layout.spacing.sm,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
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
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Layout.spacing.lg,
    gap: Layout.spacing.md,
  },
  dailyGoalCard: {
    backgroundColor: Colors.white,
    marginHorizontal: Layout.spacing.lg,
    marginVertical: Layout.spacing.md,
    padding: Layout.spacing.lg,
    borderRadius: Layout.borderRadius.large,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dailyGoalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.sm,
    marginBottom: Layout.spacing.sm,
  },
  dailyGoalTitle: {
    fontSize: Layout.fontSize.md,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  dailyGoalProgress: {
    fontSize: Layout.fontSize.sm,
    color: Colors.text.secondary,
    marginBottom: Layout.spacing.sm,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.gray.light,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.accentGreen,
    borderRadius: 4,
  },
  motivationText: {
    fontSize: Layout.fontSize.xs,
    color: Colors.accentGreen,
    fontWeight: '600',
    marginTop: Layout.spacing.sm,
    textAlign: 'center',
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
    fontStyle: 'italic',
  },
  bottomActions: {
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.xl,
    gap: Layout.spacing.md,
  },
  primaryActionButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Layout.spacing.sm,
    paddingVertical: Layout.spacing.md,
    borderRadius: Layout.borderRadius.medium,
    ...Colors.shadows.medium,
  },
  primaryActionText: {
    fontSize: Layout.fontSize.lg,
    fontWeight: 'bold',
    color: Colors.white,
  },
  secondaryActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Layout.spacing.lg,
    flexWrap: 'wrap',
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.xs,
  },
  linkText: {
    fontSize: Layout.fontSize.sm,
    color: Colors.primary,
    fontWeight: '600',
  },
});