import { TrendingUp, TrendingDown, Leaf, Thermometer } from "lucide-react";
import { Card, CardContent } from "./ui/card";

const statisticsData = [
  {
    title: "Average CO₂",
    value: "426.8",
    unit: "ppm",
    change: "+2.1",
    changeType: "increase" as const,
    icon: TrendingUp,
    color: "text-red-500"
  },
  {
    title: "Emission Change",
    value: "+14.2",
    unit: "%",
    change: "since 2010",
    changeType: "increase" as const,
    icon: TrendingUp,
    color: "text-red-500"
  },
  {
    title: "Vegetation Index",
    value: "0.67",
    unit: "NDVI",
    change: "-0.03",
    changeType: "decrease" as const,
    icon: Leaf,
    color: "text-[#4CA771]"
  },
  {
    title: "Temperature Anomaly",
    value: "+1.8",
    unit: "°C",
    change: "+0.2",
    changeType: "increase" as const,
    icon: Thermometer,
    color: "text-orange-500"
  }
];

export function StatisticsCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statisticsData.map((stat, index) => {
        const IconComponent = stat.icon;
        const isIncrease = stat.changeType === "increase";
        
        return (
          <Card key={index} className="p-4 shadow-lg border-0 hover:shadow-xl transition-shadow duration-200">
            <CardContent className="p-0">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {stat.unit}
                    </span>
                  </div>
                  <div className={`flex items-center gap-1 text-xs ${
                    isIncrease ? 'text-red-500' : 'text-green-500'
                  }`}>
                    {isIncrease ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    <span>{stat.change}</span>
                  </div>
                </div>
                <div className={`p-2 rounded-lg bg-gray-50 dark:bg-gray-800 ${stat.color}`}>
                  <IconComponent className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}