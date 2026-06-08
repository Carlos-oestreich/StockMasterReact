import { api } from './api.js';
import { mockDb, seedMockDb, delay } from './mockDb.js';
import { mockResponse, useMocks } from './mockHelpers.js';

export const empresaService = {
    obter: async () => {
        if (useMocks) {
            seedMockDb();
            await delay();
            return mockResponse(mockDb.empresa);
        }
        // Backend Java: GET /empresas  → retorna a empresa cadastrada
        return api.get('/empresas');
    },
    atualizar: async (id, payload) => {
        if (useMocks) {
            seedMockDb();
            await delay();
            mockDb.empresa = { ...mockDb.empresa, ...payload };
            return mockResponse(mockDb.empresa);
        }
        // Backend Java: PUT /empresas/{id}
        return api.put(`/empresas/${id}`, payload);
    },
};
