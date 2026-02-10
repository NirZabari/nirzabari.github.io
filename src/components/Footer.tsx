import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-background-dark py-10">
      <div className="container mx-auto px-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          © {new Date().getFullYear()} Nir Zabari. All rights reserved.
        </p>
      </div>
    </footer>
  );
};