"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { MiniNavbar } from "@/components/ui/mini-navbar";
import { ActivityCard } from "@/components/ActivityCard";
import { AlertCard } from "@/components/AlertCard";
import { StatCard } from "@/components/StatCard";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { AnalyticsPage } from "@/components/AnalyticsPage";
import { InsightsPage } from "@/components/InsightsPage";
import { ProfilePage } from "@/components/ProfilePage";
import { MapPage } from "@/components/MapPage";
import { AIChatWidget } from "@/components/AIChatWidget";
import { LocationCard } from "@/components/LocationCard";
import { DataSourceInfoButton, DataSourceInfoInline, DataSourceBadge } from "@/components/DataSourceDisclaimer";
import {
  getDashboardMetrics,
  getAllRegionsData,
  getDataLimitations
} from "@/services/airQualityService";
import type { DashboardMetrics, RegionalData } from "@/types/air-quality-api";

// Dynamic import to prevent SSR issues with Leaflet
const CarbonMap = dynamic(
  () => import("@/components/CarbonMap").then((mod) => mod.CarbonMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[500px] bg-white/5 backdrop-blur-sm rounded-2xl flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/70 text-sm">Loading map...</p>
        </div>
      </div>
    )
  }
);

export default function Home() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; city: string } | null>(null);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [regions, setRegions] = useState<RegionalData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Fetch real-time data from API
  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        const [metricsData, regionsData] = await Promise.all([
          getDashboardMetrics(),
          getAllRegionsData()
        ]);
        setMetrics(metricsData);
        setRegions(regionsData);
        setLastUpdated(new Date());
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    if (currentPage === 'dashboard') {
      fetchDashboardData();
    }
  }, [currentPage]);

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
  };

  const handleLocationDetected = (location: { lat: number; lng: number; city: string }) => {
    setUserLocation(location);
  };

  const handleRefreshData = async () => {
    try {
      setLoading(true);
      const [metricsData, regionsData] = await Promise.all([
        getDashboardMetrics(),
        getAllRegionsData()
      ]);
      setMetrics(metricsData);
      setRegions(regionsData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (currentPage === "analytics") {
    return (
      <>
        <AnalyticsPage onPageChange={handlePageChange} currentPage={currentPage} />
        <AIChatWidget />
      </>
    );
  }

  if (currentPage === "map") {
    return (
      <>
        <MapPage onPageChange={handlePageChange} currentPage={currentPage} />
        <AIChatWidget />
      </>
    );
  }

  if (currentPage === "insights") {
    return (
      <>
        <InsightsPage onPageChange={handlePageChange} currentPage={currentPage} />
        <AIChatWidget />
      </>
    );
  }

  if (currentPage === "profile") {
    return (
      <>
        <ProfilePage onPageChange={handlePageChange} currentPage={currentPage} />
        <AIChatWidget />
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-white pt-20 overflow-x-hidden w-full">
        <MiniNavbar currentPage={currentPage} onPageChange={handlePageChange} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
          {/* Hero Section */}
          <HeroSection
            onPageChange={handlePageChange}
            metrics={metrics}
            loading={loading}
            onRefresh={handleRefreshData}
            lastUpdated={lastUpdated}
          />

          {/* Floating Cards - Naik ke perbatasan */}
          <FloatingCards metrics={metrics} loading={loading} />          {/* Quick Stats Bar - Turun ke area putih */}
          <QuickStatsBar regions={regions} loading={loading} />

          {/* AI Insight Panel */}
          {/* AI Insight panel removed as requested */}

          {/* Regional Analysis Table */}
          <ContainersTable regions={regions} loading={loading} />

          {/* Footer */}
          <Footer />
        </div>
      </div>

      {/* Data Source Info Button - Floating */}
      <DataSourceInfoButton />

      {/* AI Chat Widget - Floating */}
      <AIChatWidget />
    </>
  );
}

// Component: Hero Section
function HeroSection({ onPageChange, metrics, loading, onRefresh, lastUpdated }: {
  onPageChange: (page: string) => void;
  metrics: DashboardMetrics | null;
  loading: boolean;
  onRefresh: () => void;
  lastUpdated: Date;
}) {
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [dateRange, setDateRange] = useState("last-30-days");

  // Create dynamic overview metrics from real data
  const overviewMetrics = [
    {
      label: "Global CO₂",
      value: loading ? "..." : `${metrics?.co2_average || 0} ppm`,
      icon: "🌫️",
      bgColor: "blue-500/20",
      trend: loading ? "..." : `${metrics?.emission_change || 0}%`
    },
    {
      label: "NDVI Average",
      value: loading ? "..." : `${metrics?.ndvi_index.toFixed(2) || '0.00'}`,
      icon: "🌳",
      bgColor: "green-500/20",
      trend: "-3.1%"
    },
    {
      label: "Air Quality Index",
      value: loading ? "..." : `${metrics?.aqi_average || 0}`,
      icon: "💨",
      bgColor: "orange-500/20",
      trend: loading ? "..." : getAQIStatus(metrics?.aqi_average || 0)
    },
  ];

  return (
    <section
      className="w-full relative text-white rounded-3xl overflow-hidden shadow-2xl pb-32 mb-8"
      style={{
        backgroundImage: 'linear-gradient(to bottom right, rgba(18, 48, 38, 0.9), rgba(18, 48, 38, 0.85)), url(/image/bg_Earth_Monitoring.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="px-4 sm:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-6 flex-wrap">
              <div className="w-2 h-2 bg-greenish-light rounded-full animate-pulse"></div>
              <span className="text-greenish-light/80 text-sm uppercase tracking-wider">Dashboard Overview</span>
              <span className="ml-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">
                Live Data
              </span>
              {/* Data Source Info - Inline */}
              <div className="ml-auto">
                <DataSourceInfoInline />
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-2">Earth Monitoring</h1>
            <p className="text-white/70 text-lg mb-6">Global Climate Overview at a Glance</p>

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-3 mb-8">
              {/* Region Selector */}
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/30 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 hover:bg-white/15 transition-all cursor-pointer"
              >
                <option value="all" className="bg-greenish-dark">🌍 All Regions</option>
                <option value="asia" className="bg-greenish-dark">🌏 Asia</option>
                <option value="europe" className="bg-greenish-dark">🌍 Europe</option>
                <option value="americas" className="bg-greenish-dark">🌎 Americas</option>
                <option value="africa" className="bg-greenish-dark">🌍 Africa</option>
                <option value="oceania" className="bg-greenish-dark">🌏 Oceania</option>
              </select>

              {/* Date Range Picker */}
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/30 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 hover:bg-white/15 transition-all cursor-pointer"
              >
                <option value="last-7-days" className="bg-greenish-dark">📅 Last 7 days</option>
                <option value="last-30-days" className="bg-greenish-dark">📅 Last 30 days</option>
                <option value="last-90-days" className="bg-greenish-dark">📅 Last 90 days</option>
                <option value="last-year" className="bg-greenish-dark">📅 Last Year</option>
                <option value="custom" className="bg-greenish-dark">📅 Custom Range</option>
              </select>

              {/* Refresh Button */}
              <button
                className="px-4 py-2 bg-emerald-500/30 backdrop-blur-md border border-emerald-400/50 rounded-lg text-white text-sm font-semibold hover:bg-emerald-500/50 transition-all flex items-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={onRefresh}
                disabled={loading}
              >
                <svg className={`w-4 h-4 ${loading ? 'animate-spin' : 'group-hover:rotate-180'} transition-transform duration-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>

            {/* Last Updated Info */}
            <div className="text-xs text-white/50 mb-4">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {overviewMetrics.map((metric, index) => (
                <MetricCard key={index} {...metric} />
              ))}
            </div>

            {/* CTA ke Analytics */}
            <div className="mt-6">
              <button
                onClick={() => onPageChange('analytics')}
                className="px-6 py-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-lg text-white font-semibold hover:bg-white/30 transition-all flex items-center gap-2"
              >
                View Detailed Analytics
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
          </div>

          {/* Logo Dashboard */}
          <div className="relative flex-shrink-0 flex items-center justify-center">
            <ImageWithFallback
              src="/image/logo_dashboard.png"
              alt="Karwanua Logo"
              className="w-[500px] h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// Component: Metric Card
function MetricCard({ label, value, icon, bgColor, trend }: any) {
  const isPositive = trend && trend.startsWith('+');
  const isNegative = trend && trend.startsWith('-');

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 hover:bg-white/15 transition-all duration-300 shadow-lg">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="text-3xl">{icon}</span>
          <p className="text-white/70 text-sm font-medium">{label}</p>
        </div>
        <div className="flex items-baseline gap-2">
          <p className="text-3xl font-bold text-white">{value}</p>
          {trend && (
            <span className={`text-xs px-2 py-1 rounded-full ${isPositive && label.includes('CO') ? 'bg-red-500/20 text-red-300' :
              isPositive ? 'bg-green-500/20 text-green-300' :
                isNegative ? 'bg-red-500/20 text-red-300' :
                  'bg-gray-500/20 text-gray-300'
              }`}>
              {trend}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// Component: Quick Stats Bar
function QuickStatsBar({ regions, loading }: { regions: RegionalData[]; loading: boolean }) {
  // Calculate dynamic stats from real data
  const statsData = [
    { label: "Active Regions", value: loading ? "..." : regions.length.toString(), icon: "🌍", color: "blue" },
    { label: "Data Sources", value: "1", icon: "📡", color: "purple" },
    { label: "Alerts", value: loading ? "..." : regions.filter(r => r.status === 'critical' || r.status === 'warning').length.toString(), icon: "⚠️", color: "orange" },
    { label: "Live Data", value: loading ? "..." : "99.9%", icon: "🧠", color: "green" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="relative mt-8 z-0 mb-4"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statsData.map((stat, index) => (
          <StatBox key={index} {...stat} />
        ))}
      </div>
    </motion.div>
  );
}

// Component: Stat Box
function StatBox({ label, value, icon, color }: any) {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500 mb-1">{label}</p>
          <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
        </div>
        <div className={`w-10 h-10 bg-${color}-100 rounded-lg flex items-center justify-center`}>
          <span className="text-lg">{icon}</span>
        </div>
      </div>
    </div>
  );
}

// Component: Floating Cards
function FloatingCards({ metrics, loading }: { metrics: DashboardMetrics | null; loading: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="relative -mt-24 z-10 mb-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
          <StatCard />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
          <AlertCard />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
          <ActivityCard />
        </motion.div>
      </div>
    </motion.div>
  );
}

// Component: Containers Table (transformed to Regional Analysis)
function ContainersTable({ regions, loading }: { regions: RegionalData[]; loading: boolean }) {
  // Show top 5 regions (or all if less than 5)
  const displayRegions = regions.slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="mt-8 bg-white rounded-2xl shadow-lg p-6 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Regional Air Quality & CO₂ Data</h2>
          <p className="text-sm text-gray-500 mt-1">
            {loading ? 'Loading...' : `Showing ${displayRegions.length} region${displayRegions.length !== 1 ? 's' : ''} • Live data from Open-Meteo API`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DataSourceBadge />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading regional data...</p>
        </div>
      ) : displayRegions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No regional data available</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Region</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">CO₂ (ppm)</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Change</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">AQI</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Updated</th>
              </tr>
            </thead>
            <tbody>
              {displayRegions.map((region, index) => (
                <ContainerRow key={index} container={region} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
}

// Component: Container Row (transformed to Region Row) - Simplified for Dashboard
function ContainerRow({ container }: { container: RegionalData }) {
  const getCO2Color = (co2: number) => {
    if (co2 >= 420) return "text-red-600";
    if (co2 >= 410) return "text-orange-600";
    return "text-green-600";
  };

  const getStatusColor = (status: string) => {
    if (status === 'critical') return { bg: 'bg-red-100', text: 'text-red-700' };
    if (status === 'warning') return { bg: 'bg-orange-100', text: 'text-orange-700' };
    return { bg: 'bg-green-100', text: 'text-green-700' };
  };

  const statusColors = getStatusColor(container.status);
  const changeColor = container.emission_change > 0 ? 'text-red-600' : 'text-green-600';
  const changeSign = container.emission_change > 0 ? '+' : '';

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <td className="py-4 px-4 text-gray-800 font-semibold">{container.region}</td>
      <td className="py-4 px-4">
        <span className={`font-bold ${getCO2Color(container.co2)}`}>{container.co2} ppm</span>
      </td>
      <td className="py-4 px-4">
        <span className={`font-semibold ${changeColor}`}>
          {changeSign}{container.emission_change.toFixed(1)}%
        </span>
      </td>
      <td className="py-4 px-4">
        <span className="font-semibold">{container.aqi}</span>
      </td>
      <td className="py-4 px-4">
        <span className={`px-3 py-1 ${statusColors.bg} ${statusColors.text} rounded-full text-sm font-medium capitalize`}>
          {container.status}
        </span>
      </td>
      <td className="py-4 px-4 text-gray-500 text-sm">
        {new Date(container.updated).toLocaleTimeString()}
      </td>
    </tr>
  );
}

// Component: AI Insight Panel
// AI Insight panel removed as requested

// Component: Footer
function Footer() {
  const limitations = getDataLimitations();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="mt-12 pb-8 text-center text-gray-500 text-sm"
    >
      <div className="flex items-center justify-center gap-4 mb-4">
        <button className="hover:text-greenish-dark transition-colors">Documentation</button>
        <span>•</span>
        <button className="hover:text-greenish-dark transition-colors">API Status</button>
        <span>•</span>
        <button className="hover:text-greenish-dark transition-colors">Support</button>
      </div>
      <p>Powered by {limitations.source} | Karwanua Project</p>
    </motion.div>
  );
}

// Helper Functions
function getAQIStatus(aqi: number): string {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy (Sensitive)';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
}