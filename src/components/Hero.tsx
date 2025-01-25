import React, { useState } from "react";
import { Github, Mail, GraduationCap, Linkedin, Twitter } from "lucide-react";
import { heroContent } from "../content/hero";

const iconMap = {
  email: Mail,
  github: Github,
  scholar: GraduationCap,
  twitter: Twitter,
  linkedin: Linkedin,
} as const;

const WavyText: React.FC<{ text: string }> = ({ text }) => {
  return (
    <span className="wavy-text inline-block">
      {text.split("").map((char, index) => (
        <span
          key={index}
          className="relative inline-block"
          style={{
            animation: `wave 0.5s ease-in-out ${index * 0.03}s`,
            animationFillMode: "both",
            marginRight: char === " " ? "0.3em" : "0.03em",
          }}
        >
          {char}
        </span>
      ))}
    </span>
  );
};

export const Hero: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [hasCompletedHoverCycle, setHasCompletedHoverCycle] = useState(false);

  const handleMouseEnter = () => {
    if (!hasCompletedHoverCycle) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (!hasCompletedHoverCycle) {
      setIsHovered(false);
      setHasCompletedHoverCycle(true);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-white dark:bg-[#0B1221] transition-colors duration-300">
      {/* Background gradients */}
      <div className="gradient-overlay" />

      {/* Content container */}
      <div className="container relative mx-auto min-h-screen flex items-center justify-center px-4 sm:px-6">
        <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-stretch justify-center gap-8 md:gap-16 pt-32">
          {/* Profile image */}
          <div className="relative flex-shrink-0 md:w-[400px]">
            <div className="sticky top-24">
              <div
                className="w-full aspect-square relative rounded-xl overflow-hidden border-4 border-white/10 shadow-xl"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div className="absolute inset-0 ring-1 ring-white/20 rounded-xl" />
                <img
                  src={heroContent.image.src}
                  alt={heroContent.image.alt}
                  className={`absolute w-full h-full object-cover transition-opacity duration-500 ${
                    isHovered ? "opacity-0" : "opacity-100"
                  }`}
                />
                <img
                  src={heroContent.image.src_hover}
                  alt={heroContent.image.alt}
                  className={`absolute w-full h-full object-cover transition-opacity duration-500 ${
                    isHovered ? "opacity-100" : "opacity-0"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Text content */}
          <div className="text-center md:text-left flex-grow max-w-2xl">
            <div className="space-y-2">
              <h1 className="relative inline-block text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-white">
                <WavyText text={heroContent.greeting} />
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-blue-100/90 font-light tracking-wide">
                {heroContent.title}
              </p>
            </div>
            <div className="text-gray-800 dark:text-gray-200 space-y-6 mt-4">
              {heroContent.description.map((paragraph, index) => (
                <p key={index} className="leading-[1.8] text-lg font-light">
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="flex flex-wrap gap-6 pt-8 pb-12 justify-center md:justify-start">
              {heroContent.socialLinks.map(({ type, href, label }) => {
                const Icon = iconMap[type as keyof typeof iconMap];
                return (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative hover-glow"
                    aria-label={label}
                  >
                    <div className="p-3 rounded-full bg-gray-100 dark:bg-white/5 backdrop-blur-sm transition-all duration-300 group-hover:bg-gray-200 dark:group-hover:bg-white/10">
                      <Icon className="w-6 h-6 text-gray-900 dark:text-white transition-colors duration-300 group-hover:text-primary-600 dark:group-hover:text-blue-200" />
                    </div>

                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-100 dark:bg-white/10 backdrop-blur-sm rounded text-sm text-gray-900 dark:text-white/90 whitespace-nowrap opacity-0 scale-95 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100">
                      {label}
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
