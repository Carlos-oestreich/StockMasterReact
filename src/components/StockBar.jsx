import { getStockColor } from '../utils/stock.js';

export default function StockBar({ quantity, minQuantity }) {
    const percent = minQuantity > 0 ? Math.min(100, (quantity / minQuantity) * 100) : 100;
    const color = getStockColor(quantity, minQuantity);

    return (
        <div className="w-full space-y-1">
            <div className="flex justify-between text-[10px] font-semibold uppercase">
                <span className={quantity === 0 ? 'text-red-400' : 'text-slate-400'}>
                    {quantity} un
                </span>
                <span className="text-slate-500">Min: {minQuantity}</span>
            </div>
            <div className="stock-bar-wrap">
                <div className="stock-bar" style={{ width: `${percent}%`, background: color }} />
            </div>
        </div>
    );
}