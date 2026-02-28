import { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { usePhotos } from "../context/PhotoContext";
import { FiHeart, FiMaximize2 } from "react-icons/fi";

export default function PhotoCard({ photo, onClick, index = 0 }) {
  const { nightMode } = useTheme();
  const { toggleFavorite, favorites } = usePhotos();
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const isFav = favorites.has(photo.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className={`group relative rounded-xl overflow-hidden cursor-pointer ${
        nightMode ? "bg-[#2D1810]" : "bg-white"
      } shadow-lg hover:shadow-xl transition-all duration-300`}
      onClick={() => onClick?.(photo)}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {!imgLoaded && (
          <div className={`absolute inset-0 shimmer ${
            nightMode ? "bg-warm-900/50" : "bg-warm-100"
          }`} />
        )}
        {imgError ? (
          <div className={`absolute inset-0 flex flex-col items-center justify-center ${
            nightMode ? "bg-warm-900/50 text-warm-400" : "bg-warm-100 text-warm-500"
          }`}>
            <span className="text-4xl mb-2">📸</span>
            <span className="text-xs font-hand">{photo.caption || "Memory"}</span>
          </div>
        ) : (
          <img
            src={photo.src}
            alt={photo.caption || "Family photo"}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${
              imgLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
            loading="lazy"
          />
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <p className="text-white text-sm font-medium line-clamp-2">
              {photo.caption}
            </p>
            <div className="flex items-center gap-2 mt-1">
              {photo.occasion && (
                <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full">
                  {photo.occasion}
                </span>
              )}
              {photo.year && (
                <span className="text-xs text-white/70">{photo.year}</span>
              )}
            </div>
          </div>
        </div>

        {/* Favorite button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(photo.id);
          }}
          className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-200 ${
            isFav
              ? "bg-rose-warm text-white shadow-lg"
              : "bg-black/20 text-white opacity-0 group-hover:opacity-100 hover:bg-rose-warm"
          }`}
        >
          <FiHeart size={14} fill={isFav ? "white" : "none"} />
        </button>

        {/* Mood indicator */}
        {photo.mood && (
          <span className={`absolute top-2 left-2 text-xs px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${
            nightMode ? "bg-warm-800/80 text-warm-200" : "bg-white/80 text-warm-700"
          }`}>
            {photo.mood}
          </span>
        )}
      </div>
    </motion.div>
  );
}
