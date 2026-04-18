import React, { useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const GrowthHeatmap = ({ zones = [], onZoneSelect }) => {
  const mapCenter = useMemo(() => {
    if (zones.length === 0) return [28.7041, 77.1025]; // Default to Delhi
    const avgLat = zones.reduce((sum, z) => sum + (z.location?.latitude || 0), 0) / zones.length;
    const avgLng = zones.reduce((sum, z) => sum + (z.location?.longitude || 0), 0) / zones.length;
    return [avgLat, avgLng];
  }, [zones]);

  const getColor = (score) => {
    if (score >= 75) return '#ef4444'; // Red - Emerging (hottest)
    if (score >= 50) return '#f97316'; // Orange - Growing
    if (score >= 30) return '#eab308'; // Yellow - Mature
    return '#3b82f6'; // Blue - Declining (coolest)
  };

  const getRadius = (score) => {
    return 5 + (score / 100) * 15; // Radius 5-20
  };

  const getCategory = (score) => {
    if (score >= 75) return 'EMERGING';
    if (score >= 50) return 'GROWING';
    if (score >= 30) return 'MATURE';
    return 'DECLINING';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Growth Zone Heatmap</h2>

      <div className="mb-4 flex gap-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded-full"></div>
          <span className="text-sm text-gray-700">Emerging (75+)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
          <span className="text-sm text-gray-700">Growing (50-74)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
          <span className="text-sm text-gray-700">Mature (30-49)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
          <span className="text-sm text-gray-700">Declining (&lt;30)</span>
        </div>
      </div>

      <div style={{ height: '500px', borderRadius: '0.5rem', overflow: 'hidden' }}>
        <MapContainer center={mapCenter} zoom={11} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          {zones.map((zone) => {
            const { latitude, longitude } = zone.location || {};
            if (!latitude || !longitude) return null;

            return (
              <CircleMarker
                key={zone.zoneId}
                center={[latitude, longitude]}
                radius={getRadius(zone.overallScore)}
                fillColor={getColor(zone.overallScore)}
                color={getColor(zone.overallScore)}
                weight={2}
                opacity={0.8}
                fillOpacity={0.6}
                eventHandlers={{
                  click: () => onZoneSelect(zone),
                }}
              >
                <Popup>
                  <div className="p-3 text-sm">
                    <h3 className="font-bold text-gray-900">{zone.zone}</h3>
                    <p className="text-gray-600 mb-2">{zone.microMarket}</p>
                    <div className="flex justify-between gap-4 mb-2">
                      <div>
                        <span className="text-gray-600">Score: </span>
                        <span className="font-semibold">{zone.overallScore}/100</span>
                      </div>
                      <div>
                        <span className="text-gray-600">ROI: </span>
                        <span className="font-semibold text-green-600">{zone.forecastedROI?.toFixed(2)}%</span>
                      </div>
                    </div>
                    <p className="text-gray-700">
                      <span className="font-semibold">Category: </span>
                      {zone.category}
                    </p>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p>
          Total zones displayed: <span className="font-semibold">{zones.length}</span>
        </p>
      </div>
    </div>
  );
};

export default GrowthHeatmap;
