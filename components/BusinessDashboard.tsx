import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Package, Plus, DollarSign, Clock, MapPin, Search, ArrowLeft, ArrowRight, Truck, Star, CheckCircle, CreditCard, Calendar, Box, XCircle } from 'lucide-react';
import { Shipment } from '../types';
import { Link, useNavigate } from 'react-router-dom';

const mockShipments: Shipment[] = [
  { id: 'SH-1023', origin: 'New York, NY', destination: 'Boston, MA', weight: 900, date: '2023-10-25', status: 'In Transit', cost: 450, savings: 120 },
  { id: 'SH-1024', origin: 'Chicago, IL', destination: 'Detroit, MI', weight: 2400, date: '2023-10-26', status: 'Pending', cost: 850, savings: 300 },
  { id: 'SH-1025', origin: 'Los Angeles, CA', destination: 'San Francisco, CA', weight: 1500, date: '2023-10-24', status: 'Delivered', cost: 550, savings: 150 },
];

const data = [
  { name: 'Mon', savings: 450 },
  { name: 'Tue', savings: 320 },
  { name: 'Wed', savings: 210 },
  { name: 'Thu', savings: 280 },
  { name: 'Fri', savings: 190 },
  { name: 'Sat', savings: 240 },
  { name: 'Sun', savings: 350 },
];

// --- COMPONENTS ---

// 1. Dashboard Overview
const BusinessDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-brand-light p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-brand-dark font-heading">Business Dashboard</h1>
            <p className="text-gray-500">Welcome back, Acme Logistics.</p>
          </div>
          <Link 
            to="/business/create"
            className="bg-brand-orange hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" /> New Shipment
          </Link>
        </header>

        <div className="space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                <div className="h-64">
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
    </div>
  );
};

// 2. Create Shipment Form
export const CreateShipment: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    originZip: '',
    destZip: '',
    weight: '',
    length: '',
    width: '',
    height: '',
    pallets: '',
    date: '',
    cargoType: 'General Freight'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, pass data via state or context
    navigate('/business/trucks');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  return (
    <div className="min-h-screen bg-brand-light p-4 sm:p-8">
      <div className="max-w-3xl mx-auto">
        <Link to="/business" className="flex items-center text-gray-500 hover:text-brand-dark mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Link>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-brand-dark mb-6">Create New Shipment</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Origin Zip Code *</label>
                <input 
                  required
                  name="originZip"
                  type="text" 
                  value={formData.originZip}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-dark focus:outline-none" 
                  placeholder="e.g. 10001" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Destination Zip Code *</label>
                <input 
                  required
                  name="destZip"
                  type="text" 
                  value={formData.destZip}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-dark focus:outline-none" 
                  placeholder="e.g. 90210" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weight (lbs) *</label>
                <input 
                  required
                  name="weight"
                  type="number" 
                  value={formData.weight}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-dark focus:outline-none" 
                  placeholder="2500" 
                />
              </div>
              <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Date *</label>
                 <input 
                  required
                  name="date"
                  type="date" 
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-dark focus:outline-none" 
                 />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dimensions (L x W x H in inches) *</label>
              <div className="grid grid-cols-3 gap-2">
                <input required name="length" onChange={handleChange} placeholder="Length" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                <input required name="width" onChange={handleChange} placeholder="Width" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                <input required name="height" onChange={handleChange} placeholder="Height" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Pallets</label>
                <div className="relative">
                  <Box className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                  <input 
                    name="pallets"
                    type="number" 
                    value={formData.pallets}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 focus:ring-2 focus:ring-brand-dark focus:outline-none" 
                    placeholder="0" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cargo Type</label>
                <select 
                  name="cargoType"
                  value={formData.cargoType}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-dark focus:outline-none"
                >
                  <option>General Freight</option>
                  <option>Fragile</option>
                  <option>Perishable</option>
                  <option>Hazardous</option>
                </select>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-brand-dark text-white py-3 rounded-lg font-medium hover:bg-blue-900 transition-colors flex items-center justify-center gap-2 text-lg mt-4"
            >
              Check Availability <ArrowRight className="w-5 h-5"/>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// 3. Truck Selection List
export const TruckSelection: React.FC = () => {
  const navigate = useNavigate();

  const trucks = [
    { id: 1, name: 'Speedy Haulage Inc.', rating: 4.8, rate: 1.85, total: 450, time: '2 Days' },
    { id: 2, name: 'US Logistics Co.', rating: 4.5, rate: 1.60, total: 390, time: '3 Days' },
    { id: 3, name: 'Prime Movers', rating: 4.9, rate: 2.10, total: 510, time: '1 Day' },
  ];

  return (
    <div className="min-h-screen bg-brand-light p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        <Link to="/business/create" className="flex items-center text-gray-500 hover:text-brand-dark mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Request
        </Link>
        
        <h2 className="text-2xl font-bold text-brand-dark mb-6">Available Trucks</h2>
        
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
                onClick={() => navigate('/business/payment')}
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

// 4. Payment Page
export const Payment: React.FC = () => {
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      navigate('/business'); // Back to dashboard
      alert('Shipment Booked Successfully!');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-brand-light p-4 sm:p-8 flex items-center justify-center">
      <div className="bg-white max-w-lg w-full rounded-xl shadow-lg border border-gray-100 p-8">
        <div className="flex items-center justify-between mb-6">
           <h2 className="text-2xl font-bold text-brand-dark text-center">Secure Payment</h2>
           <Link to="/business/trucks" className="text-gray-400 hover:text-gray-600">
             <ArrowLeft className="w-5 h-5"/>
           </Link>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Shipment ID</span>
            <span className="font-mono font-medium">#PEND-9921</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Carrier</span>
            <span className="font-medium">US Logistics Co.</span>
          </div>
          <div className="border-t border-gray-200 my-2 pt-2 flex justify-between text-lg font-bold text-brand-dark">
            <span>Total</span>
            <span>$390.00</span>
          </div>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input type="text" className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2" placeholder="0000 0000 0000 0000" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Expiry</label>
               <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="MM/YY" />
             </div>
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
               <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="123" />
             </div>
          </div>
          
          <button 
            type="button"
            onClick={handlePay}
            disabled={processing}
            className="w-full bg-brand-green hover:bg-green-600 text-white py-3 rounded-lg font-bold text-lg mt-4 flex items-center justify-center gap-2"
          >
            {processing ? 'Processing...' : 'Pay & Book'}
          </button>
          
          <button 
             type="button"
             onClick={() => navigate('/business/trucks')}
             className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-bold text-lg flex items-center justify-center gap-2"
          >
             <XCircle className="w-5 h-5" /> Cancel Transaction
          </button>
        </form>
        
        <div className="mt-6 flex items-center justify-center gap-2 text-gray-500 text-xs">
          <CheckCircle className="w-3 h-3 text-brand-green" />
          Payments are held in escrow until delivery.
        </div>
      </div>
    </div>
  );
};

export default BusinessDashboard;