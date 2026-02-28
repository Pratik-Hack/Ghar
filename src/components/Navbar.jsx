import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import {
  FiHome, FiUsers, FiImage, FiClock, FiHeart, FiUpload,
  FiMenu, FiX, FiSun, FiMoon, FiStar, FiMusic
} from "react-icons/fi";

const navLinks = [
  { to: "/", label: "Home", icon: FiHome },
  { to: "/family", label: "Family", icon: FiUsers },
  { to: "/gallery", label: "Gallery", icon: FiImage },
  { to: "/timeline", label: "Timeline", icon: FiClock },
  { to: "/favorites", label: "Favorites", icon: FiHeart },
  { to: "/upload", label: "Upload", icon: FiUpload },
  { to: "/songs", label: "Songs", icon: FiMusic },
  { to: "/surprise", label: "Surprise", icon: FiStar },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { nightMode, toggleNightMode, festival } = useTheme();

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        nightMode
          ? "bg-[#1A0F0A]/90 border-b border-amber-900/30"
          : "bg-white/80 border-b border-warm-200/50"
      } backdrop-blur-xl`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <motion.span
                className="text-3xl"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                🏠
              </motion.span>
              <span className={`font-display text-xl font-bold ${
                nightMode ? "text-warm-300" : "text-warm-800"
              }`}>
                Ghar
              </span>
              {festival && (
                <span className="text-sm animate-bounce">
                  {festival === "diwali" ? "🪔" : festival === "holi" ? "🎨" : "🪢"}
                </span>
              )}
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.to;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? nightMode
                          ? "bg-warm-700/30 text-warm-300"
                          : "bg-warm-100 text-warm-800"
                        : nightMode
                        ? "text-warm-400 hover:text-warm-200 hover:bg-warm-900/50"
                        : "text-warm-600 hover:text-warm-800 hover:bg-warm-50"
                    }`}
                  >
                    <Icon size={16} />
                    {link.label}
                  </Link>
                );
              })}

              {/* Night mode toggle */}
              <button
                onClick={toggleNightMode}
                className={`ml-2 p-2 rounded-full transition-all ${
                  nightMode
                    ? "bg-warm-800/50 text-yellow-400 hover:bg-warm-700/50"
                    : "bg-warm-100 text-warm-600 hover:bg-warm-200"
                }`}
              >
                {nightMode ? <FiSun size={18} /> : <FiMoon size={18} />}
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={toggleNightMode}
                className={`p-2 rounded-full ${
                  nightMode ? "text-yellow-400" : "text-warm-600"
                }`}
              >
                {nightMode ? <FiSun size={18} /> : <FiMoon size={18} />}
              </button>
              <button
                onClick={() => setOpen(!open)}
                className={`p-2 rounded-lg ${
                  nightMode ? "text-warm-300" : "text-warm-700"
                }`}
              >
                {open ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-16 left-0 right-0 z-40 md:hidden ${
              nightMode ? "bg-[#1A0F0A]/95" : "bg-white/95"
            } backdrop-blur-xl border-b ${
              nightMode ? "border-amber-900/30" : "border-warm-200"
            }`}
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.to;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all ${
                      isActive
                        ? nightMode
                          ? "bg-warm-800/40 text-warm-300"
                          : "bg-warm-100 text-warm-800"
                        : nightMode
                        ? "text-warm-400 hover:bg-warm-900/50"
                        : "text-warm-600 hover:bg-warm-50"
                    }`}
                  >
                    <Icon size={20} />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer */}
      <div className="h-16" />
    </>
  );
}
