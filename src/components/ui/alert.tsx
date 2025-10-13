import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        destructive:
          "text-destructive bg-card [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight",
        className,
      )}
      {...props}
    />
  );
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed",
        className,
      )}
      {...props}
    />
  );
}

interface LocationAlertProps {
  locationName: string;
  coordinates: [number, number];
  airQualityData?: {
    carbon_dioxide?: number;
    pm2_5?: number;
    pm10?: number;
    carbon_monoxide?: number;
    current?: {
      time?: string;
    };
  };
  assessment?: {
    status: string;
    color: string;
  };
  temperatureData?: {
    value: number;
  };
  isTempLoading?: boolean;
  isLoadingLocation?: boolean;
}

function LocationAlert({
  locationName,
  coordinates,
  airQualityData,
  assessment,
  temperatureData,
  isTempLoading = false,
  isLoadingLocation = false,
}: LocationAlertProps) {
  return (
    <div className="min-w-[250px]">
      <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
        📍 Lokasi Anda
      </h3>

      <div className="text-sm space-y-2">
        <div className="pb-2 border-b">
          {isLoadingLocation ? (
            <p className="text-gray-500 italic">Memuat nama lokasi...</p>
          ) : (
            <p className="font-semibold text-base mb-1">{locationName}</p>
          )}
          <p className="text-gray-600">
            {coordinates[0].toFixed(4)}°N, {coordinates[1].toFixed(4)}°E
          </p>
        </div>

        {/* Air Quality Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌫️</span>
            <div>
              <h4 className="font-semibold">Air Quality</h4>
              {assessment && (
                <div
                  className="font-semibold text-white px-2 py-1 rounded"
                  style={{ backgroundColor: assessment.color }}
                >
                  {assessment.status}
                </div>
              )}
            </div>
          </div>

          {airQualityData && (
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-blue-50 p-2 rounded text-center">
                <div className="text-xs text-blue-600 font-semibold">CO₂</div>
                <div className="font-bold text-blue-900 text-sm">
                  {airQualityData.carbon_dioxide ?
                    airQualityData.carbon_dioxide.toFixed(1) : 'N/A'
                  } ppm
                </div>
              </div>
              <div className="bg-orange-50 p-2 rounded text-center">
                <div className="text-xs text-orange-600 font-semibold">PM2.5</div>
                <div className="font-bold text-orange-900 text-sm">
                  {airQualityData.pm2_5?.toFixed(1) || 'N/A'} μg/m³
                </div>
              </div>
              <div className="bg-purple-50 p-2 rounded text-center">
                <div className="text-xs text-purple-600 font-semibold">PM10</div>
                <div className="font-bold text-purple-900 text-sm">
                  {airQualityData.pm10?.toFixed(1) || 'N/A'} μg/m³
                </div>
              </div>
              <div className="bg-red-50 p-2 rounded text-center">
                <div className="text-xs text-red-600 font-semibold">CO</div>
                <div className="font-bold text-red-900 text-sm">
                  {airQualityData.carbon_monoxide?.toFixed(0) || 'N/A'} μg/m³
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Temperature Anomaly Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌡️</span>
            <div>
              <h4 className="font-semibold">Temperature Anomaly</h4>
              {isTempLoading ? (
                <div className="text-gray-500 italic">Loading...</div>
              ) : temperatureData ? (
                <div className="font-bold">
                  {temperatureData.value > 0 ? '+' : ''}{temperatureData.value.toFixed(2)}°C
                  <div className="text-xs text-gray-600">vs 1951-1980 baseline</div>
                </div>
              ) : (
                <div className="text-gray-500 italic">No data</div>
              )}
            </div>
          </div>
        </div>

        {/* NDVI Section (placeholder for future implementation) */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌳</span>
            <div>
              <h4 className="font-semibold">Vegetation Health (NDVI)</h4>
              <div className="font-bold text-green-600">0.610</div>
              <div className="text-xs text-gray-600">Dense Vegetation</div>
            </div>
          </div>
        </div>

        <div className="text-xs text-gray-400 text-center pt-2 border-t">
          🌫️ Real-time air quality data
        </div>
      </div>
    </div>
  );
}

export { Alert, AlertTitle, AlertDescription, LocationAlert };
