import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Box } from 'lucide-react';
import { calculateDistance } from '../../utils/distance';

const CreateShipment: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const miles = calculateDistance(formData.originZip, formData.destZip);

    // JUST NAVIGATE. Do not save to DB yet.
    // We pass the raw form data to the next page via React Router state.
    setTimeout(() => {
        navigate('/business/trucks', { 
            state: { 
              shipmentData: { ...formData, distance: miles }, // Save miles to state
            } 
        });
        setLoading(false);
    }, 500);
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
                <input required name="originZip" type="text" value={formData.originZip} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="e.g. 10001" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Destination Zip Code *</label>
                <input required name="destZip" type="text" value={formData.destZip} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="e.g. 90210" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weight (lbs) *</label>
                <input required name="weight" type="number" value={formData.weight} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="2500" />
              </div>
              <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Date *</label>
                 <input required name="date" type="date" value={formData.date} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dimensions (L x W x H in inches) *</label>
              <div className="grid grid-cols-3 gap-2">
                <input required name="length" onChange={handleChange} placeholder="L" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                <input required name="width" onChange={handleChange} placeholder="W" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                <input required name="height" onChange={handleChange} placeholder="H" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Pallets</label>
                <div className="relative">
                  <Box className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                  <input name="pallets" type="number" value={formData.pallets} onChange={handleChange} className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2" placeholder="0" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cargo Type</label>
                <select name="cargoType" value={formData.cargoType} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option>General Freight</option>
                  <option>Fragile</option>
                  <option>Perishable</option>
                  <option>Hazardous</option>
                </select>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-brand-dark text-white py-3 rounded-lg font-medium hover:bg-blue-900 transition-colors flex items-center justify-center gap-2 text-lg mt-4 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Check Availability'} <ArrowRight className="w-5 h-5"/>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateShipment;