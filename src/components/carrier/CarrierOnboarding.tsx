import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, ShieldCheck, MapPin, Users, ArrowRight, AlertTriangle, CheckCircle, ArrowLeft, Building2, Phone, Plus, Trash2 } from 'lucide-react';
import { doc, setDoc, collection, addDoc } from "firebase/firestore"; 
import { db, auth } from "../../lib/firebase";
import { useAuth } from '../../context/AuthContext';

interface VehicleDraft {
  unitNumber: string;
  type: string;
  make: string;
  model: string;
  year: string;
  vin: string;
  plate: string;
  rateA: number;
  rateB: number;
  rateC: number;
}

const CarrierOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Main Profile State
  const [profileData, setProfileData] = useState({
    companyName: '',
    dotNumber: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    carrierType: '', 
    fleetSize: 1,
  });

  // Vehicle State
  const [vehicles, setVehicles] = useState<VehicleDraft[]>([]);
  const [currentVehicle, setCurrentVehicle] = useState<VehicleDraft>({
    unitNumber: 'Truck 1',
    type: 'Dry Van',
    make: '', model: '', year: '', vin: '', plate: '',
    rateA: 2.50, rateB: 1.85, rateC: 0.32
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleVehicleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value;
    setCurrentVehicle({ ...currentVehicle, [e.target.name]: value });
  };

  // Add current form data to the list
  const addVehicleToList = () => {
    setVehicles([...vehicles, currentVehicle]);
    // Reset form for next vehicle
    setCurrentVehicle({
        unitNumber: `Truck ${vehicles.length + 2}`,
        type: 'Dry Van',
        make: '', model: '', year: '', vin: '', plate: '',
        rateA: 2.50, rateB: 1.85, rateC: 0.32
    });
  };

  const removeVehicle = (index: number) => {
    const updated = [...vehicles];
    updated.splice(index, 1);
    setVehicles(updated);
  };

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      // 1. Create Main Profile
      await setDoc(doc(db, "carriers", user.uid), {
        uid: user.uid,
        email: user.email,
        ...profileData,
        address: `${profileData.street}, ${profileData.city}, ${profileData.state} ${profileData.zip}`,
        
        // Defaults from first vehicle if available, else standard
        rateA: vehicles[0]?.rateA || currentVehicle.rateA, 
        rateB: vehicles[0]?.rateB || currentVehicle.rateB,
        rateC: vehicles[0]?.rateC || currentVehicle.rateC,
        
        fleetSize: vehicles.length + 1, // +1 for the one currently in form if submitted directly
        verified: false,
        profileComplete: false,
        rating: 0,
        reviews: 0,
        joinedAt: new Date().toISOString()
      });

      // 2. Add All Vehicles (The list + the one currently in form if it has data)
      // If user filled the form but didn't click "Add", we still want to save it as the primary
      const finalVehicleList = [...vehicles];
      // Only push current form if it's not empty/duplicate (simple check)
      if (currentVehicle.unitNumber) {
          finalVehicleList.push(currentVehicle);
      }

      const vehiclesRef = collection(db, "carriers", user.uid, "vehicles");
      
      // Batch writes using Promise.all
      await Promise.all(finalVehicleList.map(v => 
          addDoc(vehiclesRef, {
              ...v,
              registrationUrl: '' // Placeholder for doc
          })
      ));

      // 3. FORCE REDIRECT
      navigate('/carrier'); 

    } catch (error) {
      console.error("Error creating profile:", error);
      alert("Failed to save profile. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleSkipAsset = async () => {
    // Saves profile with NO vehicles
    if (!user) return;
    setLoading(true);
    try {
        await setDoc(doc(db, "carriers", user.uid), {
            uid: user.uid,
            email: user.email,
            ...profileData,
            address: `${profileData.street}, ${profileData.city}, ${profileData.state} ${profileData.zip}`,
            rateA: 2.50, rateB: 1.85, rateC: 0.32,
            verified: false,
            profileComplete: false,
            rating: 0,
            reviews: 0,
            joinedAt: new Date().toISOString()
        });
        navigate('/carrier');
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  // --- STEPS ---

  const renderStep1 = () => (
    <div className="space-y-6 animate-in slide-in-from-right duration-300">
        <h2 className="text-xl font-bold text-gray-800">Company Identity</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Company Name</label>
                <div className="relative">
                    <Building2 className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input required name="companyName" value={profileData.companyName} onChange={handleProfileChange} className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2.5" placeholder="e.g. Speedy Logistics LLC" />
                </div>
            </div>
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">USDOT Number</label>
                <div className="relative">
                    <ShieldCheck className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input required name="dotNumber" value={profileData.dotNumber} onChange={handleProfileChange} className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2.5" placeholder="1234567" />
                </div>
            </div>
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phone Number</label>
                <div className="relative">
                    <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input required type="tel" name="phone" value={profileData.phone} onChange={handleProfileChange} className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2.5" placeholder="(555) 000-0000" />
                </div>
            </div>
            <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Street Address</label>
                <input required name="street" value={profileData.street} onChange={handleProfileChange} className="w-full border border-gray-300 rounded-lg px-3 py-2.5" placeholder="1234 Logistics Way" />
            </div>
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">City</label>
                <input required name="city" value={profileData.city} onChange={handleProfileChange} className="w-full border border-gray-300 rounded-lg px-3 py-2.5" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">State</label>
                    <input required name="state" value={profileData.state} onChange={handleProfileChange} className="w-full border border-gray-300 rounded-lg px-3 py-2.5" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Zip</label>
                    <input required name="zip" value={profileData.zip} onChange={handleProfileChange} className="w-full border border-gray-300 rounded-lg px-3 py-2.5" />
                </div>
            </div>
        </div>
        <button onClick={handleNext} disabled={!profileData.companyName || !profileData.dotNumber} className="w-full bg-brand-dark text-white py-3 rounded-lg font-bold mt-4 disabled:opacity-50 hover:bg-blue-900">
            Next: Operational Model
        </button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6 animate-in slide-in-from-right duration-300">
        <h2 className="text-xl font-bold text-gray-800">Operational Model</h2>
        <div className="bg-orange-50 border-l-4 border-brand-orange p-4 rounded-r-lg">
            <div className="flex gap-3">
                <AlertTriangle className="w-5 h-5 text-brand-orange flex-shrink-0" />
                <p className="text-sm text-orange-800">
                    <strong>Important:</strong> You cannot change this later without support approval.
                </p>
            </div>
        </div>
        <div className="grid grid-cols-1 gap-4">
            {['Owner-Operator', 'Fleet Owner'].map((type) => (
                <button 
                    key={type}
                    type="button"
                    onClick={() => setProfileData({...profileData, carrierType: type})}
                    className={`p-6 border-2 rounded-xl text-left transition-all ${profileData.carrierType === type ? 'border-brand-dark bg-blue-50 ring-1 ring-brand-dark' : 'border-gray-200 hover:border-gray-300'}`}
                >
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 font-bold text-lg text-brand-dark">
                            {type === 'Owner-Operator' ? <Truck className="w-5 h-5"/> : <Users className="w-5 h-5"/>} {type}
                        </div>
                        {profileData.carrierType === type && <CheckCircle className="w-5 h-5 text-brand-green" />}
                    </div>
                    <p className="text-sm text-gray-600">{type === 'Owner-Operator' ? 'I own/drive a single truck.' : 'I manage multiple trucks/drivers.'}</p>
                </button>
            ))}
        </div>
        <div className="flex gap-4 mt-6">
            <button onClick={handleBack} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-bold">Back</button>
            <button onClick={handleNext} disabled={!profileData.carrierType} className="flex-1 bg-brand-dark text-white py-3 rounded-lg font-bold disabled:opacity-50">Next: Assets</button>
        </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6 animate-in slide-in-from-right duration-300 max-h-[60vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-gray-800">Fleet Assets</h2>
        <p className="text-sm text-gray-500">Add details for your {profileData.carrierType === 'Owner-Operator' ? 'truck' : 'fleet'}. You can skip and finish in Settings.</p>

        {/* List of Added Vehicles (Fleet Only) */}
        {vehicles.length > 0 && (
            <div className="space-y-2 mb-4">
                {vehicles.map((v, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-green-50 border border-green-100 rounded-lg">
                        <span className="font-bold text-green-800 text-sm">{v.unitNumber} ({v.type})</span>
                        <button type="button" onClick={() => removeVehicle(idx)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4"/></button>
                    </div>
                ))}
            </div>
        )}

        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase">
                {profileData.carrierType === 'Owner-Operator' ? 'My Truck Details' : `Add Vehicle #${vehicles.length + 1}`}
            </h3>
            
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Unit #</label>
                        <input name="unitNumber" value={currentVehicle.unitNumber} onChange={handleVehicleChange} className="w-full border rounded p-2 text-sm" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Type</label>
                        <select name="type" value={currentVehicle.type} onChange={handleVehicleChange} className="w-full border rounded p-2 text-sm">
                            <option>Dry Van</option><option>Reefer</option><option>Flatbed</option>
                        </select>
                    </div>
                </div>
                
                {/* Details (Optional) */}
                <div className="grid grid-cols-3 gap-3">
                    <input name="year" value={currentVehicle.year} onChange={handleVehicleChange} className="border rounded p-2 text-sm" placeholder="Year" />
                    <input name="make" value={currentVehicle.make} onChange={handleVehicleChange} className="border rounded p-2 text-sm" placeholder="Make" />
                    <input name="model" value={currentVehicle.model} onChange={handleVehicleChange} className="border rounded p-2 text-sm" placeholder="Model" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <input name="vin" value={currentVehicle.vin} onChange={handleVehicleChange} className="border rounded p-2 text-sm" placeholder="VIN (Optional)" />
                    <input name="plate" value={currentVehicle.plate} onChange={handleVehicleChange} className="border rounded p-2 text-sm" placeholder="Plate (Optional)" />
                </div>

                {/* Rates */}
                <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Base Rates (Default)</label>
                    <div className="grid grid-cols-3 gap-3">
                        <input type="number" step="0.01" name="rateA" value={currentVehicle.rateA} onChange={handleVehicleChange} className="border rounded p-2 text-sm" placeholder="$/mi" />
                        <input type="number" step="0.01" name="rateB" value={currentVehicle.rateB} onChange={handleVehicleChange} className="border rounded p-2 text-sm" placeholder="$/ft" />
                        <input type="number" step="0.01" name="rateC" value={currentVehicle.rateC} onChange={handleVehicleChange} className="border rounded p-2 text-sm" placeholder="$/lb" />
                    </div>
                </div>
            </div>

            {/* Add Another Button (Fleet Only) */}
            {profileData.carrierType === 'Fleet Owner' && (
                <button type="button" onClick={addVehicleToList} className="mt-4 w-full border border-dashed border-gray-400 text-gray-600 py-2 rounded-lg font-bold text-sm hover:bg-gray-100 flex items-center justify-center gap-2">
                    <Plus className="w-4 h-4" /> Save & Add Another Vehicle
                </button>
            )}
        </div>

        <div className="flex flex-col gap-3 mt-6">
            <button type="submit" disabled={loading} className="w-full bg-brand-dark text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-blue-900 transition-colors">
                {loading ? 'Finalizing...' : 'Complete Setup & Go to Dashboard'} <ArrowRight className="w-4 h-4"/>
            </button>
            <div className="flex gap-4">
                <button type="button" onClick={handleBack} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-200">Back</button>
                <button type="button" onClick={handleSkipAsset} disabled={loading} className="flex-1 border border-gray-300 text-gray-600 py-3 rounded-lg font-bold hover:bg-gray-50">
                    Skip Assets
                </button>
            </div>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-brand-light flex items-center justify-center p-4">
      <div className="bg-white max-w-lg w-full rounded-xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-brand-dark p-6 text-white text-center">
          <div className="flex justify-center gap-2 mb-4">
             {[1, 2, 3].map(i => (
                 <div key={i} className={`h-1.5 w-12 rounded-full transition-colors ${step >= i ? 'bg-brand-orange' : 'bg-white/20'}`}></div>
             ))}
          </div>
          <h1 className="text-2xl font-bold font-heading">
              {step === 1 ? 'Company Profile' : step === 2 ? 'Operational Model' : 'Fleet Assets'}
          </h1>
        </div>
        <form onSubmit={handleSubmit} className="p-8">
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
        </form>
      </div>
    </div>
  );
};

export default CarrierOnboarding;