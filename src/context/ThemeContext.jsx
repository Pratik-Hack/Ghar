import { createContext, useContext, useState, useEffect, useRef } from "react";
import { isNightMode, getCurrentFestival } from "../data/musicData";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [nightMode, setNightMode] = useState(() => {
    const saved = localStorage.getItem("ghar-nightMode");
    if (saved !== null) return saved === "true";
    return isNightMode();
  });
  const [festival, setFestival] = useState(null);
  const userToggled = useRef(localStorage.getItem("ghar-nightMode") !== null);

  useEffect(() => {
    // Apply on mount
    if (nightMode) document.body.classList.add("night-mode");
    else document.body.classList.remove("night-mode");
    setFestival(getCurrentFestival());

    // Only auto-switch if user hasn't manually toggled
    const interval = setInterval(() => {
      if (!userToggled.current) {
        const night = isNightMode();
        setNightMode(night);
        if (night) document.body.classList.add("night-mode");
        else document.body.classList.remove("night-mode");
      }
      setFestival(getCurrentFestival());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const toggleNightMode = () => {
    setNightMode((prev) => {
      const next = !prev;
      if (next) document.body.classList.add("night-mode");
      else document.body.classList.remove("night-mode");
      localStorage.setItem("ghar-nightMode", String(next));
      userToggled.current = true;
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
