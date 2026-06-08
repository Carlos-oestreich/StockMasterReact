/**
 * DTOs espelhando o backend (Usuario).
 */
export const UsuarioDetailDTO = {
    id: null,
    nome: '',
    email: '',
    perfil: '',
    matricula: '',
    ativo: true,
};

export const UsuarioSummaryDTO = {
    id: null,
    nome: '',
    email: '',
    perfil: '',
    ativo: true,
};

export const UsuarioRequestDTO = {
    nome: '',
    email: '',
    senha: '',
    perfil: '',
    matricula: '',
    ativo: true,
};

export const normalizeUsuario = (payload) => ({
    ...UsuarioDetailDTO,
    ...payload,
    ativo: payload?.ativo ?? true,
});
