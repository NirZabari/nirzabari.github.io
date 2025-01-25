import React from 'react';
import { Hero } from '../components/Hero';
import { PageTransition } from '../components/PageTransition';

export const Home: React.FC = () => {
  return (
    <PageTransition>
      <main className="flex flex-col">
        <Hero />
      </main>
    </PageTransition>
  );
};