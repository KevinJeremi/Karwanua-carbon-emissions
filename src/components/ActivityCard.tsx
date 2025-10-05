"use client";

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const mockActivityData = [
    { region: 'Asia', emission: 15 },
    { region: 'Europe', emission: 8 },
    { region: 'N.America', emission: 12 },
    { region: 'S.America', emission: 6 },
    { region: 'Africa', emission: 9 },
    { region: 'Oceania', emission: 4 },
    { region: 'M.East', emission: 11 },
];

export function ActivityCard() {
    return (
        <div className="rounded-2xl shadow p-6" style={{ backgroundColor: '#cedbd4' }}>
            <h2 className="font-semibold mb-3 text-gray-800">Emission by Region</h2>
            <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockActivityData}>
                        <XAxis
                            dataKey="region"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: '#1b563a' }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#1b563a' }}
                        />
                        <Bar
                            dataKey="emission"
                            fill="#1b563a"
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
