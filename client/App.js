import React, { useState } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import Dashboard from './src/screens/Dashboard';
import OrderVerification from './src/screens/OrderVerification';
import { dispatchOrder } from './src/services/api';

export default function App() {
  const [currentOrder, setCurrentOrder] = useState(null);

  const handleScanOrder = (orderId) => {
    setCurrentOrder(orderId);
  };

  const handleCancel = () => {
    setCurrentOrder(null);
  };

  const handleDispatch = async (orderId) => {
    try {
      await dispatchOrder(orderId);
      Alert.alert('Success', 'Order Dispatched Successfully!');
      setCurrentOrder(null);
    } catch (error) {
      Alert.alert('Error', 'Failed to dispatch order.');
    }
  };

  return (
    <View style={styles.container}>
      {currentOrder ? (
        <OrderVerification
          orderId={currentOrder}
          onCancel={handleCancel}
          onDispatch={handleDispatch}
        />
      ) : (
        <Dashboard onScanOrder={handleScanOrder} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
});
