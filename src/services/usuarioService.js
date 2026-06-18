import { api } from './api.js';

export const usuarioService = {
    listar: async () => {
        const response = await api.get('/usuarios');
        return response.data;
    },
    buscarPorId: async (id) => {
        const response = await api.get(`/usuarios/${id}`);
        return response.data;
    },
    salvar: async (payload) => {
        const response = await api.post('/usuarios', payload);
        return response.data;
    },
    atualizar: async (id, payload) => {
        const response = await api.put(`/usuarios/${id}`, payload);
        return response.data;
    },
    excluir: async (id) => {
        const response = await api.delete(`/usuarios/${id}`);
        return response.data;
    },
};