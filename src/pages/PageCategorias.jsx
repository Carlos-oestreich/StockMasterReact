import { useEffect, useMemo, useState } from 'react';
import Button from '../components/Button.jsx';
import Input from '../components/Input.jsx';
import Table from '../components/Table.jsx';
import Badge from '../components/Badge.jsx';
import Drawer from '../components/Drawer.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Breadcrumb from '../components/Breadcrumb.jsx';
import { categoriaService } from '../services/categoriaService.js';
import { useFlash } from '../context/FlashContext.jsx';
import PdfButton from '../components/PdfButton.jsx';
import { empresaService } from '../services/empresaService.js';
import { buildPdf, savePdf } from '../utils/pdf.js';

const defaultForm = { nome: '', descricao: '', setor: '', codigoInterno: '', ativo: true };

export default function PageCategorias() {
    const { addFlash } = useFlash();
    const [categorias, setCategorias] = useState([]);
    const [busca, setBusca] = useState('');
    const [form, setForm] = useState(defaultForm);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [empresa, setEmpresa] = useState(null);
    const [modalPdfOpen, setModalPdfOpen] = useState(false);
    const [filtroStatusPdf, setFiltroStatusPdf] = useState('todos');

    const carregar = async () => {
        const [catRes, empRes] = await Promise.all([
            categoriaService.listar(),
            empresaService.obter(),
        ]);
        setCategorias(catRes || []);
        setEmpresa(empRes || null);
    };

    const abrirModalPdf = () => {
        setFiltroStatusPdf('todos');
        setModalPdfOpen(true);
    };

    const exportarPdf = () => {
        const dados = filtradas.filter((cat) => {
            if (filtroStatusPdf === 'ativos') return cat.ativo;
            if (filtroStatusPdf === 'inativos') return !cat.ativo;
            return true;
        });
        const columns = ['ID', 'Nome', 'Setor', 'Código Interno', 'Status'];
        const rows = dados.map((cat) => [cat.id, cat.nome, cat.setor || '—', cat.codigoInterno || '—', cat.ativo ? 'Ativo' : 'Inativo']);
        const doc = buildPdf({ title: 'Relatório de Categorias', columns, rows, empresa });
        savePdf(doc, 'relatorio_categorias');
        setModalPdfOpen(false);
    };

    useEffect(() => { carregar(); }, []);

    const abrirNovo = () => { setEditing(null); setForm(defaultForm); setDrawerOpen(true); };
    const abrirEdicao = (cat) => {
        setEditing(cat);
        setForm({ nome: cat.nome, descricao: cat.descricao || '', setor: cat.setor || '', codigoInterno: cat.codigoInterno || '', ativo: cat.ativo });
        setDrawerOpen(true);
    };

    const salvarCategoria = async (event) => {
        event.preventDefault();
        if (editing) {
            await categoriaService.atualizar(editing.id, form);
            addFlash('success', 'Categoria atualizada com sucesso.');
        } else {
            await categoriaService.salvar(form);
            addFlash('success', 'Categoria salva com sucesso.');
        }
        setDrawerOpen(false);
        carregar();
    };

    const excluirCategoria = async (id) => {
        if (!window.confirm('Remover esta categoria?')) return;
        await categoriaService.excluir(id);
        addFlash('success', 'Categoria removida.');
        carregar();
    };

    const filtradas = useMemo(() => {
        const termo = busca.toLowerCase();
        return categorias.filter((cat) => `${cat.nome} ${cat.setor}`.toLowerCase().includes(termo));
    }, [busca, categorias]);

    return (
        <div className="space-y-6">
            {modalPdfOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60">
                    <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl">
                        <h3 className="mb-1 text-lg font-bold text-white">Exportar PDF</h3>
                        <p className="mb-4 text-xs text-slate-400">Selecione quais categorias exportar.</p>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-300">Status</label>
                            <select
                                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-slate-100"
                                value={filtroStatusPdf}
                                onChange={(e) => setFiltroStatusPdf(e.target.value)}
                            >
                                <option value="todos">Todos</option>
                                <option value="ativos">Somente Ativos</option>
                                <option value="inativos">Somente Inativos</option>
                            </select>
                        </div>
                        <div className="mt-5 flex gap-2">
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
            <Breadcrumb items={[{ label: 'Categorias', to: '/categorias' }]} />

            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white">Categorias</h2>
                    <p className="text-sm text-slate-400">{categorias.length} categoria(s)</p>
                </div>
                <div className="flex items-center gap-2">
                    <PdfButton onClick={abrirModalPdf} />
                    <Button onClick={abrirNovo}>
                        <i className="bi bi-plus-lg" /> Nova Categoria
                    </Button>
                </div>
            </div>

            <div className="w-full max-w-xs">
                <Input id="busca-categoria" placeholder="Buscar categoria..." value={busca} onChange={(e) => setBusca(e.target.value)} icon="bi-search" />
            </div>

            <Table>
                <table className="min-w-full text-sm">
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Nome</th>
                        <th>Setor</th>
                        <th>Código Interno</th>
                        <th>Status</th>
                        <th className="text-right">Ações</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filtradas.length === 0 ? (
                        <tr><td colSpan={6}><EmptyState icon="bi-tags" title="Nenhuma categoria cadastrada" description="Inclua categorias para organizar os produtos." /></td></tr>
                    ) : filtradas.map((cat) => (
                        <tr key={cat.id}>
                            <td className="text-slate-400">{cat.id}</td>
                            <td className="font-medium text-white">{cat.nome}</td>
                            <td className="text-slate-400">{cat.setor || '—'}</td>
                            <td className="text-slate-400">{cat.codigoInterno || '—'}</td>
                            <td>{cat.ativo ? <Badge variant="normal">Ativo</Badge> : <Badge variant="semestoque">Inativo</Badge>}</td>
                            <td className="text-right">
                                <button className="mr-2 rounded-lg border border-primary/40 px-2 py-1 text-xs text-primary hover:bg-primary/10" onClick={() => abrirEdicao(cat)}>
                                    <i className="bi bi-pencil" />
                                </button>
                                <button className="rounded-lg border border-red-500/40 px-2 py-1 text-xs text-red-300 hover:bg-red-500/10" onClick={() => excluirCategoria(cat.id)}>
                                    <i className="bi bi-trash" />
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </Table>

            <Drawer open={drawerOpen} title={editing ? 'Editar Categoria' : 'Nova Categoria'} onClose={() => setDrawerOpen(false)}>
                <form onSubmit={salvarCategoria} className="space-y-4">
                    <Input id="cat-nome" label="Nome" placeholder="Ex: Eletrônicos" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
                    <Input id="cat-setor" label="Setor" placeholder="Ex: Tecnologia" value={form.setor} onChange={(e) => setForm({ ...form, setor: e.target.value })} />
                    <Input id="cat-codigo" label="Código Interno" placeholder="Ex: TEC-01" value={form.codigoInterno} onChange={(e) => setForm({ ...form, codigoInterno: e.target.value })} />
                    <Input id="cat-descricao" label="Descrição" placeholder="Descrição breve" value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} />
                    <label className="flex items-center gap-2 text-sm text-slate-300">
                        <input type="checkbox" checked={form.ativo} onChange={(e) => setForm({ ...form, ativo: e.target.checked })} className="h-4 w-4 rounded border-border bg-background text-primary" />
                        Categoria ativa
                    </label>
                    <div className="flex gap-2 pt-2">
                        <Button type="submit" className="flex-1"><i className="bi bi-check-lg" /> Salvar</Button>
                        <Button type="button" variant="outline" className="flex-1" onClick={() => setDrawerOpen(false)}>Cancelar</Button>
                    </div>
                </form>
            </Drawer>
        </div>
    );
}