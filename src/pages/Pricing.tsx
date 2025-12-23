import React from 'react';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const Pricing = () => {
  return (
    <div className="min-h-screen bg-brand-light">
      <div className="bg-brand-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-heading font-bold mb-4">Transparent Pricing</h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">Fair rates for everyone. No hidden fees.</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Business Pricing */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 transform hover:-translate-y-1 transition-transform">
            <div className="bg-brand-orange p-6 text-white text-center">
              <h3 className="text-2xl font-bold font-heading">For Shippers</h3>
              <p className="opacity-90">Pay only for what you ship</p>
            </div>
            <div className="p-8">
              <div className="text-center mb-8">
                <span className="text-4xl font-bold text-gray-900">8-12%</span>
                <span className="text-gray-500 block">Commission per Shipment</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-gray-600"><Check className="w-5 h-5 text-green-500 mr-2"/> Free account creation</li>
                <li className="flex items-center text-gray-600"><Check className="w-5 h-5 text-green-500 mr-2"/> Instant AI quotes</li>
                <li className="flex items-center text-gray-600"><Check className="w-5 h-5 text-green-500 mr-2"/> Real-time tracking included</li>
                <li className="flex items-center text-gray-600"><Check className="w-5 h-5 text-green-500 mr-2"/> Full insurance coverage options</li>
              </ul>
              <Link to="/login?type=business" className="block w-full bg-brand-dark text-white text-center py-3 rounded-lg font-bold hover:bg-blue-900 transition-colors">Start Shipping</Link>
            </div>
          </div>

          {/* Carrier Pricing */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 transform hover:-translate-y-1 transition-transform">
            <div className="bg-brand-green p-6 text-white text-center">
              <h3 className="text-2xl font-bold font-heading">For Carriers</h3>
              <p className="opacity-90">Fill your truck, boost your income</p>
            </div>
             <div className="p-8">
              <div className="text-center mb-8">
                <span className="text-4xl font-bold text-gray-900">5%</span>
                <span className="text-gray-500 block">Commission per Completed Trip</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-gray-600"><Check className="w-5 h-5 text-green-500 mr-2"/> No monthly subscription fees</li>
                <li className="flex items-center text-gray-600"><Check className="w-5 h-5 text-green-500 mr-2"/> Guaranteed payments within 48h</li>
                <li className="flex items-center text-gray-600"><Check className="w-5 h-5 text-green-500 mr-2"/> Access to high-paying partial loads</li>
                <li className="flex items-center text-gray-600"><Check className="w-5 h-5 text-green-500 mr-2"/> Route optimization tools included</li>
              </ul>
               <Link to="/login?type=carrier" className="block w-full bg-brand-dark text-white text-center py-3 rounded-lg font-bold hover:bg-blue-900 transition-colors">Register Truck</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;