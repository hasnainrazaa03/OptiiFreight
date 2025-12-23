import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Plus, DollarSign, Clock, MapPin } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', savings: 450 },
  { name: 'Tue', savings: 320 },
  { name: 'Wed', savings: 210 },
  { name: 'Thu', savings: 280 },
  { name: 'Fri', savings: 190 },
  { name: 'Sat', savings: 240 },
  { name: 'Sun', savings: 350 },
];

const mockShipments = [
  { id: 'SH-1023', origin: 'New York, NY', destination: 'Boston, MA', weight: 900, date: '2023-10-25', status: 'In Transit', cost: 450 },
  { id: 'SH-1024', origin: 'Chicago, IL', destination: 'Detroit, MI', weight: 2400, date: '2023-10-26', status: 'Pending', cost: 850 },
  { id: 'SH-1025', origin: 'Los Angeles, CA', destination: 'San Francisco, CA', weight: 1500, date: '2023-10-24', status: 'Delivered', cost: 550 },
];

const BusinessDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-brand-light p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-brand-dark font-heading">Business Dashboard</h1>
            <p className="text-gray-500">Welcome back.</p>
          </div>
          <Link 
            to="/business/create"
            className="bg-brand-orange hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" /> New Shipment
          </Link>
        </header>

        {/* Quick Stats Grid - COMPLETE */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 text-brand-dark rounded-full">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Active Shipments</p>
                <h3 className="text-xl font-bold">12</h3>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 text-brand-green rounded-full">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Monthly Savings</p>
                <h3 className="text-xl font-bold">$16,400</h3>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 text-brand-orange rounded-full">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Avg Transit Time</p>
                <h3 className="text-xl font-bold">2.4 Days</h3>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 text-purple-600 rounded-full">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Routes Active</p>
                <h3 className="text-xl font-bold">8</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Recent Shipments Table */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-brand-dark mb-4">Recent Shipments</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-200 text-sm text-gray-500">
                    <th className="pb-3 font-medium">ID</th>
                    <th className="pb-3 font-medium">Route</th>
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium text-right">Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {mockShipments.map((s) => (
                    <tr key={s.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                      <td className="py-4 text-sm font-medium text-brand-dark">{s.id}</td>
                      <td className="py-4 text-sm text-gray-600">{s.origin} → <br/> {s.destination}</td>
                      <td className="py-4 text-sm text-gray-600">{s.date}</td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          s.status === 'In Transit' ? 'bg-blue-100 text-blue-700' :
                          s.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="py-4 text-sm font-medium text-brand-dark text-right">${s.cost.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Savings Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-brand-dark mb-4">Weekly Savings (USD)</h3>
            <div className="h-64" style={{ height: 300, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6B7280'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6B7280'}} />
                  <Tooltip 
                    cursor={{fill: '#F3F4F6'}}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    formatter={(value) => [`$${value}`, 'Savings']}
                  />
                  <Bar dataKey="savings" fill="#4CAF50" radius={[4, 4, 0, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800 font-medium">Tip: Consolidate your Friday shipments to save an extra 15%.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDashboard;