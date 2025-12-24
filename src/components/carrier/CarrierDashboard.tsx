import React, { useState, useEffect } from 'react';
import { Wallet, Bell, Search, MapPin, ChevronRight, Star, User, AlertTriangle, Lock, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { collection, query, where, onSnapshot, doc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

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
  const { user } = useAuth();
  
  // State
  const [isOnline, setIsOnline] = useState(true);
  const [realLoads, setRealLoads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileComplete, setProfileComplete] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  
  // New State for Real Data
  const [carrierData, setCarrierData] = useState<any>(null);
  const [earningsData, setEarningsData] = useState<any[]>([{ name: 'Start', income: 0 }]);
  const [totalEarnings, setTotalEarnings] = useState(0);

  // 1. Fetch Carrier Profile & Status
  useEffect(() => {
    if (!user) return;

    const unsubProfile = onSnapshot(doc(db, "carriers", user.uid), (docSnap) => {
        if (docSnap.exists()) {
            const data = docSnap.data();
            setCarrierData(data);
            
            // STRICT CHECK: Profile complete only if DOT, Rate, and Payment info (inferred) exist
            const isComplete = data.profileComplete === true && !!data.dotNumber;
            setProfileComplete(isComplete);
            setIsVerified(data.verified === true);
        } else {
            setProfileComplete(false);
            setIsVerified(false);
        }
    });

    return () => unsubProfile();
  }, [user]);

  // 2. Fetch Completed Shipments for Earnings Chart
  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "shipments"), where("carrierId", "==", user.uid));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let total = 0;
      const chartMap: Record<string, number> = {};

      snapshot.forEach((doc) => {
          const load = doc.data();
          const cost = parseFloat(load.finalCost || 0);
          total += cost;

          const dateLabel = load.date ? load.date.substring(5) : 'N/A';
          chartMap[dateLabel] = (chartMap[dateLabel] || 0) + cost;
      });

      setTotalEarnings(total);

      const chartArray = Object.keys(chartMap).map(key => ({
          name: key,
          income: chartMap[key]
      }));

      setEarningsData(chartArray.length > 0 ? chartArray : [{ name: 'No Data', income: 0 }]);
    });

    return () => unsubscribe();
  }, [user]);

  // 3. Fetch Available Loads
  useEffect(() => {
    if (!isVerified) return; 

    const q = query(collection(db, "shipments"), where("status", "==", "Pending"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loads: any[] = [];
      snapshot.forEach((doc) => {
          loads.push({ id: doc.id, ...doc.data() });
      });
      setRealLoads(loads);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isVerified]);

  return (
    <div className="min-h-screen bg-brand-light p-4 sm:p-8">
       <div className="max-w-7xl mx-auto">

        {/* WARNING BANNER: Profile Incomplete */}
        {!profileComplete && (
            <div className="bg-orange-50 border-l-4 border-brand-orange p-4 mb-8 flex flex-col md:flex-row md:items-center justify-between shadow-sm gap-4">
                <div className="flex gap-4">
                    <div className="p-2 bg-white rounded-full text-brand-orange shadow-sm h-fit">
                        <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">Your Profile is Incomplete</h3>
                        <p className="text-sm text-gray-600">You must set your DOT Number, Base Rate, and Payment Details to request verification.</p>
                    </div>
                </div>
                <Link to="/carrier/settings" className="bg-brand-orange text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-orange-600 transition-colors whitespace-nowrap text-center">
                    Complete Profile
                </Link>
            </div>
        )}

        {/* INFO BANNER: Verification Pending */}
        {profileComplete && !isVerified && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8 flex items-start gap-4 shadow-sm">
                <div className="p-2 bg-white rounded-full text-blue-500 shadow-sm">
                    <Lock className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="font-bold text-gray-900">Verification Pending</h3>
                    <p className="text-sm text-gray-600 max-w-2xl">
                        Profile Complete! Our team is reviewing your DOT# <strong>{carrierData?.dotNumber}</strong> and insurance. 
                        You will gain access to the Load Board once verified.
                    </p>
                </div>
            </div>
        )}

        <header className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-brand-dark font-heading">Carrier Portal</h1>
            <p className="text-gray-500 flex items-center gap-2">
                ID: #{carrierData?.dotNumber || user?.uid?.slice(0,6).toUpperCase() || 'UNKNOWN'} 
                <span>•</span>
                {carrierData?.rating > 0 ? (
                    <>Rating: {carrierData.rating} <Star className="w-3 h-3 text-yellow-500 inline fill-yellow-500"/></>
                ) : (
                    <span className="text-blue-600 font-semibold text-xs bg-blue-50 px-2 py-1 rounded">New Member</span>
                )}
            </p>
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
          
          {/* LEFT COLUMN: Main Load Board */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Search/Filter */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-2">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search routes or zip codes..." 
                  disabled={!isVerified}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-dark disabled:bg-gray-50 disabled:cursor-not-allowed"
                />
              </div>
              <button disabled={!isVerified} className="bg-brand-dark text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-900 disabled:opacity-50 disabled:cursor-not-allowed">
                Find Loads
              </button>
            </div>

            {/* LIVE LOADS FEED */}
            {isVerified ? (
                // --- VERIFIED VIEW ---
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
                                  ${Math.round(load.finalCost || 0)}
                                </p>
                                <p className="text-xs text-brand-green font-bold">Payout</p>
                              </div>
                              <button onClick={() => alert("Load Accepted! (Demo)")} className="bg-brand-orange text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-orange-600 transition-colors">
                                Accept Load
                              </button>
                            </div>
                          </div>
                        ))
                     )}
                   </div>
                </div>
            ) : (
                // --- UNVERIFIED / LOCKED VIEW ---
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 relative overflow-hidden h-96">
                        
                        {/* The Overlay */}
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-20 flex flex-col items-center justify-center text-center p-6">
                            <div className="bg-gray-100 p-4 rounded-full mb-4 ring-8 ring-gray-50">
                                <Lock className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">Load Board Locked</h3>
                            <p className="text-gray-500 max-w-sm mt-2">
                                Access is restricted to verified carriers. Our team is currently reviewing your documents.
                            </p>
                        </div>

                        {/* The Fake Background Content (Visual Only) */}
                        <div className="opacity-30 pointer-events-none select-none p-6 space-y-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg bg-gray-50">
                                    <div className="flex gap-4 w-1/2">
                                        <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                                        <div className="space-y-2 w-full">
                                            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                        </div>
                                    </div>
                                    <div className="h-8 bg-gray-300 rounded w-24"></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Market Trends (Visible) */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-2 mb-4">
                            <Activity className="w-5 h-5 text-brand-orange" />
                            <h3 className="font-bold text-brand-dark">Market Trends</h3>
                        </div>
                        <p className="text-sm text-gray-600">
                            Even while you wait, you can see that National dry van rates are averaging <strong>$2.14/mile</strong> this week. 
                            High demand detected in <strong>Midwest {'->'} Southeast</strong> lanes.
                        </p>
                    </div>
                </div>
            )}
          </div>

          {/* RIGHT COLUMN: Sidebar */}
          <div className="space-y-8">
            {/* REAL Earnings Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
               <div className="flex items-center gap-3 mb-6">
                 <div className="p-2 bg-green-100 text-brand-green rounded-lg">
                   <Wallet className="w-5 h-5" />
                 </div>
                 <div>
                   <p className="text-xs text-gray-500">Total Earnings</p>
                   {/* REAL TOTAL */}
                   <h3 className="text-xl font-bold text-brand-dark">${totalEarnings.toLocaleString()}</h3>
                 </div>
               </div>
               <div className="h-48" style={{ height: 200, width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={earningsData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0"/>
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10}}/>
                      <YAxis hide/>
                      <Tooltip formatter={(value) => [`$${value}`, 'Income']} />
                      <Area type="monotone" dataKey="income" stroke="#4CAF50" fillOpacity={1} fill="#4CAF50" />
                    </AreaChart>
                 </ResponsiveContainer>
               </div>
            </div>

            {/* Reviews (Static for now, but linked to logic) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Reviews</h3>
              {/* If no rating, show empty state */}
              {(!carrierData?.rating || carrierData?.rating === 0) ? (
                  <p className="text-sm text-gray-500 italic">No reviews yet. Complete your first trip to get rated!</p>
              ) : (
                  <div className="space-y-4">
                      {/* Map reviews here when we have them in DB */}
                      <p className="text-sm text-gray-500">Reviews will appear here.</p>
                  </div>
              )}
            </div>
          </div>
        </div>
       </div>
    </div>
  );
};

export default CarrierDashboard;