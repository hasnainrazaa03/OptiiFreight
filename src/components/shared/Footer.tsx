import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Truck } from 'lucide-react';

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Logic: If on homepage, scroll to ID. If on other page, go to homepage then scroll.
  const handleContactClick = () => {
    // If we are already on home, just scroll
    if (location.pathname === '/') {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      // If elsewhere, navigate home AND pass a "state" telling it to scroll
      navigate('/', { state: { scrollTo: 'contact' } });
    }
  };

  return (
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
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link to="/about" className="hover:text-brand-orange">About Us</Link></li>
              <li><a href="#" className="hover:text-brand-orange">Careers</a></li>
              {/* UPDATED CONTACT LINK */}
              <li>
                <button onClick={handleContactClick} className="hover:text-brand-orange text-left">
                  Contact
                </button>
              </li>
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
};

export default Footer;