import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, db, googleProvider } from '../lib/firebase';
import { doc, getDoc, setDoc } from "firebase/firestore"; // Added setDoc
import { Truck, ArrowLeft, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUserRole } = useAuth();

  const initialType = searchParams.get('type') === 'carrier' ? 'carrier' : 'business';
  const [activeTab, setActiveTab] = useState<'business' | 'carrier'>(initialType);
  
  useEffect(() => {
      const type = searchParams.get('type');
      if (type === 'carrier' || type === 'business') {
          setActiveTab(type);
      }
  }, [searchParams]);

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // --- STRICT ROLE CHECK & SELF-HEALING ---
  const checkUserRole = async (uid: string, intendedRole: 'business' | 'carrier') => {
      const collectionName = intendedRole === 'carrier' ? 'carriers' : 'businesses';
      const docRef = doc(db, collectionName, uid);
      const docSnap = await getDoc(docRef);

      // 1. Success Case: Profile Exists
      if (docSnap.exists()) {
          return true;
      }

      // 2. Cross-Role Check (Prevent Carrier form logging in as Business)
      const otherCollection = intendedRole === 'carrier' ? 'businesses' : 'carriers';
      const otherSnap = await getDoc(doc(db, otherCollection, uid));

      if (otherSnap.exists()) {
          throw new Error(`This email is registered as a ${intendedRole === 'carrier' ? 'Shipper' : 'Carrier'}. Please switch tabs.`);
      }

      // 3. SELF-HEALING: Account exists in Auth but missing in Database
      // If Business -> Create Profile automatically
      if (intendedRole === 'business') {
          await setDoc(docRef, {
              uid,
              email: auth.currentUser?.email || email,
              role: 'business',
              createdAt: new Date().toISOString()
          });
          return true;
      }

      // If Carrier -> They missed onboarding, send them there
      if (intendedRole === 'carrier') {
          // We don't throw error, we just return false so handleSuccess sends them to onboarding
          return false;
      }

      return true;
  };

  const handleSuccess = (needsOnboarding: boolean = false) => {
      setUserRole(activeTab);
      
      // If it's a carrier who needs setup (or new signup)
      if (activeTab === 'carrier' && (isSignUp || needsOnboarding)) {
          navigate('/carrier/onboarding');
      } else if (activeTab === 'carrier') {
          navigate('/carrier');
      } else {
          navigate('/business');
      }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isSignUp && !acceptedTerms) {
        setError("You must accept the Terms of Service.");
        return;
    }

    setLoading(true);
    try {
      let userCredential;
      let needsOnboarding = false;

      if (isSignUp) {
        // SIGN UP FLOW
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Create Initial Doc for Business immediately
        if (activeTab === 'business') {
            await setDoc(doc(db, "businesses", userCredential.user.uid), {
                uid: userCredential.user.uid,
                email: email,
                role: 'business',
                createdAt: new Date().toISOString()
            });
        }
      } else {
        // LOGIN FLOW
        userCredential = await signInWithEmailAndPassword(auth, email, password);
        
        // Check Role / Heal Account
        const roleCheck = await checkUserRole(userCredential.user.uid, activeTab);
        if (roleCheck === false) needsOnboarding = true; // Carrier missing profile
      }
      
      handleSuccess(needsOnboarding);
    } catch (err: any) {
      setError(err.message);
      if (!isSignUp) await auth.signOut();
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (isSignUp && !acceptedTerms) {
        setError("You must accept the Terms of Service.");
        return;
    }
    try {
      const result = await signInWithPopup(auth, googleProvider);
      let needsOnboarding = false;

      // Check or Create Profile
      const roleCheck = await checkUserRole(result.user.uid, activeTab);
      if (roleCheck === false) needsOnboarding = true;

      handleSuccess(needsOnboarding);
    } catch (err: any) {
      setError(err.message || "Google Sign-In failed.");
      await auth.signOut();
    }
  };

  return (
    <div className="min-h-screen bg-brand-light flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-xl overflow-hidden border border-gray-100">
        
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
            
            <div className="flex mb-6 bg-gray-100 p-1 rounded-lg">
                <button onClick={() => setActiveTab('business')} className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'business' ? 'bg-white text-brand-dark shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Business</button>
                <button onClick={() => setActiveTab('carrier')} className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'carrier' ? 'bg-white text-brand-dark shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Carrier</button>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
                {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">{error}</div>}
                
                <button 
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full bg-white border border-gray-300 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                  {isSignUp ? 'Sign up with Google' : 'Sign in with Google'}
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

                {isSignUp && (
                    <div className="flex items-start gap-2 mt-2">
                        <input 
                            type="checkbox" 
                            id="terms" 
                            checked={acceptedTerms}
                            onChange={(e) => setAcceptedTerms(e.target.checked)}
                            className="mt-1 w-4 h-4 text-brand-orange border-gray-300 rounded focus:ring-brand-orange cursor-pointer"
                        />
                        <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer">
                            I agree to the <Link to="/terms" target="_blank" className="text-brand-orange font-semibold hover:underline">Terms of Service</Link> and <Link to="/privacy" target="_blank" className="text-brand-orange font-semibold hover:underline">Privacy Policy</Link>.
                        </label>
                    </div>
                )}

                <button 
                    type="submit" 
                    disabled={loading || (isSignUp && !acceptedTerms)} 
                    className="w-full bg-brand-dark text-white py-3 rounded-lg font-bold hover:bg-blue-900 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
                </button>
            </form>
            
            <p className="text-center mt-6 text-sm text-gray-600">
                {isSignUp ? "Already have an account? " : "Don't have an account? "}
                <button onClick={() => { setIsSignUp(!isSignUp); setError(''); }} className="text-brand-orange font-bold hover:underline">
                    {isSignUp ? 'Login' : 'Sign Up'}
                </button>
            </p>
        </div>
      </div>
    </div>
  );
};

export default Login;