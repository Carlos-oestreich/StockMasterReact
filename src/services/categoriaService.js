import { api } from './api.js';

export const categoriaService = {
    listar: async () => {
        const response = await api.get('/categorias');
        return response.data;
    },
    buscarPorId: async (id) => {
        const response = await api.get(`/categorias/${id}`);
        return response.data;
    },
    salvar: async (payload) => {
        const response = await api.post('/categorias', payload);
        return response.data;
    },
    atualizar: async (id, payload) => {
        const response = await api.put(`/categorias/${id}`, payload);
        return response.data;
    },
    excluir: async (id) => {
        const response = await api.delete(`/categorias/${id}`);
        return response.data;
    },
};