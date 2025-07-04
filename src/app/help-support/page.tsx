'use client';

import React from 'react';

const HelpSupportPage: React.FC = () => {
  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle form submission logic here
    console.log('Support request submitted');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Help and Support</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions (FAQs)</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-medium">How do I add an expense?</h3>
            <p className="text-gray-700">Navigate to the Dashboard and use the "Add New Expense" form.</p>
          </div>
          <div>
            <h3 className="text-xl font-medium">Can I categorize my expenses?</h3>
            <p className="text-gray-700">Yes, you can select a category when adding or editing an expense.</p>
          </div>
          <div>
            <h3 className="text-xl font-medium">How can I view my expense history?</h3>
            <p className="text-gray-700">The Dashboard displays a list of your recent expenses. You can use filters to view specific periods or categories.</p>
          </div>
          {/* Add more FAQs as needed */}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Support Resources</h2>
        <p className="text-gray-700">If you can't find the answer to your question in the FAQs, please use the form below to contact our support team.</p>
        {/* Add links to documentation or other resources here if available */}
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Submit a Support Request</h2>
        <form onSubmit={handleFormSubmit} className="space-y-4 max-w-md">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
            <textarea
              id="message"
              name="message"
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              required
            ></textarea>
          </div>
          <div>
            <button
              type="submit"
              className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Submit Request
            </button>
          </div>
        </form>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Our Location</h2>
        <p className="text-gray-700 mb-2">Pune, Maharashtra, India</p>
        <a
          href="https://www.google.com/maps/search/?api=1&query=Pune,+Maharashtra,+India"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          View on Google Maps
        </a>
      </section>
    </div>
  );
};

export default HelpSupportPage;