export default function Table({ title, actions, children }) {
    return (
        <div className="table-stockmaster">
            {(title || actions) && (
                <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
                    {title && <h3 className="text-sm font-semibold text-white">{title}</h3>}
                    {actions && <div className="text-sm">{actions}</div>}
                </div>
            )}
            <div className="overflow-x-auto">{children}</div>
        </div>
    );
}
