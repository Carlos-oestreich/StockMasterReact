import { api } from './api.js';

export const relatorioService = {
    gerarRelatorio: async () => {
        const response = await api.get('/relatorios');
        return response.data;
    },
};