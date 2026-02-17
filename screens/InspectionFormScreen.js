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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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

export default function InspectionFormScreen({ navigation, route }) {
  const { baSetId, location, inspectionData } = route?.params || {};
  const { tasks, updateTask } = useTaskContext();
  const { user } = useAuth();
  const scrollViewRef = useRef(null);
  const remarksInputRef = useRef(null);
  // Form state
  const [cylinder1Pressure, setCylinder1Pressure] = useState('300');
  const [cylinder2Pressure, setCylinder2Pressure] = useState('300');
  const [flowRate, setFlowRate] = useState('40');
  const [generalRemark, setGeneralRemark] = useState('');
  
  const [faceMaskCondition, setFaceMaskCondition] = useState(null);
  const [faceMaskReview, setFaceMaskReview] = useState('');
  const [harnessStraps, setHarnessStraps] = useState(null);
  const [harnessReview, setHarnessReview] = useState('');
  const [cylinderValves, setCylinderValves] = useState(null);
  const [cylinderValvesReview, setCylinderValvesReview] = useState('');
  const [pressureGauge, setPressureGauge] = useState(null);
  const [pressureGaugeReview, setPressureGaugeReview] = useState('');
  const [demandValve, setDemandValve] = useState(null);
  const [demandValveReview, setDemandValveReview] = useState('');
  const [warningWhistle, setWarningWhistle] = useState(null);
  const [warningWhistleReview, setWarningWhistleReview] = useState('');
  
  const [reviewText, setReviewText] = useState('');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [currentReviewField, setCurrentReviewField] = useState(null);

  // Get current task using useMemo for reliable task ID fetching
  const currentTask = useMemo(() => {
    if (!tasks || tasks.length === 0) return null;

    // 1. Try finding by taskId from route params (passed from QR scanner flow)
    const passedTaskId = route?.params?.taskId;
    if (passedTaskId) {
      const taskById = tasks.find(t => t.id === passedTaskId);
      if (taskById) return taskById;
    }

    // 2. Try finding by taskId from inspectionData (for edits)
    if (inspectionData && inspectionData.taskId) {
      const taskByIdFromInspection = tasks.find(t => t.id === inspectionData.taskId);
      if (taskByIdFromInspection) return taskByIdFromInspection;
    }

    // 3. Fallback: Search by baSetId
    if (baSetId) {
      const taskByBaSetId = tasks.find(taskItem => {
        // Safe check for baSets array
        const baSets = Array.isArray(taskItem.baSets) ? taskItem.baSets : [];
        const equipment = baSets.find(bs => bs.id === baSetId);
        
        // Also check safetyKits
        const safetyKits = Array.isArray(taskItem.safetyKits) ? taskItem.safetyKits : [];
        const kit = safetyKits.find(sk => sk.id === baSetId);
        
        return equipment || kit || taskItem.id === baSetId;
      });
      if (taskByBaSetId) return taskByBaSetId;
    }

    return null;
  }, [tasks, baSetId, inspectionData, route?.params?.taskId]);

  // Pre-fill form if editing existing inspection
  useEffect(() => {
    if (inspectionData) {
      setCylinder1Pressure(inspectionData.cylinder1Pressure || '300');
      setCylinder2Pressure(inspectionData.cylinder2Pressure || '300');
      setFlowRate(inspectionData.flowRate || '40');
      setGeneralRemark(inspectionData.generalRemark || '');
      
      setFaceMaskCondition(inspectionData.faceMaskCondition || null);
      setHarnessStraps(inspectionData.harnessStraps || null);
      setCylinderValves(inspectionData.cylinderValves || null);
      setPressureGauge(inspectionData.pressureGauge || null);
      setDemandValve(inspectionData.demandValve || null);
      setWarningWhistle(inspectionData.warningWhistle || null);

      // Restore reviews if they exist (assuming they are part of inspectionData)
      if (inspectionData.faceMaskReview) setFaceMaskReview(inspectionData.faceMaskReview);
      if (inspectionData.harnessReview) setHarnessReview(inspectionData.harnessReview);
      if (inspectionData.cylinderValvesReview) setCylinderValvesReview(inspectionData.cylinderValvesReview);
      if (inspectionData.pressureGaugeReview) setPressureGaugeReview(inspectionData.pressureGaugeReview);
      if (inspectionData.demandValveReview) setDemandValveReview(inspectionData.demandValveReview);
      if (inspectionData.warningWhistleReview) setWarningWhistleReview(inspectionData.warningWhistleReview);
    }
  }, [inspectionData]);

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
          onPress: () => navigation.goBack(),
        },
      ],
      { cancelable: true }
    );
  };

  const handleSaveReview = () => {
    if (currentReviewField === 'faceMask') {
      setFaceMaskReview(reviewText);
    } else if (currentReviewField === 'harness') {
      setHarnessReview(reviewText);
    } else if (currentReviewField === 'cylinderValves') {
      setCylinderValvesReview(reviewText);
    } else if (currentReviewField === 'pressureGauge') {
      setPressureGaugeReview(reviewText);
    } else if (currentReviewField === 'demandValve') {
      setDemandValveReview(reviewText);
    } else if (currentReviewField === 'warningWhistle') {
      setWarningWhistleReview(reviewText);
    }
    setReviewText('');
    setCurrentReviewField(null);
  };

  const openReviewModal = (fieldName) => {
    setCurrentReviewField(fieldName);
    // Pre-fill with existing review if any
    if (fieldName === 'faceMask' && faceMaskReview) {
      setReviewText(faceMaskReview);
    } else if (fieldName === 'harness' && harnessReview) {
      setReviewText(harnessReview);
    } else if (fieldName === 'cylinderValves' && cylinderValvesReview) {
      setReviewText(cylinderValvesReview);
    } else if (fieldName === 'pressureGauge' && pressureGaugeReview) {
      setReviewText(pressureGaugeReview);
    } else if (fieldName === 'demandValve' && demandValveReview) {
      setReviewText(demandValveReview);
    } else if (fieldName === 'warningWhistle' && warningWhistleReview) {
      setReviewText(warningWhistleReview);
    }
    setShowReviewModal(true);
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!faceMaskCondition || !harnessStraps || !cylinderValves || !pressureGauge || !demandValve || !warningWhistle) {
      Alert.alert('Error', 'Please complete all inspection checklist items');
      return;
    }

    // Find the task
    let currentTask;
    const params = route.params || {};

    // 1. Try finding by taskId from route params (most reliable)
    if (params.taskId) {
      currentTask = tasks.find(t => t.id === params.taskId);
    }

    // 2. Try finding by taskId from inspectionData (for edits)
    if (!currentTask && params.inspectionData && params.inspectionData.taskId) {
      currentTask = tasks.find(t => t.id === params.inspectionData.taskId);
    }

    // 3. Fallback: Search by baSetId (only if no taskId is available)
    if (!currentTask && params.baSetId && !params.taskId) {
      currentTask = tasks.find(task => {
        // Safe check for baSets array
        const baSets = Array.isArray(task.baSets) ? task.baSets : [];
        const equipment = baSets.find(bs => bs.id === params.baSetId);
        
        // Also check safetyKits
        const safetyKits = Array.isArray(task.safetyKits) ? task.safetyKits : [];
        const kit = safetyKits.find(sk => sk.id === params.baSetId);
        
        return equipment || kit || task.id === params.baSetId;
      });
    }

    if (!currentTask) {
      Alert.alert('Error', 'Task not found. Please try again.');
      return;
    }

    // Collect inspection data
    const inspectionData = {
      scannedLocation: location,
      cylinder1Pressure,
      cylinder2Pressure,
      flowRate,
      faceMaskCondition,
      faceMaskReview,
      harnessStraps,
      harnessReview,
      cylinderValves,
      cylinderValvesReview,
      pressureGauge,
      pressureGaugeReview,
      demandValve,
      demandValveReview,
      warningWhistle,
      warningWhistleReview,
      generalRemark,
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
          // Navigate back to TADashboard
          setTimeout(() => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'TADashboard' }],
            });
          }, 500);
        },
      },
    ]);
  };

  const ChecklistItem = ({ label, description, value, reviewValue, onOk, onNotOk, onNA, onClearReview }) => (
    <View style={styles.checklistItem}>
      <View style={styles.checklistItemHeader}>
        <Text style={styles.checklistLabel}>{label}</Text>
        {description && <Text style={styles.checklistDescription}>{description}</Text>}
      </View>
      <View style={styles.checklistButtons}>
        <TouchableOpacity
          style={[styles.checklistBtn, styles.okBtn, value === 'OK' && styles.checklistBtnActive]}
          onPress={() => {
            onOk();
            onClearReview();
          }}
        >
          <Ionicons name="checkmark" size={18} color={value === 'OK' ? '#fff' : GREEN} />
          <Text style={[styles.checklistBtnText, value === 'OK' && styles.checklistBtnTextActive]}>OK</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.checklistBtn, styles.notOkBtn, value === 'NOT OK' && styles.checklistBtnActive]}
          onPress={onNotOk}
        >
          <Ionicons name="close" size={18} color={value === 'NOT OK' ? '#fff' : RED} />
          <Text style={[styles.checklistBtnText, value === 'NOT OK' && styles.checklistBtnTextActive]}>NOT OK</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.checklistBtn, styles.naBtn, value === 'N/A' && styles.checklistBtnActive]}
          onPress={onNA}
        >
          <Text style={[styles.checklistBtnText, value === 'N/A' && styles.checklistBtnTextActive]}>N/A</Text>
        </TouchableOpacity>
      </View>
      
      {reviewValue && reviewValue.trim() !== '' && value !== 'OK' && (
        <View style={styles.reviewBox}>
          <View style={styles.reviewHeader}>
            <Ionicons name="document-text-outline" size={16} color={LIGHT_GREY} />
            <Text style={styles.reviewHeaderText}>Review Notes</Text>
          </View>
          <Text style={styles.reviewText}>{reviewValue}</Text>
        </View>
      )}
    </View>
  );

  return (
    <>
      <ReviewModal 
        visible={showReviewModal}
        onClose={() => {
          setShowReviewModal(false);
          setReviewText('');
          setCurrentReviewField(null);
        }}
        reviewText={reviewText}
        setReviewText={setReviewText}
        onSave={handleSaveReview}
      />
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={28} color={DARK_GREY} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>BA Set Inspection</Text>
          <TouchableOpacity>
            <Ionicons name="ellipsis-vertical" size={24} color={DARK_GREY} />
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.flex1}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <ScrollView 
            ref={scrollViewRef}
            style={styles.scrollView} 
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            scrollEnabled={true}
            bounces={false}
          >
            {/* Task Details Section */}
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
                  <Text style={styles.detailLabel}>Asset ID</Text>
                  <Text style={styles.detailValue}>{baSetId || 'BA-SET-042'}</Text>
                </View>
                <View style={styles.detailRight}>
                  <Text style={styles.detailLabel}>Location</Text>
                  <Text style={styles.detailValue}>{location || 'Zone A-3'}</Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <View style={styles.detailLeft}>
                  <Text style={styles.detailLabel}>Cylinder Numbers</Text>
                  <Text style={styles.detailValue}>CYL-8847, CYL-8848</Text>
                </View>
                <View style={styles.detailRight}>
                  <Text style={styles.detailLabel}>Due Date</Text>
                  <Text style={styles.detailValue}>{currentTask?.dueDate || 'N/A'}</Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <View style={styles.detailLeft}>
                  <Text style={styles.detailLabel}>Last Hydrotest</Text>
                  <Text style={styles.detailValue}>15 Jan 2024</Text>
                </View>
                <View style={styles.detailRight}>
                  <Text style={styles.detailLabel}>Next Hydrotest Due</Text>
                  <Text style={styles.detailValue}>15 Jan 2025</Text>
                </View>
              </View>
            </View>

            {/* Pressure Readings Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Pressure Readings</Text>

              <View style={styles.formGroup}>
                <Text style={styles.fieldLabel}>CYLINDER 1 PRESSURE (BAR)</Text>
                <TextInput
                  style={styles.input}
                  value={cylinder1Pressure}
                  onChangeText={setCylinder1Pressure}
                  keyboardType="decimal-pad"
                  placeholder="Enter pressure"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.fieldLabel}>CYLINDER 2 PRESSURE (BAR)</Text>
                <TextInput
                  style={styles.input}
                  value={cylinder2Pressure}
                  onChangeText={setCylinder2Pressure}
                  keyboardType="decimal-pad"
                  placeholder="Enter pressure"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.fieldLabel}>FLOW RATE (L/MIN)</Text>
                <TextInput
                  style={styles.input}
                  value={flowRate}
                  onChangeText={setFlowRate}
                  keyboardType="decimal-pad"
                  placeholder="Enter flow rate"
                />
              </View>
            </View>

            {/* Inspection Checklist Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Inspection Checklist</Text>

              <ChecklistItem
                label="Face Mask Condition"
                description="Check for cracks, tears, and seal integrity"
                value={faceMaskCondition}
                reviewValue={faceMaskReview}
                onOk={() => setFaceMaskCondition('OK')}
                onNotOk={() => {
                  setFaceMaskCondition('NOT OK');
                  openReviewModal('faceMask');
                }}
                onNA={() => {
                  setFaceMaskCondition('N/A');
                  openReviewModal('faceMask');
                }}
                onClearReview={() => setFaceMaskReview('')}
              />

              <ChecklistItem
                label="Harness & Straps"
                description="Inspect webbing, buckles, and attachment points"
                value={harnessStraps}
                reviewValue={harnessReview}
                onOk={() => setHarnessStraps('OK')}
                onNotOk={() => {
                  setHarnessStraps('NOT OK');
                  openReviewModal('harness');
                }}
                onNA={() => {
                  setHarnessStraps('N/A');
                  openReviewModal('harness');
                }}
                onClearReview={() => setHarnessReview('')}
              />

              <ChecklistItem
                label="Cylinder Valves"
                description="Check operation, leaks, and thread condition"
                value={cylinderValves}
                reviewValue={cylinderValvesReview}
                onOk={() => setCylinderValves('OK')}
                onNotOk={() => {
                  setCylinderValves('NOT OK');
                  openReviewModal('cylinderValves');
                }}
                onNA={() => {
                  setCylinderValves('N/A');
                  openReviewModal('cylinderValves');
                }}
                onClearReview={() => setCylinderValvesReview('')}
              />

              <ChecklistItem
                label="Pressure Gauge"
                description="Verify accuracy and readability"
                value={pressureGauge}
                reviewValue={pressureGaugeReview}
                onOk={() => setPressureGauge('OK')}
                onNotOk={() => {
                  setPressureGauge('NOT OK');
                  openReviewModal('pressureGauge');
                }}
                onNA={() => {
                  setPressureGauge('N/A');
                  openReviewModal('pressureGauge');
                }}
                onClearReview={() => setPressureGaugeReview('')}
              />

              <ChecklistItem
                label="Demand Valve"
                description="Test airflow response and seal"
                value={demandValve}
                reviewValue={demandValveReview}
                onOk={() => setDemandValve('OK')}
                onNotOk={() => {
                  setDemandValve('NOT OK');
                  openReviewModal('demandValve');
                }}
                onNA={() => {
                  setDemandValve('N/A');
                  openReviewModal('demandValve');
                }}
                onClearReview={() => setDemandValveReview('')}
              />

              <ChecklistItem
                label="Warning Whistle"
                description="Ensure audible alarm at correct pressure"
                value={warningWhistle}
                reviewValue={warningWhistleReview}
                onOk={() => setWarningWhistle('OK')}
                onNotOk={() => {
                  setWarningWhistle('NOT OK');
                  openReviewModal('warningWhistle');
                }}
                onNA={() => {
                  setWarningWhistle('N/A');
                  openReviewModal('warningWhistle');
                }}
                onClearReview={() => setWarningWhistleReview('')}
              />
            </View>


            {/* General Remarks Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>General Remarks</Text>
              
              <View style={styles.formGroup}>
                <Text style={styles.fieldLabel}>REMARKS (OPTIONAL)</Text>
                <TextInput
                  ref={remarksInputRef}
                  style={[styles.input, styles.remarksInput]}
                  value={generalRemark}
                  onChangeText={setGeneralRemark}
                  placeholder="Add any additional notes or observations about the inspection..."
                  placeholderTextColor={LIGHT_GREY}
                  multiline={true}
                  numberOfLines={4}
                  onFocus={() => {
                    // Scroll to bottom when remarks field is focused
                    setTimeout(() => {
                      scrollViewRef.current?.scrollToEnd({ animated: true });
                    }, 300);
                  }}
                />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        {/* Bottom Action Buttons */}
        <View style={styles.bottomActions}>
          <TouchableOpacity style={[styles.submitBtn, styles.cancelBtn]} onPress={handleCancel}>
            <Ionicons name="close-circle" size={18} color="#fff" />
            <Text style={styles.submitBtnText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
            <Ionicons name="send" size={18} color="#fff" />
            <Text style={styles.submitBtnText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 40,
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
  cancelBtn: {
    backgroundColor: RED,
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
});