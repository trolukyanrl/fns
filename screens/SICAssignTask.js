import React, { useState, useEffect } from 'react';
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
import api, { itemsAPI } from '../services/api';
import axios from 'axios';

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


export default function SICAssignTask({ navigation, route }) {
  const { addTask, updateTask } = useTaskContext();
  const editingTask = route?.params?.taskToEdit;
  const isEditMode = !!editingTask;
  
  // State for inspectors (TA users)
  const [inspectors, setInspectors] = useState([]);
  const [loadingInspectors, setLoadingInspectors] = useState(true);
  
  // State for BA-Sets and Safety Kits
  const [baSets, setBASets] = useState([]);
  const [safetyKits, setSafetyKits] = useState([]);
  const [loadingItems, setLoadingItems] = useState(true);
  
  // Fetch inspectors with role "TA" from API
  useEffect(() => {
    fetchInspectors();
    fetchBASets();
    fetchSafetyKits();
  }, []);
  
  const fetchInspectors = async () => {
    try {
      setLoadingInspectors(true);
      const response = await api.get('/users');
      
      // Filter users with role "ta" (case-insensitive)
      const taUsers = response.data.filter(user => 
        user.role && user.role.toLowerCase() === 'ta'
      );
      
      // Map API users to inspector format
      const mappedInspectors = taUsers.map((user, index) => ({
        id: user.id || String(index + 1),
        name: user.name || user.username,
        department: user.role || 'Task Assignor',
        username: user.username,
      }));
      
      setInspectors(mappedInspectors);
      console.log('Fetched TA users:', mappedInspectors);
    } catch (error) {
      console.error('Error fetching inspectors:', error);
      // Fallback to empty array
      setInspectors([]);
      Alert.alert('Error', 'Failed to load inspectors. Please try again.');
    } finally {
      setLoadingInspectors(false);
    }
  };
  
  const fetchBASets = async () => {
    try {
      setLoadingItems(true);
      const response = await itemsAPI.getBASets();
      setBASets(response.data || []);
      console.log('Fetched BA-Sets:', response.data);
    } catch (error) {
      console.error('Error fetching BA-Sets:', error.message);
      console.error('Status:', error.response?.status);
      console.error('URL:', error.config?.url);
      setBASets([]);
      Alert.alert(
        'BA-Sets Not Found',
        `Please verify the collection name in MockAPI. Error: ${error.response?.status || error.message}`
      );
    } finally {
      setLoadingItems(false);
    }
  };
  
  const fetchSafetyKits = async () => {
    try {
      // Use the separate Safety Kits API endpoint
      const response = await itemsAPI.getSafetyKits();
      setSafetyKits(response.data || []);
      console.log('Fetched Safety-Kits:', response.data);
    } catch (error) {
      console.error('Error fetching Safety-Kits:', error.message);
      setSafetyKits([]);
    }
  };
  
  const findInspectorById = (name, dept) => {
    return inspectors.find(insp => insp.name === name && insp.department === dept);
  };

  const [taskDescription, setTaskDescription] = useState(editingTask?.description || '');
  const [selectedInspector, setSelectedInspector] = useState(editingTask ? findInspectorById(editingTask.assignedTo, editingTask.assignedToDept) : null);
  const [dueDate, setDueDate] = useState(editingTask?.dueDate || '');
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [showZoneModal, setShowZoneModal] = useState(false);
  const [showInspectorModal, setShowInspectorModal] = useState(false);
  const [selectedTaskType, setSelectedTaskType] = useState(TASK_TYPES[0]); // Default to BA-SET
  const [selectedBASets, setSelectedBASets] = useState(editingTask ? (editingTask.baSets?.map(bs => bs.id) || []) : []);
  const [selectedSKs, setSelectedSKs] = useState(editingTask ? (editingTask.safetyKits?.map(sk => sk.id) || []) : []);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  

  // Filter based on selected task type
  const getFilteredItems = () => {
    if (selectedTaskType.name === 'BA-SET') {
      return baSets.filter(baSet => {
        const query = searchQuery.toLowerCase();
        return (
          (baSet.id && baSet.id.toLowerCase().includes(query)) ||
          (baSet.name && baSet.name.toLowerCase().includes(query)) ||
          (baSet.zone && baSet.zone.toLowerCase().includes(query)) ||
          (baSet.cylinderNo && baSet.cylinderNo.toLowerCase().includes(query))
        );
      });
    } else {
      return safetyKits.filter(sk => {
        const query = searchQuery.toLowerCase();
        return (
          (sk.id && sk.id.toLowerCase().includes(query)) ||
          (sk.name && sk.name.toLowerCase().includes(query)) ||
          (sk.zone && sk.zone.toLowerCase().includes(query)) ||
          (sk.kitType && sk.kitType.toLowerCase().includes(query))
        );
      });
    }
  };

  const handleAssignTask = async () => {
    const selectedItems = selectedTaskType.name === 'BA-SET' ? selectedBASets : selectedSKs;
    
    if (!taskDescription.trim() || !selectedInspector || !dueDate.trim() || selectedItems.length === 0) {
      Alert.alert('Error', `Please fill in all fields and select at least one ${selectedTaskType.name === 'BA-SET' ? 'BA set' : 'Safety Kit'} to assign a task.`);
      return;
    }

    try {
      if (isEditMode) {
        // Update existing task
        const taskData = {
          description: taskDescription,
          assignedTo: selectedInspector.username,
          assignedToName: selectedInspector.name,
          assignedToDept: selectedInspector.department,
          dueDate: dueDate,
          taskType: selectedTaskType.name,
          status: 'Pending',
        };

        if (selectedTaskType.name === 'BA-SET') {
          taskData.baSets = selectedBASets.map(id => baSets.find(bs => bs.id === id)).filter(Boolean);
        } else {
          taskData.safetyKits = selectedSKs.map(id => safetyKits.find(sk => sk.id === id)).filter(Boolean);
        }

        await updateTask(editingTask.id, taskData);
        Alert.alert(
          'Task Updated',
          `Task for ${selectedInspector.name} has been updated successfully.`,
          [{ text: 'OK', onPress: () => navigation.replace('SICTasks') }]
        );
      } else {
        // Create a separate task for each selected asset to ensure unique task IDs
        let createdCount = 0;
        
        for (let i = 0; i < selectedItems.length; i++) {
          const selectedItemId = selectedItems[i];
          
          // Create task object for this specific asset
          const taskData = {
            description: taskDescription,
            assignedTo: selectedInspector.username,
            assignedToName: selectedInspector.name,
            assignedToDept: selectedInspector.department,
            dueDate: dueDate,
            taskType: selectedTaskType.name,
            status: 'Pending',
          };

          if (selectedTaskType.name === 'BA-SET') {
            const baSet = baSets.find(bs => bs.id === selectedItemId);
            if (baSet) {
              // Transform BA-Set to use distinct field names
              taskData.baSets = [{
                ...baSet,
                assetId: baSet.id, // Keep original asset ID
                // taskId will be added by the API response
              }];
            } else {
              taskData.baSets = [];
            }
          } else {
            const safetyKit = safetyKits.find(sk => sk.id === selectedItemId);
            if (safetyKit) {
              // Transform Safety Kit to use distinct field names
              taskData.safetyKits = [{
                ...safetyKit,
                assetId: safetyKit.id, // Keep original asset ID
                // taskId will be added by the API response
              }];
            } else {
              taskData.safetyKits = [];
            }
          }

          // Create task
          await addTask(taskData);
          createdCount++;
        }

        // Reset form
        setTaskDescription('');
        setSelectedInspector(null);
        setDueDate('');
        setSelectedBASets([]);
        setSelectedSKs([]);

        Alert.alert(
          'Tasks Assigned',
          `${createdCount} task(s) have been assigned to ${selectedInspector.name} with due date ${dueDate}. Each asset has been assigned a unique task ID.`,
          [{ text: 'OK', onPress: () => {
              navigation.replace('SICTasks');
            }}]
        );
      }
    } catch (error) {
      console.error('Task assignment error:', error);
      Alert.alert('Error', 'Failed to save task. Please check your connection and try again.');
    }
  };

  const renderTaskType = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.typeItem,
        selectedTaskType?.id === item.id && styles.typeItemSelected
      ]}
      onPress={() => {
        setSelectedTaskType(item);
        setShowTypeModal(false);
        // Reset selections when switching type
        setSearchQuery('');
      }}
    >
      <Ionicons name={item.icon} size={20} color={selectedTaskType?.id === item.id ? BLUE : GREY} />
      <Text style={[
        styles.typeText,
        selectedTaskType?.id === item.id && styles.typeTextSelected
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

  const toggleSKSelection = (skId) => {
    if (selectedSKs.includes(skId)) {
      setSelectedSKs(selectedSKs.filter(id => id !== skId));
    } else {
      setSelectedSKs([...selectedSKs, skId]);
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
          <Ionicons name="checkmark-circle" size={20} color="#93C5FD" />
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

  const renderSKCard = (sk) => (
    <TouchableOpacity
      style={[
        styles.baSetCard,
        selectedSKs.includes(sk.id) && styles.baSetCardSelected
      ]}
      onPress={() => toggleSKSelection(sk.id)}
    >
      <View style={styles.baSetHeader}>
        <View style={styles.baSetTitleSection}>
          <Text style={styles.baSetId}>{sk.id}</Text>
          <View style={styles.statusBadge}>
            <Ionicons name="checkmark-circle" size={14} color={GREEN} />
            <Text style={styles.statusText}>{sk.status}</Text>
          </View>
        </View>
        {selectedSKs.includes(sk.id) && (
          <Ionicons name="checkmark-circle" size={20} color="#93C5FD" />
        )}
      </View>

      <Text style={styles.baSetName}>{sk.name}</Text>
      <View style={styles.baSetLocation}>
        <Ionicons name="location" size={14} color={GREY} />
        <Text style={styles.baSetLocationText}>{sk.zone}</Text>
      </View>

      <View style={styles.baSetDetailsRow}>
        <View style={styles.baSetDetail}>
          <Text style={styles.baSetDetailLabel}>Kit Type</Text>
          <Text style={styles.baSetDetailValue}>{sk.kitType}</Text>
        </View>
        <View style={styles.baSetDetail}>
          <Text style={styles.baSetDetailLabel}>Items</Text>
          <Text style={styles.baSetDetailValue}>{sk.itemCount}</Text>
        </View>
      </View>

      <View style={styles.baSetFooterRow}>
        <View style={styles.baSetFooter}>
          <Text style={styles.baSetFooterLabel}>Next Inspection</Text>
          <Text style={styles.baSetFooterValue}>{sk.nextInspection}</Text>
        </View>
        <View style={styles.baSetFooter}>
          <Text style={styles.baSetFooterLabel}>Last Inspection</Text>
          <Text style={styles.baSetFooterValue}>{sk.lastInspection}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Fixed Header - Outside ScrollView */}
      <View style={styles.fixedHeader}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={DARK} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>{isEditMode ? 'Edit Task' : 'Assign Task'}</Text>
            <Text style={styles.headerSubtitle}>SITE IN-CHARGE</Text>
          </View>
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
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

        {/* Task Type Selection Section */}
        <View style={styles.baSetSection}>
          <Text style={styles.baSetSectionTitle}>Select Task Type</Text>
          <Text style={styles.baSetSectionSubtitle}>Choose the type of equipment for this task</Text>
          
          {/* Task Type Dropdown */}
          <View style={styles.inputGroup}>
            <TouchableOpacity
              style={styles.taskTypeSelector}
              onPress={() => setShowTypeModal(true)}
            >
              <Ionicons name={selectedTaskType.icon} size={18} color={BLUE} style={styles.inputIcon} />
              <Text style={styles.taskTypeText}>{selectedTaskType.name}</Text>
              <Ionicons name="chevron-down" size={16} color={BLUE} />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color={LIGHT_GREY} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder={`Search ${selectedTaskType.name === 'BA-SET' ? 'BA sets' : 'Safety Kits'} by ID, name, or zone...`}
              placeholderTextColor={LIGHT_GREY}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          
          {/* Items List */}
          {loadingItems ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading {selectedTaskType.name === 'BA-SET' ? 'BA Sets' : 'Safety Kits'}...</Text>
            </View>
          ) : getFilteredItems().length === 0 ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>No {selectedTaskType.name === 'BA-SET' ? 'BA Sets' : 'Safety Kits'} available</Text>
            </View>
          ) : (
            <FlatList
              data={getFilteredItems()}
              renderItem={({ item }) => selectedTaskType.name === 'BA-SET' ? renderBASetCard(item) : renderSKCard(item)}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled={false}
              style={styles.baSetList}
            />
          )}
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
            {loadingInspectors ? (
              <Text style={[styles.modalTitle, { fontSize: 14, marginTop: 20 }]}>Loading inspectors...</Text>
            ) : inspectors.length === 0 ? (
              <Text style={[styles.modalTitle, { fontSize: 14, marginTop: 20, color: GREY }]}>No inspectors available</Text>
            ) : (
              <FlatList
                data={inspectors}
                renderItem={renderInspector}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
              />
            )}
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
  fixedHeader: { 
    backgroundColor: '#F9FAFB', 
    paddingHorizontal: 20, 
    paddingTop: 48, 
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  container: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20 },
  header: { flexDirection: 'row', alignItems: 'center' },
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
  assignButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: BLUE, borderRadius: 12, paddingVertical: 16, paddingHorizontal: 24, flex: 1, marginLeft: 8 },
  buttonIcon: { marginRight: 12 },
  assignButtonText: { fontSize: 16, fontWeight: '700', color: WHITE },
  buttonsContainer: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 16, paddingBottom: 24, backgroundColor: WHITE, borderTopWidth: 1, borderTopColor: '#E5E7EB' },
  cancelButton: { backgroundColor: WHITE, borderRadius: 12, paddingVertical: 16, paddingHorizontal: 24, borderWidth: 1, borderColor: BLUE, flex: 1, alignItems: 'center', justifyContent: 'center' },
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
  taskTypeSelector: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: LIGHT_BLUE, 
    borderRadius: 12, 
    paddingHorizontal: 16, 
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: BLUE,
  },
  taskTypeText: { 
    flex: 1, 
    fontSize: 16, 
    color: BLUE, 
    fontWeight: '600',
    marginLeft: 12,
  },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 16 },
  searchIcon: { marginRight: 12 },
  searchInput: { flex: 1, fontSize: 16, color: DARK },
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
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, width: 'auto' },
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
  loadingContainer: { paddingVertical: 40, alignItems: 'center', justifyContent: 'center' },
  loadingText: { fontSize: 16, color: GREY, fontWeight: '500' },
});