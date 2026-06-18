import { useEffect, useState } from 'react';
import Button from '../components/Button.jsx';
import Input from '../components/Input.jsx';
import { empresaService } from '../services/empresaService.js';
import { usuarioService } from '../services/usuarioService.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useFlash } from '../context/FlashContext.jsx';
import api from '../services/api.js';

export default function PageConfiguracoes() {
    const { user } = useAuth();
    const { addFlash } = useFlash();

    const isDono = user?.perfil === 'DONO';
    const isAdmin = user?.perfil === 'ADM' || isDono;
    const iniciais = (user?.nome || 'U').slice(0, 1).toUpperCase();

    const [empresa, setEmpresa] = useState(null);
    const [editandoEmpresa, setEditandoEmpresa] = useState(false);
    const [editandoPerfil, setEditandoPerfil] = useState(false);

    const [formPerfil, setFormPerfil] = useState({
        nome: '',
        email: '',
        cpf: '',
        senhaAtual: '',
        novaSenha: '',
        confirmaSenha: '',
    });

    useEffect(() => {
        const carregar = async () => {
            const res = await empresaService.obter();
            setEmpresa(res || {});
        };
        carregar();
        setFormPerfil((prev) => ({
            ...prev,
            nome: user?.nome || '',
            email: user?.email || '',
            cpf: user?.cpf || '',
        }));
    }, [user]);

    const salvarEmpresa = async (event) => {
        event.preventDefault();
        if (!isDono) return;
        await empresaService.atualizar(empresa.id, {
            nome: empresa.nome,
            cnpj: empresa.cnpj,
            email: empresa.email,
            telefone: empresa.telefone,
            endereco: empresa.endereco,
            suporte: empresa.suporte,
        });
        addFlash('success', 'Dados da empresa atualizados.');
        setEditandoEmpresa(false);
    };

    const salvarPerfil = async (event) => {
        event.preventDefault();
        if (formPerfil.novaSenha && formPerfil.novaSenha !== formPerfil.confirmaSenha) {
            addFlash('danger', 'As senhas não coincidem.');
            return;
        }
        await usuarioService.atualizar(user.id, {
            nome: formPerfil.nome,
            email: formPerfil.email,
            senha: formPerfil.novaSenha || undefined,
        });
        addFlash('success', 'Perfil atualizado com sucesso.');
        setEditandoPerfil(false);
    };

    const cancelarEmpresa = () => {
        setEditandoEmpresa(false);
        empresaService.obter().then((res) => setEmpresa(res || {}));
    };

    return (
        <div className="space-y-4">
            <div>
                <h2 className="text-2xl font-bold text-white">Configuracoes</h2>
                <p className="text-sm text-slate-400">Gerencie os dados da empresa e do seu perfil</p>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">

                {/* ── DADOS DA EMPRESA ── */}
                <div className="rounded-xl border border-border bg-card">
                    <div className="flex items-center justify-between border-b border-border px-5 py-4">
                        <div className="flex items-center gap-2">
                            <i className="bi bi-building text-primary text-lg" />
                            <h5 className="font-semibold text-white">Dados da Empresa</h5>
                        </div>
                        {isDono && !editandoEmpresa && (
                            <button
                                onClick={() => setEditandoEmpresa(true)}
                                className="flex items-center gap-1 rounded-lg border border-primary/40 px-3 py-1.5 text-xs text-primary hover:bg-primary/10"
                            >
                                <i className="bi bi-pencil" /> Editar
                            </button>
                        )}
                    </div>
                    <div className="p-5">
                        <form onSubmit={salvarEmpresa} className="space-y-3">
                            <Input
                                id="empresa-nome"
                                label="Nome da Empresa *"
                                value={empresa?.nome || ''}
                                onChange={(e) => setEmpresa({ ...empresa, nome: e.target.value })}
                                disabled={!editandoEmpresa}
                                required
                            />
                            <Input
                                id="empresa-cnpj"
                                label="CNPJ"
                                value={empresa?.cnpj || ''}
                                onChange={(e) => setEmpresa({ ...empresa, cnpj: e.target.value })}
                                disabled={!editandoEmpresa}
                                placeholder="00.000.000/0000-00"
                            />
                            <div className="grid grid-cols-2 gap-3">
                                <Input
                                    id="empresa-email"
                                    label="E-mail"
                                    value={empresa?.email || ''}
                                    onChange={(e) => setEmpresa({ ...empresa, email: e.target.value })}
                                    disabled={!editandoEmpresa}
                                    placeholder="contato@empresa.com"
                                />
                                <Input
                                    id="empresa-telefone"
                                    label="Telefone"
                                    value={empresa?.telefone || ''}
                                    onChange={(e) => setEmpresa({ ...empresa, telefone: e.target.value })}
                                    disabled={!editandoEmpresa}
                                    placeholder="(00) 00000-0000"
                                />
                            </div>
                            <Input
                                id="empresa-endereco"
                                label="Endereço"
                                value={empresa?.endereco || ''}
                                onChange={(e) => setEmpresa({ ...empresa, endereco: e.target.value })}
                                disabled={!editandoEmpresa}
                                placeholder="Rua, número, cidade - UF"
                            />

                            {/* campos somente leitura — vêm do backend */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-300">Responsável (Dono)</label>
                                <input
                                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-slate-400 opacity-70 cursor-not-allowed"
                                    value={empresa?.responsavelNome || '—'}
                                    disabled
                                    readOnly
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-300">E-mail do Responsável</label>
                                <input
                                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-slate-400 opacity-70 cursor-not-allowed"
                                    value={empresa?.responsavelEmail || '—'}
                                    disabled
                                    readOnly
                                />
                            </div>

                            <Input
                                id="empresa-suporte"
                                label="E-mail de Suporte (TI)"
                                value={empresa?.suporte || ''}
                                onChange={(e) => setEmpresa({ ...empresa, suporte: e.target.value })}
                                disabled={!editandoEmpresa}
                                placeholder="suporte@empresa.com"
                            />

                            {/* Logo da Empresa */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-300">Logo da Empresa</label>
                                {empresa?.logo && (
                                    <div className="mb-2 flex items-center gap-3">
                                        <img
                                            src={empresa.logo}
                                            alt="Logo atual"
                                            className="h-16 w-auto max-w-[160px] rounded-lg border border-border object-contain"
                                        />
                                        <span className="text-xs text-slate-400">Logo atual</span>
                                    </div>
                                )}
                                {editandoEmpresa ? (
                                    <div className="space-y-2">
                                        <input
                                            type="file"
                                            accept="image/png, image/jpeg, image/webp"
                                            className="w-full cursor-pointer rounded-xl border border-border bg-background px-3 py-2 text-sm text-slate-300 file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-primary file:px-3 file:py-1 file:text-xs file:font-semibold file:text-white"
                                            onChange={async (e) => {
                                                const file = e.target.files[0];
                                                if (!file) return;
                                                const formData = new FormData();
                                                formData.append('file', file);
                                                try {
                                                    const res = await api.post(`/empresas/${empresa.id}/logo`, formData, {
                                                        headers: {
                                                            'Content-Type': undefined  // ← deixa o browser definir automaticamente
                                                        },
                                                    });
                                                    setEmpresa(res);
                                                    addFlash('success', 'Logo atualizada com sucesso!');
                                                    setTimeout(() => window.location.reload(), 1500);
                                                } catch {
                                                    addFlash('danger', 'Erro ao fazer upload da logo.');
                                                }
                                            }}
                                        />
                                        <p className="text-xs text-slate-500">JPG, PNG ou WEBP. Tamanho recomendado: 200x60px.</p>
                                    </div>
                                ) : (
                                    <input
                                        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-slate-400 opacity-70 cursor-not-allowed"
                                        value={empresa?.logo ? 'Logo configurada' : 'Nenhuma logo configurada'}
                                        disabled
                                        readOnly
                                    />
                                )}
                            </div>
                            {editandoEmpresa && (
                                <div className="flex gap-2 pt-2">
                                    <button
                                        type="submit"
                                        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
                                    >
                                        <i className="bi bi-check-lg" /> Salvar dados da empresa
                                    </button>
                                    <button
                                        type="button"
                                        onClick={cancelarEmpresa}
                                        className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                </div>

                {/* ── COLUNA DIREITA ── */}
                <div className="space-y-4">

                    {/* MEU PERFIL */}
                    <div className="rounded-xl border border-border bg-card">
                        <div className="flex items-center justify-between border-b border-border px-5 py-4">
                            <div className="flex items-center gap-2">
                                <i className="bi bi-person-gear text-primary text-lg" />
                                <h5 className="font-semibold text-white">Meu Perfil</h5>
                            </div>
                            {!editandoPerfil && (
                                <button
                                    onClick={() => setEditandoPerfil(true)}
                                    className="flex items-center gap-1 rounded-lg border border-primary/40 px-3 py-1.5 text-xs text-primary hover:bg-primary/10"
                                >
                                    <i className="bi bi-pencil" /> Editar
                                </button>
                            )}
                        </div>
                        <div className="p-5">
                            {/* Avatar */}
                            <div className="mb-4 flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/10 p-3">
                                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">
                                    {iniciais}
                                </div>
                                <div>
                                    <p className="font-semibold text-white">{user?.nome || 'Usuário'}</p>
                                    <span className="rounded px-2 py-0.5 text-xs font-medium" style={{ background: 'rgba(99,102,241,.2)', color: '#818cf8' }}>
                                        <i className="bi bi-person-check me-1" />{user?.perfil || 'OPERADOR'}
                                    </span>
                                </div>
                            </div>

                            <form onSubmit={salvarPerfil} className="space-y-3">
                                <Input
                                    id="perfil-nome"
                                    label="Nome *"
                                    value={formPerfil.nome}
                                    onChange={(e) => setFormPerfil({ ...formPerfil, nome: e.target.value })}
                                    disabled={!editandoPerfil}
                                    required
                                />
                                <Input
                                    id="perfil-email"
                                    label="E-mail *"
                                    value={formPerfil.email}
                                    onChange={(e) => setFormPerfil({ ...formPerfil, email: e.target.value })}
                                    disabled={!editandoPerfil}
                                    required
                                />

                                <Input
                                    id="perfil-cpf"
                                    label="CPF *"
                                    value={formPerfil.cpf}
                                    onChange={(e) => setFormPerfil({ ...formPerfil, cpf: e.target.value })}
                                    disabled={!editandoPerfil}
                                    placeholder="000.000.000-00"
                                />

                                <hr className="border-border" />
                                <p className="text-xs text-slate-400">
                                    <i className="bi bi-info-circle me-1" />
                                    Para alterar a senha, informe a senha atual.
                                </p>

                                <Input
                                    id="senha-atual"
                                    label="Senha Atual"
                                    type="password"
                                    placeholder="Senha atual"
                                    value={formPerfil.senhaAtual}
                                    onChange={(e) => setFormPerfil({ ...formPerfil, senhaAtual: e.target.value })}
                                    disabled={!editandoPerfil}
                                />
                                <Input
                                    id="nova-senha"
                                    label="Nova Senha"
                                    type="password"
                                    placeholder="Mínimo 8 caracteres"
                                    value={formPerfil.novaSenha}
                                    onChange={(e) => setFormPerfil({ ...formPerfil, novaSenha: e.target.value })}
                                    disabled={!editandoPerfil}
                                />
                                <Input
                                    id="confirma-senha"
                                    label="Confirmar Nova Senha"
                                    type="password"
                                    placeholder="Repita a nova senha"
                                    value={formPerfil.confirmaSenha}
                                    onChange={(e) => setFormPerfil({ ...formPerfil, confirmaSenha: e.target.value })}
                                    disabled={!editandoPerfil}
                                />

                                {editandoPerfil && (
                                    <div className="flex gap-2 pt-2">
                                        <button
                                            type="submit"
                                            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                                        >
                                            <i className="bi bi-check-lg" /> Salvar perfil
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setEditandoPerfil(false)}
                                            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>

                    {/* INFORMAÇÕES DO SISTEMA */}
                    <div className="rounded-xl border border-border bg-card p-5">
                        <h6 className="mb-3 flex items-center gap-2 font-semibold text-white">
                            <i className="bi bi-info-circle text-primary" /> Informacoes do Sistema
                        </h6>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between border-b border-border py-2">
                                <span className="text-slate-400">Versao</span>
                                <span className="font-medium text-white">StockMaster 1.0</span>
                            </div>
                            <div className="flex justify-between border-b border-border py-2">
                                <span className="text-slate-400">Empresa</span>
                                <span className="font-medium text-white">{empresa?.nome || '---'}</span>
                            </div>
                            <div className="flex justify-between py-2">
                                <span className="text-slate-400">Perfil</span>
                                <span className="rounded px-2 py-0.5 text-xs font-medium" style={{ background: 'rgba(99,102,241,.2)', color: '#818cf8' }}>
                                    <i className="bi bi-person-check me-1" />{user?.perfil || 'OPERADOR'}
                                </span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}