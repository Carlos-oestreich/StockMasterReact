// src/services/mockHelpers.js
// ─────────────────────────────────────────────────────────────────────────────
// Para usar dados reais do backend Java, defina VITE_USE_MOCKS=false no .env
// Para usar dados fictícios (sem backend), defina VITE_USE_MOCKS=true
// ─────────────────────────────────────────────────────────────────────────────

// Se a variável não estiver definida, padrão é FALSE (usa API real)
export const useMocks = import.meta.env.VITE_USE_MOCKS === 'true';

export const mockResponse = (data) => Promise.resolve({ data });
