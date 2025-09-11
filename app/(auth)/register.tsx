import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { User, Mail, Lock, Eye, EyeOff, Check } from "lucide-react-native";
import Colors from "@/constants/colors";
import Layout from "@/constants/layout";

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    terms?: string;
  }>({});

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    if (password.length < 8) errors.push("At least 8 characters");
    if (!/[A-Z]/.test(password)) errors.push("One uppercase letter");
    if (!/[a-z]/.test(password)) errors.push("One lowercase letter");
    if (!/\d/.test(password)) errors.push("One number");
    return { isValid: errors.length === 0, errors };
  };

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!name.trim()) {
      newErrors.name = "Full name is required";
    } else if (name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!username.trim()) {
      newErrors.username = "Username is required";
    } else if (username.trim().length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      newErrors.username = "Username can only contain letters, numbers, and underscores";
    }

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email";
    }

    const passwordValidation = validatePassword(password);
    if (!password) {
      newErrors.password = "Password is required";
    } else if (!passwordValidation.isValid) {
      newErrors.password = "Password requirements not met";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!acceptTerms || !acceptPrivacy) {
      newErrors.terms = "Please accept the terms and privacy policy";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Mock registration - in real app, create account
      await new Promise(resolve => setTimeout(resolve, 1000));
      router.replace("/(auth)/onboarding");
    } catch (error) {
      Alert.alert("Registration Failed", "Please try again later");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialRegister = (provider: "google" | "apple") => {
    Alert.alert("Coming Soon", `${provider} registration will be available soon!`);
  };

  const passwordValidation = validatePassword(password);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <Text style={styles.logoEmoji}>🚀</Text>
              </View>
              <Text style={styles.logo}>Create Your Account</Text>
              <Text style={styles.tagline}>Join the learning revolution</Text>
            </View>

            <View style={styles.form}>
              {/* Full Name */}
              <View style={styles.inputGroup}>
                <View style={[styles.inputContainer, errors.name && styles.inputError]}>
                  <User color={Colors.text.secondary} size={20} />
                  <TextInput
                    style={styles.input}
                    placeholder="Full Name (for certificates)"
                    placeholderTextColor={Colors.text.secondary}
                    value={name}
                    onChangeText={(text) => {
                      setName(text);
                      if (errors.name) setErrors({ ...errors, name: undefined });
                    }}
                    autoCapitalize="words"
                    autoComplete="name"
                  />
                </View>
                {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
              </View>

              {/* Username */}
              <View style={styles.inputGroup}>
                <View style={[styles.inputContainer, errors.username && styles.inputError]}>
                  <Text style={styles.atSymbol}>@</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Username (for comments & leaderboard)"
                    placeholderTextColor={Colors.text.secondary}
                    value={username}
                    onChangeText={(text) => {
                      setUsername(text.toLowerCase());
                      if (errors.username) setErrors({ ...errors, username: undefined });
                    }}
                    autoCapitalize="none"
                    autoComplete="username"
                  />
                </View>
                {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}
              </View>

              {/* Email */}
              <View style={styles.inputGroup}>
                <View style={[styles.inputContainer, errors.email && styles.inputError]}>
                  <Mail color={Colors.text.secondary} size={20} />
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor={Colors.text.secondary}
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      if (errors.email) setErrors({ ...errors, email: undefined });
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                  />
                </View>
                {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
              </View>

              {/* Password */}
              <View style={styles.inputGroup}>
                <View style={[styles.inputContainer, errors.password && styles.inputError]}>
                  <Lock color={Colors.text.secondary} size={20} />
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor={Colors.text.secondary}
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      if (errors.password) setErrors({ ...errors, password: undefined });
                    }}
                    secureTextEntry={!showPassword}
                    autoComplete="new-password"
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    {showPassword ? (
                      <EyeOff size={20} color={Colors.text.secondary} />
                    ) : (
                      <Eye size={20} color={Colors.text.secondary} />
                    )}
                  </TouchableOpacity>
                </View>
                {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                
                {/* Password Requirements */}
                {password.length > 0 && (
                  <View style={styles.passwordRequirements}>
                    <Text style={styles.requirementsTitle}>Password must have:</Text>
                    {passwordValidation.errors.map((req, index) => (
                      <View key={index} style={styles.requirement}>
                        <Check 
                          size={16} 
                          color={passwordValidation.errors.includes(req) ? Colors.gray.medium : Colors.accentGreen} 
                        />
                        <Text style={[
                          styles.requirementText,
                          !passwordValidation.errors.includes(req) && styles.requirementMet
                        ]}>
                          {req}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>

              {/* Confirm Password */}
              <View style={styles.inputGroup}>
                <View style={[styles.inputContainer, errors.confirmPassword && styles.inputError]}>
                  <Lock color={Colors.text.secondary} size={20} />
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    placeholderTextColor={Colors.text.secondary}
                    value={confirmPassword}
                    onChangeText={(text) => {
                      setConfirmPassword(text);
                      if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
                    }}
                    secureTextEntry={!showConfirmPassword}
                    autoComplete="new-password"
                  />
                  <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? (
                      <EyeOff size={20} color={Colors.text.secondary} />
                    ) : (
                      <Eye size={20} color={Colors.text.secondary} />
                    )}
                  </TouchableOpacity>
                </View>
                {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
              </View>

              {/* Terms and Privacy */}
              <View style={styles.checkboxContainer}>
                <TouchableOpacity 
                  style={styles.checkbox}
                  onPress={() => setAcceptTerms(!acceptTerms)}
                >
                  <View style={[styles.checkboxBox, acceptTerms && styles.checkboxChecked]}>
                    {acceptTerms && <Check size={16} color={Colors.white} />}
                  </View>
                  <Text style={styles.checkboxText}>
                    I agree to the <Text style={styles.link}>Terms of Service</Text>
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.checkbox}
                  onPress={() => setAcceptPrivacy(!acceptPrivacy)}
                >
                  <View style={[styles.checkboxBox, acceptPrivacy && styles.checkboxChecked]}>
                    {acceptPrivacy && <Check size={16} color={Colors.white} />}
                  </View>
                  <Text style={styles.checkboxText}>
                    I agree to the <Text style={styles.link}>Privacy Policy</Text>
                  </Text>
                </TouchableOpacity>
                
                {errors.terms && <Text style={styles.errorText}>{errors.terms}</Text>}
              </View>

              <TouchableOpacity 
                style={[styles.registerButton, isLoading && styles.buttonDisabled]}
                onPress={handleRegister}
                disabled={isLoading}
              >
                <Text style={styles.registerButtonText}>
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Text>
              </TouchableOpacity>

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
              </View>

              <TouchableOpacity 
                style={styles.socialButton}
                onPress={() => handleSocialRegister("google")}
              >
                <Text style={styles.socialButtonText}>Continue with Google</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.socialButton, styles.appleButton]}
                onPress={() => handleSocialRegister("apple")}
              >
                <Text style={[styles.socialButtonText, styles.appleButtonText]}>Continue with Apple</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
                <Text style={styles.loginLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Layout.spacing.xl,
    paddingVertical: Layout.spacing.xl,
  },
  header: {
    alignItems: "center",
    marginBottom: Layout.spacing.xl,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Layout.spacing.md,
  },
  logoEmoji: {
    fontSize: 40,
  },
  logo: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.text.primary,
    marginBottom: Layout.spacing.sm,
  },
  tagline: {
    fontSize: Layout.fontSize.md,
    color: Colors.text.secondary,
  },
  form: {
    marginBottom: Layout.spacing.xl,
  },
  inputGroup: {
    marginBottom: Layout.spacing.lg,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.medium,
    paddingHorizontal: Layout.spacing.md,
    borderWidth: 1,
    borderColor: Colors.gray.light,
    ...Colors.shadows.small,
  },
  inputError: {
    borderColor: Colors.error,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: Layout.fontSize.md,
    color: Colors.text.primary,
    marginLeft: Layout.spacing.sm,
  },
  atSymbol: {
    fontSize: Layout.fontSize.lg,
    color: Colors.text.secondary,
    fontWeight: "bold",
  },
  errorText: {
    fontSize: Layout.fontSize.sm,
    color: Colors.error,
    marginTop: Layout.spacing.xs,
    marginLeft: Layout.spacing.sm,
  },
  passwordRequirements: {
    marginTop: Layout.spacing.sm,
    paddingLeft: Layout.spacing.sm,
  },
  requirementsTitle: {
    fontSize: Layout.fontSize.sm,
    color: Colors.text.secondary,
    marginBottom: Layout.spacing.xs,
    fontWeight: "600",
  },
  requirement: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Layout.spacing.xs,
    gap: Layout.spacing.xs,
  },
  requirementText: {
    fontSize: Layout.fontSize.sm,
    color: Colors.text.secondary,
  },
  requirementMet: {
    color: Colors.accentGreen,
    textDecorationLine: "line-through",
  },
  checkboxContainer: {
    marginBottom: Layout.spacing.lg,
  },
  checkbox: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Layout.spacing.sm,
    gap: Layout.spacing.sm,
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.gray.medium,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkboxText: {
    fontSize: Layout.fontSize.sm,
    color: Colors.text.secondary,
    flex: 1,
  },
  link: {
    color: Colors.primary,
    fontWeight: "600",
  },
  registerButton: {
    backgroundColor: Colors.primary,
    borderRadius: Layout.borderRadius.medium,
    paddingVertical: Layout.spacing.md,
    alignItems: "center",
    marginBottom: Layout.spacing.lg,
    ...Colors.shadows.medium,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  registerButtonText: {
    fontSize: Layout.fontSize.lg,
    fontWeight: "bold",
    color: Colors.white,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: Layout.spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.gray.light,
  },
  dividerText: {
    fontSize: Layout.fontSize.sm,
    color: Colors.text.secondary,
    marginHorizontal: Layout.spacing.md,
    fontWeight: "600",
  },
  socialButton: {
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.medium,
    paddingVertical: Layout.spacing.md,
    alignItems: "center",
    marginBottom: Layout.spacing.md,
    borderWidth: 1,
    borderColor: Colors.gray.light,
    ...Colors.shadows.small,
  },
  appleButton: {
    backgroundColor: Colors.gray.dark,
    borderColor: Colors.gray.dark,
  },
  socialButtonText: {
    fontSize: Layout.fontSize.md,
    fontWeight: "600",
    color: Colors.text.primary,
  },
  appleButtonText: {
    color: Colors.white,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    fontSize: Layout.fontSize.md,
    color: Colors.text.secondary,
  },
  loginLink: {
    fontSize: Layout.fontSize.md,
    color: Colors.primary,
    fontWeight: "bold",
  },
});