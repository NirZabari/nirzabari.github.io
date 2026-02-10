import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, Camera, BookOpen, User } from 'lucide-react';
import { PageTransition } from '../components/PageTransition';
import { motion, useAnimationControls } from 'framer-motion';

const links = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/research', icon: BookOpen, label: 'Research' },
  { to: '/photography', icon: Camera, label: 'Photography' },
  { to: '/personal', icon: User, label: 'Personal' }
];

const glitchVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.1,
      yoyo: Infinity,
      repeatDelay: 0.05
    }
  }
};

const secretMessages = [
  "Did you know? The first computer bug was an actual bug!",
  "You've found a glitch in the matrix!",
  "Congratulations! You're the 404th visitor today!",
  "Plot twist: This page exists in another dimension.",
  "Fun fact: This is actually page 200 + 204."
];

export const NotFoundPage: React.FC = () => {
  const [isGlitching, setIsGlitching] = useState(false);
  const [secretMessage, setSecretMessage] = useState('');
  const controls = useAnimationControls();
  
  const handleGlitch = async () => {
    if (isGlitching) return;
    
    setIsGlitching(true);
    const randomMessage = secretMessages[Math.floor(Math.random() * secretMessages.length)];
    setSecretMessage(randomMessage);

    // Create glitch effect
    for (let i = 0; i < 3; i++) {
      await controls.start({
        x: [0, -2, 2, -2, 2, 0],
        y: [0, 2, -2, 2, -2, 0],
        color: ['#3B82F6', '#EF4444', '#10B981', '#3B82F6'],
        transition: { duration: 0.2 }
      });
    }

    await controls.start({
      scale: [1, 1.05, 0.95, 1],
      transition: { duration: 0.3 }
    });

    setIsGlitching(false);
  };

  return (
    <PageTransition>
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
        <div className="max-w-2xl w-full text-center">
          <motion.div
            animate={controls}
            onClick={handleGlitch}
            className="cursor-pointer relative"
          >
            <motion.h1 
              className="text-9xl font-bold text-primary-600 mb-4 relative z-10"
              variants={glitchVariants}
              whileHover="visible"
            >
              404
              {isGlitching && (
                <>
                  <motion.span 
                    className="absolute inset-0 text-red-500 opacity-70"
                    style={{ clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)', left: '2px' }}
                  >
                    404
                  </motion.span>
                  <motion.span 
                    className="absolute inset-0 text-green-500 opacity-70"
                    style={{ clipPath: 'polygon(0 45%, 100% 45%, 100% 100%, 0 100%)', left: '-2px' }}
                  >
                    404
                  </motion.span>
                </>
              )}
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ 
                opacity: secretMessage ? 1 : 0,
                y: secretMessage ? 0 : 10
              }}
              className="absolute w-full text-sm text-primary-600 font-medium"
            >
              {secretMessage}
            </motion.p>
          </motion.div>

          <h2 className="text-3xl font-semibold text-gray-900 mb-4 mt-8">Page Not Found</h2>
          <p className="text-gray-600 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {links.map(({ to, icon: Icon, label }) => (
              <Link
                key={to}
                to={to}
                className="flex flex-col items-center gap-2 p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-300 group"
              >
                <Icon className="w-6 h-6 text-gray-400 group-hover:text-primary-600 transition-colors" />
                <span className="text-sm font-medium text-gray-600 group-hover:text-primary-600 transition-colors">
                  {label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </PageTransition>
  );
};