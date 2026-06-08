import { api } from './api.js';
import { delay, mockDb, seedMockDb } from './mockDb.js';
import { useMocks } from './mockHelpers.js';

const SESSION_KEY = 'stockmaster_session';
const TOKEN_KEY = 'stockmaster_token';

const mockPasswords = {
    'admin@stockmaster.com': 'admin123',
    'operador@stockmaster.com': 'op123',
    'dono@stockmaster.com': 'dono123',
};

const saveSession = (session) => {
    if (!session) return;
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    localStorage.setItem(TOKEN_KEY, session.token);
};

const clearSession = () => {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(TOKEN_KEY);
};

export const authService = {
    getSession: () => {
        try {
            const stored = localStorage.getItem(SESSION_KEY);
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    },

    login: async ({ email, senha }) => {
        if (useMocks) {
            seedMockDb();
            await delay();
            const user = mockDb.usuarios.find((item) => item.email === email);
            if (!user || mockPasswords[email] !== senha) {
                throw new Error('Credenciais invalidas.');
            }
            const session = { token: `mock-token-${user.id}`, empresaId: 1, user };
            saveSession(session);
            return session;
        }

        const { data } = await api.post('/login', { email, senha });
        const session = {
            token: data.token,
            empresaId: data.empresaId,
            user: {
                id: data.id,
                nome: data.nome,
                email: data.email,
                perfil: data.perfil,
                cpf: data.cpf,
                empresaId: data.empresaId,
            },
        };
        saveSession(session);
        return session;
    },

    logout: () => {
        clearSession();
    },
};