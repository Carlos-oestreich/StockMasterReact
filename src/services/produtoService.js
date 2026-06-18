import { api } from './api.js';

export const produtoService = {
    listar: async () => {
        const response = await api.get('/produtos');
        return response.data;
    },
    buscarPorId: async (id) => {
        const response = await api.get(`/produtos/${id}`);
        return response.data;
    },
    salvar: async (payload) => {
        const response = await api.post('/produtos', payload);
        return response.data;
    },
    atualizar: async (id, payload) => {
        const response = await api.put(`/produtos/${id}`, payload);
        return response.data;
    },
    excluir: async (id) => {
        const response = await api.delete(`/produtos/${id}`);
        return response.data;
    },
};