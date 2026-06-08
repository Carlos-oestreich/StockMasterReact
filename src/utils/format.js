export const formatCurrency = (value) => {
    const numberValue = Number(value || 0);
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
    }).format(numberValue);
};

export const formatDateTime = (value) => {
    if (!value) return '-';
    const dateValue = value instanceof Date ? value : new Date(value);
    return new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short',
    }).format(dateValue);
};

export const formatDate = (value) => {
    if (!value) return '-';
    const dateValue = value instanceof Date ? value : new Date(value);
    return new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'short',
    }).format(dateValue);
};
