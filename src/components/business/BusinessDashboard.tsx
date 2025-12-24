import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Plus, DollarSign, Clock, MapPin, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db, auth } from "../../lib/firebase";

const BusinessDashboard: React.FC = () => {
  const [shipments, setShipments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    active: 0,
    spent: 0,
    savings: 0,
    avgTransit: 0, // Initialize to 0 or 'N/A'
    routesActive: 0
  });

  // Fetch Real Shipments
  useEffect(() => {
    if (!auth.currentUser) return;

    // Query: All shipments created by THIS user
    const q = query(collection(db, "shipments"), where("userId", "==", auth.currentUser.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched: any[] = [];
      let activeCount = 0;
      let totalSpent = 0;
      let totalTransitDays = 0;
      let deliveredCount = 0;
      
      // Use a Set to count unique routes (Origin -> Dest)
      const uniqueRoutes = new Set();

      snapshot.forEach((doc) => {
        const data = doc.data();
        fetched.push({ id: doc.id, ...data });
        
        // 1. Active Shipments
        if (data.status !== 'Delivered') {
            activeCount++;
            // Track active routes
            if (data.originZip && data.destZip) {
                uniqueRoutes.add(`${data.originZip}-${data.destZip}`);
            }
        }

        // 2. Total Spent
        if (data.finalCost) {
            totalSpent += parseFloat(data.finalCost);
        }

        // 3. Avg Transit Calculation (Mock logic if real dates missing)
        // In a real app, diff(deliveryDate, pickupDate)
        // Here we assume '2 days' for every completed/in-transit shipment just for the metric
        if (data.status === 'Delivered' || data.status === 'In Transit') {
            totalTransitDays += 2; 
            deliveredCount++;
        }
      });

      // Sort by date (newest first)
      fetched.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      // Calculate Averages
      const calculatedAvg = deliveredCount > 0 ? (totalTransitDays / deliveredCount).toFixed(1) : 0;

      setShipments(fetched);
      setStats({
        active: activeCount,
        spent: totalSpent,
        savings: Math.round(totalSpent * 0.2), // estimated 20% savings vs LTL
        avgTransit: Number(calculatedAvg),
        routesActive: uniqueRoutes.size
      });
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Chart Data based on calculated savings
  const chartData = [
    { name: 'Mon', savings: 0 },
    { name: 'Tue', savings: 0 },
    { name: 'Wed', savings: stats.savings > 0 ? stats.savings : 0 }, // Show current savings here
    { name: 'Thu', savings: 0 },
    { name: 'Fri', savings: 0 },
  ];

  return (
    <div className="min-h-screen bg-brand-light p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-brand-dark font-heading">Business Dashboard</h1>
            <p className="text-gray-500">Manage your freight and track shipments.</p>
          </div>
          <Link 
            to="/business/create"
            className="bg-brand-orange hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" /> New Shipment
          </Link>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 text-brand-dark rounded-full"><Package className="w-6 h-6" /></div>
              <div><p className="text-sm text-gray-500">Active Shipments</p><h3 className="text-xl font-bold">{stats.active}</h3></div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 text-brand-green rounded-full"><DollarSign className="w-6 h-6" /></div>
              <div><p className="text-sm text-gray-500">Total Spent</p><h3 className="text-xl font-bold">${stats.spent.toLocaleString()}</h3></div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 text-brand-orange rounded-full"><Clock className="w-6 h-6" /></div>
              <div>
                  <p className="text-sm text-gray-500">Avg Transit</p>
                  <h3 className="text-xl font-bold">{stats.avgTransit > 0 ? `${stats.avgTransit} Days` : '---'}</h3>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 text-purple-600 rounded-full"><MapPin className="w-6 h-6" /></div>
              <div><p className="text-sm text-gray-500">Routes Active</p><h3 className="text-xl font-bold">{stats.routesActive}</h3></div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Recent Shipments Table */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-brand-dark mb-4">Your Shipments</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-200 text-sm text-gray-500">
                    <th className="pb-3 font-medium">Route</th>
                    <th className="pb-3 font-medium">Details</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium text-right">Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                     <tr><td colSpan={4} className="text-center py-4">Loading data...</td></tr>
                  ) : shipments.length === 0 ? (
                     <tr><td colSpan={4} className="text-center py-4 text-gray-400">No shipments found. Create one!</td></tr>
                  ) : (
                    shipments.map((s) => (
                      <tr key={s.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                        <td className="py-4 text-sm text-gray-600">
                           <span className="font-bold text-brand-dark">{s.originZip}</span> <ArrowRight className="w-3 h-3 inline mx-1"/> <span className="font-bold text-brand-dark">{s.destZip}</span>
                        </td>
                        <td className="py-4 text-sm text-gray-500">{s.weight} lbs • {s.cargoType}</td>
                        <td className="py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            s.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                            s.status === 'Accepted' ? 'bg-blue-100 text-blue-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {s.status}
                          </span>
                        </td>
                        <td className="py-4 text-sm font-medium text-brand-dark text-right">${s.finalCost ? s.finalCost : '---'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Savings Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-brand-dark mb-4">Estimated Savings</h3>
            <div className="h-64" style={{ height: 300, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6B7280'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6B7280'}} />
                  <Tooltip />
                  <Bar dataKey="savings" fill="#4CAF50" radius={[4, 4, 0, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDashboard;