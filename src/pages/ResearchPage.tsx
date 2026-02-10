import React, { useState, useEffect } from "react";
import { PageTransition } from "../components/PageTransition";
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
  youtube?: string;
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

const PublicationRow: React.FC<{ publication: Publication }> = ({
  publication,
}) => {
  const primaryLink = publication.url || publication.youtube;
  const hasLinks = Boolean(publication.url || publication.youtube);
  return (
    <article className="py-8 border-b border-gray-200 dark:border-gray-800 -mx-2 px-2 rounded-lg transition-colors hover:bg-gray-50/60 dark:hover:bg-white/5">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
        <div className="w-full sm:w-56 shrink-0">
          <a
            href={primaryLink || "#"}
            target={primaryLink ? "_blank" : undefined}
            rel={primaryLink ? "noopener noreferrer" : undefined}
            aria-label={primaryLink ? `Open ${publication.title}` : undefined}
            className={primaryLink ? "block" : "block pointer-events-none"}
          >
            <div className="w-full aspect-[16/10] rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-white/5">
              <img
                src={publication.image}
                alt={publication.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </div>
          </a>
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight">
            {primaryLink ? (
              <a
                href={primaryLink}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary-700 dark:hover:text-primary-400 transition-colors"
              >
                {publication.title}
              </a>
            ) : (
              publication.title
            )}
          </h3>

          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium text-gray-800 dark:text-gray-300">
              {publication.venue} {publication.year}
            </span>
            <span aria-hidden="true" className="text-gray-300 dark:text-gray-700">
              •
            </span>
            <span className="min-w-0">{formatAuthors(publication.authors)}</span>
          </div>

          <p className="mt-3 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
            {publication.summary}
          </p>
        </div>

        {hasLinks && (
          <div className="shrink-0 flex items-center gap-3 sm:pt-1">
            {publication.url && (
              <a
                href={publication.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
              >
                Paper
              </a>
            )}
            {publication.youtube && (
              <a
                href={publication.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
              >
                Video
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
};

export const ResearchPage: React.FC = () => {
  const [publications, setPublications] = useState<Publication[]>([]);

  useEffect(() => {
    setPublications(publicationsData.publications);
  }, []);

  return (
    <PageTransition>
      <main className="min-h-screen bg-background-light dark:bg-background-dark">
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
            <div className="divide-y divide-transparent">
              {publications.map((publication) => (
                <PublicationRow
                  key={publication.id}
                  publication={publication}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </PageTransition>
  );
};
