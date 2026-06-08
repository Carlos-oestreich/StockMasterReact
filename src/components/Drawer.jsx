import { useEffect } from 'react';
import { useFlash } from '../context/FlashContext.jsx';

export default function Drawer({ open, title, onClose, children }) {
    const { flashes, removeFlash, setDrawerAberto } = useFlash();

    useEffect(() => {
        setDrawerAberto(open);
    }, [open, setDrawerAberto]);

    const variants = {
        success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200',
        danger: 'border-red-500/30 bg-red-500/10 text-red-200',
        warning: 'border-amber-500/30 bg-amber-500/10 text-amber-200',
        info: 'border-indigo-500/30 bg-indigo-500/10 text-indigo-200',
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-stretch justify-end bg-black/60">
            <div className="flex h-full w-full max-w-md flex-col border-l border-border bg-card">
                <div className="flex items-center justify-between border-b border-border px-6 py-4">
                    <h3 className="text-base font-semibold text-white">{title}</h3>
                    <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-300 hover:bg-slate-800">
                        <i className="bi bi-x-lg" />
                    </button>
                </div>

                {flashes.length > 0 && (
                    <div className="space-y-2 px-6 pt-4">
                        {flashes.map((flash) => (
                            <div key={flash.id} className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm ${variants[flash.type] || variants.info}`}>
                                <span>{flash.message}</span>
                                <button type="button" onClick={() => removeFlash(flash.id)} className="text-slate-300 hover:text-white">
                                    <i className="bi bi-x-lg" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex-1 overflow-y-auto px-6 py-5">
                    {children}
                </div>
            </div>
        </div>
    );
}