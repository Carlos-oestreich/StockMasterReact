import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { NAV_ITEMS } from '../data/navigation.js';
import { useAuth } from '../context/AuthContext.jsx';
import { empresaService } from '../services/empresaService.js';

export default function Sidebar() {
    const location = useLocation();
    const { user, logout } = useAuth();
    const [empresa, setEmpresa] = useState(null);

    const perfil = user?.perfil || 'OPERADOR';
    const isAdmin = perfil === 'ADM' || perfil === 'DONO';
    const nomeUsuario = user?.nome || 'Usuario';
    const iniciais = nomeUsuario.slice(0, 1).toUpperCase();

    useEffect(() => {
        empresaService.obter()
            .then((res) => setEmpresa(res.data || null))
            .catch(() => {});
    }, [location.pathname]); // recarrega ao mudar de página

    const nomeEmpresa = empresa?.nome || 'StockMaster';
    const logoEmpresa = empresa?.logo || null;

    return (
        <aside className="flex h-screen w-64 flex-col border-r border-border bg-card sticky top-0">
            <div className="flex h-16 items-center gap-3 border-b border-border px-4">
                {logoEmpresa ? (
                    <img
                        src={logoEmpresa}
                        alt="Logo"
                        className="h-8 w-auto max-w-[32px] object-contain rounded"
                    />
                ) : (
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary text-white">
                        <i className="bi bi-boxes text-lg" />
                    </div>
                )}
                <span className="truncate text-base font-bold text-white" style={{ maxWidth: '160px' }}>
                    {nomeEmpresa}
                </span>
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
                {NAV_ITEMS.filter((item) => !item.admin || isAdmin).map((item) => {
                    const active = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                                active
                                    ? 'bg-primary text-white'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`}
                        >
                            <i className={`bi ${item.icon} text-base`} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="border-t border-border px-4 py-4">
                <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/80 text-sm font-bold text-white">
                        {iniciais}
                    </div>
                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">{nomeUsuario}</p>
                        <p className="text-xs text-slate-400">{perfil}</p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={logout}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-500/40 px-3 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-500/10"
                >
                    <i className="bi bi-box-arrow-right" />
                    Sair
                </button>
            </div>
        </aside>
    );
}