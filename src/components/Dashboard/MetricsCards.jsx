import React from 'react';
import { TrendingUp, Users, MapPin, Zap } from 'lucide-react';

const MetricsCards = ({ metrics = {} }) => {
  const {
    totalZonesAnalyzed = 0,
    emergingZones = 0,
    growingZones = 0,
    averageGrowthScore = 0,
    totalMunicipalProjects = 0,
    totalListings = 0,
    lastUpdateDate,
  } = metrics;

  const cards = [
    {
      title: 'Total Zones Analyzed',
      value: totalZonesAnalyzed,
      icon: MapPin,
      color: 'blue',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-200',
    },
    {
      title: 'Emerging Zones',
      value: emergingZones,
      icon: Zap,
      color: 'yellow',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
      borderColor: 'border-yellow-200',
    },
    {
      title: 'Growing Zones',
      value: growingZones,
      icon: TrendingUp,
      color: 'green',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      borderColor: 'border-green-200',
    },
    {
      title: 'Avg Growth Score',
      value: averageGrowthScore.toFixed(1),
      icon: Users,
      color: 'purple',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      borderColor: 'border-purple-200',
      unit: '/100',
    },
    {
      title: 'Municipal Projects',
      value: totalMunicipalProjects,
      icon: MapPin,
      color: 'orange',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      borderColor: 'border-orange-200',
    },
    {
      title: 'Active Listings',
      value: totalListings,
      icon: Users,
      color: 'red',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
      borderColor: 'border-red-200',
    },
  ];

  return (
    <div className="space-y-4 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className={`${card.bgColor} border ${card.borderColor} rounded-xl p-5 shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300 group`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider">{card.title}</p>
                  <p className={`text-2xl font-bold ${card.textColor}`}>
                    {card.value}
                    {card.unit && <span className="text-sm ml-1 font-medium">{card.unit}</span>}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${card.bgColor} group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-5 h-5 ${card.textColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {lastUpdateDate && (
        <div className="text-right text-xs text-gray-500 px-1">
          Last updated: {new Date(lastUpdateDate).toLocaleString()}
        </div>
      )}
    </div>
  );
};

export default MetricsCards;
