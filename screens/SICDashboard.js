import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTaskContext } from '../TaskContext';

const RED_ACCENT = '#D32F2F';
const RED_LIGHT = '#FEE2E2';
const BLUE_ACCENT = '#1976D2';
const GREEN_ACCENT = '#388E3C';
const YELLOW_ACCENT = '#FBC02D';
const DARK = '#1F2937';
const GREY = '#6B7280';
const BG_COLOR = '#FFF5F5';

export default function SICDashboard({ navigation }) {
  const [activeTab, setActiveTab] = useState('Home');
  const { tasks, refreshTasks, loading } = useTaskContext();

  const onRefresh = useCallback(() => {
    refreshTasks();
  }, [refreshTasks]);

  // Calculate pending approvals count
  const pendingApprovalsCount = tasks.filter(task => task.status === 'Pending for Approval').length;

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const handleNavigation = (tab) => {
    setActiveTab(tab);
    if (tab === 'Home') {
      navigation.navigate('SICDashboard');
    } else if (tab === 'Tasks') {
      navigation.navigate('SICTasks');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Background Pattern */}
      <View style={styles.backgroundPattern}>
        <Ionicons name="flame" size={120} color="rgba(211, 47, 47, 0.03)" style={[styles.bgIcon, { top: 100, left: -20 }]} />
        <Ionicons name="shield-checkmark" size={150} color="rgba(211, 47, 47, 0.03)" style={[styles.bgIcon, { bottom: 150, right: -30 }]} />
      </View>

      {/* Fixed Header - Outside ScrollView */}
      <View style={styles.fixedHeader}>
        <View style={styles.header}>
          <View style={styles.logo}>
            <Ionicons name="shield-checkmark" size={24} color="#fff" />
          </View>

          <View>
            <Text style={styles.headerTitle}>SIC Portal</Text>
            <Text style={styles.headerSubtitle}>SITE IN-CHARGE</Text>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color={RED_ACCENT} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} colors={[RED_ACCENT]} />
        }
      >
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Overview</Text>
          <Text style={styles.dateText}>{new Date().toDateString()}</Text>
        </View>

        {/* Primary Actions */}
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
        </View>
        
        <View style={styles.statsRow}>
          <TouchableOpacity 
            style={[styles.statCard, styles.cardShadow, { backgroundColor: '#fff', borderLeftWidth: 4, borderLeftColor: RED_ACCENT }]} 
            onPress={() => navigation.navigate('SICAssignTask')}
          >
            <View style={[styles.iconContainer, { backgroundColor: RED_LIGHT }]}>
              <Ionicons name="add" size={24} color={RED_ACCENT} />
            </View>
            <Text style={styles.statLabel}>Assign Task</Text>
            <Text style={styles.statDesc}>Create new inspection</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.statCard, styles.cardShadow, { backgroundColor: '#fff', borderLeftWidth: 4, borderLeftColor: YELLOW_ACCENT }]} 
            onPress={() => navigation.navigate('SICTasks')}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#FFF9C4' }]}>
              <Ionicons name="list" size={24} color={YELLOW_ACCENT} />
            </View>
            <Text style={styles.statLabel}>Task List</Text>
            <Text style={styles.statDesc}>View all tasks</Text>
          </TouchableOpacity>
        </View>

        {/* Attention Required */}
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>Attention Required</Text>
        </View>

        <View style={styles.statsRow}>
          <TouchableOpacity 
            style={[styles.statCard, styles.cardShadow, { backgroundColor: '#fff' }]} 
            onPress={() => navigation.navigate('PendingApprovals')}
          >
            {pendingApprovalsCount > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationText}>{pendingApprovalsCount}</Text>
              </View>
            )}
            <View style={[styles.iconContainer, { backgroundColor: '#FFEBEE' }]}>
              <Ionicons name="document-text" size={24} color={RED_ACCENT} />
            </View>
            <Text style={styles.statLabel}>Approvals</Text>
            <Text style={styles.statDesc}>Pending Review</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.statCard, styles.cardShadow, { backgroundColor: '#fff' }]} 
            onPress={() => navigation.navigate('OverdueTasks')}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#F3E5F5' }]}>
              <Ionicons name="time" size={24} color="#7B1FA2" />
            </View>
            <Text style={styles.statLabel}>Overdue</Text>
            <Text style={styles.statDesc}>Late Tasks</Text>
          </TouchableOpacity>
        </View>

        {/* Tools */}
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>Tools</Text>
        </View>

        <View style={styles.statsRow}>
          <TouchableOpacity 
            style={[styles.statCard, styles.cardShadow, { backgroundColor: '#fff' }]} 
            onPress={() => navigation.navigate('QRScanner')}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#E3F2FD' }]}>
              <Ionicons name="qr-code" size={24} color={BLUE_ACCENT} />
            </View>
            <Text style={styles.statLabel}>Map Asset</Text>
            <Text style={styles.statDesc}>Link QR Code</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.statCard, styles.cardShadow, { backgroundColor: '#fff' }]} 
            onPress={() => navigation.navigate('QRScanner', { taskType: 'VERIFY' })}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#E8F5E9' }]}>
              <Ionicons name="checkmark-circle" size={24} color={GREEN_ACCENT} />
            </View>
            <Text style={styles.statLabel}>Verify</Text>
            <Text style={styles.statDesc}>Check Status</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        {['Home', 'Tasks'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={styles.navItem}
            onPress={() => handleNavigation(tab)}
          >
            <Ionicons
              name={tab === 'Home' ? 'home' : 'list'}
              size={24}
              color={activeTab === tab ? RED_ACCENT : GREY}
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
  safeArea: { flex: 1, backgroundColor: BG_COLOR },
  backgroundPattern: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
    overflow: 'hidden',
  },
  bgIcon: {
    position: 'absolute',
  },
  fixedHeader: { 
    backgroundColor: '#fff', 
    paddingHorizontal: 20, 
    paddingTop: 50, 
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#FFEBEE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  container: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 100 },
  header: { flexDirection: 'row', alignItems: 'center' },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: RED_ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: DARK },
  headerSubtitle: { fontSize: 11, color: GREY, fontWeight: '600', letterSpacing: 0.5 },
  logoutButton: { 
    marginLeft: 'auto', 
    padding: 8, 
    backgroundColor: '#FFEBEE', 
    borderRadius: 8 
  },
  welcomeSection: { marginBottom: 24 },
  welcomeText: { fontSize: 24, fontWeight: '700', color: DARK },
  dateText: { fontSize: 14, color: GREY, marginTop: 4 },
  sectionTitleRow: { marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: DARK },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  statCard: { 
    flex: 1, 
    borderRadius: 16, 
    padding: 16, 
    position: 'relative',
    minHeight: 110,
    justifyContent: 'center',
  },
  cardShadow: {
    shadowColor: '#D32F2F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statLabel: { fontSize: 15, fontWeight: '700', color: DARK },
  statDesc: { fontSize: 11, color: GREY, marginTop: 2 },
  notificationBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: RED_ACCENT,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  notificationText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
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
    borderTopColor: '#FFEBEE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 10,
  },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  navLabel: { fontSize: 12, color: GREY, marginTop: 4, fontWeight: '500' },
  navLabelActive: { color: RED_ACCENT, fontWeight: '700' },
});