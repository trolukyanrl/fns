import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, FlatList, Modal, Dimensions, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BLUE = '#4285F4';
const DARK_GREY = '#333333';
const LIGHT_GREY = '#666666';
const GREEN = '#4CAF50';
const ORANGE = '#F9A825';
const PURPLE = '#9C27B0';

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

export default function TasksScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('Tasks');
  const [filter, setFilter] = useState('Pending Task'); // New state for filtering - default to pending tasks
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    pending: true,
    approval: true,
    completed: true,
  });

  const handleNavigation = (tab) => {
    setActiveTab(tab);
    if (tab === 'Home') navigation.navigate('TADashboard');
    if (tab === 'Tasks') navigation.navigate('Tasks');
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
  const rejectedTasks = TASKS.filter(task => task.status === 'Rejected');

  const TaskCard = ({ task }) => (
    <TouchableOpacity 
      style={styles.taskCard}
      onPress={() => navigation.navigate('TaskDetails', { task })}
    >
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
      <Text style={styles.taskTitle}>{task.id.startsWith('SK-') ? 'Safety Kit Inspection' : 'BA Set Inspection'}</Text>
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
      {task.status === 'Rejected' && task.rejectionReason && (
        <View style={styles.rejectionContainer}>
          <Ionicons name="alert-circle-outline" size={14} color="#D32F2F" />
          <Text style={styles.rejectionText}>{task.rejectionReason}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.pageTitle}>My Tasks</Text>
      </View>

      {/* Search Bar and Filter Icon */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search-outline" size={20} color={LIGHT_GREY} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search tasks..."
            placeholderTextColor={LIGHT_GREY}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
        <TouchableOpacity
          style={styles.filterIcon}
          onPress={() => setFilterModalVisible(true)}
        >
          <Ionicons name="filter-outline" size={24} color={DARK_GREY} />
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
            <Text style={styles.modalTitle}>Filter Tasks</Text>
            {['All', 'Pending Task', 'Pending for Approval', 'Task Completed', 'Rejected'].map((filterOption) => (
              <TouchableOpacity
                key={filterOption}
                style={[
                  styles.modalOption,
                  filter === filterOption && styles.modalOptionActive
                ]}
                onPress={() => {
                  setFilter(filterOption);
                  setFilterModalVisible(false);
                }}
              >
                <Text style={[
                  styles.modalOptionText,
                  filter === filterOption && styles.modalOptionTextActive
                ]}>
                  {filterOption}
                </Text>
                {filter === filterOption && (
                  <Ionicons name="checkmark" size={20} color={BLUE} />
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
          } else if (filter === 'Rejected') {
            tasksToShow = rejectedTasks;
            emptyMessage = 'No rejected tasks found';
          }

          // Then apply search filter
          if (searchText.trim() !== '') {
            const searchLower = searchText.toLowerCase();
            tasksToShow = tasksToShow.filter(task => 
              task.id.toLowerCase().includes(searchLower) ||
              task.title.toLowerCase().includes(searchLower) ||
              task.location.toLowerCase().includes(searchLower)
            );
            if (tasksToShow.length === 0) {
              emptyMessage = 'No tasks found matching your search';
            }
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
        {['Home', 'Tasks'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={styles.navItem}
            onPress={() => handleNavigation(tab)}
          >
            <Ionicons
              name={tab === 'Home' ? 'home' : 'checkbox-outline'}
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
  statusRejected: { 
    backgroundColor: '#FFEBEE',
    borderColor: '#FFCDD2'
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
  statusTextRejected: { 
    color: '#D32F2F' 
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
  
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: DARK_GREY,
    marginLeft: 8,
  },
  filterIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#F9F9F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterDropdown: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderRadius: 0,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  filterDropdownText: {
    fontSize: 14,
    fontWeight: '600',
    color: DARK_GREY,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: Dimensions.get('window').width - 60,
    maxHeight: Dimensions.get('window').height * 0.6,
    padding: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: DARK_GREY,
    marginBottom: 16,
    textAlign: 'center',
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#F9F9F9',
  },
  modalOptionActive: {
    backgroundColor: '#E3F2FD',
  },
  modalOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: DARK_GREY,
  },
  modalOptionTextActive: {
    color: BLUE,
    fontWeight: '700',
  },
  rejectionContainer: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    backgroundColor: '#FFF3F3',
    borderRadius: 6,
    padding: 8,
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  rejectionText: {
    flex: 1,
    fontSize: 12,
    color: '#D32F2F',
    lineHeight: 16,
  },
});
