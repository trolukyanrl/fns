import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTaskContext } from '../TaskContext';

const BLUE = '#2563EB';
const DARK = '#1F2937';
const GREY = '#6B7280';
const LIGHT_GREY = '#9CA3AF';
const WHITE = '#FFFFFF';
const GREEN = '#22C55E';
const RED = '#EF4444';
const YELLOW = '#F59E0B';
const ORANGE = '#F97316';

export default function ApprovalReviewScreen({ navigation, route }) {
  const [activeTab, setActiveTab] = useState('Home');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const { approval } = route.params;
  const { updateTask } = useTaskContext();

  // Map task to approval format if needed
  const getApprovalData = () => {
    // Check if this is a task object from TaskContext or approval object
    const isTask = approval.baSets || approval.safetyKits;
    
    if (isTask) {
      // It's a task object, map it to approval format
      const isSKTask = approval.safetyKits && approval.safetyKits.length > 0;
      const equipment = approval.baSets?.[0] || approval.safetyKits?.[0];
      const inspectionData = approval.inspectionData || {};
      // Use scanned location from inspection data, fall back to original task location
      const location = inspectionData.scannedLocation || inspectionData.location || approval.location || 'Location TBA';
      return {
        id: approval.id,
        assetId: equipment?.id || 'Unknown',
        taskId: approval.id,
        inspector: approval.assignedToName || approval.assignedTo || 'Unknown',
        department: approval.assignedToDept || 'Unknown',
        submittedDate: approval.submittedAt || 'Date not available',
        location: location,
        inspectionData: inspectionData,
        taskType: approval.taskType || (isSKTask ? 'SK' : 'BA-SET'),
        isSKTask: isSKTask,
      };
    }
    
    // It's already an approval object
    return approval;
  };

  const approvalData = getApprovalData();

  const handleNavigation = (tab) => {
    setActiveTab(tab);
    if (tab === 'Home') navigation.navigate('SICDashboard');
    if (tab === 'Tasks') navigation.navigate('SICTasks');
    if (tab === 'Profile') navigation.navigate('SICProfile');
  };

  const handleApprove = () => {
    Alert.alert(
      'Approve Inspection',
      `Are you sure you want to approve the inspection for ${approvalData.assetId}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          style: 'default',
          onPress: () => {
            // Update task status to 'Approved'
            if (approvalData.taskId) {
              updateTask(approvalData.taskId, {
                ...approval,
                status: 'Approved',
                approvedAt: new Date().toLocaleString(),
              });
            }
            Alert.alert(
              'Inspection Approved',
              `Inspection for ${approvalData.assetId} has been approved successfully.`,
              [{ text: 'OK', onPress: () => navigation.goBack() }]
            );
          }
        }
      ]
    );
  };

  const handleReject = () => {
    setShowRejectModal(true);
  };

  const handleSubmitReject = () => {
    if (rejectReason.trim() === '') {
      Alert.alert('Error', 'Please provide a reason for rejection.');
      return;
    }
    
    Alert.alert(
      'Reject Inspection',
      `Are you sure you want to reject the inspection for ${approvalData.assetId}?\n\nReason: ${rejectReason}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: () => {
            // Update task status to 'Rejected'
            if (approvalData.taskId) {
              updateTask(approvalData.taskId, {
                ...approval,
                status: 'Rejected',
                rejectionReason: rejectReason,
                rejectedAt: new Date().toLocaleString(),
              });
            }
            
            Alert.alert(
              'Inspection Rejected',
              `Inspection for ${approvalData.assetId} has been rejected with reason: ${rejectReason}`,
              [{ text: 'OK', onPress: () => {
                setShowRejectModal(false);
                setRejectReason('');
                navigation.goBack();
              } }]
            );
          }
        }
      ]
    );
  };

  const getChecklistItemColor = (status) => {
    switch (status) {
      case 'OK': return GREEN;
      case 'NOT OK': return RED;
      case 'N/A': return LIGHT_GREY;
      default: return GREY;
    }
  };

  const getChecklistItemIcon = (status) => {
    switch (status) {
      case 'OK': return 'checkmark-circle';
      case 'NOT OK': return 'close-circle';
      case 'N/A': return 'help-circle';
      default: return 'help-circle';
    }
  };

  const ChecklistItem = ({ label, status, remarks }) => (
    <View>
      <View style={styles.checklistItem}>
        <Ionicons name={getChecklistItemIcon(status)} size={20} color={getChecklistItemColor(status)} />
        <Text style={styles.checklistLabel}>{label}</Text>
        <View style={[styles.statusDot, { backgroundColor: getChecklistItemColor(status) }]} />
        <Text style={[styles.statusText, { color: getChecklistItemColor(status) }]}>{status}</Text>
      </View>
      {remarks && (status === 'NOT OK' || status === 'N/A') && (
        <View style={styles.remarksBox}>
          <Text style={styles.remarksLabel}>Remarks:</Text>
          <Text style={styles.remarksContent}>{remarks}</Text>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color={DARK} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Review Inspection</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Approval Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Approval Details</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Approval ID:</Text>
            <Text style={styles.detailValue}>{approvalData.id}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Asset ID:</Text>
            <Text style={styles.detailValue}>{approvalData.assetId}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Task ID:</Text>
            <Text style={styles.detailValue}>{approvalData.taskId}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Inspector:</Text>
            <Text style={styles.detailValue}>{approvalData.inspector}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Department:</Text>
            <Text style={styles.detailValue}>{approvalData.department}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Submitted:</Text>
            <Text style={styles.detailValue}>{approvalData.submittedDate}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Location:</Text>
            <Text style={styles.detailValue}>{approvalData.location}</Text>
          </View>
        </View>

        {/* Inspection Data */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Inspection Data</Text>
          
          {approvalData.isSKTask ? (
            <>
              <View style={styles.dataRow}>
                <View style={styles.dataItem}>
                  <Text style={styles.dataLabel}>Date</Text>
                  <Text style={styles.dataValue}>{approvalData.inspectionData.date || '—'}</Text>
                </View>
                <View style={styles.dataItem}>
                  <Text style={styles.dataLabel}>Shift</Text>
                  <Text style={styles.dataValue}>{approvalData.inspectionData.shift || '—'}</Text>
                </View>
              </View>
              
              <View style={styles.dataRow}>
                <View style={styles.dataItem}>
                  <Text style={styles.dataLabel}>Area</Text>
                  <Text style={styles.dataValue}>{approvalData.inspectionData.area || '—'}</Text>
                </View>
                <View style={styles.dataItem}>
                  <Text style={styles.dataLabel}>Asset ID</Text>
                  <Text style={styles.dataValue}>{approvalData.inspectionData.assetId || '—'}</Text>
                </View>
              </View>

              {approvalData.inspectionData.materials && approvalData.inspectionData.materials.length > 0 && (
                <View style={styles.materialsTable}>
                  <Text style={styles.dataLabel}>Materials:</Text>
                  {approvalData.inspectionData.materials.map((material, idx) => (
                    <View key={idx} style={styles.materialRow}>
                      <Text style={styles.materialText}>{material.material || '—'}</Text>
                      <Text style={styles.materialText}>Qty: {material.qty || '—'}</Text>
                      <Text style={styles.materialText}>Status: {material.status || '—'}</Text>
                      {material.replenished && <Text style={styles.materialText}>Replenished: {material.replenished}</Text>}
                      {material.expiry && <Text style={styles.materialText}>Expiry: {material.expiry}</Text>}
                      {material.remarks && <Text style={styles.materialRemark}>Remarks: {material.remarks}</Text>}
                    </View>
                  ))}
                </View>
              )}
            </>
          ) : (
            <>
              <View style={styles.dataRow}>
                <View style={styles.dataItem}>
                  <Text style={styles.dataLabel}>Cylinder 1 Pressure</Text>
                  <Text style={styles.dataValue}>{approvalData.inspectionData.cylinder1Pressure || '—'} BAR</Text>
                </View>
                <View style={styles.dataItem}>
                  <Text style={styles.dataLabel}>Cylinder 2 Pressure</Text>
                  <Text style={styles.dataValue}>{approvalData.inspectionData.cylinder2Pressure || '—'} BAR</Text>
                </View>
              </View>
              
              <View style={styles.dataRow}>
                <View style={styles.dataItem}>
                  <Text style={styles.dataLabel}>Flow Rate</Text>
                  <Text style={styles.dataValue}>{approvalData.inspectionData.flowRate || '—'} L/MIN</Text>
                </View>
              </View>
            </>
          )}
        </View>

        {/* Inspection Checklist - Only for BA-SET */}
        {!approvalData.isSKTask && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Inspection Checklist</Text>
            
            <ChecklistItem 
              label="Face Mask Condition" 
              status={approvalData.inspectionData.faceMaskCondition} 
              remarks={approvalData.inspectionData.faceMaskReview}
            />
            <ChecklistItem 
              label="Harness Straps" 
              status={approvalData.inspectionData.harnessStraps}
              remarks={approvalData.inspectionData.harnessReview}
            />
            <ChecklistItem 
              label="Cylinder Valves" 
              status={approvalData.inspectionData.cylinderValves}
              remarks={approvalData.inspectionData.cylinderValvesReview}
            />
            <ChecklistItem 
              label="Pressure Gauge" 
              status={approvalData.inspectionData.pressureGauge}
              remarks={approvalData.inspectionData.pressureGaugeReview}
            />
            <ChecklistItem 
              label="Demand Valve" 
              status={approvalData.inspectionData.demandValve}
              remarks={approvalData.inspectionData.demandValveReview}
            />
            <ChecklistItem 
              label="Warning Whistle" 
              status={approvalData.inspectionData.warningWhistle}
              remarks={approvalData.inspectionData.warningWhistleReview}
            />
          </View>
        )}

        {/* Remarks */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General Remarks</Text>
          <View style={styles.remarkBox}>
            <Text style={styles.remarkText}>{approvalData.inspectionData.generalRemark || 'No remarks provided.'}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.rejectButton} onPress={handleReject}>
            <Ionicons name="close-circle" size={20} color={RED} />
            <Text style={styles.rejectButtonText}>Reject</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.approveButton} onPress={handleApprove}>
            <Ionicons name="checkmark-circle" size={20} color={WHITE} />
            <Text style={styles.approveButtonText}>Approve</Text>
          </TouchableOpacity>
        </View>

        {/* Reject Reason Modal */}
        <Modal
          visible={showRejectModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowRejectModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Reject Inspection</Text>
              <Text style={styles.modalSubtitle}>Please provide a reason for rejection:</Text>
              
              <TextInput
                style={styles.reasonInput}
                placeholder="Enter reason for rejection..."
                placeholderTextColor={GREY}
                value={rejectReason}
                onChangeText={setRejectReason}
                multiline={true}
                numberOfLines={4}
                textAlignVertical="top"
              />
              
              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={styles.cancelButton} 
                  onPress={() => {
                    setShowRejectModal(false);
                    setRejectReason('');
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.submitButton} 
                  onPress={handleSubmitReject}
                >
                  <Ionicons name="send" size={18} color={WHITE} />
                  <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
  container: { paddingHorizontal: 20, paddingTop: 40, paddingBottom: 100 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: DARK },
  section: { backgroundColor: WHITE, borderRadius: 12, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: DARK, marginBottom: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6', paddingBottom: 8 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  detailLabel: { fontSize: 14, color: GREY },
  detailValue: { fontSize: 14, fontWeight: '500', color: DARK },
  dataRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  dataItem: { flex: 1 },
  dataLabel: { fontSize: 12, color: GREY, marginBottom: 4 },
  dataValue: { fontSize: 16, fontWeight: '600', color: BLUE },
  checklistItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  checklistLabel: { flex: 1, fontSize: 14, color: DARK, marginLeft: 12 },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  statusText: { fontSize: 12, fontWeight: '600' },
  remarksBox: { marginTop: 8, padding: 12, backgroundColor: '#FEF2F2', borderRadius: 8, marginLeft: 32 },
  remarksLabel: { fontSize: 12, fontWeight: '600', color: RED, marginBottom: 4 },
  remarksContent: { fontSize: 13, color: '#7F1D1D' },
  remarkBox: { backgroundColor: '#F9FAFB', padding: 12, borderRadius: 8, minHeight: 60 },
  remarkText: { fontSize: 14, color: DARK, lineHeight: 20 },
  actionContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  rejectButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FEF2F2', paddingVertical: 16, borderRadius: 12, marginRight: 8, borderWidth: 1, borderColor: '#FECACA' },
  rejectButtonText: { color: RED, fontWeight: '600', fontSize: 16, marginLeft: 8 },
  approveButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: GREEN, paddingVertical: 16, borderRadius: 12, marginLeft: 8 },
  approveButtonText: { color: WHITE, fontWeight: '600', fontSize: 16, marginLeft: 8 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContainer: { backgroundColor: WHITE, borderRadius: 16, padding: 24, width: '100%', maxWidth: 400 },
  modalTitle: { fontSize: 20, fontWeight: '700', color: DARK, marginBottom: 8 },
  modalSubtitle: { fontSize: 14, color: GREY, marginBottom: 16 },
  reasonInput: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 12, fontSize: 16, color: DARK, marginBottom: 24, height: 120 },
  modalButtons: { flexDirection: 'row', justifyContent: 'flex-end' },
  cancelButton: { paddingHorizontal: 20, paddingVertical: 12, marginRight: 12 },
  cancelButtonText: { fontSize: 16, color: GREY, fontWeight: '600' },
  submitButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: BLUE, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  submitButtonText: { fontSize: 16, color: WHITE, fontWeight: '600', marginLeft: 8 },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: WHITE,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingBottom: 24, // For safe area
  },
  navItem: {
    alignItems: 'center',
  },
  navLabel: {
    fontSize: 10,
    color: GREY,
    marginTop: 4,
  },
  navLabelActive: {
    color: BLUE,
    fontWeight: '600',
  },
  materialsTable: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 16,
  },
  materialRow: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  materialText: {
    fontSize: 13,
    color: DARK,
    marginBottom: 4,
  },
  materialRemark: {
    fontSize: 13,
    color: GREY,
    fontStyle: 'italic',
    marginTop: 4,
  },
});
