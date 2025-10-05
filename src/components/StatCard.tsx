"use client";

import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const mockData = [
    { year: '2018', co2: 410 },
    { year: '2019', co2: 412 },
    { year: '2020', co2: 414 },
    { year: '2021', co2: 416 },
    { year: '2022', co2: 418 },
    { year: '2023', co2: 421 },
    { year: '2024', co2: 425 },
];

export function StatCard() {
    return (
        <div className="rounded-2xl shadow p-6" style={{ backgroundColor: '#0e2816' }}>
            <h2 className="font-semibold mb-3 text-white">CO₂ Trend Analytics</h2>
            <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockData}>
                        <XAxis
                            dataKey="year"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#a9e5b5' }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#a9e5b5' }}
                            domain={[405, 430]}
                        />
                        <Line
                            type="monotone"
                            dataKey="co2"
                            stroke="#ff6b6b"
                            strokeWidth={2}
                            dot={{ fill: '#ff6b6b', strokeWidth: 2, r: 3 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
