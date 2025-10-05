import { Database, MapPin, Calendar, Play } from "lucide-react";
import { Card } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Slider } from "./ui/slider";
import { Button } from "./ui/button";
import { Label } from "./ui/label";

export function FilterSidebar() {
  return (
    <Card className="p-6 space-y-6 bg-[#EAF9E7]/30 dark:bg-gray-800/30 border-0 shadow-lg">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h3>
      
      {/* Dataset Selection */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-[#4CA771]" />
          <Label>Dataset</Label>
        </div>
        <Select defaultValue="neo">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="neo">NASA Earth Observations (NEO)</SelectItem>
            <SelectItem value="power">POWER API</SelectItem>
            <SelectItem value="modis">MODIS Terra/Aqua</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Area Selection */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#4CA771]" />
          <Label>Select Area</Label>
        </div>
        <Select defaultValue="global">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="global">Global</SelectItem>
            <SelectItem value="draw">Draw AOI Polygon</SelectItem>
            <SelectItem value="north-america">North America</SelectItem>
            <SelectItem value="europe">Europe</SelectItem>
            <SelectItem value="asia">Asia Pacific</SelectItem>
            <SelectItem value="africa">Africa</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Time Range */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#4CA771]" />
          <Label>Time Range</Label>
        </div>
        <div className="space-y-4">
          <div className="px-3">
            <Slider
              defaultValue={[2020, 2024]}
              max={2024}
              min={2010}
              step={1}
              className="w-full"
            />
          </div>
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>2010</span>
            <span>2024</span>
          </div>
        </div>
      </div>

      {/* Run Analysis Button */}
      <Button className="w-full bg-[#4CA771] hover:bg-[#013237] text-white">
        <Play className="w-4 h-4 mr-2" />
        Run Analysis
      </Button>
    </Card>
  );
}