import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Camera, User } from 'lucide-react';
import { researchContent } from '../content/research';

const iconMap = {
  camera: Camera,
  user: User,
} as const;

export const Research: React.FC = () => {
  return (
    <section id="research" className="relative py-16 sm:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-4 mb-8 sm:mb-12">
          <BookOpen className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" />
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            {researchContent.title}
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          <div className="bg-gray-50 p-5 sm:p-6 md:p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-gray-900">
              {researchContent.sections.currentWork.title}
            </h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              {researchContent.sections.currentWork.description}
            </p>
            <Link
              to={researchContent.sections.currentWork.link.href}
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
              aria-label={researchContent.sections.currentWork.link.ariaLabel}
            >
              {researchContent.sections.currentWork.link.text}
              <span className="ml-1">→</span>
            </Link>
          </div>
          <div className="bg-gray-50 p-5 sm:p-6 md:p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-gray-900">
              {researchContent.sections.relatedInterests.title}
            </h3>
            <div className="space-y-4">
              {researchContent.sections.relatedInterests.links.map((link) => {
                const Icon = iconMap[link.icon as keyof typeof iconMap];
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                    aria-label={link.ariaLabel}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{link.text}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 w-full h-1 bg-gray-50" />
    </section>
  );
};
