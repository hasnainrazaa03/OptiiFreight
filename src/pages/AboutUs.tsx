import React from 'react';

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

export default AboutUs;