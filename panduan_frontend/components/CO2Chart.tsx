import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const mockData = [
  { year: '2010', co2: 389.9 },
  { year: '2011', co2: 391.6 },
  { year: '2012', co2: 393.8 },
  { year: '2013', co2: 396.5 },
  { year: '2014', co2: 398.6 },
  { year: '2015', co2: 400.8 },
  { year: '2016', co2: 404.2 },
  { year: '2017', co2: 406.5 },
  { year: '2018', co2: 408.5 },
  { year: '2019', co2: 411.4 },
  { year: '2020', co2: 414.2 },
  { year: '2021', co2: 416.5 },
  { year: '2022', co2: 420.9 },
  { year: '2023', co2: 424.0 },
  { year: '2024', co2: 426.8 },
];

export function CO2Chart() {
  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-white">
          Atmospheric CO₂ Concentration Over Time
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis 
                dataKey="year" 
                stroke="#666"
                fontSize={12}
              />
              <YAxis 
                stroke="#666"
                fontSize={12}
                domain={['dataMin - 5', 'dataMax + 5']}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value: number) => [`${value} ppm`, 'CO₂']}
              />
              <Line 
                type="monotone" 
                dataKey="co2" 
                stroke="#4CA771" 
                strokeWidth={3}
                dot={{ fill: '#4CA771', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#4CA771', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}