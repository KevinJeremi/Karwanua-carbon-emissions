import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import { ActivityCard } from "./components/ActivityCard";
import { AlertCard } from "./components/AlertCard";
import { StatCard } from "./components/StatCard";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import { AnalyticsPage } from "./components/AnalyticsPage";

export default function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");

  useEffect(() => {
    // Global function to switch to analytics (for backwards compatibility)
    (window as any).showAnalytics = () => setCurrentPage("analytics");
  }, []);

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
  };

  if (currentPage === "analytics") {
    return <AnalyticsPage />;
  }

  return (
    <div className="min-h-screen bg-greenish-bg">
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Integrated Navbar + Overview Section */}
        <section className="relative bg-gradient-to-br from-greenish-dark to-greenish-mid text-white rounded-3xl overflow-hidden">
          {/* Navbar integrated into the green section */}
          <div className="p-6 pb-0">
            <Navbar currentPage={currentPage} onPageChange={handlePageChange} />
          </div>
          
          {/* Overview Content */}
          <div className="p-10 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 bg-greenish-light rounded-full animate-pulse"></div>
                  <span className="text-greenish-light/80 text-sm uppercase tracking-wider">Live Monitoring</span>
                </div>
                <h1 className="text-4xl font-semibold mb-4">Overview</h1>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <span className="text-xl">💧</span>
                      </div>
                      <div>
                        <p className="text-white/70 text-sm">Water Level</p>
                        <p className="text-xl font-semibold">85%</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                        <span className="text-xl">⚗️</span>
                      </div>
                      <div>
                        <p className="text-white/70 text-sm">pH Level</p>
                        <p className="text-xl font-semibold">6.5</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                        <span className="text-xl">🌡</span>
                      </div>
                      <div>
                        <p className="text-white/70 text-sm">Temperature</p>
                        <p className="text-xl font-semibold">24°C</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Enhanced Plant Image */}
              <div className="relative mt-8 md:mt-0">
                <div className="absolute inset-0 bg-gradient-to-r from-greenish-light/20 to-white/20 rounded-full blur-xl scale-110"></div>
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1726119007164-922f6ddc98ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMHBsYW50JTIwY29udGFpbmVyJTIwaHlkcm9wb25pY3xlbnwxfHx8fDE3NTk1NzYzMzl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Plant"
                  className="relative z-10 w-56 h-auto drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Floating Cards Section */}
        <div className="relative -mt-32 px-6 z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard />
            <AlertCard />
            <ActivityCard />
          </div>
        </div>
      </div>
    </div>
  );
}