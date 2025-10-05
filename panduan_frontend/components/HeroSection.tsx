import { Globe, Calendar, BarChart3 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-[#EAF9E7] to-white dark:from-[#013237] dark:to-gray-900 px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left: Headlines and Filters */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
                Global Emission Insight
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Powered by NASA Earth Observation Data
              </p>
            </div>

            {/* Filter Cards */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Card className="p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#4CA771]" />
                  <Select defaultValue="global">
                    <SelectTrigger className="border-0 bg-transparent p-0 h-auto">
                      <SelectValue placeholder="Select Region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="global">Global</SelectItem>
                      <SelectItem value="north-america">North America</SelectItem>
                      <SelectItem value="europe">Europe</SelectItem>
                      <SelectItem value="asia">Asia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </Card>

              <Card className="p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#4CA771]" />
                  <Select defaultValue="2024">
                    <SelectTrigger className="border-0 bg-transparent p-0 h-auto">
                      <SelectValue placeholder="Date Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2022">2022</SelectItem>
                      <SelectItem value="2021">2021</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </Card>

              <Card className="p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-[#4CA771]" />
                  <Select defaultValue="co2">
                    <SelectTrigger className="border-0 bg-transparent p-0 h-auto">
                      <SelectValue placeholder="Dataset" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="co2">CO₂</SelectItem>
                      <SelectItem value="no2">NO₂</SelectItem>
                      <SelectItem value="temp">Temperature</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </Card>
            </div>
          </div>

          {/* Right: Earth Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1734764857135-85bd751da64c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxFYXJ0aCUyMGZyb20lMjBzcGFjZSUyME5BU0F8ZW58MXx8fHwxNzU5NTc1ODQ3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Earth from space"
                className="w-full h-[400px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#4CA771]/20 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}