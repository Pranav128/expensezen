import React from 'react';

const SettingsPage = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">General Settings</h2>
        {/* Placeholder for settings options */}
        <p>Account preferences, notifications, etc.</p>

        <h2 className="text-xl font-semibold mt-6 mb-4">Security Settings</h2>
        {/* Placeholder for security options */}
        <p>Password change, two-factor authentication, etc.</p>
      </div>
    </div>
  );
};

export default SettingsPage;