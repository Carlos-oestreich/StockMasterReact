// src/context/AuthContext.jsx
import React, { createContext, useContext, useState } from 'react';
import { authService } from '../services/authService.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [session, setSession] = useState(() => authService.getSession());

    const login = async (credentials) => {
        const s = await authService.login(credentials);
        setSession(s);
        return s;
    };

    const logout = () => {
        authService.logout();
        setSession(null);
    };

    // "user" e "usuario" apontam para o mesmo objeto — compatível com todos os componentes
    const user = session?.user ?? null;

    return (
        <AuthContext.Provider value={{ session, login, logout, user, usuario: user }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
    return ctx;
}
