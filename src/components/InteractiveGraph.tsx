import React, { useEffect, useRef } from 'react';

interface InteractiveGraphProps {
  type: 'plotly' | 'observable';
  data?: string;
  url?: string;
}

export const InteractiveGraph: React.FC<InteractiveGraphProps> = ({ type, data, url }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (type === 'plotly' && containerRef.current) {
      // Dynamically load Plotly.js
      const script = document.createElement('script');
      script.src = 'https://cdn.plot.ly/plotly-2.27.0.min.js';
      script.onload = () => {
        if (containerRef.current && data) {
          try {
            const plotData = JSON.parse(data);
            (window as any).Plotly.newPlot(containerRef.current, plotData.data || [], plotData.layout || {}, {
              responsive: true,
              displayModeBar: true,
            });
          } catch (e) {
            console.error('Error rendering Plotly graph:', e);
          }
        } else if (containerRef.current && url) {
          // Load from URL
          fetch(url)
            .then((res) => res.json())
            .then((plotData) => {
              (window as any).Plotly.newPlot(containerRef.current!, plotData.data || [], plotData.layout || {}, {
                responsive: true,
                displayModeBar: true,
              });
            })
            .catch((e) => console.error('Error loading Plotly graph:', e));
        }
      };
      document.head.appendChild(script);

      return () => {
        // Cleanup
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
      };
    }
  }, [type, data, url]);

  if (type === 'observable') {
    return (
      <div className="interactive-graph observable-graph my-8 rounded-lg overflow-hidden shadow-lg bg-white dark:bg-gray-900">
        <iframe
          src={url}
          style={{ width: '100%', height: '600px', border: 0 }}
          allowFullScreen
          title="Observable Notebook"
        />
      </div>
    );
  }

  return <div ref={containerRef} className="interactive-graph plotly-graph my-8" style={{ minHeight: '400px' }} />;
};
