import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button.jsx';
import Input from '../components/Input.jsx';
import Alert from '../components/Alert.jsx';
import { maskCnpj, maskCpf, maskPhone } from '../utils/masks.js';
import { validatePasswordStrength } from '../utils/validators.js';
import { useFlash } from '../context/FlashContext.jsx';
import api from '../services/api.js';

export default function PageCadastroInicial() {
    const navigate = useNavigate();
    const { addFlash } = useFlash();

    const [empresa, setEmpresa] = useState({ nome: '', cnpj: '', telefone: '', email: '' });
    const [dono, setDono] = useState({ nome: '', email: '', cpf: '', matricula: '' });
    const [senha, setSenha] = useState('');
    const [confirmacao, setConfirmacao] = useState('');
    const [erro, setErro] = useState('');
    const [loading, setLoading] = useState(false);

    const strength = validatePasswordStrength(senha);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErro('');

        if (senha !== confirmacao) { setErro('As senhas não conferem.'); return; }
        if (!strength.valid) { setErro('A senha precisa atender aos requisitos de segurança.'); return; }

        setLoading(true);
        try {
            // Envia tudo em uma requisição só para o backend Java
            await api.post('/cadastro-inicial', {
                nomeEmpresa:     empresa.nome,
                cnpjEmpresa:     empresa.cnpj.replace(/\D/g, '') || null,
                telefoneEmpresa: empresa.telefone || null,
                emailEmpresa:    empresa.email || null,
                nome:            dono.nome,
                email:           dono.email,
                senha:           senha,
                cpf:             dono.cpf.replace(/\D/g, '') || null,
                matricula:       dono.matricula || null,

            });

            addFlash('success', 'Empresa criada com sucesso! Faça login para continuar.');
            navigate('/login');
        } catch (err) {
            const msg = err.response?.data?.message || err.response?.data || 'Erro ao cadastrar. Verifique os dados.';
            setErro(String(msg));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background px-6 py-12">
            <div className="mx-auto w-full max-w-4xl space-y-6">
                <div className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-2xl text-white shadow-glow">
                        <i className="bi bi-boxes" />
                    </div>
                    <h1 className="font-display text-3xl font-bold text-white">StockMaster</h1>
                    <p className="mt-1 text-sm text-slate-400">Configuração inicial do sistema</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {erro && <Alert variant="danger" icon="bi-x-circle">{erro}</Alert>}

                    {/* SEÇÃO 1 — Empresa */}
                    <section className="rounded-2xl border border-border bg-card p-6">
                        <div className="mb-6 flex items-center gap-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">1</span>
                            <div>
                                <h2 className="text-lg font-semibold text-white">Dados da Empresa</h2>
                                <p className="text-sm text-slate-400">Informações obrigatórias para abrir o estoque.</p>
                            </div>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <Input id="empresa-nome" label="Nome da Empresa *" placeholder="Razão social ou nome fantasia"
                                value={empresa.nome} onChange={(e) => setEmpresa({ ...empresa, nome: e.target.value })} required />
                            <Input id="empresa-cnpj" label="CNPJ" placeholder="00.000.000/0000-00"
                                value={empresa.cnpj} onChange={(e) => setEmpresa({ ...empresa, cnpj: maskCnpj(e.target.value) })} />
                            <Input id="empresa-telefone" label="Telefone" placeholder="(00) 00000-0000"
                                value={empresa.telefone} onChange={(e) => setEmpresa({ ...empresa, telefone: maskPhone(e.target.value) })} />
                            <Input id="empresa-email" label="E-mail da Empresa" type="email" placeholder="contato@empresa.com"
                                value={empresa.email} onChange={(e) => setEmpresa({ ...empresa, email: e.target.value })} />
                        </div>
                    </section>

                    {/* SEÇÃO 2 — Dono */}
                    <section className="rounded-2xl border border-border bg-card p-6">
                        <div className="mb-6 flex items-center gap-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">2</span>
                            <div>
                                <h2 className="text-lg font-semibold text-white">Dados do Responsável (Dono)</h2>
                                <p className="text-sm text-slate-400">Usuário com acesso total ao sistema.</p>
                            </div>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <Input id="dono-nome" label="Nome completo *" placeholder="Seu nome completo"
                                value={dono.nome} onChange={(e) => setDono({ ...dono, nome: e.target.value })} required />
                            <Input id="dono-email" label="E-mail *" type="email" placeholder="dono@empresa.com"
                                value={dono.email} onChange={(e) => setDono({ ...dono, email: e.target.value })} required />
                            <Input id="dono-cpf" label="CPF *" placeholder="000.000.000-00"
                                value={dono.cpf} onChange={(e) => setDono({ ...dono, cpf: maskCpf(e.target.value) })} required />
                            <Input id="dono-matricula" label="Matrícula (opcional)" placeholder="DN-001"
                                value={dono.matricula} onChange={(e) => setDono({ ...dono, matricula: e.target.value })} />
                        </div>
                        <div className="mt-6 grid gap-4 md:grid-cols-2">
                            <Input id="senha" label="Senha *" type="password" placeholder="Crie uma senha forte"
                                value={senha} onChange={(e) => setSenha(e.target.value)} required />
                            <Input id="confirmar-senha" label="Confirmar Senha *" type="password" placeholder="Repita a senha"
                                value={confirmacao} onChange={(e) => setConfirmacao(e.target.value)} required />
                        </div>
                        <div className="mt-4 rounded-xl border border-border bg-slate-900/40 p-4 text-xs text-slate-400">
                            <p className="mb-2 font-semibold text-slate-300">Requisitos da senha</p>
                            {strength.failed.length === 0
                                ? <p className="text-emerald-300">✓ Senha válida.</p>
                                : <ul className="space-y-1">{strength.failed.map((f) => <li key={f}>- {f}</li>)}</ul>
                            }
                        </div>
                    </section>

                    <Button type="submit" size="lg" className="w-full" disabled={loading}>
                        <i className={`bi ${loading ? 'bi-hourglass-split' : 'bi-rocket-takeoff'}`} />
                        {loading ? 'Criando...' : 'Criar empresa e acessar o sistema'}
                    </Button>
                </form>
            </div>
        </div>
    );
}
