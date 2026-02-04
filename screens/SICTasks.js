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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTaskContext } from '../TaskContext';

const BLUE = '#2563EB';
const LIGHT_BLUE = '#EFF6FF';
const DARK = '#1F2937';
const GREY = '#6B7280';
const LIGHT_GREY = '#9CA3AF';
const WHITE = '#FFFFFF';
const GREEN = '#22C55E';
const YELLOW = '#FCD34D';
const RED = '#EF4444';

export default function SICTasks({ navigation }) {
  const { tasks, deleteTask } = useTaskContext();
  const [activeTab, setActiveTab] = useState('Tasks');

  useEffect(() => {
    setActiveTab('Tasks');
  }, []);

  const handleNavigation = (tab) => {
    setActiveTab(tab);
    if (tab === 'Home') navigation.navigate('SICDashboard');
    if (tab === 'Tasks') navigation.navigate('SICTasks');
    if (tab === 'Profile') navigation.navigate('SICProfile');
  };

  const renderTaskCard = ({ item }) => (
    <View style={styles.taskCard}>
      <View style={styles.taskHeader}>
        <View style={styles.taskHeaderLeft}>
          <View style={[styles.statusIndicator, { backgroundColor: item.status === 'Pending' ? YELLOW : GREEN }]} />
          <View>
            <Text style={styles.taskAssignee}>{item.assignedTo}</Text>
            <Text style={styles.taskDept}>{item.assignedToDept}</Text>
          </View>
        </View>
        <View style={styles.taskActions}>
          <View style={styles.statusBadge}>
            <Text style={styles.statusBadgeText}>{item.status}</Text>
          </View>
          <TouchableOpacity 
            style={styles.actionIcon}
            onPress={() => navigation.navigate('SICAssignTask', { taskToEdit: item })}
          >
            <Ionicons name="create-outline" size={18} color={BLUE} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionIcon}
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
            <Ionicons name="trash-outline" size={18} color={RED} />
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
          <Text style={styles.detailText}>{item.createdAt}</Text>
        </View>
      </View>

      {item.baSets && item.baSets.length > 0 && (
        <View style={styles.baSetsList}>
          <Text style={styles.baSetLabel}>BA Sets:</Text>
          {item.baSets.map((baSet) => (
            <View key={baSet.id} style={styles.baSetBadge}>
              <Ionicons name="shield-checkmark" size={12} color={WHITE} />
              <Text style={styles.baSetBadgeText}>{baSet.name}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logo}>
            <Ionicons name="checkbox-outline" size={26} color={BLUE} />
          </View>
          <View>
            <Text style={styles.headerTitle}>Tasks</Text>
            <Text style={styles.headerSubtitle}>SITE IN-CHARGE</Text>
          </View>
        </View>

        {/* Assign New Task Button */}
        <TouchableOpacity 
          style={styles.assignButton}
          onPress={() => navigation.navigate('SICAssignTask')}
        >
          <Ionicons name="add-circle" size={20} color={WHITE} />
          <Text style={styles.assignButtonText}>Assign New Task</Text>
        </TouchableOpacity>

        {/* Tasks List */}
        {tasks.length > 0 ? (
          <FlatList
            data={tasks}
            renderItem={renderTaskCard}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.tasksList}
          />
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="clipboard-outline" size={64} color={LIGHT_GREY} />
            <Text style={styles.emptyStateText}>No tasks assigned yet</Text>
            <Text style={styles.emptyStateSubtext}>Create a new task to get started</Text>
          </View>
        )}
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
  container: { flexGrow: 1, paddingHorizontal: 20, paddingTop: 40, paddingBottom: 100 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  logo: { width: 48, height: 48, borderRadius: 12, backgroundColor: LIGHT_BLUE, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: DARK },
  headerSubtitle: { fontSize: 12, color: GREY, marginTop: 4 },
  assignButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: BLUE, borderRadius: 12, paddingVertical: 14, marginBottom: 24 },
  assignButtonText: { fontSize: 16, fontWeight: '600', color: WHITE, marginLeft: 8 },
  cardsContainer: { marginBottom: 24 },
  actionCard: { backgroundColor: WHITE, borderRadius: 12, padding: 16, marginBottom: 12, elevation: 2, flexDirection: 'row', alignItems: 'center' },
  cardIconContainer: { width: 40, height: 40, borderRadius: 8, backgroundColor: LIGHT_BLUE, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: DARK, marginBottom: 4 },
  cardSubtitle: { fontSize: 12, color: GREY },
  tasksList: { paddingBottom: 20 },
  taskCard: { backgroundColor: WHITE, borderRadius: 12, padding: 16, marginBottom: 16, elevation: 2 },
  taskHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  taskHeaderLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  statusIndicator: { width: 12, height: 12, borderRadius: 6, marginRight: 12 },
  taskAssignee: { fontSize: 16, fontWeight: '700', color: DARK },
  taskDept: { fontSize: 12, color: GREY, marginTop: 2 },
  statusBadge: { backgroundColor: LIGHT_BLUE, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  statusBadgeText: { fontSize: 12, fontWeight: '600', color: BLUE },
  taskActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  actionIcon: { padding: 6 },
  taskDescription: { fontSize: 14, color: DARK, marginBottom: 12, lineHeight: 20 },
  taskDetails: { flexDirection: 'row', gap: 16, marginBottom: 12, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  detailText: { fontSize: 12, color: GREY },
  baSetsList: { backgroundColor: '#F9FAFB', borderRadius: 8, padding: 12 },
  baSetLabel: { fontSize: 12, fontWeight: '600', color: DARK, marginBottom: 8 },
  baSetBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: BLUE, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, marginRight: 8, marginBottom: 6, alignSelf: 'flex-start' },
  baSetBadgeText: { fontSize: 11, fontWeight: '600', color: WHITE, marginLeft: 4 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 60 },
  emptyStateText: { fontSize: 16, fontWeight: '600', color: DARK, marginTop: 16 },
  emptyStateSubtext: { fontSize: 14, color: GREY, marginTop: 8 },
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', backgroundColor: WHITE, paddingVertical: 12, paddingHorizontal: 20, borderTopWidth: 1, borderTopColor: '#E8E8E8' },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  navLabel: { fontSize: 12, color: GREY, marginTop: 4 },
  navLabelActive: { color: BLUE, fontWeight: '600' },
});
