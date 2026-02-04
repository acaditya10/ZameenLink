import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const fetchProperties = async (limit = 100, area = null) => {
    const params = { limit };
    if (area) params.area = area;

    const response = await api.get('/properties', { params });
    return response.data;
};

export const predictPrice = async (propertyData) => {
    const response = await api.post('/predict', propertyData);
    return response.data;
};

export const fetchMetrics = async () => {
    const response = await api.get('/metrics');
    return response.data;
};

export const fetchHeatmapData = async () => {
    const response = await api.get('/heatmap');
    return response.data;
};

export const fetchAreas = async () => {
    const response = await api.get('/areas');
    return response.data;
};

export default api;
