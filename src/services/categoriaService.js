import { api } from './api.js';
import { mockDb, seedMockDb, delay } from './mockDb.js';
import { mockResponse, useMocks } from './mockHelpers.js';

export const categoriaService = {
    listar: async () => {
        if (useMocks) {
            seedMockDb();
            await delay();
            return mockResponse([...mockDb.categorias]);
        }
        // TODO: integrar com API real.
        return api.get('/categorias');
    },
    buscarPorId: async (id) => {
        if (useMocks) {
            seedMockDb();
            await delay();
            return mockResponse(mockDb.categorias.find((item) => item.id === id));
        }
        return api.get(`/categorias/${id}`);
    },
    salvar: async (payload) => {
        if (useMocks) {
            seedMockDb();
            await delay();
            const id = mockDb.createId(mockDb.categorias);
            const created = { id, ...payload };
            mockDb.categorias.push(created);
            return mockResponse(created);
        }
        return api.post('/categorias', payload);
    },
    atualizar: async (id, payload) => {
        if (useMocks) {
            seedMockDb();
            await delay();
            const index = mockDb.categorias.findIndex((item) => item.id === id);
            if (index >= 0) {
                mockDb.categorias[index] = { ...mockDb.categorias[index], ...payload };
            }
            return mockResponse(mockDb.categorias[index]);
        }
        return api.put(`/categorias/${id}`, payload);
    },
    excluir: async (id) => {
        if (useMocks) {
            seedMockDb();
            await delay();
            mockDb.categorias = mockDb.categorias.filter((item) => item.id !== id);
            return mockResponse(true);
        }
        return api.delete(`/categorias/${id}`);
    },
};
