import React, { useState, useMemo } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { PageTransition } from "../components/PageTransition";
import { motion, AnimatePresence } from "framer-motion";
import { getPhotos, Photo, photographyContent } from "../content/photography";

// You can change this seed to get different photo orders
const PHOTO_SEED = 6333333;
// const PHOTO_SEED = 11111111;

// Cache aspect ratios in localStorage
const ASPECT_CACHE_KEY = 'photo-aspect-ratios';

const getAspectCache = (): Record<string, number> => {
  try {
    return JSON.parse(localStorage.getItem(ASPECT_CACHE_KEY) || '{}');
  } catch {
    return {};
  }
};

const setAspectCache = (cache: Record<string, number>) => {
  localStorage.setItem(ASPECT_CACHE_KEY, JSON.stringify(cache));
};

const PhotoGrid: React.FC<{
  photos: Photo[];
  onPhotoClick: (index: number) => void;
}> = ({ photos, onPhotoClick }) => {
  const [aspectRatios, setAspectRatios] =
    useState<Record<string, number>>(getAspectCache);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  const handleImageLoad = (photo: Photo, img: HTMLImageElement) => {
    const ratio = img.naturalWidth / img.naturalHeight;
    setAspectRatios((prev) => {
      const updated = { ...prev, [photo.id]: ratio };
      setAspectCache(updated);
      return updated;
    });
    setLoadedImages((prev) => new Set(prev).add(photo.id));
  };

  return (
    <div className="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-[1px] bg-black p-[1px]">
      {photos.map((photo, index) => {
        const aspectRatio = aspectRatios[photo.id] || 1;
        const isLoaded = loadedImages.has(photo.id);

        return (
          <div
            key={photo.id}
            className="relative overflow-hidden group cursor-pointer mb-[1px] bg-gray-900"
            style={{ aspectRatio: aspectRatio }}
            onClick={() => onPhotoClick(index)}
          >
            {/* Skeleton placeholder */}
            {!isLoaded && (
              <div className="absolute inset-0 bg-gray-800 animate-pulse" />
            )}
            <img
              src={photo.url}
              alt={photo.title}
              loading={index < 20 ? 'eager' : 'lazy'}
              decoding="async"
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                isLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={(e) => handleImageLoad(photo, e.currentTarget)}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 pointer-events-none" />
          </div>
        );
      })}
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
      className="fixed inset-0 z-50 bg-black/90"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-50 p-2 rounded-full bg-white/10 text-white/90 transition-colors hover:bg-white/20"
          aria-label="Close lightbox"
        >
          <X className="w-6 h-6" />
        </button>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
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
          className="absolute left-4 p-2 rounded-full bg-white/10 text-white/90 transition-colors hover:bg-white/20"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={onNext}
          className="absolute right-4 p-2 rounded-full bg-white/10 text-white/90 transition-colors hover:bg-white/20"
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
      <main className="min-h-screen bg-background-light dark:bg-background-dark">
        <div className="mx-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl mb-4">
              {photographyContent.title}
            </h1>
            <p className="max-w-prose text-lg font-light leading-relaxed text-gray-800 dark:text-gray-300">
              {photographyContent.description}
            </p>
          </div>

          <div className="max-w-[2000px] mx-auto pb-24">
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
