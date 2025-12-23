import React from 'react';
import { TrendingUp, Truck, DollarSign } from 'lucide-react';

const StatsTicker: React.FC = () => {
  return (
    <div className="bg-brand-dark text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6 border border-blue-800 rounded-lg hover:border-brand-orange transition-colors duration-300">
            <Truck className="w-10 h-10 mx-auto mb-4 text-brand-orange" />
            <h3 className="text-4xl font-bold font-heading mb-2">4,287</h3>
            <p className="text-gray-300">Loads Optimized This Month</p>
          </div>
          <div className="p-6 border border-blue-800 rounded-lg hover:border-brand-orange transition-colors duration-300">
            <DollarSign className="w-10 h-10 mx-auto mb-4 text-brand-green" />
            <h3 className="text-4xl font-bold font-heading mb-2">$2.1 M</h3>
            <p className="text-gray-300">Saved by Businesses</p>
          </div>
          <div className="p-6 border border-blue-800 rounded-lg hover:border-brand-orange transition-colors duration-300">
            <TrendingUp className="w-10 h-10 mx-auto mb-4 text-brand-orange" />
            <h3 className="text-4xl font-bold font-heading mb-2">81%</h3>
            <p className="text-gray-300">Average Truck Utilization</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsTicker;