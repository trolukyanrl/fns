import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BLUE = '#4285F4';
const DARK_GREY = '#333333';
const LIGHT_GREY = '#666666';

export default function ProfileScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('Profile');

  const handleNavigation = (tab) => {
    setActiveTab(tab);
    if (tab === 'Home') navigation.navigate('TADashboard');
    if (tab === 'Tasks') navigation.navigate('Tasks');
    if (tab === 'Profile') navigation.navigate('Profile');
  };

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <View style={styles.container}>
      {/* Header with Logout */}
      <View style={styles.header}>
        <Text style={styles.pageTitle}>TA Profile</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color={DARK_GREY} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.infoText}>Name: Rajesh Kumar</Text>
        <Text style={styles.infoText}>Role: Safety Inspector</Text>
        <Text style={styles.infoText}>Email: rajesh@example.com</Text>
        <Text style={styles.infoText}>Phone: +91 9876543210</Text>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        {['Home', 'Tasks', 'Profile'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={styles.navItem}
            onPress={() => handleNavigation(tab)}
          >
            <Ionicons
              name={tab === 'Home' ? 'home' : tab === 'Tasks' ? 'checkbox-outline' : 'person-outline'}
              size={24}
              color={activeTab === tab ? BLUE : LIGHT_GREY}
            />
            <Text style={[styles.navLabel, activeTab === tab && styles.navLabelActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 48, paddingBottom: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E8E8E8' },
  pageTitle: { fontSize: 20, fontWeight: '700', color: DARK_GREY },
  logoutButton: { padding: 8 },
  scrollContent: { padding: 20, paddingBottom: 100 },
  infoText: { fontSize: 16, color: DARK_GREY, marginBottom: 12 },
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', backgroundColor: '#fff', paddingVertical: 12, paddingHorizontal: 20, borderTopWidth: 1, borderTopColor: '#E8E8E8' },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  navLabel: { fontSize: 12, color: LIGHT_GREY, marginTop: 4 },
  navLabelActive: { color: BLUE, fontWeight: '600' },
});
