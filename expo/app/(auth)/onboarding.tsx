import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { 
  Camera, 
  ChevronRight, 
  Check, 
  Star, 
  Award, 
  Target,
  Zap,
  Crown,
  Gift
} from "lucide-react-native";
import Colors from "@/constants/colors";
import Layout from "@/constants/layout";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

interface Interest {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<"free" | "premium" | null>(null);

  const interests: Interest[] = [
    { id: "nature", name: "Nature", icon: "🦁", color: Colors.accentGreen },
    { id: "technology", name: "Technology", icon: "💻", color: Colors.accentBlue },
    { id: "skills", name: "Skills", icon: "🧠", color: Colors.primary },
    { id: "history", name: "History", icon: "⚔️", color: Colors.accentOrange },
    { id: "science", name: "Science", icon: "🚀", color: Colors.accentBlue },
    { id: "arts", name: "Arts & Culture", icon: "🎨", color: Colors.accentPink },
    { id: "business", name: "Business", icon: "💼", color: Colors.accentYellow },
    { id: "health", name: "Health & Wellness", icon: "💪", color: Colors.accentGreen },
  ];

  const toggleInterest = (interestId: string) => {
    setSelectedInterests(prev => 
      prev.includes(interestId)
        ? prev.filter(id => id !== interestId)
        : [...prev, interestId]
    );
  };

  const handleNext = async () => {
    if (currentStep === 2 && selectedInterests.length < 3) {
      Alert.alert("Select Interests", "Please select at least 3 interests to continue.");
      return;
    }

    if (currentStep === 5) {
      // Complete onboarding
      await AsyncStorage.setItem("onboardingCompleted", "true");
      router.replace("/(tabs)/dashboard");
      return;
    }

    setCurrentStep(prev => prev + 1);
  };

  const handleSkip = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
    }
  };

  const renderProgressDots = () => (
    <View style={styles.progressContainer}>
      {[1, 2, 3, 4, 5].map((step) => (
        <View
          key={step}
          style={[
            styles.progressDot,
            step <= currentStep && styles.progressDotActive,
          ]}
        />
      ))}
    </View>
  );

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Welcome Alex! 👋</Text>
      <Text style={styles.stepSubtitle}>Let&apos;s set up your profile</Text>
      
      <View style={styles.profileSection}>
        <TouchableOpacity style={styles.avatarContainer}>
          <View style={styles.avatarPlaceholder}>
            <Camera size={32} color={Colors.white} />
          </View>
          <Text style={styles.avatarText}>Add Photo</Text>
        </TouchableOpacity>
        
        <View style={styles.usernameSection}>
          <Text style={styles.usernameLabel}>Username</Text>
          <Text style={styles.username}>@alex_learner</Text>
          <TouchableOpacity>
            <Text style={styles.editLink}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipButtonText}>Skip for now</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryButton} onPress={handleNext}>
          <Text style={styles.primaryButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>What do you want to learn? 🎯</Text>
      <Text style={styles.stepSubtitle}>
        Select at least 3 topics that interest you
      </Text>
      
      <Text style={styles.counterText}>
        {selectedInterests.length}/3 selected
      </Text>

      <View style={styles.interestsGrid}>
        {interests.map((interest) => (
          <TouchableOpacity
            key={interest.id}
            style={[
              styles.interestChip,
              selectedInterests.includes(interest.id) && styles.interestChipSelected,
            ]}
            onPress={() => toggleInterest(interest.id)}
          >
            <Text style={styles.interestIcon}>{interest.icon}</Text>
            <Text style={[
              styles.interestText,
              selectedInterests.includes(interest.id) && styles.interestTextSelected,
            ]}>
              {interest.name}
            </Text>
            {selectedInterests.includes(interest.id) && (
              <Check size={16} color={Colors.white} />
            )}
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity 
        style={[
          styles.primaryButton,
          selectedInterests.length < 3 && styles.buttonDisabled
        ]} 
        onPress={handleNext}
        disabled={selectedInterests.length < 3}
      >
        <Text style={styles.primaryButtonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Choose Your Plan 💎</Text>
      <Text style={styles.stepSubtitle}>
        Start learning with the plan that fits you
      </Text>

      <View style={styles.plansContainer}>
        {/* Free Plan */}
        <TouchableOpacity
          style={[
            styles.planCard,
            selectedPlan === "free" && styles.planCardSelected,
          ]}
          onPress={() => setSelectedPlan("free")}
        >
          <View style={styles.planHeader}>
            <Text style={styles.planName}>Free</Text>
            <Text style={styles.planPrice}>$0</Text>
          </View>
          <View style={styles.planFeatures}>
            <View style={styles.planFeature}>
              <Check size={16} color={Colors.accentGreen} />
              <Text style={styles.planFeatureText}>1 active course</Text>
            </View>
            <View style={styles.planFeature}>
              <Check size={16} color={Colors.accentGreen} />
              <Text style={styles.planFeatureText}>2 total lifetime courses</Text>
            </View>
            <View style={styles.planFeature}>
              <Check size={16} color={Colors.gray.medium} />
              <Text style={[styles.planFeatureText, styles.planFeatureDisabled]}>
                Contains ads (future)
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Premium Plan */}
        <TouchableOpacity
          style={[
            styles.planCard,
            styles.premiumCard,
            selectedPlan === "premium" && styles.planCardSelected,
          ]}
          onPress={() => setSelectedPlan("premium")}
        >
          <View style={styles.premiumBadge}>
            <Crown size={16} color={Colors.accentYellow} />
            <Text style={styles.premiumBadgeText}>7-day free trial</Text>
          </View>
          <View style={styles.planHeader}>
            <Text style={styles.planName}>Premium</Text>
            <Text style={styles.planPrice}>$9.99/mo</Text>
          </View>
          <View style={styles.planFeatures}>
            <View style={styles.planFeature}>
              <Check size={16} color={Colors.accentGreen} />
              <Text style={styles.planFeatureText}>5 active courses</Text>
            </View>
            <View style={styles.planFeature}>
              <Check size={16} color={Colors.accentGreen} />
              <Text style={styles.planFeatureText}>Unlimited total courses</Text>
            </View>
            <View style={styles.planFeature}>
              <Check size={16} color={Colors.accentGreen} />
              <Text style={styles.planFeatureText}>No ads</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      <Text style={styles.upgradeNote}>You can always upgrade later</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.secondaryButton} 
          onPress={() => {
            setSelectedPlan("free");
            handleNext();
          }}
        >
          <Text style={styles.secondaryButtonText}>Start Free</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.primaryButton} 
          onPress={() => {
            setSelectedPlan("premium");
            handleNext();
          }}
        >
          <Text style={styles.primaryButtonText}>Try Premium</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.certificateIcon}>
        <Award size={64} color={Colors.accentYellow} />
      </View>
      
      <Text style={styles.stepTitle}>Earn Real Certificates! 🏆</Text>
      <Text style={styles.stepSubtitle}>
        Complete courses and showcase your achievements
      </Text>

      <View style={styles.certificateFeatures}>
        <View style={styles.certificateFeature}>
          <Target size={20} color={Colors.primary} />
          <Text style={styles.certificateFeatureText}>Watch 100% of videos</Text>
        </View>
        <View style={styles.certificateFeature}>
          <Zap size={20} color={Colors.primary} />
          <Text style={styles.certificateFeatureText}>Answer all quizzes correctly</Text>
        </View>
        <View style={styles.certificateFeature}>
          <Gift size={20} color={Colors.primary} />
          <Text style={styles.certificateFeatureText}>Unlimited retries available</Text>
        </View>
        <View style={styles.certificateFeature}>
          <Star size={20} color={Colors.primary} />
          <Text style={styles.certificateFeatureText}>Share your achievements</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={handleNext}>
        <Text style={styles.primaryButtonText}>I understand</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStep5 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.celebrationEmoji}>🎉</Text>
      <Text style={styles.stepTitle}>You&apos;re all set!</Text>
      <Text style={styles.stepSubtitle}>
        Here&apos;s a quick tour of what you can do
      </Text>

      <View style={styles.tutorialPoints}>
        <View style={styles.tutorialPoint}>
          <View style={styles.tutorialIcon}>
            <Text>🔍</Text>
          </View>
          <View style={styles.tutorialContent}>
            <Text style={styles.tutorialTitle}>Explore Tab</Text>
            <Text style={styles.tutorialDescription}>
              Discover new courses and trending content
            </Text>
          </View>
        </View>

        <View style={styles.tutorialPoint}>
          <View style={styles.tutorialIcon}>
            <Text>⚡</Text>
          </View>
          <View style={styles.tutorialContent}>
            <Text style={styles.tutorialTitle}>Earn Points</Text>
            <Text style={styles.tutorialDescription}>
              Complete videos and quizzes to level up
            </Text>
          </View>
        </View>

        <View style={styles.tutorialPoint}>
          <View style={styles.tutorialIcon}>
            <Text>🦁</Text>
          </View>
          <View style={styles.tutorialContent}>
            <Text style={styles.tutorialTitle}>Your First Course</Text>
            <Text style={styles.tutorialDescription}>
              &quot;Animals That Could Kill You&quot; is ready for you!
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={handleNext}>
        <Text style={styles.primaryButtonText}>Start Learning! 🚀</Text>
      </TouchableOpacity>
    </View>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      case 5:
        return renderStep5();
      default:
        return renderStep1();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {renderProgressDots()}
          {renderCurrentStep()}
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
  content: {
    paddingHorizontal: Layout.spacing.xl,
    paddingVertical: Layout.spacing.xl,
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Layout.spacing.xl,
    gap: Layout.spacing.sm,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.gray.light,
  },
  progressDotActive: {
    backgroundColor: Colors.primary,
    width: 24,
  },
  stepContainer: {
    alignItems: "center",
    minHeight: 500,
  },
  stepTitle: {
    fontSize: Layout.fontSize.xxl,
    fontWeight: "bold",
    color: Colors.text.primary,
    textAlign: "center",
    marginBottom: Layout.spacing.sm,
  },
  stepSubtitle: {
    fontSize: Layout.fontSize.lg,
    color: Colors.text.secondary,
    textAlign: "center",
    marginBottom: Layout.spacing.xl,
    lineHeight: 24,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: Layout.spacing.xl * 2,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: Layout.spacing.lg,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.gray.medium,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Layout.spacing.sm,
  },
  avatarText: {
    fontSize: Layout.fontSize.md,
    color: Colors.primary,
    fontWeight: "600",
  },
  usernameSection: {
    alignItems: "center",
  },
  usernameLabel: {
    fontSize: Layout.fontSize.sm,
    color: Colors.text.secondary,
    marginBottom: Layout.spacing.xs,
  },
  username: {
    fontSize: Layout.fontSize.lg,
    color: Colors.text.primary,
    fontWeight: "600",
    marginBottom: Layout.spacing.xs,
  },
  editLink: {
    fontSize: Layout.fontSize.sm,
    color: Colors.primary,
    fontWeight: "600",
  },
  counterText: {
    fontSize: Layout.fontSize.md,
    color: Colors.text.secondary,
    marginBottom: Layout.spacing.lg,
    fontWeight: "600",
  },
  interestsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: Layout.spacing.sm,
    marginBottom: Layout.spacing.xl * 2,
  },
  interestChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.large,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    borderWidth: 2,
    borderColor: Colors.gray.light,
    gap: Layout.spacing.xs,
    ...Colors.shadows.small,
  },
  interestChipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  interestIcon: {
    fontSize: 20,
  },
  interestText: {
    fontSize: Layout.fontSize.sm,
    color: Colors.text.primary,
    fontWeight: "600",
  },
  interestTextSelected: {
    color: Colors.white,
  },
  plansContainer: {
    width: "100%",
    gap: Layout.spacing.lg,
    marginBottom: Layout.spacing.lg,
  },
  planCard: {
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.large,
    padding: Layout.spacing.lg,
    borderWidth: 2,
    borderColor: Colors.gray.light,
    ...Colors.shadows.medium,
  },
  premiumCard: {
    borderColor: Colors.primary,
    position: "relative",
  },
  planCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + "10",
  },
  premiumBadge: {
    position: "absolute",
    top: -10,
    right: Layout.spacing.lg,
    backgroundColor: Colors.accentYellow,
    borderRadius: Layout.borderRadius.medium,
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: Layout.spacing.xs,
    flexDirection: "row",
    alignItems: "center",
    gap: Layout.spacing.xs,
  },
  premiumBadgeText: {
    fontSize: Layout.fontSize.xs,
    color: Colors.white,
    fontWeight: "bold",
  },
  planHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Layout.spacing.md,
  },
  planName: {
    fontSize: Layout.fontSize.xl,
    fontWeight: "bold",
    color: Colors.text.primary,
  },
  planPrice: {
    fontSize: Layout.fontSize.lg,
    fontWeight: "bold",
    color: Colors.primary,
  },
  planFeatures: {
    gap: Layout.spacing.sm,
  },
  planFeature: {
    flexDirection: "row",
    alignItems: "center",
    gap: Layout.spacing.sm,
  },
  planFeatureText: {
    fontSize: Layout.fontSize.md,
    color: Colors.text.primary,
  },
  planFeatureDisabled: {
    color: Colors.text.secondary,
    textDecorationLine: "line-through",
  },
  upgradeNote: {
    fontSize: Layout.fontSize.sm,
    color: Colors.text.secondary,
    textAlign: "center",
    marginBottom: Layout.spacing.xl,
    fontStyle: "italic",
  },
  certificateIcon: {
    marginBottom: Layout.spacing.xl,
  },
  certificateFeatures: {
    width: "100%",
    gap: Layout.spacing.lg,
    marginBottom: Layout.spacing.xl * 2,
  },
  certificateFeature: {
    flexDirection: "row",
    alignItems: "center",
    gap: Layout.spacing.md,
    paddingHorizontal: Layout.spacing.lg,
  },
  certificateFeatureText: {
    fontSize: Layout.fontSize.lg,
    color: Colors.text.primary,
    fontWeight: "500",
  },
  celebrationEmoji: {
    fontSize: 80,
    marginBottom: Layout.spacing.lg,
  },
  tutorialPoints: {
    width: "100%",
    gap: Layout.spacing.xl,
    marginBottom: Layout.spacing.xl * 2,
  },
  tutorialPoint: {
    flexDirection: "row",
    alignItems: "center",
    gap: Layout.spacing.lg,
  },
  tutorialIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary + "20",
    justifyContent: "center",
    alignItems: "center",
  },
  tutorialContent: {
    flex: 1,
  },
  tutorialTitle: {
    fontSize: Layout.fontSize.lg,
    fontWeight: "bold",
    color: Colors.text.primary,
    marginBottom: Layout.spacing.xs,
  },
  tutorialDescription: {
    fontSize: Layout.fontSize.md,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: Layout.spacing.md,
    width: "100%",
  },
  primaryButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: Layout.borderRadius.medium,
    paddingVertical: Layout.spacing.md,
    alignItems: "center",
    ...Colors.shadows.medium,
  },
  primaryButtonText: {
    fontSize: Layout.fontSize.lg,
    fontWeight: "bold",
    color: Colors.white,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.medium,
    paddingVertical: Layout.spacing.md,
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  secondaryButtonText: {
    fontSize: Layout.fontSize.lg,
    fontWeight: "bold",
    color: Colors.primary,
  },
  skipButton: {
    flex: 1,
    backgroundColor: "transparent",
    borderRadius: Layout.borderRadius.medium,
    paddingVertical: Layout.spacing.md,
    alignItems: "center",
  },
  skipButtonText: {
    fontSize: Layout.fontSize.lg,
    fontWeight: "600",
    color: Colors.text.secondary,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});