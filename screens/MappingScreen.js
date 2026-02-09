import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MappingScreen = ({ route }) => {
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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="map-outline" size={48} color="#0284C7" />
        <Text style={styles.title}>Mapping Details</Text>
        <Text style={styles.subtitle}>Task Type: {taskType || 'MAPPING'}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Scanned Information</Text>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>QR Code Data:</Text>
          <Text style={styles.detailValue}>{scannedData || 'No data'}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Item Type:</Text>
          <Text style={styles.detailValue}>{itemData.type}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>ID:</Text>
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
      </View>

      <View style={styles.actions}>
        <Text style={styles.helpText}>
          This item has been successfully scanned and is ready for mapping. 
          The location information will be updated once the physical mapping is complete.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 4,
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
  actions: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    elevation: 2,
  },
  helpText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default MappingScreen;