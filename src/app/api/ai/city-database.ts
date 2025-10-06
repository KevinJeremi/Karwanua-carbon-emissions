/**
 * City Coordinates Database
 * Common Indonesian cities and their coordinates
 */

export const CITY_COORDINATES: Record<string, { lat: number; lon: number; name: string }> = {
    // Jakarta & sekitarnya
    'jakarta': { lat: -6.2088, lon: 106.8456, name: 'Jakarta' },
    'jakarta pusat': { lat: -6.1753, lon: 106.8242, name: 'Jakarta Pusat' },
    'jakarta selatan': { lat: -6.2614, lon: 106.8106, name: 'Jakarta Selatan' },
    'jakarta utara': { lat: -6.1388, lon: 106.8827, name: 'Jakarta Utara' },
    'jakarta barat': { lat: -6.1674, lon: 106.7631, name: 'Jakarta Barat' },
    'jakarta timur': { lat: -6.2615, lon: 106.8983, name: 'Jakarta Timur' },

    // Kalimantan
    'pontianak': { lat: -0.0263, lon: 109.3425, name: 'Pontianak' },
    'banjarmasin': { lat: -3.3194, lon: 114.5908, name: 'Banjarmasin' },
    'balikpapan': { lat: -1.2379, lon: 116.8529, name: 'Balikpapan' },
    'samarinda': { lat: -0.4949, lon: 117.1436, name: 'Samarinda' },
    'palangkaraya': { lat: -2.2090, lon: 113.9213, name: 'Palangkaraya' },
    'kalimantan': { lat: -1.5, lon: 114.0, name: 'Kalimantan (Central)' },
    'kalimantan barat': { lat: -0.0263, lon: 109.3425, name: 'Kalimantan Barat' },
    'kalimantan tengah': { lat: -2.2090, lon: 113.9213, name: 'Kalimantan Tengah' },
    'kalimantan selatan': { lat: -3.3194, lon: 114.5908, name: 'Kalimantan Selatan' },
    'kalimantan timur': { lat: -1.2379, lon: 116.8529, name: 'Kalimantan Timur' },

    // Jawa
    'bandung': { lat: -6.9175, lon: 107.6191, name: 'Bandung' },
    'surabaya': { lat: -7.2575, lon: 112.7521, name: 'Surabaya' },
    'semarang': { lat: -6.9932, lon: 110.4203, name: 'Semarang' },
    'yogyakarta': { lat: -7.7956, lon: 110.3695, name: 'Yogyakarta' },
    'malang': { lat: -7.9666, lon: 112.6326, name: 'Malang' },
    'solo': { lat: -7.5755, lon: 110.8243, name: 'Solo' },
    'bogor': { lat: -6.5950, lon: 106.8163, name: 'Bogor' },
    'bekasi': { lat: -6.2349, lon: 106.9896, name: 'Bekasi' },
    'tangerang': { lat: -6.1783, lon: 106.6319, name: 'Tangerang' },
    'depok': { lat: -6.4025, lon: 106.7942, name: 'Depok' },

    // Sumatera
    'medan': { lat: 3.5952, lon: 98.6722, name: 'Medan' },
    'palembang': { lat: -2.9761, lon: 104.7754, name: 'Palembang' },
    'pekanbaru': { lat: 0.5071, lon: 101.4478, name: 'Pekanbaru' },
    'lampung': { lat: -5.3971, lon: 105.2668, name: 'Lampung' },
    'aceh': { lat: 5.5483, lon: 95.3238, name: 'Aceh' },
    'padang': { lat: -0.9471, lon: 100.4172, name: 'Padang' },
    'jambi': { lat: -1.5926, lon: 103.6105, name: 'Jambi' },

    // Sulawesi
    'makassar': { lat: -5.1477, lon: 119.4327, name: 'Makassar' },
    'manado': { lat: 1.4748, lon: 124.8421, name: 'Manado' },
    'palu': { lat: -0.8999, lon: 119.8707, name: 'Palu' },
    'kendari': { lat: -3.9450, lon: 122.5989, name: 'Kendari' },

    // Bali & Nusa Tenggara
    'bali': { lat: -8.3405, lon: 115.0920, name: 'Bali' },
    'denpasar': { lat: -8.6705, lon: 115.2126, name: 'Denpasar' },
    'mataram': { lat: -8.5833, lon: 116.1167, name: 'Mataram' },
    'kupang': { lat: -10.1718, lon: 123.6075, name: 'Kupang' },

    // Papua
    'jayapura': { lat: -2.5333, lon: 140.7167, name: 'Jayapura' },
    'papua': { lat: -4.2699, lon: 138.0804, name: 'Papua' },

    // Maluku
    'ambon': { lat: -3.6954, lon: 128.1814, name: 'Ambon' },
    'ternate': { lat: 0.7875, lon: 127.3636, name: 'Ternate' },
};

/**
 * Find city coordinates with fuzzy matching
 */
export function findCityCoordinates(query: string): { lat: number; lon: number; name: string } | null {
    const normalizedQuery = query.toLowerCase().trim();

    // Exact match first
    if (CITY_COORDINATES[normalizedQuery]) {
        return CITY_COORDINATES[normalizedQuery];
    }

    // Fuzzy match - contains
    for (const [key, value] of Object.entries(CITY_COORDINATES)) {
        if (key.includes(normalizedQuery) || normalizedQuery.includes(key)) {
            return value;
        }
    }

    return null;
}

/**
 * Extract city name from user query
 */
export function extractCityFromQuery(query: string): string | null {
    const normalizedQuery = query.toLowerCase();

    // Common patterns
    const patterns = [
        /(?:co2|co₂|kualitas udara|udara|emisi|karbon)\s+(?:di|at|in|untuk|untuk daerah)\s+([a-z\s]+)/i,
        /(?:cek|check|lihat|info|data|tanya)\s+(?:co2|co₂|kualitas udara|udara)?\s*(?:di|at|in)?\s+([a-z\s]+)/i,
        /([a-z\s]+)\s+(?:co2|co₂|kualitas udara|punya co2 berapa)/i,
        /(?:akses|ambil)\s+(?:co2|co₂|data)?\s*(?:di|at|in)?\s+([a-z\s]+)/i,
    ];

    for (const pattern of patterns) {
        const match = normalizedQuery.match(pattern);
        if (match && match[1]) {
            return match[1].trim();
        }
    }

    // If query is just a city name
    const cityMatch = findCityCoordinates(normalizedQuery);
    if (cityMatch) {
        return normalizedQuery;
    }

    return null;
}

/**
 * Extract multiple cities from comparison query
 * Example: "bandingkan CO₂ di Jakarta dengan Surabaya"
 */
export function extractCitiesFromComparisonQuery(query: string): string[] {
    const normalizedQuery = query.toLowerCase();
    const cities: string[] = [];

    // Check if it's a comparison query
    const isComparison = /bandingkan|compare|versus|vs|dengan|and/.test(normalizedQuery);
    
    if (!isComparison) {
        const singleCity = extractCityFromQuery(query);
        return singleCity ? [singleCity] : [];
    }

    // Pattern untuk comparison: "bandingkan X dengan Y" atau "X vs Y"
    const comparisonPatterns = [
        /(?:bandingkan|compare)\s+(?:co2|co₂)?\s*(?:di|at|in)?\s+([a-z\s]+?)\s+(?:dengan|dan|and|vs|versus)\s+([a-z\s]+)/i,
        /(?:co2|co₂)\s+(?:di|at|in)\s+([a-z\s]+?)\s+(?:dengan|dan|and|vs|versus)\s+([a-z\s]+)/i,
        /([a-z\s]+?)\s+(?:vs|versus)\s+([a-z\s]+)/i,
    ];

    for (const pattern of comparisonPatterns) {
        const match = normalizedQuery.match(pattern);
        if (match) {
            const city1 = match[1]?.trim();
            const city2 = match[2]?.trim();
            
            if (city1 && findCityCoordinates(city1)) {
                cities.push(city1);
            }
            if (city2 && findCityCoordinates(city2)) {
                cities.push(city2);
            }
            
            if (cities.length > 0) {
                return cities;
            }
        }
    }

    // Fallback: extract all city names mentioned in query
    for (const cityKey of Object.keys(CITY_COORDINATES)) {
        if (normalizedQuery.includes(cityKey)) {
            cities.push(cityKey);
        }
    }

    return cities.length > 0 ? cities : [];
}
