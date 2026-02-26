import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';

const ErrorModal = ({ visible, message, onDismiss }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onDismiss}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>ERROR</Text>
          <Text style={styles.modalText}>{message}</Text>
          <TouchableOpacity
            style={[styles.button, styles.buttonClose]}
            onPress={onDismiss}
            testID="dismiss-error-button"
          >
            <Text style={styles.textStyle}>DISMISS</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 0, 0, 0.8)', // Red overlay as per spec
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
  },
  button: {
    borderRadius: 10,
    padding: 15,
    elevation: 2,
    marginTop: 20,
    minWidth: 150,
  },
  buttonClose: {
    backgroundColor: '#d9534f', // Red-ish button
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 18,
  },
  modalTitle: {
      fontSize: 30,
      fontWeight: 'bold',
      color: '#d9534f',
      marginBottom: 15,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default ErrorModal;
