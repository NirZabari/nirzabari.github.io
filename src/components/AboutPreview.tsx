import React from 'react';

export const AboutPreview: React.FC = () => {
  return (
    <div>
      <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-8">About Me</h2>
      <div className="prose prose-lg max-w-2xl">
        <p className="text-gray-600 leading-relaxed">
          Researcher at Lightricks, focusing on generative models and their applications in creative tools.
          M.Sc. graduate in Computer Science from the Hebrew University of Jerusalem.
        </p>
      </div>
    </div>
  );
};