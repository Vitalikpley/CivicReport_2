import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

const API_BASE_URL = 'http://192.168.0.117:3000/api';

const AUTH_TOKEN_KEY = 'auth_token';

// Створюємо axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor для додавання токена до запитів
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Перевірка інтернет-з'єднання
export const isOnline = async () => {
  const netInfo = await NetInfo.fetch();
  return netInfo.isConnected && netInfo.isInternetReachable;
};

export const authAPI = {
  register: async (firstName, lastName, email, password) => {
    const response = await apiClient.post('/auth/register', {
      firstName,
      lastName,
      email,
      password,
    });
    return response.data;
  },

  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', {
      email,
      password,
    });
    return response.data;
  },
};

export const violationsAPI = {
  getDates: async () => {
    const response = await apiClient.get('/violations/dates');
    return response.data.dates || [];
  },

  getByDate: async (date) => {
    const response = await apiClient.get(`/violations/by-date/${date}`);
    return response.data || [];
  },

  getLocations: async () => {
    const response = await apiClient.get('/violations/locations');
    return response.data.locations || [];
  },

  getByLocation: async (latitude, longitude, radius = 1000) => {
    const response = await apiClient.get('/violations/by-location', {
      params: { latitude, longitude, radius },
    });
    return response.data || [];
  },

  create: async (violationData) => {
    const response = await apiClient.post('/violations', violationData);
    return response.data;
  },

  sync: async (violations) => {
    console.log(violations);
    const response = await apiClient.post('/violations/sync', {
      violations,
    });
    return response.data;
  },

  getAll: async () => {
    const response = await apiClient.get('/violations');
    return response.data || [];
  },

  getById: async (id) => {
    const response = await apiClient.get(`/violations/${id}`);
    return response.data;
  },
};

export default apiClient;
