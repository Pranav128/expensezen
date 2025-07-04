import React from 'react';

const TermsOfServicePage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <div className="prose max-w-none">
        <p>
          Welcome to [Your App Name]. These Terms of Service outline the rules and regulations for the use of [Your Company Name]'s Website, located at [Your Website Address].
        </p>
        <p>
          By accessing this website we assume you accept these terms and conditions. Do not continue to use [Your App Name] if you do not agree to take all of the terms and conditions stated on this page.
        </p>
        <h2>License</h2>
        <p>
          Unless otherwise stated, [Your Company Name] and/or its licensors own the intellectual property rights for all material on [Your App Name]. All intellectual property rights are reserved. You may access this from [Your App Name] for your own personal use subjected to restrictions set in these terms and conditions.
        </p>
        <p>You must not:</p>
        <ul>
          <li>Republish material from [Your App Name]</li>
          <li>Sell, rent or sub-license material from [Your App Name]</li>
          <li>Reproduce, duplicate or copy material from [Your App Name]</li>
          <li>Redistribute content from [Your App Name]</li>
        </ul>
        <h2>Disclaimer</h2>
        <p>
          To the maximum extent permitted by applicable law, we exclude all representations, warranties and conditions relating to our website and the use of this website. Nothing in this disclaimer will:
        </p>
        <ul>
          <li>limit or exclude our or your liability for death or personal injury;</li>
          <li>limit or exclude our or your liability for fraud or fraudulent misrepresentation;</li>
          <li>limit any of our or your liabilities in any way that is not permitted under applicable law; or</li>
          <li>exclude any of our or your liabilities that may not be excluded under applicable law.</li>
        </ul>
        <p>
          The limitations and prohibitions of liability set in this Section and elsewhere in this disclaimer: (a) are subject to the preceding paragraph; and (b) govern all liabilities arising under the disclaimer, including liabilities arising in contract, in tort and for breach of statutory duty.
        </p>
        <p>
          As long as the website and the information and services on the website are provided free of charge, we will not be liable for any loss or damage of any nature.
        </p>
        {/* Add more terms of service content here */}
      </div>
    </div>
  );
};

export default TermsOfServicePage;