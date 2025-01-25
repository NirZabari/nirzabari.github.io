import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white py-8">
      <div className="container mx-auto px-6 text-center">
        <p>© {new Date().getFullYear()} Nir Zabari. All rights reserved.</p>
      </div>
    </footer>
  );
};