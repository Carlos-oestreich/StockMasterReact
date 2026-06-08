import { api } from './api.js';
import { mockDb, seedMockDb, delay } from './mockDb.js';
import { mockResponse, useMocks } from './mockHelpers.js';

export const movimentacaoService = {
    listar: async () => {
        if (useMocks) {
            seedMockDb();
            await delay();
            const ordered = [...mockDb.movimentacoes].sort(
                (a, b) => new Date(b.dataMovimentacao).getTime() - new Date(a.dataMovimentacao).getTime()
            );
            return mockResponse(ordered);
        }
        // TODO: integrar com API real.
        return api.get('/movimentacoes');
    },
    salvar: async (payload) => {
        if (useMocks) {
            seedMockDb();
            await delay();
            const produto = mockDb.produtos.find((item) => item.id === payload.produtoId);
            const usuario = mockDb.usuarios.find((item) => item.id === payload.usuarioId);
            if (!produto) {
                return mockResponse(null);
            }
            const saldoAnterior = produto.quantidadeEstoque;
            const quantidade = Number(payload.quantidade || 0);
            const isEntrada = payload.tipo === 'ENTRADA';
            const saldoAtual = isEntrada ? saldoAnterior + quantidade : saldoAnterior - quantidade;
            produto.quantidadeEstoque = saldoAtual;

            const movimentacao = {
                id: mockDb.createId(mockDb.movimentacoes),
                tipo: payload.tipo,
                quantidade,
                observacao: payload.observacao || '',
                dataMovimentacao: payload.dataMovimentacao || new Date(),
                saldoAnterior,
                saldoAtual,
                produto: {
                    id: produto.id,
                    sku: produto.sku,
                    nome: produto.nome,
                    preco: produto.preco,
                    marca: produto.marca,
                    quantidadeEstoque: produto.quantidadeEstoque,
                    categoria: produto.categoria,
                    fornecedor: produto.fornecedor,
                },
                usuario: usuario
                    ? { id: usuario.id, nome: usuario.nome, email: usuario.email, perfil: usuario.perfil, ativo: usuario.ativo }
                    : null,
            };

            mockDb.movimentacoes.unshift(movimentacao);
            return mockResponse(movimentacao);
        }
        return api.post('/movimentacoes', payload);
    },
};
