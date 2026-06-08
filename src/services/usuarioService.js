import { api } from './api.js';
import { mockDb, seedMockDb, delay } from './mockDb.js';
import { mockResponse, useMocks } from './mockHelpers.js';

export const usuarioService = {
    listar: async () => {
        if (useMocks) {
            seedMockDb();
            await delay();
            return mockResponse([...mockDb.usuarios]);
        }
        // TODO: integrar com API real.
        return api.get('/usuarios');
    },
    buscarPorId: async (id) => {
        if (useMocks) {
            seedMockDb();
            await delay();
            return mockResponse(mockDb.usuarios.find((item) => item.id === id));
        }
        return api.get(`/usuarios/${id}`);
    },
    salvar: async (payload) => {
        if (useMocks) {
            seedMockDb();
            await delay();
            const id = mockDb.createId(mockDb.usuarios);
            const created = { id, ...payload };
            mockDb.usuarios.push(created);
            return mockResponse(created);
        }
        return api.post('/usuarios', payload);
    },
    atualizar: async (id, payload) => {
        if (useMocks) {
            seedMockDb();
            await delay();
            const index = mockDb.usuarios.findIndex((item) => item.id === id);
            if (index >= 0) {
                mockDb.usuarios[index] = { ...mockDb.usuarios[index], ...payload };
            }
            return mockResponse(mockDb.usuarios[index]);
        }
        return api.put(`/usuarios/${id}`, payload);
    },
    excluir: async (id) => {
        if (useMocks) {
            seedMockDb();
            await delay();
            mockDb.usuarios = mockDb.usuarios.filter((item) => item.id !== id);
            return mockResponse(true);
        }
        return api.delete(`/usuarios/${id}`);
    },
};
