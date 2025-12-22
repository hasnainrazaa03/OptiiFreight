import React, { useState } from 'react';
import { Truck, Map, Wallet, Bell, Search, MapPin, ChevronRight, Star, User } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const incomeData = [
  { name: 'Week 1', income: 1200 },
  { name: 'Week 2', income: 1800 },
  { name: 'Week 3', income: 1500 },
  { name: 'Week 4', income: 2100 },
];

const availableLoads = [
  { id: 1, route: 'Chicago, IL -> Detroit, MI', weight: '2,400 lbs', price: '$850', match: '98%' },
  { id: 2, route: 'Chicago, IL -> Milwaukee, WI', weight: '1,100 lbs', price: '$420', match: '85%' },
  { id: 3, route: 'Indianapolis, IN -> St. Louis, MO', weight: '5,000 lbs', price: '$1,200', match: '92%' },
];

const reviews = [
  { id: 1, user: 'Global Foods Ltd.', rating: 5, comment: 'Excellent service, arrived early.', date: '2 days ago' },
  { id: 2, user: 'Tech Systems Inc.', rating: 4, comment: 'Good handling of fragile goods.', date: '1 week ago' },
  { id: 3, user: 'Midwest Furniture', rating: 5, comment: 'Driver was very professional and communicative.', date: '2 weeks ago' }
];

const CarrierDashboard: React.FC = () => {
  const [isOnline, setIsOnline] = useState(true);

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

            {/* Recommended Loads */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
               <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                 <h3 className="font-bold text-lg text-brand-dark">Optimized Matches for You</h3>
                 <span className="text-xs font-bold text-brand-green bg-green-50 px-2 py-1 rounded">AI Matched</span>
               </div>
               <div className="divide-y divide-gray-100">
                 {availableLoads.map((load) => (
                   <div key={load.id} className="p-6 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                     <div className="flex items-start gap-4">
                       <div className="p-3 bg-brand-light rounded-lg text-brand-dark">
                         <MapPin className="w-6 h-6" />
                       </div>
                       <div>
                         <h4 className="font-bold text-brand-dark">{load.route}</h4>
                         <p className="text-sm text-gray-500 mt-1">{load.weight} • Partial Load</p>
                         <div className="mt-2 flex gap-2">
                            <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Verified Shipper</span>
                         </div>
                       </div>
                     </div>
                     <div className="flex items-center gap-6">
                       <div className="text-right">
                         <p className="text-lg font-bold text-brand-dark">{load.price}</p>
                         <p className="text-xs text-brand-green font-bold">{load.match} Match</p>
                       </div>
                       <button className="bg-brand-orange text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-orange-600 transition-colors">
                         Accept
                       </button>
                     </div>
                   </div>
                 ))}
               </div>
               <div className="p-4 bg-gray-50 text-center">
                 <button className="text-brand-dark font-semibold text-sm hover:text-blue-700 flex items-center justify-center gap-1">
                   View All Loads <ChevronRight className="w-4 h-4" />
                 </button>
               </div>
            </div>

            {/* Active Trips Visualization (Placeholder) */}
            <div className="bg-brand-dark rounded-xl shadow-sm p-6 text-white relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="font-bold text-lg mb-2">Current Trip: Atlanta, GA → Nashville, TN</h3>
                <div className="flex items-center gap-4 text-sm text-blue-200 mb-6">
                  <span><Truck className="w-4 h-4 inline mr-1"/> 65% Full</span>
                  <span><Map className="w-4 h-4 inline mr-1"/> 2 Stops Remaining</span>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-lg p-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span>180 mi / 250 mi</span>
                  </div>
                  <div className="w-full bg-blue-900 rounded-full h-2">
                    <div className="bg-brand-orange h-2 rounded-full" style={{width: '72%'}}></div>
                  </div>
                </div>
              </div>
              {/* Abstract Map Pattern BG */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
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
               <div className="h-48">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={incomeData}>
                      <defs>
                        <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#4CAF50" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0"/>
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10}} hide/>
                      <YAxis hide/>
                      <Tooltip formatter={(value) => [`$${value}`, 'Income']} />
                      <Area type="monotone" dataKey="income" stroke="#4CAF50" fillOpacity={1} fill="url(#colorIncome)" />
                    </AreaChart>
                 </ResponsiveContainer>
               </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-900">Recent Customer Reviews</h3>
                <span className="text-xs text-brand-orange font-semibold">View All</span>
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
                    <p className="text-[10px] text-gray-400 mt-1">{review.date}</p>
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