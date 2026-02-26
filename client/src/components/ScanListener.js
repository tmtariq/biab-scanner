import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text, DeviceEventEmitter, Platform } from 'react-native';

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
      <TextInput
        style={styles.input}
        value={inputValue}
        onChangeText={setInputValue}
        placeholder="Enter barcode here"
        onSubmitEditing={handleManualScan}
        autoFocus={true} // In production on Zebra, this might not be needed if using DataWedge Intents
        testID="scan-input"
      />
      <Button title="Simulate Scan" onPress={handleManualScan} testID="scan-button" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginVertical: 10,
    width: '100%',
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
});

export default ScanListener;
