import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";

export function RecentUpdatesCard() {
  const updates = [
    { 
      title: "Growth rate: 5%", 
      tag: "Growth", 
      date: "Nov 2, 2024",
      tagColor: "bg-green-100 text-green-700"
    },
    { 
      title: "Soil moisture: Low", 
      tag: "Watering", 
      date: "Oct 27, 2024",
      tagColor: "bg-blue-100 text-blue-700"
    },
    { 
      title: "Excessive light", 
      tag: "Light", 
      date: "Nov 16, 2024",
      tagColor: "bg-orange-100 text-orange-700"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Updates</h3>
        <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors">
          See all
          <ChevronRight size={16} />
        </button>
      </div>
      
      <div className="space-y-4">
        {updates.map((update, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 + 0.5 }}
            className="flex items-start justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group"
          >
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 group-hover:text-gray-700 transition-colors">
                {update.title}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${update.tagColor}`}>
                  {update.tag}
                </span>
                <span className="text-xs text-gray-500">{update.date}</span>
              </div>
            </div>
            <ChevronRight size={16} className="text-gray-400 group-hover:text-gray-600 transition-colors mt-1" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}