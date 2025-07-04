import React from 'react';

const PrivacyPolicyPage: React.FC = () => {
  const sections = [
    {
      title: 'Information We Collect',
      content: 'We collect information you provide directly, including personal details when you create an account, transaction data when you use our services, and usage information through cookies and similar technologies.',
      icon: '📊'
    },
    {
      title: 'How We Use Your Information',
      content: 'Your information helps us provide and improve our services, communicate with you, personalize your experience, ensure security, and comply with legal obligations.',
      icon: '🛠️'
    },
    {
      title: 'Data Security',
      content: 'We implement industry-standard security measures including encryption, access controls, and regular audits to protect your data from unauthorized access or disclosure.',
      icon: '🔒'
    },
    {
      title: 'Third-Party Services',
      content: 'We may use trusted third-party services for analytics, payment processing, and cloud storage. These partners are vetted for compliance with privacy standards.',
      icon: '🤝'
    },
    {
      title: 'Your Rights',
      content: 'You have rights to access, correct, or delete your personal data. You may also object to processing or request data portability where applicable by law.',
      icon: '👤'
    },
    {
      title: 'Policy Changes',
      content: 'We will notify users of significant changes through email or in-app notifications. Continued use after changes constitutes acceptance of the new policy.',
      icon: '🔄'
    },
    {
      title: 'Contact Us',
      content: 'For privacy concerns or requests, contact our Data Protection Officer at privacy@expensezen.com. We respond to all inquiries within 30 days.',
      icon: '📧'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header with animated gradient */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 animate-gradient-x">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Introduction card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-12 transition-all duration-500 hover:shadow-lg">
          <div className="p-8 sm:p-10">
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-indigo-100 p-3 rounded-lg mr-6">
                <span className="text-2xl">👋</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Privacy Matters</h2>
                <p className="text-gray-600 leading-relaxed">
                  At ExpenseZen, we're committed to protecting your personal information and being transparent about our data practices. This policy explains how we collect, use, and safeguard your data when you use our services.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Policy sections */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <div 
              key={index}
              className="group relative bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-1"
            >
              {/* Decorative gradient bar that appears on hover */}
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="p-8 sm:p-10">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-indigo-50 p-3 rounded-lg mr-6 transition-all duration-300 group-hover:bg-indigo-100 group-hover:scale-110">
                    <span className="text-2xl">{section.icon}</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 transition-colors duration-300 group-hover:text-indigo-600">
                      {section.title}
                    </h2>
                    <p className="text-gray-600 leading-relaxed transition-colors duration-300 group-hover:text-gray-700">
                      {section.content}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact card */}
        <div className="mt-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-xl overflow-hidden transform transition-all duration-500 hover:scale-[1.02]">
          <div className="p-8 sm:p-10 text-white">
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-white/20 p-3 rounded-lg mr-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">Have Questions?</h2>
                <p className="mb-6 opacity-90">
                  We're here to help you understand our privacy practices. Contact our privacy team with any questions or concerns.
                </p>
                <a 
                  href="mailto:privacy@expensezen.com" 
                  className="inline-flex items-center px-6 py-3 bg-white text-indigo-600 font-medium rounded-lg hover:bg-gray-100 transition-colors duration-300"
                >
                  Contact Privacy Team
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;