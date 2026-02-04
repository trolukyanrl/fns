import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BLUE = '#4285F4';
const DARK_GREY = '#333333';
const LIGHT_GREY = '#666666';

const TASKS = [
  { id: 'BA-SET-042', title: 'Zone A-3 Inspection', time: 'Today, 10:00 AM', location: 'Zone A-3', status: 'Pending', progress: 0 },
  { id: 'SK-015', title: 'Safety Kit Check - B Wing', time: 'Today, 2:30 PM', location: 'Zone B-1', status: 'Pending', progress: 0 },
];

export default function TADashboard({ navigation }) {
  const [activeTab, setActiveTab] = useState('Home');

  const handleNavigation = (tab) => {
    setActiveTab(tab);
    if (tab === 'Home') navigation.navigate('TADashboard');
    if (tab === 'Tasks') navigation.navigate('Tasks');
    if (tab === 'Profile') navigation.navigate('Profile');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoIcon}>
            <Ionicons name="shield-checkmark" size={24} color="#fff" />
          </View>
          <View>
            <Text style={styles.headerTitle}>Safety Inspector</Text>
            <Text style={styles.headerSubtitle}>FNS Safety Manager</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.bellButton}>
          <Ionicons name="notifications-outline" size={24} color={DARK_GREY} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <View style={styles.profileCircle}>
            <Ionicons name="person" size={32} color={BLUE} />
          </View>
          <View style={styles.welcomeText}>
            <Text style={styles.welcomeTitle}>Welcome back, Rajesh</Text>
            <Text style={styles.welcomeSubtitle}>Ready for today's inspections?</Text>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, styles.statPending]}>
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={[styles.statCard, styles.statCompleted]}>
            <Text style={styles.statNumber}>24</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={[styles.statCard, styles.statReview]}>
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Review</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <TouchableOpacity 
          style={styles.quickActionCard} 
          activeOpacity={0.8}
          onPress={() => navigation.navigate('QRScanner')}
        >
          <View style={styles.quickActionIcon}>
            <Ionicons name="grid-outline" size={28} color="#fff" />
            <View style={styles.qrBadge}>
              <Ionicons name="qr-code-outline" size={12} color="#fff" />
            </View>
          </View>
          <Text style={styles.quickActionTitle}>Scan BA Set QR Code</Text>
          <Text style={styles.quickActionSubtitle}>Start inspection by scanning equipment</Text>
        </TouchableOpacity>

        {/* My Tasks */}
        <View style={styles.tasksHeader}>
          <Text style={styles.sectionTitle}>My Tasks</Text>
          <TouchableOpacity onPress={() => handleNavigation('Tasks')}>
            <Text style={styles.viewAllLink}>View All</Text>
          </TouchableOpacity>
        </View>

        {TASKS.map((task) => (
          <View key={task.id} style={styles.taskCard}>
            <View style={styles.taskHeader}>
              <Text style={styles.taskId}>{task.id}</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{task.status}</Text>
              </View>
            </View>
            <Text style={styles.taskTitle}>{task.title}</Text>
            <View style={styles.taskDetails}>
              <Ionicons name="calendar-outline" size={14} color={LIGHT_GREY} />
              <Text style={styles.taskDetailText}>{task.time}</Text>
            </View>
            <View style={styles.taskDetails}>
              <Ionicons name="location-outline" size={14} color={LIGHT_GREY} />
              <Text style={styles.taskDetailText}>{task.location}</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${task.progress}%` }]} />
            </View>
            <Text style={styles.progressText}>{task.progress}%</Text>
          </View>
        ))}
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
              color={activeTab === tab ? BLUE : LIGHT_GREY}
            />
            <Text style={[styles.navLabel, activeTab === tab && styles.navLabelActive]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 48, paddingBottom: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E8E8E8' },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  logoIcon: { width: 44, height: 44, borderRadius: 10, backgroundColor: BLUE, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: DARK_GREY },
  headerSubtitle: { fontSize: 12, color: LIGHT_GREY, marginTop: 2 },
  bellButton: { padding: 8 },
  scrollView: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 100 },
  welcomeSection: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  profileCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#E8F0FE', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  welcomeText: {},
  welcomeTitle: { fontSize: 18, fontWeight: '600', color: DARK_GREY },
  welcomeSubtitle: { fontSize: 14, color: LIGHT_GREY, marginTop: 4 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  statCard: { flex: 1, padding: 16, borderRadius: 12 },
  statPending: { backgroundColor: '#E3F2FD' },
  statCompleted: { backgroundColor: '#E8F5E9' },
  statReview: { backgroundColor: '#FFF8E1' },
  statNumber: { fontSize: 24, fontWeight: '700', color: DARK_GREY },
  statLabel: { fontSize: 12, color: LIGHT_GREY, marginTop: 4 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: DARK_GREY, marginBottom: 12 },
  quickActionCard: { backgroundColor: BLUE, borderRadius: 16, padding: 24, alignItems: 'center', marginBottom: 24 },
  quickActionIcon: { width: 56, height: 56, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  qrBadge: { position: 'absolute', bottom: -4, right: -4, width: 24, height: 24, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.3)', alignItems: 'center', justifyContent: 'center' },
  quickActionTitle: { fontSize: 18, fontWeight: '700', color: '#fff', marginBottom: 4 },
  quickActionSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.9)' },
  tasksHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  viewAllLink: { fontSize: 14, fontWeight: '600', color: BLUE },
  taskCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  taskHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  taskId: { fontSize: 12, fontWeight: '600', color: LIGHT_GREY },
  statusBadge: { backgroundColor: '#FFF8E1', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 12, fontWeight: '600', color: '#F9A825' },
  taskTitle: { fontSize: 16, fontWeight: '600', color: DARK_GREY, marginBottom: 12 },
  taskDetails: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  taskDetailText: { fontSize: 14, color: LIGHT_GREY, marginLeft: 8 },
  progressBar: { height: 4, backgroundColor: '#E8E8E8', borderRadius: 2, marginTop: 12, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: BLUE, borderRadius: 2 },
  progressText: { fontSize: 12, color: LIGHT_GREY, marginTop: 4 },
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', backgroundColor: '#fff', paddingVertical: 12, paddingHorizontal: 20, borderTopWidth: 1, borderTopColor: '#E8E8E8' },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  navLabel: { fontSize: 12, color: LIGHT_GREY, marginTop: 4 },
  navLabelActive: { color: BLUE, fontWeight: '600' },
});
