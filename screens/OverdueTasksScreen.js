import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BLUE = '#2563EB';
const DARK = '#1F2937';
const GREY = '#6B7280';
const LIGHT_GREY = '#9CA3AF';
const WHITE = '#FFFFFF';
const GREEN = '#22C55E';
const RED = '#EF4444';
const YELLOW = '#F59E0B';
const ORANGE = '#F97316';

// Sample overdue tasks data
const OVERDUE_TASKS = [
  {
    id: 'TASK-2024-001',
    assetId: 'BA-SET-042',
    assignedTo: 'Amit R.',
    department: 'Safety',
    assignedDate: 'Feb 2, 2024',
    dueDate: 'Feb 3, 2024',
    status: 'Overdue',
    daysOverdue: 1,
    location: 'Zone A-3',
    taskType: 'BA Set Inspection',
    priority: 'High',
    assignedBy: 'SIC Manager',
    description: 'Complete inspection of BA Set including pressure testing, flow rate verification, and all safety checks.',
    lastUpdated: 'Feb 3, 2024 - 5:30 PM',
    remarks: 'Task assigned but not started. Equipment needs immediate inspection due to upcoming safety audit.',
  },
  {
    id: 'TASK-2024-002',
    assetId: 'SK-015',
    assignedTo: 'Sarah K.',
    department: 'Operations',
    assignedDate: 'Jan 30, 2024',
    dueDate: 'Feb 1, 2024',
    status: 'Overdue',
    daysOverdue: 3,
    location: 'Zone B-1',
    taskType: 'Self-Contained Kit Check',
    priority: 'Medium',
    assignedBy: 'SIC Manager',
    description: 'Check all components of Self-Contained Kit including oxygen levels, pressure gauges, and emergency systems.',
    lastUpdated: 'Jan 31, 2024 - 2:15 PM',
    remarks: 'Task partially completed. Oxygen levels checked but pressure gauges not verified.',
  },
  {
    id: 'TASK-2024-003',
    assetId: 'BA-SET-045',
    assignedTo: 'Raj P.',
    department: 'Maintenance',
    assignedDate: 'Jan 28, 2024',
    dueDate: 'Jan 30, 2024',
    status: 'Overdue',
    daysOverdue: 5,
    location: 'Zone C-2',
    taskType: 'BA Set Maintenance',
    priority: 'High',
    assignedBy: 'SIC Manager',
    description: 'Complete maintenance and servicing of BA Set including filter replacement and system calibration.',
    lastUpdated: 'Jan 29, 2024 - 11:45 AM',
    remarks: 'Task not started. Equipment has been idle for extended period and requires immediate attention.',
  },
];

export default function OverdueTasksScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('Home');
  const [searchText, setSearchText] = useState('');

  const handleNavigation = (tab) => {
    setActiveTab(tab);
    if (tab === 'Home') navigation.navigate('SICDashboard');
    if (tab === 'Tasks') navigation.navigate('SICTasks');
    if (tab === 'Profile') navigation.navigate('SICProfile');
  };

  const handleReassign = (task) => {
    Alert.alert(
      'Reassign Task',
      `Are you sure you want to reassign task ${task.id} to another technician?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reassign',
          style: 'default',
          onPress: () => {
            Alert.alert(
              'Task Reassigned',
              `Task ${task.id} has been reassigned successfully.`,
              [{ text: 'OK' }]
            );
          }
        }
      ]
    );
  };


  const TaskCard = ({ task }) => (
    <View style={styles.taskCard}>
      <View style={styles.taskHeader}>
        <View style={styles.taskInfo}>
          <Text style={styles.taskId}>{task.id}</Text>
          <Text style={styles.taskAsset}>{task.assetId}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: '#FEF3C7' }]}>
          <Text style={[styles.statusText, { color: ORANGE }]}>{task.status}</Text>
        </View>
      </View>

      <View style={styles.taskDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="person-outline" size={14} color={GREY} />
          <Text style={styles.detailText}>{task.assignedTo}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="business-outline" size={14} color={GREY} />
          <Text style={styles.detailText}>{task.department}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={14} color={GREY} />
          <Text style={styles.detailText}>Due: {task.dueDate}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="location-outline" size={14} color={GREY} />
          <Text style={styles.detailText}>{task.location}</Text>
        </View>
      </View>

      <View style={styles.prioritySection}>
        <View style={styles.priorityRow}>
          <View style={[styles.priorityDot, { backgroundColor: task.priority === 'High' ? RED : YELLOW }]} />
        </View>
        <Text style={styles.daysOverdue}>{task.daysOverdue} days overdue</Text>
      </View>

      <View style={styles.taskSummary}>
        <Text style={styles.summaryTitle}>Task Details</Text>
        <Text style={styles.taskDescription}>{task.description}</Text>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.reassignButton} onPress={() => handleReassign(task)}>
          <Ionicons name="swap-horizontal-outline" size={18} color={WHITE} />
          <Text style={styles.reassignButtonText}>Reassign</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color={DARK} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Overdue Tasks</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search-outline" size={20} color={GREY} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search overdue tasks..."
              placeholderTextColor={LIGHT_GREY}
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
        </View>


        {/* Filtered Overdue Tasks List */}
        {(() => {
          const filteredTasks = OVERDUE_TASKS.filter(task => {
            const searchLower = searchText.toLowerCase();
            return (
              task.id.toLowerCase().includes(searchLower) ||
              task.assetId.toLowerCase().includes(searchLower) ||
              task.assignedTo.toLowerCase().includes(searchLower) ||
              task.department.toLowerCase().includes(searchLower) ||
              task.location.toLowerCase().includes(searchLower) ||
              task.description.toLowerCase().includes(searchLower)
            );
          });

          return filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={64} color={GREY} />
              <Text style={styles.emptyStateText}>No matching tasks found</Text>
              <Text style={styles.emptyStateSubtext}>Try adjusting your search criteria</Text>
            </View>
          );
        })()}
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
  container: { paddingHorizontal: 20, paddingTop: 40, paddingBottom: 100 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: DARK },
  searchContainer: { marginBottom: 24 },
  searchInputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: WHITE, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, elevation: 2 },
  searchInput: { flex: 1, fontSize: 16, color: DARK, marginLeft: 12 },
  statsContainer: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  statCard: { flex: 1, backgroundColor: WHITE, borderRadius: 12, padding: 16, alignItems: 'center' },
  statNumber: { fontSize: 20, fontWeight: '700', color: DARK, marginBottom: 4 },
  statLabel: { fontSize: 12, color: GREY },
  taskCard: { backgroundColor: WHITE, borderRadius: 12, padding: 16, marginBottom: 16, elevation: 2 },
  taskHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  taskInfo: { flex: 1 },
  taskId: { fontSize: 12, fontWeight: '600', color: GREY, marginBottom: 2 },
  taskAsset: { fontSize: 16, fontWeight: '700', color: DARK },
  statusBadge: { backgroundColor: '#FEF3C7', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 11, fontWeight: '600', color: ORANGE },
  taskDetails: { marginBottom: 12 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  detailText: { fontSize: 12, color: GREY },
  prioritySection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  priorityRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  priorityDot: { width: 8, height: 8, borderRadius: 4 },
  priorityText: { fontSize: 12, fontWeight: '600', color: GREY },
  daysOverdue: { fontSize: 12, fontWeight: '700', color: RED },
  taskSummary: { marginBottom: 12 },
  summaryTitle: { fontSize: 14, fontWeight: '600', color: DARK, marginBottom: 6 },
  taskType: { fontSize: 14, fontWeight: '600', color: BLUE, marginBottom: 4 },
  taskDescription: { fontSize: 12, color: GREY, lineHeight: 16 },
  remarksSection: { backgroundColor: '#F9FAFB', borderRadius: 8, padding: 12, marginBottom: 16 },
  remarksLabel: { fontSize: 12, fontWeight: '600', color: GREY, marginBottom: 6 },
  remarksText: { fontSize: 13, color: DARK, lineHeight: 18 },
  actionButtons: { flexDirection: 'row', gap: 12 },
  reassignButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: YELLOW, borderRadius: 8, paddingVertical: 12 },
  reassignButtonText: { fontSize: 14, fontWeight: '700', color: '#78350F', marginLeft: 8 },
  escalateButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: RED, borderRadius: 8, paddingVertical: 12 },
  escalateButtonText: { fontSize: 14, fontWeight: '700', color: WHITE, marginLeft: 8 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 60 },
  emptyStateText: { fontSize: 16, fontWeight: '600', color: DARK, marginTop: 16 },
  emptyStateSubtext: { fontSize: 14, color: GREY, marginTop: 8 },
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', backgroundColor: WHITE, paddingVertical: 12, paddingHorizontal: 20, borderTopWidth: 1, borderTopColor: '#E8E8E8' },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  navLabel: { fontSize: 12, color: GREY, marginTop: 4 },
  navLabelActive: { color: BLUE, fontWeight: '600' },
});