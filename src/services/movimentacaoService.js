import { api } from './api.js';

export const movimentacaoService = {
    listar: async () => {
        const response = await api.get('/movimentacoes');
        return response.data;
    },
    salvar: async (payload) => {
        const response = await api.post('/movimentacoes', payload);
        return response.data;
    },
};