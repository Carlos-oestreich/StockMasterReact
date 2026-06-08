export default function Badge({ children, variant = 'normal', className = '' }) {
    const variants = {
        normal: 'bg-green-500/20 text-green-300',
        atencao: 'bg-yellow-500/20 text-yellow-300',
        critico: 'bg-red-500/20 text-red-300',
        semestoque: 'bg-orange-500/20 text-orange-300',
        info: 'bg-primary/15 text-primary',
    };

    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${variants[variant]} ${className}`}>
            {children}
        </span>
    );
}