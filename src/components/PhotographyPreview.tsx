import React from 'react';
import { Camera } from 'lucide-react';

export const PhotographyPreview: React.FC = () => {
  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Camera className="w-7 h-7 sm:w-8 sm:h-8 text-primary-600" />
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Photography</h2>
      </div>
      <div className="grid grid-cols-2 gap-4 max-w-2xl">
        <div className="aspect-square overflow-hidden rounded-lg shadow-md">
          <img 
            src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800"
            alt="Photography sample"
            className="w-full h-full object-cover hover:scale-105 transition duration-300"
          />
        </div>
        <div className="aspect-square overflow-hidden rounded-lg shadow-md">
          <img 
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800"
            alt="Photography sample"
            className="w-full h-full object-cover hover:scale-105 transition duration-300"
          />
        </div>
      </div>
    </div>
  );
};