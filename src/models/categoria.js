/**
 * DTOs espelhando o backend (Categoria).
 */
export const CategoriaDetailDTO = {
    id: null,
    nome: '',
    descricao: '',
    setor: '',
    codigoInterno: '',
    ativo: true,
};

export const CategoriaSummaryDTO = {
    id: null,
    nome: '',
    setor: '',
    ativo: true,
};

export const CategoriaRequestDTO = {
    nome: '',
    descricao: '',
    setor: '',
    codigoInterno: '',
    ativo: true,
};

export const normalizeCategoria = (payload) => ({
    ...CategoriaDetailDTO,
    ...payload,
    ativo: payload?.ativo ?? true,
});
