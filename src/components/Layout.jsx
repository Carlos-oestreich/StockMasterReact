import { Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Sidebar from './Sidebar.jsx';
import Topbar from './Topbar.jsx';
import FlashMessages from './FlashMessages.jsx';
import { empresaService } from '../services/empresaService.js';
import { produtoService } from '../services/produtoService.js';

export default function Layout() {
    const [empresa, setEmpresa] = useState(null);
    const [alertCount, setAlertCount] = useState(0);

    useEffect(() => {
        empresaService.obter().then((res) => setEmpresa(res.data || null)).catch(() => {});
        produtoService.listar().then((res) => {
            const produtos = res.data || [];
            const alertas = produtos.filter((p) => p.quantidadeEstoque <= p.quantidadeMinima);
            setAlertCount(alertas.length);
        }).catch(() => {});
    }, []);

    return (
        <div className="flex min-h-screen bg-background text-slate-100">
            <Sidebar empresa={empresa} />
            <div className="flex min-h-screen flex-1 flex-col min-w-0 overflow-x-hidden">
                <Topbar alertCount={alertCount} />
                <FlashMessages />
                <main className="flex-1 space-y-6 px-6 py-6 min-w-0">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}