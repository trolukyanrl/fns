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
<<<<<<< HEAD
=======
import { useTaskContext } from '../TaskContext';
>>>>>>> bcknd

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
<<<<<<< HEAD
=======
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
>>>>>>> bcknd

  const handleNavigation = (tab) => {
    setActiveTab(tab);
    if (tab === 'Home') navigation.navigate('SICDashboard');
    if (tab === 'Tasks') navigation.navigate('SICTasks');
    if (tab === 'Profile') navigation.navigate('SICProfile');
  };

  const handleApprove = () => {
    Alert.alert(
      'Approve Inspection',
<<<<<<< HEAD
      `Are you sure you want to approve the inspection for ${approval.assetId}?`,
=======
      `Are you sure you want to approve the inspection for ${approvalData.assetId}?`,
>>>>>>> bcknd
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          style: 'default',
          onPress: () => {
<<<<<<< HEAD
            Alert.alert(
              'Inspection Approved',
              `Inspection for ${approval.assetId} has been approved successfully.`,
=======
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
>>>>>>> bcknd
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
<<<<<<< HEAD
      `Are you sure you want to reject the inspection for ${approval.assetId}?\n\nReason: ${rejectReason}`,
=======
      `Are you sure you want to reject the inspection for ${approvalData.assetId}?\n\nReason: ${rejectReason}`,
>>>>>>> bcknd
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: () => {
<<<<<<< HEAD
            Alert.alert(
              'Inspection Rejected',
              `Inspection for ${approval.assetId} has been rejected with reason: ${rejectReason}`,
              [{ text: 'OK', onPress: () => navigation.goBack() }]
=======
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
>>>>>>> bcknd
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

<<<<<<< HEAD
  const ChecklistItem = ({ label, status }) => (
    <View style={styles.checklistItem}>
      <Ionicons name={getChecklistItemIcon(status)} size={20} color={getChecklistItemColor(status)} />
      <Text style={styles.checklistLabel}>{label}</Text>
      <View style={[styles.statusDot, { backgroundColor: getChecklistItemColor(status) }]} />
      <Text style={[styles.statusText, { color: getChecklistItemColor(status) }]}>{status}</Text>
=======
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
>>>>>>> bcknd
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
<<<<<<< HEAD
            <Text style={styles.detailValue}>{approval.id}</Text>
=======
            <Text style={styles.detailValue}>{approvalData.id}</Text>
>>>>>>> bcknd
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Asset ID:</Text>
<<<<<<< HEAD
            <Text style={styles.detailValue}>{approval.assetId}</Text>
=======
            <Text style={styles.detailValue}>{approvalData.assetId}</Text>
>>>>>>> bcknd
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Task ID:</Text>
<<<<<<< HEAD
            <Text style={styles.detailValue}>{approval.taskId}</Text>
=======
            <Text style={styles.detailValue}>{approvalData.taskId}</Text>
>>>>>>> bcknd
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Inspector:</Text>
<<<<<<< HEAD
            <Text style={styles.detailValue}>{approval.inspector}</Text>
=======
            <Text style={styles.detailValue}>{approvalData.inspector}</Text>
>>>>>>> bcknd
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Department:</Text>
<<<<<<< HEAD
            <Text style={styles.detailValue}>{approval.department}</Text>
=======
            <Text style={styles.detailValue}>{approvalData.department}</Text>
>>>>>>> bcknd
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Submitted:</Text>
<<<<<<< HEAD
            <Text style={styles.detailValue}>{approval.submittedDate}</Text>
=======
            <Text style={styles.detailValue}>{approvalData.submittedDate}</Text>
>>>>>>> bcknd
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Location:</Text>
<<<<<<< HEAD
            <Text style={styles.detailValue}>{approval.location}</Text>
=======
            <Text style={styles.detailValue}>{approvalData.location}</Text>
>>>>>>> bcknd
          </View>
        </View>

        {/* Inspection Data */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Inspection Data</Text>
          
<<<<<<< HEAD
          <View style={styles.dataRow}>
            <View style={styles.dataItem}>
              <Text style={styles.dataLabel}>Cylinder 1 Pressure</Text>
              <Text style={styles.dataValue}>{approval.inspectionData.cylinder1Pressure} BAR</Text>
            </View>
            <View style={styles.dataItem}>
              <Text style={styles.dataLabel}>Cylinder 2 Pressure</Text>
              <Text style={styles.dataValue}>{approval.inspectionData.cylinder2Pressure} BAR</Text>
            </View>
          </View>
          
          <View style={styles.dataRow}>
            <View style={styles.dataItem}>
              <Text style={styles.dataLabel}>Flow Rate</Text>
              <Text style={styles.dataValue}>{approval.inspectionData.flowRate} L/MIN</Text>
            </View>
          </View>
        </View>

        {/* Inspection Checklist */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Inspection Checklist</Text>
          
          <ChecklistItem label="Face Mask Condition" status={approval.inspectionData.faceMaskCondition} />
          <ChecklistItem label="Harness Straps" status={approval.inspectionData.harnessStraps} />
          <ChecklistItem label="Cylinder Valves" status={approval.inspectionData.cylinderValves} />
          <ChecklistItem label="Pressure Gauge" status={approval.inspectionData.pressureGauge} />
          <ChecklistItem label="Demand Valve" status={approval.inspectionData.demandValve} />
          <ChecklistItem label="Warning Whistle" status={approval.inspectionData.warningWhistle} />
        </View>

        {/* Remarks */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Remarks</Text>
          <View style={styles.remarkBox}>
            <Text style={styles.remarkText}>{approval.inspectionData.generalRemark}</Text>
=======
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
>>>>>>> bcknd
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
  section: { backgroundColor: WHITE, borderRadius: 12, padding: 16, marginBottom: 16, elevation: 2 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: DARK, marginBottom: 12 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  detailLabel: { fontSize: 14, color: GREY, flex: 1 },
  detailValue: { fontSize: 14, fontWeight: '600', color: DARK, flex: 2 },
  dataRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  dataItem: { flex: 1, backgroundColor: '#F9FAFB', borderRadius: 8, padding: 12 },
  dataLabel: { fontSize: 12, color: GREY, marginBottom: 4 },
  dataValue: { fontSize: 16, fontWeight: '700', color: DARK },
  checklistItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  checklistLabel: { fontSize: 14, color: DARK, flex: 1 },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  statusText: { fontSize: 12, fontWeight: '600', minWidth: 50 },
<<<<<<< HEAD
=======
  remarksBox: { backgroundColor: '#FFF3CD', borderLeftWidth: 4, borderLeftColor: ORANGE, marginLeft: 40, marginRight: 0, marginTop: 8, marginBottom: 12, padding: 12, borderRadius: 4 },
  remarksLabel: { fontSize: 12, fontWeight: '600', color: ORANGE, marginBottom: 4 },
  remarksContent: { fontSize: 13, color: DARK, lineHeight: 18 },
>>>>>>> bcknd
  remarkBox: { backgroundColor: '#F9FAFB', borderRadius: 8, padding: 12 },
  remarkText: { fontSize: 14, color: DARK, lineHeight: 20 },
  actionContainer: { flexDirection: 'row', gap: 12, marginTop: 16 },
  rejectButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FEE2E2', borderRadius: 8, paddingVertical: 14, borderWidth: 1, borderColor: '#FCA5A5' },
  rejectButtonText: { fontSize: 16, fontWeight: '700', color: RED, marginLeft: 8 },
  approveButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: GREEN, borderRadius: 8, paddingVertical: 14 },
  approveButtonText: { fontSize: 16, fontWeight: '700', color: WHITE, marginLeft: 8 },
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', backgroundColor: WHITE, paddingVertical: 12, paddingHorizontal: 20, borderTopWidth: 1, borderTopColor: '#E8E8E8' },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  navLabel: { fontSize: 12, color: GREY, marginTop: 4 },
  navLabelActive: { color: BLUE, fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContainer: { backgroundColor: WHITE, borderRadius: 12, padding: 20, width: '90%', maxHeight: '60%' },
  modalTitle: { fontSize: 18, fontWeight: '700', color: DARK, marginBottom: 8, textAlign: 'center' },
  modalSubtitle: { fontSize: 14, color: GREY, marginBottom: 16, textAlign: 'center' },
  reasonInput: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, padding: 12, fontSize: 14, color: DARK, minHeight: 100, textAlignVertical: 'top' },
  modalButtons: { flexDirection: 'row', gap: 12, marginTop: 16 },
  cancelButton: { flex: 1, backgroundColor: '#F3F4F6', borderRadius: 8, paddingVertical: 12, alignItems: 'center' },
  cancelButtonText: { fontSize: 16, fontWeight: '600', color: GREY },
  submitButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: RED, borderRadius: 8, paddingVertical: 12 },
  submitButtonText: { fontSize: 16, fontWeight: '700', color: WHITE, marginLeft: 8 },
<<<<<<< HEAD
=======
  materialsTable: { marginTop: 12, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, overflow: 'hidden' },
  materialRow: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#E5E7EB', backgroundColor: '#F9FAFB' },
  materialText: { fontSize: 13, color: DARK, linHeight: 18, marginBottom: 4 },
  materialRemark: { fontSize: 12, color: ORANGE, fontWeight: '600', marginTop: 4, fontStyle: 'italic' },
>>>>>>> bcknd
});
