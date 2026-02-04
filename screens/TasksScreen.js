import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BLUE = '#4285F4';
const DARK_GREY = '#333333';
const LIGHT_GREY = '#666666';
const GREEN = '#4CAF50';
const ORANGE = '#F9A825';
const PURPLE = '#9C27B0';

const TASKS = [
  { id: 'BA-SET-042', title: 'Zone A-3 Inspection', time: 'Today, 10:00 AM', location: 'Zone A-3', status: 'Pending', progress: 0 },
  { id: 'SK-015', title: 'Safety Kit Check - B Wing', time: 'Today, 2:30 PM', location: 'Zone B-1', status: 'Pending', progress: 0 },
  { id: 'BA-SET-045', title: 'Equipment Check - C Zone', time: 'Today, 4:00 PM', location: 'Zone C-2', status: 'Pending for Approval', progress: 100 },
  { id: 'SK-018', title: 'Cylinder Inspection', time: 'Yesterday, 3:00 PM', location: 'Zone A-1', status: 'Pending for Approval', progress: 100 },
  { id: 'BA-SET-035', title: 'Valve Test - A Wing', time: '2 days ago', location: 'Zone A-5', status: 'Completed', progress: 100 },
  { id: 'SK-010', title: 'Pressure Check', time: '3 days ago', location: 'Zone B-3', status: 'Completed', progress: 100 },
];

export default function TasksScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('Tasks');
  const [filter, setFilter] = useState('All'); // New state for filtering
  const [expandedSections, setExpandedSections] = useState({
    pending: true,
    approval: true,
    completed: true,
  });

  const handleNavigation = (tab) => {
    setActiveTab(tab);
    if (tab === 'Home') navigation.navigate('TADashboard');
    if (tab === 'Tasks') navigation.navigate('Tasks');
    if (tab === 'Profile') navigation.navigate('Profile');
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Separate tasks by status
  const pendingTasks = TASKS.filter(task => task.status === 'Pending');
  const pendingApprovalTasks = TASKS.filter(task => task.status === 'Pending for Approval');
  const completedTasks = TASKS.filter(task => task.status === 'Completed');

  const TaskCard = ({ task }) => (
    <View style={styles.taskCard}>
      <View style={styles.taskHeader}>
        <Text style={styles.taskId}>{task.id}</Text>
        <View style={[
          styles.statusBadge,
          task.status === 'Pending' && styles.statusPending,
          task.status === 'Pending for Approval' && styles.statusApproval,
          task.status === 'Completed' && styles.statusCompleted,
        ]}>
          <Text style={[
            styles.statusText,
            task.status === 'Pending' && styles.statusTextPending,
            task.status === 'Pending for Approval' && styles.statusTextApproval,
            task.status === 'Completed' && styles.statusTextCompleted,
          ]}>
            {task.status}
          </Text>
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
      {task.progress > 0 && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${task.progress}%` }]} />
          </View>
          <Text style={styles.progressText}>{task.progress}%</Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.pageTitle}>My Tasks</Text>
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'All' && styles.filterButtonActive]}
          onPress={() => setFilter('All')}
        >
          <Text style={[styles.filterButtonText, filter === 'All' && styles.filterButtonTextActive]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'Pending Task' && styles.filterButtonActive]}
          onPress={() => setFilter('Pending Task')}
        >
          <Text style={[styles.filterButtonText, filter === 'Pending Task' && styles.filterButtonTextActive]}>Pending Task</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'Pending for Approval' && styles.filterButtonActive]}
          onPress={() => setFilter('Pending for Approval')}
        >
          <Text style={[styles.filterButtonText, filter === 'Pending for Approval' && styles.filterButtonTextActive]}>Pending for Approval</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'Task Completed' && styles.filterButtonActive]}
          onPress={() => setFilter('Task Completed')}
        >
          <Text style={[styles.filterButtonText, filter === 'Task Completed' && styles.filterButtonTextActive]}>Task Completed</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mainContent}>
        {/* Show Filtered Tasks */}
        {(() => {
          let tasksToShow = [];
          let emptyMessage = '';
          
          if (filter === 'All') {
            tasksToShow = TASKS;
          } else if (filter === 'Pending Task') {
            tasksToShow = pendingTasks;
            emptyMessage = 'No pending task tasks found';
          } else if (filter === 'Pending for Approval') {
            tasksToShow = pendingApprovalTasks;
            emptyMessage = 'No pending for approval tasks found';
          } else if (filter === 'Task Completed') {
            tasksToShow = completedTasks;
            emptyMessage = 'No task completed tasks found';
          }

          if (tasksToShow.length > 0) {
            return (
              <FlatList
                data={tasksToShow}
                keyExtractor={(item) => item.id}
                scrollEnabled={true}
                nestedScrollEnabled={true}
                style={styles.tasksList}
                contentContainerStyle={styles.tasksListContent}
                renderItem={({ item }) => <TaskCard task={item} />}
              />
            );
          } else {
            return (
              <View style={styles.emptyState}>
                <Ionicons name="checkmark-circle-outline" size={48} color={LIGHT_GREY} />
                <Text style={styles.emptyStateText}>{emptyMessage}</Text>
              </View>
            );
          }
        })()}
      </View>

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
  container: { 
    flex: 1, 
    backgroundColor: '#F8F9FA' 
  },
  header: { 
    paddingTop: 48, 
    paddingHorizontal: 20, 
    paddingBottom: 16, 
    backgroundColor: '#fff', 
    borderBottomWidth: 2, 
    borderBottomColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2
  },
  pageTitle: { 
    fontSize: 24, 
    fontWeight: '800', 
    color: DARK_GREY,
    letterSpacing: -0.5
  },
  
  mainContent: {
    flex: 1,
    padding: 12,
    gap: 12,
  },
  
  section: { 
    flex: 1,
    borderRadius: 12, 
    overflow: 'hidden',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 1 }, 
    shadowOpacity: 0.05, 
    shadowRadius: 3, 
    elevation: 1,
    minHeight: 100,
  },
  
  sectionHeaderButton: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F9F9F9',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  sectionHeaderLeft: { 
    flexDirection: 'column', 
    gap: 2, 
    flex: 1 
  },
  sectionLabelContainer: {
    gap: 2,
  },
  sectionTitle: { 
    fontSize: 15, 
    fontWeight: '700', 
    color: DARK_GREY,
    letterSpacing: -0.3
  },
  sectionSubtitle: { 
    fontSize: 12, 
    color: LIGHT_GREY,
  },
  
  expandIcon: {
    display: 'none',
  },
  
  sectionContentWrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },
  
  tasksList: {
    flex: 1,
  },
  
  tasksListContent: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  
  taskCard: { 
    backgroundColor: '#fff', 
    borderRadius: 12, 
    padding: 14, 
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    marginHorizontal: 4,
  },
  taskHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 10 
  },
  taskId: { 
    fontSize: 11, 
    fontWeight: '700', 
    color: BLUE,
    letterSpacing: 0.5
  },
  
  statusBadge: { 
    paddingHorizontal: 10, 
    paddingVertical: 4, 
    borderRadius: 6,
    borderWidth: 1,
  },
  statusPending: { 
    backgroundColor: '#FFF8E1',
    borderColor: '#FFE0B2'
  },
  statusApproval: { 
    backgroundColor: '#F3E5F5',
    borderColor: '#E1BEE7'
  },
  statusCompleted: { 
    backgroundColor: '#E8F5E9',
    borderColor: '#C8E6C9'
  },
  
  statusText: { 
    fontSize: 11, 
    fontWeight: '600',
    letterSpacing: 0.3
  },
  statusTextPending: { 
    color: '#F57F17' 
  },
  statusTextApproval: { 
    color: '#7B1FA2' 
  },
  statusTextCompleted: { 
    color: '#2E7D32' 
  },
  
  taskTitle: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: DARK_GREY, 
    marginBottom: 8,
    lineHeight: 18
  },
  taskDetails: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 6 
  },
  taskDetailText: { 
    fontSize: 12, 
    color: LIGHT_GREY, 
    marginLeft: 6 
  },
  
  progressContainer: { 
    marginTop: 10, 
    gap: 4 
  },
  progressBar: { 
    height: 3, 
    backgroundColor: '#E8E8E8', 
    borderRadius: 2, 
    overflow: 'hidden' 
  },
  progressFill: { 
    height: '100%', 
    backgroundColor: GREEN, 
    borderRadius: 2 
  },
  progressText: { 
    fontSize: 11, 
    color: LIGHT_GREY, 
    textAlign: 'right',
    fontWeight: '500'
  },
  
  emptyState: { 
    flex: 1,
    backgroundColor: '#FAFAFA', 
    borderRadius: 12, 
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center', 
    justifyContent: 'center',
    marginHorizontal: 12,
    marginVertical: 12,
  },
  emptyStateText: { 
    fontSize: 13, 
    color: LIGHT_GREY, 
    marginTop: 12,
    fontWeight: '500'
  },
  
  bottomNav: { 
    flexDirection: 'row', 
    backgroundColor: '#fff', 
    paddingVertical: 12, 
    paddingHorizontal: 20, 
    borderTopWidth: 1, 
    borderTopColor: '#E8E8E8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2
  },
  navItem: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  navLabel: { 
    fontSize: 11, 
    color: LIGHT_GREY, 
    marginTop: 4,
    fontWeight: '500'
  },
  navLabelActive: { 
    color: BLUE, 
    fontWeight: '700' 
  },
  
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    gap: 8,
  },
  filterButton: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#E3F2FD',
    borderColor: '#BBDEFB',
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: LIGHT_GREY,
    textAlign: 'center',
  },
  filterButtonTextActive: {
    color: BLUE,
    fontWeight: '700',
  },
});
