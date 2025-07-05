import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;
console.log('API Base URL:', baseURL);

const httpInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

httpInstance.interceptors.request.use(
  (request) => {
    const token = localStorage.getItem('token');
    if (token) {
      request.headers['Authorization'] = `Bearer ${token}`;
    }
    console.log('Starting Request:', {
      method: request.method?.toUpperCase(),
      url: request.url,
      data: request.data,
      fullUrl: baseURL + request.url,
    });
    return request;
  },
  (error) => {

    return Promise.reject(error);
  }
);

httpInstance.interceptors.response.use(
  (response) => {
    console.log('Response:', {
      status: response.status,
      data: response.data,
      url: response.config.url,
    });
    return response;
  },
  (error) => {
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      url: error.config?.url,
    });
    return Promise.reject(error);
  }
);

export default httpInstance;
