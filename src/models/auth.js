/**
 * DTOs de autenticacao.
 */
export const AuthLoginRequestDTO = {
    email: '',
    senha: '',
};

export const AuthLoginResponseDTO = {
    token: '',
    usuario: null,
};

export const AuthChangePasswordRequestDTO = {
    senhaAtual: '',
    novaSenha: '',
    confirmarSenha: '',
};
