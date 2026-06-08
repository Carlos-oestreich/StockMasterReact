export default function EmptyState({ icon = 'bi-inbox', title, description, action }) {
    return (
        <div className="flex flex-col items-center justify-center gap-2 py-10 text-center text-slate-400">
            <i className={`bi ${icon} text-3xl text-slate-500`} />
            {title && <p className="text-base font-semibold text-slate-200">{title}</p>}
            {description && <p className="text-sm text-slate-400">{description}</p>}
            {action && <div className="mt-3">{action}</div>}
        </div>
    );
}
