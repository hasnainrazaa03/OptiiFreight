import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase'; // Import googleProvider
import { Truck, ArrowLeft, Lock } from 'lucide-react';

const Login = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialType = searchParams.get('type') === 'carrier' ? 'carrier' : 'business';
  
  const [activeTab, setActiveTab] = useState<'business' | 'carrier'>(initialType);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle traditional Email/Password
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate(activeTab === 'business' ? '/business' : '/carrier');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle Google Login
  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      // Redirect based on which tab was active
      navigate(activeTab === 'business' ? '/business' : '/carrier');
    } catch (err: any) {
      setError("Google Sign-In failed. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-brand-light flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* Header (Same as before) */}
        <div className="p-4 border-b border-gray-100 flex items-center">
            <Link to="/" className="text-gray-400 hover:text-brand-dark transition-colors"><ArrowLeft className="w-5 h-5"/></Link>
            <div className="ml-auto mr-auto pr-5 flex items-center gap-2">
                 <div className="w-8 h-8 bg-brand-dark rounded-lg flex items-center justify-center">
                    <Truck className="text-brand-orange w-5 h-5 transform -scale-x-100" />
                 </div>
                 <span className="font-heading font-bold text-xl text-brand-dark">Optii<span className="text-brand-green">Freight</span></span>
            </div>
        </div>

        <div className="p-8">
            <h2 className="text-xl font-bold text-gray-800 text-center mb-2">{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
            
            {/* Tabs */}
            <div className="flex mb-6 bg-gray-100 p-1 rounded-lg">
                <button onClick={() => setActiveTab('business')} className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'business' ? 'bg-white text-brand-dark shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Business</button>
                <button onClick={() => setActiveTab('carrier')} className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'carrier' ? 'bg-white text-brand-dark shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Carrier</button>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
                {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">{error}</div>}
                
                {/* Google Button */}
                <button 
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full bg-white border border-gray-300 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                  Sign in with Google
                </button>

                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t border-gray-200"></div>
                  <span className="flex-shrink-0 mx-4 text-gray-400 text-xs">OR WITH EMAIL</span>
                  <div className="flex-grow border-t border-gray-200"></div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <div className="relative">
                        <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                        <Lock className="w-4 h-4 text-gray-400 absolute right-3 top-3" />
                    </div>
                </div>

                <button type="submit" disabled={loading} className="w-full bg-brand-dark text-white py-3 rounded-lg font-bold hover:bg-blue-900 transition-colors disabled:opacity-70">
                    {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
                </button>
            </form>
            
            <p className="text-center mt-6 text-sm text-gray-600">
                {isSignUp ? "Already have an account? " : "Don't have an account? "}
                <button onClick={() => setIsSignUp(!isSignUp)} className="text-brand-orange font-bold hover:underline">
                    {isSignUp ? 'Login' : 'Sign Up'}
                </button>
            </p>
        </div>
      </div>
    </div>
  );
};

export default Login;