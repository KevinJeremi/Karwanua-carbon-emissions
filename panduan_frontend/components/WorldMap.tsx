import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function WorldMap() {
  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-white">
          Global Emission Heatmap
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-[400px] bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 rounded-lg overflow-hidden">
          {/* Simplified world map representation */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full h-full">
              {/* Simulated world map with emission hotspots */}
              <svg viewBox="0 0 800 400" className="w-full h-full">
                {/* Background ocean */}
                <rect width="800" height="400" fill="#e0f2fe" className="dark:fill-gray-700" />
                
                {/* Simplified continents */}
                <path d="M100 150 Q200 100 300 120 Q400 140 500 130 Q600 120 700 150 L700 250 Q600 280 500 270 Q400 260 300 280 Q200 300 100 250 Z" 
                      fill="#94a3b8" className="dark:fill-gray-600" />
                <path d="M150 200 Q250 180 350 190 Q450 200 550 195 L550 320 Q450 340 350 330 Q250 320 150 300 Z" 
                      fill="#94a3b8" className="dark:fill-gray-600" />
                
                {/* Emission hotspots */}
                <circle cx="200" cy="180" r="15" fill="#ef4444" opacity="0.8" />
                <circle cx="350" cy="190" r="20" fill="#dc2626" opacity="0.8" />
                <circle cx="480" cy="200" r="18" fill="#b91c1c" opacity="0.8" />
                <circle cx="580" cy="210" r="12" fill="#f97316" opacity="0.7" />
                <circle cx="280" cy="240" r="14" fill="#ea580c" opacity="0.7" />
                
                {/* Lower intensity areas */}
                <circle cx="420" cy="160" r="10" fill="#fbbf24" opacity="0.6" />
                <circle cx="320" cy="220" r="8" fill="#f59e0b" opacity="0.6" />
                <circle cx="150" cy="230" r="6" fill="#eab308" opacity="0.5" />
              </svg>
            </div>
          </div>
          
          {/* Legend */}
          <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-3 rounded-lg">
            <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">CO₂ Levels (ppm)</div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-400 rounded"></div>
                <span className="text-xs text-gray-600 dark:text-gray-400">Low</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-yellow-400 rounded"></div>
                <span className="text-xs text-gray-600 dark:text-gray-400">Med</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span className="text-xs text-gray-600 dark:text-gray-400">High</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}