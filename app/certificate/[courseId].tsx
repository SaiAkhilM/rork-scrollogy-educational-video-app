import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Share,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Download, Share2, ArrowRight } from 'lucide-react-native';
import Colors from '@/constants/colors';
import Layout from '@/constants/layout';
import { useUser } from '@/hooks/useUser';

export default function CertificateScreen() {
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  const router = useRouter();
  const { user } = useUser();
  
  const confettiAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const mockCertificate = {
    id: 'cert-001',
    courseId: courseId || '1',
    courseName: 'Animals That Could Kill You',
    userId: user?.id || '1',
    userName: user?.name || 'John Doe',
    earnedAt: new Date(),
    pointsEarned: 1270,
    certificateNumber: `SCRL-${Date.now().toString().slice(-8)}`,
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(confettiAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, [confettiAnim, scaleAnim, fadeAnim]);

  const handleDownload = () => {
    console.log('Download certificate');
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `I just completed "${mockCertificate.courseName}" on Scrollogy and earned ${mockCertificate.pointsEarned} points! 🎉`,
        title: 'Certificate of Completion',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleContinue = () => {
    router.push('/(tabs)/dashboard');
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Certificate',
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
        {/* Confetti Effect */}
        <Animated.View
          style={[
            styles.confettiContainer,
            {
              opacity: confettiAnim,
            },
          ]}
        >
          {Array.from({ length: 50 }).map((_, i) => (
            <Animated.View
              key={i}
              style={[
                styles.confetti,
                {
                  left: `${Math.random() * 100}%`,
                  backgroundColor: [
                    Colors.accentYellow,
                    Colors.accentOrange,
                    Colors.accentGreen,
                    Colors.primary,
                    Colors.accentPink,
                  ][i % 5],
                  transform: [
                    {
                      translateY: confettiAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-100, 800],
                      }),
                    },
                    {
                      rotate: confettiAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', `${Math.random() * 720}deg`],
                      }),
                    },
                  ],
                },
              ]}
            />
          ))}
        </Animated.View>

        {/* Content */}
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Text style={styles.congratsTitle}>Congratulations! 🎉</Text>
          <Text style={styles.subtitle}>You&apos;ve earned your certificate</Text>

          {/* Certificate */}
          <View style={styles.certificate}>
            <View style={styles.certificateBorder}>
              <View style={styles.certificateInner}>
                <Text style={styles.certificateTitle}>Certificate of Completion</Text>
                <View style={styles.divider} />
                <Text style={styles.userName}>{mockCertificate.userName}</Text>
                <Text style={styles.completionText}>Has successfully completed all modules in</Text>
                <Text style={styles.courseName}>{mockCertificate.courseName}</Text>
                <View style={styles.certificateFooter}>
                  <View style={styles.footerItem}>
                    <Text style={styles.footerLabel}>Date</Text>
                    <Text style={styles.footerValue}>
                      {mockCertificate.earnedAt.toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={styles.footerItem}>
                    <Text style={styles.footerLabel}>Points Earned</Text>
                    <Text style={styles.footerValue}>{mockCertificate.pointsEarned}</Text>
                  </View>
                </View>
                <Text style={styles.certificateNumber}>
                  Certificate ID: {mockCertificate.certificateNumber}
                </Text>
                <View style={styles.seal}>
                  <Text style={styles.sealText}>🏆</Text>
                  <Text style={styles.sealLabel}>Scrollogy</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.secondaryButton} onPress={handleDownload}>
              <Download color={Colors.primary} size={20} />
              <Text style={styles.secondaryButtonText}>Download</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress={handleShare}>
              <Share2 color={Colors.primary} size={20} />
              <Text style={styles.secondaryButtonText}>Share</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.primaryButton} onPress={handleContinue}>
            <Text style={styles.primaryButtonText}>Continue Learning</Text>
            <ArrowRight color={Colors.white} size={20} />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  confettiContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
    pointerEvents: 'none',
  },
  confetti: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  content: {
    flex: 1,
    padding: Layout.spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  congratsTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: Layout.spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Layout.fontSize.lg,
    color: Colors.text.secondary,
    marginBottom: Layout.spacing.xl,
    textAlign: 'center',
  },
  certificate: {
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.large,
    padding: Layout.spacing.md,
    marginBottom: Layout.spacing.xl,
    ...Colors.shadows.medium,
  },
  certificateBorder: {
    borderWidth: 4,
    borderColor: Colors.primary,
    borderRadius: Layout.borderRadius.medium,
    padding: Layout.spacing.lg,
  },
  certificateInner: {
    alignItems: 'center',
  },
  certificateTitle: {
    fontSize: Layout.fontSize.xl,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: Layout.spacing.md,
    textAlign: 'center',
  },
  divider: {
    width: 60,
    height: 3,
    backgroundColor: Colors.accentYellow,
    marginBottom: Layout.spacing.lg,
  },
  userName: {
    fontSize: Layout.fontSize.xxl,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: Layout.spacing.sm,
    textAlign: 'center',
  },
  completionText: {
    fontSize: Layout.fontSize.sm,
    color: Colors.text.secondary,
    marginBottom: Layout.spacing.xs,
    textAlign: 'center',
  },
  courseName: {
    fontSize: Layout.fontSize.lg,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: Layout.spacing.lg,
    textAlign: 'center',
  },
  certificateFooter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: Layout.spacing.md,
    paddingTop: Layout.spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.gray.light,
  },
  footerItem: {
    alignItems: 'center',
  },
  footerLabel: {
    fontSize: Layout.fontSize.xs,
    color: Colors.text.secondary,
    marginBottom: Layout.spacing.xs,
  },
  footerValue: {
    fontSize: Layout.fontSize.md,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  certificateNumber: {
    fontSize: Layout.fontSize.xs,
    color: Colors.text.secondary,
    marginBottom: Layout.spacing.md,
  },
  seal: {
    alignItems: 'center',
  },
  sealText: {
    fontSize: 40,
  },
  sealLabel: {
    fontSize: Layout.fontSize.sm,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  actions: {
    flexDirection: 'row',
    gap: Layout.spacing.md,
    marginBottom: Layout.spacing.lg,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.xs,
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
    borderRadius: Layout.borderRadius.medium,
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.primary,
    ...Colors.shadows.small,
  },
  secondaryButtonText: {
    fontSize: Layout.fontSize.md,
    fontWeight: '600',
    color: Colors.primary,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.sm,
    paddingHorizontal: Layout.spacing.xl,
    paddingVertical: Layout.spacing.md,
    borderRadius: Layout.borderRadius.medium,
    backgroundColor: Colors.primary,
    ...Colors.shadows.medium,
  },
  primaryButtonText: {
    fontSize: Layout.fontSize.lg,
    fontWeight: 'bold',
    color: Colors.white,
  },
});
