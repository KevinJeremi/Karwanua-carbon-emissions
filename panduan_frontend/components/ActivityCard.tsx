import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const mockActivityData = [
  { day: 'Mon', activity: 12 },
  { day: 'Tue', activity: 8 },
  { day: 'Wed', activity: 15 },
  { day: 'Thu', activity: 10 },
  { day: 'Fri', activity: 18 },
  { day: 'Sat', activity: 6 },
  { day: 'Sun', activity: 9 },
];

export function ActivityCard() {
  return (
    <div className="rounded-2xl shadow p-6" style={{ backgroundColor: '#cedbd4' }}>
      <h2 className="font-semibold mb-3 text-gray-800">Activity Overview</h2>
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={mockActivityData}>
            <XAxis 
              dataKey="day" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#1b563a' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#1b563a' }}
            />
            <Bar 
              dataKey="activity" 
              fill="#1b563a"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}