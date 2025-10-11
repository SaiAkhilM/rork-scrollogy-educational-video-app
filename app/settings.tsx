import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
  Modal,
  TextInput,
  Alert,
  Image,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { 
  ArrowLeft,
  User, 
  Mail,
  Lock,
  Bell, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  Camera,
  Check,
  X,
  FileText,
  MessageSquare,
  Video,
  Globe,
  Trash2,
  AlertCircle,
} from "lucide-react-native";
import Colors from "@/constants/colors";
import Layout from "@/constants/layout";
import { useUser } from "@/hooks/useUser";
import { CourseRequest } from "@/types";

type NotificationSettings = {
  courseUpdates: boolean;
  streakReminders: boolean;
  customCourseReady: boolean;
  weeklyProgress: boolean;
  achievementUnlocked: boolean;
  leaderboardChanges: boolean;
};

type QuizSettings = {
  hideAllQuizzes: boolean;
  courseQuizSettings: { [courseId: string]: boolean };
};

type VideoQuality = 'auto' | 'high' | 'medium' | 'low';

export default function SettingsScreen() {
  const router = useRouter();
  const { user, logout } = useUser();
  const insets = useSafeAreaInsets();
  
  const [notifications, setNotifications] = useState<NotificationSettings>({
    courseUpdates: true,
    streakReminders: true,
    customCourseReady: true,
    weeklyProgress: true,
    achievementUnlocked: true,
    leaderboardChanges: false,
  });

  const [quizSettings, setQuizSettings] = useState<QuizSettings>({
    hideAllQuizzes: false,
    courseQuizSettings: {},
  });

  const [videoQuality, setVideoQuality] = useState<VideoQuality>('auto');
  const [autoplay, setAutoplay] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState('1.0');
  const [subtitleLanguage, setSubtitleLanguage] = useState('English');
  const [cacheSize, setCacheSize] = useState('0 MB');

  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showChangeEmail, setShowChangeEmail] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showBugReport, setShowBugReport] = useState(false);
  const [showVideoQualityModal, setShowVideoQualityModal] = useState(false);
  const [showPlaybackSpeedModal, setShowPlaybackSpeedModal] = useState(false);

  const [editName, setEditName] = useState(user?.name || '');
  const [editUsername, setEditUsername] = useState(user?.username || '');
  const [newEmail, setNewEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [bugType, setBugType] = useState('');
  const [bugDescription, setBugDescription] = useState('');

  const mockCourseRequests: CourseRequest[] = [
    {
      id: '1',
      userId: user?.id || '1',
      topic: 'Advanced Quantum Physics',
      depth: 'deep',
      learningGoals: 'Understand quantum mechanics principles',
      pointsRedeemed: 500,
      estimatedPrice: 299,
      videoCount: 45,
      status: 'quoted',
      expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      createdAt: new Date('2025-10-01'),
    },
    {
      id: '2',
      userId: user?.id || '1',
      topic: 'Modern Web Development',
      depth: 'standard',
      learningGoals: 'Learn React and TypeScript',
      pointsRedeemed: 300,
      estimatedPrice: 199,
      videoCount: 30,
      status: 'in_progress',
      createdAt: new Date('2025-09-15'),
    },
  ];

  const enrolledCourses = [
    { id: '1', title: '🦁 Animals That Could Kill You' },
    { id: '2', title: '🚀 Insane Space Facts' },
    { id: '3', title: '⚔️ Weird History Nobody Talks About' },
  ];

  const loadSettings = useCallback(async () => {
    try {
      const savedNotifications = await AsyncStorage.getItem('notifications');
      const savedQuizSettings = await AsyncStorage.getItem('quizSettings');
      const savedVideoQuality = await AsyncStorage.getItem('videoQuality');
      const savedAutoplay = await AsyncStorage.getItem('autoplay');
      const savedPlaybackSpeed = await AsyncStorage.getItem('playbackSpeed');
      const savedSubtitleLanguage = await AsyncStorage.getItem('subtitleLanguage');

      if (savedNotifications) setNotifications(JSON.parse(savedNotifications));
      if (savedQuizSettings) setQuizSettings(JSON.parse(savedQuizSettings));
      if (savedVideoQuality) setVideoQuality(savedVideoQuality as VideoQuality);
      if (savedAutoplay) setAutoplay(JSON.parse(savedAutoplay));
      if (savedPlaybackSpeed) setPlaybackSpeed(savedPlaybackSpeed);
      if (savedSubtitleLanguage) setSubtitleLanguage(savedSubtitleLanguage);

      calculateCacheSize();
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);



  const saveNotificationSetting = async (key: keyof NotificationSettings, value: boolean) => {
    const updated = { ...notifications, [key]: value };
    setNotifications(updated);
    await AsyncStorage.setItem('notifications', JSON.stringify(updated));
  };

  const saveQuizSettings = async (updated: QuizSettings) => {
    setQuizSettings(updated);
    await AsyncStorage.setItem('quizSettings', JSON.stringify(updated));
  };

  const saveVideoQuality = async (quality: VideoQuality) => {
    setVideoQuality(quality);
    await AsyncStorage.setItem('videoQuality', quality);
  };

  const saveAutoplay = async (value: boolean) => {
    setAutoplay(value);
    await AsyncStorage.setItem('autoplay', JSON.stringify(value));
  };

  const savePlaybackSpeed = async (speed: string) => {
    setPlaybackSpeed(speed);
    await AsyncStorage.setItem('playbackSpeed', speed);
  };

  const calculateCacheSize = async () => {
    setCacheSize('24.5 MB');
  };

  const clearCache = async () => {
    Alert.alert(
      'Clear Cache',
      'Are you sure you want to clear the cache? This will remove downloaded videos.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            setCacheSize('0 MB');
            Alert.alert('Success', 'Cache cleared successfully');
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your progress, certificates, and data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  const handleSaveProfile = () => {
    if (!editName.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }
    if (editUsername && editUsername.length < 3) {
      Alert.alert('Error', 'Username must be at least 3 characters');
      return;
    }
    Alert.alert('Success', 'Profile updated successfully');
    setShowEditProfile(false);
  };

  const handleChangeEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      Alert.alert('Error', 'Please enter a valid email');
      return;
    }
    Alert.alert('Success', 'Verification email sent to ' + newEmail);
    setShowChangeEmail(false);
    setNewEmail('');
  };

  const handleChangePassword = () => {
    if (newPassword.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    Alert.alert('Success', 'Password changed successfully');
    setShowChangePassword(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleSubmitBugReport = () => {
    if (!bugType || !bugDescription.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    Alert.alert('Success', 'Bug report submitted. Thank you for your feedback!');
    setShowBugReport(false);
    setBugType('');
    setBugDescription('');
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending': return Colors.gray.medium;
      case 'quoted': return Colors.accentYellow;
      case 'in_progress': return Colors.primary;
      case 'completed': return Colors.accentGreen;
      default: return Colors.gray.medium;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'quoted': return 'Quoted';
      case 'in_progress': return 'Building';
      case 'completed': return 'Ready';
      default: return status;
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ACCOUNT</Text>
          <View style={styles.sectionContent}>
            <TouchableOpacity 
              style={styles.profileRow}
              onPress={() => setShowEditProfile(true)}
            >
              <Image
                source={{ uri: user?.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.name || 'User') + '&background=7B68EE&color=fff' }}
                style={styles.profileAvatar}
              />
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{user?.name || 'User'}</Text>
                <Text style={styles.profileUsername}>@{user?.username || 'username'}</Text>
              </View>
              <ChevronRight size={20} color={Colors.text.secondary} />
            </TouchableOpacity>

            <SettingItem
              icon={<Mail size={20} color={Colors.text.secondary} />}
              label="Email"
              value={user?.email || 'user@example.com'}
              onPress={() => setShowChangeEmail(true)}
              showArrow
            />

            <SettingItem
              icon={<Lock size={20} color={Colors.text.secondary} />}
              label="Password"
              value="••••••••"
              onPress={() => setShowChangePassword(true)}
              showArrow
            />

            <SettingItem
              icon={<User size={20} color={Colors.text.secondary} />}
              label="Real Name (for certificates)"
              value={user?.name || 'John Doe'}
              onPress={() => setShowEditProfile(true)}
              showArrow
            />

            <TouchableOpacity 
              style={[styles.settingItem, styles.lastItem]}
              onPress={handleDeleteAccount}
            >
              <View style={styles.settingLeft}>
                <Trash2 size={20} color={Colors.error} />
                <Text style={[styles.settingLabel, { color: Colors.error }]}>Delete Account</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>NOTIFICATIONS</Text>
          <View style={styles.sectionContent}>
            <ToggleItem
              icon={<Bell size={20} color={Colors.text.secondary} />}
              label="Course Updates"
              value={notifications.courseUpdates}
              onToggle={(value) => saveNotificationSetting('courseUpdates', value)}
            />
            <ToggleItem
              icon={<Bell size={20} color={Colors.text.secondary} />}
              label="Streak Reminders"
              value={notifications.streakReminders}
              onToggle={(value) => saveNotificationSetting('streakReminders', value)}
            />
            <ToggleItem
              icon={<Bell size={20} color={Colors.text.secondary} />}
              label="Custom Course Ready"
              value={notifications.customCourseReady}
              onToggle={(value) => saveNotificationSetting('customCourseReady', value)}
            />
            <ToggleItem
              icon={<Bell size={20} color={Colors.text.secondary} />}
              label="Weekly Progress Summary"
              value={notifications.weeklyProgress}
              onToggle={(value) => saveNotificationSetting('weeklyProgress', value)}
            />
            <ToggleItem
              icon={<Bell size={20} color={Colors.text.secondary} />}
              label="Achievement Unlocked"
              value={notifications.achievementUnlocked}
              onToggle={(value) => saveNotificationSetting('achievementUnlocked', value)}
            />
            <ToggleItem
              icon={<Bell size={20} color={Colors.text.secondary} />}
              label="Leaderboard Position Changes"
              value={notifications.leaderboardChanges}
              onToggle={(value) => saveNotificationSetting('leaderboardChanges', value)}
              isLast
            />
          </View>
        </View>

        {/* Quiz Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>QUIZ PREFERENCES</Text>
          <View style={styles.sectionContent}>
            <ToggleItem
              icon={<HelpCircle size={20} color={Colors.text.secondary} />}
              label="Hide All Quizzes"
              value={quizSettings.hideAllQuizzes}
              onToggle={(value) => saveQuizSettings({ ...quizSettings, hideAllQuizzes: value })}
            />
            {quizSettings.hideAllQuizzes && (
              <View style={styles.warningBox}>
                <AlertCircle size={16} color={Colors.warning} />
                <Text style={styles.warningText}>Hiding quizzes disables certificates</Text>
              </View>
            )}
            
            {!quizSettings.hideAllQuizzes && enrolledCourses.map((course, index) => (
              <ToggleItem
                key={course.id}
                icon={<Video size={20} color={Colors.text.secondary} />}
                label={course.title}
                value={!quizSettings.courseQuizSettings[course.id]}
                onToggle={(value) => {
                  const updated = {
                    ...quizSettings,
                    courseQuizSettings: {
                      ...quizSettings.courseQuizSettings,
                      [course.id]: !value,
                    },
                  };
                  saveQuizSettings(updated);
                }}
                isLast={index === enrolledCourses.length - 1}
              />
            ))}
          </View>
        </View>

        {/* Subscription Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SUBSCRIPTION</Text>
          <View style={styles.sectionContent}>
            <View style={styles.subscriptionCard}>
              <View style={styles.subscriptionHeader}>
                <Text style={styles.subscriptionPlan}>
                  {user?.isPremium ? '⭐ Premium' : '🆓 Free Plan'}
                </Text>
                {user?.isPremium && (
                  <Text style={styles.subscriptionExpiry}>Renews Dec 1, 2025</Text>
                )}
              </View>
              <View style={styles.subscriptionFeatures}>
                <Text style={styles.featureText}>
                  • {user?.isPremium ? '5 active courses' : '1 active course'}
                </Text>
                <Text style={styles.featureText}>
                  • {user?.isPremium ? 'Unlimited total courses' : '2 total lifetime courses'}
                </Text>
                <Text style={styles.featureText}>
                  • {user?.isPremium ? 'No ads' : 'Contains ads (future)'}
                </Text>
              </View>
              <TouchableOpacity style={styles.subscriptionButton}>
                <Text style={styles.subscriptionButtonText}>
                  {user?.isPremium ? 'Manage Subscription' : 'Upgrade to Premium'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Past Course Requests */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>YOUR CUSTOM COURSES</Text>
          <View style={styles.sectionContent}>
            {mockCourseRequests.map((request, index) => (
              <TouchableOpacity
                key={request.id}
                style={[styles.courseRequestItem, index === mockCourseRequests.length - 1 && styles.lastItem]}
              >
                <View style={styles.courseRequestInfo}>
                  <Text style={styles.courseRequestTopic}>{request.topic}</Text>
                  <Text style={styles.courseRequestDate}>
                    Requested {request.createdAt.toLocaleDateString()}
                  </Text>
                  <View style={styles.courseRequestMeta}>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusBadgeColor(request.status) }]}>
                      <Text style={styles.statusBadgeText}>{getStatusText(request.status)}</Text>
                    </View>
                    {request.status === 'quoted' && (
                      <Text style={styles.courseRequestPrice}>${request.estimatedPrice}</Text>
                    )}
                  </View>
                </View>
                <ChevronRight size={20} color={Colors.text.secondary} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* App Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PREFERENCES</Text>
          <View style={styles.sectionContent}>
            <SettingItem
              icon={<Video size={20} color={Colors.text.secondary} />}
              label="Video Quality"
              value={videoQuality.charAt(0).toUpperCase() + videoQuality.slice(1)}
              onPress={() => setShowVideoQualityModal(true)}
              showArrow
            />
            <ToggleItem
              icon={<Video size={20} color={Colors.text.secondary} />}
              label="Autoplay"
              value={autoplay}
              onToggle={saveAutoplay}
            />
            <SettingItem
              icon={<Video size={20} color={Colors.text.secondary} />}
              label="Default Playback Speed"
              value={playbackSpeed + 'x'}
              onPress={() => setShowPlaybackSpeedModal(true)}
              showArrow
            />
            <SettingItem
              icon={<Globe size={20} color={Colors.text.secondary} />}
              label="Subtitle Language"
              value={subtitleLanguage}
              onPress={() => Alert.alert('Coming Soon', 'Language selection will be available soon')}
              showArrow
            />
            <SettingItem
              icon={<Trash2 size={20} color={Colors.text.secondary} />}
              label="Clear Cache"
              value={cacheSize}
              onPress={clearCache}
              showArrow
              isLast
            />
          </View>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>HELP & SUPPORT</Text>
          <View style={styles.sectionContent}>
            <SettingItem
              icon={<MessageSquare size={20} color={Colors.text.secondary} />}
              label="Report Bug"
              onPress={() => setShowBugReport(true)}
              showArrow
            />
            <SettingItem
              icon={<HelpCircle size={20} color={Colors.text.secondary} />}
              label="Contact Support"
              onPress={() => Alert.alert('Contact Support', 'Email: support@scrollogy.com')}
              showArrow
            />
            <SettingItem
              icon={<HelpCircle size={20} color={Colors.text.secondary} />}
              label="FAQs"
              onPress={() => Alert.alert('FAQs', 'FAQ section coming soon')}
              showArrow
              isLast
            />
          </View>
        </View>

        {/* Legal Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>LEGAL</Text>
          <View style={styles.sectionContent}>
            <SettingItem
              icon={<FileText size={20} color={Colors.text.secondary} />}
              label="Privacy Policy"
              onPress={() => Alert.alert('Privacy Policy', 'Privacy policy will open here')}
              showArrow
            />
            <SettingItem
              icon={<FileText size={20} color={Colors.text.secondary} />}
              label="Terms of Service"
              onPress={() => Alert.alert('Terms of Service', 'Terms will open here')}
              showArrow
            />
            <SettingItem
              icon={<FileText size={20} color={Colors.text.secondary} />}
              label="Licenses"
              onPress={() => Alert.alert('Licenses', 'Open source licenses')}
              showArrow
              isLast
            />
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color={Colors.error} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        {/* App Version */}
        <Text style={styles.version}>Version 1.0.0</Text>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={showEditProfile}
        animationType="slide"
        transparent
        onRequestClose={() => setShowEditProfile(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setShowEditProfile(false)}>
                <X size={24} color={Colors.text.primary} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.avatarUpload}>
              <Image
                source={{ uri: user?.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.name || 'User') + '&background=7B68EE&color=fff' }}
                style={styles.avatarUploadImage}
              />
              <View style={styles.avatarUploadIcon}>
                <Camera size={20} color={Colors.white} />
              </View>
            </TouchableOpacity>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                style={styles.modalInput}
                value={editName}
                onChangeText={setEditName}
                placeholder="Enter your name"
                placeholderTextColor={Colors.text.secondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Username</Text>
              <TextInput
                style={styles.modalInput}
                value={editUsername}
                onChangeText={setEditUsername}
                placeholder="Enter username"
                placeholderTextColor={Colors.text.secondary}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonSecondary]}
                onPress={() => setShowEditProfile(false)}
              >
                <Text style={styles.modalButtonTextSecondary}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={handleSaveProfile}
              >
                <Text style={styles.modalButtonTextPrimary}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Change Email Modal */}
      <Modal
        visible={showChangeEmail}
        animationType="slide"
        transparent
        onRequestClose={() => setShowChangeEmail(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Change Email</Text>
              <TouchableOpacity onPress={() => setShowChangeEmail(false)}>
                <X size={24} color={Colors.text.primary} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>New Email</Text>
              <TextInput
                style={styles.modalInput}
                value={newEmail}
                onChangeText={setNewEmail}
                placeholder="Enter new email"
                placeholderTextColor={Colors.text.secondary}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonSecondary]}
                onPress={() => setShowChangeEmail(false)}
              >
                <Text style={styles.modalButtonTextSecondary}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={handleChangeEmail}
              >
                <Text style={styles.modalButtonTextPrimary}>Send Verification</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        visible={showChangePassword}
        animationType="slide"
        transparent
        onRequestClose={() => setShowChangePassword(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Change Password</Text>
              <TouchableOpacity onPress={() => setShowChangePassword(false)}>
                <X size={24} color={Colors.text.primary} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Current Password</Text>
              <TextInput
                style={styles.modalInput}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Enter current password"
                placeholderTextColor={Colors.text.secondary}
                secureTextEntry
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>New Password</Text>
              <TextInput
                style={styles.modalInput}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Enter new password"
                placeholderTextColor={Colors.text.secondary}
                secureTextEntry
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Confirm Password</Text>
              <TextInput
                style={styles.modalInput}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm new password"
                placeholderTextColor={Colors.text.secondary}
                secureTextEntry
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonSecondary]}
                onPress={() => setShowChangePassword(false)}
              >
                <Text style={styles.modalButtonTextSecondary}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={handleChangePassword}
              >
                <Text style={styles.modalButtonTextPrimary}>Change Password</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Bug Report Modal */}
      <Modal
        visible={showBugReport}
        animationType="slide"
        transparent
        onRequestClose={() => setShowBugReport(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Report Bug</Text>
              <TouchableOpacity onPress={() => setShowBugReport(false)}>
                <X size={24} color={Colors.text.primary} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Issue Type</Text>
              <View style={styles.bugTypeContainer}>
                {['App Crash', 'Video Issue', 'Quiz Problem', 'Other'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.bugTypeChip,
                      bugType === type && styles.bugTypeChipActive,
                    ]}
                    onPress={() => setBugType(type)}
                  >
                    <Text style={[
                      styles.bugTypeChipText,
                      bugType === type && styles.bugTypeChipTextActive,
                    ]}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.modalInput, styles.textArea]}
                value={bugDescription}
                onChangeText={setBugDescription}
                placeholder="Describe the issue..."
                placeholderTextColor={Colors.text.secondary}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <Text style={styles.deviceInfo}>
              Device: {Platform.OS === 'ios' ? 'iOS' : 'Android'} • App v1.0.0
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonSecondary]}
                onPress={() => setShowBugReport(false)}
              >
                <Text style={styles.modalButtonTextSecondary}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={handleSubmitBugReport}
              >
                <Text style={styles.modalButtonTextPrimary}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Video Quality Modal */}
      <Modal
        visible={showVideoQualityModal}
        animationType="fade"
        transparent
        onRequestClose={() => setShowVideoQualityModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowVideoQualityModal(false)}
        >
          <View style={styles.pickerModal}>
            <Text style={styles.pickerTitle}>Video Quality</Text>
            {(['auto', 'high', 'medium', 'low'] as VideoQuality[]).map((quality) => (
              <TouchableOpacity
                key={quality}
                style={styles.pickerOption}
                onPress={() => {
                  saveVideoQuality(quality);
                  setShowVideoQualityModal(false);
                }}
              >
                <Text style={styles.pickerOptionText}>
                  {quality.charAt(0).toUpperCase() + quality.slice(1)}
                </Text>
                {videoQuality === quality && (
                  <Check size={20} color={Colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Playback Speed Modal */}
      <Modal
        visible={showPlaybackSpeedModal}
        animationType="fade"
        transparent
        onRequestClose={() => setShowPlaybackSpeedModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowPlaybackSpeedModal(false)}
        >
          <View style={styles.pickerModal}>
            <Text style={styles.pickerTitle}>Playback Speed</Text>
            {['0.5', '0.75', '1.0', '1.25', '1.5', '2.0'].map((speed) => (
              <TouchableOpacity
                key={speed}
                style={styles.pickerOption}
                onPress={() => {
                  savePlaybackSpeed(speed);
                  setShowPlaybackSpeedModal(false);
                }}
              >
                <Text style={styles.pickerOptionText}>{speed}x</Text>
                {playbackSpeed === speed && (
                  <Check size={20} color={Colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

type SettingItemProps = {
  icon: React.ReactElement;
  label: string;
  value?: string;
  onPress?: () => void;
  showArrow?: boolean;
  isLast?: boolean;
};

function SettingItem({ icon, label, value, onPress, showArrow, isLast }: SettingItemProps) {
  return (
    <TouchableOpacity
      style={[styles.settingItem, isLast && styles.lastItem]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingLeft}>
        <View>{icon}</View>
        <Text style={styles.settingLabel}>{label}</Text>
      </View>
      <View style={styles.settingRight}>
        {value && <Text style={styles.settingValue}>{value}</Text>}
        {showArrow && <ChevronRight size={20} color={Colors.text.secondary} />}
      </View>
    </TouchableOpacity>
  );
}

type ToggleItemProps = {
  icon: React.ReactElement;
  label: string;
  value: boolean;
  onToggle: (value: boolean) => void;
  isLast?: boolean;
};

function ToggleItem({ icon, label, value, onToggle, isLast }: ToggleItemProps) {
  return (
    <View style={[styles.settingItem, isLast && styles.lastItem]}>
      <View style={styles.settingLeft}>
        <View>{icon}</View>
        <Text style={styles.settingLabel}>{label}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ 
          false: Colors.gray.light, 
          true: Colors.primary + '50' 
        }}
        thumbColor={value ? Colors.primary : Colors.gray.medium}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray.light,
  },
  backButton: {
    padding: Layout.spacing.xs,
  },
  headerTitle: {
    fontSize: Layout.fontSize.lg,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  headerSpacer: {
    width: 40,
  },
  section: {
    marginTop: Layout.spacing.lg,
  },
  sectionTitle: {
    fontSize: Layout.fontSize.xs,
    fontWeight: '600',
    color: Colors.text.secondary,
    paddingHorizontal: Layout.spacing.lg,
    paddingBottom: Layout.spacing.sm,
  },
  sectionContent: {
    backgroundColor: Colors.white,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray.lightest,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.gray.light,
  },
  profileInfo: {
    flex: 1,
    marginLeft: Layout.spacing.md,
  },
  profileName: {
    fontSize: Layout.fontSize.lg,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  profileUsername: {
    fontSize: Layout.fontSize.sm,
    color: Colors.text.secondary,
    marginTop: Layout.spacing.xs,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray.lightest,
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.md,
    flex: 1,
  },
  settingLabel: {
    fontSize: Layout.fontSize.md,
    color: Colors.text.primary,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.sm,
  },
  settingValue: {
    fontSize: Layout.fontSize.sm,
    color: Colors.text.secondary,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.sm,
    backgroundColor: Colors.warning + '20',
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray.lightest,
  },
  warningText: {
    fontSize: Layout.fontSize.sm,
    color: Colors.warning,
    fontWeight: '600',
  },
  subscriptionCard: {
    padding: Layout.spacing.lg,
  },
  subscriptionHeader: {
    marginBottom: Layout.spacing.md,
  },
  subscriptionPlan: {
    fontSize: Layout.fontSize.lg,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: Layout.spacing.xs,
  },
  subscriptionExpiry: {
    fontSize: Layout.fontSize.sm,
    color: Colors.text.secondary,
  },
  subscriptionFeatures: {
    marginBottom: Layout.spacing.md,
  },
  featureText: {
    fontSize: Layout.fontSize.sm,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.xs,
  },
  subscriptionButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.medium,
    alignItems: 'center',
  },
  subscriptionButtonText: {
    fontSize: Layout.fontSize.md,
    fontWeight: '600',
    color: Colors.white,
  },
  courseRequestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray.lightest,
  },
  courseRequestInfo: {
    flex: 1,
  },
  courseRequestTopic: {
    fontSize: Layout.fontSize.md,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: Layout.spacing.xs,
  },
  courseRequestDate: {
    fontSize: Layout.fontSize.sm,
    color: Colors.text.secondary,
    marginBottom: Layout.spacing.xs,
  },
  courseRequestMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: 2,
    borderRadius: Layout.borderRadius.small,
  },
  statusBadgeText: {
    fontSize: Layout.fontSize.xs,
    fontWeight: '600',
    color: Colors.white,
  },
  courseRequestPrice: {
    fontSize: Layout.fontSize.sm,
    fontWeight: 'bold',
    color: Colors.accentGreen,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Layout.spacing.sm,
    backgroundColor: Colors.white,
    marginHorizontal: Layout.spacing.lg,
    marginVertical: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
    borderRadius: Layout.borderRadius.medium,
  },
  logoutText: {
    fontSize: Layout.fontSize.md,
    color: Colors.error,
    fontWeight: '600',
  },
  version: {
    textAlign: 'center',
    fontSize: Layout.fontSize.xs,
    color: Colors.text.secondary,
    marginBottom: Layout.spacing.xl,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.large,
    padding: Layout.spacing.lg,
    width: '90%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.lg,
  },
  modalTitle: {
    fontSize: Layout.fontSize.xl,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  avatarUpload: {
    alignSelf: 'center',
    marginBottom: Layout.spacing.lg,
    position: 'relative',
  },
  avatarUploadImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.gray.light,
  },
  avatarUploadIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.white,
  },
  inputGroup: {
    marginBottom: Layout.spacing.md,
  },
  inputLabel: {
    fontSize: Layout.fontSize.sm,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: Layout.spacing.xs,
  },
  modalInput: {
    backgroundColor: Colors.gray.lightest,
    borderRadius: Layout.borderRadius.medium,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    fontSize: Layout.fontSize.md,
    color: Colors.text.primary,
  },
  textArea: {
    height: 100,
    paddingTop: Layout.spacing.sm,
  },
  bugTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Layout.spacing.sm,
  },
  bugTypeChip: {
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.medium,
    borderWidth: 1,
    borderColor: Colors.gray.light,
    backgroundColor: Colors.white,
  },
  bugTypeChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  bugTypeChipText: {
    fontSize: Layout.fontSize.sm,
    color: Colors.text.primary,
  },
  bugTypeChipTextActive: {
    color: Colors.white,
    fontWeight: '600',
  },
  deviceInfo: {
    fontSize: Layout.fontSize.xs,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: Layout.spacing.md,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: Layout.spacing.sm,
  },
  modalButton: {
    flex: 1,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.medium,
    alignItems: 'center',
  },
  modalButtonSecondary: {
    backgroundColor: Colors.gray.lightest,
  },
  modalButtonPrimary: {
    backgroundColor: Colors.primary,
  },
  modalButtonTextSecondary: {
    fontSize: Layout.fontSize.md,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  modalButtonTextPrimary: {
    fontSize: Layout.fontSize.md,
    fontWeight: '600',
    color: Colors.white,
  },
  pickerModal: {
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.large,
    padding: Layout.spacing.md,
    width: '80%',
    maxWidth: 300,
  },
  pickerTitle: {
    fontSize: Layout.fontSize.lg,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: Layout.spacing.md,
    textAlign: 'center',
  },
  pickerOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Layout.spacing.md,
    paddingHorizontal: Layout.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray.lightest,
  },
  pickerOptionText: {
    fontSize: Layout.fontSize.md,
    color: Colors.text.primary,
  },
});
