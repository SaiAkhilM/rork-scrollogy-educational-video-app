import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import { Stack } from 'expo-router';
import { Trophy, Flame, TrendingUp } from 'lucide-react-native';
import Colors from '@/constants/colors';
import Layout from '@/constants/layout';
import { LeaderboardEntry } from '@/types';
import { useUser } from '@/hooks/useUser';

type TabType = 'current' | 'allTime' | 'streak';

export default function LeaderboardScreen() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<TabType>('current');
  const [refreshing, setRefreshing] = useState(false);

  const mockLeaderboard: LeaderboardEntry[] = Array.from({ length: 100 }, (_, i) => ({
    id: `${i + 1}`,
    userId: `user-${i + 1}`,
    userName: `User ${i + 1}`,
    userAvatar: `https://ui-avatars.com/api/?name=User+${i + 1}&background=${['7B68EE', 'FF6B35', '00D084', 'FFD700', 'FF69B4'][i % 5]}&color=fff`,
    rank: i + 1,
    points: 15000 - i * 100,
    totalPoints: 25000 - i * 150,
    streak: Math.max(1, 30 - i),
    level: Math.max(1, 20 - Math.floor(i / 5)),
  }));

  const currentUserRank: LeaderboardEntry = {
    id: user?.id || 'current',
    userId: user?.id || 'current',
    userName: user?.name || 'You',
    userAvatar: user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=7B68EE&color=fff`,
    rank: user?.rank || 42,
    points: user?.points || 1250,
    totalPoints: user?.totalPoints || 3450,
    streak: user?.streak || 7,
    level: user?.level || 5,
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const getTabData = () => {
    switch (activeTab) {
      case 'current':
        return mockLeaderboard;
      case 'allTime':
        return [...mockLeaderboard].sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0));
      case 'streak':
        return [...mockLeaderboard].sort((a, b) => (b.streak || 0) - (a.streak || 0));
      default:
        return mockLeaderboard;
    }
  };

  const renderLeaderboardItem = (entry: LeaderboardEntry, isCurrentUser = false) => {
    const getRankColor = (rank: number) => {
      if (rank === 1) return Colors.accentYellow;
      if (rank === 2) return Colors.gray.medium;
      if (rank === 3) return Colors.accentOrange;
      return Colors.primary;
    };

    const getRankIcon = (rank: number) => {
      if (rank === 1) return '🥇';
      if (rank === 2) return '🥈';
      if (rank === 3) return '🥉';
      return null;
    };

    return (
      <View
        key={entry.id}
        style={[
          styles.leaderboardItem,
          isCurrentUser && styles.currentUserItem,
        ]}
      >
        <View style={[styles.rankBadge, { backgroundColor: getRankColor(entry.rank) }]}>
          {getRankIcon(entry.rank) ? (
            <Text style={styles.rankEmoji}>{getRankIcon(entry.rank)}</Text>
          ) : (
            <Text style={styles.rankText}>#{entry.rank}</Text>
          )}
        </View>
        <Image source={{ uri: entry.userAvatar }} style={styles.avatar} />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{entry.userName}</Text>
          <View style={styles.statsRow}>
            {activeTab === 'current' && (
              <Text style={styles.points}>{entry.points.toLocaleString()} pts</Text>
            )}
            {activeTab === 'allTime' && (
              <Text style={styles.points}>{(entry.totalPoints || 0).toLocaleString()} total pts</Text>
            )}
            {activeTab === 'streak' && (
              <View style={styles.streakBadge}>
                <Flame color={Colors.accentOrange} size={14} />
                <Text style={styles.streakText}>{entry.streak} days</Text>
              </View>
            )}
          </View>
        </View>
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>Lv {entry.level}</Text>
        </View>
      </View>
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Leaderboard',
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          headerTintColor: Colors.white,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <View style={styles.container}>
        {/* Tab Selector */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'current' && styles.tabActive]}
            onPress={() => setActiveTab('current')}
          >
            <Trophy
              color={activeTab === 'current' ? Colors.white : Colors.text.secondary}
              size={20}
            />
            <Text style={[styles.tabText, activeTab === 'current' && styles.tabTextActive]}>
              Current Points
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'allTime' && styles.tabActive]}
            onPress={() => setActiveTab('allTime')}
          >
            <TrendingUp
              color={activeTab === 'allTime' ? Colors.white : Colors.text.secondary}
              size={20}
            />
            <Text style={[styles.tabText, activeTab === 'allTime' && styles.tabTextActive]}>
              All-Time
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'streak' && styles.tabActive]}
            onPress={() => setActiveTab('streak')}
          >
            <Flame
              color={activeTab === 'streak' ? Colors.white : Colors.text.secondary}
              size={20}
            />
            <Text style={[styles.tabText, activeTab === 'streak' && styles.tabTextActive]}>
              Longest Streak
            </Text>
          </TouchableOpacity>
        </View>

        {/* Current User Rank (Sticky) */}
        <View style={styles.currentUserContainer}>
          {renderLeaderboardItem(currentUserRank, true)}
        </View>

        {/* Leaderboard List */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.leaderboardList}>
            {getTabData().map((entry) => renderLeaderboardItem(entry))}
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: Layout.spacing.sm,
    gap: Layout.spacing.sm,
    ...Colors.shadows.small,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Layout.spacing.sm,
    paddingHorizontal: Layout.spacing.xs,
    borderRadius: Layout.borderRadius.medium,
    backgroundColor: Colors.gray.lightest,
    gap: Layout.spacing.xs,
  },
  tabActive: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: Layout.fontSize.xs,
    fontWeight: '600',
    color: Colors.text.secondary,
  },
  tabTextActive: {
    color: Colors.white,
  },
  currentUserContainer: {
    backgroundColor: Colors.white,
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
    ...Colors.shadows.medium,
  },
  scrollView: {
    flex: 1,
  },
  leaderboardList: {
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
    gap: Layout.spacing.sm,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: Layout.spacing.md,
    borderRadius: Layout.borderRadius.medium,
    gap: Layout.spacing.md,
    marginBottom: Layout.spacing.sm,
    ...Colors.shadows.small,
  },
  currentUserItem: {
    backgroundColor: Colors.primary,
    borderWidth: 3,
    borderColor: Colors.accentYellow,
  },
  rankBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankText: {
    fontSize: Layout.fontSize.sm,
    fontWeight: 'bold',
    color: Colors.white,
  },
  rankEmoji: {
    fontSize: 24,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.gray.light,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: Layout.fontSize.md,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: Layout.spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  points: {
    fontSize: Layout.fontSize.sm,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.xs,
  },
  streakText: {
    fontSize: Layout.fontSize.sm,
    color: Colors.accentOrange,
    fontWeight: '600',
  },
  levelBadge: {
    backgroundColor: Colors.gray.lightest,
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: Layout.spacing.xs,
    borderRadius: Layout.borderRadius.small,
  },
  levelText: {
    fontSize: Layout.fontSize.xs,
    fontWeight: 'bold',
    color: Colors.primary,
  },
});
