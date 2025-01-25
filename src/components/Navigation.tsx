import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface NavigationProps {
  isScrolled?: boolean;
}

const navLinks = [
  { name: 'Research', path: '/research' },
  { name: 'Photography', path: '/photography' },
  { name: 'Personal', path: '/personal' },
];

const NavLinks: React.FC<{ onClick?: () => void }> = ({ onClick }) => {
  const location = useLocation();

  return (
    <>
      {navLinks.map((item) => (
        <Link
          key={item.name}
          to={item.path}
          onClick={onClick}
          className="relative group px-3 py-2 select-none"
        >
          <span
            className={`relative z-10 font-medium transition-colors duration-300 ${
              location.pathname === item.path
                ? 'text-primary-600 dark:text-primary-400'
                : 'text-gray-700 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400'
            }`}
          >
            {item.name}
          </span>
          <div className="absolute inset-0 bg-primary-50 dark:bg-primary-900/30 rounded-lg scale-0 transition-transform duration-300 origin-center group-hover:scale-100" />
          <div
            className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-primary-600 dark:bg-primary-400 transition-all duration-300 ${
              location.pathname === item.path ? 'w-full' : 'w-0'
            }`}
          />
        </Link>
      ))}
    </>
  );
};

export const Navigation: React.FC<NavigationProps> = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav className="w-full bg-white/90 dark:bg-background-dark/90 backdrop-blur-md shadow-lg dark:shadow-gray-900/50 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 max-w-[2000px]">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="relative group select-none shrink-0">
              <span className="font-bold text-xl text-gray-900 dark:text-white transition-colors duration-300 group-hover:text-primary-700 dark:group-hover:text-primary-400">
                Nir Zabari
              </span>
              <div
                className={`absolute -bottom-1 left-0 h-0.5 bg-primary-700 dark:bg-primary-400 transition-all duration-300 ${
                  location.pathname === '/' ? 'w-full' : 'w-0'
                }`}
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <NavLinks />
              <div
                className="w-px h-6 bg-gray-200 dark:bg-gray-700"
                aria-hidden="true"
              />
              <ThemeToggle />
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-4">
              <ThemeToggle />
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="relative p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 group select-none"
                aria-label="Toggle menu"
              >
                <div className="relative z-10">
                  {isMenuOpen ? (
                    <X className="w-6 h-6 text-gray-900 dark:text-white group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors" />
                  ) : (
                    <Menu className="w-6 h-6 text-gray-900 dark:text-white group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors" />
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white/95 dark:bg-background-dark/95 backdrop-blur-sm shadow-lg dark:shadow-gray-900/30 border-t border-gray-200 dark:border-gray-800">
            <div className="container mx-auto px-4 sm:px-6 py-4">
              <div className="flex flex-col gap-2">
                <NavLinks onClick={() => setIsMenuOpen(false)} />
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
