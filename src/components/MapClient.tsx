'use client';

import dynamic from 'next/dynamic';

// Dynamically import map component (client-side only)
const InteractiveMap = dynamic(() => import('@/components/InteractiveMap'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-[800px] bg-gray-100 flex items-center justify-center rounded-lg">
            <div className="text-center">
                <div className="animate-spin text-6xl mb-4">🌍</div>
                <div className="text-xl text-gray-600">Loading Interactive Map...</div>
            </div>
        </div>
    ),
});

export default function MapClient() {
    return (
        <InteractiveMap
            defaultCenter={[-2.5, 118.0]}
            defaultZoom={5}
            defaultLayer="truecolor"
            height="800px"
        />
    );
}
