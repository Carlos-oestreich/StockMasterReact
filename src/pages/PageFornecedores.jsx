import { useEffect, useMemo, useState } from 'react';
import Button from '../components/Button.jsx';
import Input from '../components/Input.jsx';
import Table from '../components/Table.jsx';
import Badge from '../components/Badge.jsx';
import Drawer from '../components/Drawer.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Breadcrumb from '../components/Breadcrumb.jsx';
import { fornecedorService } from '../services/fornecedorService.js';
import { useFlash } from '../context/FlashContext.jsx';
import { maskCnpj, maskPhone } from '../utils/masks.js';
import PdfButton from '../components/PdfButton.jsx';
import { empresaService } from '../services/empresaService.js';
import { buildPdf, savePdf } from '../utils/pdf.js';

const defaultForm = { nome: '', cnpj: '', email: '', telefone: '', ativo: true };

export default function PageFornecedores() {
    const { addFlash } = useFlash();
    const [fornecedores, setFornecedores] = useState([]);
    const [busca, setBusca] = useState('');
    const [form, setForm] = useState(defaultForm);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [empresa, setEmpresa] = useState(null);
    const [modalPdfOpen, setModalPdfOpen] = useState(false);
    const [filtroStatusPdf, setFiltroStatusPdf] = useState('todos');

    const carregar = async () => {
        const [fornRes, empRes] = await Promise.all([
            fornecedorService.listar(),
            empresaService.obter(),
        ]);
        setFornecedores(fornRes.data || []);
        setEmpresa(empRes.data || null);
    };


    useEffect(() => { carregar(); }, []);

    const abrirModalPdf = () => {
        setFiltroStatusPdf('todos');
        setModalPdfOpen(true);
    };

    const exportarPdf = () => {
        const dados = filtrados.filter((item) => {
            if (filtroStatusPdf === 'ativos') return item.ativo;
            if (filtroStatusPdf === 'inativos') return !item.ativo;
            return true;
        });
        const columns = ['ID', 'Nome', 'CNPJ', 'E-mail', 'Telefone', 'Status'];
        const rows = dados.map((item) => [item.id, item.nome, item.cnpj || '—', item.email || '—', item.telefone || '—', item.ativo ? 'Ativo' : 'Inativo']);
        const doc = buildPdf({ title: 'Relatório de Fornecedores', columns, rows, empresa });
        savePdf(doc, 'relatorio_fornecedores');
        setModalPdfOpen(false);
    };

    const abrirNovo = () => { setEditing(null); setForm(defaultForm); setDrawerOpen(true); };
    const abrirEdicao = (item) => {
        setEditing(item);
        setForm({ nome: item.nome, cnpj: item.cnpj || '', email: item.email || '', telefone: item.telefone || '', ativo: item.ativo });
        setDrawerOpen(true);
    };

    const salvarFornecedor = async (event) => {
        event.preventDefault();
        if (editing) {
            await fornecedorService.atualizar(editing.id, form);
            addFlash('success', 'Fornecedor atualizado com sucesso.');
        } else {
            await fornecedorService.salvar(form);
            addFlash('success', 'Fornecedor salvo com sucesso.');
        }
        setDrawerOpen(false);
        carregar();
    };

    const excluirFornecedor = async (id) => {
        if (!window.confirm('Remover este fornecedor?')) return;
        await fornecedorService.excluir(id);
        addFlash('success', 'Fornecedor removido.');
        carregar();
    };

    const filtrados = useMemo(() => {
        const termo = busca.toLowerCase();
        return fornecedores.filter((item) => `${item.nome} ${item.cnpj}`.toLowerCase().includes(termo));
    }, [busca, fornecedores]);

    return (
        <div className="space-y-6">
            {modalPdfOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60">
                    <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl">
                        <h3 className="mb-1 text-lg font-bold text-white">Exportar PDF</h3>
                        <p className="mb-4 text-xs text-slate-400">Selecione quais fornecedores exportar.</p>
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
                            <button onClick={abrirModalPdf} className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90">
                                <i className="bi bi-file-earmark-pdf" /> Exportar
                            </button>
                            <button onClick={() => setModalPdfOpen(false)} className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-slate-300 hover:bg-slate-800">
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <Breadcrumb items={[{ label: 'Fornecedores', to: '/fornecedores' }]} />

            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white">Fornecedores</h2>
                    <p className="text-sm text-slate-400">{fornecedores.length} fornecedor(es)</p>
                </div>
                <div className="flex items-center gap-2">
                    <PdfButton onClick={exportarPdf} />
                    <Button onClick={abrirNovo}>
                        <i className="bi bi-plus-lg" /> Novo Fornecedor
                    </Button>
                </div>
            </div>

            <div className="w-full max-w-xs">
                <Input id="busca-fornecedor" placeholder="Buscar fornecedor..." value={busca} onChange={(e) => setBusca(e.target.value)} icon="bi-search" />
            </div>

            <Table>
                <table className="min-w-full text-sm">
                    <thead>
                    <tr>
                        <th>Nome</th>
                        <th>CNPJ</th>
                        <th>E-mail</th>
                        <th>Telefone</th>
                        <th>Status</th>
                        <th className="text-right">Ações</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filtrados.length === 0 ? (
                        <tr><td colSpan={6}><EmptyState icon="bi-truck" title="Nenhum fornecedor cadastrado" description="Inclua fornecedores para vincular aos produtos." /></td></tr>
                    ) : filtrados.map((item) => (
                        <tr key={item.id}>
                            <td className="font-medium text-white">{item.nome}</td>
                            <td className="text-slate-400">{item.cnpj || '—'}</td>
                            <td className="text-slate-400">{item.email || '—'}</td>
                            <td className="text-slate-400">{item.telefone || '—'}</td>
                            <td>{item.ativo ? <Badge variant="normal">Ativo</Badge> : <Badge variant="semestoque">Inativo</Badge>}</td>
                            <td className="text-right">
                                <button className="mr-2 rounded-lg border border-primary/40 px-2 py-1 text-xs text-primary hover:bg-primary/10" onClick={() => abrirEdicao(item)}>
                                    <i className="bi bi-pencil" />
                                </button>
                                <button className="rounded-lg border border-red-500/40 px-2 py-1 text-xs text-red-300 hover:bg-red-500/10" onClick={() => excluirFornecedor(item.id)}>
                                    <i className="bi bi-trash" />
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </Table>

            <Drawer open={drawerOpen} title={editing ? 'Editar Fornecedor' : 'Novo Fornecedor'} onClose={() => setDrawerOpen(false)}>
                <form onSubmit={salvarFornecedor} className="space-y-4">
                    <Input id="forn-nome" label="Nome" placeholder="Fornecedor Alfa" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
                    <Input id="forn-cnpj" label="CNPJ" placeholder="00.000.000/0000-00" value={form.cnpj} onChange={(e) => setForm({ ...form, cnpj: maskCnpj(e.target.value) })} />
                    <Input id="forn-email" label="E-mail" type="email" placeholder="fornecedor@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    <Input id="forn-telefone" label="Telefone" placeholder="(00) 00000-0000" value={form.telefone} onChange={(e) => setForm({ ...form, telefone: maskPhone(e.target.value) })} />
                    <label className="flex items-center gap-2 text-sm text-slate-300">
                        <input type="checkbox" checked={form.ativo} onChange={(e) => setForm({ ...form, ativo: e.target.checked })} className="h-4 w-4 rounded border-border bg-background text-primary" />
                        Fornecedor ativo
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