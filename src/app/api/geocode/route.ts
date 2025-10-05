import { NextRequest, NextResponse } from 'next/server';

/**
 * Reverse Geocoding API Route
 * Menggunakan Nominatim OpenStreetMap untuk mendapatkan nama lokasi dari koordinat
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const lat = searchParams.get('lat');
        const lon = searchParams.get('lon');

        if (!lat || !lon) {
            return NextResponse.json(
                { error: 'Missing required parameters: lat and lon' },
                { status: 400 }
            );
        }

        // Validate coordinates
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lon);

        if (isNaN(latitude) || isNaN(longitude)) {
            return NextResponse.json(
                { error: 'Invalid coordinates' },
                { status: 400 }
            );
        }

        if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
            return NextResponse.json(
                { error: 'Coordinates out of range' },
                { status: 400 }
            );
        }

        // Reverse geocoding menggunakan Nominatim (gratis, tidak perlu API key)
        const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?` +
            `format=json&lat=${latitude}&lon=${longitude}&` +
            `accept-language=id&addressdetails=1`;

        const response = await fetch(nominatimUrl, {
            headers: {
                'User-Agent': 'Karwanua-Carbon-Monitor/1.0'
            }
        });

        if (!response.ok) {
            throw new Error(`Nominatim API error: ${response.statusText}`);
        }

        const data = await response.json();

        // Extract location information
        const address = data.address || {};

        // Prioritas nama lokasi: 
        // 1. Kabupaten/Kota
        // 2. Provinsi/State
        // 3. Country
        const city = address.city ||
            address.town ||
            address.village ||
            address.municipality ||
            address.county ||
            address.state_district ||
            'Unknown';

        const state = address.state ||
            address.province ||
            address.region ||
            '';

        const country = address.country || 'Unknown';

        // Format nama lengkap
        let fullName = city;
        if (state && state !== city) {
            fullName = `${city}, ${state}`;
        }
        if (country && country !== state && country !== city) {
            fullName = `${fullName}, ${country}`;
        }

        return NextResponse.json({
            success: true,
            data: {
                city,
                state,
                country,
                fullName,
                displayName: data.display_name,
                address: {
                    road: address.road || null,
                    suburb: address.suburb || null,
                    district: address.state_district || null,
                    postcode: address.postcode || null,
                }
            }
        }, {
            headers: {
                'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200'
            }
        });

    } catch (error) {
        console.error('Geocoding error:', error);
        return NextResponse.json(
            {
                error: 'Failed to fetch location data',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
