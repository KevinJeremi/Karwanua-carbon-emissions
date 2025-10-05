import { motion } from "motion/react";
import { Leaf, Plus, TrendingUp } from "lucide-react";
import { HealthCard } from "./HealthCard";
import { SmartAnalysisCard } from "./SmartAnalysisCard";
import { GrowthChart } from "./GrowthChart";
import { TutorialCard } from "./TutorialCard";
import { RecentUpdatesCard } from "./RecentUpdatesCard";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import Navbar from "./Navbar";

export function AnalyticsPage() {
  const handlePageChange = (page: string) => {
    if (page === "dashboard") {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-greenish-bg">
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Integrated Navbar + Analytics Section */}
        <section className="relative bg-gradient-to-br from-greenish-dark via-greenish-mid to-emerald-600 text-white rounded-3xl overflow-hidden mb-8">
          {/* Navbar integrated into the green section */}
          <div className="p-6 pb-0">
            <Navbar currentPage="analytics" onPageChange={handlePageChange} />
          </div>
          
          {/* Analytics Header Content */}
          <div className="p-10 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse"></div>
                  <span className="text-emerald-200/90 text-sm uppercase tracking-wider">Plant Analytics</span>
                </div>
                <h1 className="text-4xl lg:text-5xl font-semibold mb-2">Spathiphyllum Plant</h1>
                <p className="text-lg text-white/80 mb-8">Monitoring and analysis in real-time</p>
                
                {/* Quick Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-500/30 rounded-lg flex items-center justify-center">
                        <span className="text-emerald-200 font-semibold text-sm">A</span>
                      </div>
                      <div>
                        <p className="text-white/70 text-sm">Chl A Level</p>
                        <p className="text-lg font-semibold">0.749 ± 0.02ᵇ</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-500/30 rounded-lg flex items-center justify-center">
                        <span className="text-green-200 font-semibold text-sm">B</span>
                      </div>
                      <div>
                        <p className="text-white/70 text-sm">Chl B Level</p>
                        <p className="text-lg font-semibold">0.253 ± 0.01ᵇ</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Enhanced Plant Visual */}
              <div className="relative mt-8 md:mt-0">
                {/* Scanning Animation Circles */}
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-emerald-300/30"
                  animate={{ 
                    scale: [1, 1.3, 1],
                    opacity: [0.3, 0.7, 0.3]
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  style={{ width: '280px', height: '280px', left: '-40px', top: '-40px' }}
                />
                
                <motion.div
                  className="absolute inset-0 rounded-full border border-white/40"
                  animate={{ 
                    rotate: 360
                  }}
                  transition={{ 
                    duration: 12, 
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{ width: '260px', height: '260px', left: '-30px', top: '-30px' }}
                >
                  <div className="w-3 h-3 bg-emerald-300 rounded-full absolute top-0 left-1/2 transform -translate-x-1/2 shadow-lg"></div>
                </motion.div>
                
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-white/20 rounded-full blur-xl scale-110"></div>
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1758798765770-15f4a7dfaf4b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGF0aGlwaHlsbHVtJTIwcGxhbnQlMjBsZWF2ZXMlMjBncmVlbnxlbnwxfHx8fDE3NTk1Nzc4OTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Spathiphyllum Plant"
                  className="relative z-10 w-48 h-48 object-cover rounded-full shadow-2xl border-4 border-white/20"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Analytics Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <HealthCard />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <SmartAnalysisCard />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <GrowthChart />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <TutorialCard />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="md:col-span-2 lg:col-span-1"
          >
            <RecentUpdatesCard />
          </motion.div>
          
          {/* Additional Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-gradient-to-br from-greenish-light/20 via-white to-emerald-50 rounded-2xl p-6 border border-greenish-light/30 hover:shadow-md transition-shadow duration-300"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="flex flex-wrap gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-greenish-mid text-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <Leaf size={16} />
                <span className="text-sm font-medium">View Plants</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <TrendingUp size={16} />
                <span className="text-sm font-medium">Analytics</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-greenish-light text-greenish-dark rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <Plus size={16} />
                <span className="text-sm font-medium">Add Plant</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}