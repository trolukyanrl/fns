import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
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
    id: 'APP-2024-002',
    taskId: 'INS-2024-0848',
    assetId: 'SK-015',
    inspector: 'Sarah K.',
    department: 'Operations',
    submittedDate: 'Yesterday, 4:15 PM',
    location: 'Zone B-1',
    status: 'Pending',
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

const APPROVED_APPROVALS = [
  {
    id: 'APP-2024-004',
    taskId: 'INS-2024-0850',
    assetId: 'BA-SET-048',
    inspector: 'Priya M.',
    department: 'Safety',
    submittedDate: 'Today, 10:15 AM',
    approvedDate: 'Today, 10:45 AM',
    location: 'Zone D-1',
    status: 'Approved',
    approvedBy: 'SIC Manager',
    approvalNote: 'All safety checks passed. Equipment cleared for use.',
    inspectionData: {
      cylinder1Pressure: '300',
      cylinder2Pressure: '300',
      flowRate: '40',
      faceMaskCondition: 'OK',
      harnessStraps: 'OK',
      cylinderValves: 'OK',
      pressureGauge: 'OK',
      demandValve: 'OK',
      warningWhistle: 'OK',
      generalRemark: 'Excellent condition. No issues found during inspection.',
    }
  },
  {
    id: 'APP-2024-005',
    taskId: 'INS-2024-0851',
    assetId: 'SK-018',
    inspector: 'David L.',
    department: 'Operations',
    submittedDate: 'Yesterday, 3:30 PM',
    approvedDate: 'Today, 9:00 AM',
    location: 'Zone A-2',
    status: 'Approved',
    approvedBy: 'Shift Supervisor',
    approvalNote: 'Minor maintenance completed. Equipment ready for deployment.',
    inspectionData: {
      cylinder1Pressure: '305',
      cylinder2Pressure: '305',
      flowRate: '41',
      faceMaskCondition: 'OK',
      harnessStraps: 'OK',
      cylinderValves: 'OK',
      pressureGauge: 'OK',
      demandValve: 'OK',
      warningWhistle: 'OK',
      generalRemark: 'After minor adjustments to pressure settings, equipment is now optimal.',
    }
  },
];

const REJECTED_APPROVALS = [
  {
    id: 'APP-2024-006',
    taskId: 'INS-2024-0852',
    assetId: 'BA-SET-049',
    inspector: 'Mike R.',
    department: 'Maintenance',
    submittedDate: 'Today, 1:00 PM',
    rejectedDate: 'Today, 1:30 PM',
    location: 'Zone B-3',
    status: 'Rejected',
    rejectedBy: 'Safety Manager',
    rejectionReason: 'Critical safety issues found. Equipment requires immediate repair.',
    rejectionNote: 'Face mask seal compromised, cylinder valve leaking. Do not use until repaired.',
    inspectionData: {
      cylinder1Pressure: '250',
      cylinder2Pressure: '240',
      flowRate: '25',
      faceMaskCondition: 'NOT OK',
      harnessStraps: 'NOT OK',
      cylinderValves: 'NOT OK',
      pressureGauge: 'NOT OK',
      demandValve: 'NOT OK',
      warningWhistle: 'NOT OK',
      generalRemark: 'Multiple critical failures detected. Equipment unsafe for use.',
    }
  },
  {
    id: 'APP-2024-007',
    taskId: 'INS-2024-0853',
    assetId: 'SK-019',
    inspector: 'Anna K.',
    department: 'Safety',
    submittedDate: 'Yesterday, 5:00 PM',
    rejectedDate: 'Today, 8:15 AM',
    location: 'Zone C-1',
    status: 'Rejected',
    rejectedBy: 'Operations Manager',
    rejectionReason: 'Maintenance overdue. Equipment not serviceable.',
    rejectionNote: 'Last hydrotest expired. Requires immediate servicing before approval.',
    inspectionData: {
      cylinder1Pressure: '280',
      cylinder2Pressure: '285',
      flowRate: '35',
      faceMaskCondition: 'OK',
      harnessStraps: 'OK',
      cylinderValves: 'OK',
      pressureGauge: 'OK',
      demandValve: 'OK',
      warningWhistle: 'OK',
      generalRemark: 'Equipment functional but maintenance schedule not followed.',
    }
  },
];

export default function PendingApprovalsScreen({ navigation }) {
<<<<<<< HEAD
  const [activeTab, setActiveTab] = useState('Home');
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('pending'); // Add filter state
=======
  const { tasks } = useTaskContext();
  const [activeTab, setActiveTab] = useState('Home');
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('Pending'); // Add filter state

  // Filter tasks by status
  const getPendingApprovals = () => {
    return tasks.filter(task => task.status === 'Pending for Approval');
  };

  const getApprovedApprovals = () => {
    return tasks.filter(task => task.status === 'Approved');
  };

  const getRejectedApprovals = () => {
    return tasks.filter(task => task.status === 'Rejected');
  };

  const pendingApprovals = getPendingApprovals();
  const approvedApprovals = getApprovedApprovals();
  const rejectedApprovals = getRejectedApprovals();
>>>>>>> bcknd

  const handleNavigation = (tab) => {
    setActiveTab(tab);
    if (tab === 'Home') navigation.navigate('SICDashboard');
    if (tab === 'Tasks') navigation.navigate('SICTasks');
    if (tab === 'Profile') navigation.navigate('SICProfile');
  };

  const handleReview = (approval) => {
    navigation.navigate('ApprovalReview', { approval });
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'Pending':
        return { backgroundColor: '#FEE2E2', borderColor: '#DC2626' };
      case 'Approved':
        return { backgroundColor: '#D1FAE5', borderColor: '#16A34A' };
      case 'Rejected':
        return { backgroundColor: '#FEE2E2', borderColor: '#B91C1C' };
      default:
        return { backgroundColor: '#F3F4F6', borderColor: '#9CA3AF' };
    }
  };

  const getStatusTextStyle = (status) => {
    switch (status) {
      case 'Pending':
        return { color: '#DC2626' };
      case 'Approved':
        return { color: '#16A34A' };
      case 'Rejected':
        return { color: '#DC2626' };
      default:
        return { color: '#6B7280' };
    }
  };

<<<<<<< HEAD
  const ApprovalCard = ({ approval }) => (
    <View style={styles.approvalCard}>
      <View style={styles.approvalHeader}>
        <View style={styles.approvalInfo}>
          <Text style={styles.approvalId}>{approval.id}</Text>
          <Text style={styles.approvalAsset}>{approval.assetId}</Text>
        </View>
        <View style={[styles.statusBadge, getStatusBadgeStyle(approval.status)]}>
          <Text style={[styles.statusText, getStatusTextStyle(approval.status)]}>{approval.status}</Text>
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

      {approval.status === 'Pending' && (
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.reviewButton} onPress={() => handleReview(approval)}>
            <Ionicons name="eye-outline" size={18} color={WHITE} />
            <Text style={styles.reviewButtonText}>Review</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
=======
  const ApprovalCard = ({ approval }) => {
    // Map task data to approval format
    const equipment = approval.baSets?.[0] || approval.safetyKits?.[0];
    const assetId = equipment?.id || 'Unknown';
    const inspectionData = approval.inspectionData || {};
    const submittedDate = approval.submittedAt || 'Date not available';
    
    // Count checklist items
    const checklistItems = {
      ok: [
        inspectionData.faceMaskCondition,
        inspectionData.harnessStraps,
        inspectionData.cylinderValves,
        inspectionData.pressureGauge,
        inspectionData.demandValve,
        inspectionData.warningWhistle,
      ].filter(item => item === 'OK').length,
      notOk: [
        inspectionData.faceMaskCondition,
        inspectionData.harnessStraps,
        inspectionData.cylinderValves,
        inspectionData.pressureGauge,
        inspectionData.demandValve,
        inspectionData.warningWhistle,
      ].filter(item => item === 'NOT OK').length,
      na: [
        inspectionData.faceMaskCondition,
        inspectionData.harnessStraps,
        inspectionData.cylinderValves,
        inspectionData.pressureGauge,
        inspectionData.demandValve,
        inspectionData.warningWhistle,
      ].filter(item => item === 'N/A').length,
    };

    return (
      <View style={styles.approvalCard}>
        <View style={styles.approvalHeader}>
          <View style={styles.approvalInfo}>
            <Text style={styles.approvalId}>Task #{approval.id.slice(-4)}</Text>
            <Text style={styles.approvalAsset}>{assetId}</Text>
          </View>
          <View style={[styles.statusBadge, getStatusBadgeStyle(approval.status)]}>
            <Text style={[styles.statusText, getStatusTextStyle(approval.status)]}>{approval.status}</Text>
          </View>
        </View>

        <View style={styles.inspectorInfo}>
          <Text style={styles.inspectorName}>{approval.assignedToName || approval.assignedTo || 'Unknown'}</Text>
          <Text style={styles.inspectorDept}>{approval.assignedToDept || 'Task Assignor'}</Text>
        </View>

        <View style={styles.submissionInfo}>
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={14} color={GREY} />
            <Text style={styles.detailText}>{submittedDate}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={14} color={GREY} />
            <Text style={styles.detailText}>{approval.location || 'Location TBA'}</Text>
          </View>
        </View>

        <View style={styles.inspectionSummary}>
          <Text style={styles.summaryTitle}>Inspection Summary</Text>
          
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Pressure</Text>
              <Text style={styles.summaryValue}>{inspectionData.cylinder1Pressure || '—'}/{inspectionData.cylinder2Pressure || '—'} BAR</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Flow Rate</Text>
              <Text style={styles.summaryValue}>{inspectionData.flowRate || '—'} L/MIN</Text>
            </View>
          </View>

          <View style={styles.checklistSummary}>
            <Text style={styles.checklistTitle}>Checklist Status</Text>
            <View style={styles.checklistRow}>
              <View style={styles.checklistItem}>
                <Ionicons name="checkmark-circle" size={16} color={GREEN} />
                <Text style={styles.checklistText}>OK: {checklistItems.ok}</Text>
              </View>
              <View style={styles.checklistItem}>
                <Ionicons name="close-circle" size={16} color={RED} />
                <Text style={styles.checklistText}>NOT OK: {checklistItems.notOk}</Text>
              </View>
              <View style={styles.checklistItem}>
                <Ionicons name="help-circle" size={16} color={LIGHT_GREY} />
                <Text style={styles.checklistText}>N/A: {checklistItems.na}</Text>
              </View>
            </View>
          </View>

          <View style={styles.remarkSection}>
            <Text style={styles.remarkLabel}>Remarks</Text>
            <Text style={styles.remarkText}>{inspectionData.generalRemark || 'No remarks provided'}</Text>
          </View>
        </View>

        {approval.status === 'Pending for Approval' && (
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.reviewButton} onPress={() => handleReview(approval)}>
              <Ionicons name="eye-outline" size={18} color={WHITE} />
              <Text style={styles.reviewButtonText}>Review</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };
>>>>>>> bcknd

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Fixed Header Section */}
      <View style={styles.fixedHeader}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color={DARK} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Pending Approvals</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <TouchableOpacity 
<<<<<<< HEAD
            style={[styles.statCard, filterStatus === 'pending' && styles.statCardActive]} 
            onPress={() => setFilterStatus('pending')}
          >
            <Ionicons name="document-text-outline" size={24} color={filterStatus === 'pending' ? "#DC2626" : GREY} />
            <Text style={[styles.statLabel, filterStatus === 'pending' && styles.statLabelActive]}>Pending</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.statCard, filterStatus === 'approved' && styles.statCardActive]} 
            onPress={() => setFilterStatus('approved')}
          >
            <Ionicons name="checkmark-circle-outline" size={24} color={filterStatus === 'approved' ? "#22C55E" : GREY} />
            <Text style={[styles.statLabel, filterStatus === 'approved' && styles.statLabelActive]}>Approved</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.statCard, filterStatus === 'rejected' && styles.statCardActive]} 
            onPress={() => setFilterStatus('rejected')}
          >
            <Ionicons name="close-circle-outline" size={24} color={filterStatus === 'rejected' ? "#EF4444" : GREY} />
            <Text style={[styles.statLabel, filterStatus === 'rejected' && styles.statLabelActive]}>Rejected</Text>
=======
            style={[styles.statCard, filterStatus === 'Pending' && styles.statCardActive]} 
            onPress={() => setFilterStatus('Pending')}
          >
            <Ionicons name="document-text-outline" size={24} color={filterStatus === 'Pending' ? "#DC2626" : GREY} />
            <Text style={[styles.statLabel, filterStatus === 'Pending' && styles.statLabelActive]}>Pending</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.statCard, filterStatus === 'Approved' && styles.statCardActive]} 
            onPress={() => setFilterStatus('Approved')}
          >
            <Ionicons name="checkmark-circle-outline" size={24} color={filterStatus === 'Approved' ? "#22C55E" : GREY} />
            <Text style={[styles.statLabel, filterStatus === 'Approved' && styles.statLabelActive]}>Approved</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.statCard, filterStatus === 'Rejected' && styles.statCardActive]} 
            onPress={() => setFilterStatus('Rejected')}
          >
            <Ionicons name="close-circle-outline" size={24} color={filterStatus === 'Rejected' ? "#EF4444" : GREY} />
            <Text style={[styles.statLabel, filterStatus === 'Rejected' && styles.statLabelActive]}>Rejected</Text>
>>>>>>> bcknd
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search-outline" size={20} color={GREY} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search pending approvals..."
              placeholderTextColor={LIGHT_GREY}
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
        </View>
      </View>

      {/* Scrollable Content Section */}
      <ScrollView 
        style={styles.scrollableContent}
        contentContainerStyle={styles.scrollableContentContainer}
      >
        {/* Filtered Approvals List */}
        {(() => {
          let filteredApprovals = [];
          
          // Get the appropriate data based on filter status
<<<<<<< HEAD
          if (filterStatus === 'pending') {
            filteredApprovals = PENDING_APPROVALS;
          } else if (filterStatus === 'approved') {
            filteredApprovals = APPROVED_APPROVALS;
          } else if (filterStatus === 'rejected') {
            filteredApprovals = REJECTED_APPROVALS;
=======
          if (filterStatus === 'Pending') {
            filteredApprovals = pendingApprovals;
          } else if (filterStatus === 'Approved') {
            filteredApprovals = approvedApprovals;
          } else if (filterStatus === 'Rejected') {
            filteredApprovals = rejectedApprovals;
>>>>>>> bcknd
          }

          // Filter by search text
          const searchLower = searchText.toLowerCase();
<<<<<<< HEAD
          const searchFilteredApprovals = filteredApprovals.filter(approval =>
            approval.id.toLowerCase().includes(searchLower) ||
            approval.assetId.toLowerCase().includes(searchLower) ||
            approval.inspector.toLowerCase().includes(searchLower) ||
            approval.department.toLowerCase().includes(searchLower) ||
            approval.location.toLowerCase().includes(searchLower) ||
            approval.inspectionData.generalRemark.toLowerCase().includes(searchLower) ||
            (approval.approvedBy && approval.approvedBy.toLowerCase().includes(searchLower)) ||
            (approval.rejectedBy && approval.rejectedBy.toLowerCase().includes(searchLower)) ||
            (approval.approvalNote && approval.approvalNote.toLowerCase().includes(searchLower)) ||
            (approval.rejectionReason && approval.rejectionReason.toLowerCase().includes(searchLower)) ||
            (approval.rejectionNote && approval.rejectionNote.toLowerCase().includes(searchLower))
          );

          return searchFilteredApprovals.length > 0 ? (
            searchFilteredApprovals.map((approval) => (
              <ApprovalCard key={approval.id} approval={approval} />
=======
          const searchFilteredApprovals = filteredApprovals.filter(task => {
            const equipment = task.baSets?.[0] || task.safetyKits?.[0];
            const assetId = equipment?.id || 'Unknown';
            const generalRemark = task.inspectionData?.generalRemark || '';
            
            return (
              task.id.toLowerCase().includes(searchLower) ||
              assetId.toLowerCase().includes(searchLower) ||
              (task.assignedToName && task.assignedToName.toLowerCase().includes(searchLower)) ||
              (task.assignedToDept && task.assignedToDept.toLowerCase().includes(searchLower)) ||
              (task.location && task.location.toLowerCase().includes(searchLower)) ||
              generalRemark.toLowerCase().includes(searchLower)
            );
          });

          return searchFilteredApprovals.length > 0 ? (
            searchFilteredApprovals.map((task) => (
              <ApprovalCard key={task.id} approval={task} />
>>>>>>> bcknd
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={64} color={GREY} />
              <Text style={styles.emptyStateText}>
                {searchText ? 'No matching approvals found' : 'No approvals available'}
              </Text>
              <Text style={styles.emptyStateSubtext}>
                {searchText ? 'Try adjusting your search criteria' : 'No approvals match the selected filter'}
              </Text>
            </View>
          );
        })()}
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
  fixedHeader: { backgroundColor: '#F9FAFB', paddingTop: 40, paddingHorizontal: 20, zIndex: 10 },
  scrollableContent: { flex: 1, paddingHorizontal: 20 },
  scrollableContentContainer: { paddingTop: 24, paddingBottom: 100 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: DARK },
  searchContainer: { marginBottom: 24 },
  searchInputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: WHITE, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3 },
  searchInput: { flex: 1, fontSize: 16, color: DARK, marginLeft: 12 },
  statsContainer: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  statCard: { flex: 1, backgroundColor: WHITE, borderRadius: 12, padding: 16, alignItems: 'center', elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 },
  statCardActive: { borderWidth: 2, borderColor: BLUE },
  statNumber: { fontSize: 20, fontWeight: '700', color: DARK, marginBottom: 4 },
  statLabel: { fontSize: 12, color: GREY },
  statLabelActive: { fontWeight: '700', color: BLUE },
  approvalCard: { backgroundColor: WHITE, borderRadius: 12, padding: 16, marginBottom: 16, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
  approvalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  approvalInfo: { flex: 1 },
  approvalId: { fontSize: 12, fontWeight: '600', color: GREY, marginBottom: 2 },
  approvalAsset: { fontSize: 16, fontWeight: '700', color: DARK },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 11, fontWeight: '600', color: WHITE },
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
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', backgroundColor: WHITE, paddingVertical: 12, paddingHorizontal: 20, borderTopWidth: 1, borderTopColor: '#E8E8E8', elevation: 10 },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  navLabel: { fontSize: 12, color: GREY, marginTop: 4 },
  navLabelActive: { color: BLUE, fontWeight: '600' },
});