import React from 'react';
import { ArrowLeft, Shield, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-brand-dark p-8 text-white">
          <Link to="/" className="inline-flex items-center text-blue-200 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
          </Link>
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-brand-green" />
            <h1 className="text-3xl font-bold font-heading">Privacy Policy</h1>
          </div>
          <p className="mt-2 text-blue-100 opacity-80">
            How we collect, use, and protect your data.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-8 md:p-12 text-gray-700 space-y-8 leading-relaxed text-sm">
          
          <div className="border-b border-gray-100 pb-6 mb-6">
            <h2 className="text-2xl font-bold text-brand-dark mb-2">OPTIIFREIGHT PRIVACY POLICY</h2>
            <p className="text-gray-500"><strong>Last Updated:</strong> December 24, 2024</p>
            <p className="text-gray-500"><strong>Effective Date:</strong> January 1, 2025</p>
          </div>

          {/* SECTION 1 */}
          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide border-b pb-2">1. INTRODUCTION AND SCOPE</h3>
            
            <h4 className="font-bold text-gray-800 mt-4">1.1 Commitment to Privacy</h4>
            <p>OptiiFreight, Inc. ("OptiiFreight," "we," "us," or "our") respects your privacy and is committed to protecting the personal information we collect, use, and disclose. This Privacy Policy ("Policy") describes how we collect, use, process, disclose, and safeguard personal information obtained through our website (www.optiifreight.com), mobile applications, platforms, and related services (collectively, the "Services"). This Policy applies to all Users, including Shippers, Carriers, drivers, visitors, and any other individuals who interact with our Services.</p>

            <h4 className="font-bold text-gray-800 mt-4">1.2 Comprehensive Coverage</h4>
            <p>This Policy covers:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Personal information we collect directly from you</li>
                <li>Information we collect automatically through your use of our Services</li>
                <li>Information we collect from third parties</li>
                <li>How we use, share, and protect your information</li>
                <li>Your rights and choices regarding your personal information</li>
            </ul>
          </section>

          {/* SECTION 2 */}
          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide border-b pb-2">2. DEFINITIONS</h3>
            <div className="space-y-3 mt-4">
                <p><span className="font-bold">"Personal Information"</span> means any information that identifies, relates to, describes, is reasonably capable of being associated with, or could reasonably be linked, directly or indirectly, with a particular individual or household.</p>
                <p><span className="font-bold">"Sensitive Personal Information"</span> includes government identifiers (social security number, driver's license number), financial account information, precise geolocation, racial or ethnic origin, religious beliefs, health data, and biometric information.</p>
                <p><span className="font-bold">"Data Controller"</span> means the entity that determines the purposes and means of processing personal information.</p>
            </div>
          </section>

          {/* SECTION 3 */}
          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide border-b pb-2">3. INFORMATION WE COLLECT</h3>
            
            <h4 className="font-bold text-gray-800 mt-4">3.1 Information You Provide Directly</h4>
            <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong>Account Registration:</strong> Full legal name, business address, email, phone, tax ID (EIN/SSN).</li>
                <li><strong>Carrier-Specific:</strong> USDOT number, MC number, VINs, Driver CDL info, Insurance certificates.</li>
                <li><strong>Shipper-Specific:</strong> Commodity descriptions, shipping patterns, authorized representatives.</li>
                <li><strong>Financial:</strong> Bank account numbers, routing info, credit/debit card numbers.</li>
            </ul>

            <h4 className="font-bold text-gray-800 mt-4">3.2 Information Collected Automatically</h4>
            <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong>Technical:</strong> IP address, device identifiers, browser type, operating system.</li>
                <li><strong>Location:</strong> Precise GPS coordinates (with consent) for shipment tracking.</li>
                <li><strong>Usage:</strong> Pages visited, features used, session duration.</li>
            </ul>
          </section>

          {/* SECTION 4 */}
          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide border-b pb-2">4. HOW WE USE YOUR INFORMATION</h3>
            <h4 className="font-bold text-gray-800 mt-4">4.1 Service Delivery</h4>
            <p>We use your data to create accounts, facilitate freight matching, process payments, generate Bills of Lading, and verify regulatory compliance (FMCSA/DOT).</p>
            
            <h4 className="font-bold text-gray-800 mt-4">4.4 Legal Compliance</h4>
            <p>To comply with court orders, tax laws, and transportation regulations, and to prevent fraud and security threats.</p>
          </section>

          {/* SECTION 5 */}
          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide border-b pb-2">5. HOW WE SHARE YOUR INFORMATION</h3>
            <h4 className="font-bold text-gray-800 mt-4">5.1 Sharing with Other Users</h4>
            <p>We share contact info, shipment details, and location data between Shippers and Carriers to facilitate transactions.</p>
            
            <h4 className="font-bold text-gray-800 mt-4">5.2 Service Providers</h4>
            <p>We share data with payment processors (Stripe/PayPal), cloud hosts, and background check providers strictly for business operations.</p>
          </section>

          {/* SECTION 6 */}
          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide border-b pb-2">6. DATA SECURITY MEASURES</h3>
            <div className="flex items-start gap-3 bg-blue-50 p-4 rounded-lg my-4">
                <Lock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                <p className="text-blue-800 text-sm">
                    We employ AES-256 encryption for data at rest and TLS 1.2+ for data in transit. Access is restricted via role-based controls and multi-factor authentication.
                </p>
            </div>
            <p>We maintain comprehensive administrative, technical, and physical safeguards to protect your data from unauthorized access.</p>
          </section>

          {/* SECTION 7 */}
          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide border-b pb-2">7. DATA RETENTION</h3>
            <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong>Account Data:</strong> Retained while active + 7 years (inactive).</li>
                <li><strong>Transaction Records:</strong> 7 years for tax/legal compliance.</li>
                <li><strong>Safety Records:</strong> 10 years for regulatory compliance.</li>
            </ul>
          </section>

          {/* SECTION 8 */}
          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide border-b pb-2">8. YOUR RIGHTS AND CHOICES</h3>
            <p>Depending on your jurisdiction, you may have the right to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Access and receive a copy of your data.</li>
                <li>Correct inaccurate information.</li>
                <li>Request deletion (subject to legal retention requirements).</li>
                <li>Opt-out of marketing communications.</li>
            </ul>
          </section>

          {/* SECTION 11 (State Specific) */}
          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide border-b pb-2">11. STATE-SPECIFIC RIGHTS</h3>
            <h4 className="font-bold text-gray-800 mt-4">11.1 California (CCPA/CPRA)</h4>
            <p>California residents have the right to know categories of data collected, opt-out of sale/sharing, and limit use of sensitive personal information.</p>
          </section>

          {/* SECTION 15 */}
          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide border-b pb-2">15. CONTACT INFORMATION</h3>
            <div className="bg-gray-100 p-6 rounded-lg">
                <p className="font-bold mb-2">OptiiFreight Privacy Office</p>
                <p>Email: <a href="mailto:privacy@optiifreight.com" className="text-brand-orange hover:underline">privacy@optiifreight.com</a></p>
                <p>Address: 1200 Logistics Way, Suite 400, Los Angeles, CA 90012</p>
            </div>
          </section>

          <div className="pt-8 border-t border-gray-200 mt-8">
            <p className="text-xs text-gray-500 text-center">
                By using OptiiFreight's Services, you acknowledge that you have read and understood this Privacy Policy.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;