"use client";

import React from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa';
import { FiSend } from 'react-icons/fi';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitStatus, setSubmitStatus] = React.useState<{
    success?: boolean;
    message?: string;
  }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({});
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSubmitStatus({
          success: true,
          message: 'Thanks for your message! We\'ll get back to you soon.',
        });
        setFormData({ name: '', email: '', message: '' });
      } else {
        setSubmitStatus({
          success: false,
          message: data.error || 'Something went wrong. Please try again.',
        });
      }
    } catch (error) {
      setSubmitStatus({
        success: false,
        message: 'Failed to send message. Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header with animated gradient */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 animate-gradient-x">
            Get In Touch
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We'd love to hear from you! Reach out for questions, feedback, or just to say hello.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information Card */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-500 hover:scale-[1.02] hover:shadow-xl">
            <div className="p-8 sm:p-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact Information</h2>
              
              <div className="space-y-6">
                {/* Address */}
                <div className="flex items-start group">
                  <div className="flex-shrink-0 bg-blue-100 p-3 rounded-lg mr-4 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    <FaMapMarkerAlt className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 group-hover:text-blue-600 transition-colors duration-300">Our Office</h3>
                    <p className="text-gray-600 mt-1">
                      Tech Park One, Floor 8<br />
                      Hinjewadi Phase 2<br />
                      Pune, Maharashtra 411057<br />
                      India
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start group">
                  <div className="flex-shrink-0 bg-green-100 p-3 rounded-lg mr-4 text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors duration-300">
                    <FaPhone className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 group-hover:text-green-600 transition-colors duration-300">Phone</h3>
                    <p className="text-gray-600 mt-1">
                      <a href="tel:+912044556677" className="hover:text-green-600 transition-colors duration-300">
                        +91 20 4455 6677
                      </a><br />
                      <span className="text-sm text-gray-500">(Mon-Fri, 9am-6pm IST)</span>
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start group">
                  <div className="flex-shrink-0 bg-purple-100 p-3 rounded-lg mr-4 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                    <FaEnvelope className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 group-hover:text-purple-600 transition-colors duration-300">Email</h3>
                    <p className="text-gray-600 mt-1">
                      <a href="mailto:info@expensezen.com" className="hover:text-purple-600 transition-colors duration-300">
                        info@expensezen.com
                      </a><br />
                      <a href="mailto:support@expensezen.com" className="hover:text-purple-600 transition-colors duration-300">
                        support@expensezen.com
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              {/* Map Frame */}
              <div className="mt-8 rounded-lg overflow-hidden shadow-md border border-gray-200">
                <iframe
                  title="Office Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.265588856342!2d73.73616731522137!3d18.562061287384868!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bf2e67461101%3A0x828d43bf9d9ee343!2sPune%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1625060000000!5m2!1sen!2sin"
                  width="100%"
                  height="250"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  className="rounded-lg"
                ></iframe>
              </div>
            </div>
          </div>

          {/* Contact Form Card */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-500 hover:scale-[1.02] hover:shadow-xl">
            <div className="p-8 sm:p-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Send Us a Message</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="name">
                    Your Name
                  </label>
                  <div className="relative">
                    <input
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      id="name"
                      name="name"
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <FaEnvelope className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="message">
                    Your Message
                  </label>
                  <textarea
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    id="message"
                    name="message"
                    placeholder="How can we help you?"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <div className="flex flex-col space-y-4">
                  {submitStatus.message && (
                    <div className={`p-5 rounded-lg ${submitStatus.success ? 'bg-gradient-to-r from-green-50 to-teal-50 border-l-4 border-green-500' : 'bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500'} transition-all duration-500 animate-fadeIn`}>
                      <div className="flex items-center">
                        {submitStatus.success ? (
                          <svg className="h-6 w-6 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        ) : (
                          <svg className="h-6 w-6 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                        <div>
                          <h3 className={`font-semibold text-lg ${submitStatus.success ? 'text-green-800' : 'text-red-800'}`}>
                            {submitStatus.success ? 'Message Sent!' : 'Error'}
                          </h3>
                          <p className={`mt-1 text-sm ${submitStatus.success ? 'text-green-700' : 'text-red-700'}`}>
                            {submitStatus.message}
                          </p>
                          {submitStatus.success && (
                            <p className="mt-2 text-sm text-green-700">
                              We've also sent you a confirmation email. Please check your inbox.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:from-blue-700 hover:to-indigo-700'}`}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <FiSend className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Additional Contact Options */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Sales Inquiry",
              description: "Interested in our enterprise solutions?",
              contact: "sales@expensezen.com",
              icon: <FaPaperPlane className="h-8 w-8" />,
              color: "bg-blue-100 text-blue-600"
            },
            {
              title: "Technical Support",
              description: "Need help with our product?",
              contact: "support@expensezen.com",
              icon: <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>,
              color: "bg-green-100 text-green-600"
            },
            {
              title: "Careers",
              description: "Want to join our team?",
              contact: "careers@expensezen.com",
              icon: <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>,
              color: "bg-purple-100 text-purple-600"
            }
          ].map((item, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <div className={`${item.color} p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4`}>
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
              <p className="text-gray-600 mb-4">{item.description}</p>
              <a 
                href={`mailto:${item.contact}`} 
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-300"
              >
                {item.contact}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;