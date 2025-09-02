import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

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
export const fetchMostSelling = () => API.get('/products/most-selling');

// --- Order Functions ---
export const createOrder = (orderData) => API.post('/orders', orderData);
export const getOrderHistory = () => API.get('/orders/my-orders');

// --- Admin-Only Functions ---
export const getAllProductsAdmin = () => API.get('/admin/products');
export const getAllOrders = (filters) => API.get('/admin/orders', { params: filters });
export const updateOrderStatus = (orderId, status) => API.patch(`/admin/orders/${orderId}/status`, { status });
export const deleteProduct = (id) => API.delete(`/admin/products/${id}`);
export const updateProduct = (id, productData) => API.put(`/admin/products/${id}`, productData);
export const getAnalytics = () => API.get('/admin/analytics');

export const updateUserProfile = (profileData) => API.put('/auth/profile', profileData);
export default API;