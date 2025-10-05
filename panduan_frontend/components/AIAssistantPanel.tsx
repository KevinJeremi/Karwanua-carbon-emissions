import { Bot, TreePine, Zap, Droplets, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

export function AIAssistantPanel() {
  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-[#EAF9E7]/50 to-white dark:from-[#013237]/20 dark:to-gray-800">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-[#4CA771]" />
          <CardTitle className="text-gray-900 dark:text-white">AI Insight Summary</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* AI Summary */}
        <div className="space-y-3">
          <div className="p-4 bg-white/60 dark:bg-gray-700/60 rounded-lg backdrop-blur-sm">
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              CO₂ levels have increased by <strong>14.2%</strong> in Southeast Asia since 2010. 
              Major emission hotspots detected around Jakarta, Manila, and Mumbai. 
              The atmospheric concentration reached a record high of <strong>426.8 ppm</strong> in 2024.
            </p>
          </div>
          
          <div className="p-4 bg-white/60 dark:bg-gray-700/60 rounded-lg backdrop-blur-sm">
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              Vegetation index shows concerning decline in tropical regions, 
              particularly affecting carbon absorption capacity. 
              Temperature anomalies suggest accelerated warming trends.
            </p>
          </div>
        </div>

        {/* Suggested Actions */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900 dark:text-white">Suggested Actions</h4>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-white/40 dark:bg-gray-700/40 rounded-lg">
              <div className="p-1 bg-[#4CA771] rounded">
                <TreePine className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Reforestation Priority</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Focus on Southeast Asian regions</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-white/40 dark:bg-gray-700/40 rounded-lg">
              <div className="p-1 bg-[#4CA771] rounded">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Clean Energy Transition</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Accelerate renewable adoption</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-white/40 dark:bg-gray-700/40 rounded-lg">
              <div className="p-1 bg-[#4CA771] rounded">
                <Droplets className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Ocean Conservation</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Protect blue carbon ecosystems</p>
              </div>
            </div>
          </div>
        </div>

        {/* Confidence & Refresh */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-600">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-[#4CA771]/10 text-[#4CA771]">
              95% Confidence
            </Badge>
          </div>
          <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400">
            <RefreshCw className="w-4 h-4 mr-1" />
            Refresh
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}