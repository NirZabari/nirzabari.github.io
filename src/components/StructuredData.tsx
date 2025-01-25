import React from "react";
import { Helmet } from "react-helmet";

export const StructuredData: React.FC = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Nir Zabari",
    url: "https://nirzabari.github.io",
    image: "https://nirzabari.github.io/images/portraits/portrait_nir.png",
    sameAs: [
      "https://github.com/nirzabari",
      "https://www.linkedin.com/in/nirzabari/",
    ],
    jobTitle: "Computer Vision Researcher",
    worksFor: {
      "@type": "Organization",
      name: "Lightricks",
    },
    alumniOf: {
      "@type": "Organization",
      name: "Hebrew University",
    },
    knowsAbout: [
      "Computer Vision",
      "Machine Learning",
      "Generative Models",
      "Deep Learning",
      "Photography",
    ],
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};
