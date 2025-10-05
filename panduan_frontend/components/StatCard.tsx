import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const mockData = [
  { day: 1, growth: 2.1 },
  { day: 2, growth: 3.2 },
  { day: 3, growth: 2.8 },
  { day: 4, growth: 4.1 },
  { day: 5, growth: 3.9 },
  { day: 6, growth: 4.5 },
  { day: 7, growth: 5.2 },
];

export function StatCard() {
  return (
    <div className="rounded-2xl shadow p-6" style={{ backgroundColor: '#0e2816' }}>
      <h2 className="font-semibold mb-3 text-white">Growth Analytics</h2>
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mockData}>
            <XAxis 
              dataKey="day" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#a9e5b5' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#a9e5b5' }}
            />
            <Line 
              type="monotone" 
              dataKey="growth" 
              stroke="#a9e5b5" 
              strokeWidth={2}
              dot={{ fill: '#a9e5b5', strokeWidth: 2, r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}