import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BLUE = '#2563EB';
const DARK = '#1F2937';
const GREY = '#6B7280';
const LIGHT_GREY = '#9CA3AF';
const WHITE = '#FFFFFF';
const GREEN = '#22C55E';
const RED = '#EF4444';
const YELLOW = '#F59E0B';
const ORANGE = '#F97316';

// Sample data for different statuses
const PENDING_APPROVALS = [
  {
    id: 'APP-2024-001',
    taskId: 'INS-2024-0847',
    assetId: 'BA-SET-042',
    inspector: 'Amit R.',
    department: 'Safety',
    submittedDate: 'Today, 2:30 PM',
    location: 'Zone A-3',
    status: 'Pending',
    inspectionData: {
      cylinder1Pressure: '300',
      cylinder2Pressure: '280',
      flowRate: '35',
      faceMaskCondition: 'NOT OK',
      harnessStraps: 'OK',
      cylinderValves: 'OK',
      pressureGauge: 'N/A',
      demandValve: 'OK',
      warningWhistle: 'NOT OK',
      generalRemark: 'Face mask shows signs of wear and tear. Warning whistle not functioning properly. Equipment requires maintenance before next use.',
    }
  },
  {
    id: 'APP-2024-003',
    taskId: 'INS-2024-0849',
    assetId: 'BA-SET-045',
    inspector: 'Raj P.',
    department: 'Maintenance',
    submittedDate: '2 days ago',
    location: 'Zone C-2',
    status: 'Pending',
    inspectionData: {
      cylinder1Pressure: '290',
      cylinder2Pressure: '295',
      flowRate: '38',
      faceMaskCondition: 'OK',
      harnessStraps: 'NOT OK',
      cylinderValves: 'OK',
      pressureGauge: 'OK',
      demandValve: 'OK',
      warningWhistle: 'OK',
      generalRemark: 'Harness straps show signs of fraying. Recommend replacement before next use.',
    }
  },
];

const APPROVED = [
  {
    id: 'APP-2024-002',
    taskId: 'INS-2024-0848',
    assetId: 'SK-015',
    inspector: 'Sarah K.',
    department: 'Operations',
    submittedDate: 'Today, 10:15 AM',
    location: 'Zone B-1',
    status: 'Approved',
    inspectionData: {
      cylinder1Pressure: '310',
      cylinder2Pressure: '310',
      flowRate: '42',
      faceMaskCondition: 'OK',
      harnessStraps: 'OK',
      cylinderValves: 'OK',
      pressureGauge: 'OK',
      demandValve: 'OK',
      warningWhistle: 'OK',
      generalRemark: 'All inspections completed successfully. Equipment is in good working condition.',
    }
  },
];

const REJECTED_ITEMS = [
  {
    id: 'APP-2024-004',
    taskId: 'INS-2024-0850',
    assetId: 'BA-SET-046',
    inspector: 'Mike D.',
    department: 'Safety',
    submittedDate: 'Today, 1:45 PM',
    location: 'Zone A-1',
    status: 'Rejected',
    inspectionData: {
      cylinder1Pressure: '250',
      cylinder2Pressure: '260',
      flowRate: '30',
      faceMaskCondition: 'NOT OK',
      harnessStraps: 'NOT OK',
      cylinderValves: 'NOT OK',
      pressureGauge: 'OK',
      demandValve: 'NOT OK',
      warningWhistle: 'NOT OK',
      generalRemark: 'Multiple critical issues found. Equipment requires immediate maintenance and replacement of several components.',
    }
  },
];

export default function ApprovalStatusScreen({ navigation, route }) {
  const [activeTab, setActiveTab] = useState('Home');
  const { statusType } = route.params || 'pending';
  
  // Get the appropriate data based on status type
  const getApprovalData = () => {
    switch (statusType) {
      case 'approved':
        return APPROVED;
      case 'rejected':
        return REJECTED_ITEMS;
      default:
        return PENDING_APPROVALS;
    }
  };

  const getStatusColor = () => {
    switch (statusType) {
      case 'approved':
        return GREEN;
      case 'rejected':
        return RED;
      default:
        return RED; // Pending
    }
  };

  const getStatusIcon = () => {
    switch (statusType) {
      case 'approved':
        return 'checkmark-circle-outline';
      case 'rejected':
        return 'close-circle-outline';
      default:
        return 'document-text-outline';
    }
  };

  const getStatusTitle = () => {
    switch (statusType) {
      case 'approved':
        return 'APPROVED';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Pending Approvals';
    }
  };

  const handleNavigation = (tab) => {
    setActiveTab(tab);
    if (tab === 'Home') navigation.navigate('SICDashboard');
    if (tab === 'Tasks') navigation.navigate('SICTasks');
    if (tab === 'Profile') navigation.navigate('SICProfile');
  };

  const handleReview = (approval) => {
    navigation.navigate('ApprovalReview', { approval });
  };

  const ApprovalCard = ({ approval }) => (
    <View style={styles.approvalCard}>
      <View style={styles.approvalHeader}>
        <View style={styles.approvalInfo}>
          <Text style={styles.approvalId}>{approval.id}</Text>
          <Text style={styles.approvalAsset}>{approval.assetId}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor() === GREEN ? '#ECFDF5' : '#FEE2E2', borderColor: getStatusColor() === GREEN ? '#16A34A' : '#DC2626' }]}>
          <Text style={[styles.statusText, { color: getStatusColor() }]}>{approval.status}</Text>
        </View>
      </View>

      <View style={styles.inspectorInfo}>
        <Text style={styles.inspectorName}>{approval.inspector}</Text>
        <Text style={styles.inspectorDept}>{approval.department}</Text>
      </View>

      <View style={styles.submissionInfo}>
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={14} color={GREY} />
          <Text style={styles.detailText}>{approval.submittedDate}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="location-outline" size={14} color={GREY} />
          <Text style={styles.detailText}>{approval.location}</Text>
        </View>
      </View>

      <View style={styles.inspectionSummary}>
        <Text style={styles.summaryTitle}>Inspection Summary</Text>
        
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Pressure</Text>
            <Text style={styles.summaryValue}>{approval.inspectionData.cylinder1Pressure}/{approval.inspectionData.cylinder2Pressure} BAR</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Flow Rate</Text>
            <Text style={styles.summaryValue}>{approval.inspectionData.flowRate} L/MIN</Text>
          </View>
        </View>

        <View style={styles.checklistSummary}>
          <Text style={styles.checklistTitle}>Checklist Status</Text>
          <View style={styles.checklistRow}>
            <View style={styles.checklistItem}>
              <Ionicons name="checkmark-circle" size={16} color={GREEN} />
              <Text style={styles.checklistText}>OK: 6</Text>
            </View>
            <View style={styles.checklistItem}>
              <Ionicons name="close-circle" size={16} color={RED} />
              <Text style={styles.checklistText}>NOT OK: 2</Text>
            </View>
            <View style={styles.checklistItem}>
              <Ionicons name="help-circle" size={16} color={LIGHT_GREY} />
              <Text style={styles.checklistText}>N/A: 1</Text>
            </View>
          </View>
        </View>

        <View style={styles.remarkSection}>
          <Text style={styles.remarkLabel}>Remarks</Text>
          <Text style={styles.remarkText}>{approval.inspectionData.generalRemark}</Text>
        </View>
      </View>

      <View style={styles.actionButtons}>
        {statusType === 'pending' && (
          <TouchableOpacity style={styles.reviewButton} onPress={() => handleReview(approval)}>
            <Ionicons name="eye-outline" size={18} color={WHITE} />
            <Text style={styles.reviewButtonText}>Review</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const approvalData = getApprovalData();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color={DARK} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Ionicons name={getStatusIcon()} size={24} color={getStatusColor()} />
            <Text style={styles.headerTitle}>{getStatusTitle()}</Text>
          </View>
          <View style={{ width: 24 }} />
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <TouchableOpacity style={styles.statCard} onPress={() => navigation.navigate('ApprovalStatus', { statusType: 'pending' })}>
            <Ionicons name="document-text-outline" size={24} color="#DC2626" />
            <Text style={styles.statLabel}>Pending</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.statCard} onPress={() => navigation.navigate('ApprovalStatus', { statusType: 'approved' })}>
            <Ionicons name="checkmark-circle-outline" size={24} color="#22C55E" />
            <Text style={styles.statLabel}>APPROVED</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.statCard} onPress={() => navigation.navigate('ApprovalStatus', { statusType: 'rejected' })}>
            <Ionicons name="close-circle-outline" size={24} color="#EF4444" />
            <Text style={styles.statLabel}>Rejected</Text>
          </TouchableOpacity>
        </View>

        {/* Approvals List */}
        {approvalData.length > 0 ? (
          approvalData.map((approval) => (
            <ApprovalCard key={approval.id} approval={approval} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name={getStatusIcon()} size={64} color={getStatusColor()} />
            <Text style={styles.emptyStateText}>No {statusType} approvals</Text>
            <Text style={styles.emptyStateSubtext}>All inspections have been reviewed</Text>
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
  container: { paddingHorizontal: 20, paddingTop: 40, paddingBottom: 100 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
  headerContent: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: DARK },
  statsContainer: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  statCard: { flex: 1, backgroundColor: WHITE, borderRadius: 12, padding: 16, alignItems: 'center' },
  statNumber: { fontSize: 20, fontWeight: '700', color: DARK, marginBottom: 4 },
  statLabel: { fontSize: 12, color: GREY },
  approvalCard: { backgroundColor: WHITE, borderRadius: 12, padding: 16, marginBottom: 16, elevation: 2 },
  approvalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  approvalInfo: { flex: 1 },
  approvalId: { fontSize: 12, fontWeight: '600', color: GREY, marginBottom: 2 },
  approvalAsset: { fontSize: 16, fontWeight: '700', color: DARK },
  statusBadge: { backgroundColor: '#FEE2E2', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 11, fontWeight: '600', color: RED },
  inspectorInfo: { marginBottom: 12 },
  inspectorName: { fontSize: 14, fontWeight: '600', color: DARK },
  inspectorDept: { fontSize: 12, color: GREY },
  submissionInfo: { flexDirection: 'row', gap: 16, marginBottom: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  detailText: { fontSize: 12, color: GREY },
  inspectionSummary: { marginBottom: 16 },
  summaryTitle: { fontSize: 14, fontWeight: '600', color: DARK, marginBottom: 8 },
  summaryRow: { flexDirection: 'row', gap: 16, marginBottom: 12 },
  summaryItem: { flex: 1, backgroundColor: '#F9FAFB', borderRadius: 8, padding: 12 },
  summaryLabel: { fontSize: 11, color: GREY, marginBottom: 4 },
  summaryValue: { fontSize: 14, fontWeight: '600', color: DARK },
  checklistSummary: { marginBottom: 12 },
  checklistTitle: { fontSize: 12, fontWeight: '600', color: GREY, marginBottom: 8 },
  checklistRow: { flexDirection: 'row', gap: 12 },
  checklistItem: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#F9FAFB', borderRadius: 8, padding: 8 },
  checklistText: { fontSize: 12, color: GREY },
  remarkSection: { backgroundColor: '#F9FAFB', borderRadius: 8, padding: 12, marginBottom: 16 },
  remarkLabel: { fontSize: 12, fontWeight: '600', color: GREY, marginBottom: 6 },
  remarkText: { fontSize: 13, color: DARK, lineHeight: 18 },
  actionButtons: { flexDirection: 'row', gap: 12 },
  rejectButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FEE2E2', borderRadius: 8, paddingVertical: 12, borderWidth: 1, borderColor: '#FCA5A5' },
  rejectButtonText: { fontSize: 14, fontWeight: '600', color: RED, marginLeft: 8 },
  approveButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: GREEN, borderRadius: 8, paddingVertical: 12 },
  approveButtonText: { fontSize: 14, fontWeight: '600', color: WHITE, marginLeft: 8 },
  reviewButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: BLUE, borderRadius: 8, paddingVertical: 12 },
  reviewButtonText: { fontSize: 14, fontWeight: '600', color: WHITE, marginLeft: 8 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 60 },
  emptyStateText: { fontSize: 16, fontWeight: '600', color: DARK, marginTop: 16 },
  emptyStateSubtext: { fontSize: 14, color: GREY, marginTop: 8 },
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', backgroundColor: WHITE, paddingVertical: 12, paddingHorizontal: 20, borderTopWidth: 1, borderTopColor: '#E8E8E8' },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  navLabel: { fontSize: 12, color: GREY, marginTop: 4 },
  navLabelActive: { color: BLUE, fontWeight: '600' },
});