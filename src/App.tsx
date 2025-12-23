import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';

// Import Pages
import Login from './pages/Login';
import Resources from './pages/Resources';
import LandingPage from './pages/LandingPage'; // You need to create this from the code you had in App.tsx
import AboutUs from './pages/AboutUs';         // Move existing AboutUs component to src/pages/AboutUs.tsx
import Pricing from './pages/Pricing';         // Move existing Pricing component to src/pages/Pricing.tsx

// Import Business Components
import BusinessDashboard from './components/business/BusinessDashboard';
import CreateShipment from './components/business/CreateShipment';
import TruckSelection from './components/business/TruckSelection'; // Ensure you moved this
import Payment from './components/business/Payment';               // Ensure you moved this

// Import Carrier Components
import CarrierDashboard from './components/carrier/CarrierDashboard';

// Import Shared
import Navbar from './components/shared/Navbar';
import Footer from './components/shared/Footer';
import OptimizationAssistant from './components/shared/OptimizationAssistant';
import { AuthProvider } from './context/AuthContext'; // Wrap app in Auth Provider

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <div className="flex flex-col min-h-screen font-sans">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/resources" element={<Resources />} />
              
              {/* Business Routes */}
              <Route path="/business" element={<BusinessDashboard />} />
              <Route path="/business/create" element={<CreateShipment />} />
              <Route path="/business/trucks" element={<TruckSelection />} />
              <Route path="/business/payment" element={<Payment />} />
              
              {/* Carrier Routes */}
              <Route path="/carrier" element={<CarrierDashboard />} />
            </Routes>
          </main>
          <OptimizationAssistant />
          <Footer />
        </div>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;