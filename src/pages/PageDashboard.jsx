import { useEffect, useMemo, useState } from 'react';
import StatCard from '../components/StatCard.jsx';
import Table from '../components/Table.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Badge from '../components/Badge.jsx';
import PdfButton from '../components/PdfButton.jsx';
import { produtoService } from '../services/produtoService.js';
import { movimentacaoService } from '../services/movimentacaoService.js';
import { formatCurrency, formatDateTime } from '../utils/format.js';
import { getStockStatus } from '../utils/stock.js';
import { Link } from 'react-router-dom';

export default function PageDashboard() {
    const [produtos, setProdutos] = useState([]);
    const [movimentacoes, setMovimentacoes] = useState([]);

    useEffect(() => {
        const carregar = async () => {
            const [produtosRes, movRes] = await Promise.all([
                produtoService.listar(),
                movimentacaoService.listar(),
            ]);
            setProdutos(produtosRes.data || []);
            setMovimentacoes(movRes.data || []);
        };
        carregar();
    }, []);

    const alertas = useMemo(
        () => produtos.filter((item) => item.quantidadeEstoque <= item.quantidadeMinima),
        [produtos]
    );

    const valorEstoque = produtos.reduce(
        (acc, item) => acc + Number(item.preco || 0) * Number(item.quantidadeEstoque || 0),
        0
    );

    const movimentacoesHoje = movimentacoes.filter((mov) => {
        const hoje = new Date();
        const dataMov = new Date(mov.dataMovimentacao);
        return dataMov.toDateString() === hoje.toDateString();
    });

    const recentes = movimentacoes.slice(0, 6);

    const handleExportarPDF = () => {
        console.log('Exportar dashboard como PDF');
        // TODO: Implementar exportação de PDF
    };

    return (
        <div className="space-y-6">
            {/* Cards de Estatísticas */}
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    label="Total de Produtos"
                    value={produtos.length}
                    icon="bi-box-seam"
                    color="blue"
                />
                <StatCard
                    label="Valor em Estoque"
                    value={formatCurrency(valorEstoque)}
                    icon="bi-currency-dollar"
                    color="green"
                />
                <StatCard
                    label="Produtos em Alerta"
                    value={alertas.length}
                    icon="bi-exclamation-triangle"
                    color="red"
                />
                <StatCard
                    label="Movimentações Hoje"
                    value={movimentacoesHoje.length}
                    icon="bi-activity"
                    color="purple"
                />
            </div>

            {/* Tabelas */}
            <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
                {/* Movimentações Recentes */}
                <Table title="Movimentações Recentes" actions={
                    <Link to="/movimentacoes" className="text-xs font-semibold text-primary hover:text-indigo-400">
                        Ver todas
                    </Link>
                }>
                    <table className="min-w-full w-full text-sm">
                        <thead>
                        <tr>
                            <th className="text-left">Data</th>
                            <th className="text-left">Tipo</th>
                            <th className="text-left">Produto</th>
                            <th className="text-right">Qtd</th>
                        </tr>
                        </thead>
                        <tbody>
                        {recentes.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-0 py-0">
                                    <EmptyState
                                        icon="bi-inbox"
                                        title="Nenhuma movimentação registrada"
                                        description="As movimentações mais recentes aparecerão aqui."
                                    />
                                </td>
                            </tr>
                        ) : (
                            recentes.map((mov) => (
                                <tr key={mov.id}>
                                    <td className="text-slate-400">{formatDateTime(mov.dataMovimentacao)}</td>
                                    <td>
                                        {mov.tipo === 'ENTRADA' ? (
                                            <Badge variant="normal">Entrada</Badge>
                                        ) : (
                                            <Badge variant="critico">Saída</Badge>
                                        )}
                                    </td>
                                    <td className="font-medium text-white">{mov.produto?.nome || '-'}</td>
                                    <td className="text-right font-semibold">{mov.quantidade}</td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </Table>

                {/* Alertas Ativos */}
                <div className="table-stockmaster h-full flex flex-col">
                    <div className="flex items-center justify-between border-b border-border px-5 py-4">
                        <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
                            <i className="bi bi-exclamation-triangle text-red-400" /> Alertas Ativos
                        </h3>
                        <Link to="/alertas" className="text-xs font-semibold text-primary hover:text-indigo-400">
                            Ver todos
                        </Link>
                    </div>
                    <div className="flex-1 space-y-2 px-4 py-4 overflow-y-auto">
                        {alertas.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 text-center">
                                <i className="bi bi-check-circle-fill text-emerald-400 text-4xl mb-3" />
                                <p className="font-semibold text-white">Estoque saudável!</p>
                                <p className="text-xs text-slate-400 mt-1">Todos os produtos estão dentro dos limites mínimos configurados.</p>
                            </div>
                        ) : (
                            alertas.slice(0, 6).map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2.5 text-xs"
                                >
                                    <div className="flex-1">
                                        <p className="font-semibold text-white">{item.nome}</p>
                                        <p className="text-slate-500">{item.sku}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-amber-300">{item.quantidadeEstoque} un</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}