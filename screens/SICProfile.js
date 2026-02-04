import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BLUE = '#2563EB';
const GREY = '#6B7280';

export default function SICProfile({ navigation }) {
  const [activeTab, setActiveTab] = useState('Profile');

  useEffect(() => {
    setActiveTab('Profile'); // highlight Profile when coming to this page
  }, []);

  const handleNavigation = (tab) => {
    setActiveTab(tab);
    if (tab === 'Home') navigation.navigate('SICDashboard');
    if (tab === 'Tasks') navigation.navigate('SICTasks');
    if (tab === 'Profile') navigation.navigate('SICProfile');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Added top space for status bar / header */}
        <View style={{ height: 48 }} />

        <Text style={styles.title}>SIC Profile Page</Text>
        <Text>Show SIC profile info, settings, etc. here...</Text>
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
              name={
                tab === 'Home'
                  ? 'home'
                  : tab === 'Tasks'
                  ? 'checkbox-outline'
                  : 'person-outline'
              }
              size={24}
              color={activeTab === tab ? BLUE : GREY}
            />
            <Text
              style={[styles.navLabel, activeTab === tab && styles.navLabelActive]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F9FAFB' },
  container: { 
    flexGrow: 1, 
    padding: 20, 
    paddingBottom: 100, 
    alignItems: 'center',
  },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 16 },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
  },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  navLabel: { fontSize: 12, color: GREY, marginTop: 4 },
  navLabelActive: { color: BLUE, fontWeight: '600' },
});
