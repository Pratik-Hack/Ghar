import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { usePhotos } from "../context/PhotoContext";
import PhotoCard from "../components/PhotoCard";
import PhotoModal from "../components/PhotoModal";

export default function Favorites() {
  const { nightMode } = useTheme();
  const { photos, getFilteredPhotos } = usePhotos();
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const favoritePhotos = useMemo(() => {
    return getFilteredPhotos({ favoritesOnly: true });
  }, [getFilteredPhotos]);

  return (
    <div className="min-h-screen pb-28">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className={`font-display text-3xl font-bold mb-2 ${
            nightMode ? "text-warm-200" : "text-warm-900"
          }`}>
            Favorites & Moments Board
          </h1>
          <p className={`font-hand text-xl mb-8 ${nightMode ? "text-warm-400" : "text-warm-500"}`}>
            The moments closest to your heart
          </p>
        </motion.div>

        {favoritePhotos.length > 0 ? (
          <div className="masonry-grid">
            {favoritePhotos.map((photo, i) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="relative group"
              >
                <PhotoCard
                  photo={photo}
                  index={i}
                  onClick={setSelectedPhoto}
                />
                {/* Pinterest-style caption overlay */}
                {photo.caption && (
                  <div className={`mt-2 px-1 ${
                    nightMode ? "text-warm-400" : "text-warm-600"
                  }`}>
                    <p className="font-hand text-base line-clamp-2">{photo.caption}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {photo.members?.map((m) => (
                        <span key={m} className={`text-xs px-1.5 py-0.5 rounded-full ${
                          nightMode ? "bg-warm-800/50 text-warm-400" : "bg-warm-100 text-warm-500"
                        }`}>
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <span className="text-6xl block mb-4">💛</span>
            <p className={`text-lg ${nightMode ? "text-warm-400" : "text-warm-500"}`}>
              No favorites yet. Tap the heart on any photo to add it here!
            </p>
          </div>
        )}
      </div>

      {selectedPhoto && (
        <PhotoModal
          photo={selectedPhoto}
          photos={favoritePhotos}
          onClose={() => setSelectedPhoto(null)}
        />
      )}
    </div>
  );
}
