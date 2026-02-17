import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MappingScreen = ({ navigation, route }) => {
  const { scannedData, taskType, location } = route.params || {};

  // Parse the scanned data to extract meaningful information
  const parseScannedData = (data) => {
    if (!data) return {};
    
    // Try to extract information based on common QR code patterns
    if (data.includes('SK-')) {
      return {
        type: 'Safety Kit',
        id: data,
        description: 'Safety Kit Equipment',
        location: location || 'To be mapped',
        status: location ? 'Mapped' : 'Pending Mapping'
      };
    } else if (data.includes('BA-SET-')) {
      return {
        type: 'BA Set',
        id: data,
        description: 'Breathing Apparatus Set',
        location: location || 'To be mapped',
        status: location ? 'Mapped' : 'Pending Mapping'
      };
    } else if (data.includes('LOC-')) {
      return {
        type: 'Location',
        id: data,
        description: 'Physical Location',
        location: location || data.replace('LOC-', ''),
        status: location ? 'Mapped' : 'Pending Mapping'
      };
    } else {
      // Generic QR code data
      return {
        type: 'Generic',
        id: data,
        description: 'Scanned Item',
        location: location || 'To be determined',
        status: location ? 'Mapped' : 'Pending Processing'
      };
    }
  };

  const itemData = parseScannedData(scannedData);

  const handleMapped = () => {
    console.log('Mapped button pressed');
    navigation.navigate('SICDashboard');
  };

  const handleCancel = () => {
    console.log('Cancel button pressed');
    navigation.navigate('SICDashboard');
  };

  return (
    <View style={styles.container}>
      {/* Non-scrollable Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Mapping</Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView style={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Scanned Information</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Asset ID:</Text>
            <Text style={styles.detailValue}>{itemData.id}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Description:</Text>
            <Text style={styles.detailValue}>{itemData.description}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Location:</Text>
            <Text style={styles.detailValue}>{itemData.location}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Status:</Text>
            <Text style={[styles.detailValue, 
              itemData.status === 'Mapped' ? styles.statusSuccess : styles.statusPending
            ]}>
              {itemData.status}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Latitude:</Text>
            <Text style={styles.detailValue}>0.00000000</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Longitude:</Text>
            <Text style={styles.detailValue}>0.00000000</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Cylinder No:</Text>
            <Text style={styles.detailValue}>N/A</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Created By:</Text>
            <Text style={styles.detailValue}>Ajay Bala R</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Created On:</Text>
            <Text style={styles.detailValue}>2026-02-06-11:38:20</Text>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.mappedButton]} 
          onPress={handleMapped}
        >
          <Text style={styles.mappedButtonText}>Mapped</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.cancelButton]} 
          onPress={handleCancel}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    paddingTop: 40,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  scrollContent: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: '#6b7280',
    flex: 2,
    textAlign: 'right',
  },
  statusSuccess: {
    color: '#059669',
    fontWeight: '600',
  },
  statusPending: {
    color: '#d97706',
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mappedButton: {
    backgroundColor: '#0284C7',
  },
  mappedButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  cancelButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MappingScreen;