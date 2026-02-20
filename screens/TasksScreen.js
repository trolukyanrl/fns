import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, FlatList, Modal, Dimensions, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTaskContext } from '../TaskContext';
import { useAuth } from '../AuthContext';

const RED_ACCENT = '#D32F2F';
const RED_LIGHT = '#FEE2E2';
const BLUE_ACCENT = '#1976D2';
const DARK = '#1F2937';
const GREY = '#6B7280';
const GREEN = '#388E3C';
const YELLOW = '#FBC02D';
const PURPLE = '#7B1FA2';0
const BG_COLOR = '#FFF5F5';

export default function TasksScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('Tasks');
  const [filter, setFilter] = useState('All');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  
  // Get current logged-in user and all tasks
  const { user } = useAuth();
  const { tasks } = useTaskContext();

  const handleNavigation = (tab) => {
    setActiveTab(tab);
    if (tab === 'Home') navigation.navigate('TADashboard');
    if (tab === 'Tasks') navigation.navigate('Tasks');
  };

  // Filter tasks to show only those assigned to the current user
  const userTasks = tasks.filter(task => {
    return task.assignedTo === user?.username || 
           task.assignedTo === user?.name ||
           task.assignedToName === user?.name ||
           task.assignedToName === user?.username;
  });

  // Separate tasks by status
  const pendingTasks = userTasks.filter(task => task.status === 'Pending');
  const pendingApprovalTasks = userTasks.filter(task => task.status === 'Pending for Approval');
  const completedTasks = userTasks.filter(task => task.status === 'Completed' || task.status === 'Approved');
  const rejectedTasks = userTasks.filter(task => task.status === 'Rejected');

  const TaskCard = ({ task }) => {
    // Get first BA-Set or Safety Kit for location and ID display
    const item = task.baSets && task.baSets[0] ? task.baSets[0] : (task.safetyKits && task.safetyKits[0] ? task.safetyKits[0] : null);
    
    // Use assetId if available (distinct field name), otherwise fall back to original id
    const displayId = item?.assetId || item?.id || task.id;
    const displayLocation = item?.zone || 'Location TBA';

    return (
      <TouchableOpacity 
        style={[styles.taskCard, styles.cardShadow]}
        onPress={() => navigation.navigate('TaskDetails', { task })}
      >
        <View style={styles.cardHeader}>
          <View style={[
            styles.statusBadge,
            task.status === 'Pending' && { backgroundColor: '#FFF9C4' },
            task.status === 'Pending for Approval' && { backgroundColor: '#E3F2FD' },
            (task.status === 'Completed' || task.status === 'Approved') && { backgroundColor: '#E8F5E9' },
            task.status === 'Rejected' && { backgroundColor: '#FFEBEE' },
          ]}>
            <Text style={[
              styles.statusText,
              task.status === 'Pending' && { color: '#F57F17' },
              task.status === 'Pending for Approval' && { color: BLUE_ACCENT },
              (task.status === 'Completed' || task.status === 'Approved') && { color: GREEN },
              task.status === 'Rejected' && { color: RED_ACCENT },
            ]}>
              {task.status === 'Approved' ? 'Completed' : task.status}
            </Text>
          </View>
          <Text style={styles.taskId}>ID: {displayId}</Text>
        </View>

        <Text style={styles.taskTitle}>{task.description}</Text>
        
        <View style={styles.taskMetaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={14} color={GREY} />
            <Text style={styles.metaText}>{task.dueDate}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="location-outline" size={14} color={GREY} />
            <Text style={styles.metaText}>{displayLocation}</Text>
          </View>
        </View>

        {task.progress > 0 && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${task.progress}%` }]} />
            </View>
            <Text style={styles.progressText}>{task.progress}%</Text>
          </View>
        )}

        {task.status === 'Rejected' && task.rejectionReason && (
          <View style={styles.rejectionContainer}>
            <Ionicons name="alert-circle" size={16} color={RED_ACCENT} />
            <Text style={styles.rejectionText}>{task.rejectionReason}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Background Pattern */}
      <View style={styles.backgroundPattern}>
        <Ionicons name="list" size={150} color="rgba(211, 47, 47, 0.03)" style={[styles.bgIcon, { top: 50, right: -20 }]} />
      </View>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <View style={styles.logoIcon}>
            <Ionicons name="list" size={24} color="#fff" />
          </View>
          <Text style={styles.pageTitle}>My Tasks</Text>
        </View>
      </View>

      {/* Search Bar and Filter Icon */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <Ionicons name="search" size={20} color={GREY} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search tasks..."
            placeholderTextColor={GREY}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setFilterModalVisible(true)}
        >
          <Ionicons name="filter" size={20} color={RED_ACCENT} />
        </TouchableOpacity>
      </View>

      {/* Filter Modal */}
      <Modal
        visible={filterModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setFilterModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Tasks</Text>
              <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                <Ionicons name="close" size={24} color={GREY} />
              </TouchableOpacity>
            </View>
            {['All', 'Pending Task', 'Pending for Approval', 'Task Completed', 'Rejected'].map((filterOption) => (
              <TouchableOpacity
                key={filterOption}
                style={[
                  styles.filterOption,
                  filter === filterOption && styles.filterOptionActive
                ]}
                onPress={() => {
                  setFilter(filterOption);
                  setFilterModalVisible(false);
                }}
              >
                <Text style={[
                  styles.filterOptionText,
                  filter === filterOption && styles.filterOptionTextActive
                ]}>
                  {filterOption}
                </Text>
                {filter === filterOption && (
                  <Ionicons name="checkmark-circle" size={20} color={RED_ACCENT} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      <View style={styles.mainContent}>
        {/* Show Filtered Tasks */}
        {(() => {
          let tasksToShow = [];
          let emptyMessage = '';
          
          // Apply filter first
          if (filter === 'All') {
            tasksToShow = userTasks;
          } else if (filter === 'Pending Task') {
            tasksToShow = pendingTasks;
            emptyMessage = 'No pending tasks found';
          } else if (filter === 'Pending for Approval') {
            tasksToShow = pendingApprovalTasks;
            emptyMessage = 'No pending for approval tasks found';
          } else if (filter === 'Task Completed') {
            tasksToShow = completedTasks;
            emptyMessage = 'No completed tasks found';
          } else if (filter === 'Rejected') {
            tasksToShow = rejectedTasks;
            emptyMessage = 'No rejected tasks found';
          }

          // Then apply search filter
          if (searchText.trim() !== '') {
            const searchLower = searchText.toLowerCase();
            tasksToShow = tasksToShow.filter(task => {
              const item = task.baSets?.[0] || task.safetyKits?.[0];
              return (
                task.id.toString().toLowerCase().includes(searchLower) ||
                task.description.toLowerCase().includes(searchLower) ||
                (item?.zone && item.zone.toLowerCase().includes(searchLower)) ||
                (item?.assetId && item.assetId.toLowerCase().includes(searchLower)) ||
                (item?.id && item.id.toLowerCase().includes(searchLower))
              );
            });
            if (tasksToShow.length === 0) {
              emptyMessage = 'No tasks found matching your search';
            }
          }

          if (userTasks.length === 0) {
            return (
              <View style={styles.emptyContainer}>
                <View style={styles.emptyIconContainer}>
                  <Ionicons name="checkmark-done" size={48} color={GREEN} />
                </View>
                <Text style={styles.emptyMessage}>All Caught Up!</Text>
                <Text style={styles.emptySubMessage}>No tasks assigned to you yet.</Text>
              </View>
            );
          }

          if (tasksToShow.length > 0) {
            return (
              <FlatList
                data={tasksToShow}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.tasksListContent}
                renderItem={({ item }) => <TaskCard task={item} />}
                showsVerticalScrollIndicator={false}
              />
            );
          } else {
            return (
              <View style={styles.emptyContainer}>
                <View style={[styles.emptyIconContainer, { backgroundColor: '#F3F4F6' }]}>
                  <Ionicons name="search" size={48} color={GREY} />
                </View>
                <Text style={styles.emptyMessage}>No tasks found</Text>
                <Text style={styles.emptySubMessage}>{emptyMessage}</Text>
              </View>
            );
          }
        })()}
      </View>

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
            <Text style={[styles.navLabel, activeTab === tab && styles.navLabelActive]}>{tab}</Text>
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
    paddingTop: 48, 
    paddingHorizontal: 20, 
    paddingBottom: 16, 
    backgroundColor: '#fff', 
    borderBottomWidth: 1, 
    borderBottomColor: '#FFEBEE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3
  },
  headerTitleContainer: { flexDirection: 'row', alignItems: 'center' },
  logoIcon: { 
    width: 36, 
    height: 36, 
    borderRadius: 10, 
    backgroundColor: RED_ACCENT, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginRight: 12 
  },
  pageTitle: { 
    fontSize: 20, 
    fontWeight: '800', 
    color: DARK,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: DARK,
    marginLeft: 10,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FFEBEE',
  },
  mainContent: { flex: 1 },
  tasksListContent: { padding: 20, paddingBottom: 100 },
  taskCard: { 
    backgroundColor: '#fff', 
    borderRadius: 16, 
    padding: 16, 
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: RED_ACCENT,
  },
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 11, fontWeight: '700' },
  taskId: { fontSize: 12, color: GREY, fontWeight: '600' },
  taskTitle: { fontSize: 15, fontWeight: '700', color: DARK, marginBottom: 12, lineHeight: 22 },
  taskMetaRow: { flexDirection: 'row', gap: 16, marginBottom: 12 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { fontSize: 12, color: GREY, fontWeight: '500' },
  progressContainer: { marginTop: 8, flexDirection: 'row', alignItems: 'center', gap: 10 },
  progressBar: { flex: 1, height: 6, backgroundColor: '#F3F4F6', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: GREEN, borderRadius: 3 },
  progressText: { fontSize: 12, color: GREY, fontWeight: '600' },
  rejectionContainer: { 
    marginTop: 12, 
    flexDirection: 'row', 
    gap: 8, 
    backgroundColor: '#FFEBEE', 
    padding: 10, 
    borderRadius: 8,
    alignItems: 'flex-start'
  },
  rejectionText: { flex: 1, fontSize: 12, color: RED_ACCENT, lineHeight: 18 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 100 },
  emptyIconContainer: { 
    width: 80, 
    height: 80, 
    borderRadius: 40, 
    backgroundColor: '#E8F5E9', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 16 
  },
  emptyMessage: { fontSize: 18, fontWeight: '700', color: DARK },
  emptySubMessage: { fontSize: 14, color: GREY, marginTop: 6 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, minHeight: 300 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: DARK },
  filterOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  filterOptionActive: { backgroundColor: '#FFF5F5', marginHorizontal: -24, paddingHorizontal: 24 },
  filterOptionText: { fontSize: 16, color: DARK, fontWeight: '500' },
  filterOptionTextActive: { color: RED_ACCENT, fontWeight: '700' },
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
