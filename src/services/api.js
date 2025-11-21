import axios from 'axios';

//instancia axios
const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api',
});

//aca inyecto el token en cada peticion
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('geshi-token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
