import { Link } from 'react-router-dom';

export default function Breadcrumb({ items = [] }) {
    return (
        <nav aria-label="breadcrumb" className="text-sm">
            <ol className="flex flex-wrap items-center gap-2 text-slate-400">
                {items.map((item, index) => (
                    <li key={`${item.label}-${index}`} className="flex items-center gap-2">
                        {item.to ? (
                            <Link to={item.to} className="text-primary hover:text-indigo-300">
                                {item.label}
                            </Link>
                        ) : (
                            <span className="text-slate-400">{item.label}</span>
                        )}
                        {index < items.length - 1 && <span className="text-slate-600">/</span>}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
