import React from 'react';
import { BookOpen } from 'lucide-react';

export const ResearchPreview: React.FC = () => {
  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <BookOpen className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" />
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Research</h2>
      </div>
      <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
        <p className="text-gray-600 leading-relaxed max-w-2xl">
          Currently focusing on generative models at Lightricks, with previous work in visual similarity
          models at Microsoft and algorithm development at Mobileye.
        </p>
      </div>
    </div>
  );
};