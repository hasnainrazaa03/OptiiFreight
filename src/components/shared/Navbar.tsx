import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Truck, Menu, X, Plus, Search, LayoutDashboard, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { auth } from '../../lib/firebase';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { user, userRole } = useAuth(); // Get global auth state

  // Helper to determine where "Dashboard" goes
  const dashboardLink = userRole === 'carrier' ? '/carrier' : '/business';

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/');
    setIsOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <div className="w-10 h-10 bg-brand-dark rounded-lg flex items-center justify-center">
                <Truck className="text-brand-orange w-6 h-6 transform -scale-x-100" />
              </div>
              <span className="font-heading font-bold text-2xl text-brand-dark tracking-tight">Optii<span className="text-brand-green">Freight</span></span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            
            {/* LOGGED OUT STATE */}
            {!user ? (
              <>
                <Link to="/login?type=business" className="text-gray-600 hover:text-brand-dark font-medium">For Business</Link>
                <Link to="/login?type=carrier" className="text-gray-600 hover:text-brand-dark font-medium">For Carriers</Link>
                <Link to="/resources" className="text-gray-600 hover:text-brand-dark font-medium">Resources</Link>
                <Link to="/pricing" className="text-gray-600 hover:text-brand-dark font-medium">Pricing</Link>
                <Link to="/about" className="text-gray-600 hover:text-brand-dark font-medium">About</Link>
                <Link to="/login" className="bg-brand-dark text-white px-6 py-2 rounded-full font-medium hover:bg-blue-900 transition-colors">
                  Login
                </Link>
              </>
            ) : (
              /* LOGGED IN STATE */
              <>
                <Link to="/resources" className="text-gray-600 hover:text-brand-dark font-medium">Resources</Link>
                
                <Link to={dashboardLink} className="text-gray-600 hover:text-brand-dark font-medium flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>

                {/* Dynamic Action Button based on Role */}
                {userRole === 'business' ? (
                  <Link to="/business/create" className="text-gray-600 hover:text-brand-dark font-medium flex items-center gap-2">
                    <Plus className="w-4 h-4 text-brand-orange" /> New Shipment
                  </Link>
                ) : (
                  <>
                    <Link to="/carrier" className="text-gray-600 hover:text-brand-dark font-medium flex items-center gap-2">
                        <Search className="w-4 h-4 text-brand-green" /> Find Loads
                    </Link>
                    {/* ADDED MY TRIPS LINK */}
                    <Link to="/carrier/trips" className="text-gray-600 hover:text-brand-dark font-medium flex items-center gap-2">
                        <Truck className="w-4 h-4 text-brand-orange" /> My Trips
                    </Link>
                  </>
                )}

                {userRole === 'carrier' && (
                  <Link to="/carrier/settings" className="text-gray-600 hover:text-brand-dark font-medium flex items-center gap-2">
                    <Settings className="w-4 h-4" /> Settings
                  </Link>
                )}

                <div className="h-6 w-px bg-gray-300 mx-2"></div>

                <div className="flex items-center gap-4">
                   <span className="text-sm text-gray-500 font-medium">
                      {userRole === 'business' ? 'Shipper' : 'Carrier'} Account
                   </span>
                   <button onClick={handleLogout} className="text-sm font-bold text-red-500 hover:text-red-700">
                      Logout
                   </button>
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 p-2">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-xl">
          <div className="px-4 pt-2 pb-4 space-y-2">
             {!user ? (
               <>
                 <Link to="/login?type=business" className="block py-2 text-base font-medium text-gray-700">For Business</Link>
                 <Link to="/login?type=carrier" className="block py-2 text-base font-medium text-gray-700">For Carriers</Link>
                 <Link to="/resources" className="block py-2 text-base font-medium text-gray-700">Resources</Link>
                 <Link to="/pricing" className="block py-2 text-base font-medium text-gray-700">Pricing</Link>
                 <Link to="/login" className="block w-full text-center mt-4 bg-brand-dark text-white py-3 rounded-lg font-bold">Login</Link>
               </>
             ) : (
               <>
                 <Link to={dashboardLink} className="block py-2 text-base font-bold text-brand-dark">My Dashboard</Link>
                 <Link to="/resources" className="block py-2 text-base font-medium text-gray-700">Resources</Link>
                 
                 {userRole === 'business' ? (
                    <Link to="/business/create" className="block py-2 text-base font-medium text-gray-600">Create New Shipment</Link>
                 ) : (
                    <>
                      <Link to="/carrier" className="block py-2 text-base font-medium text-gray-600">Find Loads</Link>
                      <Link to="/carrier/trips" className="block py-2 text-base font-medium text-gray-600">My Trips</Link>
                      <Link to="/carrier/settings" className="block py-2 text-base font-medium text-gray-600">Settings</Link>
                    </>
                 )}
                 <button onClick={handleLogout} className="block w-full text-left py-2 text-base font-medium text-red-500 mt-2 border-t border-gray-100">
                    Logout
                 </button>
               </>
             )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;