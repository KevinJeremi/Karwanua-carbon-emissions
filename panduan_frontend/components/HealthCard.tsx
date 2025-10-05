import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";

export function HealthCard() {
  const indicators = [
    { label: "Water Level", value: "Low", icon: "💧", status: "warning" },
    { label: "Humidity", value: "56%", icon: "💨", status: "good" },
    { label: "Light", value: "Indirect", icon: "☀️", status: "good" },
    { label: "Fertilization", value: "Moderate", icon: "🌱", status: "good" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Plant Health</h3>
        <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors">
          See all
          <ChevronRight size={16} />
        </button>
      </div>
      
      <div className="space-y-4">
        {indicators.map((indicator, index) => (
          <motion.div
            key={indicator.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex items-center justify-between p-3 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{indicator.icon}</span>
              <span className="text-sm font-medium text-gray-700">{indicator.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-semibold ${
                indicator.status === 'warning' ? 'text-orange-600' : 'text-green-600'
              }`}>
                {indicator.value}
              </span>
              <div className={`w-2 h-2 rounded-full ${
                indicator.status === 'warning' ? 'bg-orange-400' : 'bg-green-400'
              }`} />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}