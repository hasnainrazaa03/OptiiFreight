import React, { useState, useEffect } from 'react';
import { Wallet, Bell, Search, MapPin, ChevronRight, Star, User } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../lib/firebase"; // Ensure path is correct

const incomeData = [
  { name: 'Week 1', income: 1200 },
  { name: 'Week 2', income: 1800 },
  { name: 'Week 3', income: 1500 },
  { name: 'Week 4', income: 2100 },
];

const reviews = [
  { id: 1, user: 'Global Foods Ltd.', rating: 5, comment: 'Excellent service, arrived early.', date: '2 days ago' },
  { id: 2, user: 'Tech Systems Inc.', rating: 4, comment: 'Good handling of fragile goods.', date: '1 week ago' },
];

const CarrierDashboard: React.FC = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [realLoads, setRealLoads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // --- REAL TIME LISTENER ---
  useEffect(() => {
    // Listen for shipments with status 'Pending'
    const q = query(collection(db, "shipments"), where("status", "==", "Pending"));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const loads: any[] = [];
      querySnapshot.forEach((doc) => {
        loads.push({ id: doc.id, ...doc.data() });
      });
      setRealLoads(loads);
      setLoading(false);
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-brand-light p-4 sm:p-8">
       <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-brand-dark font-heading">Carrier Portal</h1>
            <p className="text-gray-500">Fleet ID: #TRK-8821 • Rating: 4.8 <Star className="w-3 h-3 text-yellow-500 inline fill-yellow-500"/></p>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
               <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
               <span className="text-sm font-medium text-gray-700">{isOnline ? 'Available for Loads' : 'Offline'}</span>
               <button onClick={() => setIsOnline(!isOnline)} className="text-xs text-blue-600 font-semibold ml-2">Change</button>
             </div>
             <button className="bg-white p-2 rounded-full shadow-sm border border-gray-200 text-gray-600 hover:text-brand-orange relative">
               <Bell className="w-5 h-5" />
               <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
             </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Load Board */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Search/Filter */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-2">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search routes or zip codes..." 
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-dark"
                />
              </div>
              <button className="bg-brand-dark text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-900">
                Find Loads
              </button>
            </div>

            {/* LIVE LOADS FEED */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
               <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                 <h3 className="font-bold text-lg text-brand-dark">Live Shipment Requests</h3>
                 <span className="text-xs font-bold text-brand-green bg-green-50 px-2 py-1 rounded">Real-Time</span>
               </div>
               
               <div className="divide-y divide-gray-100">
                 {loading ? (
                    <div className="p-8 text-center text-gray-400">Loading live loads...</div>
                 ) : realLoads.length === 0 ? (
                    <div className="p-8 text-center">
                        <p className="text-gray-500 mb-2">No active shipments found right now.</p>
                        <p className="text-sm text-gray-400">New requests will appear here instantly.</p>
                    </div>
                 ) : (
                    realLoads.map((load) => (
                      <div key={load.id} className="p-6 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-brand-light rounded-lg text-brand-dark">
                            <MapPin className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-bold text-brand-dark">Zip {load.originZip} → Zip {load.destZip}</h4>
                            <p className="text-sm text-gray-500 mt-1">{load.weight} lbs • {load.cargoType}</p>
                            <div className="mt-2 flex gap-2">
                               <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Verified Shipper</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="text-lg font-bold text-brand-dark">
                              ${Math.round(load.finalCost || load.estimatedCost || 0)}
                            </p>
                            <p className="text-xs text-brand-green font-bold">Est. Payout</p>
                          </div>
                          <button className="bg-brand-orange text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-orange-600 transition-colors">
                            Accept Load
                          </button>
                        </div>
                      </div>
                    ))
                 )}
               </div>
               
               <div className="p-4 bg-gray-50 text-center">
                 <button className="text-brand-dark font-semibold text-sm hover:text-blue-700 flex items-center justify-center gap-1">
                   View All Loads <ChevronRight className="w-4 h-4" />
                 </button>
               </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Earnings Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
               <div className="flex items-center gap-3 mb-6">
                 <div className="p-2 bg-green-100 text-brand-green rounded-lg">
                   <Wallet className="w-5 h-5" />
                 </div>
                 <div>
                   <p className="text-xs text-gray-500">Total Earnings (Oct)</p>
                   <h3 className="text-xl font-bold text-brand-dark">$6,600</h3>
                 </div>
               </div>
               <div className="h-48" style={{ height: 300, width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={incomeData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0"/>
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10}} hide/>
                      <YAxis hide/>
                      <Tooltip formatter={(value) => [`$${value}`, 'Income']} />
                      <Area type="monotone" dataKey="income" stroke="#4CAF50" fillOpacity={1} fill="#4CAF50" />
                    </AreaChart>
                 </ResponsiveContainer>
               </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-900">Recent Customer Reviews</h3>
              </div>
              
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-50 last:border-0 pb-3 last:pb-0">
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                          <User className="w-3 h-3 text-gray-500" />
                        </div>
                        <span className="text-sm font-bold text-brand-dark">{review.user}</span>
                      </div>
                      <div className="flex items-center">
                         <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                         <span className="text-xs font-bold ml-1">{review.rating}.0</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 italic">"{review.comment}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
       </div>
    </div>
  );
};

export default CarrierDashboard;