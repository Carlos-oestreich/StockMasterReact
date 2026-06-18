import { useEffect, useMemo, useState } from 'react';
import Button from '../components/Button.jsx';
import Table from '../components/Table.jsx';
import Input from '../components/Input.jsx';
import Drawer from '../components/Drawer.jsx';
import EmptyState from '../components/EmptyState.jsx';
import PdfButton from '../components/PdfButton.jsx';
import Breadcrumb from '../components/Breadcrumb.jsx';
import { movimentacaoService } from '../services/movimentacaoService.js';
import { produtoService } from '../services/produtoService.js';
import { empresaService } from '../services/empresaService.js';
import { formatDateTime } from '../utils/format.js';
import { buildPdf, savePdf } from '../utils/pdf.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useFlash } from '../context/FlashContext.jsx';

const defaultForm = { produtoId: '', tipo: 'ENTRADA', quantidade: 1, observacao: '' };

const hoje = () => new Date().toISOString().slice(0, 10);
const trintaDiasAtras = () => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().slice(0, 10);
};

export default function PageMovimentacoes() {
    const { user } = useAuth();
    const { addFlash } = useFlash();

    const [movimentacoes, setMovimentacoes] = useState([]);
    const [produtos, setProdutos] = useState([]);
    const [empresa, setEmpresa] = useState(null);
    const [form, setForm] = useState(defaultForm);
    const [busca, setBusca] = useState('');
    const [tipoFiltro, setTipoFiltro] = useState('');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [modalPdfOpen, setModalPdfOpen] = useState(false);
    const [pdfDatas, setPdfDatas] = useState({ inicio: trintaDiasAtras(), fim: hoje() });
    const [erroPdf, setErroPdf] = useState('');

    const carregar = async () => {
        const [movRes, prodRes, empRes] = await Promise.all([
            movimentacaoService.listar(),
            produtoService.listar(),
            empresaService.obter(),
        ]);
        setMovimentacoes(movRes || []);
        setProdutos(prodRes || []);
        setEmpresa(empRes || null);
    };

    useEffect(() => { carregar(); }, []);

    const produtoSelecionado = produtos.find((p) => p.id === Number(form.produtoId));

    const abrirDrawer = () => { setForm(defaultForm); setDrawerOpen(true); };

    const salvarMovimentacao = async (event) => {
        event.preventDefault();
        if (!form.produtoId) { addFlash('danger', 'Selecione um produto.'); return; }
        if (form.tipo === 'SAIDA' && produtoSelecionado && form.quantidade > produtoSelecionado.quantidadeEstoque) {
            addFlash('danger', 'Saldo insuficiente para esta saída.'); return;
        }
        await movimentacaoService.salvar({
            tipo: form.tipo,
            quantidade: Number(form.quantidade || 0),
            observacao: form.observacao,
            dataMovimentacao: new Date(),
            produtoId: Number(form.produtoId),
            usuarioId: user?.id || 1,
        });
        addFlash('success', 'Movimentação registrada com sucesso.');
        setDrawerOpen(false);
        setForm(defaultForm);
        carregar();
    };

    const abrirModalPdf = () => {
        setPdfDatas({ inicio: trintaDiasAtras(), fim: hoje() });
        setErroPdf('');
        setModalPdfOpen(true);
    };

    const confirmarExportarPdf = () => {
        const inicio = new Date(pdfDatas.inicio);
        const fim = new Date(pdfDatas.fim);
        const diffDias = (fim - inicio) / (1000 * 60 * 60 * 24);

        if (fim < inicio) { setErroPdf('A data final deve ser maior que a inicial.'); return; }
        if (diffDias > 30) { setErroPdf('O período máximo é de 30 dias.'); return; }

        const movFiltradas = movimentacoes.filter((mov) => {
            const data = new Date(mov.dataMovimentacao);
            const inicioLocal = new Date(pdfDatas.inicio + 'T00:00:00');
            const fimLocal = new Date(pdfDatas.fim + 'T23:59:59');
            return data >= inicioLocal && data <= fimLocal;
        });

        const columns = ['Data', 'Tipo', 'Produto', 'Operador', 'Qtd', 'Saldo Ant.', 'Saldo Atual', 'Observação'];
        const rows = movFiltradas
            .sort((a, b) => new Date(b.dataMovimentacao) - new Date(a.dataMovimentacao))
            .map((mov) => [
                formatDateTime(mov.dataMovimentacao),
                mov.tipo,
                mov.produto?.nome || '—',
                mov.usuario?.nome || '—',
                (mov.tipo === 'ENTRADA' ? '+' : '-') + mov.quantidade,
                mov.saldoAnterior ?? '—',
                mov.saldoAtual ?? '—',
                mov.observacao || '—',
            ]);

        const doc = buildPdf({
            title: `Movimentações — ${pdfDatas.inicio} a ${pdfDatas.fim}`,
            columns,
            rows,
            empresa,
        });
        savePdf(doc, 'relatorio_movimentacoes');
        setModalPdfOpen(false);
    };

    const filtradas = useMemo(() => {
        return movimentacoes
            .filter((mov) => {
                const termo = busca.toLowerCase();
                const matchTermo = !termo || mov.produto?.nome?.toLowerCase().includes(termo) || mov.produto?.sku?.toLowerCase().includes(termo);
                const matchTipo = !tipoFiltro || mov.tipo === tipoFiltro;
                return matchTermo && matchTipo;
            })
            .sort((a, b) => new Date(b.dataMovimentacao) - new Date(a.dataMovimentacao));
    }, [busca, tipoFiltro, movimentacoes]);

    return (
        <div className="space-y-6">
            <Breadcrumb items={[{ label: 'Movimentações', to: '/movimentacoes' }]} />

            {/* ── MODAL PDF ── */}
            {modalPdfOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60">
                    <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl">
                        <h3 className="mb-1 text-lg font-bold text-white">Exportar PDF</h3>
                        <p className="mb-4 text-xs text-slate-400">Selecione o período (máximo 30 dias).</p>

                        <div className="space-y-3">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-300">Data Início</label>
                                <input
                                    type="date"
                                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-slate-100"
                                    value={pdfDatas.inicio}
                                    max={hoje()}
                                    onChange={(e) => { setPdfDatas({ ...pdfDatas, inicio: e.target.value }); setErroPdf(''); }}
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-300">Data Fim</label>
                                <input
                                    type="date"
                                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-slate-100"
                                    value={pdfDatas.fim}
                                    max={hoje()}
                                    onChange={(e) => { setPdfDatas({ ...pdfDatas, fim: e.target.value }); setErroPdf(''); }}
                                />
                            </div>
                            {erroPdf && (
                                <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                                    <i className="bi bi-exclamation-circle me-1" />{erroPdf}
                                </p>
                            )}
                        </div>

                        <div className="mt-5 flex gap-2">
                            <button
                                onClick={confirmarExportarPdf}
                                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
                            >
                                <i className="bi bi-file-earmark-pdf" /> Exportar
                            </button>
                            <button
                                onClick={() => setModalPdfOpen(false)}
                                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── CABEÇALHO ── */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white">Movimentações</h2>
                    <p className="text-sm text-slate-400">{filtradas.length} registro(s)</p>
                </div>
                <div className="flex items-center gap-2">
                    <PdfButton onClick={abrirModalPdf} />
                    <Button onClick={abrirDrawer}>
                        <i className="bi bi-plus-lg" /> Nova Movimentação
                    </Button>
                </div>
            </div>

            {/* ── FILTROS ── */}
            <div className="grid items-end gap-4 md:grid-cols-2">
                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">Busca</label>
                    <Input id="busca-mov" placeholder="Buscar produto ou SKU..." value={busca} onChange={(e) => setBusca(e.target.value)} icon="bi-search" />
                </div>
                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">Tipo</label>
                    <select className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-slate-100" value={tipoFiltro} onChange={(e) => setTipoFiltro(e.target.value)}>
                        <option value="">Todos os Tipos</option>
                        <option value="ENTRADA">Entrada</option>
                        <option value="SAIDA">Saída</option>
                    </select>
                </div>
            </div>

            {/* ── TABELA ── */}
            <Table title="Histórico de movimentações">
                <table className="min-w-full text-sm">
                    <thead>
                    <tr>
                        <th>Data</th>
                        <th>Tipo</th>
                        <th>Produto</th>
                        <th>Operador</th>
                        <th className="text-center">Qtd</th>
                        <th className="text-center">Saldo Ant.</th>
                        <th className="text-center">Saldo Atual</th>
                        <th>Observação</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filtradas.length === 0 ? (
                        <tr><td colSpan={8}><EmptyState icon="bi-arrow-left-right" title="Nenhuma movimentação registrada" description="Registre entradas e saídas para ver o histórico." /></td></tr>
                    ) : filtradas.map((mov) => (
                        <tr key={mov.id}>
                            <td className="text-slate-400 whitespace-nowrap">{formatDateTime(mov.dataMovimentacao)}</td>
                            <td>
                                {mov.tipo === 'ENTRADA' ? (
                                    <span className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-semibold" style={{ background: 'rgba(16,185,129,.2)', color: '#10b981' }}>
                                            <i className="bi bi-arrow-down-circle" /> ENTRADA
                                        </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-semibold" style={{ background: 'rgba(239,68,68,.2)', color: '#ef4444' }}>
                                            <i className="bi bi-arrow-up-circle" /> SAÍDA
                                        </span>
                                )}
                            </td>
                            <td className="font-medium text-white">{mov.produto?.nome || '—'}</td>
                            <td className="text-slate-400">{mov.usuario?.nome || '—'}</td>
                            <td className={`text-center font-bold font-mono ${mov.tipo === 'ENTRADA' ? 'text-emerald-400' : 'text-red-400'}`}>
                                {mov.tipo === 'ENTRADA' ? '+' : '-'}{mov.quantidade}
                            </td>
                            <td className="text-center font-mono text-slate-400">{mov.saldoAnterior ?? '—'}</td>
                            <td className="text-center font-mono text-white">{mov.saldoAtual ?? '—'}</td>
                            <td className="text-slate-400 max-w-[200px] truncate">{mov.observacao || '—'}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </Table>

            {/* ── DRAWER ── */}
            <Drawer open={drawerOpen} title="Nova Movimentação" onClose={() => setDrawerOpen(false)}>
                <form onSubmit={salvarMovimentacao} className="space-y-4">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-300">Produto</label>
                        <select className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-slate-100" value={form.produtoId} onChange={(e) => setForm({ ...form, produtoId: e.target.value })} required>
                            <option value="">Selecione...</option>
                            {produtos.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
                        </select>
                    </div>
                    {produtoSelecionado && (
                        <div className="rounded-xl border border-border bg-slate-900/40 p-4 text-xs text-slate-400">
                            <p className="text-sm font-semibold text-white">{produtoSelecionado.nome}</p>
                            <p>Estoque atual: {produtoSelecionado.quantidadeEstoque} un</p>
                            <p>Mínimo: {produtoSelecionado.quantidadeMinima} un</p>
                        </div>
                    )}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-300">Tipo</label>
                        <select className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-slate-100" value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })}>
                            <option value="ENTRADA">Entrada (+)</option>
                            <option value="SAIDA">Saída (-)</option>
                        </select>
                    </div>
                    <Input id="quantidade" label="Quantidade" type="number" value={form.quantidade} onChange={(e) => setForm({ ...form, quantidade: e.target.value })} required />
                    <Input id="observacao" label="Observação" placeholder="Detalhe opcional" value={form.observacao} onChange={(e) => setForm({ ...form, observacao: e.target.value })} />
                    <div className="flex gap-2 pt-2">
                        <Button type="submit" className="flex-1"><i className="bi bi-check-lg" /> Confirmar</Button>
                        <Button type="button" variant="outline" className="flex-1" onClick={() => setDrawerOpen(false)}>Cancelar</Button>
                    </div>
                </form>
            </Drawer>
        </div>
    );
}