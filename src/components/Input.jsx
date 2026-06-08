export default function Input({
    id,
    label,
    type = 'text',
    placeholder,
    value,
    onChange,
    onBlur,
    icon,
    error,
    hint,
    disabled = false,
    className = '',
    ...rest
}) {
    return (
        <div className="space-y-2">
            {label && (
                <label htmlFor={id} className="text-sm font-medium text-slate-300">
                    {label}
                </label>
            )}
            <div className="relative">
                {icon && <i className={`bi ${icon} absolute left-3 top-1/2 -translate-y-1/2 text-slate-500`} />}
                <input
                    id={id}
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    disabled={disabled}
                    className={`w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 ${icon ? 'pl-10' : ''} ${className}`}
                    {...rest}
                />
            </div>
            {error && <p className="text-xs text-red-400">{error}</p>}
            {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
        </div>
    );
}
