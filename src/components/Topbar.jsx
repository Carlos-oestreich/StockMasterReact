import { useLocation, Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle.jsx';
import { PAGE_TITLES } from '../data/navigation.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Topbar({ alertCount = 0 }) {
    const location = useLocation();
    const { user } = useAuth();
    const title = PAGE_TITLES[location.pathname] || 'StockMaster';
    const iniciais = (user?.nome || 'Usuario').slice(0, 1).toUpperCase();

    return (
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-card px-6">
            <div className="flex items-center gap-3">
                <h1 className="text-base font-semibold text-white">{title}</h1>
            </div>
            <div className="flex items-center gap-3">
                <ThemeToggle />
                <Link
                    to="/alertas"
                    className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-border text-slate-300 hover:bg-slate-800"
                >
                    <i className="bi bi-bell" />
                    {alertCount > 0 && (
                        <span className="absolute -right-1 -top-1 rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                            {alertCount}
                        </span>
                    )}
                </Link>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/80 text-sm font-bold text-white">
                    {iniciais}
                </div>
            </div>
        </header>
    );
}
