import React from 'react';

const StatsCard = ({ title, value, subtitle, icon, color = 'blue', trend, trendValue }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    yellow: 'from-yellow-500 to-yellow-600',
    red: 'from-red-500 to-red-600',
    purple: 'from-purple-500 to-purple-600',
    indigo: 'from-indigo-500 to-indigo-600',
    pink: 'from-pink-500 to-pink-600',
    orange: 'from-orange-500 to-orange-600',
  };



  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300 shadow-lg hover:shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-gradient-to-br ${colorClasses[color]} shadow-lg`}>
          <span className="text-white text-xl">{icon}</span>
        </div>
        {trend && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
            trend === 'up' ? 'bg-green-900/50 text-green-400' : 
            trend === 'down' ? 'bg-red-900/50 text-red-400' : 
            'bg-gray-700 text-gray-400'
          }`}>
            {trend === 'up' && '↗'}
            {trend === 'down' && '↙'}
            {trend === 'stable' && '→'}
            {trendValue && <span>{trendValue}</span>}
          </div>
        )}
      </div>
      
      <div>
        <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
        <p className="text-white text-2xl font-bold mb-1">{value}</p>
        {subtitle && (
          <p className="text-gray-500 text-sm">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
