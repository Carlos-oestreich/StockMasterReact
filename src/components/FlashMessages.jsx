import { useFlash } from '../context/FlashContext.jsx';

export default function FlashMessages() {
    const { flashes, removeFlash, drawerAberto } = useFlash();

    if (!flashes.length || drawerAberto) return null;

    const variants = {
        success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200',
        danger: 'border-red-500/30 bg-red-500/10 text-red-200',
        warning: 'border-amber-500/30 bg-amber-500/10 text-amber-200',
        info: 'border-indigo-500/30 bg-indigo-500/10 text-indigo-200',
    };

    return (
        <div className="space-y-3 px-6 pt-4">
            {flashes.map((flash) => (
                <div
                    key={flash.id}
                    className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm ${variants[flash.type] || variants.info}`}
                >
                    <span>{flash.message}</span>
                    <button type="button" onClick={() => removeFlash(flash.id)} className="text-slate-300 hover:text-white">
                        <i className="bi bi-x-lg" />
                    </button>
                </div>
            ))}
        </div>
    );
}