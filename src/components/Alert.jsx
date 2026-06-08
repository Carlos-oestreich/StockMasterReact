export default function Alert({
    variant = 'info',
    title,
    children,
    className = '',
    icon,
}) {
    const variants = {
        success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200',
        danger: 'border-red-500/30 bg-red-500/10 text-red-200',
        warning: 'border-amber-500/30 bg-amber-500/10 text-amber-200',
        info: 'border-indigo-500/30 bg-indigo-500/10 text-indigo-200',
    };

    return (
        <div className={`flex gap-3 rounded-xl border px-4 py-3 text-sm ${variants[variant]} ${className}`}>
            {icon && <i className={`bi ${icon} text-base`} />}
            <div>
                {title && <p className="font-semibold text-white">{title}</p>}
                {children && <p className="text-sm text-slate-200">{children}</p>}
            </div>
        </div>
    );
}
