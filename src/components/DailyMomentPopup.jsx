import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { usePhotos } from "../context/PhotoContext";
import { getRandomQuote } from "../data/familyData";

const POPUP_KEY = "daily_moment_shown";

export default function DailyMomentPopup() {
  const { nightMode } = useTheme();
  const { getRandomPhoto } = usePhotos();
  const [show, setShow] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [quote, setQuote] = useState("");

  useEffect(() => {
    const today = new Date().toDateString();
    const lastShown = sessionStorage.getItem(POPUP_KEY);

    if (lastShown !== today) {
      const randomPhoto = getRandomPhoto();
      if (randomPhoto) {
        setPhoto(randomPhoto);
        setQuote(getRandomQuote());
        setShow(true);
        sessionStorage.setItem(POPUP_KEY, today);
      }
    }
  }, [getRandomPhoto]);

  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onClick={() => setShow(false)}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", damping: 20 }}
        className={`relative max-w-md w-full rounded-2xl overflow-hidden shadow-2xl ${
          nightMode ? "bg-[#2D1810]" : "bg-white"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Photo */}
        {photo && (
          <div className="relative h-56 overflow-hidden">
            <img
              src={photo.src}
              alt={photo.caption}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-3 left-4 right-4">
              <p className="text-white font-hand text-xl">{photo.caption}</p>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6 text-center">
          <h3 className={`font-display text-xl font-bold mb-2 ${
            nightMode ? "text-warm-200" : "text-warm-800"
          }`}>
            Today's Family Moment
          </h3>
          <p className={`font-hand text-lg italic ${
            nightMode ? "text-warm-400" : "text-warm-500"
          }`}>
            "{quote}"
          </p>
          <button
            onClick={() => setShow(false)}
            className="glow-btn mt-4 px-6 py-2 rounded-full text-sm"
          >
            Feel the Love
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
