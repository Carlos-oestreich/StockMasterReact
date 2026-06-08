/**
 * DTOs espelhando o backend (Produto).
 */
export const ProdutoDetailDTO = {
    id: null,
    sku: '',
    nome: '',
    descricao: '',
    preco: 0,
    marca: '',
    quantidadeEstoque: 0,
    quantidadeMinima: 0,
    dataCadastro: null,
    categoria: null,
    fornecedor: null,
    movimentacoes: [],
};

export const ProdutoSummaryDTO = {
    id: null,
    sku: '',
    nome: '',
    preco: 0,
    marca: '',
    quantidadeEstoque: 0,
    categoria: null,
    fornecedor: null,
};

export const ProdutoRequestDTO = {
    sku: '',
    nome: '',
    descricao: '',
    preco: 0,
    marca: '',
    quantidadeEstoque: 0,
    quantidadeMinima: 0,
    dataCadastro: null,
    categoriaId: null,
    fornecedorId: null,
};

export const normalizeProduto = (payload) => ({
    ...ProdutoDetailDTO,
    ...payload,
    preco: Number(payload?.preco ?? 0),
    quantidadeEstoque: Number(payload?.quantidadeEstoque ?? 0),
    quantidadeMinima: Number(payload?.quantidadeMinima ?? 0),
});
