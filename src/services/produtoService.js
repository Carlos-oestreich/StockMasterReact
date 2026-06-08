import { api } from './api.js';
import { mockDb, seedMockDb, delay } from './mockDb.js';
import { mockResponse, useMocks } from './mockHelpers.js';

const categoriaResumo = (id) => {
    const categoria = mockDb.categorias.find((item) => item.id === id);
    return categoria ? { id: categoria.id, nome: categoria.nome, setor: categoria.setor, ativo: categoria.ativo } : null;
};

const fornecedorResumo = (id) => {
    const fornecedor = mockDb.fornecedores.find((item) => item.id === id);
    return fornecedor
        ? { id: fornecedor.id, nome: fornecedor.nome, cnpj: fornecedor.cnpj, email: fornecedor.email, ativo: fornecedor.ativo }
        : null;
};

export const produtoService = {
    listar: async () => {
        if (useMocks) {
            seedMockDb();
            await delay();
            return mockResponse([...mockDb.produtos]);
        }
        // TODO: integrar com API real.
        return api.get('/produtos');
    },
    buscarPorId: async (id) => {
        if (useMocks) {
            seedMockDb();
            await delay();
            return mockResponse(mockDb.produtos.find((item) => item.id === id));
        }
        return api.get(`/produtos/${id}`);
    },
    listarAlertas: async () => {
        if (useMocks) {
            seedMockDb();
            await delay();
            return mockResponse(mockDb.produtos.filter((item) => item.quantidadeEstoque <= item.quantidadeMinima));
        }
        return api.get('/produtos/alertas');
    },
    salvar: async (payload) => {
        if (useMocks) {
            seedMockDb();
            await delay();
            const id = mockDb.createId(mockDb.produtos);
            const created = {
                id,
                ...payload,
                categoria: categoriaResumo(payload.categoriaId) || payload.categoria || null,
                fornecedor: fornecedorResumo(payload.fornecedorId) || payload.fornecedor || null,
            };
            mockDb.produtos.push(created);
            return mockResponse(created);
        }
        return api.post('/produtos', payload);
    },
    atualizar: async (id, payload) => {
        if (useMocks) {
            seedMockDb();
            await delay();
            const index = mockDb.produtos.findIndex((item) => item.id === id);
            if (index >= 0) {
                mockDb.produtos[index] = {
                    ...mockDb.produtos[index],
                    ...payload,
                    categoria: categoriaResumo(payload.categoriaId) || payload.categoria || mockDb.produtos[index].categoria,
                    fornecedor: fornecedorResumo(payload.fornecedorId) || payload.fornecedor || mockDb.produtos[index].fornecedor,
                };
            }
            return mockResponse(mockDb.produtos[index]);
        }
        return api.put(`/produtos/${id}`, payload);
    },
    excluir: async (id) => {
        if (useMocks) {
            seedMockDb();
            await delay();
            mockDb.produtos = mockDb.produtos.filter((item) => item.id !== id);
            return mockResponse(true);
        }
        return api.delete(`/produtos/${id}`);
    },
};
