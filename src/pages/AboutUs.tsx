import React, { useState } from 'react';
import { X, Linkedin, Twitter, Target, Globe, Users, Award, Zap, Heart, Leaf } from 'lucide-react';

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
          <p className="text-xl text-blue-200 max-w-3xl mx-auto">Where Smart Shipping Meets Meaningful Connections.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Intro Text */}
        <div className="mb-20 text-center max-w-4xl mx-auto">
            <p className="text-lg text-gray-700 leading-relaxed">
            At OptiiFreight, we believe efficient logistics shouldn't come at the cost of excess inventory or empty miles. We're revolutionizing transportation by creating a smarter, more collaborative way to move goods—one that benefits both businesses and truck owners while building a more sustainable future.
            </p>
        </div>

        {/* Mission & Vision Grid */}
        <div className="grid md:grid-cols-2 gap-12 mb-24">
          {/* Mission */}
          <div className="bg-white rounded-xl shadow-sm p-8 border-l-4 border-brand-orange">
             <div className="flex items-center gap-3 mb-4">
                <Target className="w-8 h-8 text-brand-orange" />
                <h2 className="text-2xl font-bold text-brand-dark">Our Mission</h2>
             </div>
             <p className="text-gray-600 leading-relaxed">
               To optimize the transportation ecosystem by intelligently matching available truck space with shipping needs, empowering businesses to reduce costs and eliminate wasteful inventory practices while helping truck owners maximize their capacity utilization. We build more than a platform—we build partnerships that drive mutual success.
             </p>
          </div>

          {/* Vision */}
          <div className="bg-white rounded-xl shadow-sm p-8 border-l-4 border-brand-green">
             <div className="flex items-center gap-3 mb-4">
                <Globe className="w-8 h-8 text-brand-green" />
                <h2 className="text-2xl font-bold text-brand-dark">Our Vision</h2>
             </div>
             <p className="text-gray-600 leading-relaxed">
               To become North America's most trusted collaborative logistics network, where every shipment represents not just efficient transportation but also a meaningful connection. We envision a supply chain where optimization is intelligent, accessible, and sustainable—where small businesses compete on equal footing and independent truckers thrive through consistent, profitable loads.
             </p>
          </div>
        </div>
        
        {/* Core Values Section */}
        <div className="mb-24">
            <h3 className="text-3xl font-heading font-bold text-center mb-12 text-brand-dark">Our Core Values</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white rounded-xl shadow-sm p-8 border-t-4 border-blue-500">
                    <div className="mb-4 text-blue-500"><Zap className="w-8 h-8"/></div>
                    <h3 className="text-xl font-bold text-brand-dark mb-3">Optimization with Purpose</h3>
                    <p className="text-gray-600 text-sm">
                    We believe true efficiency extends beyond cost savings to include resource utilization, environmental impact, and operational simplicity. Every solution we create aims to optimize multiple dimensions of the shipping experience.
                    </p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-8 border-t-4 border-red-500">
                    <div className="mb-4 text-red-500"><Heart className="w-8 h-8"/></div>
                    <h3 className="text-xl font-bold text-brand-dark mb-3">Relationship-Driven Logistics</h3>
                    <p className="text-gray-600 text-sm">
                    Unlike transactional platforms, we invest in lasting partnerships. We take time to understand unique challenges, celebrate shared successes, and build a community where every member is valued beyond their shipment volume.
                    </p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-8 border-t-4 border-purple-500">
                    <div className="mb-4 text-purple-500"><Users className="w-8 h-8"/></div>
                    <h3 className="text-xl font-bold text-brand-dark mb-3">Collaborative Innovation</h3>
                    <p className="text-gray-600 text-sm">
                    We bring together shippers, carriers, and logistics experts to co-create solutions. Our strength comes from diverse perspectives working toward a common goal: making transportation smarter for everyone.
                    </p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-8 border-t-4 border-green-500">
                    <div className="mb-4 text-green-500"><Leaf className="w-8 h-8"/></div>
                    <h3 className="text-xl font-bold text-brand-dark mb-3">Sustainable by Design</h3>
                    <p className="text-gray-600 text-sm">
                    Our business model naturally promotes sustainability. By maximizing truck capacity utilization, we significantly reduce carbon emissions, minimize empty miles, and help businesses operate leaner—creating environmental benefits that align with economic advantages.
                    </p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-8 border-t-4 border-orange-500 lg:col-span-2">
                    <div className="mb-4 text-orange-500"><Award className="w-8 h-8"/></div>
                    <h3 className="text-xl font-bold text-brand-dark mb-3">Empowerment Through Transparency</h3>
                    <p className="text-gray-600 text-sm">
                    We champion small and medium businesses by providing enterprise-level logistics insights and tools. We give independent truck owners predictable revenue streams and operational control. Transparency in pricing, capacity, and operations builds trust and enables informed decisions.
                    </p>
                </div>
            </div>
        </div>

        {/* The OptiiFreight Difference */}
        <div className="bg-brand-dark text-white rounded-3xl p-12 mb-24 relative overflow-hidden">
            <div className="relative z-10">
                <h3 className="text-3xl font-heading font-bold mb-8 text-center">The OptiiFreight Difference</h3>
                <p className="text-blue-100 mb-10 max-w-3xl mx-auto text-center">
                    Traditional logistics often forces businesses into a difficult choice: pay premium rates for partial loads or order excess inventory to fill trucks. OptiiFreight changes this equation. Our intelligent platform connects underutilized truck space with businesses that need to ship goods, creating win-win scenarios:
                </p>
                <div className="grid md:grid-cols-3 gap-8 text-center">
                    <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                        <h4 className="text-xl font-bold text-brand-orange mb-2">For Businesses</h4>
                        <p className="text-sm text-blue-50">Reduce transportation costs by up to 30%, eliminate unnecessary inventory holding costs, and gain shipping flexibility without long-term commitments.</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                        <h4 className="text-xl font-bold text-brand-green mb-2">For Truck Owners</h4>
                        <p className="text-sm text-blue-50">Increase revenue per mile, minimize empty runs, and build consistent partnerships with reliable shippers.</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                        <h4 className="text-xl font-bold text-blue-300 mb-2">For Our Planet</h4>
                        <p className="text-sm text-blue-50">Every optimized load means fewer trucks on the road, reduced emissions, and more efficient use of existing resources.</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Commitment to Community */}
        <div className="mb-24 bg-gray-50 rounded-2xl p-10 border border-gray-100">
            <div className="max-w-4xl mx-auto">
                <h3 className="text-2xl font-bold text-brand-dark mb-6 text-center">Our Commitment to Community</h3>
                <p className="text-gray-600 mb-6 text-center">
                    We measure our success not just in shipments optimized, but in relationships built and small businesses empowered. We're committed to:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                    {['Providing educational resources on logistics optimization', 'Advocating for policies that support independent truckers and small businesses', 'Continuously improving our platform based on user feedback', 'Maintaining fair and transparent practices for all community members'].map((item, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                            <div className="mt-1 bg-brand-orange rounded-full p-1"><div className="w-2 h-2 bg-white rounded-full"></div></div>
                            <p className="text-gray-700 font-medium">{item}</p>
                        </div>
                    ))}
                </div>
                <div className="mt-10 text-center">
                    <p className="text-xl font-bold text-brand-dark italic">"OptiiFreight: Optimized Capacity. Meaningful Partnerships."</p>
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