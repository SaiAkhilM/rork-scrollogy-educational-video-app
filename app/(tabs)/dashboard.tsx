import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { Settings, Trophy, Flame, Target } from "lucide-react-native";
import Colors from "@/constants/colors";
import Layout from "@/constants/layout";
import { useUser } from "@/hooks/useUser";
import StatsCard from "@/components/dashboard/StatsCard";
import CourseCard from "@/components/dashboard/CourseCard";
import AchievementBadge from "@/components/dashboard/AchievementBadge";

export default function DashboardScreen() {
  const router = useRouter();
  const { user } = useUser();

  const mockCourses = [
    {
      id: '1',
      title: '🦁 Animals That Could Kill You',
      category: 'Nature',
      progress: 75,
      totalLessons: 127,
      completedLessons: 95,
      thumbnailUrl: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=400',
    },
    {
      id: '2',
      title: '🚀 Insane Space Facts',
      category: 'Science',
      progress: 45,
      totalLessons: 89,
      completedLessons: 40,
      thumbnailUrl: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400',
    },
    {
      id: '3',
      title: '⚔️ Weird History Nobody Talks About',
      category: 'History',
      progress: 62,
      totalLessons: 156,
      completedLessons: 97,
      thumbnailUrl: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=400',
    },
    {
      id: '4',
      title: '🍕 Foods That Changed The World',
      category: 'Culture',
      progress: 88,
      totalLessons: 94,
      completedLessons: 83,
      thumbnailUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
    },
    {
      id: '5',
      title: '🧠 Psychology Tricks That Actually Work',
      category: 'Skills',
      progress: 34,
      totalLessons: 112,
      completedLessons: 38,
      thumbnailUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400',
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.userName}>{user?.name || 'Learner'}! 🔥</Text>
          </View>
          <TouchableOpacity 
            onPress={() => router.push('/settings')}
            style={styles.settingsButton}
          >
            <Settings color={Colors.text.primary} size={24} />
          </TouchableOpacity>
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
            <Text style={styles.sectionTitle}>🎬 Continue Watching</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.coursesScroll}
          >
            {mockCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </ScrollView>
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.lg,
    paddingTop: Layout.spacing.lg,
    paddingBottom: Layout.spacing.md,
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
});