/**
 * DTOs usados no front para Empresa.
 */
export const EmpresaDetailDTO = {
    id: null,
    nome: '',
    nomeFantasia: '',
    cnpj: '',
    email: '',
    telefone: '',
    endereco: '',
    suporte: '',
    ativa: true,
};

export const EmpresaSummaryDTO = {
    id: null,
    nome: '',
    cnpj: '',
    ativa: true,
};

export const EmpresaRequestDTO = {
    nome: '',
    nomeFantasia: '',
    cnpj: '',
    email: '',
    telefone: '',
    endereco: '',
    suporte: '',
    ativa: true,
};

export const normalizeEmpresa = (payload) => ({
    ...EmpresaDetailDTO,
    ...payload,
    ativa: payload?.ativa ?? true,
});
