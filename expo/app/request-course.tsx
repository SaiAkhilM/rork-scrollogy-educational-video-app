import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Coins, Info } from 'lucide-react-native';
import Colors from '@/constants/colors';
import Layout from '@/constants/layout';
import { useUser } from '@/hooks/useUser';

type DepthType = 'mini' | 'standard' | 'deep';

export default function RequestCourseScreen() {
  const router = useRouter();
  const { user } = useUser();
  const [topic, setTopic] = useState('');
  const [depth, setDepth] = useState<DepthType>('standard');
  const [learningGoals, setLearningGoals] = useState('');
  const [moduleSuggestions, setModuleSuggestions] = useState('');
  const [pointsToRedeem, setPointsToRedeem] = useState(0);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const depthOptions = [
    {
      id: 'mini' as DepthType,
      name: 'Mini Course',
      videos: '10-20 videos',
      price: 99,
      description: 'Quick overview of the topic',
    },
    {
      id: 'standard' as DepthType,
      name: 'Standard Course',
      videos: '30-50 videos',
      price: 249,
      description: 'Comprehensive coverage',
    },
    {
      id: 'deep' as DepthType,
      name: 'Deep Dive',
      videos: '60-100 videos',
      price: 499,
      description: 'Expert-level mastery',
    },
  ];

  const selectedDepthOption = depthOptions.find((opt) => opt.id === depth);
  const basePrice = selectedDepthOption?.price || 0;
  const maxPointsDiscount = Math.min(user?.points || 0, basePrice * 0.5);
  const finalPrice = basePrice - pointsToRedeem;

  const handlePointsChange = (value: string) => {
    const numValue = parseInt(value) || 0;
    if (numValue <= maxPointsDiscount) {
      setPointsToRedeem(numValue);
    }
  };

  const handleSubmit = () => {
    if (!topic.trim()) {
      Alert.alert('Error', 'Please enter a topic');
      return;
    }
    if (!learningGoals.trim()) {
      Alert.alert('Error', 'Please describe your learning goals');
      return;
    }
    if (!agreedToTerms) {
      Alert.alert('Error', 'Please agree to the IP terms');
      return;
    }

    Alert.alert(
      'Request Submitted! 🎉',
      `We'll review your request and send you a quote within 24 hours. Check your email for updates.`,
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Request Custom Course',
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          headerTintColor: Colors.white,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Topic Input */}
          <View style={styles.section}>
            <Text style={styles.label}>Course Topic *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Advanced Quantum Physics"
              placeholderTextColor={Colors.text.secondary}
              value={topic}
              onChangeText={setTopic}
            />
          </View>

          {/* Depth Selector */}
          <View style={styles.section}>
            <Text style={styles.label}>Course Depth *</Text>
            <View style={styles.depthOptions}>
              {depthOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.depthOption,
                    depth === option.id && styles.depthOptionActive,
                  ]}
                  onPress={() => setDepth(option.id)}
                >
                  <Text
                    style={[
                      styles.depthName,
                      depth === option.id && styles.depthNameActive,
                    ]}
                  >
                    {option.name}
                  </Text>
                  <Text
                    style={[
                      styles.depthVideos,
                      depth === option.id && styles.depthVideosActive,
                    ]}
                  >
                    {option.videos}
                  </Text>
                  <Text
                    style={[
                      styles.depthPrice,
                      depth === option.id && styles.depthPriceActive,
                    ]}
                  >
                    ${option.price}
                  </Text>
                  <Text
                    style={[
                      styles.depthDescription,
                      depth === option.id && styles.depthDescriptionActive,
                    ]}
                  >
                    {option.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Learning Goals */}
          <View style={styles.section}>
            <Text style={styles.label}>Learning Goals *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="What do you want to learn from this course?"
              placeholderTextColor={Colors.text.secondary}
              value={learningGoals}
              onChangeText={setLearningGoals}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Module Suggestions */}
          <View style={styles.section}>
            <Text style={styles.label}>Module Suggestions (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Suggest specific modules or topics to cover"
              placeholderTextColor={Colors.text.secondary}
              value={moduleSuggestions}
              onChangeText={setModuleSuggestions}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Points Redemption */}
          <View style={styles.section}>
            <View style={styles.pointsHeader}>
              <Text style={styles.label}>Redeem Points</Text>
              <View style={styles.availablePoints}>
                <Coins color={Colors.accentYellow} size={16} />
                <Text style={styles.availablePointsText}>
                  {user?.points || 0} available
                </Text>
              </View>
            </View>
            <View style={styles.pointsInputContainer}>
              <TextInput
                style={styles.pointsInput}
                placeholder="0"
                placeholderTextColor={Colors.text.secondary}
                value={pointsToRedeem.toString()}
                onChangeText={handlePointsChange}
                keyboardType="numeric"
              />
              <TouchableOpacity
                style={styles.maxButton}
                onPress={() => setPointsToRedeem(Math.floor(maxPointsDiscount))}
              >
                <Text style={styles.maxButtonText}>MAX</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.pointsInfo}>
              Max 50% discount (${Math.floor(maxPointsDiscount)})
            </Text>
          </View>

          {/* Price Summary */}
          <View style={styles.priceSummary}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Base Price:</Text>
              <Text style={styles.priceValue}>${basePrice}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Points Discount:</Text>
              <Text style={[styles.priceValue, styles.discountValue]}>
                -${pointsToRedeem}
              </Text>
            </View>
            <View style={[styles.priceRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Final Price:</Text>
              <Text style={styles.totalValue}>${finalPrice}</Text>
            </View>
          </View>

          {/* IP Agreement */}
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => setAgreedToTerms(!agreedToTerms)}
          >
            <View style={[styles.checkboxBox, agreedToTerms && styles.checkboxBoxChecked]}>
              {agreedToTerms && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>
              I understand that Scrollogy retains all intellectual property rights to the
              custom course content
            </Text>
          </TouchableOpacity>

          {/* Info Box */}
          <View style={styles.infoBox}>
            <Info color={Colors.primary} size={20} />
            <Text style={styles.infoText}>
              Your quote will expire in 7 days. We&apos;ll send you an email with payment
              options and estimated delivery time.
            </Text>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, !agreedToTerms && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={!agreedToTerms}
          >
            <Text style={styles.submitButtonText}>Request Quote</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Layout.spacing.lg,
  },
  section: {
    marginBottom: Layout.spacing.lg,
  },
  label: {
    fontSize: Layout.fontSize.md,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: Layout.spacing.sm,
  },
  input: {
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.medium,
    padding: Layout.spacing.md,
    fontSize: Layout.fontSize.md,
    color: Colors.text.primary,
    borderWidth: 1,
    borderColor: Colors.gray.light,
  },
  textArea: {
    minHeight: 100,
  },
  depthOptions: {
    gap: Layout.spacing.sm,
  },
  depthOption: {
    backgroundColor: Colors.white,
    padding: Layout.spacing.md,
    borderRadius: Layout.borderRadius.medium,
    borderWidth: 2,
    borderColor: Colors.gray.light,
  },
  depthOptionActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  depthName: {
    fontSize: Layout.fontSize.lg,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: Layout.spacing.xs,
  },
  depthNameActive: {
    color: Colors.white,
  },
  depthVideos: {
    fontSize: Layout.fontSize.sm,
    color: Colors.text.secondary,
    marginBottom: Layout.spacing.xs,
  },
  depthVideosActive: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  depthPrice: {
    fontSize: Layout.fontSize.xl,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: Layout.spacing.xs,
  },
  depthPriceActive: {
    color: Colors.accentYellow,
  },
  depthDescription: {
    fontSize: Layout.fontSize.sm,
    color: Colors.text.secondary,
  },
  depthDescriptionActive: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  pointsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.sm,
  },
  availablePoints: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.xs,
  },
  availablePointsText: {
    fontSize: Layout.fontSize.sm,
    fontWeight: '600',
    color: Colors.text.secondary,
  },
  pointsInputContainer: {
    flexDirection: 'row',
    gap: Layout.spacing.sm,
  },
  pointsInput: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.medium,
    padding: Layout.spacing.md,
    fontSize: Layout.fontSize.md,
    color: Colors.text.primary,
    borderWidth: 1,
    borderColor: Colors.gray.light,
  },
  maxButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Layout.spacing.lg,
    borderRadius: Layout.borderRadius.medium,
    justifyContent: 'center',
    alignItems: 'center',
  },
  maxButtonText: {
    fontSize: Layout.fontSize.sm,
    fontWeight: 'bold',
    color: Colors.white,
  },
  pointsInfo: {
    fontSize: Layout.fontSize.xs,
    color: Colors.text.secondary,
    marginTop: Layout.spacing.xs,
  },
  priceSummary: {
    backgroundColor: Colors.white,
    padding: Layout.spacing.lg,
    borderRadius: Layout.borderRadius.medium,
    marginBottom: Layout.spacing.lg,
    ...Colors.shadows.small,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Layout.spacing.sm,
  },
  priceLabel: {
    fontSize: Layout.fontSize.md,
    color: Colors.text.secondary,
  },
  priceValue: {
    fontSize: Layout.fontSize.md,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  discountValue: {
    color: Colors.accentGreen,
  },
  totalRow: {
    marginTop: Layout.spacing.sm,
    paddingTop: Layout.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.gray.light,
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: Layout.fontSize.lg,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  totalValue: {
    fontSize: Layout.fontSize.xl,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Layout.spacing.sm,
    marginBottom: Layout.spacing.lg,
  },
  checkboxBox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.gray.medium,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  checkboxBoxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkmark: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    flex: 1,
    fontSize: Layout.fontSize.sm,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  infoBox: {
    flexDirection: 'row',
    gap: Layout.spacing.sm,
    backgroundColor: Colors.gray.lightest,
    padding: Layout.spacing.md,
    borderRadius: Layout.borderRadius.medium,
    marginBottom: Layout.spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  infoText: {
    flex: 1,
    fontSize: Layout.fontSize.sm,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    padding: Layout.spacing.md,
    borderRadius: Layout.borderRadius.medium,
    alignItems: 'center',
    ...Colors.shadows.medium,
  },
  submitButtonDisabled: {
    backgroundColor: Colors.gray.medium,
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: Layout.fontSize.lg,
    fontWeight: 'bold',
    color: Colors.white,
  },
});
