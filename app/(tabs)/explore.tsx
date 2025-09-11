import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Search, Filter } from "lucide-react-native";
import Colors from "@/constants/colors";
import Layout from "@/constants/layout";
import CategoryCard from "@/components/explore/CategoryCard";
import VideoCard from "@/components/explore/VideoCard";

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    { id: '1', name: 'Nature', icon: '🦁', color: Colors.accentGreen, videoCount: 127 },
    { id: '2', name: 'Science', icon: '🚀', color: Colors.accentBlue, videoCount: 89 },
    { id: '3', name: 'History', icon: '⚔️', color: Colors.accentOrange, videoCount: 156 },
    { id: '4', name: 'Culture', icon: '🍕', color: Colors.accentYellow, videoCount: 94 },
    { id: '5', name: 'Skills', icon: '🧠', color: Colors.primary, videoCount: 112 },
    { id: '6', name: 'Mystery', icon: '🔍', color: Colors.accentPink, videoCount: 78 },
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
              placeholder="Search for topics, courses..."
              placeholderTextColor={Colors.text.secondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Filter color={Colors.primary} size={20} />
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Browse Categories</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesScroll}
          >
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                isSelected={selectedCategory === category.id}
                onPress={() => setSelectedCategory(
                  selectedCategory === category.id ? null : category.id
                )}
              />
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
  filterButton: {
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
  categoriesScroll: {
    paddingHorizontal: Layout.spacing.lg,
    gap: Layout.spacing.sm,
  },
  videosGrid: {
    paddingHorizontal: Layout.spacing.lg,
    gap: Layout.spacing.md,
  },
});