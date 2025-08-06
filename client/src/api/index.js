import axios from 'axios';

// 1. Create the base axios instance with the backend URL
const API = axios.create({ baseURL: 'http://localhost:5000/api' });

// 2. Use an interceptor to automatically add the auth token to every request
API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers['x-auth-token'] = token;
    }
    return req;
});

// --- Authentication Functions ---
export const login = (formData) => API.post('/auth/login', formData);
export const signup = (formData) => API.post('/auth/signup', formData);
export const adminLogin = (formData) => API.post('/admin/login', formData);

// --- Product Functions ---
export const fetchProducts = () => API.get('/products');
export const addProduct = (productData) => API.post('/admin/products', productData);

// --- Order Functions ---
export const createOrder = (orderData) => API.post('/orders', orderData);
export const getOrderHistory = () => API.get('/orders/my-orders');

// --- Admin-Only Functions ---
export const getAllOrders = (filters) => API.get('/admin/orders', { params: filters });
// 3. Export the API instance itself as the default export

export const updateUserProfile = (profileData) => API.put('/auth/profile', profileData);
export default API;