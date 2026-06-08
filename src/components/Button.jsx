export default function Button({
    children,
    type = 'button',
    variant = 'primary',
    size = 'md',
    className = '',
    disabled = false,
    onClick,
}) {
    const variants = {
        primary: 'bg-primary text-white hover:bg-indigo-500',
        secondary: 'bg-slate-800 text-white hover:bg-slate-700',
        outline: 'border border-border text-slate-200 hover:bg-slate-800',
        ghost: 'text-slate-300 hover:bg-slate-800/60',
        danger: 'bg-red-500 text-white hover:bg-red-400',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-5 py-2.5 text-base',
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${sizes[size]} ${className}`}
        >
            {children}
        </button>
    );
}
