import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text, DeviceEventEmitter, Platform } from 'react-native';

const ScanListener = ({ onScan }) => {
  const [inputValue, setInputValue] = useState('');

  // Setup DataWedge listener (for Zebra devices)
  useEffect(() => {
    if (Platform.OS !== 'android') return;

    const subscription = DeviceEventEmitter.addListener('com.symbol.datawedge.api.RESULT_ACTION', (intent) => {
        // This is a simplified example. In reality, you'd check the intent extras for the barcode data.
        // DataWedge typically broadcasts intents with specific action names and extras.
        // Assuming 'com.symbol.datawedge.data_string' contains the barcode.
        if (intent && intent['com.symbol.datawedge.data_string']) {
            onScan(intent['com.symbol.datawedge.data_string']);
        }
    });

    // Also listen for general intent broadcasts if configured in DataWedge profile
    const barcodeSubscription = DeviceEventEmitter.addListener('BARCODE_SCAN_ACTION', (intent) => {
         if (intent && intent.data) {
             onScan(intent.data);
         }
    });

    return () => {
        subscription.remove();
        barcodeSubscription.remove();
    };
  }, [onScan]);

  const handleManualScan = () => {
    if (inputValue.trim()) {
      onScan(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <View style={styles.container}>
      {/* For desktop testing/fallback, we provide a visible input */}
      <Text style={styles.label}>Simulate Scan (or use Zebra Scanner):</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={inputValue}
          onChangeText={setInputValue}
          placeholder="Enter barcode here"
          placeholderTextColor="#999"
          onSubmitEditing={handleManualScan}
          autoFocus={true}
          testID="scan-input"
        />
        <TouchableOpacity style={styles.button} onPress={handleManualScan} testID="scan-button">
            <Text style={styles.buttonText}>SCAN</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#F5E7C6',
    borderRadius: 10,
    marginVertical: 10,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#222222',
  },
  inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
  },
  input: {
    height: 45,
    flex: 1,
    borderColor: '#FA8112',
    borderWidth: 2,
    borderRadius: 8,
    marginRight: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#222222',
  },
  button: {
      backgroundColor: '#FA8112',
      height: 45,
      paddingHorizontal: 20,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,
  },
  buttonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
  }
});

export default ScanListener;
