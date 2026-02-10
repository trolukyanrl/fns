import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

let CameraView = null;
let useCameraPermissions = null;

try {
  const camera = require('expo-camera');
  CameraView = camera.CameraView;
  useCameraPermissions = camera.useCameraPermissions;
} catch (e) {
  // Camera not available (web or not installed)
}

const BLUE = '#4285F4';
const DARK_GREY = '#333333';
const LIGHT_GREY = '#666666';
const GREEN = '#4CAF50';

export default function LocationQRScannerScreen({ navigation, route }) {
  const [hasPermission, requestPermission] = useCameraPermissions ? useCameraPermissions() : [{ granted: false }, null];
  const [scanned, setScanned] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualLocationCode, setManualLocationCode] = useState('');
  const cameraRef = useRef(null);
  const [isCameraSupported] = useState(!!CameraView);

  const baSetId = route?.params?.baSetId || 'Unknown';
  const skSetId = route?.params?.skSetId || 'Unknown';
  const taskType = route?.params?.taskType || '';

  useEffect(() => {
    (async () => {
      if (!isCameraSupported) return;
      if (!hasPermission?.granted) {
        await requestPermission();
      }
    })();
  }, [hasPermission, requestPermission, isCameraSupported]);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    showScanResult(data);
  };

  const showScanResult = (data) => {
    // Determine which set ID to use
    const currentSetId = skSetId !== 'Unknown' ? skSetId : baSetId;
    
    Alert.alert(
      'Location QR Code Scanned',
      `Location: ${data}`,
      [
        {
          text: 'Scan Another',
          onPress: () => setScanned(false),
          style: 'default',
        },
        {
          text: 'Proceed',
          onPress: () => {
            // Use taskType parameter for reliable navigation
            if (taskType === 'VERIFY') {
              navigation.replace('Verify', { scannedData: route.params?.scannedData, location: data, taskType: 'VERIFY' });
            } else if (taskType === 'MAPPING') {
              navigation.replace('Mapping', { scannedData: route.params?.scannedData, location: data, taskType: 'MAPPING' });
            } else if (taskType === 'SK' || currentSetId.startsWith('SK-')) {
              navigation.replace('SKInspection', { skSetId: currentSetId, location: data });
            } else {
              navigation.replace('InspectionForm', { baSetId: currentSetId, location: data });
            }
          },
          style: 'default',
        },
      ],
      { cancelable: false }
    );
  };

  const handleManualSubmit = () => {
    if (!manualLocationCode.trim()) {
      Alert.alert('Error', 'Please enter a location code');
      return;
    }
    setShowManualModal(false);
    setManualLocationCode('');
    
    // Determine which set ID to use
    const currentSetId = skSetId !== 'Unknown' ? skSetId : baSetId;
    
    // Use taskType parameter for reliable navigation
    if (taskType === 'VERIFY') {
      navigation.replace('Verify', { scannedData: route.params?.scannedData, location: manualLocationCode, taskType: 'VERIFY' });
    } else if (taskType === 'MAPPING') {
      navigation.replace('Mapping', { scannedData: route.params?.scannedData, location: manualLocationCode, taskType: 'MAPPING' });
    } else if (taskType === 'SK' || currentSetId.startsWith('SK-')) {
      navigation.replace('SKInspection', { skSetId: currentSetId, location: manualLocationCode });
    } else {
      navigation.replace('InspectionForm', { baSetId: currentSetId, location: manualLocationCode });
    }
  };

  if (!isCameraSupported) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={28} color={DARK_GREY} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Scan Location QR Code</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.center}>
          <Ionicons name="camera-off" size={48} color={LIGHT_GREY} />
          <Text style={styles.errorTitle}>Camera Not Available</Text>
          <Text style={styles.errorText}>
            QR code scanning requires a mobile device. Please use the manual entry option instead.
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={() => setShowManualModal(true)}
          >
            <Text style={styles.permissionButtonText}>Enter Location Code Manually</Text>
          </TouchableOpacity>
        </View>

        {/* Manual Entry Modal */}
        <Modal
          visible={showManualModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => {
            setShowManualModal(false);
            setManualLocationCode('');
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
                    setShowManualModal(false);
                    setManualLocationCode('');
                  }}
                >
                  <Text style={styles.modalCloseText}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Enter Location Code</Text>
                <View style={styles.modalHeaderSpacer} />
              </View>

              <View style={styles.modalBody}>
                <Ionicons name="information-circle" size={40} color={BLUE} style={styles.infoIcon} />
                <Text style={styles.modalInstructions}>Enter the location code manually</Text>
                <Text style={styles.modalSubtitle}>
                  Make sure to enter the correct location identification code
                </Text>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Location Code</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g., Zone-A-3"
                    placeholderTextColor={LIGHT_GREY}
                    value={manualLocationCode}
                    onChangeText={setManualLocationCode}
                    autoFocus={true}
                    maxLength={20}
                  />
                </View>

                <View style={styles.modalButtonsContainer}>
                  <TouchableOpacity
                    style={styles.modalCancelButton}
                    onPress={() => {
                      setShowManualModal(false);
                      setManualLocationCode('');
                    }}
                  >
                    <Text style={styles.modalCancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalSubmitButton}
                    onPress={handleManualSubmit}
                  >
                    <Ionicons name="checkmark-done" size={18} color="#fff" />
                    <Text style={styles.modalSubmitButtonText}>Submit</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </SafeAreaView>
    );
  }

  if (!hasPermission) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text>Requesting camera permission...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!hasPermission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Ionicons name="camera-off" size={48} color={LIGHT_GREY} />
          <Text style={styles.errorTitle}>Camera Permission Needed</Text>
          <Text style={styles.errorText}>
            We need camera access to scan QR codes
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestPermission}
          >
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Fixed Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={28} color={DARK_GREY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan Location QR Code</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Scrollable Content */}
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* BA Set Info */}
        <View style={styles.infoBar}>
          <View style={styles.infoBadge}>
            <Ionicons name="checkmark-circle" size={16} color={GREEN} />
            <Text style={styles.infoBadgeText}>BA Set: {baSetId}</Text>
          </View>
        </View>

        {/* Camera View */}
        <View style={styles.cameraContainer}>
          {CameraView && (
            <CameraView
              ref={cameraRef}
              style={styles.camera}
              onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
              barcodeScannerSettings={{
                barcodeTypes: ['qr'],
              }}
            >
              {/* Scanning Frame Overlay */}
              <View style={styles.overlayContainer}>
                <View style={styles.scanningFrame}>
                  <View style={[styles.corner, styles.topLeft]} />
                  <View style={[styles.corner, styles.topRight]} />
                  <View style={[styles.corner, styles.bottomLeft]} />
                  <View style={[styles.corner, styles.bottomRight]} />
                </View>
                <View style={styles.animationCircle}>
                  <Ionicons name="location" size={32} color={BLUE} />
                </View>
              </View>
            </CameraView>
          )}

          {/* Dark Overlays */}
          <View style={[styles.darkenOverlay, styles.top]} />
          <View style={[styles.darkenOverlay, styles.bottom]} />
          <View style={[styles.darkenOverlay, styles.left]} />
          <View style={[styles.darkenOverlay, styles.right]} />
        </View>

        {/* Instructions Section */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>Scan Location QR Code</Text>
          <Text style={styles.instructionsSubtitle}>
            Position the location code within the frame
          </Text>
          <Text style={styles.instructionsHint}>Scanning will start automatically</Text>

          {/* Status Indicators */}
          <View style={styles.statusContainer}>
            <View style={styles.statusItem}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Camera Active</Text>
            </View>
            <Text style={styles.statusSeparator}>|</Text>
            <View style={styles.statusItem}>
              <Ionicons name="wifi" size={14} color={GREEN} />
              <Text style={styles.statusText}>Connected</Text>
            </View>
          </View>

          {/* Quick Instructions */}
          <View style={styles.quickInstructions}>
            <Text style={styles.quickTitle}>Quick Instructions</Text>

            <View style={styles.instructionStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Locate Location QR Code</Text>
                <Text style={styles.stepDescription}>
                  Find the QR code label indicating the location
                </Text>
              </View>
            </View>

            <View style={styles.instructionStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Position Within Frame</Text>
                <Text style={styles.stepDescription}>
                  Align the QR code within the blue scanning frame
                </Text>
              </View>
            </View>

            <View style={styles.instructionStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Automatic Detection</Text>
                <Text style={styles.stepDescription}>
                  Hold steady - scanning happens automatically
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Manual Scan Button */}
        <View style={styles.manualButtonContainer}>
          <TouchableOpacity 
            style={styles.manualButton}
            onPress={() => setShowManualModal(true)}
          >
            <Ionicons name="edit-outline" size={18} color={BLUE} />
            <Text style={styles.manualButtonText}>Enter Location Code Manually</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Manual Entry Modal */}
      <Modal
        visible={showManualModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          setShowManualModal(false);
          setManualLocationCode('');
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <View style={styles.modalOverlay} />
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <TouchableOpacity
                onPress={() => {
                  setShowManualModal(false);
                  setManualLocationCode('');
                }}
              >
                <Text style={styles.modalCloseText}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Enter Location Code</Text>
              <View style={styles.modalHeaderSpacer} />
            </View>

            {/* Modal Body */}
            <View style={styles.modalBody}>
              <Ionicons name="information-circle" size={40} color={BLUE} style={styles.infoIcon} />
              <Text style={styles.modalInstructions}>Enter the location code manually</Text>
              <Text style={styles.modalSubtitle}>
                Make sure to enter the correct location identification code
              </Text>

              {/* Input Field */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Location Code</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Zone-A-3"
                  placeholderTextColor={LIGHT_GREY}
                  value={manualLocationCode}
                  onChangeText={setManualLocationCode}
                  autoFocus={true}
                  maxLength={20}
                />
              </View>

              {/* Action Buttons */}
              <View style={styles.modalButtonsContainer}>
                <TouchableOpacity
                  style={styles.modalCancelButton}
                  onPress={() => {
                    setShowManualModal(false);
                    setManualLocationCode('');
                  }}
                >
                  <Text style={styles.modalCancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalSubmitButton}
                  onPress={handleManualSubmit}
                >
                  <Ionicons name="checkmark-done" size={18} color="#fff" />
                  <Text style={styles.modalSubmitButtonText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: DARK_GREY,
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: LIGHT_GREY,
    textAlign: 'center',
    marginBottom: 24,
  },
  permissionButton: {
    backgroundColor: BLUE,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: DARK_GREY,
  },
  headerSpacer: {
    width: 32,
  },
  infoBar: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  infoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: GREEN,
  },
  cameraContainer: {
    height: 320,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  overlayContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  scanningFrame: {
    width: 240,
    height: 240,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: BLUE,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: BLUE,
    borderWidth: 3,
  },
  topLeft: {
    top: -8,
    left: -8,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: -8,
    right: -8,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: -8,
    left: -8,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: -8,
    right: -8,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  animationCircle: {
    position: 'absolute',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(66, 133, 244, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  darkenOverlay: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  top: {
    top: 0,
    left: 0,
    right: 0,
    height: 40,
  },
  bottom: {
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
  },
  left: {
    top: 0,
    left: 0,
    bottom: 0,
    width: 40,
  },
  right: {
    top: 0,
    right: 0,
    bottom: 0,
    width: 40,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  instructionsContainer: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: DARK_GREY,
    marginBottom: 4,
  },
  instructionsSubtitle: {
    fontSize: 14,
    color: LIGHT_GREY,
    marginBottom: 2,
  },
  instructionsHint: {
    fontSize: 12,
    color: LIGHT_GREY,
    marginBottom: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 24,
    paddingVertical: 12,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: GREEN,
  },
  statusText: {
    fontSize: 13,
    color: LIGHT_GREY,
    fontWeight: '500',
  },
  statusSeparator: {
    color: '#DDD',
    fontSize: 14,
  },
  quickInstructions: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  quickTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: DARK_GREY,
    marginBottom: 16,
  },
  instructionStep: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: BLUE,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: DARK_GREY,
    marginBottom: 2,
  },
  stepDescription: {
    fontSize: 13,
    color: LIGHT_GREY,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  manualButtonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  manualButton: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: BLUE,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  manualButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: BLUE,
  },
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
  infoIcon: {
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalInstructions: {
    fontSize: 16,
    fontWeight: '600',
    color: DARK_GREY,
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: LIGHT_GREY,
    textAlign: 'center',
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: DARK_GREY,
    marginBottom: 8,
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
  modalButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: BLUE,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: BLUE,
  },
  modalSubmitButton: {
    flex: 1,
    backgroundColor: BLUE,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  modalSubmitButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});
