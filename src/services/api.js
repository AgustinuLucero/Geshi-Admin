import axios from 'axios';

//instancia axios
const apiClient = axios.create({
  baseURL: 'https://backendgeshi.onrender.com/api',
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

// para cuadno el token se vence
apiClient.interceptors.response.use(
  (response) => {
    // si la respuesta es exitosa, la deja pasar
    return response;
  },
  (error) => {
    // error 401 no autorizado token vencido
    if (error.response && error.response.status === 401) {
      
      // evito bucles infinitos si el error viene del login mismo
      if (!window.location.pathname.includes('/login')) {
        
        alert("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
        
        // borramos el token viejo
        localStorage.removeItem('geshi-token');
        
        // redirigimos al login forzosamente
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
