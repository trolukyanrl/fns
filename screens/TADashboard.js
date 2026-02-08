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
  { id: 'BA-SET-042', title: 'Zone A-3 Inspection', time: 'Today, 10:00 AM', location: 'Zone A-3', status: 'Pending', progress: 0, assignedBy: 'SIC' },
  { id: 'SK-015', title: 'Safety Kit Check - B Wing', time: 'Today, 2:30 PM', location: 'Zone B-1', status: 'Pending', progress: 0, assignedBy: 'SIC' },
  { id: 'BA-SET-045', title: 'Equipment Check - C Zone', time: 'Today, 4:00 PM', location: 'Zone C-2', status: 'Pending', progress: 0, assignedBy: 'SIC' },
  { id: 'SK-018', title: 'Cylinder Inspection', time: 'Yesterday, 3:00 PM', location: 'Zone A-1', status: 'Pending', progress: 0, assignedBy: 'SIC' },
  { id: 'SK-020', title: 'Emergency Kit Inspection', time: 'Today, 11:00 AM', location: 'Zone D-3', status: 'Pending', progress: 0, assignedBy: 'SIC' },
  { id: 'BA-SET-048', title: 'Fire Extinguisher Inspection', time: 'Yesterday, 5:00 PM', location: 'Zone D-2', status: 'Pending for Approval', progress: 100 },
  { id: 'SK-022', title: 'Emergency Exit Check', time: '2 days ago', location: 'Zone C-1', status: 'Pending for Approval', progress: 100 },
  { id: 'BA-SET-035', title: 'Valve Test - A Wing', time: '2 days ago', location: 'Zone A-5', status: 'Completed', progress: 100 },
  { id: 'SK-010', title: 'Pressure Check', time: '3 days ago', location: 'Zone B-3', status: 'Completed', progress: 100 },
];

export default function TADashboard({ navigation }) {
  const [activeTab, setActiveTab] = useState('Home');

  const handleNavigation = (tab) => {
    setActiveTab(tab);
    if (tab === 'Home') navigation.navigate('TADashboard');
    if (tab === 'Tasks') navigation.navigate('Tasks');
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
            <Text style={styles.headerTitle}>Welcome back, Rajesh</Text>
            <Text style={styles.headerSubtitle}>Ready for today's inspections?</Text>
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
        </View>

        {/* Approval Status Cards */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, styles.statReview]}>
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Pending for Approval</Text>
          </View>
          <View style={[styles.statCard, styles.statRejected]}>
            <Text style={styles.statNumber}>2</Text>
            <Text style={styles.statLabel}>Rejected</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <TouchableOpacity 
          style={styles.quickActionCard} 
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Tasks')}
        >
          <View style={styles.quickActionIcon}>
            <Ionicons name="grid-outline" size={28} color="#fff" />
            <View style={styles.qrBadge}>
              <Ionicons name="qr-code-outline" size={12} color="#fff" />
            </View>
          </View>
          <Text style={styles.quickActionTitle}>Scan QR Code</Text>
          <Text style={styles.quickActionSubtitle}>Start inspection by scanning equipment</Text>
        </TouchableOpacity>

        {/* My Tasks */}
        <View style={styles.tasksHeader}>
          <Text style={styles.sectionTitle}>My Tasks</Text>
          <TouchableOpacity onPress={() => handleNavigation('Tasks')}>
            <Text style={styles.viewAllLink}>View All</Text>
          </TouchableOpacity>
        </View>

        {TASKS.filter(task => task.status === 'Pending').map((task) => (
          <TouchableOpacity key={task.id} style={styles.taskCard} onPress={() => navigation.navigate('TaskDetails', { task })}>
            <View style={styles.taskHeader}>
              <Text style={styles.taskId}>{task.id}</Text>
              <View style={[
                styles.statusBadge,
                task.status === 'Pending' && styles.statusPending,
                task.status === 'Pending for Approval' && styles.statusApproval,
                task.status === 'Completed' && styles.statusCompleted,
                task.status === 'Rejected' && styles.statusRejected,
              ]}>
                <Text style={[
                  styles.statusText,
                  task.status === 'Pending' && styles.statusTextPending,
                  task.status === 'Pending for Approval' && styles.statusTextApproval,
                  task.status === 'Completed' && styles.statusTextCompleted,
                  task.status === 'Rejected' && styles.statusTextRejected,
                ]}>
                  {task.status}
                </Text>
              </View>
            </View>
            
            {/* Assignment Details for Pending Tasks */}
            {task.status === 'Pending' ? (
              <>
                <Text style={styles.taskTitle}>{task.id.startsWith('SK-') ? 'Safety Kit Inspection' : 'BA Set Inspection'}</Text>
                <View style={styles.taskDetails}>
                  <Ionicons name="person-circle-outline" size={14} color={LIGHT_GREY} />
                  <Text style={styles.taskDetailText}>Assigned to: Rajesh Kumar</Text>
                </View>
                <View style={styles.taskDetails}>
                  <Ionicons name="calendar-outline" size={14} color={LIGHT_GREY} />
                  <Text style={styles.taskDetailText}>Due: 15 Feb 2024</Text>
                </View>
                <View style={styles.taskDetails}>
                  <Ionicons name={task.id.startsWith('SK-') ? "construct" : "cube-outline"} size={14} color={LIGHT_GREY} />
                  <Text style={styles.taskDetailText}>{task.id.startsWith('SK-') ? 'Safety Kit' : 'BA Set'}: {task.id}</Text>
                </View>
                <View style={styles.taskDetails}>
                  <Ionicons name="location-outline" size={14} color={LIGHT_GREY} />
                  <Text style={styles.taskDetailText}>{task.location}</Text>
                </View>
              </>
            ) : (
              <>
                <Text style={styles.taskTitle}>{task.title}</Text>
                <View style={styles.taskDetails}>
                  <Ionicons name="calendar-outline" size={14} color={LIGHT_GREY} />
                  <Text style={styles.taskDetailText}>{task.time}</Text>
                </View>
                <View style={styles.taskDetails}>
                  <Ionicons name="location-outline" size={14} color={LIGHT_GREY} />
                  <Text style={styles.taskDetailText}>{task.location}</Text>
                </View>
                {task.progress > 0 && (
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${task.progress}%` }]} />
                  </View>
                )}
                {task.progress > 0 && <Text style={styles.progressText}>{task.progress}%</Text>}
              </>
            )}
          </TouchableOpacity>
        ))}
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
              name={
                tab === 'Home'
                  ? 'home'
                  : 'checkbox-outline'
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
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  statCard: { flex: 1, padding: 16, borderRadius: 12 },
  statPending: { backgroundColor: '#E3F2FD' },
  statCompleted: { backgroundColor: '#E8F5E9' },
  statReview: { backgroundColor: '#FFF8E1' },
  statRejected: { backgroundColor: '#FFE8E8' },
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
  statusPending: { backgroundColor: '#FFF8E1', borderColor: '#FFE0B2' },
  statusTextPending: { color: '#F57F17' },
  statusApproval: { backgroundColor: '#F3E5F5', borderColor: '#E1BEE7' },
  statusTextApproval: { color: '#7B1FA2' },
  statusCompleted: { backgroundColor: '#E8F5E9', borderColor: '#C8E6C9' },
  statusTextCompleted: { color: '#2E7D32' },
  statusRejected: { backgroundColor: '#FFEBEE', borderColor: '#FFCDD2' },
  statusTextRejected: { color: '#D32F2F' },
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
