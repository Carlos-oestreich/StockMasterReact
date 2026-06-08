

export function getStockStatus(quantidade, quantidadeMinima) {
    if (quantidade === 0) {
        return 'Sem Estoque';
    }
    if (quantidade <= quantidadeMinima) {
        return 'Atenção';
    }
    return 'Normal';
}

export function getStockColor(quantidade, quantidadeMinima) {
    if (quantidade === 0) return '#ef4444';
    if (quantidade <= quantidadeMinima) return '#f59e0b';
    return '#10b981';
}