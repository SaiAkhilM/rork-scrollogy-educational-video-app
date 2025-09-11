import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { 
  User, 
  Bell, 
  Shield, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  Moon,
  Globe,
  Download
} from "lucide-react-native";
import Colors from "@/constants/colors";
import Layout from "@/constants/layout";
import { useUser } from "@/hooks/useUser";

type SettingItemBase = {
  icon: React.ReactElement;
  label: string;
};

type ToggleSettingItem = SettingItemBase & {
  toggle: true;
  value: boolean;
  onToggle: (value: boolean) => void;
};

type ActionSettingItem = SettingItemBase & {
  onPress: () => void;
  showArrow: boolean;
  value?: string;
};

type SettingItem = ToggleSettingItem | ActionSettingItem;

type SettingSection = {
  title: string;
  items: SettingItem[];
};

export default function SettingsScreen() {
  const router = useRouter();
  const { user, logout } = useUser();
  const [notifications, setNotifications] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);
  const [downloadOnWifi, setDownloadOnWifi] = React.useState(true);

  const handleLogout = () => {
    logout();
    router.replace("/(auth)/login");
  };

  const settingSections: SettingSection[] = [
    {
      title: 'Account',
      items: [
        {
          icon: <User size={20} color={Colors.text.secondary} />,
          label: 'Edit Profile',
          onPress: () => console.log('Edit Profile'),
          showArrow: true,
        },
        {
          icon: <Shield size={20} color={Colors.text.secondary} />,
          label: 'Privacy & Security',
          onPress: () => console.log('Privacy'),
          showArrow: true,
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          icon: <Bell size={20} color={Colors.text.secondary} />,
          label: 'Push Notifications',
          toggle: true,
          value: notifications,
          onToggle: setNotifications,
        },
        {
          icon: <Moon size={20} color={Colors.text.secondary} />,
          label: 'Dark Mode',
          toggle: true,
          value: darkMode,
          onToggle: setDarkMode,
        },
        {
          icon: <Download size={20} color={Colors.text.secondary} />,
          label: 'Download on Wi-Fi Only',
          toggle: true,
          value: downloadOnWifi,
          onToggle: setDownloadOnWifi,
        },
        {
          icon: <Globe size={20} color={Colors.text.secondary} />,
          label: 'Language',
          onPress: () => console.log('Language'),
          showArrow: true,
          value: 'English',
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: <HelpCircle size={20} color={Colors.text.secondary} />,
          label: 'Help Center',
          onPress: () => console.log('Help'),
          showArrow: true,
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* User Info */}
        <View style={styles.userSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
          <Text style={styles.userName}>{user?.name || 'User'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
        </View>

        {/* Settings Sections */}
        {settingSections.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={itemIndex}
                  style={[
                    styles.settingItem,
                    itemIndex === section.items.length - 1 && styles.lastItem
                  ]}
                  onPress={'onPress' in item ? item.onPress : undefined}
                  disabled={'toggle' in item}
                >
                  <View style={styles.settingLeft}>
                    {item.icon}
                    <Text style={styles.settingLabel}>{item.label}</Text>
                  </View>
                  <View style={styles.settingRight}>
                    {'value' in item && typeof item.value === 'string' && (
                      <Text style={styles.settingValue}>{item.value}</Text>
                    )}
                    {'toggle' in item ? (
                      <Switch
                        value={item.value}
                        onValueChange={item.onToggle}
                        trackColor={{ 
                          false: Colors.gray.light, 
                          true: Colors.primary + '50' 
                        }}
                        thumbColor={item.value ? Colors.primary : Colors.gray.medium}
                      />
                    ) : ('showArrow' in item && item.showArrow) ? (
                      <ChevronRight size={20} color={Colors.text.secondary} />
                    ) : null}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color={Colors.error} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        {/* App Version */}
        <Text style={styles.version}>Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray.lightest,
  },
  userSection: {
    backgroundColor: Colors.white,
    alignItems: 'center',
    paddingVertical: Layout.spacing.xl,
    marginBottom: Layout.spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  avatarText: {
    fontSize: 32,
    color: Colors.white,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: Layout.fontSize.xl,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: Layout.spacing.xs,
  },
  userEmail: {
    fontSize: Layout.fontSize.sm,
    color: Colors.text.secondary,
  },
  section: {
    marginBottom: Layout.spacing.md,
  },
  sectionTitle: {
    fontSize: Layout.fontSize.sm,
    fontWeight: '600',
    color: Colors.text.secondary,
    textTransform: 'uppercase',
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.sm,
  },
  sectionContent: {
    backgroundColor: Colors.white,
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
});