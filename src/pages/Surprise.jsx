import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { usePhotos } from "../context/PhotoContext";
import { useMusic } from "../context/MusicContext";
import { getRandomQuote, familyMembers } from "../data/familyData";
import { getAllSongs } from "../data/musicData";
import FamilyRoulette from "../components/FamilyRoulette";
import PhotoModal from "../components/PhotoModal";
import { FiRefreshCw, FiHeart, FiMusic, FiStar } from "react-icons/fi";

export default function Surprise() {
  const { nightMode } = useTheme();
  const { getRandomPhoto, photos } = usePhotos();
  const { playSong } = useMusic();
  const [surprise, setSurprise] = useState(null);
  const [showRoulette, setShowRoulette] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const generateSurprise = () => {
    const photo = getRandomPhoto();
    const allSongs = getAllSongs();
    const song = allSongs[Math.floor(Math.random() * allSongs.length)];
    const quote = getRandomQuote();

    setSurprise({ photo, song, quote });

    if (song) {
      playSong(song);
    }
  };

  return (
    <div className="min-h-screen pb-28">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`font-display text-3xl font-bold mb-2 text-center ${
            nightMode ? "text-warm-200" : "text-warm-900"
          }`}
        >
          Surprise Me!
        </motion.h1>
        <p className={`font-hand text-xl mb-8 text-center ${
          nightMode ? "text-warm-400" : "text-warm-500"
        }`}>
          Random memories, songs, and love
        </p>

        {/* Action buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={generateSurprise}
            className="glow-btn px-8 py-4 rounded-2xl text-lg font-bold flex items-center gap-3"
          >
            <FiStar size={22} />
            Random Memory + Song
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowRoulette(!showRoulette)}
            className={`px-8 py-4 rounded-2xl text-lg font-bold flex items-center gap-3 border-2 transition-all ${
              showRoulette
                ? "border-sunset bg-sunset/10 text-sunset"
                : nightMode
                ? "border-warm-600 text-warm-300 hover:bg-warm-800/30"
                : "border-warm-400 text-warm-700 hover:bg-warm-100"
            }`}
          >
            🎰 Family Roulette
          </motion.button>
        </div>

        {/* Surprise Result */}
        <AnimatePresence mode="wait">
          {surprise && !showRoulette && (
            <motion.div
              key={surprise.photo?.id || "surprise"}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              className={`max-w-lg mx-auto rounded-2xl overflow-hidden shadow-2xl ${
                nightMode ? "bg-[#2D1810]" : "bg-white"
              }`}
            >
              {/* Photo */}
              {surprise.photo && (
                <div
                  className="relative h-64 sm:h-80 cursor-pointer"
                  onClick={() => setSelectedPhoto(surprise.photo)}
                >
                  <img
                    src={surprise.photo.src}
                    alt={surprise.photo.caption}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  {surprise.photo.caption && (
                    <p className="absolute bottom-4 left-4 right-4 text-white font-hand text-xl">
                      {surprise.photo.caption}
                    </p>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="p-6">
                {/* Quote */}
                <p className={`font-hand text-xl italic text-center mb-4 ${
                  nightMode ? "text-warm-300" : "text-warm-600"
                }`}>
                  "{surprise.quote}"
                </p>

                {/* Song info */}
                {surprise.song && (
                  <div className={`flex items-center gap-3 p-3 rounded-xl ${
                    nightMode ? "bg-warm-800/30" : "bg-warm-50"
                  }`}>
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      nightMode ? "bg-warm-700/50" : "bg-warm-200"
                    }`}>
                      <FiMusic size={18} className={nightMode ? "text-warm-400" : "text-warm-600"} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`font-medium text-sm truncate ${
                        nightMode ? "text-warm-200" : "text-warm-800"
                      }`}>
                        Now Playing: {surprise.song.title}
                      </p>
                      <p className={`text-xs truncate ${
                        nightMode ? "text-warm-500" : "text-warm-400"
                      }`}>
                        {surprise.song.movie} &bull; {surprise.song.artist}
                      </p>
                    </div>
                  </div>
                )}

                {/* Regenerate */}
                <button
                  onClick={generateSurprise}
                  className={`mt-4 w-full py-2 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-all ${
                    nightMode
                      ? "bg-warm-800/50 text-warm-300 hover:bg-warm-700/50"
                      : "bg-warm-50 text-warm-600 hover:bg-warm-100"
                  }`}
                >
                  <FiRefreshCw size={14} />
                  Another Surprise!
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Family Roulette */}
        {showRoulette && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <FamilyRoulette />
          </motion.div>
        )}
      </div>

      {selectedPhoto && (
        <PhotoModal
          photo={selectedPhoto}
          photos={photos}
          onClose={() => setSelectedPhoto(null)}
        />
      )}
    </div>
  );
}
