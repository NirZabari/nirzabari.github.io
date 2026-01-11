import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ThemeProvider } from "./context/ThemeContext";
import { Navigation } from "./components/Navigation";
import { Home } from "./pages/Home";
import { ResearchPage } from "./pages/ResearchPage";
import { PhotographyPage } from "./pages/PhotographyPage";
import { AboutPage } from "./pages/AboutPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import ReactGA from "react-ga4";
import { Analytics } from "./components/Analytics";

const GA_MEASUREMENT_ID = "G-TJFXRCV9CW";

const AnimatedRoutes = () => {
  const location = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
    ReactGA.send({ hitType: "pageview", page: location.pathname });
  }, [location]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/research" element={<ResearchPage />} />
        <Route path="/photography" element={<PhotographyPage />} />
        <Route path="/personal" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AnimatePresence>
  );
};

export default function App() {
  React.useEffect(() => {
    ReactGA.initialize(GA_MEASUREMENT_ID);
  }, []);

  return (
    <Router>
      <ThemeProvider>
        <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark text-gray-900 dark:text-white transition-colors duration-200">
          <Analytics />
          <Navigation />
          <div className="flex-grow">
            <AnimatedRoutes />
          </div>
        </div>
      </ThemeProvider>
    </Router>
  );
}
