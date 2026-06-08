import { api } from './api.js';
import { mockDb, seedMockDb, delay } from './mockDb.js';
import { mockResponse, useMocks } from './mockHelpers.js';

export const fornecedorService = {
    listar: async () => {
        if (useMocks) {
            seedMockDb();
            await delay();
            return mockResponse([...mockDb.fornecedores]);
        }
        // TODO: integrar com API real.
        return api.get('/fornecedores');
    },
    buscarPorId: async (id) => {
        if (useMocks) {
            seedMockDb();
            await delay();
            return mockResponse(mockDb.fornecedores.find((item) => item.id === id));
        }
        return api.get(`/fornecedores/${id}`);
    },
    salvar: async (payload) => {
        if (useMocks) {
            seedMockDb();
            await delay();
            const id = mockDb.createId(mockDb.fornecedores);
            const created = { id, ...payload };
            mockDb.fornecedores.push(created);
            return mockResponse(created);
        }
        return api.post('/fornecedores', payload);
    },
    atualizar: async (id, payload) => {
        if (useMocks) {
            seedMockDb();
            await delay();
            const index = mockDb.fornecedores.findIndex((item) => item.id === id);
            if (index >= 0) {
                mockDb.fornecedores[index] = { ...mockDb.fornecedores[index], ...payload };
            }
            return mockResponse(mockDb.fornecedores[index]);
        }
        return api.put(`/fornecedores/${id}`, payload);
    },
    excluir: async (id) => {
        if (useMocks) {
            seedMockDb();
            await delay();
            mockDb.fornecedores = mockDb.fornecedores.filter((item) => item.id !== id);
            return mockResponse(true);
        }
        return api.delete(`/fornecedores/${id}`);
    },
};
