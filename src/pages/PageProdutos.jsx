import { useEffect, useMemo, useState } from 'react';
import Button from '../components/Button.jsx';
import Table from '../components/Table.jsx';
import StockBar from '../components/StockBar.jsx';
import Badge from '../components/Badge.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Drawer from '../components/Drawer.jsx';
import Input from '../components/Input.jsx';
import PdfButton from '../components/PdfButton.jsx';
import Breadcrumb from '../components/Breadcrumb.jsx';
import { produtoService } from '../services/produtoService.js';
import { categoriaService } from '../services/categoriaService.js';
import { fornecedorService } from '../services/fornecedorService.js';
import { empresaService } from '../services/empresaService.js';
import { formatCurrency } from '../utils/format.js';
import { getStockStatus } from '../utils/stock.js';
import { buildPdf, savePdf } from '../utils/pdf.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useFlash } from '../context/FlashContext.jsx';
import { movimentacaoService } from '../services/movimentacaoService.js';

const defaultForm = {
    sku: '',
    nome: '',
    descricao: '',
    marca: '',
    preco: '',
    quantidadeMinima: 0,
    quantidadeEstoque: 0,
    categoriaId: '',
    fornecedorId: '',
};

export default function PageProdutos() {
    const { user } = useAuth();
    const { addFlash } = useFlash();
    const isAdmin = user?.perfil === 'ADM' || user?.perfil === 'DONO';

    const [produtos, setProdutos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [fornecedores, setFornecedores] = useState([]);
    const [busca, setBusca] = useState('');
    const [categoriaFiltro, setCategoriaFiltro] = useState('');
    const [statusFiltro, setStatusFiltro] = useState('');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(defaultForm);
    const [empresa, setEmpresa] = useState(null);
    const [movimentacoes, setMovimentacoes] = useState([]);
    const [modalPdfOpen, setModalPdfOpen] = useState(false);
    const [filtroStatusPdf, setFiltroStatusPdf] = useState('todos');
    const [filtrosCatPdf, setFiltrosCatPdf] = useState([]);
    const [filtrosFornPdf, setFiltrosFornPdf] = useState([]);


    const carregar = async () => {
        const [prodRes, catRes, fornRes, empRes, movRes] = await Promise.all([
            produtoService.listar(),
            categoriaService.listar(),
            fornecedorService.listar(),
            empresaService.obter(),
            movimentacaoService.listar(),
        ]);
        setProdutos(prodRes.data || []);
        setCategorias(catRes.data || []);
        setFornecedores(fornRes.data || []);
        setEmpresa(empRes.data || null);
        setMovimentacoes(movRes.data || []);
    };

    useEffect(() => { carregar(); }, []);

    const abrirNovo = () => {
        setEditing(null);
        setForm(defaultForm);
        setDrawerOpen(true);
    };

    const abrirEdicao = (produto) => {
        setEditing(produto);
        setForm({
            sku: produto.sku,
            nome: produto.nome,
            descricao: produto.descricao || '',
            marca: produto.marca || '',
            preco: produto.preco,
            quantidadeMinima: produto.quantidadeMinima,
            quantidadeEstoque: produto.quantidadeEstoque,
            categoriaId: produto.categoria?.id || '',
            fornecedorId: produto.fornecedor?.id || '',
        });
        setDrawerOpen(true);
    };

    const salvarProduto = async (event) => {
        event.preventDefault();
        const payload = {
            ...form,
            preco: Number(form.preco || 0),
            quantidadeMinima: Number(form.quantidadeMinima || 0),
            quantidadeEstoque: Number(form.quantidadeEstoque || 0),
            categoriaId: form.categoriaId ? Number(form.categoriaId) : null,
            fornecedorId: form.fornecedorId ? Number(form.fornecedorId) : null,
        };
        if (editing) {
            await produtoService.atualizar(editing.id, payload);
            addFlash('success', 'Produto atualizado com sucesso.');
        } else {
            await produtoService.salvar(payload);
            addFlash('success', 'Produto cadastrado com sucesso.');
        }
        setDrawerOpen(false);
        carregar();
    };

    const excluirProduto = async (id) => {
        if (!window.confirm('Remover este produto?')) return;
        await produtoService.excluir(id);
        addFlash('success', 'Produto removido.');
        carregar();
    };

    const abrirModalPdf = () => {
        setFiltroStatusPdf('todos');
        setFiltrosCatPdf([]);
        setFiltrosFornPdf([]);
        setModalPdfOpen(true);
    };

    const exportarPdf = () => {
        const agora = new Date();
        const trintaDiasAtras = new Date(agora.getTime() - 30 * 24 * 60 * 60 * 1000);

        const dados = produtos.filter((item) => {
            const estoque = item.quantidadeEstoque ?? 0;
            const minimo = item.quantidadeMinima ?? 0;
            if (filtroStatusPdf === 'normal' && !(estoque > minimo)) return false;
            if (filtroStatusPdf === 'alerta' && !(estoque <= minimo && estoque > 0)) return false;
            if (filtroStatusPdf === 'semestoque' && estoque !== 0) return false;
            if (filtrosCatPdf.length > 0 && !filtrosCatPdf.includes(String(item.categoria?.id))) return false;
            if (filtrosFornPdf.length > 0 && !filtrosFornPdf.includes(String(item.fornecedor?.id))) return false;
            return true;
        });

        const columns = ['SKU', 'Produto', 'Categoria', 'Fornecedor', 'Estoque', 'Mínimo', 'Preço Unit.', 'Status', 'Valor Vendido 30d'];
        const rows = dados.map((item) => {
            const estoque = item.quantidadeEstoque ?? 0;
            const minimo = item.quantidadeMinima ?? 0;
            const status = estoque === 0 ? 'Sem Estoque' : estoque <= minimo ? 'Crítico' : estoque <= minimo * 1.5 ? 'Atenção' : 'Normal';
            const vendido30d = movimentacoes
                .filter((mov) => {
                    const dataMov = new Date(mov.dataMovimentacao);
                    return mov.produto?.id === item.id && mov.tipo === 'SAIDA' && dataMov >= trintaDiasAtras;
                })
                .reduce((acc, mov) => acc + (mov.quantidade * Number(item.preco || 0)), 0);
            return [item.sku, item.nome, item.categoria?.nome || '—', item.fornecedor?.nome || '—', `${estoque} un`, `${minimo} un`, formatCurrency(item.preco), status, formatCurrency(vendido30d)];
        });

        const doc = buildPdf({ title: 'Relatório de Produtos', columns, rows, empresa });
        savePdf(doc, 'relatorio_produtos');
        setModalPdfOpen(false);
    };


    const filtrados = useMemo(() => {
        return produtos.filter((item) => {
            const termo = busca.toLowerCase();
            const matchTermo = !termo || item.nome.toLowerCase().includes(termo) || item.sku.toLowerCase().includes(termo);
            const matchCategoria = !categoriaFiltro || item.categoria?.nome === categoriaFiltro;
            const status = getStockStatus(item.quantidadeEstoque, item.quantidadeMinima);
            const matchStatus = !statusFiltro || status === statusFiltro;
            return matchTermo && matchCategoria && matchStatus;
        });
    }, [busca, categoriaFiltro, statusFiltro, produtos]);

    return (
        <div className="space-y-6">
            {modalPdfOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60">
                    <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
                        <div>
                            <h3 className="text-lg font-bold text-white">Exportar PDF</h3>
                            <p className="text-xs text-slate-400">Filtre os produtos para exportar.</p>
                        </div>

                        {/* Status */}
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-300">Status do Estoque</label>
                            <select
                                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-slate-100"
                                value={filtroStatusPdf}
                                onChange={(e) => setFiltroStatusPdf(e.target.value)}
                            >
                                <option value="todos">Todos</option>
                                <option value="normal">Somente Normal</option>
                                <option value="alerta">Somente em Alerta/Crítico</option>
                                <option value="semestoque">Somente Sem Estoque</option>
                            </select>
                        </div>

                        {/* Categorias */}
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-300">
                                Categorias <span className="text-slate-500">(deixe em branco para todas)</span>
                            </label>
                            <div className="max-h-32 overflow-y-auto space-y-1 rounded-xl border border-border bg-background p-2">
                                {categorias.map((cat) => (
                                    <label key={cat.id} className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer hover:text-white px-1">
                                        <input
                                            type="checkbox"
                                            checked={filtrosCatPdf.includes(String(cat.id))}
                                            onChange={(e) => {
                                                if (e.target.checked) setFiltrosCatPdf([...filtrosCatPdf, String(cat.id)]);
                                                else setFiltrosCatPdf(filtrosCatPdf.filter((id) => id !== String(cat.id)));
                                            }}
                                            className="h-4 w-4 rounded border-border bg-background text-primary"
                                        />
                                        {cat.nome}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Fornecedores */}
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-300">
                                Fornecedores <span className="text-slate-500">(deixe em branco para todos)</span>
                            </label>
                            <div className="max-h-32 overflow-y-auto space-y-1 rounded-xl border border-border bg-background p-2">
                                {fornecedores.map((forn) => (
                                    <label key={forn.id} className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer hover:text-white px-1">
                                        <input
                                            type="checkbox"
                                            checked={filtrosFornPdf.includes(String(forn.id))}
                                            onChange={(e) => {
                                                if (e.target.checked) setFiltrosFornPdf([...filtrosFornPdf, String(forn.id)]);
                                                else setFiltrosFornPdf(filtrosFornPdf.filter((id) => id !== String(forn.id)));
                                            }}
                                            className="h-4 w-4 rounded border-border bg-background text-primary"
                                        />
                                        {forn.nome}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-2 pt-1">
                            <button onClick={exportarPdf} className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90">
                                <i className="bi bi-file-earmark-pdf" /> Exportar
                            </button>
                            <button onClick={() => setModalPdfOpen(false)} className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-slate-300 hover:bg-slate-800">
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <Breadcrumb items={[{ label: 'Produtos', to: '/produtos' }]} />

            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white">Produtos</h2>
                    <p className="text-sm text-slate-400">{produtos.length} produto(s) cadastrado(s)</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <PdfButton onClick={abrirModalPdf} />
                    {isAdmin && (
                        <Button onClick={abrirNovo}>
                            <i className="bi bi-plus-lg" />
                            Novo Produto
                        </Button>
                    )}
                </div>
            </div>

            {/* ── FILTROS ── */}
            <div className="grid items-end gap-4 md:grid-cols-3">
                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">Busca</label>
                    <Input
                        id="busca-produto"
                        placeholder="Buscar por nome ou SKU..."
                        value={busca}
                        onChange={(event) => setBusca(event.target.value)}
                        icon="bi-search"
                    />
                </div>
                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">Categoria</label>
                    <select
                        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-slate-100"
                        value={categoriaFiltro}
                        onChange={(event) => setCategoriaFiltro(event.target.value)}
                    >
                        <option value="">Todas as categorias</option>
                        {categorias.map((cat) => (
                            <option key={cat.id} value={cat.nome}>{cat.nome}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">Status</label>
                    <select
                        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-slate-100"
                        value={statusFiltro}
                        onChange={(event) => setStatusFiltro(event.target.value)}
                    >
                        <option value="">Todos os status</option>
                        <option value="Normal">Normal</option>
                        <option value="Atenção">Atenção</option>
                        <option value="Crítico">Crítico</option>
                        <option value="Sem Estoque">Sem Estoque</option>
                    </select>
                </div>
            </div>

            <Table>
                <table className="min-w-full text-sm">
                    <thead>
                    <tr>
                        <th>SKU</th>
                        <th>Produto</th>
                        <th>Categoria</th>
                        <th>Fornecedor</th>
                        <th>Estoque</th>
                        {isAdmin && <th>Preço</th>}
                        <th>Status</th>
                        {isAdmin && <th className="text-right">Ações</th>}
                    </tr>
                    </thead>
                    <tbody>
                    {filtrados.length === 0 ? (
                        <tr>
                            <td colSpan={isAdmin ? 8 : 6}>
                                <EmptyState
                                    title="Nenhum produto cadastrado"
                                    description="Cadastre o primeiro produto para iniciar o controle de estoque."
                                    action={isAdmin ? (
                                        <Button onClick={abrirNovo}>
                                            <i className="bi bi-plus-lg" /> Novo Produto
                                        </Button>
                                    ) : null}
                                />
                            </td>
                        </tr>
                    ) : (
                        filtrados.map((produto) => {
                            const status = getStockStatus(produto.quantidadeEstoque, produto.quantidadeMinima);
                            const statusVariant =
                                status === 'Sem Estoque' ? 'semestoque'
                                    : status === 'Crítico' ? 'critico'
                                        : status === 'Atenção' ? 'atencao'
                                            : 'normal';
                            return (
                                <tr key={produto.id}>
                                    <td className="text-slate-400">{produto.sku}</td>
                                    <td className="font-medium text-white">{produto.nome}</td>
                                    <td className="text-slate-400">{produto.categoria?.nome || '-'}</td>
                                    <td className="text-slate-400">{produto.fornecedor?.nome || '-'}</td>
                                    <td className="min-w-[160px]">
                                        <StockBar quantity={produto.quantidadeEstoque} minQuantity={produto.quantidadeMinima} />
                                    </td>
                                    {isAdmin && <td className="text-white">{formatCurrency(produto.preco)}</td>}
                                    <td><Badge variant={statusVariant}>{status}</Badge></td>
                                    {isAdmin && (
                                        <td className="text-right">
                                            <button
                                                className="mr-2 rounded-lg border border-primary/40 px-2 py-1 text-xs text-primary hover:bg-primary/10"
                                                onClick={() => abrirEdicao(produto)}
                                            >
                                                <i className="bi bi-pencil" />
                                            </button>
                                            <button
                                                className="rounded-lg border border-red-500/40 px-2 py-1 text-xs text-red-300 hover:bg-red-500/10"
                                                onClick={() => excluirProduto(produto.id)}
                                            >
                                                <i className="bi bi-trash" />
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            );
                        })
                    )}
                    </tbody>
                </table>
            </Table>

            <Drawer open={drawerOpen} title={editing ? 'Editar Produto' : 'Novo Produto'} onClose={() => setDrawerOpen(false)}>
                <form className="space-y-4" onSubmit={salvarProduto}>
                    <Input id="sku" label="SKU" placeholder="Ex: ELT-001" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} required />
                    <Input id="nome" label="Nome" placeholder="Nome do produto" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
                    <Input id="descricao" label="Descrição" placeholder="Descrição breve" value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} />
                    <Input id="marca" label="Marca" placeholder="Marca" value={form.marca} onChange={(e) => setForm({ ...form, marca: e.target.value })} />
                    <Input id="preco" label="Preço (R$)" type="number" value={form.preco} onChange={(e) => setForm({ ...form, preco: e.target.value })} required />
                    <Input id="quantidadeMinima" label="Qtd. Mínima" type="number" value={form.quantidadeMinima} onChange={(e) => setForm({ ...form, quantidadeMinima: e.target.value })} required />
                    {!editing ? (
                        <Input id="quantidadeEstoque" label="Estoque Inicial" type="number" value={form.quantidadeEstoque} onChange={(e) => setForm({ ...form, quantidadeEstoque: e.target.value })} />
                    ) : (
                        <div className="rounded-xl border border-border bg-slate-900/40 px-4 py-3 text-sm text-slate-300">
                            Estoque atual: <strong className="text-white">{form.quantidadeEstoque}</strong> unidades
                        </div>
                    )}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-300">Categoria</label>
                        <select className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-slate-100" value={form.categoriaId} onChange={(e) => setForm({ ...form, categoriaId: e.target.value })} required>
                            <option value="">Selecione...</option>
                            {categorias.map((cat) => <option key={cat.id} value={cat.id}>{cat.nome}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-300">Fornecedor</label>
                        <select className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-slate-100" value={form.fornecedorId} onChange={(e) => setForm({ ...form, fornecedorId: e.target.value })}>
                            <option value="">Nenhum</option>
                            {fornecedores.map((forn) => <option key={forn.id} value={forn.id}>{forn.nome}</option>)}
                        </select>
                    </div>
                    <div className="flex gap-2 pt-2">
                        <Button type="submit" className="flex-1"><i className="bi bi-check-lg" /> Salvar</Button>
                        <Button type="button" variant="outline" className="flex-1" onClick={() => setDrawerOpen(false)}>Cancelar</Button>
                    </div>
                </form>
            </Drawer>
        </div>
    );
}