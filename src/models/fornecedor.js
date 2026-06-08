/**
 * DTOs espelhando o backend (Fornecedor).
 */
export const FornecedorDetailDTO = {
    id: null,
    nome: '',
    cnpj: '',
    email: '',
    telefone: '',
    ativo: true,
    produtos: [],
};

export const FornecedorSummaryDTO = {
    id: null,
    nome: '',
    cnpj: '',
    email: '',
    ativo: true,
};

export const FornecedorRequestDTO = {
    nome: '',
    cnpj: '',
    email: '',
    telefone: '',
    ativo: true,
};

export const normalizeFornecedor = (payload) => ({
    ...FornecedorDetailDTO,
    ...payload,
    ativo: payload?.ativo ?? true,
});
