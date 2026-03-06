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
    backgroundColor: '#FAF3E1',
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#222222',
  },
  userInfo: {
      marginBottom: 30,
      padding: 15,
      backgroundColor: '#F5E7C6',
      borderRadius: 10,
      alignItems: 'center',
      width: '80%',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
  },
  userText: {
      fontSize: 16,
      color: '#222222',
      fontWeight: '600',
  },
  subtitle: {
    fontSize: 18,
    color: '#FA8112',
    fontWeight: 'bold',
    marginBottom: 40,
  },
});

export default Dashboard;
