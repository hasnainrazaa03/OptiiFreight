import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, doc, updateDoc } from "firebase/firestore";
// REMOVED for now: import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; 
import { db } from "../../lib/firebase"; // Removed 'storage' import
import { useAuth } from '../../context/AuthContext';
import { MapPin, Calendar, Package, ArrowRight, CheckCircle, Truck, Upload, X } from 'lucide-react';

const MyTrips: React.FC = () => {
  const { user } = useAuth();
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State for POD Upload Modal
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [podFile, setPodFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // 1. Fetch My Active Loads
  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "shipments"), where("carrierId", "==", user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedTrips: any[] = [];
      snapshot.forEach((doc) => {
        fetchedTrips.push({ id: doc.id, ...doc.data() });
      });
      
      fetchedTrips.sort((a, b) => {
          if (a.status === 'Delivered') return 1;
          if (b.status === 'Delivered') return -1;
          // Safe date comparison
          const timeA = a.acceptedAt ? new Date(a.acceptedAt).getTime() : 0;
          const timeB = b.acceptedAt ? new Date(b.acceptedAt).getTime() : 0;
          return timeB - timeA;
      });

      setTrips(fetchedTrips);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // 2. Status Update Logic
  const handleStatusClick = async (trip: any) => {
      // Special handling for Delivery - Open Modal
      if (trip.status === 'In Transit') {
          setSelectedTripId(trip.id);
          return;
      }

      // Standard Status Updates
      let nextStatus = '';
      if (trip.status === 'Accepted') nextStatus = 'At Pickup';
      if (trip.status === 'At Pickup') nextStatus = 'In Transit';

      if (nextStatus) {
          if (window.confirm(`Update status to: ${nextStatus}?`)) {
              await updateDoc(doc(db, "shipments", trip.id), {
                  status: nextStatus,
                  [`statusTimeline.${nextStatus}`]: new Date().toISOString()
              });
          }
      }
  };

  // 3. MOCK Handle POD Upload (No Billing Required)
  const handlePODUpload = async () => {
      if (!selectedTripId || !podFile || !user) return;
      
      setUploading(true);
      
      try {
          // --- REAL CODE (Commented Out) ---
          // const storageRef = ref(storage, `pods/${selectedTripId}_${Date.now()}`);
          // await uploadBytes(storageRef, podFile);
          // const downloadUrl = await getDownloadURL(storageRef);

          // --- MOCK LOGIC (Use this for now) ---
          // Simulate network delay
          await new Promise(resolve => setTimeout(resolve, 1500)); 
          
          // Use a fake placeholder image to represent the "Proof"
          const downloadUrl = "https://via.placeholder.com/600x800?text=PROOF+OF+DELIVERY+(MOCK)";

          // B. Update Firestore Document (This is REAL database write)
          await updateDoc(doc(db, "shipments", selectedTripId), {
              status: 'Delivered',
              podUrl: downloadUrl, // Saving the fake link
              deliveredAt: new Date().toISOString(),
              [`statusTimeline.Delivered`]: new Date().toISOString()
          });

          // Reset Modal
          setSelectedTripId(null);
          setPodFile(null);
          alert("Delivery Confirmed! Payment will be processed.");

      } catch (error) {
          console.error("Upload failed", error);
          alert("Failed to upload proof of delivery. Please try again.");
      } finally {
          setUploading(false);
      }
  };

  // Helper for Status Badge Color
  const getStatusColor = (status: string) => {
      switch(status) {
          case 'Accepted': return 'bg-blue-100 text-blue-800';
          case 'At Pickup': return 'bg-yellow-100 text-yellow-800';
          case 'In Transit': return 'bg-purple-100 text-purple-800';
          case 'Delivered': return 'bg-green-100 text-green-800';
          default: return 'bg-gray-100 text-gray-800';
      }
  };

  return (
    <div className="min-h-screen bg-brand-light p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-brand-dark mb-6">My Trips & Active Loads</h1>

        {loading ? (
            <div className="text-center py-20">Loading trips...</div>
        ) : trips.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
                <Truck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-700">No active trips</h3>
                <p className="text-gray-500">Go to the dashboard to find and accept loads.</p>
            </div>
        ) : (
            <div className="space-y-6">
                {trips.map((trip) => (
                    <div key={trip.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        
                        <div className="bg-gray-50 p-4 flex justify-between items-center border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(trip.status)}`}>
                                    {trip.status}
                                </span>
                                <span className="text-sm text-gray-500 font-mono">ID: {trip.id.slice(0,8)}</span>
                            </div>
                            <div className="text-right">
                                <span className="text-brand-green font-bold text-lg">${trip.finalCost}</span>
                            </div>
                        </div>

                        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Trip Info */}
                            <div className="md:col-span-2 space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className="w-3 h-3 bg-brand-dark rounded-full"></div>
                                        <div className="w-0.5 h-12 bg-gray-200"></div>
                                        <div className="w-3 h-3 bg-brand-orange rounded-full"></div>
                                    </div>
                                    <div className="space-y-8">
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase">Pickup</p>
                                            <h4 className="font-bold text-gray-900">Zip Code {trip.originZip}</h4>
                                            <p className="text-sm text-gray-500 flex items-center gap-1">
                                                <Calendar className="w-3 h-3" /> {trip.date}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase">Delivery</p>
                                            <h4 className="font-bold text-gray-900">Zip Code {trip.destZip}</h4>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col justify-center border-l border-gray-100 pl-6">
                                {trip.status === 'Delivered' ? (
                                    <div className="text-center text-green-600">
                                        <CheckCircle className="w-12 h-12 mx-auto mb-2" />
                                        <p className="font-bold">Completed</p>
                                        <p className="text-xs text-gray-500 mt-1">POD Uploaded</p>
                                        {trip.podUrl && (
                                            <a href={trip.podUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline mt-2 block">
                                                View Proof
                                            </a>
                                        )}
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <button 
                                            onClick={() => handleStatusClick(trip)}
                                            className="w-full bg-brand-dark text-white py-3 rounded-lg font-bold hover:bg-blue-900 transition-colors flex items-center justify-center gap-2"
                                        >
                                            {trip.status === 'Accepted' && 'Arrived at Pickup'}
                                            {trip.status === 'At Pickup' && 'Start Transit'}
                                            {trip.status === 'In Transit' && 'Mark Delivered'}
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}

        {/* MODAL FOR POD UPLOAD */}
        {selectedTripId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
                <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-gray-900">Proof of Delivery</h3>
                        <button onClick={() => setSelectedTripId(null)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5"/></button>
                    </div>
                    
                    <p className="text-sm text-gray-500 mb-6">
                        Please upload a photo of the signed BOL (Bill of Lading) or delivery receipt to verify completion.
                    </p>

                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                        <input 
                            type="file" 
                            accept="image/*,application/pdf"
                            onChange={(e) => setPodFile(e.target.files?.[0] || null)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm font-medium text-gray-600">
                            {podFile ? podFile.name : 'Click to Upload Image/PDF'}
                        </p>
                    </div>

                    <button 
                        onClick={handlePODUpload}
                        disabled={!podFile || uploading}
                        className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {uploading ? 'Processing...' : 'Confirm Delivery'}
                    </button>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default MyTrips;