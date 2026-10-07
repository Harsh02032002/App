import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { ArrowLeft, Lock, CheckCircle2 } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';

interface OTPScreenProps {
  onSuccess: () => void;
  onBack: () => void;
}

export const OTPScreen: React.FC<OTPScreenProps> = ({ onSuccess, onBack }) => {
  const { loginPhone, verifyOtp } = useApp();
  const [otp, setOtp] = useState<string[]>(['1', '2', '3', '4']);
  const [timer, setTimer] = useState<number>(30);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const inputRefs = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
  ];

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(countdown);
  }, []);

  const handleChangeText = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text.length === 1 && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleVerify = () => {
    const code = otp.join('');
    if (code.length === 4) {
      const isValid = verifyOtp(code);
      if (isValid) {
        onSuccess();
      } else {
        setErrorMsg('Invalid OTP code. Please enter 1234');
      }
    } else {
      setErrorMsg('Please enter all 4 digits');
    }
  };

  const handleResend = () => {
    setTimer(30);
    setOtp(['1', '2', '3', '4']);
    setErrorMsg('');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ArrowLeft size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>OTP Verification</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Lock size={32} color={COLORS.primary} />
        </View>

        <Text style={styles.title}>Enter 4-Digit Code</Text>
        <Text style={styles.subtitle}>
          Code sent to <Text style={styles.phoneText}>+91 {loginPhone || '98765 43210'}</Text>
        </Text>

        {/* 4 OTP Input Boxes */}
        <View style={styles.otpRow}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={inputRefs[index]}
              style={[
                styles.otpBox,
                digit.length > 0 && styles.activeOtpBox,
                errorMsg.length > 0 && styles.errorOtpBox,
              ]}
              value={digit}
              onChangeText={(text) => handleChangeText(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
            />
          ))}
        </View>

        {errorMsg.length > 0 && <Text style={styles.errorText}>{errorMsg}</Text>}

        {/* Timer / Resend */}
        <View style={styles.timerRow}>
          {timer > 0 ? (
            <Text style={styles.timerText}>Resend OTP in 00:{timer < 10 ? `0${timer}` : timer}</Text>
          ) : (
            <TouchableOpacity onPress={handleResend}>
              <Text style={styles.resendText}>Resend OTP</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Verify Button */}
        <TouchableOpacity style={styles.verifyBtn} onPress={handleVerify} activeOpacity={0.85}>
          <Text style={styles.verifyText}>Verify & Proceed</Text>
          <CheckCircle2 size={18} color={COLORS.white} />
        </TouchableOpacity>

        <Text style={styles.hintText}>Demo Hint: OTP is pre-filled (1234)</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cardBackground,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  backButton: {
    padding: SPACING.xs,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginLeft: SPACING.md,
  },
  content: {
    padding: SPACING.xl,
    alignItems: 'center',
  },
  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: SPACING.lg,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  phoneText: {
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  otpBox: {
    width: 54,
    height: 58,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginHorizontal: SPACING.xs,
  },
  activeOtpBox: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  errorOtpBox: {
    borderColor: COLORS.nonVegRed,
  },
  errorText: {
    color: COLORS.nonVegRed,
    fontSize: 12,
    marginBottom: SPACING.md,
  },
  timerRow: {
    marginBottom: SPACING.xl,
  },
  timerText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  resendText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
  verifyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 52,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    ...SHADOWS.medium,
  },
  verifyText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
    marginRight: SPACING.xs,
  },
  hintText: {
    marginTop: SPACING.lg,
    fontSize: 12,
    color: COLORS.textMuted,
  },
});
