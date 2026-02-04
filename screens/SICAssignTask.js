import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  Alert,
  Modal,
  FlatList,
  Platform,
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
const RED = '#EF4444';

const TASK_TYPES = [
  { id: '1', name: 'BA-SET', icon: 'shield-checkmark' },
  { id: '2', name: 'SK', icon: 'construct' },
];

const ZONES = [
  { id: '1', name: 'Zone A' },
  { id: '2', name: 'Zone B' },
  { id: '3', name: 'Zone C' },
];

const INSPECTORS = [
  { id: '1', name: 'Amit R.', department: 'Safety' },
  { id: '2', name: 'Sarah K.', department: 'Operations' },
  { id: '3', name: 'Raj P.', department: 'Maintenance' },
  { id: '4', name: 'Lisa M.', department: 'Quality' },
];

const BA_SETS = [
  {
    id: 'BA-2024-001',
    name: 'Drager PSS 7000',
    status: 'Available',
    zone: 'Zone A - Block 3',
    cylinderNo: 'CYL-A-4521',
    pressure: '300 bar',
    nextHydrotest: '15 Mar 2025',
    lastInspection: '2 days ago',
  },
  {
    id: 'BA-2024-007',
    name: 'MSA G1 SCBA',
    status: 'Available',
    zone: 'Zone B - Block 1',
    cylinderNo: 'CYL-B-2847',
    pressure: '290 bar',
    nextHydrotest: '22 Apr 2025',
    lastInspection: '5 days ago',
  },
  {
    id: 'BA-2024-003',
    name: 'Scott Aviation AV-3000',
    status: 'Available',
    zone: 'Zone C - Block 2',
    cylinderNo: 'CYL-C-5632',
    pressure: '310 bar',
    nextHydrotest: '10 May 2025',
    lastInspection: '1 day ago',
  },
  {
    id: 'BA-2024-012',
    name: 'Dräger PSS 90 SCBA',
    status: 'Available',
    zone: 'Zone A - Block 1',
    cylinderNo: 'CYL-A-3456',
    pressure: '295 bar',
    nextHydrotest: '08 Jun 2025',
    lastInspection: '3 days ago',
  },
  {
    id: 'BA-2024-015',
    name: 'Honeywell SCSR',
    status: 'Available',
    zone: 'Zone B - Block 3',
    cylinderNo: 'CYL-B-5789',
    pressure: '280 bar',
    nextHydrotest: '30 May 2025',
    lastInspection: '4 days ago',
  },
  {
    id: 'BA-2024-018',
    name: 'Siebe Gorman AAPRO',
    status: 'Available',
    zone: 'Zone C - Block 4',
    cylinderNo: 'CYL-C-1234',
    pressure: '320 bar',
    nextHydrotest: '18 Jul 2025',
    lastInspection: '6 days ago',
  },
  {
    id: 'BA-2024-021',
    name: 'Interspiro SCBA II',
    status: 'Available',
    zone: 'Zone A - Block 2',
    cylinderNo: 'CYL-A-9876',
    pressure: '305 bar',
    nextHydrotest: '12 Apr 2025',
    lastInspection: '1 day ago',
  },
];

export default function SICAssignTask({ navigation, route }) {
  const { addTask, updateTask } = useTaskContext();
  const editingTask = route?.params?.taskToEdit;
  const isEditMode = !!editingTask;
  
  const findInspectorById = (name, dept) => {
    return INSPECTORS.find(insp => insp.name === name && insp.department === dept);
  };

  const [taskDescription, setTaskDescription] = useState(editingTask?.description || '');
  const [selectedInspector, setSelectedInspector] = useState(editingTask ? findInspectorById(editingTask.assignedTo, editingTask.assignedToDept) : null);
  const [dueDate, setDueDate] = useState(editingTask?.dueDate || '');
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [showZoneModal, setShowZoneModal] = useState(false);
  const [showInspectorModal, setShowInspectorModal] = useState(false);
  const [selectedBASets, setSelectedBASets] = useState(editingTask ? (editingTask.baSets?.map(bs => bs.id) || []) : []);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showYearPicker, setShowYearPicker] = useState(false);
  

  const handleAssignTask = () => {
    if (!taskDescription.trim() || !selectedInspector || !dueDate.trim() || selectedBASets.length === 0) {
      Alert.alert('Error', 'Please fill in all fields and select at least one BA set to assign a task.');
      return;
    }

    // Create task object
    const taskData = {
      description: taskDescription,
      assignedTo: selectedInspector.name,
      assignedToDept: selectedInspector.department,
      dueDate: dueDate,
      baSets: selectedBASets.map(id => BA_SETS.find(bs => bs.id === id)).filter(Boolean),
      status: 'Pending',
    };

    if (isEditMode) {
      // Update existing task
      updateTask(editingTask.id, taskData);
      Alert.alert(
        'Task Updated',
        `Task for ${selectedInspector.name} has been updated successfully.`,
        [{ text: 'OK', onPress: () => navigation.replace('SICTasks') }]
      );
    } else {
      // Add new task
      addTask(taskData);
      // Reset form
      setTaskDescription('');
      setSelectedInspector(null);
      setDueDate('');
      setSelectedBASets([]);
      Alert.alert(
        'Task Assigned',
        `Task has been assigned to ${selectedInspector.name} with due date ${dueDate}.`,
      [{ text: 'OK', onPress: () => {
          navigation.replace('SICTasks');
        }}]
      );
    }
  };

  const renderTaskType = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.typeItem,
        selectedType?.id === item.id && styles.typeItemSelected
      ]}
      onPress={() => {
        setSelectedType(item);
        setShowTypeModal(false);
      }}
    >
      <Ionicons name={item.icon} size={20} color={selectedType?.id === item.id ? BLUE : GREY} />
      <Text style={[
        styles.typeText,
        selectedType?.id === item.id && styles.typeTextSelected
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderZone = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.typeItem,
        selectedZone?.id === item.id && styles.typeItemSelected
      ]}
      onPress={() => {
        setSelectedZone(item);
        setShowZoneModal(false);
      }}
    >
      <Ionicons name="location-outline" size={20} color={selectedZone?.id === item.id ? BLUE : GREY} />
      <Text style={[
        styles.typeText,
        selectedZone?.id === item.id && styles.typeTextSelected
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderInspector = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.inspectorItem,
        selectedInspector?.id === item.id && styles.inspectorItemSelected
      ]}
      onPress={() => {
        setSelectedInspector(item);
        setShowInspectorModal(false);
      }}
    >
      <View style={styles.inspectorInfo}>
        <Text style={styles.inspectorName}>{item.name}</Text>
        <Text style={styles.inspectorDept}>{item.department}</Text>
      </View>
      {selectedInspector?.id === item.id && (
        <Ionicons name="checkmark-circle" size={24} color={GREEN} />
      )}
    </TouchableOpacity>
  );

  const toggleBASetSelection = (baSetId) => {
    if (selectedBASets.includes(baSetId)) {
      setSelectedBASets(selectedBASets.filter(id => id !== baSetId));
    } else {
      setSelectedBASets([...selectedBASets, baSetId]);
    }
  };

  const handleDateSelect = (day) => {
    const formattedDate = `${String(day).padStart(2, '0')}/${String(selectedDate?.month || new Date().getMonth() + 1).padStart(2, '0')}/${selectedDate?.year || new Date().getFullYear()}`;
    setDueDate(formattedDate);
    setShowDatePicker(false);
  };

  const getDaysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate();
  };

  const getCurrentMonthDays = () => {
    const now = new Date();
    const month = selectedDate?.month || now.getMonth() + 1;
    const year = selectedDate?.year || now.getFullYear();
    const daysInMonth = getDaysInMonth(month, year);
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  };

  const handleMonthChange = (direction) => {
    const now = new Date();
    let month = selectedDate?.month || now.getMonth() + 1;
    let year = selectedDate?.year || now.getFullYear();

    if (direction === 'next') {
      month += 1;
      if (month > 12) {
        month = 1;
        year += 1;
      }
    } else {
      month -= 1;
      if (month < 1) {
        month = 12;
        year -= 1;
      }
    }

    setSelectedDate({ month, year });
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const currentMonth = selectedDate?.month || new Date().getMonth() + 1;
  const currentYear = selectedDate?.year || new Date().getFullYear();

  const getYearsRange = () => {
    const years = [];
    for (let i = currentYear - 5; i <= currentYear + 10; i++) {
      years.push(i);
    }
    return years;
  };

  const renderBASetCard = (baSet) => (
    <TouchableOpacity
      style={[
        styles.baSetCard,
        selectedBASets.includes(baSet.id) && styles.baSetCardSelected
      ]}
      onPress={() => toggleBASetSelection(baSet.id)}
    >
      <View style={styles.baSetHeader}>
        <View style={styles.baSetTitleSection}>
          <Text style={styles.baSetId}>{baSet.id}</Text>
          <View style={styles.statusBadge}>
            <Ionicons name="checkmark-circle" size={14} color={GREEN} />
            <Text style={styles.statusText}>{baSet.status}</Text>
          </View>
        </View>
        {selectedBASets.includes(baSet.id) && (
          <View style={styles.checkmark}>
            <Ionicons name="checkmark" size={24} color={BLUE} />
          </View>
        )}
      </View>

      <Text style={styles.baSetName}>{baSet.name}</Text>
      <View style={styles.baSetLocation}>
        <Ionicons name="location" size={14} color={GREY} />
        <Text style={styles.baSetLocationText}>{baSet.zone}</Text>
      </View>

      <View style={styles.baSetDetailsRow}>
        <View style={styles.baSetDetail}>
          <Text style={styles.baSetDetailLabel}>Cylinder No.</Text>
          <Text style={styles.baSetDetailValue}>{baSet.cylinderNo}</Text>
        </View>
        <View style={styles.baSetDetail}>
          <Text style={styles.baSetDetailLabel}>Pressure</Text>
          <Text style={styles.baSetDetailValue}>{baSet.pressure}</Text>
        </View>
      </View>

      <View style={styles.baSetFooterRow}>
        <View style={styles.baSetFooter}>
          <Text style={styles.baSetFooterLabel}>Next Hydrotest</Text>
          <Text style={styles.baSetFooterValue}>{baSet.nextHydrotest}</Text>
        </View>
        <View style={styles.baSetFooter}>
          <Text style={styles.baSetFooterLabel}>Last Inspection</Text>
          <Text style={styles.baSetFooterValue}>{baSet.lastInspection}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={DARK} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>{isEditMode ? 'Edit Task' : 'Assign Task'}</Text>
            <Text style={styles.headerSubtitle}>SITE IN-CHARGE</Text>
          </View>
        </View>

        {/* Task Assignment Card */}
        <View style={styles.taskAssignmentCard}>

          {/* Inspector */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Assign To</Text>
            <TouchableOpacity
              style={styles.selectWrapper}
              onPress={() => setShowInspectorModal(true)}
            >
              <Ionicons name="person-outline" size={20} color={LIGHT_GREY} style={styles.inputIcon} />
              <Text style={[
                styles.selectText,
                !selectedInspector && { color: LIGHT_GREY }
              ]}>
                {selectedInspector ? `${selectedInspector.name} (${selectedInspector.department})` : 'Select inspector'}
              </Text>
              <Ionicons name="chevron-down" size={20} color={LIGHT_GREY} />
            </TouchableOpacity>
          </View>

          {/* Due Date */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Due Date</Text>
            <TouchableOpacity
              style={styles.inputWrapper}
              onPress={() => setShowDatePicker(true)}
            >
              <Ionicons name="calendar-outline" size={20} color={LIGHT_GREY} style={styles.inputIcon} />
              <Text style={[styles.input, { color: dueDate ? DARK : LIGHT_GREY }]}>
                {dueDate || 'MM/DD/YYYY'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Task Description */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Task Description</Text>
            <View style={styles.textareaWrapper}>
              <TextInput
                style={styles.textarea}
                placeholder="Describe the task details..."
                placeholderTextColor={LIGHT_GREY}
                value={taskDescription}
                onChangeText={setTaskDescription}
                multiline
                numberOfLines={4}
              />
            </View>
          </View>
        </View>

        {/* BA Sets Selection Card */}
        <View style={styles.baSetCardContainer}>
          <Text style={styles.baSetSectionTitle}>Select BA Sets</Text>
          <Text style={styles.baSetSectionSubtitle}>Choose equipment for this task</Text>
          
          <View style={styles.baSetSection}>
            <FlatList
              data={BA_SETS}
              renderItem={({ item }) => renderBASetCard(item)}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled={false}
              style={styles.baSetList}
            />
          </View>
        </View>
      </ScrollView>

      {/* Buttons Container */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.navigate('SICDashboard')}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.assignButton} onPress={handleAssignTask}>
          <Ionicons name={isEditMode ? "checkmark-circle" : "add-circle"} size={24} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.assignButtonText}>{isEditMode ? 'Update Task' : 'Assign Task'}</Text>
        </TouchableOpacity>
      </View>


      {/* Task Type Modal */}
      <Modal
        visible={showTypeModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowTypeModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowTypeModal(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Task Type</Text>
            <FlatList
              data={TASK_TYPES}
              renderItem={renderTaskType}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Zone Modal */}
      <Modal
        visible={showZoneModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowZoneModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowZoneModal(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Zone</Text>
            <FlatList
              data={ZONES}
              renderItem={renderZone}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Inspector Modal */}
      <Modal
        visible={showInspectorModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowInspectorModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowInspectorModal(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Inspector</Text>
            <FlatList
              data={INSPECTORS}
              renderItem={renderInspector}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Date Picker Modal */}
      <Modal
        visible={showDatePicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowDatePicker(false)}
        >
          <View style={styles.datePickerModal}>
            <View style={styles.datePickerHeader}>
              <Text style={styles.datePickerTitle}>Select Date</Text>
              <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                <Ionicons name="close" size={24} color={DARK} />
              </TouchableOpacity>
            </View>

            {/* Month/Year Navigation */}
            <View style={styles.monthYearNav}>
              <TouchableOpacity onPress={() => handleMonthChange('prev')}>
                <Ionicons name="chevron-back" size={24} color={BLUE} />
              </TouchableOpacity>
              <View style={styles.monthYearSelector}>
                <Text style={styles.monthYearText}>{monthNames[currentMonth - 1]}</Text>
                <TouchableOpacity onPress={() => setShowYearPicker(true)} style={styles.yearButton}>
                  <Text style={styles.yearButtonText}>{currentYear}</Text>
                  <Ionicons name="chevron-down" size={16} color={BLUE} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => handleMonthChange('next')}>
                <Ionicons name="chevron-forward" size={24} color={BLUE} />
              </TouchableOpacity>
            </View>

            {/* Day Grid */}
            <View style={styles.dayGrid}>
              {getCurrentMonthDays().map((day) => (
                <TouchableOpacity
                  key={day}
                  style={[styles.dayButton, dueDate === `${String(day).padStart(2, '0')}/${String(currentMonth).padStart(2, '0')}/${currentYear}` && styles.dayButtonSelected]}
                  onPress={() => {
                    setSelectedDate({ month: currentMonth, year: currentYear });
                    handleDateSelect(day);
                  }}
                >
                  <Text style={[styles.dayText, dueDate === `${String(day).padStart(2, '0')}/${String(currentMonth).padStart(2, '0')}/${currentYear}` && styles.dayTextSelected]}>
                    {day}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.datePickerConfirmButton}
              onPress={() => setShowDatePicker(false)}
            >
              <Text style={styles.datePickerConfirmText}>Done</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Year Picker Modal */}
      <Modal
        visible={showYearPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowYearPicker(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowYearPicker(false)}
        >
          <View style={styles.yearPickerModal}>
            <Text style={styles.yearPickerTitle}>Select Year</Text>
            <FlatList
              data={getYearsRange()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.yearOption, item === currentYear && styles.yearOptionSelected]}
                  onPress={() => {
                    setSelectedDate({ ...selectedDate, year: item });
                    setShowYearPicker(false);
                  }}
                >
                  <Text style={[styles.yearOptionText, item === currentYear && styles.yearOptionTextSelected]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.toString()}
              showsVerticalScrollIndicator={true}
              scrollEnabled={true}
            />
            <TouchableOpacity
              style={styles.yearPickerConfirmButton}
              onPress={() => setShowYearPicker(false)}
            >
              <Text style={styles.yearPickerConfirmText}>Done</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F9FAFB' },
  container: { paddingHorizontal: 20, paddingTop: 48, paddingBottom: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  backButton: { width: 40, height: 40, borderRadius: 8, backgroundColor: WHITE, alignItems: 'center', justifyContent: 'center', elevation: 2 },
  headerContent: { flex: 1, marginLeft: 16 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: DARK },
  headerSubtitle: { fontSize: 12, color: GREY, marginTop: 4 },
  taskAssignmentCard: { backgroundColor: WHITE, borderRadius: 16, padding: 20, elevation: 2, marginBottom: 16 },
  baSetCardContainer: { backgroundColor: WHITE, borderRadius: 16, padding: 20, elevation: 2, marginBottom: 16, flex: 1, minHeight: 450 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 12, fontWeight: '500', color: DARK, marginBottom: 8 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 12, paddingHorizontal: 16 },
  textareaWrapper: { backgroundColor: '#F3F4F6', borderRadius: 12, paddingHorizontal: 16 },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, paddingVertical: 14, fontSize: 16, color: DARK },
  textarea: { paddingVertical: 14, fontSize: 16, color: DARK },
  selectWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14 },
  dateWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14 },
  selectText: { flex: 1, fontSize: 16, color: DARK, marginLeft: 12 },
  dateText: { flex: 1, fontSize: 16, color: DARK, marginLeft: 12 },
  assignButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: BLUE, borderRadius: 12, paddingVertical: 16, flex: 1, marginLeft: 8 },
  buttonIcon: { marginRight: 12 },
  assignButtonText: { fontSize: 16, fontWeight: '700', color: WHITE },
  buttonsContainer: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 16, paddingBottom: 24, backgroundColor: WHITE, borderTopWidth: 1, borderTopColor: '#E5E7EB' },
  cancelButton: { backgroundColor: WHITE, borderRadius: 12, paddingVertical: 16, paddingHorizontal: 24, borderWidth: 1, borderColor: BLUE, flex: 1 },
  cancelButtonText: { fontSize: 16, fontWeight: '700', color: BLUE, textAlign: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: WHITE, borderRadius: 16, width: '80%', maxHeight: '60%', padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: DARK, marginBottom: 16, textAlign: 'center' },
  typeItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, backgroundColor: '#F9FAFB', marginBottom: 8 },
  typeItemSelected: { backgroundColor: LIGHT_BLUE, borderWidth: 1, borderColor: BLUE },
  typeText: { marginLeft: 12, fontSize: 16, color: GREY },
  typeTextSelected: { color: BLUE, fontWeight: '600' },
  inspectorItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, backgroundColor: '#F9FAFB', marginBottom: 8 },
  inspectorItemSelected: { backgroundColor: LIGHT_BLUE, borderWidth: 1, borderColor: BLUE },
  inspectorInfo: { flex: 1 },
  inspectorName: { fontSize: 16, fontWeight: '600', color: DARK },
  inspectorDept: { fontSize: 12, color: GREY, marginTop: 2 },
  baSetSectionTitle: { fontSize: 14, fontWeight: '700', color: DARK, marginBottom: 4 },
  baSetSectionSubtitle: { fontSize: 12, color: GREY, marginBottom: 16 },
  baSetSection: { marginTop: 16, paddingTop: 0, borderTopWidth: 0 },
  baSetList: { flex: 1 },
  baSetCard: { 
    backgroundColor: WHITE, 
    borderWidth: 1, 
    borderColor: '#E5E7EB', 
    borderRadius: 12, 
    padding: 16, 
    marginBottom: 12,
    elevation: 1,
  },
  baSetCardSelected: { 
    borderColor: BLUE, 
    borderWidth: 2,
    backgroundColor: '#F0F4FF',
  },
  baSetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  baSetTitleSection: { flex: 1 },
  baSetId: { fontSize: 12, fontWeight: '600', color: GREY, marginBottom: 4 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0FDF4', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, width: 'auto' },
  statusText: { fontSize: 11, fontWeight: '600', color: GREEN, marginLeft: 4 },
  checkmark: { width: 32, height: 32, borderRadius: 16, backgroundColor: BLUE, alignItems: 'center', justifyContent: 'center' },
  baSetName: { fontSize: 16, fontWeight: '700', color: DARK, marginBottom: 8 },
  baSetLocation: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  baSetLocationText: { fontSize: 12, color: GREY, marginLeft: 6 },
  baSetDetailsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  baSetDetail: { flex: 1 },
  baSetDetailLabel: { fontSize: 11, fontWeight: '500', color: GREY, marginBottom: 2 },
  baSetDetailValue: { fontSize: 14, fontWeight: '600', color: DARK },
  baSetFooterRow: { flexDirection: 'row', justifyContent: 'space-between' },
  baSetFooter: { flex: 1 },
  baSetFooterLabel: { fontSize: 11, fontWeight: '500', color: GREY, marginBottom: 2 },
  baSetFooterValue: { fontSize: 12, fontWeight: '600', color: DARK },
  datePickerModal: { backgroundColor: WHITE, borderRadius: 20, width: '90%', padding: 24, elevation: 5 },
  datePickerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  datePickerTitle: { fontSize: 18, fontWeight: '700', color: DARK },
  monthYearNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, paddingHorizontal: 8 },
  monthYearSelector: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  monthYearText: { fontSize: 16, fontWeight: '600', color: DARK },
  yearButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: LIGHT_BLUE, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: BLUE, gap: 4 },
  yearButtonText: { fontSize: 16, fontWeight: '600', color: BLUE },
  dayGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 24 },
  dayButton: { width: '13%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 8, backgroundColor: '#F3F4F6', marginBottom: 8 },
  dayButtonSelected: { backgroundColor: BLUE },
  dayText: { fontSize: 14, fontWeight: '600', color: DARK },
  dayTextSelected: { color: WHITE },
  datePickerConfirmButton: { backgroundColor: BLUE, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  datePickerConfirmText: { fontSize: 16, fontWeight: '700', color: WHITE },
  yearPickerModal: { backgroundColor: WHITE, borderRadius: 20, width: '80%', maxHeight: '70%', padding: 24, elevation: 5 },
  yearPickerTitle: { fontSize: 18, fontWeight: '700', color: DARK, marginBottom: 16, textAlign: 'center' },
  yearOption: { paddingVertical: 16, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#E5E7EB', alignItems: 'center' },
  yearOptionSelected: { backgroundColor: LIGHT_BLUE, borderLeftWidth: 4, borderLeftColor: BLUE },
  yearOptionText: { fontSize: 16, fontWeight: '600', color: DARK },
  yearOptionTextSelected: { color: BLUE, fontWeight: '700' },
  yearPickerConfirmButton: { backgroundColor: BLUE, paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 16 },
  yearPickerConfirmText: { fontSize: 16, fontWeight: '700', color: WHITE },
});