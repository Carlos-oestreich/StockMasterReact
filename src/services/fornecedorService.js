import { api } from './api.js';

export const fornecedorService = {
    listar: async () => {
        const response = await api.get('/fornecedores');
        return response.data;
    },
    buscarPorId: async (id) => {
        const response = await api.get(`/fornecedores/${id}`);
        return response.data;
    },
    salvar: async (payload) => {
        const response = await api.post('/fornecedores', payload);
        return response.data;
    },
    atualizar: async (id, payload) => {
        const response = await api.put(`/fornecedores/${id}`, payload);
        return response.data;
    },
    excluir: async (id) => {
        const response = await api.delete(`/fornecedores/${id}`);
        return response.data;
    },
};