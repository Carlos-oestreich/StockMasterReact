export default function Card({ title, subtitle, actions, children, className = '' }) {
    return (
        <section className={`bg-card border border-border rounded-2xl ${className}`}>
            {(title || actions) && (
                <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-6 py-4">
                    <div>
                        {title && <h3 className="text-base font-semibold text-white">{title}</h3>}
                        {subtitle && <p className="text-sm text-slate-400">{subtitle}</p>}
                    </div>
                    {actions && <div className="flex items-center gap-2">{actions}</div>}
                </header>
            )}
            <div className="px-6 py-5">{children}</div>
        </section>
    );
}
