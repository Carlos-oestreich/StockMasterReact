// src/utils/validators.js

/**
 * Valida a força da senha.
 * Retorna { valid: boolean, failed: string[] }
 */
export function validatePasswordStrength(senha = '') {
    const rules = [
        { test: (s) => s.length >= 8,         msg: 'Mínimo de 8 caracteres' },
        { test: (s) => /[A-Z]/.test(s),        msg: 'Pelo menos uma letra maiúscula' },
        { test: (s) => /[a-z]/.test(s),        msg: 'Pelo menos uma letra minúscula' },
        { test: (s) => /[0-9]/.test(s),        msg: 'Pelo menos um número' },
    ];

    const failed = rules.filter((r) => !r.test(senha)).map((r) => r.msg);
    return { valid: failed.length === 0, failed };
}
