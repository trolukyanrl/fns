import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Modal,
  DatePickerAndroid,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTaskContext } from '../TaskContext';
import { useAuth } from '../AuthContext';

const BLUE = '#4285F4';
const DARK_GREY = '#333333';
const LIGHT_GREY = '#666666';
const GREEN = '#4CAF50';
const ORANGE = '#F9A825';
const RED = '#E53935';

// Move ReviewModal OUTSIDE the main component
const ReviewModal = ({ visible, onClose, reviewText, setReviewText, onSave }) => (
  <Modal
    visible={visible}
    transparent={true}
    animationType="slide"
    onRequestClose={() => {
      onClose();
      setReviewText('');
      Keyboard.dismiss();
    }}
  >
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.modalContainer}
    >
      <View style={styles.modalOverlay} />
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <TouchableOpacity
            onPress={() => {
              onClose();
              setReviewText('');
              Keyboard.dismiss();
            }}
          >
            <Text style={styles.modalCloseText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Review</Text>
          <View style={styles.modalHeaderSpacer} />
        </View>

        <View style={styles.modalBody}>
          <Text style={styles.modalSubtitle}>Please provide details about this issue:</Text>
          
          <View style={styles.modalInputContainer}>
            <TextInput
              style={styles.modalInput}
              value={reviewText}
              onChangeText={setReviewText}
              placeholder="Describe any issues or observations about the inspection..."
              placeholderTextColor={LIGHT_GREY}
              multiline={true}
              numberOfLines={6}
              textAlignVertical="top"
              scrollEnabled={true}
              returnKeyType="done"
              blurOnSubmit={false}
              enablesReturnKeyAutomatically={true}
              autoFocus={true}
            />
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={styles.modalCancelBtn} 
              onPress={() => {
                onClose();
                setReviewText('');
                Keyboard.dismiss();
              }}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.modalSaveBtn} 
              onPress={() => {
                onSave();
                onClose();
                Keyboard.dismiss();
              }}
            >
              <Text style={styles.modalSaveText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  </Modal>
);

export default function SKInspectionScreen({ navigation, route }) {
  // Get parameters from QR scanner
  const { skSetId, location: scannedLocation } = route?.params || {};
  const { tasks, updateTask } = useTaskContext();
  const { user } = useAuth();

  // Find the task based on skSetId
  const currentTask = useMemo(() => {
    return tasks.find(task => {
      // Check if this task contains the scanned safety kit
      const hasSafetyKit = Array.isArray(task.safetyKits) && task.safetyKits.some(sk => sk.id === skSetId);
      // Or if the task ID matches (though skSetId is likely the equipment ID)
      return hasSafetyKit || task.id === skSetId;
    });
  }, [tasks, skSetId]);
  
  // ...existing code...
  // New state for form fields
  const [date, setDate] = useState('');
  const [shift, setShift] = useState('');
  const [area, setArea] = useState('');
  const [location, setLocation] = useState('');
  
  // State for QR code data
  const [locationId, setLocationId] = useState(scannedLocation || '');
  const [assetId, setAssetId] = useState(skSetId || '');
  
  // General remarks state
  const [generalRemarks, setGeneralRemarks] = useState('');
  
  // Pre-fill data if editing
  const inspectionData = route?.params?.inspectionData;

  useEffect(() => {
    if (inspectionData) {
      setDate(inspectionData.date || '');
      setShift(inspectionData.shift || '');
      setArea(inspectionData.area || '');
      setLocation(inspectionData.location || '');
      if (inspectionData.locationId) setLocationId(inspectionData.locationId);
      if (inspectionData.assetId) setAssetId(inspectionData.assetId);
      setGeneralRemarks(inspectionData.generalRemarks || '');
      
      if (inspectionData.materials && Array.isArray(inspectionData.materials)) {
        setMaterials(inspectionData.materials);
      }
    }
  }, [inspectionData]);
  
  // Ref for general remarks field
  const generalRemarksRef = useRef(null);
  
  // Date picker state
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [openExpiryDatePicker, setOpenExpiryDatePicker] = useState(false);
  const [selectedExpiryDate, setSelectedExpiryDate] = useState(new Date());
  const [expiryDatePickerIndex, setExpiryDatePickerIndex] = useState(null);
  
  // Shift picker state
  const [openShiftPicker, setOpenShiftPicker] = useState(false);
  const shiftOptions = ['Shift A', 'Shift B', 'Shift C'];

  // Table rows state
  const [materials, setMaterials] = useState([
    { material: 'Canister Mask : SO2', qty: '', status: '', replenished: '', expiry: '', remarks: '' },
    { material: 'Acid Gas/ Chlorine', qty: '', status: '', replenished: '', expiry: '', remarks: '' },
    { material: 'NH3', qty: '', status: '', replenished: '', expiry: '', remarks: '' },
    { material: 'H2S', qty: '', status: '', replenished: '', expiry: '', remarks: '' },
    { material: 'Hand Gloves: Chemicals', qty: '', status: '', replenished: '', expiry: '', remarks: '' },
    { material: 'Lather', qty: '', status: '', replenished: '', expiry: '', remarks: '' },
    { material: 'Kevlar/Asbestos', qty: '', status: '', replenished: '', expiry: '', remarks: '' },
    { material: 'Cotton', qty: '', status: '', replenished: '', expiry: '', remarks: '' },
    { material: 'Electrical', qty: '', status: '', replenished: '', expiry: '', remarks: '' },
    { material: 'FaceShield : Chemicals', qty: '', status: '', replenished: '', expiry: '', remarks: '' },
    { material: 'Furnance', qty: '', status: '', replenished: '', expiry: '', remarks: '' },
    { material: 'Googles: Bocal Blue', qty: '', status: '', replenished: '', expiry: '', remarks: '' },
    { material: 'Safety Goggles', qty: '', status: '', replenished: '', expiry: '', remarks: '' },
    { material: 'Ear Protection: Earmuff', qty: '', status: '', replenished: '', expiry: '', remarks: '' },
    { material: 'Ear Plug', qty: '', status: '', replenished: '', expiry: '', remarks: '' },
    { material: 'Safety Torch', qty: '', status: '', replenished: '', expiry: '', remarks: '' },
    { material: 'Dust Mask', qty: '', status: '', replenished: '', expiry: '', remarks: '' },
    { material: 'Water Gel', qty: '', status: '', replenished: '', expiry: '', remarks: '' },
    { material: 'Apron', qty: '', status: '', replenished: '', expiry: '', remarks: '' },
    { material: 'BA Set', qty: '', status: '', replenished: '', expiry: '', remarks: '' },
  ]);

  // Handler for table input changes
  const handleMaterialChange = (index, key, value) => {
    setMaterials(prev => {
      const updated = [...prev];
      updated[index][key] = value;
      return updated;
    });
  };

  // Handler for cancel with confirmation
  const handleCancel = () => {
    Alert.alert(
      'Cancel Inspection',
      'Are you sure you want to cancel? All unsaved data will be lost.',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => navigation.navigate('TADashboard'),
        },
      ],
      { cancelable: true }
    );
  };

  // Handler for form submit with confirmation
  const handleSubmit = () => {
    Alert.alert(
      'Submit Inspection',
      'Are you sure you want to submit this inspection?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes, Submit',
          style: 'default',
          onPress: () => {
            // Find the task that has this equipment (skSetId)
            const currentTask = tasks.find(task => {
              const equipment = Array.isArray(task.safetyKits) && task.safetyKits.find(sk => sk.id === skSetId);
              return equipment || task.id === skSetId;
            });

            if (!currentTask) {
              Alert.alert('Error', 'Task not found. Please try again.');
              return;
            }

            // Collect inspection data
            const inspectionData = {
              date,
              shift,
              area,
              location,
              locationId,
              assetId,
              generalRemarks,
              materials,
            };

            // Update task status to "Pending for Approval"
            const updatedTask = {
              ...currentTask,
              status: 'Pending for Approval',
              inspectionData,
              submittedAt: new Date().toLocaleString(),
              inspectedBy: user?.username || 'Unknown',
            };

            updateTask(currentTask.id, updatedTask);

            Alert.alert('Success', 'Inspection submitted successfully!', [
              {
                text: 'OK',
                onPress: () => {
                  navigation.navigate('TADashboard');
                },
              },
            ]);
          },
        },
      ],
      { cancelable: true }
    );
  };

  // Handler for date picker
  const handleDatePicker = () => {
    setOpenDatePicker(true);
  };

  // Handler for expiry date picker
  const handleExpiryDatePicker = (index) => {
    setExpiryDatePickerIndex(index);
    setOpenExpiryDatePicker(true);
  };

  // Handler to clear main date
  const handleClearDate = () => {
    setDate('');
    setSelectedDate(new Date());
    setOpenDatePicker(false);
  };

  // Handler to clear expiry date
  const handleClearExpiryDate = () => {
    if (expiryDatePickerIndex !== null) {
      setMaterials(prev => {
        const updated = [...prev];
        updated[expiryDatePickerIndex].expiry = '';
        return updated;
      });
    }
    setSelectedExpiryDate(new Date());
    setOpenExpiryDatePicker(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Fixed Header */}
      <View style={styles.fixedHeader}>
        <Text style={styles.headerTitle}>SK INSPECTION</Text>
      </View>
      
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >

        {/* SK Details Section - Similar to BA Set Details in InspectionFormScreen */}
        <View style={styles.detailsSection}>
          <View style={styles.detailRow}>
            <View style={styles.detailLeft}>
              <Text style={styles.detailLabel}>Task ID</Text>
              <Text style={styles.detailValue}>{currentTask?.id || 'N/A'}</Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{currentTask?.status || 'Pending'}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailLeft}>
              <Text style={styles.detailLabel}>Due Date</Text>
              <Text style={styles.detailValue}>15 Feb 2024</Text>
            </View>
            <View style={styles.detailRight}>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>{date || 'Select date'}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailLeft}>
              <Text style={styles.detailLabel}>Asset ID</Text>
              <Text style={styles.detailValue}>{assetId || 'Scan QR Code'}</Text>
            </View>
            <View style={styles.detailRight}>
              <Text style={styles.detailLabel}>Location</Text>
              <Text style={styles.detailValue}>{locationId || 'Scan QR Code'}</Text>
            </View>
          </View>
        </View>

        {/* Form Fields */}
        <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 24 }}>
          <View style={{ flexDirection: 'row', gap: 16, marginBottom: 12 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: '600', color: 'red', marginBottom: 4 }}>Date *</Text>
              <TouchableOpacity 
                style={styles.input}
                onPress={handleDatePicker}
              >
                <Text style={[styles.inputText, date ? styles.inputTextFilled : styles.inputTextPlaceholder]}>
                  {date || "dd-mm-yyyy"}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: '600', color: 'red', marginBottom: 4 }}>Shift *</Text>
              <TouchableOpacity
                style={[styles.input, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}
                onPress={() => setOpenShiftPicker(true)}
              >
                <Text style={[styles.inputText, shift ? styles.inputTextFilled : styles.inputTextPlaceholder]}>
                  {shift || "Select Shift"}
                </Text>
                <Ionicons name="chevron-down" size={20} color={LIGHT_GREY} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ flexDirection: 'row', gap: 16 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: '600', color: 'red', marginBottom: 4 }}>Area *</Text>
              <TextInput
                style={styles.input}
                value={area}
                onChangeText={setArea}
                placeholder="Area"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: '600', color: 'red', marginBottom: 4 }}>Location *</Text>
              <TextInput
                style={styles.input}
                value={location}
                onChangeText={setLocation}
                placeholder="Location"
              />
            </View>
          </View>
        </View>

        {/* Materials Cards Section */}
        <View style={{ marginBottom: 24 }}>
          {materials.map((row, idx) => (
            <View key={idx} style={styles.materialCard}>
              {/* Material Name */}
              <Text style={styles.materialName}>{row.material}</Text>
              
              {/* Input Fields Grid - 3 Rows Layout */}
              <View style={styles.inputGrid}>
                {/* Row 1: Standard Qty and Present Status */}
                <View style={styles.inputRow}>
                  <View style={styles.inputField}>
                    <Text style={styles.inputLabel}>Standard Qty</Text>
                    <TextInput
                      style={styles.cardInput}
                      value={row.qty}
                      onChangeText={v => handleMaterialChange(idx, 'qty', v)}
                      placeholder="-"
                      keyboardType="numeric"
                    />
                  </View>
                  
                  <View style={styles.inputField}>
                    <Text style={styles.inputLabel}>Present Status</Text>
                    <TextInput
                      style={styles.cardInput}
                      value={row.status}
                      onChangeText={v => handleMaterialChange(idx, 'status', v)}
                      placeholder="-"
                    />
                  </View>
                </View>
                
                {/* Row 2: Replenished and Expiry Date */}
                <View style={styles.inputRow}>
                  <View style={styles.inputField}>
                    <Text style={styles.inputLabel}>Replenished</Text>
                    <TextInput
                      style={styles.cardInput}
                      value={row.replenished}
                      onChangeText={v => handleMaterialChange(idx, 'replenished', v)}
                      placeholder="-"
                    />
                  </View>
                  
                  <View style={styles.inputField}>
                    <Text style={styles.inputLabel}>Expiry Date</Text>
                    <TouchableOpacity
                      style={styles.cardInput}
                      onPress={() => handleExpiryDatePicker(idx)}
                    >
                      <Text style={[styles.inputText, row.expiry ? styles.inputTextFilled : styles.inputTextPlaceholder]}>
                        {row.expiry || "dd-mm-yyyy"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                
                {/* Row 3: Remarks (Full Width) */}
                <View style={styles.inputRow}>
                  <View style={styles.fullWidthField}>
                    <Text style={styles.inputLabel}>Remarks</Text>
                    <TextInput
                      style={styles.cardInput}
                      value={row.remarks}
                      onChangeText={v => handleMaterialChange(idx, 'remarks', v)}
                      placeholder="-"
                    />
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* General Remarks Field */}
        <View 
          ref={generalRemarksRef}
          style={{ backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 20 }}
        >
          <Text style={{ fontWeight: '600', color: 'red', marginBottom: 8 }}>General Remarks</Text>
          <TextInput
            style={[styles.input, { minHeight: 80, textAlignVertical: 'top' }]}
            value={generalRemarks}
            onChangeText={setGeneralRemarks}
            placeholder="Enter any general remarks or observations..."
            placeholderTextColor={LIGHT_GREY}
            multiline={true}
            numberOfLines={4}
            onFocus={() => {
              // Scroll to the general remarks field when focused
              setTimeout(() => {
                generalRemarksRef.current?.measureLayout(
                  generalRemarksRef.current,
                  (x, y) => {
                    // Scroll to position with extra offset to show field above keyboard
                  }
                );
              }, 100);
            }}
          />
        </View>

        {/* Action Buttons */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32, gap: 12 }}>
          <TouchableOpacity style={[styles.submitBtn, styles.cancelBtn]} onPress={handleCancel}>
            <Ionicons name="close-circle" size={18} color="#fff" />
            <Text style={styles.submitBtnText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
            <Ionicons name="send" size={18} color="#fff" />
            <Text style={styles.submitBtnText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      </KeyboardAvoidingView>

      {/* Date Picker Modal */}
      {openDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="spinner"
          onChange={(event, date) => {
            if (event.type === 'set' && date) {
              setSelectedDate(date);
              const day = String(date.getDate()).padStart(2, '0');
              const month = String(date.getMonth() + 1).padStart(2, '0');
              const year = date.getFullYear();
              setDate(`${day}-${month}-${year}`);
              setOpenDatePicker(false);
            } else if (event.type === 'dismissed') {
              setOpenDatePicker(false);
            } else if (event.type === 'neutralButtonPressed') {
              setDate('');
              setSelectedDate(new Date());
              setOpenDatePicker(false);
            }
          }}
          neutralButtonLabel="Clear"
        />
      )}

      {/* Expiry Date Picker Modal */}
      {openExpiryDatePicker && (
        <DateTimePicker
          value={selectedExpiryDate}
          mode="date"
          display="spinner"
          onChange={(event, date) => {
            if (event.type === 'set' && date) {
              setSelectedExpiryDate(date);
              const day = String(date.getDate()).padStart(2, '0');
              const month = String(date.getMonth() + 1).padStart(2, '0');
              const year = date.getFullYear();
              const formattedDate = `${day}-${month}-${year}`;
              
              if (expiryDatePickerIndex !== null) {
                setMaterials(prev => {
                  const updated = [...prev];
                  updated[expiryDatePickerIndex].expiry = formattedDate;
                  return updated;
                });
              }
              setOpenExpiryDatePicker(false);
            } else if (event.type === 'dismissed') {
              setOpenExpiryDatePicker(false);
            } else if (event.type === 'neutralButtonPressed') {
              if (expiryDatePickerIndex !== null) {
                setMaterials(prev => {
                  const updated = [...prev];
                  updated[expiryDatePickerIndex].expiry = '';
                  return updated;
                });
              }
              setSelectedExpiryDate(new Date());
              setOpenExpiryDatePicker(false);
            }
          }}
          neutralButtonLabel="Clear"
        />
      )}

      {/* Shift Picker Modal */}
      {openShiftPicker && (
        <Modal
          transparent={true}
          visible={openShiftPicker}
          animationType="slide"
          onRequestClose={() => setOpenShiftPicker(false)}
        >
          <TouchableWithoutFeedback onPress={() => setOpenShiftPicker(false)}>
            <View style={styles.modalContainer}>
              <View style={styles.modalOverlay} />
              <TouchableWithoutFeedback>
                <View style={styles.pickerModalContent}>
                  <View style={styles.pickerHeader}>
                    <TouchableOpacity onPress={() => setOpenShiftPicker(false)}>
                      <Text style={styles.pickerCancel}>Cancel</Text>
                    </TouchableOpacity>
                    <Text style={styles.pickerTitle}>Select Shift</Text>
                    <View style={styles.modalHeaderSpacer} />
                  </View>
                  
                  <View style={styles.pickerOptions}>
                    {shiftOptions.map((option, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.pickerOption,
                          shift === option && styles.pickerOptionSelected
                        ]}
                        onPress={() => {
                          setShift(option);
                          setOpenShiftPicker(false);
                        }}
                      >
                        <Text style={[
                          styles.pickerOptionText,
                          shift === option && styles.pickerOptionTextSelected
                        ]}>
                          {option}
                        </Text>
                        {shift === option && (
                          <Ionicons name="checkmark" size={24} color={BLUE} />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  flex1: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: DARK_GREY,
  },
  fixedHeader: {
    backgroundColor: '#fff',
    paddingVertical: 40,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    zIndex: 1000,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    color: DARK_GREY,
  },
  detailsSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailLeft: {
    flex: 1,
  },
  detailRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  detailLabel: {
    fontSize: 12,
    color: LIGHT_GREY,
    fontWeight: '500',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: DARK_GREY,
  },
  statusBadge: {
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    justifyContent: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: ORANGE,
  },
  scrollView: {
    flex: 1,
    marginTop: 0,
  },
  scrollContent: {
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  detailsSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailLeft: {
    flex: 1,
  },
  detailRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  detailLabel: {
    fontSize: 12,
    color: LIGHT_GREY,
    fontWeight: '500',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: DARK_GREY,
  },
  statusBadge: {
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    justifyContent: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: ORANGE,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: DARK_GREY,
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: RED,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: DARK_GREY,
    backgroundColor: '#F9F9F9',
  },
  materialCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  materialName: {
    fontSize: 16,
    fontWeight: '700',
    color: DARK_GREY,
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  inputGrid: {
    gap: 16,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inputField: {
    flex: 1,
    minWidth: 120,
  },
  fullWidthField: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: LIGHT_GREY,
    marginBottom: 6,
    textAlign: 'center',
  },
  cardInput: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: DARK_GREY,
    backgroundColor: '#F9F9F9',
    textAlign: 'center',
    minHeight: 44,
    justifyContent: 'center',
  },
  checklistItem: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  checklistItemHeader: {
    marginBottom: 12,
  },
  checklistLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: DARK_GREY,
    marginBottom: 4,
  },
  checklistDescription: {
    fontSize: 13,
    color: LIGHT_GREY,
  },
  checklistButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  checklistBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 4,
    backgroundColor: '#F9F9F9',
  },
  okBtn: {
    borderColor: GREEN,
  },
  notOkBtn: {
    borderColor: RED,
  },
  naBtn: {
    borderColor: LIGHT_GREY,
  },
  checklistBtnActive: {
    backgroundColor: BLUE,
    borderColor: BLUE,
  },
  checklistBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: DARK_GREY,
  },
  checklistBtnTextActive: {
    color: '#fff',
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
  },
  saveDraftBtn: {
    flex: 1,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#DDD',
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  saveDraftBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: LIGHT_GREY,
  },
  submitBtn: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: BLUE,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  cancelBtn: {
    backgroundColor: LIGHT_GREY,
  },
  submitBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  remarksInput: {
    textAlignVertical: 'top',
    paddingVertical: 12,
  },
  
  // Review Box Styles
  reviewBox: {
    marginTop: 12,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  reviewHeaderText: {
    fontSize: 12,
    fontWeight: '600',
    color: LIGHT_GREY,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  reviewText: {
    fontSize: 14,
    color: DARK_GREY,
    lineHeight: 20,
  },
  
  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  modalCloseText: {
    fontSize: 16,
    color: LIGHT_GREY,
    fontWeight: '500',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: DARK_GREY,
  },
  modalHeaderSpacer: {
    width: 50,
  },
  modalBody: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  modalSubtitle: {
    fontSize: 14,
    color: LIGHT_GREY,
    marginBottom: 16,
    fontWeight: '600',
  },
  modalInputContainer: {
    marginBottom: 24,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: DARK_GREY,
    backgroundColor: '#F9F9F9',
    minHeight: 160,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalCancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: BLUE,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: BLUE,
  },
  modalSaveBtn: {
    flex: 1,
    backgroundColor: BLUE,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSaveText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  
  // Date Picker Styles
  datePickerModal: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  datePickerContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  datePickerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: DARK_GREY,
  },
  datePickerCancel: {
    fontSize: 16,
    color: LIGHT_GREY,
    fontWeight: '500',
  },
  datePickerClear: {
    fontSize: 16,
    color: RED,
    fontWeight: '600',
  },
  datePickerConfirm: {
    fontSize: 16,
    color: BLUE,
    fontWeight: '600',
  },
  datePickerIOS: {
    width: '100%',
  },
  datePickerConfirmBtn: {
    backgroundColor: BLUE,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  datePickerConfirmText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  
  // Input Text Styles
  inputText: {
    fontSize: 16,
    color: DARK_GREY,
  },
  inputTextFilled: {
    color: DARK_GREY,
  },
  inputTextPlaceholder: {
    color: LIGHT_GREY,
  },
  
  // Shift Picker Styles
  pickerModalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '50%',
  },
  pickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  pickerCancel: {
    fontSize: 16,
    color: LIGHT_GREY,
    fontWeight: '500',
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: DARK_GREY,
  },
  pickerOptions: {
    paddingVertical: 8,
  },
  pickerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  pickerOptionSelected: {
    backgroundColor: '#F0F7FF',
  },
  pickerOptionText: {
    fontSize: 16,
    color: DARK_GREY,
    fontWeight: '500',
  },
  pickerOptionTextSelected: {
    color: BLUE,
    fontWeight: '600',
  },
});