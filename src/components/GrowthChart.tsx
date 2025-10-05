"use client";

import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Dot } from "recharts";
import { ChevronDown } from "lucide-react";

export function GrowthChart() {
    const data = [
        { month: "Aug", growth: 5 },
        { month: "Sep", growth: 12 },
        { month: "Oct", growth: 23 },
        { month: "Nov", growth: 31 },
        { month: "Dec", growth: 43 }
    ];

    const CustomDot = (props: any) => {
        const { cx, cy, payload } = props;
        if (payload.month === "Nov") {
            return (
                <motion.g>
                    <Dot
                        cx={cx}
                        cy={cy}
                        r={6}
                        fill="#9acd32"
                        stroke="#fff"
                        strokeWidth={3}
                    />
                    <motion.circle
                        cx={cx}
                        cy={cy}
                        r={8}
                        fill="none"
                        stroke="#9acd32"
                        strokeWidth={2}
                        initial={{ scale: 0 }}
                        animate={{ scale: [0, 1.2, 1] }}
                        transition={{ duration: 1, delay: 0.5 }}
                    />
                </motion.g>
            );
        }
        return <Dot cx={cx} cy={cy} r={4} fill="#c6e69c" />;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gradient-to-br from-green-50 to-lime-50 rounded-2xl shadow-sm border border-green-100 p-6 hover:shadow-md transition-shadow duration-300"
        >
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Growth</h3>
                <button className="flex items-center gap-2 px-3 py-1 bg-white rounded-lg text-sm text-gray-600 hover:text-gray-800 transition-colors border border-gray-200">
                    Month
                    <ChevronDown size={14} />
                </button>
            </div>

            <div className="mb-4">
                <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-gray-900">43%</span>
                    <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                        +3%
                    </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">Growth rate this month</p>
            </div>

            <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#6b7280' }}
                        />
                        <YAxis hide />
                        <Line
                            type="monotone"
                            dataKey="growth"
                            stroke="#9acd32"
                            strokeWidth={3}
                            dot={<CustomDot />}
                            activeDot={{ r: 6, fill: "#9acd32" }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
}
