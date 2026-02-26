import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ScanListener from '../components/ScanListener';

const Dashboard = ({ onScanOrder }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to BIAB Packing</Text>

      {/* Auth Placeholder */}
      <View style={styles.userInfo}>
        <Text style={styles.userText}>User: Packer #1</Text>
        <Text style={styles.userText}>Station: Bench A</Text>
      </View>

      <Text style={styles.subtitle}>Scan Tote/Order to Begin</Text>
      <ScanListener onScan={onScanOrder} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  userInfo: {
      marginBottom: 30,
      padding: 10,
      backgroundColor: '#f8f9fa',
      borderRadius: 5,
      alignItems: 'center',
      width: '80%',
  },
  userText: {
      fontSize: 16,
      color: '#555',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 40,
  },
});

export default Dashboard;
