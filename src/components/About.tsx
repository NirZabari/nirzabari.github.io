import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, BookOpen } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <section id="about" className="relative py-16 sm:py-20 bg-white dark:bg-background-dark">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-8 sm:mb-12 text-gray-900 dark:text-white">About Me</h2>
        <div className="max-w-3xl space-y-4 sm:space-y-6">
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            Hi! I'm a researcher at{' '}
            <Link to="/research" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium" aria-label="Learn more about my research">
              Lightricks, focusing on generative models
            </Link>
            . Previously, I worked as a data scientist at Microsoft, where I focused on visual similarity models,
            and as an algorithm developer at Mobileye.
          </p>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            I'm an M.Sc. graduate in Computer Science from the Hebrew University of Jerusalem (cum laude).
            During my studies, I focused on improving the assessment of embryo implantation potential
            and open vocabulary semantic segmentation.
          </p>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            I'm primarily interested in computer vision and machine learning,
            and especially in their creative and unique applications. Check out my{' '}
            <Link to="/photography" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium" aria-label="View my photography work">
              photography work
            </Link>{' '}
            to see how I apply these interests creatively.
          </p>
        </div>
        <div className="mt-8 grid sm:grid-cols-2 gap-4 max-w-2xl">
          <Link 
            to="/research" 
            className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Explore my research work"
          >
            <BookOpen className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Research Work</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Explore my publications and current research</p>
            </div>
          </Link>
          <Link 
            to="/photography" 
            className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="View my photography portfolio"
          >
            <Camera className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Photography</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">View my photography portfolio</p>
            </div>
          </Link>
        </div>
      </div>
      <div className="absolute bottom-0 w-full h-1 bg-gray-900 dark:bg-gray-950" />
    </section>
  );
};