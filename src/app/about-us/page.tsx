import React from 'react';

const AboutUsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">About Us</h1>
      <div className="prose max-w-none">
        <p>
          Welcome to [Your App Name]! We are dedicated to providing you with a simple and effective way to manage your expenses.
        </p>
        <p>
          Our mission is to empower individuals to take control of their finances by offering intuitive tools for tracking, categorizing, and analyzing spending. We believe that understanding where your money goes is the first step towards achieving financial goals.
        </p>
        <p>
          [Optional: Add more details about your team, history, or specific features.]
        </p>
        <p>
          Thank you for using [Your App Name]!
        </p>
      </div>
    </div>
  );
};

export default AboutUsPage;