import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  FlatList,
  Alert,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTaskContext } from '../TaskContext';

const RED_ACCENT = '#D32F2F';
const RED_LIGHT = '#FEE2E2';
const BLUE_ACCENT = '#1976D2';
const DARK = '#1F2937';
const GREY = '#6B7280';
const LIGHT_GREY = '#9CA3AF';
const WHITE = '#FFFFFF';
const GREEN = '#388E3C';
const YELLOW = '#FBC02D';
const BG_COLOR = '#FFF5F5';

export default function SICTasks({ navigation }) {
  const { tasks, deleteTask } = useTaskContext();
  const [activeTab, setActiveTab] = useState('Tasks');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setActiveTab('Tasks');
  }, []);

  // Filter tasks based on search query
  const filteredTasks = tasks.filter(task => {
    const query = searchQuery.toLowerCase();
    return (
      task.description.toLowerCase().includes(query) ||
      task.assignedTo.toLowerCase().includes(query) ||
      task.assignedToDept.toLowerCase().includes(query) ||
      task.dueDate.toLowerCase().includes(query) ||
      (task.baSets && task.baSets.some(baSet => 
        baSet.name.toLowerCase().includes(query) ||
        baSet.id.toLowerCase().includes(query)
      )) ||
      (task.safetyKits && task.safetyKits.some(safetyKit => 
        safetyKit.name.toLowerCase().includes(query) ||
        safetyKit.id.toLowerCase().includes(query)
      ))
    );
  });

  const handleNavigation = (tab) => {
    setActiveTab(tab);
    if (tab === 'Home') navigation.navigate('SICDashboard');
    if (tab === 'Tasks') navigation.navigate('SICTasks');
  };

  const renderTaskCard = ({ item }) => (
    <View style={[styles.taskCard, styles.cardShadow]}>
      <View style={styles.taskHeader}>
        <View style={styles.taskHeaderLeft}>
          <View style={[styles.statusIndicator, { backgroundColor: item.status === 'Pending' ? YELLOW : GREEN }]} />
          <View>
            <Text style={styles.taskAssignee}>{item.assignedTo}</Text>
            <Text style={styles.taskDept}>{item.assignedToDept}</Text>
          </View>
        </View>
        <View style={styles.taskActions}>
          <View style={[styles.statusBadge, { backgroundColor: item.status === 'Pending' ? '#FFF9C4' : '#E8F5E9' }]}>
            <Text style={[styles.statusBadgeText, { color: item.status === 'Pending' ? '#F57F17' : GREEN }]}>{item.status}</Text>
          </View>
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={() => {
              // Show confirmation alert before deleting
              Alert.alert(
                'Delete Task',
                'Are you sure you want to delete this task?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Delete', style: 'destructive', onPress: () => deleteTask(item.id) }
                ]
              );
            }}
          >
            <Ionicons name="trash-outline" size={18} color={RED_ACCENT} />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.taskDescription}>{item.description}</Text>

      <View style={styles.taskDetails}>
        <View style={styles.detailItem}>
          <Ionicons name="calendar-outline" size={16} color={GREY} />
          <Text style={styles.detailText}>{item.dueDate}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="time-outline" size={16} color={GREY} />
          <Text style={styles.detailText}>{new Date(item.createdAt).toLocaleDateString()}</Text>
        </View>
      </View>

      {item.baSets && item.baSets.length > 0 && (
        <View style={styles.assetList}>
          <Text style={styles.assetLabel}>BA Sets:</Text>
          <View style={styles.assetBadgesContainer}>
            {item.baSets.map((baSet) => (
              <View key={baSet.id} style={[styles.assetBadge, { backgroundColor: '#E3F2FD' }]}>
                <Ionicons name="shield-checkmark" size={12} color={BLUE_ACCENT} />
                <Text style={[styles.assetBadgeText, { color: BLUE_ACCENT }]}>{baSet.name}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {item.safetyKits && item.safetyKits.length > 0 && (
        <View style={styles.assetList}>
          <Text style={styles.assetLabel}>Safety Kits:</Text>
          <View style={styles.assetBadgesContainer}>
            {item.safetyKits.map((safetyKit) => (
              <View key={safetyKit.id} style={[styles.assetBadge, { backgroundColor: '#FFEBEE' }]}>
                <Ionicons name="construct" size={12} color={RED_ACCENT} />
                <Text style={[styles.assetBadgeText, { color: RED_ACCENT }]}>{safetyKit.name}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Background Pattern */}
      <View style={styles.backgroundPattern}>
        <Ionicons name="list" size={150} color="rgba(211, 47, 47, 0.03)" style={[styles.bgIcon, { top: 50, right: -20 }]} />
        <Ionicons name="clipboard" size={120} color="rgba(211, 47, 47, 0.03)" style={[styles.bgIcon, { bottom: 100, left: -30 }]} />
      </View>

      {/* Fixed Header - Outside ScrollView */}
      <View style={styles.fixedHeader}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logo}>
            <Ionicons name="list" size={24} color="#fff" />
          </View>
          <View>
            <Text style={styles.headerTitle}>Task List</Text>
            <Text style={styles.headerSubtitle}>MANAGE INSPECTIONS</Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={GREY} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search tasks..."
            placeholderTextColor={LIGHT_GREY}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Scrollable Content */}
      <View style={styles.container}>
        {filteredTasks.length > 0 ? (
          <FlatList
            data={filteredTasks}
            renderItem={renderTaskCard}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.tasksList}
          />
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <Ionicons name={searchQuery ? "search" : "clipboard"} size={48} color={RED_ACCENT} />
            </View>
            <Text style={styles.emptyStateText}>
              {searchQuery ? 'No tasks found' : 'No tasks assigned yet'}
            </Text>
            <Text style={styles.emptyStateSubtext}>
              {searchQuery ? 'Try adjusting your search terms' : 'Tasks you create will appear here'}
            </Text>
          </View>
        )}
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
  container: { flex: 1, paddingHorizontal: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  logo: { 
    width: 40, 
    height: 40, 
    borderRadius: 10, 
    backgroundColor: RED_ACCENT, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginRight: 12 
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: DARK },
  headerSubtitle: { fontSize: 11, color: GREY, fontWeight: '600', letterSpacing: 0.5 },
  searchContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#F9FAFB', 
    borderRadius: 12, 
    paddingHorizontal: 16, 
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 15, color: DARK },
  tasksList: { paddingVertical: 20, paddingBottom: 100 },
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
  taskHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  taskHeaderLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  statusIndicator: { width: 8, height: 8, borderRadius: 4, marginRight: 10 },
  taskAssignee: { fontSize: 15, fontWeight: '700', color: DARK },
  taskDept: { fontSize: 12, color: GREY, marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginRight: 8 },
  statusBadgeText: { fontSize: 11, fontWeight: '700' },
  taskActions: { flexDirection: 'row', alignItems: 'center' },
  deleteButton: { 
    padding: 6, 
    backgroundColor: '#FFEBEE', 
    borderRadius: 8 
  },
  taskDescription: { fontSize: 14, color: '#4B5563', marginBottom: 16, lineHeight: 22 },
  taskDetails: { 
    flexDirection: 'row', 
    gap: 16, 
    marginBottom: 16, 
    paddingBottom: 16, 
    borderBottomWidth: 1, 
    borderBottomColor: '#F3F4F6' 
  },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  detailText: { fontSize: 12, color: GREY, fontWeight: '500' },
  assetList: { marginTop: 8 },
  assetLabel: { fontSize: 12, fontWeight: '700', color: DARK, marginBottom: 8 },
  assetBadgesContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  assetBadge: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 10, 
    paddingVertical: 6, 
    borderRadius: 8, 
  },
  assetBadgeText: { fontSize: 11, fontWeight: '600', marginLeft: 6 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 60 },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFEBEE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyStateText: { fontSize: 18, fontWeight: '700', color: DARK },
  emptyStateSubtext: { fontSize: 14, color: GREY, marginTop: 8 },
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