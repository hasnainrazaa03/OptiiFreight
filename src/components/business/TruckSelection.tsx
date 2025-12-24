import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Truck, Star } from 'lucide-react';
import { collection, getDocs, query, where } from "firebase/firestore"; // Import Firestore
import { db } from "../../lib/firebase";

const TruckSelection: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { shipmentData, estimatedCost } = location.state || {};
  const [trucks, setTrucks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // MOCK DISTANCE CALCULATION
  // Since we don't have Google Maps API yet, we infer miles from the estimated cost
  // estimatedCost = $400 roughly implies 200 miles @ $2/mile
  const estimatedMiles = (estimatedCost || 400) / 2;

  useEffect(() => {
    const fetchTrucks = async () => {
      try {
        // FILTER: Only get carriers where verified == true
        const q = query(collection(db, "carriers"), where("verified", "==", true));
        const querySnapshot = await getDocs(q);
        
        const fetchedTrucks: any[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          
          // 1. Calculate Quote: (Distance * Base Rate)
          // If baseRate is missing, default to 2.0
          const rate = data.baseRate || data.ratePerMile || 2.0;
          const calculatedTotal = Math.round(estimatedMiles * rate);
          
          // 2. Calculate Transit Time: (Miles / 500 miles/day)
          const days = Math.ceil(estimatedMiles / 500);
          const transitDisplay = data.transitTime || `${days} Day${days > 1 ? 's' : ''}`;

          fetchedTrucks.push({
            id: doc.id,
            ...data,
            // FIX NAME: Use companyName first
            name: data.companyName || data.name || "Unknown Carrier", 
            ratePerMile: rate,
            transitTime: transitDisplay,
            total: calculatedTotal < 200 ? 200 : calculatedTotal,
            
            // Fix Rating Display
            rating: data.rating || 0,
            reviews: data.reviews || 0,
            
            matchScore: 0 // (Algorithm calculation here...)
          });
        });
        
        // SORTING: Highest score first
        fetchedTrucks.sort((a, b) => b.matchScore - a.matchScore);
        
        setTrucks(fetchedTrucks);
      } catch (error) {
        console.error("Error fetching trucks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrucks();
  }, [estimatedMiles]);

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
        
        {loading ? (
          <div className="flex justify-center py-20">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange"></div>
          </div>
        ) : trucks.length === 0 ? (
          // --- NEW EMPTY STATE ---
          <div className="text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
             <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Truck className="w-10 h-10 text-gray-300" />
             </div>
             <h3 className="text-xl font-bold text-gray-800 mb-2">No Trucks Available</h3>
             <p className="text-gray-500 max-w-md mx-auto mb-8">
                We couldn't find any verified carriers matching your route criteria right now.
             </p>
             <div className="flex justify-center gap-4">
                <button onClick={() => navigate(-1)} className="text-brand-orange font-semibold hover:underline">
                   Modify Search
                </button>
                <Link to="/business" className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                   Back to Dashboard
                </Link>
             </div>
          </div>
        ) : (
          <div className="space-y-4">
            {trucks.map((truck, index) => (
              <div key={truck.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-brand-orange transition-all">
                {index === 0 && (
                    <div className="absolute -top-3 left-6 bg-brand-green text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                        OPTIMAL MATCH
                    </div>
                )}
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
                    <p className="font-semibold text-gray-800">${truck.ratePerMile} / mile</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Delivery</p>
                    <p className="font-semibold text-gray-800">{truck.transitTime}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Total Quote</p>
                    <p className="font-bold text-xl text-brand-green">${truck.total}</p>
                  </div>
                </div>

                <button 
                  onClick={() => navigate('/business/truck-details', { 
                      state: { 
                          truck, 
                          shipmentData, 
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
        )}
      </div>
    </div>
  );
};

export default TruckSelection;