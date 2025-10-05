/**
 * Testing Script untuk API CO₂ dan Air Quality
 * Run: npx ts-node src/test/api-test.ts
 */

// 1. Test Open-Meteo Air Quality API
async function testOpenMeteoAirQuality() {
    console.log('\n🧪 Testing Open-Meteo Air Quality API...\n');

    try {
        // Jakarta coordinates
        const lat = -6.2088;
        const lon = 106.8456;

        // Current + Forecast
        const currentUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=carbon_dioxide,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,us_aqi&timezone=Asia/Jakarta`;

        const response = await fetch(currentUrl);
        const data = await response.json();

        console.log('✅ Open-Meteo Current Data:');
        console.log(JSON.stringify(data, null, 2));

        // Historical (past 7 days)
        const historicalUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&hourly=carbon_dioxide,pm10,pm2_5&past_days=7&timezone=Asia/Jakarta`;

        const histResponse = await fetch(historicalUrl);
        const histData = await histResponse.json();

        console.log('\n✅ Open-Meteo Historical (7 days):');
        console.log('Total hours:', histData.hourly?.time?.length);
        console.log('Sample:', {
            time: histData.hourly?.time?.slice(0, 3),
            co2: histData.hourly?.carbon_dioxide?.slice(0, 3)
        });

        return { success: true, data, histData };
    } catch (error) {
        console.error('❌ Open-Meteo Error:', error);
        return { success: false, error };
    }
}

// 2. Test OpenWeather Air Pollution API
async function testOpenWeatherAirPollution() {
    console.log('\n🧪 Testing OpenWeather Air Pollution API...\n');

    try {
        // Note: Requires API key (free tier available)
        const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || 'YOUR_API_KEY';

        if (API_KEY === 'YOUR_API_KEY') {
            console.log('⚠️  OpenWeather requires API key. Get free key at: https://openweathermap.org/api');
            console.log('   Set NEXT_PUBLIC_OPENWEATHER_API_KEY in .env.local');
            return { success: false, error: 'API key required' };
        }

        const lat = -6.2088;
        const lon = 106.8456;

        // Current air pollution
        const currentUrl = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

        const response = await fetch(currentUrl);
        const data = await response.json();

        console.log('✅ OpenWeather Current Air Pollution:');
        console.log(JSON.stringify(data, null, 2));

        // Historical (from Nov 2020)
        const now = Math.floor(Date.now() / 1000);
        const sevenDaysAgo = now - (7 * 24 * 60 * 60);

        const histUrl = `http://api.openweathermap.org/data/2.5/air_pollution/history?lat=${lat}&lon=${lon}&start=${sevenDaysAgo}&end=${now}&appid=${API_KEY}`;

        const histResponse = await fetch(histUrl);
        const histData = await histResponse.json();

        console.log('\n✅ OpenWeather Historical (7 days):');
        console.log('Total records:', histData.list?.length);

        return { success: true, data, histData };
    } catch (error) {
        console.error('❌ OpenWeather Error:', error);
        return { success: false, error };
    }
}

// 3. Test NASA/NOAA CO₂ APIs
async function testNASACO2() {
    console.log('\n🧪 Testing NASA CO₂ APIs...\n');

    try {
        // NASA API requires key (free)
        const NASA_API_KEY = process.env.NEXT_PUBLIC_NASA_API_KEY || 'DEMO_KEY';

        console.log('ℹ️  Using NASA API key:', NASA_API_KEY === 'DEMO_KEY' ? 'DEMO_KEY (limited)' : 'Custom key');

        // Note: NASA's CO2 Virtual Data Environment might have specific endpoints
        // For now, we'll test general Earth data API
        const url = `https://api.nasa.gov/planetary/earth/assets?lon=100.75&lat=1.5&date=2024-01-01&dim=0.15&api_key=${NASA_API_KEY}`;

        const response = await fetch(url);
        const data = await response.json();

        console.log('✅ NASA API Response (sample):');
        console.log(JSON.stringify(data, null, 2));

        // NOAA Mauna Loa CO₂ (public CSV data)
        console.log('\n📊 NOAA Mauna Loa CO₂ Data:');
        console.log('   Available at: https://gml.noaa.gov/webdata/ccgg/trends/co2/co2_weekly_mlo.csv');
        console.log('   This is CSV format, needs parsing');

        const noaaUrl = 'https://gml.noaa.gov/webdata/ccgg/trends/co2/co2_weekly_mlo.csv';
        const noaaResponse = await fetch(noaaUrl);
        const csvText = await noaaResponse.text();
        const lines = csvText.split('\n').slice(0, 10); // First 10 lines

        console.log('   Sample data:');
        lines.forEach(line => console.log('   ', line));

        return { success: true, data, noaaPreview: lines };
    } catch (error) {
        console.error('❌ NASA/NOAA Error:', error);
        return { success: false, error };
    }
}

// Run all tests
async function runAllTests() {
    console.log('🚀 Starting API Tests...');
    console.log('='.repeat(60));

    const results = {
        openMeteo: await testOpenMeteoAirQuality(),
        openWeather: await testOpenWeatherAirPollution(),
        nasa: await testNASACO2()
    };

    console.log('\n' + '='.repeat(60));
    console.log('📊 TEST SUMMARY');
    console.log('='.repeat(60));
    console.log('Open-Meteo Air Quality:', results.openMeteo.success ? '✅ PASS' : '❌ FAIL');
    console.log('OpenWeather Air Pollution:', results.openWeather.success ? '✅ PASS' : '⚠️  NEEDS API KEY');
    console.log('NASA/NOAA CO₂:', results.nasa.success ? '✅ PASS' : '❌ FAIL');
    console.log('='.repeat(60));

    console.log('\n💡 Recommendation:');
    if (results.openMeteo.success) {
        console.log('   ✅ Use Open-Meteo as PRIMARY source (no API key needed)');
        console.log('   📊 Covers: CO₂, PM10, PM2.5, NO₂, SO₂, O₃, CO, AQI');
        console.log('   📅 Historical: Up to 92 days');
    }

    if (results.openWeather.success) {
        console.log('   ✅ Use OpenWeather for HISTORICAL data (from Nov 2020)');
    } else {
        console.log('   ⚠️  OpenWeather needs free API key for historical data');
    }

    console.log('   📈 Use NOAA CSV for long-term CO₂ trends (static data)');

    return results;
}

// Execute
runAllTests().catch(console.error);
