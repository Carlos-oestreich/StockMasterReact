import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    try {
        const raw = localStorage.getItem('stockmaster_session');
        const session = raw ? JSON.parse(raw) : {};

        console.log('SESSION:', session);

        if (session?.token) {
            config.headers['Authorization'] = `Bearer ${session.token}`;
        }

        if (session?.empresaId) {
            config.headers['Empresa-Id'] = session.empresaId;
        } else {
            console.warn('Empresa-Id não encontrado na sessão!');
        }
    } catch {
        console.error('Erro ao ler sessão do localStorage');
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('stockmaster_session');
            localStorage.removeItem('stockmaster_token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;