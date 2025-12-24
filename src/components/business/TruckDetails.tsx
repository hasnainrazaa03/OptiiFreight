import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Truck, Star, ShieldCheck, Info, CheckCircle } from 'lucide-react';

const TruckDetails: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { truck, shipmentData, total, quoteDetails } = location.state || {};

  const safeDisplay = (val: any, suffix = '') => val ? `${val}${suffix}` : 'N/A';

  if (!truck) return <div>Error: No truck data found.</div>;

  return (
    <div className="min-h-screen bg-brand-light p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-gray-500 hover:text-brand-dark mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Search Results
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: Truck & Carrier Details */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Header Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-brand-light rounded-full flex items-center justify-center text-brand-dark flex-shrink-0">
                  <Truck className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-brand-dark">{truck.name}</h1>
                  <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                    {truck.rating > 0 ? (
                        <span className="flex items-center font-semibold text-brand-dark">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                            {truck.rating}/5.0
                        </span>
                    ) : <span className="text-blue-600 text-xs font-bold bg-blue-50 px-2 py-1 rounded">New Carrier</span>}
                    <span>•</span>
                    <span>{truck.reviews || 0} Reviews</span>
                    <span>•</span>
                    <span className="text-green-600 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> DOT Verified
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Equipment Type</p>
                  <p className="font-medium text-gray-900">{safeDisplay(truck.equipmentType)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">DOT Number</p>
                  <p className="font-medium text-gray-900">{safeDisplay(truck.dotNumber)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Insurance</p>
                  <p className="font-medium text-green-600 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3"/> Verified
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Fleet Size</p>
                  <p className="font-medium text-gray-900">{truck.fleetSize || 1} Trucks</p>
                </div>
              </div>
            </div>

            {/* Shipment Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-lg text-brand-dark mb-4">Shipment Summary</h3>
              
              {/* SOP DATA DISPLAY */}
              <div className="grid grid-cols-3 gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
                 <div>
                    <p className="text-xs text-gray-500">Total Volume</p>
                    <p className="font-bold">{quoteDetails?.volume} ft³</p>
                 </div>
                 <div>
                    <p className="text-xs text-gray-500">Total Density</p>
                    <p className="font-bold">{quoteDetails?.density} lbs/ft³</p>
                 </div>
                 <div>
                    <p className="text-xs text-gray-500">Basis</p>
                    <span className={`text-xs font-bold px-2 py-1 rounded ${quoteDetails?.chargeableBasis === 'WEIGHT' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'}`}>
                        {quoteDetails?.chargeableBasis}
                    </span>
                 </div>
              </div>

              <div className="relative pl-8 border-l-2 border-dashed border-gray-300 space-y-8">
                <div className="relative">
                   <div className="absolute -left-[39px] top-0 bg-white border-2 border-brand-dark rounded-full w-5 h-5"></div>
                   <p className="text-xs text-gray-500 uppercase">Pickup</p>
                   <p className="font-bold text-gray-900">Zip Code: {shipmentData.originZip}</p>
                   <p className="text-sm text-gray-600">{shipmentData.date}</p>
                </div>
                <div className="relative">
                   <div className="absolute -left-[39px] top-0 bg-brand-orange border-2 border-brand-orange rounded-full w-5 h-5"></div>
                   <p className="text-xs text-gray-500 uppercase">Delivery</p>
                   <p className="font-bold text-gray-900">Zip Code: {shipmentData.destZip}</p>
                   <p className="text-sm text-gray-600">Est. Transit: {truck.transitTime}</p>
                </div>
              </div>
              
              <div className="mt-6 bg-blue-50 p-4 rounded-lg flex gap-3">
                 <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
                 <p className="text-sm text-blue-800">
                   <strong>Calculation Logic:</strong> {quoteDetails?.breakdown}. 
                   This ensures you are paying the optimal rate based on the density of your cargo.
                 </p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Pricing & Action */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden sticky top-24">
  <div className="p-6 bg-brand-dark text-white">
    <h3 className="font-heading font-bold text-lg">Price Breakdown</h3>
  </div>
  <div className="p-6 space-y-4">
    
    {/* Line Item 1: Mileage */}
    <div className="flex justify-between text-sm">
      <span className="text-gray-600">Mileage Cost ({shipmentData.distance} mi)</span>
      <span className="font-medium">${quoteDetails?.mileageCharge?.toFixed(2)}</span>
    </div>

    {/* Line Item 2: Cargo (Weight/Vol) */}
    <div className="flex justify-between text-sm">
      <span className="text-gray-600">
        Cargo Cost ({quoteDetails?.chargeableBasis === 'WEIGHT' ? `${shipmentData.weight} lbs` : `${quoteDetails?.volume} ft³`})
      </span>
      <span className="font-medium">${quoteDetails?.baseCharge?.toFixed(2)}</span>
    </div>

    <div className="border-t border-gray-200 pt-4 mt-2">
      <div className="flex justify-between items-end">
        <span className="font-bold text-gray-900">Total Quote</span>
        <span className="text-2xl font-bold text-brand-green">${total.toFixed(2)}</span>
      </div>
      <p className="text-xs text-gray-400 text-right mt-1">Includes Linehaul + Cargo Rates</p>
    </div>

                <button 
                  onClick={() => navigate('/business/payment', { state: { truck, shipmentData, total } })}
                  className="w-full bg-brand-orange hover:bg-orange-600 text-white font-bold py-3 rounded-lg shadow-md transition-all flex items-center justify-center gap-2 mt-4"
                >
                  Proceed to Payment <ArrowRight className="w-5 h-5" />
                </button>
                
                <p className="text-xs text-center text-gray-500 mt-4">
                  <ShieldCheck className="w-3 h-3 inline mr-1" />
                  Secure checkout. Money held in escrow until pickup.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TruckDetails;