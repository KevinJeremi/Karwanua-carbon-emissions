import { Card } from '@/components/ui/card';
import MapClient from '@/components/MapClient';

export default function MapPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-green-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-8 px-6 shadow-lg">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                        🗺️ Karwanua Interactive Map
                    </h1>
                    <p className="text-blue-100 text-lg">
                        Real-time satellite imagery & air quality monitoring powered by NASA GIBS & Open-Meteo
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-6 space-y-6">
                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-4 border-l-4 border-blue-500">
                        <div className="flex items-center gap-3">
                            <span className="text-3xl">🛰️</span>
                            <div>
                                <h3 className="font-bold text-gray-800">NASA GIBS Layers</h3>
                                <p className="text-sm text-gray-600">
                                    6 satellite data layers including fire detection, NDVI, and pollution
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4 border-l-4 border-green-500">
                        <div className="flex items-center gap-3">
                            <span className="text-3xl">🌫️</span>
                            <div>
                                <h3 className="font-bold text-gray-800">Air Quality Data</h3>
                                <p className="text-sm text-gray-600">
                                    Real-time CO₂, PM2.5, PM10 measurements from Open-Meteo
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4 border-l-4 border-orange-500">
                        <div className="flex items-center gap-3">
                            <span className="text-3xl">📍</span>
                            <div>
                                <h3 className="font-bold text-gray-800">7 Monitoring Stations</h3>
                                <p className="text-sm text-gray-600">
                                    Coverage across Indonesia, Brazil, and USA
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Interactive Map */}
                <Card className="p-0 overflow-hidden shadow-xl">
                    <MapClient />
                </Card>

                {/* Instructions */}
                <Card className="p-6">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        📖 How to Use
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                                🛰️ Satellite Layers
                            </h3>
                            <ul className="space-y-2 text-sm text-gray-700">
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-500 font-bold">•</span>
                                    <span><strong>True Color:</strong> Natural satellite imagery from MODIS Terra</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-orange-500 font-bold">•</span>
                                    <span><strong>Fire Detection:</strong> Active fires and thermal anomalies</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-gray-500 font-bold">•</span>
                                    <span><strong>Air Pollution:</strong> Aerosol optical depth visualization</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-500 font-bold">•</span>
                                    <span><strong>Vegetation (NDVI):</strong> Plant health and density</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-purple-500 font-bold">•</span>
                                    <span><strong>Carbon Monoxide:</strong> CO concentration levels</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-500 font-bold">•</span>
                                    <span><strong>Temperature:</strong> Land surface temperature</span>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                                🎮 Controls
                            </h3>
                            <ul className="space-y-2 text-sm text-gray-700">
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-500 font-bold">1.</span>
                                    <span><strong>Layer Selection:</strong> Click on any layer button to change satellite view</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-500 font-bold">2.</span>
                                    <span><strong>Date Picker:</strong> Select historical dates (up to yesterday)</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-500 font-bold">3.</span>
                                    <span><strong>Air Quality Toggle:</strong> Show/hide real-time air quality markers</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-500 font-bold">4.</span>
                                    <span><strong>Marker Click:</strong> Click any colored marker to see detailed air quality data</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-500 font-bold">5.</span>
                                    <span><strong>Map Navigation:</strong> Zoom with mouse wheel, drag to pan</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </Card>

                {/* Data Sources */}
                <Card className="p-6 bg-gradient-to-r from-blue-50 to-green-50">
                    <h2 className="text-xl font-bold mb-4">📊 Data Sources</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-2xl">🛰️</span>
                                <h3 className="font-semibold">NASA GIBS</h3>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                                Global Imagery Browse Services - Satellite imagery and environmental data
                            </p>
                            <a
                                href="https://worldview.earthdata.nasa.gov/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline text-sm"
                            >
                                View NASA Worldview Demo →
                            </a>
                        </div>

                        <div className="bg-white p-4 rounded-lg shadow-sm">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-2xl">🌫️</span>
                                <h3 className="font-semibold">Open-Meteo</h3>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                                Open-source weather and air quality API with global coverage
                            </p>
                            <a
                                href="https://open-meteo.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline text-sm"
                            >
                                Learn more about Open-Meteo →
                            </a>
                        </div>
                    </div>
                </Card>

                {/* Footer Note */}
                <div className="text-center text-sm text-gray-500 py-4">
                    <p>
                        🌍 Karwanua combines cutting-edge satellite technology with real-time air quality monitoring
                    </p>
                    <p className="mt-1">
                        Data updates: Satellite imagery (daily) | Air Quality (hourly)
                    </p>
                </div>
            </div>
        </div>
    );
}
