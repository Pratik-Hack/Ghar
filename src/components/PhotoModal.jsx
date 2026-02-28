import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { usePhotos } from "../context/PhotoContext";
import { FiX, FiHeart, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useState } from "react";

export default function PhotoModal({ photo, photos, onClose }) {
  const { nightMode } = useTheme();
  const { toggleFavorite, favorites } = usePhotos();
  const [imgError, setImgError] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState(photo);

  if (!currentPhoto) return null;

  const isFav = favorites.has(currentPhoto.id);
  const currentIdx = photos?.findIndex((p) => p.id === currentPhoto.id) ?? -1;

  const goNext = () => {
    if (photos && currentIdx < photos.length - 1) {
      setCurrentPhoto(photos[currentIdx + 1]);
      setImgError(false);
    }
  };

  const goPrev = () => {
    if (photos && currentIdx > 0) {
      setCurrentPhoto(photos[currentIdx - 1]);
      setImgError(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

      {/* Content */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative max-w-4xl w-full max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white/80 hover:text-white p-2 z-10"
        >
          <FiX size={24} />
        </button>

        {/* Image */}
        <div className="relative flex-1 flex items-center justify-center rounded-xl overflow-hidden">
          {imgError ? (
            <div className="w-full h-96 flex flex-col items-center justify-center bg-warm-900/50 rounded-xl">
              <span className="text-6xl mb-4">📸</span>
              <p className="text-warm-300 font-hand text-xl">{currentPhoto.caption || "A beautiful memory"}</p>
            </div>
          ) : (
            <img
              src={currentPhoto.src}
              alt={currentPhoto.caption}
              className="max-w-full max-h-[70vh] object-contain rounded-xl"
              onError={() => setImgError(true)}
            />
          )}

          {/* Navigation arrows */}
          {photos && currentIdx > 0 && (
            <button
              onClick={goPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 text-white hover:bg-black/60 transition-all"
            >
              <FiChevronLeft size={24} />
            </button>
          )}
          {photos && currentIdx < photos.length - 1 && (
            <button
              onClick={goNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 text-white hover:bg-black/60 transition-all"
            >
              <FiChevronRight size={24} />
            </button>
          )}
        </div>

        {/* Info bar */}
        <div className={`mt-3 p-4 rounded-xl ${
          nightMode ? "bg-[#2D1810]/90" : "bg-white/90"
        } backdrop-blur-sm`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className={`font-hand text-xl ${
                nightMode ? "text-warm-200" : "text-warm-800"
              }`}>
                {currentPhoto.caption}
              </p>
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                {currentPhoto.occasion && (
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    nightMode ? "bg-warm-800/50 text-warm-300" : "bg-warm-100 text-warm-600"
                  }`}>
                    {currentPhoto.occasion}
                  </span>
                )}
                {currentPhoto.mood && (
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    nightMode ? "bg-warm-800/50 text-warm-300" : "bg-warm-100 text-warm-600"
                  }`}>
                    {currentPhoto.mood}
                  </span>
                )}
                {currentPhoto.year && (
                  <span className={`text-xs ${
                    nightMode ? "text-warm-500" : "text-warm-400"
                  }`}>
                    {currentPhoto.month}/{currentPhoto.year}
                  </span>
                )}
                {currentPhoto.members?.map((m) => (
                  <span key={m} className={`text-xs px-2 py-1 rounded-full ${
                    nightMode ? "bg-warm-800/50 text-warm-300" : "bg-warm-100 text-warm-600"
                  }`}>
                    {m}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={() => toggleFavorite(currentPhoto.id)}
              className={`p-2 rounded-full transition-all flex-shrink-0 ${
                isFav
                  ? "bg-rose-warm text-white"
                  : nightMode
                  ? "bg-warm-800/50 text-warm-400 hover:text-rose-warm"
                  : "bg-warm-100 text-warm-400 hover:text-rose-warm"
              }`}
            >
              <FiHeart size={20} fill={isFav ? "white" : "none"} />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
