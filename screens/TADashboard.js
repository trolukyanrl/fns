import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../AuthContext';
import { useTaskContext } from '../TaskContext';

const RED_ACCENT = '#D32F2F';
const RED_LIGHT = '#FEE2E2';
const BLUE_ACCENT = '#1976D2';
const DARK = '#1F2937';
const GREY = '#6B7280';
const GREEN = '#388E3C';
const YELLOW = '#FBC02D';
const BG_COLOR = '#FFF5F5';

export default function TADashboard({ navigation }) {
  const [activeTab, setActiveTab] = useState('Home');
  const { user } = useAuth();
  const { tasks, refreshTasks, loading } = useTaskContext();

  const onRefresh = useCallback(() => {
    refreshTasks();
  }, [refreshTasks]);

  // Filter tasks to show only those assigned to the current user
  const userTasks = tasks.filter(task => {
    return task.assignedTo === user?.username || 
           task.assignedTo === user?.name ||
           task.assignedToName === user?.name ||
           task.assignedToName === user?.username;
  });

  // Get task statistics for current user
  const pendingTasks = userTasks.filter(task => task.status === 'Pending');
  const completedTasks = userTasks.filter(task => task.status === 'Completed' || task.status === 'Approved');
  const pendingApprovalTasks = userTasks.filter(task => task.status === 'Pending for Approval');
  const rejectedTasks = userTasks.filter(task => task.status === 'Rejected');

  const handleNavigation = (tab) => {
    setActiveTab(tab);
    if (tab === 'Home') navigation.navigate('TADashboard');
    if (tab === 'Tasks') navigation.navigate('Tasks');
  };

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <View style={styles.container}>
      {/* Background Pattern */}
      <View style={styles.backgroundPattern}>
        <Ionicons name="construct" size={150} color="rgba(211, 47, 47, 0.03)" style={[styles.bgIcon, { top: 50, right: -20 }]} />
        <Ionicons name="clipboard" size={120} color="rgba(211, 47, 47, 0.03)" style={[styles.bgIcon, { bottom: 100, left: -30 }]} />
      </View>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoIcon}>
            <Ionicons name="construct" size={24} color="#fff" />
          </View>
          <View>
            <Text style={styles.headerTitle}>Welcome, {user?.name || 'Technician'}</Text>
            <Text style={styles.headerSubtitle}>Ready for inspection?</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={22} color={DARK} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} style={[styles.iconButton, { backgroundColor: '#FFEBEE' }]}>
            <Ionicons name="log-out-outline" size={22} color={RED_ACCENT} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} colors={[RED_ACCENT]} />
        }
      >
        {/* Quick Stats - Row 1 */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, styles.cardShadow, { backgroundColor: '#fff', borderTopWidth: 4, borderTopColor: YELLOW }]}>
            <View style={[styles.statIcon, { backgroundColor: '#FFF9C4' }]}>
              <Ionicons name="time" size={20} color="#F57F17" />
            </View>
            <Text style={styles.statNumber}>{pendingTasks.length}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>

          <View style={[styles.statCard, styles.cardShadow, { backgroundColor: '#fff', borderTopWidth: 4, borderTopColor: GREEN }]}>
            <View style={[styles.statIcon, { backgroundColor: '#E8F5E9' }]}>
              <Ionicons name="checkmark-circle" size={20} color={GREEN} />
            </View>
            <Text style={styles.statNumber}>{completedTasks.length}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>

        {/* Quick Stats - Row 2 */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, styles.cardShadow, { backgroundColor: '#fff', borderTopWidth: 4, borderTopColor: BLUE_ACCENT }]}>
            <View style={[styles.statIcon, { backgroundColor: '#E3F2FD' }]}>
              <Ionicons name="document-text" size={20} color={BLUE_ACCENT} />
            </View>
            <Text style={styles.statNumber}>{pendingApprovalTasks.length}</Text>
            <Text style={styles.statLabel}>Pending for Approval</Text>
          </View>

          <View style={[styles.statCard, styles.cardShadow, { backgroundColor: '#fff', borderTopWidth: 4, borderTopColor: RED_ACCENT }]}>
            <View style={[styles.statIcon, { backgroundColor: '#FFEBEE' }]}>
              <Ionicons name="alert-circle" size={20} color={RED_ACCENT} />
            </View>
            <Text style={styles.statNumber}>{rejectedTasks.length}</Text>
            <Text style={styles.statLabel}>Rejected</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <TouchableOpacity 
          style={[styles.quickActionCard, styles.cardShadow]} 
          activeOpacity={0.9}
          onPress={() => navigation.navigate('Tasks')}
        >
          <View style={styles.actionContent}>
            <View style={styles.actionIconContainer}>
              <Ionicons name="qr-code" size={32} color="#fff" />
            </View>
            <View style={styles.actionTextContainer}>
              <Text style={styles.quickActionTitle}>Scan Equipment</Text>
              <Text style={styles.quickActionSubtitle}>Start inspection via QR code</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#fff" style={{ opacity: 0.8 }} />
          </View>
        </TouchableOpacity>

        {/* My Tasks */}
        <View style={styles.tasksHeader}>
          <Text style={styles.sectionTitle}>My Tasks</Text>
          <TouchableOpacity onPress={() => handleNavigation('Tasks')}>
            <Text style={styles.viewAllLink}>View All</Text>
          </TouchableOpacity>
        </View>

        {pendingTasks.length === 0 ? (
          <View style={styles.noTasksContainer}>
            <View style={styles.noTasksIcon}>
              <Ionicons name="checkmark-done" size={40} color={GREEN} />
            </View>
            <Text style={styles.noTasksText}>All caught up!</Text>
            <Text style={styles.noTasksSubtext}>No pending tasks assigned to you.</Text>
          </View>
        ) : (
          <View style={styles.taskList}>
            {userTasks.filter(task => task.status === 'Pending').map((task) => {
              const item = task.baSets && task.baSets[0] ? task.baSets[0] : (task.safetyKits && task.safetyKits[0] ? task.safetyKits[0] : null);
              const displayId = item?.id || task.id;
              const displayLocation = item?.zone || 'Location TBA';

              return (
                <TouchableOpacity 
                  key={task.id} 
                  style={[styles.taskCard, styles.cardShadow]} 
                  onPress={() => navigation.navigate('TaskDetails', { task })}
                >
                  <View style={styles.taskCardHeader}>
                    <View style={styles.taskTypeTag}>
                      <Ionicons name={task.taskType === 'SK' ? "construct" : "cube"} size={12} color={RED_ACCENT} />
                      <Text style={styles.taskTypeText}>{task.taskType}</Text>
                    </View>
                    <Text style={styles.dueDateText}>Due: {task.dueDate}</Text>
                  </View>

                  <Text style={styles.taskTitle}>{task.description}</Text>
                  
                  <View style={styles.taskFooter}>
                    <View style={styles.locationBadge}>
                      <Ionicons name="location" size={12} color={GREY} />
                      <Text style={styles.locationText}>{displayLocation}</Text>
                    </View>
                    <Ionicons name="chevron-forward-circle" size={24} color={RED_ACCENT} />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
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
  container: { flex: 1, backgroundColor: BG_COLOR },
  backgroundPattern: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
    overflow: 'hidden',
  },
  bgIcon: {
    position: 'absolute',
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    paddingTop: 48, 
    paddingBottom: 16, 
    backgroundColor: '#fff', 
    borderBottomWidth: 1, 
    borderBottomColor: '#FFEBEE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  logoIcon: { 
    width: 44, 
    height: 44, 
    borderRadius: 12, 
    backgroundColor: RED_ACCENT, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginRight: 12 
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: DARK },
  headerSubtitle: { fontSize: 12, color: GREY, marginTop: 2, fontWeight: '500' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconButton: { 
    padding: 8, 
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  scrollView: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 100 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  statCard: { flex: 1, padding: 12, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  statIcon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  statNumber: { fontSize: 20, fontWeight: '800', color: DARK },
  statLabel: { fontSize: 11, color: GREY, marginTop: 2, fontWeight: '600' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: DARK, marginBottom: 12 },
  quickActionCard: { 
    backgroundColor: RED_ACCENT, 
    borderRadius: 16, 
    padding: 20, 
    marginBottom: 24,
    overflow: 'hidden',
  },
  actionContent: { flexDirection: 'row', alignItems: 'center' },
  actionIconContainer: { 
    width: 50, 
    height: 50, 
    borderRadius: 12, 
    backgroundColor: 'rgba(255,255,255,0.2)', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginRight: 16 
  },
  actionTextContainer: { flex: 1 },
  quickActionTitle: { fontSize: 18, fontWeight: '700', color: '#fff', marginBottom: 4 },
  quickActionSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.9)' },
  tasksHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  viewAllLink: { fontSize: 14, fontWeight: '600', color: RED_ACCENT },
  taskList: { gap: 12 },
  taskCard: { 
    backgroundColor: '#fff', 
    borderRadius: 16, 
    padding: 16, 
    borderLeftWidth: 4, 
    borderLeftColor: YELLOW 
  },
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  taskCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  taskTypeTag: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 4, 
    backgroundColor: '#FFEBEE', 
    paddingHorizontal: 8, 
    paddingVertical: 4, 
    borderRadius: 6 
  },
  taskTypeText: { fontSize: 11, fontWeight: '700', color: RED_ACCENT },
  dueDateText: { fontSize: 11, color: GREY, fontWeight: '500' },
  taskTitle: { fontSize: 15, fontWeight: '700', color: DARK, marginBottom: 12 },
  taskFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  locationBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  locationText: { fontSize: 12, color: GREY },
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
  noTasksContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40 },
  noTasksIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  noTasksText: { fontSize: 16, color: DARK, fontWeight: '700' },
  noTasksSubtext: { fontSize: 13, color: GREY, marginTop: 4 },
});
