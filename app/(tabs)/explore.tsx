import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from "react-native";
import { Search, Trophy } from "lucide-react-native";
import Colors from "@/constants/colors";
import Layout from "@/constants/layout";
import { useRouter } from "expo-router";
import VideoCard from "@/components/explore/VideoCard";
import { LeaderboardEntry } from "@/types";

export default function ExploreScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    { id: 'for-you', name: 'For You', icon: '✨', color: Colors.primary, videoCount: 0 },
    { id: '1', name: 'Nature', icon: '🦁', color: Colors.accentGreen, videoCount: 127 },
    { id: '2', name: 'Science', icon: '🚀', color: Colors.accentBlue, videoCount: 89 },
    { id: '3', name: 'History', icon: '⚔️', color: Colors.accentOrange, videoCount: 156 },
    { id: '4', name: 'Culture', icon: '🍕', color: Colors.accentYellow, videoCount: 94 },
    { id: '5', name: 'Skills', icon: '🧠', color: Colors.primary, videoCount: 112 },
    { id: '6', name: 'Technology', icon: '💻', color: Colors.accentBlue, videoCount: 145 },
    { id: '7', name: 'Arts & Culture', icon: '🎨', color: Colors.accentPink, videoCount: 98 },
    { id: '8', name: 'Business', icon: '💼', color: Colors.accentOrange, videoCount: 134 },
    { id: '9', name: 'Health & Wellness', icon: '🧘', color: Colors.accentGreen, videoCount: 87 },
  ];

  const topLearners: LeaderboardEntry[] = [
    {
      id: '1',
      userId: '1',
      userName: 'Sarah Johnson',
      userAvatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=7B68EE&color=fff',
      rank: 1,
      points: 12450,
      level: 15,
    },
    {
      id: '2',
      userId: '2',
      userName: 'Mike Chen',
      userAvatar: 'https://ui-avatars.com/api/?name=Mike+Chen&background=FF6B35&color=fff',
      rank: 2,
      points: 11230,
      level: 14,
    },
    {
      id: '3',
      userId: '3',
      userName: 'Emma Davis',
      userAvatar: 'https://ui-avatars.com/api/?name=Emma+Davis&background=00D084&color=fff',
      rank: 3,
      points: 10890,
      level: 13,
    },
    {
      id: '4',
      userId: '4',
      userName: 'Alex Rodriguez',
      userAvatar: 'https://ui-avatars.com/api/?name=Alex+Rodriguez&background=FFD700&color=fff',
      rank: 4,
      points: 9560,
      level: 12,
    },
    {
      id: '5',
      userId: '5',
      userName: 'Lisa Wang',
      userAvatar: 'https://ui-avatars.com/api/?name=Lisa+Wang&background=FF69B4&color=fff',
      rank: 5,
      points: 8920,
      level: 11,
    },
  ];

  const trendingVideos = [
    {
      id: '1',
      title: '🦁 Animals That Could Kill You',
      author: 'Wild Explorer',
      thumbnailUrl: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=400',
      duration: 180,
      views: 2400000,
      difficulty: 'beginner' as const,
    },
    {
      id: '2',
      title: '🚀 Insane Space Facts',
      author: 'Cosmic Mind',
      thumbnailUrl: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400',
      duration: 240,
      views: 1800000,
      difficulty: 'intermediate' as const,
    },
    {
      id: '3',
      title: '⚔️ Weird History Nobody Talks About',
      author: 'Hidden Past',
      thumbnailUrl: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=400',
      duration: 360,
      views: 3200000,
      difficulty: 'beginner' as const,
    },
    {
      id: '4',
      title: '🍕 Foods That Changed The World',
      author: 'Flavor Journey',
      thumbnailUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
      duration: 200,
      views: 1500000,
      difficulty: 'beginner' as const,
    },
    {
      id: '5',
      title: '🧠 Psychology Tricks That Actually Work',
      author: 'Mind Hacker',
      thumbnailUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400',
      duration: 280,
      views: 2100000,
      difficulty: 'intermediate' as const,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search color={Colors.text.secondary} size={20} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search courses..."
              placeholderTextColor={Colors.text.secondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity 
            style={styles.trophyButton}
            onPress={() => router.push('/leaderboard')}
          >
            <Trophy color={Colors.accentYellow} size={24} />
          </TouchableOpacity>
        </View>

        {/* Category Filter Chips */}
        <View style={styles.section}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsScroll}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.chip,
                  selectedCategory === category.id && styles.chipActive
                ]}
                onPress={() => setSelectedCategory(
                  selectedCategory === category.id ? null : category.id
                )}
              >
                <Text style={styles.chipIcon}>{category.icon}</Text>
                <Text style={[
                  styles.chipText,
                  selectedCategory === category.id && styles.chipTextActive
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Trending */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🔥 Trending Now</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.videosGrid}>
            {trendingVideos.slice(0, 3).map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </View>
        </View>

        {/* Recommended */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>✨ For You</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.videosGrid}>
            {trendingVideos.slice(3).map((video) => (
              <VideoCard key={`rec-${video.id}`} video={video} />
            ))}
          </View>
        </View>

        {/* Leaderboard Preview */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🏆 Top Learners This Week</Text>
            <TouchableOpacity onPress={() => router.push('/leaderboard')}>
              <Text style={styles.seeAll}>View Full Leaderboard</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.leaderboardPreview}>
            {topLearners.map((entry) => (
              <View key={entry.id} style={styles.leaderboardItem}>
                <View style={styles.leaderboardRank}>
                  <Text style={styles.rankText}>#{entry.rank}</Text>
                </View>
                <Image
                  source={{ uri: entry.userAvatar }}
                  style={styles.leaderboardAvatar}
                />
                <View style={styles.leaderboardInfo}>
                  <Text style={styles.leaderboardName}>{entry.userName}</Text>
                  <Text style={styles.leaderboardPoints}>{entry.points.toLocaleString()} pts</Text>
                </View>
              </View>
            ))}
          </View>
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
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
    gap: Layout.spacing.sm,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray.lightest,
    borderRadius: Layout.borderRadius.large,
    paddingHorizontal: Layout.spacing.md,
    gap: Layout.spacing.sm,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: Layout.fontSize.md,
    color: Colors.text.primary,
  },
  trophyButton: {
    width: 44,
    height: 44,
    backgroundColor: Colors.gray.lightest,
    borderRadius: Layout.borderRadius.large,
    justifyContent: 'center',
    alignItems: 'center',
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
    paddingHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.md,
  },
  seeAll: {
    fontSize: Layout.fontSize.sm,
    color: Colors.primary,
    fontWeight: '600',
  },
  chipsScroll: {
    paddingHorizontal: Layout.spacing.lg,
    gap: Layout.spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.large,
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.gray.light,
    gap: Layout.spacing.xs,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipIcon: {
    fontSize: 16,
  },
  chipText: {
    fontSize: Layout.fontSize.sm,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  chipTextActive: {
    color: Colors.white,
  },
  leaderboardPreview: {
    paddingHorizontal: Layout.spacing.lg,
    gap: Layout.spacing.sm,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: Layout.spacing.md,
    borderRadius: Layout.borderRadius.medium,
    gap: Layout.spacing.md,
    ...Colors.shadows.small,
  },
  leaderboardRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankText: {
    fontSize: Layout.fontSize.sm,
    fontWeight: 'bold',
    color: Colors.white,
  },
  leaderboardAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray.light,
  },
  leaderboardInfo: {
    flex: 1,
  },
  leaderboardName: {
    fontSize: Layout.fontSize.md,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  leaderboardPoints: {
    fontSize: Layout.fontSize.sm,
    color: Colors.text.secondary,
  },
  videosGrid: {
    paddingHorizontal: Layout.spacing.lg,
    gap: Layout.spacing.md,
  },
});