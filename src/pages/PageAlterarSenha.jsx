import { useState } from 'react';
import Button from '../components/Button.jsx';
import Alert from '../components/Alert.jsx';
import Input from '../components/Input.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useFlash } from '../context/FlashContext.jsx';
import { validatePasswordStrength } from '../utils/validators.js';

export default function PageAlterarSenha() {
    const { user, logout } = useAuth();
    const { addFlash } = useFlash();

    const [senhaAtual, setSenhaAtual] = useState('');
    const [novaSenha, setNovaSenha] = useState('');
    const [confirmacao, setConfirmacao] = useState('');
    const [erro, setErro] = useState('');

    const strength = validatePasswordStrength(novaSenha);

    const handleSubmit = (event) => {
        event.preventDefault();
        setErro('');

        if (novaSenha !== confirmacao) {
            setErro('As senhas não conferem.');
            return;
        }

        if (!strength.valid) {
            setErro('A nova senha precisa atender aos requisitos.');
            return;
        }

        addFlash('success', 'Senha alterada com sucesso.');
    };

    return (
        <div className="mx-auto w-full max-w-2xl space-y-6">
            <Alert variant="warning" icon="bi-exclamation-triangle" title="Senha temporaria">
                Sua senha atual e temporaria. Defina uma nova senha para continuar.
            </Alert>

            <div className="rounded-2xl border border-border bg-card p-6">
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-lg font-bold text-primary">
                        {(user?.nome || 'U').slice(0, 1).toUpperCase()}
                    </div>
                    <div>
                        <p className="text-base font-semibold text-white">{user?.nome || 'Usuário'}</p>
                        <p className="text-sm text-slate-400">{user?.email || 'usuario@email.com'}</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-border bg-card p-6">
                {erro && (
                    <Alert variant="danger" icon="bi-x-circle">
                        {erro}
                    </Alert>
                )}
                <Input
                    id="senha-atual"
                    label="Senha atual"
                    type="password"
                    placeholder="Senha atual"
                    value={senhaAtual}
                    onChange={(event) => setSenhaAtual(event.target.value)}
                />
                <Input
                    id="nova-senha"
                    label="Nova senha"
                    type="password"
                    placeholder="Nova senha"
                    value={novaSenha}
                    onChange={(event) => setNovaSenha(event.target.value)}
                />
                <Input
                    id="confirmar-senha"
                    label="Confirmar nova senha"
                    type="password"
                    placeholder="Confirmar nova senha"
                    value={confirmacao}
                    onChange={(event) => setConfirmacao(event.target.value)}
                />

                <div className="rounded-xl border border-border bg-slate-900/40 p-4 text-xs text-slate-400">
                    <p className="mb-2 font-semibold text-slate-300">Requisitos da senha</p>
                    <ul className="space-y-1">
                        {strength.failed.length === 0 && <li className="text-emerald-300">Senha válida.</li>}
                        {strength.failed.map((item) => (
                            <li key={item}>- {item}</li>
                        ))}
                    </ul>
                </div>

                <div className="flex flex-wrap gap-3">
                    <Button type="submit" className="flex-1">
                        <i className="bi bi-check-lg" />
                        Salvar nova senha
                    </Button>
                    <Button type="button" variant="outline" className="flex-1" onClick={logout}>
                        <i className="bi bi-box-arrow-right" />
                        Sair do sistema
                    </Button>
                </div>
            </form>
        </div>
    );
}
