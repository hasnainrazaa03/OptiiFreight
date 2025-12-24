import React, { useState, useEffect } from 'react';
import { User, Truck, CreditCard, Save, CheckCircle, AlertCircle, FileText, Upload, Check, Info } from 'lucide-react';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../../lib/firebase";
import { useAuth } from '../../context/AuthContext';

const CarrierSettings: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'fleet' | 'payments' | 'documents'>('profile');
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
    homeBaseZip: '',
    // 3 RATES
    rateA: 2.50, // Per Mile
    rateB: 1.85, // Per Cubic Foot
    rateC: 0.32  // Per Pound
  });

  const [paymentData, setPaymentData] = useState({
    bankName: '',
    accountNumber: '',
    routingNumber: ''
  });

  // New Document State
  const [docUrls, setDocUrls] = useState({
    insuranceUrl: '',
    cdlUrl: ''
  });
  
  // Upload Loading States
  const [uploadingField, setUploadingField] = useState<string | null>(null);

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
            homeBaseZip: data.homeBaseZip || '',
            // Load rates or default
            rateA: data.rateA || 2.50,
            rateB: data.rateB || 1.85,
            rateC: data.rateC || 0.32
          });
          setPaymentData({
            bankName: data.bankName || '',
            accountNumber: data.accountNumber || '',
            routingNumber: data.routingNumber || ''
          });
          // Load existing doc URLs
          setDocUrls({
            insuranceUrl: data.insuranceUrl || '',
            cdlUrl: data.cdlUrl || ''
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

  // 2. Mock File Upload Handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'insuranceUrl' | 'cdlUrl') => {
      if (!e.target.files?.[0]) return;
      
      setUploadingField(field);
      
      // Simulate Network Delay
      setTimeout(() => {
          // In real app: Upload to Firebase Storage here
          const mockUrl = "https://via.placeholder.com/150?text=VERIFIED+DOC";
          
          setDocUrls(prev => ({ ...prev, [field]: mockUrl }));
          setUploadingField(null);
          alert(`${field === 'insuranceUrl' ? 'Insurance' : 'CDL'} uploaded successfully!`);
      }, 1500);
  };

  // 3. Strict Validation Logic
  const validateForm = () => {
    if (!profileData.dotNumber) return "DOT Number is required for verification.";
    if (!profileData.companyName) return "Company Name is required.";
    // Validate Rate A (Mile) specifically as it's critical
    if (!fleetData.rateA || fleetData.rateA <= 0) return "Mileage Rate (Rate A) is required.";
    
    // NEW: STRICT PAYMENT VALIDATION
    if (!paymentData.bankName || !paymentData.accountNumber || !paymentData.routingNumber) {
        return "Complete Payment Details are required for verification.";
    }
    
    // NEW: DOCUMENT VALIDATION
    if (!docUrls.insuranceUrl || !docUrls.cdlUrl) return "Please upload both Insurance and CDL documents.";
    
    return null; // No errors
  };

  // 4. Save Logic
  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const validationError = validateForm();
      const isComplete = validationError === null;

      const docRef = doc(db, "carriers", user.uid);
      
      await updateDoc(docRef, {
        ...profileData,
        ...fleetData, // Saves rateA, rateB, rateC
        ...paymentData,
        ...docUrls, // Save document URLs
        profileComplete: isComplete, 
        updatedAt: new Date().toISOString()
      });

      if (isComplete) {
        setSuccessMsg('Profile complete! Documents submitted for verification.');
      } else {
        setSuccessMsg('Progress saved. Please complete all required fields (Payment, Docs, Rates) to request verification.');
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

  // Helper for checklist items
  const checkItem = (isValid: boolean, label: string) => (
    <li className={`flex items-center gap-2 ${isValid ? 'text-green-600' : 'text-red-500'}`}>
        {isValid ? <CheckCircle className="w-3 h-3"/> : <div className="w-3 h-3 border border-red-400 rounded-full"></div>} 
        {label}
    </li>
  );

  return (
    <div className="min-h-screen bg-brand-light p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-brand-dark mb-6">Account Settings</h1>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
          
          {/* Sidebar Tabs */}
          <div className="w-full md:w-64 bg-gray-50 border-r border-gray-100 p-4">
            <nav className="space-y-2">
              {['profile', 'fleet', 'documents', 'payments'].map((tab) => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors capitalize ${activeTab === tab ? 'bg-white text-brand-orange shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    {tab === 'profile' && <User className="w-4 h-4" />}
                    {tab === 'fleet' && <Truck className="w-4 h-4" />}
                    {tab === 'documents' && <FileText className="w-4 h-4" />}
                    {tab === 'payments' && <CreditCard className="w-4 h-4" />}
                    {tab}
                  </button>
              ))}
            </nav>
            
            {/* Requirement Checklist */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg text-xs text-blue-800">
               <p className="font-bold mb-2">Verification Checklist:</p>
               <ul className="space-y-1">
                 {checkItem(!!profileData.dotNumber, 'DOT Number')}
                 {checkItem(fleetData.rateA > 0, 'Pricing Set')}
                 {checkItem(!!docUrls.insuranceUrl, 'Insurance Doc')}
                 {checkItem(!!paymentData.accountNumber, 'Payment Setup')}
               </ul>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 p-8 overflow-y-auto">
            
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
                    <input value={profileData.dotNumber} onChange={(e) => setProfileData({...profileData, dotNumber: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-yellow-50" placeholder="Required" />
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

            {/* TAB: FLEET (With 3 Rates) */}
            {activeTab === 'fleet' && (
              <div className="space-y-6 animate-in fade-in">
                <h2 className="text-xl font-bold text-gray-800">Fleet & Rates</h2>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Equipment</label>
                    <select value={fleetData.equipmentType} onChange={(e) => setFleetData({...fleetData, equipmentType: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2">
                      <option>Dry Van</option>
                      <option>Reefer</option>
                      <option>Flatbed</option>
                    </select>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-6">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">Pricing Configuration <Info className="w-4 h-4 text-gray-400"/></h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Rate A (Mileage)</label>
                            <div className="relative">
                                <span className="absolute left-3 top-2 text-gray-500">$</span>
                                <input type="number" step="0.01" value={fleetData.rateA} onChange={(e) => setFleetData({...fleetData, rateA: parseFloat(e.target.value)})} className="w-full border border-gray-300 rounded-lg pl-7 pr-3 py-2" />
                                <span className="absolute right-3 top-2 text-gray-400 text-xs">/ mi</span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Rate B (Volume)</label>
                            <div className="relative">
                                <span className="absolute left-3 top-2 text-gray-500">$</span>
                                <input type="number" step="0.01" value={fleetData.rateB} onChange={(e) => setFleetData({...fleetData, rateB: parseFloat(e.target.value)})} className="w-full border border-gray-300 rounded-lg pl-7 pr-3 py-2" />
                                <span className="absolute right-3 top-2 text-gray-400 text-xs">/ ft³</span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Rate C (Weight)</label>
                            <div className="relative">
                                <span className="absolute left-3 top-2 text-gray-500">$</span>
                                <input type="number" step="0.01" value={fleetData.rateC} onChange={(e) => setFleetData({...fleetData, rateC: parseFloat(e.target.value)})} className="w-full border border-gray-300 rounded-lg pl-7 pr-3 py-2" />
                                <span className="absolute right-3 top-2 text-gray-400 text-xs">/ lb</span>
                            </div>
                        </div>
                    </div>
                </div>
              </div>
            )}

            {/* TAB: DOCUMENTS (NEW) */}
            {activeTab === 'documents' && (
                <div className="space-y-6 animate-in fade-in">
                    <h2 className="text-xl font-bold text-gray-800">Verification Documents</h2>
                    <p className="text-sm text-gray-500">Upload clear copies of your documents. These are required for verification.</p>
                    
                    {['insuranceUrl', 'cdlUrl'].map((field) => (
                        <div key={field} className="border border-gray-200 rounded-xl p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-full ${(docUrls as any)[field] ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                                    {(docUrls as any)[field] ? <Check className="w-6 h-6"/> : <FileText className="w-6 h-6"/>}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800">{field === 'insuranceUrl' ? 'Insurance Cert' : 'CDL License'}</h4>
                                    <p className="text-xs text-gray-500">{(docUrls as any)[field] ? 'Uploaded successfully' : 'Required for verification'}</p>
                                </div>
                            </div>
                            <div className="relative">
                                <input 
                                    type="file" 
                                    accept="image/*,.pdf"
                                    onChange={(e) => handleFileUpload(e, field as any)}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    disabled={uploadingField === field}
                                />
                                <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">
                                    {uploadingField === field ? 'Uploading...' : ((docUrls as any)[field] ? 'Replace' : 'Upload')}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* TAB: PAYMENTS */}
            {activeTab === 'payments' && (
               <div className="space-y-6 animate-in fade-in">
                 <h2 className="text-xl font-bold text-gray-800">Payout Preferences</h2>
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