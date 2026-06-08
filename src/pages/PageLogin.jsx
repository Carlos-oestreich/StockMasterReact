import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button.jsx';
import Input from '../components/Input.jsx';
import ThemeToggle from '../components/ThemeToggle.jsx';
import Alert from '../components/Alert.jsx';
import FlashMessages from '../components/FlashMessages.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useFlash } from '../context/FlashContext.jsx';

export default function PageLogin() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { addFlash } = useFlash();

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [erro, setErro] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErro('');
        try {
            await login({ email, senha });
            addFlash('success', 'Login realizado com sucesso.');
            navigate('/dashboard');
        } catch (err) {
            setErro('Credenciais inválidas.');
        }
    };

    return (
        <div className="relative min-h-screen bg-background px-4">
            <div className="absolute right-6 top-6">
                <ThemeToggle />
            </div>

            <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center gap-6">
                <FlashMessages />

                <div className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-2xl text-white shadow-glow">
                        <i className="bi bi-boxes" />
                    </div>
                    <h1 className="font-display text-3xl font-bold text-white">StockMaster</h1>
                    <p className="mt-2 text-sm text-slate-400">Sistema de Gestão de Estoque</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-border bg-card p-6 shadow-xl">
                    {erro && (
                        <Alert variant="danger" icon="bi-x-circle" className="text-sm">
                            {erro}
                        </Alert>
                    )}

                    <Input
                        id="email"
                        label="E-mail"
                        type="email"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        icon="bi-envelope"
                    />

                    <div className="space-y-2">
                        <label htmlFor="senha" className="text-sm font-medium text-slate-300">
                            Senha
                        </label>
                        <div className="relative">
                            <i className="bi bi-lock absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input
                                id="senha"
                                type={mostrarSenha ? 'text' : 'password'}
                                placeholder="••••••••"
                                value={senha}
                                onChange={(event) => setSenha(event.target.value)}
                                className="w-full rounded-xl border border-border bg-background px-3 py-2 pl-10 text-sm text-slate-100 placeholder:text-slate-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                            />
                            <button
                                type="button"
                                onClick={() => setMostrarSenha((state) => !state)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                            >
                                <i className={`bi ${mostrarSenha ? 'bi-eye-slash' : 'bi-eye'}`} />
                            </button>
                        </div>
                    </div>

                    <Button type="submit" className="w-full" size="lg">
                        <i className="bi bi-box-arrow-in-right" />
                        Entrar no sistema
                    </Button>

                    <div className="text-center text-sm text-slate-400">
                        <Link to="/cadastro" className="text-primary hover:text-indigo-300">
                            Cadastrar nova empresa
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
