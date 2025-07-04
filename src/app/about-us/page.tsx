import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AboutUsPage: React.FC = () => {
  const appInfoCards = [
    {
      title: 'Easy Expense Tracking',
      description: 'Effortlessly record your spending with a simple and intuitive interface.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      )
    },
    {
      title: 'Smart Categorization',
      description: 'Organize your expenses with intelligent categories and custom tagging.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
      )
    },
    {
      title: 'Insightful Reports',
      description: 'Gain valuable insights into your spending habits with detailed reports and visualizations.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      title: 'Goal Setting',
      description: 'Set financial goals and track your progress towards achieving them.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: 'Data Security',
      description: 'Your financial data is kept safe and secure with robust security measures.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      )
    },
    {
      title: 'Anywhere Access',
      description: 'Access your expense data anytime, anywhere, from any device.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-4 sm:px-6 lg:px-8">
      {/* Hero Section with Animation */}
      <div className="w-full max-w-6xl mx-auto text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6">
          <span className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            About ExpenseZen
          </span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Your <span className="font-semibold text-indigo-600">Partner</span> in Financial Tracking and{' '}
          <span className="font-semibold text-purple-600">Smart Money Management</span>
        </p>
      </div>

      {/* App Information Cards with Enhanced Styling */}
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {appInfoCards.map((card, index) => (
          <div 
            key={index}
            className="transform transition-all duration-500 hover:scale-105 hover:-translate-y-2"
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <Card className="h-full bg-white rounded-xl shadow-md overflow-hidden border-0 group">
              <div className="p-1 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <CardHeader className="flex flex-row items-start space-x-4 pb-3">
                <div className="p-2 bg-indigo-50 rounded-lg">
                  {card.icon}
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-gray-800 group-hover:text-indigo-600 transition-colors duration-300">
                    {card.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                  {card.description}
                </p>
              </CardContent>
              <div className="px-6 pb-4 mt-2">
                <span className="inline-block text-sm font-medium text-indigo-600 group-hover:text-indigo-800 transition-colors duration-300">
                  Learn more →
                </span>
              </div>
            </Card>
          </div>
        ))}
      </div>

      {/* Mission Statement Section */}
      <div className="w-full max-w-4xl mx-auto mt-20">
        <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10 relative overflow-hidden">
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-indigo-100 rounded-full opacity-20"></div>
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-purple-100 rounded-full opacity-20"></div>
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
              Our <span className="text-indigo-600">Mission</span>
            </h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              At ExpenseZen, we believe financial peace of mind should be accessible to everyone. 
              We're dedicated to creating tools that transform complex financial data into clear, 
              actionable insights.
            </p>
            <div className="bg-indigo-50 p-6 rounded-lg border-l-4 border-indigo-500">
              <p className="font-medium text-indigo-700">
                "We're not just building an expense tracker - we're building a financial wellness platform 
                that helps people make better decisions with their money."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section (Optional) */}
      <div className="w-full max-w-6xl mx-auto mt-20">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-12">
          Meet the <span className="text-indigo-600">Team</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { name: "Alex Johnson", role: "Founder & CEO", image: "https://randomuser.me/api/portraits/men/32.jpg" },
            { name: "Sarah Williams", role: "Lead Developer", image: "https://randomuser.me/api/portraits/women/44.jpg" },
            { name: "Michael Chen", role: "Product Designer", image: "https://randomuser.me/api/portraits/men/22.jpg" },
            { name: "Emma Davis", role: "Customer Success", image: "https://randomuser.me/api/portraits/women/68.jpg" },
          ].map((person, index) => (
            <div key={index} className="text-center group">
              <div className="relative inline-block mb-4 overflow-hidden rounded-full w-40 h-40 border-4 border-white shadow-lg group-hover:border-indigo-300 transition-all duration-300">
                <img 
                  src={person.image} 
                  alt={person.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <h3 className="text-xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors duration-300">
                {person.name}
              </h3>
              <p className="text-gray-600">{person.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;