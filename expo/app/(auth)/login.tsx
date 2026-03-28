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
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Mail, Lock, Eye, EyeOff } from "lucide-react-native";
import Colors from "@/constants/colors";
import Layout from "@/constants/layout";
import { useUser } from "@/hooks/useUser";

export default function LoginScreen() {
  const router = useRouter();
  // const { login } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Mock login - in real app, validate credentials
      // await login(email, password);
      router.replace('/(tabs)/dashboard');
    } catch (error) {
      Alert.alert('Login Failed', 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: 'google' | 'apple') => {
    Alert.alert('Coming Soon', `${provider} login will be available soon!`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoEmoji}>📚</Text>
            </View>
            <Text style={styles.logo}>Scrollogy</Text>
            <Text style={styles.tagline}>Learn anything, anytime</Text>
          </View>

          <View style={styles.form}>
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
                  autoComplete="password"
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
            </View>

            <TouchableOpacity>
              <Text style={styles.forgotPassword}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.loginButton, isLoading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Text style={styles.loginButtonText}>
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Text>
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity 
              style={styles.socialButton}
              onPress={() => handleSocialLogin('google')}
            >
              <Text style={styles.socialButtonText}>Continue with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.socialButton, styles.appleButton]}
              onPress={() => handleSocialLogin('apple')}
            >
              <Text style={[styles.socialButtonText, styles.appleButtonText]}>Continue with Apple</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don&apos;t have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
              <Text style={styles.signUpLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    flex: 1,
    paddingHorizontal: Layout.spacing.lg,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: Layout.spacing.xl * 2,
  },
  logo: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: Layout.spacing.sm,
  },
  tagline: {
    fontSize: Layout.fontSize.md,
    color: Colors.text.secondary,
  },
  form: {
    gap: Layout.spacing.md,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray.lightest,
    borderRadius: Layout.borderRadius.medium,
    paddingHorizontal: Layout.spacing.md,
    gap: Layout.spacing.sm,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: Layout.fontSize.md,
    color: Colors.text.primary,
  },
  forgotPassword: {
    color: Colors.primary,
    fontSize: Layout.fontSize.sm,
    textAlign: 'right',
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: Colors.primary,
    height: 50,
    borderRadius: Layout.borderRadius.medium,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Layout.spacing.sm,
  },
  loginButtonText: {
    color: Colors.white,
    fontSize: Layout.fontSize.md,
    fontWeight: 'bold',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Layout.spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.gray.light,
  },
  dividerText: {
    marginHorizontal: Layout.spacing.md,
    color: Colors.text.secondary,
    fontSize: Layout.fontSize.sm,
  },
  socialButton: {
    height: 50,
    borderRadius: Layout.borderRadius.medium,
    borderWidth: 1,
    borderColor: Colors.gray.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialButtonText: {
    color: Colors.text.primary,
    fontSize: Layout.fontSize.md,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Layout.spacing.xl,
  },
  footerText: {
    color: Colors.text.secondary,
    fontSize: Layout.fontSize.sm,
  },
  signUpLink: {
    color: Colors.primary,
    fontSize: Layout.fontSize.sm,
    fontWeight: 'bold',
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  logoEmoji: {
    fontSize: 40,
  },
  inputGroup: {
    marginBottom: Layout.spacing.sm,
  },
  inputError: {
    borderWidth: 1,
    borderColor: Colors.error,
  },
  errorText: {
    fontSize: Layout.fontSize.sm,
    color: Colors.error,
    marginTop: Layout.spacing.xs,
    marginLeft: Layout.spacing.sm,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  appleButton: {
    backgroundColor: Colors.gray.dark,
    borderColor: Colors.gray.dark,
  },
  appleButtonText: {
    color: Colors.white,
  },
});