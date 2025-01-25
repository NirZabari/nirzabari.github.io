import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, BookOpen, User } from 'lucide-react';

const photos = [
  "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1500964757637-c85e8a162699?auto=format&fit=crop&q=80&w=800"
];

export const Photography: React.FC = () => {
  return (
    <section id="photography" className="relative py-16 sm:py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-4 mb-8 sm:mb-12">
          <Camera className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" />
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Photography</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {photos.map((url, index) => (
            <div key={index} className="aspect-square overflow-hidden rounded-lg shadow-md">
              <img 
                src={url} 
                alt="Photography sample" 
                className="w-full h-full object-cover hover:scale-105 transition duration-300"
              />
            </div>
          ))}
        </div>
        <div className="mt-8 grid sm:grid-cols-2 gap-4">
          <Link 
            to="/photography" 
            className="group bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
            aria-label="View my complete photography portfolio"
          >
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              View Full Portfolio
            </h3>
            <p className="text-gray-600 mt-2">Explore my complete collection of photographs and visual stories.</p>
          </Link>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Related Links</h3>
            <div className="space-y-3">
              <Link 
                to="/research" 
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                aria-label="Learn about my research work"
              >
                <BookOpen className="w-5 h-5" />
                <span>Research in Computer Vision</span>
              </Link>
              <Link 
                to="/personal" 
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                aria-label="Learn more about my background and interests"
              >
                <User className="w-5 h-5" />
                <span>About Me & Interests</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 w-full h-1 bg-white" />
    </section>
  );
}