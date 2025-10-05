export function AlertCard() {
    return (
        <div className="rounded-2xl shadow p-6 text-gray-900" style={{ backgroundColor: '#fbcb47' }}>
            <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold">Critical Alerts</h2>
                <div className="px-2 py-1 bg-purple-600/20 rounded-full flex items-center gap-1">
                    <span className="text-xs font-semibold text-purple-800">🧠 AI</span>
                </div>
            </div>
            <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                    <span className="text-red-600 text-lg">🌡️</span>
                    <div>
                        <span className="font-semibold text-red-700">Critical</span>
                        <p className="text-gray-700">Arctic temperature +2.5°C above baseline</p>
                    </div>
                </li>
                <li className="flex items-start gap-2">
                    <span className="text-red-600 text-lg">🚨</span>
                    <div>
                        <span className="font-semibold text-red-700">Critical</span>
                        <p className="text-gray-700">CO₂ levels reached 420 ppm in Asia region</p>
                    </div>
                </li>
                <li className="flex items-start gap-2">
                    <span className="text-orange-500 text-lg">⚠️</span>
                    <div>
                        <span className="font-semibold text-orange-700">Warning</span>
                        <p className="text-gray-700">Vegetation index dropped to 0.58 in Africa</p>
                    </div>
                </li>
            </ul>
        </div>
    );
}
