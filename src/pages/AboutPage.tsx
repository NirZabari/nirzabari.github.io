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
      <main className="min-h-screen bg-background-light dark:bg-background-dark">
        <div className="mx-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl mb-4">
              {aboutContent.title}
            </h1>
            <p className="max-w-2xl text-lg font-light leading-relaxed text-gray-800 dark:text-gray-300">
              {aboutContent.introduction}
            </p>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Interests
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {aboutContent.hobbies.map((hobby) => {
                const Icon = iconMap[hobby.icon as keyof typeof iconMap];
                return (
                  <div
                    key={hobby.title}
                    className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-white/5 overflow-hidden"
                  >
                    <div className="p-5">
                      <div className="flex items-center gap-4">
                        <div className="p-2.5 rounded-md bg-primary-100 dark:bg-primary-900/30 shrink-0">
                          <Icon className="w-5 h-5 text-primary-700 dark:text-primary-400" />
                        </div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {hobby.title}
                        </div>
                      </div>
                      <div className="mt-3 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                        {hobby.description}
                      </div>
                    </div>

                    <div className="aspect-video w-full overflow-hidden bg-white/50 dark:bg-white/5 border-t border-gray-200 dark:border-gray-800">
                      <img
                        src={hobby.image}
                        alt={`${hobby.title} hobby`}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
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
