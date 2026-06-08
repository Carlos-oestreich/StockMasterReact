export default function StatCard({ label, value, icon, color = 'blue' }) {
    const colorMap = {
        blue: { bg: 'bg-blue-400/15', text: 'text-blue-400', icon: 'text-blue-400' },
        green: { bg: 'bg-emerald-400/15', text: 'text-emerald-400', icon: 'text-emerald-400' },
        red: { bg: 'bg-red-400/15', text: 'text-red-400', icon: 'text-red-400' },
        purple: { bg: 'bg-indigo-400/15', text: 'text-indigo-400', icon: 'text-indigo-400' },
        yellow: { bg: 'bg-amber-400/15', text: 'text-amber-400', icon: 'text-amber-400' },
    };

    const colors = colorMap[color] || colorMap.blue;

    return (
        <div className={`${colors.bg} card-stat`}>
            <div className="flex items-start justify-between">
                <div>
                    <p className="stat-label">{label}</p>
                    <p className={`stat-value ${colors.text}`}>{value}</p>
                </div>
                <i className={`bi ${icon} text-3xl ${colors.icon} opacity-60`} />
            </div>
        </div>
    );
}