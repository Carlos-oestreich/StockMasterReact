import { api } from './api.js';
import { mockDb, seedMockDb, delay } from './mockDb.js';
import { mockResponse, useMocks } from './mockHelpers.js';

const buildRelatorio = () => {
    const produtos = mockDb.produtos;
    const movimentacoes = mockDb.movimentacoes;

    const valorTotalEstoque = produtos.reduce(
        (acc, item) => acc + Number(item.preco || 0) * Number(item.quantidadeEstoque || 0),
        0
    );

    const qtdEntradas = movimentacoes
        .filter((mov) => mov.tipo === 'ENTRADA')
        .reduce((acc, mov) => acc + Number(mov.quantidade || 0), 0);

    const qtdSaidas = movimentacoes
        .filter((mov) => mov.tipo === 'SAIDA')
        .reduce((acc, mov) => acc + Number(mov.quantidade || 0), 0);

    const topProdutosMap = movimentacoes.reduce((acc, mov) => {
        const name = mov.produto?.nome || 'Produto';
        acc[name] = (acc[name] || 0) + Number(mov.quantidade || 0);
        return acc;
    }, {});

    const topProdutos = Object.entries(topProdutosMap)
        .map(([nome, quantidade]) => ({ nome, quantidade }))
        .sort((a, b) => b.quantidade - a.quantidade)
        .slice(0, 5);

    const alertas = produtos.filter((item) => item.quantidadeEstoque <= item.quantidadeMinima);

    return {
        valorTotalEstoque,
        totalSkus: produtos.length,
        qtdEntradas,
        qtdSaidas,
        topProdutos,
        alertas,
        estoque: produtos,
    };
};

export const relatorioService = {
    gerarRelatorio: async () => {
        if (useMocks) {
            seedMockDb();
            await delay();
            return mockResponse(buildRelatorio());
        }
        // TODO: integrar com API real.
        return api.get('/relatorios');
    },
};
