import React from "react";
import { PageTransition } from "../components/PageTransition";
import { Camera, Crown, Bike, Snowflake, Cat } from "lucide-react";
import { aboutContent } from "../content/about";

const iconMap = {
  camera: Camera,
  crown: Crown,
  bike: Bike,
  snowflake: Snowflake,
  cat: Cat,
} as const;

export const AboutPage: React.FC = () => {
  return (
    <PageTransition>
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-background-dark dark:to-background-dark">
        <div className="mx-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl mb-4">
              {aboutContent.title}
            </h1>
            <p className="max-w-prose text-lg font-light leading-relaxed text-gray-800 dark:text-gray-300">
              {aboutContent.introduction}
            </p>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {aboutContent.hobbies.map((hobby, index) => {
                const Icon = iconMap[hobby.icon as keyof typeof iconMap];
                return (
                  <div
                    key={index}
                    className="bg-white dark:bg-surface-dark rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800 flex flex-col"
                  >
                    <div className="p-6 flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-lg bg-primary-100 dark:bg-primary-900/30">
                          <Icon className="w-6 h-6 text-primary-700 dark:text-primary-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                          {hobby.title}
                        </h3>
                      </div>
                      <p className="text-gray-800 dark:text-gray-300 leading-relaxed">
                        {hobby.description}
                      </p>
                    </div>
                    <div className="aspect-[4/3] w-full overflow-hidden">
                      <img
                        src={hobby.image}
                        alt={`${hobby.title} hobby`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </PageTransition>
  );
};
