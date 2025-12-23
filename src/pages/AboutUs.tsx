import React, { useState } from 'react';
import { X, Linkedin, Twitter, Target, Globe } from 'lucide-react';

// Import the data from the separate file
import { teamMembers, TeamMember } from '../data/teamMembers';

const AboutUs = () => {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  return (
    <div className="min-h-screen bg-brand-light">
      
      {/* Hero Section */}
      <div className="bg-brand-dark text-white py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/3 -translate-y-1/3">
           <Globe className="w-96 h-96" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl font-heading font-bold mb-4">About OptiiFreight</h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">Revolutionizing logistics, one shared load at a time.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Mission & Vision Grid */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          {/* Mission */}
          <div className="bg-white rounded-xl shadow-sm p-8 border-l-4 border-brand-orange">
             <div className="flex items-center gap-3 mb-4">
                <Target className="w-8 h-8 text-brand-orange" />
                <h2 className="text-2xl font-bold text-brand-dark">Our Mission</h2>
             </div>
             <p className="text-gray-600 leading-relaxed">
               To democratize efficient logistics for SMEs across the United States. We believe an empty truck is a missed opportunity. By leveraging AI and shared economy principles, we are building a network that is affordable, efficient, and sustainable.
             </p>
          </div>

          {/* Vision */}
          <div className="bg-white rounded-xl shadow-sm p-8 border-l-4 border-brand-green">
             <div className="flex items-center gap-3 mb-4">
                <Globe className="w-8 h-8 text-brand-green" />
                <h2 className="text-2xl font-bold text-brand-dark">Our Vision</h2>
             </div>
             <p className="text-gray-600 leading-relaxed">
               We envision a future where zero miles are driven empty. We aim to become the global standard for "LTL Optimization," creating a seamless, interconnected logistics web where every shipment finds its perfect ride instantly, reducing global shipping emissions by 50% by 2030.
             </p>
          </div>
        </div>
        
        {/* Why We Do It (Values Section) */}
        <div className="mb-24">
            <h3 className="text-2xl font-bold text-center mb-10 text-brand-dark">Why We Do It</h3>
            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white rounded-xl shadow-sm p-8">
                    <h3 className="text-xl font-bold text-brand-dark mb-4">Sustainability First</h3>
                    <p className="text-gray-600">
                    Transportation is a major contributor to global carbon emissions. By optimizing truck loads and reducing empty miles, OptiiFreight aims to reduce CO2 emissions significantly compared to traditional methods.
                    </p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-8">
                    <h3 className="text-xl font-bold text-brand-dark mb-4">Technology Driven</h3>
                    <p className="text-gray-600">
                    Our proprietary "OptiiMatch" algorithm analyzes thousands of data points—routes, vehicle types, shipment dimensions, and timing—to create the perfect match in milliseconds.
                    </p>
                </div>
            </div>
        </div>

        {/* TEAM SECTION */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-brand-dark mb-4">Meet Our Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">The minds and makers behind the OptiiFreight revolution.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <div 
                key={member.id} 
                className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer border border-gray-100 flex flex-col h-full"
                onClick={() => setSelectedMember(member)}
              >
                {/* Image Container */}
                <div className="h-80 bg-gray-200 overflow-hidden relative">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover object-top transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                    <span className="text-white opacity-0 group-hover:opacity-100 font-semibold border border-white px-4 py-2 rounded-full backdrop-blur-sm">View Bio</span>
                  </div>
                </div>
                
                {/* Card Content */}
                <div className="p-6 text-center flex-grow flex flex-col justify-center">
                  <h3 className="text-xl font-bold text-brand-dark mb-1">{member.name}</h3>
                  <p className="text-brand-orange font-medium text-sm uppercase tracking-wide">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TEAM MODAL */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm" onClick={() => setSelectedMember(null)}>
          <div 
            className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-200 flex flex-col md:flex-row max-h-[90vh]"
            onClick={(e) => e.stopPropagation()} 
          >
            <button 
              onClick={() => setSelectedMember(null)}
              className="absolute top-4 right-4 bg-white/80 hover:bg-white p-2 rounded-full transition-colors z-20 shadow-sm"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>

            {/* Modal Image */}
            <div className="md:w-2/5 h-64 md:h-auto bg-gray-200 relative">
              <img src={selectedMember.image} alt={selectedMember.name} className="w-full h-full object-cover object-top" />
            </div>

            {/* Modal Content */}
            <div className="md:w-3/5 p-8 overflow-y-auto">
              <h3 className="text-3xl font-heading font-bold text-brand-dark mb-1">{selectedMember.name}</h3>
              <p className="text-brand-orange font-bold text-lg mb-6">{selectedMember.role}</p>
              
              <div className="prose prose-sm text-gray-600 leading-relaxed mb-8">
                {selectedMember.bio}
              </div>

              <div className="flex gap-4 pt-6 border-t border-gray-100">
                 <a href="#" className="flex items-center gap-2 text-gray-500 hover:text-[#0077b5] transition-colors">
                    <Linkedin className="w-5 h-5"/> <span className="text-sm">LinkedIn</span>
                 </a>
                 <a href="#" className="flex items-center gap-2 text-gray-500 hover:text-[#1DA1F2] transition-colors">
                    <Twitter className="w-5 h-5"/> <span className="text-sm">Twitter</span>
                 </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutUs;