import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CreditCard, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { collection, addDoc } from "firebase/firestore"; 
import { db, auth } from "../../lib/firebase";

const Payment: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [processing, setProcessing] = useState(false);

  // We receive the raw data here from the previous steps
  const { truck, shipmentData, total } = location.state || {};

  const handlePay = async () => {
    setProcessing(true);

    try {
        // NOW WE SAVE TO DB (The "Booking" moment)
        const docRef = await addDoc(collection(db, "shipments"), {
            ...shipmentData, // Spread the original form data (zip, weight, dimensions, etc.)
            userId: auth.currentUser?.uid || 'guest_user',
            status: 'Pending', // Now it's officially pending for carriers
            createdAt: new Date().toISOString(),
            finalCost: total,
            selectedCarrier: truck?.name || 'Assigned by System',
            carrierId: null, // Open for carriers to accept
        });

        console.log("Shipment Officially Booked: ", docRef.id);
        
        // Simulate payment processing time
        setTimeout(() => {
          setProcessing(false);
          alert('Payment Successful! Shipment is now Live.');
          navigate('/business'); // Redirect to dashboard
        }, 1500);

    } catch (e) {
        console.error("Payment/Save Error: ", e);
        alert("Transaction failed. Please try again.");
        setProcessing(false);
    }
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
        
        {/* Order Summary */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Shipment Status</span>
            {/* It is a Draft until they pay */}
            <span className="font-mono font-medium text-orange-600">DRAFT / UNPAID</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Carrier</span>
            <span className="font-medium">{truck?.name || 'Selected Carrier'}</span>
          </div>
          <div className="border-t border-gray-200 my-2 pt-2 flex justify-between text-lg font-bold text-brand-dark">
            <span>Total</span>
            <span>${total || '0.00'}</span>
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
            className="w-full bg-brand-green hover:bg-green-600 text-white py-3 rounded-lg font-bold text-lg mt-4 flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {processing ? 'Processing Payment...' : 'Pay & Book'}
          </button>
          
          <button 
             type="button"
             onClick={() => navigate('/business')}
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

export default Payment;