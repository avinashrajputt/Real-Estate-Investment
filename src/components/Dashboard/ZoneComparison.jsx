import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

const ZoneComparison = ({ zones = [], emergingZones = [], growingZones = [] }) => {
  const [comparisonType, setComparisonType] = useState('score');
  const [selectedZones, setSelectedZones] = useState(
    zones.slice(0, 5).map(z => z.zoneId)
  );

  const getZonesForComparison = () => {
    return zones.filter(z => selectedZones.includes(z.zoneId)).slice(0, 5);
  };

  const scoreComparisonData = getZonesForComparison().map((zone) => ({
    zone: zone.zone.substring(0, 10),
    'Overall Score': zone.overallScore,
    'Municipal': zone.municipalWeight,
    'Market': zone.marketWeight,
    'Pricing': zone.priceVelocityWeight,
  }));

  const roiComparisonData = getZonesForComparison().map((zone) => ({
    zone: zone.zone.substring(0, 10),
    'Forecasted ROI': zone.forecastedROI,
    'Confidence': (zone.confidenceLevel / 10).toFixed(1),
  }));

  const radarData = getZonesForComparison().map((zone) => ({
    zone: zone.zone.substring(0, 10),
    'Municipal': zone.municipalWeight || 0,
    'Market': zone.marketWeight || 0,
    'Pricing': zone.priceVelocityWeight || 0,
    'Confidence': (zone.confidenceLevel / 10) || 0,
  }));

  const togglZoneSelection = (zoneId) => {
    setSelectedZones((prev) =>
      prev.includes(zoneId)
        ? prev.filter(z => z !== zoneId)
        : [...prev, zoneId].slice(-5)
    );
  };

  return (
    <div className="space-y-8">
      {/* Zone Selection */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Select Zones to Compare</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {zones.slice(0, 20).map((zone) => (
            <button
              key={zone.zoneId}
              onClick={() => togglZoneSelection(zone.zoneId)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedZones.includes(zone.zoneId)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {zone.zone.substring(0, 8)}
            </button>
          ))}
        </div>
        <p className="text-sm text-gray-600">
          Selected: {selectedZones.length} zones (Max 5)
        </p>
      </div>

      {/* Comparison Type Selector */}
      <div className="flex gap-4">
        <button
          onClick={() => setComparisonType('score')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            comparisonType === 'score'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300'
          }`}
        >
          Score Comparison
        </button>
        <button
          onClick={() => setComparisonType('roi')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            comparisonType === 'roi'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300'
          }`}
        >
          ROI Comparison
        </button>
        <button
          onClick={() => setComparisonType('radar')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            comparisonType === 'radar'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300'
          }`}
        >
          Multi-Factor Radar
        </button>
      </div>

      {/* Score Comparison Chart */}
      {comparisonType === 'score' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Growth Score Comparison</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={scoreComparisonData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="zone" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Overall Score" fill="#3b82f6" />
              <Bar dataKey="Municipal" fill="#8b5cf6" />
              <Bar dataKey="Market" fill="#f97316" />
              <Bar dataKey="Pricing" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* ROI Comparison Chart */}
      {comparisonType === 'roi' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">ROI & Confidence Comparison</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={roiComparisonData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="zone" />
              <YAxis domain={[0, 40]} label={{ value: 'ROI %', angle: -90, position: 'insideLeft' }} />
              <YAxis yAxisId="right" domain={[0, 10]} label={{ value: 'Confidence (scaled)', angle: 90, position: 'insideRight' }} />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="Forecasted ROI" fill="#10b981" />
              <Bar yAxisId="right" dataKey="Confidence" fill="#ec4899" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Radar Chart */}
      {comparisonType === 'radar' && getZonesForComparison().length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Multi-Factor Analysis</h2>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="zone" />
              <PolarRadiusAxis domain={[0, 100]} />
              <Radar name="Municipal" dataKey="Municipal" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.1} />
              <Radar name="Market" dataKey="Market" stroke="#f97316" fill="#f97316" fillOpacity={0.1} />
              <Radar name="Pricing" dataKey="Pricing" stroke="#10b981" fill="#10b981" fillOpacity={0.1} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Zone Statistics Table */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Detailed Metrics</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-2 text-left font-semibold text-gray-700">Zone</th>
                <th className="px-4 py-2 text-center font-semibold text-gray-700">Score</th>
                <th className="px-4 py-2 text-center font-semibold text-gray-700">Category</th>
                <th className="px-4 py-2 text-center font-semibold text-gray-700">ROI</th>
                <th className="px-4 py-2 text-center font-semibold text-gray-700">Confidence</th>
                <th className="px-4 py-2 text-center font-semibold text-gray-700">Municipal</th>
              </tr>
            </thead>
            <tbody>
              {getZonesForComparison().map((zone) => (
                <tr key={zone.zoneId} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{zone.zone}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded font-semibold">
                      {zone.overallScore}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block px-2 py-1 rounded text-white font-semibold ${
                      zone.category === 'EMERGING'
                        ? 'bg-red-500'
                        : zone.category === 'GROWING'
                        ? 'bg-orange-500'
                        : zone.category === 'MATURE'
                        ? 'bg-yellow-500'
                        : 'bg-gray-500'
                    }`}>
                      {zone.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center font-semibold text-green-600">
                    {zone.forecastedROI?.toFixed(2)}%
                  </td>
                  <td className="px-4 py-3 text-center">{zone.confidenceLevel}%</td>
                  <td className="px-4 py-3 text-center">{zone.municipalWeight?.toFixed(0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ZoneComparison;
