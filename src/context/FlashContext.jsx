import React, { createContext, useCallback, useContext, useState } from 'react';

const FlashContext = createContext(null);

let nextId = 1;

export function FlashProvider({ children }) {
    const [flashes, setFlashes] = useState([]);
    const [drawerAberto, setDrawerAberto] = useState(false);

    const addFlash = useCallback((type, message, duration = 4000) => {
        const id = nextId++;
        setFlashes((prev) => [...prev, { id, type, message }]);
        setTimeout(() => {
            setFlashes((prev) => prev.filter((m) => m.id !== id));
        }, duration);
    }, []);

    const removeFlash = useCallback((id) => {
        setFlashes((prev) => prev.filter((m) => m.id !== id));
    }, []);

    return (
        <FlashContext.Provider value={{ flashes, addFlash, removeFlash, drawerAberto, setDrawerAberto }}>
            {children}
        </FlashContext.Provider>
    );
}

export function useFlash() {
    const ctx = useContext(FlashContext);
    if (!ctx) throw new Error('useFlash deve ser usado dentro de FlashProvider');
    return ctx;
}