import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;
console.log('API Base URL:', baseURL);

const httpInstance = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor para logs de peticiones
httpInstance.interceptors.request.use(request => {
    console.log('Starting Request:', {
        method: request.method?.toUpperCase(),
        url: request.url,
        data: request.data,
        fullUrl: baseURL + request.url // Para ver la URL completa
    });
    return request;
});

// Interceptor para logs de respuestas
httpInstance.interceptors.response.use(
    response => {
        console.log('Response:', {
            status: response.status,
            data: response.data,
            url: response.config.url
        });
        return response;
    },
    error => {
        console.error('API Error:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message,
            url: error.config?.url
        });
        return Promise.reject(error);
    }
);

export default httpInstance;

