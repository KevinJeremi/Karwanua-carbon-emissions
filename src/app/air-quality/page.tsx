import AirQualityMonitor from '@/components/AirQualityMonitor';

export default function AirQualityPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
            <div className="max-w-7xl mx-auto">
                <AirQualityMonitor
                    autoRefresh={false}
                    refreshInterval={3600000} // 1 hour
                    defaultLocation={{
                        name: 'Jakarta',
                        latitude: -6.2088,
                        longitude: 106.8456,
                    }}
                />
            </div>
        </div>
    );
}
