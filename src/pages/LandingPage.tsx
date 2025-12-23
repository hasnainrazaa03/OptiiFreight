import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, ShieldCheck, Users } from 'lucide-react';
import StatsTicker from '../components/shared/StatsTicker';

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

export default LandingPage;