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
  // ...existing code...
  // New state for form fields
  const [date, setDate] = useState('');
  const [shift, setShift] = useState('');
  const [area, setArea] = useState('');
  const [location, setLocation] = useState('');
  
  // Date picker state
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [openExpiryDatePicker, setOpenExpiryDatePicker] = useState(false);
  const [selectedExpiryDate, setSelectedExpiryDate] = useState(new Date());
  const [expiryDatePickerIndex, setExpiryDatePickerIndex] = useState(null);

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

  // Handler for form submit
  const handleSubmit = () => {
    // Navigate to TA Dashboard regardless of form completion
    navigation.navigate('TADashboard');
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <Text style={{ fontSize: 22, fontWeight: '700', marginBottom: 24 }}>SAFETY KIT BOX STATUS</Text>

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
              <TextInput
                style={styles.input}
                value={shift}
                onChangeText={setShift}
                placeholder="Select Shift"
              />
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

        {/* Table Section */}
        <ScrollView 
          horizontal={true}
          showsHorizontalScrollIndicator={true}
          style={{ marginBottom: 24 }}
        >
          <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 16, minWidth: 900 }}>
            <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#E8E8E8', paddingBottom: 8 }}>
              <Text style={{ width: 200, fontWeight: '700' }}>MATERIAL</Text>
              <Text style={{ width: 120, fontWeight: '700', textAlign: 'center' }}>Standerd Qty</Text>
              <Text style={{ width: 120, fontWeight: '700', textAlign: 'center' }}>Present Status</Text>
              <Text style={{ width: 120, fontWeight: '700', textAlign: 'center' }}>Replenished</Text>
              <Text style={{ width: 120, fontWeight: '700', textAlign: 'center' }}>Expiry Date</Text>
              <Text style={{ width: 120, fontWeight: '700', textAlign: 'center' }}>Remarks</Text>
            </View>
            {materials.map((row, idx) => (
              <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                <Text style={{ width: 200 }}>{row.material}</Text>
                <TextInput
                  style={[styles.input, { width: 120, marginHorizontal: 4 }]}
                  value={row.qty}
                  onChangeText={v => handleMaterialChange(idx, 'qty', v)}
                  placeholder=""
                />
                <TextInput
                  style={[styles.input, { width: 120, marginHorizontal: 4 }]}
                  value={row.status}
                  onChangeText={v => handleMaterialChange(idx, 'status', v)}
                  placeholder=""
                />
                <TextInput
                  style={[styles.input, { width: 120, marginHorizontal: 4 }]}
                  value={row.replenished}
                  onChangeText={v => handleMaterialChange(idx, 'replenished', v)}
                  placeholder=""
                />
                <TouchableOpacity
                  style={[styles.input, { width: 120, marginHorizontal: 4 }]}
                  onPress={() => handleExpiryDatePicker(idx)}
                >
                  <Text style={[styles.inputText, row.expiry ? styles.inputTextFilled : styles.inputTextPlaceholder]}>
                    {row.expiry || "dd-mm-yyyy"}
                  </Text>
                </TouchableOpacity>
                <TextInput
                  style={[styles.input, { width: 120, marginHorizontal: 4 }]}
                  value={row.remarks}
                  onChangeText={v => handleMaterialChange(idx, 'remarks', v)}
                  placeholder=""
                />
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Submit Button */}
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 32 }}>
          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
            <Ionicons name="send" size={18} color="#fff" />
            <Text style={styles.submitBtnText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

        {/* Date Picker Modal */}
      {openDatePicker && (
        <Modal
          transparent={true}
          visible={openDatePicker}
          animationType="slide"
          onRequestClose={() => setOpenDatePicker(false)}
        >
          <View style={styles.datePickerModal}>
            <View style={styles.datePickerContainer}>
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="spinner"
                onChange={(event, date) => {
                  if (date) {
                    setSelectedDate(date);
                    // Format date as dd-mm-yyyy
                    const day = String(date.getDate()).padStart(2, '0');
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const year = date.getFullYear();
                    setDate(`${day}-${month}-${year}`);
                    setOpenDatePicker(false);
                  }
                }}
                style={styles.datePickerIOS}
              />
            </View>
          </View>
        </Modal>
      )}

        {/* Expiry Date Picker Modal */}
      {openExpiryDatePicker && (
        <Modal
          transparent={true}
          visible={openExpiryDatePicker}
          animationType="slide"
          onRequestClose={() => setOpenExpiryDatePicker(false)}
        >
          <View style={styles.datePickerModal}>
            <View style={styles.datePickerContainer}>
              <DateTimePicker
                value={selectedExpiryDate}
                mode="date"
                display="spinner"
                onChange={(event, date) => {
                  if (date) {
                    setSelectedExpiryDate(date);
                    // Format date as dd-mm-yyyy
                    const day = String(date.getDate()).padStart(2, '0');
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const year = date.getFullYear();
                    const formattedDate = `${day}-${month}-${year}`;
                    
                    // Update the specific row's expiry date
                    if (expiryDatePickerIndex !== null) {
                      setMaterials(prev => {
                        const updated = [...prev];
                        updated[expiryDatePickerIndex].expiry = formattedDate;
                        return updated;
                      });
                    }
                    
                    setOpenExpiryDatePicker(false);
                  }
                }}
                style={styles.datePickerIOS}
              />
            </View>
          </View>
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
  datePickerConfirm: {
    fontSize: 16,
    color: BLUE,
    fontWeight: '600',
  },
  datePickerIOS: {
    width: '100%',
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
});
