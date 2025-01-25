import React, { useState, useEffect } from "react";
import { PageTransition } from "../components/PageTransition";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import publicationsData from "../data/publications.json";
import { researchContent } from "../content/research";

interface Publication {
  id: string;
  title: string;
  summary: string;
  authors: string;
  venue: string;
  image: string;
  year: number;
  url?: string;
  tags?: string[];
}

const formatAuthors = (authors: string) => {
  return authors.split("**").map((part, index) =>
    index % 2 === 1 ? (
      <strong key={index} className="text-primary-700 dark:text-primary-400">
        {part}
      </strong>
    ) : (
      part
    )
  );
};

const PublicationCard: React.FC<{
  publication: Publication;
  index: number;
}> = ({ publication, index }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const handleClick = () => {
    if (publication.url) {
      window.open(publication.url, "_blank", "noopener noreferrer");
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white dark:bg-surface-dark rounded-xl shadow-lg dark:shadow-soft-dark transition-all duration-300 hover:shadow-xl border border-gray-100 dark:border-gray-800"
    >
      <div className="flex flex-col md:flex-row">
        <div
          className="md:w-1/3 h-48 md:h-auto relative cursor-pointer"
          onClick={handleClick}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 to-transparent mix-blend-overlay" />
          <img
            src={publication.image}
            alt={publication.title}
            className="absolute inset-0 w-full h-full object-contain rounded-t-xl md:rounded-l-xl md:rounded-tr-none transition-transform duration-300 hover:scale-105"
          />
        </div>
        <div className="flex-1 p-6 md:p-8">
          <div className="flex justify-between items-start gap-4">
            <h3
              onClick={handleClick}
              className={`text-xl font-semibold text-gray-900 dark:text-white transition-colors duration-300 ${
                publication.url
                  ? "hover:text-primary-700 dark:hover:text-primary-400 cursor-pointer"
                  : ""
              }`}
            >
              {publication.title}
            </h3>
          </div>
          <p className="mt-3 text-sm font-medium text-primary-700 dark:text-primary-400">
            {publication.venue} {publication.year}
          </p>
          <div className="mt-4">
            <p className="text-sm text-gray-800 dark:text-gray-300 leading-relaxed">
              {formatAuthors(publication.authors)}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const ResearchPage: React.FC = () => {
  const [publications, setPublications] = useState<Publication[]>([]);

  useEffect(() => {
    setPublications(publicationsData.publications);
  }, []);

  return (
    <PageTransition>
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-background-dark dark:to-background-dark">
        <div className="mx-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl mb-4">
              {researchContent.title}
            </h1>
            <p className="text-lg font-light leading-relaxed text-gray-800 dark:text-gray-300 whitespace-pre-line">
              {researchContent.description}
            </p>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
              Selected Publications
            </h2>
            <div className="space-y-6">
              {publications.map((publication, index) => (
                <PublicationCard
                  key={publication.id}
                  publication={publication}
                  index={index}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </PageTransition>
  );
};
