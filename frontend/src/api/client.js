// const API_BASE = 'http://192.168.0.117:3000/api';
//
// function getHeaders(token) {
//   const headers = { 'Content-Type': 'application/json' };
//   if (token) headers['Authorization'] = `Bearer ${token}`;
//   return headers;
// }
//
// export async function login(email, password) {
//   const res = await fetch(`${API_BASE}/auth/login`, {
//     method: 'POST',
//     headers: getHeaders(),
//     body: JSON.stringify({ email, password }),
//   });
//   const data = await res.json().catch(() => ({}));
//   if (!res.ok) throw new Error(data.error || 'Login failed');
//   return data;
// }
//
// export async function register({ name, email, password, role = 'user' }) {
//   const res = await fetch(`${API_BASE}/auth/register`, {
//     method: 'POST',
//     headers: getHeaders(),
//     body: JSON.stringify({ name, email, password, role }),
//   });
//   const data = await res.json().catch(() => ({}));
//   if (!res.ok) throw new Error(data.error || 'Registration failed');
//   return data;
// }
//
// export async function getApprovedViolations() {
//   const res = await fetch(`${API_BASE}/violations`);
//   if (!res.ok) throw new Error('Failed to load list');
//   return res.json();
// }
//
// export async function getViolationById(id) {
//   const res = await fetch(`${API_BASE}/violations/${id}`);
//   if (!res.ok) throw new Error('Not found');
//   return res.json();
// }
//
// export async function createSubmission(token, body) {
//   const res = await fetch(`${API_BASE}/violations`, {
//     method: 'POST',
//     headers: getHeaders(token),
//     body: JSON.stringify(body),
//   });
//   const data = await res.json().catch(() => ({}));
//   if (!res.ok) throw new Error(data.error || 'Create failed');
//   return data;
// }
//
// // Moderator
// export async function getPendingViolations(token) {
//   const res = await fetch(`${API_BASE}/violations/moderator/pending`, {
//     headers: getHeaders(token),
//   });
//   if (!res.ok) throw new Error('Access denied');
//   return res.json();
// }
//
// export async function getModeratorViolation(token, id) {
//   const res = await fetch(`${API_BASE}/violations/moderator/${id}`, {
//     headers: getHeaders(token),
//   });
//   if (!res.ok) throw new Error('Not found');
//   return res.json();
// }
//
// export async function approveViolation(token, id) {
//   const res = await fetch(`${API_BASE}/violations/moderator/${id}/approve`, {
//     method: 'PATCH',
//     headers: getHeaders(token),
//   });
//   if (!res.ok) throw new Error('Error');
//   return res.json();
// }
//
// export async function rejectViolation(token, id) {
//   const res = await fetch(`${API_BASE}/violations/moderator/${id}/reject`, {
//     method: 'PATCH',
//     headers: getHeaders(token),
//   });
//   if (!res.ok) throw new Error('Error');
//   return res.json();
// }
import axios from 'axios';

const API_BASE_URL = 'http://192.168.0.117:3000/api';
const TOKEN_KEY = 'demo_roles_token';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Інтерцептор для автоматичного додавання токена
apiClient.interceptors.request.use(
    async (config) => {
        const token = await localStorage.getItem(TOKEN_KEY);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }
);


// --- Auth Functions ---

export async function login(email, password) {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
}
export async function register({ name, email, password, role = 'user' }) {
    const response = await apiClient.post('/auth/register', {
        name,
        email,
        password,
        role
    });
    return response.data;
}

// --- User/Public Functions ---

export async function getApprovedViolations() {
    const response = await apiClient.get('/violations');
    return response.data;
}

export async function getViolationById(id) {
    const response = await apiClient.get(`/violations/${id}`);
    return response.data;
}

export async function createSubmission(token, body) {
    // token ігнорується, бо він автоматично береться інтерцептором
    const response = await apiClient.post('/violations', body);
    return response.data;
}

// --- Moderator Functions ---

export async function getPendingViolations() {
    const response = await apiClient.get('/violations/moderator/pending');
    return response.data;
}

export async function getModeratorViolation(token, id) {
    const response = await apiClient.get(`/violations/moderator/${id}`);
    return response.data;
}

export async function approveViolation(token, id) {
    const response = await apiClient.patch(`/violations/moderator/${id}/approve`);
    return response.data;
}

export async function rejectViolation(token, id) {
    const response = await apiClient.patch(`/violations/moderator/${id}/reject`);
    return response.data;
}

export default apiClient;