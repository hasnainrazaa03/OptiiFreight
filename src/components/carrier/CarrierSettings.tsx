import React, { useState, useEffect } from 'react';
import { User, Truck, CreditCard, Save, CheckCircle, AlertCircle, FileText, Upload, Check, Info, Plus, Trash2, Edit2, X, Lock, Bell, Shield, Settings as SettingsIcon, LogOut, Globe } from 'lucide-react';
import { doc, getDoc, updateDoc, collection, addDoc, deleteDoc, onSnapshot, query } from "firebase/firestore";
import { db, auth } from "../../lib/firebase";
import { useAuth } from '../../context/AuthContext';
import { sendPasswordResetEmail } from 'firebase/auth';

interface Vehicle {
  id?: string;
  unitNumber: string;
  type: string;
  make: string;
  model: string;
  year: string;
  vin: string;
  plate: string;
  rateA?: number;
  rateB?: number;
  rateC?: number;
  registrationUrl?: string;
}

const CarrierSettings: React.FC = () => {
  const { user } = useAuth();
  
  // Navigation State
  const [activeTab, setActiveTab] = useState('profile');
  
  // UI State
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // --- DATA STATE ---
  
  // 1. Profile Data
  const [profileData, setProfileData] = useState({
    companyName: '',
    dotNumber: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    carrierType: '', 
    defaultRateA: 2.50,
    defaultRateB: 1.85,
    defaultRateC: 0.32
  });

  // 2. Payment Data
  const [paymentData, setPaymentData] = useState({
    bankName: '',
    accountNumber: '',
    routingNumber: ''
  });

  // 3. Documents
  const [docUrls, setDocUrls] = useState({
    insuranceUrl: '',
    cdlUrl: ''
  });

  // 4. Preferences (NEW)
  const [preferences, setPreferences] = useState({
    emailAlerts: true,
    smsAlerts: false,
    marketingEmails: false,
    language: 'en',
    units: 'imperial' // imperial vs metric
  });

  // 5. Fleet Data
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [vehicleForm, setVehicleForm] = useState<Vehicle>({
    unitNumber: '', type: 'Dry Van', make: '', model: '', year: '', vin: '', plate: ''
  });
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  // --- EFFECTS ---

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      try {
        const docSnap = await getDoc(doc(db, "carriers", user.uid));
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfileData({
            companyName: data.companyName || '',
            dotNumber: data.dotNumber || '',
            phone: data.phone || '',
            street: data.street || '',
            city: data.city || '',
            state: data.state || '',
            zip: data.zip || '',
            carrierType: data.carrierType || 'Owner-Operator',
            defaultRateA: data.rateA || 2.50,
            defaultRateB: data.rateB || 1.85,
            defaultRateC: data.rateC || 0.32
          });
          setPaymentData({
            bankName: data.bankName || '',
            accountNumber: data.accountNumber || '',
            routingNumber: data.routingNumber || ''
          });
          setDocUrls({
            insuranceUrl: data.insuranceUrl || '',
            cdlUrl: data.cdlUrl || ''
          });
          // Load Preferences
          if (data.preferences) {
              setPreferences(data.preferences);
          }
        }
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };

    const q = query(collection(db, "carriers", user.uid, "vehicles"));
    const unsubVehicles = onSnapshot(q, (snapshot) => {
       const vList: Vehicle[] = [];
       snapshot.forEach(doc => vList.push({ id: doc.id, ...doc.data() } as Vehicle));
       setVehicles(vList);
    });

    fetchProfile();
    return () => unsubVehicles();
  }, [user]);

  // --- LOGIC FUNCTIONS ---

  const handleAddVehicle = async () => {
      if(!user) return;
      try {
          if (editingVehicle?.id) {
              await updateDoc(doc(db, "carriers", user.uid, "vehicles", editingVehicle.id), { ...vehicleForm });
              setSuccessMsg("Vehicle updated!");
          } else {
              await addDoc(collection(db, "carriers", user.uid, "vehicles"), { ...vehicleForm });
              setSuccessMsg("Vehicle added to fleet!");
          }
          setIsVehicleModalOpen(false);
          setEditingVehicle(null);
          setVehicleForm({ unitNumber: '', type: 'Dry Van', make: '', model: '', year: '', vin: '', plate: '' });
      } catch (e) { setErrorMsg("Failed to save vehicle."); }
  };

  const handleDeleteVehicle = async (id: string) => {
      if(!user || !window.confirm("Delete this vehicle?")) return;
      await deleteDoc(doc(db, "carriers", user.uid, "vehicles", id));
  };

  const openEditModal = (v: Vehicle) => {
      setEditingVehicle(v);
      setVehicleForm(v);
      setIsVehicleModalOpen(true);
  };

  const handleFileUpload = (field: string, isVehicleDoc = false) => {
      setUploadingField(field);
      setTimeout(() => {
          const mockUrl = "https://via.placeholder.com/150?text=VERIFIED";
          if (isVehicleDoc) {
              setVehicleForm(prev => ({ ...prev, registrationUrl: mockUrl }));
          } else {
              setDocUrls(prev => ({ ...prev, [field]: mockUrl }));
          }
          setUploadingField(null);
          alert("Document uploaded successfully!");
      }, 1000);
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const isVehicleValid = vehicles.length > 0 && vehicles.every(v => !!v.unitNumber && !!v.vin && !!v.registrationUrl);
      const isComplete = !!profileData.dotNumber && !!paymentData.accountNumber && !!docUrls.insuranceUrl && isVehicleValid;

      if (!isVehicleValid && vehicles.length > 0) {
          setErrorMsg("Warning: Some vehicles have incomplete details. Check the Fleet tab.");
      }

      await updateDoc(doc(db, "carriers", user.uid), {
        ...profileData,
        address: `${profileData.street}, ${profileData.city}, ${profileData.state} ${profileData.zip}`,
        ...paymentData,
        ...docUrls,
        preferences: preferences, // Save new preferences
        rateA: profileData.defaultRateA,
        rateB: profileData.defaultRateB,
        rateC: profileData.defaultRateC,
        profileComplete: isComplete, 
        fleetSize: vehicles.length,
        updatedAt: new Date().toISOString()
      });

      if (isComplete) setSuccessMsg('All settings saved and verified!');
      else if (!errorMsg) setSuccessMsg('Settings saved successfully.');

    } catch (err) { setErrorMsg("Failed to save settings."); } 
    finally { setSaving(false); setTimeout(() => setSuccessMsg(''), 4000); }
  };

  const handlePasswordReset = async () => {
      if(!user?.email) return;
      try {
          await sendPasswordResetEmail(auth, user.email);
          alert(`Password reset email sent to ${user.email}`);
      } catch (e) { alert("Error sending reset email"); }
  };

  // --- RENDER HELPERS ---

  const checkItem = (isValid: boolean, label: string) => (
    <li className={`flex items-center gap-2 ${isValid ? 'text-green-600' : 'text-gray-400'}`}>
        {isValid ? <CheckCircle className="w-3 h-3"/> : <div className="w-3 h-3 border border-gray-300 rounded-full"></div>} 
        <span className={isValid ? 'font-medium' : ''}>{label}</span>
    </li>
  );

  const NavItem = ({ id, icon: Icon, label }: any) => (
      <button 
        onClick={() => setActiveTab(id)}
        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === id ? 'bg-brand-dark text-white shadow-md' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
      >
        <Icon className={`w-4 h-4 ${activeTab === id ? 'text-brand-orange' : 'text-gray-400'}`} />
        {label}
      </button>
  );

  if (loading) return <div className="p-8 text-center">Loading settings...</div>;

  return (
    <div className="min-h-screen bg-brand-light p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-brand-dark mb-6">Settings</h1>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
          
          {/* SIDEBAR NAVIGATION */}
          <div className="w-full md:w-64 bg-gray-50 border-r border-gray-100 p-4 flex flex-col">
            
            <div className="space-y-6 flex-1">
                {/* Section 1: Account */}
                <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-4">Account & Verification</h3>
                    <div className="space-y-1">
                        <NavItem id="profile" icon={User} label="Company Profile" />
                        <NavItem id="documents" icon={FileText} label="Documents" />
                        <NavItem id="payments" icon={CreditCard} label="Payout Methods" />
                    </div>
                </div>

                {/* Section 2: Operations */}
                <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-4">Operations</h3>
                    <div className="space-y-1">
                        <NavItem id="fleet" icon={Truck} label={profileData.carrierType === 'Fleet Owner' ? 'Fleet Manager' : 'My Equipment'} />
                    </div>
                </div>

                {/* Section 3: System */}
                <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-4">System</h3>
                    <div className="space-y-1">
                        <NavItem id="preferences" icon={SettingsIcon} label="Preferences" />
                        <NavItem id="security" icon={Shield} label="Security" />
                    </div>
                </div>
            </div>
            
            {/* Verification Widget */}
            <div className="mt-8 p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
               <p className="font-bold text-xs text-gray-800 mb-3 uppercase">Verification Status</p>
               <ul className="space-y-2 text-xs">
                 {checkItem(!!profileData.dotNumber, 'DOT Number')}
                 {checkItem(profileData.defaultRateA > 0, 'Pricing Set')}
                 {checkItem(!!docUrls.insuranceUrl, 'Insurance')}
                 {checkItem(!!paymentData.accountNumber, 'Bank Account')}
                 {checkItem(vehicles.length > 0 && vehicles.every(v => !!v.vin), 'Fleet Assets')}
               </ul>
            </div>
          </div>

          {/* MAIN CONTENT AREA */}
          <div className="flex-1 p-8 overflow-y-auto bg-white relative">
            
            {/* Feedback Messages */}
            {successMsg && <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg flex items-center gap-2 border border-green-100 animate-in fade-in slide-in-from-top-2"><CheckCircle className="w-5 h-5" /> {successMsg}</div>}
            {errorMsg && <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 border border-red-100 animate-in fade-in slide-in-from-top-2"><AlertCircle className="w-5 h-5" /> {errorMsg}</div>}

            {/* --- TAB: PROFILE --- */}
            {activeTab === 'profile' && (
              <div className="space-y-8 animate-in fade-in">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Company Profile</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Company Name</label>
                            <input value={profileData.companyName} onChange={(e) => setProfileData({...profileData, companyName: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Carrier Type</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                <input disabled value={profileData.carrierType} className="w-full border border-gray-200 bg-gray-100 rounded-lg pl-9 pr-3 py-2 text-gray-500 cursor-not-allowed"/>
                            </div>
                            <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1"><Info className="w-3 h-3"/> Contact support to change operational model.</p>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">USDOT Number</label>
                            <input value={profileData.dotNumber} onChange={(e) => setProfileData({...profileData, dotNumber: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phone Number</label>
                            <input value={profileData.phone} onChange={(e) => setProfileData({...profileData, phone: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-6">
                    <h3 className="font-bold text-gray-800 mb-4">Headquarters Address</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Street Address</label>
                            <input value={profileData.street} onChange={(e) => setProfileData({...profileData, street: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">City</label>
                            <input value={profileData.city} onChange={(e) => setProfileData({...profileData, city: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">State</label>
                                <input value={profileData.state} onChange={(e) => setProfileData({...profileData, state: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Zip</label>
                                <input value={profileData.zip} onChange={(e) => setProfileData({...profileData, zip: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                            </div>
                        </div>
                    </div>
                </div>
              </div>
            )}

            {/* --- TAB: DOCUMENTS --- */}
            {activeTab === 'documents' && (
                <div className="space-y-6 animate-in fade-in">
                    <h2 className="text-xl font-bold text-gray-800">Company Documents</h2>
                    <p className="text-sm text-gray-500">Upload clear copies of your documents. These are required for verification.</p>
                    
                    {['insuranceUrl', 'cdlUrl'].map(field => (
                        <div key={field} className="border border-gray-200 rounded-xl p-4 flex items-center justify-between bg-white hover:border-brand-orange transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-full ${(docUrls as any)[field] ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                                    {(docUrls as any)[field] ? <Check className="w-6 h-6"/> : <FileText className="w-6 h-6"/>}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800">{field === 'insuranceUrl' ? 'Insurance Certificate' : 'CDL License'}</h4>
                                    <p className="text-xs text-gray-500">{(docUrls as any)[field] ? 'Uploaded' : 'Required'}</p>
                                </div>
                            </div>
                            <div className="relative">
                                <input type="file" accept="image/*,.pdf" onChange={(e) => handleFileUpload(field as any)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" disabled={uploadingField === field}/>
                                <button className="text-blue-600 text-sm font-bold hover:underline">
                                    {uploadingField === field ? 'Uploading...' : (docUrls as any)[field] ? 'Replace' : 'Upload'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* --- TAB: PAYMENTS --- */}
            {activeTab === 'payments' && (
               <div className="space-y-6 animate-in fade-in">
                 <h2 className="text-xl font-bold text-gray-800">Payout Preferences</h2>
                 <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex gap-3 mb-6">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <p className="text-sm text-blue-800">
                      We use this account to deposit your earnings. Please ensure the routing number matches your business bank account.
                    </p>
                 </div>
                 
                 <div className="space-y-4 max-w-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                      <input value={paymentData.bankName} onChange={(e) => setPaymentData({...paymentData, bankName: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="e.g. Chase, Wells Fargo" />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                        <input type="password" value={paymentData.accountNumber} onChange={(e) => setPaymentData({...paymentData, accountNumber: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50" placeholder="••••••••••••" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Routing Number</label>
                        <input value={paymentData.routingNumber} onChange={(e) => setPaymentData({...paymentData, routingNumber: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50" placeholder="000000000" />
                      </div>
                    </div>
                 </div>
               </div>
            )}

            {/* --- TAB: FLEET --- */}
            {activeTab === 'fleet' && (
                <div className="space-y-6 animate-in fade-in">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">
                                {profileData.carrierType === 'Fleet Owner' ? 'Fleet Management' : 'My Equipment'}
                            </h2>
                            <p className="text-sm text-gray-500 mt-1 max-w-lg">
                                Complete details (VIN, Plate, Docs) for each vehicle to receive load matches. 
                                Use the edit button to set custom rates for specific trucks.
                            </p>
                        </div>
                        <button 
                            onClick={() => { setEditingVehicle(null); setVehicleForm({ unitNumber: '', type: 'Dry Van', make: '', model: '', year: '', vin: '', plate: '' }); setIsVehicleModalOpen(true); }}
                            className="bg-brand-orange text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-orange-600 transition-colors shadow-sm"
                        >
                            <Plus className="w-4 h-4" /> Add Vehicle
                        </button>
                    </div>

                    {/* Default Pricing Block */}
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                        <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">Default Pricing <Info className="w-4 h-4 text-gray-400"/></h3>
                        <p className="text-xs text-gray-500 mb-4">These base rates apply to all vehicles unless overridden individually.</p>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500">Per Mile</label>
                                <input type="number" value={profileData.defaultRateA} onChange={(e) => setProfileData({...profileData, defaultRateA: parseFloat(e.target.value)})} className="w-full border border-gray-300 rounded-lg px-2 py-2 mt-1 bg-white" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500">Per ft³</label>
                                <input type="number" value={profileData.defaultRateB} onChange={(e) => setProfileData({...profileData, defaultRateB: parseFloat(e.target.value)})} className="w-full border border-gray-300 rounded-lg px-2 py-2 mt-1 bg-white" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500">Per lb</label>
                                <input type="number" value={profileData.defaultRateC} onChange={(e) => setProfileData({...profileData, defaultRateC: parseFloat(e.target.value)})} className="w-full border border-gray-300 rounded-lg px-2 py-2 mt-1 bg-white" />
                            </div>
                        </div>
                    </div>

                    {/* Vehicle List */}
                    {vehicles.length === 0 ? (
                        <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                            <Truck className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                            <p className="text-gray-500">No vehicles added yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {vehicles.map((v) => {
                                const isComplete = !!v.unitNumber && !!v.make && !!v.model && !!v.vin && !!v.plate && !!v.registrationUrl;
                                return (
                                    <div key={v.id} className={`border rounded-xl p-4 flex flex-col md:flex-row justify-between items-center gap-4 bg-white hover:shadow-md transition-shadow ${!isComplete ? 'border-red-200 bg-red-50' : 'border-gray-200'}`}>
                                        <div className="flex items-center gap-4 w-full md:w-auto">
                                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${!isComplete ? 'bg-red-100 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                                                {isComplete ? <Truck className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-800">{v.unitNumber || `${v.year} ${v.make}`}</h4>
                                                <p className="text-xs text-gray-500">{v.type} • {v.plate || 'No Plate'}</p>
                                                <div className="flex gap-2 mt-1">
                                                    {(v.rateA || v.rateB) && <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded">Custom Rates</span>}
                                                    {!isComplete && <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold">Incomplete</span>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => openEditModal(v)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full"><Edit2 className="w-4 h-4"/></button>
                                            <button onClick={() => handleDeleteVehicle(v.id!)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full"><Trash2 className="w-4 h-4"/></button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* --- TAB: PREFERENCES (NEW) --- */}
            {activeTab === 'preferences' && (
                <div className="space-y-8 animate-in fade-in">
                    <h2 className="text-xl font-bold text-gray-800">Preferences</h2>
                    
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-gray-700 uppercase border-b pb-2">Notifications</h3>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-800">Email Alerts</p>
                                <p className="text-xs text-gray-500">Receive load matches via email</p>
                            </div>
                            <button 
                                onClick={() => setPreferences({...preferences, emailAlerts: !preferences.emailAlerts})}
                                className={`w-12 h-6 rounded-full p-1 transition-colors ${preferences.emailAlerts ? 'bg-green-500' : 'bg-gray-300'}`}
                            >
                                <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${preferences.emailAlerts ? 'translate-x-6' : ''}`}></div>
                            </button>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-800">SMS Alerts</p>
                                <p className="text-xs text-gray-500">Receive urgent updates via text</p>
                            </div>
                            <button 
                                onClick={() => setPreferences({...preferences, smsAlerts: !preferences.smsAlerts})}
                                className={`w-12 h-6 rounded-full p-1 transition-colors ${preferences.smsAlerts ? 'bg-green-500' : 'bg-gray-300'}`}
                            >
                                <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${preferences.smsAlerts ? 'translate-x-6' : ''}`}></div>
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-gray-700 uppercase border-b pb-2">Localization</h3>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Language</label>
                                <div className="relative">
                                    <Globe className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                    <select 
                                        value={preferences.language} 
                                        onChange={(e) => setPreferences({...preferences, language: e.target.value})}
                                        className="w-full border rounded-lg pl-9 pr-3 py-2 bg-white"
                                    >
                                        <option value="en">English (US)</option>
                                        <option value="es">Español</option>
                                        <option value="fr">Français</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Units</label>
                                <select 
                                    value={preferences.units} 
                                    onChange={(e) => setPreferences({...preferences, units: e.target.value})}
                                    className="w-full border rounded-lg px-3 py-2 bg-white"
                                >
                                    <option value="imperial">Imperial (mi, lbs)</option>
                                    <option value="metric">Metric (km, kg)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- TAB: SECURITY (NEW) --- */}
            {activeTab === 'security' && (
                <div className="space-y-8 animate-in fade-in">
                    <h2 className="text-xl font-bold text-gray-800">Security</h2>
                    
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <div className="flex items-start gap-4">
                            <div className="bg-blue-50 p-3 rounded-full text-blue-600"><Lock className="w-6 h-6"/></div>
                            <div className="flex-1">
                                <h3 className="font-bold text-gray-800">Password</h3>
                                <p className="text-sm text-gray-500 mb-4">Protect your account with a strong password.</p>
                                <button onClick={handlePasswordReset} className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium transition-colors">
                                    Send Password Reset Email
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-red-100 rounded-xl p-6">
                        <div className="flex items-start gap-4">
                            <div className="bg-red-50 p-3 rounded-full text-red-600"><LogOut className="w-6 h-6"/></div>
                            <div className="flex-1">
                                <h3 className="font-bold text-gray-800">Active Sessions</h3>
                                <p className="text-sm text-gray-500 mb-4">Log out of all other devices.</p>
                                <button onClick={() => auth.signOut()} className="text-sm border border-red-200 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg font-medium transition-colors">
                                    Log Out Everywhere
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* SAVE ACTION BAR */}
            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end sticky bottom-0 bg-white pb-2">
                <button onClick={handleSaveProfile} disabled={saving} className="bg-brand-dark text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-900 transition-colors flex items-center gap-2 shadow-lg">
                    {saving ? 'Saving...' : 'Save Changes'} <Save className="w-4 h-4" />
                </button>
            </div>

          </div>
        </div>
      </div>

      {/* MODAL: ADD/EDIT VEHICLE */}
      {isVehicleModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
              <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-gray-900">{editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</h3>
                      <button onClick={() => setIsVehicleModalOpen(false)}><X className="w-6 h-6 text-gray-400"/></button>
                  </div>
                  
                  <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Unit Number</label>
                              <input value={vehicleForm.unitNumber} onChange={e => setVehicleForm({...vehicleForm, unitNumber: e.target.value})} className="w-full border rounded-lg p-2" placeholder="e.g. Truck 01" />
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Type</label>
                              <select value={vehicleForm.type} onChange={e => setVehicleForm({...vehicleForm, type: e.target.value})} className="w-full border rounded-lg p-2">
                                  <option>Dry Van</option><option>Reefer</option><option>Flatbed</option><option>Box Truck</option>
                              </select>
                          </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                          <input value={vehicleForm.year} onChange={e => setVehicleForm({...vehicleForm, year: e.target.value})} className="border rounded-lg p-2" placeholder="Year" />
                          <input value={vehicleForm.make} onChange={e => setVehicleForm({...vehicleForm, make: e.target.value})} className="border rounded-lg p-2" placeholder="Make" />
                          <input value={vehicleForm.model} onChange={e => setVehicleForm({...vehicleForm, model: e.target.value})} className="border rounded-lg p-2" placeholder="Model" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <input value={vehicleForm.vin} onChange={e => setVehicleForm({...vehicleForm, vin: e.target.value})} className="border rounded-lg p-2" placeholder="VIN Number" />
                          <input value={vehicleForm.plate} onChange={e => setVehicleForm({...vehicleForm, plate: e.target.value})} className="border rounded-lg p-2" placeholder="License Plate" />
                      </div>

                      <div className="border border-dashed border-gray-300 p-4 rounded-lg flex items-center justify-between bg-gray-50">
                          <div className="flex items-center gap-3">
                              <FileText className="w-5 h-5 text-gray-400" />
                              <div>
                                  <p className="text-sm font-bold text-gray-700">Vehicle Registration</p>
                                  <p className="text-xs text-gray-500">{vehicleForm.registrationUrl ? 'Document on file' : 'Required for fleet verification'}</p>
                              </div>
                          </div>
                          <button onClick={() => handleFileUpload('reg', true)} className="text-blue-600 text-xs font-bold uppercase hover:underline">
                              {uploadingField === 'reg' ? '...' : (vehicleForm.registrationUrl ? 'Replace' : 'Upload')}
                          </button>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                          <p className="text-xs font-bold text-gray-500 mb-2">Custom Rates (Leave 0 to use Defaults)</p>
                          <div className="grid grid-cols-3 gap-4">
                              <input type="number" step="0.01" value={vehicleForm.rateA || ''} onChange={e => setVehicleForm({...vehicleForm, rateA: parseFloat(e.target.value)})} className="border rounded-lg p-2 text-sm" placeholder="Rate A ($/mi)" />
                              <input type="number" step="0.01" value={vehicleForm.rateB || ''} onChange={e => setVehicleForm({...vehicleForm, rateB: parseFloat(e.target.value)})} className="border rounded-lg p-2 text-sm" placeholder="Rate B ($/ft³)" />
                              <input type="number" step="0.01" value={vehicleForm.rateC || ''} onChange={e => setVehicleForm({...vehicleForm, rateC: parseFloat(e.target.value)})} className="border rounded-lg p-2 text-sm" placeholder="Rate C ($/lb)" />
                          </div>
                      </div>
                  </div>

                  <button onClick={handleAddVehicle} className="w-full bg-brand-dark text-white py-3 rounded-lg font-bold mt-6 hover:bg-blue-900">
                      {editingVehicle ? 'Update Vehicle' : 'Add Vehicle'}
                  </button>
              </div>
          </div>
      )}

    </div>
  );
};

export default CarrierSettings;