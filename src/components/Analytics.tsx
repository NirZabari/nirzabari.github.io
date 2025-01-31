import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function Analytics() {
  const location = useLocation();

  useEffect(() => {
    // Log page view on route change
    if (typeof window.gtag !== "undefined" && window.GA_MEASUREMENT_ID) {
      window.gtag("event", "page_view", {
        page_path: location.pathname + location.search,
        page_title: document.title,
        page_location: window.location.href,
        send_to: window.GA_MEASUREMENT_ID,
      });
    }
  }, [location]);

  return null;
}
