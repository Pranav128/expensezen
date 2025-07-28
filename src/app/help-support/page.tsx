'use client';

import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { FaQuestionCircle, FaLifeRing, FaPaperPlane, FaMapMarkerAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

const HelpSupportPage: React.FC = () => {
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

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
          message: 'Thank you for your message! Our team will get back to you soon.',
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

  const faqs = [
    {
      question: 'How do I add an expense?',
      answer: 'Navigate to the Dashboard and use the "Add New Expense" form.',
      icon: <FaQuestionCircle className="text-blue-500" />
    },
    {
      question: 'Can I categorize my expenses?',
      answer: 'Yes, you can select a category when adding or editing an expense.',
      icon: <FaQuestionCircle className="text-purple-500" />
    },
    {
      question: 'How can I view my expense history?',
      answer: 'The Dashboard displays a list of your recent expenses. You can use filters to view specific periods or categories.',
      icon: <FaQuestionCircle className="text-green-500" />
    },
    {
      question: 'Is my financial data secure?',
      answer: 'Yes, we take data security seriously and employ robust measures to protect your information.',
      icon: <FaQuestionCircle className="text-yellow-500" />
    },
    {
      question: 'Can I export my expense data?',
      answer: 'This feature is available on the Dashboard. Look for the export option there.',
      icon: <FaQuestionCircle className="text-red-500" />
    },
  ];

  const supportResources = [
    {
      title: 'User Guide',
      description: 'Comprehensive documentation for all features',
      link: '#',
      icon: <FaLifeRing className="h-6 w-6 text-blue-600" />
    },
    {
      title: 'Video Tutorials',
      description: 'Step-by-step video guides',
      link: '#',
      icon: <FaLifeRing className="h-6 w-6 text-purple-600" />
    },
    {
      title: 'Community Forum',
      description: 'Get help from other users',
      link: '#',
      icon: <FaLifeRing className="h-6 w-6 text-green-600" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Help & Support
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find answers to your questions or contact our support team for assistance.
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - FAQs */}
          <div className="lg:col-span-2 space-y-8">
            {/* FAQs Section */}
            <motion.section 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <div className="p-6 sm:p-8">
                <div className="flex items-center mb-6">
                  <div className="bg-blue-100 p-3 rounded-lg mr-4">
                    <FaQuestionCircle className="h-6 w-6 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Frequently Asked Questions</h2>
                </div>
                
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem 
                      key={index} 
                      value={`item-${index}`}
                      className="border-b border-gray-200 last:border-b-0"
                    >
                      <AccordionTrigger className="py-4 hover:no-underline group">
                        <div className="flex items-center">
                          <div className="mr-3">
                            {faq.icon}
                          </div>
                          <span className="text-left font-medium text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                            {faq.question}
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-4 pl-10 text-gray-600">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </motion.section>

            {/* Support Resources */}
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <div className="p-6 sm:p-8">
                <div className="flex items-center mb-6">
                  <div className="bg-purple-100 p-3 rounded-lg mr-4">
                    <FaLifeRing className="h-6 w-6 text-purple-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Support Resources</h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {supportResources.map((resource, index) => (
                    <motion.a
                      key={index}
                      whileHover={{ y: -5 }}
                      href={resource.link}
                      className="bg-gray-50 hover:bg-gray-100 rounded-lg p-4 transition-all duration-300 border border-gray-200"
                    >
                      <div className="flex items-center mb-3">
                        <div className="mr-3">
                          {resource.icon}
                        </div>
                        <h3 className="font-semibold text-gray-800">{resource.title}</h3>
                      </div>
                      <p className="text-sm text-gray-600">{resource.description}</p>
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.section>
          </div>

          {/* Right Column - Contact Form */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="bg-white rounded-xl shadow-md overflow-hidden h-fit sticky top-8"
          >
            <div className="p-6 sm:p-8">
              <div className="flex items-center mb-6">
                <div className="bg-indigo-100 p-3 rounded-lg mr-4">
                  <FaPaperPlane className="h-6 w-6 text-indigo-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Contact Support</h2>
              </div>
              
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name" className="block mb-2">Name</Label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="block mb-2">Email</Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="message" className="block mb-2">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full"
                    required
                  />
                </div>
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
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:from-blue-700 hover:to-indigo-700'}`}
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
                    'Submit Request'
                  )}
                </Button>
              </form>
            </div>
          </motion.div>
        </div>

        {/* Location Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-16 bg-white rounded-xl shadow-md overflow-hidden"
        >
          <div className="p-6 sm:p-8">
            <div className="flex items-center mb-6">
              <div className="bg-green-100 p-3 rounded-lg mr-4">
                <FaMapMarkerAlt className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Our Location</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Pune Office</h3>
                <p className="text-gray-600 mb-4">
                  Tech Park One, Floor 8<br />
                  Hinjewadi Phase 2<br />
                  Pune, Maharashtra 411057<br />
                  India
                </p>
                <a
                  href="tel:+912044556677"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  +91 20 4455 6677
                </a>
              </div>
              
              <div className="rounded-lg overflow-hidden border border-gray-200">
                <iframe
                  title="Office Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.265588856342!2d73.73616731522137!3d18.562061287384868!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bf2e67461101%3A0x828d43bf9d9ee343!2sPune%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1625060000000!5m2!1sen!2sin"
                  width="100%"
                  height="250"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default HelpSupportPage;