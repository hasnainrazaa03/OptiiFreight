import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Truck, Star } from 'lucide-react';

const TruckSelection: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // We do NOT expect shipmentId here anymore because it's a draft
  const { shipmentData, estimatedCost } = location.state || {};
  const basePrice = estimatedCost || 400; // Fallback

  // Generate dynamic-looking truck options based on the passed cost
  const trucks = [
    { id: 1, name: 'Speedy Haulage Inc.', rating: 4.8, rate: 1.85, total: Math.round(basePrice * 1.1), time: '2 Days' },
    { id: 2, name: 'US Logistics Co.', rating: 4.5, rate: 1.60, total: Math.round(basePrice * 0.95), time: '3 Days' },
    { id: 3, name: 'Prime Movers', rating: 4.9, rate: 2.10, total: Math.round(basePrice * 1.25), time: '1 Day' },
  ];

  return (
    <div className="min-h-screen bg-brand-light p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        <Link to="/business/create" className="flex items-center text-gray-500 hover:text-brand-dark mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Request
        </Link>
        
        <div className="flex justify-between items-end mb-6">
            <div>
                <h2 className="text-2xl font-bold text-brand-dark">Available Trucks</h2>
                <p className="text-sm text-gray-500 mt-1">
                    Showing results for <strong>DRAFT SHIPMENT</strong> 
                    ({shipmentData?.weight || '0'} lbs)
                </p>
            </div>
        </div>
        
        <div className="space-y-4">
          {trucks.map((truck) => (
            <div key={truck.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-brand-orange transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-brand-dark">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-brand-dark">{truck.name}</h3>
                  <div className="flex items-center text-sm text-gray-600">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                    <span>{truck.rating} • Verified Carrier</span>
                  </div>
                </div>
              </div>

              <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4 text-center md:text-left">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Rate</p>
                  <p className="font-semibold text-gray-800">${truck.rate} / mile</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Delivery</p>
                  <p className="font-semibold text-gray-800">{truck.time}</p>
                </div>
                <div>
                   <p className="text-xs text-gray-500 uppercase tracking-wide">Total Quote</p>
                   <p className="font-bold text-xl text-brand-green">${truck.total}</p>
                </div>
              </div>

              <button 
                onClick={() => navigate('/business/payment', { 
                    state: { 
                        truck, 
                        shipmentData, // Pass the raw data forward to the Payment page
                        total: truck.total 
                    } 
                })}
                className="bg-brand-orange hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors w-full md:w-auto"
              >
                Select
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TruckSelection;