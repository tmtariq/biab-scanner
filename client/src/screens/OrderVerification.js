import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, TouchableOpacity } from 'react-native';
import ScanListener from '../components/ScanListener';
import ErrorModal from '../components/ErrorModal';
import { getOrder } from '../services/api';
import SoundService from '../services/sound';

const OrderVerification = ({ orderId, onCancel, onDispatch }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scannedItems, setScannedItems] = useState({});
  const scannedItemsRef = useRef({}); // Ref to track latest state for rapid scanning

  const [giftMessageScanned, setGiftMessageScanned] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', message: string }

  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const data = await getOrder(orderId);
      setOrder(data);
      // Initialize scannedItems map
      const initialScanned = {};
      data.items.forEach(item => {
        initialScanned[item.sku] = 0;
      });
      setScannedItems(initialScanned);
      scannedItemsRef.current = initialScanned;
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch order details.');
      onCancel();
    } finally {
      setLoading(false);
    }
  };

  const handleError = (msg) => {
      setErrorMessage(msg);
      setErrorVisible(true);
      SoundService.playError();
  };

  const handleScan = (code) => {
    if (errorVisible) return; // Block scanning when error modal is visible

    setFeedback(null);
    if (!order) return;

    const currentScanned = scannedItemsRef.current;

    // Check for Gift Message Scan
    if (order.hasGiftMessage && !giftMessageScanned) {
      if (code === order.giftMessageCode) {
        setGiftMessageScanned(true);
        setFeedback({ type: 'success', message: 'Gift Message Verified!' });
        SoundService.playSuccess();
        return;
      }
    }

    // Check for Item Scan
    const item = order.items.find(i => i.sku === code);

    if (item) {
      const currentQty = currentScanned[code] || 0;
      if (currentQty < item.quantity) {
        const newScanned = {
          ...currentScanned,
          [code]: currentQty + 1
        };
        // Update ref immediately
        scannedItemsRef.current = newScanned;
        // Update state
        setScannedItems(newScanned);

        setFeedback({ type: 'success', message: `Verified: ${item.name}` });
        SoundService.playSuccess();
      } else {
        handleError(`Already fully scanned: ${item.name}`);
      }
    } else {
        // Check if it was the gift message scanned again
        if (order.hasGiftMessage && code === order.giftMessageCode) {
             setFeedback({ type: 'success', message: 'Gift Message Already Verified!' });
             SoundService.playSuccess();
        } else {
             handleError(`Invalid Item: ${code}`);
        }
    }

    // Clear feedback after 2 seconds
    if (!errorVisible) {
        setTimeout(() => setFeedback(null), 2000);
    }
  };

  const isComplete = () => {
      if (!order) return false;
      if (order.hasGiftMessage && !giftMessageScanned) return false;
      return order.items.every(item => (scannedItems[item.sku] || 0) >= item.quantity);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading Order {orderId}...</Text>
      </View>
    );
  }

  if (!order) {
     return (
        <View style={styles.container}>
            <Text>Order not found.</Text>
            <TouchableOpacity onPress={onCancel} style={styles.button}>
                <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>
        </View>
     );
  }

  const completed = isComplete();

  return (
    <View style={[styles.container, feedback?.type === 'error' ? styles.errorBg : feedback?.type === 'success' ? styles.successBg : null]}>
      <ErrorModal
          visible={errorVisible}
          message={errorMessage}
          onDismiss={() => setErrorVisible(false)}
      />

      <Text style={styles.title}>Order: {order.orderId}</Text>

      {feedback && (
        <View style={[styles.feedback, feedback.type === 'error' ? styles.feedbackError : styles.feedbackSuccess]}>
          <Text style={styles.feedbackText}>{feedback.message}</Text>
        </View>
      )}

      <FlatList
        data={order.items}
        keyExtractor={item => item.sku}
        renderItem={({ item }) => {
           const scanned = scannedItems[item.sku] || 0;
           const isDone = scanned >= item.quantity;
           return (
             <View style={[styles.itemRow, isDone ? styles.itemDone : null]}>
               <Text style={styles.itemName}>{item.name} ({item.sku})</Text>
               <Text style={styles.itemQty}>{scanned} / {item.quantity}</Text>
             </View>
           );
        }}
        ListFooterComponent={() => (
            <>
                {order.hasGiftMessage && (
                    <View style={[styles.giftRow, giftMessageScanned ? styles.itemDone : styles.itemPending]}>
                        <Text style={styles.itemName}>Gift Message Required</Text>
                        <Text style={styles.itemQty}>{giftMessageScanned ? 'VERIFIED' : 'SCAN CODE'}</Text>
                    </View>
                )}
            </>
        )}
      />

      <ScanListener onScan={handleScan} />

      <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.button, completed ? styles.buttonActive : styles.buttonDisabled]}
            disabled={!completed}
            onPress={() => onDispatch(order.orderId)}
          >
              <Text style={styles.buttonText}>Complete Order</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onCancel} style={[styles.button, styles.cancelButton]}>
              <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    width: '100%',
  },
  errorBg: {
      backgroundColor: '#fee',
  },
  successBg: {
      backgroundColor: '#efe',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  feedback: {
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  feedbackError: {
    backgroundColor: 'red',
  },
  feedbackSuccess: {
    backgroundColor: 'green',
  },
  feedbackText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemDone: {
    backgroundColor: '#e0ffe0',
    opacity: 0.6,
  },
  itemPending: {
      backgroundColor: '#fff0f0',
  },
  itemName: {
    fontSize: 16,
    flex: 1,
  },
  itemQty: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  giftRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    marginTop: 10,
    borderWidth: 2,
    borderColor: '#orange',
    borderRadius: 5,
  },
  footer: {
      marginTop: 20,
  },
  button: {
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonActive: {
    backgroundColor: '#007bff',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  cancelButton: {
      backgroundColor: '#666',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default OrderVerification;
