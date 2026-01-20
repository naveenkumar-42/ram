import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1';

export const api = axios.create({
    baseURL: API_URL,
});

export const getProducts = async () => {
    const response = await api.get('/products/');
    return response.data;
};

export const getHistory = async (productId: string) => {
    const response = await api.get(`/products/${productId}/history`);
    return response.data;
};

export const updateProduct = async (id: string, updates: any) => {
    const response = await api.patch(`/products/${id}`, updates);
    return response.data;
};
