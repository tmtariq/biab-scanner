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
    backgroundColor: 'rgba(250, 129, 18, 0.85)', // Using brand orange/red for overlay
  },
  modalView: {
    margin: 20,
    backgroundColor: '#FAF3E1', // Match new app background
    borderRadius: 15,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    width: '85%',
  },
  button: {
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 30,
    elevation: 2,
    marginTop: 25,
    minWidth: 160,
  },
  buttonClose: {
    backgroundColor: '#222222', // Brand dark color
  },
  textStyle: {
    color: '#FAF3E1',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 18,
    letterSpacing: 1,
  },
  modalTitle: {
      fontSize: 32,
      fontWeight: '900',
      color: '#FA8112', // Brand Orange
      marginBottom: 15,
      letterSpacing: 2,
  },
  modalText: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    color: '#222222', // Brand dark
  },
});

export default ErrorModal;
