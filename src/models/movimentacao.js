/**
 * DTOs espelhando o backend (Movimentacao de Estoque).
 */
export const MovimentacaoDetailDTO = {
    id: null,
    tipo: '',
    quantidade: 0,
    observacao: '',
    dataMovimentacao: null,
    saldoAnterior: 0,
    saldoAtual: 0,
    produto: null,
    usuario: null,
};

export const MovimentacaoSummaryDTO = {
    id: null,
    tipo: '',
    quantidade: 0,
    dataMovimentacao: null,
    saldoAtual: 0,
    produto: null,
    usuario: null,
};

export const MovimentacaoRequestDTO = {
    tipo: '',
    quantidade: 0,
    observacao: '',
    dataMovimentacao: null,
    produtoId: null,
    usuarioId: null,
};

export const normalizeMovimentacao = (payload) => ({
    ...MovimentacaoDetailDTO,
    ...payload,
    quantidade: Number(payload?.quantidade ?? 0),
    saldoAnterior: Number(payload?.saldoAnterior ?? 0),
    saldoAtual: Number(payload?.saldoAtual ?? 0),
});
