import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Sparkles, Phone, ArrowRight, ShieldCheck } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';

interface LoginScreenProps {
  onSendOtp: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onSendOtp }) => {
  const { loginPhone, setLoginPhone, login } = useApp();

  const handleContinue = () => {
    if (loginPhone.length >= 10) {
      login(loginPhone);
      onSendOtp();
    } else {
      alert('Please enter a valid 10-digit mobile number');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.headerSection}>
          <View style={styles.logoCircle}>
            <Sparkles size={32} color={COLORS.white} />
          </View>
          <Text style={styles.title}>Welcome to CraveDash</Text>
          <Text style={styles.subtitle}>Enter your mobile number to get started</Text>
        </View>

        <View style={styles.cardContainer}>
          {/* Phone Input Box */}
          <Text style={styles.label}>Mobile Number</Text>
          <View style={styles.phoneInputRow}>
            <View style={styles.countryCode}>
              <Text style={styles.flagText}>🇮🇳</Text>
              <Text style={styles.codeText}>+91</Text>
            </View>
            <TextInput
              style={styles.input}
              value={loginPhone}
              onChangeText={setLoginPhone}
              placeholder="Enter 10-digit number"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            style={[styles.continueBtn, loginPhone.length < 10 && styles.disabledBtn]}
            onPress={handleContinue}
            activeOpacity={0.85}
          >
            <Text style={styles.continueText}>Continue</Text>
            <ArrowRight size={18} color={COLORS.white} />
          </TouchableOpacity>

          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.divider} />
          </View>

          {/* Social Sign-in Buttons */}
          <TouchableOpacity
            style={styles.socialButton}
            onPress={onSendOtp}
            activeOpacity={0.8}
          >
            <Text style={styles.googleG}>G</Text>
            <Text style={styles.socialText}>Continue with Google</Text>
          </TouchableOpacity>

          {Platform.OS === 'ios' && (
            <TouchableOpacity
              style={[styles.socialButton, styles.appleButton]}
              onPress={onSendOtp}
              activeOpacity={0.8}
            >
              <Text style={styles.appleLogo}></Text>
              <Text style={[styles.socialText, styles.appleText]}>
                Continue with Apple
              </Text>
            </TouchableOpacity>
          )}

          {/* Terms & Privacy */}
          <Text style={styles.termsText}>
            By continuing, you agree to our{' '}
            <Text style={styles.linkText}>Terms of Service</Text> &{' '}
            <Text style={styles.linkText}>Privacy Policy</Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headerSection: {
    alignItems: 'center',
    paddingTop: SPACING.xxl,
    paddingHorizontal: SPACING.lg,
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
    borderWidth: 1.5,
    borderColor: COLORS.white,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.white,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  cardContainer: {
    backgroundColor: COLORS.cardBackground,
    borderTopLeftRadius: RADIUS.xl * 1.5,
    borderTopRightRadius: RADIUS.xl * 1.5,
    padding: SPACING.xl,
    paddingTop: SPACING.xxl,
    ...SHADOWS.heavy,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  phoneInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.md,
    height: 52,
  },
  countryCode: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.md,
    paddingRight: SPACING.md,
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
  },
  flagText: {
    fontSize: 18,
    marginRight: 6,
  },
  codeText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  continueBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    height: 52,
    borderRadius: RADIUS.lg,
    ...SHADOWS.medium,
  },
  disabledBtn: {
    opacity: 0.6,
  },
  continueText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.white,
    marginRight: SPACING.xs,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.xl,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginHorizontal: SPACING.md,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.cardBackground,
    borderWidth: 1,
    borderColor: COLORS.border,
    height: 48,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.md,
  },
  googleG: {
    fontSize: 18,
    fontWeight: '900',
    color: '#4285F4',
    marginRight: SPACING.xs,
  },
  appleButton: {
    backgroundColor: COLORS.black,
    borderColor: COLORS.black,
  },
  appleLogo: {
    fontSize: 20,
    color: COLORS.white,
    marginRight: SPACING.xs,
  },
  appleText: {
    color: COLORS.white,
  },
  socialText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  termsText: {
    fontSize: 11,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 16,
    marginTop: SPACING.md,
  },
  linkText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});
