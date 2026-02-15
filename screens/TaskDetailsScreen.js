import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BLUE = '#4285F4';
const DARK_GREY = '#333333';
const LIGHT_GREY = '#666666';
const GREEN = '#4CAF50';
const ORANGE = '#F9A825';
const RED = '#E53935';

export default function TaskDetailsScreen({ navigation, route }) {
  const { task } = route.params;

  // Get first BA-Set or Safety Kit for details
  const item = task.baSets && task.baSets[0] ? task.baSets[0] : (task.safetyKits && task.safetyKits[0] ? task.safetyKits[0] : null);

  // Check if task is in "Pending for Approval" status and has inspection data
  const isPendingApproval = task.status === 'Pending for Approval';
  const submittedInspectionData = task.inspectionData || {};

  // Use real inspection data from submission or default values
  const inspectionData = isPendingApproval ? {
    taskId: task.id,
    assetId: item?.id || task.id,
    location: item?.zone || 'Location TBA',
    cylinderNumbers: item?.cylinderNo || 'N/A',
    lastHydrotest: item?.lastInspection || 'N/A',
    nextHydrotest: item?.nextHydrotest || 'N/A',
    cylinder1Pressure: submittedInspectionData.cylinder1Pressure || 'N/A',
    cylinder2Pressure: submittedInspectionData.cylinder2Pressure || 'N/A',
    flowRate: submittedInspectionData.flowRate || 'N/A',
    faceMaskCondition: submittedInspectionData.faceMaskCondition || 'Pending',
    harnessStraps: submittedInspectionData.harnessStraps || 'Pending',
    cylinderValves: submittedInspectionData.cylinderValves || 'Pending',
    pressureGauge: submittedInspectionData.pressureGauge || 'Pending',
    demandValve: submittedInspectionData.demandValve || 'Pending',
    warningWhistle: submittedInspectionData.warningWhistle || 'Pending',
    gpsLocation: '40.7128° N, 74.0060° W',
    generalRemark: submittedInspectionData.generalRemark || `Inspect ${item?.name || task.taskType}. Task status: ${task.status}. Complete inspection and provide details.`,
    isLocationCaptured: false,
  } : {
    taskId: task.id,
    assetId: item?.id || task.id,
    location: item?.zone || 'Location TBA',
    cylinderNumbers: item?.cylinderNo || 'N/A',
    lastHydrotest: item?.lastInspection || 'N/A',
    nextHydrotest: item?.nextHydrotest || 'N/A',
    cylinder1Pressure: item?.pressure || 'N/A',
    cylinder2Pressure: 'N/A',
    flowRate: 'N/A',
    faceMaskCondition: 'Pending',
    harnessStraps: 'Pending',
    cylinderValves: 'Pending',
    pressureGauge: 'Pending',
    demandValve: 'Pending',
    warningWhistle: 'Pending',
    gpsLocation: '40.7128° N, 74.0060° W',
    generalRemark: `Inspect ${item?.name || task.taskType}. Task status: ${task.status}. Complete inspection and provide details.`,
    isLocationCaptured: false,
  };

  // Use real task assignment data
  const assignmentData = {
    assignee: task.assignedToName || task.assignedTo,
    dueDate: task.dueDate,
    taskDescription: task.description,
    baSetDetails: item ? `${item.id} - ${item.zone}` : 'No item assigned',
    assignedBy: 'SIC',
    priority: 'High',
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return ORANGE;
      case 'Pending for Approval':
        return '#7B1FA2';
      case 'Completed':
        return GREEN;
      case 'Approved':
        return GREEN;
      case 'Rejected':
        return RED;
      default:
        return LIGHT_GREY;
    }
  };

  const getStatusTextColor = (status) => {
    switch (status) {
      case 'Pending':
        return '#F57F17';
      case 'Pending for Approval':
        return '#7B1FA2';
      case 'Completed':
        return '#2E7D32';
      case 'Approved':
        return '#2E7D32';
      case 'Rejected':
        return '#C62828';
      default:
        return LIGHT_GREY;
    }
  };

  const getChecklistIcon = (value) => {
    switch (value) {
      case 'OK':
        return { name: 'checkmark-circle', color: GREEN };
      case 'NOT OK':
        return { name: 'close-circle', color: RED };
      case 'N/A':
        return { name: 'help-circle', color: LIGHT_GREY };
      default:
        return { name: 'help-circle', color: LIGHT_GREY };
    }
  };

  const handleStartInspection = () => {
    const equipmentId = item?.id || task.id;
    const zoneName = item?.zone || 'Location TBA';
    
    if (task.taskType === 'SK') {
      navigation.navigate('QRScanner', {
        skSetId: equipmentId,
        expectedEquipmentId: equipmentId,
        expectedZone: zoneName,
        location: zoneName,
      });
    } else {
      navigation.navigate('QRScanner', {
        baSetId: equipmentId,
        expectedEquipmentId: equipmentId,
        expectedZone: zoneName,
        location: zoneName,
      });
    }
  };

  const handleEditInspection = () => {
    navigation.navigate('InspectionForm', {
      baSetId: item?.id || task.id,
      location: item?.zone || 'Location TBA',
      // Pass existing data for editing
      inspectionData,
    });
  };

  const TaskDetailRow = ({ label, value, icon }) => (
    <View style={styles.detailRow}>
      <View style={styles.detailLeft}>
        <Ionicons name={icon} size={16} color={LIGHT_GREY} />
        <Text style={styles.detailLabel}>{label}</Text>
      </View>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );

  const ChecklistItem = ({ label, description, value }) => {
    const iconData = getChecklistIcon(value);
    return (
      <View style={styles.checklistItem}>
        <View style={styles.checklistItemHeader}>
          <Text style={styles.checklistLabel}>{label}</Text>
          {description && <Text style={styles.checklistDescription}>{description}</Text>}
        </View>
        <View style={styles.checklistStatus}>
          <Ionicons name={iconData.name} size={20} color={iconData.color} />
          <Text style={[styles.checklistStatusText, { color: iconData.color }]}>
            {value}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color={DARK_GREY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Task Details</Text>
        <TouchableOpacity>
          <Ionicons name="ellipsis-vertical" size={24} color={DARK_GREY} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Assignment Details Section for Pending Tasks or Pending for Approval Tasks */}
        {(task.status === 'Pending' || task.status === 'Pending for Approval' || task.status === 'Approved' || task.status === 'Rejected') ? (
          <>
            {/* Task Assignment Overview */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {task.status === 'Pending for Approval' ? 'Inspection Submitted' : task.status === 'Approved' ? 'Inspection Approved' : task.status === 'Rejected' ? 'Inspection Rejected' : 'Task Assignment'}
              </Text>
              
              <View style={styles.assignmentOverview}>
                <View style={styles.taskIdContainer}>
                  <Text style={styles.taskIdLabel}>Task ID</Text>
                  <Text style={styles.taskId}>{item?.id || task.id}</Text>
                </View>
                
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: `${getStatusColor(task.status)}20`, borderColor: getStatusColor(task.status) }
                ]}>
                  <Text style={[styles.statusText, { color: getStatusTextColor(task.status) }]}>
                    {task.status}
                  </Text>
                </View>
              </View>

              {task.status === 'Pending for Approval' ? (
                <>
                  <TaskDetailRow label="Inspected By" value={task.inspectedBy || 'Unknown'} icon="person-circle" />
                  <TaskDetailRow label="Submitted At" value={task.submittedAt || 'N/A'} icon="calendar-outline" />
                  <TaskDetailRow label="Equipment Type" value={task.taskType || 'Unknown'} icon="construct" />
                  <TaskDetailRow label="Equipment ID" value={item?.id || task.id} icon="barcode-outline" />
                  <TaskDetailRow label="Location" value={item?.zone || 'Location TBA'} icon="location-outline" />
                </>
              ) : task.status === 'Approved' ? (
                <>
                  <TaskDetailRow label="Inspected By" value={task.inspectedBy || 'Unknown'} icon="person-circle" />
                  <TaskDetailRow label="Submitted At" value={task.submittedAt || 'N/A'} icon="calendar-outline" />
                  <TaskDetailRow label="Approved At" value={task.approvedAt || 'N/A'} icon="calendar-outline" />
                  <TaskDetailRow label="Equipment Type" value={task.taskType || 'Unknown'} icon="construct" />
                  <TaskDetailRow label="Equipment ID" value={item?.id || task.id} icon="barcode-outline" />
                  <TaskDetailRow label="Location" value={item?.zone || 'Location TBA'} icon="location-outline" />
                </>
              ) : task.status === 'Rejected' ? (
                <>
                  <TaskDetailRow label="Inspected By" value={task.inspectedBy || 'Unknown'} icon="person-circle" />
                  <TaskDetailRow label="Submitted At" value={task.submittedAt || 'N/A'} icon="calendar-outline" />
                  <TaskDetailRow label="Rejected At" value={task.rejectedAt || 'N/A'} icon="calendar-outline" />
                  <TaskDetailRow label="Equipment Type" value={task.taskType || 'Unknown'} icon="construct" />
                  <TaskDetailRow label="Equipment ID" value={item?.id || task.id} icon="barcode-outline" />
                  <TaskDetailRow label="Location" value={item?.zone || 'Location TBA'} icon="location-outline" />
                </>
              ) : (
                <>
                  <TaskDetailRow label="Assigned To" value={assignmentData.assignee} icon="person-circle" />
                  <TaskDetailRow label="Due Date" value={assignmentData.dueDate} icon="calendar-outline" />
                  <TaskDetailRow label="Priority" value={assignmentData.priority} icon="alert-circle" />
                  <TaskDetailRow label="Assigned By" value={assignmentData.assignedBy} icon="shield-checkmark" />
                </>
              )}
            </View>

            {/* Task Description Section (only for Pending) */}
            {task.status === 'Pending' && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Task Description</Text>
                
                <View style={styles.descriptionCard}>
                  <Text style={styles.descriptionText}>
                    {assignmentData.taskDescription}
                  </Text>
                </View>
              </View>
            )}

            {/* Rejection Reason Section (only for Rejected) */}
            {task.status === 'Rejected' && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Rejection Reason</Text>
                
                <View style={[styles.descriptionCard, { borderLeftWidth: 4, borderLeftColor: RED }]}>
                  <Text style={[styles.descriptionText, { color: RED }]}>
                    {task.rejectionReason || 'No reason provided'}
                  </Text>
                </View>
              </View>
            )}

            {/* Equipment Details Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{task.taskType === 'SK' ? 'Safety Kit Details' : 'BA Set Details'}</Text>
              
              <View style={styles.baSetCard}>
                <Ionicons name={task.taskType === 'SK' ? "construct" : "cube"} size={24} color={BLUE} />
                <View style={styles.baSetInfo}>
                  <Text style={styles.baSetTitle}>{item?.id || task.id}</Text>
                  <Text style={styles.baSetLocation}>{item?.zone || 'Location TBA'}</Text>
                </View>
              </View>
            </View>
          </>
        ) : (
          // Detailed inspection view for non-pending tasks
          <>
            {/* Task Overview Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Task Overview</Text>
              
              <View style={styles.taskOverview}>
                <View style={styles.taskIdContainer}>
                  <Text style={styles.taskIdLabel}>Task ID</Text>
                  <Text style={styles.taskId}>{item?.id || task.id}</Text>
                </View>
                
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: `${getStatusColor(task.status)}20`, borderColor: getStatusColor(task.status) }
                ]}>
                  <Text style={[styles.statusText, { color: getStatusTextColor(task.status) }]}>
                    {task.status}
                  </Text>
                </View>
              </View>

              <TaskDetailRow label="Asset ID" value={inspectionData.assetId} icon="cube" />
              <TaskDetailRow label="Location" value={inspectionData.location} icon="location-outline" />
              <TaskDetailRow label="Cylinder Numbers" value={inspectionData.cylinderNumbers} icon="barbell" />
              <TaskDetailRow label="Last Hydrotest" value={inspectionData.lastHydrotest} icon="calendar-outline" />
              <TaskDetailRow label="Next Hydrotest Due" value={inspectionData.nextHydrotest} icon="calendar-outline" />
            </View>

            {/* Pressure Readings Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Pressure Readings</Text>
              
              <View style={styles.pressureGrid}>
                <View style={styles.pressureCard}>
                  <Text style={styles.pressureLabel}>CYLINDER 1</Text>
                  <Text style={styles.pressureValue}>{inspectionData.cylinder1Pressure}</Text>
                  <Text style={styles.pressureUnit}>BAR</Text>
                </View>
                <View style={styles.pressureCard}>
                  <Text style={styles.pressureLabel}>CYLINDER 2</Text>
                  <Text style={styles.pressureValue}>{inspectionData.cylinder2Pressure}</Text>
                  <Text style={styles.pressureUnit}>BAR</Text>
                </View>
                <View style={styles.pressureCard}>
                  <Text style={styles.pressureLabel}>FLOW RATE</Text>
                  <Text style={styles.pressureValue}>{inspectionData.flowRate}</Text>
                  <Text style={styles.pressureUnit}>L/MIN</Text>
                </View>
              </View>
            </View>

            {/* Inspection Checklist Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Inspection Checklist</Text>

              <ChecklistItem
                label="Face Mask Condition"
                description="Check for cracks, tears, and seal integrity"
                value={inspectionData.faceMaskCondition}
              />

              <ChecklistItem
                label="Harness & Straps"
                description="Inspect webbing, buckles, and attachment points"
                value={inspectionData.harnessStraps}
              />

              <ChecklistItem
                label="Cylinder Valves"
                description="Check operation, leaks, and thread condition"
                value={inspectionData.cylinderValves}
              />

              <ChecklistItem
                label="Pressure Gauge"
                description="Verify accuracy and readability"
                value={inspectionData.pressureGauge}
              />

              <ChecklistItem
                label="Demand Valve"
                description="Test airflow response and seal"
                value={inspectionData.demandValve}
              />

              <ChecklistItem
                label="Warning Whistle"
                description="Ensure audible alarm at correct pressure"
                value={inspectionData.warningWhistle}
              />
            </View>

            {/* GPS Location Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>GPS Location</Text>
              
              <View style={styles.gpsCard}>
                {inspectionData.isLocationCaptured ? (
                  <>
                    <Ionicons name="checkmark-circle" size={48} color={GREEN} />
                    <Text style={styles.gpsLocationText}>{inspectionData.gpsLocation}</Text>
                  </>
                ) : (
                  <>
                    <Ionicons name="location-outline" size={48} color="#CCC" />
                    <Text style={styles.noLocationText}>No location captured yet</Text>
                  </>
                )}
              </View>
            </View>

            {/* General Remarks Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>General Remarks</Text>
              
              <View style={styles.remarksCard}>
                <Text style={styles.remarksText}>
                  {inspectionData.generalRemark || 'No remarks provided.'}
                </Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {/* Bottom Action Buttons */}
      <View style={styles.bottomActions}>
        {task.status === 'Pending' ? (
          <TouchableOpacity style={styles.startBtn} onPress={handleStartInspection}>
            <Ionicons name="play-circle" size={18} color="#fff" />
            <Text style={styles.startBtnText}>Start Inspection</Text>
          </TouchableOpacity>
        ) : task.status === 'Pending for Approval' ? (
          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.viewBtn, { flex: 1 }]} onPress={() => Alert.alert('Pending Review', 'Your inspection has been submitted and is awaiting approval from the SIC.')}>
              <Ionicons name="information-circle" size={18} color="#fff" />
              <Text style={styles.viewBtnText}>Awaiting Approval</Text>
            </TouchableOpacity>
            <View style={{ width: 12 }} />
            <TouchableOpacity style={[styles.editBtn, { flex: 1 }]} onPress={handleEditInspection}>
              <Ionicons name="create" size={18} color="#fff" />
              <Text style={styles.editBtnText}>Edit & Resubmit</Text>
            </TouchableOpacity>
          </View>
        ) : task.status === 'Approved' ? (
          <TouchableOpacity style={[styles.viewBtn, { backgroundColor: GREEN }]} onPress={() => Alert.alert('Approved', 'Your inspection has been approved by the SIC.')}>
            <Ionicons name="checkmark-circle" size={18} color="#fff" />
            <Text style={styles.viewBtnText}>Inspection Approved</Text>
          </TouchableOpacity>
        ) : task.status === 'Rejected' ? (
          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.viewBtn, { flex: 1, backgroundColor: RED }]} onPress={() => Alert.alert('Rejected', `Your inspection was rejected.\n\nReason: ${task.rejectionReason || 'No reason provided'}`)}>
              <Ionicons name="close-circle" size={18} color="#fff" />
              <Text style={styles.viewBtnText}>View Reason</Text>
            </TouchableOpacity>
            <View style={{ width: 12 }} />
            <TouchableOpacity style={[styles.editBtn, { flex: 1 }]} onPress={handleEditInspection}>
              <Ionicons name="create" size={18} color="#fff" />
              <Text style={styles.editBtnText}>Resubmit</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.viewBtn} onPress={() => Alert.alert('Info', 'Inspection completed')}>
            <Ionicons name="eye" size={18} color="#fff" />
            <Text style={styles.viewBtnText}>View Report</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
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
  
  // Assignment Overview Styles
  assignmentOverview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  
  // Task Overview Styles
  taskOverview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  taskIdContainer: {
    flex: 1,
  },
  taskIdLabel: {
    fontSize: 12,
    color: LIGHT_GREY,
    fontWeight: '500',
    marginBottom: 4,
  },
  taskId: {
    fontSize: 20,
    fontWeight: '700',
    color: DARK_GREY,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    justifyContent: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  
  // Description Card Styles
  descriptionCard: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  descriptionText: {
    fontSize: 14,
    color: DARK_GREY,
    lineHeight: 20,
  },

  // BA Set Card Styles
  baSetCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  baSetInfo: {
    flex: 1,
    marginLeft: 12,
  },
  baSetTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: DARK_GREY,
    marginBottom: 4,
  },
  baSetLocation: {
    fontSize: 14,
    color: LIGHT_GREY,
  },

  // Detail Row Styles
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  detailLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: LIGHT_GREY,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: DARK_GREY,
  },

  // Pressure Readings Styles
  pressureGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  pressureCard: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  pressureLabel: {
    fontSize: 12,
    color: LIGHT_GREY,
    fontWeight: '500',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  pressureValue: {
    fontSize: 24,
    fontWeight: '700',
    color: DARK_GREY,
    marginBottom: 2,
  },
  pressureUnit: {
    fontSize: 12,
    color: LIGHT_GREY,
    fontWeight: '500',
  },

  // Checklist Styles
  checklistItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
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
  checklistStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checklistStatusText: {
    fontSize: 14,
    fontWeight: '600',
  },

  // GPS Location Styles
  gpsCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 180,
  },
  gpsLocationText: {
    fontSize: 16,
    fontWeight: '600',
    color: DARK_GREY,
    marginTop: 16,
    textAlign: 'center',
  },
  noLocationText: {
    fontSize: 16,
    color: LIGHT_GREY,
    marginTop: 16,
    textAlign: 'center',
  },

  // Remarks Styles
  remarksCard: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  remarksText: {
    fontSize: 14,
    color: DARK_GREY,
    lineHeight: 20,
  },

  // Bottom Actions Styles
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  startBtn: {
    backgroundColor: BLUE,
    flexDirection: 'row',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  startBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  editBtn: {
    backgroundColor: ORANGE,
    flexDirection: 'row',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  editBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  viewBtn: {
    backgroundColor: GREEN,
    flexDirection: 'row',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  viewBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});