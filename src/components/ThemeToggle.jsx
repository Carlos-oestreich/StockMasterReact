import { useTheme } from '../context/ThemeContext.jsx';

export default function ThemeToggle({ className = '' }) {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme !== 'light';

    return (
        <button
            type="button"
            onClick={toggleTheme}
            className={`flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-300 transition hover:bg-slate-800 ${className}`}
            title="Alternar tema"
        >
            <i className={`bi ${isDark ? 'bi-moon-stars' : 'bi-sun'} text-base`} />
            {isDark ? 'Escuro' : 'Claro'}
        </button>
    );
}
