import { api } from './api.js';

export const empresaService = {
    obter: async () => {
        const response = await api.get('/empresas');
        return response.data;
    },
    atualizar: async (id, payload) => {
        const response = await api.put(`/empresas/${id}`, payload);
        return response.data;
    },
};