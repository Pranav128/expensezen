import React from 'react';

const TermsOfServicePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-500 hover:shadow-2xl">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2 animate-fade-in">Terms of Service</h1>
            <p className="opacity-90 text-indigo-100">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          {/* Content */}
          <div className="p-8 sm:p-10">
            <div className="prose prose-indigo max-w-none text-gray-600">
              <p className="mb-6 text-lg leading-relaxed transition-colors duration-300 hover:text-gray-900">
                Welcome to ExpenseZen. These Terms of Service outline the rules and regulations for the use of 
                ExpenseZen Inc.'s Website, located at expensezen.com.
              </p>
              
              <div className="mb-8 p-6 bg-gray-50 rounded-lg border-l-4 border-indigo-500 transition-all duration-300 hover:bg-white hover:shadow-md">
                <p className="font-medium text-gray-700">
                  By accessing this website we assume you accept these terms and conditions. Do not continue to use 
                  ExpenseZen if you do not agree to take all of the terms and conditions stated on this page.
                </p>
              </div>

              <section className="mb-10 group">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="w-4 h-4 bg-indigo-500 rounded-full mr-3 transition-all duration-300 group-hover:w-6"></span>
                  License
                </h2>
                <p className="mb-4 transition-colors duration-300 hover:text-gray-900">
                  Unless otherwise stated, ExpenseZen Inc. and/or its licensors own the intellectual property rights 
                  for all material on ExpenseZen. All intellectual property rights are reserved. You may access this 
                  from ExpenseZen for your own personal use subjected to restrictions set in these terms and conditions.
                </p>
                <p className="mb-3 font-medium text-gray-700">You must not:</p>
                <ul className="space-y-2 mb-6">
                  {['Republish material from ExpenseZen', 'Sell, rent or sub-license material from ExpenseZen', 
                    'Reproduce, duplicate or copy material from ExpenseZen', 'Redistribute content from ExpenseZen']
                    .map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="flex-shrink-0 w-5 h-5 mt-0.5 mr-2 text-indigo-500">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        </span>
                        <span className="transition-colors duration-300 hover:text-gray-900">{item}</span>
                      </li>
                    ))}
                </ul>
              </section>

              <section className="mb-10 group">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="w-4 h-4 bg-indigo-500 rounded-full mr-3 transition-all duration-300 group-hover:w-6"></span>
                  Disclaimer
                </h2>
                <p className="mb-4 transition-colors duration-300 hover:text-gray-900">
                  To the maximum extent permitted by applicable law, we exclude all representations, warranties and 
                  conditions relating to our website and the use of this website. Nothing in this disclaimer will:
                </p>
                <ul className="space-y-3 mb-6">
                  {[
                    "limit or exclude our or your liability for death or personal injury;",
                    "limit or exclude our or your liability for fraud or fraudulent misrepresentation;",
                    "limit any of our or your liabilities in any way that is not permitted under applicable law; or",
                    "exclude any of our or your liabilities that may not be excluded under applicable law."
                  ].map((item, index) => (
                    <li key={index} className="flex">
                      <span className="flex-shrink-0 w-5 h-5 mt-0.5 mr-2 text-indigo-500 animate-bounce" style={{ animationDelay: `${index * 0.1}s` }}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </span>
                      <span className="transition-colors duration-300 hover:text-gray-900">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="bg-indigo-50 p-6 rounded-lg transition-all duration-500 hover:bg-indigo-100">
                  <p className="mb-3 transition-colors duration-300 hover:text-gray-900">
                    The limitations and prohibitions of liability set in this Section and elsewhere in this disclaimer: 
                    (a) are subject to the preceding paragraph; and (b) govern all liabilities arising under the 
                    disclaimer, including liabilities arising in contract, in tort and for breach of statutory duty.
                  </p>
                  <p className="font-medium text-indigo-700 transition-colors duration-300 hover:text-indigo-900">
                    As long as the website and the information and services on the website are provided free of charge, 
                    we will not be liable for any loss or damage of any nature.
                  </p>
                </div>
              </section>

              {/* Additional sections can be added here with the same styling pattern */}
              
              <div className="mt-12 pt-6 border-t border-gray-200 text-center">
                <p className="text-gray-500 hover:text-indigo-600 transition-colors duration-300">
                  If you have any questions about these Terms, please contact us at 
                  <a href="mailto:legal@expensezen.com" className="font-medium ml-1">legal@expensezen.com</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;