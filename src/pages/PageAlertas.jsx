import { useEffect, useMemo, useState } from 'react';
import Table from '../components/Table.jsx';
import Badge from '../components/Badge.jsx';
import EmptyState from '../components/EmptyState.jsx';
import PdfButton from '../components/PdfButton.jsx';
import Breadcrumb from '../components/Breadcrumb.jsx';
import { produtoService } from '../services/produtoService.js';
import { empresaService } from '../services/empresaService.js';
import { buildPdf, savePdf } from '../utils/pdf.js';
import { Link } from 'react-router-dom';

export default function PageAlertas() {
    const [produtos, setProdutos] = useState([]);
    const [empresa, setEmpresa] = useState(null);

    useEffect(() => {
        const carregar = async () => {
            const [prodRes, empRes] = await Promise.all([
                produtoService.listar(),
                empresaService.obter(),
            ]);
            setProdutos(prodRes || []);
            setEmpresa(empRes || null);
        };
        carregar();
    }, []);

    const alertas    = useMemo(() => produtos.filter((p) => p.quantidadeEstoque <= p.quantidadeMinima), [produtos]);
    const semEstoque = useMemo(() => alertas.filter((p) => p.quantidadeEstoque === 0), [alertas]);
    const criticos   = useMemo(() => alertas.filter((p) => p.quantidadeEstoque > 0), [alertas]);

    const exportarPdf = () => {
        const columns = ['Produto', 'SKU', 'Categoria', 'Fornecedor', 'Estoque Atual', 'Mínimo', 'Situação'];
        const rows = alertas.map((p) => [
            p.nome,
            p.sku,
            p.categoria?.nome || '—',
            p.fornecedor?.nome || '—',
            p.quantidadeEstoque + ' un',
            p.quantidadeMinima + ' un',
            p.quantidadeEstoque === 0 ? 'Sem Estoque' : 'Crítico',
        ]);
        const doc = buildPdf({ title: 'Alertas de Estoque', columns, rows, empresa });
        savePdf(doc, 'alertas_estoque');
    };

    return (
        <div className="space-y-6">
            <Breadcrumb items={[{ label: 'Alertas', to: '/alertas' }]} />

            {/* ── CABEÇALHO ── */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white">Alertas de Estoque</h2>
                    <p className="text-sm text-slate-400">{alertas.length} produto(s) precisam de atenção</p>
                </div>
                <PdfButton onClick={exportarPdf} />
            </div>

            {/* ── CARDS ── */}
            <div className="grid gap-4 md:grid-cols-3">
                {/* Total em Alerta */}
                <div className="card-stat">
                    <div className="flex items-start justify-between mb-3">
                        <span className="stat-label">Total em Alerta</span>
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: 'rgba(239,68,68,.15)', color: '#ef4444' }}>
                            <i className="bi bi-exclamation-triangle-fill text-lg" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-red-400">{alertas.length}</div>
                </div>

                {/* Sem Estoque */}
                <div className="card-stat">
                    <div className="flex items-start justify-between mb-3">
                        <span className="stat-label">Sem Estoque</span>
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: 'rgba(100,116,139,.15)', color: '#94a3b8' }}>
                            <i className="bi bi-x-circle-fill text-lg" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-slate-300">{semEstoque.length}</div>
                </div>

                {/* Críticos */}
                <div className="card-stat">
                    <div className="flex items-start justify-between mb-3">
                        <span className="stat-label">Críticos</span>
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: 'rgba(245,158,11,.15)', color: '#f59e0b' }}>
                            <i className="bi bi-dash-circle-fill text-lg" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-amber-400">{criticos.length}</div>
                </div>
            </div>

            {/* ── CONTEÚDO ── */}
            {alertas.length === 0 ? (
                <div className="rounded-2xl border border-border bg-card py-16 text-center">
                    <i className="bi bi-check-circle-fill text-emerald-400" style={{ fontSize: '3rem' }} />
                    <h4 className="mt-4 text-xl font-bold text-white">Estoque saudável!</h4>
                    <p className="mt-1 text-sm text-slate-400">Todos os produtos estão dentro dos limites mínimos configurados.</p>
                    <Link
                        to="/produtos"
                        className="mt-4 inline-flex items-center gap-2 rounded-lg border border-primary/40 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/10"
                    >
                        <i className="bi bi-box-seam" /> Ver Produtos
                    </Link>
                </div>
            ) : (
                <Table title="Produtos que precisam de reposição" titleIcon="bi-bell-fill text-red-400">
                    <table className="min-w-full text-sm">
                        <thead>
                        <tr>
                            <th>Produto</th>
                            <th>SKU</th>
                            <th>Categoria</th>
                            <th>Fornecedor</th>
                            <th className="text-center">Estoque Atual</th>
                            <th className="text-center">Mínimo</th>
                            <th>Situação</th>
                            <th className="text-right">Ação</th>
                        </tr>
                        </thead>
                        <tbody>
                        {alertas.map((item) => {
                            const semEst = item.quantidadeEstoque === 0;
                            return (
                                <tr key={item.id}>
                                    <td className="font-medium text-white">{item.nome}</td>
                                    <td><code className="text-slate-400">{item.sku}</code></td>
                                    <td className="text-slate-400">{item.categoria?.nome || '—'}</td>
                                    <td className="text-slate-400">{item.fornecedor?.nome || '—'}</td>
                                    <td className={`text-center font-bold ${semEst ? 'text-red-400' : 'text-amber-400'}`}>
                                        {item.quantidadeEstoque} un
                                    </td>
                                    <td className="text-center text-slate-400">{item.quantidadeMinima} un</td>
                                    <td>
                                        {semEst
                                            ? <Badge variant="semestoque">Sem Estoque</Badge>
                                            : <Badge variant="critico">Crítico</Badge>
                                        }
                                    </td>
                                    <td className="text-right">
                                        <Link
                                            to="/movimentacoes"
                                            className="inline-flex items-center gap-1 rounded-lg bg-emerald-600/20 px-3 py-1.5 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-600/40"
                                        >
                                            <i className="bi bi-plus-circle" /> Entrada
                                        </Link>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </Table>
            )}
        </div>
    );
}