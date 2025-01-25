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
import { Footer } from "./components/Footer";
import { initGA } from "./utils/analytics";
import { Analytics } from "./components/Analytics";

const GA_MEASUREMENT_ID = "G-9PY6R7HB79";

const AnimatedRoutes = () => {
  const location = useLocation();

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
    initGA(GA_MEASUREMENT_ID);
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
          {/* <Footer /> */}
        </div>
      </ThemeProvider>
    </Router>
  );
}
