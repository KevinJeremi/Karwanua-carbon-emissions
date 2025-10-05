export function AlertCard() {
  return (
    <div className="rounded-2xl shadow p-6 text-gray-900" style={{ backgroundColor: '#fbcb47' }}>
      <h2 className="font-semibold mb-3">Critical Alerts</h2>
      <ul className="space-y-2 text-sm">
        <li className="flex items-center gap-2">
          <span className="text-green-600">✅</span>
          <span>Container #2 – Optimal growth</span>
        </li>
        <li className="flex items-center gap-2">
          <span className="text-orange-500">⚠️</span>
          <span>Container #8 – Low water level</span>
        </li>
        <li className="flex items-center gap-2">
          <span className="text-blue-500">🧪</span>
          <span>Container #14 – pH above normal</span>
        </li>
      </ul>
    </div>
  );
}