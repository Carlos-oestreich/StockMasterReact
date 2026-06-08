import { useEffect, useState } from 'react';
import Table from '../components/Table.jsx';
import PdfButton from '../components/PdfButton.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Breadcrumb from '../components/Breadcrumb.jsx';
import { relatorioService } from '../services/relatorioService.js';
import { empresaService } from '../services/empresaService.js';
import { formatCurrency } from '../utils/format.js';
import { buildRelatorio } from '../utils/pdf.js';
import { Link } from 'react-router-dom';


const hoje = () => new Date().toISOString().slice(0, 10);
const diasAtras = (n) => {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d.toISOString().slice(0, 10);
};

export default function PageRelatorios() {
    const [relatorio, setRelatorio] = useState(null);
    const [empresa, setEmpresa] = useState(null);
    const [modalPdfOpen, setModalPdfOpen] = useState(false);
    const [periodo, setPeriodo] = useState('30');
    const [dataInicio, setDataInicio] = useState(diasAtras(30));
    const [dataFim, setDataFim] = useState(hoje());
    const [erroPdf, setErroPdf] = useState('');
    const [secoes, setSecoes] = useState({
        resumo: true, top5: true, porCategoria: true, topCategoria: true, estoque: true,
    });

    useEffect(() => {
        const carregar = async () => {
            const [relRes, empRes] = await Promise.all([
                relatorioService.gerarRelatorio(),
                empresaService.obter(),
            ]);
            setRelatorio(relRes.data);
            setEmpresa(empRes.data);
        };
        carregar();
    }, []);

    const abrirModalPdf = () => {
        setPeriodo('30');
        setDataInicio(diasAtras(30));
        setDataFim(hoje());
        setErroPdf('');
        setSecoes({ resumo: true, top5: true, porCategoria: true, topCategoria: true, estoque: true });
        setModalPdfOpen(true);
    };

    const handlePeriodo = (val) => {
        setPeriodo(val);
        if (val !== 'custom') {
            setDataInicio(diasAtras(Number(val)));
            setDataFim(hoje());
        }
        setErroPdf('');
    };

    const confirmarExportarPdf = () => {
        if (periodo === 'custom') {
            const ini = new Date(dataInicio + 'T00:00:00');
            const fim = new Date(dataFim + 'T23:59:59');
            const diff = (fim - ini) / (1000 * 60 * 60 * 24);
            if (fim < ini) { setErroPdf('A data final deve ser maior que a inicial.'); return; }
            if (diff > 30) { setErroPdf('O período máximo é de 30 dias.'); return; }
        }
        if (!Object.values(secoes).some(Boolean)) {
            setErroPdf('Selecione ao menos uma seção.');
            return;
        }
        buildRelatorio({ relatorio, empresa, secoes, dataInicio, dataFim });
        setModalPdfOpen(false);
    };

    const toggleSecao = (key) => setSecoes((prev) => ({ ...prev, [key]: !prev[key] }));

    if (!relatorio) {
        return (
            <div className="rounded-2xl border border-border bg-card p-10 text-center text-slate-400">
                Carregando relatórios...
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {modalPdfOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60">
                    <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
                        <div>
                            <h3 className="text-lg font-bold text-white">Exportar PDF</h3>
                            <p className="text-xs text-slate-400">Configure o relatório antes de exportar.</p>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-300">Período de Análise</label>
                            <select
                                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-slate-100"
                                value={periodo}
                                onChange={(e) => handlePeriodo(e.target.value)}
                            >
                                <option value="7">Últimos 7 dias</option>
                                <option value="15">Últimos 15 dias</option>
                                <option value="30">Últimos 30 dias</option>
                                <option value="custom">Personalizado</option>
                            </select>
                        </div>

                        {periodo === 'custom' && (
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-slate-300">Início</label>
                                    <input type="date" className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-slate-100" value={dataInicio} max={hoje()} onChange={(e) => { setDataInicio(e.target.value); setErroPdf(''); }} />
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-slate-300">Fim</label>
                                    <input type="date" className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-slate-100" value={dataFim} max={hoje()} onChange={(e) => { setDataFim(e.target.value); setErroPdf(''); }} />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-300">Seções do Relatório</label>
                            <div className="space-y-2">
                                {[
                                    { key: 'resumo', label: 'Resumo do Período' },
                                    { key: 'top5', label: 'Top 5 Produtos Mais Vendidos' },
                                    { key: 'porCategoria', label: 'Valor Vendido por Categoria' },
                                    { key: 'topCategoria', label: 'Itens Mais Vendidos por Categoria' },
                                    { key: 'estoque', label: 'Posição Atual do Estoque' },
                                ].map((s) => (
                                    <label key={s.key} className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer hover:text-white">
                                        <input
                                            type="checkbox"
                                            checked={secoes[s.key]}
                                            onChange={() => toggleSecao(s.key)}
                                            className="h-4 w-4 rounded border-border bg-background text-primary"
                                        />
                                        {s.label}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {erroPdf && (
                            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                                <i className="bi bi-exclamation-circle me-1" />{erroPdf}
                            </p>
                        )}

                        <div className="flex gap-2 pt-1">
                            <button onClick={confirmarExportarPdf} className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90">
                                <i className="bi bi-file-earmark-pdf" /> Exportar
                            </button>
                            <button onClick={() => setModalPdfOpen(false)} className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-slate-300 hover:bg-slate-800">
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <Breadcrumb items={[{ label: 'Relatórios', to: '/relatorios' }]} />

            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-2xl font-bold text-white">Relatorios</h2>
                    <p className="text-sm text-slate-400">Visao geral do sistema</p>
                </div>
                <PdfButton onClick={abrirModalPdf} label="Baixar PDF" />
            </div>

            {/* ── CARDS ── */}
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {[
                    { label: 'Produtos', value: relatorio.totalSkus, icon: 'bi-box-seam', color: '#3b82f6', bg: 'rgba(59,130,246,.15)' },
                    { label: 'Valor em Estoque', value: formatCurrency(relatorio.valorTotalEstoque), icon: 'bi-cash-coin', color: '#10b981', bg: 'rgba(16,185,129,.15)' },
                    { label: 'Total Entradas', value: `${relatorio.qtdEntradas} un`, icon: 'bi-arrow-down-circle', color: '#10b981', bg: 'rgba(16,185,129,.15)' },
                    { label: 'Total Saidas', value: `${relatorio.qtdSaidas} un`, icon: 'bi-arrow-up-circle', color: '#ef4444', bg: 'rgba(239,68,68,.15)' },
                ].map((card) => (
                    <div key={card.label} className="card-stat flex items-center justify-between">
                        <div>
                            <p className="stat-label">{card.label}</p>
                            <p className="mt-2 text-2xl font-bold" style={{ color: card.color }}>{card.value}</p>
                        </div>
                        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl" style={{ background: card.bg, color: card.color }}>
                            <i className={`bi ${card.icon} text-2xl`} />
                        </div>
                    </div>
                ))}
            </div>

            {/* ── GRID MEIO ── */}
            <div className="grid gap-6 xl:grid-cols-2">

                {/* Top 5 */}
                <div className="rounded-2xl border border-border bg-card p-6">
                    <h3 className="mb-5 flex items-center gap-2 font-semibold text-white">
                        <i className="bi bi-trophy-fill text-amber-400 text-lg" /> Top 5 Produtos Movimentados
                    </h3>
                    {relatorio.topProdutos.length === 0 ? (
                        <EmptyState icon="bi-bar-chart" title="Sem movimentações" description="Não há dados suficientes." />
                    ) : (
                        <div className="space-y-4">
                            {relatorio.topProdutos.map((item, index) => (
                                <div key={item.nome}>
                                    <div className="mb-1 flex items-center justify-between text-sm">
                                        <span className="text-slate-300">{index + 1}. {item.nome}</span>
                                        <span className="text-slate-400 tabular-nums">{item.quantidade} un</span>
                                    </div>
                                    <div className="relative h-3 w-full rounded-full bg-slate-800">
                                        <div
                                            className="absolute left-0 top-0 h-3 rounded-full transition-all"
                                            style={{
                                                width: `${Math.min(100, (item.quantidade / relatorio.topProdutos[0].quantidade) * 100)}%`,
                                                background: ['#4f46e5', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'][index],
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>


                {/* Alertas */}
                <div className="rounded-2xl border border-border bg-card overflow-hidden">
                    <div className="flex items-center justify-between border-b border-border px-5 py-4">
                        <h3 className="flex items-center gap-2 font-semibold text-white">
                            <i className="bi bi-exclamation-triangle-fill text-red-400 text-lg" /> Alertas de Estoque
                        </h3>
                        <Link to="/alertas" className="text-xs font-semibold text-primary hover:text-indigo-300">
                            Ver todos
                        </Link>
                    </div>
                    <table className="table-stockmaster min-w-full text-sm">
                        <thead>
                        <tr>
                            <th className="text-left">Produto</th>
                            <th className="text-center">Atual</th>
                            <th className="text-center">Minimo</th>
                            <th className="text-center">Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {relatorio.alertas.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="py-8 text-center text-slate-400">
                                    Nenhum produto abaixo do mínimo.
                                </td>
                            </tr>
                        ) : relatorio.alertas.map((item) => {
                            const semEstoque = item.quantidadeEstoque === 0;
                            return (
                                <tr key={item.id}>
                                    <td className="text-left font-bold text-white">{item.nome}</td>
                                    <td className={`text-center text-lg font-bold ${semEstoque ? 'text-red-400' : 'text-amber-400'}`}>
                                        {item.quantidadeEstoque}
                                    </td>
                                    <td className="text-center text-slate-400">{item.quantidadeMinima}</td>
                                    <td className="text-center">
                            <span className="rounded px-2 py-0.5 text-xs font-semibold"
                                  style={semEstoque
                                      ? { background: 'rgba(100,116,139,.2)', color: '#94a3b8' }
                                      : { background: 'rgba(239,68,68,.2)', color: '#ef4444' }}>
                                {semEstoque ? 'Sem Estoque' : 'Critico'}
                            </span>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── POSIÇÃO ATUAL DO ESTOQUE ── */}
            <Table
                title="Posicao Atual do Estoque"
                titleIcon="bi bi-table text-primary"
                actions={<span className="text-xs text-slate-400">{relatorio.totalSkus} produtos</span>}
            >
                <table className="min-w-full w-full text-sm">
                    <thead>
                    <tr>
                        <th>Produto</th>
                        <th>SKU</th>
                        <th>Categoria</th>
                        <th className="text-center">Estoque</th>
                        <th className="text-right">Preco Unit.</th>
                        <th className="text-right">Valor Total</th>
                        <th>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {relatorio.estoque?.length === 0 ? (
                        <tr><td colSpan={7}><EmptyState icon="bi-inbox" title="Estoque vazio" description="Nenhum item cadastrado." /></td></tr>
                    ) : relatorio.estoque?.map((item) => {
                        const semEstoque = item.quantidade === 0;
                        const critico = item.quantidade <= (item.quantidadeMinima || 0) && !semEstoque;
                        const statusLabel = semEstoque ? 'Sem Estoque' : critico ? 'Critico' : 'Normal';
                        const statusStyle = semEstoque
                            ? { background: 'rgba(100,116,139,.2)', color: '#94a3b8' }
                            : critico ? { background: 'rgba(239,68,68,.2)', color: '#ef4444' }
                                : { background: 'rgba(16,185,129,.2)', color: '#10b981' };
                        return (
                            <tr key={item.sku}>
                                <td className="font-bold text-white">{item.nome}</td>
                                <td className="text-slate-400 text-xs">{item.sku}</td>
                                <td className="text-slate-400">{item.categoria}</td>
                                <td className="text-center font-bold text-white">{item.quantidade}</td>
                                <td className="text-right text-slate-300">{formatCurrency(item.valorUnitario)}</td>
                                <td className="text-right font-bold text-white">{formatCurrency(item.valorTotal)}</td>
                                <td><span className="rounded px-2 py-0.5 text-xs font-semibold" style={statusStyle}>{statusLabel}</span></td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </Table>
        </div>
    );
}