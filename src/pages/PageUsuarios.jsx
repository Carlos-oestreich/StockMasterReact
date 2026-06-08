import { useEffect, useMemo, useState } from 'react';
import Button from '../components/Button.jsx';
import Input from '../components/Input.jsx';
import Table from '../components/Table.jsx';
import Badge from '../components/Badge.jsx';
import Drawer from '../components/Drawer.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Breadcrumb from '../components/Breadcrumb.jsx';
import { usuarioService } from '../services/usuarioService.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useFlash } from '../context/FlashContext.jsx';
import PdfButton from '../components/PdfButton.jsx';
import { empresaService } from '../services/empresaService.js';
import { buildPdf, savePdf } from '../utils/pdf.js';

const defaultForm = { nome: '', email: '', senha: '', perfil: 'OPERADOR', matricula: '', cpf: '', ativo: true };

export default function PageUsuarios() {
    const { user } = useAuth();
    const { addFlash } = useFlash();
    const [usuarios, setUsuarios] = useState([]);
    const [busca, setBusca] = useState('');
    const [form, setForm] = useState(defaultForm);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [empresa, setEmpresa] = useState(null);
    const [modalPdfOpen, setModalPdfOpen] = useState(false);
    const [filtroStatusPdf, setFiltroStatusPdf] = useState('todos');

    const carregar = async () => {
        const [usrRes, empRes] = await Promise.all([
            usuarioService.listar(),
            empresaService.obter(),
        ]);
        setUsuarios(usrRes.data || []);
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
        const columns = ['ID', 'Nome', 'E-mail', 'CPF', 'Perfil', 'Status'];
        const rows = dados.map((item) => [item.id, item.nome, item.email, item.cpf || '—', item.perfil, item.ativo ? 'Ativo' : 'Inativo']);
        const doc = buildPdf({ title: 'Relatório de Usuários', columns, rows, empresa });
        savePdf(doc, 'relatorio_usuarios');
        setModalPdfOpen(false);
    };

    const perfisDisponiveis = user?.perfil === 'DONO' ? ['ADM', 'OPERADOR'] : ['OPERADOR'];

    const abrirNovo = () => { setEditing(null); setForm(defaultForm); setDrawerOpen(true); };
    const abrirEdicao = (item) => {
        setEditing(item);
        setForm({ nome: item.nome, email: item.email, senha: '', perfil: item.perfil, matricula: item.matricula || '', cpf: item.cpf || '', ativo: item.ativo });
        setDrawerOpen(true);
    };

    const salvarUsuario = async (event) => {
        event.preventDefault();
        if (editing) {
            await usuarioService.atualizar(editing.id, form);
            addFlash('success', 'Usuário atualizado com sucesso.');
        } else {
            await usuarioService.salvar(form);
            addFlash('success', 'Usuário criado com sucesso.');
        }
        setDrawerOpen(false);
        carregar();
    };

    const excluirUsuario = async (usuarioId) => {
        if (usuarioId === user?.id) { addFlash('danger', 'Você não pode excluir o próprio usuário.'); return; }
        if (!window.confirm('Excluir este usuário?')) return;
        await usuarioService.excluir(usuarioId);
        addFlash('success', 'Usuário removido.');
        carregar();
    };

    const filtrados = useMemo(() => {
        const termo = busca.toLowerCase();
        return usuarios.filter((item) => `${item.nome} ${item.email}`.toLowerCase().includes(termo));
    }, [busca, usuarios]);

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
            <Breadcrumb items={[{ label: 'Usuários', to: '/usuarios' }]} />

            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white">Usuários do sistema</h2>
                    <p className="text-sm text-slate-400">{usuarios.length} usuário(s)</p>
                </div>
                <div className="flex items-center gap-2">
                    <PdfButton onClick={abrirModalPdf} />
                    <Button onClick={abrirNovo}>
                        <i className="bi bi-person-plus" /> Novo Usuário
                    </Button>
                </div>
            </div>

            <div className="w-full max-w-xs">
                <Input id="busca-usuario" placeholder="Buscar usuário..." value={busca} onChange={(e) => setBusca(e.target.value)} icon="bi-search" />
            </div>

            <Table>
                <table className="min-w-full text-sm">
                    <thead>
                    <tr>
                        <th>Nome</th>
                        <th>E-mail</th>
                        <th>CPF</th>
                        <th>Perfil</th>
                        <th>Status</th>
                        <th className="text-right">Ações</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filtrados.length === 0 ? (
                        <tr><td colSpan={6}><EmptyState icon="bi-people" title="Nenhum usuário cadastrado" description="Adicione usuários para liberar acessos ao estoque." /></td></tr>
                    ) : filtrados.map((item) => (
                        <tr key={item.id}>
                            <td className="font-medium text-white">{item.nome}</td>
                            <td className="text-slate-400">{item.email}</td>
                            <td className="text-slate-400">{item.cpf || '—'}</td>
                            <td><Badge variant="info">{item.perfil}</Badge></td>
                            <td>{item.ativo ? <Badge variant="normal">Ativo</Badge> : <Badge variant="semestoque">Inativo</Badge>}</td>
                            <td className="text-right">
                                <button className="mr-2 rounded-lg border border-primary/40 px-2 py-1 text-xs text-primary hover:bg-primary/10" onClick={() => abrirEdicao(item)}>
                                    <i className="bi bi-pencil" />
                                </button>
                                <button className="rounded-lg border border-red-500/40 px-2 py-1 text-xs text-red-300 hover:bg-red-500/10" onClick={() => excluirUsuario(item.id)}>
                                    <i className="bi bi-trash" />
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </Table>

            <Drawer open={drawerOpen} title={editing ? 'Editar Usuário' : 'Novo Usuário'} onClose={() => setDrawerOpen(false)}>
                <form onSubmit={salvarUsuario} className="space-y-4">
                    <Input id="usr-nome" label="Nome" placeholder="Nome completo" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
                    <Input id="usr-email" label="E-mail" type="email" placeholder="usuario@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                    <Input id="usr-cpf" label="CPF" placeholder="000.000.000-00" value={form.cpf} onChange={(e) => setForm({ ...form, cpf: e.target.value })} />
                    <Input id="usr-matricula" label="Matrícula" placeholder="OP-001" value={form.matricula} onChange={(e) => setForm({ ...form, matricula: e.target.value })} />
                    <Input id="usr-senha" label={editing ? 'Nova Senha (deixe em branco para manter)' : 'Senha'} type="password" placeholder="Mínimo 8 caracteres" value={form.senha} onChange={(e) => setForm({ ...form, senha: e.target.value })} required={!editing} />
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-300">Perfil</label>
                        <select className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-slate-100" value={form.perfil} onChange={(e) => setForm({ ...form, perfil: e.target.value })}>
                            {perfisDisponiveis.map((p) => <option key={p} value={p}>{p}</option>)}
                        </select>
                        {user?.perfil === 'ADM' && <p className="mt-1 text-xs text-slate-500">ADM só pode cadastrar operador.</p>}
                    </div>
                    <label className="flex items-center gap-2 text-sm text-slate-300">
                        <input type="checkbox" checked={form.ativo} onChange={(e) => setForm({ ...form, ativo: e.target.checked })} className="h-4 w-4 rounded border-border bg-background text-primary" />
                        Usuário ativo
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