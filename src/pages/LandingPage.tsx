import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, BarChart3, ShieldCheck, Users, Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import StatsTicker from '../components/shared/StatsTicker';

const LandingPage = () => {
  // Form State
  const location = useLocation();
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (location.state && (location.state as any).scrollTo === 'contact') {
      const section = document.getElementById('contact');
      if (section) {
        // Small delay to ensure page renders first
        setTimeout(() => {
          section.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    
    // Simulate Email Sending Network Request
    setTimeout(() => {
      setFormStatus('success');
      setFormData({ name: '', email: '', message: '' });
      // Reset success message after 3 seconds
      setTimeout(() => setFormStatus('idle'), 5000);
    }, 1500);
  };

  return (
    <>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-brand-dark to-[#0d3aa9] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
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

      {/* CONTACT US SECTION */}
      <div id="contact" className="bg-white py-20 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            
            {/* Contact Info */}
            <div>
              <h2 className="text-3xl font-heading font-bold text-brand-dark mb-6">Get in touch</h2>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                Have questions about shipping rates, carrier onboarding, or our technology? Our team is here to help you optimize your logistics 24/7.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-brand-light rounded-lg">
                    <Mail className="w-6 h-6 text-brand-orange" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-1">Email Us</p>
                    <a href="mailto:support@optiifreight.com" className="text-xl font-bold text-brand-dark hover:text-brand-orange transition-colors">
                      support@optiifreight.com
                    </a>
                    <p className="text-sm text-gray-400 mt-1">We usually reply within 2 hours.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-brand-light rounded-lg">
                    <Phone className="w-6 h-6 text-brand-green" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-1">Call Us</p>
                    <a href="tel:+12138544542" className="text-xl font-bold text-brand-dark hover:text-brand-orange transition-colors">
                      +1 (213) 854-4542
                    </a>
                    <p className="text-sm text-gray-400 mt-1">Mon-Fri, 8am - 6pm EST</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-brand-light rounded-lg">
                    <MapPin className="w-6 h-6 text-brand-dark" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-1">Headquarters</p>
                    <p className="text-lg font-medium text-gray-800">
                      1200 Logistics Way, Suite 400<br/>
                      Los Angeles, CA 90012
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-brand-light p-8 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-xl font-bold text-brand-dark mb-6">Send us a message</h3>
              
              {formStatus === 'success' ? (
                <div className="bg-green-100 border border-green-200 text-green-700 p-6 rounded-xl flex flex-col items-center justify-center text-center h-80">
                  <CheckCircle className="w-16 h-16 mb-4 text-green-600" />
                  <h4 className="text-2xl font-bold mb-2">Message Sent!</h4>
                  <p>Thanks for reaching out. One of our logistics experts will get back to you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input 
                      type="text" 
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input 
                      type="email" 
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
                      placeholder="john@company.com"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">How can we help?</label>
                    <textarea 
                      name="message"
                      required
                      rows={4}
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all resize-none"
                      placeholder="Tell us about your shipping needs..."
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    disabled={formStatus === 'submitting'}
                    className="w-full bg-brand-dark text-white font-bold py-4 rounded-lg shadow-md hover:bg-blue-900 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {formStatus === 'submitting' ? 'Sending...' : 'Send Message'}
                    {!formStatus && <Send className="w-4 h-4" />}
                  </button>
                  <p className="text-xs text-gray-500 text-center mt-4">
                    By sending this message, you agree to our privacy policy.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingPage;