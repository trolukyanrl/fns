<<<<<<< HEAD
import React, { useState } from 'react';
=======
import React, { useState, useEffect } from 'react';
>>>>>>> bcknd
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
<<<<<<< HEAD
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
=======
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../AuthContext';
>>>>>>> bcknd

const BLUE = '#4285F4';
const DARK_GREY = '#333333';
const LIGHT_GREY = '#999999';
const BORDER_GREY = '#CCCCCC';
const BG_GREY = '#E8E8E8';
const GREEN = '#34A853';

<<<<<<< HEAD
// Dummy credentials
const SIC_CREDENTIALS = { username: 'sic@123', password: 'sic@123' };
const TA_CREDENTIALS = { username: 'ta@123', password: 'ta@123' };

=======
>>>>>>> bcknd
export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
<<<<<<< HEAD

  const handleLogin = () => {
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (trimmedUsername === SIC_CREDENTIALS.username && trimmedPassword === SIC_CREDENTIALS.password) {
      navigation.replace('SICDashboard');
    } else if (trimmedUsername === TA_CREDENTIALS.username && trimmedPassword === TA_CREDENTIALS.password) {
      navigation.replace('TADashboard');
    } else {
      Alert.alert('Invalid Credentials', 'Please enter a valid username and password.');
=======
  const { login, loading, error, clearError } = useAuth();

  // Clear error when user starts typing
  useEffect(() => {
    if (error && (username || password)) {
      clearError();
    }
  }, [username, password]);

  // Handle authentication errors
  useEffect(() => {
    if (error) {
      Alert.alert('Login Failed', error);
    }
  }, [error]);

  const handleLogin = async () => {
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername || !trimmedPassword) {
      Alert.alert('Missing Information', 'Please enter both username and password.');
      return;
    }

    const result = await login(trimmedUsername, trimmedPassword);
    
    console.log('Login result:', result);
    
    if (result.success) {
      console.log('Navigation starting for role:', result.user.role);
      // Navigate based on user role
      if (result.user.role === 'SIC') {
        console.log('Navigating to SICDashboard');
        navigation.replace('SICDashboard');
      } else if (result.user.role === 'TA') {
        console.log('Navigating to TADashboard');
        navigation.replace('TADashboard');
      }
      console.log('Navigation completed');
>>>>>>> bcknd
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          {/* Logo and Title */}
          <View style={styles.logoSection}>
            <View style={styles.logoIcon}>
              <Ionicons name="shield-checkmark" size={40} color="#fff" />
            </View>
            <Text style={styles.title}>FNS Safety</Text>
            <Text style={styles.subtitle}>BA Set Manager</Text>
          </View>

          {/* Username Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>USER NAME</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={20} color={LIGHT_GREY} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your ID or name"
                placeholderTextColor={LIGHT_GREY}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          {/* Password Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>PASSWORD</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color={LIGHT_GREY} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="Enter password"
                placeholderTextColor={LIGHT_GREY}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={LIGHT_GREY}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Sign In Button */}
<<<<<<< HEAD
          <TouchableOpacity style={styles.button} onPress={handleLogin} activeOpacity={0.8}>
            <Text style={styles.buttonText}>Sign In</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" style={styles.buttonIcon} />
=======
          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={handleLogin} 
            activeOpacity={0.8}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Text style={styles.buttonText}>Sign In</Text>
                <Ionicons name="arrow-forward" size={20} color="#fff" style={styles.buttonIcon} />
              </>
            )}
>>>>>>> bcknd
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Authorized Personnel Only</Text>
          <View style={styles.secureRow}>
            <View style={styles.secureDot} />
            <Text style={styles.secureText}>SYSTEM SECURE</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_GREY,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 48,
    paddingBottom: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 32,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoIcon: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: BLUE,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: DARK_GREY,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: DARK_GREY,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: DARK_GREY,
    letterSpacing: 1,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER_GREY,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: DARK_GREY,
  },
  passwordInput: {
    paddingRight: 8,
  },
  eyeButton: {
    padding: 4,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BLUE,
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 8,
  },
<<<<<<< HEAD
=======
  buttonDisabled: {
    backgroundColor: '#A0C3FF',
    opacity: 0.7,
  },
>>>>>>> bcknd
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  buttonIcon: {
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
  },
  footerText: {
    fontSize: 14,
    color: DARK_GREY,
    marginBottom: 8,
  },
  secureRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  secureDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: GREEN,
    marginRight: 8,
  },
  secureText: {
    fontSize: 12,
    color: LIGHT_GREY,
    letterSpacing: 1,
  },
});
