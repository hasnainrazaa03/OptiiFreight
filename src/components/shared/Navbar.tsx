import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Truck, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { auth } from '../../lib/firebase';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userRole } = useAuth(); // Access global auth state

  const isDashboard = location.pathname.includes('/business') || location.pathname.includes('/carrier');
  const isLoginPage = location.pathname === '/login';

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/');
  };

  if (isLoginPage) return null; // Hide navbar on login page

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
            {!isDashboard ? (
              // Public Navigation
              <>
                <Link to="/login?type=business" className="text-gray-600 hover:text-brand-dark font-medium">For Business</Link>
                <Link to="/login?type=carrier" className="text-gray-600 hover:text-brand-dark font-medium">For Carriers</Link>
                <Link to="/pricing" className="text-gray-600 hover:text-brand-dark font-medium">Pricing</Link>
                <Link to="/about" className="text-gray-600 hover:text-brand-dark font-medium">About</Link>
                {user ? (
                   <button onClick={handleLogout} className="bg-brand-dark text-white px-6 py-2 rounded-full font-medium hover:bg-blue-900 transition-colors">
                     Logout
                   </button>
                ) : (
                   <Link to="/login" className="bg-brand-dark text-white px-6 py-2 rounded-full font-medium hover:bg-blue-900 transition-colors">
                     Login
                   </Link>
                )}
              </>
            ) : (
               // Dashboard Navigation
               <div className="flex items-center gap-4">
                 <span className="text-sm text-gray-500">
                    Logged in as {userRole === 'business' ? 'Shipper' : 'Carrier'}
                 </span>
                 <button onClick={handleLogout} className="text-sm font-semibold text-brand-orange hover:text-red-600">
                    Logout
                 </button>
               </div>
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
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
             <Link to="/business" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-brand-dark hover:bg-gray-50">For Business</Link>
             <Link to="/carrier" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-brand-dark hover:bg-gray-50">For Carriers</Link>
             <Link to="/pricing" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-brand-dark hover:bg-gray-50">Pricing</Link>
             <Link to="/login" className="block w-full text-center mt-4 bg-brand-dark text-white px-3 py-3 rounded-lg font-medium">Login</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;