import axios from 'axios';
import { Platform } from 'react-native';

const getBaseUrl = () => {
  // 10.0.2.2 is the special IP for Android emulator to access host localhost
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000/api';
  }
  // For iOS simulator or web
  return 'http://localhost:3000/api';
};

const API_BASE_URL = getBaseUrl();

export const getOrder = async (orderId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/order/${orderId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};

export const dispatchOrder = async (orderId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/order/${orderId}/dispatch`);
    return response.data;
  } catch (error) {
    console.error('Error dispatching order:', error);
    throw error;
  }
};
