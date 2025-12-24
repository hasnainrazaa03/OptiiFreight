import React, { useState, useEffect } from 'react';
import { User, Truck, CreditCard, Save, CheckCircle, AlertCircle } from 'lucide-react';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useAuth } from '../../context/AuthContext';

const CarrierSettings: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'fleet' | 'payments'>('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Form State
  const [profileData, setProfileData] = useState({
    companyName: '',
    dotNumber: '',
    phone: '',
    address: ''
  });

  const [fleetData, setFleetData] = useState({
    carrierType: 'Owner-Operator',
    fleetSize: 1,
    equipmentType: 'Dry Van',
    baseRate: 0,
    homeBaseZip: ''
  });

  const [paymentData, setPaymentData] = useState({
    bankName: '',
    accountNumber: '',
    routingNumber: ''
  });

  // 1. Fetch Data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        const docRef = doc(db, "carriers", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfileData({
            companyName: data.companyName || '',
            dotNumber: data.dotNumber || '',
            phone: data.phone || '',
            address: data.address || ''
          });
          setFleetData({
            carrierType: data.carrierType || 'Owner-Operator',
            fleetSize: data.fleetSize || 1,
            equipmentType: data.equipmentType || 'Dry Van',
            baseRate: data.baseRate || 0,
            homeBaseZip: data.homeBaseZip || ''
          });
          setPaymentData({
            bankName: data.bankName || '',
            accountNumber: data.accountNumber || '',
            routingNumber: data.routingNumber || ''
          });
        }
      } catch (err) {
        console.error("Error fetching settings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  // 2. Strict Validation Logic
  const validateForm = () => {
    if (!profileData.dotNumber) return "DOT Number is required for verification.";
    if (!profileData.companyName) return "Company Name is required.";
    if (!fleetData.baseRate || fleetData.baseRate <= 0) return "Please set a valid Base Rate ($/mile).";
    if (!paymentData.accountNumber || !paymentData.routingNumber) return "Payment details are required for verification.";
    return null; // No errors
  };

  // 3. Save Logic
  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      // Check if profile is complete enough to be "Ready for Verification"
      const validationError = validateForm();
      const isComplete = validationError === null;

      const docRef = doc(db, "carriers", user.uid);
      
      await updateDoc(docRef, {
        ...profileData,
        ...fleetData,
        ...paymentData,
        // Only mark complete if ALL fields are present
        profileComplete: isComplete, 
        updatedAt: new Date().toISOString()
      });

      if (isComplete) {
        setSuccessMsg('Profile updated! You are now pending verification.');
      } else {
        // Save worked, but not complete yet
        setSuccessMsg('Progress saved. Please fill ALL sections to request verification.');
      }
      
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error("Error saving settings:", err);
      setErrorMsg("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading settings...</div>;

  return (
    <div className="min-h-screen bg-brand-light p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-brand-dark mb-6">Account Settings</h1>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row min-h-[500px]">
          
          {/* Sidebar Tabs */}
          <div className="w-full md:w-64 bg-gray-50 border-r border-gray-100 p-4">
            <nav className="space-y-2">
              <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'profile' ? 'bg-white text-brand-orange shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}>
                <User className="w-4 h-4" /> Company Profile
              </button>
              <button onClick={() => setActiveTab('fleet')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'fleet' ? 'bg-white text-brand-orange shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}>
                <Truck className="w-4 h-4" /> Fleet Details
              </button>
              <button onClick={() => setActiveTab('payments')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'payments' ? 'bg-white text-brand-orange shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}>
                <CreditCard className="w-4 h-4" /> Payment Methods
              </button>
            </nav>
            {/* Status Indicator */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg text-xs text-blue-800">
               <p className="font-bold mb-1">Requirements:</p>
               <ul className="list-disc list-inside space-y-1">
                 <li className={profileData.dotNumber ? 'text-green-600' : 'text-red-500'}>DOT Number</li>
                 <li className={fleetData.baseRate > 0 ? 'text-green-600' : 'text-red-500'}>Base Rate</li>
                 <li className={paymentData.accountNumber ? 'text-green-600' : 'text-red-500'}>Bank Details</li>
               </ul>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 p-8">
            
            {successMsg && (
              <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg flex items-center gap-2">
                <CheckCircle className="w-5 h-5" /> {successMsg}
              </div>
            )}
            {errorMsg && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5" /> {errorMsg}
              </div>
            )}

            {/* TAB: PROFILE */}
            {activeTab === 'profile' && (
              <div className="space-y-6 animate-in fade-in">
                <h2 className="text-xl font-bold text-gray-800">Company Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                    <input value={profileData.companyName} onChange={(e) => setProfileData({...profileData, companyName: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">USDOT Number *</label>
                    <input value={profileData.dotNumber} onChange={(e) => setProfileData({...profileData, dotNumber: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-yellow-50" placeholder="Required for verification" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input value={profileData.phone} onChange={(e) => setProfileData({...profileData, phone: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input value={profileData.address} onChange={(e) => setProfileData({...profileData, address: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                  </div>
                </div>
              </div>
            )}

            {/* TAB: FLEET */}
            {activeTab === 'fleet' && (
              <div className="space-y-6 animate-in fade-in">
                <h2 className="text-xl font-bold text-gray-800">Fleet Operations</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Carrier Type</label>
                    <select value={fleetData.carrierType} onChange={(e) => setFleetData({...fleetData, carrierType: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2">
                      <option>Owner-Operator</option>
                      <option>Fleet Owner</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fleet Size</label>
                    <input type="number" value={fleetData.fleetSize} onChange={(e) => setFleetData({...fleetData, fleetSize: parseInt(e.target.value)})} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Primary Equipment</label>
                    <select value={fleetData.equipmentType} onChange={(e) => setFleetData({...fleetData, equipmentType: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2">
                      <option>Dry Van (53')</option>
                      <option>Reefer</option>
                      <option>Flatbed</option>
                      <option>Box Truck</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Base Rate ($/mile) *</label>
                    <input type="number" step="0.01" value={fleetData.baseRate} onChange={(e) => setFleetData({...fleetData, baseRate: parseFloat(e.target.value)})} className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-yellow-50" />
                  </div>
                </div>
              </div>
            )}

            {/* TAB: PAYMENTS */}
            {activeTab === 'payments' && (
               <div className="space-y-6 animate-in fade-in">
                 <h2 className="text-xl font-bold text-gray-800">Payout Preferences</h2>
                 <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex gap-3 mb-6">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <p className="text-sm text-blue-800">
                      Payment details are required to verify your identity and enable payouts.
                    </p>
                 </div>
                 
                 <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                      <input value={paymentData.bankName} onChange={(e) => setPaymentData({...paymentData, bankName: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Account Number *</label>
                        <input type="password" value={paymentData.accountNumber} onChange={(e) => setPaymentData({...paymentData, accountNumber: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-yellow-50" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Routing Number *</label>
                        <input value={paymentData.routingNumber} onChange={(e) => setPaymentData({...paymentData, routingNumber: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-yellow-50" />
                      </div>
                    </div>
                 </div>
               </div>
            )}

            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
               <button onClick={handleSave} disabled={saving} className="bg-brand-dark text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-900 transition-colors flex items-center gap-2">
                 {saving ? 'Saving...' : 'Save & Update'} <Save className="w-4 h-4" />
               </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CarrierSettings;