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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BLUE = '#4285F4';
const DARK_GREY = '#333333';
const LIGHT_GREY = '#666666';
const GREEN = '#4CAF50';
const ORANGE = '#F9A825';
const RED = '#E53935';

export default function InspectionFormScreen({ navigation, route }) {
  const { baSetId, location } = route?.params || {};

  // Form state
  const [cylinder1Pressure, setCylinder1Pressure] = useState('300');
  const [cylinder2Pressure, setCylinder2Pressure] = useState('300');
  const [flowRate, setFlowRate] = useState('40');
  const [gpsLocation, setGpsLocation] = useState('40.7128° N, 74.0060° W');
  const [generalRemark, setGeneralRemark] = useState('');
  const [isLocationCaptured, setIsLocationCaptured] = useState(false);
  
  const [faceMaskCondition, setFaceMaskCondition] = useState(null);
  const [harnessStraps, setHarnessStraps] = useState(null);
  const [cylinderValves, setCylinderValves] = useState(null);
  const [pressureGauge, setPressureGauge] = useState(null);
  const [demandValve, setDemandValve] = useState(null);
  const [warningWhistle, setWarningWhistle] = useState(null);


  const handleSaveDraft = () => {
    Alert.alert('Success', 'Inspection draft saved successfully!');
  };

  const handleCaptureLocation = () => {
    setIsLocationCaptured(true);
    setGpsLocation('40.7128° N, 74.0060° W');
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!faceMaskCondition || !harnessStraps || !cylinderValves || !pressureGauge || !demandValve || !warningWhistle) {
      Alert.alert('Error', 'Please complete all inspection checklist items');
      return;
    }


    // Submit the form
    setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'TADashboard' }],
      });
    }, 500);
  };


  const ChecklistItem = ({ label, description, value, onOk, onNotOk, onNA }) => (
    <View style={styles.checklistItem}>
      <View style={styles.checklistItemHeader}>
        <Text style={styles.checklistLabel}>{label}</Text>
        {description && <Text style={styles.checklistDescription}>{description}</Text>}
      </View>
      <View style={styles.checklistButtons}>
        <TouchableOpacity
          style={[styles.checklistBtn, styles.okBtn, value === 'OK' && styles.checklistBtnActive]}
          onPress={onOk}
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
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
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

          <ScrollView 
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
              <Text style={styles.detailValue}>#INS-2024-0847</Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>Pending</Text>
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

          <View>
            <Text style={styles.detailLabel}>Cylinder Numbers</Text>
            <Text style={styles.detailValue}>CYL-8847, CYL-8848</Text>
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
            onOk={() => setFaceMaskCondition('OK')}
            onNotOk={() => setFaceMaskCondition('NOT OK')}
            onNA={() => setFaceMaskCondition('N/A')}
          />

          <ChecklistItem
            label="Harness & Straps"
            description="Inspect webbing, buckles, and attachment points"
            value={harnessStraps}
            onOk={() => setHarnessStraps('OK')}
            onNotOk={() => setHarnessStraps('NOT OK')}
            onNA={() => setHarnessStraps('N/A')}
          />

          <ChecklistItem
            label="Cylinder Valves"
            description="Check operation, leaks, and thread condition"
            value={cylinderValves}
            onOk={() => setCylinderValves('OK')}
            onNotOk={() => setCylinderValves('NOT OK')}
            onNA={() => setCylinderValves('N/A')}
          />

          <ChecklistItem
            label="Pressure Gauge"
            description="Verify accuracy and readability"
            value={pressureGauge}
            onOk={() => setPressureGauge('OK')}
            onNotOk={() => setPressureGauge('NOT OK')}
            onNA={() => setPressureGauge('N/A')}
          />

          <ChecklistItem
            label="Demand Valve"
            description="Test airflow response and seal"
            value={demandValve}
            onOk={() => setDemandValve('OK')}
            onNotOk={() => setDemandValve('NOT OK')}
            onNA={() => setDemandValve('N/A')}
          />

          <ChecklistItem
            label="Warning Whistle"
            description="Ensure audible alarm at correct pressure"
            value={warningWhistle}
            onOk={() => setWarningWhistle('OK')}
            onNotOk={() => setWarningWhistle('NOT OK')}
            onNA={() => setWarningWhistle('N/A')}
          />
        </View>

        {/* GPS Location Section */}
        <View style={styles.section}>
          <View style={styles.gpsHeader}>
            <Text style={styles.sectionTitle}>GPS Location</Text>
            <TouchableOpacity style={styles.captureBtn} onPress={handleCaptureLocation}>
              <Ionicons name="pin" size={16} color="#fff" />
              <Text style={styles.captureBtnText}>Capture</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.gpsCard}>
            {isLocationCaptured ? (
              <>
                <Ionicons name="checkmark-circle" size={48} color={GREEN} />
                <Text style={styles.gpsLocationText}>{gpsLocation}</Text>
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
          
          <View style={styles.formGroup}>
            <Text style={styles.fieldLabel}>REMARKS (OPTIONAL)</Text>
            <TextInput
              style={[styles.input, styles.remarksInput]}
              value={generalRemark}
              onChangeText={setGeneralRemark}
              placeholder="Add any additional notes or observations about the inspection..."
              placeholderTextColor={LIGHT_GREY}
              multiline={true}
              numberOfLines={4}
            />
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Buttons */}
      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.saveDraftBtn} onPress={handleSaveDraft}>
          <Ionicons name="archive-outline" size={18} color={LIGHT_GREY} />
          <Text style={styles.saveDraftBtnText}>Save Draft</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Ionicons name="send" size={18} color="#fff" />
          <Text style={styles.submitBtnText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
    </KeyboardAvoidingView>
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
  gpsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  captureBtn: {
    backgroundColor: BLUE,
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    gap: 6,
  },
  captureBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
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
  remarksInput: {
    textAlignVertical: 'top',
    paddingVertical: 12,
  },
});
