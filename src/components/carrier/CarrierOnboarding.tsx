import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, ShieldCheck, MapPin, Users, ArrowRight } from 'lucide-react';
import { doc, setDoc } from "firebase/firestore"; 
import { db, auth } from "../../lib/firebase";
import { useAuth } from '../../context/AuthContext';

const CarrierOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    companyName: '',
    dotNumber: '',
    carrierType: 'Owner-Operator', // Default
    fleetSize: 1,
    equipmentType: 'Dry Van (53\')',
    baseRate: '',
    homeBaseZip: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSkip = async () => {
    if (!user) return;
    setLoading(true);
    try {
       // Create a minimal "Skeleton" profile so they exist in the DB
       await setDoc(doc(db, "carriers", user.uid), {
         uid: user.uid,
         email: user.email,
         companyName: 'Unregistered Carrier', // Placeholder
         verified: false,
         profileComplete: false, // Flag to check later
         joinedAt: new Date().toISOString()
       });
       navigate('/carrier');
    } catch (e) {
       console.error("Skip error", e);
    } finally {
       setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);

    try {
      // Create the Carrier Profile linked to their Auth UID
      // We use setDoc with user.uid so the ID matches their login ID
      await setDoc(doc(db, "carriers", user.uid), {
        ...formData,
        uid: user.uid,
        email: user.email,
        verified: false, // Default to unverified until Admin checks DOT#
        rating: 0,
        reviews: 0,     // New carriers start with 5 stars
        completedTrips: 0,
        joinedAt: new Date().toISOString()
      });

      // Redirect to Dashboard
      navigate('/carrier');
    } catch (error) {
      console.error("Error creating profile:", error);
      alert("Failed to save profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-light flex items-center justify-center p-4">
      <div className="bg-white max-w-2xl w-full rounded-xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-brand-dark p-6 text-white text-center">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
             <Truck className="w-8 h-8 text-brand-orange" />
          </div>
          <h1 className="text-2xl font-bold font-heading">Complete Your Carrier Profile</h1>
          <p className="text-blue-200">Tell us about your equipment to start getting load matches.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          {/* Company Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Company / Owner Name</label>
              <input required name="companyName" value={formData.companyName} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="e.g. Speedy Logistics LLC" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">USDOT Number</label>
              <div className="relative">
                 <ShieldCheck className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                 <input required name="dotNumber" value={formData.dotNumber} onChange={handleChange} className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2" placeholder="1234567" />
              </div>
            </div>
          </div>

          {/* Operation Type */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Operation Type</label>
            <div className="grid grid-cols-2 gap-4">
               <button 
                 type="button"
                 onClick={() => setFormData({...formData, carrierType: 'Owner-Operator', fleetSize: 1})}
                 className={`p-4 border rounded-xl text-left transition-all ${formData.carrierType === 'Owner-Operator' ? 'border-brand-orange bg-orange-50 ring-1 ring-brand-orange' : 'border-gray-200 hover:bg-gray-50'}`}
               >
                 <div className="font-bold text-brand-dark flex items-center gap-2"><Truck className="w-4 h-4"/> Owner-Operator</div>
                 <div className="text-xs text-gray-500 mt-1">I drive my own truck</div>
               </button>
               <button 
                 type="button"
                 onClick={() => setFormData({...formData, carrierType: 'Fleet Owner'})}
                 className={`p-4 border rounded-xl text-left transition-all ${formData.carrierType === 'Fleet Owner' ? 'border-brand-orange bg-orange-50 ring-1 ring-brand-orange' : 'border-gray-200 hover:bg-gray-50'}`}
               >
                 <div className="font-bold text-brand-dark flex items-center gap-2"><Users className="w-4 h-4"/> Fleet Owner</div>
                 <div className="text-xs text-gray-500 mt-1">I manage multiple trucks</div>
               </button>
            </div>
          </div>

          {/* Fleet Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fleet Size</label>
                <input 
                  type="number" 
                  name="fleetSize" 
                  min="1"
                  value={formData.fleetSize} 
                  onChange={handleChange} 
                  disabled={formData.carrierType === 'Owner-Operator'}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 disabled:bg-gray-100" 
                />
             </div>
             <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Primary Equipment</label>
                <select name="equipmentType" value={formData.equipmentType} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option>Dry Van (53')</option>
                  <option>Refrigerated (Reefer)</option>
                  <option>Flatbed</option>
                  <option>Box Truck (26')</option>
                </select>
             </div>
          </div>

          {/* Location & Rates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Base Rate (Per Mile)</label>
                <div className="relative">
                   <span className="absolute left-3 top-2 text-gray-500">$</span>
                   <input type="number" step="0.01" name="baseRate" value={formData.baseRate} onChange={handleChange} className="w-full border border-gray-300 rounded-lg pl-7 pr-3 py-2" placeholder="2.00" />
                </div>
             </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Home Base Zip</label>
                <div className="relative">
                   <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                   <input required name="homeBaseZip" value={formData.homeBaseZip} onChange={handleChange} className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2" placeholder="90001" />
                </div>
             </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-brand-dark text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-900 transition-colors flex items-center justify-center gap-2"
          >
            {loading ? 'Creating Profile...' : 'Complete Registration'} <ArrowRight className="w-5 h-5"/>
          </button>
          <button 
            type="button"
            onClick={handleSkip}
            className="w-full bg-white text-gray-500 py-4 rounded-lg font-medium hover:text-gray-800 transition-colors mt-2"
          >
            I'll do this later (Skip)
          </button>
        </form>
      </div>
    </div>
  );
};

export default CarrierOnboarding;