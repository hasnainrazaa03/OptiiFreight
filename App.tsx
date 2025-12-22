import React, { useState } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Truck, Menu, X, ArrowRight, ShieldCheck, BarChart3, Users, Lock, Check, ArrowLeft } from 'lucide-react';
import StatsTicker from './components/StatsTicker';
import BusinessDashboard, { CreateShipment, TruckSelection, Payment } from './components/BusinessDashboard';
import CarrierDashboard from './components/CarrierDashboard';
import OptimizationAssistant from './components/OptimizationAssistant';

const LandingPage = () => {
  return (
    <>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-brand-dark to-[#0d3aa9] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {/* Abstract Map Lines Background */}
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,50 Q25,30 50,50 T100,50" stroke="white" strokeWidth="0.5" fill="none" />
            <path d="M0,70 Q25,50 50,70 T100,70" stroke="white" strokeWidth="0.5" fill="none" />
            <circle cx="20" cy="40" r="1" fill="white" />
            <circle cx="80" cy="60" r="1" fill="white" />
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="lg:w-2/3">
            <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6 leading-tight">
              Optimize Freight Costs. <br/>
              <span className="text-brand-green">Share Truck Space.</span> <br/>
              Save Up to 40%.
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl font-light">
              Connecting businesses with partial loads to empty truck space across the USA. Maximize utilization, reduce carbon footprint, and boost efficiency with AI-driven routes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/login?type=business" className="bg-brand-orange hover:bg-orange-600 text-white font-semibold py-4 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all text-center flex items-center justify-center gap-2">
                I Need to Ship <ArrowRight className="w-5 h-5"/>
              </Link>
              <Link to="/login?type=carrier" className="bg-white text-brand-dark hover:bg-gray-100 font-semibold py-4 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all text-center border border-transparent">
                I Have a Truck
              </Link>
            </div>
          </div>
        </div>
      </div>

      <StatsTicker />

      {/* Value Proposition */}
      <div className="py-20 bg-brand-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-heading font-bold text-brand-dark mb-4">Why Choose OptiiFreight?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Our intelligent platform bridges the gap between inefficient partial loads and wasted truck space.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <BarChart3 className="w-8 h-8 text-brand-green" />
              </div>
              <h3 className="text-xl font-bold text-brand-dark mb-3">Cost Optimization</h3>
              <p className="text-gray-600">Shippers save money by paying only for the space they use, while carriers earn more by filling empty space.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
               <div className="w-14 h-14 bg-orange-100 rounded-lg flex items-center justify-center mb-6">
                <ShieldCheck className="w-8 h-8 text-brand-orange" />
              </div>
              <h3 className="text-xl font-bold text-brand-dark mb-3">Trusted Network</h3>
              <p className="text-gray-600">Every carrier is verified. Payments are held in escrow until delivery is confirmed.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
               <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-brand-dark" />
              </div>
              <h3 className="text-xl font-bold text-brand-dark mb-3">AI Matching</h3>
              <p className="text-gray-600">Our algorithm instantly matches loads with compatible routes to minimize detour time.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-brand-light">
      <div className="bg-brand-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-heading font-bold mb-4">About OptiiFreight</h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">Revolutionizing logistics, one shared load at a time.</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-xl shadow-sm p-8 mb-12">
           <h2 className="text-2xl font-bold text-brand-dark mb-4">Our Mission</h2>
           <p className="text-gray-600 leading-relaxed mb-6">
             At OptiiFreight, we believe that an empty truck is a missed opportunity—for the carrier, the shipper, and the planet. Our mission is to democratize efficient logistics for small and medium-sized enterprises (SMEs) across the United States. By leveraging advanced AI and shared economy principles, we are building a logistics network that is more affordable, more efficient, and more sustainable.
           </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
           <div className="bg-white rounded-xl shadow-sm p-8">
             <h3 className="text-xl font-bold text-brand-dark mb-4">Sustainability First</h3>
             <p className="text-gray-600">
               Transportation is a major contributor to global carbon emissions. By optimizing truck loads and reducing empty miles, OptiiFreight aims to reduce CO2 emissions by up to 30% per shipment compared to traditional LTL (Less-than-Truckload) methods.
             </p>
           </div>
           <div className="bg-white rounded-xl shadow-sm p-8">
             <h3 className="text-xl font-bold text-brand-dark mb-4">Technology Driven</h3>
             <p className="text-gray-600">
               Our proprietary "OptiiMatch" algorithm analyzes thousands of data points—routes, vehicle types, shipment dimensions, and timing—to create the perfect match in milliseconds, ensuring minimal detours and maximum savings.
             </p>
           </div>
        </div>
      </div>
    </div>
  );
};

const Pricing = () => {
  return (
    <div className="min-h-screen bg-brand-light">
      <div className="bg-brand-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-heading font-bold mb-4">Transparent Pricing</h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">Fair rates for everyone. No hidden fees.</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Business Pricing */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 transform hover:-translate-y-1 transition-transform">
            <div className="bg-brand-orange p-6 text-white text-center">
              <h3 className="text-2xl font-bold font-heading">For Shippers</h3>
              <p className="opacity-90">Pay only for what you ship</p>
            </div>
            <div className="p-8">
              <div className="text-center mb-8">
                <span className="text-4xl font-bold text-gray-900">8-12%</span>
                <span className="text-gray-500 block">Commission per Shipment</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-gray-600"><Check className="w-5 h-5 text-green-500 mr-2"/> Free account creation</li>
                <li className="flex items-center text-gray-600"><Check className="w-5 h-5 text-green-500 mr-2"/> Instant AI quotes</li>
                <li className="flex items-center text-gray-600"><Check className="w-5 h-5 text-green-500 mr-2"/> Real-time tracking included</li>
                <li className="flex items-center text-gray-600"><Check className="w-5 h-5 text-green-500 mr-2"/> Full insurance coverage options</li>
              </ul>
              <Link to="/login?type=business" className="block w-full bg-brand-dark text-white text-center py-3 rounded-lg font-bold hover:bg-blue-900 transition-colors">Start Shipping</Link>
            </div>
          </div>

          {/* Carrier Pricing */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 transform hover:-translate-y-1 transition-transform">
            <div className="bg-brand-green p-6 text-white text-center">
              <h3 className="text-2xl font-bold font-heading">For Carriers</h3>
              <p className="opacity-90">Fill your truck, boost your income</p>
            </div>
             <div className="p-8">
              <div className="text-center mb-8">
                <span className="text-4xl font-bold text-gray-900">5%</span>
                <span className="text-gray-500 block">Commission per Completed Trip</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-gray-600"><Check className="w-5 h-5 text-green-500 mr-2"/> No monthly subscription fees</li>
                <li className="flex items-center text-gray-600"><Check className="w-5 h-5 text-green-500 mr-2"/> Guaranteed payments within 48h</li>
                <li className="flex items-center text-gray-600"><Check className="w-5 h-5 text-green-500 mr-2"/> Access to high-paying partial loads</li>
                <li className="flex items-center text-gray-600"><Check className="w-5 h-5 text-green-500 mr-2"/> Route optimization tools included</li>
              </ul>
               <Link to="/login?type=carrier" className="block w-full bg-brand-dark text-white text-center py-3 rounded-lg font-bold hover:bg-blue-900 transition-colors">Register Truck</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isDashboard = location.pathname.includes('/business') || location.pathname.includes('/carrier');
  const isLoginPage = location.pathname === '/login';

  if (isLoginPage) return null; // Simplified header for login

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <div className="w-10 h-10 bg-brand-dark rounded-lg flex items-center justify-center">
                <Truck className="text-brand-orange w-6 h-6 transform -scale-x-100" />
              </div>
              <span className="font-heading font-bold text-2xl text-brand-dark tracking-tight">Optii<span className="text-brand-green">Freight</span></span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            {!isDashboard && (
              <>
                <Link to="/business" className="text-gray-600 hover:text-brand-dark font-medium">For Business</Link>
                <Link to="/carrier" className="text-gray-600 hover:text-brand-dark font-medium">For Carriers</Link>
                <Link to="/pricing" className="text-gray-600 hover:text-brand-dark font-medium">Pricing</Link>
                <Link to="/about" className="text-gray-600 hover:text-brand-dark font-medium">About</Link>
                <Link to="/login" className="bg-brand-dark text-white px-6 py-2 rounded-full font-medium hover:bg-blue-900 transition-colors">
                  Login
                </Link>
              </>
            )}
             {isDashboard && (
               <div className="flex items-center gap-4">
                 <span className="text-sm text-gray-500">Logged in as {location.pathname.includes('business') ? 'Shipper' : 'Carrier'}</span>
                 <Link to="/" className="text-sm font-semibold text-brand-orange">Logout</Link>
               </div>
             )}
          </div>

          <div className="flex items-center md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 p-2">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
             <Link to="/business" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-brand-dark hover:bg-gray-50">For Business</Link>
             <Link to="/carrier" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-brand-dark hover:bg-gray-50">For Carriers</Link>
             <Link to="/pricing" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-brand-dark hover:bg-gray-50">Pricing</Link>
             <Link to="/about" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-brand-dark hover:bg-gray-50">About</Link>
             <Link to="/login" className="block w-full text-center mt-4 bg-brand-dark text-white px-3 py-3 rounded-lg font-medium">Login</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

const Login = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  // Determine initial tab based on query param, default to 'business'
  const initialType = searchParams.get('type') === 'carrier' ? 'carrier' : 'business';
  const [activeTab, setActiveTab] = useState<'business' | 'carrier'>(initialType);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'business') {
      // Check if user came from "I need to ship" flow (could add more complex logic here)
      navigate('/business/create'); 
    } else {
      navigate('/carrier');
    }
  };

  return (
    <div className="min-h-screen bg-brand-light flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* Header with Back Button */}
        <div className="p-4 border-b border-gray-100 flex items-center">
            <Link to="/" className="text-gray-400 hover:text-brand-dark">
                <ArrowLeft className="w-5 h-5"/>
            </Link>
            <div className="ml-auto mr-auto pr-5 flex items-center gap-2">
                 <Truck className="text-brand-orange w-5 h-5 transform -scale-x-100" />
                 <span className="font-heading font-bold text-xl text-brand-dark">Optii<span className="text-brand-green">Freight</span></span>
            </div>
        </div>

        <div className="p-8">
            <h2 className="text-xl font-bold text-gray-800 text-center mb-6">Welcome Back</h2>

            {/* Tabs */}
            <div className="flex mb-6 bg-gray-100 p-1 rounded-lg">
                <button 
                    onClick={() => setActiveTab('business')}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'business' ? 'bg-white text-brand-dark shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Business / Shipper
                </button>
                <button 
                    onClick={() => setActiveTab('carrier')}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'carrier' ? 'bg-white text-brand-dark shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Truck Owner
                </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input 
                type="email" 
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-dark focus:outline-none" 
                placeholder={activeTab === 'business' ? "name@company.com" : "driver@fleet.com"} 
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                <input 
                    type="password" 
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-dark focus:outline-none" 
                    placeholder="••••••••" 
                />
                <Lock className="w-4 h-4 text-gray-400 absolute right-3 top-3" />
                </div>
            </div>
            <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-gray-600">
                <input type="checkbox" className="rounded border-gray-300" /> Remember me
                </label>
                <a href="#" className="text-brand-orange hover:text-orange-700 font-medium">Forgot Password?</a>
            </div>
            <button 
                type="submit" 
                className="w-full bg-brand-dark text-white py-3 rounded-lg font-bold hover:bg-blue-900 transition-colors"
            >
                {activeTab === 'business' ? 'Sign In as Shipper' : 'Sign In as Carrier'}
            </button>
            </form>
            
            <p className="text-center mt-6 text-sm text-gray-600">
            Don't have an account? <a href="#" className="text-brand-dark font-bold hover:underline">Sign up</a>
            </p>
        </div>
      </div>
    </div>
  );
};

const Footer = () => (
  <footer className="bg-brand-dark text-white pt-16 pb-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
             <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                <Truck className="text-brand-orange w-5 h-5 transform -scale-x-100" />
              </div>
            <span className="font-heading font-bold text-xl">OptiiFreight</span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            Revolutionizing logistics through shared economy principles and AI optimization.
          </p>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-4">Platform</h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><Link to="/business" className="hover:text-brand-orange">Shippers</Link></li>
            <li><Link to="/carrier" className="hover:text-brand-orange">Carriers</Link></li>
            <li><Link to="/pricing" className="hover:text-brand-orange">Pricing</Link></li>
            <li><a href="#" className="hover:text-brand-orange">Optimization Engine</a></li>
          </ul>
        </div>
         <div>
          <h4 className="font-bold text-lg mb-4">Company</h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><Link to="/about" className="hover:text-brand-orange">About Us</Link></li>
            <li><a href="#" className="hover:text-brand-orange">Careers</a></li>
            <li><a href="#" className="hover:text-brand-orange">Blog</a></li>
            <li><a href="#" className="hover:text-brand-orange">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-4">Legal</h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><a href="#" className="hover:text-brand-orange">Terms of Service</a></li>
            <li><a href="#" className="hover:text-brand-orange">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-brand-orange">Insurance Policy</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-blue-900 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
        <p>&copy; 2024 OptiiFreight Logistics Inc. All rights reserved.</p>
        <div className="flex gap-4 mt-4 md:mt-0">
          <span>Made with ❤️ for Logistics</span>
        </div>
      </div>
    </div>
  </footer>
);

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen font-sans">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/business" element={<BusinessDashboard />} />
            <Route path="/business/create" element={<CreateShipment />} />
            <Route path="/business/trucks" element={<TruckSelection />} />
            <Route path="/business/payment" element={<Payment />} />
            <Route path="/carrier" element={<CarrierDashboard />} />
          </Routes>
        </main>
        <OptimizationAssistant />
        <Footer />
      </div>
    </HashRouter>
  );
};

export default App;