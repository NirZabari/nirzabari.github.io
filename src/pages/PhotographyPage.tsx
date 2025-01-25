import React, { useState, useMemo } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { PageTransition } from "../components/PageTransition";
import { motion, AnimatePresence } from "framer-motion";
import { getPhotos, Photo, photographyContent } from "../content/photography";

// You can change this seed to get different photo orders
// const PHOTO_SEED = 6333333;
const PHOTO_SEED = 11111111;

const PhotoGrid: React.FC<{
  photos: Photo[];
  onPhotoClick: (index: number) => void;
}> = ({ photos, onPhotoClick }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-[1px] bg-black">
      {photos.map((photo, index) => (
        <motion.div
          key={photo.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className="relative aspect-square bg-white dark:bg-gray-900 overflow-hidden group cursor-pointer"
          onClick={() => onPhotoClick(index)}
        >
          <img
            src={photo.url}
            alt={photo.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 border border-black pointer-events-none" />
        </motion.div>
      ))}
    </div>
  );
};

interface LightboxProps {
  photos: Photo[];
  currentIndex: number;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

const Lightbox: React.FC<LightboxProps> = ({
  photos,
  currentIndex,
  onClose,
  onPrevious,
  onNext,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      onNext();
    }
    if (isRightSwipe) {
      onPrevious();
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-50 p-2 rounded-full bg-white/10 text-white/90 backdrop-blur-sm transition-colors hover:bg-white/20"
          aria-label="Close lightbox"
        >
          <X className="w-6 h-6" />
        </button>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative w-full h-full flex items-center justify-center"
          >
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-white/20 border-t-white/80 rounded-full animate-spin" />
              </div>
            )}
            <img
              src={photos[currentIndex].url}
              alt={photos[currentIndex].title}
              className="max-h-[90vh] max-w-[90vw] object-contain"
              onLoad={handleImageLoad}
            />
          </motion.div>
        </AnimatePresence>

        <button
          onClick={onPrevious}
          className="absolute left-4 p-2 rounded-full bg-white/10 text-white/90 backdrop-blur-sm transition-colors hover:bg-white/20"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={onNext}
          className="absolute right-4 p-2 rounded-full bg-white/10 text-white/90 backdrop-blur-sm transition-colors hover:bg-white/20"
          aria-label="Next image"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </motion.div>
  );
};

export const PhotographyPage: React.FC = () => {
  const photos = useMemo(() => getPhotos(PHOTO_SEED), []);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handlePrevious = () => {
    setSelectedIndex((current) =>
      current !== null ? (current - 1 + photos.length) % photos.length : null
    );
  };

  const handleNext = () => {
    setSelectedIndex((current) =>
      current !== null ? (current + 1) % photos.length : null
    );
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (selectedIndex === null) return;

    switch (e.key) {
      case "ArrowLeft":
        handlePrevious();
        break;
      case "ArrowRight":
        handleNext();
        break;
      case "Escape":
        setSelectedIndex(null);
        break;
    }
  };

  React.useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex]);

  return (
    <PageTransition>
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-background-dark dark:to-background-dark">
        <div className="mx-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl mb-4">
              {photographyContent.title}
            </h1>
            <p className="max-w-prose text-lg font-light leading-relaxed text-gray-800 dark:text-gray-300">
              {photographyContent.description}
            </p>
          </div>

          <div className="max-w-[2000px] mx-auto">
            <PhotoGrid photos={photos} onPhotoClick={setSelectedIndex} />
          </div>
        </div>

        <AnimatePresence>
          {selectedIndex !== null && (
            <Lightbox
              photos={photos}
              currentIndex={selectedIndex}
              onClose={() => setSelectedIndex(null)}
              onPrevious={handlePrevious}
              onNext={handleNext}
            />
          )}
        </AnimatePresence>
      </main>
    </PageTransition>
  );
};
