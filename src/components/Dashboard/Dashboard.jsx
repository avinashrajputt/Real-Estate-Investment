import React, { useState } from 'react';
import { useGrowthScores, useDashboardMetrics } from '../../hooks/useAnalytics';
import { BarChart, PieChart, LineChart, Zap, TrendingUp, MapPin, Users } from 'lucide-react';
import GrowthHeatmap from '../Map/GrowthHeatmap';
import ZoneComparison from './ZoneComparison';
import MetricsCards from './MetricsCards';

const Dashboard = () => {
  const [selectedZone, setSelectedZone] = useState(null);
  const [viewType, setViewType] = useState('heatmap'); // heatmap, comparison, detailed
  const { data: growthScores, isLoading: scoresLoading } = useGrowthScores();
  const { data: metrics, isLoading: metricsLoading } = useDashboardMetrics();

  if (scoresLoading || metricsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const emergingZones = growthScores?.filter(z => z.category === 'EMERGING') || [];
  const growingZones = growthScores?.filter(z => z.category === 'GROWING') || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Real Estate Growth Prediction Dashboard
          </h1>
          <p className="text-gray-600 text-lg">
            Identify high-growth zones for investment using predictive geospatial analytics
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">

      {/* Metrics Cards */}
      {metrics && <MetricsCards metrics={metrics} />}

      {/* View Type Selector */}
      <div className="mb-8 flex gap-3 flex-wrap">
        <button
          onClick={() => setViewType('heatmap')}
          className={`px-5 py-2.5 rounded-lg font-semibold transition-all transform hover:scale-105 flex items-center gap-2 ${
            viewType === 'heatmap'
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
              : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-400 hover:shadow-md'
          }`}
        >
          <MapPin className="w-4 h-4" />
          Heat Map View
        </button>
        <button
          onClick={() => setViewType('comparison')}
          className={`px-5 py-2.5 rounded-lg font-semibold transition-all transform hover:scale-105 flex items-center gap-2 ${
            viewType === 'comparison'
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
              : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-400 hover:shadow-md'
          }`}
        >
          <BarChart className="w-4 h-4" />
          Zone Comparison
        </button>
        <button
          onClick={() => setViewType('detailed')}
          className={`px-5 py-2.5 rounded-lg font-semibold transition-all transform hover:scale-105 flex items-center gap-2 ${
            viewType === 'detailed'
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
              : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-400 hover:shadow-md'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Detailed Analysis
        </button>
      </div>

      {/* Main Content Area */}
      {viewType === 'heatmap' && <GrowthHeatmap zones={growthScores} onZoneSelect={setSelectedZone} />}
      {viewType === 'comparison' && (
        <ZoneComparison zones={growthScores} emergingZones={emergingZones} growingZones={growingZones} />
      )}
      {viewType === 'detailed' && selectedZone && <DetailedAnalysis zone={selectedZone} />}

      {/* Opportunity Zones Section */}
      <div className="grid grid-cols-2 gap-8 mt-12">
        {/* Emerging Zones */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-6 h-6 text-yellow-500" />
            <h2 className="text-xl font-bold text-gray-900">Emerging Zones</h2>
            <span className="ml-auto bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
              {emergingZones.length}
            </span>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {emergingZones.slice(0, 10).map((zone) => (
              <div
                key={zone.zoneId}
                onClick={() => setSelectedZone(zone)}
                className="p-3 border border-yellow-200 rounded-lg cursor-pointer hover:bg-yellow-50 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900">{zone.zone}</h3>
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-semibold">
                    {zone.overallScore}/100
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{zone.microMarket}</p>
                <div className="flex gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">ROI: </span>
                    <span className="font-semibold text-green-600">{zone.forecastedROI?.toFixed(2)}%</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Confidence: </span>
                    <span className="font-semibold">{zone.confidenceLevel}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Growing Zones */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-6 h-6 text-green-500" />
            <h2 className="text-xl font-bold text-gray-900">Growing Zones</h2>
            <span className="ml-auto bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              {growingZones.length}
            </span>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {growingZones.slice(0, 10).map((zone) => (
              <div
                key={zone.zoneId}
                onClick={() => setSelectedZone(zone)}
                className="p-3 border border-green-200 rounded-lg cursor-pointer hover:bg-green-50 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900">{zone.zone}</h3>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">
                    {zone.overallScore}/100
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{zone.microMarket}</p>
                <div className="flex gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">ROI: </span>
                    <span className="font-semibold text-green-600">{zone.forecastedROI?.toFixed(2)}%</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Confidence: </span>
                    <span className="font-semibold">{zone.confidenceLevel}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Zone Details */}
      {selectedZone && (
        <div className="mt-12 bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Selected Zone: {selectedZone.zone}</h3>
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-sm text-gray-600 mb-1">Overall Score</p>
              <p className="text-2xl font-bold text-blue-600">{selectedZone.overallScore}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-sm text-gray-600 mb-1">Municipal Impact</p>
              <p className="text-2xl font-bold text-purple-600">{selectedZone.municipalWeight?.toFixed(0)}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-sm text-gray-600 mb-1">Market Activity</p>
              <p className="text-2xl font-bold text-orange-600">{selectedZone.marketWeight?.toFixed(0)}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-sm text-gray-600 mb-1">Price Velocity</p>
              <p className="text-2xl font-bold text-teal-600">{selectedZone.priceVelocityWeight?.toFixed(0)}</p>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

const DetailedAnalysis = ({ zone }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Detailed Zone Analysis: {zone.zone}</h2>
      <div className="grid grid-cols-3 gap-6">
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-700 mb-3">Growth Metrics</h3>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Category:</span> {zone.category}</p>
            <p><span className="font-medium">Confidence:</span> {zone.confidenceLevel}%</p>
            <p><span className="font-medium">Forecasted ROI:</span> {zone.forecastedROI?.toFixed(2)}%</p>
          </div>
        </div>
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-700 mb-3">Component Scores</h3>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Municipal:</span> {zone.municipalWeight?.toFixed(0)}/100</p>
            <p><span className="font-medium">Market:</span> {zone.marketWeight?.toFixed(0)}/100</p>
            <p><span className="font-medium">Pricing:</span> {zone.priceVelocityWeight?.toFixed(0)}/100</p>
          </div>
        </div>
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-700 mb-3">Location Info</h3>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Micro-Market:</span> {zone.microMarket}</p>
            <p><span className="font-medium">Lat:</span> {zone.location?.latitude?.toFixed(4)}</p>
            <p><span className="font-medium">Lng:</span> {zone.location?.longitude?.toFixed(4)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
