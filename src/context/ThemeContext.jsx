import { createContext, useContext, useState, useEffect } from "react";
import { isNightMode, getCurrentFestival } from "../data/musicData";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [nightMode, setNightMode] = useState(false);
  const [festival, setFestival] = useState(null);

  useEffect(() => {
    // Check time-based theme
    const checkTheme = () => {
      const night = isNightMode();
      setNightMode(night);
      if (night) {
        document.body.classList.add("night-mode");
      } else {
        document.body.classList.remove("night-mode");
      }

      const fest = getCurrentFestival();
      setFestival(fest);
    };

    checkTheme();
    const interval = setInterval(checkTheme, 60000); // check every minute
    return () => clearInterval(interval);
  }, []);

  const toggleNightMode = () => {
    setNightMode((prev) => {
      const next = !prev;
      if (next) document.body.classList.add("night-mode");
      else document.body.classList.remove("night-mode");
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ nightMode, festival, toggleNightMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
